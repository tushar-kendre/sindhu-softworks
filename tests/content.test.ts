import { describe, expect, it } from "vitest"
import { CaseStudySchema, FounderSchema, LegalDocSchema, ProofStatSchema, ServiceSchema, SiteSchema } from "@/content/schema"
import { site } from "@/content/site"
import { services } from "@/content/services"
import { work } from "@/content/work"
import { founder } from "@/content/founder"
import { proof } from "@/content/proof"
import { privacy } from "@/content/legal/privacy"
import { terms } from "@/content/legal/terms"

describe("content validates against schema", () => {
  it("site", () => expect(() => SiteSchema.parse(site)).not.toThrow())
  it("services", () => services.items.forEach((s) => expect(() => ServiceSchema.parse(s)).not.toThrow()))
  it("work", () => work.items.forEach((w) => expect(() => CaseStudySchema.parse(w)).not.toThrow()))
  it("founder", () => expect(() => FounderSchema.parse(founder.person)).not.toThrow())
  it("proof", () => proof.stats.forEach((p) => expect(() => ProofStatSchema.parse(p)).not.toThrow()))
  it("legal", () => {
    expect(() => LegalDocSchema.parse(privacy)).not.toThrow()
    expect(() => LegalDocSchema.parse(terms)).not.toThrow()
  })
  it("work slugs are unique and every service has a case study", () => {
    const slugs = work.items.map((w) => w.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const s of services.items) expect(work.items.some((w) => w.line === s.id)).toBe(true)
  })
})
