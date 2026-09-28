"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import PortfolioBackLink from "../../components/portfolio-back-link";
import { readStoredMotionPause, storeMotionPause, VideoPauseButton } from "../../components/resilient-background-video";
import styles from "./personal-training.module.css";
import StrengthDemo from "./strength-demo";
import type { StrengthDemoCopy } from "./strength-demo";

const appBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const mediaBasePath = `${appBasePath}/media`;

const HERO_VIDEO_URL = `${appBasePath}/personal-projects/personal-training/video/ocean-hero-720p.mp4`;
const HERO_VIDEO_POSTER = `${appBasePath}/personal-projects/personal-training/backgrounds/personal-training-motivation.webp`;

export type Language = "en" | "zh";
type HeroVideoState = "loading" | "playing" | "poster" | "paused" | "reduced-motion";

const COPY = {
  en: {
    meta: {
      title: "Personal Training — Zishun Gao",
      description: "A personal full-stack project for recording strength, cardio and rest-day sessions.",
    },
    backLabel: "Back to Portfolio — return to the Personal Training project card",
    navigation: {
      label: "Personal Training project navigation",
      items: [
        ["Overview", "top"],
        ["Motivation", "motivation"],
        ["Custom Demo", "customisation"],
        ["Training Models", "training-models"],
        ["Progress", "progress"],
        ["Architecture", "architecture"],
      ],
      language: "中文",
      languageLabel: "Switch to Chinese",
    },
    hero: {
      eyebrow: "PERSONAL TRAINING WEBSITE V2 · INDEPENDENT FULL-STACK PROJECT",
      title: "A PERSONAL TRAINING LOG FOR STRENGTH AND CARDIO RECORDS",
      description: "A mobile-first personal project for recording user-named strength exercises and machines, structured sets, cardio sessions, rest days and simple summaries based on saved records.",
      explore: "Explore training models",
    },
    fleetLabel: "Training models overview",
    closeFleet: "Close training models viewer",
    close: "CLOSE",
    fleet: [
      {
        src: `${mediaBasePath}/video/training-strength.mp4`,
        poster: `${mediaBasePath}/posters/training-strength.jpg`,
        title: "STRENGTH",
        target: "customisation",
        action: "TRY THE DEMO",
        specs: ["User-named exercise or machine", "Setup notes", "Warm-up and working sets", "Weight, reps and optional notes", "Dated training sessions"],
      },
      {
        src: `${mediaBasePath}/video/training-cardio.mp4`,
        poster: `${mediaBasePath}/posters/training-cardio.jpg`,
        title: "CARDIO",
        target: "training-models",
        action: "SEE THE MODEL",
        specs: ["User-named activities", "Six fixed activity categories", "Duration and calories", "Conditional distance fields", "Kilometres or miles", "Optional notes"],
      },
      {
        src: `${mediaBasePath}/video/training-progress.mp4`,
        poster: `${mediaBasePath}/posters/training-progress.jpg`,
        title: "PROGRESS",
        target: "progress",
        action: "READ THE TREND",
        specs: ["Working sets only", "Average weight over time", "Selected cardio date ranges", "Cumulative calorie totals", "No AI or readiness scoring"],
      },
    ],
    story: {
      motivation: {
        index: "01 · MOTIVATION",
        title: "WHY THE EXERCISE LIST IS USER DEFINED",
        lead: "I started this project because equipment, layouts, names and machine condition can vary from one gym to the next.",
        body: "A fixed library cannot describe every real environment. I therefore made strength exercises and machines user-named, with setup notes for details such as a seat position, grip or machine number. It is a focused design choice for my logging routine, not a claim that one approach suits every person or outperforms every established product.",
      },
      customisation: {
        index: "02 · CUSTOM DEMO",
        title: "EDIT A FICTIONAL EXERCISE AND SESSION",
        body: "Rename the fictional machine, adjust its setup note, and build temporary warm-up or working sets. This demonstration exists only in this page's React memory.",
      },
      models: {
        index: "03 · TRAINING MODELS & PROGRESS",
        title: "STRENGTH CARDIO AND REST DAY RECORDS",
        body: "Strength and Cardio keep different fields because they describe different kinds of session. Progress reads from those records without inventing a scoring layer.",
        cards: [
          { title: "Strength", body: "Each dated session links a user-named exercise or machine to warm-up or working sets. A set records weight, reps and an optional note; the exercise can also retain its own setup note.", bullets: ["User-named exercise or machine", "Date and set type", "Weight, repetitions and set note"] },
          { title: "Cardio", body: "Cardio uses a separate model with user-named activities inside six fixed categories: indoor walk, outdoor walk, indoor run, outdoor run, cycling and elliptical.", bullets: ["Duration and calories", "Conditional distance fields", "Kilometres or miles and an optional note"] },
          { title: "Rest Day", body: "Recovery in the application means a Rest Day record. It is not a physiological recovery score, wearable-derived readiness measure or medical assessment.", bullets: [] },
        ],
      },
      progress: {
        index: "PROGRESS · READ-ONLY DERIVATION",
        title: "HOW THE SUMMARY VALUES ARE CALCULATED",
        ariaLabel: "Illustrative progress calculation",
        workingSets: "WORKING SETS",
        average: "average kg · illustrative",
        cardioRange: "SELECTED CARDIO RANGE",
        cumulative: "cumulative kcal · illustrative",
        body: "Strength excludes warm-up sets and calculates average working-set weight over time for the selected exercise. Cardio totals kcal inside a selected date range. These are lightweight descriptive trends—not AI, readiness, medical advice or a professional performance judgement.",
      },
      architecture: {
        index: "04 · ARCHITECTURE & LIMITS",
        title: "TECHNICAL STRUCTURE AND CURRENT LIMITS",
        stackTitle: "Application stack",
        stack: [["Interface", "Next.js 16.2.9 · React 19.2.7"], ["Language", "TypeScript"], ["Styling", "Tailwind CSS"], ["Data layer", "Supabase SSR / JS"], ["Write boundary", "Authenticated server actions"], ["Ownership", "Owner-scoped RLS"]],
        boundaryTitle: "What this page shows and does not show",
        paragraphs: [
          "The application is an independent personal full-stack project. Its authenticated server actions and owner-scoped Row Level Security are design mechanisms for separating records, not claims of a security audit or commercial-scale maturity.",
          "This showcase does not connect to private data. Every demo value is fictional, temporary and reset by refresh. The project may still have gaps in UX refinement, automated test coverage, accessibility and scaling.",
          "Established commercial products have broader feature sets, exercise libraries, ecosystems and teams. This project takes a narrower focus: user-defined names and setup notes, separate Strength and Cardio models, owner-scoped permissions and an independently implemented full-stack workflow.",
        ],
      },
    },
    demo: {
      badge: "DEMO",
      eyebrow: "INTERACTIVE DEMO · ILLUSTRATIVE DATA ONLY",
      session: "Illustrative session",
      title: "A temporary strength set builder",
      disclosure: "No account is created. Nothing is saved. Refreshing this page resets the demo.",
      nameLabel: "Exercise or machine name",
      setupLabel: "Setup note",
      setsLegend: "Temporary training sets",
      columns: ["Set type", "Weight (kg)", "Reps", "Action"],
      setTypeLabel: (index: number) => `Set ${index} type`,
      setWeightLabel: (index: number) => `Set ${index} weight in kilograms`,
      setRepsLabel: (index: number) => `Set ${index} repetitions`,
      removeSetLabel: (index: number) => `Remove demo set ${index}`,
      remove: "Remove",
      warmup: "Warm-up",
      working: "Working",
      add: "Add demo set",
      reset: "Reset demo",
      status: { ready: "Illustrative session ready.", added: "Temporary demo set added.", removed: "Temporary demo set removed.", reset: "Demo reset to its fictional starting values." },
      boundary: "Not connected to the private training app · all values are fictional and temporary.",
      defaults: { name: "Studio Cable Row — Demo", setup: "Seat 4 · neutral grip · illustrative" },
    } satisfies StrengthDemoCopy,
  },
  zh: {
    meta: {
      title: "个人训练记录 — 高子舜",
      description: "一个​用于​记录​力量​训练、​有氧​训练​和休息日​的个人​全栈​项目。",
    },
    backLabel: "返回​作品​集中​的个人​训练​项目",
    navigation: {
      label: "个人​训练​项目​导航",
      items: [["概览", "top"], ["设计动机", "motivation"], ["自定​义演示", "customisation"], ["训练模型", "training-models"], ["进度", "progress"], ["技术架构", "architecture"]],
      language: "EN",
      languageLabel: "切换​至英文",
    },
    hero: {
      eyebrow: "个人​训练​网站​ V​2 · 独立​全栈​项目",
      title: "记录​力量​与有​氧训练​的个人​项目",
      description: "一个​以移动​端为​先的​个人​项目，​用于​记录​用户​自定​义名称​的力量​动作​与器械、​结构​化训练组、​有氧​训练、​休息日，​以及​基于​已保存记录生成​的简单​汇总。",
      explore: "浏览​训练模型",
    },
    fleetLabel: "训练模型​概览",
    closeFleet: "关闭​训练模型​浏览器",
    close: "关闭",
    fleet: [
      { src: `${mediaBasePath}/video/training-strength.mp4`, poster: `${mediaBasePath}/posters/training-strength.jpg`, title: "力量训练", target: "customisation", action: "体验演示", specs: ["用户​自定​义动作​或器​械名称", "器械​设置备注", "热身组​与正式组", "重量、⁠次数​与可​选备注", "按日期​记录训练"] },
      { src: `${mediaBasePath}/video/training-cardio.mp4`, poster: `${mediaBasePath}/posters/training-cardio.jpg`, title: "有氧训练", target: "training-models", action: "查看模型", specs: ["用户​自定​义活动​名称", "六种​固定​活动​类别", "时长​与热量", "按条件​显示​距离​字段", "公里​或英里", "可选备注"] },
      { src: `${mediaBasePath}/video/training-progress.mp4`, poster: `${mediaBasePath}/posters/training-progress.jpg`, title: "训练进度", target: "progress", action: "查看趋势", specs: ["仅统计​正式组", "随时间​变化​的平均​重量", "选定​的有氧​日期​范围", "累计​热量​总计", "不使用​ A​I ​或准备​度评分"] },
    ],
    story: {
      motivation: {
        index: "01 · 设​计动机",
        title: "为什么​动作​清单​由用户​自定义",
        lead: "我启动​这个​项目，​是因为​不同​健身房​的器械、​布局、​命名​方式​和器械​状态​都可能​有所​不同。",
        body: "固定动​作库​无法​描述​每一​种真实​环境。​因此，​我让​用户​自行命​名力量动作​和器械，​并通过​设置​备注记​录座​椅位置、​握法​或器械​编号​等细节。​这只​是针对​我个​人记​录习惯​的一​项聚焦​设计​选择，​并不​声称​一种​方法​适合​所有​人，​也不​声称​它优于​所有​成熟​产品。",
      },
      customisation: {
        index: "02 · 自定​义演示",
        title: "编辑​一项​虚构动作​和训练​记录",
        body: "你可以​重命​名这​台虚构器械、​调整​设置​备注，​并临时​添加热身组​或正式​组。​所有​演示​数据​只存​在于​本页面​的 Reac​t ​内存中。",
      },
      models: {
        index: "03 · 训练​模型​与进度",
        title: "力量、⁠有氧​与休息​日记录",
        body: "力量​训练​与有氧训练​使用​不同​字段，​因为​它们​描述​的是​不同​类型​的训练。​进度​汇总​只读取​这些​记录，​不额​外虚​构评​分层。",
        cards: [
          { title: "力量训练", body: "每个​按日期​记录​的训练​都会​把用户​自定义​的动作​或器械，​与热身组​或正式​组关联起来。​每组​记录​重量、​次数​和可​选备注；​动作本身​也可以​保留器​械设置​备注。", bullets: ["用户​自定​义动作​或器​械名称", "日期​与训练​组类型", "重量、⁠次数​与训练​组备注"] },
          { title: "有氧训练", body: "有氧训练​使用​独立​模型。​用户​可以​自定​义活动​名称，​并将​其归入​六种​固定​类别：​室内​步行、​户外​步行、​室内​跑步、​户外​跑步、​骑行​和椭圆机。", bullets: ["时长​与热量", "按条件​显示​距离​字段", "公里​或英里，⁠以及​可选备注"] },
          { title: "休息日", body: "应用​中的​恢复仅​指一​条休息日​记录。​它不​是生理​恢复​评分、​可穿​戴设备​生成​的准备​度指标，​也不​是医学​评估。", bullets: [] },
        ],
      },
      progress: {
        index: "进度​ · 只读派生​结果",
        title: "汇总​数值​如何​计算",
        ariaLabel: "示意性​的进度​计算",
        workingSets: "正式组",
        average: "平均​公斤​数 ·​ 示例",
        cardioRange: "选定​的有氧​日期​范围",
        cumulative: "累计千卡 ·​ 示例",
        body: "力量​趋势会​排除​热身组，​并计算所​选动​作的​平均​正式​组重量​随时间​的变化。​有氧​趋势会​累计​所选日期​范围内​的千卡数。​这些​只是​轻量​的描述性​趋势，​不是​ AI、​准备​度评估、​医疗​建议​或专业​表现​判断。",
      },
      architecture: {
        index: "04 · 技术​架构​与边界",
        title: "技术​结构​与当前​限制",
        stackTitle: "应用​技术栈",
        stack: [["界面", "Next.js 16.2.9 · React 19.2.7"], ["语言", "TypeScript"], ["样式", "Tailwind CSS"], ["数据层", "Supabase SSR / JS"], ["写入边界", "Authenticated server actions"], ["数据​所有权", "Owner-scoped RLS"]],
        boundaryTitle: "本页面​展示​与未​展示​的内容",
        paragraphs: [
          "该应用​是一​个独立​的个人​全栈​项目。​Authenti​cated server action​s ​与 owner​-scoped Row Level Securit​y ​是用于​隔离​记录​的设计​机制，​并不​代表​项目​已经​通过​安全​审计​或达到​商业​规模​的成​熟度。",
          "本展示​页不​会连接​任何​私人​数据。​所有​演示​数值​均为​虚构​的临时​数据，​刷新​页面​后会​重置。​项目​在 U​X 精​细度、​自动化​测试​覆盖、​无障碍​和扩展性​方面​仍可能​存在​不足。",
          "成熟​商业​产品​拥有​更广泛​的功能、​动作库、​生态​系统​和团队。​这个​项目​采用​了更​聚焦​的范围：​用户​自定​义名称​与设置​备注、​独立​的 S​trengt​h ​和 Cardio ​模型、​owner​-scoped 权限，​以及​独立​实现​的全栈​工作流。",
        ],
      },
    },
    demo: {
      badge: "演示",
      eyebrow: "交互​演示 · 仅​使用​示例​数据",
      session: "示例​训练记录",
      title: "临时​力量​训练​组编辑器",
      disclosure: "不会​创建​账户，​也不​会保存​任何​内容。​刷新​页面​会重置本​演示。",
      nameLabel: "动作​或器​械名称",
      setupLabel: "器械​设置备注",
      setsLegend: "临时​训练组",
      columns: ["训练​组类型", "重量​（kg）", "次数", "操作"],
      setTypeLabel: (index: number) => `第 ${index} 组的类型`,
      setWeightLabel: (index: number) => `第 ${index} 组的重量（公斤）`,
      setRepsLabel: (index: number) => `第 ${index} 组的次数`,
      removeSetLabel: (index: number) => `移除第 ${index} 个演示训练组`,
      remove: "移除",
      warmup: "热身组",
      working: "正式组",
      add: "添加​演示​训练组",
      reset: "重置演示",
      status: { ready: "示例​训练​记录​已准备​就绪。", added: "已添​加临时​演示​训练组。", removed: "已移除​临时​演示​训练组。", reset: "演示​已重置为​虚构​的初始值。" },
      boundary: "未连​接私人​训练​应用 · 所有​数值​均为​虚构​的临时​数据。",
      defaults: { name: "坐姿绳索划船 — 演示", setup: "座椅 4 · 对​握 ·​ 示例" },
    } satisfies StrengthDemoCopy,
  },
} as const;

type LocalisedCopy = (typeof COPY)[Language];
type FleetItem = LocalisedCopy["fleet"][number];
type FleetStyle = CSSProperties & { "--fleet-poster": string };

const titleVariants = {
  hidden: { opacity: 0, y: 40, transition: { duration: 0.48 } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.96 } },
};

const titleContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function ProjectNavigation({ copy, onNavigate, onToggleLanguage }: {
  copy: LocalisedCopy["navigation"];
  onNavigate: (target: string) => void;
  onToggleLanguage: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  return (
    <nav className={styles.projectNavigation} aria-label={copy.label} onKeyDown={(event) => { if (event.key === "Escape") { setMenuOpen(false); menuRef.current?.focus(); } }}>
      <div className={styles.sectionNavigation} data-menu-open={menuOpen}>
        <button ref={menuRef} type="button" className={styles.mobileMenuToggle} aria-expanded={menuOpen} aria-controls="training-navigation" onClick={() => setMenuOpen((open) => !open)}>{copy.language === "中文" ? (menuOpen ? "Close menu" : "Menu") : (menuOpen ? "关闭菜单" : "菜单")}</button>
        <div id="training-navigation" className={styles.navigationItems}>
        {copy.items.map(([label, target]) => (
          <a key={target} href={`#${target}`} onClick={(event) => { event.preventDefault(); setMenuOpen(false); onNavigate(target); }}>
            {label}
          </a>
        ))}
        </div>
        <button type="button" onClick={onToggleLanguage} aria-label={copy.languageLabel}>
          {copy.language}
        </button>
      </div>
    </nav>
  );
}

function FleetVideo({ item, index, onNavigate }: { item: FleetItem; index: number; onNavigate: (target: string) => void }) {
  const articleRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [videoState, setVideoState] = useState<"poster" | "loading" | "playing">("poster");
  const prefersReducedMotion = useReducedMotion();

  const play = useCallback(() => {
    setIsActive(true);
    if (prefersReducedMotion) return;
    setVideoState("loading");
    const playback = videoRef.current?.play();
    if (playback) void playback.catch(() => setVideoState("poster"));
  }, [prefersReducedMotion]);

  const pause = useCallback(() => {
    setIsActive(false);
    videoRef.current?.pause();
    setVideoState("poster");
  }, []);

  useEffect(() => {
    const article = articleRef.current;
    const video = videoRef.current;
    if (!article || prefersReducedMotion) return;

    const touchPointer = window.matchMedia("(hover: none), (pointer: coarse)");
    let observer: IntersectionObserver | null = null;
    const updateObserver = () => {
      observer?.disconnect();
      observer = null;
      if (!touchPointer.matches) { pause(); return; }
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.55) play();
        else pause();
      }, { threshold: [0, 0.55, 0.75] });
      observer.observe(article);
    };

    updateObserver();
    touchPointer.addEventListener("change", updateObserver);
    return () => {
      observer?.disconnect();
      touchPointer.removeEventListener("change", updateObserver);
      video?.pause();
    };
  }, [pause, play, prefersReducedMotion]);

  const fleetStyle: FleetStyle = { "--fleet-poster": `url(${item.poster})` };
  return (
    <motion.article
      ref={articleRef}
      className={styles.fleetColumn}
      initial={false}
      animate={{ x: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 1.56, delay: prefersReducedMotion ? 0 : index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={play}
      onMouseLeave={pause}
      onFocus={play}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) pause(); }}
      data-active={isActive}
      data-video-state={videoState}
      style={fleetStyle}
    >
      <video ref={videoRef} className={styles.fleetVideo} muted loop playsInline preload="metadata" aria-hidden="true" poster={item.poster} onPlaying={() => setVideoState("playing")} onWaiting={() => setVideoState("poster")} onStalled={() => setVideoState("poster")} onError={() => setVideoState("poster")}>
        <source src={item.src} type="video/mp4" />
      </video>
      <div className={styles.fleetShade} />
      <div className={styles.fleetContent}>
        <div className={styles.fleetMask}><h2>{item.title}</h2></div>
        <dl>
          {item.specs.map((spec, specIndex) => (
            <motion.div key={spec} initial={false} animate={{ y: 0, opacity: 1 }} transition={{ duration: prefersReducedMotion ? 0 : 0.45, delay: prefersReducedMotion ? 0 : specIndex * 0.045 }}>
              <dt>{String(specIndex + 1).padStart(2, "0")}</dt><dd>{spec}</dd>
            </motion.div>
          ))}
        </dl>
        <button type="button" className={styles.viewButton} onClick={() => onNavigate(item.target)}>{item.action}</button>
      </div>
    </motion.article>
  );
}

function RevealBlock({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div className={className} initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: prefersReducedMotion ? 0 : 0.72, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

function ProjectStory({ language, copy }: { language: Language; copy: LocalisedCopy }) {
  const story = copy.story;
  return (
    <div className={styles.story}>
      <section id="motivation" className={`${styles.storySection} ${styles.motivationSection}`} tabIndex={-1}>
        <RevealBlock className={styles.sectionHeadingBlock}><p className={styles.sectionIndex}>{story.motivation.index}</p><h2 tabIndex={-1}>{story.motivation.title}</h2></RevealBlock>
        <RevealBlock className={styles.motivationCopy}><p className={styles.leadCopy}>{story.motivation.lead}</p><p>{story.motivation.body}</p></RevealBlock>
      </section>

      <section id="customisation" className={`${styles.storySection} ${styles.customisationSection}`} tabIndex={-1}>
        <RevealBlock className={styles.sectionHeadingBlock}><p className={styles.sectionIndex}>{story.customisation.index}</p><h2 tabIndex={-1}>{story.customisation.title}</h2><p>{story.customisation.body}</p></RevealBlock>
        <RevealBlock className={styles.demoWrap}><StrengthDemo language={language} copy={copy.demo} /></RevealBlock>
      </section>

      <section id="training-models" className={`${styles.storySection} ${styles.modelsSection}`} tabIndex={-1}>
        <RevealBlock className={styles.sectionHeadingBlock}><p className={styles.sectionIndex}>{story.models.index}</p><h2 tabIndex={-1}>{story.models.title}</h2><p>{story.models.body}</p></RevealBlock>
        <div className={styles.modelGrid}>
          {story.models.cards.map((card, index) => (
            <RevealBlock className={styles.modelCard} key={card.title}>
              <p className={styles.modelNumber}>{String(index + 1).padStart(2, "0")}</p><h3>{card.title}</h3><p>{card.body}</p>
              {card.bullets.length > 0 ? <ul>{card.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
            </RevealBlock>
          ))}
        </div>

        <RevealBlock className={styles.progressPanel}>
          <div id="progress" className={styles.progressAnchor} tabIndex={-1}><p className={styles.sectionIndex}>{story.progress.index}</p><h3 tabIndex={-1}>{story.progress.title}</h3></div>
          <div className={styles.progressDiagram} aria-label={story.progress.ariaLabel}>
            <div><span>{story.progress.workingSets}</span><strong>32.5</strong><small>{story.progress.average}</small></div>
            <div className={styles.trendLine} aria-hidden="true"><i /><i /><i /><i /></div>
            <div><span>{story.progress.cardioRange}</span><strong>1,840</strong><small>{story.progress.cumulative}</small></div>
          </div>
          <p>{story.progress.body}</p>
        </RevealBlock>
      </section>

      <section id="architecture" className={`${styles.storySection} ${styles.architectureSection}`} tabIndex={-1}>
        <RevealBlock className={styles.sectionHeadingBlock}><p className={styles.sectionIndex}>{story.architecture.index}</p><h2 tabIndex={-1}>{story.architecture.title}</h2></RevealBlock>
        <RevealBlock className={styles.architectureGrid}>
          <div className={styles.stackPanel}>
            <p>{story.architecture.stackTitle}</p>
            <ul>{story.architecture.stack.map(([label, value]) => <li key={label}><span>{label}</span><strong>{value}</strong></li>)}</ul>
          </div>
          <div className={styles.boundaryCopy}>
            <h3>{story.architecture.boundaryTitle}</h3>
            {story.architecture.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </RevealBlock>
      </section>
    </div>
  );
}

export default function PersonalTrainingHero({ initialLanguage = "en" }: { initialLanguage?: Language }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [isFleetOpen, setIsFleetOpen] = useState(false);
  const [heroVideoState, setHeroVideoState] = useState<HeroVideoState>("loading");
  const [heroUserPaused, setHeroUserPaused] = useState(false);
  const heroUserPausedRef = useRef(false);
  const resolvedUrlLanguage = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const exploreButtonRef = useRef<HTMLButtonElement>(null);
  const fleetCloseRef = useRef<HTMLButtonElement>(null);
  const fleetOverlayRef = useRef<HTMLElement>(null);
  const copy = COPY[language];
  const portfolioHref = `${appBasePath}/?lang=${language}#personal-training-project`;

  useEffect(() => {
    const url = new URL(window.location.href);
    if (!resolvedUrlLanguage.current) {
      resolvedUrlLanguage.current = true;
      const requestedLanguage: Language = url.searchParams.get("lang") === "zh" ? "zh" : "en";
      if (requestedLanguage !== language) {
        const timer = window.setTimeout(() => setLanguage(requestedLanguage), 0);
        return () => window.clearTimeout(timer);
      }
    }

    const htmlLanguage = language === "zh" ? "zh-CN" : "en";
    document.documentElement.lang = htmlLanguage;
    document.title = copy.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", copy.meta.description);
    if (url.searchParams.get("lang") !== language) {
      url.searchParams.set("lang", language);
      window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
    }
  }, [copy.meta.description, copy.meta.title, language]);

  const toggleLanguage = useCallback(() => {
    const nextLanguage: Language = language === "en" ? "zh" : "en";
    setLanguage(nextLanguage);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", nextLanguage);
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }, [language]);

  const requestHeroPlayback = useCallback(async () => {
    const video = backgroundVideoRef.current;
    if (!video || prefersReducedMotion || heroUserPausedRef.current || document.visibilityState !== "visible") return;
    if (!video.paused && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) { setHeroVideoState("playing"); return; }
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    if (video.error) video.load();
    setHeroVideoState("loading");
    try {
      await video.play();
      if (!video.paused && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) setHeroVideoState("playing");
    } catch { setHeroVideoState("poster"); }
  }, [prefersReducedMotion]);

  const handleHeroVideoPlaying = useCallback(() => {
    if (prefersReducedMotion) { backgroundVideoRef.current?.pause(); setHeroVideoState("reduced-motion"); }
    else if (heroUserPausedRef.current) { backgroundVideoRef.current?.pause(); setHeroVideoState("paused"); }
    else setHeroVideoState("playing");
  }, [prefersReducedMotion]);

  const showHeroPoster = useCallback(() => { if (!prefersReducedMotion) setHeroVideoState(heroUserPausedRef.current ? "paused" : "poster"); }, [prefersReducedMotion]);

  const toggleHeroPlayback = useCallback(() => {
    const nextPaused = !heroUserPausedRef.current;
    heroUserPausedRef.current = nextPaused;
    setHeroUserPaused(nextPaused);
    storeMotionPause(nextPaused);
    if (nextPaused) {
      backgroundVideoRef.current?.pause();
      setHeroVideoState("paused");
    } else {
      void requestHeroPlayback();
    }
  }, [requestHeroPlayback]);

  useEffect(() => {
    heroUserPausedRef.current = readStoredMotionPause();
    if (!heroUserPausedRef.current) return;
    backgroundVideoRef.current?.pause();
    const frame = window.requestAnimationFrame(() => {
      setHeroUserPaused(true);
      setHeroVideoState((current) => current === "reduced-motion" ? current : "paused");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const video = backgroundVideoRef.current;
    if (!hero || !video) return;
    if (prefersReducedMotion) {
      video.pause();
      const frame = window.requestAnimationFrame(() => setHeroVideoState("reduced-motion"));
      return () => window.cancelAnimationFrame(frame);
    }

    const heroRect = hero.getBoundingClientRect();
    let isHeroVisible = heroRect.bottom > 0 && heroRect.top < window.innerHeight;
    const updatePlayback = () => {
      if (isHeroVisible && document.visibilityState === "visible") void requestHeroPlayback();
      else { video.pause(); setHeroVideoState(heroUserPausedRef.current ? "paused" : "poster"); }
    };
    const retryFromUserGesture = () => { if (isHeroVisible && video.paused && !heroUserPausedRef.current) void requestHeroPlayback(); };
    const observer = new IntersectionObserver(([entry]) => { isHeroVisible = entry.isIntersecting && entry.intersectionRatio >= 0.05; updatePlayback(); }, { threshold: [0, 0.05, 0.25] });
    observer.observe(hero);
    document.addEventListener("visibilitychange", updatePlayback);
    document.addEventListener("touchend", retryFromUserGesture, { capture: true, passive: true });
    document.addEventListener("click", retryFromUserGesture, true);
    document.addEventListener("keydown", retryFromUserGesture, true);
    window.addEventListener("pageshow", updatePlayback);
    window.addEventListener("focus", updatePlayback);
    updatePlayback();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updatePlayback);
      document.removeEventListener("touchend", retryFromUserGesture, true);
      document.removeEventListener("click", retryFromUserGesture, true);
      document.removeEventListener("keydown", retryFromUserGesture, true);
      window.removeEventListener("pageshow", updatePlayback);
      window.removeEventListener("focus", updatePlayback);
      video.pause();
    };
  }, [prefersReducedMotion, requestHeroPlayback]);

  useEffect(() => {
    if (!isFleetOpen) return;
    document.documentElement.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsFleetOpen(false);
        requestAnimationFrame(() => exploreButtonRef.current?.focus());
        return;
      }
      if (event.key !== "Tab" || !fleetOverlayRef.current) return;
      const focusable = [...fleetOverlayRef.current.querySelectorAll<HTMLElement>("button")];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    requestAnimationFrame(() => fleetCloseRef.current?.focus());
    window.addEventListener("keydown", handleKeyDown);
    return () => { document.documentElement.style.overflow = ""; window.removeEventListener("keydown", handleKeyDown); };
  }, [isFleetOpen]);

  const closeFleet = () => { setIsFleetOpen(false); requestAnimationFrame(() => exploreButtonRef.current?.focus()); };
  const navigateToSection = useCallback((target: string) => {
    setIsFleetOpen(false);
    window.setTimeout(() => {
      const section = document.getElementById(target);
      section?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      if (target !== "top") section?.focus({ preventScroll: true });
    }, prefersReducedMotion ? 0 : 80);
  }, [prefersReducedMotion]);

  return (
    <main className={styles.page} lang={language === "zh" ? "zh-CN" : "en"}>
      <section ref={heroRef} id="top" className={styles.heroViewport} aria-labelledby="personal-training-hero-title">
        <PortfolioBackLink href={portfolioHref} language={language} ariaLabel={copy.backLabel} />
        <ProjectNavigation copy={copy.navigation} onNavigate={navigateToSection} onToggleLanguage={toggleLanguage} />

        <motion.div className={styles.heroHeading} initial={false} animate="visible" variants={titleContainer}>
          <motion.p className={styles.heroEyebrow} initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }}>{copy.hero.eyebrow}</motion.p>
          <h1 id="personal-training-hero-title" className={styles.heroTitle}>
            <motion.span variants={titleVariants}>{copy.hero.title}</motion.span>
          </h1>
        </motion.div>

        <motion.div className={styles.heroMedia} data-video-state={heroVideoState} initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}>
          <div className={styles.background}>
            <video ref={backgroundVideoRef} src={HERO_VIDEO_URL} poster={HERO_VIDEO_POSTER} className={styles.backgroundVideo} autoPlay muted loop playsInline preload="auto" aria-hidden="true" onLoadedData={() => void requestHeroPlayback()} onCanPlay={() => void requestHeroPlayback()} onPlaying={handleHeroVideoPlaying} onWaiting={showHeroPoster} onStalled={showHeroPoster} onError={showHeroPoster} />
          </div>
          <div className={styles.loadingShade} />
          {!prefersReducedMotion ? <VideoPauseButton language={language} paused={heroUserPaused} onToggle={toggleHeroPlayback} className={styles.heroVideoControl} /> : null}
          <div className={styles.heroMediaFooter}>
            <p className={styles.heroDescription}>{copy.hero.description}</p>
            <button ref={exploreButtonRef} type="button" className={styles.exploreButton} onClick={() => setIsFleetOpen(true)}>{copy.hero.explore} <span aria-hidden="true">↗</span></button>
          </div>
        </motion.div>

        <AnimatePresence>
          {isFleetOpen ? (
            <motion.section className={styles.fleetOverlay} ref={fleetOverlayRef} key="fleet" initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0 } }} onAnimationComplete={() => { if (isFleetOpen) fleetCloseRef.current?.focus(); }} role="dialog" aria-modal="true" aria-label={copy.fleetLabel}>
              <button ref={fleetCloseRef} type="button" className={styles.fleetClose} onClick={closeFleet} aria-label={copy.closeFleet}>{copy.close} <span aria-hidden="true">×</span></button>
              {copy.fleet.map((item, index) => <FleetVideo item={item} index={index} key={item.title} onNavigate={navigateToSection} />)}
            </motion.section>
          ) : null}
        </AnimatePresence>
      </section>
      <ProjectStory language={language} copy={copy} />
    </main>
  );
}
