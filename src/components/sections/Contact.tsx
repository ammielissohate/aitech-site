import { Mail, MapPin, MessageCircle } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { contactSection } from "@/data/contact";
import { pillars } from "@/data/services";
import { siteConfig } from "@/data/site";
import { normalizeWhatsAppNumber } from "@/lib/contact";
import { ContactForm } from "./ContactForm";

/** Section 9 — Contact : explication du fonctionnement, coordonnées directes et formulaire. */
export function Contact() {
  const { email, whatsapp, location } = siteConfig.contact;
  const whatsappDigits = normalizeWhatsAppNumber(whatsapp);

  return (
    <Section id="contact" tone="darker" labelledBy="contact-title">
      <div aria-hidden="true" className="absolute -top-32 -left-32 size-96 rounded-full bg-brand/15 blur-[120px]" />
      {/* Ancres « /#contact-<pilier> » : le navigateur défile ici et le formulaire présélectionne le service. */}
      {pillars.map((pillar) => (
        // Hauteur de 1px : le routeur Next ignore les éléments sans dimension lors du défilement vers une ancre.
        <span key={pillar.slug} id={`contact-${pillar.slug}`} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px" />
      ))}
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <SectionHeading id="contact-title" {...contactSection} />

          <ol className="reveal mt-10 space-y-4">
            {contactSection.howItWorks.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-brand-3/30 font-display text-xs font-semibold text-brand-3">
                  {index + 1}
                </span>
                <span className="pt-1 text-muted">{step}</span>
              </li>
            ))}
          </ol>

          {(email || whatsappDigits || location) && (
            <ul className="reveal mt-10 space-y-3 border-t border-line pt-8 text-sm">
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="inline-flex items-center gap-3 text-white hover:text-brand-3">
                    <Mail aria-hidden="true" className="size-4 text-brand-3" /> {email}
                  </a>
                </li>
              )}
              {whatsappDigits && (
                <li>
                  <a
                    href={`https://wa.me/${whatsappDigits}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-white hover:text-brand-3"
                  >
                    <MessageCircle aria-hidden="true" className="size-4 text-brand-3" /> Écrire directement sur WhatsApp
                  </a>
                </li>
              )}
              {location && (
                <li className="inline-flex items-center gap-3 text-muted">
                  <MapPin aria-hidden="true" className="size-4 text-brand-3" /> {location}
                </li>
              )}
            </ul>
          )}
        </div>

        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
