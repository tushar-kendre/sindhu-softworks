/** Confluence mark geometry. viewBox 0 0 32 32. Shared by the React component, the favicon and the export script. */
export const MARK_VIEWBOX = "0 0 32 32"
export const TRIBUTARIES = ["M5 8 C12 8 13 16 19 16", "M5 16 C10 16 14 16 19 16", "M5 24 C12 24 13 16 19 16"]
export const CHANNEL = "M19 16 H28"
export const SOURCES = [
  { cx: 5, cy: 8 },
  { cx: 5, cy: 16 },
  { cx: 5, cy: 24 },
]
export const CONFLUENCE = { cx: 19, cy: 16, r: 3.4, port: 1.3 }
export const STROKE = { tributary: 2.25, channel: 3.5, source: 2 }

export const BRAND = {
  teal: "#137A87",
  tealDark: "#3FBBCB",
  deep: "#0F1B2D",
  deepDark: "#0A1220",
  paper: "#FAF8F3",
  terracotta: "#C4603F",
  terracottaDark: "#E28B68",
  ochre: "#B98A1F",
  ochreDark: "#E0B44A",
} as const

/** The three streams, top to bottom: teal, terracotta, ochre. The channel and node stay neutral. */
export const STREAMS = {
  light: [BRAND.teal, BRAND.terracotta, BRAND.ochre] as const,
  dark: [BRAND.tealDark, BRAND.terracottaDark, BRAND.ochreDark] as const,
}

/**
 * Standalone SVG string for files (favicon, exports). `port` draws the inner dot; omit below 24px.
 * `primary`/`foreground` are colours; pass "currentColor" for a mono mark.
 */
export function markSvg(opts: {
  /** one colour for all streams, or one per stream (top, middle, bottom) */
  primary: string | readonly [string, string, string]
  foreground: string
  background?: string
  port?: boolean
  size?: number
  extra?: string
}): string {
  const { primary, foreground, background, port = true, size, extra = "" } = opts
  const colours = typeof primary === "string" ? [primary, primary, primary] : primary
  const dim = size ? ` width="${size}" height="${size}"` : ""
  const trib = TRIBUTARIES.map((d, i) => `<path d="${d}" stroke="${colours[i]}" stroke-width="${STROKE.tributary}"/>`).join("")
  const src = SOURCES.map((s, i) => `<circle cx="${s.cx}" cy="${s.cy}" r="${STROKE.source}" fill="${colours[i]}"/>`).join("")
  const portDot = port && background ? `<circle cx="${CONFLUENCE.cx}" cy="${CONFLUENCE.cy}" r="${CONFLUENCE.port}" fill="${background}"/>` : ""
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEWBOX}"${dim} fill="none" stroke-linecap="round" stroke-linejoin="round">${extra}${trib}<path d="${CHANNEL}" stroke="${foreground}" stroke-width="${STROKE.channel}"/>${src}<circle cx="${CONFLUENCE.cx}" cy="${CONFLUENCE.cy}" r="${CONFLUENCE.r}" fill="${foreground}"/>${portDot}</svg>`
}
