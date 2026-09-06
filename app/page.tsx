import { Column } from "@once-ui-system/core"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { Contact } from "@/components/sections/contact"
import { FounderSection } from "@/components/sections/founder"
import { Hero } from "@/components/sections/hero"
import { Proof } from "@/components/sections/proof"
import { Services } from "@/components/sections/services"
import { Work } from "@/components/sections/work"

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <Column as="main" id="main" fillWidth horizontal="center">
        <Hero />
        <Column fillWidth maxWidth="l" paddingX="24">
          <Proof />
          <Services />
          <Work />
          <FounderSection />
          <Contact />
        </Column>
      </Column>
      <SiteFooter />
    </>
  )
}
