
---

# 📘 README — Backend Stock Manager (Express + Prisma + TypeScript Strict)

Ce guide explique **pas à pas** comment installer, configurer et exécuter le backend de gestion de stock.

---

## 🚀 1. Prérequis

Assure-toi d’avoir installé :

* **Node.js** (≥ 18)
* **npm** ou **yarn**
* **Docker + Docker Compose**
* **Git** (facultatif)

---

## 🔧 2. Installation du projet

Clone le projet puis installe les dépendances :

```bash
npm install
```

Dépendances principales :

* Express
* Prisma + @prisma/client
* TypeScript strict
* bcryptjs, JWT, cors, dotenv
* WebSocket (optionnel pour notifications)

---

## 🗄 3. Configuration des variables d’environnement

Crée un fichier `.env` à la racine :

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/stockdb"
JWT_SECRET="supersecret"
NODE_ENV="development"
```

> Si tu utilises **Docker**, l’URL PostgreSQL sera plutôt :
> `postgresql://postgres:password@db:5432/stockdb`

---

## 🧱 4. Lancer PostgreSQL + API (Docker Compose)

```bash
docker compose up --build
```

* PostgreSQL sera exposé sur **5432**
* Backend sur **9000**

Le backend sera accessible à :

```
http://localhost:9000
```

---

## 🔄 5. Initialiser Prisma

Après avoir lancé PostgreSQL :

```bash
npx prisma migrate dev --name init
npx prisma generate
```

* **Migrate dev** : crée la base et applique le schéma Prisma
* **Generate** : génère le client Prisma pour TypeScript

---

## 🏃 6. Lancer le serveur en développement

```bash
npm run dev
```

Pour production :

```bash
npm run build
npm start
```

---

## 🔐 7. Authentification

### Enregistrement

**POST /auth/register**

```json
{
  "username": "admin",
  "password": "1234"
}
```

### Connexion

**POST /auth/login**

Réponse :

```json
{
  "message": "Login successful",
  "userId": 1,
  "token": "JWT_TOKEN_ICI"
}
```

> Le token est à envoyer dans **Authorization: Bearer TOKEN** pour les routes protégées.

---

## 📦 8. Endpoints disponibles

### Marques (Brands)

* `GET /brands` — Liste toutes les marques
* `POST /brands` — Crée une nouvelle marque
* `DELETE /brands/:id` — Supprime une marque **et toutes ses pièces + mouvements**

### Pièces (Parts)

* `GET /parts` — Liste toutes les pièces
* `POST /parts` — Crée une pièce
* `PUT /parts/:id` — Met à jour une pièce
* `DELETE /parts/:id` — Supprime une pièce **si aucun mouvement associé** ou via transaction sécurisée

### Mouvements (Entrée/Sortie)

* `GET /movements` — Liste tous les mouvements
* `GET /movements/by-part/:partId` — Liste les mouvements d’une pièce
* `POST /movements` — Crée un mouvement et met à jour le stock automatiquement
* `DELETE /movements/:id` — Supprime un mouvement
* `DELETE /movements/freebd` — Supprime **tous les mouvements**

---

## ⚡ 9. Notes importantes

* **JWT** : utilisé pour sécuriser les routes. Le token peut être stocké dans **localStorage** ou **HTTP-only cookies**.
* **Transactions Prisma** : utilisées pour supprimer une marque et toutes ses pièces/mouvements de manière sécurisée.
* **TypeScript strict** : assure une sécurité maximale côté backend.
* **WebSocket** : notifications temps réel pour stock/mouvements.

---

## 🌍 10. Déploiement sur Render / Production

1. Crée un service **Web Service → Node.js**
2. Ajoute un service **PostgreSQL**
3. Mets à jour `DATABASE_URL` dans Render
4. Render lancera automatiquement :

```bash
npm install
npm run build
npm start
```

---

