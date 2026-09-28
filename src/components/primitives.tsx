import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useTransform, type MotionValue } from "motion/react";

export const ease = [0.22, 1, 0.36, 1] as const;

export function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}

const CJK = /[\u3000-\u9fff\uff00-\uffef]/;

/** English joins title and accent with a space; Chinese runs on, with a phrase break point between them. */
export function gap(before: string, after: string) {
  const a = before.replace(/\u200b/g, "");
  const b = after.replace(/\u200b/g, "");
  return CJK.test(a.slice(-1)) || CJK.test(b.charAt(0)) ? "\u200b" : " ";
}

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Blurred fade-up used for every entrance on the page. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  id,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  id?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      id={id}
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Scroll-linked range mapping. The function form keeps Motion on the JS path;
 * its ScrollTimeline shortcut stalls inside sticky frames.
 */
export function useRange(progress: MotionValue<number>, [start, end]: [number, number], [from, to]: [number, number]) {
  return useTransform(progress, (value) => {
    const t = Math.min(1, Math.max(0, (value - start) / (end - start)));
    return from + (to - from) * t;
  });
}

/** Section heading: numbered mono label, sans title with a serif-italic accent, summary. */
export function SectionHead({
  number,
  label,
  title,
  italic,
  summary,
  tone = "light",
  align = "split",
}: {
  number: string;
  label: string;
  title: string;
  italic?: string;
  summary: string;
  tone?: "light" | "dark";
  align?: "split" | "center";
}) {
  return (
    <header className={cx("section-head", tone === "dark" && "section-head--dark", align === "center" && "section-head--center")}>
      <Reveal>
        <p className="mono-label">
          <span className="mono-label__num">{number}</span>
          {label}
        </p>
      </Reveal>
      <div className="section-head__row">
        <Reveal delay={0.06}>
          <h2 className="display-title">
            {title}
            {italic ? gap(title, italic) : null}
            {italic ? <em className="serif-accent">{italic}</em> : null}
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="section-head__summary">{summary}</p>
        </Reveal>
      </div>
    </header>
  );
}

// Mobile browsers (in-app webviews, Low Power Mode, data saver) may refuse autoplay until
// the visitor touches the page. One shared listener retries every film on first touch.
const films = new Set<HTMLVideoElement>();
let gestureHooked = false;
function hookFirstGesture() {
  if (gestureHooked || typeof window === "undefined") return;
  gestureHooked = true;
  const retry = () => {
    films.forEach((video) => {
      const rect = video.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) void video.play().catch(() => undefined);
    });
  };
  for (const type of ["touchstart", "pointerdown", "scroll"] as const) {
    window.addEventListener(type, retry, { passive: true, once: type !== "scroll" });
  }
}

type Connection = { saveData?: boolean; effectiveType?: string };

/**
 * How much film this visitor should get: phones receive the portrait-cropped
 * phone encodes, and data-saver or 2G connections get still frames only.
 */
export function mediaPlan() {
  if (typeof window === "undefined") return { phone: false, stills: false };
  const connection = (navigator as Navigator & { connection?: Connection }).connection;
  const stills = Boolean(connection?.saveData) || /(^|-)2g$/.test(connection?.effectiveType ?? "");
  return { phone: window.matchMedia("(max-width: 720px)").matches, stills };
}

export type FilmSource = { src: string; poster?: string };

/**
 * Muted looping film. The poster is always visible underneath, so if a phone blocks
 * autoplay the frame still shows; the moving picture fades in only once it is really playing.
 * The video file is only requested when the film comes near the viewport.
 */
export function Film({
  src,
  poster,
  phone,
  className,
  label,
}: {
  src: string;
  poster?: string;
  phone?: FilmSource;
  className?: string;
  label?: string;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const reduce = useReducedMotion();
  const [plan] = useState(mediaPlan);
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);
  const chosen = plan.phone && phone ? phone : { src, poster };
  const stillOnly = reduce || plan.stills;

  useEffect(() => {
    const video = ref.current;
    if (!video || stillOnly) return;
    films.add(video);
    hookFirstGesture();
    // iOS needs the muted property set before play() is allowed.
    video.muted = true;

    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return () => {
        films.delete(video);
      };
    }

    // Start fetching a little before the film scrolls into view.
    const loader = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), { rootMargin: "600px 0px" });
    const player = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.02 },
    );
    loader.observe(video);
    player.observe(video);
    return () => {
      loader.disconnect();
      player.disconnect();
      films.delete(video);
    };
  }, [stillOnly]);

  // Once the source is attached, ask it to play if it is already on screen.
  useEffect(() => {
    const video = ref.current;
    if (!near || !video) return;
    const rect = video.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) void video.play().catch(() => undefined);
  }, [near]);

  if (stillOnly) {
    return chosen.poster ? (
      <div className={cx("film-stack", className)} aria-hidden={label ? undefined : true}>
        <img className="film-stack__poster" src={chosen.poster} alt={label ?? ""} decoding="async" />
      </div>
    ) : null;
  }

  return (
    <div className={cx("film-stack", className)} aria-hidden="true">
      {chosen.poster ? <img className="film-stack__poster" src={chosen.poster} alt="" decoding="async" loading="lazy" /> : null}
      <video
        ref={ref}
        className={cx("film-stack__video", playing && "is-playing")}
        src={near ? chosen.src : undefined}
        autoPlay
        muted
        loop
        playsInline
        preload={near ? "auto" : "none"}
        tabIndex={-1}
        onPlaying={() => setPlaying(true)}
      />
    </div>
  );
}

export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 6h16M13.25 2.5 17.5 6l-4.25 3.5" />
    </svg>
  );
}

/** Link to one of the detail pages that live inside Web 2, keeping the current language. */
export function pageHref(path: string, lang: "en" | "zh") {
  return `${asset(path.replace(/\/?$/, "/"))}?lang=${lang}`;
}

/** Large, unmistakable call to action: pill label with a circled arrow that turns on hover. */
export function Cta({
  href,
  children,
  tone = "dark",
  external = false,
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: "dark" | "light" | "ghost" | "ghost-dark";
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      className={cx("cta", `cta--${tone}`, className)}
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      <span className="cta__label">{children}</span>
      <span className="cta__icon" aria-hidden="true">
        <ArrowUpRight className="size-4" />
      </span>
    </a>
  );
}
