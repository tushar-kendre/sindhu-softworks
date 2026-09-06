import { Column, Heading, Row, SmartLink, Text } from "@once-ui-system/core"
import { playground } from "@/content/playground"
import { PlaygroundLoader } from "./playground-loader"
import { RulesPlaygroundStatic } from "./rules-playground-static"

export function PlaygroundShell() {
  return (
    <Column fillWidth background="surface" border="neutral-alpha-medium" radius="s" overflow="hidden">
      <Row fillWidth horizontal="between" vertical="end" gap="16" paddingX="24" paddingY="16" borderBottom="neutral-alpha-medium" s={{ direction: "column", vertical: "start" }}>
        <Column gap="4">
          <Text as="p" variant="label-default-s" onBackground="brand-medium" className="eyebrow">
            {playground.eyebrow}
          </Text>
          <Heading as="h2" variant="heading-default-xl" style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem" }}>
            {playground.title}
          </Heading>
        </Column>
        <SmartLink href={playground.sourceHref} suffixIcon="arrowUpRight">
          <Text variant="code-default-xs">{playground.sourceLabel}</Text>
        </SmartLink>
      </Row>
      <PlaygroundLoader fallback={<RulesPlaygroundStatic />} />
      <Column gap="8" paddingX="24" paddingY="16" borderTop="neutral-alpha-medium">
        <Text as="p" variant="body-default-s" onBackground="neutral-weak">
          {playground.caption}
        </Text>
        <Text as="p" variant="code-default-xs" onBackground="neutral-weak">
          {playground.footnote}
        </Text>
      </Column>
    </Column>
  )
}
