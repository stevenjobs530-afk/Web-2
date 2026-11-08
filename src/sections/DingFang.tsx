import { motion } from "motion/react";
import type { Content, Lang } from "../data/content";
import { ArrowRight, Cta, SectionHead, asset } from "../components/primitives";
import { ScrollCinema } from "./Projects";

/** 06 · Ding Fang's signed editions — one of the Sacred Landscapes opens to full bleed; the site itself lives at /ding-fang/. */
export function DingFang({ t, lang }: { t: Content; lang: Lang }) {
  const d = t.dingFang;
  const here = lang === "zh" ? "ding-fang/zh/" : "ding-fang/";
  const there = lang === "zh" ? "ding-fang/" : "ding-fang/zh/";

  return (
    <section id="ding-fang" className="section">
      <div className="shell">
        <SectionHead number={d.number} label={d.label} title={d.title} italic={d.italic} summary={d.summary} />
      </div>

      <ScrollCinema id="ding-fang-film" className="cinema--research cinema--ding">
        {({ copyStyle, fadeStyle }) => (
          <>
            <img
              className="cinema__video cinema__still"
              src={asset("ding-fang/img/works/clearwater.jpg")}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <div className="cinema__shade" aria-hidden="true" />
            <motion.div className="cinema__copy" style={copyStyle}>
              <p className="mono-label mono-label--dark">
                <span className="mono-label__num">{d.number}</span>
                {d.type} · {d.tools}
              </p>
              <h3 className="cinema__title">{d.heading}</h3>
              <p className="cinema__body">{d.description}</p>
              <div className="cinema__metric">
                <span className="metric-figure metric-figure--warm">{d.metric}</span>
                <span className="metric-label !text-white/60">{d.metricLabel}</span>
              </div>
              <div className="cta-row">
                <Cta href={asset(here)} tone="light">
                  {d.cta}
                </Cta>
                <Cta href={asset(there)} tone="ghost-dark">
                  {d.other}
                </Cta>
              </div>
            </motion.div>
            <motion.div className="cinema__path" style={fadeStyle}>
              <ol className="path path--dark">
                {d.path.map((step, index) => (
                  <li key={step} className="path__step">
                    <span>{step}</span>
                    {index < d.path.length - 1 ? <ArrowRight className="path__arrow" /> : null}
                  </li>
                ))}
              </ol>
            </motion.div>
          </>
        )}
      </ScrollCinema>
    </section>
  );
}
