import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { mainNavigation } from "@/data/navigation";
import { pillars } from "@/data/services";
import { activeSocials, siteConfig } from "@/data/site";
import { normalizeWhatsAppNumber } from "@/lib/contact";
import { CurrentYear } from "./CurrentYear";
import { Logo } from "./Logo";

/** Pied de page : présentation, navigation, solutions, contact et réseaux sociaux. */
export function Footer() {
  const { email, whatsapp, location } = siteConfig.contact;
  const whatsappDigits = normalizeWhatsAppNumber(whatsapp);

  return (
    <footer className="border-t border-line bg-ink print:hidden">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-2 text-xs font-semibold tracking-[0.2em] text-muted uppercase">{siteConfig.category}</p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{siteConfig.description}</p>
          {activeSocials.length > 0 && (
            <ul className="mt-6 flex gap-2" aria-label="Réseaux sociaux">
              {activeSocials.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-brand-3/50 hover:text-white"
                  >
                    <SocialIcon platform={social.platform} className="size-4.5" />
                    <span className="sr-only">{social.label} (nouvel onglet)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Navigation du pied de page" className="md:col-span-2">
          <h2 className="text-sm font-semibold text-white">Navigation</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {mainNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Nos solutions" className="md:col-span-2">
          <h2 className="text-sm font-semibold text-white">Solutions</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {pillars.map((pillar) => (
              <li key={pillar.slug}>
                <Link href={`/solutions/${pillar.slug}`} className="text-muted hover:text-white">
                  {pillar.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h2 className="text-sm font-semibold text-white">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {email && (
              <li>
                <a href={`mailto:${email}`} className="inline-flex items-center gap-2 hover:text-white">
                  <Mail aria-hidden="true" className="size-4" /> {email}
                </a>
              </li>
            )}
            {whatsappDigits && (
              <li>
                <a
                  href={`https://wa.me/${whatsappDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white"
                >
                  <MessageCircle aria-hidden="true" className="size-4" /> WhatsApp
                </a>
              </li>
            )}
            {location && (
              <li className="inline-flex items-center gap-2">
                <MapPin aria-hidden="true" className="size-4" /> {location}
              </li>
            )}
            <li>
              <Link href="/#contact" className="text-brand-3 hover:text-white">
                Parlons de votre projet →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © <CurrentYear /> {siteConfig.name}. Tous droits réservés.
          </p>
          <p>{siteConfig.signature}</p>
        </div>
      </div>
    </footer>
  );
}
