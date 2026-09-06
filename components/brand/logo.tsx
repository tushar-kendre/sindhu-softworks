import { CHANNEL, CONFLUENCE, MARK_VIEWBOX, SOURCES, STROKE, TRIBUTARIES } from "./logo-paths"

type MarkProps = {
  size?: number
  /** "color": teal / terracotta / ochre streams (theme-aware); "mono": everything in currentColor */
  tone?: "mono" | "color"
  port?: boolean
  title?: string
  style?: React.CSSProperties
}

const STREAM_VARS = ["var(--logo-stream-1)", "var(--logo-stream-2)", "var(--logo-stream-3)"] as const

export function LogoMark({ size = 32, tone = "color", port = true, title, style }: MarkProps) {
  const colour = (i: number) => (tone === "color" ? STREAM_VARS[i] : "currentColor")
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      width={size}
      height={size}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      style={{ flexShrink: 0, ...style }}
    >
      {title ? <title>{title}</title> : null}
      {TRIBUTARIES.map((d, i) => (
        <path key={d} d={d} stroke={colour(i)} strokeWidth={STROKE.tributary} />
      ))}
      <path d={CHANNEL} stroke="currentColor" strokeWidth={STROKE.channel} />
      {SOURCES.map((s, i) => (
        <circle key={s.cy} cx={s.cx} cy={s.cy} r={STROKE.source} fill={colour(i)} />
      ))}
      <circle cx={CONFLUENCE.cx} cy={CONFLUENCE.cy} r={CONFLUENCE.r} fill="currentColor" />
      {port ? <circle cx={CONFLUENCE.cx} cy={CONFLUENCE.cy} r={CONFLUENCE.port} fill="var(--page-background)" /> : null}
    </svg>
  )
}

export function Wordmark({ scale = 1 }: { scale?: number }) {
  return (
    <span style={{ display: "flex", flexDirection: "column", lineHeight: 1, gap: `${0.15 * scale}rem` }}>
      <span style={{ fontFamily: "var(--font-heading)", fontSize: `${1.45 * scale}rem`, letterSpacing: "-0.01em", color: "var(--neutral-on-background-strong)" }}>Sindhu</span>
      <span
        style={{
          fontFamily: "var(--font-label)",
          fontSize: `${0.62 * scale}rem`,
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--neutral-on-background-weak)",
        }}
      >
        Softworks
      </span>
    </span>
  )
}

export function LogoLockup({ scale = 1, tone = "color" }: { scale?: number; tone?: "mono" | "color" }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: `${0.7 * scale}rem`, color: "var(--neutral-on-background-strong)" }}>
      <LogoMark size={36 * scale} tone={tone} title="Sindhu Softworks" />
      <Wordmark scale={scale} />
    </span>
  )
}
