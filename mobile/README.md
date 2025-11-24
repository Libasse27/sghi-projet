# 📱 SGHI Mobile - Application React Native

Application mobile pour le Système de Gestion Hospitalière Intégré (SGHI) destinée aux patients.

## 🎯 Description

Application mobile native (iOS & Android) développée avec React Native pour permettre aux patients de gérer leurs rendez-vous, consulter leur dossier médical et communiquer avec l'hôpital.

## 🛠️ Technologies

- **React Native 0.73.1** - Framework mobile cross-platform
- **TypeScript** - Typage statique
- **Redux Toolkit** - State management avec async thunks
- **Redux Persist** - Persistence du state
- **React Navigation** - Navigation (Stack, Bottom Tabs, Drawer)
- **React Native Elements** - Bibliothèque de composants UI
- **React Native Vector Icons** - Icônes Material Design
- **Axios** - Client HTTP
- **React Native Chart Kit** - Graphiques et visualisations
- **React Native Biometrics** - Authentification biométrique
- **React Native Encrypted Storage** - Stockage sécurisé

## 📦 Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- React Native CLI
- Android Studio (pour Android)
- Xcode (pour iOS, macOS uniquement)

### Installation des dépendances

```bash
# Installer les dépendances
cd mobile
npm install

# iOS uniquement - Installer les pods
cd ios
pod install
cd ..
```

### Configuration

```bash
# Le fichier .env n'est pas nécessaire pour le développement local
# L'URL de l'API est configurée dans src/services/apiClient.ts
# Par défaut: http://localhost:3000/api
```

## 🚀 Développement

### Android

```bash
# Démarrer Metro Bundler
npm start

# Dans un autre terminal, lancer l'app Android
npm run android

# Ou avec React Native CLI
npx react-native run-android
```

### iOS (macOS uniquement)

```bash
# Démarrer Metro Bundler
npm start

# Dans un autre terminal, lancer l'app iOS
npm run ios

# Ou avec React Native CLI
npx react-native run-ios
```

## 🏗️ Build

### Android

```bash
# Build debug APK
cd android
./gradlew assembleDebug

# Build release APK
./gradlew assembleRelease

# APK disponible dans: android/app/build/outputs/apk/
```

### iOS (macOS uniquement)

```bash
# Ouvrir le projet dans Xcode
open ios/SGHIMobile.xcworkspace

# Ou build en ligne de commande
xcodebuild -workspace ios/SGHIMobile.xcworkspace \
  -scheme SGHIMobile \
  -configuration Release \
  -archivePath build/SGHIMobile.xcarchive \
  archive
```

## 📁 Structure du projet

```
mobile/
├── src/
│   ├── navigation/          # Configuration de la navigation
│   │   ├── types.ts         # Types TypeScript pour la navigation
│   │   ├── RootNavigator.tsx    # Navigateur racine
│   │   ├── AuthNavigator.tsx    # Navigation authentification
│   │   └── MainNavigator.tsx    # Navigation principale
│   ├── screens/             # Écrans de l'application
│   │   ├── SplashScreen.tsx     # Écran de chargement
│   │   ├── auth/           # Écrans d'authentification
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── ForgotPasswordScreen.tsx
│   │   ├── home/           # Écrans principaux
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── ProfileScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   ├── patients/       # Gestion patients
│   │   │   ├── PatientsListScreen.tsx
│   │   │   ├── PatientDetailScreen.tsx
│   │   │   └── PatientCreateScreen.tsx
│   │   ├── appointments/   # Rendez-vous
│   │   │   └── AppointmentsListScreen.tsx
│   │   └── menu/           # Menu principal
│   │       └── MenuScreen.tsx
│   ├── store/              # Redux store
│   │   ├── index.ts        # Configuration du store
│   │   └── slices/         # Slices Redux
│   │       ├── authSlice.ts    # Authentification
│   │       ├── appSlice.ts     # App global state
│   │       └── patientSlice.ts # Patients
│   ├── services/           # Services API
│   │   ├── apiClient.ts    # Configuration Axios + interceptors
│   │   └── authService.ts  # Service authentification
│   ├── styles/             # Styles et thème
│   │   ├── colors.ts       # Palette de couleurs
│   │   └── theme.ts        # Configuration du thème
│   └── App.tsx             # Point d'entrée
├── android/                # Projet Android natif
├── ios/                    # Projet iOS natif
├── package.json
├── tsconfig.json
├── babel.config.js
└── README.md
```

## 🔐 Authentification

### Connexion

```typescript
import { useDispatch } from 'react-redux';
import { loginUser } from '@store/slices/authSlice';

const dispatch = useDispatch();

await dispatch(loginUser({
  email: 'patient@example.com',
  password: 'password123'
})).unwrap();
```

### Auto-refresh des tokens

Le client API gère automatiquement le rafraîchissement des tokens JWT:
- Access token: 15 minutes
- Refresh token: 7 jours
- Auto-refresh sur erreur 401

### Déconnexion

```typescript
import { useDispatch } from 'react-redux';
import { logoutUser } from '@store/slices/authSlice';

const dispatch = useDispatch();
await dispatch(logoutUser());
```

## 🎨 Écrans disponibles

### Authentification
- ✅ **LoginScreen** - Connexion avec validation
- ✅ **RegisterScreen** - Inscription nouveau compte
- ✅ **ForgotPasswordScreen** - Réinitialisation mot de passe

### Dashboard
- ✅ **DashboardScreen** - Tableau de bord avec:
  - Statistiques en temps réel
  - Graphique de flux de patients
  - Rendez-vous du jour
  - Actions rapides

### Profil
- ✅ **ProfileScreen** - Profil utilisateur
- ✅ **SettingsScreen** - Paramètres de l'application

### Patients
- ✅ **PatientsListScreen** - Liste des patients avec recherche
- ✅ **PatientDetailScreen** - Détails complet d'un patient
- ✅ **PatientCreateScreen** - Formulaire de création

### Rendez-vous
- ✅ **AppointmentsListScreen** - Liste des rendez-vous

### Menu
- ✅ **MenuScreen** - Menu principal avec accès aux modules

## 🎨 Thème et couleurs

### Palette de couleurs

```typescript
colors = {
  primary: '#2C7A7B',      // Teal principal
  secondary: '#4299E1',    // Bleu secondaire
  success: '#48BB78',      // Vert succès
  warning: '#ED8936',      // Orange warning
  error: '#F56565',        // Rouge erreur
  // ... voir src/styles/colors.ts
}
```

### Personnalisation

Modifier le thème dans [src/styles/theme.ts](src/styles/theme.ts):

```typescript
export const theme = createTheme({
  lightColors: { /* ... */ },
  darkColors: { /* ... */ },
  components: { /* ... */ },
});
```

## 🔄 State Management

### Redux Store

```typescript
// store/index.ts
const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
    patient: patientReducer,
  },
});
```

### Utilisation dans un composant

```typescript
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store';

const MyComponent = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  // ...
};
```

## 📡 API Integration

### Configuration du client

```typescript
// services/apiClient.ts
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 30000,
});
```

### Utilisation

```typescript
import authService from '@services/authService';

// Login
const response = await authService.login({ email, password });

// Get profile
const profile = await authService.getProfile();
```

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests avec coverage
npm run test:coverage

# Tests E2E (Detox)
npm run test:e2e:ios
npm run test:e2e:android
```

## 📝 Comptes de test

| Email | Mot de passe | Type |
|-------|--------------|------|
| patient@example.com | Patient@123 | Patient |
| aminata.sow@example.com | Patient@123 | Patient |

## 🐛 Dépannage

### Metro Bundler ne démarre pas

```bash
# Nettoyer le cache
npm start -- --reset-cache

# Ou
npx react-native start --reset-cache
```

### Erreurs de build Android

```bash
# Nettoyer les builds
cd android
./gradlew clean
cd ..

# Rebuilder
npm run android
```

### Erreurs de build iOS

```bash
# Réinstaller les pods
cd ios
pod deintegrate
pod install
cd ..

# Rebuilder
npm run ios
```

### Erreur de connexion à l'API

Vérifier que:
1. Le backend est démarré sur http://localhost:3000
2. Pour Android Emulator, utiliser `http://10.0.2.2:3000/api` au lieu de `localhost`
3. Pour device physique, utiliser l'IP local (ex: `http://192.168.1.100:3000/api`)

### Path aliases ne fonctionnent pas

```bash
# Réinstaller les dépendances
rm -rf node_modules
npm install

# Redémarrer Metro avec reset cache
npm start -- --reset-cache
```

## 🔧 Configuration avancée

### Changer l'URL de l'API

Modifier dans [src/services/apiClient.ts](src/services/apiClient.ts:5):

```typescript
const API_URL = 'https://your-api-url.com/api';
```

### Activer l'authentification biométrique

```typescript
import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

const { available, biometryType } = await rnBiometrics.isSensorAvailable();

if (available) {
  const { success } = await rnBiometrics.simplePrompt({
    promptMessage: 'Authentification'
  });
}
```

## 📚 Documentation

- [React Native](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Native Elements](https://reactnativeelements.com/)
- [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)

## 🚀 Prochaines étapes

- [ ] Implémenter tous les modules métier
- [ ] Ajouter les tests unitaires
- [ ] Ajouter les tests E2E
- [ ] Implémenter les notifications push
- [ ] Ajouter l'authentification biométrique
- [ ] Mode hors ligne avec synchronisation
- [ ] Optimiser les performances
- [ ] Génération de PDF
- [ ] Support multilingue (Fr, En, Wo)
- [ ] Intégration Deep Linking
- [ ] Analytics et crash reporting

## 📄 Licence

MIT

---

**Développé avec ❤️ pour SGHI**
