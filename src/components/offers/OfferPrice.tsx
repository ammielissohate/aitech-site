import { getOffer, type Offer } from "@/data/offers";
import { cn } from "@/lib/cn";
import { formatMoney, packSavings, priceFor, xofToEur, ZONE_LABELS } from "@/lib/pricing";
import { getVisitorZone } from "@/lib/visitor";

/**
 * Prix d'une offre pour la zone du visiteur.
 * Lit la géolocalisation de la requête : toujours rendu sous <Suspense> (voir OfferCard).
 */
export async function OfferPrice({ offer, highlight = false }: { offer: Offer; highlight?: boolean }) {
  const zone = await getVisitorZone();
  const { amount, currency } = priceFor(offer.prices, zone);

  const unitOffer = offer.savings ? getOffer(offer.savings.unitOfferId) : undefined;
  const saved = unitOffer && offer.savings ? packSavings(amount, unitOffer.prices[zone], offer.savings.units) : 0;

  return (
    <div>
      {offer.startingAt && <p className="text-xs font-medium tracking-wide text-muted uppercase">À partir de</p>}
      <p className="flex items-baseline gap-1.5">
        <span className={cn("font-display text-3xl font-semibold tracking-tight", highlight ? "text-white" : "text-white")}>
          {formatMoney(amount, currency)}
        </span>
        {offer.unit && <span className="text-sm text-muted">/ {offer.unit.singular}</span>}
      </p>
      {currency === "XOF" && <p className="text-xs text-muted">≈ {formatMoney(xofToEur(amount), "EUR")}</p>}
      {saved > 0 && (
        <p className="mt-2 inline-flex rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
          {formatMoney(saved, currency)} économisés par rapport à l&apos;unité
        </p>
      )}
    </div>
  );
}

/** Mention de la zone de prix détectée. */
export async function ZoneNote() {
  const zone = await getVisitorZone();
  return <span>Prix affichés pour votre région : {ZONE_LABELS[zone]}</span>;
}

/** Espace réservé pendant le calcul du prix (évite tout décalage de mise en page). */
export function OfferPriceSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-2">
      <div className="h-8 w-32 animate-pulse rounded-lg bg-white/10" />
      <div className="h-3 w-16 animate-pulse rounded bg-white/5" />
    </div>
  );
}
