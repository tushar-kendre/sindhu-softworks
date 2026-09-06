"use client"

import { Row, ToggleButton } from "@once-ui-system/core"
import type { Preset } from "@/content/playground"

type Props = { presets: Preset[]; activeId: string | null; onSelect: (p: Preset) => void }

export function Presets({ presets, activeId, onSelect }: Props) {
  return (
    <Row gap="8" wrap role="group" aria-label="Scenarios">
      {presets.map((p) => (
        <ToggleButton key={p.id} label={p.label} selected={activeId === p.id} variant="outline" size="s" onClick={() => onSelect(p)} />
      ))}
    </Row>
  )
}
