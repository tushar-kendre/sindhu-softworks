import type { Metadata } from "next"
import { LegalPage } from "@/components/layout/legal-page"
import { privacy } from "@/content/legal/privacy"

export const metadata: Metadata = { title: privacy.title, alternates: { canonical: "/privacy" } }

export default function PrivacyPage() {
  return <LegalPage doc={privacy} />
}
