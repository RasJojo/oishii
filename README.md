# Nom de Votre Projet

Une application web moderne construite avec **Next.js 16+ (App Router)**, sécurisée par **Supabase** et stylisée avec **shadcn/ui** et **Tailwind CSS V4+**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-development-orange)

## 🚀 Fonctionnalités

* **Authentification Complète** : Inscription, Connexion, Mot de passe oublié (via Supabase Auth).
* **Gestion des Profils** : Création automatique de profil utilisateur via des Triggers SQL.
* **Interface Moderne** : Composants réutilisables et accessibles grâce à shadcn/ui.
* **Base de Données** : PostgreSQL géré par Supabase avec sécurité RLS (Row Level Security).
* **Performance** : Rendu hybride (Server Components & Client Components).

## 🛠 Stack Technique

* **Framework** : [Next.js](https://nextjs.org/) (App Router)
* **Langage** : [TypeScript](https://www.typescriptlang.org/)
* **Backend & Auth** : [Supabase](https://supabase.com/)
* **Styling** : [Tailwind CSS](https://tailwindcss.com/)
* **Composants UI** : [shadcn/ui](https://ui.shadcn.com/)
* **Thèmes UI** : [tweakcn](https://tweakcn.com/)
* **Icônes** : [Lucide React](https://lucide.dev/)
* **Validation** : Zod + React Hook Form

## ⚙️ Prérequis

Avant de commencer, assurez-vous d'avoir :
* Node.js (v18 ou supérieur)
* Un gestionnaire de paquets (npm, pnpm ou yarn)
* Un compte et un projet [Supabase](https://supabase.com/)

## 📦 Installation

1.  **Cloner le dépôt**
    ```bash
    git clone [https://github.com/iim-MTD-2026/OISHII.git](https://github.com/iim-MTD-2026/OISHII.git)
    cd OISHII
    ```

2.  **Installer les dépendances**
    ```bash
    npm install
    # ou
    pnpm install
    ```

3.  **Lancer le serveur de développement**
    ```bash
    npm run dev
    ```
    L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

## 🗄️ Configuration de la Base de Données (Supabase)

Pour que l'application fonctionne correctement (notamment la création automatique de profils), vous devez exécuter le script SQL suivant dans l'éditeur SQL de votre dashboard Supabase.

Ce script crée la table `public.profiles` et configure le trigger automatique lors d'une nouvelle inscription.

```sql
-- 1. Création de la table profiles
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  primary key (id),
  constraint username_length check (char_length(username) >= 3)
);

-- 2. Sécurité RLS
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using ( true );

create policy "Users can update own profile"
  on public.profiles for update using ( auth.uid() = id );

-- 3. Trigger pour création automatique
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'avatar_url');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();