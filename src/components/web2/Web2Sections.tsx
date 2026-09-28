import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, Code2, Download, Mail, UserRound } from "lucide-react";
import type { LanguageCode, PortfolioContent } from "@/data/portfolio";
import { cinematicVideos, type Place, type Web2Copy } from "@/data/web2";
import { cn } from "@/lib/utils";
import { Accent, AmbientVideo, CountUp, Eyebrow, FadeUp, RollingLabel } from "./primitives";

/**
 * Scroll-linked range mapping. The function form keeps Motion from handing the
 * animation to the browser's ScrollTimeline, which stalls inside sticky frames.
 */
function useRange(progress: MotionValue<number>, [start, end]: [number, number], [from, to]: [number, number]) {
  return useTransform(progress, (value) => {
    const t = Math.min(1, Math.max(0, (value - start) / (end - start)));
    return from + (to - from) * t;
  });
}

/* ------------------------------------------------------------------ */
/* Statement — words light up as the reader scrolls (Apple product pages) */
/* ------------------------------------------------------------------ */

function RevealWord({ children, progress, range }: { children: React.ReactNode; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useRange(progress, range, [0.16, 1]);

  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

export function StatementSection({
  copy,
  content,
  language,
  id,
}: {
  copy: Web2Copy;
  content: PortfolioContent;
  language: LanguageCode;
  id?: string;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  // Chinese has no spaces, so reveal character by character; English reveals by word.
  const tokens = language === "zh-CN" ? Array.from(copy.statement.words) : copy.statement.words.split(" ");
  const total = tokens.length + 1;

  return (
    <section id={id} className="web2-section web2-shell pt-40 max-sm:pt-28">
      <div className="text-center">
        <Eyebrow>{copy.statement.eyebrow}</Eyebrow>
      </div>
      <div ref={ref} className="mx-auto mt-8 max-w-[980px]">
        <p
          className={cn(
            "web2-statement text-center",
            language === "zh-CN" && "web2-statement--zh",
          )}
        >
          {reduceMotion
            ? copy.statement.words
            : tokens.map((token, index) => (
                <React.Fragment key={`${token}-${index}`}>
                  <RevealWord progress={scrollYProgress} range={[index / total, (index + 1) / total]}>
                    {token}
                  </RevealWord>
                  {language === "zh-CN" ? null : " "}
                </React.Fragment>
              ))}
          <RevealWord progress={scrollYProgress} range={[(total - 1) / total, 1]}>
            <span className="web2-gradient-text">{copy.statement.accent}</span>
          </RevealWord>
        </p>
      </div>

      <div className="mx-auto mt-24 grid max-w-[1080px] grid-cols-[1.1fr_.9fr] gap-16 max-lg:grid-cols-1 max-lg:gap-10 max-sm:mt-16">
        <div className="flex flex-col gap-5">
          {content.profile.about.map((paragraph, index) => (
            <FadeUp key={paragraph} delay={index * 0.08} as="p" className="web2-body">
              {paragraph}
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={0.12} className="web2-roles-card">
          <p className="web2-kicker">{content.targetRoles.label}</p>
          <h3 className="mt-3 text-[1.35rem] font-semibold leading-snug tracking-[-0.015em] text-[#1d1d1f]">
            {content.targetRoles.title}
          </h3>
          <p className="mt-3 text-[0.95rem] leading-7 text-[#6e6e73]">{content.targetRoles.body}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {content.targetRoles.roles.map((role) => (
              <li key={role} className="web2-chip">
                {role}
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Numbers — big gradient figures that count up                        */
/* ------------------------------------------------------------------ */

const numberGradients = ["web2-grad-azure", "web2-grad-violet", "web2-grad-rose", "web2-grad-amber"] as const;

export function NumbersSection({ copy, content }: { copy: Web2Copy; content: PortfolioContent }) {
  return (
    <section className="web2-section web2-shell pt-40 max-sm:pt-28">
      <div className="text-center">
        <Eyebrow>{copy.numbers.eyebrow}</Eyebrow>
        <FadeUp as="h2" className="web2-headline mx-auto mt-5 max-w-[860px]">
          {copy.numbers.title}
        </FadeUp>
      </div>
      <div className="mx-auto mt-20 grid max-w-[1180px] grid-cols-4 gap-x-8 gap-y-14 max-lg:grid-cols-2 max-sm:mt-14 max-sm:grid-cols-1 max-sm:gap-y-10">
        {content.metrics.map((metric, index) => (
          <FadeUp key={metric.label} delay={index * 0.08} className="text-center">
            <CountUp value={metric.value} className={cn("web2-figure", numberGradients[index % numberGradients.length])} />
            <p className="mt-3 text-[0.95rem] font-medium text-[#6e6e73]">{metric.label}</p>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Strengths — Apple-style bento tiles, each with its own light         */
/* ------------------------------------------------------------------ */

const tileThemes = ["web2-tile--azure", "web2-tile--mint", "web2-tile--violet", "web2-tile--peach"] as const;

export function StrengthsSection({ copy }: { copy: Web2Copy }) {
  return (
    <section className="web2-section web2-shell pt-40 max-sm:pt-28">
      <div className="text-center">
        <Eyebrow>{copy.strengths.eyebrow}</Eyebrow>
        <FadeUp as="h2" className="web2-headline mx-auto mt-5 max-w-[860px]">
          {copy.strengths.title}
        </FadeUp>
      </div>
      <div className="web2-bento mx-auto mt-16 max-w-[1180px]">
        {copy.strengths.tiles.map((tile, index) => (
          <FadeUp key={tile.title} delay={index * 0.07} className={cn("web2-tile", tileThemes[index], index === 0 && "web2-tile--wide", index === 3 && "web2-tile--wide")}>
            <span className="web2-tile__glow" aria-hidden="true" />
            <p className="web2-kicker relative">{tile.kicker}</p>
            <h3 className="web2-tile__title relative">{tile.title}</h3>
            <p className="relative mt-4 max-w-[34ch] text-[1.02rem] leading-7 text-[#424245]">{tile.body}</p>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Desk film — inset video that expands to full-bleed as you scroll     */
/* ------------------------------------------------------------------ */

export function DeskFilmSection({ copy }: { copy: Web2Copy }) {
  const ref = React.useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useRange(scrollYProgress, [0, 0.55], [0.78, 1]);
  const radius = useRange(scrollYProgress, [0, 0.55], [44, 0]);
  const textOpacity = useRange(scrollYProgress, [0.45, 0.72], [0, 1]);
  const textY = useRange(scrollYProgress, [0.45, 0.72], [40, 0]);
  const shadeOpacity = useRange(scrollYProgress, [0.35, 0.72], [0, 1]);
  // Dissolve into the light page before the next chapter, instead of a hard cut.
  const dissolve = useRange(scrollYProgress, [0.86, 1], [0, 1]);

  return (
    <section ref={ref} className="web2-film relative mt-40 h-[260vh] max-sm:mt-28 max-sm:h-[200vh]" aria-label={copy.deskFilm.titleLead}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <motion.div
          className="web2-film__frame absolute inset-0 overflow-hidden"
          style={reduceMotion ? undefined : { scale, borderRadius: radius }}
        >
          <AmbientVideo src={cinematicVideos.desk} className="absolute inset-0 h-full w-full object-cover" />
          <motion.div className="web2-film__shade absolute inset-0" style={reduceMotion ? undefined : { opacity: shadeOpacity }} />
        </motion.div>

        <motion.div
          className="relative z-[1] mx-auto flex w-[min(980px,calc(100%-40px))] flex-col items-center text-center"
          style={reduceMotion ? undefined : { opacity: textOpacity, y: textY }}
        >
          <Eyebrow tone="dark">{copy.deskFilm.eyebrow}</Eyebrow>
          <h2 className="web2-film__title mt-5">
            {copy.deskFilm.titleLead} <Accent>{copy.deskFilm.titleAccent}</Accent>
          </h2>
          <p className="mt-6 max-w-[620px] text-[clamp(1rem,1.4vw,1.2rem)] leading-8 text-white/72">{copy.deskFilm.body}</p>
          <p className="web2-film__caption mt-10">{copy.deskFilm.caption}</p>
        </motion.div>

        {reduceMotion ? null : <motion.div className="web2-film__dissolve absolute inset-0 z-[2]" style={{ opacity: dissolve }} aria-hidden="true" />}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Places — gradient-bloom city cards with live local time              */
/* ------------------------------------------------------------------ */

function useLocalTime(timeZone: string) {
  const format = React.useCallback(
    () => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone }).format(new Date()),
    [timeZone],
  );
  const [time, setTime] = React.useState(format);

  React.useEffect(() => {
    const interval = window.setInterval(() => setTime(format()), 15_000);
    return () => window.clearInterval(interval);
  }, [format]);

  return time;
}

function PlaceCard({ place, localTimeLabel, index }: { place: Place; localTimeLabel: string; index: number }) {
  const time = useLocalTime(place.timeZone);

  return (
    <FadeUp delay={index * 0.1} className="h-full">
      <article className={cn("web2-place", `web2-place--${place.hue}`)} tabIndex={0}>
        <header className="flex items-start justify-between gap-3">
          <span className="text-[0.95rem] font-semibold text-[#1d1d1f]">{place.country}</span>
          <span className="web2-mono text-[#86868b]">{place.years}</span>
        </header>

        <div className="web2-place__bloom" aria-hidden="true">
          <span className="web2-place__orb web2-place__orb--a" />
          <span className="web2-place__orb web2-place__orb--b" />
          <span className="web2-place__orb web2-place__orb--c" />
        </div>

        <div className="web2-place__detail">
          <p className="web2-mono text-[#1d1d1f]">— {place.headline}</p>
          <ul className="mt-3 space-y-1.5 text-[0.9rem] leading-6 text-[#424245]">
            {place.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <footer className="relative mt-auto flex items-end justify-between gap-3">
          <h3 className="web2-place__city">{place.city}</h3>
          <span className="web2-mono text-right text-[#86868b]">
            {localTimeLabel}
            <br />
            <span className="text-[#1d1d1f]">{time}</span>
          </span>
        </footer>
      </article>
    </FadeUp>
  );
}

export function PlacesSection({ copy, id }: { copy: Web2Copy; id?: string }) {
  return (
    <section id={id} className="web2-section web2-shell pt-40 max-sm:pt-28">
      <div className="grid grid-cols-[1.4fr_.6fr] items-end gap-12 max-lg:grid-cols-1 max-lg:gap-6">
        <div>
          <Eyebrow>{copy.places.eyebrow}</Eyebrow>
          <FadeUp as="h2" className="web2-headline mt-5">
            {copy.places.titleLines[0]}
            <br />
            <span className="text-[#86868b]">{copy.places.titleLines[1]}</span>
          </FadeUp>
        </div>
        <FadeUp as="p" delay={0.1} className="web2-body max-w-[460px] lg:justify-self-end">
          {copy.places.body}
        </FadeUp>
      </div>
      <div className="mt-14 grid grid-cols-3 gap-5 max-lg:grid-cols-1">
        {copy.places.items.map((place, index) => (
          <PlaceCard key={place.id} place={place} localTimeLabel={copy.places.localTimeLabel} index={index} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Experience details — clean Apple "tech specs" list                    */
/* ------------------------------------------------------------------ */

export function ExperienceDetails({ content }: { content: PortfolioContent }) {
  return (
    <div className="web2-shell mt-20">
      <div className="web2-specs">
        {content.experiences.map((item, index) => (
          <FadeUp key={item.role} delay={index * 0.06} className="web2-specs__row">
            <div>
              <time className="web2-mono text-[#86868b]">{item.date}</time>
              <h3 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.015em] text-[#1d1d1f]">{item.role}</h3>
              <p className="mt-1 text-[0.95rem] text-[#6e6e73]">{item.company}</p>
            </div>
            <div>
              <ul className="space-y-3 text-[1rem] leading-7 text-[#424245]">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="web2-specs__bullet">
                    {bullet}
                  </li>
                ))}
              </ul>
              {item.badges ? (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {item.badges.map((badge) => (
                    <li key={badge} className="web2-chip">
                      {badge}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Skills — four gradient-edged panels                                   */
/* ------------------------------------------------------------------ */

export function SkillsSection({ content, id }: { content: PortfolioContent; id?: string }) {
  return (
    <section id={id} className="web2-section web2-shell pt-40 max-sm:pt-28">
      <div className="text-center">
        <Eyebrow>{content.sections.skills.label}</Eyebrow>
        <FadeUp as="h2" className="web2-headline mx-auto mt-5 max-w-[900px]">
          {content.sections.skills.title}
        </FadeUp>
      </div>
      <div className="mx-auto mt-16 grid max-w-[1180px] grid-cols-2 gap-5 max-md:grid-cols-1">
        {content.skills.map((skill, index) => (
          <FadeUp key={skill.title} delay={index * 0.07} className={cn("web2-skill", tileThemes[index % tileThemes.length])}>
            <span className="web2-tile__glow" aria-hidden="true" />
            <span className="web2-skill__index web2-mono relative">0{index + 1}</span>
            <h3 className="web2-tile__title relative mt-10 max-sm:mt-6">{skill.title}</h3>
            <p className="relative mt-4 text-[1rem] leading-7 text-[#424245]">{skill.body}</p>
            <ul className="relative mt-6 flex flex-wrap gap-2">
              {skill.tags.map((tag) => (
                <li key={tag} className="web2-chip web2-chip--solid">
                  {tag}
                </li>
              ))}
            </ul>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Finale — full-bleed window film, contact actions and footer          */
/* ------------------------------------------------------------------ */

export function FinaleSection({
  copy,
  content,
  cvPdfPath,
  onBackToTop,
}: {
  copy: Web2Copy;
  content: PortfolioContent;
  cvPdfPath: string;
  onBackToTop: () => void;
}) {
  const ref = React.useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const videoScale = useRange(scrollYProgress, [0, 1], [1.14, 1]);

  return (
    <section id="contact" ref={ref} className="web2-finale relative mt-40 overflow-hidden max-sm:mt-28">
      <motion.div className="absolute inset-0" style={reduceMotion ? undefined : { scale: videoScale }}>
        <AmbientVideo src={cinematicVideos.window} className="absolute inset-0 h-full w-full object-cover" />
      </motion.div>
      <div className="web2-finale__shade absolute inset-0" aria-hidden="true" />

      <div className="relative z-[1] mx-auto flex min-h-[100svh] w-[min(1180px,calc(100%-40px))] flex-col justify-end pb-10 pt-48 max-sm:w-[calc(100%-32px)] max-sm:pt-40">
        <div className="max-w-[760px]">
          <Eyebrow tone="dark">{copy.finale.eyebrow}</Eyebrow>
          <FadeUp as="h2" className="web2-finale__title mt-5">
            {copy.finale.titleLead} <Accent>{copy.finale.titleAccent}</Accent> {copy.finale.titleTail}
          </FadeUp>
          <FadeUp as="p" delay={0.1} className="mt-6 max-w-[560px] text-[clamp(1rem,1.4vw,1.18rem)] leading-8 text-white/72">
            {copy.finale.body}
          </FadeUp>
          <FadeUp delay={0.18} className="mt-10 flex flex-wrap items-center gap-3">
            <a className="web2-pill web2-pill--light group" href={`mailto:${content.profile.email}`}>
              <Mail className="size-4" aria-hidden="true" />
              <RollingLabel>{content.actions.emailMe}</RollingLabel>
            </a>
            <a className="web2-pill web2-pill--glass group" href={content.profile.linkedin} target="_blank" rel="noreferrer">
              <UserRound className="size-4" aria-hidden="true" />
              <RollingLabel>LinkedIn</RollingLabel>
            </a>
            <a className="web2-pill web2-pill--glass group" href={content.profile.github} target="_blank" rel="noreferrer">
              <Code2 className="size-4" aria-hidden="true" />
              <RollingLabel>GitHub</RollingLabel>
            </a>
            <a className="web2-pill web2-pill--glass group" href={cvPdfPath} download>
              <Download className="size-4" aria-hidden="true" />
              <RollingLabel>{content.actions.downloadCV}</RollingLabel>
            </a>
          </FadeUp>
          <FadeUp as="p" delay={0.24} className="web2-mono mt-8 text-white/55">
            <span className="web2-live-dot" aria-hidden="true" />
            {copy.finale.availability}
          </FadeUp>
        </div>

        <footer className="mt-28 flex items-center justify-between gap-5 border-t border-white/12 pt-6 text-[0.8rem] text-white/50 max-sm:mt-20 max-sm:flex-col max-sm:items-start">
          <span>{content.footer.rights}</span>
          <div className="flex items-center gap-6">
            <a className="transition-colors hover:text-white" href={`mailto:${content.profile.email}`}>
              {content.profile.email}
            </a>
            <button type="button" className="inline-flex items-center gap-1 transition-colors hover:text-white" onClick={onBackToTop}>
              {content.actions.backToTop}
              <ArrowUpRight className="size-3.5 -rotate-45" aria-hidden="true" />
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
}
