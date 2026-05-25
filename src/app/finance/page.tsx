import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleSlash,
  HelpCircle,
  Sparkles,
  X,
} from "lucide-react";
import {
  loadAll,
  parseFocus,
  type ReviewEntry,
  type Status,
  type Trend,
  type ActionType,
  type Verdict,
  type Entity,
} from "./_data";

export const metadata = {
  title: "盘后笔记 · luo.xin",
  description: "个人 A 股研究、复盘与观察池",
};

export const dynamic = "force-dynamic";

export default async function FinancePage() {
  const { reviews, watchlist, entities, codeToName } = await loadAll();
  const latest = reviews[0];
  const previous = reviews.slice(1);
  const focusCount = watchlist.filter(
    (w) => w.status === "重点" || w.status === "持仓"
  ).length;
  const todayFocusCount = latest?.tomorrow_focus.length ?? 0;

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          返回
        </Link>

        <header className="mt-12">
          <div className="flex items-baseline justify-between gap-4 border-b border-border pb-6">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Finance · Journal
              </div>
              <h1 className="mt-2 font-serif text-5xl font-medium leading-none tracking-tight">
                盘后笔记
              </h1>
            </div>
            <div className="hidden text-right text-xs text-muted-foreground sm:block">
              <div className="font-mono tabular-nums">
                {latest?.date ?? "—"}
              </div>
              <div className="mt-1">{latest?.weekday ?? ""}</div>
            </div>
          </div>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            个人 A 股研究、复盘与观察池。
            <span className="font-serif italic text-foreground/80">
              先看到、再下注。
            </span>
          </p>

          <dl className="mt-8 grid grid-cols-3 gap-x-8 gap-y-2 border-y border-border py-5">
            <DashStat label="复盘条数" value={String(reviews.length)} />
            <DashStat label="重点 / 持仓" value={String(focusCount)} />
            <DashStat label="今日关注" value={String(todayFocusCount)} />
          </dl>
        </header>

        {latest ? (
          <HeroReview
            review={latest}
            entities={entities}
            codeToName={codeToName}
          />
        ) : (
          <EmptyState text="还没有复盘。在 wiki/reviews/ 用 review 模板新建第一条，然后 pnpm sync。" />
        )}

        {watchlist.length > 0 && (
          <section className="mt-20">
            <Eyebrow>持续跟踪</Eyebrow>
            <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight">
              观察池
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {watchlist.length} 只标的 · 按优先级排序
            </p>

            <div className="mt-8 space-y-4">
              {watchlist.map((row) => (
                <WatchlistCard
                  key={row.code}
                  row={row}
                  hasEntity={!!entities[row.code]}
                />
              ))}
            </div>
          </section>
        )}

        {previous.length > 0 && (
          <section className="mt-20">
            <Eyebrow>历史复盘</Eyebrow>
            <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight">
              过往笔记
            </h2>

            <ol className="mt-8 divide-y divide-border border-y border-border">
              {previous.map((r) => (
                <li key={r.date}>
                  <article className="group flex items-start gap-6 py-5">
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
                      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                        {r.summary}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                        {r.tickers.map((c) => (
                          <span
                            key={c}
                            className="text-muted-foreground"
                          >
                            {codeToName(c)}
                          </span>
                        ))}
                        {r.verification_verdict !== "pending" && (
                          <VerdictPill verdict={r.verification_verdict} />
                        )}
                        {r.action_type !== "none" && (
                          <span className="text-muted-foreground">
                            · 有操作
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          </section>
        )}

        <footer className="mt-24 border-t border-border pt-8 text-xs text-muted-foreground">
          <p>
            数据接入 finance-obsidian 笔记 · Neon Postgres ·
            每次访问实时查询
          </p>
        </footer>
      </div>
    </div>
  );
}

function DashStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-serif text-3xl font-medium tabular-nums">
        {value}
      </dd>
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

function HeroReview({
  review,
  entities,
  codeToName,
}: {
  review: ReviewEntry;
  entities: Record<string, Entity>;
  codeToName: (code: string) => string;
}) {
  return (
    <article className="mt-16">
      <Eyebrow>最新一篇</Eyebrow>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="font-mono font-semibold tabular-nums text-foreground">
          {review.date}
        </span>
        <span>{review.weekday}</span>
        {review.tags.slice(0, 3).map((t) => (
          <span key={t} className="text-muted-foreground">
            · {t}
          </span>
        ))}
      </div>

      <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.15] tracking-tight">
        {review.title}
      </h2>

      <p className="mt-5 font-serif text-lg leading-relaxed italic text-foreground/90">
        {review.summary}
      </p>

      {review.highlights.length > 0 && (
        <div className="mt-8">
          <Eyebrow>要点</Eyebrow>
          <ul className="mt-3 space-y-2.5 text-[15px] leading-relaxed">
            {review.highlights.map((h, i) => (
              <li key={i} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-2.5 size-1 shrink-0 rounded-full bg-foreground/40"
                />
                <span className="text-foreground/90">{h}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <dl className="mt-10 grid gap-x-10 gap-y-6 border-y border-border py-6 sm:grid-cols-2">
        <ActionMeta
          type={review.action_type}
          desc={review.action_desc}
          positionChange={review.position_change}
        />
        <VerificationMeta
          expected={review.verification_expected}
          actual={review.verification_actual}
          verdict={review.verification_verdict}
        />
      </dl>

      {review.tickers.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            涉及
          </span>
          {review.tickers.map((c) => {
            const has = !!entities[c];
            const inner = (
              <span className="inline-flex items-baseline gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-sm transition-colors hover:border-foreground/30">
                <span>{codeToName(c)}</span>
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {c}
                </span>
              </span>
            );
            return has ? (
              <Link key={c} href={`/finance/${c}`}>
                {inner}
              </Link>
            ) : (
              <span key={c}>{inner}</span>
            );
          })}
        </div>
      )}

      {review.tomorrow_focus.length > 0 && (
        <div className="mt-10 rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-amber-500" />
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">
              明日关注
            </span>
          </div>
          <ul className="mt-5 space-y-5">
            {review.tomorrow_focus.map((s) => {
              const f = parseFocus(s);
              const has = !!entities[f.code];
              const body = (
                <div className="group">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-lg font-medium">
                      {codeToName(f.code)}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">
                      {f.code}
                    </span>
                    {has && (
                      <ChevronRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-foreground/80">{f.reason}</p>
                  <p className="mt-1.5 font-mono text-xs leading-relaxed text-muted-foreground">
                    {f.trigger}
                  </p>
                </div>
              );
              return (
                <li key={f.code}>
                  {has ? <Link href={`/finance/${f.code}`}>{body}</Link> : body}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {review.body_tomorrow && (
        <BodyProse title="展开 · 明日操作细节" text={review.body_tomorrow} />
      )}

      {review.body_notes && (
        <BodyProse title="笔记" text={review.body_notes} />
      )}
    </article>
  );
}

function BodyProse({ title, text }: { title: string; text: string }) {
  return (
    <div className="mt-10">
      <Eyebrow>{title}</Eyebrow>
      <div className="mt-3 space-y-3 font-serif text-[15px] leading-relaxed text-foreground/90">
        {text.split(/\n{2,}/).map((para, i) => (
          <p key={i} className="whitespace-pre-line">
            {para.trim()}
          </p>
        ))}
      </div>
    </div>
  );
}

function ActionMeta({
  type,
  desc,
  positionChange,
}: {
  type: ActionType;
  desc: string;
  positionChange: string;
}) {
  const map: Record<ActionType, { label: string; cls: string }> = {
    buy: { label: "买入", cls: "text-emerald-600 dark:text-emerald-400" },
    add: { label: "加仓", cls: "text-emerald-600 dark:text-emerald-400" },
    sell: { label: "卖出", cls: "text-rose-600 dark:text-rose-400" },
    trim: { label: "减仓", cls: "text-rose-600 dark:text-rose-400" },
    none: { label: "无操作", cls: "text-muted-foreground" },
  };
  const m = map[type];
  const showQty = type !== "none" && positionChange && positionChange !== "0";
  const sign =
    positionChange.startsWith("+") || positionChange.startsWith("-")
      ? positionChange
      : `+${positionChange}`;
  return (
    <div>
      <Eyebrow>操作</Eyebrow>
      <div className="mt-2 flex items-baseline gap-2">
        <span className={`font-serif text-xl font-medium ${m.cls}`}>
          {m.label}
        </span>
        {showQty && (
          <span className="font-mono text-sm text-foreground/70 tabular-nums">
            {sign}
          </span>
        )}
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">{desc || "—"}</p>
    </div>
  );
}

function VerificationMeta({
  expected,
  actual,
  verdict,
}: {
  expected: string;
  actual: string;
  verdict: Verdict;
}) {
  const empty = verdict === "pending" && !expected && !actual;
  if (empty) {
    return (
      <div>
        <Eyebrow>事后验证</Eyebrow>
        <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <CircleSlash className="size-3.5" />
          待验证
        </div>
      </div>
    );
  }
  return (
    <div>
      <Eyebrow>事后验证</Eyebrow>
      <div className="mt-2">
        <VerdictPill verdict={verdict} large />
      </div>
      {expected && (
        <div className="mt-3 text-sm leading-relaxed">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            预期 ·{" "}
          </span>
          <span className="text-foreground/80">{expected}</span>
        </div>
      )}
      {actual && (
        <div className="mt-1.5 text-sm leading-relaxed">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            实际 ·{" "}
          </span>
          <span className="text-foreground/80">{actual}</span>
        </div>
      )}
    </div>
  );
}

function VerdictPill({
  verdict,
  large,
}: {
  verdict: Verdict;
  large?: boolean;
}) {
  const map: Record<
    Verdict,
    { label: string; cls: string; Icon: typeof Check }
  > = {
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
  const size = large ? "px-2.5 py-1 text-sm" : "px-2 py-0.5 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${size} ${m.cls}`}
    >
      <Icon className="size-3.5" />
      {m.label}
    </span>
  );
}

type WatchlistRowProps = {
  row: {
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
  hasEntity: boolean;
};

function WatchlistCard({ row, hasEntity }: WatchlistRowProps) {
  const body = (
    <div className="group relative grid grid-cols-12 items-baseline gap-x-6 gap-y-3 rounded-2xl border border-border bg-card px-6 py-5 transition-all hover:border-foreground/30">
      <div className="col-span-12 flex items-baseline gap-3 sm:col-span-4">
        <h3 className="font-serif text-2xl font-medium tracking-tight">
          {row.name}
        </h3>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {row.code}
        </span>
        <StatusBadge status={row.status} />
      </div>

      <div className="col-span-4 sm:col-span-2">
        <Eyebrow>现价</Eyebrow>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-semibold tabular-nums">
            {row.price}
          </span>
        </div>
        <div className={`mt-0.5 font-mono text-xs tabular-nums ${trendColor(row.trend)}`}>
          {row.change || "—"}
        </div>
      </div>

      <div className="col-span-8 sm:col-span-3">
        <Eyebrow>PE / 分位</Eyebrow>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-mono text-base tabular-nums">{row.peTtm}</span>
        </div>
        <PercentileBar pct={row.pct} />
      </div>

      <div className="col-span-12 sm:col-span-3">
        <Eyebrow>关键价位</Eyebrow>
        <div className="mt-1 flex items-baseline gap-3 font-mono text-sm tabular-nums">
          <span className="text-emerald-600 dark:text-emerald-400">
            ↑ {row.upper}
          </span>
          <span className="text-rose-600 dark:text-rose-400">
            ↓ {row.lower}
          </span>
        </div>
      </div>

      {row.note && (
        <p className="col-span-12 text-sm text-muted-foreground">{row.note}</p>
      )}

      {hasEntity && (
        <ArrowUpRight className="absolute right-5 top-5 size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </div>
  );
  return hasEntity ? <Link href={`/finance/${row.code}`}>{body}</Link> : body;
}

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    重点: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    持仓: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
    观察: "bg-muted text-muted-foreground",
    已平: "bg-muted/60 text-muted-foreground line-through",
  };
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${map[status]}`}
    >
      {status}
    </span>
  );
}

function PercentileBar({ pct }: { pct: number }) {
  const markerColor =
    pct > 80
      ? "bg-rose-500"
      : pct > 50
      ? "bg-amber-500"
      : "bg-emerald-500";
  const textColor =
    pct > 80
      ? "text-rose-700 dark:text-rose-400"
      : pct > 50
      ? "text-amber-700 dark:text-amber-400"
      : "text-emerald-700 dark:text-emerald-400";
  return (
    <div className="mt-1.5 flex items-center gap-2">
      <div className="relative h-1 w-20 overflow-hidden rounded-full bg-gradient-to-r from-emerald-500/25 via-amber-500/25 to-rose-500/25">
        <div
          className={`absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-background ${markerColor}`}
          style={{ left: `${Math.min(Math.max(pct, 0), 100)}%` }}
        />
      </div>
      <span className={`font-mono text-[10px] tabular-nums ${textColor}`}>
        {pct.toFixed(1)}%
      </span>
    </div>
  );
}

function trendColor(trend: Trend) {
  if (trend === "up") return "text-emerald-600 dark:text-emerald-400";
  if (trend === "down") return "text-rose-600 dark:text-rose-400";
  return "text-muted-foreground";
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-16 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
