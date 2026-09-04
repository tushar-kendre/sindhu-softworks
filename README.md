# Sindhu Softworks — company website

Next.js 16 · React 19 · Tailwind 3.4 · shadcn/ui · React Flow · Resend.

```bash
pnpm install
cp .env.example .env.local   # fill in Resend + site URL
pnpm dev                     # http://localhost:3000
pnpm test                    # rules engine + content schema tests
pnpm build                   # strict TS + lint enforced
```

- All copy lives in `content/` (zod-validated). Components never hardcode text.
- `lib/rules/engine.ts` is the pure evaluator behind the hero playground.
- `components/signature/rules-playground-static.tsx` renders the no-JS SVG fallback from the same content and engine as the live graph, so the two cannot drift.
- `scripts/gen-logo-assets.ts` writes `public/logo/*` and `app/icon.svg` from `components/brand/logo-paths.ts`.
