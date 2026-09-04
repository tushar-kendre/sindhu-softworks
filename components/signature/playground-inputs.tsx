"use client"

import type { InputDef, InputValue } from "@/lib/rules/types"
import { InputControl } from "./input-control"

type Props = {
  inputs: InputDef[]
  values: Record<string, InputValue>
  onChange: (id: string, v: InputValue) => void
  idPrefix?: string
}

export function PlaygroundInputs({ inputs, values, onChange, idPrefix = "drawer" }: Props) {
  return (
    <ul className="space-y-5">
      {inputs.map((def) => {
        const id = `${idPrefix}-${def.id}`
        return (
          <li key={def.id}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span id={`${id}-label`} className="text-sm font-medium">
                {def.label}
              </span>
            </div>
            <InputControl def={def} value={values[def.id] ?? def.default} onChange={(v) => onChange(def.id, v)} id={id} />
            {def.hint ? <p className="mt-1.5 text-xs text-muted-foreground">{def.hint}</p> : null}
          </li>
        )
      })}
    </ul>
  )
}
