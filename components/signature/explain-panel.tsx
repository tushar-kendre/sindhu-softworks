"use client"

import { useState } from "react"
import type { NodeResult, RuleNode } from "@/lib/rules/types"
import { cn } from "@/lib/utils"

const kindLabel: Record<RuleNode["kind"], string> = {
  input: "Input",
  compare: "Rule",
  all: "ALL of",
  any: "ANY of",
  not: "NOT",
  output: "Decision",
}

const stateTone = {
  pass: "bg-success/15 text-success",
  fail: "bg-destructive/15 text-destructive",
  review: "bg-warning/15 text-warning",
  neutral: "bg-muted text-muted-foreground",
} as const

type Props = {
  node: RuleNode
  result: NodeResult
  labelOf: (id: string) => string
  onPick: (id: string) => void
  className?: string
}

export function ExplainPanel({ node, result, labelOf, onPick, className }: Props) {
  const [json, setJson] = useState(false)
  const { id: _id, ...definition } = node
  void _id

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{kindLabel[node.kind]}</p>
          <h3 className="mt-0.5 font-sans text-base font-semibold tracking-normal">{node.label}</h3>
        </div>
        <span className={cn("shrink-0 rounded-full px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider", stateTone[result.state])}>
          {node.kind === "output" ? String(result.value) : result.state === "neutral" ? "input" : result.state}
        </span>
      </div>

      <div className="mt-3 flex-1 space-y-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Expression</p>
          <code className="mt-0.5 block break-words rounded bg-muted px-2 py-1 font-mono text-xs">{result.expression}</code>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Why</p>
          <p className="mt-0.5">{result.reason}</p>
        </div>
        {result.dependsOn.length ? (
          <div>
            <p className="text-xs text-muted-foreground">Depends on</p>
            <ul className="mt-1 flex flex-wrap gap-1.5">
              {result.dependsOn.map((d) => (
                <li key={d}>
                  <button
                    type="button"
                    onClick={() => onPick(d)}
                    className="rounded border bg-background px-2 py-0.5 font-mono text-xs hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {labelOf(d)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {json ? (
          <pre className="max-h-40 overflow-auto rounded bg-muted p-2 font-mono text-[11px] leading-relaxed">{JSON.stringify(definition, null, 2)}</pre>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => setJson((v) => !v)}
        aria-pressed={json}
        className="mt-3 self-start font-mono text-xs text-primary underline-offset-4 hover:underline"
      >
        {json ? "Hide definition" : "View node as JSON"}
      </button>
    </div>
  )
}
