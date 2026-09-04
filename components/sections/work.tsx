"use client"

import { ArrowUpRight } from "lucide-react"
import { useState } from "react"
import { Section } from "@/components/layout/section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { CaseStudy, ServiceId } from "@/content/schema"
import { services } from "@/content/services"
import { clientLabel, work } from "@/content/work"
import { cn } from "@/lib/utils"

const statusLabel: Record<CaseStudy["status"], string> = { live: "In production", active: "Active build", design: "In design", concept: "Concept" }
const statusTone: Record<CaseStudy["status"], string> = {
  live: "bg-success/15 text-success",
  active: "bg-primary/15 text-primary",
  design: "bg-warning/15 text-warning",
  concept: "bg-muted text-muted-foreground",
}

function CaseCard({ item }: { item: CaseStudy }) {
  return (
    <Dialog>
      <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-primary">{clientLabel(item.client)}</p>
            <span className={cn("rounded-full px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider", statusTone[item.status])}>{statusLabel[item.status]}</span>
          </div>
          <CardTitle className="text-xl leading-snug">{item.title}</CardTitle>
          <CardDescription className="text-base">{item.summary}</CardDescription>
        </CardHeader>
        <CardContent className="mt-auto flex flex-col gap-4">
          {item.outcomes.length ? (
            <ul className="grid grid-cols-2 gap-3">
              {item.outcomes.slice(0, 2).map((o) => (
                <li key={o.label}>
                  <p className="font-display text-2xl font-semibold" style={{ fontVariationSettings: '"opsz" 72' }}>
                    {o.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{o.label}</p>
                </li>
              ))}
            </ul>
          ) : null}
          <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
            {item.stack.slice(0, 5).map((t) => (
              <li key={t}>
                <Badge variant="secondary" className="font-mono text-[11px] font-normal">
                  {t}
                </Badge>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-2">
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Read the case
              </Button>
            </DialogTrigger>
            {item.links?.map((l) => (
              <Button key={l.href} asChild variant="ghost" size="sm">
                <a href={l.href} target="_blank" rel="noopener">
                  {l.label} <ArrowUpRight className="ml-1 h-3.5 w-3.5" aria-hidden />
                </a>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <p className="text-sm font-medium text-primary">
            {clientLabel(item.client)} · {item.period}
          </p>
          <DialogTitle className="text-2xl leading-snug">{item.title}</DialogTitle>
          <DialogDescription className="text-base">{item.role}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Problem</p>
            <p className="mt-2">{item.problem}</p>
          </section>
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Approach</p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              {item.approach.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </section>
          {item.outcomes.length ? (
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Outcomes</p>
              <ul className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {item.outcomes.map((o) => (
                  <li key={o.label}>
                  <p className="font-display text-2xl font-semibold" style={{ fontVariationSettings: '"opsz" 72' }}>
                      {o.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{o.label}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Stack</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {item.stack.map((t) => (
                <li key={t}>
                  <Badge variant="secondary" className="font-mono text-[11px] font-normal">
                    {t}
                  </Badge>
                </li>
              ))}
            </ul>
          </section>
          {item.links?.length ? (
            <div className="flex flex-wrap gap-2">
              {item.links.map((l) => (
                <Button key={l.href} asChild variant="outline" size="sm">
                  <a href={l.href} target="_blank" rel="noopener">
                    {l.label} <ArrowUpRight className="ml-1 h-3.5 w-3.5" aria-hidden />
                  </a>
                </Button>
              ))}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function Work() {
  const [filter, setFilter] = useState<ServiceId | "all">("all")
  const main = work.items.filter((w) => !w.openSource)
  const oss = work.items.filter((w) => w.openSource)
  const shown = filter === "all" ? main : main.filter((w) => w.line === filter)

  return (
    <Section id="work" eyebrow={work.eyebrow} title={work.title} intro={work.intro}>
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by service">
        {[{ id: "all" as const, title: "All" }, ...services.items.map((s) => ({ id: s.id, title: s.title }))].map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              filter === f.id ? "border-foreground bg-foreground text-background" : "bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {f.title}
          </button>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {shown.map((item) => (
          <CaseCard key={item.slug} item={item} />
        ))}
      </div>

      <h3 className="mt-16 text-2xl">{work.openSourceTitle}</h3>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {oss.map((item) => (
          <CaseCard key={item.slug} item={item} />
        ))}
      </div>
    </Section>
  )
}
