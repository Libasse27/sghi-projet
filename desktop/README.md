# 🖥️ SGHI Desktop - Application Vue.js + Electron

Application Desktop pour le Système de Gestion Hospitalière Intégré (SGHI).

## 🎯 Description

Application desktop multi-plateforme (Windows, macOS, Linux) développée avec Vue.js 3 et Electron pour la gestion hospitalière.

## 🛠️ Technologies

- **Vue.js 3** - Framework JavaScript progressif
- **Electron** - Framework pour applications desktop
- **Vite** - Build tool et dev server ultra-rapide
- **Ant Design Vue** - Bibliothèque de composants UI
- **Pinia** - State management
- **Vue Router** - Routing
- **Chart.js** - Graphiques et visualisations
- **Axios** - Client HTTP
- **Socket.io Client** - Communication temps réel

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Modifier .env avec l'URL de votre API
VITE_API_URL=http://localhost:3000/api
```

## 🚀 Développement

### Mode Web (développement rapide)

```bash
# Démarrer le serveur de développement Vite
npm run dev

# L'application sera accessible sur http://localhost:5173
```

### Mode Electron (test desktop)

```bash
# Démarrer l'application Electron en mode développement
npm run electron:dev

# Cette commande démarre Vite ET Electron simultanément
```

## 🏗️ Build

### Build Web

```bash
# Build pour le web
npm run build

# Prévisualiser le build
npm run preview
```

### Build Electron

```bash
# Build pour toutes les plateformes
npm run electron:build

# Build pour Windows uniquement
npm run electron:build:win

# Build pour macOS uniquement
npm run electron:build:mac

# Build pour Linux uniquement
npm run electron:build:linux
```

Les fichiers d'installation seront dans le dossier `release/`.

## 📁 Structure du projet

```
desktop/
├── electron/                  # Configuration Electron
│   ├── main.js               # Process principal Electron
│   └── preload.js            # Script de préchargement
├── public/                   # Assets statiques
├── src/
│   ├── assets/              # Images, fonts, etc.
│   ├── components/          # Composants Vue réutilisables
│   ├── views/               # Pages/Vues
│   │   ├── auth/           # Authentification
│   │   ├── dashboard/      # Tableau de bord
│   │   ├── patients/       # Gestion patients
│   │   ├── consultations/  # Consultations
│   │   ├── emergency/      # Urgences
│   │   ├── laboratory/     # Laboratoire
│   │   ├── settings/       # Paramètres
│   │   └── layout/         # Layout principal
│   ├── router/              # Configuration Vue Router
│   ├── store/               # Stores Pinia
│   │   ├── auth.js         # Store authentification
│   │   └── app.js          # Store application
│   ├── services/            # Services API
│   │   ├── api.service.js  # Configuration Axios
│   │   └── auth.service.js # Service auth
│   ├── styles/              # Styles globaux
│   ├── utils/               # Utilitaires
│   ├── App.vue              # Composant racine
│   └── main.js              # Point d'entrée
├── index.html               # HTML de base
├── vite.config.js           # Configuration Vite
└── package.json             # Dépendances
```

## 🔐 Authentification

L'application utilise JWT pour l'authentification avec:
- Access Token (15 min)
- Refresh Token (7 jours)
- Persistence dans localStorage
- Auto-refresh des tokens

### Connexion

```javascript
// Depuis n'importe quel composant
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();

await authStore.login({
  email: 'admin@sghi.com',
  password: 'Admin@123'
});
```

### Routes protégées

Les routes sont automatiquement protégées via le router guard.
Utilisez `meta: { requiresAuth: false }` pour les routes publiques.

## 🎨 Composants disponibles

### Pages principales

- ✅ **LoginView** - Écran de connexion
- ✅ **DashboardView** - Tableau de bord avec statistiques
- ✅ **PatientsView** - Liste des patients
- ✅ **PatientCreateView** - Création de patient
- ⏳ **ConsultationsView** - Gestion consultations (placeholder)
- ⏳ **EmergencyView** - Urgences (placeholder)
- ⏳ **LaboratoryView** - Laboratoire (placeholder)
- ⏳ **SettingsView** - Paramètres (placeholder)

### Layout

- **MainLayout** - Layout principal avec sidebar et header
  - Menu de navigation
  - Header avec breadcrumb et profil utilisateur
  - Notifications
  - Déconnexion

## 📊 Dashboard

Le tableau de bord affiche:
- 📈 Statistiques du jour (patients, consultations, urgences, lits)
- 📉 Graphique de flux de patients (7 derniers jours)
- 📅 Rendez-vous du jour
- 🚨 File d'attente urgences
- 📋 Activités récentes

## 🔌 API

### Configuration

L'URL de l'API est configurée dans `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

### Services disponibles

```javascript
import { authService } from '@/services/auth.service';

// Connexion
await authService.login({ email, password });

// Récupérer le profil
await authService.getProfile();

// Déconnexion
await authService.logout();

// Rafraîchir le token
await authService.refreshToken(refreshToken);
```

## 🎯 Raccourcis clavier

| Raccourci | Action |
|-----------|--------|
| `Ctrl/Cmd + N` | Nouveau patient |
| `Ctrl/Cmd + ,` | Paramètres |
| `Ctrl/Cmd + Q` | Quitter |
| `Ctrl/Cmd + R` | Actualiser |
| `F11` | Plein écran |

## 🧪 Tests

```bash
# Tests unitaires (à configurer)
npm run test

# Tests E2E (à configurer)
npm run test:e2e
```

## 📝 Comptes de test

Pour tester l'application, utilisez ces comptes (après avoir seedé le backend):

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| admin@sghi.com | Admin@123 | SUPER_ADMIN |
| a.diop@sghi.com | Doctor@123 | DOCTOR |
| m.ndiaye@sghi.com | Nurse@123 | NURSE_CHIEF |

## 🔧 Configuration

### Thème

Modifier les couleurs dans `src/App.vue`:

```javascript
const themeConfig = computed(() => ({
  token: {
    colorPrimary: '#2C7A7B',  // Couleur principale
    colorSuccess: '#48BB78',   // Succès
    colorWarning: '#ED8936',   // Warning
    colorError: '#F56565',     // Erreur
  },
}));
```

### Menu

Modifier le menu dans `src/views/layout/MainLayout.vue`:

```javascript
const menuItems = [
  { key: 'Dashboard', icon: DashboardOutlined, label: 'Tableau de bord' },
  // Ajouter vos items...
];
```

## 🐛 Dépannage

### L'application ne démarre pas

```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Erreur de connexion à l'API

Vérifier que:
1. Le backend est démarré (`docker-compose up -d`)
2. L'URL dans `.env` est correcte
3. Le backend est accessible sur http://localhost:3000

### Build Electron échoue

```bash
# Installer electron-builder globalement
npm install -g electron-builder

# Rebuild
npm run electron:build
```

## 📚 Documentation

- [Vue.js 3](https://vuejs.org/)
- [Electron](https://www.electronjs.org/)
- [Ant Design Vue](https://antdv.com/)
- [Pinia](https://pinia.vuejs.org/)
- [Chart.js](https://www.chartjs.org/)

## 🚀 Prochaines étapes

- [ ] Implémenter tous les modules métier
- [ ] Ajouter les tests unitaires
- [ ] Ajouter les tests E2E
- [ ] Optimiser les performances
- [ ] Ajouter le mode hors ligne
- [ ] Intégration WebSocket pour temps réel
- [ ] Système de notifications
- [ ] Génération de PDF/Excel
- [ ] Impression optimisée

## 📄 Licence

MIT

---

**Développé avec ❤️ pour SGHI**
