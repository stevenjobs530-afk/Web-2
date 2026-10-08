import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { Content } from "../data/content";
import { asset } from "../components/primitives";

// three.js is only fetched once the visitor scrolls near the card.
const Lanyard = lazy(() => import("../components/lanyard/Lanyard"));

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Interactive lanyard ID card that drops in right after the hero. */
export function IdCard({ t }: { t: Content }) {
  const ref = useRef<HTMLElement | null>(null);
  const [near, setNear] = useState(false);
  const [webgl] = useState(hasWebGL);
  const front = asset("lanyard/card-front.webp");

  useEffect(() => {
    const node = ref.current;
    if (!node || near) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [near]);

  return (
    <section id="id-card" ref={ref} className="id-card" aria-label={t.idCard.label}>
      <div className="id-card__stage">
        {webgl ? (
          near && (
            <Suspense fallback={null}>
              <Lanyard
                frontImage={front}
                strapColor="#8e1b2b"
                finish="glossy"
                metal="silver"
                size={0.62}
                strapLength={0.42}
              />
            </Suspense>
          )
        ) : (
          <img className="id-card__still" src={front} alt={t.idCard.alt} loading="lazy" />
        )}
      </div>
      {webgl && <p className="mono-label id-card__hint">{t.idCard.hint}</p>}
    </section>
  );
}
