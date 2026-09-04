import { Check } from "lucide-react"
import { Section } from "@/components/layout/section"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { services } from "@/content/services"

export function Services() {
  return (
    <Section id="services" eyebrow={services.eyebrow} title={services.title} intro={services.intro}>
      <div className="grid gap-6 lg:grid-cols-3">
        {services.items.map((s, i) => (
          <Card key={s.id} id={`service-${s.id}`} className="flex flex-col">
            <CardHeader>
              <p className="font-mono text-xs text-muted-foreground">0{i + 1}</p>
              <CardTitle className="text-xl leading-snug">{s.title}</CardTitle>
              <CardDescription className="text-base">{s.oneLiner}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-6">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">What you get</h4>
                <ul className="mt-3 space-y-2 text-sm">
                  {s.youGet.map((line) => (
                    <li key={line} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Typical shape</h4>
                <p className="mt-2 text-sm">{s.shape}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Good fit if</h4>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {s.goodFitIf.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
              <ul className="mt-auto flex flex-wrap gap-1.5 pt-2" aria-label="Stack">
                {s.stack.map((t) => (
                  <li key={t}>
                    <Badge variant="secondary" className="font-mono text-[11px] font-normal">
                      {t}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16">
        <h3 className="text-2xl">{services.principlesTitle}</h3>
        <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.principles.map((p, i) => (
            <li key={p.title} className="border-t pt-4">
              <p className="font-mono text-xs text-primary">0{i + 1}</p>
              <h4 className="mt-1 font-semibold">{p.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
