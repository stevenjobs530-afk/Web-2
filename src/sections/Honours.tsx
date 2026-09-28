import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { honours, type Content, type Lang } from "../data/content";
import { Reveal, SectionHead, asset, cx, ease } from "../components/primitives";

export function Honours({ t, lang }: { t: Content; lang: Lang }) {
  const h = t.honours;
  const items = honours[lang];
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  const [current, setCurrent] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 });

  const centreOn = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const track = trackRef.current;
    const card = track?.querySelectorAll<HTMLElement>(".honour-wrap")[index];
    if (!track || !card) return;
    track.scrollTo({ left: card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2, behavior });
  }, []);

  // Open centred on the middle of the shelf so both sides carry weight.
  useEffect(() => {
    const middle = Math.floor((items.length - 1) / 2);
    const frame = requestAnimationFrame(() => centreOn(middle, "auto"));
    return () => cancelAnimationFrame(frame);
  }, [centreOn, items.length]);

  const syncCurrent = () => {
    const track = trackRef.current;
    if (!track) return;
    const centre = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDistance = Infinity;
    track.querySelectorAll<HTMLElement>(".honour-wrap").forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - centre);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    });
    setCurrent(best);
  };

  // Mouse drag to scroll; touch devices already swipe natively.
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !trackRef.current) return;
    drag.current = { active: true, startX: event.clientX, startScroll: trackRef.current.scrollLeft, moved: 0 };
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!drag.current.active || !track) return;
    const delta = event.clientX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(delta));
    if (drag.current.moved > 6 && !dragging) setDragging(true);
    track.scrollLeft = drag.current.startScroll - delta;
  };
  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (dragging) {
      setDragging(false);
      syncCurrent();
      requestAnimationFrame(() => {
        const track = trackRef.current;
        if (!track) return;
        const cards = track.querySelectorAll<HTMLElement>(".honour-wrap");
        const centre = track.scrollLeft + track.clientWidth / 2;
        let best = 0;
        cards.forEach((card, index) => {
          if (Math.abs(card.offsetLeft + card.offsetWidth / 2 - centre) < Math.abs(cards[best].offsetLeft + cards[best].offsetWidth / 2 - centre)) best = index;
        });
        centreOn(best);
      });
    }
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

  const shown = open === null ? null : items[open];

  return (
    <section id="honours" className="section section--band">
      <div className="shell">
        <SectionHead number={h.number} label={h.label} title={h.title} italic={h.italic} summary={h.summary} align="center" />
      </div>

      <div className="shelf">
        <div
          ref={trackRef}
          className={cx("honours-track", dragging && "is-dragging")}
          aria-label={h.title}
          onScroll={syncCurrent}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
        >
          {items.map((item, index) => (
            <Reveal key={item.image} delay={index * 0.05} className="honour-wrap">
              <button
                type="button"
                className={cx("honour", index === current && "is-current")}
                onClick={() => (index === current ? setOpen(index) : centreOn(index))}
                aria-label={`${index === current ? h.open : h.goTo}: ${item.title}`}
              >
                <span className="honour__frame">
                  <img src={asset(`achievements/thumbs/${item.image}.webp`)} alt="" loading="lazy" draggable={false} />
                </span>
                <span className="mono-label mt-5 block">{item.label}</span>
                <span className="honour__title">{item.title}</span>
                <span className="honour__detail">{item.detail}</span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="shelf__controls">
        <button type="button" className="round-btn" onClick={() => centreOn(Math.max(0, current - 1))} aria-label={h.prev} disabled={current === 0}>
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <div className="shelf__dots">
          {items.map((item, index) => (
            <button
              key={item.image}
              type="button"
              className={cx("shelf__dot", index === current && "is-current")}
              onClick={() => centreOn(index)}
              aria-label={`${h.goTo} ${index + 1}`}
              aria-current={index === current ? "true" : undefined}
            />
          ))}
        </div>
        <button type="button" className="round-btn" onClick={() => centreOn(Math.min(items.length - 1, current + 1))} aria-label={h.next} disabled={current === items.length - 1}>
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>
      <p className="shelf__hint">{h.hint}</p>

      <AnimatePresence>
        {shown ? (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={shown.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.figure
              key={shown.image}
              className="lightbox__figure"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease }}
              onClick={(event) => event.stopPropagation()}
            >
              <img src={asset(`achievements/${shown.image}.png`)} alt={shown.title} />
              <figcaption>
                <span className="font-semibold text-white">{shown.title}</span>
                <span className="text-white/60"> · {shown.detail}</span>
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
