"use client"

import { Button, Column, Grid, Icon, Input, Row, Select, Text, Textarea, useToast } from "@once-ui-system/core"
import { useEffect, useRef, useState } from "react"
import { contact } from "@/content/contact"
import { site } from "@/content/site"
import { contactSchema, type ContactInput } from "@/lib/contact-schema"

type Fields = Omit<ContactInput, "startedAt" | "website">
type Errors = Partial<Record<keyof Fields, string>>

const empty: Fields = { name: "", email: "", company: "", engagement: "product-engineering", budget: "", message: "" }

export function ContactForm() {
  // Recorded after mount so the server render stays pure; used by the API to reject bot-fast submissions.
  const startedAt = useRef(0)
  useEffect(() => {
    startedAt.current = Date.now()
  }, [])
  const { addToast } = useToast()
  const [fields, setFields] = useState<Fields>(empty)
  const [engagementTouched, setEngagementTouched] = useState(false)
  const [website, setWebsite] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle")

  const set = (k: keyof Fields) => (v: string) => setFields((f) => ({ ...f, [k]: v }))
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent("Project enquiry")}&body=${encodeURIComponent(fields.message)}`

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = contactSchema.safeParse({ ...fields, website, startedAt: startedAt.current || Date.now() })
    if (!parsed.success) {
      const next: Errors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Fields
        if (key && !next[key]) next[key] = issue.message
      }
      setErrors(next)
      return
    }
    setErrors({})
    setState("sending")
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(parsed.data) })
      if (!res.ok) throw new Error(String(res.status))
      setState("sent")
      addToast({ variant: "success", message: `${contact.successTitle} ${contact.successBody}` })
    } catch {
      setState("failed")
      addToast({ variant: "danger", message: contact.errorBody })
    }
  }

  if (state === "sent") {
    return (
      <Column role="status" center gap="12" minHeight={18}>
        <Icon name="checkCircle" size="l" onBackground="success-medium" />
        <Text as="p" variant="heading-default-l" style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem" }}>
          {contact.successTitle}
        </Text>
        <Text as="p" variant="body-default-m" onBackground="neutral-weak" align="center">
          {contact.successBody}
        </Text>
      </Column>
    )
  }

  return (
    <form onSubmit={submit} noValidate>
      <Column gap="16">
        <Grid columns="2" gap="16" s={{ columns: 1 }}>
          <Input id="name" label="Name" autoComplete="name" value={fields.name} onChange={(e) => set("name")(e.target.value)} error={!!errors.name} errorMessage={errors.name} />
          <Input id="email" label="Email" type="email" inputMode="email" autoComplete="email" value={fields.email} onChange={(e) => set("email")(e.target.value)} error={!!errors.email} errorMessage={errors.email} />
        </Grid>
        <Input id="company" label="Company (optional)" autoComplete="organization" value={fields.company ?? ""} onChange={(e) => set("company")(e.target.value)} />
        <Grid columns="2" gap="16" s={{ columns: 1 }}>
          <Select
            id="engagement"
            label="Engagement type"
            options={contact.engagementTypes.map((t) => ({ label: t.label, value: t.value }))}
            value={engagementTouched ? fields.engagement : ""}
            onSelect={(v) => {
              setEngagementTouched(true)
              set("engagement")(String(v))
            }}
            error={!!errors.engagement}
            errorMessage={errors.engagement}
          />
          <Select id="budget" label="Budget (optional)" options={contact.budgets.map((b) => ({ label: b.label, value: b.value }))} value={fields.budget ?? ""} onSelect={(v) => set("budget")(String(v))} />
        </Grid>
        <Textarea
          id="message"
          label="Message"
          lines={6}
          placeholder="What is being built, where it stands today, and what a finished result looks like."
          value={fields.message}
          onChange={(e) => set("message")(e.target.value)}
          error={!!errors.message}
          errorMessage={errors.message}
        />
        {/* Honeypot: hidden from people, filled by bots */}
        <div style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }} aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
        <Row gap="16" vertical="center" wrap paddingTop="8">
          <Button type="submit" size="m" variant="primary" label="Send message" loading={state === "sending"} disabled={state === "sending"} suffixIcon="arrowRight" />
          <Text as="p" variant="body-default-s" onBackground="neutral-weak">
            Or email <a href={mailto}>{site.email}</a>
          </Text>
        </Row>
        {state === "failed" ? (
          <Text as="p" role="alert" variant="body-default-s" onBackground="danger-medium">
            {contact.errorBody} <a href={mailto}>{site.email}</a>
          </Text>
        ) : null}
      </Column>
    </form>
  )
}
