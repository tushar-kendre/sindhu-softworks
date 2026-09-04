"use client"

import { memo } from "react"
import { cn } from "@/lib/utils"
import { dotTone, NodeFrame, type PlayNodeProps } from "./shared"

const chip: Record<string, string> = { compare: "IF", all: "ALL", any: "ANY", not: "NOT" }

export const RuleNode = memo(function RuleNode(props: PlayNodeProps) {
  const { data } = props
  const { def, result } = data
  return (
    <NodeFrame {...props}>
      <div className="flex items-center gap-2">
        <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", dotTone[result.state])} aria-hidden />
        <span className="truncate text-[13px] font-semibold">{def.label}</span>
        <span className="ml-auto shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">{chip[def.kind]}</span>
      </div>
      <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground" title={result.reason}>
        {result.reason}
      </p>
    </NodeFrame>
  )
})
