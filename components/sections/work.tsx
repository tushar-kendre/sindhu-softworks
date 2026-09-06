"use client"

import { Button, Column, Dialog, Grid, Line, Row, StatusIndicator, Tag, Text, ToggleButton } from "@once-ui-system/core"
import { useState } from "react"
import { Section } from "@/components/layout/section"
import type { CaseStudy, ServiceId } from "@/content/schema"
import { services } from "@/content/services"
import { clientLabel, work } from "@/content/work"

const statusLabel: Record<CaseStudy["status"], string> = { live: "In production", active: "Active build", design: "In design", concept: "Concept" }
const statusColor: Record<CaseStudy["status"], "green" | "cyan" | "yellow" | "gray"> = { live: "green", active: "cyan", design: "yellow", concept: "gray" }

function Key({ children }: { children: React.ReactNode }) {
  return (
    <Text as="p" variant="label-default-s" onBackground="neutral-weak" className="eyebrow">
      {children}
    </Text>
  )
}

function CaseRow({ item, index }: { item: CaseStudy; index: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Grid columns="5" gap="32" s={{ columns: 1, gap: "16" }} paddingY="32" borderTop="neutral-alpha-medium">
        <Column gap="8" style={{ gridColumn: "span 1" }}>
          <Text as="p" variant="code-default-s" onBackground="brand-medium" className="tabular">
            {index}
          </Text>
          <Text as="p" variant="label-default-m" style={{ fontWeight: 600 }}>
            {clientLabel(item.client)}
          </Text>
          <Text as="p" variant="code-default-xs" onBackground="neutral-weak">
            {item.period}
          </Text>
          <Row gap="8" vertical="center" paddingTop="4">
            <StatusIndicator size="s" color={statusColor[item.status]} ariaLabel={statusLabel[item.status]} />
            <Text as="span" variant="label-default-s" onBackground="neutral-weak">
              {statusLabel[item.status]}
            </Text>
          </Row>
        </Column>

        <Column gap="16" style={{ gridColumn: "span 3" }}>
          <Text as="h3" variant="heading-default-xl" style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", lineHeight: 1.15 }}>
            {item.title}
          </Text>
          <Text as="p" variant="body-default-m" onBackground="neutral-weak">
            {item.summary}
          </Text>
          <Row gap="8" wrap>
            {item.stack.slice(0, 6).map((t) => (
              <Tag key={t} size="s" variant="neutral" label={t} />
            ))}
          </Row>
          <Row gap="8" wrap>
            <Button size="s" variant="secondary" label="Read the case" onClick={() => setOpen(true)} />
            {item.links?.map((l) => (
              <Button key={l.href} size="s" variant="tertiary" href={l.href} label={l.label} suffixIcon="arrowUpRight" />
            ))}
          </Row>
        </Column>

        <Column as="dl" gap="0" style={{ gridColumn: "span 1", margin: 0 }}>
          {item.outcomes.slice(0, 3).map((o) => (
            <Column key={o.label} gap="2" paddingY="8" borderBottom="neutral-alpha-weak">
              <Text as="dd" variant="heading-default-l" className="tabular" style={{ fontFamily: "var(--font-code)", margin: 0 }}>
                {o.value}
              </Text>
              <Text as="dt" variant="code-default-xs" onBackground="neutral-weak">
                {o.label}
              </Text>
            </Column>
          ))}
        </Column>
      </Grid>

      <Dialog isOpen={open} onClose={() => setOpen(false)} title={item.title} description={`${clientLabel(item.client)} · ${item.period} · ${item.role}`}>
        <Column gap="24" paddingTop="8">
          <Column gap="8">
            <Key>Problem</Key>
            <Text as="p" variant="body-default-m">
              {item.problem}
            </Text>
          </Column>
          <Column gap="8">
            <Key>Approach</Key>
            <Column as="ol" gap="8" style={{ margin: 0, paddingLeft: "1.25rem" }}>
              {item.approach.map((a) => (
                <Text as="li" key={a} variant="body-default-m">
                  {a}
                </Text>
              ))}
            </Column>
          </Column>
          {item.outcomes.length ? (
            <Column gap="8">
              <Key>Outcomes</Key>
              <Column as="dl" gap="0" style={{ margin: 0 }}>
                {item.outcomes.map((o) => (
                  <Row key={o.label} gap="16" paddingY="8" borderBottom="neutral-alpha-weak">
                    <Text as="dd" variant="code-default-m" className="tabular" style={{ margin: 0, minWidth: "8rem" }}>
                      {o.value}
                    </Text>
                    <Text as="dt" variant="body-default-s" onBackground="neutral-weak">
                      {o.label}
                    </Text>
                  </Row>
                ))}
              </Column>
            </Column>
          ) : null}
          <Column gap="8">
            <Key>Stack</Key>
            <Row gap="8" wrap>
              {item.stack.map((t) => (
                <Tag key={t} size="s" variant="neutral" label={t} />
              ))}
            </Row>
          </Column>
          {item.links?.length ? (
            <Row gap="8" wrap>
              {item.links.map((l) => (
                <Button key={l.href} size="s" variant="secondary" href={l.href} label={l.label} suffixIcon="arrowUpRight" />
              ))}
            </Row>
          ) : null}
        </Column>
      </Dialog>
    </>
  )
}

export function Work() {
  const [filter, setFilter] = useState<ServiceId | "all">("all")
  const main = work.items.filter((w) => !w.openSource)
  const oss = work.items.filter((w) => w.openSource)
  const shown = filter === "all" ? main : main.filter((w) => w.line === filter)

  return (
    <Section id="work" index={work.index} eyebrow={work.eyebrow} title={work.title} intro={work.intro}>
      <Row gap="8" wrap role="group" aria-label="Filter by service">
        {[{ id: "all" as const, title: "All" }, ...services.items.map((s) => ({ id: s.id, title: s.title }))].map((f) => (
          <ToggleButton key={f.id} label={f.title} selected={filter === f.id} variant="outline" size="s" onClick={() => setFilter(f.id)} />
        ))}
      </Row>
      <Column gap="0">
        {shown.map((item, i) => (
          <CaseRow key={item.slug} item={item} index={`${work.index}.${i + 1}`} />
        ))}
      </Column>

      <Column gap="0" paddingTop="24">
        <Line background="neutral-alpha-medium" />
        <Text as="h3" variant="heading-default-l" paddingTop="24" style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem" }}>
          {work.openSourceTitle}
        </Text>
        {oss.map((item, i) => (
          <CaseRow key={item.slug} item={item} index={`OS.${i + 1}`} />
        ))}
      </Column>
    </Section>
  )
}
