import { ImageResponse } from "next/og"
import { BRAND, markSvg } from "@/components/brand/logo-paths"
import { site } from "@/content/site"

export const alt = `${site.name} — ${site.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

async function googleFont(family: string, weight: number, text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`, {
        headers: { "User-Agent": "curl/8" },
      })
    ).text()
    const m = css.match(/src:\s*url\(([^)]+)\)/)
    if (!m) return null
    const res = await fetch(m[1])
    return res.ok ? await res.arrayBuffer() : null
  } catch {
    return null
  }
}

export default async function OpenGraphImage() {
  const headline = site.tagline
  const [fraunces, plex] = await Promise.all([
    googleFont("Fraunces", 600, `Sindhu${headline}`),
    googleFont("IBM Plex Sans", 500, "SOFTWORKS" + site.description),
  ])
  const fonts = [
    fraunces ? { name: "Fraunces", data: fraunces, weight: 600 as const, style: "normal" as const } : null,
    plex ? { name: "IBM Plex Sans", data: plex, weight: 500 as const, style: "normal" as const } : null,
  ].filter((f): f is NonNullable<typeof f> => f !== null)

  const mark = markSvg({ primary: BRAND.tealDark, foreground: "#E8EEF6", background: BRAND.deepDark, size: 96 })
  const markUrl = `data:image/svg+xml;utf8,${encodeURIComponent(mark)}`

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: `linear-gradient(135deg, ${BRAND.deepDark} 0%, #101B2D 60%, #0E2A33 100%)`,
          color: "#E8EEF6",
          fontFamily: "IBM Plex Sans, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <img src={markUrl} width={96} height={96} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "Fraunces, serif", fontSize: 56, fontWeight: 600, lineHeight: 1 }}>Sindhu</span>
            <span style={{ fontSize: 22, letterSpacing: 6, color: "#8FA0B8", marginTop: 6 }}>SOFTWORKS</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 72, fontWeight: 600, lineHeight: 1.05, letterSpacing: -1 }}>{headline}</div>
          <div style={{ fontSize: 28, color: "#8FA0B8", lineHeight: 1.4, maxWidth: 980 }}>
            Rules engines, compliance platforms and AI evaluation tooling. Founder-led engineering from India for teams in the US and India.
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  )
}
