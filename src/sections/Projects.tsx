import { useRef } from "react";
import { motion, useMotionTemplate, useReducedMotion, useScroll } from "motion/react";
import { LIVE_SITE, QUESTIONNAIRE_URL, links, type Content } from "../data/content";
import { ArrowRight, ArrowUpRight, Film, Reveal, SectionHead, asset, useRange } from "../components/primitives";

type Project = Content["projects"]["items"][number];

function Path({ steps, tone = "light" }: { steps: readonly string[]; tone?: "light" | "dark" }) {
  return (
    <ol className={tone === "dark" ? "path path--dark" : "path"}>
      {steps.map((step, index) => (
        <li key={step} className="path__step">
          <span>{step}</span>
          {index < steps.length - 1 ? <ArrowRight className="path__arrow" /> : null}
        </li>
      ))}
    </ol>
  );
}

function caseStudyHref(slug: string) {
  return `${LIVE_SITE}/case-studies/${slug}/`;
}

/** 01 · UK retail — bright product panel with the cleaned-data artwork. */
function RetailPanel({ p, read }: { p: Project; read: string }) {
  return (
    <Reveal className="panel panel--light">
      <div className="panel__copy">
        <p className="mono-label">
          <span className="mono-label__num">01</span>
          {p.type} · {p.tools}
        </p>
        <h3 className="panel__title">{p.title}</h3>
        <p className="panel__body">{p.description}</p>
        <div className="mt-8">
          <span className="metric-figure metric-figure--azure">{p.metric}</span>
          <span className="metric-label">{p.metricLabel}</span>
        </div>
        <Path steps={p.path} />
        <p className="panel__note">{p.value}</p>
        <a className="text-link" href={caseStudyHref(p.slug)} target="_blank" rel="noreferrer">
          {read} <ArrowUpRight className="size-4" />
        </a>
      </div>
      <div className="panel__art">
        <img src={asset("projects/uk-retail-hero-clean-data.webp")} alt="" loading="lazy" />
      </div>
    </Reveal>
  );
}

/** 02 · Apple App Store — the boy-at-the-window film opens up to full bleed as you scroll. */
function AppleCinema({ p, read }: { p: Project; read: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const inset = useRange(scrollYProgress, [0, 0.5], [7, 0]);
  const radius = useRange(scrollYProgress, [0, 0.5], [36, 0]);
  const copyOpacity = useRange(scrollYProgress, [0.42, 0.66], [0, 1]);
  const copyY = useRange(scrollYProgress, [0.42, 0.66], [36, 0]);
  const clipPath = useMotionTemplate`inset(${inset}% ${inset}% ${inset}% ${inset}% round ${radius}px)`;

  return (
    <div ref={ref} className="cinema">
      <div className="cinema__sticky">
        <motion.div
          className="cinema__frame"
          style={reduce ? undefined : { clipPath }}
        >
          <Film src={asset("media/apple-app-store-hero.mp4")} poster={asset("media/apple-app-store-hero.jpg")} className="cinema__video" />
          <div className="cinema__shade" aria-hidden="true" />
          <motion.div className="cinema__copy" style={reduce ? undefined : { opacity: copyOpacity, y: copyY }}>
            <p className="mono-label mono-label--dark">
              <span className="mono-label__num">02</span>
              {p.type} · {p.tools}
            </p>
            <h3 className="cinema__title">{p.title}</h3>
            <p className="cinema__body">{p.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a className="square-btn square-btn--light" href={caseStudyHref(p.slug)} target="_blank" rel="noreferrer">
                {read} <ArrowUpRight className="size-4" />
              </a>
              <span className="terminal">
                <span className="text-[#6ee7a8]">$</span> {p.metric} <span className="text-white/50">{p.metricLabel}</span>
                <span className="terminal__caret" aria-hidden="true" />
              </span>
            </div>
          </motion.div>
          <motion.div className="cinema__path" style={reduce ? undefined : { opacity: copyOpacity }}>
            <Path steps={p.path} tone="dark" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/** 03 · Applied research — the desk-under-the-stars film beside the findings. */
function ResearchPanel({ p, read, questionnaire }: { p: Project; read: string; questionnaire: string }) {
  return (
    <Reveal className="panel panel--dark">
      <div className="panel__film">
        <Film src={asset("media/early-career-wellbeing-hero.mp4")} poster={asset("media/early-career-wellbeing-hero.jpg")} className="h-full w-full object-cover" />
      </div>
      <div className="panel__copy">
        <p className="mono-label mono-label--dark">
          <span className="mono-label__num">03</span>
          {p.type} · {p.tools}
        </p>
        <h3 className="panel__title text-white">{p.title}</h3>
        <p className="panel__body !text-white/70">{p.description}</p>
        <div className="mt-8">
          <span className="metric-figure metric-figure--warm">{p.metric}</span>
          <span className="metric-label !text-white/55">{p.metricLabel}</span>
        </div>
        <Path steps={p.path} tone="dark" />
        <p className="panel__note !text-white/55">{p.value}</p>
        <div className="flex flex-wrap gap-5">
          <a className="text-link text-link--dark" href={caseStudyHref(p.slug)} target="_blank" rel="noreferrer">
            {read} <ArrowUpRight className="size-4" />
          </a>
          <a className="text-link text-link--dark" href={QUESTIONNAIRE_URL} target="_blank" rel="noreferrer">
            {questionnaire} <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </Reveal>
  );
}

function FitnessPanel({ f }: { f: Content["projects"]["fitness"] }) {
  return (
    <Reveal className="panel panel--light panel--reverse">
      <div className="panel__art panel__art--photo">
        <img src={asset("projects/personal-training-runner.webp")} alt="" loading="lazy" />
      </div>
      <div className="panel__copy">
        <p className="mono-label">
          <span className="mono-label__num">+</span>
          {f.label} · React · Supabase · RLS
        </p>
        <h3 className="panel__title">{f.heading}</h3>
        <p className="panel__body">{f.description}</p>
        <Path steps={f.flow} />
        <div className="mt-2 flex flex-wrap gap-5">
          <a className="text-link" href={`${LIVE_SITE}/personal-projects/personal-training/`} target="_blank" rel="noreferrer">
            {f.view} <ArrowUpRight className="size-4" />
          </a>
          <a className="text-link" href={links.trainingRepo} target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </Reveal>
  );
}

export function Projects({ t }: { t: Content }) {
  const p = t.projects;
  const [retail, apple, research] = p.items;

  return (
    <section id="projects" className="section">
      <div className="shell">
        <SectionHead number={p.number} label={p.label} title={p.title} italic={p.italic} summary={p.summary} />
        <RetailPanel p={retail} read={p.read} />
      </div>
      <AppleCinema p={apple} read={p.read} />
      <div className="shell">
        <ResearchPanel p={research} read={p.read} questionnaire={p.questionnaire} />
        <FitnessPanel f={p.fitness} />
      </div>
    </section>
  );
}
