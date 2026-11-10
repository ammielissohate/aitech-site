"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface OfferTabPanel {
  id: string;
  label: string;
  /** Contenu rendu côté serveur (cartes et prix), simplement affiché ou masqué ici. */
  content: ReactNode;
}

/**
 * Onglets accessibles (motif ARIA « tabs » : flèches gauche/droite, Début/Fin).
 * Les panneaux sont rendus côté serveur et seulement masqués : le contenu reste indexable.
 */
export function OfferTabs({ panels }: { panels: OfferTabPanel[] }) {
  const [active, setActive] = useState(panels[0]?.id);
  const baseId = useId();

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: panels.length - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = panels[(keys[event.key] + panels.length) % panels.length];
    setActive(next.id);
    document.getElementById(`${baseId}-tab-${next.id}`)?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label="Catégories d'offres" className="flex gap-2 overflow-x-auto pb-2">
        {panels.map((panel, index) => {
          const selected = panel.id === active;
          return (
            <button
              key={panel.id}
              id={`${baseId}-tab-${panel.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${panel.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(panel.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium whitespace-nowrap transition",
                selected ? "border-white bg-white text-ink" : "border-line text-muted hover:border-white/30 hover:text-white",
              )}
            >
              {panel.label}
            </button>
          );
        })}
      </div>

      {panels.map((panel) => (
        <div
          key={panel.id}
          id={`${baseId}-panel-${panel.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${panel.id}`}
          hidden={panel.id !== active}
          className="mt-8"
        >
          {panel.content}
        </div>
      ))}
    </div>
  );
}
