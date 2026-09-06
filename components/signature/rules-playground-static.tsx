import { playground } from "@/content/playground"
import { defaultInputs, edgesOf, evaluate } from "@/lib/rules/engine"
import { edgePath, graphBounds, NODE_SIZE } from "@/lib/rules/layout"
import type { NodeState } from "@/lib/rules/types"

const stroke: Record<NodeState, string> = {
  pass: "var(--success-solid-strong)",
  fail: "var(--danger-alpha-strong)",
  review: "var(--warning-solid-strong)",
  neutral: "var(--neutral-border-medium)",
}

/**
 * Server-rendered picture of the graph in its default state. Shown before the
 * interactive version hydrates and for visitors without JavaScript. Derived from
 * the same content and engine as the live component, so it cannot drift.
 */
export function RulesPlaygroundStatic() {
  const scenario = playground.scenarios[0]
  const graph = { inputs: scenario.inputs, nodes: scenario.nodes }
  const result = evaluate(graph, defaultInputs(graph.inputs))
  const layout = scenario.layout.desktop
  const { w, h } = NODE_SIZE.desktop
  const { width, height } = graphBounds(layout, "desktop")
  const pad = 8

  return (
    <svg
      viewBox={`${-pad} ${-pad} ${width + pad * 2} ${height + pad * 2}`}
      style={{ height: "100%", width: "100%" }}
      role="img"
      aria-labelledby="static-graph-title"
      preserveAspectRatio="xMidYMid meet"
    >
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
            <rect
              width={w}
              height={h}
              rx={10}
              fill="var(--surface-background)"
              stroke={isOutput ? stroke[r.state] : "var(--neutral-border-medium)"}
              strokeWidth={isOutput ? 2 : 1}
            />
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
  )
}
