import { describe, expect, it } from "vitest"
import { defaultInputs, edgesOf, evaluate, RulesError, topologicalOrder } from "./engine"
import type { Graph, RuleNode } from "./types"
import { playground } from "@/content/playground"

const graph: Graph = { inputs: playground.inputs, nodes: playground.nodes }

describe("playground graph", () => {
  it("has a valid topological order and no dangling refs", () => {
    const order = topologicalOrder(graph.nodes)
    expect(order).toHaveLength(graph.nodes.length)
    const edges = edgesOf(graph)
    for (const e of edges) {
      expect(order.indexOf(e.source)).toBeLessThan(order.indexOf(e.target))
    }
  })

  it.each(playground.presets)("preset '$label' → $expected", (preset) => {
    const inputs = { ...defaultInputs(graph.inputs), ...preset.values }
    const result = evaluate(graph, inputs)
    expect(result.status).toBe(preset.expected)
  })

  it("NEEDS REVIEW wins even when the schedule is satisfied", () => {
    const inputs = { ...defaultInputs(graph.inputs), doc_confidence: 0.5 }
    expect(evaluate(graph, inputs).status).toBe("NEEDS REVIEW")
    expect(evaluate(graph, { ...inputs, exemption_on_file: true }).status).toBe("NEEDS REVIEW")
  })

  it("explains every node", () => {
    const result = evaluate(graph, defaultInputs(graph.inputs))
    for (const node of graph.nodes) {
      const r = result.results.get(node.id)
      expect(r?.reason.length).toBeGreaterThan(0)
      expect(r?.expression.length).toBeGreaterThan(0)
    }
    expect(result.trace).toHaveLength(graph.nodes.length)
  })

  it("every layout position refers to a real node", () => {
    for (const layout of Object.values(playground.layout)) {
      for (const id of Object.keys(layout)) {
        expect(graph.nodes.some((n) => n.id === id)).toBe(true)
      }
    }
    for (const node of graph.nodes) expect(playground.layout.desktop[node.id]).toBeDefined()
  })
})

describe("engine edge cases", () => {
  it("detects cycles", () => {
    const nodes: RuleNode[] = [
      { id: "a", kind: "not", input: "b", label: "a" },
      { id: "b", kind: "not", input: "a", label: "b" },
    ]
    expect(() => topologicalOrder(nodes)).toThrow(RulesError)
  })

  it("rejects unknown references", () => {
    const nodes: RuleNode[] = [{ id: "a", kind: "not", input: "ghost", label: "a" }]
    expect(() => topologicalOrder(nodes)).toThrow(/Unknown node/)
  })

  it("requires an output node", () => {
    const g: Graph = {
      inputs: [{ id: "x", label: "x", control: { type: "toggle" }, default: true }],
      nodes: [{ id: "in_x", kind: "input", input: "x", label: "x" }],
    }
    expect(() => evaluate(g, {})).toThrow(/no output/)
  })
})
