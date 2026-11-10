import { Heart } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { offers, type OfferCategory } from "@/data/offers";
import { cn } from "@/lib/cn";
import { OfferCard } from "./OfferCard";

/** Une catégorie d'offres : promesse émotionnelle, bénéfices, puis cartes. */
export function OfferCategoryBlock({ category, headingLevel = "h3" }: { category: OfferCategory; headingLevel?: "h2" | "h3" }) {
  const items = offers.filter((offer) => offer.category === category.id);
  const Heading = headingLevel;

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-brand-3 uppercase">
            <Icon name={category.icon} className="size-4" /> {category.name}
          </p>
          <Heading className="mt-3 font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            {category.headline}
          </Heading>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted">{category.description}</p>
        </div>
        <ul className="space-y-2 text-sm lg:col-span-5">
          {category.gains.map((gain) => (
            <li key={gain} className="flex gap-2.5 text-white/85">
              <Heart aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-3" /> {gain}
            </li>
          ))}
        </ul>
      </div>

      <ul className={cn("mt-10 grid gap-5 pt-3 sm:grid-cols-2", items.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
        {items.map((offer) => (
          <li key={offer.id}>
            <OfferCard offer={offer} />
          </li>
        ))}
      </ul>
    </div>
  );
}
