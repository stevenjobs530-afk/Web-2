"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import PortfolioBackLink from "../../components/portfolio-back-link";
import "./uk-retail-hero.scss";

type Language = "en" | "zh";
const appBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function withBasePath(src: string) {
  return src.startsWith("/") ? `${appBasePath}${src}` : src;
}

// Where each card's pin lands on the artwork (share of its 4:3 frame): the tops of
// the RAW DATA, CLEANING and CLEAN DATA panes.
const pinPositions = [
  ["35%", "43.7%"],
  ["57.1%", "40.7%"],
  ["77.9%", "38.5%"],
];

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

export default function UkRetailCaseStudy({ initialLanguage }: { initialLanguage: Language }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const resolvedUrlLanguage = useRef(false);
  const t = copy[language];
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

  function toggleLanguage() {
    const next: Language = language === "en" ? "zh" : "en";
    setLanguage(next);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", next);
    window.history.replaceState(window.history.state, "", url);
  }

  return (
    <main className="uk-retail-page" lang={language === "zh" ? "zh-CN" : "en"}>
      <PortfolioBackLink href={portfolioHref} language={language} ariaLabel={t.backLabel} />
      <header className="uk-retail-nav">
        <nav className="uk-retail-nav-links" aria-label={t.navigationLabel}>
          <a href={repositoryUrl} target="_blank" rel="noreferrer">
            {t.repository}
          </a>
          <button type="button" onClick={toggleLanguage} aria-label={t.languageLabel}>
            {t.language}
          </button>
        </nav>

        <button
          className="uk-retail-mobile-language"
          type="button"
          onClick={toggleLanguage}
          aria-label={t.languageLabel}
        >
          {t.language}
        </button>

        <a
          className="uk-retail-nav-cta"
          href={repositoryUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={t.repositoryLabel}
        >
          {t.cta}
        </a>
      </header>
      <section className="ukr-hero" aria-labelledby="uk-retail-title">
        <div className="ukr-stage" aria-hidden="true">
          <img
            src={withBasePath("/case-studies/uk-retail/uk-retail-hero-clean-data.webp")}
            alt=""
            fetchPriority="high"
            draggable={false}
          />
        </div>
        <div className="ukr-scrim" aria-hidden="true" />

        <p className="ukr-eyebrow">{t.eyebrow}</p>
        <h1 id="uk-retail-title" className="ukr-title">
          <span className="ukr-line" style={{ "--dl": "0.1s" } as CSSProperties}>
            <span className="ukr-line-in" style={{ "--dl": "0.1s" } as CSSProperties}>{t.titleTop}</span>
          </span>
          <span className="ukr-line" style={{ "--dl": "0.22s" } as CSSProperties}>
            <span className="ukr-line-in" style={{ "--dl": "0.22s" } as CSSProperties}>{t.titleBottom}</span>
          </span>
        </h1>

        <ul className="ukr-pins">
          {t.items.map(([value, label], index) => (
            <li
              key={label}
              className="ukr-pin"
              style={{ "--x": pinPositions[index][0], "--y": pinPositions[index][1] } as CSSProperties}
            >
              <span className="ukr-pin-dot" aria-hidden="true" />
              <span className="ukr-pin-line" aria-hidden="true" />
              <div className="ukr-card">
                <em aria-hidden="true">{String(index + 1).padStart(2, "0")}</em>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="ukr-intro">
          <p>{t.summary}</p>
          <a className="ukr-cta" href="#overview">
            {t.explore}
          </a>
        </div>
      </section>

      <div className="uk-retail-story">
        <section id="overview" className="uk-retail-overview uk-retail-section" aria-labelledby="overview-title">
          <div className="uk-retail-section-heading">
            <p>{t.sections.overview.label}</p>
            <h2 id="overview-title">{t.sections.overview.title}</h2>
          </div>
          <div className="uk-retail-overview-copy">
            <p>{t.sections.overview.body}</p>
            <aside>
              <span>{t.sections.overview.challengeLabel}</span>
              <p>{t.sections.overview.challenge}</p>
            </aside>
          </div>
        </section>

        <section id="method" className="uk-retail-method uk-retail-section uk-retail-section-dark" aria-labelledby="method-title">
          <div className="uk-retail-section-heading">
            <p>{t.sections.method.label}</p>
            <h2 id="method-title">{t.sections.method.title}</h2>
          </div>
          <ol className="uk-retail-method-grid">
            {t.sections.method.steps.map(([number, title, body]) => (
              <li key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="evidence" className="uk-retail-evidence uk-retail-section" aria-labelledby="evidence-title">
          <div className="uk-retail-section-heading">
            <p>{t.sections.evidence.label}</p>
            <h2 id="evidence-title">{t.sections.evidence.title}</h2>
          </div>
          <ol className="uk-retail-evidence-list">
            {t.sections.evidence.steps.map(([label, title, body], index) => (
              <li key={label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p>{label}</p>
                  <h3>{title}</h3>
                </div>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="outputs" className="uk-retail-outputs uk-retail-section" aria-labelledby="outputs-title">
          <div className="uk-retail-output-intro">
            <div className="uk-retail-section-heading">
              <p>{t.sections.outputs.label}</p>
              <h2 id="outputs-title">{t.sections.outputs.title}</h2>
            </div>
            <p>{t.sections.outputs.body}</p>
          </div>
          <div className="uk-retail-chart-grid">
            {[
              ["/case-studies/uk-retail/monthly-revenue-trend.png", 3600, 1800],
              ["/case-studies/uk-retail/top-products-revenue.png", 3600, 2400],
            ].map(([src, width, height], index) => {
              const [title, body] = t.sections.outputs.charts[index];
              return (
                <figure key={String(src)}>
                  <div className="uk-retail-chart-frame">
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
        </section>

        <section className="uk-retail-code uk-retail-section uk-retail-section-dark" aria-labelledby="code-title">
          <div className="uk-retail-code-inner">
            <div className="uk-retail-code-copy">
              <div className="uk-retail-section-heading">
                <p>{t.sections.code.label}</p>
                <h2 id="code-title">{t.sections.code.title}</h2>
              </div>
              <p>{t.sections.code.body}</p>
            </div>
            <pre role="region" tabIndex={0} aria-label={t.sections.code.label}>
              <code>{t.sections.code.snippet}</code>
            </pre>
          </div>
        </section>

        <section id="decisions" className="uk-retail-decisions uk-retail-section" aria-labelledby="decisions-title">
          <div className="uk-retail-section-heading">
            <p>{t.sections.decisions.label}</p>
            <h2 id="decisions-title">{t.sections.decisions.title}</h2>
          </div>
          <ol>
            {t.sections.decisions.items.map(([title, body], index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="results" className="uk-retail-results uk-retail-section" aria-labelledby="results-title">
          <div className="uk-retail-section-heading">
            <p>{t.sections.results.label}</p>
            <h2 id="results-title">{t.sections.results.title}</h2>
          </div>
          <p className="uk-retail-results-body">{t.sections.results.body}</p>
          <dl>
            {t.sections.results.stats.map(([value, label]) => (
              <div key={label}>
                <dt>{value}</dt>
                <dd>{label}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="uk-retail-closing uk-retail-section uk-retail-section-dark" aria-labelledby="closing-title">
          <p>{t.sections.closing.label}</p>
          <h2 id="closing-title">{t.sections.closing.title}</h2>
          <span>{t.sections.closing.body}</span>
          <a href={repositoryUrl} target="_blank" rel="noreferrer">
            {t.sections.closing.cta}
            <ArrowRight aria-hidden="true" />
          </a>
        </section>
      </div>
    </main>
  );
}
