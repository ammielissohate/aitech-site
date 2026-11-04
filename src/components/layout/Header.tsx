"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { mainNavigation, navigationCta } from "@/data/navigation";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";

/**
 * Navigation principale, fixe en haut de page.
 * - Desktop : liens + CTA.
 * - Mobile : menu dans un <dialog> natif (focus piégé, fermeture par Échap et clic sur le fond).
 */
export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Ajoute un fond à la navigation dès que la page défile.
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMenu = () => dialogRef.current?.showModal();
  const closeMenu = () => dialogRef.current?.close();

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        isScrolled ? "glass border-line" : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Logo />

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {mainNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-muted transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* Conteneur dédié : `hidden` sur le bouton serait écrasé par son `inline-flex`. */}
          <div className="hidden sm:block">
            <ButtonLink href={navigationCta.href} size="md">
              {navigationCta.label}
            </ButtonLink>
          </div>
          <button
            type="button"
            onClick={openMenu}
            aria-haspopup="dialog"
            aria-controls="mobile-menu"
            className="inline-flex size-11 items-center justify-center rounded-full border border-line text-white lg:hidden"
          >
            <Menu aria-hidden="true" className="size-5" />
            <span className="sr-only">Ouvrir le menu</span>
          </button>
        </div>
      </div>

      <dialog
        id="mobile-menu"
        ref={dialogRef}
        aria-label="Menu"
        // Fermeture au clic sur le fond (le clic sur le fond cible le <dialog> lui-même).
        onClick={(event) => event.target === event.currentTarget && closeMenu()}
        className="mobile-menu m-0 ml-auto h-dvh max-h-none w-[min(22rem,100%)] max-w-none bg-ink-2 p-0 text-white backdrop:bg-transparent"
      >
        <div className="flex h-full flex-col px-6 pt-5 pb-8">
          <div className="flex items-center justify-between">
            <Logo asLink={false} />
            <button
              type="button"
              onClick={closeMenu}
              className="inline-flex size-11 items-center justify-center rounded-full border border-line"
            >
              <X aria-hidden="true" className="size-5" />
              <span className="sr-only">Fermer le menu</span>
            </button>
          </div>

          <nav aria-label="Navigation mobile" className="mt-12">
            <ul className="flex flex-col gap-1">
              {mainNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="block rounded-xl px-3 py-3 font-display text-2xl font-medium hover:bg-white/5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ButtonLink href={navigationCta.href} onClick={closeMenu} size="lg" withArrow className="mt-auto w-full">
            {navigationCta.label}
          </ButtonLink>
        </div>
      </dialog>
    </header>
  );
}
