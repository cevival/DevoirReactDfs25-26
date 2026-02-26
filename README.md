# TP React - Gestion de conférences

Application React connectée à l’API REST locale `http://localhost:4555`.

## Fonctionnalités

- Consultation des conférences (liste + fiche détaillée)
- Connexion utilisateur
- Accès administrateur protégé
- CRUD conférences (admin)
- Gestion utilisateurs + promotion admin (admin)

## Stack

- React (Create React App)
- Axios
- React Router DOM v6
- CSS Modules
- Architecture par features + fichiers barrel (`index.js`)

## Lancement

### 1) API (Docker)

```bash
docker compose up -d
```

API: `http://localhost:4555`  
Mongo Express: `http://localhost:9555`

### 2) Frontend

```bash
npm install
npm start
```

App: `http://localhost:3000`

## Scripts

```bash
npm test -- --watchAll=false
npm run build
```

## Structure principale

```text
src/
	components/
		features/
		layout/
		routing/
	constants/
	context/
	hooks/
	pages/
	services/api/
```

## Notes Auth

- Le token JWT est stocké dans `localStorage` (`authToken`)
- Les appels protégés utilisent `Authorization: Bearer <token>`
- Le rôle admin est vérifié via `GET /isadmin`

## Workflow Git (proposé)

- Branche de feature: `feature/core-architecture`
- Branche documentation: `docs/tp-readme`
- Commits atomiques par domaine fonctionnel
