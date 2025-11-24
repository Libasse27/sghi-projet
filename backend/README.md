# 🏥 SGHI Backend API

API Backend NestJS pour le Système de Gestion Hospitalière Intégré (SGHI).

## 📋 Table des matières

- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Développement](#développement)
- [Structure du projet](#structure-du-projet)
- [API Documentation](#api-documentation)
- [Tests](#tests)

## 🛠️ Technologies

- **Framework**: NestJS 10.x (TypeScript)
- **Base de données relationnelle**: PostgreSQL 15+ avec TypeORM
- **Base de données documentaire**: MongoDB 6+ avec Mongoose
- **Cache**: Redis 7+
- **Authentification**: JWT (JSON Web Tokens)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Tests**: Jest, Supertest

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Modifier .env avec vos configurations
```

## ⚙️ Configuration

Modifier le fichier `.env` avec vos paramètres :

```env
# Base de données
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=sghi_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=sghi_db

# MongoDB
MONGO_HOST=localhost
MONGO_PORT=27017
# ... etc
```

## 🚀 Développement

```bash
# Démarrer en mode développement
npm run dev

# Démarrer avec Docker Compose (depuis la racine)
cd ..
docker-compose up -d

# Lancer les migrations
npm run migration:run

# Seeder la base de données
npm run seed:run
```

L'API sera disponible sur http://localhost:3000

## 📁 Structure du projet

```
backend/
├── src/
│   ├── config/              # Configurations (DB, JWT, Redis, etc.)
│   ├── modules/             # Modules métier
│   │   ├── auth/           # Authentification
│   │   ├── patients/       # Gestion des patients
│   │   ├── consultations/  # Consultations
│   │   ├── emergency/      # Urgences
│   │   ├── laboratory/     # Laboratoire
│   │   ├── imaging/        # Imagerie
│   │   ├── hospitalization/# Hospitalisation
│   │   ├── physiotherapy/  # Kinésithérapie
│   │   ├── pharmacy/       # Pharmacie
│   │   ├── surgery/        # Bloc opératoire
│   │   ├── billing/        # Facturation
│   │   ├── hr/             # Ressources humaines
│   │   └── statistics/     # Statistiques
│   ├── common/              # Code partagé
│   │   ├── decorators/     # Décorateurs personnalisés
│   │   ├── filters/        # Filtres d'exception
│   │   ├── interceptors/   # Intercepteurs
│   │   ├── pipes/          # Pipes de validation
│   │   ├── guards/         # Guards d'autorisation
│   │   └── utils/          # Utilitaires
│   ├── database/            # Base de données
│   │   ├── migrations/     # Migrations TypeORM
│   │   └── seeds/          # Seeds
│   ├── gateway/             # WebSocket gateway
│   ├── app.module.ts        # Module principal
│   ├── app.controller.ts    # Contrôleur principal
│   ├── app.service.ts       # Service principal
│   └── main.ts              # Point d'entrée
├── test/                     # Tests
├── .env.example             # Exemple de configuration
├── nest-cli.json            # Configuration NestJS CLI
├── package.json             # Dépendances
├── tsconfig.json            # Configuration TypeScript
└── README.md                # Ce fichier
```

## 📚 API Documentation

La documentation Swagger est disponible sur :

```
http://localhost:3000/api-docs
```

### Endpoints principaux

- **Auth**: `/api/auth/*`
- **Patients**: `/api/patients/*`
- **Consultations**: `/api/consultations/*`
- **Urgences**: `/api/emergency/*`
- **Laboratoire**: `/api/laboratory/*`
- **Imagerie**: `/api/imaging/*`
- **Hospitalisation**: `/api/hospitalization/*`
- **Kinésithérapie**: `/api/physiotherapy/*`
- **Pharmacie**: `/api/pharmacy/*`
- **Bloc opératoire**: `/api/surgery/*`
- **Facturation**: `/api/billing/*`
- **RH**: `/api/hr/*`
- **Statistiques**: `/api/statistics/*`

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests en mode watch
npm run test:watch

# Couverture de code
npm run test:cov

# Tests E2E
npm run test:e2e
```

## 🔒 Sécurité

- **Authentification**: JWT avec refresh tokens
- **Hachage des mots de passe**: bcrypt
- **Rate limiting**: Throttler
- **Validation des données**: class-validator
- **Headers de sécurité**: Helmet
- **CORS**: Configurable par environnement

## 📝 Scripts disponibles

```bash
npm run dev          # Développement avec hot-reload
npm run build        # Build production
npm run start        # Démarrer en production
npm run lint         # Linter le code
npm run format       # Formater le code
npm run migration:generate  # Générer une migration
npm run migration:run       # Lancer les migrations
npm run seed:run     # Seeder la base de données
```

## 🐳 Docker

```bash
# Construire l'image
docker build -t sghi-backend .

# Lancer le conteneur
docker run -p 3000:3000 sghi-backend

# Avec Docker Compose (recommandé)
docker-compose up -d backend
```

## 📖 Documentation supplémentaire

- [Guide d'architecture](../docs/backend/architecture.md)
- [Guide des modules](../docs/backend/modules.md)
- [Guide de déploiement](../docs/deployment/README.md)

## 🤝 Contribution

Voir [CONTRIBUTING.md](../CONTRIBUTING.md)

## 📄 Licence

MIT License - voir [LICENSE](../LICENSE)
