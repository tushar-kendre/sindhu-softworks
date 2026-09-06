import { Column, Grid, Line, Row, SmartLink, Text } from "@once-ui-system/core"
import Link from "next/link"
import { LogoLockup } from "@/components/brand/logo"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { site } from "@/content/site"

function Spec({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <Row gap="16" paddingY="8" borderBottom="neutral-alpha-weak" vertical="start">
      <Text as="dt" variant="code-default-s" onBackground="neutral-weak" style={{ minWidth: "7.5rem" }}>
        {k}
      </Text>
      <Text as="dd" variant="body-default-s" onBackground="neutral-strong" style={{ margin: 0 }}>
        {children}
      </Text>
    </Row>
  )
}

const year = new Date().getFullYear()

export function SiteFooter() {
  const { address, registrations } = site
  return (
    <Column as="footer" fillWidth horizontal="center" borderTop="neutral-alpha-medium" paddingTop="64" paddingBottom="32">
      <Column fillWidth maxWidth="l" paddingX="24" gap="48">
        <Grid columns="3" gap="48" s={{ columns: 1 }}>
          <Column gap="16">
            <LogoLockup scale={0.9} />
            <Text as="p" variant="body-default-s" onBackground="neutral-weak" style={{ maxWidth: "28rem" }}>
              {site.description}
            </Text>
          </Column>

          <Column as="dl" gap="0" style={{ margin: 0 }}>
            <Text as="p" variant="label-default-s" onBackground="neutral-weak" className="eyebrow" paddingBottom="8">
              Registered business
            </Text>
            <Spec k="Trade name">{site.legalName}</Spec>
            <Spec k="Constitution">Sole proprietorship, {address.country}</Spec>
            <Spec k="Proprietor">{site.proprietor}</Spec>
            <Spec k="Address">
              {address.lines.map((l) => (
                <span key={l}>
                  {l}
                  <br />
                </span>
              ))}
              {address.city}, {address.state} {address.pin}
            </Spec>
            {registrations.gstin ? <Spec k="GSTIN">{registrations.gstin}</Spec> : null}
            {registrations.udyam ? <Spec k="Udyam">{registrations.udyam}</Spec> : null}
          </Column>

          <Column gap="0">
            <Text as="p" variant="label-default-s" onBackground="neutral-weak" className="eyebrow" paddingBottom="8">
              Contact
            </Text>
            <Column as="ul" gap="0" style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <li>
                <SmartLink href={`mailto:${site.email}`}>{site.email}</SmartLink>
              </li>
              <li>
                <SmartLink href={site.links.linkedin}>LinkedIn</SmartLink>
              </li>
              <li>
                <SmartLink href={site.links.github}>GitHub</SmartLink>
              </li>
              <li>
                <SmartLink href={site.links.personal}>tushar-kendre.com</SmartLink>
              </li>
            </Column>
            <Row gap="16" paddingTop="24">
              <Link href="/privacy">
                <Text variant="label-default-s" onBackground="neutral-weak">
                  Privacy
                </Text>
              </Link>
              <Link href="/terms">
                <Text variant="label-default-s" onBackground="neutral-weak">
                  Terms
                </Text>
              </Link>
            </Row>
          </Column>
        </Grid>

        <Line background="neutral-alpha-weak" />
        <Row horizontal="between" vertical="center" gap="16">
          <Text as="p" variant="code-default-xs" onBackground="neutral-weak">
            © {site.established === year ? site.established : `${site.established}–${year}`} {site.legalName}
          </Text>
          <ThemeToggle />
        </Row>
      </Column>
    </Column>
  )
}
