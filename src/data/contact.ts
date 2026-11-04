/** Textes de la section contact et du formulaire. */
export const contactSection = {
  eyebrow: "Contact",
  title: "Parlons de votre projet.",
  intro:
    "Décrivez votre activité et votre besoin. Votre message est préparé automatiquement : il vous suffit de l'envoyer depuis WhatsApp ou votre messagerie.",
  howItWorks: [
    "Remplissez le formulaire.",
    "Choisissez WhatsApp ou e-mail : votre message s'ouvre déjà rédigé.",
    "Appuyez sur « Envoyer » dans l'application. Nous vous répondons rapidement.",
  ],
};

export const contactFormLabels = {
  fullName: "Nom complet",
  email: "Adresse e-mail",
  company: "Entreprise ou activité",
  service: "Service recherché",
  servicePlaceholder: "Choisissez un levier",
  message: "Description du besoin",
  messagePlaceholder: "Votre activité, votre objectif, ce qui vous freine aujourd'hui…",
  submitWhatsApp: "Envoyer via WhatsApp",
  submitEmail: "Envoyer par e-mail",
  privacy:
    "Vos informations servent uniquement à préparer votre message. Elles ne sont ni stockées ni transmises par ce site.",
  errorSummary: "Certains champs sont à corriger avant l'envoi.",
  /** Messages affichés après ouverture de l'application. Jamais « message envoyé » : le site ne peut pas le vérifier. */
  openedWhatsApp:
    "WhatsApp s'est ouvert avec votre message. Il ne vous reste plus qu'à appuyer sur « Envoyer » dans l'application.",
  openedEmail:
    "Votre messagerie s'est ouverte avec votre message. Il ne vous reste plus qu'à appuyer sur « Envoyer ».",
  popupHint: "Rien ne s'est ouvert ?",
  popupLink: "Ouvrir le message manuellement",
  /** Affiché uniquement en développement si aucune coordonnée n'est renseignée. */
  notConfiguredDev:
    "Les coordonnées de contact ne sont pas encore configurées. Renseignez `contact.email` et `contact.whatsapp` dans src/data/site.ts.",
  /** Affiché aux visiteurs si aucune coordonnée n'est renseignée en production. */
  notConfiguredPublic: "Le formulaire est momentanément indisponible. Merci de réessayer un peu plus tard.",
};
