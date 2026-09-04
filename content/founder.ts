import type { Founder } from "./schema"

export const founder = {
  eyebrow: "Founder",
  title: "Sindhu Softworks is the company. Tushar is who you'll work with.",
  person: {
    name: "Tushar Kendre",
    title: "Proprietor and Principal Engineer",
    headshot: "/headshot.jpg",
    headshotAlt: "Portrait of Tushar Kendre",
    bio: [
      "Tushar spent five years shipping 0-to-1 systems in the US before moving back to India and registering Sindhu Softworks in 2026. At Brainwave Science they built real-time EEG inference platforms for P300 concealed-information testing, cut inference latency by 70%, and led a team of ten through deployments to India's National Investigation Agency and Dubai Police under six-year government contracts.",
      "At Patient First.AI they architected the V2 rebuild of a HIPAA vaccination-compliance platform: a DAG-based rules engine, a document OCR pipeline, and a zero-downtime migration that took the product from one university to four. They still lead that work today, now through Sindhu Softworks, alongside AI evaluation programs for LinkedIn and independent builds.",
      "They hold an MS in Computer Science from Boston University and a B.Tech in Aerospace Engineering from IIT Kanpur, published on EEG signal classification at IEEE NCC, and won a student award at the 2021 BCI Meeting for an SSVEP robot controller that hit 99.1% accuracy on live brain signals.",
    ],
    credentials: [
      { label: "MS Computer Science", org: "Boston University", year: "2025" },
      { label: "B.Tech Aerospace Engineering", org: "IIT Kanpur", year: "2020" },
      { label: "IEEE NCC publication, P300 EEG classification", org: "DOI 10.1109/NCC55593.2022.9806815", year: "2022" },
      { label: "Student award, SSVEP robot controller", org: "BCI Meeting", year: "2021" },
    ],
    links: [
      { label: "tushar-kendre.com", href: "https://tushar-kendre.com", kind: "personal" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/tushar-kendre-92b21b144/", kind: "linkedin" },
      { label: "GitHub", href: "https://github.com/tushar-kendre", kind: "github" },
      { label: "IEEE paper", href: "https://doi.org/10.1109/NCC55593.2022.9806815", kind: "paper" },
    ],
  } satisfies Founder,
}
