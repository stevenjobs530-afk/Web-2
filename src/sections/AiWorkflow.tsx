import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { remoteMedia, type Content, type Lang } from "../data/content";
import { ArrowRight, Film, Reveal, SectionHead, asset, pageHref } from "../components/primitives";

// Pin only where the whole card fits on screen; elsewhere the card scrolls normally.
const PIN_QUERY = "(min-width: 961px) and (min-height: 860px)";

function usePinned() {
  const reduce = useReducedMotion();
  const [fits, setFits] = useState(() => typeof window !== "undefined" && window.matchMedia(PIN_QUERY).matches);

  useEffect(() => {
    const query = window.matchMedia(PIN_QUERY);
    const sync = () => setFits(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return fits && !reduce;
}

/**
 * Split layout from the falcon reference: film on the left, the workflow as a clean panel on the right.
 * On large screens the card pins while the visitor scrolls, and the four steps light up in turn.
 */
export function AiWorkflow({ t, lang }: { t: Content; lang: Lang }) {
  const a = t.ai;
  const track = useRef<HTMLDivElement | null>(null);
  const pinned = usePinned();
  const [step, setStep] = useState(0);
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (value) => setStep(Math.min(a.stages.length - 1, Math.floor(value * a.stages.length))));

  return (
    <section id="ai-workflow" className="section shell">
      <SectionHead number={a.number} label={a.label} title={a.title} italic={a.italic} summary={a.summary} />

      <div ref={track} className={pinned ? "falcon-track is-pinned" : "falcon-track"}>
        <div className="falcon-pin">
          <Reveal className={pinned ? "falcon is-stepping" : "falcon"}>
            <div className="falcon__film">
              <Film
                src={remoteMedia.falcon}
                poster={asset("media/posters-web2/falcon.jpg")}
                phone={{
                  src: asset("media/mobile/falcon.mp4"),
                  poster: asset("media/mobile/falcon.webp"),
                }}
                className="falcon__video"
              />
              <div className="falcon__shade" aria-hidden="true" />
              <span className="falcon__chip">
                <Sparkles className="size-3.5" aria-hidden="true" />
                {a.chip}
              </span>
              <p className="falcon__title">
                {a.filmTitle[0]}
                <br />
                {a.filmTitle[1]}
              </p>
            </div>

            <div className="falcon__panel">
              <div>
                <h3 className="falcon__panel-title">{a.panelTitle}</h3>
                <p className="falcon__panel-sub">{a.panelSub}</p>
              </div>

              <ol className="falcon__stages">
                {a.stages.map(([num, title, body], index) => (
                  <Reveal key={num} delay={0.08 * index} className={index === step ? "falcon__stage is-active" : "falcon__stage"}>
                    <span className="falcon__num">{num}</span>
                    <div>
                      <p className="falcon__stage-title">{title}</p>
                      <p className="falcon__stage-body">{body}</p>
                    </div>
                  </Reveal>
                ))}
              </ol>

              <a className="dark-pill" href={pageHref("case-studies/ai-assisted-job-workflow", lang)}>
                {a.cta}
                <ArrowRight className="h-3 w-4" />
              </a>
              <p className="falcon__assurance">{a.assurance}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
