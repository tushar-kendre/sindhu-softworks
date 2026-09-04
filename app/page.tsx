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
      <main id="main">
        <Hero />
        <Proof />
        <Services />
        <Work />
        <FounderSection />
        <Contact />
      </main>
      <SiteFooter />
    </>
  )
}
