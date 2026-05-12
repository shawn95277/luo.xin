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
  Target,
  Clock,
  ChevronDown,
} from "lucide-react";

export const metadata = {
  title: "12 周减脂塑形计划 · luo.xin",
  description: "12 周减脂塑形训练方案",
};

type Exercise = {
  name: string;
  sets: string;
  muscles: string[];
  equipment: string;
  howTo: string[];
  tips: string[];
  alt?: string;
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
      {
        name: "卧推",
        sets: "4 × 5",
        muscles: ["胸大肌", "三头肌", "前束三角肌"],
        equipment: "杠铃 + 卧推架 + 安全杠",
        howTo: [
          "仰卧，双手略宽于肩抓杠",
          "肩胛后缩并下沉，臀部不离凳",
          "下放杠铃到胸中部、轻触不弹起",
          "推起到肘微屈（不锁死）",
        ],
        tips: [
          "脚踩稳地面、全身发力",
          "下放慢、推起爆发",
          "大重量必须用安全杠或找保护",
        ],
      },
      {
        name: "坐姿肩推",
        sets: "3 × 8",
        muscles: ["三角肌前束", "中束", "三头肌"],
        equipment: "杠铃 / 哑铃 + 高背靠椅",
        howTo: [
          "背贴高背椅，核心收紧",
          "杠铃位于锁骨前 / 哑铃位于耳侧",
          "垂直上推过头顶",
          "下放到耳侧（不是下巴）",
        ],
        tips: [
          "顶部不锁死肘",
          "下放控制 2 秒",
          "腰别过度反弓",
        ],
      },
      {
        name: "上斜杠铃卧推",
        sets: "4 × 6-8",
        muscles: ["上胸", "前束三角肌", "三头肌"],
        equipment: "杠铃 + 30-45° 上斜椅",
        howTo: [
          "斜板调到 30-45°",
          "握距与平卧推一致",
          "下放到锁骨下方",
          "推起到肘微屈",
        ],
        tips: [
          "角度别超 45°（再高就成肩推了）",
          "杠铃轨迹略向头部方向",
          "充分热身肩袖再上重量",
        ],
      },
      {
        name: "绳索下压",
        sets: "3 × 12",
        muscles: ["三头肌"],
        equipment: "龙门架高位 + 绳索 / 直杆",
        howTo: [
          "站姿面向龙门架，肘贴体侧",
          "握把从胸前下推到肘完全伸直",
          "顶部停 1 秒挤压三头",
          "控制回到肘约 90°",
        ],
        tips: [
          "上臂全程不动",
          "靠三头发力，不借身体前倾",
          "绳索版可在底部分开手腕加强收缩",
        ],
      },
      {
        name: "绳索侧平举",
        sets: "3 × 12 / 边",
        muscles: ["三角肌中束"],
        equipment: "龙门架低位 + 单握把",
        howTo: [
          "站姿侧对龙门架",
          "远侧手抓低位把手，绳索绕过身前",
          "手肘微屈固定，向侧上方拉到肩高",
          "顶部停 1 秒，慢放 2-3 秒",
        ],
        tips: [
          "重量宁轻勿重",
          "不耸肩",
          "感受中束发力比次数重要",
        ],
      },
    ],
  },
  {
    day: "TUE",
    title: "下肢 A",
    focus: "蹲为主",
    accent: "from-emerald-500/20 to-emerald-500/5",
    exercises: [
      {
        name: "杠铃深蹲",
        sets: "4 × 5",
        muscles: ["股四头", "臀大肌", "腘绳肌", "核心"],
        equipment: "杠铃 + 深蹲架 + 安全杠",
        howTo: [
          "杠铃放在斜方肌上方",
          "双脚与肩同宽、脚尖略外八",
          "屈髋屈膝下蹲到大腿与地面平行或更低",
          "蹬地起立，髋膝同步",
        ],
        tips: [
          "膝盖跟脚尖同向，不内扣",
          "核心紧绷、背部挺直",
          "深度因人而异，活动度决定",
          "必须放安全杠",
        ],
      },
      {
        name: "山羊挺身",
        sets: "3 × 12",
        muscles: ["腘绳肌", "臀大肌", "竖脊肌"],
        equipment: "45° 山羊挺身器",
        howTo: [
          "趴上器械，髋部卡在垫边缘外",
          "上身自然下垂",
          "用臀腘发力抬到与地面平行",
          "顶部停 1 秒",
        ],
        tips: [
          "不超伸（与地面平行就停）",
          "离心慢（下放 2-3 秒）",
          "用屁股顶不是用腰抬",
          "进阶可抱杠铃片在胸前",
        ],
        alt: "罗马尼亚硬拉",
      },
      {
        name: "腿举",
        sets: "3 × 12",
        muscles: ["股四头", "臀大肌", "腘绳肌"],
        equipment: "45° 斜板腿举机",
        howTo: [
          "坐稳，腰贴紧靠垫",
          "双脚与肩同宽踩踏板",
          "屈膝下放到大腿接近 90°",
          "蹬起到膝接近伸直（不锁死）",
        ],
        tips: [
          "膝盖跟脚尖同向，不内扣",
          "腰不离开靠垫（离开就是幅度过大）",
          "脚踩偏上偏下可改变臀腿比例",
        ],
      },
      {
        name: "坐姿腿弯举",
        sets: "3 × 12",
        muscles: ["腘绳肌"],
        equipment: "坐姿腿弯举机",
        howTo: [
          "坐稳，膝盖对准转轴",
          "腿垫卡在脚踝上方",
          "屈膝把垫子往后下压",
          "底部停 1 秒挤压腘绳",
        ],
        tips: [
          "控制速度，不甩",
          "顶部别完全伸直膝（保持张力）",
          "感受腘绳收缩，不靠惯性",
        ],
      },
      {
        name: "平板支撑",
        sets: "3 × 45s",
        muscles: ["腹横肌", "腹直肌", "核心整体"],
        equipment: "徒手 / 瑜伽垫",
        howTo: [
          "前臂撑地，肘在肩正下方",
          "脚尖支撑，身体保持一条直线",
          "收紧腹臀",
          "正常呼吸，保持时间到位",
        ],
        tips: [
          "髋别塌（屁股下沉）",
          "颈别仰、肩别耸",
          "60 秒太轻松就改单腿 / 单臂版",
        ],
      },
    ],
  },
  {
    day: "THU",
    title: "上肢 B",
    focus: "拉为主",
    accent: "from-sky-500/20 to-sky-500/5",
    exercises: [
      {
        name: "引体向上",
        sets: "4 × 力竭",
        muscles: ["背阔肌", "二头肌", "后束三角肌"],
        equipment: "单杠 / 辅助引体机",
        howTo: [
          "正握略宽于肩",
          "悬挂启动，先肩胛下沉",
          "拉到下巴过杠",
          "控制下放到几乎直臂",
        ],
        tips: [
          "别耸肩，启动先收肩胛",
          "做不到自重就用辅助器或弹力带",
          "顶部停 1 秒挤压背阔",
        ],
      },
      {
        name: "杠铃划船",
        sets: "4 × 6",
        muscles: ["背阔肌", "大圆肌", "中斜方肌", "后束"],
        equipment: "杠铃",
        howTo: [
          "屈髋俯身，上身约 45°",
          "双手过肩宽抓杠",
          "拉到下腹 / 肚脐位置",
          "控制下放，保持俯身角度不变",
        ],
        tips: [
          "不要起身借力（最常见错误）",
          "肩胛后缩主导",
          "杠铃贴大腿前侧轨迹",
        ],
      },
      {
        name: "哑铃卧推",
        sets: "3 × 10",
        muscles: ["胸大肌", "三头肌", "前束"],
        equipment: "哑铃 + 平凳",
        howTo: [
          "仰卧，哑铃位于肩两侧",
          "推到顶端，两哑铃相向但不相碰",
          "下放到胸侧，行程比杠铃大",
          "肘关节约 45° 张开",
        ],
        tips: [
          "起始用膝盖把哑铃顶到肩上",
          "下放慢、推起爆发",
          "结束时双脚踩地坐起再放下",
        ],
      },
      {
        name: "弯举",
        sets: "3 × 12",
        muscles: ["二头肌"],
        equipment: "哑铃 / 杠铃 / EZ 杠",
        howTo: [
          "站姿肘贴体侧",
          "屈肘把重量举到肩前",
          "顶部停 1 秒挤压",
          "控制下放到几乎直臂",
        ],
        tips: [
          "肘不前移（不变前平举）",
          "不借腰部摆动",
          "哑铃版可加旋外（小指向上）增加二头收缩",
        ],
      },
      {
        name: "面拉",
        sets: "3 × 15",
        muscles: ["后束三角肌", "中斜方", "外旋肌群"],
        equipment: "龙门架高位 + 绳索",
        howTo: [
          "绳索调到与脸同高",
          "双手反握绳索末端",
          "拉到耳侧，肘高于手腕",
          "顶部外旋让大拇指朝后",
        ],
        tips: [
          "拉到耳侧不是下颌",
          "肘抬高、肩胛后缩",
          "轻重量高次数（程序员救命动作）",
        ],
      },
    ],
  },
  {
    day: "FRI",
    title: "下肢 B",
    focus: "硬拉为主",
    accent: "from-violet-500/20 to-violet-500/5",
    exercises: [
      {
        name: "硬拉",
        sets: "3 × 5",
        muscles: ["腘绳肌", "臀大肌", "竖脊肌", "斜方肌", "前臂"],
        equipment: "杠铃 + 杠铃片",
        howTo: [
          "站姿脚距与髋同宽，杠铃在脚背中部上方",
          "屈髋下蹲抓杠，双手略宽于膝外侧",
          "胸挺直、背挺直、肩在杠前",
          "蹬地伸髋同步起立",
        ],
        tips: [
          "杠铃全程贴腿",
          "绝对不圆背（最容易受伤）",
          "顶部不超伸",
          "下放沿大腿滑回地面",
          "新手务必找教练看动作",
        ],
      },
      {
        name: "保加利亚分腿蹲",
        sets: "3 × 8 / 腿",
        muscles: ["股四头", "臀大肌", "平衡稳定"],
        equipment: "哑铃 + 长凳",
        howTo: [
          "一脚后脚背撑在长凳上",
          "前脚向前迈一大步",
          "下蹲到后腿膝盖接近地面",
          "前脚蹬地起立",
        ],
        tips: [
          "前后脚距离要够（短了膝盖超脚尖）",
          "身体略前倾偏重臀，直立偏重股四头",
          "重心放前脚",
        ],
      },
      {
        name: "髋推",
        sets: "3 × 10",
        muscles: ["臀大肌", "腘绳肌"],
        equipment: "杠铃 + 长凳 + 泡棉护垫",
        howTo: [
          "上背靠长凳边缘",
          "杠铃压在髋部（垫上泡棉）",
          "双脚踩地与肩同宽",
          "髋部上顶到大腿与地面平行",
        ],
        tips: [
          "顶部臀部挤压 1 秒",
          "下巴微收，别仰头",
          "脚位离身体太近练股四头，太远练腘绳",
        ],
      },
      {
        name: "腿屈伸",
        sets: "3 × 12",
        muscles: ["股四头肌"],
        equipment: "腿屈伸机",
        howTo: [
          "坐稳，膝盖对准转轴",
          "踝压在前腿垫下",
          "伸膝把腿伸直",
          "顶部停 1 秒挤压股四头",
        ],
        tips: [
          "不锁死膝盖（关节压力大）",
          "离心慢（下放 2-3 秒）",
          "可单腿做修正左右失衡",
        ],
      },
      {
        name: "农夫行走",
        sets: "3 × 30m",
        muscles: ["前臂", "斜方肌", "核心", "腿"],
        equipment: "重哑铃 / 壶铃 / 农夫行走架",
        howTo: [
          "双手各持重物，肩胛下沉",
          "站直，核心收紧",
          "正常步幅走指定距离",
          "转身走回起点",
        ],
        tips: [
          "肩不耸、不左右晃",
          "呼吸平稳",
          "重量循序渐进（握不住先练握力）",
        ],
      },
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
  { icon: Footprints, label: "每日步数", value: "8000-10000", note: "每小时起来走 2 分钟" },
  { icon: Moon, label: "睡眠", value: "7h+", note: "睡不够皮质醇高、掉肌肉" },
  { icon: Apple, label: "饮水", value: "2.5 L", note: "全天分散喝" },
];

const timeline = [
  { week: "WEEK 4", change: "明显变化", detail: "裤子松了，脸瘦下来" },
  { week: "WEEK 8", change: "肉眼可见线条", detail: "腹肌轮廓出现，肩臂分离" },
  { week: "WEEK 12", change: "接近目标", detail: "体重和体脂同步下降" },
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

        <Section number="01" title="训练" subtitle="点击动作查看要点">
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
                <ul className="space-y-1">
                  {w.exercises.map((e) => (
                    <li key={e.name}>
                      <ExerciseRow exercise={e} />
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

function ExerciseRow({ exercise: e }: { exercise: Exercise }) {
  return (
    <details className="group rounded-lg transition-colors open:bg-background/40">
      <summary className="flex cursor-pointer list-none items-baseline justify-between gap-3 rounded-lg px-2 py-2 hover:bg-background/40 [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-baseline gap-2 text-sm">
          <ChevronDown className="size-3.5 shrink-0 self-center text-muted-foreground transition-transform group-open:rotate-180" />
          {e.name}
          {e.alt && (
            <span className="rounded-full bg-orange-500/15 px-1.5 py-0.5 text-[10px] font-medium text-orange-500 group-open:bg-orange-500/30">
              备
            </span>
          )}
        </span>
        <span className="shrink-0 font-mono text-xs text-muted-foreground">
          {e.sets}
        </span>
      </summary>

      <div className="space-y-3 px-2 pb-3 pt-1 text-xs">
        <DetailRow label="练">
          <div className="flex flex-wrap gap-1">
            {e.muscles.map((m) => (
              <span
                key={m}
                className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[11px] text-orange-500"
              >
                {m}
              </span>
            ))}
          </div>
        </DetailRow>

        <DetailRow label="器械">
          <span className="text-muted-foreground">{e.equipment}</span>
        </DetailRow>

        <DetailRow label="做法">
          <ol className="list-decimal space-y-1 pl-4 text-muted-foreground marker:text-foreground/60">
            {e.howTo.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </DetailRow>

        <DetailRow label="要点">
          <ul className="list-disc space-y-1 pl-4 text-muted-foreground marker:text-orange-500">
            {e.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </DetailRow>

        {e.alt && (
          <DetailRow label="备选">
            <span className="text-muted-foreground">{e.alt}</span>
          </DetailRow>
        )}
      </div>
    </details>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[3rem_1fr] gap-2">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div>{children}</div>
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
