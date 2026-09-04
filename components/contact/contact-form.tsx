"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, Loader2 } from "lucide-react"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { contact } from "@/content/contact"
import { site } from "@/content/site"
import { contactSchema, type ContactInput } from "@/lib/contact-schema"

export function ContactForm() {
  const startedAt = useMemo(() => Date.now(), [])
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle")

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", company: "", engagement: undefined, budget: "", message: "", website: "", startedAt },
  })

  const values = form.watch()
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent("Project enquiry")}&body=${encodeURIComponent(values.message || "")}`

  async function onSubmit(data: ContactInput) {
    setState("sending")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, startedAt }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setState("sent")
      toast.success(contact.successTitle, { description: contact.successBody })
    } catch {
      setState("failed")
      toast.error("Could not send", { description: contact.errorBody })
    }
  }

  if (state === "sent") {
    return (
      <div role="status" className="flex h-full min-h-72 flex-col items-center justify-center rounded-lg border bg-card p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-success" aria-hidden />
        <h3 className="mt-4 text-2xl">{contact.successTitle}</h3>
        <p className="mt-2 max-w-sm text-muted-foreground">{contact.successBody}</p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate aria-describedby="contact-help">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input autoComplete="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" inputMode="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Company <span className="font-normal text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input autoComplete="organization" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="engagement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What do you need?</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pick the closest fit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {contact.engagementTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Budget <span className="font-normal text-muted-foreground">(optional)</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Not sure yet" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {contact.budgets.map((b) => (
                      <SelectItem key={b.value} value={b.value}>
                        {b.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea rows={6} placeholder="What are you building, where is it today, and what does done look like?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Honeypot — hidden from people, visible to bots */}
        <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" type="text" tabIndex={-1} autoComplete="off" {...form.register("website")} />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" size="lg" disabled={state === "sending"}>
            {state === "sending" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden /> : null}
            Send message
          </Button>
          <p id="contact-help" className="text-sm text-muted-foreground">
            Or email{" "}
            <a className="underline underline-offset-4" href={mailto}>
              {site.email}
            </a>
          </p>
        </div>
        {state === "failed" ? (
          <p role="alert" className="text-sm text-destructive">
            {contact.errorBody}{" "}
            <a className="underline underline-offset-4" href={mailto}>
              {site.email}
            </a>
          </p>
        ) : null}
      </form>
    </Form>
  )
}
