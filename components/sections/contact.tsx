import { Clock, Mail, MapPin } from "lucide-react"
import { ContactForm } from "@/components/contact/contact-form"
import { Section } from "@/components/layout/section"
import { contact } from "@/content/contact"
import { site } from "@/content/site"

export function Contact() {
  return (
    <Section id="contact" eyebrow={contact.eyebrow} title={contact.title} intro={contact.intro}>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <ul className="space-y-6 text-sm">
          <li className="flex gap-3">
            <Mail className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
            <div>
              <p className="font-medium">Email</p>
              <a className="text-muted-foreground underline-offset-4 hover:underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </div>
          </li>
          <li className="flex gap-3">
            <Clock className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
            <div>
              <p className="font-medium">Response time</p>
              <p className="text-muted-foreground">We reply {site.responseTime}. Calls are scheduled across IST and US Eastern.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <MapPin className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
            <div>
              <p className="font-medium">Based in</p>
              <p className="text-muted-foreground">
                {site.address.city}, {site.address.country}. Working with teams in India and the United States.
              </p>
            </div>
          </li>
        </ul>
        <div className="relative rounded-xl border bg-card p-6 shadow-sm md:p-8">
          <ContactForm />
        </div>
      </div>
    </Section>
  )
}
