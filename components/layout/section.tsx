import { Column, Heading, Line, Row, Text } from "@once-ui-system/core"

type Props = {
  id: string
  index?: string
  eyebrow?: string
  title?: string
  intro?: string
  children: React.ReactNode
  /** Draw the top rule (all sections except the first) */
  rule?: boolean
}

/** A numbered section: mono index + eyebrow, serif title, optional intro, then content. */
export function Section({ id, index, eyebrow, title, intro, children, rule = true }: Props) {
  return (
    <Column as="section" id={id} fillWidth gap="40" paddingY="80" aria-labelledby={title ? `${id}-title` : undefined} style={{ scrollMarginTop: "5rem" }}>
      {rule ? <Line background="neutral-alpha-medium" /> : null}
      {(eyebrow || title || intro) && (
        <Column gap="16" maxWidth={44}>
          {eyebrow ? (
            <Row gap="12" vertical="center">
              {index ? (
                <Text as="span" variant="code-default-s" onBackground="brand-medium" className="tabular">
                  {index}
                </Text>
              ) : null}
              <Text as="span" variant="label-default-s" onBackground="neutral-weak" className="eyebrow">
                {eyebrow}
              </Text>
            </Row>
          ) : null}
          {title ? (
            <Heading as="h2" id={`${id}-title`} variant="display-default-xs" wrap="balance">
              {title}
            </Heading>
          ) : null}
          {intro ? (
            <Text as="p" variant="body-default-l" onBackground="neutral-weak">
              {intro}
            </Text>
          ) : null}
        </Column>
      )}
      {children}
    </Column>
  )
}
