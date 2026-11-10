"use client";

import { CalendarPlus, Download, MessageCircle } from "lucide-react";
import { CALL_DURATION_MINUTES } from "@/lib/booking";

/** Format AAAAMMJJTHHMMSSZ attendu par les calendriers. */
function toCalendarDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Actions sur le devis : PDF, ajout à l'agenda, contact WhatsApp. */
export function QuoteActions({ refCode, callAt, offerName, whatsapp }: { refCode: string; callAt: string; offerName: string; whatsapp: string }) {
  const start = new Date(callAt);
  const end = new Date(start.getTime() + CALL_DURATION_MINUTES * 60 * 1000);
  const title = `Appel AiTech · ${offerName}`;
  const details = `Appel de lancement pour le devis ${refCode}.`;

  const googleUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(title)}&dates=${toCalendarDate(start)}/${toCalendarDate(end)}&details=${encodeURIComponent(details)}`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AiTech//Devis//FR",
    "BEGIN:VEVENT",
    `UID:${refCode}@aitech`,
    `DTSTAMP:${toCalendarDate(new Date())}`,
    `DTSTART:${toCalendarDate(start)}`,
    `DTEND:${toCalendarDate(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${details}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const icsUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;

  const linkClass =
    "inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-medium text-white transition hover:border-brand-3/50 hover:bg-white/5";

  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#6d28d9]">
        <Download aria-hidden="true" className="size-4" /> Télécharger en PDF
      </button>
      <a href={googleUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
        <CalendarPlus aria-hidden="true" className="size-4" /> Google Agenda
      </a>
      <a href={icsUrl} download={`appel-${refCode}.ics`} className={linkClass}>
        <CalendarPlus aria-hidden="true" className="size-4" /> Autre agenda (.ics)
      </a>
      {whatsapp && (
        <a
          href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Bonjour AiTech, je viens de demander le devis ${refCode}.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <MessageCircle aria-hidden="true" className="size-4" /> Une question ? WhatsApp
        </a>
      )}
    </div>
  );
}
