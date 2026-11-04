import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import type { Pillar } from "@/types/content";

/** Carte d'un pilier : numéro, icône, nom, explication, prestations et lien vers la page détaillée. */
export function PillarCard({ pillar }: { pillar: Pillar }) {
  return (
    <article className="reveal group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-ink-2 p-7 transition duration-500 hover:border-brand-3/40 sm:p-8">
      {/* Liseré lumineux au survol */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-3 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 size-56 rounded-full bg-brand/0 blur-3xl transition-colors duration-700 group-hover:bg-brand/20"
      />

      <div className="relative flex items-start justify-between">
        <span className="inline-flex size-13 items-center justify-center rounded-2xl border border-brand-3/25 bg-brand/15 text-brand-3">
          <Icon name={pillar.icon} className="size-6" />
        </span>
        <span aria-hidden="true" className="font-display text-5xl font-semibold tracking-tighter text-white/10">
          {pillar.number}
        </span>
      </div>

      <p className="relative mt-8 text-xs font-semibold tracking-[0.22em] text-brand-3 uppercase">
        <span className="sr-only">Pilier {pillar.number} : </span>
        {pillar.dimension}
      </p>
      <h3 className="relative mt-2 font-display text-2xl font-semibold tracking-tight">{pillar.name}</h3>
      <p className="relative mt-4 leading-relaxed text-muted">{pillar.summary}</p>

      <ul className="relative mt-7 space-y-3 border-t border-line pt-7 text-sm">
        {pillar.services.slice(0, 4).map((service) => (
          <li key={service.title} className="flex gap-3">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-3" />
            <span className="text-white/85">{service.title}</span>
          </li>
        ))}
      </ul>

      <Link
        href={`/solutions/${pillar.slug}`}
        className="relative mt-auto inline-flex items-center gap-2 pt-9 text-sm font-semibold text-white transition-colors hover:text-brand-3"
      >
        Découvrir cette solution
        <span className="sr-only"> : {pillar.name}</span>
        <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </article>
  );
}
