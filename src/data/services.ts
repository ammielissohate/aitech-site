import type { Pillar, PillarSlug } from "@/types/content";

/**
 * Les trois piliers commerciaux de AiTech.
 *
 * Règle éditoriale : chaque prestation est une réponse à un besoin d'entreprise.
 * Les logiciels (Figma, Adobe…) sont listés dans `tools` comme des moyens, jamais comme des offres.
 * Les `indicators` sont des indicateurs de suivi, pas des résultats promis.
 */
export const solutionsSection = {
  eyebrow: "Nos solutions",
  title: "Trois leviers. Une même ambition : votre croissance.",
  intro:
    "Chaque prestation sert l'un de ces trois leviers. Nous commençons par celui qui freine le plus votre développement, puis nous construisons la suite.",
};

export const pillars: Pillar[] = [
  {
    slug: "brand-positioning",
    number: "01",
    dimension: "Brand",
    name: "Brand & Positioning",
    icon: "fingerprint",
    goal: "Construire une image de marque crédible, cohérente et différenciante.",
    summary:
      "Clarifier ce qui vous rend unique et le traduire en une identité qui inspire confiance dès le premier contact.",
    promise:
      "Votre image est souvent le premier contact entre votre entreprise et vos futurs clients. Faisons en sorte qu'elle inspire confiance.",
    services: [
      {
        title: "Stratégie et positionnement de marque",
        description: "Définir à qui vous parlez, ce que vous promettez et pourquoi vous choisir.",
      },
      {
        title: "Identité visuelle et direction artistique",
        description: "Logo, couleurs, typographies et règles d'usage pour une image reconnaissable.",
      },
      {
        title: "Supports de communication",
        description: "Plaquettes, présentations, cartes, signalétique : des supports qui vendent votre sérieux.",
      },
      {
        title: "Design éditorial",
        description: "Catalogues, rapports et documents commerciaux clairs et agréables à lire.",
      },
      {
        title: "Cohérence visuelle sur tous les points de contact",
        description: "Une expérience homogène, du réseau social au document envoyé à un prospect.",
      },
    ],
    signals: [
      "Votre logo ou vos supports ont été créés « en attendant » et n'ont jamais été repensés.",
      "Vos prospects comparent surtout les prix, faute de percevoir votre différence.",
      "Chaque support a un style différent selon la personne qui l'a produit.",
      "Vous lancez une activité, une offre ou une nouvelle cible.",
    ],
    deliverables: [
      "Plateforme de marque (positionnement, promesse, ton)",
      "Logo et déclinaisons",
      "Charte graphique et guide d'usage",
      "Kit de supports (présentation, documents, réseaux sociaux)",
    ],
    indicators: [
      "Cohérence des supports existants avant / après",
      "Clarté du message perçue par vos clients",
      "Temps gagné pour produire de nouveaux supports",
    ],
    tools: ["Figma", "Lunacy", "Adobe", "Canva"],
    seo: {
      title: "Brand & Positioning : stratégie de marque et identité visuelle",
      description:
        "AiTech construit des marques crédibles et cohérentes : positionnement, identité visuelle, direction artistique et supports de communication.",
    },
  },
  {
    slug: "content-visibility",
    number: "02",
    dimension: "Visibility",
    name: "Content & Visibility",
    icon: "megaphone",
    goal: "Améliorer votre présence digitale et renforcer votre visibilité auprès de votre audience.",
    summary:
      "Mettre en place une communication régulière et cohérente, qui porte le bon message auprès des bonnes personnes.",
    promise:
      "Une présence digitale efficace ne consiste pas seulement à publier. Elle consiste à communiquer le bon message aux bonnes personnes.",
    services: [
      {
        title: "Stratégie de contenu et calendrier éditorial",
        description: "Quoi publier, où, à quel rythme et dans quel but commercial.",
      },
      {
        title: "Système de production de contenu",
        description: "Une organisation simple pour publier régulièrement sans y passer vos journées.",
      },
      {
        title: "Visuels pour les réseaux sociaux",
        description: "Des formats cohérents avec votre marque et lisibles en un coup d'œil.",
      },
      {
        title: "Vidéos courtes : montage et adaptation",
        description: "Des contenus vidéo adaptés à chaque plateforme pour capter l'attention.",
      },
      {
        title: "Storytelling et déclinaison multiplateforme",
        description: "Raconter votre expertise et réutiliser chaque contenu sur plusieurs canaux.",
      },
    ],
    signals: [
      "Vous publiez de façon irrégulière, au gré du temps disponible.",
      "Vos publications ne reflètent pas votre niveau d'expertise.",
      "Vous ne savez pas quels contenus amènent réellement des contacts.",
      "Vous êtes présent sur plusieurs réseaux sans stratégie commune.",
    ],
    deliverables: [
      "Stratégie et lignes éditoriales",
      "Calendrier éditorial",
      "Gabarits de visuels aux couleurs de la marque",
      "Vidéos courtes montées et adaptées par plateforme",
    ],
    indicators: [
      "Régularité de publication",
      "Portée et engagement par type de contenu",
      "Messages et demandes reçus via les réseaux",
    ],
    tools: ["Adobe", "Canva", "Outils de montage vidéo", "Outils d'IA pour la production"],
    seo: {
      title: "Content & Visibility : stratégie de contenu et présence digitale",
      description:
        "AiTech structure votre communication digitale : stratégie de contenu, calendriers éditoriaux, visuels réseaux sociaux et vidéos courtes.",
    },
  },
  {
    slug: "digital-growth",
    number: "03",
    dimension: "Growth",
    name: "Digital Growth & Acquisition",
    icon: "trending-up",
    goal: "Transformer votre présence digitale en opportunités commerciales.",
    summary:
      "Concevoir des sites et des parcours qui facilitent le passage de l'intérêt à la prise de contact.",
    promise:
      "Votre présence digitale doit travailler pour votre entreprise. Construisons des expériences qui facilitent le passage de l'intérêt à la prise de contact.",
    services: [
      {
        title: "Landing pages orientées conversion",
        description: "Une page, une offre, un objectif : obtenir une demande qualifiée.",
      },
      {
        title: "Sites web vitrines",
        description: "Un site clair, rapide et crédible qui explique ce que vous faites et pour qui.",
      },
      {
        title: "Parcours de conversion et appels à l'action",
        description: "Guider le visiteur, étape par étape, jusqu'à la prise de contact.",
      },
      {
        title: "Structuration des points de contact",
        description: "Formulaires, WhatsApp, e-mail : des canaux simples et bien reliés.",
      },
      {
        title: "Solutions numériques sur mesure",
        description: "Des outils adaptés à vos besoins commerciaux, pensés avec vous.",
      },
    ],
    signals: [
      "Votre site existe, mais ne génère presque aucune demande.",
      "Vos visiteurs ne trouvent pas facilement comment vous contacter.",
      "Vous faites de la publicité sans page dédiée pour accueillir les prospects.",
      "Vous n'avez pas encore de site, ou il n'est plus à jour.",
    ],
    deliverables: [
      "Arborescence et parcours utilisateur",
      "Maquettes UI/UX",
      "Site ou landing page développé, rapide et responsive",
      "Points de contact configurés et testés",
    ],
    indicators: [
      "Taux de visiteurs qui passent à l'action",
      "Nombre et qualité des demandes reçues",
      "Vitesse de chargement et confort mobile",
    ],
    tools: ["Figma", "HTML / CSS / JavaScript", "Next.js", "Python & Django"],
    seo: {
      title: "Digital Growth & Acquisition : landing pages et sites orientés conversion",
      description:
        "AiTech conçoit des landing pages, sites vitrines et parcours de conversion qui facilitent la prise de contact de vos prospects.",
    },
  },
];

/** Libellés du champ « Service recherché » du formulaire. */
export const serviceOptions: { value: PillarSlug | "autre"; label: string }[] = [
  ...pillars.map((pillar) => ({ value: pillar.slug, label: pillar.name })),
  { value: "autre", label: "Autre besoin" },
];

/** Retrouve un pilier par son slug, ou `undefined` s'il n'existe pas. */
export function getPillarBySlug(slug: string): Pillar | undefined {
  return pillars.find((pillar) => pillar.slug === slug);
}
