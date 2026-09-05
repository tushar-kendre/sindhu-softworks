"use client"

import { memo } from "react"
import { cn } from "@/lib/utils"
import { dotTone, NodeFrame, type PlayNodeProps } from "./shared"

const chip: Record<string, string> = { compare: "IF", all: "ALL", any: "ANY", not: "NOT" }
const opSymbol: Record<string, string> = { ">=": "≥", "<=": "≤", "==": "=", ">": ">", "<": "<" }

export const RuleNode = memo(function RuleNode(props: PlayNodeProps) {
  const { data, id } = props
  const { def, result, threshold, thresholdStep, thresholdEdited, onThreshold } = data
  const editable = def.kind === "compare" && onThreshold !== undefined && threshold !== undefined

  return (
    <NodeFrame {...props}>
      <div className="flex items-center gap-2">
        <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", dotTone[result.state])} aria-hidden />
        <span className="truncate text-[13px] font-semibold">{def.label}</span>
        <span className="ml-auto shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">{chip[def.kind]}</span>
      </div>
      {editable && def.kind === "compare" ? (
        <div className="nodrag nopan nowheel mt-1 flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
          <span className="truncate">{result.reason.split(" ")[0]}</span>
          <span className={cn("shrink-0", result.pass ? "text-success" : "text-destructive")}>{opSymbol[def.op]}</span>
          <label className="sr-only" htmlFor={`${id}-threshold`}>
            Threshold for {def.label}
          </label>
          <input
            id={`${id}-threshold`}
            type="number"
            inputMode="decimal"
            step={thresholdStep ?? 1}
            value={threshold}
            onChange={(e) => {
              const v = Number(e.target.value)
              if (Number.isFinite(v)) onThreshold(v)
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            className={cn(
              "h-5 w-14 rounded border bg-background px-1 text-center font-mono text-[11px] tabular-nums text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              thresholdEdited && "border-accent text-accent",
            )}
            aria-describedby={`${id}-threshold-help`}
          />
          <span id={`${id}-threshold-help`} className="sr-only">
            Editable. Changing it rewrites this rule.
          </span>
          <span className={cn("ml-auto shrink-0", result.pass ? "text-success" : "text-destructive")}>{result.pass ? "pass" : "fail"}</span>
        </div>
      ) : (
        <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground" title={result.reason}>
          {result.reason}
        </p>
      )}
    </NodeFrame>
  )
})
