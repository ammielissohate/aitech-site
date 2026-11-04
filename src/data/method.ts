import type { MethodStep } from "@/types/content";

export const methodSection = {
  eyebrow: "Notre méthode",
  title: "Une approche structurée, de l'idée aux résultats.",
  intro: "Quatre étapes claires, partagées avec vous du premier échange au suivi.",
};

export const methodSteps: MethodStep[] = [
  {
    number: "01",
    name: "Discover",
    title: "Comprendre",
    description: "Votre activité, vos objectifs, votre audience et ce qui vous freine aujourd'hui.",
  },
  {
    number: "02",
    name: "Strategize",
    title: "Prioriser",
    description: "Définir les priorités et construire une stratégie adaptée à vos moyens.",
  },
  {
    number: "03",
    name: "Create",
    title: "Concevoir",
    description: "Concevoir et déployer les solutions créatives et digitales retenues.",
  },
  {
    number: "04",
    name: "Optimize",
    title: "Améliorer",
    description: "Observer les indicateurs, identifier les améliorations et ajuster les actions.",
  },
];
