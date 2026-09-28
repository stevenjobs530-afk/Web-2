# Web 2 — Zishun Gao

A from-scratch, Apple-inspired rebuild of [Zishun Gao's personal website](https://stevenjobs530-afk.github.io/Zishun-Gao-Personal-Website/?lang=en). It keeps the same content, and the same English/Chinese switch, as the live site. The layout, motion and visual system are new.

Private while in progress. The earlier experiment built on the old portfolio lives on the `v1-portfolio-based` branch.

## Run it

```bash
npm install
npm run dev        # http://127.0.0.1:5173/Web-2/
npm run build      # static output in dist/
```

Add `?lang=zh` to the URL to open the Chinese version.

## Design direction

- **Apple-like pacing.** Each section is a chapter with one idea, lots of air and one strong visual. Light chapters hand over to dark ones through long gradients, never hard cuts.
- **Type.** Inter for everything readable. An Instrument Serif italic accent inside headlines ("Education, *academic record*"). IBM Plex Mono for small labels. Chinese keeps a light sans instead of the italic, and wraps only at punctuation.
- **Motion.** Blurred fade-ups on entry, scroll-linked films and one sticky story. Everything eases on `cubic-bezier(0.22, 1, 0.36, 1)`, and everything calms down under `prefers-reduced-motion`.

## Page, chapter by chapter

| # | Section | Visual reference | What happens |
|---|---|---|---|
| — | **Hero** | *Motion Hero 1* (VertexAI) | Concrete-and-grass film behind a frosted nav pill. A centred headline mixes sans and serif italic, with a white CTA. The intro sits bottom-left, and the CV, Explore and pause controls bottom-right. The film slowly zooms and the text drifts away on scroll. |
| 01 | **Education** | Apple bento | The 87.36 weighted average counts up in a gradient. Selected grades are shown as thin progress rules. A dark tile marks the current MSc at Bristol. |
| 02 | **Honours** | — | A centred shelf: the middle certificate is in focus, the edges fade and blur, and it can be dragged, swiped or stepped with arrows and dots. Opening the focused card gives a full-screen view. |
| 03 | **Projects** | *Motion (We can set in the Final)* | UK retail as a bright product panel. **Apple App Store** gets the boy-at-the-window film: it starts inset and opens to full bleed as you scroll, with Prime-Intellect-style copy and a terminal-style metric. The research project sits beside the desk-under-the-stars film. The training app is a full-width card over the ship film, with its build pipeline on a glass panel. Each project has a large, clearly clickable call to action. |
| 04 | **AI workflow** | *猎鹰* (falcon) | A split card: the diving-falcon film with "From signal to action" on the left, and the four workflow steps laid out like a clean form on the right. |
| 05 | **Method** | Apple sticky story | Dark chapter. A pinned ring and number (01–05) advance as each step scrolls past. |
| 06 | **Experience** | — | Two role cards with large gradient metrics and three columns of detail. |
| — | **Three time zones** | *Global Hubs* | The Paris, London and New York landmark cards, as-is. On hover (or tap) a frosted panel shows Zishun's usual UK working hours converted to that city's local time, plus a live clock. |
| 07 | **Contact** | — | The page fades into the flowers film. A big "Stay *in touch*", three glass contact cards, and the footer. |

## Chinese typesetting rules

Chinese headings follow three rules, applied to the copy by `npm run phrase:zh` (run it after editing any Chinese text):

1. **Break only between phrases.** Google's BudouX marks phrase boundaries with invisible break points. Headings use `word-break: keep-all`, so a word like 分析 is never split across lines.
2. **No punctuation at the end of a heading line.** In heading-length strings, ， 、 ： ； are glued to the phrase that follows. Headings that need two lines use an explicit line break instead of a comma. `text-spacing-trim` removes the blank half of full-width punctuation, so centred lines stay optically centred.
3. **No single-character lines.** One-character fragments are joined to their neighbour.

Tone: Chinese copy states what was done and what was learned, without slogans.

## Device coverage

Checked for horizontal overflow and hero collisions at 320×568 (iPhone SE 1st gen / small Android), 360×640 and 360×740 (Android), 375×667 (iPhone SE), 390×844 (iPhone 15), 412×915 (Pixel / Galaxy), 430×932 (Pro Max), 768 (tablet) and desktop, in both languages. On phones the hero flows with its content rather than pinning, so short screens never overlap. Heights use `svh`, so mobile browser toolbars don't cut content.

## Content and media

- Copy: `src/data/content.ts`, carried over from the live site in English and Chinese. New lines written for Web 2: the hero accent, the falcon panel and the time-zone section.
- Local media in `public/`: the hero, Apple, research and contact films, certificates, CVs and project images, all copied from the live site's repository.
- **Hotlinked third-party media**: the falcon film and the three city images come from the design-gallery CDN, as chosen for this draft. Replace them with self-hosted, licensed files before making the site public.
- **Detail pages live inside Web 2.** The four case studies and the personal-training page are ported from the live site into `src/legacy/`, and each gets its own page under `case-studies/…` and `personal-projects/…`. Their "Back to Portfolio" links return to the matching card in Web 2, in the same language. `next/image` is replaced by a small shim (`src/shims/next-image.tsx`).
