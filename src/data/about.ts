import type { Founder } from "@/types/content";

/**
 * Page « À propos » : présentation du fondateur de AiTech.
 *
 * ➜ À COMPLÉTER / RELIRE :
 *  - `name` : votre nom tel que vous souhaitez l'afficher.
 *  - `photo` : déposez votre photo dans `public/images/` (format portrait, idéalement 1200 × 1500 px)
 *    puis décommentez la ligne `photo`.
 *  - `story` : les paragraphes ci-dessous sont une première proposition rédigée à partir
 *    de votre profil. Relisez-les et ajustez-les avec vos mots et votre parcours réel.
 *
 * Règle éditoriale : le visiteur doit comprendre ce que vous apportez à son projet,
 * pas lire un CV complet. Les loisirs et activités personnelles n'ont pas leur place ici.
 */
export const aboutSection = {
  eyebrow: "À propos",
  title: "Une seule personne derrière la stratégie, le design et le code.",
  seo: {
    title: "À propos du fondateur",
    description:
      "Découvrez le fondateur de AiTech, studio de croissance digitale : un profil qui réunit stratégie, design, contenu et développement web.",
  },
  expertiseTitle: "Ce que j'apporte à chaque levier",
  expertiseIntro:
    "Mes compétences ne sont pas des offres séparées : elles se combinent pour servir l'image, la visibilité et la croissance de votre entreprise.",
  toolsTitle: "Outils du quotidien",
  principlesTitle: "Ma façon de travailler",
  cta: { label: "Parlons de votre projet", href: "/#contact" },
};

export const founder: Founder = {
  name: "", // À COMPLÉTER, par exemple "Prénom Nom"
  role: "Fondateur de AiTech",
  // photo: { src: "/images/fondateur.jpg", alt: "Portrait de Prénom Nom, fondateur de AiTech", width: 1200, height: 1500 },
  intro:
    "J'ai créé AiTech pour aider les entreprises à mieux se présenter, mieux communiquer et transformer leur présence digitale en opportunités commerciales.",
  story: [
    "Mon parcours m'a fait passer par le développement web, le design graphique, l'UI/UX, la création de contenu et l'audiovisuel. Ce profil polyvalent m'a appris une chose : une belle image ne suffit pas si personne ne la voit, et une forte visibilité ne sert à rien si elle ne mène pas à une prise de contact.",
    "C'est pour cela qu'AiTech relie trois leviers : construire une marque crédible, la rendre visible auprès des bonnes personnes, puis faciliter le passage de l'intérêt à la demande commerciale.",
    "Je travaille avec des entrepreneurs, des PME et des professionnels au Bénin, en Afrique francophone et à l'international, avec une approche simple : comprendre votre activité avant de proposer quoi que ce soit.",
  ],
  expertiseByPillar: [
    {
      pillar: "brand-positioning",
      title: "Brand & Positioning",
      skills: ["Identité visuelle et design graphique", "Direction artistique", "UI/UX design"],
    },
    {
      pillar: "content-visibility",
      title: "Content & Visibility",
      skills: ["Stratégie de contenu et storytelling", "Community management", "Montage vidéo et production de contenus"],
    },
    {
      pillar: "digital-growth",
      title: "Digital Growth & Acquisition",
      skills: [
        "Conception de sites web et landing pages",
        "Développement front-end (HTML, CSS, JavaScript)",
        "Python et Django, en cours d'approfondissement",
      ],
    },
  ],
  tools: ["Figma", "Lunacy", "Adobe", "Canva", "Outils d'intelligence artificielle"],
  principles: [
    {
      title: "Comprendre avant de produire",
      description: "Chaque projet commence par vos objectifs, votre audience et ce qui vous freine aujourd'hui.",
    },
    {
      title: "Dire les choses clairement",
      description: "Des étapes, des livrables et des délais définis à l'avance. Pas de promesse de résultats garantis.",
    },
    {
      title: "Utiliser la technologie avec discernement",
      description: "L'IA et les outils numériques accélèrent la production ; la stratégie et les choix restent humains.",
    },
  ],
};
