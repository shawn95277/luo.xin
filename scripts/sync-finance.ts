import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

const NOTES_DIR =
  process.env.FINANCE_NOTES_DIR ?? "/Users/dumpling/Notes/finance-obsidian";

async function readMarkdownDocs(dir: string) {
  let files: string[];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }
  return Promise.all(
    files
      .filter((f) => f.endsWith(".md"))
      .map(async (f) => {
        const raw = await fs.readFile(path.join(dir, f), "utf-8");
        const { data, content } = matter(raw);
        return { filename: f, data, content };
      })
  );
}

function arr(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (v == null) return [];
  return [String(v)];
}

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function dateStr(v: unknown): string | null {
  if (v == null || v === "") return null;
  if (v instanceof Date) {
    const y = v.getFullYear();
    const m = String(v.getMonth() + 1).padStart(2, "0");
    const d = String(v.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  const s = String(v).trim();
  const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : null;
}

function extractSection(body: string, heading: string): string {
  const re = new RegExp(
    `##\\s+${heading}\\s*\\n+([\\s\\S]*?)(?=\\n##\\s|\\n#\\s|$)`
  );
  const m = body.match(re);
  return m ? m[1].trim() : "";
}

function extractList(body: string, heading: string): string[] {
  const section = extractSection(body, heading);
  if (!section) return [];
  return section
    .split("\n")
    .map((l) => l.replace(/^\s*[-*]\s*/, "").trim())
    .filter((l) => l.length > 0);
}

type ValidationError = { file: string; field: string; message: string };

function validateLinks(filename: string, rawLinks: unknown[]): ValidationError[] {
  const errs: ValidationError[] = [];
  for (const [i, raw] of rawLinks.entries()) {
    const s = String(raw);
    const parts = s.split("|").map((x) => x.trim());
    const label = parts[0] ?? "";
    const url = parts[2] ?? "";
    if (!url) {
      errs.push({
        file: filename,
        field: `links[${i}]`,
        message: `「${label}」缺 URL。补上 URL，或改成 "${parts[0]} | ${parts[1] ?? ""} | —" 显式声明无外链。`,
      });
    }
  }
  return errs;
}

function validateMetrics(filename: string, raw: unknown[]): ValidationError[] {
  const errs: ValidationError[] = [];
  for (const [i, v] of raw.entries()) {
    const parts = String(v).split("|").map((x) => x.trim());
    if (!parts[0] || !parts[1]) {
      errs.push({
        file: filename,
        field: `metrics[${i}]`,
        message: `期望 "标签 | 值"，当前 "${v}"`,
      });
    }
  }
  return errs;
}

function validateLevels(filename: string, raw: unknown[]): ValidationError[] {
  const errs: ValidationError[] = [];
  for (const [i, v] of raw.entries()) {
    const parts = String(v).split("|").map((x) => x.trim());
    if (!parts[0] || !parts[1] || !parts[2]) {
      errs.push({
        file: filename,
        field: `levels[${i}]`,
        message: `期望 "标签 | 价位 | 上方/下方"，当前 "${v}"`,
      });
      continue;
    }
    if (parts[2] !== "上方" && parts[2] !== "下方") {
      errs.push({
        file: filename,
        field: `levels[${i}]`,
        message: `第 3 段必须是 "上方" 或 "下方"，当前 "${parts[2]}"`,
      });
    }
  }
  return errs;
}

function validateTomorrowFocus(
  filename: string,
  raw: unknown[]
): ValidationError[] {
  const errs: ValidationError[] = [];
  for (const [i, v] of raw.entries()) {
    const parts = String(v).split("|").map((x) => x.trim());
    if (!parts[0] || !parts[1] || !parts[2]) {
      errs.push({
        file: filename,
        field: `tomorrow_focus[${i}]`,
        message: `期望 "股票代码 | 关注原因 | 触发条件"，当前 "${v}"`,
      });
    }
  }
  return errs;
}

function validatePeers(filename: string, raw: unknown[]): ValidationError[] {
  const errs: ValidationError[] = [];
  for (const [i, v] of raw.entries()) {
    const parts = String(v).split("|").map((x) => x.trim());
    if (!parts[0] || !parts[1] || !parts[2] || !parts[3]) {
      errs.push({
        file: filename,
        field: `peers[${i}]`,
        message: `期望 "股票代码 | 名称 | 关系 | 观察用途"，当前 "${v}"`,
      });
    }
  }
  return errs;
}

function normalizeLinks(rawLinks: unknown[]): string[] {
  // 把 "—" / "none" 归一成空字符串，DB 端只存 URL 或空
  return rawLinks.map((raw) => {
    const s = String(raw);
    const parts = s.split("|").map((x) => x.trim());
    const url = (parts[2] ?? "").toLowerCase();
    if (url === "—" || url === "none" || url === "-") {
      return `${parts[0] ?? ""} | ${parts[1] ?? ""} | `;
    }
    return s;
  });
}

async function syncEntities(sql: ReturnType<typeof neon<false, false>>) {
  await sql`ALTER TABLE entities ADD COLUMN IF NOT EXISTS peers TEXT[] NOT NULL DEFAULT '{}'`;

  const docs = await readMarkdownDocs(path.join(NOTES_DIR, "wiki/entities"));
  let n = 0;
  for (const { data } of docs) {
    if (data.type !== "stock") continue;
    const ticker = String(data.ticker ?? "").trim();
    if (!ticker) continue;
    await sql`
      INSERT INTO entities (
        ticker, name, exchange, status,
        price, change_pct, pe_ttm, pct,
        upper_bound, lower_bound,
        thesis, peers, catalysts, risks, metrics, levels, links,
        updated_at
      ) VALUES (
        ${ticker}, ${String(data.title ?? ticker)}, ${data.exchange ?? null}, ${String(data.status ?? "观察")},
        ${num(data.price)}, ${data.change ?? null}, ${num(data.pe_ttm)}, ${num(data.pct)},
        ${num(data.upper)}, ${num(data.lower)},
        ${String(data.thesis ?? "").trim()},
        ${arr(data.peers)},
        ${arr(data.catalysts)}, ${arr(data.risks)}, ${arr(data.metrics)}, ${arr(data.levels)}, ${normalizeLinks(arr(data.links))},
        ${dateStr(data.updated)}
      )
      ON CONFLICT (ticker) DO UPDATE SET
        name = EXCLUDED.name,
        exchange = EXCLUDED.exchange,
        status = EXCLUDED.status,
        price = EXCLUDED.price,
        change_pct = EXCLUDED.change_pct,
        pe_ttm = EXCLUDED.pe_ttm,
        pct = EXCLUDED.pct,
        upper_bound = EXCLUDED.upper_bound,
        lower_bound = EXCLUDED.lower_bound,
        thesis = EXCLUDED.thesis,
        peers = EXCLUDED.peers,
        catalysts = EXCLUDED.catalysts,
        risks = EXCLUDED.risks,
        metrics = EXCLUDED.metrics,
        levels = EXCLUDED.levels,
        links = EXCLUDED.links,
        updated_at = EXCLUDED.updated_at
    `;
    n++;
  }
  return n;
}

async function syncReviews(sql: ReturnType<typeof neon<false, false>>) {
  const docs = await readMarkdownDocs(path.join(NOTES_DIR, "wiki/reviews"));
  let n = 0;
  for (const { data, content } of docs) {
    if (data.type !== "review") continue;
    const date = dateStr(data.date);
    if (!date) continue;
    const summary = extractSection(content, "Summary");
    const highlights = extractList(content, "Highlights");
    const bodyNotes = extractSection(content, "Notes");
    const bodyTomorrow = extractSection(content, "Tomorrow");
    await sql`
      INSERT INTO reviews (
        date, weekday, title, summary,
        highlights, tickers, tags,
        action_type, action_desc, position_change, mood,
        verification_expected, verification_actual, verification_verdict,
        tomorrow_focus, body_notes, body_tomorrow
      ) VALUES (
        ${date}, ${data.weekday ?? null}, ${String(data.title ?? "")}, ${summary},
        ${highlights}, ${arr(data.tickers)}, ${arr(data.tags)},
        ${String(data.action_type ?? "none")}, ${data.action_desc ?? null}, ${data.position_change != null ? String(data.position_change) : null}, ${data.mood ?? null},
        ${data.verification_expected ?? null}, ${data.verification_actual ?? null}, ${String(data.verification_verdict ?? "pending")},
        ${arr(data.tomorrow_focus)}, ${bodyNotes || null}, ${bodyTomorrow || null}
      )
      ON CONFLICT (date) DO UPDATE SET
        weekday = EXCLUDED.weekday,
        title = EXCLUDED.title,
        summary = EXCLUDED.summary,
        highlights = EXCLUDED.highlights,
        tickers = EXCLUDED.tickers,
        tags = EXCLUDED.tags,
        action_type = EXCLUDED.action_type,
        action_desc = EXCLUDED.action_desc,
        position_change = EXCLUDED.position_change,
        mood = EXCLUDED.mood,
        verification_expected = EXCLUDED.verification_expected,
        verification_actual = EXCLUDED.verification_actual,
        verification_verdict = EXCLUDED.verification_verdict,
        tomorrow_focus = EXCLUDED.tomorrow_focus,
        body_notes = EXCLUDED.body_notes,
        body_tomorrow = EXCLUDED.body_tomorrow
    `;
    n++;
  }
  return n;
}

async function validateAll(): Promise<ValidationError[]> {
  const errs: ValidationError[] = [];
  const entityDocs = await readMarkdownDocs(path.join(NOTES_DIR, "wiki/entities"));
  for (const { filename, data } of entityDocs) {
    if (data.type !== "stock") continue;
    if (!String(data.ticker ?? "").trim()) continue;
    errs.push(...validateLinks(filename, arr(data.links)));
    errs.push(...validateMetrics(filename, arr(data.metrics)));
    errs.push(...validateLevels(filename, arr(data.levels)));
    errs.push(...validatePeers(filename, arr(data.peers)));
  }
  const reviewDocs = await readMarkdownDocs(path.join(NOTES_DIR, "wiki/reviews"));
  for (const { filename, data } of reviewDocs) {
    if (data.type !== "review") continue;
    if (!dateStr(data.date)) continue;
    errs.push(...validateTomorrowFocus(filename, arr(data.tomorrow_focus)));
  }
  return errs;
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL 未设置");
    process.exit(1);
  }

  const errors = await validateAll();
  if (errors.length > 0) {
    console.error("✗ sync 校验失败：");
    for (const e of errors) {
      console.error(`  ${e.file} · ${e.field}: ${e.message}`);
    }
    process.exit(1);
  }

  const sql = neon(url);
  const e = await syncEntities(sql);
  const r = await syncReviews(sql);
  console.log(`✓ synced ${e} entities, ${r} reviews from ${NOTES_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
