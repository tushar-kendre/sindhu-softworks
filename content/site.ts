import type { Site } from "./schema"

const url = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://sindhusoftworks.com"

/**
 * Registration details transcribed from the GST certificate (Form GST REG-06, issued 2026-08-13).
 * GSTIN / Udyam render in the footer only when present.
 */
export const site: Site = {
  name: "Sindhu Softworks",
  legalName: "Sindhu Softworks",
  proprietor: "Tushar Pradeep Kendre",
  tagline: "Software where the logic is visible.",
  description:
    "Sindhu Softworks is an independent software engineering practice in India. We build rules engines, compliance platforms and AI evaluation tooling for teams that need to explain every decision their system makes.",
  url,
  email: "tushar@sindhusoftworks.com",
  responseTime: "within two business days (IST)",
  address: {
    lines: ["Bungalow A-28, Silver Spring Villa", "Venkateshwara G, Khopegaon"],
    city: "Latur",
    state: "Maharashtra",
    pin: "413531",
    country: "India",
  },
  registrations: {
    gstin: "27ELRPK0214C1ZD",
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
