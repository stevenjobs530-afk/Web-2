import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import type { Content } from "../data/content";
import { Reveal, SectionHead, ease } from "../components/primitives";

function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const decimals = value.includes(".") ? value.split(".")[1].length : 0;
  const [shown, setShown] = useState(reduce ? value : (0).toFixed(decimals));

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, Number(value), {
      duration: 1.8,
      ease,
      onUpdate: (latest) => setShown(latest.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, reduce, value, decimals]);

  return (
    <span ref={ref} className={className} aria-label={value}>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}

export function Education({ t }: { t: Content }) {
  const e = t.education;

  return (
    <section id="education" className="section shell">
      <SectionHead number={e.number} label={e.label} title={e.title} italic={e.italic} summary={e.summary} />

      <div className="edu-grid">
        <Reveal className="tile tile--hero-grade">
          <span className="tile__glow tile__glow--azure" aria-hidden="true" />
          <p className="mono-label">{e.undergraduate}</p>
          <h3 className="tile__title mt-4">{e.university}</h3>
          <p className="tile__body mt-2">{e.discipline}</p>
          <div className="mt-auto pt-12">
            <CountUp value={e.average} className="grade-figure" />
            <p className="tile__body mt-2">{e.averageLabel}</p>
            <p className="mono-label mt-5 !text-[var(--ink-3)]">{e.programme}</p>
          </div>
        </Reveal>

        <div className="edu-grades">
          <Reveal>
            <p className="mono-label">{e.gradesLabel}</p>
          </Reveal>
          {e.grades.map(([score, course], index) => (
            <Reveal key={course} delay={0.05 * index} className="grade-row">
              <span className="grade-row__score">{score}</span>
              <span className="grade-row__course">{course}</span>
              <span className="grade-row__bar" aria-hidden="true">
                <span style={{ width: `${Number(score)}%` }} />
              </span>
            </Reveal>
          ))}
        </div>

        <Reveal className="tile tile--current" delay={0.1}>
          <span className="tile__glow tile__glow--violet" aria-hidden="true" />
          <p className="mono-label">
            <span className="live-dot" aria-hidden="true" />
            {e.currentLabel}
          </p>
          <div className="mt-auto">
            <p className="tile__body">{e.currentSchool}</p>
            <h3 className="current-degree mt-2">{e.currentDegree}</h3>
            <p className="current-track mt-1">{e.currentTrack}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
