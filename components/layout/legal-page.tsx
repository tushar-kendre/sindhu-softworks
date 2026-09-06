import { Button, Column, Heading, Line, Row, Text } from "@once-ui-system/core"
import Link from "next/link"
import { LogoLockup } from "@/components/brand/logo"
import { SiteFooter } from "@/components/layout/site-footer"
import type { LegalDoc } from "@/content/schema"

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <Row as="header" fillWidth horizontal="center" borderBottom="neutral-alpha-medium">
        <Row fillWidth maxWidth="xl" paddingX="32" s={{ paddingX: "20" }} paddingY="12" horizontal="between" vertical="center">
          <Link href="/" style={{ display: "inline-flex" }}>
            <LogoLockup scale={0.85} />
          </Link>
          <Button href="/" variant="tertiary" size="s" label="Back to site" prefixIcon="arrowRight" />
        </Row>
      </Row>
      <Column as="main" id="main" fillWidth horizontal="center" paddingY="80">
        <Column fillWidth maxWidth={44} paddingX="32" s={{ paddingX: "20" }} gap="32">
          <Column gap="12">
            <Text variant="label-default-s" onBackground="brand-medium" className="eyebrow">
              Legal
            </Text>
            <Heading as="h1" variant="display-default-s">
              {doc.title}
            </Heading>
            <Text variant="code-default-xs" onBackground="neutral-weak">
              Last updated {doc.updated}
            </Text>
          </Column>
          <Text as="p" variant="body-default-l" onBackground="neutral-weak">
            {doc.intro}
          </Text>
          {doc.sections.map((s) => (
            <Column key={s.heading} gap="12" paddingTop="16">
              <Line background="neutral-alpha-weak" />
              <Heading as="h2" variant="heading-default-l" paddingTop="8">
                {s.heading}
              </Heading>
              {s.paragraphs.map((p) => (
                <Text key={p.slice(0, 32)} as="p" variant="body-default-m">
                  {p}
                </Text>
              ))}
            </Column>
          ))}
        </Column>
      </Column>
      <SiteFooter />
    </>
  )
}
