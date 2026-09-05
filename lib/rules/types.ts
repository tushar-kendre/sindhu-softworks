export type Tone = "pass" | "fail" | "review"
/** A decision label, e.g. "SHIP TODAY". Scenario-defined, not fixed by the engine. */
export type Status = string
export type Decision = { status: Status; tone: Tone }
export type InputValue = number | boolean
export type CompareOp = ">=" | "<=" | "==" | ">" | "<"
export type NodeState = "pass" | "fail" | "neutral" | "review"

export type InputControl =
  | { type: "segmented"; options: { value: number; label: string }[] }
  | { type: "slider"; min: number; max: number; step: number; unit?: string }
  | { type: "toggle" }

export type InputDef = {
  id: string
  label: string
  hint?: string
  control: InputControl
  default: InputValue
  /** Decimal places to show; defaults to 0 */
  precision?: number
}

export type RuleNode =
  | { id: string; kind: "input"; input: string; label: string }
  | { id: string; kind: "compare"; left: string; op: CompareOp; right: number; label: string }
  | { id: string; kind: "all"; inputs: string[]; label: string }
  | { id: string; kind: "any"; inputs: string[]; label: string }
  | { id: string; kind: "not"; input: string; label: string }
  | {
      id: string
      kind: "output"
      label: string
      rules: { when: string; status: Status; tone: Tone }[]
      fallback: Decision
    }

export type Edge = { source: string; target: string }

export type Graph = {
  inputs: InputDef[]
  nodes: RuleNode[]
}

export type NodeResult = {
  id: string
  kind: RuleNode["kind"]
  value: InputValue | Status
  pass: boolean
  state: NodeState
  /** Human-readable expression, e.g. "doses ≥ 2" */
  expression: string
  /** One-line explanation of the result */
  reason: string
  /** Ids of nodes this one depended on */
  dependsOn: string[]
}

export type EvalResult = {
  status: Status
  tone: Tone
  results: Map<string, NodeResult>
  order: string[]
  trace: string[]
}
