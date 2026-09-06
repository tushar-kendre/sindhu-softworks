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
    return <Switch isChecked={Boolean(value)} onToggle={() => onChange(!value)} ariaLabel={def.label} label={compact ? undefined : formatValue(value, def)} reverse={false} />
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Slider min={c.min} max={c.max} step={c.step} value={Number(value)} onChange={(v) => onChange(v)} label={def.label} />
      </div>
      <output
        aria-live="off"
        style={{ fontFamily: "var(--font-code)", fontSize: compact ? "0.6875rem" : "0.8125rem", fontVariantNumeric: "tabular-nums", minWidth: compact ? "3.5rem" : "4.5rem", textAlign: "right" }}
      >
        {formatValue(value, def)}
      </output>
    </div>
  )
}
