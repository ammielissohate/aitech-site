import Image from "next/image";
import type { FounderPhoto } from "@/lib/settings";

/**
 * Portrait du fondateur. La photo vient des paramètres du site (Admin → Paramètres) ;
 * sans photo, un monogramme AiTech est affiché.
 */
export function FounderPortrait({ photo, name, role }: { photo: FounderPhoto | null; name: string; role: string }) {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div aria-hidden="true" className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] border border-brand-3/30" />

      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line bg-gradient-to-br from-ink-3 via-ink-2 to-[#2a1458]">
        {photo ? (
          <Image
            src={photo.url}
            alt={`Portrait de ${name}`}
            width={photo.width}
            height={photo.height}
            sizes="(min-width: 1024px) 28rem, 90vw"
            priority
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <div aria-hidden="true" className="absolute top-1/3 left-1/2 size-64 -translate-x-1/2 rounded-full bg-brand/30 blur-[90px]" />
            <span aria-hidden="true" className="relative font-display text-8xl font-bold tracking-[-0.06em] text-brand-3">
              Ai
            </span>
          </div>
        )}
        <a
          href="/admin/parametres"
          className="admin-only absolute top-3 right-3 items-center rounded-full bg-amber-300 px-3 py-1.5 text-xs font-semibold text-ink"
        >
          Changer la photo
        </a>
      </div>

      <div className="glass absolute -bottom-6 left-6 rounded-2xl border border-line px-5 py-3.5 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.8)]">
        <p className="font-display text-base font-semibold text-white">{name}</p>
        <p className="text-xs text-brand-3">{role}</p>
      </div>
    </div>
  );
}
