import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";
import { isAuthConfigured } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false, follow: false },
};

/** Page de connexion de l'administrateur (non référencée, non liée publiquement). */
export default function LoginPage() {
  return (
    <section className="flex min-h-[85svh] items-center bg-ink px-5 pt-32 pb-20 sm:px-8">
      <div className="mx-auto w-full max-w-md">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Espace admin</h1>
        <p className="mt-3 text-muted">Connectez-vous pour ajouter et gérer vos réalisations.</p>
        {/* useSearchParams (paramètre ?next=) : le formulaire est rendu sous Suspense. */}
        <Suspense fallback={<div className="mt-8 h-44 animate-pulse rounded-3xl bg-ink-2" />}>
          <LoginForm configured={isAuthConfigured()} />
        </Suspense>
      </div>
    </section>
  );
}
