import { Sparkles } from "lucide-react";
import { remoteMedia, type Content, type Lang } from "../data/content";
import { ArrowRight, Film, Reveal, SectionHead, asset, pageHref } from "../components/primitives";

/** Split layout from the falcon reference: film on the left, the workflow as a clean panel on the right. */
export function AiWorkflow({ t, lang }: { t: Content; lang: Lang }) {
  const a = t.ai;

  return (
    <section id="ai-workflow" className="section shell">
      <SectionHead number={a.number} label={a.label} title={a.title} italic={a.italic} summary={a.summary} />

      <Reveal className="falcon">
        <div className="falcon__film">
          <Film src={remoteMedia.falcon} poster={asset("media/posters-web2/falcon.jpg")} className="falcon__video" />
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
              <Reveal key={num} delay={0.08 * index} className="falcon__stage">
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
    </section>
  );
}
