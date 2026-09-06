import { Column, Grid, Icon, Line, Row, Tag, Text } from "@once-ui-system/core"
import { Section } from "@/components/layout/section"
import { services } from "@/content/services"

function Key({ children }: { children: React.ReactNode }) {
  return (
    <Text as="p" variant="label-default-s" onBackground="neutral-weak" className="eyebrow">
      {children}
    </Text>
  )
}

export function Services() {
  return (
    <Section id="services" index={services.index} eyebrow={services.eyebrow} title={services.title} intro={services.intro}>
      <Column gap="0">
        {services.items.map((s, i) => (
          <Column key={s.id} id={`service-${s.id}`} gap="0" borderTop="neutral-alpha-medium" paddingY="40">
            <Grid columns="5" gap="40" s={{ columns: 1, gap: "24" }}>
              <Column gap="16" style={{ gridColumn: "span 2" }}>
                <Text as="p" variant="code-default-s" onBackground="brand-medium" className="tabular">
                  {services.index}.{i + 1}
                </Text>
                <Text as="h3" variant="heading-default-xl" style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", lineHeight: 1.15 }}>
                  {s.title}
                </Text>
                <Text as="p" variant="body-default-m" onBackground="neutral-weak">
                  {s.oneLiner}
                </Text>
                <Row gap="8" wrap paddingTop="8">
                  {s.stack.map((t) => (
                    <Tag key={t} size="s" variant="neutral" label={t} />
                  ))}
                </Row>
              </Column>

              <Grid columns="2" gap="32" s={{ columns: 1 }} style={{ gridColumn: "span 3" }}>
                <Column gap="12">
                  <Key>Deliverables</Key>
                  <Column as="ul" gap="8" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    {s.youGet.map((line) => (
                      <Row as="li" key={line} gap="8" vertical="start">
                        <Icon name="check" size="xs" onBackground="brand-medium" style={{ marginTop: "0.2rem" }} />
                        <Text as="span" variant="body-default-s">
                          {line}
                        </Text>
                      </Row>
                    ))}
                  </Column>
                </Column>
                <Column gap="24">
                  <Column gap="8">
                    <Key>Engagement shape</Key>
                    <Text as="p" variant="body-default-s">
                      {s.shape}
                    </Text>
                  </Column>
                  <Column gap="8">
                    <Key>Suited when</Key>
                    <Column as="ul" gap="8" style={{ margin: 0, paddingLeft: "1rem" }}>
                      {s.goodFitIf.map((line) => (
                        <Text as="li" key={line} variant="body-default-s" onBackground="neutral-weak">
                          {line}
                        </Text>
                      ))}
                    </Column>
                  </Column>
                </Column>
              </Grid>
            </Grid>
          </Column>
        ))}
      </Column>

      <Column gap="24" paddingTop="16">
        <Line background="neutral-alpha-medium" />
        <Text as="h3" variant="heading-default-l" style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem" }}>
          {services.principlesTitle}
        </Text>
        <Grid columns="4" gap="32" s={{ columns: 1 }} m={{ columns: 2 }}>
          {services.principles.map((p, i) => (
            <Column key={p.title} gap="8" borderTop="neutral-alpha-weak" paddingTop="12">
              <Text as="p" variant="code-default-xs" onBackground="brand-medium" className="tabular">
                P{i + 1}
              </Text>
              <Text as="h4" variant="label-default-m" style={{ fontWeight: 600 }}>
                {p.title}
              </Text>
              <Text as="p" variant="body-default-s" onBackground="neutral-weak">
                {p.body}
              </Text>
            </Column>
          ))}
        </Grid>
      </Column>
    </Section>
  )
}
