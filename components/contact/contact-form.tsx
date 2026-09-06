"use client"

import { Button, Column, Grid, Input, Row, Text, Textarea, useToast } from "@once-ui-system/core"
import { useState } from "react"
import { NativeSelect } from "@/components/signature/native-select"
import { contact } from "@/content/contact"
import { site } from "@/content/site"

type Fields = { name: string; company: string; engagement: string; message: string }

/**
 * No back end: the form composes an email and opens the visitor's own mail app, so the
 * message arrives from their address with a structured subject and body. The plain
 * address and a copy button cover visitors without a configured mail client.
 */
export function ContactForm() {
  const { addToast } = useToast()
  const [fields, setFields] = useState<Fields>({ name: "", company: "", engagement: "", message: "" })
  const [opened, setOpened] = useState(false)
  const set = (k: keyof Fields) => (v: string) => setFields((f) => ({ ...f, [k]: v }))

  const engagementLabel = contact.engagementTypes.find((t) => t.value === fields.engagement)?.label
  const subject = `[Enquiry] ${engagementLabel ?? "Project"}${fields.name ? ` — ${fields.name}` : ""}`
  const body = [
    fields.name ? `Name: ${fields.name}` : null,
    fields.company ? `Company: ${fields.company}` : null,
    engagementLabel ? `Engagement: ${engagementLabel}` : null,
    "",
    fields.message || "What is being built, where it stands today, and what a finished result looks like:",
    "",
  ]
    .filter((l) => l !== null)
    .join("\n")
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setOpened(true)
    window.location.href = mailto
  }

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(site.email)
      addToast({ variant: "success", message: `${site.email} copied` })
    } catch {
      addToast({ variant: "danger", message: `Could not copy. The address is ${site.email}` })
    }
  }

  return (
    <form onSubmit={submit}>
      <Column gap="16">
        <Grid columns="2" gap="16" s={{ columns: 1 }}>
          <Input id="name" label="Name" autoComplete="name" value={fields.name} onChange={(e) => set("name")(e.target.value)} />
          <Input id="company" label="Company (optional)" autoComplete="organization" value={fields.company} onChange={(e) => set("company")(e.target.value)} />
        </Grid>
        <NativeSelect
          id="engagement"
          label="Engagement type"
          placeholder="Choose the closest fit"
          options={contact.engagementTypes.map((t) => ({ label: t.label, value: t.value }))}
          value={fields.engagement}
          onChange={set("engagement")}
        />
        <Textarea
          id="message"
          label="Message"
          lines={6}
          placeholder="What is being built, where it stands today, and what a finished result looks like."
          value={fields.message}
          onChange={(e) => set("message")(e.target.value)}
        />
        <Row gap="16" vertical="center" wrap paddingTop="8">
          <Button type="submit" size="m" variant="primary" label={contact.submitLabel} suffixIcon="arrowUpRight" />
          <Button type="button" size="m" variant="tertiary" label="Copy address" prefixIcon="mail" onClick={copyAddress} />
        </Row>
        <Text as="p" variant="body-default-xs" onBackground="neutral-weak">
          {opened ? contact.openedNote : contact.note} <a href={`mailto:${site.email}`}>{site.email}</a>
        </Text>
      </Column>
    </form>
  )
}
