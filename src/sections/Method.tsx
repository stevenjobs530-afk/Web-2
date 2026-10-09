import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import type { Content } from "../data/content";
import { Reveal, SectionHead, cx, ease, useRange } from "../components/primitives";

// One ambient light colour per stage; the backdrop glow eases between them as the steps change.
const STAGE_GLOWS = ["#e67e22", "#d9a441", "#4f9be0", "#7c83ee", "#d9667f"];

/** Apple-style sticky story: the step number stays pinned while each stage scrolls past. */
export function Method({ t }: { t: Content }) {
  const m = t.method;
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLLIElement | null>>([]);
  const section = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [m.stages.length]);

  // Backdrop parallax: the two lights drift at different speeds as the section scrolls by.
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  const warmY = useRange(scrollYProgress, [0, 1], [-120, 260]);
  const coolY = useRange(scrollYProgress, [0, 1], [180, -200]);

  const progress = (active + 1) / m.stages.length;
  const glow = STAGE_GLOWS[active % STAGE_GLOWS.length];

  return (
    <section ref={section} id="method" className="section section--ink method-section" style={{ "--method-glow": glow } as CSSProperties}>
      <div className="method-bg" aria-hidden="true">
        <motion.div className="method-bg__light method-bg__light--warm" style={reduce ? undefined : { y: warmY }} />
        <motion.div className="method-bg__light method-bg__light--cool" style={reduce ? undefined : { y: coolY }} />
        <div className="method-bg__grid" />
        <div className="method-bg__grain" />
      </div>

      <div className="shell method-shell">
        <SectionHead number={m.number} label={m.label} title={m.title} italic={m.italic} summary={m.summary} tone="dark" />

        <div className="method">
          <div className="method__rail">
            <div className="method__sticky">
              <div className="method__halo" />
              <svg viewBox="0 0 120 120" className="method__ring" aria-hidden="true">
                <circle cx="60" cy="60" r="54" className="method__ring-track" />
                <circle cx="60" cy="60" r="54" className="method__ring-fill" style={{ strokeDashoffset: 339.3 * (1 - progress) }} />
                {m.stages.map((_, index) => {
                  const angle = ((index + 1) / m.stages.length) * Math.PI * 2;
                  return (
                    <circle
                      key={index}
                      cx={60 + 54 * Math.cos(angle)}
                      cy={60 + 54 * Math.sin(angle)}
                      r={index <= active ? 2.1 : 1.5}
                      className={cx("method__tick", index <= active && "is-done")}
                    />
                  );
                })}
              </svg>
              <AnimatePresence mode="wait">
                <motion.span
                  key={active}
                  className="method__num"
                  initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -24, filter: "blur(6px)" }}
                  transition={{ duration: 0.45, ease }}
                >
                  0{active + 1}
                </motion.span>
              </AnimatePresence>
              <p className="method__rail-label">{m.stages[active][0]}</p>
            </div>
          </div>

          <ol className="method__list">
            {m.stages.map(([title, body, output], index) => (
              <li
                key={title}
                ref={(el) => {
                  refs.current[index] = el;
                }}
                data-index={index}
                className={cx("method__step", index === active && "is-active")}
              >
                <div className="method__card">
                  <span className="mono-label mono-label--dark">0{index + 1}</span>
                  <h3 className="method__title">{title}</h3>
                  <p className="method__body">{body}</p>
                  <p className="method__output">
                    <span>{m.outputLabel}</span> {output}
                  </p>
                  <ul className="method__tags">
                    {m.tags[index].map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <Statement text={m.statement} />

        <div className="strengths">
          <p className="mono-label mono-label--dark strengths__label">{m.strengthsLabel}</p>
          <div className="strengths__grid">
            {m.strengths.map(([title, body], index) => (
              <Reveal key={title} delay={0.08 * index} className="strengths__tile">
                <span className="strengths__num">0{index + 1}</span>
                <h3 className="strengths__title">{title}</h3>
                <p className="strengths__body">{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Apple's scroll-lit sentence: each word brightens as the line scrolls up through the screen. */
function Statement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const clean = text.replace(/​/g, "");
  // Chinese has no spaces, so it lights up a character at a time.
  const parts = /\s/.test(clean) ? clean.split(/(?<=\s)/) : [...clean];

  return (
    <p ref={ref} className="method-statement">
      {parts.map((part, index) => (
        <Word key={index} progress={scrollYProgress} range={[index / parts.length, (index + 1) / parts.length]} still={!!reduce}>
          {part}
        </Word>
      ))}
    </p>
  );
}

function Word({ children, progress, range, still }: { children: string; progress: MotionValue<number>; range: [number, number]; still: boolean }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return <motion.span style={still ? undefined : { opacity }}>{children}</motion.span>;
}
