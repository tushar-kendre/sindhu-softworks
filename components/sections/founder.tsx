import Image from "next/image"
import { ArrowUpRight, FileText, Github, Globe, Linkedin } from "lucide-react"
import { Section } from "@/components/layout/section"
import { Button } from "@/components/ui/button"
import { founder } from "@/content/founder"

const icons = { personal: Globe, linkedin: Linkedin, github: Github, paper: FileText }

export function FounderSection() {
  const p = founder.person
  return (
    <Section id="founder" eyebrow={founder.eyebrow} title={founder.title} className="bg-muted/40">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-16">
        <div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl border bg-card">
            <Image src={p.headshot} alt={p.headshotAlt} fill sizes="(min-width: 1024px) 320px, 100vw" className="object-cover" priority={false} />
          </div>
          <h3 className="mt-5 text-2xl">{p.name}</h3>
          <p className="text-muted-foreground">{p.title}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {p.links.map((l) => {
              const Icon = icons[l.kind]
              return (
                <li key={l.href}>
                  <Button asChild variant="outline" size="sm">
                    <a href={l.href} target="_blank" rel="me noopener">
                      <Icon className="mr-1.5 h-3.5 w-3.5" aria-hidden /> {l.label} <ArrowUpRight className="ml-1 h-3 w-3 opacity-60" aria-hidden />
                    </a>
                  </Button>
                </li>
              )
            })}
          </ul>
        </div>
        <div>
          <div className="prose-tight max-w-2xl text-base leading-relaxed md:text-lg">
            {p.bio.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>
          <h4 className="mt-10 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Credentials</h4>
          <ul className="mt-3 divide-y border-y">
            {p.credentials.map((c) => (
              <li key={c.label} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3 text-sm">
                <span className="font-medium">{c.label}</span>
                <span className="text-muted-foreground">
                  {c.org}
                  {c.year ? <span className="ml-2 font-mono text-xs">{c.year}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
