import { useRef } from "react";
import { motion, useMotionTemplate, useReducedMotion, useScroll } from "motion/react";
import { QUESTIONNAIRE_URL, links, type Content, type Lang } from "../data/content";
import { ArrowRight, Cta, Film, Reveal, SectionHead, asset, pageHref, useRange } from "../components/primitives";

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

function caseStudyHref(slug: string, lang: Lang) {
  return pageHref(`case-studies/${slug}`, lang);
}

/** 01 · UK retail — bright product panel with the cleaned-data artwork. */
function RetailPanel({ p, read, lang }: { p: Project; read: string; lang: Lang }) {
  return (
    <Reveal className="panel panel--light" id="project-uk-retail">
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
        <Cta href={caseStudyHref(p.slug, lang)}>{read}</Cta>
      </div>
      <div className="panel__art">
        <img src={asset("projects/uk-retail-hero-clean-data.webp")} alt="" loading="lazy" />
      </div>
    </Reveal>
  );
}

/** 02 · Apple App Store — the boy-at-the-window film opens up to full bleed as you scroll. */
function AppleCinema({ p, read, lang }: { p: Project; read: string; lang: Lang }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const inset = useRange(scrollYProgress, [0, 0.5], [7, 0]);
  const radius = useRange(scrollYProgress, [0, 0.5], [36, 0]);
  const copyOpacity = useRange(scrollYProgress, [0.42, 0.66], [0, 1]);
  const copyY = useRange(scrollYProgress, [0.42, 0.66], [36, 0]);
  const clipPath = useMotionTemplate`inset(${inset}% ${inset}% ${inset}% ${inset}% round ${radius}px)`;

  return (
    <div ref={ref} className="cinema" id="project-apple-app-store">
      <div className="cinema__sticky">
        <motion.div
          className="cinema__frame"
          style={reduce ? undefined : { clipPath }}
        >
          <Film
            src={asset("media/apple-app-store-hero.mp4")}
            poster={asset("media/apple-app-store-hero.jpg")}
            phone={{ src: asset("media/mobile/apple.mp4"), poster: asset("media/mobile/apple.webp") }}
            className="cinema__video"
          />
          <div className="cinema__shade" aria-hidden="true" />
          <motion.div className="cinema__copy" style={reduce ? undefined : { opacity: copyOpacity, y: copyY }}>
            <p className="mono-label mono-label--dark">
              <span className="mono-label__num">02</span>
              {p.type} · {p.tools}
            </p>
            <h3 className="cinema__title">{p.title}</h3>
            <p className="cinema__body">{p.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Cta href={caseStudyHref(p.slug, lang)} tone="light">
                {read}
              </Cta>
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
function ResearchPanel({ p, read, questionnaire, lang }: { p: Project; read: string; questionnaire: string; lang: Lang }) {
  return (
    <Reveal className="panel panel--dark" id="project-early-career-wellbeing">
      <div className="panel__film">
        <Film
          src={asset("media/early-career-wellbeing-hero.mp4")}
          poster={asset("media/early-career-wellbeing-hero.jpg")}
          phone={{ src: asset("media/mobile/research.mp4"), poster: asset("media/mobile/research.webp") }}
          className="h-full w-full object-cover" />
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
        <div className="cta-row">
          <Cta href={caseStudyHref(p.slug, lang)} tone="light">
            {read}
          </Cta>
          <Cta href={QUESTIONNAIRE_URL} tone="ghost-dark" external>
            {questionnaire}
          </Cta>
        </div>
      </div>
    </Reveal>
  );
}

/** Personal project — the ship driving into the wind, with the build pipeline as a glass instrument bar. */
function VoyagePanel({ f, lang }: { f: Content["projects"]["fitness"]; lang: Lang }) {
  return (
    <Reveal className="voyage" id="personal-training-project">
      <Film
        src={asset("personal-projects/personal-training/video/ocean-hero-720p.mp4")}
        poster={asset("personal-projects/personal-training/video/ocean-hero-poster.jpg")}
        phone={{ src: asset("media/mobile/ocean.mp4"), poster: asset("media/mobile/ocean.webp") }}
        className="voyage__video"
      />
      <div className="voyage__shade" aria-hidden="true" />

      <div className="voyage__head">
        <p className="mono-label mono-label--dark">
          <span className="mono-label__num">+</span>
          {f.label} · React · Supabase · RLS
        </p>
        <h3 className="voyage__title">{f.heading}</h3>
      </div>

      <div className="voyage__deck">
        <div className="voyage__copy">
          <p className="voyage__name">{f.title}</p>
          <p className="voyage__body">{f.description}</p>
          <div className="cta-row">
            <Cta href={pageHref("personal-projects/personal-training", lang)} tone="light">
              {f.view}
            </Cta>
            <Cta href={links.trainingRepo} tone="ghost-dark" external>
              GitHub
            </Cta>
          </div>
        </div>
        <ol className="voyage__flow">
          {f.flow.map((step, index) => (
            <li key={step}>
              <span className="voyage__flow-num">0{index + 1}</span>
              <span className="voyage__flow-label">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  );
}

export function Projects({ t, lang }: { t: Content; lang: Lang }) {
  const p = t.projects;
  const [retail, apple, research] = p.items;

  return (
    <section id="projects" className="section">
      <div className="shell">
        <SectionHead number={p.number} label={p.label} title={p.title} italic={p.italic} summary={p.summary} />
        <RetailPanel p={retail} read={p.read} lang={lang} />
      </div>
      <AppleCinema p={apple} read={p.read} lang={lang} />
      <div className="shell">
        <ResearchPanel p={research} read={p.read} questionnaire={p.questionnaire} lang={lang} />
        <VoyagePanel f={p.fitness} lang={lang} />
      </div>
    </section>
  );
}
