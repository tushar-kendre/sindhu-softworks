import { IBM_Plex_Mono, IBM_Plex_Sans, Instrument_Serif } from "next/font/google"

/**
 * Single source of design configuration. See DESIGN.md before changing anything here.
 * Instrument Serif ships one weight, so headings always use `default` weight variants.
 */
const heading = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], variable: "--font-heading", display: "swap" })
const body = IBM_Plex_Sans({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--font-body", display: "swap" })
const label = IBM_Plex_Sans({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--font-label", display: "swap" })
const code = IBM_Plex_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-code", display: "swap" })

export const fonts = { heading, body, label, code }

export const style = {
  theme: "system", // dark | light | system
  neutral: "slate", // cool neutral, close to the Deep Water navy of the mark
  brand: "custom", // River Teal scale, defined in resources/custom.css
  accent: "custom", // Terracotta scale, defined in resources/custom.css
  solid: "contrast",
  solidStyle: "flat",
  border: "conservative", // small radii: instrument-panel geometry
  surface: "filled",
  transition: "micro",
  scaling: "100",
} as const

export const dataStyle = {
  variant: "flat",
  mode: "categorical",
  height: 24,
  axis: { stroke: "var(--neutral-alpha-weak)" },
  tick: { fill: "var(--neutral-on-background-weak)", fontSize: 11, line: false },
} as const
