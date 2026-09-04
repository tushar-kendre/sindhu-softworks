import type { Metadata } from "next"
import { LegalPage } from "@/components/layout/legal-page"
import { terms } from "@/content/legal/terms"

export const metadata: Metadata = { title: terms.title, alternates: { canonical: "/terms" } }

export default function TermsPage() {
  return <LegalPage doc={terms} />
}
