/**
 * Créneaux d'appel (fonctions pures, testées).
 *
 * Les horaires sont exprimés à l'heure du Bénin (Africa/Porto-Novo, UTC+1, sans heure d'été).
 * Les créneaux sont stockés en base au format ISO UTC.
 */

/** Décalage du Bénin par rapport à UTC, en heures (fixe toute l'année). */
export const BENIN_UTC_OFFSET = 1;
export const BENIN_TIMEZONE = "Africa/Porto-Novo";

/** Horaires d'appel par jour de la semaine (0 = dimanche … 6 = samedi), heure du Bénin. */
export const CALL_SCHEDULE: Record<number, string[]> = {
  0: [], // dimanche : pas d'appel
  1: ["06:00", "10:00", "12:30", "21:00", "22:30"],
  2: ["06:00", "10:00", "12:30", "21:00", "22:30"],
  3: ["06:00", "10:00", "12:30", "21:00", "22:30"],
  4: ["06:00", "10:00", "12:30", "21:00", "22:30"],
  5: ["06:00", "10:00", "12:30", "21:00", "22:30"],
  6: ["06:00", "10:00", "12:30"], // samedi : pas d'appel après 13 h
};

/** Délai minimum entre la demande et l'appel. */
export const MIN_NOTICE_HOURS = 12;
/** Nombre de jours proposés à la réservation. */
export const BOOKING_WINDOW_DAYS = 14;
/** Durée prévue d'un appel, en minutes (pour l'invitation calendrier). */
export const CALL_DURATION_MINUTES = 30;

export interface CallSlot {
  /** Instant de l'appel (ISO UTC) : c'est la valeur enregistrée. */
  iso: string;
  /** Jour au Bénin, AAAA-MM-JJ. */
  day: string;
  /** Heure au Bénin, HH:MM. */
  time: string;
}

export interface CallDay {
  day: string;
  slots: CallSlot[];
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** Convertit une date + heure du Bénin en instant UTC. */
export function beninTimeToUtc(day: string, time: string): Date {
  const [year, month, date] = day.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(Date.UTC(year, month - 1, date, hours - BENIN_UTC_OFFSET, minutes));
}

/**
 * Liste les créneaux libres des prochains jours.
 * @param now        Instant courant.
 * @param bookedIsos Créneaux déjà réservés (ISO UTC).
 */
export function availableCallDays(now: Date, bookedIsos: Iterable<string>, days = BOOKING_WINDOW_DAYS): CallDay[] {
  const booked = new Set(Array.from(bookedIsos, (iso) => new Date(iso).toISOString()));
  const earliest = now.getTime() + MIN_NOTICE_HOURS * 60 * 60 * 1000;
  // Date du jour à l'heure du Bénin.
  const beninNow = new Date(now.getTime() + BENIN_UTC_OFFSET * 60 * 60 * 1000);
  const result: CallDay[] = [];

  for (let offset = 0; offset <= days; offset += 1) {
    const date = new Date(Date.UTC(beninNow.getUTCFullYear(), beninNow.getUTCMonth(), beninNow.getUTCDate() + offset));
    const day = `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
    const slots = (CALL_SCHEDULE[date.getUTCDay()] ?? [])
      .map((time) => ({ iso: beninTimeToUtc(day, time).toISOString(), day, time }))
      .filter((slot) => new Date(slot.iso).getTime() >= earliest && !booked.has(slot.iso));
    if (slots.length > 0) result.push({ day, slots });
  }
  return result;
}

/** Vrai si l'instant correspond à un créneau officiel, dans la fenêtre de réservation. */
export function isValidCallSlot(iso: string, now: Date): boolean {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return false;
  return availableCallDays(now, []).some((day) => day.slots.some((slot) => slot.iso === date.toISOString()));
}

/** Formatage lisible d'un créneau dans un fuseau horaire donné. */
export function formatCallTime(iso: string, timeZone = BENIN_TIMEZONE): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  }).format(new Date(iso));
}
