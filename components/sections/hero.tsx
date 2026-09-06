import { Background, Button, Column, Grid, Heading, Line, Row, Text } from "@once-ui-system/core"
import { PlaygroundShell } from "@/components/signature/playground-shell"
import { hero } from "@/content/hero"

export function Hero() {
  return (
    <Column as="section" id="hero" fillWidth horizontal="center" paddingTop="64" paddingBottom="40" aria-labelledby="hero-title" overflow="hidden">
      {/* The page's single ambient layer: graph-paper grid with a faint brand wash, faded out at the bottom. */}
      <Background
        position="absolute"
        top="0"
        left="0"
        fill
        pointerEvents="none"
        grid={{ display: true, color: "neutral-alpha-weak", width: "32", height: "32", opacity: 60 }}
        gradient={{ display: true, colorStart: "brand-alpha-weak", colorEnd: "static-transparent", x: 20, y: 0, width: 120, height: 60, opacity: 70 }}
        mask={{ x: 50, y: 0, radius: 90 }}
      />
      <Column zIndex={1} fillWidth maxWidth="xl" paddingX="32" s={{ paddingX: "20" }} gap="64">
        <Grid columns="5" gap="48" s={{ columns: 1, gap: "32" }}>
          <Column gap="24" style={{ gridColumn: "span 3" }}>
            <Row gap="12" vertical="center">
              <Text as="span" variant="code-default-s" onBackground="brand-medium" className="tabular">
                {hero.index}
              </Text>
              <Text as="span" variant="label-default-s" onBackground="neutral-weak" className="eyebrow">
                Sindhu Softworks
              </Text>
            </Row>
            <Heading as="h1" id="hero-title" variant="display-default-l" wrap="balance">
              {hero.headline}
            </Heading>
            <Text as="p" variant="body-default-l" onBackground="neutral-weak" style={{ maxWidth: "36rem" }}>
              {hero.sub}
            </Text>
            <Row gap="12" wrap paddingTop="8">
              <Button href={hero.primaryCta.href} size="m" variant="primary" label={hero.primaryCta.label} suffixIcon="arrowRight" />
              <Button href={hero.secondaryCta.href} size="m" variant="secondary" label={hero.secondaryCta.label} />
            </Row>
          </Column>

          <Column as="dl" gap="0" style={{ gridColumn: "span 2", margin: 0, alignSelf: "end" }}>
            <Line background="neutral-alpha-medium" />
            {hero.facts.map((f) => (
              <Row key={f.key} gap="16" paddingY="12" borderBottom="neutral-alpha-weak" vertical="start">
                <Text as="dt" variant="code-default-s" onBackground="neutral-weak" style={{ minWidth: "7rem" }}>
                  {f.key}
                </Text>
                <Text as="dd" variant="body-default-s" style={{ margin: 0 }}>
                  {f.value}
                </Text>
              </Row>
            ))}
          </Column>
        </Grid>

        <PlaygroundShell />
      </Column>
    </Column>
  )
}
