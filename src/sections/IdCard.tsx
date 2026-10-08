import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Hand, Smartphone } from "lucide-react";
import type { Content } from "../data/content";
import { asset, ease } from "../components/primitives";

// three.js is only fetched once the visitor scrolls near the card.
const Lanyard = lazy(() => import("../components/lanyard/Lanyard"));

const TIP_KEY = "web2-lanyard-tip";

type OrientationEventWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function isTouch() {
  return window.matchMedia?.("(hover: none) and (pointer: coarse)").matches ?? false;
}

function tipSeen() {
  try {
    return localStorage.getItem(TIP_KEY) === "1";
  } catch {
    return false;
  }
}

/** Phones only: maps the device tilt to -1..1 per axis, relative to how the phone was first held. */
function useTilt(active: boolean) {
  const tilt = useRef({ x: 0, z: 0 });
  const [listening, setListening] = useState(false);
  const supported = typeof window !== "undefined" && "DeviceOrientationEvent" in window && isTouch();
  const needsPermission =
    supported && typeof (DeviceOrientationEvent as OrientationEventWithPermission).requestPermission === "function";

  useEffect(() => {
    if (!active || !supported || needsPermission) return;
    setListening(true);
  }, [active, supported, needsPermission]);

  useEffect(() => {
    if (!listening) return;
    let rest: number | null = null;
    const onOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta == null || event.gamma == null) return;
      const angle = screen.orientation?.angle ?? 0;
      const side = angle === 90 ? event.beta : angle === 270 || angle === -90 ? -event.beta : event.gamma;
      const forward = angle === 0 || angle === 180 ? event.beta : event.gamma;
      rest ??= forward;
      const x = Math.max(-1, Math.min(1, side / 45));
      const z = Math.max(-1, Math.min(1, (forward - rest) / 40));
      // Light smoothing keeps sensor jitter out of the swing.
      tilt.current.x += (x - tilt.current.x) * 0.25;
      tilt.current.z += (z - tilt.current.z) * 0.25;
    };
    window.addEventListener("deviceorientation", onOrientation);
    return () => {
      window.removeEventListener("deviceorientation", onOrientation);
      tilt.current = { x: 0, z: 0 };
    };
  }, [listening]);

  const request = useCallback(async () => {
    try {
      const result = await (DeviceOrientationEvent as OrientationEventWithPermission).requestPermission?.();
      if (result === "granted") setListening(true);
    } catch {
      // Denied or unavailable: dragging still works.
    }
  }, []);

  return { tilt, canAsk: needsPermission && !listening, request };
}

/** Interactive lanyard ID card that drops in right after the hero. */
export function IdCard({ t }: { t: Content }) {
  const ref = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [webgl] = useState(hasWebGL);
  const [touch] = useState(isTouch);
  const [showTip, setShowTip] = useState(false);
  const { tilt, canAsk, request } = useTilt(near && webgl && !reduce);
  const front = asset("lanyard/card-front.webp");
  const tip = t.idCard.tip;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: "200px 0px" },
    );
    const visible = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.5 });
    observer.observe(node);
    visible.observe(node);
    return () => {
      observer.disconnect();
      visible.disconnect();
    };
  }, []);

  // First visit only: show the tip once the card has dropped in.
  useEffect(() => {
    if (!inView || !webgl || tipSeen()) return;
    const timer = window.setTimeout(() => setShowTip(true), 1400);
    return () => window.clearTimeout(timer);
  }, [inView, webgl]);

  const dismiss = useCallback(() => {
    setShowTip(false);
    try {
      localStorage.setItem(TIP_KEY, "1");
    } catch {
      // Storage unavailable: the tip simply shows again next visit.
    }
  }, []);

  const enableTilt = async () => {
    await request();
    dismiss();
  };

  return (
    <section id="id-card" ref={ref} className="id-card" aria-label={t.idCard.label}>
      <div className="id-card__stage" onPointerDown={showTip ? dismiss : undefined}>
        {webgl ? (
          near && (
            <Suspense fallback={null}>
              <Lanyard
                frontImage={front}
                strapColor="#8e1b2b"
                finish="glossy"
                metal="silver"
                size={touch ? 0.56 : 0.62}
                strapLength={0.42}
                tiltRef={tilt}
              />
            </Suspense>
          )
        ) : (
          <img className="id-card__still" src={front} alt={t.idCard.alt} loading="lazy" />
        )}

        <AnimatePresence>
          {showTip && (
            <motion.div
              className="id-card__tip"
              role="dialog"
              aria-label={tip.title}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.6, ease }}
              onPointerDown={(event) => event.stopPropagation()}
            >
              <span className="id-card__tip-icon" aria-hidden="true">
                <Hand className="size-5" />
              </span>
              <div className="id-card__tip-copy">
                <p className="id-card__tip-title">{tip.title}</p>
                <p className="id-card__tip-body">{touch ? tip.touch : tip.mouse}</p>
              </div>
              <div className="id-card__tip-actions">
                {canAsk && (
                  <button type="button" className="pill id-card__tip-btn id-card__tip-btn--dark" onClick={enableTilt}>
                    <Smartphone className="size-4" aria-hidden="true" />
                    {tip.enableTilt}
                  </button>
                )}
                <button type="button" className="pill id-card__tip-btn" onClick={dismiss}>
                  {tip.gotIt}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {webgl && (
        <p className="mono-label id-card__hint" style={showTip ? { visibility: "hidden" } : undefined}>
          {touch ? t.idCard.hintTouch : t.idCard.hint}
          {canAsk && !showTip && (
            <button type="button" className="id-card__hint-btn" onClick={request}>
              {tip.enableTilt}
            </button>
          )}
        </p>
      )}
    </section>
  );
}
