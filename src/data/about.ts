import type { Founder } from "@/types/content";

/**
 * Page « À propos » : présentation du fondateur, à partir de son CV.
 *
 * ➜ La PHOTO se change depuis le site : Admin → Paramètres (aucun code à modifier).
 * ➜ Pour ajouter une distinction ou une expérience : ajoutez une ligne dans la liste concernée.
 *
 * Règle : uniquement des faits vérifiables. Les organisations citées sont des employeurs,
 * des programmes ou des partenaires du parcours personnel : elles ne sont pas présentées comme clientes d'AiTech.
 */
export const aboutSection = {
  eyebrow: "À propos",
  title: "Designer, développeur, lauréat. Et surtout, à votre écoute.",
  seo: {
    title: "Ammiel ISSOTINA, fondateur d'AiTech",
    description:
      "Designer graphique, UI/UX designer et développeur web basé à Parakou (Bénin), lauréat Beyotago (Epitech) et CDE Parakou. Fondateur du studio AiTech.",
  },
  storyTitle: "Pourquoi AiTech existe",
  distinctionsTitle: "Distinctions & sélections",
  distinctionsIntro: "Des projets numériques reconnus par des jurys, des écoles et des communautés tech.",
  experienceTitle: "Parcours professionnel",
  educationTitle: "Formation",
  expertiseTitle: "Ce que j'apporte à chaque levier",
  expertiseIntro:
    "Mes compétences ne sont pas des offres séparées : elles se combinent pour servir l'image, la visibilité et la croissance de votre entreprise.",
  toolsTitle: "Outils du quotidien",
  languagesTitle: "Langues",
  principlesTitle: "Ma façon de travailler",
  cta: { label: "Obtenir mon devis", href: "/offres" },
};

export const founder: Founder = {
  name: "Ammiel ISSOTINA",
  role: "Fondateur d'AiTech · Designer & développeur web",
  location: "Parakou, Bénin",
  intro:
    "Je crée des marques, des contenus et des sites qui donnent aux entreprises l'image qu'elles méritent, et les clients qui vont avec.",
  story: [
    "Depuis 2022, j'accompagne particuliers et entreprises en freelance : identités visuelles, maquettes de sites et d'applications, contenus pour les réseaux sociaux. J'ai aussi été graphiste officiel et community manager pour des événements, des artistes et des structures au Bénin.",
    "Formé en sciences informatiques, passé par Epitech et plusieurs programmes tech, je relie ce que beaucoup séparent : le design qui attire, la communication qui engage et le code qui convertit.",
    "J'ai créé AiTech pour offrir aux entrepreneurs d'Afrique et d'ailleurs un studio où l'on écoute avant de produire, où les prix sont clairs, et où chaque création sert un objectif concret : être reconnu, être vu, être choisi.",
  ],
  highlights: [
    { value: "Depuis 2022", label: "en freelance auprès de particuliers et d'entreprises" },
    { value: "3 fois lauréat", label: "de concours de projets numériques (dont 2 premières places)" },
    { value: "4 langues", label: "français, anglais, dendi et lokpa" },
  ],
  distinctions: [
    {
      year: "2024",
      title: "Lauréat · 1re place",
      organization: "CDE Parakou · programme Hub Innovation",
      detail: "Plateforme de suivi des alumni.",
      kind: "prix",
    },
    {
      year: "2022",
      title: "Lauréat · 1re place",
      organization: "Beyotago, programme initié par Epitech",
      detail: "Projet numérique de recyclage et de transformation des déchets.",
      kind: "prix",
    },
    {
      year: "2020",
      title: "Lauréat · 3e place",
      organization: "Beyotago, programme initié par Epitech",
      detail: "Bourse obtenue en équipe pour un projet dans le domaine du numérique.",
      kind: "prix",
    },
    {
      year: "Bourse",
      title: "Boursier Data Scientist",
      organization: "Isheero, communauté de l'IA au Bénin",
      detail: "Parcours data science et atelier pratique en IA (RAG, LLM) avec Indaba Bénin.",
      kind: "bourse",
    },
    {
      year: "Bourse",
      title: "Boursier",
      organization: "Ideation Hub Africa",
      detail: "Programme d'accompagnement à l'innovation.",
      kind: "bourse",
    },
    {
      year: "Sélection",
      title: "Créateur de contenu engagé",
      organization: "SOS Civisme Bénin et partenaires internationaux",
      detail: "Sélectionné pour sensibiliser aux violences basées sur le genre (VBG).",
      kind: "selection",
    },
    // À COMPLÉTER : distinction 2025 (programme, place, projet), puis retirer ce commentaire.
  ],
  experiences: [
    {
      role: "Graphiste & Community Manager",
      organization: "Freelance",
      period: "Depuis septembre 2022",
      points: [
        "Identités visuelles pour particuliers et entreprises : logos, chartes, supports marketing",
        "Maquettes de sites web et d'applications",
        "Gestion de réseaux sociaux : stratégie, carrousels, infographies, animations, modération",
      ],
    },
    {
      role: "Graphiste",
      organization: "Altis Strategy",
      period: "Juin 2026",
      points: ["Brochures de présentation des services", "Kakémonos pour les événements"],
    },
    {
      role: "Graphiste",
      organization: "Warrior Voice",
      period: "Mars 2026",
      points: ["Supports visuels et contenus graphiques", "Cohérence de l'identité visuelle"],
    },
    {
      role: "Community Manager & graphiste officiel",
      organization: "Alkaki Awards",
      period: "Septembre 2025 – février 2026",
      points: ["Création et gestion des contenus", "Designs et vidéos promotionnelles", "Stratégie digitale de portée et d'engagement"],
    },
    {
      role: "Community Manager",
      organization: "Jacob Nikki Songs",
      period: "Décembre 2024 – décembre 2025",
      points: ["Animation Facebook, TikTok et YouTube", "Visuels et vidéos pour les sorties musicales"],
    },
    {
      role: "Graphiste officiel",
      organization: "Le Soir de la Pentecôte 2024, Parakou",
      period: "Décembre 2023 – juin 2024",
      points: ["Affiches, teasers et campagnes visuelles de l'événement"],
    },
    {
      role: "Community Manager & Designer",
      organization: "Future is Us",
      period: "Décembre 2023 – juin 2024",
      points: ["Visuels et animation des pages Facebook et Instagram", "Stratégies d'engagement de la communauté"],
    },
  ],
  education: [
    { title: "Licence en science informatique et logiciel", organization: "Université Les Cours Sonou", period: "2021 – 2024" },
    { title: "Développement web, hackathon", organization: "Epitech", period: "2022 – 2023" },
    { title: "Introduction à Python, bases de données", organization: "Bourse Data Camp", period: "2026" },
    { title: "Atelier pratique en IA (RAG, LLM)", organization: "Indaba Bénin × Isheero", period: "2026" },
    { title: "Marketing digital, rédaction web", organization: "Jkoss Media", period: "2023" },
    { title: "Marketing digital, Canva, prompting IA", organization: "Blemama.com", period: "2023" },
  ],
  languages: [
    { name: "Français", level: "Langue maternelle" },
    { name: "Lokpa", level: "Langue maternelle" },
    { name: "Anglais", level: "Courant" },
    { name: "Dendi", level: "Courant" },
  ],
  expertiseByPillar: [
    {
      pillar: "brand-positioning",
      title: "Brand & Positioning",
      skills: ["Identité visuelle et branding", "Direction artistique", "Supports print : brochures, kakémonos, affiches"],
    },
    {
      pillar: "content-visibility",
      title: "Content & Visibility",
      skills: ["Stratégie de contenu et community management", "Carrousels, infographies et motion design", "Analyse des performances (Facebook, Instagram, LinkedIn)"],
    },
    {
      pillar: "digital-growth",
      title: "Digital Growth & Acquisition",
      skills: ["UI/UX design de sites et d'applications", "Développement front-end (HTML, CSS, JavaScript)", "Python, données et IA appliquée"],
    },
  ],
  tools: ["Figma", "Adobe Photoshop", "Adobe Illustrator", "Adobe XD", "Canva", "Outils d'intelligence artificielle"],
  principles: [
    {
      title: "Comprendre avant de produire",
      description: "Chaque projet commence par vos objectifs, votre audience et ce qui vous freine aujourd'hui.",
    },
    {
      title: "Dire les choses clairement",
      description: "Des prix affichés, des délais annoncés et des livrables définis à l'avance.",
    },
    {
      title: "Respecter les délais",
      description: "Une habitude prise sur des événements où la date ne se négocie pas.",
    },
  ],
};
