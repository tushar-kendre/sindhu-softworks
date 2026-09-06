import { readFile } from "node:fs/promises"
import path from "node:path"
import { ImageResponse } from "next/og"
import { BRAND, STREAMS, markSvg } from "@/components/brand/logo-paths"
import { hero } from "@/content/hero"
import { site } from "@/content/site"

export const alt = `${site.name} — ${site.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/** Fonts are read from the repo so the card renders identically offline and on Vercel. */
async function font(file: string) {
  return readFile(path.join(process.cwd(), "assets", "fonts", file))
}

export default async function OpenGraphImage() {
  const [serif, sans] = await Promise.all([font("InstrumentSerif-Regular-full.ttf"), font("IBMPlexSans-Regular-full.ttf")])
  const mark = markSvg({ primary: STREAMS.dark, foreground: "#E8EEF6", background: BRAND.deepDark, size: 96 })
  const markUrl = `data:image/svg+xml;base64,${Buffer.from(mark).toString("base64")}`

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: `linear-gradient(135deg, ${BRAND.deepDark} 0%, #101B2D 60%, #0E2A33 100%)`,
          color: "#E8EEF6",
          fontFamily: "Plex",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <img src={markUrl} width={96} height={96} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Instrument", fontSize: 56, lineHeight: 1 }}>Sindhu</div>
            <div style={{ fontSize: 22, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8FA0B8", marginTop: 8 }}>Softworks</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontFamily: "Instrument", fontSize: 72, lineHeight: 1.05, maxWidth: 1000 }}>{hero.headline}</div>
          <div style={{ fontSize: 28, lineHeight: 1.35, color: "#B8C4D6", maxWidth: 1000 }}>
            Rule engines, compliance platforms and AI evaluation tooling. Founder-led engineering from India for teams in the US and India.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Instrument", data: serif, weight: 400, style: "normal" },
        { name: "Plex", data: sans, weight: 400, style: "normal" },
      ],
    },
  )
}
