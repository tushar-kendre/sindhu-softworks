import { describe, expect, it } from "vitest"
import { contactSchema } from "@/lib/contact-schema"

const valid = {
  name: "Asha Rao",
  email: "asha@example.com",
  company: "",
  engagement: "fractional" as const,
  budget: "",
  message: "We have a validated idea and need an MVP built in a quarter.",
  website: "",
  startedAt: Date.now() - 10_000,
}

describe("contact schema", () => {
  it("accepts a well-formed submission", () => expect(contactSchema.safeParse(valid).success).toBe(true))
  it("rejects a bad email", () => expect(contactSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false))
  it("rejects a too-short message", () => expect(contactSchema.safeParse({ ...valid, message: "hi" }).success).toBe(false))
  it("rejects an unknown engagement type", () => expect(contactSchema.safeParse({ ...valid, engagement: "x" }).success).toBe(false))
  it("keeps the honeypot value so the route can silently drop bots", () => {
    const r = contactSchema.safeParse({ ...valid, website: "http://spam.example" })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.website).toBe("http://spam.example")
  })
})
