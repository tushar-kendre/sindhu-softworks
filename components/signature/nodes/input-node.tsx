"use client"

import { memo } from "react"
import { InputControl } from "../input-control"
import { NodeFrame, type PlayNodeProps } from "./shared"

export const InputNode = memo(function InputNode(props: PlayNodeProps) {
  const { data, id } = props
  const { inputDef, value, onChange, def } = data
  return (
    <NodeFrame {...props}>
      <p id={`${id}-label`} className="mb-1.5 text-xs font-medium text-muted-foreground">
        {def.label}
      </p>
      {inputDef && onChange !== undefined && value !== undefined ? (
        <div className="nodrag nopan nowheel">
          <InputControl def={inputDef} value={value} onChange={onChange} compact id={id} />
        </div>
      ) : null}
    </NodeFrame>
  )
})
