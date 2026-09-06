import type { Founder } from "./schema"

export const founder = {
  index: "04",
  eyebrow: "Founder",
  title: "Sindhu Softworks is the company. Tushar Kendre is the engineer you will work with.",
  person: {
    name: "Tushar Kendre",
    title: "Proprietor and Principal Engineer",
    headshot: "/headshot.jpg",
    headshotAlt: "Portrait of Tushar Kendre",
    bio: [
      "Tushar spent five years building first-release systems in the United States before returning to India and registering Sindhu Softworks in 2026. At Brainwave Science, Tushar built real-time EEG inference platforms for P300 concealed-information testing, reduced inference latency by 70 percent, and led a team of ten through deployments to India's National Investigation Agency and Dubai Police under six-year government contracts.",
      "At Patient First.AI, Tushar architected the V2 rebuild of a HIPAA vaccination-compliance platform: a graph-based rules engine, a document OCR pipeline, and a migration with no downtime that took the product from one university to four. That work continues today through Sindhu Softworks, alongside AI evaluation programs for LinkedIn and independent builds.",
      "Tushar holds an MS in Computer Science from Boston University and a B.Tech in Aerospace Engineering from IIT Kanpur, has published on EEG signal classification at IEEE NCC, and received a student award at the 2021 BCI Meeting for an SSVEP robot controller that reached 99.1 percent accuracy on live brain signals.",
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
