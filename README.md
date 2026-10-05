# Ytasty Crousty — Frontend React

Application web de commande en ligne pour la chaîne de fast-food **Ytasty Crousty** (restaurants d'Aix, Lyon et Paris).
Les clients consultent la carte, composent leur panier, passent commande sans créer de compte et suivent la préparation.
Le personnel dispose d'un back-office : tableau de bord cuisine, gestion de la carte et des disponibilités, gestion des
comptes.

Le front consomme l'**API REST FastAPI** du projet ([dépôt backend](https://github.com/Emrick-R/ytastycrousty-g3-py)),
présentée dans la section [API](#api).

---

## Sommaire

1. [Stack technique](#stack-technique)
2. [API](#api)
3. [Installation et lancement](#installation-et-lancement)
4. [Comptes et rôles](#comptes-et-rôles)
5. [Fonctionnalités](#fonctionnalités)
6. [Architecture du code](#architecture-du-code)
7. [Choix techniques](#choix-techniques)
8. [Temps réel (Socket.io)](#temps-réel-socketio)
9. [Répartition des tâches](#répartition-des-tâches)

---

## Stack technique

| Domaine             | Outils                                          |
|---------------------|-------------------------------------------------|
| Interface           | React 19, TypeScript (mode `strict`), Vite      |
| Composants et style | MUI (Material UI) v9, `@mui/icons-material`     |
| État global         | Redux Toolkit, React Redux                      |
| Navigation          | React Router (`createBrowserRouter`)            |
| Appels API          | axios (instance unique avec l'adresse de l'API) |

---

## API

Le front s'appuie sur une **API REST** développée avec **FastAPI** (Python), dans un dépôt séparé :
**[github.com/Emrick-R/ytastycrousty-g3-py](https://github.com/Emrick-R/ytastycrousty-g3-py)**

- **Données** : PostgreSQL, via l'ORM SQLAlchemy ; les 3 restaurants, la carte, les comptes de démonstration et des
  commandes d'exemple sont créés automatiquement au premier démarrage.
- **Authentification** : JWT (`POST /auth/login`), mots de passe hachés avec bcrypt.
- **Autorisations** : contrôle par rôle (`admin`, `staff`, `direction`) et par restaurant : un `staff` n'agit que sur
  son propre restaurant.
- **Commandes** : le total est calculé par le serveur à partir des prix en base (le client n'envoie jamais de prix) et
  le prix de chaque article est figé au moment de la commande. Chaque commande reçoit un numéro de suivi unique
  `YC-XXXXXXXX`.
- **Documentation** : Swagger généré automatiquement sur `/docs`, avec le bouton *Authorize* pour tester les routes
  protégées.
- **Déploiement** : Docker et `docker compose` (API + PostgreSQL).

### Adaptations faites pour le front

L'API a été légèrement modifiée par rapport à la version initiale du dépôt, sans changer le contrat :

- **`restaurant_id` ajouté dans le JWT** : le front sait directement à quel restaurant appartient un compte `staff`
  (filtrage du tableau de bord cuisine et de la gestion de la carte), sans appeler `GET /users`, réservé à l'admin.
  Il vaut `null` pour `admin` et `direction`.
- **CORS** : autorisation de l'origine du front (`http://localhost:5173`), sans laquelle le navigateur bloque les
  appels.
- **Images des produits** : les chemins enregistrés en base pointent vers le dossier `public/images/` du front
  (`/images/...`).
- **Données de démo** : comptes `staff` et `direction`, et commandes d'exemple dans chaque restaurant (tous les
  statuts), pour tester le tableau de bord cuisine et le suivi sans tout saisir à la main.

### Endpoints utilisés par le front

| Méthode  | Endpoint                        | Utilisation                             |
|----------|---------------------------------|-----------------------------------------|
| `POST`   | `/auth/login`                   | connexion                               |
| `GET`    | `/restaurants`                  | liste des restaurants                   |
| `GET`    | `/products?restaurant_id=`      | carte d'un restaurant                   |
| `POST`   | `/products`                     | création d'un produit (admin)           |
| `PATCH`  | `/products/{id}`                | modification d'un produit (admin)       |
| `DELETE` | `/products/{id}`                | suppression d'un produit (admin)        |
| `PATCH`  | `/products/{id}/availability`   | disponibilité / rupture (staff, admin)  |
| `POST`   | `/orders`                       | passage de commande (public)            |
| `GET`    | `/orders/{order_number}`        | suivi de commande (public)              |
| `GET`    | `/restaurants/{id}/orders`      | commandes d'un restaurant (back-office) |
| `PATCH`  | `/orders/{order_number}/status` | changement de statut (cuisine)          |
| `POST`   | `/orders/{order_number}/cancel` | annulation (cuisine)                    |
| `POST`   | `/users`                        | création de compte (admin)              |

---

## Installation et lancement

### Prérequis

- Node.js 20 ou plus récent
- L'API Ytasty Crousty lancée (Docker), voir le [README du backend](https://github.com/Emrick-R/ytastycrousty-g3-py)

### Installation

```bash
npm install
```

### Lancement

```bash
# 1. L'API FastAPI + PostgreSQL (dans le projet backend)
docker compose up --build

# 2. Le front (http://localhost:5173)
npm run dev
```

L'adresse de l'API est définie une seule fois dans `src/frontend/services/api.ts` (`baseURL` de l'instance axios).

### Autres commandes

| Commande          | Rôle                                                                     |
|-------------------|--------------------------------------------------------------------------|
| `npm run build`   | Vérification TypeScript (`tsc -b`) puis build de production dans `dist/` |
| `npm run preview` | Sert le build de production en local                                     |
| `npm run lint`    | Analyse ESLint                                                           |

---

## Comptes et rôles

| Rôle                   | Accès                                                                              |
|------------------------|------------------------------------------------------------------------------------|
| Visiteur (sans compte) | Carte, panier, commande, suivi de commande                                         |
| `staff`                | Tableau de bord cuisine et disponibilité des produits **de son restaurant**        |
| `admin`                | Tout le back-office, tous les restaurants : création de comptes, CRUD des produits |
| `direction`            | Tableau de bord cuisine de tous les restaurants, **en lecture seule**              |

Comptes créés automatiquement au démarrage de l'API :

| Identifiant  | Mot de passe       | Rôle        | Restaurant |
|--------------|--------------------|-------------|------------|
| `admin123`   | `Admin@123456`     | `admin`     | tous       |
| `staffaix1`  | `Staff@123456`     | `staff`     | Aix        |
| `stafflyon1` | `Staff@123456`     | `staff`     | Lyon       |
| `direction1` | `Direction@123456` | `direction` | tous       |

D'autres comptes peuvent être créés depuis le back-office (« Créer un utilisateur »).

---

## Fonctionnalités

### Parcours client

- **Carte** : produits du restaurant avec photo, prix, catégorie et disponibilité ; squelettes de chargement
  (`Skeleton`).
- **Panier** : ajout et retrait des produits, total calculé.
- **Validation de commande** : nom et e-mail validés, choix du restaurant et du mode de retrait (sur place ou à
  emporter), envoi à l'API sans compte client.
- **Suivi de commande** : saisie du numéro (`YC-XXXXXXXX`) ou accès direct par l'URL `/order/:order_number` ; `Stepper`
  d'avancement, badge de statut, récapitulatif des articles, mode de retrait et total payé.

### Back-office (`/back-office`, routes protégées)

- **Tableau de bord cuisine** : commandes en cours en 3 colonnes (à traiter, en préparation, prêtes), avancement du
  statut en un clic, annulation avec confirmation, alerte rouge sur les commandes en attente depuis plus de 10 minutes,
  liste mise à jour automatiquement.
- **Gestion de la carte** (`/back-office/carte`) :
  - `staff` : switch de disponibilité pour signaler une rupture ;
  - `admin` : création, modification (prix, ingrédients, image...) et suppression des produits, dans tous les
    restaurants. Un produit déjà commandé ne peut pas être supprimé (l'API le refuse pour conserver l'historique) : il
    faut le passer en rupture.
- **Création de comptes** (`admin`) : rôle et restaurant de rattachement.

---

## Architecture du code

```
├── public/
│   └── images/              # photos des produits (chemins /images/... enregistrés en base)
├── src/frontend/
│   ├── assets/              # logos, mascotte, images importées dans le code
│   ├── components/          # composants réutilisables : ProductCard, KitchenDashboard,
│   │                        #   ProtectedRoute, formulaire produit...
│   ├── pages/               # pages et déclaration des routes (App.tsx)
│   ├── services/            # api.ts (axios), auth.ts (JWT)
│   ├── store/               # store Redux Toolkit et slices
│   ├── theme/               # thème MUI
│   ├── types/               # interfaces TypeScript calquées sur le JSON de l'API
│   └── utils/               # format.ts (prix, dates), validation.ts, erreur.ts
```

### Découpage

- **Pages** : un écran par route (catalogue, validation de commande, suivi, back-office, gestion de la carte...).
- **Composants** : briques réutilisées par plusieurs pages, par exemple `ProductCard` affiche un produit à partir de son
  seul `id`, en le lisant dans le store Redux.
- **Services** : tous les appels à l'API passent par `api.ts`, l'authentification par `auth.ts`.
- **Utils** : fonctions pures sans React (formatage en euros et en dates françaises avec `Intl`, validation de l'e-mail
  et du numéro de commande, messages d'erreur lisibles selon le code HTTP).

---

## Choix techniques

### Typage

- Les types de `types/` reproduisent **le JSON renvoyé par l'API**, pas les tables de la base : les dates sont des
  `string` ISO, les prix des `number`.
- Les valeurs fermées sont des **unions** :
  `status: "pending" | "validated" | "preparing" | "ready" | "collected" | "cancelled"`,
  `pickup_mode: "onsite" | "takeaway"`. Une faute de frappe sur un statut est détectée à la compilation.
- Réutilisation des types existants : `type Statut = Order["status"]`, `Partial<Record<Statut, ...>>` pour les actions
  de la cuisine.
- Aucun `any` ; `tsc -b` doit passer sans erreur avant chaque build.

### Authentification

- `POST /auth/login` renvoie un JWT, stocké dans le `localStorage` (`access_token`) et envoyé par axios dans l'en-tête
  `Authorization`.
- Le contenu du token (`sub`, `role`, `restaurant_id`, `exp`) est décodé côté front pour connaître l'utilisateur
  connecté et son restaurant, sans appel supplémentaire. Un token expiré est ignoré.
- `<ProtectedRoute allowedRoles={[...]}>` protège les pages : visiteur non connecté redirigé vers `/login`, rôle non
  autorisé redirigé vers l'accueil. L'API reste la vraie barrière : elle vérifie le token et les droits par restaurant à
  chaque requête.

### État global (Redux Toolkit)

| Slice         | Contenu                                                                              |
|---------------|--------------------------------------------------------------------------------------|
| `userLogged`  | utilisateur connecté (issu du token)                                                 |
| `restaurants` | liste des restaurants                                                                |
| `products`    | carte, utilisée par le catalogue et pour afficher le nom des produits d'une commande |
| `panier`      | produits ajoutés au panier par le client, jusqu'à la validation de la commande       |
| `loading`     | vérification de session en cours au démarrage                                        |

Les données propres à une seule page (commandes de la cuisine, formulaire, produits en gestion) restent dans un
`useState` local.

### MUI

- Mise en page responsive avec `Grid` (`size={{ xs: 12, md: 4 }}` : colonnes empilées sur mobile, côte à côte à partir
  de 900 px) et `Stack`.
- Styles via la prop `sx` et les couleurs du thème (`text.secondary`, `error.main`...), sans CSS séparé.
- Retours utilisateur : `Skeleton` au chargement, `Alert` pour les erreurs, `Dialog` de confirmation avant les actions
  définitives.

---

## Temps réel (Socket.io)

_Partie réalisée par Florian. Section à compléter : option choisie, fonctionnement, événements échangés et lancement._

---

## Répartition des tâches

Le travail a été découpé en issues GitHub, chacune attribuée à un membre du groupe.

### [Emrick](https://github.com/Emrick-R)

| Issue | Tâche                                                                                                       |
|-------|-------------------------------------------------------------------------------------------------------------|
| #5    | C. Validation de la commande (sans compte requis)                                                           |
| #6    | C. Écran de suivi de commande (`/suivi/:order_number`)                                                      |
| #8    | D. Routage protégé                                                                                          |
| #9    | E. Tableau de bord cuisine                                                                                  |
| #10   | F. Gestion de la carte et des disponibilités                                                                |
| #12   | README                                                                                                      |
| #14   | Routage initial                                                                                             |
| #15   | Création des slices Redux initiaux                                                                          |
| —     | Adaptations de l'API pour le front (`restaurant_id` dans le JWT, CORS, chemins des images, données de démo) |

### [Harold](https://github.com/Harld9)

| Issue | Tâche                                  |
|-------|----------------------------------------|
| #1    | A. Header persistant                   |
| #2    | A. Accueil et choix de l'établissement |
| #3    | B. Catalogue interactif                |
| #4    | B. Gestion du panier                   |

### [Florian](https://github.com/Florian-AZ)

| Issue | Tâche                       |
|-------|-----------------------------|
| #7    | D. Connexion                |
| #11   | Temps réel avec Socket.io   |
| #13   | Thème général du site (MUI) |
| #16   | Route d'erreur              |