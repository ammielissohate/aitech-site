"use client";

import { AlertCircle, CheckCircle2, Mail, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { contactFormLabels as labels } from "@/data/contact";
import { serviceOptions } from "@/data/services";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/cn";
import {
  MESSAGE_MAX_LENGTH,
  SERVICE_VALUES,
  buildContactMessage,
  buildMailtoUrl,
  buildWhatsAppUrl,
  validateContact,
  type ContactField,
  type ContactFieldErrors,
} from "@/lib/contact";

type Channel = "whatsapp" | "email";

/** État affiché après validation : l'application du visiteur a été ouverte, l'envoi reste à confirmer par lui. */
type OpenedState = { channel: Channel; url: string } | null;

const FIELD_ORDER: ContactField[] = ["fullName", "email", "company", "service", "message"];

/**
 * Formulaire de contact.
 *
 * Le site n'envoie rien lui-même : il valide les champs, prépare le message
 * et ouvre WhatsApp ou la messagerie du visiteur. Le message de confirmation
 * l'indique honnêtement (« il ne vous reste plus qu'à appuyer sur Envoyer »).
 *
 * Le service peut être présélectionné via l'ancre : `/#contact-digital-growth`.
 */
export function ContactForm() {
  const serviceRef = useRef<HTMLSelectElement>(null);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [opened, setOpened] = useState<OpenedState>(null);
  const [messageLength, setMessageLength] = useState(0);

  const { whatsapp, email } = siteConfig.contact;
  const canUseWhatsApp = buildWhatsAppUrl(whatsapp, "test") !== null;
  const canUseEmail = buildMailtoUrl(email, "test", "test") !== null;
  const isConfigured = canUseWhatsApp || canUseEmail;

  // Présélection du service depuis l'ancre (liens « Parlons de ce besoin » des pages solutions).
  // On modifie directement le <select> non contrôlé : pas de re-rendu nécessaire.
  useEffect(() => {
    const preselect = () => {
      const requested = window.location.hash.replace(/^#contact-/, "");
      if (serviceRef.current && (SERVICE_VALUES as readonly string[]).includes(requested)) {
        serviceRef.current.value = requested;
      }
    };
    preselect();
    window.addEventListener("hashchange", preselect);
    return () => window.removeEventListener("hashchange", preselect);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const channel: Channel = submitter?.value === "email" ? "email" : "whatsapp";

    const result = validateContact(Object.fromEntries(new FormData(form)));
    if (!result.success) {
      setErrors(result.errors);
      setOpened(null);
      // Place le focus sur le premier champ en erreur pour la navigation clavier et les lecteurs d'écran.
      const firstInvalid = FIELD_ORDER.find((field) => result.errors[field]);
      if (firstInvalid) form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setErrors({});
    const serviceLabel = serviceOptions.find((option) => option.value === result.data.service)?.label ?? result.data.service;
    const message = buildContactMessage(result.data, serviceLabel);
    const url =
      channel === "whatsapp"
        ? buildWhatsAppUrl(whatsapp, message)
        : buildMailtoUrl(email, `Nouveau projet — ${result.data.company}`, message);

    if (!url) return; // Canal non configuré : le bouton n'est de toute façon pas affiché.

    if (channel === "whatsapp") {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = url;
    }
    setOpened({ channel, url });
  }

  /** Efface l'erreur d'un champ dès que le visiteur le corrige. */
  function clearError(field: ContactField) {
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-describedby="contact-privacy"
      className="rounded-3xl border border-line bg-ink p-6 shadow-[0_30px_80px_-40px_rgb(124_58_237/0.5)] sm:p-9"
    >
      {!isConfigured && (
        <p role="status" className="mb-6 flex gap-3 rounded-2xl border border-amber-300/40 bg-amber-300/10 p-4 text-sm text-amber-100">
          <AlertCircle aria-hidden="true" className="size-5 shrink-0" />
          {process.env.NODE_ENV === "development" ? labels.notConfiguredDev : labels.notConfiguredPublic}
        </p>
      )}

      {hasErrors && (
        <p role="alert" className="mb-6 flex gap-3 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-100">
          <AlertCircle aria-hidden="true" className="size-5 shrink-0" />
          {labels.errorSummary}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="fullName" label={labels.fullName} error={errors.fullName}>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            onChange={() => clearError("fullName")}
            {...fieldA11y("fullName", errors.fullName)}
            className={inputClasses(errors.fullName)}
          />
        </Field>

        <Field id="email" label={labels.email} error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            onChange={() => clearError("email")}
            {...fieldA11y("email", errors.email)}
            className={inputClasses(errors.email)}
          />
        </Field>

        <Field id="company" label={labels.company} error={errors.company}>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            required
            maxLength={120}
            onChange={() => clearError("company")}
            {...fieldA11y("company", errors.company)}
            className={inputClasses(errors.company)}
          />
        </Field>

        <Field id="service" label={labels.service} error={errors.service}>
          <select
            id="service"
            name="service"
            ref={serviceRef}
            required
            defaultValue=""
            onChange={() => clearError("service")}
            {...fieldA11y("service", errors.service)}
            className={cn(inputClasses(errors.service), "appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10")}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23A1A1AA' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
            }}
          >
            <option value="" disabled>
              {labels.servicePlaceholder}
            </option>
            {serviceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id="message"
          label={labels.message}
          error={errors.message}
          className="sm:col-span-2"
          hint={`${messageLength} / ${MESSAGE_MAX_LENGTH}`}
        >
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            maxLength={MESSAGE_MAX_LENGTH}
            placeholder={labels.messagePlaceholder}
            onChange={(event) => {
              setMessageLength(event.target.value.length);
              clearError("message");
            }}
            {...fieldA11y("message", errors.message)}
            className={cn(inputClasses(errors.message), "h-auto resize-y py-3")}
          />
        </Field>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        {(canUseWhatsApp || !isConfigured) && (
          <button
            type="submit"
            name="channel"
            value="whatsapp"
            disabled={!canUseWhatsApp}
            className={buttonClasses("primary", "lg", "sm:flex-1")}
          >
            <MessageCircle aria-hidden="true" className="size-5" />
            {labels.submitWhatsApp}
          </button>
        )}
        {(canUseEmail || !isConfigured) && (
          <button
            type="submit"
            name="channel"
            value="email"
            disabled={!canUseEmail}
            className={buttonClasses(canUseWhatsApp ? "secondary" : "primary", "lg", "sm:flex-1")}
          >
            <Mail aria-hidden="true" className="size-5" />
            {labels.submitEmail}
          </button>
        )}
      </div>

      <div aria-live="polite">
        {opened && (
          <div className="mt-6 flex gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-50">
            <CheckCircle2 aria-hidden="true" className="size-5 shrink-0 text-emerald-300" />
            <p>
              {opened.channel === "whatsapp" ? labels.openedWhatsApp : labels.openedEmail}{" "}
              <span className="text-emerald-100/80">{labels.popupHint}</span>{" "}
              <a
                href={opened.url}
                target={opened.channel === "whatsapp" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="font-semibold underline underline-offset-2"
              >
                {labels.popupLink}
              </a>
            </p>
          </div>
        )}
      </div>

      <p id="contact-privacy" className="mt-6 text-xs leading-relaxed text-muted">
        {labels.privacy}
      </p>
    </form>
  );
}

/* ─── Sous-composants et helpers ─── */

interface FieldProps {
  id: ContactField;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}

/** Bloc champ : libellé, contrôle, message d'erreur relié par aria-describedby. */
function Field({ id, label, error, hint, className, children }: FieldProps) {
  return (
    <div className={className}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-white">
          {label}
        </label>
        {hint && (
          <span aria-hidden="true" className="text-xs text-muted tabular-nums">
            {hint}
          </span>
        )}
      </div>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 flex items-center gap-1.5 text-sm text-red-300">
          <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

function fieldA11y(id: ContactField, error?: string) {
  return { "aria-invalid": error ? true : undefined, "aria-describedby": error ? `${id}-error` : undefined };
}

function inputClasses(error?: string) {
  return cn(
    "block h-12 w-full rounded-xl border bg-ink-2 px-4 text-base text-white placeholder:text-muted/70 transition",
    "focus:border-brand-3 focus:outline-none focus-visible:outline-none focus:ring-3 focus:ring-brand/30",
    error ? "border-red-400/70" : "border-white/12 hover:border-white/25",
  );
}
