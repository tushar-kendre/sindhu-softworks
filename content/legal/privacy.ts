import type { LegalDoc } from "../schema"

export const privacy: LegalDoc = {
  title: "Privacy policy",
  updated: "2026-09-05",
  intro:
    "This policy explains what Sindhu Softworks collects when you use this website, why, and what your choices are. It is written in plain language; if anything is unclear, email us.",
  sections: [
    {
      heading: "What we collect",
      paragraphs: [
        "If you use the contact form, we receive the details you type: your name, email address, company (if given), the kind of engagement you are interested in, an optional budget range, and your message.",
        "Our hosting provider records standard server logs (IP address, browser type, pages requested, timestamps) to operate and secure the site. We do not run advertising trackers.",
      ],
    },
    {
      heading: "Why we collect it",
      paragraphs: [
        "To reply to your enquiry and, if we work together, to prepare a proposal. We do not add you to a mailing list and we do not sell or share your details with anyone for marketing.",
      ],
    },
    {
      heading: "Who processes it",
      paragraphs: [
        "The site is hosted on Vercel. Contact form submissions are delivered by Resend to our business inbox. Both act as processors on our behalf under their own security commitments.",
      ],
    },
    {
      heading: "How long we keep it",
      paragraphs: [
        "Enquiry emails are kept for as long as the conversation is live and for up to 24 months afterwards for record-keeping, then deleted. Server logs are retained by the hosting provider for a short rolling window.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        "Under India's Digital Personal Data Protection Act, 2023 and comparable laws elsewhere, you can ask what we hold about you, ask us to correct it, or ask us to delete it. Email the address in the footer and we will respond within a reasonable time.",
      ],
    },
    {
      heading: "Changes",
      paragraphs: ["If this policy changes, the date at the top will change with it."],
    },
  ],
}
