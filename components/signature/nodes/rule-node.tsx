"use client"

import { memo } from "react"
import { cn } from "@/lib/utils"
import s from "../playground.module.scss"
import { NodeFrame, type PlayNodeProps } from "./shared"

const chip: Record<string, string> = { compare: "IF", all: "ALL", any: "ANY", not: "NOT" }
const opSymbol: Record<string, string> = { ">=": "≥", "<=": "≤", "==": "=", ">": ">", "<": "<" }

export const RuleNode = memo(function RuleNode(props: PlayNodeProps) {
  const { data, id } = props
  const { def, result, threshold, thresholdStep, thresholdEdited, onThreshold } = data
  const editable = def.kind === "compare" && onThreshold !== undefined && threshold !== undefined

  return (
    <NodeFrame {...props}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span className={cn(s.dot, s[result.state])} aria-hidden />
        <span className={s.title}>{def.label}</span>
        <span className={s.chip}>{chip[def.kind]}</span>
      </div>
      {editable && def.kind === "compare" ? (
        <div className={cn("nodrag nopan nowheel", s.thresholdRow)}>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{result.reason.split(" ")[0]}</span>
          <span className={result.pass ? s["pass-text"] : s["fail-text"]}>{opSymbol[def.op]}</span>
          <label className="sr-only" htmlFor={`${id}-threshold`} style={{ position: "absolute", left: -9999 }}>
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
            className={cn(s.threshold, thresholdEdited && s.edited)}
            aria-describedby={`${id}-threshold-help`}
          />
          <span id={`${id}-threshold-help`} style={{ position: "absolute", left: -9999 }}>
            Editable. Changing it rewrites this rule.
          </span>
          <span className={cn(result.pass ? s["pass-text"] : s["fail-text"])} style={{ marginLeft: "auto" }}>
            {result.pass ? "pass" : "fail"}
          </span>
        </div>
      ) : (
        <p className={s.reason} title={result.reason}>
          {result.reason}
        </p>
      )}
    </NodeFrame>
  )
})
