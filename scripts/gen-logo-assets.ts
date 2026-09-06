/**
 * Generates brand files from the single source of truth in components/brand/logo-paths.ts.
 * Wordmark text is converted to outlines with opentype.js so the SVGs never depend on fonts.
 *
 *   pnpm gen:logo
 */
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { setDefaultResultOrder } from "node:dns"
import path from "node:path"
import opentype from "opentype.js"
import sharp from "sharp"
import { BRAND, STREAMS, markSvg } from "../components/brand/logo-paths"

const OUT = path.resolve("public/logo")

const FONT_CACHE = path.resolve("assets/fonts")
// Node's happy-eyeballs can stall on IPv6 here; prefer IPv4.
setDefaultResultOrder("ipv4first")

/** Loads a cached TTF from assets/fonts (Plex is a "SOFTWORKS" subset from the Google CSS API; opentype.js cannot parse the full file). Falls back to the google/fonts repository. */
async function googleFont(repoPath: string): Promise<opentype.Font> {
  await mkdir(FONT_CACHE, { recursive: true })
  const cached = path.join(FONT_CACHE, path.basename(repoPath))
  let buf: Buffer
  if (existsSync(cached)) {
    buf = await readFile(cached)
  } else {
    const res = await fetch(`https://raw.githubusercontent.com/google/fonts/main/${repoPath}`, { signal: AbortSignal.timeout(30000) })
    if (!res.ok) throw new Error(`Font download failed: ${repoPath} → ${res.status}`)
    buf = Buffer.from(await res.arrayBuffer())
    await writeFile(cached, buf)
  }
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength))
}

function textPath(font: opentype.Font, text: string, x: number, y: number, size: number, tracking = 0): { d: string; width: number } {
  let cursor = x
  const parts: string[] = []
  const scale = size / font.unitsPerEm
  const glyphs = font.stringToGlyphs(text)
  for (let i = 0; i < glyphs.length; i++) {
    const g = glyphs[i]
    parts.push(g.getPath(cursor, y, size).toPathData(2))
    let adv = (g.advanceWidth ?? 0) * scale
    if (i < glyphs.length - 1) adv += font.getKerningValue(g, glyphs[i + 1]) * scale
    cursor += adv + tracking * size
  }
  return { d: parts.join(""), width: cursor - x }
}

async function main() {
  await mkdir(OUT, { recursive: true })

  // Marks
  const light = markSvg({ primary: STREAMS.light, foreground: BRAND.deep, background: BRAND.paper })
  const dark = markSvg({ primary: STREAMS.dark, foreground: "#E8EEF6", background: BRAND.deepDark })
  const mono = markSvg({ primary: "currentColor", foreground: "currentColor", port: false })
  const tiny = markSvg({ primary: STREAMS.light, foreground: BRAND.deep, port: false })
  await writeFile(path.join(OUT, "mark.svg"), light)
  await writeFile(path.join(OUT, "mark-dark.svg"), dark)
  await writeFile(path.join(OUT, "mark-mono.svg"), mono)
  await writeFile(path.join(OUT, "mark-16.svg"), tiny)

  // Raster marks (with a rounded paper/deep-water background so they work as avatars)
  const bgLight = markSvg({ primary: STREAMS.light, foreground: BRAND.deep, background: BRAND.paper, extra: `<rect width="32" height="32" rx="7" fill="${BRAND.paper}"/>` })
  await sharp(Buffer.from(bgLight)).resize(512, 512).png().toFile(path.join(OUT, "mark-512.png"))
  await sharp(Buffer.from(bgLight)).resize(180, 180).png().toFile(path.resolve("app/apple-icon.png"))

  // Lockups with outlined wordmark
  const serif = await googleFont("ofl/instrumentserif/InstrumentSerif-Regular.ttf")
  const plex = await googleFont("ofl/ibmplexsans/IBMPlexSans-Medium.ttf")
  const markSize = 64
  const gap = 18
  const nameSize = 50
  const subSize = 13.5
  const name = textPath(serif, "Sindhu", markSize + gap, 42, nameSize, -0.01)
  const sub = textPath(plex, "SOFTWORKS", markSize + gap + 1, 60, subSize, 0.18)
  const width = Math.ceil(markSize + gap + Math.max(name.width, sub.width) + 4)
  const height = 64

  const lockup = (primary: readonly [string, string, string], foreground: string, muted: string, background: string) => {
    const mark = markSvg({ primary, foreground, background }).replace(/<svg[^>]*>/, "").replace("</svg>", "")
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" fill="none" stroke-linecap="round" stroke-linejoin="round">
<g transform="scale(${markSize / 32})">${mark}</g>
<path d="${name.d}" fill="${foreground}"/>
<path d="${sub.d}" fill="${muted}"/>
</svg>`
  }
  await writeFile(path.join(OUT, "lockup-light.svg"), lockup(STREAMS.light, BRAND.deep, "#5B6678", BRAND.paper))
  await writeFile(path.join(OUT, "lockup-dark.svg"), lockup(STREAMS.dark, "#E8EEF6", "#8FA0B8", BRAND.deepDark))

  // Social card sized lockup PNGs
  const card = (bg: string, svg: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="${bg}"/><g transform="translate(${(1200 - width * 2.4) / 2} ${(630 - height * 2.4) / 2}) scale(2.4)">${svg.replace(/<svg[^>]*>/, "").replace("</svg>", "")}</g></svg>`
  await sharp(Buffer.from(card(BRAND.paper, lockup(STREAMS.light, BRAND.deep, "#5B6678", BRAND.paper)))).png().toFile(path.join(OUT, "lockup-1200x630-light.png"))
  await sharp(Buffer.from(card(BRAND.deepDark, lockup(STREAMS.dark, "#E8EEF6", "#8FA0B8", BRAND.deepDark)))).png().toFile(path.join(OUT, "lockup-1200x630-dark.png"))

  await writeFile(
    path.join(OUT, "README.md"),
    `# Sindhu Softworks brand files

Generated by \`pnpm gen:logo\` from \`components/brand/logo-paths.ts\`. Do not hand-edit.

| File | Use |
| --- | --- |
| mark.svg / mark-dark.svg | Confluence mark, two-tone, for light / dark backgrounds |
| mark-mono.svg | Single-colour mark; inherits \`currentColor\` |
| mark-16.svg | Favicon-size variant (no inner port dot) |
| mark-512.png | Avatar / app icon with paper background |
| lockup-light.svg / lockup-dark.svg | Horizontal lockup, wordmark outlined to paths |
| lockup-1200x630-*.png | Social card sized lockups |

Rules: clear space around the mark = one confluence-node diameter. Minimum mark size 16 px; minimum lockup width 120 px.
Colours: streams top to bottom River Teal #137A87 / #3FBBCB, Terracotta #C4603F / #E28B68, Ochre #B98A1F / #E0B44A (light / dark); channel and node Deep Water #0F1B2D on light, #E8EEF6 on dark; Paper #FAF8F3.
`,
  )
  console.log(`wrote brand files to ${OUT} (lockup ${width}×${height})`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
