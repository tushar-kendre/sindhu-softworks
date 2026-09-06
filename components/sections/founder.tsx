import { Button, Column, Grid, Media, Row, Text } from "@once-ui-system/core"
import { Section } from "@/components/layout/section"
import { founder } from "@/content/founder"

const icons = { personal: "globe", linkedin: "linkedin", github: "github", paper: "document" } as const

export function FounderSection() {
  const p = founder.person
  return (
    <Section id="founder" index={founder.index} eyebrow={founder.eyebrow} title={founder.title}>
      <Grid columns="5" gap="48" s={{ columns: 1, gap: "32" }}>
        <Column gap="16" style={{ gridColumn: "span 2" }}>
          <Media src={p.headshot} alt={p.headshotAlt} aspectRatio="4 / 5" radius="s" border="neutral-alpha-medium" sizes="(min-width: 768px) 40vw, 100vw" />
          <Column gap="4">
            <Text as="p" variant="heading-default-l" style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem" }}>
              {p.name}
            </Text>
            <Text as="p" variant="body-default-s" onBackground="neutral-weak">
              {p.title}
            </Text>
          </Column>
          <Row gap="8" wrap>
            {p.links.map((l) => (
              <Button key={l.href} href={l.href} size="s" variant="secondary" label={l.label} prefixIcon={icons[l.kind]} />
            ))}
          </Row>
        </Column>
        <Column gap="32" style={{ gridColumn: "span 3" }}>
          <Column gap="16" style={{ maxWidth: "40rem" }}>
            {p.bio.map((para) => (
              <Text key={para.slice(0, 24)} as="p" variant="body-default-l">
                {para}
              </Text>
            ))}
          </Column>
          <Column gap="0">
            <Text as="p" variant="label-default-s" onBackground="neutral-weak" className="eyebrow" paddingBottom="8">
              Credentials
            </Text>
            {p.credentials.map((c) => (
              <Row key={c.label} gap="16" paddingY="12" borderTop="neutral-alpha-weak" horizontal="between" vertical="start" s={{ direction: "column", gap: "2" }}>
                <Text as="span" variant="body-default-s">
                  {c.label}
                </Text>
                <Row gap="12" vertical="center">
                  <Text as="span" variant="body-default-s" onBackground="neutral-weak">
                    {c.org}
                  </Text>
                  {c.year ? (
                    <Text as="span" variant="code-default-xs" onBackground="neutral-weak" className="tabular">
                      {c.year}
                    </Text>
                  ) : null}
                </Row>
              </Row>
            ))}
          </Column>
        </Column>
      </Grid>
    </Section>
  )
}
