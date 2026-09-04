import { z } from "zod"

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name").max(120),
  email: z.string().trim().email("That email doesn't look right").max(200),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  engagement: z.enum(["product-engineering", "ai-evaluation", "fractional", "other"], { message: "Pick the closest fit" }),
  budget: z.string().max(40).optional().or(z.literal("")),
  message: z.string().trim().min(20, "A couple of sentences helps us reply well").max(4000),
  /** Honeypot: real people never fill this */
  website: z.string().max(500).optional(),
  /** Epoch ms when the form was rendered; rejects bot-fast submits */
  startedAt: z.number().int().positive(),
})

export type ContactInput = z.infer<typeof contactSchema>
