export const contact = {
  index: "05",
  eyebrow: "Contact",
  title: "Describe what you are building",
  intro:
    "A few sentences are enough. Replies come from Tushar directly, and an initial call carries no charge.",
  engagementTypes: [
    { value: "product-engineering", label: "Product engineering (regulated domain)" },
    { value: "ai-evaluation", label: "AI evaluation or data program" },
    { value: "fractional", label: "Fractional architecture or MVP" },
    { value: "other", label: "Something else" },
  ],
  budgets: [
    { value: "unsure", label: "Not sure yet" },
    { value: "lt-5k", label: "Under $5k / ₹4L" },
    { value: "5k-20k", label: "$5k – $20k / ₹4L – ₹17L" },
    { value: "20k-50k", label: "$20k – $50k / ₹17L – ₹42L" },
    { value: "gt-50k", label: "Above $50k / ₹42L" },
  ],
  successTitle: "Message received.",
  successBody: "Expect a reply within two business days.",
  errorBody: "The form could not be sent. Email directly instead:",
}
