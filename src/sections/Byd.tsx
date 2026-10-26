import { motion } from "motion/react";
import type { Content, Lang } from "../data/content";
import { ArrowRight, Cta, SectionHead, asset, pageHref } from "../components/primitives";
import { ScrollCinema } from "./Projects";

/** 05 · BYD in the UK — the roof of the Seal U from the concept page's opening frame opens to full bleed. */
export function Byd({ t, lang }: { t: Content; lang: Lang }) {
  const b = t.byd;

  return (
    <section id="byd" className="section">
      <div className="shell">
        <SectionHead number={b.number} label={b.label} title={b.title} italic={b.italic} summary={b.summary} />
      </div>

      <ScrollCinema id="byd-film" className="cinema--research cinema--byd">
        {({ copyStyle, fadeStyle }) => (
          <>
            <img
              className="cinema__video cinema__still"
              src={asset("byd/media/hero-poster.jpg")}
              alt=""
              width={1920}
              height={1080}
              loading="lazy"
              decoding="async"
            />
            <div className="cinema__shade" aria-hidden="true" />
            <motion.div className="cinema__copy" style={copyStyle}>
              <p className="mono-label mono-label--dark">
                <span className="mono-label__num">05</span>
                {b.type} · {b.tools}
              </p>
              <h3 className="cinema__title">{b.heading}</h3>
              <p className="cinema__body">{b.description}</p>
              <div className="cinema__metric">
                <span className="metric-figure metric-figure--warm">{b.metric}</span>
                <span className="metric-label !text-white/60">{b.metricLabel}</span>
              </div>
              <div className="cta-row">
                <Cta href={pageHref("byd/research", lang)} tone="light">
                  {b.cta}
                </Cta>
                <Cta href={pageHref("byd", lang)} tone="ghost-dark">
                  {b.cars}
                </Cta>
              </div>
            </motion.div>
            <motion.div className="cinema__path" style={fadeStyle}>
              <ol className="path path--dark">
                {b.path.map((step, index) => (
                  <li key={step} className="path__step">
                    <span>{step}</span>
                    {index < b.path.length - 1 ? <ArrowRight className="path__arrow" /> : null}
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
