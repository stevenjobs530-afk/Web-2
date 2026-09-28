import type { Content } from "../data/content";
import { Reveal, SectionHead } from "../components/primitives";

const accents = ["metric-figure--azure", "metric-figure--warm"] as const;

export function Experience({ t }: { t: Content }) {
  const x = t.experience;

  return (
    <section id="experience" className="section shell">
      <SectionHead number={x.number} label={x.label} title={x.title} italic={x.italic} summary={x.summary} />

      <div className="grid gap-5">
        {x.items.map((item, index) => (
          <Reveal key={item.role} className="role" delay={index * 0.06}>
            <div className="role__head">
              <div>
                <p className="mono-label">{item.date}</p>
                <h3 className="role__title">{item.role}</h3>
                <p className="role__org">{item.organisation}</p>
              </div>
              <p className="role__focus">{item.focus}</p>
            </div>

            <p className="role__summary">{item.summary}</p>

            <dl className="role__metrics">
              {item.metrics.map(([value, label]) => (
                <div key={label} className="role__metric">
                  <dt className={`metric-figure ${accents[index % accents.length]}`}>{value}</dt>
                  <dd className="metric-label">{label}</dd>
                </div>
              ))}
            </dl>

            <ul className="role__details">
              {item.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
