# 🎬 Netflix Clone — Frontend

> Interface Netflix-like construite avec **React 19** · **TypeScript** · **Tailwind CSS v4** · **Vite**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

Frontend du projet **Netflix Clone**. Il communique avec le backend Rust/Axum pour afficher les films tendance, permettre la recherche et lire des bandes-annonces YouTube ou des vidéos locales streamées. Le backend correspondant se trouve dans le dossier `netflix_backend/`.

---

## Sommaire

- [Fonctionnalités](#-fonctionnalités)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Lancer le projet](#-lancer-le-projet)
- [Structure du projet](#-structure-du-projet)
- [Architecture technique](#-architecture-technique)
- [Docker](#-docker)
- [Stack technique](#-stack-technique)

---

## ✨ Fonctionnalités

- 🔥 **Tendances de la semaine** — Hero section plein écran + 4 rangées (tous, films, séries, top notés)
- 🔍 **Recherche en temps réel** — Barre intégrée dans la navbar + page dédiée avec pagination
- 🎬 **Lecteur de trailers YouTube** — Embed automatique via l'API TMDB (`/api/movie/{id}/videos`)
- 📡 **Lecteur vidéo HTML5 custom** — Contrôles complets (play/pause, volume, seek, plein écran) pour les fichiers servis par le backend (`/stream/*`)
- 💀 **Skeleton loading** — États de chargement animés pour chaque composant
- 📱 **Responsive** — Interface adaptée mobile, tablette et desktop

---

## 🛠️ Prérequis

| Outil | Version minimale | Lien |
|---|---|---|
| Node.js | 20+ | https://nodejs.org |
| npm | 10+ | fourni avec Node.js |
| Git | toute version récente | https://git-scm.com |
| **Backend Rust lancé** | — | voir [`netflix_backend/`](../netflix_backend) |

> ⚠️ Le frontend proxifie toutes les requêtes `/api/*` et `/stream/*` vers `http://localhost:8080`. Le backend doit donc être démarré **avant** le frontend en développement.

---

## 📦 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/ludovicdevio/netflix_backen_rust_axum.git
cd netflix_backen_rust_axum/netflix_frontend
```

### 2. Installer les dépendances

```bash
npm install
```

---

## ⚙️ Configuration

Le frontend ne nécessite **aucun fichier `.env`** en développement : le proxy Vite redirige automatiquement toutes les requêtes `/api/*` et `/stream/*` vers `http://localhost:8080`.

Si vous souhaitez pointer vers un backend distant (ex. en staging ou production), modifiez la `baseURL` dans [src/api/tmdb.ts](src/api/tmdb.ts) :

```ts
const api = axios.create({
  baseURL: 'https://votre-backend.com/api',
});
```

---

## 🚀 Lancer le projet

### Étape 1 — Démarrer le backend (obligatoire)

```bash
# Dans netflix_backend/
cargo run
# → Server listening on http://0.0.0.0:8080
```

### Étape 2 — Démarrer le frontend

```bash
# Dans netflix_frontend/
npm run dev
```

Ouvrir dans le navigateur : **http://localhost:3000**

### Build de production

```bash
npm run build
# Fichiers compilés générés dans dist/
```

### Prévisualiser le build de production localement

```bash
npm run preview
# → http://localhost:4173
```

---

## 📁 Structure du projet

```
netflix_frontend/
├── src/
│   ├── api/
│   │   └── tmdb.ts             # Fonctions HTTP axios vers le backend
│   ├── hooks/
│   │   ├── useTrending.ts      # React Query : GET /api/trending
│   │   ├── useSearch.ts        # React Query : GET /api/search
│   │   └── useMovieVideos.ts   # React Query : GET /api/movie/{id}/videos
│   ├── types/
│   │   └── index.ts            # Types TypeScript (Movie, Video, TmdbResponse…)
│   ├── components/
│   │   ├── Navbar.tsx          # Barre de navigation fixe avec recherche rapide
│   │   ├── HeroSection.tsx     # Bannière plein écran du film mis en avant
│   │   ├── MovieCard.tsx       # Carte film avec effet hover et ouverture modal
│   │   ├── MovieRow.tsx        # Rangée scrollable horizontalement (← →)
│   │   ├── TrailerModal.tsx    # Modal : YouTube embed ou lecteur local
│   │   ├── VideoPlayer.tsx     # Lecteur HTML5 custom avec contrôles complets
│   │   ├── SearchBar.tsx       # Champ de recherche synchronisé avec l'URL
│   │   └── Skeletons.tsx       # Composants de chargement animés
│   ├── pages/
│   │   ├── HomePage.tsx        # Accueil : hero section + rangées tendances
│   │   └── SearchPage.tsx      # Recherche avec résultats paginés
│   ├── App.tsx                 # Routeur principal (React Router v7)
│   ├── main.tsx                # Point d'entrée React
│   └── index.css               # Styles globaux + import Tailwind v4
├── Dockerfile                  # Build multi-stage : Node (build) → Nginx (serve)
├── nginx.conf                  # Config Nginx : SPA routing + proxy /api et /stream
├── vite.config.ts              # Config Vite : plugin Tailwind + proxy dev
├── tsconfig.app.json           # Config TypeScript
└── package.json
```

---

## 🏗️ Architecture technique

### Flux de données

```
Utilisateur
    │
    ▼
React (Vite) :3000
    │
    ├── hooks (useQuery)
    │       │
    │       ▼
    │   axios → /api/*  ──[proxy Vite]──▶  Backend Rust :8080  ──▶  TMDB API
    │
    └── lecteur vidéo
            │
            ▼
        <video> → /stream/*  ──[proxy Vite]──▶  Backend Rust :8080 → assets/
```

### Gestion des états (React Query)

Chaque source de données dispose de son hook dédié :

| Hook | Endpoint | Cache |
|---|---|---|
| `useTrending(page)` | `GET /api/trending?page=N` | 5 min |
| `useSearch(query, page)` | `GET /api/search?query=Q&page=N` | 2 min |
| `useMovieVideos(id)` | `GET /api/movie/{id}/videos` | 10 min |

Les hooks sont désactivés automatiquement si les paramètres sont vides (`useSearch` n'appelle pas l'API si `query` est vide).

### Routing

| Route | Page | Description |
|---|---|---|
| `/` | `HomePage` | Accueil avec hero section + 4 rangées tendances |
| `/search` | `SearchPage` | Résultats de recherche, activés via `?q=terme` |

### Lecteur vidéo

Le composant `VideoPlayer` est un lecteur HTML5 **entièrement custom** :
- Barre de progression cliquable avec seek
- Contrôle du volume + bouton mute
- Recul / avance de 10 secondes
- Plein écran natif via `requestFullscreen`
- Auto-masquage des contrôles après 3 secondes en lecture

`TrailerModal` choisit automatiquement la source vidéo :
1. **Trailer YouTube** si `type === "Trailer"` et `site === "YouTube"` dans la réponse TMDB
2. **Première vidéo YouTube** disponible sinon
3. **Lecteur HTML5 local** sur `/stream/{id}.mp4` en dernier recours

---

## 🐳 Docker

### Build et lancement seul (Nginx, port 80)

```bash
docker build -t netflix-frontend .
docker run -p 80:80 netflix-frontend
```

> En production Docker, le fichier `nginx.conf` proxy `/api/*` et `/stream/*` vers le service `api` du réseau Docker interne.

### Avec Docker Compose — backend + frontend ensemble

Un fichier `compose.yml` global se trouve à la racine du monorepo :

```bash
# Depuis le dossier parent (contenant netflix_backend/ et netflix_frontend/)
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost |
| Backend API | http://localhost:8080 |

---

## 🧱 Stack technique

| Package | Version | Rôle |
|---|---|---|
| `react` + `react-dom` | 19 | UI déclarative + rendu DOM |
| `react-router-dom` | 7 | Routing côté client (SPA) |
| `@tanstack/react-query` | 5 | Cache et gestion des états asynchrones |
| `axios` | 1.x | Client HTTP vers le backend |
| `lucide-react` | 0.5x | Icônes SVG (Play, Search, Volume…) |
| `tailwindcss` | 4 | CSS utilitaire via plugin Vite natif |
| `vite` | 7 | Bundler ultra-rapide (dev HMR + build) |
| `typescript` | 5.9 | Typage statique |

---

## 🔗 Projets liés

- **Backend Rust/Axum** : [`netflix_backend/`](https://github.com/ludovicdevio/netflix_backend_rust_axum  ) — API REST + streaming vidéo local (Rust, Axum 0.8, Tokio)
