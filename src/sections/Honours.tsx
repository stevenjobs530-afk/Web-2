import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { honours, type Content, type Lang } from "../data/content";
import { Reveal, SectionHead, asset, ease } from "../components/primitives";

export function Honours({ t, lang }: { t: Content; lang: Lang }) {
  const h = t.honours;
  const items = honours[lang];
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".honour");
    track.scrollBy({ left: direction * ((card?.offsetWidth ?? 320) + 20), behavior: "smooth" });
  };

  useEffect(() => {
    if (open === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
      if (event.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % items.length));
      if (event.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items.length]);

  const current = open === null ? null : items[open];

  return (
    <section id="honours" className="section section--band">
      <div className="shell">
        <SectionHead number={h.number} label={h.label} title={h.title} italic={h.italic} summary={h.summary} />
      </div>

      <div ref={trackRef} className="honours-track" aria-label={h.title}>
        {items.map((item, index) => (
          <Reveal key={item.image} delay={index * 0.05} className="honour-wrap">
            <button type="button" className="honour" onClick={() => setOpen(index)} aria-label={`${h.open}: ${item.title}`}>
              <span className="honour__frame">
                <img src={asset(`achievements/thumbs/${item.image}.webp`)} alt="" loading="lazy" />
              </span>
              <span className="mono-label mt-5 block">{item.label}</span>
              <span className="honour__title">{item.title}</span>
              <span className="honour__detail">{item.detail}</span>
            </button>
          </Reveal>
        ))}
      </div>

      <div className="shell mt-6 flex justify-end gap-2">
        <button type="button" className="round-btn" onClick={() => scrollBy(-1)} aria-label={h.prev}>
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <button type="button" className="round-btn" onClick={() => scrollBy(1)} aria-label={h.next}>
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>

      <AnimatePresence>
        {current ? (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={current.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.figure
              key={current.image}
              className="lightbox__figure"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease }}
              onClick={(event) => event.stopPropagation()}
            >
              <img src={asset(`achievements/${current.image}.png`)} alt={current.title} />
              <figcaption>
                <span className="font-semibold text-white">{current.title}</span>
                <span className="text-white/60"> · {current.detail}</span>
              </figcaption>
            </motion.figure>
            <button type="button" className="lightbox__close" onClick={() => setOpen(null)} aria-label={h.close}>
              <X className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="lightbox__nav lightbox__nav--prev"
              aria-label={h.prev}
              onClick={(event) => {
                event.stopPropagation();
                setOpen((i) => (i === null ? i : (i - 1 + items.length) % items.length));
              }}
            >
              <ChevronLeft className="size-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="lightbox__nav lightbox__nav--next"
              aria-label={h.next}
              onClick={(event) => {
                event.stopPropagation();
                setOpen((i) => (i === null ? i : (i + 1) % items.length));
              }}
            >
              <ChevronRight className="size-6" aria-hidden="true" />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
