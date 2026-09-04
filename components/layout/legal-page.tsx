import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { LogoLockup } from "@/components/brand/logo"
import { SiteFooter } from "@/components/layout/site-footer"
import type { LegalDoc } from "@/content/schema"

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" aria-label="Sindhu Softworks home">
            <LogoLockup className="text-base" markClassName="h-8 w-8" />
          </Link>
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to site
          </Link>
        </div>
      </header>
      <main id="main" className="container max-w-3xl py-16 md:py-24">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3 text-4xl font-semibold">{doc.title}</h1>
        <p className="mt-2 font-mono text-xs text-muted-foreground">Last updated {doc.updated}</p>
        <p className="mt-8 text-lg text-muted-foreground">{doc.intro}</p>
        {doc.sections.map((s) => (
          <section key={s.heading} className="mt-10">
            <h2 className="text-2xl">{s.heading}</h2>
            <div className="prose-tight mt-3 leading-relaxed">
              {s.paragraphs.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </main>
      <SiteFooter />
    </>
  )
}
