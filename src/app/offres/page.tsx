import type { Metadata } from "next";
import { Globe2 } from "lucide-react";
import { Suspense } from "react";
import { OfferCategoryBlock } from "@/components/offers/OfferCategoryBlock";
import { ZoneNote } from "@/components/offers/OfferPrice";
import { FinalCta } from "@/components/sections/FinalCta";
import { OfferGuarantees } from "@/components/sections/Offers";
import { Section } from "@/components/ui/Section";
import { offerCategories, offersSection } from "@/data/offers";

export const metadata: Metadata = {
  title: offersSection.page.seo.title,
  description: offersSection.page.seo.description,
  alternates: { canonical: "/offres" },
  openGraph: { title: offersSection.page.seo.title, description: offersSection.page.seo.description, url: "/offres" },
};

/** Page « Offres » : toutes les catégories, prix de la région du visiteur, engagements. */
export default function OffersPage() {
  return (
    <>
      <section aria-labelledby="offres-title" className="relative overflow-hidden bg-ink pt-36 pb-12 sm:pt-44 sm:pb-16">
        <div aria-hidden="true" className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
        <div aria-hidden="true" className="absolute -top-40 left-0 h-[420px] w-[700px] rounded-full bg-brand/20 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-brand-3 uppercase">
            <span aria-hidden="true" className="h-px w-6 bg-brand-3" />
            Tarifs
          </p>
          <h1 id="offres-title" className="font-display text-4xl leading-[1.05] font-semibold tracking-[-0.03em] sm:text-6xl">
            {offersSection.page.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted sm:text-xl">{offersSection.page.intro}</p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-xs text-muted">
            <Globe2 aria-hidden="true" className="size-3.5 text-brand-3" />
            <Suspense fallback={<span>Prix adaptés à votre région</span>}>
              <ZoneNote />
            </Suspense>
          </p>
          <nav aria-label="Catégories d'offres" className="mt-8 flex flex-wrap gap-2">
            {offerCategories.map((category) => (
              <a key={category.id} href={`#${category.id}`} className="rounded-full border border-line px-4 py-2 text-sm text-muted hover:border-white/30 hover:text-white">
                {category.name}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {offerCategories.map((category, index) => (
        <Section key={category.id} id={category.id} tone={index % 2 === 0 ? "darker" : "dark"} className="py-20 sm:py-24">
          <OfferCategoryBlock category={category} headingLevel="h2" />
        </Section>
      ))}

      <Section tone="dark" className="pt-4 pb-24 sm:pb-32">
        <OfferGuarantees />
      </Section>

      <FinalCta href="/#contact" />
    </>
  );
}
