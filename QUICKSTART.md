# 🚀 Guide de démarrage rapide - SGHI

Ce guide vous permettra de démarrer rapidement avec le projet SGHI.

## 📋 Prérequis

Assurez-vous d'avoir installé :

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker** et **Docker Compose** (recommandé)
- **Git**

## ⚡ Installation rapide

### Option 1: Avec Docker (Recommandé)

```bash
# 1. Cloner le repository
git clone <repository-url>
cd SGHI-PROJECT

# 2. Copier les fichiers d'environnement
cp .env.example .env
cp backend/.env.example backend/.env

# 3. Démarrer tous les services avec Docker
docker-compose up -d

# 4. Attendre que les services démarrent (30 secondes environ)
docker-compose logs -f

# 5. Accéder aux services
# - API Backend: http://localhost:3000
# - Documentation API: http://localhost:3000/api-docs
# - Adminer (PostgreSQL): http://localhost:8080
# - Mongo Express: http://localhost:8081
# - Redis Commander: http://localhost:8082
```

### Option 2: Installation manuelle

```bash
# 1. Cloner le repository
git clone <repository-url>
cd SGHI-PROJECT

# 2. Installer toutes les dépendances
npm run install:all

# 3. Installer PostgreSQL, MongoDB et Redis localement
# Suivre les instructions spécifiques à votre OS

# 4. Configurer les fichiers .env
cp .env.example .env
cp backend/.env.example backend/.env
# Modifier les fichiers .env avec vos configurations

# 5. Lancer les migrations de base de données
cd backend
npm run migration:run

# 6. Seeder la base de données (optionnel)
npm run seed:run

# 7. Démarrer le backend
npm run dev
```

## 🏥 Structure du projet

```
SGHI-PROJECT/
├── backend/          # API NestJS (Port: 3000)
├── desktop/          # App Desktop Vue.js/Electron
├── mobile/           # App Mobile React Native
├── shared/           # Code partagé (types, constantes)
├── docker/           # Configurations Docker
└── docs/             # Documentation
```

## 🔧 Commandes utiles

### Commandes générales

```bash
# Installer toutes les dépendances
npm run install:all

# Démarrer tous les services Docker
npm run docker:up

# Arrêter tous les services Docker
npm run docker:down

# Voir les logs Docker
npm run docker:logs

# Nettoyer le projet
npm run clean
```

### Backend

```bash
cd backend

# Développement
npm run dev

# Build
npm run build

# Tests
npm run test

# Migrations
npm run migration:run

# Seeding
npm run seed:run
```

### Desktop

```bash
cd desktop

# Développement
npm run dev

# Build
npm run build
```

### Mobile

```bash
cd mobile

# Démarrer Metro bundler
npm run start

# Android
npm run android

# iOS (Mac uniquement)
npm run ios
```

## 📚 Accès aux interfaces

### API Backend
- **URL**: http://localhost:3000
- **Documentation Swagger**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

### Outils d'administration (avec Docker)
- **Adminer** (PostgreSQL): http://localhost:8080
  - Serveur: postgres
  - Utilisateur: sghi_user
  - Mot de passe: sghi_password
  - Base: sghi_db

- **Mongo Express** (MongoDB): http://localhost:8081
  - Username: admin
  - Password: admin123

- **Redis Commander**: http://localhost:8082

## 🔑 Authentification

L'API utilise JWT pour l'authentification. Voici comment obtenir un token :

```bash
# Créer un utilisateur (via Swagger ou cURL)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sghi.com",
    "password": "Admin@123",
    "nom": "Admin",
    "prenom": "SGHI",
    "role": "ADMIN"
  }'

# Se connecter
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sghi.com",
    "password": "Admin@123"
  }'

# Utiliser le token retourné dans les requêtes suivantes
curl -X GET http://localhost:3000/api/patients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🗄️ Base de données

### Migrations

```bash
cd backend

# Créer une nouvelle migration
npm run migration:generate -- -n NomDeLaMigration

# Lancer les migrations
npm run migration:run

# Annuler la dernière migration
npm run migration:revert
```

### Seeding

```bash
cd backend

# Lancer le seeding
npm run seed:run
```

## 🧪 Tests

```bash
# Tests backend
cd backend
npm run test              # Tests unitaires
npm run test:watch        # Mode watch
npm run test:cov          # Avec couverture
npm run test:e2e          # Tests E2E
```

## 📖 Documentation

- [Documentation complète](./README.md)
- [Architecture Backend](./docs/backend/architecture.md)
- [Guide des modules](./docs/backend/modules.md)
- [Documentation API](http://localhost:3000/api-docs)
- [Guide de déploiement](./docs/deployment/README.md)

## 🐛 Dépannage

### Le backend ne démarre pas

```bash
# Vérifier que PostgreSQL, MongoDB et Redis sont accessibles
docker-compose ps

# Vérifier les logs
docker-compose logs backend

# Redémarrer les services
docker-compose restart backend
```

### Erreur de connexion à la base de données

```bash
# Vérifier les variables d'environnement dans backend/.env
cat backend/.env

# Vérifier que PostgreSQL est démarré
docker-compose ps postgres

# Réinitialiser la base de données
make reset-db
```

### Port déjà utilisé

```bash
# Trouver le processus utilisant le port 3000
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000

# Tuer le processus ou changer le port dans .env
```

## 🔄 Workflow de développement recommandé

1. **Créer une branche** pour chaque fonctionnalité
   ```bash
   git checkout -b feature/nom-de-la-fonctionnalite
   ```

2. **Développer et tester** localement
   ```bash
   npm run dev
   npm run test
   ```

3. **Commiter** avec des messages clairs
   ```bash
   git add .
   git commit -m "feat: description de la fonctionnalité"
   ```

4. **Pousser** et créer une Pull Request
   ```bash
   git push origin feature/nom-de-la-fonctionnalite
   ```

## 📞 Support

Pour toute question ou problème :

- **Documentation**: [docs/](./docs/)
- **Issues**: GitHub Issues
- **Email**: support@sghi.com

## 🎯 Prochaines étapes

1. ✅ Installation terminée
2. 📚 Lire la [documentation complète](./README.md)
3. 🏥 Explorer l'[API via Swagger](http://localhost:3000/api-docs)
4. 💻 Commencer à développer !

---

**Bon développement ! 🚀**
