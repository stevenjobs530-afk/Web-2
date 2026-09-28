import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { Mail } from "lucide-react";
import { links, type Content } from "../data/content";
import { ArrowUpRight, Film, Reveal, asset, useRange } from "../components/primitives";
import { scrollToId } from "./Nav";

export function Contact({ t }: { t: Content }) {
  const c = t.contact;
  const ref = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useRange(scrollYProgress, [0, 1], [1.15, 1]);

  const options = [
    { label: c.email, href: `mailto:${links.email}`, detail: links.email, primary: true },
    { label: "LinkedIn", href: links.linkedin, detail: "in/zishungao24279b" },
    { label: "GitHub", href: links.github, detail: "stevenjobs530-afk" },
  ];

  return (
    <section id="contact" ref={ref} className="finale">
      <motion.div className="finale__media" style={reduce ? undefined : { scale }}>
        <Film src={asset("media/homepage-contact.mp4")} poster={asset("media/homepage-contact.jpg")} className="h-full w-full object-cover" />
      </motion.div>
      <div className="finale__shade" aria-hidden="true" />

      <div className="finale__inner shell">
        <Reveal>
          <p className="mono-label mono-label--dark">
            <span className="mono-label__num">{c.number}</span>
            {c.eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="finale__title">
            {c.title} <em className="serif-accent">{c.italic}</em>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="finale__intro">{c.intro}</p>
        </Reveal>

        <Reveal delay={0.18} className="finale__options">
          {options.map((option) => (
            <a
              key={option.label}
              className={option.primary ? "contact-card contact-card--primary" : "contact-card"}
              href={option.href}
              target={option.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer"
            >
              <span className="contact-card__label">
                {option.primary ? <Mail className="size-4" aria-hidden="true" /> : null}
                {option.label}
              </span>
              <span className="contact-card__detail">{option.detail}</span>
              <ArrowUpRight className="contact-card__arrow" />
            </a>
          ))}
        </Reveal>

        <footer className="finale__footer">
          <span>{c.rights}</span>
          <span className="max-sm:hidden">{c.footer}</span>
          <button type="button" className="hover:text-white" onClick={() => scrollToId("home")}>
            {c.top} ↑
          </button>
        </footer>
      </div>
    </section>
  );
}
