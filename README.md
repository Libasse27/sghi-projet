# 🏥 SGHI - Système de Gestion Hospitalière Intégré

Integrated Hospital Management System - Un système complet de gestion hospitalière avec application Desktop (Vue.js/Electron) et Mobile (React Native).

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Installation](#installation)
- [Développement](#développement)
- [Déploiement](#déploiement)
- [Documentation](#documentation)

## 🎯 Vue d'ensemble

SGHI est un système de gestion hospitalière complet comprenant :

### 🖥️ Application Desktop (Personnel Hospitalier)
- Gestion des patients et dossiers médicaux électroniques
- Consultations médicales par spécialités
- Module d'urgences avec triage
- Laboratoire d'analyses médicales
- Imagerie médicale (PACS-lite)
- Gestion d'hospitalisation et lits
- Kinésithérapie/Rééducation
- Pharmacie et dispensation
- Bloc opératoire
- Facturation et comptabilité
- Ressources humaines
- Statistiques et reporting

### 📱 Application Mobile (Patients)
- Profil médical personnel
- Prise de rendez-vous
- Consultation des résultats
- Suivi médical et monitoring
- Messagerie médicale sécurisée
- Paiement mobile (Orange Money, Wave, Free Money)
- Alertes et notifications intelligentes
- Module urgences

### 🔌 API Backend
- API REST/GraphQL avec NestJS
- Authentification JWT sécurisée
- WebSocket pour temps réel
- Documentation Swagger/OpenAPI

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
├───────────────────┬─────────────────────────────┤
│  Desktop App      │     Mobile App              │
│  (Vue.js/Electron)│     (React Native)          │
└───────────────────┴─────────────────────────────┘
            │                    │
            ▼                    ▼
┌─────────────────────────────────────────────────┐
│                API GATEWAY                       │
│                 (NestJS)                         │
└─────────────────────────────────────────────────┘
            │                    │
    ┌───────▼────────┐   ┌──────▼──────┐
    │   PostgreSQL   │   │   MongoDB    │
    │   (Structured) │   │ (Documents)  │
    └────────────────┘   └──────────────┘
            │                    │
         Redis            Socket.io
      (Cache/Sessions)   (Real-time)
```

## 🛠️ Technologies

### Backend
- **Framework**: NestJS (TypeScript)
- **Bases de données**: PostgreSQL, MongoDB
- **Cache**: Redis
- **Temps réel**: Socket.io
- **Auth**: JWT, Bcrypt
- **Documentation**: Swagger/OpenAPI
- **Tests**: Jest, Supertest

### Desktop
- **Framework**: Vue.js 3 + Electron
- **UI**: Ant Design Vue
- **State**: Pinia
- **Charts**: Chart.js
- **Export**: jsPDF, xlsx

### Mobile
- **Framework**: React Native
- **State**: Redux Toolkit
- **UI**: React Native Elements
- **Navigation**: React Navigation
- **Push**: FCM (Android), APNS (iOS)
- **Paiement**: Orange Money, Wave, Free Money APIs

## 📦 Installation

### Prérequis
- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker & Docker Compose
- PostgreSQL 15+
- MongoDB 6+
- Redis 7+

### Installation rapide

```bash
# Cloner le repository
git clone <repository-url>
cd SGHI-PROJECT

# Installer toutes les dépendances
npm run install:all

# Copier les fichiers d'environnement
cp .env.example .env
cp backend/.env.example backend/.env
cp desktop/.env.example desktop/.env
cp mobile/.env.example mobile/.env

# Démarrer les services avec Docker
npm run docker:up

# Lancer les migrations de base de données
cd backend && npm run migration:run
```

## 🚀 Développement

### Démarrer le backend
```bash
npm run backend:dev
```
API disponible sur: http://localhost:3000
Documentation Swagger: http://localhost:3000/api

### Démarrer l'application Desktop
```bash
npm run desktop:dev
```

### Démarrer l'application Mobile

**Android:**
```bash
npm run mobile:android
```

**iOS:**
```bash
npm run mobile:ios
```

## 🐳 Docker

### Démarrer tous les services
```bash
docker-compose up -d
```

### Services disponibles
- **API Backend**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379
- **Adminer** (DB Admin): http://localhost:8080

### Voir les logs
```bash
npm run docker:logs
```

### Arrêter les services
```bash
npm run docker:down
```

## 📁 Structure du projet

```
SGHI-PROJECT/
├── backend/          # API NestJS
├── desktop/          # App Desktop Vue.js/Electron
├── mobile/           # App Mobile React Native
├── shared/           # Code partagé
├── docker/           # Configuration Docker
├── docs/             # Documentation
├── deployment/       # Scripts de déploiement
└── tests/            # Tests E2E
```

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e

# Couverture de code
npm run test:cov
```

## 📚 Documentation

- [Documentation Backend](./docs/backend/README.md)
- [Documentation Desktop](./docs/desktop/README.md)
- [Documentation Mobile](./docs/mobile/README.md)
- [API Reference](./docs/api/README.md)
- [Guide de déploiement](./docs/deployment/README.md)

## 🔒 Sécurité

- HTTPS/TLS 1.3
- Authentification JWT avec refresh tokens
- Chiffrement AES-256 des données sensibles
- RBAC (Role-Based Access Control)
- Rate limiting
- Validation des données
- Logs d'audit

## 🌍 Conformité

- **International**: HIPAA, GDPR, ISO 27001, HL7/FHIR
- **Afrique de l'Ouest**: SYSCOHADA, Normes CEDEAO
- **Médical**: ICD-10, CCAM, DCI

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez consulter [CONTRIBUTING.md](./CONTRIBUTING.md) pour plus de détails.

## 📄 Licence

MIT License - voir [LICENSE](./LICENSE) pour plus de détails.

## 👥 Équipe

SGHI Team - Système de Gestion Hospitalière Intégré

## 📞 Support

Pour toute question ou support, veuillez contacter : support@sghi.com

---

**Made with ❤️ for better healthcare management**
