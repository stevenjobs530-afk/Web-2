"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardCheck,
  Database,
  ExternalLink,
  FileCheck2,
  Globe2,
  HeartHandshake,
  LockKeyhole,
  ShieldCheck,
  Users,
} from "lucide-react";
import PortfolioBackLink from "../../components/portfolio-back-link";
import ResilientBackgroundVideo from "../../components/resilient-background-video";
import "./aep-case-study.scss";
import { aepQuestionnaireUrl, aepResearchContent } from "./aep-research-content";

type Language = "en" | "zh";
const appBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const repositoryUrl = "https://github.com/stevenjobs530-afk/AEP-Workplace-Wellbeing-Questionnaire-Formal";
const questionnaireUrl = aepQuestionnaireUrl;
const heroVideo = `${appBasePath}/media/video/early-career-wellbeing-hero.mp4`;
const heroPoster = `${appBasePath}/media/posters/early-career-wellbeing-hero.jpg`;

const flowIcons = [ClipboardCheck, ShieldCheck, LockKeyhole, FileCheck2, Database];

const copy = {
  en: {
    research: "Research",
    system: "System",
    safeguards: "Safeguards",
    language: "中文",
    languageLabel: "Switch to Chinese",
    navLabel: "AEP case study navigation",
    backLabel: "Back to Portfolio — return to the AEP project card",
    repositoryLabel: "Open the AEP questionnaire repository in a new tab",
    sections: {
      flow: {
        label: "07 / Supporting technology",
        title: "Response validation storage and export preparation",
        steps: [
          ["01", "Questionnaire", "The active route and optional answers are serialized without collecting account or login identifiers."],
          ["02", "Validate", "An Edge Function checks origin, consent, version, route, controlled options, ranges and text limits."],
          ["03", "Protect", "The browser cannot read or write the response table directly; the service function performs the insert."],
          ["04", "Check", "Integrity queries test duplicates, consent, routes and selection limits before any export."],
          ["05", "Export", "A flattened CSV-ready query supports later analysis while test and live modes remain separated."],
        ],
      },
      safeguards: {
        label: "08 / Participant safeguards",
        title: "Optionality and data access across the interface and backend",
        intro: "The interface and backend use the same principle: collect only what the research needs, make optionality visible and prevent the public browser from becoming a data-access surface.",
        items: [
          ["Voluntary", "Participants may stop before submission and may skip questions except where consent or routing requires an answer."],
          ["Non-diagnostic", "The questionnaire explicitly avoids presenting itself as a psychological or clinical assessment."],
          ["Anonymous by design", "The response schema does not store a name, email, login identifier, IP address or user agent."],
          ["Deny by default", "RLS is enabled and public browser roles receive no direct response-table privileges."],
        ],
      },
      code: {
        label: "Technical detail",
        title: "The server checks that each submission follows the selected route",
        body: "Client-side branching improves the experience, but hidden fields are not treated as a security boundary. The submission function independently derives the expected route and rejects inconsistent payloads.",
        filename: "supabase/functions/submit-aep-questionnaire/index.ts · TypeScript",
        snippet: `function expectedRoute(situation: string) {
  if (situation === "student" || situation === "recent") return "b1";
  if (situation === "professional") return "b2";
  return "open";
}

if (payload.consented !== true) throw new Error("CONSENT_REQUIRED");
if (payload.route !== expectedRoute(payload.situation as string)) {
  throw new Error("INVALID_ROUTE");
}`,
      },
    },
  },
  zh: {
    research: "研究",
    system: "系统",
    safeguards: "保护措施",
    language: "EN",
    languageLabel: "Switch to English",
    navLabel: "AEP ​案例​研究导航",
    backLabel: "返回​作品​集中​的 AEP ​项目​卡片",
    repositoryLabel: "在新标签页​中打​开 ​AEP 问卷代​码仓库",
    sections: {
      flow: {
        label: "07 / ​技术​支撑",
        title: "回答验证、⁠存储​与导出​准备",
        steps: [
          ["01", "问卷", "序列化​当前​路径​与可选​回答，​不收集账户​或登录​标识。"],
          ["02", "验证", "Edge Function ​检查​来源、​同意​状态、​版本、​路径、​选项、​评分​范围​与文本​长度。"],
          ["03", "保护", "浏览器​不能​直接​读写​回答表；​只有​服务器​函数​执行​插入。"],
          ["04", "检查", "导出​前使用​完整性​查询​检查​重复、​同意​状态、​路径​与选择​限制。"],
          ["05", "导出", "扁平化​的 CSV 查询​支持​后续​分析，​同时​保持​测试​与正式​数据​分离。"],
        ],
      },
      safeguards: {
        label: "08 / 参与者​保护",
        title: "界面​与后端​共同​处理​可选性​和数据​访问",
        intro: "界面​与后端遵​循同​一原​则：​只收集​研究​真正​需要​的信息，​明确​展示​可选性，​并防止​公开​浏览器​成为​数据​访问​入口。",
        items: [
          ["自愿参与", "参与者​可在​提交​前停止，​并可​跳过除​同意​与路径​分流​所需​之外​的问题。"],
          ["非诊断", "问卷明确​说明​自己​不是​心理​或临床​评估。"],
          ["匿名设计", "回答​结构​不存储​姓名、​邮箱、​登录​标识、​IP ​地址​或浏览器​用户​代理。"],
          ["默认拒绝", "RLS ​已启用，​公开​浏览器​角色​没有​回答表​的直接​访问​权限。"],
        ],
      },
      code: {
        label: "技术细节",
        title: "服务器​检查​每次​提交​是否​符合所​选路径",
        body: "客户​端分流​可以​改善​体验，​但隐藏​字段​并不​是安全​边界。​提交​函数​会独立​推导​应有​路径，​并拒绝​不一致​的数据。",
        filename: "supabase/functions/submit-aep-questionnaire/index.ts · TypeScript",
        snippet: `function expectedRoute(situation: string) {
  if (situation === "student" || situation === "recent") return "b1";
  if (situation === "professional") return "b2";
  return "open";
}

if (payload.consented !== true) throw new Error("CONSENT_REQUIRED");
if (payload.route !== expectedRoute(payload.situation as string)) {
  throw new Error("INVALID_ROUTE");
}`,
      },
    },
  },
} as const;

export default function AepCaseStudy({ initialLanguage }: { initialLanguage: Language }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const resolvedUrlLanguage = useRef(false);
  const t = copy[language];
  const r = aepResearchContent[language];
  const portfolioHref = `${appBasePath}/?lang=${language}#project-early-career-wellbeing`;

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
    const content = aepResearchContent[language];
    document.title = `${content.title} — ${language === "zh" ? "高子舜" : "Zishun Gao"}`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", content.description);
    return () => { document.documentElement.lang = previousLanguage; };
  }, [language]);

  function handleSectionLink(event: MouseEvent<HTMLElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
    const target = link ? document.getElementById(link.hash.slice(1)) : null;
    if (!link || !target) return;

    // Keep local anchors out of the router's native-hash navigation loop.
    event.preventDefault();
    if (window.location.hash !== link.hash) window.history.pushState(window.history.state, "", link.hash);
    target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    target.focus({ preventScroll: true });
  }

  function toggleLanguage() {
    const next: Language = language === "en" ? "zh" : "en";
    setLanguage(next);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", next);
    window.history.replaceState(window.history.state, "", url);
  }

  return (
    <main className="aep-page" onClick={handleSectionLink} lang={language === "zh" ? "zh-CN" : "en"}>
      <PortfolioBackLink href={portfolioHref} language={language} ariaLabel={t.backLabel} />
      <section className="aep-hero" aria-labelledby="aep-title">
        <ResilientBackgroundVideo
          className="aep-hero-media"
          videoClassName="aep-hero-video"
          src={heroVideo}
          poster={heroPoster}
          priority
          language={language}
          controlClassName="aep-video-control"
        />
        <div className="aep-hero-shade" aria-hidden="true" />

        <header className="aep-nav">
          <nav className="aep-nav-links aep-glass" aria-label={t.navLabel}>
            <a href="#research">{t.research}</a>
            <a href="#contribution">{r.contributionLink}</a>
            <a href="#findings">{r.findingsLink}</a>
            <a href="#system">{t.system}</a>
            <a href="#safeguards">{t.safeguards}</a>
            <button type="button" onClick={toggleLanguage} aria-label={t.languageLabel}>{t.language}</button>
          </nav>
          <button className="aep-mobile-language aep-glass" type="button" onClick={toggleLanguage} aria-label={t.languageLabel}>{t.language}</button>
        </header>

        <div className="aep-hero-copy">
          <p>{r.eyebrow}</p>
          <h1 id="aep-title">{r.title}</h1>
          <span>{r.description}</span>
          <div className="aep-hero-actions">
            <a className="aep-primary" href="#findings">{r.explore}<ArrowRight aria-hidden="true" /></a>
            <a className="aep-secondary aep-glass" href={questionnaireUrl} target="_blank" rel="noreferrer" aria-label={r.instrumentLabel}>{r.instrument}<ExternalLink aria-hidden="true" /></a>
          </div>
        </div>

        <dl className="aep-metrics aep-glass">
          {r.metrics.map(([value, label]) => <div key={label}><dt>{value}</dt><dd>{label}</dd></div>)}
        </dl>
      </section>

      <article className="aep-story">
        <nav className="aep-reading-links" aria-label={language === "en" ? "Explore the case study" : "浏览案​例内容"}>
          <a href="#research">{t.research}</a>
          <a href="#contribution">{r.contributionLink}</a>
          <a href="#questionnaire">{r.questionnairePreview.link}</a>
          <a href="#findings">{r.findingsLink}</a>
          <a href="#system">{t.system}</a>
          <a href="#safeguards">{t.safeguards}</a>
        </nav>
        <section id="research" tabIndex={-1} className="aep-section aep-purpose" aria-labelledby="purpose-title">
          <div className="aep-heading"><p>{r.purpose.label}</p><h2 id="purpose-title">{r.purpose.title}</h2></div>
          <div className="aep-purpose-grid">
            <p>{r.purpose.body}</p>
            <aside><span>{r.purpose.boundaryLabel}</span><p>{r.purpose.boundary}</p></aside>
          </div>
        </section>

        <section id="contribution" tabIndex={-1} className="aep-section aep-safeguards" aria-labelledby="contribution-title">
          <div className="aep-heading"><p>{r.contribution.label}</p><h2 id="contribution-title">{r.contribution.title}</h2></div>
          <p className="aep-intro">{r.contribution.intro}</p>
          <div className="aep-editorial-grid">{r.contribution.items.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div>
        </section>

        <section id="questionnaire" tabIndex={-1} className="aep-section aep-questionnaire" aria-labelledby="questionnaire-title">
          <div className="aep-heading"><p>{r.questionnairePreview.label}</p><h2 id="questionnaire-title">{r.questionnairePreview.title}</h2></div>
          <p className="aep-intro">{r.questionnairePreview.intro}</p>
          <div className="aep-questionnaire-gallery">
            {r.questionnairePreview.images.map(([file, title, caption, alt]) => {
              const src = `${appBasePath}/case-studies/early-career-wellbeing/questionnaire-${file}.webp`;
              return <figure key={file}>
                <a href={src} target="_blank" rel="noreferrer" aria-label={`${title} — ${r.questionnairePreview.hint}`}>
                  {/* Fixed-size static screenshots retain their native aspect ratio. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={alt} width={844} height={840} loading="lazy" decoding="async" />
                </a>
                <figcaption><h3>{title}</h3><p>{caption}</p></figcaption>
              </figure>;
            })}
          </div>
          <div className="aep-questionnaire-footer">
            <p className="aep-preview-hint">{r.questionnairePreview.hint}</p>
            <p>{r.questionnairePreview.privacy}</p>
            <a href={questionnaireUrl} target="_blank" rel="noreferrer">{r.questionnairePreview.cta}<ExternalLink aria-hidden="true" /></a>
            <p>{r.questionnairePreview.note}</p>
          </div>
        </section>

        <section id="methods" tabIndex={-1} className="aep-section aep-routes aep-dark" aria-labelledby="methods-title">
          <div className="aep-heading"><p>{r.methods.label}</p><h2 id="methods-title">{r.methods.title}</h2></div>
          <p className="aep-intro">{r.methods.intro}</p>
          <ol className="aep-sample-flow">{r.methods.steps.map(([count, label]) => <li key={label}><strong>{count}</strong><span>{label}</span></li>)}</ol>
          <div className="aep-research-notes"><p>{r.methods.note}</p><p>{r.methods.snapshot}</p><p>{r.methods.routes}</p></div>
        </section>

        <section id="findings" tabIndex={-1} className="aep-section aep-findings" aria-labelledby="findings-title">
          <div className="aep-heading"><p>{r.findings.label}</p><h2 id="findings-title">{r.findings.title}</h2></div>
          <p className="aep-intro">{r.findings.intro}</p>
          <div className="aep-finding-grid">{r.findings.cards.map(([percentage, count, title, body]) => <article key={title}><strong>{percentage}</strong><span>{count}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
          <aside className="aep-insight"><h3>{r.findings.insightTitle}</h3><p>{r.findings.insight}</p><p>{r.findings.caution}</p></aside>
          <p className="aep-source-note">{r.findings.source}</p>
        </section>

        <section id="recommendations" tabIndex={-1} className="aep-section aep-safeguards" aria-labelledby="recommendations-title">
          <div className="aep-heading"><p>{r.recommendations.label}</p><h2 id="recommendations-title">{r.recommendations.title}</h2></div>
          <p className="aep-intro">{r.recommendations.intro}</p>
          <div className="aep-editorial-grid">{r.recommendations.items.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div>
        </section>

        <section id="reflection" tabIndex={-1} className="aep-section aep-outcomes" aria-labelledby="reflection-title">
          <div className="aep-heading"><p>{r.reflection.label}</p><h2 id="reflection-title">{r.reflection.title}</h2></div>
          <p className="aep-intro">{r.reflection.intro}</p>
          <ol>{r.reflection.items.map(([title, body], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{body}</p></li>)}</ol>
        </section>

        <section id="system" tabIndex={-1} className="aep-section aep-flow aep-dark" aria-labelledby="flow-title">
          <div className="aep-heading"><p>{t.sections.flow.label}</p><h2 id="flow-title">{t.sections.flow.title}</h2></div>
          <ol>{t.sections.flow.steps.map(([number, title, body], index) => {
            const Icon = flowIcons[index];
            return <li key={number}><div><Icon aria-hidden="true" /></div><span>{number}</span><h3>{title}</h3><p>{body}</p></li>;
          })}</ol>
        </section>

        <section id="safeguards" tabIndex={-1} className="aep-section aep-safeguards" aria-labelledby="safeguards-title">
          <div className="aep-heading"><p>{t.sections.safeguards.label}</p><h2 id="safeguards-title">{t.sections.safeguards.title}</h2></div>
          <p className="aep-intro">{t.sections.safeguards.intro}</p>
          <div className="aep-safeguard-grid">
            {t.sections.safeguards.items.map(([title, body], index) => <article key={title}>{index === 0 ? <HeartHandshake aria-hidden="true" /> : index === 1 ? <Globe2 aria-hidden="true" /> : index === 2 ? <Users aria-hidden="true" /> : <LockKeyhole aria-hidden="true" />}<h3>{title}</h3><p>{body}</p></article>)}
          </div>
        </section>

        <section className="aep-section aep-code aep-dark" aria-labelledby="code-title">
          <div><div className="aep-heading"><p>{t.sections.code.label}</p><h2 id="code-title">{t.sections.code.title}</h2></div><p>{t.sections.code.body}</p></div>
          <pre role="region" tabIndex={0} aria-label={t.sections.code.filename}><span tabIndex={0}>{t.sections.code.filename}</span><code>{t.sections.code.snippet}</code></pre>
        </section>

        <section id="limitations" tabIndex={-1} className="aep-section aep-outcomes" aria-labelledby="limits-title">
          <div className="aep-heading"><p>{r.limits.label}</p><h2 id="limits-title">{r.limits.title}</h2></div>
          <ol className="aep-limitations-grid">{r.limits.items.map(([title, body], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{body}</p></li>)}</ol>
          <p className="aep-source-note">{r.limits.source}</p>
        </section>

        <section className="aep-section aep-closing aep-dark" aria-labelledby="closing-title">
          <p>{r.closing.label}</p><h2 id="closing-title">{r.closing.title}</h2><span>{r.closing.body}</span>
          <div>
            <a href={portfolioHref}>{r.closing.projects}<ArrowLeft aria-hidden="true" /></a>
            <a href={questionnaireUrl} target="_blank" rel="noreferrer" aria-label={r.instrumentLabel}>{r.closing.questionnaire}<ExternalLink aria-hidden="true" /></a>
            <a href={repositoryUrl} target="_blank" rel="noreferrer" aria-label={t.repositoryLabel}>{r.closing.repository}<ExternalLink aria-hidden="true" /></a>
          </div>
        </section>
      </article>
    </main>
  );
}
