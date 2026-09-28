import * as React from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export const appleEase = [0.22, 1, 0.36, 1] as const;

/** Apple-style fade-up used across the Web 2 sections. */
export function FadeUp({
  children,
  className,
  delay = 0,
  y = 28,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "p" | "h2" | "h3" | "span" | "li";
}) {
  const reduceMotion = useReducedMotion();
  const Comp = motion[as];

  return (
    <Comp
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: "some", margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, delay, ease: appleEase }}
    >
      {children}
    </Comp>
  );
}

/** Small uppercase-free eyebrow with an Apple gradient wash. */
export function Eyebrow({ children, className, tone = "light" }: { children: React.ReactNode; className?: string; tone?: "light" | "dark" }) {
  return (
    <p className={cn("web2-eyebrow", tone === "dark" && "web2-eyebrow--dark", className)}>
      {children}
    </p>
  );
}

/** Serif-italic accent used inside headlines, echoing the reference designs. */
export function Accent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <em className={cn("web2-serif-accent", className)}>{children}</em>;
}

const numberPattern = /^([^\d]*)([\d,.]+)(.*)$/;

/** Counts a metric like "£10.6M+", "524,878" or "52.5万" up from zero once it scrolls into view. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const match = value.match(numberPattern);
  const [display, setDisplay] = React.useState(match && !reduceMotion ? `${match[1]}0${match[3]}` : value);

  React.useEffect(() => {
    if (!inView || !match || reduceMotion) {
      setDisplay(value);
      return;
    }

    const [, prefix, raw, suffix] = match;
    const target = Number(raw.replace(/,/g, ""));
    const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
    const useGrouping = raw.includes(",");
    const controls = animate(0, target, {
      duration: 1.6,
      ease: appleEase,
      onUpdate: (latest) => {
        const formatted = latest.toLocaleString("en-GB", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
          useGrouping,
        });
        setDisplay(`${prefix}${formatted}${suffix}`);
      },
    });

    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, reduceMotion]);

  return (
    <span ref={ref} className={className} aria-label={value}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}

/**
 * Muted looping background film. Plays only while on screen, and stays a still
 * gradient for people who prefer reduced motion.
 */
export function AmbientVideo({ src, className, poster }: { src: string; className?: string; poster?: string }) {
  const ref = React.useRef<HTMLVideoElement | null>(null);
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const video = ref.current;

    if (!video || reduceMotion || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.05 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <video
      ref={ref}
      className={cn("web2-video", ready && "is-ready", className)}
      src={src}
      poster={poster}
      autoPlay={!reduceMotion}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
      onCanPlay={() => setReady(true)}
    />
  );
}

/** Pill button whose label rolls upward on hover (from the Axion reference). */
export function RollingLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="web2-roll">
      <span className="web2-roll__track">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    </span>
  );
}
