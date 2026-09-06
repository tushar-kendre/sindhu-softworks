"use client"

import { Column, CountFx, Grid, Line, RevealFx, Text, useInViewport } from "@once-ui-system/core"
import { useRef, useState } from "react"
import { Section } from "@/components/layout/section"
import { proof } from "@/content/proof"

/** Splits "50,000+" into a countable number and its decorations, so CountFx can animate the digits. */
function parseStat(value: string): { prefix: string; n: number | null; suffix: string } {
  const m = value.match(/^([^\d]*)([\d,]+)(.*)$/)
  if (!m) return { prefix: "", n: null, suffix: value }
  return { prefix: m[1], n: Number(m[2].replace(/,/g, "")), suffix: m[3] }
}

export function Proof() {
  const ref = useRef<HTMLDivElement>(null)
  const inViewport = useInViewport(ref)
  const [seen, setSeen] = useState(false)
  // Latch: once the grid has been in view, keep the revealed state (derived-state pattern, no effect needed).
  if (inViewport && !seen) setSeen(true)

  return (
    <Section id="proof" index={proof.index} eyebrow={proof.eyebrow} title={proof.title}>
      <Grid ref={ref} columns="5" gap="0" s={{ columns: 1 }} m={{ columns: 2 }} border="neutral-alpha-medium" radius="s">
        {proof.stats.map((s, i) => {
          const { prefix, n, suffix } = parseStat(s.value)
          return (
            <RevealFx key={s.label} trigger={seen} translateY="4" delay={i * 0.08}>
              <Column gap="12" padding="24" fillWidth borderRight="neutral-alpha-weak" borderBottom="neutral-alpha-weak" minHeight={11}>
                <Text as="p" variant="display-default-s" className="tabular" style={{ fontFamily: "var(--font-code)", fontSize: "1.9rem", lineHeight: 1.1 }}>
                  {prefix}
                  {n === null ? suffix : <CountFx value={seen ? n : 0} separator="," speed={900} />}
                  {n === null ? null : suffix}
                </Text>
                <Text as="p" variant="body-default-s" onBackground="neutral-weak">
                  {s.label}
                </Text>
                {s.source ? (
                  <Text as="p" variant="code-default-xs" onBackground="neutral-weak" style={{ marginTop: "auto" }}>
                    {s.source}
                  </Text>
                ) : null}
              </Column>
            </RevealFx>
          )
        })}
      </Grid>
      <Column gap="8" maxWidth={44}>
        <Line background="neutral-alpha-weak" />
        <Text as="p" variant="body-default-s" onBackground="neutral-weak">
          {proof.line}
        </Text>
      </Column>
    </Section>
  )
}
