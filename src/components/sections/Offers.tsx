import { Globe2, ShieldCheck } from "lucide-react";
import { Suspense } from "react";
import { OfferCategoryBlock } from "@/components/offers/OfferCategoryBlock";
import { ZoneNote } from "@/components/offers/OfferPrice";
import { OfferTabs } from "@/components/offers/OfferTabs";
import { Section, SectionHeading } from "@/components/ui/Section";
import { offerCategories, offerGuarantees, offersSection } from "@/data/offers";

/**
 * Section « Nos offres » de l'accueil : une catégorie par onglet,
 * prix affichés dans la devise de la région du visiteur, devis en un clic.
 */
export function Offers() {
  return (
    <Section id="offres" tone="darker" labelledBy="offers-title">
      <div aria-hidden="true" className="absolute top-1/3 -right-40 size-[28rem] rounded-full bg-brand/15 blur-[120px]" />
      <SectionHeading id="offers-title" {...offersSection} />

      <p className="reveal mt-6 inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-xs text-muted">
        <Globe2 aria-hidden="true" className="size-3.5 text-brand-3" />
        <Suspense fallback={<span>Prix adaptés à votre région</span>}>
          <ZoneNote />
        </Suspense>
      </p>

      <div className="mt-12">
        <OfferTabs
          panels={offerCategories.map((category) => ({
            id: category.id,
            label: category.name,
            content: <OfferCategoryBlock category={category} />,
          }))}
        />
      </div>

      <OfferGuarantees />
    </Section>
  );
}

/** Engagements communs : rassurent au moment de décider. */
export function OfferGuarantees() {
  return (
    <ul className="reveal mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
      {offerGuarantees.map((guarantee) => (
        <li key={guarantee.title} className="flex gap-3 bg-ink-2 p-6">
          <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-brand-3" />
          <div>
            <p className="font-semibold">{guarantee.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{guarantee.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
