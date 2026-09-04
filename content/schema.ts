import { z } from "zod"

export const serviceIds = ["product-engineering", "ai-evaluation", "fractional"] as const
export const ServiceId = z.enum(serviceIds)
export type ServiceId = z.infer<typeof ServiceId>

export const SiteSchema = z.object({
  name: z.string(),
  legalName: z.string(),
  tagline: z.string(),
  description: z.string(),
  url: z.string().url(),
  email: z.string().email(),
  responseTime: z.string(),
  address: z.object({
    lines: z.array(z.string()),
    city: z.string(),
    state: z.string(),
    pin: z.string(),
    country: z.string(),
  }),
  registrations: z.object({
    gstin: z.string().optional(),
    udyam: z.string().optional(),
  }),
  links: z.object({ linkedin: z.string().url(), github: z.string().url(), personal: z.string().url() }),
  nav: z.array(z.object({ id: z.string(), label: z.string() })),
  established: z.number().int(),
})
export type Site = z.infer<typeof SiteSchema>

export const ServiceSchema = z.object({
  id: ServiceId,
  title: z.string(),
  oneLiner: z.string(),
  youGet: z.array(z.string()).min(3),
  shape: z.string(),
  goodFitIf: z.array(z.string()).min(2),
  stack: z.array(z.string()),
})
export type Service = z.infer<typeof ServiceSchema>

export const PrincipleSchema = z.object({ title: z.string(), body: z.string() })
export type Principle = z.infer<typeof PrincipleSchema>

export const CaseStudySchema = z.object({
  slug: z.string(),
  title: z.string(),
  line: ServiceId,
  client: z.object({
    name: z.string(),
    /** false → render sector/region instead of the name everywhere */
    public: z.boolean(),
    sector: z.string(),
    region: z.string(),
  }),
  role: z.string(),
  period: z.string(),
  summary: z.string(),
  problem: z.string(),
  approach: z.array(z.string()).min(1),
  outcomes: z.array(z.object({ label: z.string(), value: z.string() })),
  stack: z.array(z.string()),
  status: z.enum(["live", "active", "design", "concept"]),
  featured: z.boolean(),
  openSource: z.boolean().optional(),
  links: z.array(z.object({ label: z.string(), href: z.string().url() })).optional(),
})
export type CaseStudy = z.infer<typeof CaseStudySchema>

export const ProofStatSchema = z.object({
  value: z.string(),
  label: z.string(),
  source: z.string().optional(),
})
export type ProofStat = z.infer<typeof ProofStatSchema>

export const FounderSchema = z.object({
  name: z.string(),
  title: z.string(),
  headshot: z.string(),
  headshotAlt: z.string(),
  bio: z.array(z.string()).min(1),
  credentials: z.array(z.object({ label: z.string(), org: z.string(), year: z.string().optional() })),
  links: z.array(z.object({ label: z.string(), href: z.string().url(), kind: z.enum(["personal", "linkedin", "github", "paper"]) })),
})
export type Founder = z.infer<typeof FounderSchema>

export const LegalDocSchema = z.object({
  title: z.string(),
  updated: z.string(),
  intro: z.string(),
  sections: z.array(z.object({ heading: z.string(), paragraphs: z.array(z.string()).min(1) })),
})
export type LegalDoc = z.infer<typeof LegalDocSchema>
