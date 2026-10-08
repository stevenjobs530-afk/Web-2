"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowRight, RotateCcw } from "lucide-react";
import Image from "next/image";
import "@fontsource-variable/geist";
import PortfolioBackLink from "../../components/portfolio-back-link";
import "./uk-retail-ledger.scss";

type Language = "en" | "zh";
const appBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function withBasePath(src: string) {
  return src.startsWith("/") ? `${appBasePath}${src}` : src;
}

const repositoryUrl =
  "https://github.com/stevenjobs530-afk/UK-Retail-Sales-ETL-SQL-Analysis";

const copy = {
  en: {
    repository: "Repository",
    language: "中文",
    languageLabel: "Switch to Chinese",
    navigationLabel: "Case study navigation",
    backLabel: "Back to Portfolio — return to the UK Retail project card",
    repositoryLabel: "Open the UK Retail project repository",
    eyebrow: "Case study 01 · SQL · Python",
    titleTop: "UK retail",
    titleBottom: "transactions",
    summary:
      "A large retail export was cleaned and organised into a separate analysis table for examining revenue and product performance.",
    cta: "View repository",
    explore: "Explore the case study",
    ledger: {
      source: "raw_transactions → clean",
      phases: ["Loading export", "Applying filters", "Clean · ready"],
      replay: "Replay sequence",
      replayLabel: "Replay the cleaning sequence",
    },
    hud: {
      opening: "01 — The data",
      period: "Dec 2010 — Dec 2011 · Online retail · United Kingdom",
      end: "End",
    },
    ticker: [
      "Quantity > 0",
      "UnitPrice > 0",
      "Description IS NOT NULL",
      "SELECT DISTINCT",
      "Excel serial → DATETIME",
      "Source table retained",
      "Credentials from environment",
      "1.6M → 524,878",
    ],
    chart: {
      label: "Monthly revenue · £",
      period: "Dec 2010 — Dec 2011",
      peak: "Nov 2011 · peak ≈ £1.5M",
      aria: "Monthly revenue line, December 2010 to December 2011: steady through mid-2011, rising from September and peaking at about £1.5 million in November 2011.",
    },
    resultsKicker: "Sales value analysed",
    codeFile: "clean_transactions.sql",
    closingTop: "One clean table.",
    closingBottom: "From raw export to the last receipt.",
    items: [
      ["1.6M", "raw records"],
      ["524,878", "clean rows"],
      ["£10.6M+", "analysed"],
    ],
    sections: {
      overview: {
        label: "01 / Overview",
        title: "Turning raw transaction data into an analysis table",
        body: "The project converts a high-volume retail export into a separate, analysis-ready transaction table. The raw source remains intact while missing values, invalid records and duplicate groups are inspected before cleaning.",
        challengeLabel: "The challenge",
        challenge: "Prepare approximately 1.6 million source records for useful revenue and product analysis without hiding the decisions made during cleaning.",
      },
      method: {
        label: "02 / Method",
        title: "From inspection and cleaning to analysis and chart exports",
        steps: [
          ["01", "Inspect", "Check missing values, invalid records and duplicate groups before changing the source."],
          ["02", "Prepare", "Convert Excel serial dates, remove invalid sales rows and write distinct records to a clean table."],
          ["03", "Analyse", "Calculate revenue, unique orders and customer counts from the cleaned MySQL table."],
          ["04", "Present", "Use Python to export monthly revenue and top-product revenue charts."],
        ],
      },
      evidence: {
        label: "Processing record",
        title: "Links between raw data processing rules and outputs",
        steps: [
          ["Raw", "Preserve", "Keep the original export as the reference point."],
          ["Rules", "Document", "Show the date conversion, validity filters and duplicate handling in code."],
          ["Output", "Repeat", "Reconnect to the clean table and regenerate both chart exports."],
        ],
      },
      outputs: {
        label: "03 / Process & outputs",
        title: "Two analysis outputs from the same cleaned table",
        body: "Python reads the cleaned MySQL table and exports two focused views: sales over time and product contribution.",
        charts: [
          ["Monthly revenue", "Revenue is grouped by month from the prepared transaction table and exported as a chart."],
          ["Top products by revenue", "Product revenue is ranked from the same cleaned table and exported for comparison."],
        ],
      },
      code: {
        label: "Cleaning rule · simplified",
        title: "Record filters used for the clean table",
        body: "The clean table uses distinct records with positive quantity and unit price, a present description and converted SQL datetimes. The source table is retained.",
        snippet: `SELECT DISTINCT\n  InvoiceNo, StockCode, Description,\n  Quantity, InvoiceDate, UnitPrice, CustomerID\nFROM raw_transactions\nWHERE Quantity > 0\n  AND UnitPrice > 0\n  AND Description IS NOT NULL;`,
      },
      decisions: {
        label: "04 / Cleaning decisions",
        title: "Three main processing decisions",
        items: [
          ["Protect the source", "Transformations are written to a separate analysis table."],
          ["Make rules explicit", "Date conversion, validity filters and DISTINCT handling are stated in SQL."],
          ["Separate credentials", "Python reads database credentials from environment variables before generating charts."],
        ],
      },
      results: {
        label: "05 / Results",
        title: "Clean transaction count and analysed sales value",
        body: "The workflow moves from approximately 1.6 million raw records to 524,878 clean transactions, supporting analysis of more than £10.6 million in sales value.",
        stats: [
          ["1.6M", "Raw records"],
          ["524,878", "Clean transactions"],
          ["£10.6M+", "Sales value analysed"],
        ],
      },
      closing: {
        label: "Explore the work",
        title: "The repository contains the complete processing workflow",
        body: "It includes the source-preserving structure, cleaning logic and scripts used to generate the analysis outputs.",
        cta: "View repository",
      },
    },
  },
  zh: {
    repository: "代码仓库",
    language: "EN",
    languageLabel: "Switch to English",
    navigationLabel: "案例​研究导航",
    backLabel: "返回​作品​集中​的英国​零售​项目​卡片",
    repositoryLabel: "打开​英国​零售​项目​代码​仓库",
    eyebrow: "案例​研究​ 01 · SQL · Python",
    titleTop: "英国零售",
    titleBottom: "交易分析",
    summary:
      "一份​大型​零售交易​数据​经过​清洗​后被​整理​为独立​分析表，​用于​分析​营收​与商品​表现。",
    cta: "查看代​码仓库",
    explore: "浏览​案例​研究",
    ledger: {
      source: "原始​交易表 → 清洗表",
      phases: ["载入​导出​数据", "应用​筛选​规则", "清洗​完成"],
      replay: "重播​动画",
      replayLabel: "重播​数据​清洗​动画",
    },
    hud: {
      opening: "01 — 数据",
      period: "2010 年 12 月 — 2011 年 12 月 · 线上​零售 · 英国",
      end: "完",
    },
    ticker: [
      "Quantity > 0",
      "UnitPrice > 0",
      "Description IS NOT NULL",
      "SELECT DISTINCT",
      "Excel 序列​日期 → DATETIME",
      "保留​原始表",
      "凭据​来自​环境​变量",
      "160 万 → 524,878",
    ],
    chart: {
      label: "月度​营收 · £",
      period: "2010.12 — 2011.12",
      peak: "2011.11 · 峰值 ≈ £150 万",
      aria: "2010 年 12 月至 2011 年 12 月的月度营收折线：2011 年年中保持平稳，9 月起上升，并在 2011 年 11 月达到约 150 万英镑的峰值。",
    },
    resultsKicker: "已分析​销售额",
    codeFile: "clean_transactions.sql",
    closingTop: "一张​清洗表。",
    closingBottom: "从原始​导出​到最后​一张​收据。",
    items: [
      ["160 万", "原始记录"],
      ["524,878", "清洗记录"],
      ["£10.6M+", "分析销​售额"],
    ],
    sections: {
      overview: {
        label: "01 / ​项目​概览",
        title: "将原始​交易​数据​整理​为可​分析​的数据表",
        body: "项目​将大型​零售导出​数据​整理​为独立​的分析​交易表。​原始数​据完整​保留，​并在​清洗​前检查​缺失值、​无效​记录​与重复​记录组。",
        challengeLabel: "项目挑战",
        challenge: "在不隐藏清洗​决策​的前​提下，​将约​ ​160 万条​原始记录​准备​为可用​于营收​与商品​分析​的数据。",
      },
      method: {
        label: "02 /​ ​方法",
        title: "从数据​检查​和清洗​到分析​与图表输出",
        steps: [
          ["01", "检查", "在修改数​据前​检查​缺失值、​无效​记录​与重复​记录组。"],
          ["02", "准备", "转换​ Excel​ 序列​日期，​剔除​无效销售​记录，​并将​去重记录​写入​清洗表。"],
          ["03", "分析", "从清洗后​的 MySQL 表计算营收、​独立​订单数​和客户数。"],
          ["04", "呈现", "使用​ P​ython​ 导出​月度​营收​与商品​营收​排行​图表。"],
        ],
      },
      evidence: {
        label: "处理记录",
        title: "原始​数据、⁠处理​规则​与输出​结果​的对​应关系",
        steps: [
          ["原始", "保留", "保留​原始导出​数据​作为​参考​基线。"],
          ["规则", "记录", "在代码​中展示​日期​转换、​有效性​筛选​与重复​记录​处理。"],
          ["输出", "重现", "重新​连接​清洗表，​即可​再次​生成​两份​图表。"],
        ],
      },
      outputs: {
        label: "03 / ​过程​与输出",
        title: "使用​同一​张清洗​表生​成两​项分析​输出",
        body: "Python​ 读​取清洗后​的 MySQL​ 表，​并导出​两个​聚焦​视图：​销售​时间​趋势​与商品​贡献。",
        charts: [
          ["月度营收", "基于​整理​后的​交易​表按​月汇​总营收，​并导出​为图表。"],
          ["商品营​收排行", "基于​同一​张清洗​表对​商品营​收进行​排序​与比较。"],
        ],
      },
      code: {
        label: "清洗​规则​ · 简化​展示",
        title: "清洗​表使用​的记录​筛选​条件",
        body: "清洗​表保留​数量​与单价​为正、​描述​不为​空且​去重后​的记录，​并将​日期​转换​为 S​QL ​日期​时间；​原始表​保持​不变。",
        snippet: `SELECT DISTINCT\n  InvoiceNo, StockCode, Description,\n  Quantity, InvoiceDate, UnitPrice, CustomerID\nFROM raw_transactions\nWHERE Quantity > 0\n  AND UnitPrice > 0\n  AND Description IS NOT NULL;`,
      },
      decisions: {
        label: "04 / 清洗​决策",
        title: "三项​主要​处理​决定",
        items: [
          ["保护​原始数据", "将转换​结果​写入​独立​的分析表。"],
          ["明确​清洗​规则", "SQL 清楚​列出​日期​转换、​有效性​筛选​与 DISTINCT ​去重。"],
          ["分离数据​库凭据", "Python ​从环境​变量​读取数​据库凭据，​再生​成分析​图表。"],
        ],
      },
      results: {
        label: "05 / ​项目​结果",
        title: "清洗​交易​数量​与分析销​售额",
        body: "该工作​流将​约 ​160 万条​原始记录​整理​为 5​24,878 ​条清洗​交易，​支持​对超过​ ​£​1,060 万销​售额​的分析。",
        stats: [
          ["160 万", "原始记录"],
          ["524,878", "清洗交易"],
          ["£10.6M+", "已分析销​售额"],
        ],
      },
      closing: {
        label: "深入了解",
        title: "代码​仓库​包含​完整​的数据​处理​流程",
        body: "其中​包括​原始数​据保留​结构、​清洗​逻辑​与生成​分析​输出​的脚本。",
        cta: "查看代​码仓库",
      },
    },
  },
} as const;

type Copy = (typeof copy)[Language];

// The hero grid stands in for the raw export: one dot per ~5,500 records. The share
// that survives cleaning matches the real ratio (524,878 of ~1.6M).
const DOT_COLUMNS = 24;
const DOT_COUNT = 288;
const KEEP_SHARE = 524878 / 1600000;
const ledgerDots = (() => {
  let seed = 7;
  return Array.from({ length: DOT_COUNT }, (_, index) => {
    seed = (seed * 9301 + 49297) % 233280;
    const row = Math.floor(index / DOT_COLUMNS);
    const column = index % DOT_COLUMNS;
    return { keep: seed / 233280 < KEEP_SHARE, wave: Math.min(9, Math.floor((row + column) / 3.5)) };
  });
})();

// Read from the project's exported monthly revenue chart (£M, Dec 2010 – Dec 2011),
// redrawn in the page's own style; the original export is shown alongside it.
const monthlyRevenue = [0.82, 0.69, 0.52, 0.715, 0.535, 0.77, 0.76, 0.718, 0.758, 1.056, 1.15, 1.505, 0.637];
const sparkPoints = monthlyRevenue
  .map((value, index) => `${((index * 560) / 12).toFixed(1)},${(160 - ((value - 0.4) / 1.2) * 160).toFixed(1)}`)
  .join(" ");
const peakIndex = monthlyRevenue.indexOf(Math.max(...monthlyRevenue));
const peakX = (peakIndex * 560) / 12;
const peakY = 160 - ((monthlyRevenue[peakIndex] - 0.4) / 1.2) * 160;

const chapterTimecodes = ["00:00:02:40", "00:00:05:10", "00:00:08:20", "00:00:10:30", "00:00:12:50"];

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);

function Timecode() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const start = performance.now();
    const pad = (n: number) => String(n).padStart(2, "0");
    const id = window.setInterval(() => {
      const frames = Math.floor(((performance.now() - start) / 1000) * 25);
      const seconds = Math.floor(frames / 25);
      if (ref.current) {
        ref.current.textContent = `00:${pad(Math.floor(seconds / 60) % 60)}:${pad(seconds % 60)}:${pad(frames % 25)}`;
      }
    }, 40);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="ldg-timecode" aria-hidden="true">
      <span className="ldg-rec" />
      <span ref={ref}>00:00:00:00</span>
    </span>
  );
}

function LedgerPanel({ t, language }: { t: Copy; language: Language }) {
  const [run, setRun] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setElapsed(99);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const seconds = (now - start) / 1000;
      setElapsed(seconds);
      if (seconds < 5) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run]);

  const locale = language === "zh" ? "zh-CN" : "en-GB";
  const count = (value: number) => Math.round(value).toLocaleString(locale);
  const [[rawFinal], [cleanFinal], [valueFinal]] = t.items;
  const raw = elapsed >= 1.9 ? rawFinal : count(1600000 * easeOut(elapsed / 1.9));
  const clean = elapsed < 2.4 ? "—" : elapsed >= 3.8 ? cleanFinal : count(524878 * easeOut((elapsed - 2.4) / 1.4));
  const value = elapsed < 3.4 ? "—" : elapsed >= 4.6 ? valueFinal : `£${(10.6 * easeOut((elapsed - 3.4) / 1.2)).toFixed(1)}M+`;
  const phase = elapsed > 3.8 ? 2 : elapsed > 1.9 ? 1 : 0;

  return (
    <div className="ldg-panel">
      <div className="ldg-panel-head">
        <span>{t.ledger.source}</span>
        <span className={`ldg-phase ldg-phase-${phase}`}>{t.ledger.phases[phase]}</span>
      </div>
      <div key={run} className="ldg-dots" aria-hidden="true">
        {ledgerDots.map((dot, index) => (
          <i
            key={index}
            className={dot.keep ? "is-kept" : "is-dropped"}
            style={{ "--w": dot.wave } as CSSProperties}
          />
        ))}
      </div>
      <dl className="ldg-counters">
        {[raw, clean, value].map((shown, index) => (
          <div key={index}>
            <span aria-hidden="true">{`0${index + 1}`}</span>
            <dt>{t.items[index][1]}</dt>
            <dd>
              <span aria-hidden="true">{shown}</span>
              <span className="ldg-sr">{t.items[index][0]}</span>
            </dd>
          </div>
        ))}
      </dl>
      <button type="button" className="ldg-replay" onClick={() => setRun((n) => n + 1)} aria-label={t.ledger.replayLabel}>
        <RotateCcw aria-hidden="true" />
        {t.ledger.replay}
      </button>
    </div>
  );
}

function ChapterBar({ label, timecode }: { label: string; timecode: string }) {
  return (
    <div className="ldg-chapter" data-reveal>
      <span>{label}</span>
      <span aria-hidden="true">{timecode}</span>
    </div>
  );
}

/** Splits a section title so its final phrase can be set in the accent italic. */
function AccentTitle({ text, language }: { text: string; language: Language }) {
  const clean = text.replace(/[​⁠]/g, "");
  const split = language === "zh" ? Math.max(clean.length - 6, 0) : clean.lastIndexOf(" ", clean.length - 12);
  if (split <= 0) return <>{text}</>;
  return (
    <>
      {clean.slice(0, split)} <em>{clean.slice(split).trim()}</em>
    </>
  );
}

export default function UkRetailCaseStudy({ initialLanguage }: { initialLanguage: Language }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const resolvedUrlLanguage = useRef(false);
  const pageRef = useRef<HTMLElement>(null);
  const t = copy[language];
  const s = t.sections;
  const portfolioHref = `${appBasePath}/?lang=${language}#project-uk-retail`;

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
    document.title = language === "zh" ? "英国零售交易分析 — 高子舜" : "UK Retail Transactions — Zishun Gao";
    document.querySelector('meta[name="description"]')?.setAttribute(
      "content",
      language === "zh"
        ? "一个​使用​ S​QL ​与 P​ython​ 构建​的可追​溯英国​零售数​据清洗​与分析​案例。"
        : "A traceable UK retail data-cleaning and analysis case study built with SQL and Python.",
    );
    return () => {
      document.documentElement.lang = previousLanguage;
    };
  }, [language]);

  // Scroll reveals: content stays visible without JS; only once this runs are
  // [data-reveal] blocks held back until they enter the viewport.
  useEffect(() => {
    const page = pageRef.current;
    if (!page || prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    page.classList.add("ldg-motion");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" },
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

  const ticker = [...t.ticker, ...t.ticker];

  return (
    <main ref={pageRef} className="ldg-page" lang={language === "zh" ? "zh-CN" : "en"}>
      <PortfolioBackLink href={portfolioHref} language={language} ariaLabel={t.backLabel} />

      <section className="ldg-hero" aria-labelledby="uk-retail-title">
        <div className="ldg-hero-grid" aria-hidden="true" />
        <div className="ldg-hero-glow" aria-hidden="true" />
        <span className="ldg-corner ldg-corner-tl" aria-hidden="true" />
        <span className="ldg-corner ldg-corner-tr" aria-hidden="true" />
        <span className="ldg-corner ldg-corner-bl" aria-hidden="true" />
        <span className="ldg-corner ldg-corner-br" aria-hidden="true" />

        <header className="ldg-topbar">
          <nav aria-label={t.navigationLabel}>
            <a href={repositoryUrl} target="_blank" rel="noreferrer" aria-label={t.repositoryLabel}>
              {t.repository}
            </a>
            <button type="button" onClick={toggleLanguage} aria-label={t.languageLabel}>
              {t.language}
            </button>
            <Timecode />
          </nav>
        </header>

        <div className="ldg-hero-body">
          <div className="ldg-hero-copy">
            <p className="ldg-eyebrow ldg-in ldg-in-1">{t.eyebrow}</p>
            <h1 id="uk-retail-title" className="ldg-title">
              <span className="ldg-line"><span>{t.titleTop}</span></span>
              <span className="ldg-line ldg-line-2"><em>{t.titleBottom}{language === "en" ? "." : ""}</em></span>
            </h1>
            <span className="ldg-rule" aria-hidden="true" />
            <p className="ldg-summary ldg-in ldg-in-2">{t.summary}</p>
            <div className="ldg-actions ldg-in ldg-in-3">
              <a className="ldg-btn" href="#overview">
                {t.explore}
                <ArrowDown aria-hidden="true" />
              </a>
              <a className="ldg-btn-ghost" href={repositoryUrl} target="_blank" rel="noreferrer">
                {t.cta}
              </a>
            </div>
          </div>
          <div className="ldg-in ldg-in-2">
            <LedgerPanel t={t} language={language} />
          </div>
        </div>

        <div className="ldg-hud-bottom" aria-hidden="true">
          <span>{t.hud.opening}</span>
          <span className="ldg-hide-sm">{t.hud.period}</span>
          <span>51.5074°N 0.1278°W</span>
        </div>
      </section>

      <div className="ldg-ticker" aria-hidden="true">
        <div className="ldg-ticker-track">
          {ticker.map((rule, index) => (
            <span key={index}>
              {rule}
              <i>◆</i>
            </span>
          ))}
        </div>
      </div>

      <section id="overview" className="ldg-section ldg-paper" aria-labelledby="overview-title">
        <div className="ldg-wrap">
          <ChapterBar label={`02 — ${s.overview.label.split("/").pop()?.trim()}`} timecode={chapterTimecodes[0]} />
          <div className="ldg-split">
            <h2 id="overview-title" className="ldg-h2" data-reveal>
              <AccentTitle text={s.overview.title} language={language} />
            </h2>
            <div className="ldg-overview-copy" data-reveal>
              <p className="ldg-body">{s.overview.body}</p>
              <aside>
                <span>{s.overview.challengeLabel}</span>
                <p>{s.overview.challenge}</p>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section id="method" className="ldg-section" aria-labelledby="method-title">
        <div className="ldg-wrap">
          <ChapterBar label={`03 — ${s.method.label.split("/").pop()?.trim()}`} timecode={chapterTimecodes[1]} />
          <h2 id="method-title" className="ldg-h2 ldg-h2-narrow" data-reveal>
            <AccentTitle text={s.method.title} language={language} />
          </h2>
          <ol className="ldg-frames" data-reveal>
            {s.method.steps.map(([number, title, body]) => (
              <li key={number}>
                <span className="ldg-frame-label">{`FRAME ${number} / 04`}</span>
                <span className="ldg-frame-number" aria-hidden="true">{number}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="results" className="ldg-section ldg-deep" aria-labelledby="results-title">
        <div className="ldg-wrap">
          <ChapterBar label={`04 — ${s.results.label.split("/").pop()?.trim()}`} timecode={chapterTimecodes[2]} />
          <div className="ldg-split ldg-split-end">
            <div className="ldg-results-copy" data-reveal>
              <span className="ldg-kicker">{t.resultsKicker}</span>
              <h2 id="results-title" className="ldg-sr">{s.results.title}</h2>
              <strong className="ldg-mega">
                £10.6M<span>+</span>
              </strong>
              <p className="ldg-body">{s.results.body}</p>
            </div>
            <figure className="ldg-bars" data-reveal>
              <div className="ldg-bars-plot">
                <div className="ldg-bar ldg-bar-raw">
                  <span>{s.results.stats[0][0]}</span>
                  <i />
                </div>
                <div className="ldg-bar ldg-bar-clean">
                  <span>{s.results.stats[1][0]}</span>
                  <i />
                </div>
              </div>
              <figcaption>
                <span>{s.results.stats[0][1]}</span>
                <span>{s.results.stats[1][1]}</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section id="outputs" className="ldg-section ldg-paper" aria-labelledby="outputs-title">
        <div className="ldg-wrap">
          <ChapterBar label={`05 — ${s.outputs.label.split("/").pop()?.trim()}`} timecode={chapterTimecodes[3]} />
          <div className="ldg-split ldg-split-end">
            <h2 id="outputs-title" className="ldg-h2" data-reveal>
              <AccentTitle text={s.outputs.title} language={language} />
            </h2>
            <p className="ldg-body" data-reveal>{s.outputs.body}</p>
          </div>

          <figure className="ldg-spark" data-reveal>
            <div className="ldg-spark-head">
              <span>{t.chart.label}</span>
              <span>{t.chart.period}</span>
            </div>
            <svg viewBox="-10 0 580 190" role="img" aria-label={t.chart.aria}>
              {[12.7, 60, 112].map((y) => (
                <line key={y} x1="0" x2="560" y1={y} y2={y} className="ldg-spark-grid" />
              ))}
              <line x1="0" x2="560" y1="160" y2="160" className="ldg-spark-axis" />
              <polyline points={sparkPoints} className="ldg-spark-line" pathLength={1} />
              <circle cx={peakX} cy={peakY} r="4" className="ldg-spark-peak" />
              <text x={peakX - 8} y={peakY - 3} textAnchor="end" className="ldg-spark-note">{t.chart.peak}</text>
              <text x="0" y="178" className="ldg-spark-tick">2010-12</text>
              <text x="280" y="178" textAnchor="middle" className="ldg-spark-tick">2011-06</text>
              <text x="560" y="178" textAnchor="end" className="ldg-spark-tick">2011-12</text>
            </svg>
          </figure>

          <div className="ldg-prints">
            {[
              ["/case-studies/uk-retail/monthly-revenue-trend.png", 3600, 1800],
              ["/case-studies/uk-retail/top-products-revenue.png", 3600, 2400],
            ].map(([src, width, height], index) => {
              const [title, body] = s.outputs.charts[index];
              return (
                <figure key={String(src)} data-reveal>
                  <div className="ldg-print">
                    <Image
                      src={withBasePath(String(src))}
                      unoptimized
                      width={Number(width)}
                      height={Number(height)}
                      alt={title}
                      sizes="(max-width: 800px) 100vw, 50vw"
                    />
                  </div>
                  <figcaption>
                    <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{body}</p>
                    </div>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      <section id="decisions" className="ldg-section" aria-labelledby="code-title">
        <div className="ldg-wrap">
          <ChapterBar label={`06 — ${s.decisions.label.split("/").pop()?.trim()}`} timecode={chapterTimecodes[4]} />
          <div className="ldg-split ldg-split-code">
            <div className="ldg-code-copy" data-reveal>
              <span className="ldg-kicker">{s.code.label}</span>
              <h2 id="code-title" className="ldg-h2 ldg-h2-sm">
                <AccentTitle text={s.code.title} language={language} />
              </h2>
              <p className="ldg-body">{s.code.body}</p>
            </div>
            <div className="ldg-code" data-reveal>
              <div className="ldg-code-head">
                <span>{t.codeFile}</span>
                <span>SQL</span>
              </div>
              <pre role="region" tabIndex={0} aria-label={s.code.label}>
                <code>
                  {s.code.snippet.split(/(SELECT DISTINCT|FROM|WHERE|AND|IS NOT NULL)/).map((part, index) =>
                    index % 2 === 1 ? <b key={index}>{part}</b> : part,
                  )}
                </code>
              </pre>
            </div>
          </div>
          <h3 className="ldg-sr">{s.decisions.title}</h3>
          <ol className="ldg-decisions" data-reveal>
            {s.decisions.items.map(([title, body], index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h4>{title}</h4>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="ldg-closing" aria-labelledby="closing-title">
        <div className="ldg-closing-inner" data-reveal>
          <span className="ldg-kicker">{`07 — ${s.closing.label}`}</span>
          <h2 id="closing-title">
            {t.closingTop}
            <em>{t.closingBottom}</em>
          </h2>
          <p>
            {s.closing.title}
            {language === "zh" ? "。" : ". "}
            {s.closing.body}
          </p>
          <a className="ldg-btn ldg-btn-lg" href={repositoryUrl} target="_blank" rel="noreferrer">
            {s.closing.cta}
            <ArrowRight aria-hidden="true" />
          </a>
        </div>
        <div className="ldg-hud-end" aria-hidden="true">
          <span>ZISHUN GAO · CASE 01</span>
          <span>{`00:00:15:00 · ${t.hud.end}`}</span>
          <span>51.5074°N 0.1278°W</span>
        </div>
      </section>
    </main>
  );
}
