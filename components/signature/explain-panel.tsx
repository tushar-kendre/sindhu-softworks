"use client"

import { Column, Row, Tag, Text } from "@once-ui-system/core"
import { useState } from "react"
import type { NodeResult, RuleNode } from "@/lib/rules/types"
import s from "./playground.module.scss"

const kindLabel: Record<RuleNode["kind"], string> = { input: "Input", compare: "Rule", all: "ALL of", any: "ANY of", not: "NOT", output: "Decision" }
const tone = { pass: "success", fail: "danger", review: "warning", neutral: "neutral" } as const

type Props = { node: RuleNode; result: NodeResult; labelOf: (id: string) => string; onPick: (id: string) => void }

export function ExplainPanel({ node, result, labelOf, onPick }: Props) {
  const [json, setJson] = useState(false)
  const { id: _id, ...definition } = node
  void _id

  return (
    <Column gap="12" fillWidth>
      <Row horizontal="between" vertical="start" gap="12">
        <Column gap="2">
          <Text as="p" variant="label-default-s" onBackground="neutral-weak" className="eyebrow">
            {kindLabel[node.kind]}
          </Text>
          <Text as="h4" variant="label-default-m" style={{ fontWeight: 600 }}>
            {node.label}
          </Text>
        </Column>
        <Tag size="s" variant={tone[result.state]} label={node.kind === "output" ? String(result.value) : result.state === "neutral" ? "input" : result.state} />
      </Row>
      <Column gap="4">
        <Text as="p" variant="code-default-xs" onBackground="neutral-weak">
          Expression
        </Text>
        <code className={s.expr}>{result.expression}</code>
      </Column>
      <Column gap="4">
        <Text as="p" variant="code-default-xs" onBackground="neutral-weak">
          Reason
        </Text>
        <Text as="p" variant="body-default-s">
          {result.reason}
        </Text>
      </Column>
      {result.dependsOn.length ? (
        <Column gap="8">
          <Text as="p" variant="code-default-xs" onBackground="neutral-weak">
            Depends on
          </Text>
          <Row gap="8" wrap>
            {result.dependsOn.map((d) => (
              <button key={d} type="button" className={s.depBtn} onClick={() => onPick(d)}>
                {labelOf(d)}
              </button>
            ))}
          </Row>
        </Column>
      ) : null}
      {json ? <pre className={s.json}>{JSON.stringify(definition, null, 2)}</pre> : null}
      <button type="button" onClick={() => setJson((v) => !v)} aria-pressed={json} className={s.depBtn} style={{ alignSelf: "flex-start", borderColor: "transparent", color: "var(--brand-on-background-strong)" }}>
        {json ? "Hide definition" : "View node as JSON"}
      </button>
    </Column>
  )
}
