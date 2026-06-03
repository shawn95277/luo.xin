import { neon } from "@neondatabase/serverless";

export type Trend = "up" | "down" | "flat";
export type ActionType = "none" | "buy" | "sell" | "add" | "trim";
export type Verdict = "correct" | "wrong" | "partial" | "pending";
export type Status = "持仓" | "重点" | "观察" | "已平";

export type ReviewEntry = {
  date: string;
  weekday: string;
  title: string;
  summary: string;
  highlights: string[];
  tickers: string[];
  tags: string[];
  action_type: ActionType;
  action_desc: string;
  position_change: string;
  mood: string;
  verification_expected: string;
  verification_actual: string;
  verification_verdict: Verdict;
  tomorrow_focus: string[];
  body_notes: string;
  body_tomorrow: string;
};

export type WatchlistRow = {
  code: string;
  name: string;
  price: string;
  change: string;
  trend: Trend;
  peTtm: string;
  pct: number;
  upper: string;
  lower: string;
  status: Status;
  updated: string;
  note: string;
};

export type Entity = {
  code: string;
  name: string;
  price: string;
  change: string;
  trend: Trend;
  status: Status;
  thesis: string;
  peers: Peer[];
  metrics: { label: string; value: string }[];
  levels: { label: string; value: string; type: "上方" | "下方" }[];
  catalysts: string[];
  risks: string[];
  links: { label: string; date: string; url: string }[];
};

export type Peer = {
  code: string;
  name: string;
  relation: string;
  note: string;
};

export type Focus = {
  code: string;
  reason: string;
  trigger: string;
};

export function parseFocus(s: string): Focus {
  const [code = "", reason = "", trigger = ""] = s.split("|").map((x) => x.trim());
  return { code, reason, trigger };
}

function parsePipe2(s: string): { label: string; value: string } {
  const [label = "", value = ""] = s.split("|").map((x) => x.trim());
  return { label, value };
}

function parsePipePeer(s: string): Peer {
  const [code = "", name = "", relation = "", note = ""] = s
    .split("|")
    .map((x) => x.trim());
  return { code, name, relation, note };
}

function parsePipeLevel(s: string): {
  label: string;
  value: string;
  type: "上方" | "下方";
} {
  const [label = "", value = "", type = "上方"] = s
    .split("|")
    .map((x) => x.trim());
  const t = type === "下方" ? "下方" : "上方";
  return { label, value, type: t };
}

function trendFromChange(change: string): Trend {
  if (!change) return "flat";
  if (change.startsWith("+")) return "up";
  if (change.startsWith("-")) return "down";
  return "flat";
}

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL 未设置");
  return neon(url);
}

function fmtDate(v: unknown): string {
  if (v instanceof Date) {
    const y = v.getUTCFullYear();
    const m = String(v.getUTCMonth() + 1).padStart(2, "0");
    const d = String(v.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  if (typeof v === "string") return v.slice(0, 10);
  return "";
}

function statusOrder(a: WatchlistRow, b: WatchlistRow) {
  const order: Record<Status, number> = { 重点: 0, 持仓: 1, 观察: 2, 已平: 3 };
  return order[a.status] - order[b.status];
}

export async function loadReviews(): Promise<ReviewEntry[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT date::text AS date, weekday, title, summary,
           highlights, tickers, tags,
           action_type, action_desc, position_change, mood,
           verification_expected, verification_actual, verification_verdict,
           tomorrow_focus, body_notes, body_tomorrow
    FROM reviews ORDER BY date DESC
  `) as Record<string, unknown>[];
  return rows.map((row) => ({
    date: fmtDate(row.date),
    weekday: (row.weekday as string) ?? "",
    title: (row.title as string) ?? "",
    summary: (row.summary as string) ?? "",
    highlights: (row.highlights as string[]) ?? [],
    tickers: (row.tickers as string[]) ?? [],
    tags: (row.tags as string[]) ?? [],
    action_type: ((row.action_type as ActionType) ?? "none") as ActionType,
    action_desc: (row.action_desc as string) ?? "",
    position_change: (row.position_change as string) ?? "0",
    mood: (row.mood as string) ?? "",
    verification_expected: (row.verification_expected as string) ?? "",
    verification_actual: (row.verification_actual as string) ?? "",
    verification_verdict:
      ((row.verification_verdict as Verdict) ?? "pending") as Verdict,
    tomorrow_focus: (row.tomorrow_focus as string[]) ?? [],
    body_notes: (row.body_notes as string) ?? "",
    body_tomorrow: (row.body_tomorrow as string) ?? "",
  }));
}

export async function loadEntities(): Promise<Record<string, Entity>> {
  const sql = getSql();
  const rows = (await sql`
    SELECT ticker, name, exchange, status,
           price, change_pct, pe_ttm, pct,
           upper_bound, lower_bound,
           thesis, peers, catalysts, risks, metrics, levels, links,
           updated_at::text AS updated_at
    FROM entities
  `) as Record<string, unknown>[];
  const out: Record<string, Entity> = {};
  for (const row of rows) {
    const code = String(row.ticker);
    const change = (row.change_pct as string) ?? "";
    out[code] = {
      code,
      name: (row.name as string) ?? code,
      price: row.price != null ? String(row.price) : "—",
      change,
      trend: trendFromChange(change),
      status: ((row.status as Status) ?? "观察") as Status,
      thesis: ((row.thesis as string) ?? "").trim(),
      peers: ((row.peers as string[]) ?? []).map(parsePipePeer),
      metrics: ((row.metrics as string[]) ?? []).map(parsePipe2),
      levels: ((row.levels as string[]) ?? []).map(parsePipeLevel),
      catalysts: (row.catalysts as string[]) ?? [],
      risks: (row.risks as string[]) ?? [],
      links: ((row.links as string[]) ?? []).map((s) => {
        const [label = "", date = "", url = ""] = s
          .split("|")
          .map((x) => x.trim());
        return { label, date, url };
      }),
    };
  }
  return out;
}

export async function loadWatchlist(): Promise<WatchlistRow[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT ticker, name, exchange, status,
           price, change_pct, pe_ttm, pct,
           upper_bound, lower_bound,
           thesis,
           updated_at::text AS updated_at
    FROM entities
  `) as Record<string, unknown>[];
  const out: WatchlistRow[] = [];
  for (const row of rows) {
    const code = String(row.ticker);
    const change = (row.change_pct as string) ?? "";
    const pe = row.pe_ttm == null ? "—" : `${row.pe_ttm}x`;
    const upperVal = row.upper_bound;
    const lowerVal = row.lower_bound;
    out.push({
      code,
      name: (row.name as string) ?? code,
      price: row.price != null ? String(row.price) : "—",
      change,
      trend: trendFromChange(change),
      peTtm: pe,
      pct: Number(row.pct ?? 0),
      upper: upperVal != null ? String(upperVal) : "—",
      lower: lowerVal != null ? String(lowerVal) : "—",
      status: ((row.status as Status) ?? "观察") as Status,
      updated: fmtDate(row.updated_at),
      note: ((row.thesis as string) ?? "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 40),
    });
  }
  return out.sort(statusOrder);
}

export async function loadAll() {
  const [reviews, entities, watchlist] = await Promise.all([
    loadReviews(),
    loadEntities(),
    loadWatchlist(),
  ]);
  const nameMap = new Map<string, string>();
  for (const e of Object.values(entities)) nameMap.set(e.code, e.name);
  for (const r of reviews) for (const c of r.tickers) {
    if (!nameMap.has(c)) nameMap.set(c, c);
  }
  for (const w of watchlist) if (!nameMap.has(w.code)) nameMap.set(w.code, w.name);
  return {
    reviews,
    entities,
    watchlist,
    codeToName: (code: string) => nameMap.get(code) ?? code,
  };
}
