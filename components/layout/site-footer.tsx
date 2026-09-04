import Link from "next/link"
import { LogoLockup } from "@/components/brand/logo"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { site } from "@/content/site"

export function SiteFooter() {
  const { address, registrations } = site
  return (
    <footer className="border-t bg-muted/40">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <LogoLockup className="text-lg" markClassName="h-10 w-10" />
          <p className="mt-4 max-w-md text-sm text-muted-foreground">{site.description}</p>
        </div>

        <div className="text-sm">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Registered business</h2>
          <address className="mt-3 not-italic leading-relaxed">
            <span className="font-medium">{site.legalName}</span>
            <br />
            A sole proprietorship registered in {address.country}.
            <br />
            Proprietor: Tushar Kendre
            <br />
            {address.lines.map((l) => (
              <span key={l}>
                {l}
                <br />
              </span>
            ))}
            {address.city}, {address.state} {address.pin}
            <br />
            {address.country}
          </address>
          {registrations.gstin || registrations.udyam ? (
            <dl className="mt-3 space-y-1 font-mono text-xs text-muted-foreground">
              {registrations.gstin ? (
                <div className="flex gap-2">
                  <dt>GSTIN</dt>
                  <dd>{registrations.gstin}</dd>
                </div>
              ) : null}
              {registrations.udyam ? (
                <div className="flex gap-2">
                  <dt>Udyam</dt>
                  <dd>{registrations.udyam}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}
        </div>

        <div className="text-sm">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Reach us</h2>
          <ul className="mt-3 space-y-2">
            <li>
              <a className="underline-offset-4 hover:underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li>
              <a className="underline-offset-4 hover:underline" href={site.links.linkedin} rel="me noopener" target="_blank">
                LinkedIn
              </a>
            </li>
            <li>
              <a className="underline-offset-4 hover:underline" href={site.links.github} rel="me noopener" target="_blank">
                GitHub
              </a>
            </li>
          </ul>
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
            <li>
              <Link className="hover:text-foreground" href="/privacy">
                Privacy
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground" href="/terms">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container flex items-center justify-between py-4 text-xs text-muted-foreground">
          <p>
            © {site.established === new Date().getFullYear() ? site.established : `${site.established}–${new Date().getFullYear()}`} {site.legalName}
          </p>
          <ThemeToggle className="h-8 w-8" />
        </div>
      </div>
    </footer>
  )
}
