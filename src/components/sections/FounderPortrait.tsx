import Image from "next/image";
import { Camera } from "lucide-react";
import type { Founder } from "@/types/content";

/**
 * Portrait du fondateur.
 * Sans photo renseignée : monogramme AiTech élégant (et, en développement, une indication « photo à ajouter »).
 */
export function FounderPortrait({ founder }: { founder: Founder }) {
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Cadre décalé violet, en arrière-plan */}
      <div aria-hidden="true" className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] border border-brand-3/30" />

      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line bg-gradient-to-br from-ink-3 via-ink-2 to-[#2a1458]">
        {founder.photo ? (
          <Image
            src={founder.photo.src}
            alt={founder.photo.alt}
            width={founder.photo.width}
            height={founder.photo.height}
            sizes="(min-width: 1024px) 28rem, 90vw"
            priority
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-5">
            <div aria-hidden="true" className="absolute top-1/3 left-1/2 size-64 -translate-x-1/2 rounded-full bg-brand/30 blur-[90px]" />
            <span aria-hidden="true" className="relative font-display text-8xl font-bold tracking-[-0.06em] text-brand-3">
              Ai
            </span>
            {isDevelopment && (
              <span className="relative inline-flex items-center gap-2 rounded-full bg-amber-300 px-3 py-1 text-xs font-semibold text-ink">
                <Camera aria-hidden="true" className="size-3.5" />
                Photo à ajouter dans src/data/about.ts
              </span>
            )}
          </div>
        )}
      </div>

      {/* Étiquette nom / rôle */}
      <div className="glass absolute -bottom-6 left-6 rounded-2xl border border-line px-5 py-3.5 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.8)]">
        {founder.name && <p className="font-display text-base font-semibold text-white">{founder.name}</p>}
        <p className="text-xs text-brand-3">{founder.role}</p>
      </div>
    </div>
  );
}
