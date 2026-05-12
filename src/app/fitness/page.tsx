import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Dumbbell,
  Flame,
  Apple,
  Footprints,
  Moon,
  Camera,
  TrendingDown,
  Target,
  Clock,
} from "lucide-react";

export const metadata = {
  title: "12 周减脂塑形计划 · luo.xin",
  description: "26 岁程序员的减脂 + 力量保持训练方案",
};

type Exercise = {
  name: string;
  sets: string;
  note?: string;
};

type Workout = {
  day: string;
  title: string;
  focus: string;
  accent: string;
  exercises: Exercise[];
};

const workouts: Workout[] = [
  {
    day: "MON",
    title: "上肢 A",
    focus: "推为主",
    accent: "from-orange-500/20 to-orange-500/5",
    exercises: [
      { name: "卧推", sets: "4 × 5" },
      { name: "坐姿肩推", sets: "3 × 8" },
      { name: "上斜哑铃卧推", sets: "3 × 10" },
      { name: "绳索下压", sets: "3 × 12" },
      { name: "侧平举", sets: "3 × 15" },
      { name: "卷腹", sets: "3 × 15" },
    ],
  },
  {
    day: "TUE",
    title: "下肢 A",
    focus: "蹲为主",
    accent: "from-emerald-500/20 to-emerald-500/5",
    exercises: [
      { name: "杠铃深蹲", sets: "4 × 5" },
      { name: "罗马尼亚硬拉", sets: "3 × 8" },
      { name: "腿举", sets: "3 × 12" },
      { name: "坐姿腿弯举", sets: "3 × 12" },
      { name: "提踵", sets: "3 × 15" },
      { name: "平板支撑", sets: "3 × 45s" },
    ],
  },
  {
    day: "THU",
    title: "上肢 B",
    focus: "拉为主",
    accent: "from-sky-500/20 to-sky-500/5",
    exercises: [
      { name: "引体向上", sets: "4 × 力竭" },
      { name: "杠铃划船", sets: "4 × 6" },
      { name: "哑铃卧推", sets: "3 × 10" },
      { name: "单臂哑铃划船", sets: "3 × 10" },
      { name: "弯举", sets: "3 × 12" },
      { name: "面拉", sets: "3 × 15", note: "救圆肩" },
    ],
  },
  {
    day: "FRI",
    title: "下肢 B",
    focus: "硬拉为主",
    accent: "from-violet-500/20 to-violet-500/5",
    exercises: [
      { name: "硬拉", sets: "3 × 5" },
      { name: "保加利亚分腿蹲", sets: "3 × 8" },
      { name: "髋推", sets: "3 × 10" },
      { name: "腿屈伸", sets: "3 × 12" },
      { name: "农夫行走", sets: "3 × 30m" },
    ],
  },
];

const macros = [
  { label: "热量", value: "1900", unit: "kcal", percent: 100, color: "bg-orange-500" },
  { label: "蛋白质", value: "150", unit: "g", percent: 32, color: "bg-rose-500" },
  { label: "碳水", value: "190", unit: "g", percent: 40, color: "bg-amber-500" },
  { label: "脂肪", value: "60", unit: "g", percent: 28, color: "bg-emerald-500" },
];

const habits = [
  { icon: Footprints, label: "每日步数", value: "8000-10000", note: "久坐党的大杀器，每小时起来走 2 分钟" },
  { icon: Moon, label: "睡眠", value: "7h+", note: "睡不够皮质醇高、掉肌肉" },
  { icon: Apple, label: "饮水", value: "2.5 L", note: "全天分散喝" },
];

const timeline = [
  { week: "WEEK 4", change: "明显变化", detail: "裤子松了，脸瘦下来" },
  { week: "WEEK 8", change: "肉眼可见线条", detail: "腹肌轮廓出现，肩臂分离" },
  { week: "WEEK 12", change: "接近目标", detail: "74-75kg / 16-18% 体脂" },
];

export default function FitnessPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          返回
        </Link>

        {/* HERO */}
        <header className="mt-10 border-b border-border pb-12">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-orange-500">
            <Flame className="size-4" />
            Training Plan
          </div>
          <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">
            12 周
            <br />
            <span className="text-orange-500">减脂塑形</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            目标不是变小，而是减脂的同时把力量守住。
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <Stat icon={Clock} label="周期" value="12" unit="周" />
            <Stat icon={Dumbbell} label="训练频率" value="4" unit="天 / 周" />
            <Stat icon={Target} label="分化方式" value="上下肢" unit="" />
          </div>
        </header>

        {/* TRAINING */}
        <Section number="01" title="训练" subtitle="上下肢分化 · 力量优先">
          <div className="grid gap-4 sm:grid-cols-2">
            {workouts.map((w) => (
              <div
                key={w.day}
                className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${w.accent} p-6 transition-all hover:border-foreground/20`}
              >
                <div className="mb-5 flex items-baseline justify-between">
                  <div>
                    <div className="font-mono text-xs tracking-widest text-muted-foreground">
                      {w.day}
                    </div>
                    <div className="mt-1 text-xl font-bold">{w.title}</div>
                  </div>
                  <span className="rounded-full bg-background/60 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
                    {w.focus}
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {w.exercises.map((e) => (
                    <li
                      key={e.name}
                      className="flex items-baseline justify-between gap-3 border-b border-border/40 pb-2 last:border-0 last:pb-0"
                    >
                      <span className="text-sm">
                        {e.name}
                        {e.note && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            {e.note}
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 font-mono text-xs text-muted-foreground">
                        {e.sets}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Note>
            组间休息：复合动作 2-3 分钟，孤立动作 60-90 秒。
            主项每周加 2.5kg，加不动就退回上周。3 天版本跳过周五。
          </Note>
        </Section>

        {/* DIET */}
        <Section number="02" title="饮食" subtitle="90% 决定减脂">
          <div className="grid gap-4 sm:grid-cols-4">
            {macros.map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {m.label}
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{m.value}</span>
                  <span className="text-sm text-muted-foreground">
                    {m.unit}
                  </span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full ${m.color} rounded-full`}
                    style={{ width: `${m.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-3">
            <MealCard time="早餐" content="燕麦 + 鸡蛋 + 牛奶" />
            <MealCard time="午餐" content="轻食 / 少油麻辣烫" />
            <MealCard time="晚餐" content="鸡胸 / 牛肉 + 米饭 + 蔬菜" />
          </div>

          <Note>
            每周称重 3-4 次取平均，目标每周降 0.5-0.7kg。
            掉太快肌肉也跟着掉。零食备坚果和无糖酸奶，别囤薯片。
          </Note>
        </Section>

        {/* HABITS */}
        <Section number="03" title="日常" subtitle="被严重低估的部分">
          <div className="grid gap-3 sm:grid-cols-2">
            {habits.map((h) => (
              <div
                key={h.label}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5"
              >
                <div className="rounded-xl bg-orange-500/10 p-2.5 text-orange-500">
                  <h.icon className="size-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold">{h.label}</span>
                    <span className="font-mono text-sm text-muted-foreground">
                      {h.value}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{h.note}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* TIMELINE */}
        <Section number="04" title="预期" subtitle="12 周节奏">
          <div className="space-y-3">
            {timeline.map((t, i) => (
              <div
                key={t.week}
                className="group flex items-center gap-5 rounded-2xl border border-border bg-card p-5 transition-all hover:border-orange-500/40"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 font-mono text-sm font-bold text-orange-500">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1">
                  <div className="font-mono text-xs tracking-widest text-muted-foreground">
                    {t.week}
                  </div>
                  <div className="mt-0.5 text-lg font-semibold">{t.change}</div>
                  <div className="text-sm text-muted-foreground">{t.detail}</div>
                </div>
                <ArrowRight className="size-5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-orange-500/30 bg-orange-500/5 p-5">
            <Camera className="size-5 shrink-0 text-orange-500" />
            <div className="text-sm">
              每周固定时间拍三张照片：正面、侧面、背面。
              <span className="text-muted-foreground">
                {" "}
                照片比体重诚实得多 — 水分波动会让秤骗你。
              </span>
            </div>
          </div>
        </Section>

        <footer className="mt-16 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          坚持是唯一的捷径
        </footer>
      </div>
    </div>
  );
}

function Section({
  number,
  title,
  subtitle,
  children,
}: {
  number: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16">
      <div className="mb-6 flex items-baseline gap-4">
        <span className="font-mono text-sm text-muted-foreground">
          {number}
        </span>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <span className="text-sm text-muted-foreground">{subtitle}</span>
      </div>
      {children}
    </section>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  unit,
}: {
  icon: typeof Dumbbell;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span className="text-2xl font-bold sm:text-3xl">{value}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}

function MealCard({ time, content }: { time: string; content: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">
        {time}
      </div>
      <div className="mt-1 text-sm">{content}</div>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 border-l-2 border-orange-500/60 pl-4 text-sm text-muted-foreground">
      {children}
    </div>
  );
}
