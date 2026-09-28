import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Content } from "../data/content";
import { cx, ease } from "../components/primitives";

export function scrollToId(id: string) {
  const target = id === "home" ? document.body : document.getElementById(id);
  if (!target) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = id === "home" ? 0 : target.getBoundingClientRect().top + window.scrollY - 24;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  history.replaceState(null, "", id === "home" ? location.pathname + location.search : `#${id}`);
}

function Mark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <circle cx="7" cy="7" r="4.2" fill="currentColor" />
      <circle cx="17" cy="7" r="4.2" fill="currentColor" opacity=".7" />
      <circle cx="7" cy="17" r="4.2" fill="currentColor" opacity=".7" />
      <circle cx="17" cy="17" r="4.2" fill="currentColor" opacity=".45" />
    </svg>
  );
}

export function Nav({ t, onToggleLanguage }: { t: Content; onToggleLanguage: () => void }) {
  const [onHero, setOnHero] = useState(true);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      setOnHero(window.scrollY < window.innerHeight * 0.82);
      let current = "";
      for (const [id] of t.nav.items) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) current = id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [t]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <header className={cx("nav", onHero ? "nav--hero" : "nav--page")}>
        <a
          className="nav__brand"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            go("home");
          }}
        >
          <Mark />
          <span>{t.nav.brand}</span>
        </a>

        <nav className="nav__pill" aria-label="Primary">
          <ul className="nav__links">
            {t.nav.items.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={cx("nav__link", active === id && "is-active")}
                  aria-current={active === id ? "true" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    go(id);
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <button type="button" className="nav__lang" onClick={onToggleLanguage} aria-label={t.nav.switchLabel}>
            {t.nav.switchTo}
          </button>
          <button type="button" className="nav__menu" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-menu">
            {t.nav.menu}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div className="sheet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              className="sheet__panel"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <span className="mono-label">{t.nav.brand}</span>
                <button type="button" className="sheet__close" onClick={() => setOpen(false)}>
                  {t.nav.close}
                </button>
              </div>
              <ul className="mt-6 grid gap-1">
                {t.nav.items.map(([id, label], index) => (
                  <motion.li key={id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + index * 0.04, ease }}>
                    <a
                      href={`#${id}`}
                      className="sheet__link"
                      onClick={(event) => {
                        event.preventDefault();
                        go(id);
                      }}
                    >
                      {label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
