import { NextResponse } from "next/server"
import { Resend } from "resend"
import { contactSchema } from "@/lib/contact-schema"
import { contact } from "@/content/contact"
import { site } from "@/content/site"

export const runtime = "nodejs"

const MIN_FILL_MS = 3000

export async function POST(req: Request) {
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ ok: false, error: "Unsupported content type" }, { status: 415 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 })
  }
  const data = parsed.data

  // Silent accept for bots: honeypot filled or submitted faster than a human could type.
  if (data.website || Date.now() - data.startedAt < MIN_FILL_MS) {
    return NextResponse.json({ ok: true })
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL || "Sindhu Softworks <onboarding@resend.dev>"
  if (!apiKey || !to) {
    console.error("[contact] RESEND_API_KEY or CONTACT_TO_EMAIL missing")
    return NextResponse.json({ ok: false, error: "Mail is not configured" }, { status: 503 })
  }

  const engagementLabel = contact.engagementTypes.find((e) => e.value === data.engagement)?.label ?? data.engagement
  const budgetLabel = contact.budgets.find((b) => b.value === data.budget)?.label
  const text = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.company ? `Company: ${data.company}` : null,
    `Engagement: ${engagementLabel}`,
    budgetLabel ? `Budget: ${budgetLabel}` : null,
    "",
    data.message,
  ]
    .filter((l) => l !== null)
    .join("\n")

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `[Lead] ${engagementLabel} — ${data.name}`,
      text,
    })
    if (error) throw error
  } catch (err) {
    console.error("[contact] send failed", err)
    return NextResponse.json({ ok: false, error: `Could not send. Email ${site.email} directly.` }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
