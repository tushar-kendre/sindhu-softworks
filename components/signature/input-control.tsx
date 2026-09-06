"use client"

import { SegmentedControl, Slider, Switch } from "@once-ui-system/core"
import { formatValue } from "@/lib/rules/engine"
import type { InputDef, InputValue } from "@/lib/rules/types"

type Props = { def: InputDef; value: InputValue; onChange: (v: InputValue) => void; compact?: boolean; id?: string }

export function InputControl({ def, value, onChange, compact = false, id }: Props) {
  const c = def.control
  const labelId = `${id ?? def.id}-label`

  if (c.type === "segmented") {
    return (
      <div aria-labelledby={labelId}>
        <SegmentedControl
          compact
          fillWidth={false}
          buttons={c.options.map((o) => ({ label: o.label, value: String(o.value) }))}
          selected={String(value)}
          onToggle={(v) => onChange(Number(v))}
        />
      </div>
    )
  }

  if (c.type === "toggle") {
    return (
      <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }} onClick={(e) => e.preventDefault()}>
        <Switch isChecked={Boolean(value)} onToggle={() => onChange(!value)} ariaLabel={def.label} reverse={false} />
        <span style={{ fontFamily: "var(--font-code)", fontSize: compact ? "0.6875rem" : "0.8125rem", color: "var(--neutral-on-background-weak)" }}>{formatValue(value, def)}</span>
        <span style={{ position: "absolute", left: -9999 }}>{def.label}</span>
      </label>
    )
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%" }}>
      <label style={{ flex: 1, minWidth: 0, display: "block" }}>
        <span style={{ position: "absolute", left: -9999 }}>{def.label}</span>
        <Slider min={c.min} max={c.max} step={c.step} value={Number(value)} onChange={(v) => onChange(v)} aria-label={def.label} />
      </label>
      <output
        aria-live="off"
        style={{ fontFamily: "var(--font-code)", fontSize: compact ? "0.6875rem" : "0.8125rem", fontVariantNumeric: "tabular-nums", minWidth: compact ? "3.5rem" : "4.5rem", textAlign: "right" }}
      >
        {formatValue(value, def)}
      </output>
    </div>
  )
}
