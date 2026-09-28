import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { Download, Pause, Play } from "lucide-react";
import type { Content } from "../data/content";
import { ArrowUpRight, asset, ease, gap, useRange } from "../components/primitives";
import { scrollToId } from "./Nav";

/** VertexAI-style hero over the concrete-and-grass film. */
export function Hero({ t }: { t: Content }) {
  const ref = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useRange(scrollYProgress, [0, 1], [1, 1.12]);
  const contentY = useRange(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useRange(scrollYProgress, [0, 0.6], [1, 0]);

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18, filter: "blur(8px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 1, delay, ease },
        };

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  };

  return (
    <section id="home" ref={ref} className="hero">
      <motion.div className="hero__media" style={reduce ? undefined : { scale }}>
        <video
          ref={videoRef}
          className="hero__video"
          src={asset("media/homepage-hero.mp4")}
          poster={asset("media/homepage-hero.jpg")}
          autoPlay={!reduce}
          muted
          loop
          playsInline
          aria-hidden="true"
          tabIndex={-1}
        />
      </motion.div>
      <div className="hero__shade" aria-hidden="true" />

      <motion.div className="hero__center" style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}>
        <motion.p className="hero__eyebrow" {...rise(0.15)}>
          {t.hero.eyebrow}
        </motion.p>
        <motion.h1 className="hero__title" {...rise(0.25)}>
          <span className="block">{t.hero.lead}</span>
          <span className="block">
            <em className="serif-accent">{t.hero.accent}</em>
            {gap(t.hero.accent, t.hero.tail)}
            {t.hero.tail}
          </span>
        </motion.h1>
        <motion.div className="hero__actions" {...rise(0.4)}>
          <button type="button" className="pill pill--white hero__cta" onClick={() => scrollToId("projects")}>
            {t.hero.cta}
          </button>
          {t.hero.cvs.map((cv) => (
            <a key={cv.href} className="pill pill--glass hero__cv" href={asset(cv.href)} download>
              <Download className="size-4" aria-hidden="true" />
              {cv.label}
              <span className="hero__cv-note">{cv.note}</span>
            </a>
          ))}
        </motion.div>
      </motion.div>

      <div className="hero__footer">
        <motion.p className="hero__intro" {...rise(0.55)}>
          {t.hero.intro}
        </motion.p>
        <motion.div className="hero__tags" {...rise(0.62)}>
          <div className="flex items-center gap-2">
            <button type="button" className="icon-pill" onClick={toggleVideo} aria-label={paused ? t.hero.play : t.hero.pause}>
              {paused ? <Play className="size-3.5" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}
            </button>
            <button type="button" className="pill pill--outline" onClick={() => scrollToId("education")}>
              {t.hero.explore}
              <ArrowUpRight className="size-4 rotate-90" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
