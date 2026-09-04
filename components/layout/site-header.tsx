"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { useEffect, useState } from "react"
import { LogoLockup, LogoMark } from "@/components/brand/logo"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { site } from "@/content/site"
import { hero } from "@/content/hero"
import { useActiveSection } from "@/hooks/use-active-section"
import { cn } from "@/lib/utils"

const ids = site.nav.map((n) => n.id)

export function SiteHeader() {
  const active = useActiveSection(ids)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors",
        scrolled ? "border-border bg-background/85 backdrop-blur-md" : "border-transparent bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`${site.name} home`}>
          <LogoLockup className="text-base" markClassName="h-8 w-8" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {site.nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? "location" : undefined}
              className={cn(
                "relative rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active === item.id && "text-foreground after:absolute after:inset-x-3 after:-bottom-[1px] after:h-0.5 after:rounded-full after:bg-accent",
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden md:inline-flex">
            <a href={hero.primaryCta.href}>{hero.primaryCta.label}</a>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="flex items-center gap-2 text-base">
                <LogoMark className="h-6 w-6" /> {site.name}
              </SheetTitle>
              <nav aria-label="Mobile" className="mt-8 flex flex-col gap-1">
                {site.nav.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className={cn("rounded-md px-3 py-2.5 text-base font-medium hover:bg-muted", active === item.id && "bg-muted")}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <Button asChild className="mt-8 w-full">
                <a href={hero.primaryCta.href} onClick={() => setOpen(false)}>
                  {hero.primaryCta.label}
                </a>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
