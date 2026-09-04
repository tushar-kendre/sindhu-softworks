import type { LegalDoc } from "../schema"

export const terms: LegalDoc = {
  title: "Terms of use",
  updated: "2026-09-05",
  intro:
    "These terms cover use of this website. Engagements with Sindhu Softworks are governed by a separate written agreement.",
  sections: [
    {
      heading: "The site",
      paragraphs: [
        "This website is published by Sindhu Softworks, a sole proprietorship registered in India. Its content is provided for general information about our services and is not professional, legal or medical advice.",
      ],
    },
    {
      heading: "The interactive demo",
      paragraphs: [
        "The rules-engine playground on the home page is an illustration. It is not a medical or compliance tool and must not be used to make decisions about any real person's immunization status.",
      ],
    },
    {
      heading: "Content and trademarks",
      paragraphs: [
        "The Sindhu Softworks name and confluence mark are our trademarks. Client names and marks belong to their respective owners and appear with permission. You may link to this site freely.",
      ],
    },
    {
      heading: "No warranty",
      paragraphs: [
        "The site is provided as is. We aim to keep it accurate and available but do not guarantee either, and we are not liable for loss arising from reliance on its content.",
      ],
    },
    {
      heading: "Governing law",
      paragraphs: ["These terms are governed by the laws of India."],
    },
  ],
}
