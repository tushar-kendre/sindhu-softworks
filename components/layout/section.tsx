import { cn } from "@/lib/utils"

type Props = {
  id: string
  eyebrow?: string
  title?: string
  intro?: string
  className?: string
  children: React.ReactNode
  /** Constrain heading width */
  narrow?: boolean
}

export function Section({ id, eyebrow, title, intro, className, children, narrow = true }: Props) {
  return (
    <section id={id} className={cn("scroll-mt-20 py-20 md:py-28", className)} aria-labelledby={title ? `${id}-title` : undefined}>
      <div className="container">
        {(eyebrow || title || intro) && (
          <header className={cn("mb-12 md:mb-16", narrow && "max-w-2xl")}>
            {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
            {title ? (
              <h2 id={`${id}-title`} className="text-3xl font-semibold md:text-4xl">
                {title}
              </h2>
            ) : null}
            {intro ? <p className="mt-4 text-lg text-muted-foreground">{intro}</p> : null}
          </header>
        )}
        {children}
      </div>
    </section>
  )
}
