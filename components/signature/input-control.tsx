"use client"

import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { formatValue } from "@/lib/rules/engine"
import type { InputDef, InputValue } from "@/lib/rules/types"
import { cn } from "@/lib/utils"

type Props = {
  def: InputDef
  value: InputValue
  onChange: (v: InputValue) => void
  compact?: boolean
  id?: string
}

export function InputControl({ def, value, onChange, compact = false, id }: Props) {
  const labelId = `${id ?? def.id}-label`
  const c = def.control

  if (c.type === "segmented") {
    return (
      <div role="radiogroup" aria-labelledby={labelId} className={cn("inline-flex rounded-md border bg-background p-0.5", compact ? "text-xs" : "text-sm")}>
        {c.options.map((o) => {
          const active = value === o.value
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              className={cn(
                "min-w-8 rounded px-2 py-0.5 font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    )
  }

  if (c.type === "toggle") {
    return (
      <div className="flex items-center gap-2">
        <Switch aria-labelledby={labelId} checked={Boolean(value)} onCheckedChange={(v) => onChange(v)} className={compact ? "scale-90" : undefined} />
        <span className={cn("font-mono text-muted-foreground", compact ? "text-xs" : "text-sm")}>{value ? "yes" : "no"}</span>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-3", compact ? "w-full" : "w-full")}>
      <Slider
        aria-labelledby={labelId}
        min={c.min}
        max={c.max}
        step={c.step}
        value={[Number(value)]}
        onValueChange={([v]) => onChange(v)}
        className="flex-1"
      />
      <output className={cn("shrink-0 font-mono tabular-nums", compact ? "w-16 text-right text-xs" : "w-20 text-right text-sm")}>{formatValue(value, def)}</output>
    </div>
  )
}
