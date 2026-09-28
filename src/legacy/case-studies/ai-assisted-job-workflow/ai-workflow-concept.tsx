"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  Scale,
  Search,
  ShieldCheck,
  Table2,
  UserCheck,
} from "lucide-react";
import PortfolioBackLink from "../../components/portfolio-back-link";
import ResilientBackgroundVideo from "../../components/resilient-background-video";
import AiLogoLoop from "./ai-logo-loop";
import "./ai-workflow-concept.scss";

type Language = "en" | "zh";
const appBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const stageIcons = [Search, FileSearch, Scale, Table2];
const heroVideo = `${appBasePath}/media/video/ai-workflow-hero.mp4`;
const heroPoster = `${appBasePath}/media/posters/ai-workflow-hero.jpg`;

const copy = {
  en: {
    documentTitle: "AI-Assisted Job Workflow Concept — Zishun Gao",
    documentDescription: "A human-controlled workflow concept for discovering, validating, comparing and tracking UK early-career opportunities with AI assistance.",
    system: "System",
    responsibilities: "Responsibilities",
    safeguardsNav: "Safeguards",
    measurement: "Measurement",
    language: "中文",
    languageLabel: "Switch to Chinese",
    navLabel: "AI workflow concept navigation",
    backLabel: "Back to Portfolio — return to the AI workflow feature",
    hero: {
      eyebrow: "Workflow concept · AI-assisted job research",
      title: "A structured process for UK job research",
      summary: "The workflow uses AI to help discover, check, compare and track early-career opportunities. Personal decisions, account changes and applications remain manual.",
      cta: "Explore the workflow",
      return: "Back to portfolio",
      note: "Read-only discovery · Manual applications",
      stagesLabel: "Four-stage AI-assisted workflow",
      stages: [
        ["01", "Discover", "Find possible roles across named, relevant sources."],
        ["02", "Validate", "Return to the original vacancy and check the evidence."],
        ["03", "Compare", "Explain fit, gaps, requirements and uncertainty."],
        ["04", "Track", "Record status, evidence dates and the next action."],
      ],
    },
    framing: {
      label: "01 / Why this workflow exists",
      title: "Why a structured search and review process is useful",
      body: "Early-career vacancies are distributed across company sites, job boards and professional networks. Titles vary, requirements are easy to miss and the same role can appear more than once. The workflow organises that search into a consistent review process while leaving career decisions to the user.",
      principleLabel: "Working principle",
      principle: "Use AI for breadth, structure and first-pass comparison. Use primary evidence, testing and human judgment for accuracy and action.",
      statusLabel: "Current status",
      status: "This page documents a workflow concept. It does not claim measured outcomes, automated applications or employer decisions.",
    },
    loop: {
      label: "02 / The operating loop",
      title: "Four stages with a defined output",
      stages: [
        ["Discover", "AI support", "Search within an agreed target set; capture the role, employer, location, source and closing date.", "Output: candidate vacancy list"],
        ["Validate", "Evidence check", "Open the original listing; confirm that it is active and check mandatory requirements, location, work-right wording and source date.", "Output: verified source record"],
        ["Compare", "Transparent reasoning", "Compare the vacancy with supported experience. Separate direct evidence, transferable evidence, gaps and unresolved questions.", "Output: fit note with caveats"],
        ["Track", "Structured follow-up", "Write the confirmed record to a workbook without overwriting its history. Keep status changes tied to dated evidence.", "Output: current next action"],
      ],
    },
    roles: {
      label: "03 / AI versus human responsibility",
      title: "What AI supports and what remains manual",
      aiTitle: "AI may support",
      humanTitle: "I retain control",
      ai: [
        "Search within sources and criteria I define",
        "Extract comparable vacancy fields",
        "Draft evidence-linked fit and gap notes",
        "Flag duplicates, missing fields and stale dates",
        "Prepare a reviewable tracker update",
      ],
      human: [
        "Decide which roles are genuinely relevant",
        "Verify sensitive or ambiguous requirements",
        "Choose the truthful wording used in an application",
        "Approve any workbook or status change",
        "Complete and submit every application manually",
      ],
      boundary: "Passwords, identity documents, private account access, final answers and submission authority remain outside the AI workflow.",
    },
    evidence: {
      label: "04 / Transparent comparison",
      title: "How role fit is compared with available evidence",
      intro: "The comparison keeps four evidence layers distinct so a confident tone cannot hide a weak basis.",
      layers: [
        ["Direct evidence", "The vacancy asks for something already demonstrated by a project, course or verified experience."],
        ["Transferable evidence", "A related capability can reasonably transfer, but the connection must be stated rather than assumed."],
        ["Gap", "A required or preferred capability is not supported by current evidence."],
        ["Unresolved", "The source is ambiguous, unavailable or needs a human decision before the role can progress."],
      ],
      callout: "A recommendation is never stronger than the source evidence behind it.",
    },
    tracker: {
      label: "05 / The tracker",
      title: "Sources status and next actions in the workbook",
      intro: "Each row is a compact decision record. The structure below is illustrative and anonymised; it does not expose private application data.",
      columns: ["Company", "Role", "Source", "Fit rationale", "Status", "Next action", "Evidence date"],
      rows: [
        ["Company A", "Risk graduate", "Verified", "Direct + transferable", "Review", "Check work-right wording", "12 Aug"],
        ["Company B", "Finance analyst", "Verified", "Direct evidence", "Shortlist", "Prepare tailored examples", "13 Aug"],
        ["Company C", "Data graduate", "Needs check", "Gap recorded", "Hold", "Confirm mandatory tool", "13 Aug"],
      ],
      rules: [
        "Preserve the original workbook and create a dated copy before edits.",
        "Keep the source date separate from today and retain the direct vacancy link.",
        "Treat emails or status changes as evidence only after the exact record is checked.",
        "Do not convert a missing answer into a confident assumption.",
      ],
    },
    safeguards: {
      label: "06 / Safeguards",
      title: "Limits applied throughout the workflow",
      items: [
        ["Read-only discovery", "Search and review do not authorise account changes, messages, submissions or external actions."],
        ["Primary-source validation", "A vacancy is not treated as current until the original listing and key requirements have been checked."],
        ["Privacy boundary", "Private credentials, identity documents and sensitive application data are not placed into a public case study."],
        ["Honest positioning", "Fit notes distinguish demonstrated capability from foundational knowledge, learning goals and unsupported claims."],
        ["Ambiguity pause", "Forced or unclear work-right, sponsorship or personal questions stop for human review."],
        ["Manual submission", "The user remains responsible for final wording, declarations, attachments and the submit action."],
      ],
    },
    results: {
      label: "07 / Measurement and limits",
      title: "Metrics to collect before evaluating the workflow",
      intro: "The concept becomes credible through dated evidence, not through impressive-sounding automation claims.",
      measures: [
        ["Source coverage", "How many target sources were checked and how recently."],
        ["Validation rate", "How many discovered roles remained active and usable after source review."],
        ["Duplicate rate", "How often the same role was found through multiple routes."],
        ["Follow-up completeness", "How many active records have a clear owner, evidence date and next action."],
        ["Outcome progression", "How verified applications progress over time, without treating generic receipts as success."],
      ],
      limitLabel: "What this page does not claim",
      limit: "No measured time saving, application success rate, recruiter response rate or hiring outcome is presented yet. Until those figures are collected and verified, this remains an AI Workflow Concept.",
    },
    closing: {
      label: "Summary",
      title: "The documented process responsibilities and current limits",
      body: "It records how sources are checked, how roles are compared, what is tracked and which actions remain outside the AI-assisted process.",
      back: "Back to the portfolio",
    },
  },
  zh: {
    documentTitle: "AI 辅助求职工作流概念 — 高子舜",
    documentDescription: "这套​流程​使用​ A​I ​辅助​发现、​核验、​比较​和跟踪​初级​职业​机会；​个人​决定、​账户​变更​与申请​仍由​人工​完成。",
    system: "系统",
    responsibilities: "职责边界",
    safeguardsNav: "保护措施",
    measurement: "衡量方法",
    language: "EN",
    languageLabel: "切换​至英文",
    navLabel: "AI ​工作​流概​念导航",
    backLabel: "返回​作品​集中​的 A​I ​工作​流部分",
    hero: {
      eyebrow: "工作​流概念 · AI ​辅助​求职​信息​整理",
      title: "英国​求职​信息​的结构​化整理​流程",
      summary: "这套​流程​使用​ A​I ​辅助​发现、​核验、​比较​和跟踪​初级​职业​机会；​个人​决定、​账户​变更​与申请​仍由​人工​完成。",
      cta: "了解​工作流",
      return: "返回​作品集",
      note: "只读​发现 · 人​工完成​申请",
      stagesLabel: "四阶段 AI ​辅助​工作流",
      stages: [
        ["01", "发现", "从指定​且相关​的来源​中寻找​可能​合适​的岗位。"],
        ["02", "核验", "回到​原始​职位​页面，​检查​信息​与要求。"],
        ["03", "比较", "说明​匹配、​差距、​要求​与不确定性。"],
        ["04", "跟踪", "记录​状态、​证据​日期​与下一​步行动。"],
      ],
    },
    framing: {
      label: "01 / ​为什么​需要​这套​工作流",
      title: "为什么​需要​结构化​的搜索​与核验​流程",
      body: "初级​职业​机会​分散​在公司​网站、​招聘​平台​和职业​网络​中。​职位​名称​并不​统一，​关键​要求​容易​遗漏，​同一​岗位​也可能​重复​出现。​这套​工作​流将​分散​搜索​整理​为一致​的复核​过程，​职业​决定​仍由​用户​完成。",
      principleLabel: "工作原则",
      principle: "让 AI​ ​扩大​范围、​整理​结构​并完成​初步​比较；​让原始​证据、​测试​与人工​判断​保证​准确性​和行动​质量。",
      statusLabel: "当前状态",
      status: "本页面​记录​的是​工作​流概念，​不声称​已经​取得量化​结果，​也不​声称​可以​自动​申请​或代表​雇主​决定。",
    },
    loop: {
      label: "02 / ​运行循环",
      title: "四个​阶段​与对​应输出",
      stages: [
        ["发现", "AI ​辅助", "在商定​的目标​集合​中搜索，​记录​职位、​雇主、​地点、​来源​与截止​日期。", "输出：⁠候选职​位清单"],
        ["核验", "证据检查", "打开​原始​职位，​确认​仍然​有效，​并检查硬性​要求、​地点、​工作​权利​表述​与来源​日期。", "输出：⁠已核验​来源​记录"],
        ["比较", "透明推理", "把职位​要求​与已​有经历​比较，​分开​记录​直接​证据、​可迁​移证据、​差距​与未解决​问题。", "输出：⁠含限制​的匹配​说明"],
        ["跟踪", "结构化​跟进", "在不覆​盖历史​的前​提下，​将确​认后​的记录​写入​工作簿，​并让​状态变化​对应​日期​证据。", "输出：⁠当前​下一​步行动"],
      ],
    },
    roles: {
      label: "03 / A​I ​与人​的职责​边界",
      title: "AI ​辅助​范围​与人工操作​范围",
      aiTitle: "A​I ​可以​辅助",
      humanTitle: "我保留​控制权",
      ai: ["在我​设定​的来源​和条件​中搜索", "提取​可比较​的职位​字段", "起草​基于​证据​的匹配​与差距​说明", "标记​重复、⁠缺失​字段​与过期​日期", "准备​可复核​的跟踪表​更新"],
      human: ["决定​哪些​职位​真正​相关", "核验​敏感​或模糊​的要求", "选择​申请​中真实且​准确​的表述", "批准​任何​工作​簿或​状态​变更", "亲自​完成​并提交​每一​份申请"],
      boundary: "密码、​身份​证明、​私人​账户​访问、​最终​答案​与提交​权限均​不属于​ A​I ​工作流。",
    },
    evidence: {
      label: "04 / ​透明​比较",
      title: "如何​根据​现有​资料​比较​岗位​匹配​情况",
      intro: "比较​过程明确区​分四​层证据，​避免​自信​的语气​掩盖​薄弱​的依据。",
      layers: [
        ["直接证据", "职位​要求​对应​已由​项目、​课程​或可​核验​经历​展示​的能力。"],
        ["可迁移证据", "相关​能力​可能​合理​迁移，​但必须​清楚​说明连接​逻辑，​而不​能默认​成立。"],
        ["差距", "硬性​或优先​要求​目前​没有​得到​证据​支持。"],
        ["未解决", "来源​含糊、​无法​访问，​或需要​人工​决定​后才​能继续。"],
      ],
      callout: "建议​的可​信度，​永远​不能​超过​其背​后的​来源​证据。",
    },
    tracker: {
      label: "05 / ​跟踪表",
      title: "工作​簿中​的来源、⁠状态​与下一步",
      intro: "每一​行都​是精简​的决策​记录。​以下​结构​仅作示意且​已经​匿名化，​不展示私人​申请​信息。",
      columns: ["公司", "职位", "来源", "匹配依据", "状态", "下一步", "证据日期"],
      rows: [
        ["公司 A", "风险管培生", "已核验", "直接​ ​+ ​可迁移", "复核", "检查​工作权利表述", "8 月​ 1​2 日"],
        ["公司 B", "财务​分析师", "已核验", "直接证据", "短名单", "准备​针对性​案例", "8 月​ 1​3 日"],
        ["公司 C", "数据​管培生", "待检查", "已记录差距", "暂缓", "确认硬性​工具​要求", "8 月​ 1​3 日"],
      ],
      rules: ["保留​原始​工作簿，​修改​前先​创建带​日期​的副本。", "将来源​日期​与今天​分开​记录，​并保留​职位​原始​链接。", "只有​核对​准确​记录​后，​邮件​或状态变化​才能​作为​证据。", "不能​把缺失​答案​转化​为自信​假设。"],
    },
    safeguards: {
      label: "06 / ​保护​措施",
      title: "工作​流各​阶段​使用​的限制​条件",
      items: [
        ["只读发现", "搜索​与复核​不代表​可以​更改账户、​发送​消息、​提交​申请​或执行​外部​操作。"],
        ["原始​来源​核验", "只有​核对​原始​职位​与关键​要求​后，​才把​机会​视为​当前​有效。"],
        ["隐私边界", "私人​凭证、​身份​证明​与敏感​申请​数据​不会​出现在​公开​案例​中。"],
        ["诚实定位", "匹配​说明会​区分​已展示​能力、​基础​知识、​学习​目标​与缺乏​支持​的说法。"],
        ["遇到​歧义​暂停", "工作​权利、​担保​或个人​问题​如果​被强制​回答​或含义​不清，​会暂​停并​交由​人工复核。"],
        ["人工提交", "最终​措辞、​声明、​附件​与提交动​作始终​由用户​负责。"],
      ],
    },
    results: {
      label: "07 / ​衡量​与限制",
      title: "评估​工作​流前​需要​收集​的指标",
      intro: "这个​概念​需要​通过​带日期​的证据​建立​可信度，​而不​是依靠​听起来​很强​的自动化​说法。",
      measures: [
        ["来源覆盖", "检查​了多​少目标​来源，​以及​检查​时间​有多近。"],
        ["核验比例", "发现​的职位​中，​有多​少在​来源​复核后​仍然​有效且​可使用。"],
        ["重复比例", "同一​职位​通过​多个​渠道​被发现​的频率。"],
        ["跟进完​整度", "有多少​有效记录​具备明确​责任人、​证据​日期​与下​一步。"],
        ["结果进展", "已核验​申请​如何​随时间​推进，​同时​不把​普通​回执当​作成功。"],
      ],
      limitLabel: "本页面​不声​称什么",
      limit: "目前​不展示​节省​时间、​申请​成功率、​招聘方​回复率​或录用​结果。​只有​在相关​数据​被收集​并核验​后，​本页面​才会​从“AI​ ​工作​流概念”​升级​为案例​研究。",
    },
    closing: {
      label: "项目总结",
      title: "本页​记录​的流程、⁠职责​分工​与当前​限制",
      body: "内容​包括​来源​核验、​岗位​比较、​跟踪​字段，​以及​不属于​ A​I ​辅助​流程​的操作。",
      back: "返回​作品集",
    },
  },
} as const;

function ArrowAction() {
  return <ArrowRight aria-hidden="true" />;
}

export default function AiWorkflowConcept({ initialLanguage }: { initialLanguage: Language }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const resolvedUrlLanguage = useRef(false);
  const t = copy[language];
  const portfolioHref = `${appBasePath}/?lang=${language}#ai-workflow`;

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

    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.title = t.documentTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.documentDescription);
    url.searchParams.set("lang", language);
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }, [language, t.documentTitle, t.documentDescription]);

  function toggleLanguage() {
    setLanguage((current) => current === "en" ? "zh" : "en");
  }

  return (
    <main className="ai-concept-page" lang={language === "zh" ? "zh-CN" : "en"}>
      <PortfolioBackLink href={portfolioHref} language={language} ariaLabel={t.backLabel} />
      <section className="ai-concept-hero">
        <ResilientBackgroundVideo
          className="ai-concept-hero-media"
          videoClassName="ai-concept-hero-video"
          src={heroVideo}
          poster={heroPoster}
          priority
          language={language}
          controlClassName="ai-concept-video-control"
        />
        <div className="ai-concept-frame">
          <nav className="ai-concept-nav" aria-label={t.navLabel}>
            <div className="ai-concept-nav-links">
              <a href="#system">{t.system}</a>
              <a href="#responsibilities">{t.responsibilities}</a>
              <a href="#safeguards">{t.safeguardsNav}</a>
              <button type="button" onClick={toggleLanguage} aria-label={t.languageLabel}>{t.language}</button>
            </div>
          </nav>

          <div className="ai-concept-hero-copy">
            <h1>{t.hero.title}</h1>
            <span>{t.hero.summary}</span>
            <a className="ai-concept-primary" href="#system">{t.hero.cta}</a>
            <p>{t.hero.note}</p>
          </div>
        </div>
      </section>

      <article className="ai-concept-article">
        <section className="ai-concept-section ai-concept-framing">
          <header><p>{t.framing.label}</p><h2>{t.framing.title}</h2></header>
          <div className="ai-concept-framing-grid">
            <p className="ai-concept-framing-copy">{t.framing.body}</p>
            <AiLogoLoop language={language} />
            <aside className="ai-concept-framing-card"><span>{t.framing.principleLabel}</span><strong>{t.framing.principle}</strong></aside>
            <aside className="ai-concept-framing-card"><span>{t.framing.statusLabel}</span><strong>{t.framing.status}</strong></aside>
          </div>
        </section>

        <section id="system" className="ai-concept-section ai-concept-loop">
          <header><p>{t.loop.label}</p><h2>{t.loop.title}</h2></header>
          <div className="ai-concept-loop-grid">
            {t.loop.stages.map(([title, mode, detail, output], index) => {
              const Icon = stageIcons[index];
              return <article key={title}><div><span>{String(index + 1).padStart(2, "0")}</span><Icon aria-hidden="true" /></div><p>{mode}</p><h3>{title}</h3><span>{detail}</span><strong>{output}</strong></article>;
            })}
          </div>
        </section>

        <section id="responsibilities" className="ai-concept-section ai-concept-roles">
          <header><p>{t.roles.label}</p><h2>{t.roles.title}</h2></header>
          <div className="ai-concept-role-grid">
            <article><FileSearch aria-hidden="true" /><h3>{t.roles.aiTitle}</h3><ul>{t.roles.ai.map((item) => <li key={item}><CheckCircle2 aria-hidden="true" />{item}</li>)}</ul></article>
            <article><UserCheck aria-hidden="true" /><h3>{t.roles.humanTitle}</h3><ul>{t.roles.human.map((item) => <li key={item}><CheckCircle2 aria-hidden="true" />{item}</li>)}</ul></article>
          </div>
          <p className="ai-concept-boundary"><ShieldCheck aria-hidden="true" />{t.roles.boundary}</p>
        </section>

        <section className="ai-concept-section ai-concept-evidence">
          <header><p>{t.evidence.label}</p><h2>{t.evidence.title}</h2><span>{t.evidence.intro}</span></header>
          <div className="ai-concept-evidence-grid">
            {t.evidence.layers.map(([title, detail], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{detail}</p></article>)}
          </div>
          <blockquote><Scale aria-hidden="true" />{t.evidence.callout}</blockquote>
        </section>

        <section className="ai-concept-section ai-concept-tracker">
          <header><p>{t.tracker.label}</p><h2>{t.tracker.title}</h2><span>{t.tracker.intro}</span></header>
          <div className="ai-concept-table-wrap" tabIndex={0} role="region" aria-label={t.tracker.title}>
            <table>
              <thead><tr>{t.tracker.columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead>
              <tbody>{t.tracker.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <ul className="ai-concept-tracker-rules">{t.tracker.rules.map((rule) => <li key={rule}><CheckCircle2 aria-hidden="true" />{rule}</li>)}</ul>
        </section>

        <section id="safeguards" className="ai-concept-section ai-concept-safeguards">
          <header><p>{t.safeguards.label}</p><h2>{t.safeguards.title}</h2></header>
          <div className="ai-concept-safeguard-grid">
            {t.safeguards.items.map(([title, detail], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><ShieldCheck aria-hidden="true" /><h3>{title}</h3><p>{detail}</p></article>)}
          </div>
        </section>

        <section id="measurement" className="ai-concept-section ai-concept-results">
          <header><p>{t.results.label}</p><h2>{t.results.title}</h2><span>{t.results.intro}</span></header>
          <dl>{t.results.measures.map(([term, detail]) => <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}</dl>
          <aside><span>{t.results.limitLabel}</span><p>{t.results.limit}</p></aside>
        </section>

        <section className="ai-concept-closing">
          <p>{t.closing.label}</p>
          <h2>{t.closing.title}</h2>
          <span>{t.closing.body}</span>
          <a href={portfolioHref}>{t.closing.back}<ArrowAction /></a>
        </section>
      </article>
    </main>
  );
}
