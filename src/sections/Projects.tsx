import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValueEvent, useReducedMotion, useScroll, type MotionStyle, type MotionValue } from "motion/react";
import { QUESTIONNAIRE_URL, type Content, type Lang } from "../data/content";
import { ArrowRight, Cta, Film, SectionHead, asset, pageHref, useRange } from "../components/primitives";

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

export type CinemaMotion = {
  /** Copy that fades and rises in once the frame has nearly opened. */
  copyStyle: MotionStyle | undefined;
  /** Secondary layers that only fade in. */
  fadeStyle: MotionStyle | undefined;
  /** True once the frame is open enough for the scene to "play". */
  open: boolean;
  /** Raw track progress (0 to 1), for scenes that step through their own beats. */
  progress: MotionValue<number>;
};

/**
 * Scroll cinema: the frame starts inset with rounded corners inside a tall
 * scroll track, then opens to full bleed as the track scrolls past while the
 * copy rises in. Shared by every project so they all move the same way.
 */
export function ScrollCinema({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: (motionProps: CinemaMotion) => ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const inset = useRange(scrollYProgress, [0, 0.5], [7, 0]);
  const radius = useRange(scrollYProgress, [0, 0.5], [36, 0]);
  const copyOpacity = useRange(scrollYProgress, [0.42, 0.66], [0, 1]);
  const copyY = useRange(scrollYProgress, [0.42, 0.66], [36, 0]);
  const clipPath = useMotionTemplate`inset(${inset}% ${inset}% ${inset}% ${inset}% round ${radius}px)`;
  useMotionValueEvent(scrollYProgress, "change", (value) => setOpen(value > 0.4));

  return (
    <div ref={ref} className={className ? `cinema ${className}` : "cinema"} id={id}>
      <div className="cinema__sticky">
        <motion.div className="cinema__frame" style={reduce ? undefined : { clipPath }}>
          {children({
            copyStyle: reduce ? undefined : { opacity: copyOpacity, y: copyY },
            fadeStyle: reduce ? undefined : { opacity: copyOpacity },
            open: reduce || open,
            progress: scrollYProgress,
          })}
        </motion.div>
      </div>
    </div>
  );
}

// The retail backdrop's dots stand in for the raw export; the share that turns
// brass matches the real cleaning ratio (524,878 of ~1.6M records).
const LEDGER_COLUMNS = 24;
const ledgerDots = (() => {
  let seed = 7;
  return Array.from({ length: 192 }, (_, index) => {
    seed = (seed * 9301 + 49297) % 233280;
    const wave = Math.min(9, Math.floor(((index % LEDGER_COLUMNS) + Math.floor(index / LEDGER_COLUMNS)) / 3));
    return { keep: seed / 233280 < 524878 / 1600000, wave };
  });
})();

/** 01 · UK retail — the ledger: ink, brass and the 1.6M → 524,878 dot field. */
function RetailCinema({ p, read, lang }: { p: Project; read: string; lang: Lang }) {
  return (
    <ScrollCinema id="project-uk-retail" className="cinema--ledger">
      {({ copyStyle, fadeStyle, open }) => (
        <div className={open ? "ledger is-open" : "ledger"}>
          <div className="ledger__grid" aria-hidden="true" />
          <div className="ledger__glow" aria-hidden="true" />
          <span className="ledger__corner ledger__corner--tl" aria-hidden="true" />
          <span className="ledger__corner ledger__corner--tr" aria-hidden="true" />
          <span className="ledger__corner ledger__corner--bl" aria-hidden="true" />
          <span className="ledger__corner ledger__corner--br" aria-hidden="true" />

          <div className="ledger__stage">
            <motion.div className="ledger__copy" style={copyStyle}>
              <p className="mono-label mono-label--dark">
                <span className="mono-label__num">01</span>
                {p.type} · {p.tools}
              </p>
              <h3 className="ledger__title">{p.title}</h3>
              <p className="ledger__body">{p.description}</p>
              <div className="ledger__metric">
                <span>{p.metric}</span>
                <span>{p.metricLabel}</span>
              </div>
              <Cta href={caseStudyHref(p.slug, lang)} tone="light" className="ledger__cta">
                {read}
              </Cta>
            </motion.div>

            <motion.div className="ledger__panel" style={fadeStyle} aria-hidden="true">
              <div className="ledger__panel-head">
                <span>raw_transactions → clean</span>
                <span className="ledger__phase">● 1.6M → 524,878</span>
              </div>
              <div className="ledger__dots">
                {ledgerDots.map((dot, index) => (
                  <i
                    key={index}
                    className={dot.keep ? "is-kept" : "is-dropped"}
                    style={{ "--w": dot.wave } as CSSProperties}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div className="cinema__path ledger__path" style={fadeStyle}>
            <Path steps={p.path} tone="dark" />
          </motion.div>
        </div>
      )}
    </ScrollCinema>
  );
}

/** 02 · Apple App Store — the boy-at-the-window film opens up to full bleed as you scroll. */
function AppleCinema({ p, read, lang }: { p: Project; read: string; lang: Lang }) {
  return (
    <ScrollCinema id="project-apple-app-store">
      {({ copyStyle, fadeStyle }) => (
        <>
          <Film
            src={asset("media/apple-app-store-hero.mp4")}
            poster={asset("media/apple-app-store-hero.jpg")}
            phone={{ src: asset("media/mobile/apple.mp4"), poster: asset("media/mobile/apple.webp") }}
            className="cinema__video"
          />
          <div className="cinema__shade" aria-hidden="true" />
          <motion.div className="cinema__copy" style={copyStyle}>
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
          <motion.div className="cinema__path" style={fadeStyle}>
            <Path steps={p.path} tone="dark" />
          </motion.div>
        </>
      )}
    </ScrollCinema>
  );
}

/** 03 · Applied research — the desk-under-the-stars film opens to full bleed. */
function ResearchCinema({ p, read, questionnaire, lang }: { p: Project; read: string; questionnaire: string; lang: Lang }) {
  return (
    <ScrollCinema id="project-early-career-wellbeing" className="cinema--research">
      {({ copyStyle, fadeStyle }) => (
        <>
          <Film
            src={asset("media/early-career-wellbeing-hero.mp4")}
            poster={asset("media/early-career-wellbeing-hero.jpg")}
            phone={{ src: asset("media/mobile/research.mp4"), poster: asset("media/mobile/research.webp") }}
            className="cinema__video"
          />
          <div className="cinema__shade" aria-hidden="true" />
          <motion.div className="cinema__copy" style={copyStyle}>
            <p className="mono-label mono-label--dark">
              <span className="mono-label__num">03</span>
              {p.type} · {p.tools}
            </p>
            <h3 className="cinema__title">{p.title}</h3>
            <p className="cinema__body">{p.description}</p>
            <div className="cinema__metric">
              <span className="metric-figure metric-figure--warm">{p.metric}</span>
              <span className="metric-label !text-white/60">{p.metricLabel}</span>
            </div>
            <div className="cta-row">
              <Cta href={caseStudyHref(p.slug, lang)} tone="light">
                {read}
              </Cta>
              <Cta href={QUESTIONNAIRE_URL} tone="ghost-dark" external>
                {questionnaire}
              </Cta>
            </div>
          </motion.div>
          <motion.div className="cinema__path" style={fadeStyle}>
            <Path steps={p.path} tone="dark" />
          </motion.div>
        </>
      )}
    </ScrollCinema>
  );
}

/** Personal project — the ship driving into the wind opens to full bleed, the build pipeline as a glass instrument bar. */
function VoyageCinema({ f, lang }: { f: Content["projects"]["fitness"]; lang: Lang }) {
  return (
    <ScrollCinema id="personal-training-project" className="cinema--voyage">
      {({ copyStyle, fadeStyle }) => (
        <div className="voyage">
          <Film
            src={asset("personal-projects/personal-training/video/ocean-hero-720p.mp4")}
            poster={asset("personal-projects/personal-training/video/ocean-hero-poster.jpg")}
            phone={{ src: asset("media/mobile/ocean.mp4"), poster: asset("media/mobile/ocean.webp") }}
            className="voyage__video"
          />
          <div className="voyage__shade" aria-hidden="true" />

          <motion.div className="voyage__head" style={fadeStyle}>
            <p className="mono-label mono-label--dark">
              <span className="mono-label__num">+</span>
              {f.label} · SwiftUI · macOS 26
            </p>
            <h3 className="voyage__title">{f.heading}</h3>
          </motion.div>

          <motion.div className="voyage__deck" style={copyStyle}>
            <div className="voyage__copy">
              <p className="voyage__name">
                <img className="voyage__icon" src={asset("personal-projects/gym-log/gym-log-icon.webp")} alt="" width={40} height={40} loading="lazy" />
                {f.title}
              </p>
              <p className="voyage__body">{f.description}</p>
              <div className="cta-row">
                <Cta href={pageHref("personal-projects/personal-training", lang)} tone="light">
                  {f.view}
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
          </motion.div>
        </div>
      )}
    </ScrollCinema>
  );
}

export function Projects({ t, lang }: { t: Content; lang: Lang }) {
  const p = t.projects;
  const [retail, apple, research] = p.items;

  return (
    <section id="projects" className="section">
      <div className="shell">
        <SectionHead number={p.number} label={p.label} title={p.title} italic={p.italic} summary={p.summary} />
      </div>
      <RetailCinema p={retail} read={p.read} lang={lang} />
      <AppleCinema p={apple} read={p.read} lang={lang} />
      <ResearchCinema p={research} read={p.read} questionnaire={p.questionnaire} lang={lang} />
      <VoyageCinema f={p.fitness} lang={lang} />
    </section>
  );
}
