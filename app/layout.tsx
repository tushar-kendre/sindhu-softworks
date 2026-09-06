import "@once-ui-system/core/css/styles.css"
import "@once-ui-system/core/css/tokens.css"
import "@/resources/custom.css"

import type { Metadata, Viewport } from "next"
import { Column, ThemeInit } from "@once-ui-system/core"
import { Providers } from "@/components/providers"
import { AppToaster } from "@/components/layout/app-toaster"
import { site } from "@/content/site"
import { jsonLd } from "@/lib/seo"
import { dataStyle, fonts, style } from "@/resources/once-ui.config"

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: "/",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9faff" },
    { media: "(prefers-color-scheme: dark)", color: "#080811" },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fonts.heading.variable} ${fonts.body.variable} ${fonts.label.variable} ${fonts.code.variable}`}>
      <head>
        <ThemeInit
          config={{
            theme: style.theme,
            brand: style.brand,
            accent: style.accent,
            neutral: style.neutral,
            solid: style.solid,
            "solid-style": style.solidStyle,
            border: style.border,
            surface: style.surface,
            transition: style.transition,
            scaling: style.scaling,
            "viz-style": dataStyle.variant,
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />
      </head>
      <Providers>
        <Column as="body" background="page" fillWidth margin="0" padding="0">
          {children}
          <AppToaster />
        </Column>
      </Providers>
    </html>
  )
}
