import Link from "next/link";
import { ArrowRight, Check, Clock, Sparkles } from "lucide-react";
import { Suspense } from "react";
import type { Offer } from "@/data/offers";
import { cn } from "@/lib/cn";
import { OfferPrice, OfferPriceSkeleton } from "./OfferPrice";

/** Carte d'une offre : promesse, contenu, délai, prix de la zone du visiteur, accès au devis. */
export function OfferCard({ offer }: { offer: Offer }) {
  const featured = Boolean(offer.recommended);

  return (
    <article
      className={cn(
        "reveal relative flex h-full flex-col rounded-3xl border p-6 transition duration-300 sm:p-7",
        featured
          ? "border-brand-3/50 bg-gradient-to-b from-brand/25 via-ink-2 to-ink-2 shadow-[0_30px_80px_-40px_rgb(124_58_237/0.9)]"
          : "border-line bg-ink-2 hover:border-white/20",
      )}
    >
      {featured && (
        <span className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
          <Sparkles aria-hidden="true" className="size-3.5" /> Le plus choisi
        </span>
      )}

      <h3 className="font-display text-xl font-semibold tracking-tight">{offer.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{offer.promise}</p>

      <div className="mt-6 min-h-16">
        <Suspense fallback={<OfferPriceSkeleton />}>
          <OfferPrice offer={offer} highlight={featured} />
        </Suspense>
      </div>

      <p className="mt-4 inline-flex items-center gap-2 text-sm text-white/80">
        <Clock aria-hidden="true" className="size-4 text-brand-3" /> Livré en {offer.duration}
      </p>

      <ul className="mt-5 space-y-2.5 border-t border-line pt-5 text-sm">
        {offer.includes.map((item) => (
          <li key={item} className="flex gap-2.5">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-3" />
            <span className="text-white/85">{item}</span>
          </li>
        ))}
      </ul>

      <Link
        href={`/devis?offre=${offer.id}`}
        className={cn(
          "group mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-full text-sm font-semibold transition",
          "mt-7",
          featured ? "bg-brand text-white hover:bg-[#6d28d9]" : "border border-white/15 text-white hover:border-brand-3/60 hover:bg-white/5",
        )}
      >
        Obtenir mon devis
        <span className="sr-only"> : {offer.name}</span>
        <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </article>
  );
}
