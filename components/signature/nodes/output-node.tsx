"use client"

import { memo } from "react"
import { cn } from "@/lib/utils"
import s from "../playground.module.scss"
import { NodeFrame, type PlayNodeProps } from "./shared"

export const OutputNode = memo(function OutputNode(props: PlayNodeProps) {
  const { data } = props
  const { def, result } = data
  return (
    <NodeFrame {...props} className={cn(s.output, s[result.state])}>
      <p className={s.outputLabel}>{def.label}</p>
      <p key={String(result.value)} className={s.outputValue} aria-live="polite">
        {String(result.value)}
      </p>
    </NodeFrame>
  )
})
