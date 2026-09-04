import { cn } from "@/lib/utils"
import { CHANNEL, CONFLUENCE, MARK_VIEWBOX, SOURCES, STROKE, TRIBUTARIES } from "./logo-paths"

type MarkProps = {
  className?: string
  /** "mono" uses currentColor for everything; "duo" colours tributaries with the primary token */
  tone?: "mono" | "duo"
  /** Draw the inner port dot (skip at tiny sizes) */
  port?: boolean
  title?: string
}

export function LogoMark({ className, tone = "duo", port = true, title }: MarkProps) {
  const primary = tone === "duo" ? "hsl(var(--primary))" : "currentColor"
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      className={cn("h-8 w-8 shrink-0", className)}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
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
      {port ? <circle cx={CONFLUENCE.cx} cy={CONFLUENCE.cy} r={CONFLUENCE.port} fill="hsl(var(--background))" /> : null}
    </svg>
  )
}

type LockupProps = { className?: string; markClassName?: string; tone?: "mono" | "duo"; stacked?: boolean }

export function Wordmark({ className, stacked = false }: { className?: string; stacked?: boolean }) {
  return (
    <span className={cn("flex leading-none", stacked ? "flex-col items-center gap-1" : "flex-col gap-0.5", className)}>
      <span className="font-display text-[1.35em] font-semibold tracking-[-0.01em]" style={{ fontVariationSettings: '"opsz" 32' }}>
        Sindhu
      </span>
      <span className="font-sans text-[0.62em] font-medium uppercase tracking-[0.18em] text-muted-foreground">Softworks</span>
    </span>
  )
}

export function LogoLockup({ className, markClassName, tone = "duo", stacked = false }: LockupProps) {
  return (
    <span className={cn("inline-flex items-center text-foreground", stacked ? "flex-col gap-3" : "gap-3", className)}>
      <LogoMark className={cn("h-9 w-9", markClassName)} tone={tone} title="Sindhu Softworks" />
      <Wordmark stacked={stacked} />
    </span>
  )
}
