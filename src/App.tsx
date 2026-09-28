import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Camera, CheckCircle2, Download, Drum, Dumbbell, FileText, Palette, ShieldCheck } from "lucide-react";
import { GlassButton } from "@/components/ui/apple-tahoe-liquid-glass-button";
import { BackgroundComponents } from "@/components/ui/background-components";
import { Button } from "@/components/ui/button";
import { LanguageSelectorDropdown } from "@/components/ui/language-selector-dropdown";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { RevealArticle, RevealBlock, RevealListItem, StaggerBlock, StaggerItem } from "@/components/ui/text-animations";
import { DataCanvas } from "@/components/DataCanvas";
import { CaseStudyFoldout } from "@/components/CaseStudyFoldout";
import { HelloIntro } from "@/components/HelloIntro";
import { PortfolioGuidedHints } from "@/components/PortfolioGuidedHints";
import { ProjectGalleryShowcase } from "@/components/ProjectGalleryShowcase";
import { SectionNavigator } from "@/components/SectionNavigator";
import { Eyebrow, FadeUp } from "@/components/web2/primitives";
import {
  DeskFilmSection,
  ExperienceDetails,
  FinaleSection,
  NumbersSection,
  PlacesSection,
  SkillsSection,
  StatementSection,
  StrengthsSection,
} from "@/components/web2/Web2Sections";
import { languageOptions, portfolioByLanguage, type LanguageCode, type PortfolioContent } from "@/data/portfolio";
import { web2ByLanguage, type Web2Copy } from "@/data/web2";

const defaultLanguage: LanguageCode = "en";

type NavSectionId = keyof PortfolioContent["nav"];

const navSectionIdsByLanguage = {
  en: ["about", "projects", "experience", "skills", "education", "contact"],
  "zh-CN": ["education", "projects", "experience", "skills", "about", "contact"],
} as const satisfies Record<LanguageCode, readonly NavSectionId[]>;

const interestIcons = [Drum, Palette, Camera, Dumbbell] as const;

function publicAssetPath(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}

const cvPdfPaths = {
  en: publicAssetPath("cv/Zishun_Gao_CV_UK_2026.pdf"),
  "zh-CN": publicAssetPath("cv/Zishun_Gao_CV_CN_2026.pdf"),
} as const satisfies Record<LanguageCode, string>;

function getInitialLanguage(): LanguageCode {
  return defaultLanguage;
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToPageSection(sectionId: string) {
  const target = document.getElementById(sectionId);

  if (!target) {
    return;
  }

  const headerOffset = sectionId === "top" ? 0 : 110;
  const scrollToTarget = (behavior: ScrollBehavior) => {
    window.scrollTo({
      top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - headerOffset),
      behavior,
    });
  };

  if (prefersReducedMotion()) {
    scrollToTarget("auto");
  } else {
    scrollToTarget("smooth");

    window.setTimeout(() => {
      const remainingOffset = target.getBoundingClientRect().top - headerOffset;

      if (Math.abs(remainingOffset) > 24) {
        window.scrollTo({
          top: Math.max(0, window.scrollY + remainingOffset),
          behavior: "auto",
        });
      }
    }, 700);
  }

  window.history.replaceState(null, "", `#${sectionId}`);
}

function Header({
  content,
  language,
  onLanguageChange,
}: {
  content: PortfolioContent;
  language: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
}) {
  const navSectionIds = navSectionIdsByLanguage[language];

  return (
    <header className="fixed left-1/2 top-[calc(env(safe-area-inset-top)+1.25rem)] z-30 flex w-[min(1180px,calc(100%-40px))] -translate-x-1/2 items-center justify-between gap-5 rounded-lg border border-white/55 bg-white/30 px-4 py-3 shadow-[inset_0_1px_1px_rgba(255,255,255,.78),0_14px_42px_rgba(46,61,82,.1)] backdrop-blur-[28px] backdrop-saturate-140 max-sm:top-[calc(env(safe-area-inset-top)+0.75rem)] max-sm:w-[calc(100%-28px)] max-sm:gap-3">
      <a
        className="min-w-0 truncate text-sm font-semibold text-neutral-950"
        href="#top"
        onClick={(event) => {
          event.preventDefault();
          scrollToPageSection("top");
        }}
      >
        {content.header.brandPrimary} <span className="text-neutral-500">{content.header.brandSecondary}</span>
      </a>
      <div className="flex shrink-0 items-center gap-4 max-sm:gap-3">
        <nav className="flex items-center gap-5 text-xs font-medium text-neutral-700 max-lg:hidden" aria-label="Primary navigation">
          {navSectionIds.map((sectionId) => (
            <a
              key={sectionId}
              className="nav-link hover:text-blue-700"
              href={`#${sectionId}`}
              onClick={(event) => {
                event.preventDefault();
                scrollToPageSection(sectionId);
              }}
            >
              {content.nav[sectionId]}
            </a>
          ))}
        </nav>
        <LanguageSelectorDropdown
          ariaLabel={content.header.languageLabel}
          value={language}
          options={languageOptions}
          onChange={onLanguageChange}
        />
      </div>
    </header>
  );
}

function HeroGraphic() {
  return (
    <LiquidGlass className="min-h-[500px] rounded-[2rem] max-lg:min-h-56 max-sm:min-h-[220px]" aria-hidden="true">
      <div className="liquid-chrome-artwork absolute inset-7 rounded-[1.65rem] max-sm:inset-5">
        <span className="chrome-ribbon chrome-ribbon-one" />
        <span className="chrome-ribbon chrome-ribbon-two" />
        <span className="chrome-caustic chrome-caustic-one" />
        <span className="chrome-caustic chrome-caustic-two" />
      </div>
    </LiquidGlass>
  );
}

function Hero({ content, language }: { content: PortfolioContent; language: LanguageCode }) {
  const { profile } = content;
  const cvPdfPath = cvPdfPaths[language];

  return (
    <section
      id="top"
      className={`mx-auto grid w-[min(1180px,calc(100%-40px))] grid-cols-[minmax(0,1.05fr)_minmax(320px,.75fr)] items-center gap-16 pb-12 pt-32 max-lg:min-h-0 max-lg:grid-cols-1 max-lg:gap-6 max-lg:pb-8 max-sm:w-[calc(100%-28px)] max-sm:pt-28 ${
        language === "zh-CN" ? "min-h-[72vh]" : "min-h-[88vh]"
      }`}
    >
      <StaggerBlock className="max-w-[760px]" delay={0.15}>
        <StaggerItem>
          <h1 className="apple-display-text text-[clamp(4.1rem,9vw,8.7rem)] leading-[.88] text-neutral-950 max-sm:text-[clamp(2.75rem,15vw,4rem)] max-sm:leading-[.96]">
            {profile.name}
          </h1>
        </StaggerItem>
        <StaggerItem>
          <p className="mt-6 text-[clamp(1.35rem,2.4vw,2.35rem)] font-semibold text-neutral-800 max-sm:mt-4 max-sm:text-xl">{profile.title}</p>
        </StaggerItem>
        <StaggerItem>
          <p className="mt-6 max-w-[760px] text-[clamp(1.02rem,1.55vw,1.22rem)] leading-8 text-neutral-700 max-sm:mt-4 max-sm:text-base max-sm:leading-7">
            {profile.intro}
          </p>
        </StaggerItem>
        <StaggerItem>
          <p className="mt-4 max-w-[760px] text-[clamp(1.02rem,1.55vw,1.22rem)] leading-8 text-neutral-500 max-sm:text-base max-sm:leading-7">
            {profile.introSecondary}
          </p>
        </StaggerItem>
        <StaggerItem className="mt-8 flex flex-wrap gap-4 max-sm:mt-6 max-sm:flex-col">
          <GlassButton
            liquid
            className="h-12 min-w-36 text-neutral-950 max-sm:w-full"
            glassColor="oklch(from var(--foreground) l c h / 7%)"
            onClick={() => scrollToPageSection("projects")}
          >
            {content.actions.viewProjects}
          </GlassButton>
          <GlassButton
            asChild
            liquid
            className="h-12 min-w-36 text-neutral-950 max-sm:w-full"
            glassColor="oklch(from var(--foreground) l c h / 5%)"
          >
            <a href={cvPdfPath} download>
              {content.actions.downloadCV}
            </a>
          </GlassButton>
        </StaggerItem>
        <StaggerItem className="mt-7 flex flex-wrap gap-5 text-sm font-medium text-neutral-600 max-sm:mt-6 max-sm:flex-col max-sm:gap-3">
          <a className="nav-link hover:text-blue-700" href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="nav-link hover:text-blue-700" href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="nav-link hover:text-blue-700" href={`mailto:${profile.email}`}>
            {content.actions.emailMe}
          </a>
        </StaggerItem>
      </StaggerBlock>
      <RevealBlock className="max-sm:hidden" delay={0.35}>
        <HeroGraphic />
      </RevealBlock>
    </section>
  );
}

function SectionHeading({ label, title, compact = false }: { label: string; title: string; compact?: boolean }) {
  return (
    <div>
      <Eyebrow>{label}</Eyebrow>
      <FadeUp as="h2" className={`web2-headline mt-5 ${compact ? "!text-[clamp(2.2rem,4.2vw,3.8rem)]" : "!text-[clamp(2.3rem,4.4vw,4rem)]"}`}>
        {title}
      </FadeUp>
    </div>
  );
}

function Projects({ content }: { content: PortfolioContent }) {
  return (
    <section id="projects" className="mx-auto w-[min(1180px,calc(100%-40px))] pt-32 max-sm:w-[calc(100%-28px)] max-sm:pt-24">
      <div className="flex items-end justify-between gap-6 pb-9 max-lg:flex-col max-lg:items-start">
        <SectionHeading label={content.sections.projects.label} title={content.sections.projects.title} />
        <Button asChild variant="glass" size="sm" className="gap-2">
          <a href={content.profile.github} target="_blank" rel="noreferrer">
            {content.actions.viewGithub} <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </Button>
      </div>
      <ProjectGalleryShowcase content={content} />
    </section>
  );
}

function PersonalTrainingPortal({ content }: { content: PortfolioContent }) {
  const project = content.projects.find((item) => item.href === "#/personal-training-concept");

  if (!project?.cover || !project.preview || !project.href) {
    return null;
  }

  const href = `${import.meta.env.BASE_URL}${project.href}`;

  return (
    <RevealArticle className="mt-6">
      <LiquidGlass
        as="a"
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={`${project.preview.ctaLabel}: ${project.title}. ${project.preview.newTabLabel}`}
        className="group grid min-w-0 grid-cols-[minmax(220px,.72fr)_minmax(0,1.28fr)] items-center overflow-hidden p-0 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1 max-md:grid-cols-1"
      >
        <div className="relative z-[1] min-w-0 self-stretch border-r border-white/55 bg-[radial-gradient(circle_at_22%_18%,rgba(0,122,255,.17),transparent_44%),radial-gradient(circle_at_84%_86%,rgba(21,214,180,.16),transparent_46%),rgba(240,247,252,.56)] p-4 max-md:border-b max-md:border-r-0 md:p-5">
          <img
            className="media-fade-in aspect-video h-full max-h-[240px] w-full rounded-lg border border-white/75 bg-white/75 object-contain shadow-[inset_0_1px_1px_rgba(255,255,255,.95),0_16px_42px_rgba(46,61,82,.13)] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.025] max-md:max-h-none"
            src={publicAssetPath(project.cover.src)}
            alt={project.cover.alt}
            loading="lazy"
          />
        </div>
        <div className="relative z-[1] min-w-0 p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-normal text-blue-600">{project.preview.label}</p>
          <h3 className="apple-display-text mt-3 text-[clamp(1.45rem,2.8vw,2.4rem)] leading-tight text-neutral-950">{project.title}</h3>
          <p className="mt-4 max-w-2xl text-[0.95rem] leading-7 text-neutral-600 md:text-base md:leading-8">{project.summary}</p>
          <p className="mt-3 text-xs leading-5 text-neutral-500">{project.preview.disclosure}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-blue-500/15 bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(18,97,255,.2)]">
              {project.preview.ctaLabel}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </span>
            <span className="text-xs font-medium text-neutral-500">{project.preview.newTabLabel}</span>
          </div>
        </div>
      </LiquidGlass>
    </RevealArticle>
  );
}

function CaseStudies({ content, language }: { content: PortfolioContent; language: LanguageCode }) {
  const [openStudyId, setOpenStudyId] = useState<string | null>(null);
  const compactIntro = language === "en";

  const toggleStudy = (studyId: string) => {
    if (openStudyId === studyId) {
      setOpenStudyId(null);

      if (window.location.hash.startsWith(`#case-${studyId}`)) {
        window.history.replaceState(null, "", "#case-studies");
      }

      return;
    }

    setOpenStudyId(studyId);
  };

  useEffect(() => {
    const syncStudyFromHash = () => {
      const matchingStudy = content.caseStudies.find((study) => window.location.hash.startsWith(`#case-${study.id}`));

      if (matchingStudy) {
        setOpenStudyId(matchingStudy.id);
      }
    };

    syncStudyFromHash();
    window.addEventListener("hashchange", syncStudyFromHash);
    return () => window.removeEventListener("hashchange", syncStudyFromHash);
  }, [content.caseStudies]);

  useEffect(() => {
    if (!openStudyId || !window.location.hash.startsWith(`#case-${openStudyId}`)) {
      return;
    }

    const timeout = window.setTimeout(() => {
      const target = document.getElementById(window.location.hash.slice(1));
      if (!target) {
        return;
      }

      window.scrollTo({
        top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - 110),
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    }, 60);

    return () => window.clearTimeout(timeout);
  }, [openStudyId]);

  return (
    <section
      id="case-studies"
      className={`mx-auto w-[min(1180px,calc(100%-40px))] max-sm:w-[calc(100%-28px)] ${compactIntro ? "pt-16" : "pt-24"}`}
    >
      <div
        className={`grid max-lg:grid-cols-1 ${
          compactIntro ? "grid-cols-[1fr_1fr] gap-14 pb-7" : "grid-cols-[.86fr_1.14fr] gap-20 pb-9"
        }`}
      >
        <SectionHeading label={content.sections.caseStudies.label} title={content.sections.caseStudies.title} compact={compactIntro} />
        <RevealBlock>
          <p className="text-base leading-8 text-neutral-600">{content.sections.caseStudies.body}</p>
        </RevealBlock>
      </div>

      <div className="grid gap-7">
        {content.caseStudies.map((study, index) => (
          <div key={study.id} id={`case-${study.id}`}>
            <CaseStudyFoldout
              study={study}
              labels={content.caseStudyLabels}
              expanded={openStudyId === study.id}
              onToggle={() => toggleStudy(study.id)}
              delay={index * 0.08}
            />
            {study.id === "aep" ? <PersonalTrainingPortal content={content} /> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function useAwardWallControls(cardCount: number) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(cardCount > 1);

  const updateState = () => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const maxScroll = track.scrollWidth - track.clientWidth;
    const firstCard = track.firstElementChild instanceof HTMLElement ? track.firstElementChild : null;
    const itemWidth = firstCard ? firstCard.offsetWidth + 18 : track.clientWidth;
    const nextIndex = Math.min(cardCount - 1, Math.max(0, Math.round(track.scrollLeft / itemWidth)));

    setActiveIndex(nextIndex);
    setCanScrollPrev(track.scrollLeft > 4);
    setCanScrollNext(track.scrollLeft < maxScroll - 4);
  };

  useEffect(() => {
    updateState();
    window.addEventListener("resize", updateState);

    return () => window.removeEventListener("resize", updateState);
  }, []);

  const scrollToIndex = (index: number) => {
    const target = trackRef.current?.children.item(index);

    if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "nearest", inline: "start" });
    }
  };

  const scrollByPage = (direction: -1 | 1) => {
    scrollToIndex(Math.min(cardCount - 1, Math.max(0, activeIndex + direction)));
  };

  return {
    activeIndex,
    canScrollNext,
    canScrollPrev,
    scrollByPage,
    scrollToIndex,
    trackRef,
    updateState,
  };
}

function AwardPreviewCard({
  card,
  yearLabel,
  categoryLabel,
}: {
  card: PortfolioContent["awardsGallery"]["cards"][number];
  yearLabel: string;
  categoryLabel: string;
}) {
  return (
    <article className="snap-start">
      <LiquidGlass className="flex h-full min-h-[450px] w-[min(76vw,285px)] flex-col p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,.92),inset_0_-1px_14px_rgba(255,255,255,.34),0_0_0_1px_rgba(255,255,255,.24),0_14px_34px_rgba(46,61,82,.07)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 sm:min-h-[470px] sm:w-[310px] lg:w-[326px]">
        <div className="relative z-[1] flex h-full flex-col">
          <div className="apple-inner-curve flex h-[185px] items-center justify-center overflow-hidden border border-white/70 bg-white/78 p-3 shadow-[inset_0_1px_1px_rgba(255,255,255,.95),0_18px_48px_rgba(46,61,82,.12)] sm:h-[205px]">
            <img className="media-fade-in max-h-full max-w-full object-contain" src={publicAssetPath(card.image)} alt={card.alt} loading="lazy" />
          </div>

          <div className="mt-5 min-w-0">
            <h3 className="apple-display-text text-[1.05rem] leading-7 text-neutral-950">{card.title}</h3>
            <dl className="mt-4 grid gap-2 text-sm leading-6 text-neutral-600">
              <div className="flex gap-2">
                <dt className="shrink-0 font-semibold text-neutral-900">{yearLabel}:</dt>
                <dd>{card.year}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="shrink-0 font-semibold text-neutral-900">{categoryLabel}:</dt>
                <dd>{card.category}</dd>
              </div>
            </dl>
          </div>

          <p className="mt-4 text-[0.95rem] leading-7 text-neutral-600">{card.note}</p>

          <div className="mt-auto flex items-center gap-2 pt-5 text-xs font-semibold text-emerald-700">
            <ShieldCheck className="size-4" aria-hidden="true" />
            <span>{card.privacy}</span>
          </div>
        </div>
      </LiquidGlass>
    </article>
  );
}

function AwardPreviewWall({ content }: { content: PortfolioContent }) {
  const gallery = content.awardsGallery;
  const controls = useAwardWallControls(gallery.cards.length);

  return (
    <div className="col-span-full mt-12">
      <div className="flex items-end justify-between gap-6 max-lg:flex-col max-lg:items-start">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-normal text-blue-600">{content.sections.awards.label}</p>
          <h3 className="apple-display-text mt-4 text-[clamp(1.8rem,3.4vw,3.3rem)] leading-none text-neutral-900">{gallery.title}</h3>
          <p className="mt-5 text-base leading-8 text-neutral-600">{gallery.body}</p>
        </div>
        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-start">
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-600">
            <CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" />
            <span>
              {gallery.cards.length} {gallery.proofCountLabel}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              className="liquid-glow-button flex size-9 items-center justify-center rounded-full border border-white/80 bg-white/55 text-neutral-800 shadow-[inset_0_1px_1px_rgba(255,255,255,.95),0_12px_34px_rgba(46,61,82,.12)] backdrop-blur-[34px] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.05] active:scale-95 active:duration-150 disabled:cursor-not-allowed disabled:opacity-45 sm:size-11"
              type="button"
              onClick={() => controls.scrollByPage(-1)}
              disabled={!controls.canScrollPrev}
              aria-label={gallery.previousLabel}
            >
              <ArrowLeft className="size-4 sm:size-5" aria-hidden="true" />
            </button>
            <button
              className="liquid-glow-button flex size-9 items-center justify-center rounded-full border border-white/80 bg-white/55 text-neutral-800 shadow-[inset_0_1px_1px_rgba(255,255,255,.95),0_12px_34px_rgba(46,61,82,.12)] backdrop-blur-[34px] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.05] active:scale-95 active:duration-150 disabled:cursor-not-allowed disabled:opacity-45 sm:size-11"
              type="button"
              onClick={() => controls.scrollByPage(1)}
              disabled={!controls.canScrollNext}
              aria-label={gallery.nextLabel}
            >
              <ArrowRight className="size-4 sm:size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={controls.trackRef}
        className="award-preview-track -mx-8 -mb-12 mt-0 flex snap-x snap-mandatory gap-[18px] overflow-x-auto scroll-smooth px-8 pb-20 pt-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={controls.updateState}
      >
        {gallery.cards.map((card) => (
          <AwardPreviewCard key={card.id} card={card} yearLabel={gallery.yearLabel} categoryLabel={gallery.categoryLabel} />
        ))}
      </div>

      <div className="flex justify-center gap-2">
        {gallery.cards.map((card, index) => (
          <button
            key={card.id}
            type="button"
            aria-label={`${gallery.dotLabel} ${index + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              controls.activeIndex === index ? "w-8 bg-neutral-950" : "w-2.5 bg-neutral-950/20 hover:bg-neutral-950/40"
            }`}
            onClick={() => controls.scrollToIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

function AcademicTranscriptCard({
  transcript,
}: {
  transcript: PortfolioContent["academicTranscripts"]["cards"][number];
}) {
  const previewImage = publicAssetPath(transcript.previewImage);
  const downloadHref = publicAssetPath(transcript.downloadHref);

  return (
    <RevealArticle>
      <LiquidGlass className="h-full overflow-hidden p-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 md:p-5">
        <div className="relative z-[1] grid h-full grid-cols-[minmax(150px,.55fr)_minmax(0,1fr)] gap-5 max-sm:grid-cols-1">
          <a
            className="block overflow-hidden rounded-lg border border-white/75 bg-white/55 shadow-[inset_0_1px_1px_rgba(255,255,255,.92),0_16px_38px_rgba(46,61,82,.12)]"
            href={downloadHref}
            target="_blank"
            rel="noreferrer"
          >
            <img
              className="aspect-[595/842] h-full w-full object-cover object-top"
              src={previewImage}
              alt={transcript.previewAlt}
              loading="lazy"
            />
          </a>
          <div className="flex min-w-0 flex-col">
            <span className="flex size-10 items-center justify-center rounded-lg border border-white/65 bg-white/45 text-blue-600 shadow-[inset_0_1px_1px_rgba(255,255,255,.9)]">
              <FileText className="size-5" aria-hidden="true" />
            </span>
            <h3 className="apple-display-text mt-4 text-xl text-neutral-900">{transcript.title}</h3>
            <p className="mt-3 text-[0.95rem] leading-7 text-neutral-600">{transcript.body}</p>
            <div className="mt-auto flex flex-col gap-4 pt-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="size-4" aria-hidden="true" />
                <span>{transcript.privacy}</span>
              </div>
              <GlassButton asChild className="h-11 w-full text-neutral-950 sm:w-fit" glassColor="oklch(from var(--foreground) l c h / 5%)">
                <a href={downloadHref} download>
                  <span className="inline-flex items-center gap-2">
                    {transcript.downloadLabel}
                    <Download className="size-4" aria-hidden="true" />
                  </span>
                </a>
              </GlassButton>
            </div>
          </div>
        </div>
      </LiquidGlass>
    </RevealArticle>
  );
}

function AcademicTranscripts({ content }: { content: PortfolioContent }) {
  const transcripts = content.academicTranscripts;

  return (
    <div className="col-span-full mt-12">
      <div className="flex items-end justify-between gap-6 max-lg:flex-col max-lg:items-start">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-normal text-blue-600">{content.sections.education.label}</p>
          <h3 className="apple-display-text mt-4 text-[clamp(1.8rem,3.4vw,3.3rem)] leading-none text-neutral-900">{transcripts.title}</h3>
          <p className="mt-5 text-base leading-8 text-neutral-600">{transcripts.body}</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-600">
          <CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" />
          <span>
            {transcripts.cards.length} {transcripts.proofCountLabel}
          </span>
        </div>
      </div>
      <div className="mt-7 grid grid-cols-2 gap-4 max-lg:grid-cols-1">
        {transcripts.cards.map((transcript) => (
          <AcademicTranscriptCard key={transcript.id} transcript={transcript} />
        ))}
      </div>
    </div>
  );
}

function EducationAwards({ content, compactTop = false }: { content: PortfolioContent; compactTop?: boolean }) {
  return (
    <section
      id="education"
      className={`mx-auto grid w-[min(1180px,calc(100%-40px))] grid-cols-[.82fr_1.18fr] gap-20 pb-10 max-lg:grid-cols-1 max-sm:w-[calc(100%-28px)] max-sm:pb-8 ${
        compactTop ? "pt-20 max-sm:pt-16" : "pt-32 max-sm:pt-24"
      }`}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-normal text-blue-600">{content.sections.education.label}</p>
        <LiquidGlass className="mt-5">
          {content.education.map((item, index) => (
            <RevealArticle key={item.school} className={index > 0 ? "border-t border-white/50 p-7" : "p-7"} delay={index * 0.07}>
              <h3 className="apple-display-text text-lg text-neutral-900">{item.school}</h3>
              <p className="mt-2 text-sm leading-7 text-neutral-600">{item.detail}</p>
              <span className="text-sm leading-7 text-neutral-500">{item.meta}</span>
            </RevealArticle>
          ))}
        </LiquidGlass>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-normal text-blue-600">{content.sections.awards.label}</p>
        <LiquidGlass className="mt-5">
          <ul className="list-none">
            {content.awards.map((award, index) => (
              <RevealListItem key={award} className={index > 0 ? "border-t border-white/50 p-7" : "p-7"} delay={index * 0.06}>
                {award}
              </RevealListItem>
            ))}
          </ul>
        </LiquidGlass>
      </div>
      <AcademicTranscripts content={content} />
      <AwardPreviewWall content={content} />
    </section>
  );
}

function Interests({ content }: { content: PortfolioContent }) {
  return (
    <section id="interests" className="mx-auto w-[min(1180px,calc(100%-40px))] pt-24 lg:pr-20 max-sm:w-[calc(100%-28px)] max-sm:pt-20">
      <div className="grid grid-cols-[.82fr_1.18fr] gap-20 max-lg:grid-cols-1">
        <SectionHeading label={content.sections.interests.label} title={content.sections.interests.title} />
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          {content.interests.map((interest, index) => {
            const Icon = interestIcons[index % interestIcons.length];

            return (
              <RevealArticle key={interest.title} delay={index * 0.05}>
                <LiquidGlass className="h-full p-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 md:p-6">
                  <div className="relative z-[1] flex h-full flex-col gap-4">
                    <span className="flex size-10 items-center justify-center rounded-lg border border-white/65 bg-white/45 text-blue-600 shadow-[inset_0_1px_1px_rgba(255,255,255,.9)]">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="apple-display-text text-lg text-neutral-900">{interest.title}</h3>
                      <p className="mt-2 text-[0.95rem] leading-7 text-neutral-600">{interest.body}</p>
                    </div>
                  </div>
                </LiquidGlass>
              </RevealArticle>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ExperienceChapter({ content, copy }: { content: PortfolioContent; copy: Web2Copy }) {
  return (
    <>
      <PlacesSection copy={copy} id="experience" />
      <ExperienceDetails content={content} />
    </>
  );
}

function MainContent({ content, language }: { content: PortfolioContent; language: LanguageCode }) {
  const copy = web2ByLanguage[language];
  const finale = (
    <FinaleSection copy={copy} content={content} cvPdfPath={cvPdfPaths[language]} onBackToTop={() => scrollToPageSection("top")} />
  );

  if (language === "zh-CN") {
    return (
      <main>
        <Hero content={content} language={language} />
        <EducationAwards content={content} compactTop />
        <NumbersSection copy={copy} content={content} />
        <StrengthsSection copy={copy} />
        <DeskFilmSection copy={copy} />
        <Projects content={content} />
        <CaseStudies content={content} language={language} />
        <ExperienceChapter content={content} copy={copy} />
        <SkillsSection content={content} id="skills" />
        <StatementSection copy={copy} content={content} language={language} id="about" />
        <Interests content={content} />
        {finale}
      </main>
    );
  }

  return (
    <main>
      <Hero content={content} language={language} />
      <StatementSection copy={copy} content={content} language={language} id="about" />
      <NumbersSection copy={copy} content={content} />
      <StrengthsSection copy={copy} />
      <DeskFilmSection copy={copy} />
      <Projects content={content} />
      <CaseStudies content={content} language={language} />
      <ExperienceChapter content={content} copy={copy} />
      <SkillsSection content={content} id="skills" />
      <EducationAwards content={content} />
      <Interests content={content} />
      {finale}
    </main>
  );
}

export default function App() {
  const [language, setLanguage] = useState<LanguageCode>(getInitialLanguage);
  const [helloIntroComplete, setHelloIntroComplete] = useState(false);
  const content = portfolioByLanguage[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = content.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", content.meta.description);
  }, [content.meta.description, content.meta.title, language]);

  return (
    <>
      <BackgroundComponents />
      <DataCanvas />
      <HelloIntro onComplete={() => setHelloIntroComplete(true)} />
      <Header content={content} language={language} onLanguageChange={setLanguage} />
      <SectionNavigator language={language} />
      <PortfolioGuidedHints introComplete={helloIntroComplete} language={language} />
      <MainContent content={content} language={language} />
    </>
  );
}
