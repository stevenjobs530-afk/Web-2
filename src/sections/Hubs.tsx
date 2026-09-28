import { useEffect, useState } from "react";
import { links, remoteMedia, type Content } from "../data/content";
import { ArrowRight, Reveal, cx } from "../components/primitives";

type City = Content["hubs"]["cities"][number];

const HOME_ZONE = "Europe/London";
const WORK_START = 9;
const WORK_END = 18;

function formatTime(date: Date, zone: string) {
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: zone }).format(date);
}

function gmtLabel(date: Date, zone: string) {
  const part = new Intl.DateTimeFormat("en-GB", { timeZone: zone, timeZoneName: "shortOffset" })
    .formatToParts(date)
    .find((p) => p.type === "timeZoneName");
  return part?.value === "GMT" ? "GMT+0" : (part?.value ?? "GMT");
}

/** Today's London working window expressed in another city's clock. */
function workingWindow(now: Date, zone: string) {
  const londonHour = Number(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hourCycle: "h23", timeZone: HOME_ZONE }).format(now));
  const start = new Date(now.getTime() + (WORK_START - londonHour) * 3_600_000);
  start.setMinutes(0, 0, 0);
  const end = new Date(start.getTime() + (WORK_END - WORK_START) * 3_600_000);
  return `${formatTime(start, zone)} – ${formatTime(end, zone)}`;
}

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

function HubCard({ city, t, now, open, onToggle, index }: { city: City; t: Content["hubs"]; now: Date; open: boolean; onToggle: () => void; index: number }) {
  const [suppressHover, setSuppressHover] = useState(false);

  return (
    <Reveal delay={0.08 * index} className="h-full">
      <article
        className={cx("hub", open && "is-open", suppressHover && "is-closed")}
        tabIndex={0}
        aria-expanded={open}
        onClick={() => {
          if (open) setSuppressHover(true);
          onToggle();
        }}
        onMouseLeave={() => setSuppressHover(false)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onToggle();
          }
        }}
      >
        <div className="hub__media" style={{ backgroundImage: `url("${remoteMedia[city.id as "paris" | "london" | "newYork"]}")` }} aria-hidden="true" />

        <div className="hub__chrome">
          <div className="hub__top">
            <span className="hub__country">{city.country}</span>
            <span className="hub__tz">{gmtLabel(now, city.zone)}</span>
          </div>
          <div className="hub__bottom">
            <span className="hub__city">{city.city}</span>
            <svg className="hub__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 19 19 5M13 5h6v6" />
            </svg>
          </div>
        </div>

        <div className="hub__panel">
          <div className="hub__blur" aria-hidden="true" />
          <div className="hub__copy">
            <p className="hub__item hub__cityrow" style={{ ["--i" as string]: 0 }}>
              <ArrowRight className="h-2.5 w-4" />
              {city.city}
            </p>
            <div className="hub__item hub__block" style={{ ["--i" as string]: 1 }}>
              <p className="hub__primary">{workingWindow(now, city.zone)}</p>
              <p className="hub__secondary">{t.windowLabel}</p>
            </div>
            <div className="hub__item hub__block" style={{ ["--i" as string]: 2 }}>
              <a className="hub__primary hover:underline" href={`mailto:${links.email}`} onClick={(event) => event.stopPropagation()}>
                {links.email}
              </a>
              <p className="hub__secondary">Bristol · United Kingdom</p>
            </div>
            <p className="hub__item hub__meta" style={{ ["--i" as string]: 3 }}>
              {t.localLabel} · {formatTime(now, city.zone)}
            </p>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function Hubs({ t }: { t: Content }) {
  const h = t.hubs;
  const now = useNow();
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!openId) return;
    const close = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".hub")) setOpenId(null);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openId]);

  return (
    <section className="hubs" aria-labelledby="hubs-title">
      <div className="shell">
        <Reveal>
          <span className="hubs__pill">
            <ArrowRight className="h-2.5 w-3.5" />
            {h.pill}
          </span>
        </Reveal>
        <div className="hubs__line" aria-hidden="true" />
        <div className="hubs__header">
          <Reveal delay={0.06}>
            <h2 id="hubs-title" className="hubs__title">
              {h.title[0]}
              <br />
              {h.title[1]}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="hubs__body">{h.body}</p>
          </Reveal>
        </div>
        <div className="hubs__grid">
          {h.cities.map((city, index) => (
            <HubCard
              key={city.id}
              city={city}
              t={h}
              now={now}
              index={index}
              open={openId === city.id}
              onToggle={() => setOpenId((id) => (id === city.id ? null : city.id))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
