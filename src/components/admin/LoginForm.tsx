"use client";

import { AlertCircle, LogIn } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";
import { buttonClasses } from "@/components/ui/Button";

export function LoginForm({ configured }: { configured: boolean }) {
  const next = useSearchParams().get("next") ?? "/admin";
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(loginAction, {});

  if (!configured) {
    return (
      <p role="status" className="mt-8 rounded-2xl border border-amber-300/40 bg-amber-300/10 p-5 text-sm text-amber-100">
        L&apos;espace admin n&apos;est pas encore configuré. Définissez les variables <code>ADMIN_PASSWORD</code> et{" "}
        <code>SESSION_SECRET</code> (voir le README, section « Espace admin »).
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-8 rounded-3xl border border-line bg-ink-2 p-6 sm:p-8">
      <input type="hidden" name="next" value={next} />
      <label htmlFor="password" className="text-sm font-medium">
        Mot de passe
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        aria-invalid={state.error ? true : undefined}
        aria-describedby={state.error ? "password-error" : undefined}
        className="mt-2 block h-12 w-full rounded-xl border border-white/12 bg-ink px-4 text-base text-white focus:border-brand-3 focus:ring-3 focus:ring-brand/30 focus:outline-none"
      />
      {state.error && (
        <p id="password-error" role="alert" className="mt-3 flex items-center gap-2 text-sm text-red-300">
          <AlertCircle aria-hidden="true" className="size-4 shrink-0" /> {state.error}
        </p>
      )}
      <button type="submit" disabled={isPending} className={buttonClasses("primary", "lg", "mt-6 w-full")}>
        <LogIn aria-hidden="true" className="size-5" />
        {isPending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
