import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Check,
  CircleSlash,
  ExternalLink,
  FileText,
  HelpCircle,
  TrendingUp,
  X,
} from "lucide-react";
import {
  loadAll,
  parseFocus,
  type Trend,
  type Status,
  type ActionType,
  type Verdict,
} from "../_data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const { entities } = await loadAll();
  const e = entities[code];
  if (!e) return { title: "未找到 · luo.xin" };
  return {
    title: `${e.name} (${e.code}) · 盘后笔记`,
  };
}

export default async function EntityPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const { entities, reviews, watchlist } = await loadAll();
  const entity = entities[code];
  if (!entity) notFound();

  const relatedReviews = reviews.filter(
    (r) =>
      r.tickers.includes(code) ||
      r.tomorrow_focus.some((s) => parseFocus(s).code === code) ||
      r.tags.includes(entity.name)
  );
  const wl = watchlist.find((w) => w.code === code);

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <Link
          href="/finance"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          盘后笔记
        </Link>

        <header className="mt-12">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            个股研究
          </div>
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <h1 className="font-serif text-5xl font-medium leading-none tracking-tight">
                {entity.name}
              </h1>
              <div className="mt-3 font-mono text-sm text-muted-foreground tabular-nums">
                {entity.code}
              </div>
            </div>
            <StatusBadge status={entity.status} large />
          </div>

          <div className="mt-8 flex items-end justify-between gap-6 border-t border-border pt-6">
            <div>
              <Eyebrow>现价</Eyebrow>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="font-mono text-5xl font-medium tabular-nums">
                  {entity.price}
                </span>
                <span
                  className={`font-mono text-base font-medium tabular-nums ${trendColor(entity.trend)}`}
                >
                  {entity.change || "—"}
                </span>
              </div>
            </div>
            {wl?.updated && (
              <div className="text-right">
                <Eyebrow>更新</Eyebrow>
                <div className="mt-1 font-mono text-sm text-muted-foreground tabular-nums">
                  {wl.updated}
                </div>
              </div>
            )}
          </div>

          <p className="mt-8 font-serif text-lg leading-relaxed italic text-foreground/90">
            {entity.thesis}
          </p>
        </header>

        {entity.levels.length > 0 && (
          <section className="mt-16">
            <Eyebrow>关键价位</Eyebrow>
            <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight">
              加减仓触发线
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {entity.levels.map((lv) => (
                <div
                  key={lv.value}
                  className={`rounded-2xl border p-5 ${
                    lv.type === "上方"
                      ? "border-emerald-500/30 bg-emerald-500/[0.04]"
                      : "border-rose-500/30 bg-rose-500/[0.04]"
                  }`}
                >
                  <Eyebrow>{lv.label}</Eyebrow>
                  <div
                    className={`mt-2 font-mono text-3xl font-medium tabular-nums ${
                      lv.type === "上方"
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-rose-700 dark:text-rose-400"
                    }`}
                  >
                    {lv.type === "上方" ? "↑" : "↓"} {lv.value}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-16">
          <Eyebrow>关键指标</Eyebrow>
          <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight">
            估值与基本面
          </h2>
          <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-border py-6 sm:grid-cols-3">
            {entity.metrics.map((m) => (
              <div key={m.label}>
                <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {m.label}
                </dt>
                <dd className="mt-1.5 font-mono text-xl font-semibold tabular-nums">
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {entity.peers.length > 0 && (
          <section className="mt-16">
            <Eyebrow>竞品与同业</Eyebrow>
            <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight">
              可比标的
            </h2>
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {entity.peers.map((peer) => {
                const peerEntity = entities[peer.code];
                const inner = (
                  <>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="font-serif text-lg font-medium">
                          {peer.name}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground tabular-nums">
                          {peer.code}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {peer.relation}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {peer.note}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 text-right">
                      {peerEntity ? (
                        <>
                          <div className="hidden sm:block">
                            <div className="font-mono text-sm font-semibold tabular-nums">
                              {peerEntity.price}
                            </div>
                            <div
                              className={`mt-0.5 font-mono text-xs tabular-nums ${trendColor(peerEntity.trend)}`}
                            >
                              {peerEntity.change || "—"}
                            </div>
                          </div>
                          <ArrowUpRight className="size-4 text-muted-foreground" />
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          待建档
                        </span>
                      )}
                    </div>
                  </>
                );
                return (
                  <li key={peer.code}>
                    {peerEntity ? (
                      <Link
                        href={`/finance/${peer.code}`}
                        className="flex items-center justify-between gap-4 py-4 transition-colors hover:text-foreground"
                      >
                        {inner}
                      </Link>
                    ) : (
                      <div className="flex items-center justify-between gap-4 py-4">
                        {inner}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <section className="mt-16 grid gap-8 sm:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <TrendingUp className="size-4" />
              <Eyebrow>催化剂</Eyebrow>
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed">
              {entity.catalysts.map((c, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-2 size-1 shrink-0 rounded-full bg-emerald-500"
                  />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
              <ArrowDownRight className="size-4" />
              <Eyebrow>风险点</Eyebrow>
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed">
              {entity.risks.map((c, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-2 size-1 shrink-0 rounded-full bg-rose-500"
                  />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {relatedReviews.length > 0 && (
          <section className="mt-16">
            <Eyebrow>相关复盘</Eyebrow>
            <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight">
              历史足迹
              <span className="ml-3 font-sans text-sm font-normal text-muted-foreground">
                共 {relatedReviews.length} 条
              </span>
            </h2>
            <ol className="mt-6 divide-y divide-border border-y border-border">
              {relatedReviews.map((r) => (
                <li key={r.date}>
                  <article className="flex items-start gap-6 py-5">
                    <div className="w-20 shrink-0">
                      <div className="font-mono text-sm font-semibold tabular-nums">
                        {r.date.slice(5)}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {r.weekday}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif text-lg font-medium leading-snug">
                        {r.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {r.summary}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                        <ActionInline
                          type={r.action_type}
                          positionChange={r.position_change}
                        />
                        {r.verification_verdict !== "pending" && (
                          <VerdictPill verdict={r.verification_verdict} />
                        )}
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          </section>
        )}

        {entity.links.length > 0 && (
          <section className="mt-16">
            <Eyebrow>相关公告</Eyebrow>
            <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight">
              原始资料
            </h2>
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {entity.links.map((l) => {
                const inner = (
                  <>
                    <div className="flex min-w-0 items-center gap-3">
                      <FileText className="size-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">{l.label}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="font-mono text-xs text-muted-foreground tabular-nums">
                        {l.date}
                      </span>
                      {l.url && (
                        <ExternalLink className="size-3.5 text-muted-foreground" />
                      )}
                    </div>
                  </>
                );
                return (
                  <li key={l.label}>
                    {l.url ? (
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 py-3.5 text-sm transition-colors hover:text-foreground"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="flex items-center justify-between gap-3 py-3.5 text-sm text-muted-foreground">
                        {inner}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <footer className="mt-24 border-t border-border pt-8 text-xs text-muted-foreground">
          frontmatter 数据来自 [[{entity.name}]] · Neon Postgres
        </footer>
      </div>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </div>
  );
}

function ActionInline({
  type,
  positionChange,
}: {
  type: ActionType;
  positionChange: string;
}) {
  const map: Record<ActionType, { label: string; cls: string }> = {
    buy: { label: "买入", cls: "text-emerald-700 dark:text-emerald-400" },
    add: { label: "加仓", cls: "text-emerald-700 dark:text-emerald-400" },
    sell: { label: "卖出", cls: "text-rose-700 dark:text-rose-400" },
    trim: { label: "减仓", cls: "text-rose-700 dark:text-rose-400" },
    none: { label: "无操作", cls: "text-muted-foreground" },
  };
  const m = map[type];
  const showQty = type !== "none" && positionChange && positionChange !== "0";
  return (
    <span className={`font-medium ${m.cls}`}>
      {m.label}
      {showQty && (
        <span className="ml-1 font-mono tabular-nums">{positionChange}</span>
      )}
    </span>
  );
}

function VerdictPill({ verdict }: { verdict: Verdict }) {
  const map: Record<Verdict, { label: string; cls: string; Icon: typeof Check }> = {
    correct: {
      label: "应验",
      cls: "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10",
      Icon: Check,
    },
    wrong: {
      label: "落空",
      cls: "text-rose-700 dark:text-rose-400 bg-rose-500/10",
      Icon: X,
    },
    partial: {
      label: "部分",
      cls: "text-amber-700 dark:text-amber-400 bg-amber-500/10",
      Icon: HelpCircle,
    },
    pending: {
      label: "待验证",
      cls: "text-muted-foreground bg-muted",
      Icon: CircleSlash,
    },
  };
  const m = map[verdict];
  const Icon = m.Icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium ${m.cls}`}
    >
      <Icon className="size-3" />
      {m.label}
    </span>
  );
}

function StatusBadge({ status, large }: { status: Status; large?: boolean }) {
  const map: Record<Status, string> = {
    重点: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    持仓: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
    观察: "bg-muted text-muted-foreground",
    已平: "bg-muted/60 text-muted-foreground line-through",
  };
  const size = large
    ? "px-3 py-1 text-xs"
    : "px-2 py-0.5 text-[10px]";
  return (
    <span
      className={`inline-block rounded-full font-medium uppercase tracking-wider ${size} ${map[status]}`}
    >
      {status}
    </span>
  );
}

function trendColor(trend: Trend) {
  if (trend === "up") return "text-emerald-600 dark:text-emerald-400";
  if (trend === "down") return "text-rose-600 dark:text-rose-400";
  return "text-muted-foreground";
}
