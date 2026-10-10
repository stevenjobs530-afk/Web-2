import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  CalendarCheck,
  Database,
  Dumbbell,
  Flame,
  GlassWater,
  Timer,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import "@fontsource-variable/geist";
import PortfolioBackLink from "../../components/portfolio-back-link";
import { Film } from "../../../components/primitives";
import "./gym-log.scss";

type Language = "en" | "zh";

const base = import.meta.env.BASE_URL;
const media = (path: string) => `${base}${path}`;

const V2_REPO = "https://github.com/stevenjobs530-afk/personal-training-website-v2";

// Exercises shown in the gallery, with the muscle group and equipment from each
// illustration's prompt file in the Gym-Log repo (exercise-images/prompts/*.txt).
const EXERCISES = [
  ["barbell-squat", "Barbell Squat", "Legs", "Barbell"],
  ["barbell-deadlift", "Barbell Deadlift", "Back", "Barbell"],
  ["dumbbell-bench-press", "Dumbbell Bench Press", "Chest", "Dumbbells + adjustable bench"],
  ["lat-pulldown", "Lat Pulldown", "Back", "Cable machine"],
  ["seated-overhead-press", "Seated Overhead Press", "Shoulders", "Dumbbells + adjustable bench"],
  ["leg-press", "Leg Press", "Legs", "Machine"],
  ["cable-chest-fly", "Cable Chest Fly", "Chest", "Cable machine"],
  ["diverging-seated-row", "Diverging Seated Row", "Back", "Machine"],
  ["bulgarian-split-squat", "Bulgarian Split Squat", "Legs", "Dumbbells + flat bench"],
  ["lateral-raise", "Lateral Raise", "Shoulders", "Dumbbells"],
  ["barbell-hip-thrust", "Barbell Hip Thrust", "Legs", "Barbell + flat bench"],
  ["pull-up", "Pull-up", "Back", "Bodyweight"],
  ["dumbbell-curl", "Dumbbell Curl", "Arms", "Dumbbells"],
  ["triceps-pushdown", "Triceps Pushdown", "Arms", "Cable machine"],
  ["hack-squat", "Hack Squat", "Legs", "Machine"],
  ["pec-deck-fly", "Pec Deck Fly", "Chest", "Machine"],
  ["rowing-machine", "Rowing Machine", "Cardio", "Rowing machine"],
  ["swimming", "Swimming", "Cardio", "Pool"],
  ["treadmill-hill-climbing", "Treadmill Hill Climbing", "Cardio", "Treadmill"],
  ["outdoor-cycling", "Outdoor Cycling", "Cardio", "Bicycle"],
] as const;

const MUSCLE_ZH: Record<string, string> = {
  Legs: "腿部",
  Back: "背部",
  Chest: "胸部",
  Shoulders: "肩部",
  Arms: "手臂",
  Cardio: "有氧",
};

const TAB_ICONS: LucideIcon[] = [Dumbbell, BookOpen, TrendingUp, Flame, CalendarCheck, Timer, GlassWater, Database];

const COPY = {
  en: {
    title: "Gym Log — Zishun Gao",
    description: "Gym Log: a native SwiftUI Mac app for workouts, energy, water, habits and focus time, stored locally in plain files.",
    backLabel: "Back to Portfolio — return to the personal project card",
    language: "中文",
    languageLabel: "Switch to Chinese",
    hero: {
      eyebrow: "Personal project · Native Mac app",
      title: "Gym Log",
      lead: "A native SwiftUI app for workouts, energy, water, habits and focus time.",
      accent: "Everything stays on the Mac, in plain files.",
      explore: "Explore the app",
      hudLeft: "01 — The app",
      hudRight: "SwiftUI · macOS 26 · English & 中文",
    },
    tabs: {
      chapter: "02 — Eight tabs",
      title: "One sidebar,",
      accent: "a whole training day.",
      note: "Illustrative sidebar, drawn for this page. Not a screenshot.",
      items: [
        ["Workout", "Pick a date, add exercises and log each set. When there's no session, mark the day as a rest day, a busy day or gym closed."],
        ["Library", "Your own exercises: name, muscle group, equipment and a description. Each has an illustration, or a photo of the machine at your gym."],
        ["Progress", "A chart per exercise: top weight, estimated 1RM or volume; distance, duration or speed for cardio. 1M, 3M, 1Y or all time, as a curve or bars."],
        ["Energy", "Workout calories per day, added up from Apple Watch workouts."],
        ["Habits", "Logs that count up, count down or tally practice days, plus reminders that repeat or fire once, with Mac notifications."],
        ["Focus", "A Pomodoro timer. When a work round ends, a full-screen rest locks the Mac until the break is over."],
        ["Drinks", "A water tracker with a 3D glass you can turn, your own cups and drink types, and drink reminders."],
        ["My Data", "Shows the folder everything lives in. No account, no cloud. Copy the folder to back it up."],
      ],
    },
    library: {
      chapter: "03 — Exercise library",
      count: "40",
      countLabel: "illustrated exercises",
      title: "Every exercise drawn",
      accent: "in one style.",
      body: "Exercises are user-defined. Each illustration comes from a prompt with a fixed style block, with the trained muscle highlighted in orange. A photo of your own machine, added in the app, takes priority over the drawing.",
    },
    logging: {
      chapter: "04 — Logging",
      title: "Strength and cardio",
      accent: "record different things.",
      strengthTitle: "Strength set",
      strength: [["Weight", "kg"], ["Reps", "×"], ["Seat / setup", "per entry"], ["Note", "optional"]],
      cardioTitle: "Cardio set",
      cardio: [["Duration", "min"], ["Distance", "km"], ["Incline", "% · treadmill"], ["Climb", "m · outdoors"]],
      statusTitle: "Days without a session",
      status: ["Rest day", "Busy day", "Gym closed"],
    },
    progress: {
      chapter: "05 — Progress",
      title: "Trends from the sets",
      accent: "you actually logged.",
      formulaLabel: "Estimated 1RM (Epley)",
      formula: "weight × (1 + reps ÷ 30)",
      groups: [
        ["Strength", ["Top weight", "Est. 1RM", "Volume"]],
        ["Cardio", ["Distance", "Duration", "Speed"]],
        ["Range", ["1M", "3M", "1Y", "All"]],
      ],
      curveNote: "Illustrative curve, not training data",
    },
    local: {
      chapter: "06 — Local-first",
      title: "Your data is a folder",
      accent: "on your Mac.",
      path: "~/Documents/Gym Data/data.json",
      points: [
        ["Plain files", "data.json holds workouts and exercises; photos/ holds equipment pictures. No account and no cloud."],
        ["Apple Fitness sync", "Two Claude Code skills read Apple Fitness screenshots: one adds cardio workouts, the other adds daily workout calories. The workout sync shows a dry run first, and re-running it skips workouts already added."],
        ["Backups", "Before every sync writes, a copy of data.json goes to backups/."],
        ["Two languages", "Every screen is available in English and 中文."],
      ],
    },
    evolution: {
      chapter: "07 — How it evolved",
      before: "Personal Training Website V2",
      beforeStack: "Next.js · Supabase · Row Level Security",
      beforeLink: "Earlier version on GitHub",
      after: "Gym Log",
      afterStack: "SwiftUI · Swift 6 · local files",
    },
    closing: {
      stats: [["8", "tabs"], ["40", "exercise illustrations"], ["21", "Swift source files"]],
      title: "Built for my own training,",
      accent: "one set at a time.",
      note: "Gym Log's source is private. This page describes it from the code; the sidebar and curve are drawn for the page.",
      back: "Back to Portfolio",
    },
  },
  zh: {
    title: "Gym Log — 高子舜",
    description: "Gym Log：一款原生 SwiftUI Mac 应用，用于记录训练、热量、饮水、习惯与专注时间，数据以普通文件保存在本地。",
    backLabel: "返回​作品​集中​的个人​项目​卡片",
    language: "EN",
    languageLabel: "切换​至英文",
    hero: {
      eyebrow: "个人​项目 · 原生 Mac 应用",
      title: "Gym Log",
      lead: "一款​原生 SwiftUI 应用，​记录​训练、​热量、​饮水、​习惯​与专注​时间。",
      accent: "所有​数据​都以​普通​文件​留在 Mac 上。",
      explore: "浏览应用",
      hudLeft: "01 — 应用",
      hudRight: "SwiftUI · macOS 26 · English & 中文",
    },
    tabs: {
      chapter: "02 — 八个​标签页",
      title: "一条​侧边栏，",
      accent: "装下​完整​的训练日。",
      note: "示意​侧边栏，​为本页​绘制，​并非​应用​截图。",
      items: [
        ["训练", "选择​日期，​添加​动作​并记录​每一组。​没有​训练​时，​可将​当天​标记​为休息日、​忙碌日​或健身房​关闭。"],
        ["动作库", "你自己​的动作：​名称、​肌群、​器械​与说明。​每个​动作​配有​插图，​或你​所在​健身房​器械​的照片。"],
        ["进度", "每个​动作​一张​图表：​最大​重量、​估算 1RM 或训练量；​有氧​则看​距离、​时长​或速度。​可选 1 个月、​3 个月、​1 年​或全部，​曲线​或柱状。"],
        ["热量", "每天​的训练​热量，​由 Apple Watch 训练​记录​累加​而来。"],
        ["习惯", "正计时、​倒计时​或累计​练习​天数​的记录，​以及​重复​或一次性​的提醒，​支持 Mac 通知。"],
        ["专注", "番茄钟。​一轮​专注​结束​后，​全屏​休息​画面​会锁定 Mac，​直到​休息​结束。"],
        ["饮品", "可旋转​的 3D 水杯、​自定义​杯子​与饮品​类型，​以及​喝水​提醒。"],
        ["我的​数据", "显示​所有​数据​所在​的文件夹。​无需​账户，​没有​云端。​复制​文件夹​即可​备份。"],
      ],
    },
    library: {
      chapter: "03 — 动作库",
      count: "40",
      countLabel: "个​带插图​的动作",
      title: "每个​动作，",
      accent: "同一种​画风。",
      body: "动作​由用户​自定义。​每张​插图​都由​带有​固定​风格​说明​的提示词​生成，​训练​肌群​以橙色​标出。​在应用​中添加​的自家​器械​照片​会优先​于插图​显示。",
    },
    logging: {
      chapter: "04 — 记录",
      title: "力量​与有氧，",
      accent: "记录​的内容​不同。",
      strengthTitle: "力量组",
      strength: [["重量", "kg"], ["次数", "×"], ["座椅 / 设置", "每个​动作"], ["备注", "可选"]],
      cardioTitle: "有氧组",
      cardio: [["时长", "分钟"], ["距离", "公里"], ["坡度", "% · 跑步机"], ["爬升", "米 · 户外"]],
      statusTitle: "没有​训练​的日子",
      status: ["休息日", "忙碌日", "健身房​关闭"],
    },
    progress: {
      chapter: "05 — 进度",
      title: "趋势​只来自​",
      accent: "真实​记录​的训练组。",
      formulaLabel: "估算 1RM（Epley 公式）",
      formula: "重量 × (1 + 次数 ÷ 30)",
      groups: [
        ["力量", ["最大​重量", "估算 1RM", "训练量"]],
        ["有氧", ["距离", "时长", "速度"]],
        ["范围", ["1M", "3M", "1Y", "全部"]],
      ],
      curveNote: "示意​曲线，​并非​训练​数据",
    },
    local: {
      chapter: "06 — 本地​优先",
      title: "你的​数据，",
      accent: "就是 Mac 上的​一个​文件夹。",
      path: "~/Documents/Gym Data/data.json",
      points: [
        ["普通​文件", "data.json 保存​训练​与动作；​photos/ 保存​器械​照片。​无需​账户，​没有​云端。"],
        ["Apple 健身​同步", "两个 Claude Code 技能​读取 Apple 健身​截图：​一个​添加​有氧​训练，​另一个​添加​每天​的训练​热量。​训练​同步​会先​试运行，​重复​运行​会跳过​已添加​的训练。"],
        ["备份", "每次​同步​写入​前，​data.json 都会​先复制​到 backups/。"],
        ["双语", "每个​页面​都提供 English 与​中文。"],
      ],
    },
    evolution: {
      chapter: "07 — 演进",
      before: "Personal Training Website V2",
      beforeStack: "Next.js · Supabase · 行级​安全",
      beforeLink: "GitHub ​上的​早期​版本",
      after: "Gym Log",
      afterStack: "SwiftUI · Swift 6 · 本地​文件",
    },
    closing: {
      stats: [["8", "个​标签页"], ["40", "张​动作​插图"], ["21", "个 Swift ​源文件"]],
      title: "为自己​的训练​而做，",
      accent: "一组​一组​地记。",
      note: "Gym Log 的源代码​为私有。​本页​依据​代码​描述​应用；​侧边栏​与曲线​为本页​绘制。",
      back: "返回​作品集",
    },
  },
} as const;

type Copy = (typeof COPY)[Language];

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Chapter bar: mono label with a hairline, the same device the UK retail case study uses. */
function Chapter({ label }: { label: string }) {
  return (
    <div className="gl-chapter" data-reveal>
      <span>{label}</span>
    </div>
  );
}

/* --------------------------------------------------------------------------- */
/* Hero: the ship film. As you scroll on, it draws back into a rounded frame.   */
/* --------------------------------------------------------------------------- */

function Hero({ t, reduce }: { t: Copy; reduce: boolean }) {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const inset = useTransform(scrollYProgress, [0, 0.8], [0, 6]);
  const radius = useTransform(scrollYProgress, [0, 0.8], [0, 36]);
  const clipPath = useTransform([inset, radius] as MotionValue<number>[], ([i, r]: number[]) => `inset(${i}% ${i}% ${i}% ${i}% round ${r}px)`);
  const copyY = useTransform(scrollYProgress, [0, 0.8], [0, -80]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section ref={ref} className="gl-hero" aria-labelledby="gym-log-title">
      <motion.div className="gl-hero-frame" style={reduce ? undefined : { clipPath }}>
        <Film
          src={media("personal-projects/personal-training/video/ocean-hero-720p.mp4")}
          poster={media("personal-projects/personal-training/video/ocean-hero-poster.jpg")}
          phone={{ src: media("media/mobile/ocean.mp4"), poster: media("media/mobile/ocean.webp") }}
          className="gl-hero-film"
        />
        <div className="gl-hero-shade" aria-hidden="true" />
        <span className="gl-corner gl-corner-tl" aria-hidden="true" />
        <span className="gl-corner gl-corner-tr" aria-hidden="true" />
        <span className="gl-corner gl-corner-bl" aria-hidden="true" />
        <span className="gl-corner gl-corner-br" aria-hidden="true" />

        <motion.div className="gl-hero-copy" style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}>
          <img className="gl-hero-icon" src={media("personal-projects/gym-log/gym-log-icon.webp")} alt="" width={96} height={96} />
          <p className="gl-eyebrow gl-in gl-in-1">{t.hero.eyebrow}</p>
          <h1 id="gym-log-title" className="gl-hero-title">
            <span className="gl-line">
              <span>{t.hero.title}</span>
            </span>
          </h1>
          <p className="gl-hero-lead gl-in gl-in-2">
            {t.hero.lead} <em>{t.hero.accent}</em>
          </p>
          <a className="gl-btn gl-in gl-in-3" href="#tabs">
            {t.hero.explore}
            <ArrowDown aria-hidden="true" />
          </a>
        </motion.div>

        <div className="gl-hud" aria-hidden="true">
          <span>{t.hero.hudLeft}</span>
          <span>{t.hero.hudRight}</span>
        </div>
      </motion.div>
    </section>
  );
}

/* --------------------------------------------------------------------------- */
/* Eight tabs: a sticky stage; scrolling walks the highlight down the sidebar.  */
/* --------------------------------------------------------------------------- */

function Tabs({ t, reduce }: { t: Copy; reduce: boolean }) {
  const ref = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);
  const count = t.tabs.items.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setActive(Math.min(count - 1, Math.max(0, Math.floor(value * count))));
  });
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const [name, body] = t.tabs.items[active];
  const Icon = TAB_ICONS[active];

  return (
    <section ref={ref} id="tabs" className={reduce ? "gl-tabs is-static" : "gl-tabs"} style={{ "--tab-count": count } as CSSProperties}>
      <div className="gl-tabs-sticky">
        <div className="gl-wrap">
          <Chapter label={t.tabs.chapter} />
          <div className="gl-tabs-grid">
            <div className="gl-tabs-copy">
              <h2 className="gl-h2">
                {t.tabs.title} <em>{t.tabs.accent}</em>
              </h2>
              <div className="gl-tab-detail" aria-live="polite">
                <motion.div
                  key={active}
                  initial={reduce ? false : { opacity: 0, y: 16, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="gl-tab-index">{`${String(active + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`}</span>
                  <h3>
                    <Icon aria-hidden="true" />
                    {name}
                  </h3>
                  <p>{body}</p>
                </motion.div>
              </div>
              <div className="gl-tab-meter" aria-hidden="true">
                <motion.i style={{ width: fill }} />
              </div>
            </div>

            <figure className="gl-sidebar" aria-label={t.tabs.note}>
              <div className="gl-sidebar-lights" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
              <ol>
                {t.tabs.items.map(([label], index) => {
                  const TabIcon = TAB_ICONS[index];
                  return (
                    <li key={label} className={index === active ? "is-active" : undefined}>
                      <TabIcon aria-hidden="true" />
                      <span>{label}</span>
                    </li>
                  );
                })}
              </ol>
              <figcaption>{t.tabs.note}</figcaption>
            </figure>
          </div>
        </div>
      </div>

      {/* Static fallback for reduced motion: every tab as a plain list. */}
      {reduce ? (
        <div className="gl-wrap">
          <ol className="gl-tab-list">
            {t.tabs.items.map(([label, text], index) => {
              const TabIcon = TAB_ICONS[index];
              return (
                <li key={label}>
                  <h3>
                    <TabIcon aria-hidden="true" />
                    {label}
                  </h3>
                  <p>{text}</p>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}
    </section>
  );
}

/* --------------------------------------------------------------------------- */
/* Exercise library: vertical scroll drives a horizontal gallery.               */
/* --------------------------------------------------------------------------- */

function Library({ t, language, reduce }: { t: Copy; language: Language; reduce: boolean }) {
  const ref = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [distance, setDistance] = useState(0);
  const [near, setNear] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -distance]);

  // Native lazy loading does not follow cards that slide in sideways, so fetch the whole
  // gallery once the section is about two screens away instead of leaving blank cards.
  useEffect(() => {
    const section = ref.current;
    if (!section || typeof IntersectionObserver === "undefined") return setNear(true);
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), { rootMargin: "1800px 0px" });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (track) setDistance(Math.max(0, track.scrollWidth - window.innerWidth + 48));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section ref={ref} className={reduce ? "gl-library is-static" : "gl-library"} aria-labelledby="library-title">
      <div className="gl-library-sticky">
        <div className="gl-wrap gl-library-head">
          <Chapter label={t.library.chapter} />
          <div className="gl-library-intro">
            <div className="gl-count" data-reveal>
              <strong>{t.library.count}</strong>
              <span>{t.library.countLabel}</span>
            </div>
            <h2 id="library-title" className="gl-h2" data-reveal>
              {t.library.title} <em>{t.library.accent}</em>
            </h2>
            <p className="gl-body" data-reveal>{t.library.body}</p>
          </div>
        </div>
        <motion.div ref={trackRef} className="gl-track" style={reduce ? undefined : { x }}>
          {EXERCISES.map(([slug, name, muscle, equipment], index) => (
            <figure key={slug} className="gl-card">
              <img
                src={near || index < 4 ? media(`personal-projects/gym-log/exercises/${slug}.webp`) : undefined}
                alt=""
                decoding="async"
                width={560}
                height={560}
              />
              <figcaption>
                <span className={muscle === "Cardio" ? "gl-tag gl-tag-cardio" : "gl-tag"}>
                  {language === "zh" ? MUSCLE_ZH[muscle] : muscle}
                </span>
                <strong>{name}</strong>
                <span className="gl-card-equipment">{equipment}</span>
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------- */

function Logging({ t }: { t: Copy }) {
  return (
    <section className="gl-section" aria-labelledby="logging-title">
      <div className="gl-wrap">
        <Chapter label={t.logging.chapter} />
        <h2 id="logging-title" className="gl-h2" data-reveal>
          {t.logging.title} <em>{t.logging.accent}</em>
        </h2>
        <div className="gl-sets">
          {[
            [t.logging.strengthTitle, t.logging.strength, Dumbbell],
            [t.logging.cardioTitle, t.logging.cardio, Timer],
          ].map(([title, fields, Icon]) => {
            const SetIcon = Icon as LucideIcon;
            return (
              <article key={title as string} className="gl-set" data-reveal>
                <h3>
                  <SetIcon aria-hidden="true" />
                  {title as string}
                </h3>
                <dl>
                  {(fields as readonly (readonly [string, string])[]).map(([field, unit]) => (
                    <div key={field}>
                      <dt>{field}</dt>
                      <dd>{unit}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            );
          })}
        </div>
        <div className="gl-status" data-reveal>
          <span className="gl-status-label">{t.logging.statusTitle}</span>
          <ul>
            {t.logging.status.map((status) => (
              <li key={status}>{status}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ProgressSection({ t }: { t: Copy }) {
  return (
    <section className="gl-section gl-section-deep" aria-labelledby="progress-title">
      <div className="gl-wrap">
        <Chapter label={t.progress.chapter} />
        <div className="gl-split">
          <div className="gl-progress-copy" data-reveal>
            <h2 id="progress-title" className="gl-h2">
              {t.progress.title} <em>{t.progress.accent}</em>
            </h2>
            <div className="gl-formula">
              <span>{t.progress.formulaLabel}</span>
              <code>{t.progress.formula}</code>
            </div>
            <div className="gl-chip-groups">
              {t.progress.groups.map(([label, chips]) => (
                <div key={label}>
                  <span>{label}</span>
                  <ul>
                    {chips.map((chip, index) => (
                      <li key={chip} className={index === 0 ? "is-on" : undefined}>
                        {chip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <figure className="gl-curve" data-reveal>
            <svg viewBox="0 0 560 300" aria-hidden="true">
              {[60, 130, 200].map((y) => (
                <line key={y} x1="0" x2="560" y1={y} y2={y} className="gl-curve-grid" />
              ))}
              <line x1="0" x2="560" y1="270" y2="270" className="gl-curve-axis" />
              <path
                className="gl-curve-line"
                pathLength={1}
                d="M0 236 C 60 230, 90 214, 140 206 S 220 190, 260 168 S 330 150, 370 128 S 450 96, 490 84 S 540 66, 560 60"
              />
              {[[140, 206], [260, 168], [370, 128], [490, 84]].map(([cx, cy]) => (
                <circle key={cx} cx={cx} cy={cy} r="5" className="gl-curve-dot" />
              ))}
            </svg>
            <figcaption>{t.progress.curveNote}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function LocalFirst({ t }: { t: Copy }) {
  return (
    <section className="gl-section" aria-labelledby="local-title">
      <div className="gl-wrap">
        <Chapter label={t.local.chapter} />
        <h2 id="local-title" className="gl-h2" data-reveal>
          {t.local.title} <em>{t.local.accent}</em>
        </h2>
        <div className="gl-path" data-reveal>
          <code>{t.local.path}</code>
        </div>
        <ol className="gl-points" data-reveal>
          {t.local.points.map(([title, body], index) => (
            <li key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Evolution({ t }: { t: Copy }) {
  return (
    <section className="gl-section gl-section-deep" aria-label={t.evolution.chapter}>
      <div className="gl-wrap">
        <Chapter label={t.evolution.chapter} />
        <div className="gl-evolution" data-reveal>
          <div className="gl-era">
            <span>V2 · Web</span>
            <h3>{t.evolution.before}</h3>
            <p>{t.evolution.beforeStack}</p>
            <a href={V2_REPO} target="_blank" rel="noreferrer">
              {t.evolution.beforeLink}
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
          <div className="gl-era-line" aria-hidden="true">
            <i />
          </div>
          <div className="gl-era gl-era-now">
            <span>Now · macOS</span>
            <h3>{t.evolution.after}</h3>
            <p>{t.evolution.afterStack}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Closing({ t, portfolioHref }: { t: Copy; portfolioHref: string }) {
  return (
    <section className="gl-closing" aria-labelledby="closing-title">
      <div className="gl-wrap">
        <dl className="gl-stats" data-reveal>
          {t.closing.stats.map(([value, label]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <h2 id="closing-title" className="gl-closing-title" data-reveal>
          {t.closing.title} <em>{t.closing.accent}</em>
        </h2>
        <p className="gl-closing-note" data-reveal>{t.closing.note}</p>
        <a className="gl-btn" href={portfolioHref} data-reveal>
          {t.closing.back}
          <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

export default function GymLogPage({ initialLanguage }: { initialLanguage: Language }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const pageRef = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion() ?? false;
  const t = COPY[language];
  const portfolioHref = `${base}?lang=${language}#personal-training-project`;

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.title = t.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.description.replace(/[​⁠]/g, ""));
  }, [language, t]);

  // Scroll reveals: armed only once JS runs and motion is allowed.
  useEffect(() => {
    const page = pageRef.current;
    if (!page || prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    page.classList.add("gl-motion");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    );
    page.querySelectorAll("[data-reveal]").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  function toggleLanguage() {
    const next: Language = language === "en" ? "zh" : "en";
    setLanguage(next);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", next);
    window.history.replaceState(window.history.state, "", url);
  }

  return (
    <main ref={pageRef} className="gl-page" lang={language === "zh" ? "zh-CN" : "en"}>
      <PortfolioBackLink href={portfolioHref} language={language} ariaLabel={t.backLabel} />
      <button type="button" className="gl-lang" onClick={toggleLanguage} aria-label={t.languageLabel}>
        {t.language}
      </button>
      <Hero t={t} reduce={reduce} />
      <Tabs t={t} reduce={reduce} />
      <Library t={t} language={language} reduce={reduce} />
      <Logging t={t} />
      <ProgressSection t={t} />
      <LocalFirst t={t} />
      <Evolution t={t} />
      <Closing t={t} portfolioHref={portfolioHref} />
    </main>
  );
}
