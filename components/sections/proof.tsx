import { proof } from "@/content/proof"

export function Proof() {
  return (
    <section id="proof" aria-label="Track record" className="border-y bg-muted/40 py-12 md:py-16">
      <div className="container">
        <dl className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
          {proof.stats.map((s) => (
            <div key={s.label} className="border-l-2 border-primary/50 pl-4">
              <dd className="font-display text-3xl font-semibold tabular-nums md:text-4xl" style={{ fontVariationSettings: '"opsz" 72' }}>
                {s.value}
              </dd>
              <dt className="mt-1 text-sm text-muted-foreground">{s.label}</dt>
              {s.source ? <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground/70">{s.source}</p> : null}
            </div>
          ))}
        </dl>
        <p className="mt-10 text-sm text-muted-foreground">{proof.line}</p>
      </div>
    </section>
  )
}
