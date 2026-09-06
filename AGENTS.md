# Agent guide

1. Read `DESIGN.md` before writing any UI. It overrides your defaults.
2. Component library: Once UI (`@once-ui-system/core`). Bootstrap with `node_modules/@once-ui-system/core/ai/manifest.json`, then `ai/rules.compact.md` and `ai/catalog.json`. Fetch component slices from `ai/components/*.json` on demand.
3. Copy lives in `content/` and is zod-validated (`pnpm test`). Components never hardcode text.
4. The rules engine (`lib/rules/`) is dependency-free and unit-tested. The playground (`components/signature/`) renders it with React Flow; keep node styling in `components/signature/playground.module.scss` on Once UI tokens.
5. Verify with `pnpm typecheck && pnpm lint && pnpm test && pnpm build`. UI changes are checked against a production build with headless Chrome (see `scripts/`).
