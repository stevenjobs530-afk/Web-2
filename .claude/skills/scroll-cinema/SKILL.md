---
name: scroll-cinema
description: Apply the site's "scroll cinema" motion — a project card that starts inset with rounded corners and opens to full-bleed as the visitor scrolls, with its copy rising in near the end (the Apple App Store style). Use when adding or restyling a project/feature block on the homepage, or when asked for the "expand to full screen on scroll", "Apple-style", or "scroll cinema" effect.
---

# Scroll cinema

This is not CSS scroll-snap. A tall scroll track holds a sticky full-screen
stage. As the track scrolls past, a `clip-path: inset(…)` on the frame shrinks
from 7% with a 36px radius to 0, so the card "opens" to fill the screen. The
copy fades and rises in over the last part of the scroll.

## Where it lives

- Component: `ScrollCinema` in `src/sections/Projects.tsx`. Every homepage project uses it:
  `RetailCinema`, `AppleCinema`, `ResearchCinema`, `VoyageCinema`.
- Styles: `.cinema`, `.cinema__sticky`, `.cinema__frame`, `.cinema__copy`, `.cinema__path`
  in `src/styles.css`, plus per-project modifiers (`.cinema--ledger`, `.cinema--research`,
  `.cinema--voyage`).

## Using it

```tsx
<ScrollCinema id="project-something" className="cinema--something">
  {({ copyStyle, fadeStyle, open }) => (
    <>
      {/* backdrop: <Film … className="cinema__video" /> or a coded scene */}
      <div className="cinema__shade" aria-hidden="true" />
      <motion.div className="cinema__copy" style={copyStyle}>…</motion.div>
      <motion.div className="cinema__path" style={fadeStyle}>…</motion.div>
    </>
  )}
</ScrollCinema>
```

- `copyStyle`: fade plus a 36px rise between 42% and 66% of the track. Use it for the main copy.
- `fadeStyle`: fade only. Use it for secondary layers (the path bar, side panels).
- `open`: becomes true at 40% of the track. Use it to start CSS transitions, as the
  retail ledger's dots do (`.ledger.is-open`).

## Timings (keep them consistent across projects)

| Track progress | What happens |
| --- | --- |
| 0 → 0.5 | inset 7% → 0, radius 36px → 0 |
| 0.4 | `open` becomes true |
| 0.42 → 0.66 | copy opacity 0 → 1, y 36px → 0 |

The track is `230vh` tall (`190vh` at ≤720px). The stage is `100svh`.

## Rules

- Keep the copy inside the stage height on a 390×844 phone. Clamp long bodies with
  `-webkit-line-clamp` at ≤720px instead of letting content run under the fold.
- Content near the top must clear the floating site nav (about 84px).
- `useReducedMotion()`: pass no motion styles and set `open` to true. `styles.css` also
  turns the sticky track into a plain block under `prefers-reduced-motion`.
- The frame's background colour must match the backdrop, so the inset edges don't flash
  white.
- Check it in a browser at 1440×900 and 390×844, partly open and fully open, before you ship.
