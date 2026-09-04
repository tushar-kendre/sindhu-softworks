import type { InputDef, InputValue, RuleNode, Status } from "@/lib/rules/types"

export type Preset = { id: string; label: string; values: Record<string, InputValue>; expected: Status }
export type Layout = Record<string, { x: number; y: number }>
export type PlaygroundContent = {
  eyebrow: string
  title: string
  caption: string
  footnote: string
  sourceLabel: string
  sourceHref: string
  inputs: InputDef[]
  nodes: RuleNode[]
  presets: Preset[]
  layout: Record<"desktop" | "mobile", Layout>
}

export const playground: PlaygroundContent = {
  eyebrow: "Live rules engine",
  title: "Is this student compliant for MMR?",
  caption:
    "A miniature of the compliance rules engine built for Patient First.AI: declarative rules, evaluated as a graph, explainable to a human. Change an input and watch the decision recompute.",
  footnote:
    "Thresholds follow the public CDC two-dose MMR schedule. The production engine has a 29-node DSL, versioned policies and a draft → publish → rollback lifecycle; this one has thirteen nodes and no versioning.",
  sourceLabel: "Read the evaluator",
  sourceHref: "https://github.com/tushar-kendre/sindhu-softworks/blob/main/lib/rules/engine.ts",
  inputs: [
    {
      id: "doses",
      label: "Doses on record",
      control: { type: "segmented", options: [{ value: 0, label: "0" }, { value: 1, label: "1" }, { value: 2, label: "2" }] },
      default: 2,
    },
    {
      id: "dose1_age_months",
      label: "Age at dose 1",
      hint: "Dose 1 must be given on or after the first birthday.",
      control: { type: "slider", min: 6, max: 24, step: 1, unit: "mo" },
      default: 13,
    },
    {
      id: "interval_days",
      label: "Days between doses",
      hint: "Minimum interval between dose 1 and dose 2.",
      control: { type: "slider", min: 0, max: 60, step: 1, unit: "days" },
      default: 30,
    },
    {
      id: "doc_confidence",
      label: "OCR confidence",
      hint: "How sure the document parser is about the extracted dates.",
      control: { type: "slider", min: 0.5, max: 1, step: 0.01 },
      default: 0.97,
      precision: 2,
    },
    {
      id: "exemption_on_file",
      label: "Exemption on file",
      hint: "Medical or religious exemption approved by the university.",
      control: { type: "toggle" },
      default: false,
    },
  ],

  nodes: [
    { id: "in_doses", kind: "input", input: "doses", label: "Doses" },
    { id: "in_age", kind: "input", input: "dose1_age_months", label: "Age at dose 1" },
    { id: "in_interval", kind: "input", input: "interval_days", label: "Interval" },
    { id: "in_conf", kind: "input", input: "doc_confidence", label: "OCR confidence" },
    { id: "in_exempt", kind: "input", input: "exemption_on_file", label: "Exemption" },

    { id: "r_doses", kind: "compare", left: "in_doses", op: ">=", right: 2, label: "Two doses recorded" },
    { id: "r_age", kind: "compare", left: "in_age", op: ">=", right: 12, label: "Dose 1 at 12+ months" },
    { id: "r_interval", kind: "compare", left: "in_interval", op: ">=", right: 28, label: "28+ days apart" },
    { id: "r_conf", kind: "compare", left: "in_conf", op: ">=", right: 0.9, label: "Document is legible" },

    { id: "c_schedule", kind: "all", inputs: ["r_doses", "r_age", "r_interval"], label: "Schedule satisfied" },
    { id: "n_review", kind: "not", input: "r_conf", label: "Needs human review" },
    { id: "c_eligible", kind: "any", inputs: ["c_schedule", "in_exempt"], label: "Schedule or exemption" },

    {
      id: "out_status",
      kind: "output",
      label: "Compliance status",
      rules: [
        { when: "n_review", status: "NEEDS REVIEW" },
        { when: "c_eligible", status: "COMPLIANT" },
      ],
      fallback: "NON-COMPLIANT",
    },
  ],

  presets: [
    { id: "ok", label: "Fully compliant", values: {}, expected: "COMPLIANT" },
    { id: "missing", label: "Missing dose 2", values: { doses: 1 }, expected: "NON-COMPLIANT" },
    { id: "early", label: "Dose 1 too early", values: { dose1_age_months: 11 }, expected: "NON-COMPLIANT" },
    { id: "exempt", label: "Exempt", values: { doses: 0, exemption_on_file: true }, expected: "COMPLIANT" },
    { id: "blurry", label: "Blurry document", values: { doc_confidence: 0.72 }, expected: "NEEDS REVIEW" },
  ],

  /** Node positions. Desktop flows left → right; mobile stacks rules only (inputs live in the drawer). */
  layout: {
    desktop: {
      in_doses: { x: 0, y: 0 },
      in_age: { x: 0, y: 96 },
      in_interval: { x: 0, y: 192 },
      in_conf: { x: 0, y: 288 },
      in_exempt: { x: 0, y: 384 },
      r_doses: { x: 262, y: 0 },
      r_age: { x: 262, y: 96 },
      r_interval: { x: 262, y: 192 },
      r_conf: { x: 262, y: 288 },
      c_schedule: { x: 524, y: 96 },
      n_review: { x: 524, y: 288 },
      c_eligible: { x: 786, y: 192 },
      out_status: { x: 1048, y: 192 },
    },
    mobile: {
      r_doses: { x: 0, y: 0 },
      r_age: { x: 190, y: 0 },
      r_interval: { x: 0, y: 90 },
      r_conf: { x: 190, y: 90 },
      c_schedule: { x: 0, y: 190 },
      n_review: { x: 190, y: 190 },
      c_eligible: { x: 0, y: 290 },
      out_status: { x: 95, y: 390 },
    },
  },
}
