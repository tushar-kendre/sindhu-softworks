import { CHANNEL, CONFLUENCE, MARK_VIEWBOX, SOURCES, STROKE, TRIBUTARIES } from "./logo-paths"

type MarkProps = {
  size?: number
  /** "mono" uses currentColor for everything; "duo" colours tributaries with the brand token */
  tone?: "mono" | "duo"
  port?: boolean
  title?: string
  style?: React.CSSProperties
}

export function LogoMark({ size = 32, tone = "duo", port = true, title, style }: MarkProps) {
  const primary = tone === "duo" ? "var(--brand-on-background-strong)" : "currentColor"
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
      {TRIBUTARIES.map((d) => (
        <path key={d} d={d} stroke={primary} strokeWidth={STROKE.tributary} />
      ))}
      <path d={CHANNEL} stroke="currentColor" strokeWidth={STROKE.channel} />
      {SOURCES.map((s) => (
        <circle key={s.cy} cx={s.cx} cy={s.cy} r={STROKE.source} fill={primary} />
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

export function LogoLockup({ scale = 1, tone = "duo" }: { scale?: number; tone?: "mono" | "duo" }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: `${0.7 * scale}rem`, color: "var(--neutral-on-background-strong)" }}>
      <LogoMark size={36 * scale} tone={tone} title="Sindhu Softworks" />
      <Wordmark scale={scale} />
    </span>
  )
}
