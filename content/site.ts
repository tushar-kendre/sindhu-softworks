import type { Site } from "./schema"

const url = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000"

/**
 * TODO(launch): replace every "TODO" value below with the registered details.
 * GSTIN / Udyam render in the footer only when present.
 */
export const site: Site = {
  name: "Sindhu Softworks",
  legalName: "Sindhu Softworks",
  tagline: "Software where the logic is visible.",
  description:
    "Sindhu Softworks is an independent software engineering practice in India. We build rules engines, compliance platforms and AI evaluation tooling for teams that need to explain every decision their system makes.",
  url,
  email: "hello@sindhusoftworks.com",
  responseTime: "within two business days (IST)",
  address: {
    lines: ["TODO: registered street address"],
    city: "TODO: City",
    state: "TODO: State",
    pin: "TODO: PIN",
    country: "India",
  },
  registrations: {
    gstin: undefined,
    udyam: undefined,
  },
  links: {
    linkedin: "https://www.linkedin.com/in/tushar-kendre-92b21b144/",
    github: "https://github.com/tushar-kendre",
    personal: "https://tushar-kendre.com",
  },
  nav: [
    { id: "services", label: "Services" },
    { id: "work", label: "Work" },
    { id: "founder", label: "Founder" },
    { id: "contact", label: "Contact" },
  ],
  established: 2026,
}
