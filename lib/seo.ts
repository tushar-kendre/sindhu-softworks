import { site } from "@/content/site"
import { founder } from "@/content/founder"

export function jsonLd() {
  const person = {
    "@type": "Person",
    "@id": `${site.url}/#founder`,
    name: founder.person.name,
    jobTitle: founder.person.title,
    url: site.links.personal,
    sameAs: [site.links.linkedin, site.links.github, site.links.personal],
    worksFor: { "@id": `${site.url}/#org` },
  }
  const org = {
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${site.url}/#org`,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}/logo/mark-512.png`,
    email: site.email,
    foundingDate: String(site.established),
    founder: { "@id": person["@id"] },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.lines.join(", "),
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.pin,
      addressCountry: "IN",
    },
    areaServed: ["IN", "US"],
    ...(site.registrations.gstin ? { taxID: site.registrations.gstin } : {}),
  }
  return { "@context": "https://schema.org", "@graph": [org, person] }
}
