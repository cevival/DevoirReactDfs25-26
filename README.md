# NexTalk – Gestionnaire de conférences

## Présentation

NexTalk est une application web de gestion de conférences, développée en React (frontend) et Node.js/Express/MongoDB (backend). Elle permet la gestion, l’inscription et l’administration de conférences techniques.

## Fonctionnalités principales

- Authentification (admin/utilisateur)
- Gestion des conférences (CRUD, admin)
- Gestion des utilisateurs (admin)
- Inscription à une conférence
- Notifications Toast
- Interface responsive et moderne

## Comptes de test

- **Admin** : `admin` / `toto`
- **Utilisateur** : `user` / `toto`

## Installation rapide

1. **Cloner le projet**
2. **Installer les dépendances**

   ```sh
   npm install
   ```

3. **Configurer la base MongoDB**
   - Lancer MongoDB (local ou Docker)
   - Modifier l’URL de connexion si besoin dans le backend

4. **Seed de la base**
   - Les données de test sont dans `mongo-seed.js` (ou via `users.json` et `conferences.json`)
   - Pour injecter la seed :

   ```sh
   node mongo-seed.js
   ```

   - Ou avec mongoimport :

   ```sh
   mongoimport --uri "mongodb://localhost:27017/nom_de_ta_bdd" --collection users --file ./users.json
   mongoimport --uri "mongodb://localhost:27017/nom_de_ta_bdd" --collection conferences --file ./conferences.json
   ```

5. **Lancer l’application**

   ```sh
   npm start
   ```

## Structure du projet

- `src/` : code React
  - `components/` : composants réutilisables
  - `features/` : logique métier par fonctionnalité
  - `hooks/` : hooks personnalisés (ex : useToast)
  - `pages/` : pages principales (Login, Admin, etc.)
- `mongo-seed.js` : script d’initialisation MongoDB
- `users.json`, `conferences.json` : exports de données
- `docker-compose.yml` : stack Docker (optionnel)

## Scripts utiles

- `npm start` : démarre le frontend
- `node mongo-seed.js` : injecte la seed
