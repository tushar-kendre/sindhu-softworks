/**
 * A tiny, dependency-free rules evaluator.
 *
 * A graph is a list of nodes that reference each other by id. Inputs come in as a
 * flat record. Evaluation is a topological walk; each node produces a NodeResult
 * with a value, a pass/fail state and a one-line reason so a UI (or a human) can
 * explain any decision the graph makes.
 *
 * This is a miniature of the shape used in production compliance engines:
 * declarative rules as data, evaluated deterministically, explainable per node.
 */
import type {
  CompareOp,
  Edge,
  EvalResult,
  Graph,
  InputDef,
  InputValue,
  NodeResult,
  NodeState,
  RuleNode,
  Status,
} from "./types"

const OP_SYMBOL: Record<CompareOp, string> = {
  ">=": "≥",
  "<=": "≤",
  "==": "=",
  ">": ">",
  "<": "<",
}

export class RulesError extends Error {}

/** Which node ids a node reads from. */
export function dependenciesOf(node: RuleNode): string[] {
  switch (node.kind) {
    case "input":
      return []
    case "compare":
      return [node.left]
    case "all":
    case "any":
      return [...node.inputs]
    case "not":
      return [node.input]
    case "output":
      return node.rules.map((r) => r.when)
  }
}

/** Edges implied by node references (source → target). */
export function edgesOf(graph: Pick<Graph, "nodes">): Edge[] {
  const edges: Edge[] = []
  for (const node of graph.nodes) {
    for (const dep of dependenciesOf(node)) edges.push({ source: dep, target: node.id })
  }
  return edges
}

/** Deterministic topological order; throws on cycles or dangling references. */
export function topologicalOrder(nodes: RuleNode[]): string[] {
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const order: string[] = []
  const visiting = new Set<string>()
  const done = new Set<string>()

  const visit = (id: string, path: string[]) => {
    if (done.has(id)) return
    if (visiting.has(id)) {
      throw new RulesError(`Cycle detected: ${[...path, id].join(" → ")}`)
    }
    const node = byId.get(id)
    if (!node) throw new RulesError(`Unknown node "${id}" referenced by ${path.at(-1) ?? "graph"}`)
    visiting.add(id)
    for (const dep of dependenciesOf(node)) visit(dep, [...path, id])
    visiting.delete(id)
    done.add(id)
    order.push(id)
  }

  for (const node of nodes) visit(node.id, [])
  return order
}

export function defaultInputs(inputs: InputDef[]): Record<string, InputValue> {
  return Object.fromEntries(inputs.map((i) => [i.id, i.default]))
}

export function formatValue(value: InputValue | Status, def?: InputDef): string {
  if (typeof value === "boolean") return value ? "yes" : "no"
  if (typeof value === "string") return value
  const precision = def?.precision ?? 0
  const unit = def?.control.type === "slider" ? def.control.unit : undefined
  const text = value.toFixed(precision)
  return unit ? `${text} ${unit}` : text
}

function compare(left: number, op: CompareOp, right: number): boolean {
  switch (op) {
    case ">=":
      return left >= right
    case "<=":
      return left <= right
    case "==":
      return left === right
    case ">":
      return left > right
    case "<":
      return left < right
  }
}

function stateFor(status: Status): NodeState {
  return status === "COMPLIANT" ? "pass" : status === "NON-COMPLIANT" ? "fail" : "review"
}

export function evaluate(graph: Graph, inputs: Record<string, InputValue>): EvalResult {
  const inputDefs = new Map(graph.inputs.map((i) => [i.id, i]))
  const byId = new Map(graph.nodes.map((n) => [n.id, n]))
  const order = topologicalOrder(graph.nodes)
  const results = new Map<string, NodeResult>()
  const trace: string[] = []
  let status: Status | undefined

  const get = (id: string): NodeResult => {
    const r = results.get(id)
    if (!r) throw new RulesError(`Node "${id}" evaluated out of order`)
    return r
  }

  const numberOf = (r: NodeResult): number => {
    if (typeof r.value === "number") return r.value
    if (typeof r.value === "boolean") return r.value ? 1 : 0
    throw new RulesError(`Node "${r.id}" does not produce a number`)
  }

  for (const id of order) {
    const node = byId.get(id)!
    let result: NodeResult

    switch (node.kind) {
      case "input": {
        const def = inputDefs.get(node.input)
        if (!def) throw new RulesError(`Input "${node.input}" is not defined`)
        const raw = inputs[node.input]
        const value = raw === undefined ? def.default : raw
        const isBool = typeof value === "boolean"
        const pass = isBool ? value : true
        result = {
          id,
          kind: node.kind,
          value,
          pass,
          state: isBool ? (value ? "pass" : "fail") : "neutral",
          expression: def.label,
          reason: `${def.label} is ${formatValue(value, def)}`,
          dependsOn: [],
        }
        break
      }
      case "compare": {
        const left = get(node.left)
        const leftNode = byId.get(node.left)
        const def = leftNode?.kind === "input" ? inputDefs.get(leftNode.input) : undefined
        const leftValue = numberOf(left)
        const pass = compare(leftValue, node.op, node.right)
        const expression = `${left.expression} ${OP_SYMBOL[node.op]} ${formatValue(node.right, def)}`
        result = {
          id,
          kind: node.kind,
          value: pass,
          pass,
          state: pass ? "pass" : "fail",
          expression,
          reason: `${formatValue(leftValue, def)} ${OP_SYMBOL[node.op]} ${formatValue(node.right, def)} → ${pass ? "pass" : "fail"}`,
          dependsOn: [node.left],
        }
        break
      }
      case "all":
      case "any": {
        const deps = node.inputs.map(get)
        const pass = node.kind === "all" ? deps.every((d) => d.pass) : deps.some((d) => d.pass)
        const passing = deps.filter((d) => d.pass).length
        const joiner = node.kind === "all" ? " AND " : " OR "
        const expression = deps.map((d) => byId.get(d.id)?.label ?? d.id).join(joiner)
        const reason =
          node.kind === "all"
            ? pass
              ? `all ${deps.length} conditions pass`
              : `${deps.length - passing} of ${deps.length} conditions fail`
            : pass
              ? `${passing} of ${deps.length} conditions pass (one is enough)`
              : `none of ${deps.length} conditions pass`
        result = {
          id,
          kind: node.kind,
          value: pass,
          pass,
          state: pass ? "pass" : "fail",
          expression,
          reason,
          dependsOn: [...node.inputs],
        }
        break
      }
      case "not": {
        const dep = get(node.input)
        const pass = !dep.pass
        result = {
          id,
          kind: node.kind,
          value: pass,
          pass,
          state: pass ? "review" : "pass",
          expression: `NOT (${byId.get(dep.id)?.label ?? dep.id})`,
          reason: pass ? `${byId.get(dep.id)?.label ?? dep.id} failed, so this fires` : `${byId.get(dep.id)?.label ?? dep.id} passed, so this stays quiet`,
          dependsOn: [node.input],
        }
        break
      }
      case "output": {
        let chosen: Status = node.fallback
        let because = "no rule matched, so the fallback applies"
        for (const rule of node.rules) {
          const dep = get(rule.when)
          if (dep.pass) {
            chosen = rule.status
            because = `"${byId.get(rule.when)?.label ?? rule.when}" matched first`
            break
          }
        }
        status = chosen
        result = {
          id,
          kind: node.kind,
          value: chosen,
          pass: chosen === "COMPLIANT",
          state: stateFor(chosen),
          expression: [...node.rules.map((r) => `${byId.get(r.when)?.label ?? r.when} → ${r.status}`), `otherwise → ${node.fallback}`].join("; "),
          reason: `${chosen}: ${because}`,
          dependsOn: node.rules.map((r) => r.when),
        }
        break
      }
    }

    results.set(id, result)
    trace.push(`${node.label}: ${result.reason}`)
  }

  if (!status) throw new RulesError("Graph has no output node")
  return { status, results, order, trace }
}
