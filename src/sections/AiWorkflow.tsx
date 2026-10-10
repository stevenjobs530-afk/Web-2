import { useState } from "react";
import { Sparkles } from "lucide-react";
import { motion, useMotionValueEvent, useReducedMotion } from "motion/react";
import type { Content, Lang } from "../data/content";
import { ArrowRight, Film, SectionHead, asset, gap, pageHref } from "../components/primitives";
import { ScrollCinema, type CinemaMotion } from "./Projects";

// Track progress where the four steps take their turn. The panel is on screen from the first frame,
// so Discover is lit straight away and the rest follow while the frame opens.
const STEPS_FROM = 0.12;
const STEPS_TO = 0.9;

/**
 * The falcon as a scroll cinema: the light frame opens to full bleed with the film on the left,
 * with the four-step panel already showing; each step opens in turn as the visitor keeps scrolling.
 */
export function AiWorkflow({ t, lang }: { t: Content; lang: Lang }) {
  const a = t.ai;

  return (
    <section id="ai-workflow" className="section">
      <div className="shell">
        <SectionHead number={a.number} label={a.label} title={a.title} italic={a.italic} summary={a.summary} />
      </div>

      <ScrollCinema id="ai-workflow-film" className="cinema--falcon">
        {(motionProps) => <FalconScene a={a} lang={lang} {...motionProps} />}
      </ScrollCinema>
    </section>
  );
}

function FalconScene({ a, lang, copyStyle, progress }: { a: Content["ai"]; lang: Lang } & CinemaMotion) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  useMotionValueEvent(progress, "change", (value) => {
    const t = (value - STEPS_FROM) / (STEPS_TO - STEPS_FROM);
    setStep(Math.min(a.stages.length - 1, Math.max(0, Math.floor(t * a.stages.length))));
  });

  return (
    <div className={reduce ? "falcon-scene is-still" : "falcon-scene"}>
      <div className="falcon-scene__film">
        <Film
          src={asset("media/falcon.mp4")}
          poster={asset("media/posters-web2/falcon.jpg")}
          phone={{ src: asset("media/mobile/falcon.mp4"), poster: asset("media/mobile/falcon.webp") }}
          className="falcon-scene__video"
        />
      </div>
      <div className="falcon-scene__shade" aria-hidden="true" />

      <div className="falcon-scene__layer">
        <motion.div className="falcon-scene__copy" style={copyStyle}>
          <span className="falcon__chip">
            <Sparkles className="size-3.5" aria-hidden="true" />
            {a.chip}
          </span>
          <p className="falcon-scene__title">
            {a.filmTitle[0]}
            <br />
            {gap(a.filmTitle[0], a.filmTitle[1])}
            {a.filmTitle[1]}
          </p>
        </motion.div>

        <div className="falcon-scene__panel">
          <div>
            <h3 className="falcon__panel-title">{a.panelTitle}</h3>
            <p className="falcon__panel-sub">{a.panelSub}</p>
          </div>

          <ol className="falcon-scene__stages">
            {a.stages.map(([num, title, body], index) => (
              <li key={num} className={index === step ? "falcon-scene__stage is-active" : "falcon-scene__stage"}>
                <span className="falcon__num">{num}</span>
                <div>
                  <p className="falcon__stage-title">{title}</p>
                  <div className="falcon-scene__reveal">
                    <p className="falcon__stage-body">{body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <a className="dark-pill" href={pageHref("case-studies/ai-assisted-job-workflow", lang)}>
            {a.cta}
            <ArrowRight className="h-3 w-4" />
          </a>
          <p className="falcon__assurance">{a.assurance}</p>
        </div>
      </div>
    </div>
  );
}
