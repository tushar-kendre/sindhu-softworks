import { Column, Grid, Icon, Row, Text } from "@once-ui-system/core"
import { ContactForm } from "@/components/contact/contact-form"
import { Section } from "@/components/layout/section"
import { contact } from "@/content/contact"
import { site } from "@/content/site"

function Item({ icon, k, children }: { icon: "mail" | "clock" | "mapPin"; k: string; children: React.ReactNode }) {
  return (
    <Row gap="12" vertical="start" paddingY="12" borderBottom="neutral-alpha-weak">
      <Icon name={icon} size="s" onBackground="brand-medium" style={{ marginTop: "0.15rem" }} />
      <Column gap="4">
        <Text as="p" variant="label-default-s" onBackground="neutral-weak" className="eyebrow">
          {k}
        </Text>
        <Text as="div" variant="body-default-s">
          {children}
        </Text>
      </Column>
    </Row>
  )
}

export function Contact() {
  return (
    <Section id="contact" index={contact.index} eyebrow={contact.eyebrow} title={contact.title} intro={contact.intro}>
      <Grid columns="5" gap="48" s={{ columns: 1, gap: "32" }}>
        <Column gap="0" style={{ gridColumn: "span 2" }}>
          <Item icon="mail" k="Email">
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </Item>
          <Item icon="clock" k="Response time">
            Replies {site.responseTime}. Calls are scheduled across IST and US Eastern.
          </Item>
          <Item icon="mapPin" k="Based in">
            {site.address.city}, {site.address.country}. Working with teams in India and the United States.
          </Item>
        </Column>
        <Column style={{ gridColumn: "span 3" }} background="surface" border="neutral-alpha-medium" radius="s" padding="24">
          <ContactForm />
        </Column>
      </Grid>
    </Section>
  )
}
