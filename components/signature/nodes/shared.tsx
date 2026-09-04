"use client"

import { Handle, Position, type NodeProps, type Node } from "@xyflow/react"
import type { InputDef, InputValue, NodeResult, RuleNode } from "@/lib/rules/types"
import { cn } from "@/lib/utils"

export type PlayNodeData = {
  def: RuleNode
  result: NodeResult
  inputDef?: InputDef
  value?: InputValue
  onChange?: (v: InputValue) => void
  onSelect: (id: string) => void
  selected: boolean
  compact: boolean
  hasTarget: boolean
  hasSource: boolean
}
export type PlayNode = Node<PlayNodeData, "input" | "rule" | "output">
export type PlayNodeProps = NodeProps<PlayNode>

export const dotTone = {
  pass: "bg-success",
  fail: "bg-destructive",
  review: "bg-warning",
  neutral: "bg-muted-foreground/60",
} as const

export function NodeFrame({
  data,
  id,
  sourcePosition = Position.Right,
  targetPosition = Position.Left,
  className,
  children,
}: PlayNodeProps & { className?: string; children: React.ReactNode }) {
  const { result, selected, hasSource, hasTarget } = data
  return (
    <div
      className={cn(
        "relative rounded-lg border bg-card text-left text-card-foreground shadow-sm transition-[box-shadow,border-color] motion-reduce:transition-none",
        data.compact ? "w-[170px] px-3 py-2" : "w-[212px] px-3 py-2",
        selected ? "border-primary ring-2 ring-primary/30" : "hover:border-foreground/40",
        className,
      )}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          data.onSelect(id)
        }
      }}
      onClick={() => data.onSelect(id)}
    >
      {hasTarget ? <Handle type="target" position={targetPosition} isConnectable={false} className="!h-2 !w-2 !border-0 !bg-border" /> : null}
      {children}
      {hasSource ? <Handle type="source" position={sourcePosition} isConnectable={false} className={cn("!h-2 !w-2 !border-0", dotTone[result.state])} /> : null}
    </div>
  )
}
