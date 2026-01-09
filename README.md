# OISHII - Restauration Hospitalière Intelligente

OISHII est une plateforme moderne de gestion de la restauration hospitalière conçue pour connecter les équipes médicales, la cuisine et les patients afin d'offrir une expérience alimentaire personnalisée, sûre et savoureuse.

## 🚀 Fonctionnalités Clés

- **Dashboard Médical** : Gestion des allergies et restrictions alimentaires des patients en temps réel.
- **Portail Cuisine** : Planification des menus hebdomadaires et contrôle des allergènes.
- **Espace Patient** : Connexion simplifiée via QR Code (bracelet) ou identifiant court.
- **Sécurité Maximale** : Authentification basée sur les rôles et protection des données sensibles.

## 🛠 Tech Stack

- **Framework** : [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Base de données / Auth** : [Supabase](https://supabase.com/)
- **Styling** : [Tailwind CSS v4](https://tailwindcss.com/)
- **Composants UI** : [shadcn/ui](https://ui.shadcn.com/)
- **Scanner QR** : [html5-qrcode](https://github.com/mebjas/html5-qrcode)

## 📦 Installation

1. **Cloner le dépôt**
   ```bash
   git clone <repo-url>
   cd OISHII
   ```

2. **Installer les dépendances**
   ```bash
   pnpm install
   ```

3. **Variables d'environnement**
   Renommez `.env.example` en `.env.local` et ajoutez vos clés Supabase :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=votre_cle_publique
   ```

4. **Lancer le développement**
   ```bash
   pnpm dev
   ```

## 📐 Architecture du Projet

- `app/auth` : Gère les flux de connexion (Patient et Staff).
- `app/dashboard` : Contient les différentes interfaces par rôle.
- `components/ui` : Bibliothèque de composants graphiques.
- `lib/supabase` : Configuration et middleware d'authentification.

---
© 2026 OISHII SYSTEMS
