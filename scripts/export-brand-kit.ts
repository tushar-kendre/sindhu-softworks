/**
 * Exports print- and screen-ready brand files OUTSIDE the repo for hoardings, letterheads, decks, social.
 *
 *   pnpm export:brand            → ~/Desktop/Sindhu Softworks Brand Kit
 *   pnpm export:brand /some/dir
 *
 * Outputs: svg/ (vector, any size), pdf/ (vector, for printers), png/ (4096px, transparent and on-background), README.md.
 * Fonts come from assets/fonts (text is outlined, so files never depend on installed fonts).
 */
import { execFileSync } from "node:child_process"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import opentype from "opentype.js"
import sharp from "sharp"
import { BRAND, STREAMS, markSvg } from "../components/brand/logo-paths"

const OUT = path.resolve(process.argv[2] ?? path.join(os.homedir(), "Desktop", "Sindhu Softworks Brand Kit"))
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const PAPER = BRAND.paper
const DEEP = BRAND.deepDark
const INK = BRAND.deep
const SNOW = "#E8EEF6"
const MUTED_LIGHT = "#5B6678"
const MUTED_DARK = "#8FA0B8"

async function loadFont(file: string) {
  const buf = await readFile(path.resolve("assets/fonts", file))
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength))
}
function textPath(font: opentype.Font, text: string, x: number, y: number, size: number, tracking = 0) {
  let cursor = x
  const parts: string[] = []
  const scale = size / font.unitsPerEm
  const glyphs = font.stringToGlyphs(text)
  for (let i = 0; i < glyphs.length; i++) {
    const g = glyphs[i]
    parts.push(g.getPath(cursor, y, size).toPathData(3))
    let adv = (g.advanceWidth ?? 0) * scale
    if (i < glyphs.length - 1) adv += font.getKerningValue(g, glyphs[i + 1]) * scale
    cursor += adv + tracking * size
  }
  return { d: parts.join(""), width: cursor - x }
}
const inner = (svg: string) => svg.replace(/<svg[^>]*>/, "").replace("</svg>", "")
const wrap = (w: number, h: number, body: string, bg?: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none" stroke-linecap="round" stroke-linejoin="round">${bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : ""}${body}</svg>`

type Variant = { name: string; svg: string; w: number; h: number; bg?: string; note: string }

async function main() {
  const serif = await loadFont("InstrumentSerif-Regular.ttf")
  const plex = await loadFont("IBMPlexSans-Medium.ttf")
  for (const d of ["svg", "pdf", "png"]) await mkdir(path.join(OUT, d), { recursive: true })

  const variants: Variant[] = []
  // ---- marks (32-unit geometry, exported at 512 units for crisp vector paths)
  const markPart = (streams: readonly [string, string, string] | string, fg: string, bg?: string) => `<g transform="scale(16)">${inner(markSvg({ primary: streams, foreground: fg, background: bg, port: true }))}</g>`
  variants.push({ name: "mark-color-on-light", svg: wrap(512, 512, markPart(STREAMS.light, INK, PAPER)), w: 512, h: 512, note: "Primary mark for light backgrounds" })
  variants.push({ name: "mark-color-on-dark", svg: wrap(512, 512, markPart(STREAMS.dark, SNOW, DEEP)), w: 512, h: 512, bg: DEEP, note: "Primary mark for dark backgrounds" })
  variants.push({ name: "mark-mono-ink", svg: wrap(512, 512, markPart(INK, INK, PAPER)), w: 512, h: 512, note: "Single-colour mark, ink (for one-colour print, embossing, engraving)" })
  variants.push({ name: "mark-mono-white", svg: wrap(512, 512, markPart("#FFFFFF", "#FFFFFF", DEEP)), w: 512, h: 512, bg: DEEP, note: "Single-colour mark, white (reverse on photos, dark hoardings)" })
  variants.push({ name: "mark-mono-teal", svg: wrap(512, 512, markPart(BRAND.teal, BRAND.teal, PAPER)), w: 512, h: 512, note: "Single-colour mark in River Teal" })

  // ---- horizontal lockups
  const lockupH = (streams: readonly [string, string, string], fg: string, muted: string, bg?: string) => {
    const markSize = 256, gap = 72, nameSize = 200, subSize = 54
    const name = textPath(serif, "Sindhu", markSize + gap, 168, nameSize, -0.01)
    const sub = textPath(plex, "SOFTWORKS", markSize + gap + 4, 240, subSize, 0.18)
    const w = Math.ceil(markSize + gap + Math.max(name.width, sub.width) + 8)
    const h = 256
    const body = `<g transform="scale(${markSize / 32})">${inner(markSvg({ primary: streams, foreground: fg, background: bg, port: true }))}</g><path d="${name.d}" fill="${fg}"/><path d="${sub.d}" fill="${muted}"/>`
    return { svg: wrap(w, h, body), w, h }
  }
  const hL = lockupH(STREAMS.light, INK, MUTED_LIGHT, PAPER)
  const hD = lockupH(STREAMS.dark, SNOW, MUTED_DARK, DEEP)
  variants.push({ name: "lockup-horizontal-light", ...hL, note: "Horizontal lockup for light backgrounds (letterhead, website, documents)" })
  variants.push({ name: "lockup-horizontal-dark", ...hD, bg: DEEP, note: "Horizontal lockup for dark backgrounds" })

  // ---- stacked lockups (mark centred above wordmark)
  const lockupS = (streams: readonly [string, string, string], fg: string, muted: string, bg?: string) => {
    const markSize = 320, nameSize = 220, subSize = 60
    const name = textPath(serif, "Sindhu", 0, 0, nameSize, -0.01)
    const sub = textPath(plex, "SOFTWORKS", 0, 0, subSize, 0.18)
    const w = Math.ceil(Math.max(name.width, sub.width, markSize) + 80)
    const h = markSize + 60 + nameSize + 30 + subSize + 40
    const cx = w / 2
    const body =
      `<g transform="translate(${cx - markSize / 2} 0) scale(${markSize / 32})">${inner(markSvg({ primary: streams, foreground: fg, background: bg, port: true }))}</g>` +
      `<path transform="translate(${cx - name.width / 2} ${markSize + 60 + nameSize * 0.72})" d="${name.d}" fill="${fg}"/>` +
      `<path transform="translate(${cx - sub.width / 2} ${markSize + 60 + nameSize + 30 + subSize * 0.75})" d="${sub.d}" fill="${muted}"/>`
    return { svg: wrap(w, h, body), w, h }
  }
  const sL = lockupS(STREAMS.light, INK, MUTED_LIGHT, PAPER)
  const sD = lockupS(STREAMS.dark, SNOW, MUTED_DARK, DEEP)
  variants.push({ name: "lockup-stacked-light", ...sL, note: "Stacked lockup for light backgrounds (hoardings, signage, square placements)" })
  variants.push({ name: "lockup-stacked-dark", ...sD, bg: DEEP, note: "Stacked lockup for dark backgrounds" })

  // ---- wordmark only
  const wordmark = (fg: string, muted: string) => {
    const name = textPath(serif, "Sindhu", 0, 168, 200, -0.01)
    const sub = textPath(plex, "SOFTWORKS", 4, 240, 54, 0.18)
    const w = Math.ceil(Math.max(name.width, sub.width) + 8)
    return { svg: wrap(w, 256, `<path d="${name.d}" fill="${fg}"/><path d="${sub.d}" fill="${muted}"/>`), w, h: 256 }
  }
  variants.push({ name: "wordmark-light", ...wordmark(INK, MUTED_LIGHT), note: "Wordmark only, ink" })
  variants.push({ name: "wordmark-dark", ...wordmark(SNOW, MUTED_DARK), bg: DEEP, note: "Wordmark only, reversed" })

  // ---- write files
  const rows: string[] = []
  for (const v of variants) {
    await writeFile(path.join(OUT, "svg", `${v.name}.svg`), v.svg)
    // PNG: transparent, longest side 4096
    const scale = 4096 / Math.max(v.w, v.h)
    await sharp(Buffer.from(v.svg), { density: 72 * scale }).resize({ width: Math.round(v.w * scale) }).png().toFile(path.join(OUT, "png", `${v.name}-4096-transparent.png`))
    // PNG on its intended background (with generous clear space)
    const pad = Math.round(Math.max(v.w, v.h) * 0.12)
    const withBg = wrap(v.w + pad * 2, v.h + pad * 2, `<g transform="translate(${pad} ${pad})">${inner(v.svg)}</g>`, v.bg ?? PAPER)
    await sharp(Buffer.from(withBg), { density: 72 * scale }).resize({ width: Math.round((v.w + pad * 2) * scale) }).png().toFile(path.join(OUT, "png", `${v.name}-4096-on-background.png`))
    // PDF (vector) via Chrome print
    const html = `<!doctype html><html><head><style>@page{size:${v.w}px ${v.h}px;margin:0}html,body{margin:0;padding:0}svg{display:block}</style></head><body>${v.svg}</body></html>`
    const tmp = path.join(os.tmpdir(), `brand-${v.name}.html`)
    await writeFile(tmp, html)
    execFileSync(CHROME, ["--headless=new", "--no-sandbox", "--disable-gpu", "--no-pdf-header-footer", `--print-to-pdf=${path.join(OUT, "pdf", `${v.name}.pdf`)}`, `file://${tmp}`], { stdio: "ignore" })
    rows.push(`| ${v.name} | ${v.note} |`)
  }
  // Avatars and favicons
  for (const px of [1024, 512, 192, 64]) {
    const src = wrap(32, 32, `<rect width="32" height="32" rx="7" fill="${PAPER}"/>${inner(markSvg({ primary: STREAMS.light, foreground: INK, background: PAPER, port: px >= 192 }))}`)
    await sharp(Buffer.from(src), { density: 72 * (px / 32) }).resize(px, px).png().toFile(path.join(OUT, "png", `avatar-${px}.png`))
  }

  const hexToCmyk = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255
    const k = 1 - Math.max(r, g, b)
    if (k === 1) return "0 0 0 100"
    const f = (c: number) => Math.round(((1 - c - k) / (1 - k)) * 100)
    return `${f(r)} ${f(g)} ${f(b)} ${Math.round(k * 100)}`
  }
  const colours = [
    ["River Teal", BRAND.teal, "stream 1, links, keys"],
    ["Terracotta", BRAND.terracotta, "stream 2, accent"],
    ["Ochre", BRAND.ochre, "stream 3 (logo only)"],
    ["Deep Water (ink)", BRAND.deep, "channel, node, text on light"],
    ["Paper", BRAND.paper, "light background"],
    ["Deep Water (dark bg)", BRAND.deepDark, "dark background"],
  ] as const
  const readme = `# Sindhu Softworks brand kit

Generated ${new Date().toISOString().slice(0, 10)} from the website repository (\`pnpm export:brand\`). Regenerate rather than hand-edit.

## Which file to use

| Use | Folder | Notes |
| --- | --- | --- |
| Hoardings, signage, vehicle graphics, large print | \`pdf/\` or \`svg/\` | Vector; scales to any size with no loss. Give the printer the PDF. |
| Letterhead, invoices, proposals, Word/Google Docs | \`png/*-4096-transparent.png\` or \`pdf/\` | Transparent PNG sits on any paper colour. |
| Slides, social posts, video | \`png/\` | On-background versions already include clear space. |
| Profile pictures, app icons | \`png/avatar-*.png\` | Square, paper background, rounded corners. |
| Website, email signatures | \`svg/\` | Smallest files, crisp on every screen. |

Choose the *-light files on white/paper backgrounds and the *-dark files on navy/black. Use mono-ink for one-colour print (stamps, embossing, engraving) and mono-white on photographs or dark hoardings.

## Variants

| File | Purpose |
| --- | --- |
${rows.join("\n")}

## Colours

| Name | HEX | RGB | CMYK (approx.) | Used for |
| --- | --- | --- | --- | --- |
${colours.map(([n, h, u]) => `| ${n} | ${h} | ${parseInt(h.slice(1, 3), 16)} ${parseInt(h.slice(3, 5), 16)} ${parseInt(h.slice(5, 7), 16)} | ${hexToCmyk(h)} | ${u} |`).join("\n")}

CMYK values are a mathematical conversion. For offset or large-format print, ask the printer to match the HEX/RGB on a proof, or to convert with their press profile.

## Rules

- Clear space around the mark: at least the diameter of the confluence node (the large dot) on every side.
- Minimum sizes: mark 16 px / 6 mm; horizontal lockup 120 px / 30 mm wide; stacked lockup 80 px / 25 mm wide.
- Do not recolour the streams, change their order, rotate the mark, add outlines or shadows, or set the wordmark in another typeface.
- Typefaces: Instrument Serif (wordmark, headings), IBM Plex Sans (text), IBM Plex Mono (codes, references). Both are free from Google Fonts.
`
  await writeFile(path.join(OUT, "README.md"), readme)
  console.log(`brand kit written to ${OUT}: ${variants.length} variants × svg/pdf/png`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
