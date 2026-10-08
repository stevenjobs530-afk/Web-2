import { useEffect, useState } from "react";
import { content, type Lang } from "./data/content";
import { Nav } from "./sections/Nav";
import { Hero } from "./sections/Hero";
import { IdCard } from "./sections/IdCard";
import { Education } from "./sections/Education";
import { Honours } from "./sections/Honours";
import { Projects } from "./sections/Projects";
import { AiWorkflow } from "./sections/AiWorkflow";
import { Method } from "./sections/Method";
import { Experience } from "./sections/Experience";
import { Hubs } from "./sections/Hubs";
import { Contact } from "./sections/Contact";

function initialLang(): Lang {
  const fromUrl = new URLSearchParams(location.search).get("lang");
  if (fromUrl === "zh" || fromUrl === "en") return fromUrl;
  try {
    const saved = localStorage.getItem("web2-lang");
    if (saved === "zh" || saved === "en") return saved;
  } catch {
    // Storage can be unavailable (private mode); fall back to English.
  }
  return "en";
}

export default function App() {
  const [lang, setLang] = useState<Lang>(initialLang);
  const t = content[lang];

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.title = t.meta.title.replace(/[\u200b\u2060]/g, "");
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.meta.description);
    const url = new URL(location.href);
    url.searchParams.set("lang", lang);
    history.replaceState(null, "", url);
    try {
      localStorage.setItem("web2-lang", lang);
    } catch {
      // Ignore storage failures.
    }
  }, [lang, t]);

  // Returning from a detail page lands on its card (e.g. #project-uk-retail).
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const timer = window.setTimeout(() => {
      const target = document.getElementById(id);
      if (!target) return;
      // The Apple film is a tall scroll scene; land where its copy is fully open.
      const extra = id === "project-apple-app-store" ? target.offsetHeight - window.innerHeight : -96;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + extra, behavior: "auto" });
    }, 120);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <a className="skip-link" href="#education">
        {lang === "zh" ? "跳到主要内容" : "Skip to content"}
      </a>
      <Nav t={t} onToggleLanguage={() => setLang((l) => (l === "en" ? "zh" : "en"))} />
      <main className={lang === "zh" ? "lang-zh" : undefined}>
        <Hero t={t} />
        <IdCard t={t} />
        <Education t={t} />
        <Honours t={t} lang={lang} />
        <Projects t={t} lang={lang} />
        <AiWorkflow t={t} lang={lang} />
        <Method t={t} />
        <Experience t={t} />
        <Hubs t={t} />
        <Contact t={t} />
      </main>
    </>
  );
}
