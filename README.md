# ⚽ StadeVoice — MVP Coupe du Monde 2030

> Application web mobile-first pour les spectateurs de la Coupe du Monde 2030, accessible via QR Code dans les stades.

![Stack](https://img.shields.io/badge/React-19-blue) ![Stack](https://img.shields.io/badge/Express-4-green) ![Stack](https://img.shields.io/badge/Prisma-6-purple) ![Stack](https://img.shields.io/badge/SQLite-local-orange)

---

## 🚀 Démarrage rapide

### Prérequis

- **Node.js** v18+ ([télécharger ici](https://nodejs.org/))
- **npm** (inclus avec Node.js)

### 1. Installation du Backend

```powershell
cd backend
npm install
npx prisma generate
npx prisma db push
node prisma/seed.js
```

### 2. Démarrage du Backend

```powershell
cd backend
npm run dev
```

Le serveur API démarre sur **http://localhost:3001**

### 3. Installation du Frontend (dans un nouveau terminal)

```powershell
cd frontend
npm install
```

### 4. Démarrage du Frontend

```powershell
cd frontend
npm run dev
```

L'application démarre sur **http://localhost:5173** (ouvrir dans Chrome DevTools mobile)

---

## 📁 Structure du Projet

```
stadevoice/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Modèles de données (LostItem, POI, FAQ)
│   │   └── seed.js            # Données fictives pour tests
│   ├── server.js              # Serveur Express + routes API
│   ├── package.json
│   └── .env                   # Configuration (DATABASE_URL, PORT)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Composant principal + routing
│   │   ├── main.jsx           # Point d'entrée React
│   │   ├── index.css          # Styles Tailwind + animations
│   │   ├── components/
│   │   │   └── BottomNavBar.jsx   # Barre de navigation mobile
│   │   └── views/
│   │       ├── HomeView.jsx       # Tableau de bord d'accueil
│   │       ├── AssistantView.jsx  # Chatbot IA multilingue
│   │       ├── ServicesView.jsx   # Points d'intérêt du stade
│   │       └── LostFoundView.jsx  # Objets perdus & trouvés
│   ├── index.html
│   ├── vite.config.js         # Config Vite + proxy API
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

---

## 🔌 API Endpoints

| Méthode | Route          | Description                               |
|---------|----------------|-------------------------------------------|
| GET     | `/api/pois`    | Liste des points d'intérêt avec affluence |
| GET     | `/api/items`   | Liste des objets perdus/trouvés           |
| GET     | `/api/items?status=LOST` | Filtrer par statut              |
| POST    | `/api/items`   | Déclarer un objet perdu ou trouvé         |
| POST    | `/api/chat`    | Assistant IA (mots-clés multilingue)      |
| GET     | `/api/health`  | Vérification de santé du serveur          |

### Exemples

**Déclarer un objet perdu :**
```json
POST /api/items
{
  "title": "Clés de voiture",
  "description": "Trousseau avec porte-clé bleu",
  "status": "LOST",
  "location": "Tribune Nord",
  "contactInfo": "0600000003"
}
```

**Poser une question au chatbot :**
```json
POST /api/chat
{
  "message": "Où sont les toilettes ?",
  "language": "FR"
}
```

Langues supportées : `FR`, `EN`, `ES`, `AR`, `PT`

---

## 🎨 Design System

- **Couleur primaire** : Vert émeraude (`#059669` / `emerald-600`)
- **Arrondis** : `rounded-2xl` partout
- **Ombres** : Légères (`shadow-sm`, `shadow-md`)
- **Typographie** : Inter (Google Fonts)
- **Approche** : Mobile-First, boutons tactiles généreux

---

## 📱 Fonctionnalités du MVP

1. **Tableau de bord** — Météo, accès rapide aux services
2. **Assistant IA** — Chat multilingue (5 langues) avec détection par mots-clés
3. **Services du stade** — Toilettes, eau, secours, sorties avec statut d'affluence en temps réel
4. **Objets perdus** — Signaler et consulter les objets perdus/trouvés

---

## 🛠️ Stack Technique

| Composant | Technologie |
|-----------|-------------|
| Frontend  | React 19 + Vite 6 + Tailwind CSS 3 |
| Backend   | Express.js 4 |
| ORM       | Prisma 6 |
| Base      | SQLite (locale) |
| Icônes    | Lucide React |
