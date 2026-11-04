import type { Metadata } from "next";
import type { ReactNode } from "react";

/** Espace admin : jamais indexé par les moteurs de recherche. */
export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-[85svh] bg-ink pt-28 pb-24 sm:pt-32">{children}</div>;
}
