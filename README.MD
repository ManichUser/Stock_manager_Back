# 📘 README — Lancer le backend (Express + Prisma + TypeScript Strict)

Ce guide explique **pas à pas** comment installer, configurer et exécuter ce backend de gestion de stock (Express + PostgreSQL + Prisma + Docker + TypeScript strict).

---

# 🚀 1. Prérequis
Assure‑toi d’avoir installé :

- **Node.js** (≥ 18)
- **npm** ou **yarn**
- **Docker + Docker Compose**
- **Git** (facultatif)

---

# 🔧 2. Installation du projet
Clone ou récupère le dossier du backend, puis :

```bash
npm install
```

Cela installe :
- Express
- Prisma + @prisma/client
- Typescript strict
- bcrypt, JWT, cors, dotenv

---

# 🗄 3. Configuration des variables d’environnement
Crée un fichier `.env` à la racine :

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/stockdb"
JWT_SECRET="supersecret"
```

Si tu utilises Docker, l’URL changera automatiquement pour :
```
postgresql://postgres:password@db:5432/stockdb
```

---

# 🧱 4. Lancer PostgreSQL + API en local (Docker Compose)
La commande :
```bash
docker compose up --build
```

Lance :
- PostgreSQL (port **5432**) 
- L’API Express (port **9000**)

⏳ Le backend sera disponible à :
```
http://localhost:9000
```

---

# 🔄 5. Initialiser Prisma
Une fois PostgreSQL démarré :

```bash
npx prisma migrate dev --name init
```

Puis générer le client Prisma :

```bash
npx prisma generate
```

---

# 🏃 6. Lancer le serveur en mode développement
```bash
npm run dev
```

---

# 🧪 7. Tester l’API

### 🔐 Authentification
**POST /auth/register**
```json
{
  "username": "admin",
  "password": "1234"
}
```

**POST /auth/login**
Réponse :
```json
{ "message":"Login successful","token": "xxxxxxxxx" }
```

Garde ce token pour les routes protégées.

---

# 📦 8. Endpoints disponibles
### Marques
- `GET /brands`
- `POST /brands`

### Pièces
- `GET /parts`
- `POST /parts`

### Mouvements (entrée/sortie)
- `GET /movements`
- `POST /movements`
  - type = "ENTREE" ou "SORTIE"
  - met automatiquement à jour le stock

---

# 🌍 9. Déploiement sur Render
Plus tard, lors du déploiement :

1. Crée un service **Web Service → Node.js**
2. Ajoute un service **PostgreSQL**
3. Copie l’URL dans `DATABASE_URL`
4. Render lance automatiquement :
   ```bash
   npm install
   npm run build
   npm start
   ```
# Stock_manager_Back
