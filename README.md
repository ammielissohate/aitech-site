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
5 bis. [Espace admin : gérer vos réalisations](#5-bis-espace-admin--gérer-vos-réalisations)
5 ter. [Offres, devis et rendez-vous](#5-ter-offres-devis-et-rendez-vous)
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
- [ ] **Espace admin** → configurez-le (section 5 bis), puis ajoutez vos réalisations depuis le site.
- [ ] **`src/data/about.ts`** → votre nom, votre photo, et une relecture des paragraphes de présentation (page `/a-propos`).
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
| `projects.ts`      | Textes de la galerie (les réalisations elles-mêmes s'ajoutent depuis le site) |
| `advantages.ts`    | Section « Pourquoi AiTech ? »                                               |
| `contact.ts`       | Textes et messages du formulaire                                            |
| `about.ts`         | Page « À propos » : parcours, distinctions, formations (la photo se change dans l'admin) |
| `offers.ts`        | **Offres et prix** par zone (FCFA, €, $), délais, contenu de chaque pack     |

### Changer votre photo (page À propos)

Connectez-vous, puis **barre admin → Paramètres → Choisir une photo → Enregistrer**. Un bouton « Changer la photo » apparaît aussi sur la page À propos quand vous êtes connecté.

### Ajouter une réalisation

Les réalisations ne se gèrent plus dans le code : connectez-vous sur le site et utilisez les boutons « + Ajouter ». Voir la [section 5 bis](#5-bis-espace-admin--gérer-vos-réalisations).

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

## 5 bis. Espace admin : gérer vos réalisations

Vous ajoutez, modifiez et supprimez vos travaux **directement depuis le site**, sans toucher au code.

### Au quotidien

1. Allez sur **`/connexion`** (par exemple `https://votre-domaine.com/connexion`) et saisissez votre mot de passe.
2. Une **barre « Mode admin »** apparaît en bas de l'écran, sur tout le site. Les galeries affichent des boutons **« + Ajouter un travail »**, et chaque carte un bouton **« Modifier »**. Les visiteurs ne voient jamais ces boutons.
3. Dans le formulaire :
   - envoyez vos images (jusqu'à 12, 10 Mo maximum chacune) ; la première sert de couverture ;
   - choisissez le **pôle** (Brand, Visibility ou Growth) et le **cadre** (client AiTech, poste salarié, projet personnel, formation) ;
   - décrivez le besoin, la solution et, seulement s'il est documenté, le résultat.
4. **Publier** rend le travail visible immédiatement dans la galerie de l'accueil, sur la page `/realisations` et sur la page du pôle concerné. Décochez la case pour garder un **brouillon**, visible uniquement dans `/admin`.
5. **`/admin`** (bouton « Mes travaux ») liste tous vos travaux, brouillons compris, avec les actions Modifier et Supprimer.

Chaque réalisation a un lien partageable, par exemple `/realisations#projet-identite-cabinet-x`, qui ouvre directement sa fiche.

### Mise en service (une seule fois, sur Vercel)

L'espace admin a besoin de deux services gratuits de Vercel et de deux variables secrètes.

1. **Base de données** : dans votre projet Vercel, **Storage → Create Database → Neon (Postgres)**, puis reliez-la au projet. Vercel ajoute automatiquement `DATABASE_URL`. La table est créée toute seule lors du premier ajout.
2. **Stockage des images** : **Storage → Create → Blob**, puis reliez-le au projet. Vercel ajoute automatiquement `BLOB_READ_WRITE_TOKEN`.
3. **Settings → Environment Variables**, ajoutez :
   - `ADMIN_PASSWORD` : votre mot de passe (long et unique, que vous n'utilisez nulle part ailleurs) ;
   - `SESSION_SECRET` : une chaîne aléatoire d'au moins 32 caractères. Pour en générer une :

     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
     ```
4. **Redéployez** (Deployments → ⋯ → Redeploy), pour que les nouvelles variables soient prises en compte.

La page `/admin` affiche une liste de contrôle tant qu'un de ces éléments manque.

### En local

Copiez `.env.example` en `.env.local` et renseignez les mêmes variables. Le plus simple, une fois le projet relié à Vercel :

```bash
npx vercel env pull .env.local
```

Sans `DATABASE_URL` ni `BLOB_READ_WRITE_TOKEN`, le site fonctionne : la galerie affiche son état vide, et l'admin indique ce qui manque.

### Sécurité

- Le mot de passe n'est jamais stocké dans le code. La session est un cookie signé (`httpOnly`, valable 7 jours), impossible à fabriquer sans `SESSION_SECRET`.
- Chaque action (ajout, modification, suppression, envoi d'image) revérifie la session côté serveur. Les boutons masqués ne sont qu'un confort d'affichage.
- Seules les images envoyées sur le stockage du site sont acceptées (JPEG, PNG, WebP, AVIF, GIF, 10 Mo maximum).
- `/admin`, `/connexion` et `/api` sont exclus des moteurs de recherche.
- Pour changer de mot de passe : modifiez `ADMIN_PASSWORD` dans Vercel et redéployez. Pour déconnecter toutes les sessions ouvertes, changez aussi `SESSION_SECRET`.

---

## 5 ter. Offres, devis et rendez-vous

### Le parcours du visiteur

1. Il voit les offres (accueil, section « Nos offres », et page `/offres`) avec des **prix adaptés à sa région** :
   - **Afrique** → FCFA (+ équivalent en euros, taux fixe 655,957) ;
   - **Europe** → euros ;
   - **International** (Amériques, Asie…) → dollars US.
   La région est détectée par Vercel à partir du pays du visiteur ; le prix est **recalculé côté serveur** au moment du devis (impossible à modifier depuis le navigateur).
2. « **Obtenir mon devis** » → `/devis` en 3 étapes : offre (et quantité), coordonnées (particulier ou entreprise), **créneau d'appel**.
3. Il reçoit immédiatement son devis (`/devis/recu`), imprimable en PDF, avec ajout à Google Agenda ou à tout calendrier (.ics). Le lien contient une clé secrète : seul le client (et vous) peut l'ouvrir.
4. Vous recevez un **e-mail** (si Resend est configuré) et la demande apparaît dans **Admin → Demandes**.

### Modifier les prix ou les offres

Tout est dans `src/data/offers.ts` : nom, promesse, contenu, délai et `prices: { africa, europe, international }`. Une « économie » n'est affichée que si un pack est réellement moins cher que l'unité (`savings`).

### Créneaux d'appel

Définis dans `src/lib/booking.ts` (heure du Bénin, UTC+1) :
- du lundi au vendredi : 6 h 00, 10 h 00, 12 h 30, 21 h 00, 22 h 30 ;
- le samedi : 6 h 00, 10 h 00, 12 h 30 (rien après 13 h) ;
- le dimanche : aucun appel.

Réservation possible sur 14 jours, au moins 12 h à l'avance. Un créneau réservé disparaît pour les autres visiteurs (la base de données refuse toute double réservation). Passer une demande au statut **Annulé** libère son créneau.

### Suivre les demandes

**Admin → Demandes** : appels à venir et historique, liens directs WhatsApp et e-mail, devis du client, et statut (Nouveau, Appel confirmé, Contrat signé, Non abouti, Annulé).

### Activer les e-mails de notification (Resend)

1. Créez un compte gratuit sur [resend.com](https://resend.com) avec l'adresse qui doit recevoir les notifications.
2. **API Keys → Create API Key** (permission « Sending access »).
3. Dans Vercel, ajoutez les variables `RESEND_API_KEY` (la clé) et `QUOTE_NOTIFY_EMAIL` (l'adresse de votre compte Resend), puis redéployez.

Avec l'expéditeur par défaut (`onboarding@resend.dev`), Resend n'envoie qu'à l'adresse de votre compte : c'est suffisant pour vous notifier. Pour envoyer depuis votre propre domaine, vérifiez-le sur Resend et définissez `RESEND_FROM`.

### Tester une autre région en local

Ajoutez `DEV_COUNTRY=FR` (ou `US`, `BJ`…) dans `.env.local`, puis rechargez la page.

---

## 6. Architecture du projet

```
src/
├── app/
│   ├── layout.tsx              # Polices, métadonnées SEO globales, header/footer
│   ├── page.tsx                # Landing : assemblage des sections + données structurées
│   ├── solutions/[slug]/       # 3 pages piliers générées depuis services.ts
│   ├── a-propos/               # Présentation du fondateur (données : about.ts)
│   ├── offres/                 # Toutes les offres et leurs prix
│   ├── devis/                  # Parcours de devis, Server Action, page du devis (recu/)
│   ├── realisations/           # Galerie complète des réalisations
│   ├── connexion/              # Connexion admin
│   ├── admin/                  # Travaux, demandes, paramètres, éditeur et Server Actions (protégés)
│   ├── api/admin/upload/       # Autorisation d'envoi d'images vers Vercel Blob
│   ├── not-found.tsx           # Page 404
│   ├── sitemap.ts · robots.ts  # Générés automatiquement
│   ├── opengraph-image.tsx     # Image de partage 1200×630 générée au build
│   ├── icon.svg                # Favicon
│   └── globals.css             # Design tokens (palette, polices) + animations
├── components/
│   ├── layout/                 # Header (menu mobile <dialog>), Footer, Logo
│   ├── projects/               # Galerie et fiche détaillée des réalisations
│   ├── admin/                  # Barre admin, connexion, éditeur de réalisation
│   ├── sections/               # Une section de la landing par fichier
│   └── ui/                     # Button, Section, Icon, SocialIcon
├── data/                       # ➜ Tous les contenus éditables
├── lib/
│   ├── contact.ts              # Validation + construction des liens (testé)
│   ├── auth/                   # Session admin signée (testé)
│   ├── projects/               # Validation (testé) et accès base des réalisations
│   ├── pricing.ts · booking.ts # Zones de prix, devises, créneaux d'appel (testés)
│   ├── quotes/                 # Validation (testée) et enregistrement des devis
│   ├── notify.ts · settings.ts # E-mail Resend, paramètres (photo)
│   └── db.ts                   # Connexion Postgres (Neon) et création des tables
└── types/content.ts            # Types de tous les contenus
```

**Choix techniques**
- **Peu de dépendances** : `next`, `react`, `lucide-react` (icônes), `zod` (validation), `@vercel/blob` (images) et `@neondatabase/serverless` (base de données). Pas de librairie d'animation : CSS natif uniquement.
- **Pages statiques** : tout est prérendu au build. La galerie est mise en cache (`'use cache'`, étiquette `projects`) et rafraîchie immédiatement après chaque modification dans l'admin (`updateTag`). Seule la barre admin est calculée à chaque requête, sous `<Suspense>`.
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
- le contenu du message ;
- la session admin (signature, expiration, falsification) et les redirections après connexion ;
- la validation des réalisations (images autorisées, champs, année, lien) ;
- les zones de prix, devises et économies de packs ;
- les créneaux d'appel (préavis, samedi, dimanche, créneaux réservés) ;
- la validation et le calcul des devis (prix recalculé, quantités, anti-robots).

`npm run db:setup` crée ou met à jour les tables (réalisations, devis, paramètres) dans la base pointée par `DATABASE_URL`.

---

## 8. Notes techniques et limites connues

- **Next.js 16** : ce projet utilise `cacheComponents` et `partialPrefetching`, activés par défaut à la création du projet. La documentation de la version installée se trouve dans `node_modules/next/dist/docs/`.
- **Année du copyright** : elle est calculée dans le navigateur, car Cache Components interdit `new Date()` pendant le prérendu.
- **Slug de solution inconnu** (ex. `/solutions/xyz`) : la page 404 s'affiche, avec une balise `noindex`, mais le code HTTP renvoyé est 200. Avec Cache Components, `dynamicParams = false` n'est pas disponible. Les autres URL inconnues renvoient bien 404.
- **En développement uniquement** : après une modification de code, la navigation client peut réutiliser une ancienne version en cache d'une page. En cas de doute, rechargez la page.
