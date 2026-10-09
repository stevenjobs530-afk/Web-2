"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BarChart3, Database, ExternalLink, FileText, Search, ShieldCheck } from "lucide-react";
import Image from "next/image";
import PortfolioBackLink from "../../components/portfolio-back-link";
import ResilientBackgroundVideo from "../../components/resilient-background-video";
import "./apple-case-study.scss";

type Language = "en" | "zh";
const appBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const repositoryUrl =
  "https://github.com/stevenjobs530-afk/Apple-App-Store-Data-Cleaning-Analysis";

const heroVideo = `${appBasePath}/media/video/apple-app-store-hero.mp4`;
const heroPoster = `${appBasePath}/media/posters/apple-app-store-hero.jpg`;

const pipelineIcons = [FileText, Search, ShieldCheck, Database, BarChart3];

const pipelineEvidence = {
  en: [
    {
      label: "Verified conversion artifacts",
      body: "The public repository separates the conversion step from cleaning so the first CSV and SQLite copies can be reproduced.",
      files: "src/convert_apple_appstore_dataset.py\ndata/processed/apple_appstore_apps.csv\ndata/processed/apple_appstore_apps.sqlite",
    },
    {
      label: "Verified inspection records",
      body: "A written cleaning summary and SQL checks make row counts, missing fields and price logic reviewable.",
      files: "docs/cleaning_summary.md\nsql/validate_cleaned_apple_appstore.sql",
    },
    {
      label: "Verified quality fields",
      body: "The cleaning script preserves source values and adds explicit issue columns plus a queryable issue count.",
      files: "src/clean_apple_appstore_dataset.py\nIssue_* fields\nQuality_Issue_Count",
    },
    {
      label: "Verified cleaned outputs",
      body: "Cleaned records, quality-only rows and the analysis-ready export remain separate, named outputs.",
      files: "data/processed/cleaned_output/\n├── apple_appstore_apps_cleaned.csv\n├── apple_appstore_apps_cleaned.sqlite\n└── apple_appstore_apps_quality_issues.csv",
    },
    {
      label: "Verified analysis outputs",
      body: "The analysis script produces a documented report and reproducible figures rather than an undocumented dashboard.",
      files: "src/analyze_appstore_dataset.py\ndocs/apple_appstore_analysis_report.txt\noutputs/top_10_genres_by_app_count.png",
    },
  ],
  zh: [
    {
      label: "已核验​的转换​文件",
      body: "公开​仓库​将转换​与清洗​分开​记录，​使最初​的 CSV ​与 SQLite ​副本​可以​复现。",
      files: "src/convert_apple_appstore_dataset.py\ndata/processed/apple_appstore_apps.csv\ndata/processed/apple_appstore_apps.sqlite",
    },
    {
      label: "已核验​的检查​记录",
      body: "清洗​摘要​与 SQL ​检查​让记录数、​缺失​字段​和价格​逻辑​都可以​复核。",
      files: "docs/cleaning_summary.md\nsql/validate_cleaned_apple_appstore.sql",
    },
    {
      label: "已核验​的质量​字段",
      body: "清洗​脚本​保留​原始值，​并增加​明确​的问题​字段​与可查询​的问题​计数。",
      files: "src/clean_apple_appstore_dataset.py\nIssue_* fields\nQuality_Issue_Count",
    },
    {
      label: "已核验​的清洗​输出",
      body: "清洗​记录、​问题​记录​与分析​就绪导出​保持​为相互​独立、​名称​清楚​的输出。",
      files: "data/processed/cleaned_output/\n├── apple_appstore_apps_cleaned.csv\n├── apple_appstore_apps_cleaned.sqlite\n└── apple_appstore_apps_quality_issues.csv",
    },
    {
      label: "已核验​的分析​输出",
      body: "分析​脚本生成​有记录​的报告​与可复​现图表，​而不​是缺少​依据​的仪表盘。",
      files: "src/analyze_appstore_dataset.py\ndocs/apple_appstore_analysis_report.txt\noutputs/top_10_genres_by_app_count.png",
    },
  ],
} as const;

const copy = {
  en: {
    repository: "Repository",
    language: "中文",
    languageLabel: "Switch to Chinese",
    navigationLabel: "Apple case study navigation",
    backLabel: "Back to Portfolio — return to the Apple App Store project card",
    repositoryLabel: "Open the Apple App Store analysis repository in a new tab",
    eyebrow: "Case study 02 · SQLite · Python · Data quality",
    title: "Cleaning and analysing a historical App Store dataset",
    summary:
      "A documented Python and SQLite workflow for converting, checking, cleaning and describing a historical App Store dataset collected in 2021.",
    explore: "Explore the evidence",
    viewRepository: "View repository",
    historyArtworkAlt: "Geometric construction study of the Apple logo",
    metrics: [
      ["1,230,376", "rows in the cleaning summary"],
      ["1,229,886", "rows in the final analysis report"],
      ["October 2021", "source collection context"],
    ],
    sections: {
      question: {
        label: "01 / The analytical question",
        title: "At this scale data checks need to be repeatable",
        body: "The source contains text, prices, ratings, timestamps, developer fields and file sizes across more than 1.2 million iOS apps. At that scale, consistent comparison starts with repeatable checks rather than isolated manual corrections.",
        contextLabel: "Historical boundary",
        context: "The source repository states that the data was collected in October 2021. This case study describes that dataset and does not claim to represent today’s App Store.",
      },
      pipeline: {
        label: "02 / Evidence pipeline",
        title: "A documented sequence from source conversion to analysis",
        detailPrompt: "Explore evidence",
        steps: [
          ["01", "Convert", "Move the source JSON into CSV and SQLite so the full dataset can be inspected consistently."],
          ["02", "Inspect", "Profile missing values, timestamps, price logic, identifiers and non-positive sizes before changing records."],
          ["03", "Flag", "Create explicit Issue_* fields instead of filling ambiguous values with assumptions."],
          ["04", "Structure", "Build cleaned outputs and an analysis-ready view while retaining the original fields for comparison."],
          ["05", "Analyse", "Use pandas, matplotlib and seaborn to produce reproducible category, pricing and update summaries."],
        ],
      },
      uncertainty: {
        label: "03 / What was uncertain",
        title: "Different missing fields affect different analyses",
        intro: "The cleaning summary separates high-volume informational gaps from the smaller set of issues that can directly change analytical comparisons.",
        items: [
          ["643,988", "blank developer websites", "A large documentation gap, but not automatically a reason to remove an app from category or pricing analysis."],
          ["490", "missing prices", "A substantive issue for pricing comparisons and the derived free-versus-paid classification."],
          ["224", "missing or non-positive sizes", "Records that require caution in any file-size analysis."],
          ["3", "invalid release timestamps", "A small but explicit boundary for release-date and update-period analysis."],
        ],
        principleLabel: "Cleaning principle",
        principle: "Retain uncertain records where possible, mark the problem explicitly and filter only for calculations that require the affected field.",
      },
      evidence: {
        label: "04 / Three evidence stories",
        title: "Three descriptive findings from the 2021 dataset",
        stories: [
          {
            kicker: "Marketplace composition",
            title: "Free apps dominate the analysed rows",
            body: "The final analysis report records 1,127,384 free apps and 102,502 paid apps. The comparison uses the numeric price field rather than relying only on the source Free flag.",
            note: "Scope: the final 1,229,886-row analysis report.",
          },
          {
            kicker: "Category concentration",
            title: "Games is the largest recorded category",
            body: "Games contains 193,328 apps in the report. Business, Education, Utilities and Lifestyle are also described as large categories, but this page avoids inventing counts not stated in the evidence.",
            note: "Finding: category size, not category quality or profitability.",
          },
          {
            kicker: "Dataset-era activity",
            title: "Recorded updates rise toward the collection period",
            body: "The report counts 245,922 apps updated in 2020 and 527,359 in 2021. This describes timestamp activity within the historical dataset, not the current App Store.",
            note: "Boundary: data collection context ends in October 2021.",
          },
        ],
      },
      code: {
        label: "05 / Technical proof",
        title: "Quality issues are recorded as queryable fields",
        body: "The pipeline derives a price-based classification, records missing prices and logic mismatches separately, then totals the issue fields. The original values remain available for review.",
        filename: "src/clean_apple_appstore_dataset.py · Python",
        snippet: `df["Free_By_Price"] = df["Price"].fillna(0).eq(0)\ndf["Issue_Missing_Price"] = df["Price"].isna()\ndf["Issue_Price_Logic_Mismatch"] = (\n    df["Free"].eq(False) & df["Price"].fillna(0).eq(0)\n)\nissue_columns = [c for c in df.columns if c.startswith("Issue_")]\ndf["Quality_Issue_Count"] = df[issue_columns].sum(axis=1)`,
      },
      results: {
        label: "06 / Results and limits",
        title: "Documented outputs filters and data limits",
        items: [
          ["Reproducible", "The repository documents conversion, cleaning, SQL validation and Python analysis as separate steps."],
          ["Filterable", "Issue fields allow each analysis to define the quality conditions it actually needs."],
          ["Historically bounded", "The evidence supports comparisons inside the 2021 dataset, not claims about today’s catalogue or market performance."],
        ],
        countLabel: "A count that remains visible",
        countNote: "The cleaning summary reports 1,230,376 rows, while the later analysis report records 1,229,886. The 490-row difference is disclosed rather than assigned an undocumented explanation; the later figure is used only when referring to the final analysis report.",
      },
      closing: {
        label: "Summary",
        title: "The repository records the full process and its limits",
        body: "It connects the source records, explicit processing rules, quality fields and the resulting descriptive analysis.",
        repository: "Review the evidence",
        projects: "Back to all projects",
      },
    },
  },
  zh: {
    repository: "代码仓库",
    language: "EN",
    languageLabel: "Switch to English",
    navigationLabel: "Apple ​案例​研究导航",
    backLabel: "返回​作品​集中​的 Apple App Store ​项目​卡片",
    repositoryLabel: "在新标签页​中打​开 ​Apple App Store 数​据分析代​码仓库",
    eyebrow: "案例​研究​ 02 · SQLite · Python · 数​据质量",
    title: "清洗​与分析​历史​ App Store 数据",
    summary: "一个​使用​ Python ​与 SQLite ​转换、​检查、​清洗​并描述​ 2021 年​历史​ App Store ​数据​的完整​流程。",
    explore: "浏览​分析证据",
    viewRepository: "查看代​码仓库",
    historyArtworkAlt: "Apple ​标志​的几何​构造​研究图",
    metrics: [["1,230,376", "清洗​摘要​中的​记录数"], ["1,229,886", "最终​分析​报告​中的​记录数"], ["2021 年​ 10 月", "数据源​收集时点"]],
    sections: {
      question: {
        label: "01 / ​分析​问题",
        title: "在这​一数​据规模​下检查​过程​需要​可重复",
        body: "该数​据涵盖​ ​120 万​余个​ iOS ​应用​的文本、​价格、​评分、​时间​戳、​开发者​信息​与文件​大小。​在这个​规模​上，​可靠​比较​必须​从可​重复​的检查​开始，​而不​是依赖​零散​的人​工修改。",
        contextLabel: "历史边界",
        context: "数据源仓库​说明数​据收集于​ 2021 年​ 10​ 月。​本案例​只描述​该历史​数据​集，​不代表​当前​的 App Store。",
      },
      pipeline: {
        label: "02 / 证据​流程",
        title: "从源​文件​转换​到分析​的完整​记录​流程",
        detailPrompt: "查看证据",
        steps: [["01", "转换", "将源​ JSON ​转换​为 CSV ​与 SQLite，​以统​一方式​检查​完整​数据。"], ["02", "检查", "在修改记​录前，​分析​缺失值、​时间​戳、​价格​逻辑、​标识符​与非正​文件​大小。"], ["03", "标记", "建立​明确​的 Issue_*​ ​字段，​而不​用主观​假设填​补模​糊值。"], ["04", "结构化", "构建清洗​输出​与分析​视图，​同时​保留​原始字段​用于​比较。"], ["05", "分析", "使用​ pandas、​matplotlib ​和 seaborn 生成​可复现​的类别、​价格​与更新​摘要。"]],
      },
      uncertainty: {
        label: "03 / ​不确定​之处",
        title: "不同​类型​的缺失​字段​会影响​不同​分析",
        intro: "清洗​摘要​区分​了大规模​的信息性​缺口，​与少量​会直接​改变​分析​比较​的实质性​问题。",
        items: [["643,988", "开发者​网站​为空", "这是​显著​的文档​缺口，​但不必然意味​着应用​需要​从类别或​价格​分析​中删除。"], ["490", "价格缺失", "这会​影响​价格​比较​与免费​/付费​分类。"], ["224", "文件​大小​缺失​或非正", "在任何​文件​大小​分析​中都​需要​谨慎​处理。"], ["3", "无效​发布​时间", "这是​发布​日期​与更新​时段​分析​的明确​边界。"]],
        principleLabel: "清洗原则",
        principle: "尽可能​保留​不确定​记录，​明确​标记​问题，​并且​只在​某项​计算确实​需要​可靠​字段时​进行​筛选。",
      },
      evidence: {
        label: "04 / ​三组​分析证据",
        title: "来自​ ​2021 年​数据集​的三​项描述性​结果",
        stories: [
          { kicker: "市场结构", title: "免费​应用​占分析​记录​的大多数", body: "最终​分析​报告​记录​了 1,127,384​ ​个免费​应用​和 102,502 ​个付费​应用。​分类​基于​数值​价格​字段，​而不​是仅​依赖​原始 Free​ ​标记。", note: "范围：​最终​报告​中的​ 1,229,886 ​条分析​记录。" },
          { kicker: "类别集​中度", title: "游戏​是记录数​最多​的类别", body: "报告​中游戏类​包含​ 193,328​ ​个应用。​商务、​教育、​工具​与生活​方式​也被​描述​为大型​类别，​但本页​不会​虚构​证据​中未​提供​的数量。", note: "结论​边界：​类别规模，​而非类​别质量​或盈利​能力。" },
          { kicker: "数据​时期内​的活动", title: "记录​中的​更新​活动​在接近​收集期​时上升", body: "报告​记录​ 2020 年​更新​的应用​为 245,922​ 个，​2021 年​为 527,359​ 个。​这反​映历史​数据内​的时间​戳活动，​不代表​当前​ App Store。", note: "边界：​数据​收集​时间​截止于​ 2021 年​ 10​ 月。" },
        ],
      },
      code: {
        label: "05 / ​技术​证据", title: "将数据​质量​问题​记录​为可查​询字段", body: "该流程​基于​价格派生​分类，​分别​记录​价格​缺失​与逻辑​不一致，​然后​统计​所有​问题​字段。​原始值​始终​保留，​便于​复核。", filename: "src/clean_apple_appstore_dataset.py · Python", snippet: `df["Free_By_Price"] = df["Price"].fillna(0).eq(0)\ndf["Issue_Missing_Price"] = df["Price"].isna()\ndf["Issue_Price_Logic_Mismatch"] = (\n    df["Free"].eq(False) & df["Price"].fillna(0).eq(0)\n)\nissue_columns = [c for c in df.columns if c.startswith("Issue_")]\ndf["Quality_Issue_Count"] = df[issue_columns].sum(axis=1)`,
      },
      results: {
        label: "06 / ​结果​与边界", title: "输出​结果、⁠筛选​条件\n与数据​限制", items: [["可复现", "代码​仓库​将转换、​清洗、​SQL​ 验证​与 Python ​分析​记录​为独立​步骤。"], ["可筛选", "问题​字段​使每​项分析​能够​定义​自己​真正​需要​的数据​质量​条件。"], ["历史​范围​明确", "证据​支持​对 2021 年​数据​集的​比较，​而不​支持​对当前​应用​目录​或市场​表现​的结论。"]], countLabel: "保持​可见​的记录​差异", countNote: "清洗​摘要​记录​ 1,230,376​ 条，​而后续​分析​报告​记录​ 1,229,886​ 条。​本页​不会​为这​ ​490 ​条差异​虚构​未记录​的原因；​只有​在引用​最终​分析​报告​时才​使用​后一​个数字。",
      },
      closing: { label: "项目总结", title: "代码​仓库​记录​了完整​流程​与当前​限制", body: "其中​包含源​记录、​明确​的处理​规则、​数据​质量​字段​与描述性​分析​结果。", repository: "查看​完整​证据", projects: "返回​所有​项目" },
    },
  },
} as const;

export default function AppleCaseStudy({ initialLanguage }: { initialLanguage: Language }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [activePipelineStep, setActivePipelineStep] = useState(0);
  const resolvedUrlLanguage = useRef(false);
  const t = copy[language];
  const portfolioHref = `${appBasePath}/?lang=${language}#project-apple-app-store`;

  useEffect(() => {
    const url = new URL(window.location.href);
    if (!resolvedUrlLanguage.current) {
      resolvedUrlLanguage.current = true;
      const requestedLanguage = url.searchParams.get("lang") === "zh" ? "zh" : "en";
      if (requestedLanguage !== language) {
        const timer = window.setTimeout(() => setLanguage(requestedLanguage), 0);
        return () => window.clearTimeout(timer);
      }
    }

    const previousLanguage = document.documentElement.lang;
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.title = language === "zh" ? "Apple App Store 数据分析 — 高子舜" : "Apple App Store Data Analysis — Zishun Gao";
    document.querySelector('meta[name="description"]')?.setAttribute(
      "content",
      language === "zh"
        ? "一个​聚焦​数据​质量、​可追溯​处理​与谨慎​解读​的 App Store 数​据案例。"
        : "A documented Python and SQLite workflow for cleaning and analysing a historical Apple App Store dataset.",
    );
    return () => { document.documentElement.lang = previousLanguage; };
  }, [language]);

  function toggleLanguage() {
    const next: Language = language === "en" ? "zh" : "en";
    setLanguage(next);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", next);
    window.history.replaceState(window.history.state, "", url);
  }

  return (
    <main className="apple-page" lang={language === "zh" ? "zh-CN" : "en"}>
      <PortfolioBackLink href={portfolioHref} language={language} ariaLabel={t.backLabel} />
      <section className="apple-hero" aria-labelledby="apple-title">
        <ResilientBackgroundVideo
          className="apple-hero-media"
          videoClassName="apple-hero-video"
          src={heroVideo}
          poster={heroPoster}
          priority
          language={language}
          controlClassName="apple-video-control"
        />
        <div className="apple-hero-shade" aria-hidden="true" />

        <header className="apple-nav">
          <nav className="apple-nav-links apple-glass" aria-label={t.navigationLabel}>
            <a href="#pipeline">{language === "en" ? "Method" : "方法"}</a>
            <a href="#evidence">{language === "en" ? "Evidence" : "证据"}</a>
            <a href="#results">{language === "en" ? "Results" : "结果"}</a>
            <button type="button" onClick={toggleLanguage} aria-label={t.languageLabel}>{t.language}</button>
          </nav>
          <button className="apple-mobile-language apple-glass" type="button" onClick={toggleLanguage} aria-label={t.languageLabel}>{t.language}</button>
        </header>

        <div className="apple-hero-copy">
          <p>{t.eyebrow}</p>
          <h1 id="apple-title">{t.title}</h1>
          <span>{t.summary}</span>
          <div className="apple-hero-actions">
            <a className="apple-primary" href="#question">{t.explore}<ArrowRight aria-hidden="true" /></a>
            <a className="apple-secondary apple-glass" href={repositoryUrl} target="_blank" rel="noreferrer" aria-label={t.repositoryLabel}>{t.viewRepository}<ExternalLink aria-hidden="true" /></a>
          </div>
        </div>

        <dl className="apple-metrics apple-glass">
          {t.metrics.map(([value, label]) => <div key={label}><dt>{value}</dt><dd>{label}</dd></div>)}
        </dl>
      </section>

      <article className="apple-story">
        <section id="question" className="apple-section apple-question" aria-labelledby="question-title">
          <div className="apple-heading"><p>{t.sections.question.label}</p><h2 id="question-title">{t.sections.question.title}</h2></div>
          <p className="apple-question-copy">{t.sections.question.body}</p>
          <aside className="apple-history-feature">
            <div><span>{t.sections.question.contextLabel}</span><p>{t.sections.question.context}</p></div>
            <figure><Image src={`${appBasePath}/case-studies/apple-app-store/apple-construction-grid.webp`} width={1448} height={1086} sizes="(max-width: 760px) 88vw, 42vw" alt={t.historyArtworkAlt} unoptimized /></figure>
          </aside>
        </section>

        <section id="pipeline" className="apple-section apple-pipeline apple-dark" aria-labelledby="pipeline-title">
          <div className="apple-heading"><p>{t.sections.pipeline.label}</p><h2 id="pipeline-title">{t.sections.pipeline.title}</h2></div>
          {(() => {
            const steps = t.sections.pipeline.steps;
            const current = steps[activePipelineStep];
            const evidence = pipelineEvidence[language][activePipelineStep];
            const CurrentIcon = pipelineIcons[activePipelineStep];
            const ui = language === "en"
              ? { step: "Step", of: "of", evidence: "Evidence in the repository", files: "Files", prev: "Previous step", next: "Next step", rail: "Pipeline steps" }
              : { step: "步骤", of: "/", evidence: "仓库​中的​证据", files: "相关文件", prev: "上一步", next: "下一步", rail: "流程步骤" };
            const go = (index: number) => setActivePipelineStep(Math.min(steps.length - 1, Math.max(0, index)));
            return <div className="apple-flow" style={{ ["--flow-progress" as string]: activePipelineStep / (steps.length - 1) }}>
              <ol
                className="apple-flow-rail"
                aria-label={ui.rail}
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight") { event.preventDefault(); go(activePipelineStep + 1); }
                  if (event.key === "ArrowLeft") { event.preventDefault(); go(activePipelineStep - 1); }
                }}
              >
                {steps.map(([number, title], index) => {
                  const Icon = pipelineIcons[index];
                  const state = index === activePipelineStep ? "is-active" : index < activePipelineStep ? "is-done" : undefined;
                  return <li key={number} className={state}>
                    <button
                      type="button"
                      aria-current={index === activePipelineStep ? "step" : undefined}
                      aria-controls="apple-flow-stage"
                      onClick={() => go(index)}
                      onMouseEnter={(event) => { if (window.matchMedia("(hover: hover)").matches && event.buttons === 0) go(index); }}
                    >
                      <span className="apple-flow-node" aria-hidden="true"><Icon /></span>
                      <span className="apple-flow-num">{number}</span>
                      <span className="apple-flow-title">{title}</span>
                    </button>
                  </li>;
                })}
              </ol>

              <div id="apple-flow-stage" className="apple-flow-stage" aria-live="polite">
                <div className="apple-flow-copy" key={`copy-${activePipelineStep}`}>
                  <span className="apple-flow-kicker">{ui.step} {current[0]} {ui.of} 0{steps.length}</span>
                  <h3><CurrentIcon aria-hidden="true" />{current[1]}</h3>
                  <p className="apple-flow-body">{current[2]}</p>
                  <div className="apple-flow-evidence">
                    <strong>{ui.evidence}</strong>
                    <p><em>{evidence.label}</em> — {evidence.body}</p>
                  </div>
                  <div className="apple-flow-controls">
                    <button type="button" onClick={() => go(activePipelineStep - 1)} disabled={activePipelineStep === 0} aria-label={ui.prev}><ArrowLeft aria-hidden="true" /></button>
                    <span className="apple-flow-dots" aria-hidden="true">{steps.map((step, index) => <i key={step[0]} className={index === activePipelineStep ? "is-active" : undefined} />)}</span>
                    <button type="button" onClick={() => go(activePipelineStep + 1)} disabled={activePipelineStep === steps.length - 1} aria-label={ui.next}><ArrowRight aria-hidden="true" /></button>
                  </div>
                </div>
                <figure className="apple-flow-window" key={`window-${activePipelineStep}`}>
                  <figcaption><span className="apple-flow-lights" aria-hidden="true"><i /><i /><i /></span>{ui.files}</figcaption>
                  <pre><code>{evidence.files}</code></pre>
                </figure>
              </div>
            </div>;
          })()}
        </section>

        <section className="apple-section apple-uncertainty" aria-labelledby="uncertainty-title">
          <div className="apple-heading"><p>{t.sections.uncertainty.label}</p><h2 id="uncertainty-title">{t.sections.uncertainty.title}</h2></div>
          <p className="apple-intro">{t.sections.uncertainty.intro}</p>
          <div className="apple-issue-grid">{t.sections.uncertainty.items.map(([value, label, body]) => <article key={label}><strong>{value}</strong><h3>{label}</h3><p>{body}</p></article>)}</div>
          <aside className="apple-principle"><span>{t.sections.uncertainty.principleLabel}</span><p>{t.sections.uncertainty.principle}</p></aside>
        </section>

        <section id="evidence" className="apple-section apple-evidence" aria-labelledby="evidence-title">
          <div className="apple-heading"><p>{t.sections.evidence.label}</p><h2 id="evidence-title">{t.sections.evidence.title}</h2></div>
          <div className="apple-story-grid">
            {t.sections.evidence.stories.map((story, index) => <article key={story.kicker} className={`apple-evidence-card apple-evidence-${index + 1}`}>
              <div className="apple-evidence-visual" aria-hidden="true">
                {index === 0 ? <div className="apple-split"><span style={{ width: "91.67%" }} /><i style={{ width: "8.33%" }} /></div> : null}
                {index === 1 ? <strong>193,328</strong> : null}
                {index === 2 ? <div className="apple-years"><span><i style={{ height: "46.63%" }} />2020</span><span><i style={{ height: "100%" }} />2021</span></div> : null}
              </div>
              <p>{story.kicker}</p><h3>{story.title}</h3><div>{story.body}</div><small>{story.note}</small>
            </article>)}
          </div>
        </section>

        <section className="apple-section apple-code apple-dark" aria-labelledby="code-title">
          <div><div className="apple-heading"><p>{t.sections.code.label}</p><h2 id="code-title">{t.sections.code.title}</h2></div><p>{t.sections.code.body}</p></div>
          <pre role="region" tabIndex={0} aria-label={t.sections.code.filename}><span>{t.sections.code.filename}</span><code>{t.sections.code.snippet}</code></pre>
        </section>

        <section id="results" className="apple-section apple-results" aria-labelledby="results-title">
          <div className="apple-heading"><p>{t.sections.results.label}</p><h2 id="results-title">{t.sections.results.title}</h2></div>
          <ol>{t.sections.results.items.map(([title, body], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{body}</p></li>)}</ol>
          <aside><span>{t.sections.results.countLabel}</span><p>{t.sections.results.countNote}</p></aside>
        </section>

        <section className="apple-section apple-closing apple-dark" aria-labelledby="closing-title">
          <p>{t.sections.closing.label}</p>
          <h2 id="closing-title">{t.sections.closing.title}</h2>
          <span>{t.sections.closing.body}</span>
          <div className="apple-closing-actions"><a href={repositoryUrl} target="_blank" rel="noreferrer" aria-label={t.repositoryLabel}>{t.sections.closing.repository}<ExternalLink aria-hidden="true" /></a><a href={portfolioHref}>{t.sections.closing.projects}<ArrowLeft aria-hidden="true" /></a></div>
        </section>
      </article>
    </main>
  );
}
