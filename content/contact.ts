export const contact = {
  eyebrow: "Contact",
  title: "Tell us what you're building",
  intro:
    "A few sentences is enough. You'll get a reply from Tushar, not a form-bot, and a first call is free.",
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
  successTitle: "Got it.",
  successBody: "Your message is on its way. Expect a reply within two business days.",
  errorBody: "The form could not send. You can email us directly instead:",
}
