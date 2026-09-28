import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Content } from "../data/content";
import { SectionHead, cx, ease } from "../components/primitives";

/** Apple-style sticky story: the step number stays pinned while each stage scrolls past. */
export function Method({ t }: { t: Content }) {
  const m = t.method;
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLLIElement | null>>([]);

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

  const progress = (active + 1) / m.stages.length;

  return (
    <section id="method" className="section section--ink">
      <div className="shell">
        <SectionHead number={m.number} label={m.label} title={m.title} italic={m.italic} summary={m.summary} tone="dark" />

        <div className="method">
          <div className="method__rail">
            <div className="method__sticky">
              <svg viewBox="0 0 120 120" className="method__ring" aria-hidden="true">
                <circle cx="60" cy="60" r="54" className="method__ring-track" />
                <circle cx="60" cy="60" r="54" className="method__ring-fill" style={{ strokeDashoffset: 339.3 * (1 - progress) }} />
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
                <span className="mono-label mono-label--dark">0{index + 1}</span>
                <h3 className="method__title">{title}</h3>
                <p className="method__body">{body}</p>
                <p className="method__output">
                  <span>{m.outputLabel}</span> {output}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
