# Sindhu Softworks — company website

Next.js 16 · React 19 · Once UI · React Flow. No back end: the contact form opens the visitor's mail app. Design rules live in `DESIGN.md`; agents start at `AGENTS.md`.

```bash
pnpm install
cp .env.example .env.local   # site URL
pnpm dev                     # http://localhost:3000
pnpm test                    # rules engine + content schema tests
pnpm build                   # strict TS + lint enforced
```

- All copy lives in `content/` (zod-validated). Components never hardcode text.
- Design configuration is one file: `resources/once-ui.config.ts` (fonts, style) plus `resources/custom.css` (brand and accent scales, overrides).
- `lib/rules/engine.ts` is the pure evaluator behind the hero playground.
- `components/signature/rules-playground-static.tsx` renders the no-JS SVG fallback from the same content and engine as the live graph, so the two cannot drift.
- `scripts/gen-logo-assets.ts` writes `public/logo/*` and `app/icon.svg` from `components/brand/logo-paths.ts`.

## Deploy (Vercel)

1. Push this repo to GitHub and import it in Vercel (framework auto-detects Next.js).
2. Set `NEXT_PUBLIC_SITE_URL` for Production and Preview.
3. Add the custom domain in Vercel and point DNS at it.
5. Fill in the legal block in `content/site.ts` (registered address, GSTIN/Udyam). `pnpm test` validates the content shape.

## Before launch checklist

- [ ] `content/site.ts`: legal name, registered address, GSTIN / Udyam, contact email
- [ ] `public/headshot.jpg`: real headshot (square-croppable, ≥ 1200 px)
- [ ] Copy sign-off on hero, playground caption and case-study numbers in `content/`
- [ ] `NEXT_PUBLIC_SITE_URL` set to the production origin (canonical URLs, OG image, sitemap)
