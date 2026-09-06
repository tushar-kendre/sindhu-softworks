"use client"

import { Column, Row, Text, ToggleButton } from "@once-ui-system/core"
import { playground } from "@/content/playground"
import { defaultInputs, edgesOf, evaluate } from "@/lib/rules/engine"
import { edgePath, graphBounds, NODE_SIZE } from "@/lib/rules/layout"
import type { NodeState } from "@/lib/rules/types"
import { ExplainPanel } from "./explain-panel"
import s from "./playground.module.scss"

const stroke: Record<NodeState, string> = {
  pass: "var(--success-solid-strong)",
  fail: "var(--danger-alpha-strong)",
  review: "var(--warning-solid-strong)",
  neutral: "var(--neutral-border-medium)",
}

/**
 * Server-rendered stand-in with the same structure and heights as the live panel:
 * scenario tabs, presets, hint, the graph (as SVG), and the explanation. It is what
 * visitors without JavaScript get, and what shows until the interactive version mounts.
 */
export function RulesPlaygroundStatic() {
  const scenario = playground.scenarios[0]
  const graph = { inputs: scenario.inputs, nodes: scenario.nodes }
  const result = evaluate(graph, defaultInputs(graph.inputs))
  const layout = scenario.layout.desktop
  const { w, h } = NODE_SIZE.desktop
  const { width, height } = graphBounds(layout, "desktop")
  const pad = 8
  const outputId = scenario.nodes.find((n) => n.kind === "output")!.id
  const outputNode = scenario.nodes.find((n) => n.id === outputId)!
  const labelOf = (id: string) => scenario.nodes.find((n) => n.id === id)?.label ?? id

  return (
    <Column fillWidth>
      <Row fillWidth horizontal="between" vertical="center" gap="12" paddingX="24" paddingTop="16" s={{ direction: "column", vertical: "start" }}>
        <Text as="h3" variant="heading-default-l" style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem" }}>
          {scenario.title}
        </Text>
        <Row gap="4" border="neutral-alpha-medium" radius="xs" padding="2">
          {playground.scenarios.map((sc) => (
            <ToggleButton key={sc.id} label={sc.label} selected={sc.id === scenario.id} size="s" variant="ghost" disabled />
          ))}
        </Row>
      </Row>
      <Row fillWidth gap="12" vertical="center" wrap paddingX="24" paddingTop="12">
        <Row gap="8" wrap>
          {scenario.presets.map((p, i) => (
            <ToggleButton key={p.id} label={p.label} selected={i === 0} variant="outline" size="s" disabled />
          ))}
        </Row>
      </Row>
      <Row gap="8" vertical="center" paddingX="24" paddingTop="8">
        <Text as="p" variant="body-default-xs" onBackground="neutral-weak">
          {playground.hint}
        </Text>
      </Row>

      <div className={s.staticGraph}>
        <svg viewBox={`${-pad} ${-pad} ${width + pad * 2} ${height + pad * 2}`} style={{ height: "100%", width: "100%" }} role="img" aria-labelledby="static-graph-title" preserveAspectRatio="xMidYMid meet">
          <title id="static-graph-title">{`${scenario.title} Rules graph: ${scenario.nodes.length} nodes evaluating to ${result.status}`}</title>
          <g fill="none" strokeWidth={2} strokeLinecap="round">
            {edgesOf(graph).map((e) => {
              const d = edgePath(layout, "desktop", e)
              if (!d) return null
              const st = result.results.get(e.source)?.state ?? "neutral"
              return <path key={`${e.source}-${e.target}`} d={d} stroke={stroke[st]} />
            })}
          </g>
          {scenario.nodes.map((node) => {
            const p = layout[node.id]
            const r = result.results.get(node.id)
            if (!p || !r) return null
            const isOutput = node.kind === "output"
            return (
              <g key={node.id} transform={`translate(${p.x} ${p.y})`}>
                <rect width={w} height={h} rx={6} fill="var(--surface-background)" stroke={isOutput ? stroke[r.state] : "var(--neutral-border-medium)"} strokeWidth={isOutput ? 2 : 1} />
                <circle cx={14} cy={h / 2} r={4} fill={r.state === "neutral" ? "var(--neutral-solid-weak)" : stroke[r.state]} />
                <text x={26} y={26} fontSize={13} fontWeight={600} fill="var(--neutral-on-background-strong)" fontFamily="var(--font-body)">
                  {node.label}
                </text>
                <text x={26} y={46} fontSize={11} fill="var(--neutral-on-background-weak)" fontFamily="var(--font-code)">
                  {isOutput ? String(r.value) : r.reason.length > 30 ? r.reason.slice(0, 29) + "…" : r.reason}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <Column fillWidth borderTop="neutral-alpha-medium" paddingX="24" paddingY="16" gap="16">
        <Text as="p" variant="body-default-xs" onBackground="neutral-weak" className="s-flex-show">
          Tap any rule or the decision to see why it has its value.
        </Text>
        <Row fillWidth gap="32" vertical="start" className="s-flex-hide">
          <Column flex={11} minWidth={0}>
            <ExplainPanel node={outputNode} result={result.results.get(outputId)!} labelOf={labelOf} onPick={() => undefined} />
          </Column>
          <Column flex={10} minWidth={0}>
            <Text as="p" variant="label-default-s" onBackground="neutral-weak" className="eyebrow">
              Evaluation trace
            </Text>
            <ol className={s.trace}>
              {result.trace.map((line, i) => (
                <li key={i}>
                  <span className={s.n}>{String(i + 1).padStart(2, "0")}</span>
                  {line}
                </li>
              ))}
            </ol>
          </Column>
        </Row>
      </Column>
    </Column>
  )
}
