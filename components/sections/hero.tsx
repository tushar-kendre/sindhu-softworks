import { Button } from "@/components/ui/button"
import { hero } from "@/content/hero"
import { LogoMark } from "@/components/brand/logo"
import { PlaygroundShell } from "@/components/signature/playground-shell"

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden pb-16 pt-12 md:pb-24 md:pt-20" aria-labelledby="hero-title">
      {/* soft river-teal wash behind the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_80%_10%,hsl(var(--primary)/0.12),transparent_70%)]"
      />
      <div className="container">
        <div className="max-w-3xl animate-fade-up motion-reduce:animate-none">
          <ul className="mb-6 flex flex-wrap gap-2" aria-label="At a glance">
            {hero.badges.map((b) => (
              <li key={b} className="rounded-full border bg-card px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                {b}
              </li>
            ))}
          </ul>
          <h1 id="hero-title" className="text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl">
            {hero.headline}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">{hero.sub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href={hero.primaryCta.href}>{hero.primaryCta.label}</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={hero.secondaryCta.href}>{hero.secondaryCta.label}</a>
            </Button>
          </div>
          <p className="mt-10 flex items-center gap-2 text-sm text-muted-foreground">
            <LogoMark className="h-5 w-5" tone="mono" /> Sindhu, the river. Many streams, one channel.
          </p>
        </div>
        <div className="mt-14 md:mt-20">
          <PlaygroundShell />
        </div>
      </div>
    </section>
  )
}
