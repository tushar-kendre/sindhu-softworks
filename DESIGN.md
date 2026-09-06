# Sindhu Softworks — visual design system

Do not invent visual styles. This file, `resources/once-ui.config.ts` and `resources/custom.css` are the design system. Once UI is the component library; its agent rules live in `node_modules/@once-ui-system/core/ai/rules.compact.md` and apply here in full.

## Character

**Scientific / technical.** The site should read like a well-made instrument: calm, exact, legible at a glance, with a small number of precise accents. Typography and rules carry the hierarchy. Decoration is texture, not spectacle.

Reference feelings: a lab notebook, a spec sheet, a flight-deck readout. Not a SaaS landing page.

## Forbidden

- Inter, Geist, or any generic grotesque. Fonts are fixed: Instrument Serif (display/headings), IBM Plex Sans (body, labels), IBM Plex Mono (code, keys, readouts).
- `strong` weight on display or heading variants. Instrument Serif has one weight; bold is synthesised and ugly. Use `display-default-*` and `heading-default-*`.
- Rounded cards for everything. Static content sits on dividers and whitespace; `Card` is for interactive items only.
- Icons inside rounded squares, gradient blobs, glassmorphism, glow-on-everything.
- Centered giant hero + subtitle + two buttons. The hero is left-aligned, two-column, with the live instrument beside the copy.
- Three-column feature grids by default. Prefer numbered lists, two-column spec layouts, and tables.
- Tailwind, shadcn, Radix, Lucide. They were removed on purpose.
- Hex or rgb colours in components. Use Once UI tokens (`brand-*`, `neutral-*`, `success-*`, `warning-*`, `danger-*`).

## Geometry

- Border style: `conservative` (set globally). Controls ~0.25rem, containers ~0.5rem. Never override radius per component.
- Rules: thin, high contrast. `Line` between sections and rows. Use `border="neutral-alpha-medium"` for panels that need an edge.
- Density: comfortable, not airy. Section gap `104`, inner gaps `16`–`32`.
- Content width follows content: prose `maxWidth={40}` (rem), page columns `maxWidth="xl"` (1440px) with `paddingX="32"` (`20` on s), the playground full width of the page column.

## Typography

| Role | Variant | Notes |
| --- | --- | --- |
| Page title | `display-default-l` (`m` on s) | Serif, one line if possible |
| Section title | `display-default-xs` | Serif |
| Sub-heading | `heading-default-m` | Serif |
| Body | `body-default-m` / `body-default-l` | Plex Sans |
| Eyebrow / key | `label-default-s`, uppercase, `letterSpacing` via `.eyebrow` class | Plex Sans |
| Readout / numbers | `code-default-*` or `display-default-*` with `tabular-nums` | Plex Mono for keys and values |

Section numbering: every major section carries a mono index (`01`, `02` …) in its eyebrow.

## Colour

- Brand: River Teal (custom scale, `--scheme-brand-*`). Used for keys, links, the active state, pass states.
- Accent: Terracotta (custom scale, `--scheme-accent-*`). Used sparingly: one CTA emphasis, edited values, the single highlighted element.
- Neutral: `slate`.
- Semantic states in the playground: `success` / `danger` / `warning` tokens. Never the brand colour for pass/fail.
- One accent family per section. Decoration uses `brand-*` or `neutral-*` only.

## Layout patterns

- Page skeleton: `Column as="main" fillWidth horizontal="center"` → `Column maxWidth="xl" paddingX="32"` → sections separated by `Line`.
- Spec sheet: two-column rows `Row` with a mono key on the left (`label-default-s`, `onBackground="neutral-weak"`) and the value on the right. Used for proof stats, engagement details, the legal block.
- Asymmetry: prefer `Grid columns="5"`-style splits (2/3, 3/5) over equal halves.

## Decoration budget

- Hero: one ambient `Background` with `grid` texture (graph-paper) and a faint brand gradient. Nothing else on the page glows.
- Motion: `transition: micro`. `RevealFx` once, for the proof readouts. `CountFx` on numbers. No continuous motion.
- The playground is the only expressive element. It may animate on interaction (ripple, decision pop), never idly.

## Voice (copy)

- Plain, specific, declarative. Short sentences. No exclamation marks, no "passionate", no "cutting-edge", no "seamless".
- Company in third person ("Sindhu Softworks builds…"); the founder by name.
- Numbers are exact or explicitly rounded. Claims name their source.
- Labels are nouns, not slogans: "Track record", not "Why us".
