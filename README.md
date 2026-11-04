# AiTech — site officiel

**Digital Growth Studio · Brand, Visibility & Acquisition**
_Votre image. Votre visibilité. Votre croissance._

Landing page orientée conversion et trois pages « solutions », construites avec Next.js 16 (App Router), TypeScript et Tailwind CSS 4, pour un hébergement sur Vercel.

---

## Sommaire

1. [Démarrage rapide](#1-démarrage-rapide)
2. [Avant la mise en ligne](#2-avant-la-mise-en-ligne-checklist)
3. [Modifier les contenus](#3-modifier-les-contenus)
4. [Le formulaire de contact](#4-le-formulaire-de-contact)
5. [Déployer sur Vercel](#5-déployer-sur-vercel)
6. [Architecture du projet](#6-architecture-du-projet)
7. [Qualité : lint, types, tests, build](#7-qualité--lint-types-tests-build)
8. [Notes techniques et limites connues](#8-notes-techniques-et-limites-connues)

---

## 1. Démarrage rapide

Prérequis : **Node.js 20.9 ou plus** (testé avec Node 24) et npm.

```bash
npm install
npm run dev
```

Le site est alors disponible sur http://localhost:3000.

| Commande            | Rôle                                               |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Serveur de développement                           |
| `npm run build`     | Build de production                                |
| `npm run start`     | Lance le build de production en local              |
| `npm run lint`      | Vérification ESLint                                |
| `npm run typecheck` | Vérification TypeScript (avec les types de routes) |
| `npm run test`      | Tests unitaires (Vitest)                           |
| `npm run check`     | Lint + types + tests en une commande               |

---

## 2. Avant la mise en ligne (checklist)

Tout se fait dans **`src/data/`**, sans toucher aux composants.

- [ ] **`src/data/site.ts`** → `contact.email` : l'adresse qui reçoit les demandes.
- [ ] **`src/data/site.ts`** → `contact.whatsapp` : numéro au format international, chiffres uniquement (ex. `2290100000000`).
- [ ] **`src/data/site.ts`** → `contact.location` : par exemple « Basé à Cotonou, disponible à distance ».
- [ ] **`src/data/site.ts`** → `socials` : renseignez les URL. Un réseau sans URL n'est pas affiché.
- [ ] **`src/data/projects.ts`** → ajoutez vos réalisations réelles (voir plus bas).
- [ ] **Vercel** → variable `NEXT_PUBLIC_SITE_URL` = votre domaine définitif.

> Tant que ni l'e-mail ni le WhatsApp ne sont renseignés, les boutons du formulaire restent désactivés. Un avertissement le signale en développement.

---

## 3. Modifier les contenus

Chaque section de la page lit ses textes dans un fichier de `src/data/` :

| Fichier            | Contenu                                                                     |
| ------------------ | --------------------------------------------------------------------------- |
| `site.ts`          | Nom, description, URL, coordonnées, réseaux sociaux                         |
| `navigation.ts`    | Liens du menu et bouton « Parlons de votre projet »                         |
| `home.ts`          | Hero (titre, sous-titre, boutons) et appel à l'action final                 |
| `problems.ts`      | Section « Le constat » (problèmes des clients)                              |
| `services.ts`      | **Les trois piliers** : cartes de la landing **et** pages `/solutions/...`  |
| `method.ts`        | Les quatre étapes de la méthode                                             |
| `projects.ts`      | Réalisations                                                                |
| `advantages.ts`    | Section « Pourquoi AiTech ? »                                               |
| `contact.ts`       | Textes et messages du formulaire                                            |

### Ajouter une réalisation

1. Déposez l'image dans `public/projects/` (idéalement 1600 × 1000 px, en `.jpg` ou `.webp`).
2. Dans `src/data/projects.ts`, dupliquez le modèle et complétez-le :

```ts
{
  id: "site-cabinet-x",
  status: "published",            // "draft" = visible seulement en développement
  title: "Site vitrine d'un cabinet de conseil",
  category: "web-experience",     // "brand-design" | "content-visibility" | "web-experience"
  context: "client-aitech",       // "client-aitech" | "salarie" | "personnel" | "formation"
  clientName: "Cabinet X",        // seulement avec l'accord du client
  description: "…",
  need: "…",                      // facultatif
  solution: "…",
  result: "…",                    // seulement si le résultat est documenté
  image: { src: "/projects/site-cabinet-x.jpg", alt: "…", width: 1600, height: 1000 },
  link: "https://…",              // facultatif
  year: 2026,                     // facultatif
},
```

Règles de contenu, à respecter pour la crédibilité du studio :
- `context` indique le cadre réel du projet. Un projet réalisé comme salarié ou à titre personnel n'est **jamais** présenté comme un client AiTech.
- N'indiquez ni `result` ni `clientName` sans preuve ou sans accord.
- Tant qu'aucun projet n'est publié, la section affiche « Nos réalisations sont en cours de documentation » et un bouton de contact.

Les filtres par catégorie apparaissent automatiquement dès que deux catégories ont des projets publiés.

### Modifier un pilier

Tout est dans `src/data/services.ts` : les cartes de la landing, les pages `/solutions/<slug>`, le menu du formulaire, le footer et le sitemap. Le slug d'un pilier sert dans son URL ; évitez de le modifier une fois le site indexé.

### Ajouter l'anglais plus tard

Les textes sont centralisés dans `src/data/`. Pour ajouter l'anglais, on dupliquera ces fichiers par langue (`src/data/fr/`, `src/data/en/`) et on ajoutera un segment `[lang]` aux routes. Aucun texte n'est écrit en dur dans les composants, à l'exception de quelques libellés d'accessibilité.

---

## 4. Le formulaire de contact

**Fonctionnement retenu : WhatsApp et e-mail, sans serveur d'envoi.**

1. Le visiteur remplit le formulaire : nom, e-mail, entreprise, service, besoin.
2. Les champs sont vérifiés dans le navigateur (schéma Zod, `src/lib/contact.ts`), avec un message d'erreur clair sous chaque champ. Le focus se place sur le premier champ en erreur.
3. Le bouton choisi ouvre **WhatsApp** (`wa.me`) ou la **messagerie** (`mailto:`) avec le message déjà rédigé.
4. Le site affiche alors : « WhatsApp s'est ouvert… il ne vous reste plus qu'à appuyer sur Envoyer ». Il n'affiche **jamais** « message envoyé », puisqu'il ne peut pas le vérifier.

Conséquences :
- Aucune donnée n'est stockée ni transmise par le site. Il n'y a ni clé API ni secret à gérer.
- Il n'y a pas de validation côté serveur, puisque rien ne transite par un serveur.
- Les demandes arrivent directement dans WhatsApp ou dans votre boîte mail.

**Présélection du service.** Les boutons « Parlons de ce besoin » des pages solutions pointent vers `/#contact-<slug>`, par exemple `/#contact-digital-growth`. La page défile jusqu'au formulaire et le service correspondant est déjà sélectionné.

**Passer plus tard à un envoi par serveur** (par exemple avec Resend) : la validation (`validateContact`) et la construction du message (`buildContactMessage`) sont déjà isolées dans `src/lib/contact.ts`. Il suffira d'ajouter une Server Action qui réutilise ces fonctions, puis un bouton d'envoi direct dans `ContactForm.tsx`.

---

## 5. Déployer sur Vercel

1. Poussez le projet sur GitHub (ou GitLab / Bitbucket).
2. Sur [vercel.com](https://vercel.com) : **Add New → Project**, puis importez le dépôt. Vercel détecte Next.js automatiquement : n'en modifiez pas les réglages.
3. **Settings → Environment Variables** : ajoutez
   `NEXT_PUBLIC_SITE_URL = https://www.votre-domaine.com` (sans « / » final).
4. **Deploy**.
5. **Settings → Domains** : ajoutez votre domaine et suivez les instructions DNS.

Sans `NEXT_PUBLIC_SITE_URL`, le site utilise le domaine de production fourni par Vercel (`*.vercel.app`). Définissez la variable dès que votre domaine est actif : elle sert au sitemap, aux balises canoniques et à l'image de partage.

En local, copiez `.env.example` en `.env.local` si besoin.

---

## 6. Architecture du projet

```
src/
├── app/
│   ├── layout.tsx              # Polices, métadonnées SEO globales, header/footer
│   ├── page.tsx                # Landing : assemblage des sections + données structurées
│   ├── solutions/[slug]/       # 3 pages piliers générées depuis services.ts
│   ├── not-found.tsx           # Page 404
│   ├── sitemap.ts · robots.ts  # Générés automatiquement
│   ├── opengraph-image.tsx     # Image de partage 1200×630 générée au build
│   ├── icon.svg                # Favicon
│   └── globals.css             # Design tokens (palette, polices) + animations
├── components/
│   ├── layout/                 # Header (menu mobile <dialog>), Footer, Logo
│   ├── sections/               # Une section de la landing par fichier
│   └── ui/                     # Button, Section, Icon, SocialIcon
├── data/                       # ➜ Tous les contenus éditables
├── lib/
│   ├── contact.ts              # Validation + construction des liens (testé)
│   └── contact.test.ts
└── types/content.ts            # Types de tous les contenus
```

**Choix techniques**
- **Peu de dépendances** : `next`, `react`, `lucide-react` (icônes) et `zod` (validation). Pas de librairie d'animation : CSS natif uniquement.
- **Pages statiques** : tout est prérendu au build, ce qui donne un chargement rapide et un hébergement simple.
- **Apparitions au défilement** en CSS pur (`animation-timeline: view()`). Les navigateurs qui ne le supportent pas affichent simplement le contenu.
- **Accessibilité** :
  - HTML sémantique et un seul `h1` par page ;
  - lien d'évitement « Aller au contenu » ;
  - focus visible ;
  - menu mobile en `<dialog>` natif (focus piégé, touche Échap) ;
  - erreurs de formulaire reliées aux champs (`aria-describedby`, `aria-invalid`) ;
  - respect de `prefers-reduced-motion`.
- **Contrastes** : le violet principal `#7C3AED` est réservé aux boutons et aux grands éléments. Les accents textuels utilisent `#A78BFA` sur fond sombre et `#5B21B6` sur fond clair, pour un contraste d'environ 7:1.
- **SEO** :
  - métadonnées et Open Graph par page ;
  - URL canoniques ;
  - sitemap et robots.txt ;
  - données structurées `ProfessionalService` (schema.org).

---

## 7. Qualité : lint, types, tests, build

```bash
npm run check   # lint + types + tests
npm run build   # build de production
```

Les tests (`src/lib/contact.test.ts`) couvrent :
- la validation du formulaire ;
- la normalisation du numéro WhatsApp ;
- la construction des liens `wa.me` et `mailto:` ;
- le contenu du message.

---

## 8. Notes techniques et limites connues

- **Next.js 16** : ce projet utilise `cacheComponents` et `partialPrefetching`, activés par défaut à la création du projet. La documentation de la version installée se trouve dans `node_modules/next/dist/docs/`.
- **Année du copyright** : elle est calculée dans le navigateur, car Cache Components interdit `new Date()` pendant le prérendu.
- **Slug de solution inconnu** (ex. `/solutions/xyz`) : la page 404 s'affiche, avec une balise `noindex`, mais le code HTTP renvoyé est 200. Avec Cache Components, `dynamicParams = false` n'est pas disponible. Les autres URL inconnues renvoient bien 404.
- **En développement uniquement** : après une modification de code, la navigation client peut réutiliser une ancienne version en cache d'une page. En cas de doute, rechargez la page.
