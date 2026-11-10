import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { QuoteWizard, type WizardOffer } from "@/components/quote/QuoteWizard";
import { offerCategories, offers } from "@/data/offers";
import { siteConfig } from "@/data/site";
import { availableCallDays } from "@/lib/booking";
import { isDatabaseConfigured } from "@/lib/db";
import { priceFor, ZONE_CURRENCY, ZONE_LABELS, type PriceZone } from "@/lib/pricing";
import { getBookedCallIsos } from "@/lib/quotes/repository";
import { getVisitorZone } from "@/lib/visitor";

export const metadata: Metadata = {
  title: "Obtenir mon devis",
  description: "Choisissez votre offre, obtenez votre devis immédiatement et réservez un appel avec AiTech.",
  alternates: { canonical: "/devis" },
};

/** Parcours de devis : offre → coordonnées → créneau d'appel. */
export default function QuotePage({ searchParams }: PageProps<"/devis">) {
  return (
    <section aria-labelledby="devis-title" className="relative min-h-[90svh] overflow-hidden bg-ink pt-32 pb-24 sm:pt-36">
      <div aria-hidden="true" className="absolute -top-40 right-0 h-[420px] w-[700px] rounded-full bg-brand/15 blur-[120px]" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-brand-3 uppercase">
          <span aria-hidden="true" className="h-px w-6 bg-brand-3" /> Devis immédiat
        </p>
        <h1 id="devis-title" className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          Votre devis en 3 étapes.
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Gratuit et sans engagement : aucun paiement maintenant. Vous recevez votre devis tout de suite, puis nous en parlons lors d&apos;un appel.
        </p>
        <Suspense fallback={<div className="mt-10 h-[32rem] animate-pulse rounded-3xl bg-ink-2" />}>
          <QuoteWizardLoader searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
}

/** Pack plus avantageux qu'un achat à l'unité (seulement si l'économie est réelle). */
function findBetterPack(unitOfferId: string, zone: PriceZone): WizardOffer["betterPack"] {
  const pack = offers.find((offer) => offer.savings?.unitOfferId === unitOfferId);
  if (!pack?.savings) return null;
  return { id: pack.id, name: pack.name, units: pack.savings.units, price: priceFor(pack.prices, zone).amount };
}

/** Prépare les données propres à cette visite : prix de la zone et créneaux encore libres. */
async function QuoteWizardLoader({ searchParams }: { searchParams: PageProps<"/devis">["searchParams"] }) {
  const query = await searchParams;
  await connection(); // créneaux et prix calculés à chaque visite
  const [zone, booked] = await Promise.all([getVisitorZone(), getBookedCallIsos(new Date())]);

  const catalog: WizardOffer[] = offers.map((offer) => ({
    id: offer.id,
    category: offer.category,
    name: offer.name,
    promise: offer.promise,
    duration: offer.duration,
    startingAt: Boolean(offer.startingAt),
    recommended: Boolean(offer.recommended),
    unit: offer.unit ?? null,
    price: priceFor(offer.prices, zone).amount,
    betterPack: findBetterPack(offer.id, zone),
  }));

  const requested = typeof query.offre === "string" ? query.offre : undefined;

  return (
    <QuoteWizard
      offers={catalog}
      categories={offerCategories.map((category) => ({ id: category.id, name: category.name }))}
      currency={ZONE_CURRENCY[zone]}
      zoneLabel={ZONE_LABELS[zone]}
      initialOfferId={catalog.some((offer) => offer.id === requested) ? requested : undefined}
      days={availableCallDays(new Date(), booked)}
      serviceAvailable={isDatabaseConfigured()}
      whatsapp={siteConfig.contact.whatsapp}
    />
  );
}
