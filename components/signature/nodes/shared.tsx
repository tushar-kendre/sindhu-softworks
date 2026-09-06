"use client"

import { Handle, Position, type NodeProps, type Node } from "@xyflow/react"
import type { InputDef, InputValue, NodeResult, RuleNode } from "@/lib/rules/types"
import { cn } from "@/lib/utils"
import s from "../playground.module.scss"

export type PlayNodeData = {
  def: RuleNode
  result: NodeResult
  inputDef?: InputDef
  value?: InputValue
  onChange?: (v: InputValue) => void
  threshold?: number
  thresholdStep?: number
  thresholdEdited?: boolean
  onThreshold?: (v: number) => void
  onSelect: (id: string) => void
  selected: boolean
  compact: boolean
  hasTarget: boolean
  hasSource: boolean
  rippleKey: number
  rippleDelay: number
  attention: boolean
}
export type PlayNode = Node<PlayNodeData, "playInput" | "playRule" | "playOutput">
export type PlayNodeProps = NodeProps<PlayNode>

export function NodeFrame({
  data,
  id,
  sourcePosition = Position.Right,
  targetPosition = Position.Left,
  className,
  children,
}: PlayNodeProps & { className?: string; children: React.ReactNode }) {
  const { result, selected, hasSource, hasTarget, rippleKey, rippleDelay, attention, compact } = data
  return (
    <div
      className={cn(s.node, compact && s.compact, selected && s.selected, attention && s.attention, className)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          data.onSelect(id)
        }
      }}
    >
      {rippleKey > 0 ? <span key={rippleKey} aria-hidden className={cn(s.ripple, s[result.state])} style={{ animationDelay: `${rippleDelay}ms` }} /> : null}
      {hasTarget ? <Handle type="target" position={targetPosition} isConnectable={false} className={s.handle} /> : null}
      {children}
      {hasSource ? <Handle type="source" position={sourcePosition} isConnectable={false} className={cn(s.handle, s[result.state])} /> : null}
    </div>
  )
}
