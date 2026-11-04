import type { Problem } from "@/types/content";

/** Section « Les problèmes de nos clients ». Partir du problème avant de parler de solution. */
export const problemsSection = {
  eyebrow: "Le constat",
  title: "Votre présence digitale ne devrait pas être un frein à votre croissance.",
  intro:
    "Beaucoup d'entreprises ont de bonnes offres, mais une communication qui ne leur rend pas justice. Ces situations vous parlent ?",
  transition: {
    text: "Ces difficultés ne relèvent pas d'un seul outil, mais d'un ensemble : votre image, votre visibilité et votre capacité à convertir. C'est exactement sur ces trois leviers que travaille AiTech.",
    cta: "Voir comment nous y répondons",
  },
};

export const problems: Problem[] = [
  {
    icon: "fingerprint",
    title: "Une image qui ne reflète pas votre valeur",
    description:
      "Vos services sont solides, mais votre identité visuelle et vos supports donnent une impression moins professionnelle que la réalité.",
  },
  {
    icon: "megaphone",
    title: "Une visibilité irrégulière",
    description:
      "Vous publiez quand vous pouvez, sans ligne claire. Votre audience vous oublie entre deux prises de parole.",
  },
  {
    icon: "eye",
    title: "De l'attention, mais peu de contacts",
    description:
      "Vos contenus obtiennent des réactions, pourtant les demandes commerciales restent rares. Le message n'amène pas à l'action.",
  },
  {
    icon: "mouse-pointer-click",
    title: "Des outils qui ne facilitent pas la prise de contact",
    description:
      "Votre site ou vos pages expliquent mal ce que vous proposez et ne guident pas le visiteur vers une demande.",
  },
];
