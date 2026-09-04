"use client"

import { memo } from "react"
import { cn } from "@/lib/utils"
import { NodeFrame, type PlayNodeProps } from "./shared"

const tone = {
  pass: "border-success bg-success/10 text-success",
  fail: "border-destructive bg-destructive/10 text-destructive",
  review: "border-warning bg-warning/10 text-warning",
  neutral: "",
} as const

export const OutputNode = memo(function OutputNode(props: PlayNodeProps) {
  const { data } = props
  const { def, result } = data
  return (
    <NodeFrame {...props} className={cn("border-2", tone[result.state])}>
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] opacity-80">{def.label}</p>
      <p className="mt-0.5 font-display text-lg font-semibold leading-tight" aria-live="polite">
        {String(result.value)}
      </p>
    </NodeFrame>
  )
})
