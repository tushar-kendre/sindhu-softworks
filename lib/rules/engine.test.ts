import { describe, expect, it } from "vitest"
import { defaultInputs, edgesOf, evaluate, RulesError, topologicalOrder } from "./engine"
import type { Graph, RuleNode } from "./types"
import { playground } from "@/content/playground"

describe.each(playground.scenarios)("scenario $id", (scenario) => {
  const graph: Graph = { inputs: scenario.inputs, nodes: scenario.nodes }

  it("has a valid topological order and no dangling refs", () => {
    const order = topologicalOrder(graph.nodes)
    expect(order).toHaveLength(graph.nodes.length)
    const edges = edgesOf(graph)
    for (const e of edges) {
      expect(order.indexOf(e.source)).toBeLessThan(order.indexOf(e.target))
    }
  })

  it.each(scenario.presets)("preset '$label' → $expected", (preset) => {
    const inputs = { ...defaultInputs(graph.inputs), ...preset.values }
    const result = evaluate(graph, inputs)
    expect(result.status).toBe(preset.expected)
  })

  it("review outranks a passing gate", () => {
    const reviewPreset = scenario.presets.find((p) => {
      const r = evaluate(graph, { ...defaultInputs(graph.inputs), ...p.values })
      return r.tone === "review"
    })!
    // the review preset only touches one input, so the pass-path is still satisfied underneath
    const r = evaluate(graph, { ...defaultInputs(graph.inputs), ...reviewPreset.values })
    expect(r.tone).toBe("review")
    expect(evaluate(graph, defaultInputs(graph.inputs)).tone).toBe("pass")
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
    for (const layout of Object.values(scenario.layout)) {
      for (const id of Object.keys(layout)) {
        expect(graph.nodes.some((n) => n.id === id)).toBe(true)
      }
    }
    for (const node of graph.nodes) expect(scenario.layout.desktop[node.id]).toBeDefined()
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

  it("output rules are ordered: first matching rule wins", () => {
    const g: Graph = {
      inputs: [{ id: "x", label: "x", control: { type: "toggle" }, default: true }],
      nodes: [
        { id: "in_x", kind: "input", input: "x", label: "x" },
        { id: "not_x", kind: "not", input: "in_x", label: "not x" },
        { id: "out", kind: "output", label: "out", rules: [{ when: "in_x", status: "A", tone: "pass" }, { when: "not_x", status: "B", tone: "fail" }], fallback: { status: "C", tone: "review" } },
      ],
    }
    expect(evaluate(g, { x: true }).status).toBe("A")
    expect(evaluate(g, { x: false }).status).toBe("B")
  })
})
