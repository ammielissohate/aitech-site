import type { IconKey } from "@/types/content";
import type { ZonePrices } from "@/lib/pricing";

/**
 * Catalogue des offres et des prix.
 *
 * ➜ Pour changer un prix : modifiez `prices` (africa = FCFA, europe = €, international = $).
 * ➜ Les montants sont recalculés côté serveur au moment du devis : un visiteur ne peut pas les modifier.
 *
 * Règles commerciales (à garder honnêtes) :
 *  - une « économie » n'est affichée que si le pack est réellement moins cher que l'unité (`savings`) ;
 *  - les délais sont des délais de production indicatifs, confirmés lors de l'appel.
 */

export type OfferCategoryId = "identite" | "ux-ui" | "web" | "contenus";

export interface Offer {
  id: string;
  category: OfferCategoryId;
  name: string;
  /** Phrase d'accroche orientée bénéfice. */
  promise: string;
  /** Ce que le client reçoit concrètement. */
  includes: string[];
  /** Délai indicatif, en texte. */
  duration: string;
  prices: ZonePrices;
  /** « À partir de » : le prix final dépend du périmètre. */
  startingAt?: boolean;
  /** Offre mise en avant dans sa catégorie. */
  recommended?: boolean;
  /** Offre vendue à l'unité : le client choisit une quantité. */
  unit?: { singular: string; plural: string; max: number };
  /** Calcul de l'économie réelle par rapport à une offre à l'unité. */
  savings?: { unitOfferId: string; units: number };
}

export interface OfferCategory {
  id: OfferCategoryId;
  name: string;
  icon: IconKey;
  /** Promesse émotionnelle de la catégorie. */
  headline: string;
  description: string;
  /** Ce que le client gagne (bénéfices, pas caractéristiques). */
  gains: string[];
}

export const offerCategories: OfferCategory[] = [
  {
    id: "identite",
    name: "Identité de marque",
    icon: "fingerprint",
    headline: "Faites-vous reconnaître au premier regard.",
    description:
      "Votre marque est la première chose que vos clients jugent. Donnons-lui une image qui inspire confiance avant même que vous ne parliez.",
    gains: [
      "Des clients qui vous prennent au sérieux dès le premier contact",
      "Une image cohérente partout : réseaux, documents, enseigne",
      "La fierté de présenter votre marque, enfin à la hauteur de votre travail",
    ],
  },
  {
    id: "ux-ui",
    name: "Design UX/UI",
    icon: "pen-tool",
    headline: "Voyez votre site ou votre application avant de le construire.",
    description:
      "Des maquettes claires et modernes, pensées pour vos utilisateurs : vous validez chaque écran avant le moindre développement.",
    gains: [
      "Des décisions rapides : vous voyez, vous validez, vous avancez",
      "Moins d'erreurs et de coûts au développement",
      "Une expérience que vos utilisateurs comprennent sans effort",
    ],
  },
  {
    id: "web",
    name: "Sites web & boutiques",
    icon: "trending-up",
    headline: "Un site qui travaille pour vous, même quand vous dormez.",
    description:
      "Landing pages, sites vitrines et boutiques en ligne rapides, adaptés au mobile et conçus pour transformer les visiteurs en demandes.",
    gains: [
      "Une présence professionnelle disponible 24 h/24",
      "Des visiteurs guidés jusqu'à la prise de contact ou l'achat",
      "Un site rapide sur mobile, là où sont vos clients",
    ],
  },
  {
    id: "contenus",
    name: "Contenus réseaux sociaux",
    icon: "megaphone",
    headline: "Des publications qui arrêtent le défilement.",
    description:
      "Visuels, carrousels et vidéos en motion design aux couleurs de votre marque, pour une présence régulière et remarquée.",
    gains: [
      "Une page qui donne envie de s'abonner",
      "Des messages clairs qui déclenchent des réactions",
      "Du temps gagné : vous publiez, on s'occupe du design",
    ],
  },
];

export const offers: Offer[] = [
  /* ─── Identité de marque ─── */
  {
    id: "identite-eclosion",
    category: "identite",
    name: "Pack Éclosion",
    promise: "L'essentiel pour lancer votre marque avec assurance.",
    includes: [
      "Logo principal + 2 déclinaisons",
      "Palette de couleurs et typographies",
      "Fichiers haute définition et vectoriels",
      "2 séries de retouches",
    ],
    duration: "5 jours",
    prices: { africa: 25_000, europe: 290, international: 329 },
  },
  {
    id: "identite-signature",
    category: "identite",
    name: "Pack Signature",
    promise: "Une marque complète, prête à briller sur tous vos supports.",
    includes: [
      "Tout le pack Éclosion",
      "Mini-charte graphique (PDF)",
      "Carte de visite prête à imprimer",
      "3 visuels pour vos réseaux",
      "Photo de profil et bannière",
      "3 séries de retouches",
    ],
    duration: "10 jours",
    prices: { africa: 65_000, europe: 690, international: 790 },
    recommended: true,
  },
  {
    id: "identite-empire",
    category: "identite",
    name: "Pack Empire",
    promise: "Pour les marques qui visent grand et veulent tout maîtriser.",
    includes: [
      "Tout le pack Signature",
      "Plateforme de marque : positionnement, valeurs, ton",
      "Charte graphique complète",
      "10 modèles réseaux sociaux modifiables",
      "Papeterie complète et mises en situation",
      "Présentation de marque",
    ],
    duration: "15 à 20 jours",
    prices: { africa: 130_000, europe: 1290, international: 1490 },
  },

  /* ─── Design UX/UI ─── */
  {
    id: "maquette-landing",
    category: "ux-ui",
    name: "Maquette landing page",
    promise: "Une page de vente pensée pour convertir, validée écran par écran.",
    includes: ["Maquette desktop et mobile (Figma)", "Parcours de conversion", "2 séries de retouches"],
    duration: "4 jours",
    prices: { africa: 14_500, europe: 290, international: 329 },
  },
  {
    id: "maquette-plateforme",
    category: "ux-ui",
    name: "Maquette plateforme",
    promise: "Une plateforme claire de 3 à 4 menus et plus, sans confusion pour vos utilisateurs.",
    includes: ["Arborescence et parcours utilisateurs", "Maquettes desktop et mobile", "Composants réutilisables", "Prototype cliquable"],
    duration: "10 jours",
    prices: { africa: 35_000, europe: 690, international: 790 },
    recommended: true,
  },
  {
    id: "maquette-site",
    category: "ux-ui",
    name: "Maquette site complet",
    promise: "Toutes les pages de votre site, cohérentes et prêtes à développer.",
    includes: ["Toutes les pages (desktop et mobile)", "Guide de style", "Prototype cliquable", "Fichiers prêts pour le développement"],
    duration: "12 jours",
    prices: { africa: 40_000, europe: 790, international: 890 },
  },
  {
    id: "maquette-application",
    category: "ux-ui",
    name: "Maquette application",
    promise: "Votre application, visible et testable avant la première ligne de code.",
    includes: ["Parcours utilisateurs", "Écrans de l'application", "Prototype cliquable", "Périmètre ajusté à vos fonctionnalités"],
    duration: "12 jours",
    prices: { africa: 35_000, europe: 890, international: 990 },
    startingAt: true,
  },

  /* ─── Sites web & boutiques ─── */
  {
    id: "web-landing",
    category: "web",
    name: "Landing page en ligne",
    promise: "Une page rapide qui transforme votre trafic en demandes.",
    includes: ["Design et développement", "Adaptée au mobile", "Formulaire ou WhatsApp intégré", "Référencement de base"],
    duration: "7 jours",
    prices: { africa: 75_000, europe: 590, international: 690 },
  },
  {
    id: "web-vitrine",
    category: "web",
    name: "Site vitrine",
    promise: "Votre entreprise présentée comme elle le mérite, jusqu'à 5 pages.",
    includes: ["Jusqu'à 5 pages", "Design sur mesure", "Adapté au mobile", "Référencement de base", "Formation à la mise à jour"],
    duration: "15 jours",
    prices: { africa: 150_000, europe: 1290, international: 1490 },
    recommended: true,
  },
  {
    id: "web-boutique",
    category: "web",
    name: "Boutique en ligne",
    promise: "Vendez en ligne, jour et nuit, avec une boutique simple à gérer.",
    includes: ["Catalogue produits", "Panier et commande", "Paiement en ligne ou à la livraison", "Formation à la gestion"],
    duration: "21 à 30 jours",
    prices: { africa: 250_000, europe: 1990, international: 2290 },
    startingAt: true,
  },

  /* ─── Contenus réseaux sociaux ─── */
  {
    id: "visuel",
    category: "contenus",
    name: "Visuel de publication",
    promise: "Un visuel qui donne envie de s'arrêter et de lire.",
    includes: ["Format adapté au réseau choisi", "Aux couleurs de votre marque", "1 série de retouches"],
    duration: "24 à 48 h",
    prices: { africa: 5_000, europe: 35, international: 39 },
    unit: { singular: "visuel", plural: "visuels", max: 30 },
  },
  {
    id: "carrousel-slide",
    category: "contenus",
    name: "Carrousel (par slide)",
    promise: "Racontez une idée en plusieurs images qui se lisent jusqu'au bout.",
    includes: ["Slides au format du réseau", "Mise en page et textes intégrés", "1 série de retouches"],
    duration: "48 h",
    prices: { africa: 2_500, europe: 20, international: 22 },
    unit: { singular: "slide", plural: "slides", max: 30 },
  },
  {
    id: "carrousel-pack5",
    category: "contenus",
    name: "Carrousel · pack 5 slides",
    promise: "Le format idéal pour éduquer et convaincre votre audience.",
    includes: ["5 slides cohérentes", "Accroche et appel à l'action", "1 série de retouches"],
    duration: "3 jours",
    prices: { africa: 10_000, europe: 90, international: 99 },
    recommended: true,
    savings: { unitOfferId: "carrousel-slide", units: 5 },
  },
  {
    id: "motion-30s",
    category: "contenus",
    name: "Motion design · 30 s",
    promise: "Une vidéo animée courte qui capte l'attention en quelques secondes.",
    includes: ["Animation de 30 secondes", "Musique libre de droits", "1 série de retouches"],
    duration: "3 jours",
    prices: { africa: 5_000, europe: 120, international: 139 },
  },
  {
    id: "motion-1min",
    category: "contenus",
    name: "Motion design · 1 min",
    promise: "Le temps idéal pour présenter une offre ou un événement.",
    includes: ["Animation d'une minute", "Musique libre de droits", "1 série de retouches"],
    duration: "5 jours",
    prices: { africa: 8_500, europe: 200, international: 229 },
  },
  {
    id: "motion-1min30",
    category: "contenus",
    name: "Motion design · 1 min 30",
    promise: "Expliquez votre service en images, simplement.",
    includes: ["Animation d'une minute trente", "Musique libre de droits", "2 séries de retouches"],
    duration: "6 jours",
    prices: { africa: 16_000, europe: 290, international: 329 },
  },
  {
    id: "motion-2min",
    category: "contenus",
    name: "Motion design · 2 min",
    promise: "Une vraie histoire animée autour de votre marque.",
    includes: ["Animation de deux minutes", "Musique libre de droits", "2 séries de retouches"],
    duration: "7 jours",
    prices: { africa: 22_500, europe: 370, international: 429 },
  },
];

/** Engagements communs à toutes les offres (à confirmer par le studio). */
export const offerGuarantees = [
  { title: "Paiement en deux fois", description: "50 % au démarrage, 50 % à la livraison." },
  { title: "Retouches incluses", description: "Le nombre de séries de retouches est indiqué dans chaque offre." },
  { title: "Fichiers livrés", description: "Vous recevez les fichiers finaux, prêts à l'emploi." },
  { title: "Un interlocuteur unique", description: "Vous échangez directement avec le designer, sans intermédiaire." },
];

export const offersSection = {
  eyebrow: "Nos offres",
  title: "Des offres claires. Un devis en 3 clics.",
  intro:
    "Choisissez l'offre qui vous correspond, obtenez votre devis immédiatement et réservez un appel pour lancer votre projet.",
  cta: "Obtenir mon devis",
  seeAll: "Voir toutes les offres",
  page: {
    title: "Nos offres",
    intro:
      "Identité de marque, design UX/UI, sites web et contenus : des prix transparents, des délais annoncés et un devis immédiat.",
    seo: {
      title: "Offres et tarifs : identité de marque, UX/UI, sites web",
      description:
        "Tarifs clairs pour l'identité de marque, les maquettes UX/UI, les sites web, les boutiques en ligne et les contenus réseaux sociaux. Devis immédiat.",
    },
  },
};

export function getOffer(id: string): Offer | undefined {
  return offers.find((offer) => offer.id === id);
}

export function getOfferCategory(id: OfferCategoryId): OfferCategory {
  return offerCategories.find((category) => category.id === id) ?? offerCategories[0];
}
