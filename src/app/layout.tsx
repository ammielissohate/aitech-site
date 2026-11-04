import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { siteConfig } from "@/data/site";
import "./globals.css";

/* Polices auto-hébergées par next/font : aucune requête vers Google côté visiteur. */
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], display: "swap" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

const defaultTitle = `${siteConfig.name} — ${siteConfig.category} | Brand, Visibility & Growth`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: defaultTitle, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "studio de croissance digitale",
    "identité visuelle",
    "branding",
    "stratégie de contenu",
    "création de site web",
    "landing page",
    "Bénin",
    "Afrique francophone",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: siteConfig.name,
    title: defaultTitle,
    description: siteConfig.description,
  },
  twitter: { card: "summary_large_image", title: defaultTitle, description: siteConfig.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#09090F",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-scroll-behavior : Next désactive le défilement doux pendant les changements de page,
    // ce qui garantit le saut vers les ancres (/#contact) depuis une autre page.
    <html lang={siteConfig.language} data-scroll-behavior="smooth" className={`${sora.variable} ${inter.variable}`}>
      <body className="min-h-dvh">
        <a
          href="#contenu"
          className="sr-only z-100 rounded-full bg-white px-4 py-2 text-sm font-medium text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Aller au contenu
        </a>
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
