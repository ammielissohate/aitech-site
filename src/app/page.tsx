import { Contact } from "@/components/sections/Contact";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Method } from "@/components/sections/Method";
import { Problems } from "@/components/sections/Problems";
import { Projects } from "@/components/sections/Projects";
import { Solutions } from "@/components/sections/Solutions";
import { WhyAitech } from "@/components/sections/WhyAitech";
import { pillars } from "@/data/services";
import { siteConfig } from "@/data/site";

/**
 * Landing page : un parcours commercial progressif.
 * Promesse → Problème → Solutions → Méthode → Preuves → Différence → Action → Contact.
 */
export default function HomePage() {
  // Données structurées (schema.org) pour les moteurs de recherche.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    ...(siteConfig.contact.email ? { email: siteConfig.contact.email } : {}),
    areaServed: ["Bénin", "Afrique francophone", "International"],
    knowsAbout: pillars.map((pillar) => pillar.name),
    makesOffer: pillars.map((pillar) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: pillar.name, description: pillar.goal },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Contenu entièrement maîtrisé (données internes), « < » échappé par sécurité.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <Problems />
      <Solutions />
      <Method />
      <Projects />
      <WhyAitech />
      <FinalCta />
      <Contact />
    </>
  );
}
