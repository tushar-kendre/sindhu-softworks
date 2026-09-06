"use client"

import { Button, Column, IconButton, Row, Text, ToggleButton } from "@once-ui-system/core"
import Link from "next/link"
import { useEffect, useState } from "react"
import { LogoLockup } from "@/components/brand/logo"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { hero } from "@/content/hero"
import { site } from "@/content/site"
import { useActiveSection } from "@/hooks/use-active-section"

const ids = site.nav.map((n) => n.id)

export function SiteHeader() {
  const active = useActiveSection(ids)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <Column
      as="header"
      fillWidth
      position="sticky"
      top="0"
      zIndex={9}
      background={scrolled ? "surface" : "transparent"}
      borderBottom={scrolled ? "neutral-alpha-medium" : "transparent"}
      style={{ backdropFilter: scrolled ? "blur(8px)" : undefined, transition: "background 150ms, border-color 150ms" }}
    >
      <a href="#main" className="skip-link">
        <Button size="s" variant="primary" label="Skip to content" />
      </a>
      <Row fillWidth horizontal="center">
        <Row fillWidth maxWidth="xl" paddingX="24" paddingY="12" vertical="center" horizontal="between" gap="16">
          <Link href="/" style={{ display: "inline-flex", textDecoration: "none" }}>
            <LogoLockup scale={0.85} />
          </Link>

          <Row as="nav" aria-label="Primary" gap="4" vertical="center" className="s-flex-hide">
            {site.nav.map((item) => (
              <ToggleButton key={item.id} href={`#${item.id}`} label={item.label} selected={active === item.id} size="m" variant="ghost" />
            ))}
          </Row>

          <Row gap="8" vertical="center">
            <ThemeToggle />
            <Row className="s-flex-hide">
              <Button href={hero.primaryCta.href} size="s" variant="secondary" label={hero.primaryCta.label} suffixIcon="arrowRight" />
            </Row>
            <Row className="s-flex-show">
              <IconButton variant="tertiary" icon={open ? "close" : "menu"} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((v) => !v)} />
            </Row>
          </Row>
        </Row>
      </Row>

      {open ? (
        <Column className="s-flex-show" fillWidth paddingX="24" paddingBottom="16" gap="4" background="surface" borderTop="neutral-alpha-weak">
          <Text as="p" variant="label-default-s" onBackground="neutral-weak" className="eyebrow" paddingY="8">
            Sections
          </Text>
          {site.nav.map((item) => (
            <ToggleButton key={item.id} href={`#${item.id}`} label={item.label} selected={active === item.id} fillWidth horizontal="start" variant="ghost" onClick={() => setOpen(false)} />
          ))}
          <Button href={hero.primaryCta.href} fillWidth variant="secondary" label={hero.primaryCta.label} onClick={() => setOpen(false)} />
        </Column>
      ) : null}
    </Column>
  )
}
