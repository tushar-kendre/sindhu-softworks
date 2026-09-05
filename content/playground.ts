import type { InputDef, InputValue, RuleNode } from "@/lib/rules/types"

export type Preset = { id: string; label: string; values: Record<string, InputValue>; expected: string }
export type Layout = Record<string, { x: number; y: number }>
export type Scenario = {
  id: string
  label: string
  title: string
  inputs: InputDef[]
  nodes: RuleNode[]
  presets: Preset[]
  layout: Record<"desktop" | "mobile", Layout>
}
export type PlaygroundContent = {
  eyebrow: string
  title: string
  hint: string
  caption: string
  footnote: string
  sourceLabel: string
  sourceHref: string
  scenarios: Scenario[]
}

const orderFulfilment: Scenario = {
  id: "orders",
  label: "Order fulfilment",
  title: "Should this order ship today?",
  inputs: [
    { id: "payment_confirmed", label: "Payment confirmed", control: { type: "toggle" }, default: true },
    { id: "address_verified", label: "Address verified", hint: "Passed the carrier's address check.", control: { type: "toggle" }, default: true },
    { id: "stock_units", label: "Units in stock", control: { type: "slider", min: 0, max: 10, step: 1 }, default: 4 },
    { id: "order_value", label: "Order value", hint: "Orders above the limit get a human look.", control: { type: "slider", min: 10, max: 2000, step: 10, unit: "$" }, default: 240 },
    { id: "fraud_score", label: "Fraud score", hint: "From the payment provider; higher is riskier.", control: { type: "slider", min: 0, max: 1, step: 0.01 }, default: 0.12, precision: 2 },
  ],
  nodes: [
    { id: "in_paid", kind: "input", input: "payment_confirmed", label: "Paid" },
    { id: "in_address", kind: "input", input: "address_verified", label: "Address" },
    { id: "in_stock", kind: "input", input: "stock_units", label: "Stock" },
    { id: "in_value", kind: "input", input: "order_value", label: "Value" },
    { id: "in_fraud", kind: "input", input: "fraud_score", label: "Fraud score" },
    { id: "r_stock", kind: "compare", left: "in_stock", op: ">=", right: 1, label: "Item in stock" },
    { id: "r_value", kind: "compare", left: "in_value", op: "<=", right: 1000, label: "Under review limit" },
    { id: "r_fraud", kind: "compare", left: "in_fraud", op: "<=", right: 0.6, label: "Fraud score acceptable" },
    { id: "c_ready", kind: "all", inputs: ["in_paid", "in_address", "r_stock"], label: "Ready to ship" },
    { id: "n_highvalue", kind: "not", input: "r_value", label: "High value" },
    { id: "n_flag", kind: "not", input: "r_fraud", label: "Fraud flag" },
    { id: "c_review", kind: "any", inputs: ["n_highvalue", "n_flag"], label: "Needs manual review" },
    {
      id: "out_status",
      kind: "output",
      label: "Decision",
      rules: [
        { when: "c_review", status: "MANUAL REVIEW", tone: "review" },
        { when: "c_ready", status: "SHIP TODAY", tone: "pass" },
      ],
      fallback: { status: "ON HOLD", tone: "fail" },
    },
  ],
  presets: [
    { id: "clean", label: "Clean order", values: {}, expected: "SHIP TODAY" },
    { id: "unpaid", label: "Payment pending", values: { payment_confirmed: false }, expected: "ON HOLD" },
    { id: "nostock", label: "Out of stock", values: { stock_units: 0 }, expected: "ON HOLD" },
    { id: "bigticket", label: "Big ticket", values: { order_value: 1800 }, expected: "MANUAL REVIEW" },
    { id: "suspicious", label: "Suspicious", values: { fraud_score: 0.85 }, expected: "MANUAL REVIEW" },
  ],
  layout: {
    desktop: {
      in_paid: { x: 0, y: 0 },
      in_address: { x: 0, y: 96 },
      in_stock: { x: 0, y: 192 },
      in_value: { x: 0, y: 288 },
      in_fraud: { x: 0, y: 384 },
      r_stock: { x: 262, y: 192 },
      r_value: { x: 262, y: 288 },
      r_fraud: { x: 262, y: 384 },
      c_ready: { x: 524, y: 96 },
      n_highvalue: { x: 524, y: 288 },
      n_flag: { x: 524, y: 384 },
      c_review: { x: 786, y: 336 },
      out_status: { x: 1048, y: 192 },
    },
    mobile: {
      in_paid: { x: 0, y: 0 },
      in_address: { x: 190, y: 0 },
      in_stock: { x: 0, y: 90 },
      in_value: { x: 190, y: 90 },
      in_fraud: { x: 95, y: 180 },
      r_stock: { x: 0, y: 300 },
      r_value: { x: 190, y: 300 },
      r_fraud: { x: 0, y: 390 },
      c_ready: { x: 190, y: 390 },
      n_highvalue: { x: 0, y: 490 },
      n_flag: { x: 190, y: 490 },
      c_review: { x: 95, y: 590 },
      out_status: { x: 95, y: 690 },
    },
  },
}

const pullRequest: Scenario = {
  id: "pull-request",
  label: "Pull request merge",
  title: "Can this pull request merge on its own?",
  inputs: [
    { id: "tests_passing", label: "Tests passing", control: { type: "toggle" }, default: true },
    { id: "approvals", label: "Approvals", control: { type: "segmented", options: [{ value: 0, label: "0" }, { value: 1, label: "1" }, { value: 2, label: "2" }] }, default: 1 },
    { id: "coverage_delta", label: "Coverage change", hint: "Percentage points versus the base branch.", control: { type: "slider", min: -10, max: 10, step: 1, unit: "pts" }, default: 1 },
    { id: "changed_lines", label: "Lines changed", control: { type: "slider", min: 0, max: 800, step: 10 }, default: 120 },
    { id: "touches_migrations", label: "Touches migrations", hint: "Schema changes always get a human.", control: { type: "toggle" }, default: false },
  ],
  nodes: [
    { id: "in_tests", kind: "input", input: "tests_passing", label: "Tests" },
    { id: "in_approvals", kind: "input", input: "approvals", label: "Approvals" },
    { id: "in_cov", kind: "input", input: "coverage_delta", label: "Coverage" },
    { id: "in_lines", kind: "input", input: "changed_lines", label: "Size" },
    { id: "in_migr", kind: "input", input: "touches_migrations", label: "Migrations" },
    { id: "r_approvals", kind: "compare", left: "in_approvals", op: ">=", right: 1, label: "Reviewed" },
    { id: "r_cov", kind: "compare", left: "in_cov", op: ">=", right: 0, label: "Coverage not lower" },
    { id: "r_size", kind: "compare", left: "in_lines", op: "<=", right: 400, label: "Reviewable size" },
    { id: "c_gate", kind: "all", inputs: ["in_tests", "r_approvals", "r_cov"], label: "Quality gate" },
    { id: "n_big", kind: "not", input: "r_size", label: "Large change" },
    { id: "c_human", kind: "any", inputs: ["n_big", "in_migr"], label: "Needs a human" },
    {
      id: "out_status",
      kind: "output",
      label: "Decision",
      rules: [
        { when: "c_human", status: "HUMAN REVIEW", tone: "review" },
        { when: "c_gate", status: "AUTO-MERGE", tone: "pass" },
      ],
      fallback: { status: "BLOCKED", tone: "fail" },
    },
  ],
  presets: [
    { id: "green", label: "Green build", values: {}, expected: "AUTO-MERGE" },
    { id: "unreviewed", label: "No review yet", values: { approvals: 0 }, expected: "BLOCKED" },
    { id: "coverage", label: "Coverage dropped", values: { coverage_delta: -3 }, expected: "BLOCKED" },
    { id: "migrations", label: "Touches migrations", values: { touches_migrations: true }, expected: "HUMAN REVIEW" },
    { id: "huge", label: "Huge diff", values: { changed_lines: 700 }, expected: "HUMAN REVIEW" },
  ],
  layout: {
    desktop: {
      in_tests: { x: 0, y: 0 },
      in_approvals: { x: 0, y: 96 },
      in_cov: { x: 0, y: 192 },
      in_lines: { x: 0, y: 288 },
      in_migr: { x: 0, y: 384 },
      r_approvals: { x: 262, y: 96 },
      r_cov: { x: 262, y: 192 },
      r_size: { x: 262, y: 288 },
      c_gate: { x: 524, y: 96 },
      n_big: { x: 524, y: 288 },
      c_human: { x: 786, y: 336 },
      out_status: { x: 1048, y: 192 },
    },
    mobile: {
      in_tests: { x: 0, y: 0 },
      in_approvals: { x: 190, y: 0 },
      in_cov: { x: 0, y: 90 },
      in_lines: { x: 190, y: 90 },
      in_migr: { x: 95, y: 180 },
      r_approvals: { x: 0, y: 300 },
      r_cov: { x: 190, y: 300 },
      r_size: { x: 0, y: 390 },
      c_gate: { x: 190, y: 390 },
      n_big: { x: 0, y: 490 },
      c_human: { x: 190, y: 490 },
      out_status: { x: 95, y: 590 },
    },
  },
}

export const playground: PlaygroundContent = {
  eyebrow: "Live rules engine",
  title: "A decision engine you can poke at",
  hint: "Flip the switches, drag the sliders, or edit a threshold on any rule. Every node explains itself.",
  caption:
    "Decisions as declarative graphs: inputs feed rules, rules feed combinators, and the output explains itself node by node. Switch scenarios and notice that only the data changed. The engine is the same 150 lines.",
  footnote:
    "The same shape runs in production compliance engines we have built, with 29-node policy DSLs, versioned rules and a draft → publish → rollback lifecycle. This one has thirteen nodes and no versioning.",
  sourceLabel: "Read the evaluator",
  sourceHref: "https://github.com/tushar-kendre/sindhu-softworks/blob/main/lib/rules/engine.ts",
  scenarios: [orderFulfilment, pullRequest],
}
