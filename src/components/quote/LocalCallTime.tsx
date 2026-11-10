"use client";

import { useSyncExternalStore } from "react";
import { BENIN_TIMEZONE, formatCallTime } from "@/lib/booking";

/** Heure de l'appel dans le fuseau du visiteur, affichée seulement si elle diffère de celle du Bénin. */
export function LocalCallTime({ iso }: { iso: string }) {
  const timeZone = useSyncExternalStore(
    () => () => {},
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    () => BENIN_TIMEZONE,
  );
  const local = formatCallTime(iso, timeZone);
  if (local === formatCallTime(iso, BENIN_TIMEZONE)) return null;
  return <p className="mt-1 text-sm text-brand-deep">Chez vous : {local}</p>;
}
