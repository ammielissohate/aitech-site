"use client";

import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, CalendarClock, Check, Clock, Loader2, Minus, Plus, ShieldCheck } from "lucide-react";
import { useActionState, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { submitQuoteAction, type SubmitQuoteState } from "@/app/devis/actions";
import { buttonClasses } from "@/components/ui/Button";
import { BENIN_TIMEZONE, type CallDay } from "@/lib/booking";
import { cn } from "@/lib/cn";
import { formatMoney, xofToEur, type Currency } from "@/lib/pricing";
import type { QuoteField } from "@/lib/quotes/schema";

export interface WizardOffer {
  id: string;
  category: string;
  name: string;
  promise: string;
  duration: string;
  startingAt: boolean;
  recommended: boolean;
  unit: { singular: string; plural: string; max: number } | null;
  /** Prix unitaire pour la zone du visiteur (affichage ; le serveur recalcule). */
  price: number;
  /** Pack plus avantageux pour cette offre à l'unité (ex. carrousel 5 slides). */
  betterPack: { id: string; name: string; units: number; price: number } | null;
}

interface QuoteWizardProps {
  offers: WizardOffer[];
  categories: { id: string; name: string }[];
  currency: Currency;
  zoneLabel: string;
  initialOfferId?: string;
  days: CallDay[];
  serviceAvailable: boolean;
  whatsapp: string;
}

type Step = 1 | 2 | 3;
const STEP_FIELDS: Record<Step, QuoteField[]> = {
  1: ["offerId", "quantity"],
  2: ["clientType", "fullName", "company", "email", "whatsapp", "message"],
  3: ["callAt", "website"],
};
const STEP_LABELS: Record<Step, string> = { 1: "Votre offre", 2: "Vos informations", 3: "Votre appel" };

/** Fuseau horaire du visiteur (le serveur ne le connaît pas : on suppose celui du Bénin). */
function useVisitorTimeZone(): string {
  return useSyncExternalStore(
    () => () => {},
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    () => BENIN_TIMEZONE,
  );
}

function formatTime(iso: string, timeZone: string) {
  return new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone }).format(new Date(iso));
}

function formatDay(day: string) {
  const [year, month, date] = day.split("-").map(Number);
  return new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, date)),
  );
}

/**
 * Parcours de devis en 3 étapes, dans un seul formulaire :
 * les étapes masquées restent dans la page, donc tout est envoyé en une fois à la fin.
 */
export function QuoteWizard({ offers, categories, currency, zoneLabel, initialOfferId, days, serviceAvailable, whatsapp }: QuoteWizardProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<SubmitQuoteState, FormData>(submitQuoteAction, {});
  const [handledState, setHandledState] = useState(state);
  const [step, setStep] = useState<Step>(initialOfferId ? 2 : 1);
  const [offerId, setOfferId] = useState(initialOfferId ?? "");
  const [category, setCategory] = useState(offers.find((offer) => offer.id === initialOfferId)?.category ?? categories[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [clientType, setClientType] = useState<"particulier" | "entreprise">("particulier");
  const [selectedDay, setSelectedDay] = useState(days[0]?.day ?? "");
  const [callAt, setCallAt] = useState("");
  const [localErrors, setLocalErrors] = useState<Partial<Record<QuoteField, string>>>({});
  const visitorTimeZone = useVisitorTimeZone();

  const offer = offers.find((item) => item.id === offerId);
  const effectiveQuantity = offer?.unit ? quantity : 1;
  const total = offer ? offer.price * effectiveQuantity : 0;
  const errors = { ...(state.errors ?? {}), ...localErrors };

  // Erreurs renvoyées par le serveur : on revient à l'étape concernée (ajustement pendant le rendu).
  if (state !== handledState) {
    setHandledState(state);
    setLocalErrors({});
    const firstStep = ([1, 2, 3] as Step[]).find((candidate) => STEP_FIELDS[candidate].some((field) => state.errors?.[field]));
    if (firstStep) setStep(firstStep);
    if (state.slotTaken) setCallAt("");
  }

  // Créneau pris entre-temps : on recharge les créneaux disponibles.
  useEffect(() => {
    if (state.slotTaken) router.refresh();
  }, [state, router]);

  const showsLocalTime = useMemo(
    () => days[0]?.slots[0] && formatTime(days[0].slots[0].iso, visitorTimeZone) !== formatTime(days[0].slots[0].iso, BENIN_TIMEZONE),
    [days, visitorTimeZone],
  );

  /** Vérifications rapides avant de passer à l'étape suivante (le serveur revérifie tout). */
  function validateStep(current: Step, form: HTMLFormElement): boolean {
    const next: Partial<Record<QuoteField, string>> = {};
    const value = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | null)?.value.trim() ?? "";
    if (current === 1 && !offerId) next.offerId = "Choisissez une offre pour continuer.";
    if (current === 2) {
      if (value("fullName").length < 2) next.fullName = "Indiquez votre nom complet.";
      if (clientType === "entreprise" && value("company").length < 2) next.company = "Indiquez le nom de votre entreprise.";
      if (!/^\S+@\S+\.\S+$/.test(value("email"))) next.email = "Indiquez une adresse e-mail valide.";
      if (!/^\+?\d{8,15}$/.test(value("whatsapp").replace(/[^\d+]/g, ""))) next.whatsapp = "Indiquez un numéro WhatsApp avec l'indicatif (ex. +229…).";
    }
    if (current === 3 && !callAt) next.callAt = "Choisissez un créneau pour l'appel.";
    setLocalErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext(event: React.MouseEvent<HTMLButtonElement>) {
    const form = event.currentTarget.form;
    if (form && validateStep(step, form)) {
      setStep((current) => Math.min(3, current + 1) as Step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  if (!serviceAvailable) {
    return (
      <p role="status" className="mt-10 rounded-3xl border border-amber-300/30 bg-amber-300/10 p-6 text-amber-100">
        Le devis en ligne est momentanément indisponible.{" "}
        {whatsapp && (
          <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} className="font-semibold underline">
            Écrivez-nous sur WhatsApp
          </a>
        )}
      </p>
    );
  }

  const selectedSlots = days.find((day) => day.day === selectedDay)?.slots ?? [];

  return (
    <form
      action={formAction}
      noValidate
      onSubmit={(event) => {
        if (!validateStep(3, event.currentTarget)) event.preventDefault();
      }}
      className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start"
    >
      {/* Données envoyées au serveur */}
      <input type="hidden" name="offerId" value={offerId} />
      <input type="hidden" name="quantity" value={effectiveQuantity} />
      <input type="hidden" name="callAt" value={callAt} />
      {/* Champ piège anti-robots, invisible pour les humains */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          Site web <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div className="min-w-0 rounded-3xl border border-line bg-ink-2 p-5 sm:p-8">
        {/* Progression */}
        <ol className="mb-8 grid grid-cols-3 gap-2" aria-label="Étapes du devis">
          {([1, 2, 3] as Step[]).map((index) => (
            <li key={index}>
              <button
                type="button"
                disabled={index > step}
                onClick={() => setStep(index)}
                aria-current={index === step ? "step" : undefined}
                className="w-full text-left disabled:cursor-default"
              >
                <span className={cn("block h-1.5 rounded-full transition", index <= step ? "bg-brand-3" : "bg-white/10")} />
                <span className={cn("mt-2 block text-xs font-medium", index === step ? "text-white" : "text-muted")}>
                  {index}. {STEP_LABELS[index]}
                </span>
              </button>
            </li>
          ))}
        </ol>

        {state.formError && (
          <p role="alert" className="mb-6 flex gap-3 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-100">
            <AlertCircle aria-hidden="true" className="size-5 shrink-0" /> {state.formError}
          </p>
        )}

        {/* ── Étape 1 : offre ── */}
        <fieldset hidden={step !== 1}>
          <legend className="font-display text-xl font-semibold">Quelle offre vous intéresse ?</legend>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={category === item.id}
                onClick={() => setCategory(item.id)}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-2 text-sm whitespace-nowrap transition",
                  category === item.id ? "border-white bg-white text-ink" : "border-line text-muted hover:text-white",
                )}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {offers
              .filter((item) => item.category === category)
              .map((item) => (
                <label
                  key={item.id}
                  className={cn(
                    "relative flex cursor-pointer flex-col rounded-2xl border p-4 transition",
                    offerId === item.id ? "border-brand-3 bg-brand/10" : "border-line hover:border-white/25",
                  )}
                >
                  <input
                    type="radio"
                    name="offerChoice"
                    value={item.id}
                    checked={offerId === item.id}
                    onChange={() => {
                      setOfferId(item.id);
                      setQuantity(1);
                    }}
                    className="sr-only"
                  />
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-semibold">{item.name}</span>
                    {offerId === item.id && <Check aria-hidden="true" className="size-5 shrink-0 text-brand-3" />}
                  </span>
                  <span className="mt-1 text-sm text-muted">{item.promise}</span>
                  <span className="mt-3 flex flex-wrap items-baseline gap-x-3 text-sm">
                    <span className="font-display text-lg font-semibold">
                      {item.startingAt && <span className="text-xs font-normal text-muted">dès </span>}
                      {formatMoney(item.price, currency)}
                      {item.unit && <span className="text-xs font-normal text-muted"> / {item.unit.singular}</span>}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted">
                      <Clock aria-hidden="true" className="size-3.5" /> {item.duration}
                    </span>
                  </span>
                  {item.recommended && (
                    <span className="absolute -top-2.5 right-3 rounded-full bg-brand px-2 py-0.5 text-[11px] font-semibold">Le plus choisi</span>
                  )}
                </label>
              ))}
          </div>

          {offer?.unit && (
            <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-line p-4">
              <span id="quantity-label" className="text-sm font-medium">
                Nombre de {offer.unit.plural}
              </span>
              <div className="flex items-center gap-2" role="group" aria-labelledby="quantity-label">
                <QuantityButton label="Retirer" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
                  <Minus className="size-4" />
                </QuantityButton>
                <output aria-live="polite" className="w-10 text-center font-display text-lg font-semibold">
                  {quantity}
                </output>
                <QuantityButton label="Ajouter" disabled={quantity >= offer.unit.max} onClick={() => setQuantity((value) => Math.min(offer.unit!.max, value + 1))}>
                  <Plus className="size-4" />
                </QuantityButton>
              </div>
            </div>
          )}
          {offer?.betterPack && quantity >= offer.betterPack.units && offer.betterPack.price < offer.price * offer.betterPack.units && (
            <div role="status" className="mt-4 flex flex-col gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="text-emerald-50">
                Astuce : le <strong>{offer.betterPack.name}</strong> revient à {formatMoney(offer.betterPack.price, currency)} au lieu de{" "}
                {formatMoney(offer.price * offer.betterPack.units, currency)} pour {offer.betterPack.units} {offer.unit?.plural}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setOfferId(offer.betterPack!.id);
                  setQuantity(1);
                }}
                className="shrink-0 rounded-full bg-emerald-300 px-4 py-2 font-semibold text-ink hover:bg-emerald-200"
              >
                Passer au pack
              </button>
            </div>
          )}
          <FieldError message={errors.offerId ?? errors.quantity} />
        </fieldset>

        {/* ── Étape 2 : coordonnées ── */}
        <fieldset hidden={step !== 2}>
          <legend className="font-display text-xl font-semibold">Faisons connaissance</legend>
          <div className="mt-5 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Vous êtes">
            {(["particulier", "entreprise"] as const).map((type) => (
              <label
                key={type}
                className={cn(
                  "cursor-pointer rounded-2xl border p-4 text-center font-medium transition",
                  clientType === type ? "border-brand-3 bg-brand/10" : "border-line hover:border-white/25",
                )}
              >
                <input type="radio" name="clientType" value={type} checked={clientType === type} onChange={() => setClientType(type)} className="sr-only" />
                {type === "particulier" ? "Un particulier" : "Une entreprise"}
              </label>
            ))}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <TextField name="fullName" label="Nom complet" autoComplete="name" error={errors.fullName} />
            <TextField
              name="company"
              label={clientType === "entreprise" ? "Nom de l'entreprise" : "Activité (facultatif)"}
              autoComplete="organization"
              error={errors.company}
            />
            <TextField name="email" label="Adresse e-mail" type="email" autoComplete="email" error={errors.email} />
            <TextField name="whatsapp" label="Numéro WhatsApp" type="tel" autoComplete="tel" placeholder="+229 01 00 00 00 00" error={errors.whatsapp} />
            <div className="sm:col-span-2">
              <label htmlFor="message" className="mb-2 block text-sm font-medium">
                Parlez-nous de votre projet <span className="text-muted">(facultatif)</span>
              </label>
              <textarea id="message" name="message" rows={3} maxLength={1000} className={inputClasses(errors.message)} />
              <FieldError message={errors.message} />
            </div>
          </div>
        </fieldset>

        {/* ── Étape 3 : créneau ── */}
        <fieldset hidden={step !== 3}>
          <legend className="font-display text-xl font-semibold">Choisissez votre appel</legend>
          <p className="mt-2 text-sm text-muted">
            Un appel de 30 minutes pour valider votre projet. Horaires à l&apos;heure du Bénin (UTC+1)
            {showsLocalTime && <> · votre heure locale est indiquée en dessous</>}.
          </p>
          {days.length === 0 ? (
            <p className="mt-6 rounded-2xl border border-line p-4 text-sm text-muted">
              Tous les créneaux des deux prochaines semaines sont réservés. Écrivez-nous sur WhatsApp pour convenir d&apos;un horaire.
            </p>
          ) : (
            <>
              <div className="mt-5 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Jour de l'appel">
                {days.map((day) => (
                  <button
                    key={day.day}
                    type="button"
                    aria-pressed={selectedDay === day.day}
                    onClick={() => setSelectedDay(day.day)}
                    className={cn(
                      "shrink-0 rounded-2xl border px-4 py-3 text-sm capitalize transition",
                      selectedDay === day.day ? "border-white bg-white text-ink" : "border-line text-muted hover:text-white",
                    )}
                  >
                    {formatDay(day.day)}
                  </button>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Heure de l'appel">
                {selectedSlots.map((slot) => (
                  <label
                    key={slot.iso}
                    className={cn(
                      "cursor-pointer rounded-2xl border px-4 py-3 text-center transition",
                      callAt === slot.iso ? "border-brand-3 bg-brand/15" : "border-line hover:border-white/25",
                    )}
                  >
                    <input type="radio" name="slotChoice" value={slot.iso} checked={callAt === slot.iso} onChange={() => setCallAt(slot.iso)} className="sr-only" />
                    <span className="block font-display text-lg font-semibold">{slot.time.replace(":", " h ")}</span>
                    {showsLocalTime && <span className="block text-xs text-muted">{formatTime(slot.iso, visitorTimeZone)} chez vous</span>}
                  </label>
                ))}
              </div>
            </>
          )}
          <FieldError message={errors.callAt} />
        </fieldset>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
          {step > 1 ? (
            <button type="button" onClick={() => setStep((step - 1) as Step)} className="inline-flex items-center gap-2 text-sm text-muted hover:text-white">
              <ArrowLeft aria-hidden="true" className="size-4" /> Retour
            </button>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <button type="button" onClick={goNext} className={buttonClasses("primary", "lg")}>
              Continuer <ArrowRight aria-hidden="true" className="size-4" />
            </button>
          ) : (
            <button type="submit" disabled={isPending || days.length === 0} className={buttonClasses("primary", "lg")}>
              {isPending ? <Loader2 aria-hidden="true" className="size-5 animate-spin" /> : <CalendarClock aria-hidden="true" className="size-5" />}
              {isPending ? "Création du devis…" : "Recevoir mon devis"}
            </button>
          )}
        </div>
      </div>

      {/* Récapitulatif */}
      <aside aria-label="Récapitulatif" className="rounded-3xl border border-line bg-ink-2 p-6 lg:sticky lg:top-28">
        <p className="text-xs font-semibold tracking-[0.2em] text-brand-3 uppercase">Récapitulatif</p>
        {offer ? (
          <>
            <p className="mt-3 font-display text-lg font-semibold">{offer.name}</p>
            {offer.unit && (
              <p className="text-sm text-muted">
                {effectiveQuantity} {effectiveQuantity > 1 ? offer.unit.plural : offer.unit.singular} × {formatMoney(offer.price, currency)}
              </p>
            )}
            <p className="mt-4 text-sm text-muted">{offer.startingAt ? "Total estimé, à partir de" : "Total"}</p>
            <p className="font-display text-3xl font-semibold">{formatMoney(total, currency)}</p>
            {currency === "XOF" && <p className="text-xs text-muted">≈ {formatMoney(xofToEur(total), "EUR")}</p>}
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-white/80">
              <Clock aria-hidden="true" className="size-4 text-brand-3" /> Livré en {offer.duration}
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm text-muted">Choisissez une offre pour voir le montant.</p>
        )}
        <ul className="mt-6 space-y-2 border-t border-line pt-5 text-sm text-muted">
          <li className="flex gap-2">
            <ShieldCheck aria-hidden="true" className="size-4 shrink-0 text-brand-3" /> Aucun paiement maintenant
          </li>
          <li className="flex gap-2">
            <ShieldCheck aria-hidden="true" className="size-4 shrink-0 text-brand-3" /> Paiement en deux fois après validation
          </li>
          <li className="flex gap-2">
            <ShieldCheck aria-hidden="true" className="size-4 shrink-0 text-brand-3" /> {zoneLabel}
          </li>
        </ul>
      </aside>
    </form>
  );
}

/* ─── Sous-composants ─── */

function TextField({
  name,
  label,
  type = "text",
  autoComplete,
  placeholder,
  error,
}: {
  name: QuoteField;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={inputClasses(error)}
      />
      <FieldError id={`${name}-error`} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 flex items-center gap-1.5 text-sm text-red-300">
      <AlertCircle aria-hidden="true" className="size-4 shrink-0" /> {message}
    </p>
  );
}

function QuantityButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex size-10 items-center justify-center rounded-full border border-line hover:bg-white/10 disabled:opacity-30"
    >
      <span aria-hidden="true">{children}</span>
      <span className="sr-only">{label}</span>
    </button>
  );
}

function inputClasses(error?: string) {
  return cn(
    "block min-h-12 w-full rounded-xl border bg-ink px-4 py-3 text-base text-white placeholder:text-muted/60 transition",
    "focus:border-brand-3 focus:ring-3 focus:ring-brand/30 focus:outline-none",
    error ? "border-red-400/70" : "border-white/12 hover:border-white/25",
  );
}
