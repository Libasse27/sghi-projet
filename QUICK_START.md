# 🚀 SGHI - Quick Start Guide

Guide de démarrage rapide pour le projet SGHI (Système de Gestion Hospitalière Intégré)

---

## 📋 Prérequis

### Logiciels Requis

- **Node.js**: v18+ ([Télécharger](https://nodejs.org/))
- **PostgreSQL**: v14+ ([Télécharger](https://www.postgresql.org/download/))
- **MongoDB**: v6+ ([Télécharger](https://www.mongodb.com/try/download/community))
- **Redis**: v7+ ([Télécharger](https://redis.io/download/))
- **Git**: Dernière version

### Optionnel
- **Docker** & **Docker Compose** (recommandé pour dev)

---

## ⚡ Installation Rapide

### 1. Cloner le Projet

```bash
git clone <repository-url>
cd SGHI-PROJECT
```

### 2. Installer les Dépendances

```bash
# Installer toutes les dépendances (monorepo)
npm install

# OU installer par workspace
cd backend && npm install
cd ../desktop && npm install
cd ../mobile && npm install
```

### 3. Configuration

#### Backend (.env)

```bash
cd backend
cp .env.example .env  # Si existe, sinon créer .env
```

**Variables minimales requises:**

```env
# Server
PORT=3001
NODE_ENV=development

# Database (désactivées pour démarrage rapide)
DISABLE_DB=true
DISABLE_MONGO=true

# JWT
JWT_SECRET=your-secret-key-change-me
JWT_REFRESH_SECRET=your-refresh-secret-key-change-me

# CORS
CORS_ORIGIN=http://localhost:8080,http://localhost:3000
```

### 4. Démarrage

#### Option A: Développement sans Base de Données (Recommandé pour test)

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Desktop
cd desktop
npm run dev
```

Le backend démarre sur http://localhost:3001
L'application desktop s'ouvre automatiquement

#### Option B: Avec Bases de Données

**1. Démarrer les services:**

```bash
# PostgreSQL
sudo service postgresql start

# MongoDB
sudo service mongod start

# Redis
sudo service redis-server start
```

**2. Créer la base de données:**

```sql
-- PostgreSQL
CREATE DATABASE sghi_db;
CREATE USER sghi_user WITH PASSWORD 'sghi_password';
GRANT ALL PRIVILEGES ON DATABASE sghi_db TO sghi_user;
```

**3. Mettre à jour .env:**

```env
DISABLE_DB=false
DISABLE_MONGO=false
```

**4. Démarrer:**

```bash
# Backend
cd backend
npm run dev

# Desktop
cd desktop
npm run dev
```

---

## 🎯 Modules Disponibles

### Frontend Desktop (Vue.js + Electron)

| Module | Route | Description |
|--------|-------|-------------|
| **Emergency** | `/emergency` | Gestion des urgences et triage |
| **Laboratory** | `/laboratory` | Analyses médicales |
| **Patients** | `/patients` | Gestion des patients |
| **Consultations** | `/consultations` | Consultations médicales |

### Backend API (NestJS)

| Module | Endpoints | Status |
|--------|-----------|--------|
| **Auth** | 11 endpoints | ✅ Complet |
| **Emergency** | 12 endpoints | ✅ Complet |
| **Patients** | - | ⏳ À créer |
| **Laboratory** | - | ⏳ À créer |
| **Consultations** | - | ⏳ À créer |

---

## 📚 Documentation API

Une fois le backend démarré:

- **Swagger UI**: http://localhost:3001/api/docs
- **Redoc**: http://localhost:3001/api/redoc

---

## 🔑 Authentification

### Compte de Test

**Créer un compte** (si Auth activé):

```bash
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "email": "admin@sghi.com",
  "password": "Admin123!",
  "nom": "Admin",
  "prenom": "SGHI",
  "role": "SUPER_ADMIN"
}
```

**Se connecter:**

```bash
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "admin@sghi.com",
  "password": "Admin123!"
}
```

---

## 🧪 Tests

### Backend

```bash
cd backend

# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e

# Coverage
npm run test:cov
```

### Desktop

```bash
cd desktop

# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e
```

---

## 🔧 Commandes Utiles

### Backend

```bash
# Développement
npm run dev

# Build
npm run build

# Production
npm run start:prod

# Générer un module
nest g module nom-module

# Générer un service
nest g service nom-service

# Générer un controller
nest g controller nom-controller
```

### Desktop

```bash
# Développement
npm run dev

# Build
npm run build

# Build pour production
npm run build:prod

# Linter
npm run lint

# Format code
npm run format
```

---

## 🐳 Docker (Optionnel)

### Démarrage avec Docker Compose

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

**Services démarrés:**
- PostgreSQL (port 5432)
- MongoDB (port 27017)
- Redis (port 6379)
- Backend (port 3001)

---

## 🗂️ Structure du Projet

```
SGHI-PROJECT/
├── backend/          # API NestJS
│   ├── src/
│   │   ├── config/   # Configuration
│   │   ├── modules/  # Modules métier
│   │   └── main.ts
│   └── .env
│
├── desktop/          # App Desktop (Electron + Vue.js)
│   ├── src/
│   │   ├── views/    # Pages/Vues
│   │   ├── router/   # Routes
│   │   └── main.js
│   └── package.json
│
├── mobile/           # App Mobile (React Native)
│   └── src/
│
├── shared/           # Code partagé
│   └── constants/
│
└── package.json      # Workspace root
```

---

## 🎨 Données de Démonstration

Les modules frontend utilisent actuellement des **données mockées** pour la démonstration:

- **Patients**: 3 patients fictifs
- **Consultations**: 3 consultations
- **Analyses**: 5 analyses
- **Urgences**: 3-5 urgences

Ces données seront remplacées par des appels API une fois l'intégration complétée.

---

## 🐛 Dépannage

### Port déjà utilisé

```bash
# Trouver le processus
lsof -i :3001  # ou netstat -ano | findstr :3001 (Windows)

# Tuer le processus
kill -9 <PID>
```

### Problèmes de dépendances

```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Base de données

```bash
# Réinitialiser PostgreSQL
dropdb sghi_db
createdb sghi_db

# Réinitialiser MongoDB
mongo sghi_db --eval "db.dropDatabase()"
```

---

## 📖 Documentation Complète

- **Vue d'ensemble**: [SESSION_COMPLETE_SUMMARY.md](./SESSION_COMPLETE_SUMMARY.md)
- **Modules Desktop**: [desktop/DESKTOP_MODULES_COMPLETE.md](./desktop/DESKTOP_MODULES_COMPLETE.md)
- **Module Emergency**: [EMERGENCY_MODULE_COMPLETE.md](./EMERGENCY_MODULE_COMPLETE.md)
- **Config Backend**: [backend/BACKEND_CONFIG_COMPLETE.md](./backend/BACKEND_CONFIG_COMPLETE.md)
- **Routes**: [desktop/ROUTES_CORRECTIONS.md](./desktop/ROUTES_CORRECTIONS.md)

---

## 🤝 Contribution

### Workflow Git

```bash
# Créer une branche
git checkout -b feature/nom-feature

# Commiter
git add .
git commit -m "feat: description"

# Push
git push origin feature/nom-feature
```

### Convention de Commit

```
feat: Nouvelle fonctionnalité
fix: Correction de bug
docs: Documentation
style: Formatage
refactor: Refactoring
test: Tests
chore: Tâches diverses
```

---

## 📞 Support

### Problèmes Connus

1. **Port 3001 occupé**: Changez le port dans `.env` (PORT=3002)
2. **Module non trouvé**: Réinstallez les dépendances (`npm install`)
3. **CORS errors**: Vérifiez `CORS_ORIGIN` dans `.env`

### Aide

- **Issues**: Créer une issue sur GitHub
- **Documentation**: Voir les fichiers `*.md` du projet
- **API**: Consultez Swagger (http://localhost:3001/api/docs)

---

## ✅ Checklist de Démarrage

- [ ] Node.js installé (v18+)
- [ ] Dépendances installées (`npm install`)
- [ ] Fichier `.env` configuré
- [ ] Backend démarré (`npm run dev`)
- [ ] Desktop démarré (`npm run dev`)
- [ ] API accessible (http://localhost:3001)
- [ ] Documentation lue

---

## 🎯 Premiers Pas

1. **Démarrer le backend**: `cd backend && npm run dev`
2. **Démarrer le desktop**: `cd desktop && npm run dev`
3. **Ouvrir Swagger**: http://localhost:3001/api/docs
4. **Explorer les modules**:
   - Emergency: `/emergency`
   - Patients: `/patients`
   - Laboratory: `/laboratory`
   - Consultations: `/consultations`

---

## 🚀 Prêt à Développer!

Le projet SGHI est maintenant prêt. Consultez la documentation pour plus de détails sur chaque module.

**Bon développement! 🎉**

---

**Projet**: SGHI - Système de Gestion Hospitalière Intégré
**Version**: 1.0.0
**License**: MIT
**Date**: 2025-11-20
