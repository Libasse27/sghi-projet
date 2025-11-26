# SGHI Desktop - Guide de Configuration Electron

Guide complet pour configurer et utiliser Electron dans l'application SGHI Desktop.

## 📋 Prérequis

- Node.js 18+ installé
- npm ou yarn
- Git

## 🚀 Installation

### 1. Installer les dépendances Electron

```bash
cd desktop
npm install --save-dev electron electron-builder electron-updater concurrently wait-on
```

### 2. Mettre à jour package.json

Copier la configuration depuis `electron.package.example.json` vers votre `package.json`:

```bash
# Fusionner les scripts et la configuration build
```

Les éléments importants à ajouter:
- `"main": "electron/main.js"`
- Scripts `electron:dev` et `electron:build`
- Section `build` avec la configuration electron-builder

### 3. Configuration du Router Vue

Modifier `src/router/index.ts` pour utiliser le mode hash (requis pour Electron):

```typescript
import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(), // Important: mode hash pour Electron
  routes: [
    // vos routes...
  ],
});

export default router;
```

### 4. Créer l'icône de l'application

Placer une icône PNG (512x512 minimum) dans `public/icon.png`:

```bash
# Exemple avec ImageMagick
convert icon.svg -resize 512x512 public/icon.png
```

### 5. Configuration Vue.js

Créer ou modifier `vue.config.js`:

```javascript
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  outputDir: 'dist',
  assetsDir: 'assets',
  productionSourceMap: false,

  devServer: {
    port: 8080,
    host: 'localhost',
  },

  configureWebpack: {
    target: 'electron-renderer',
  },
};
```

## 🔧 Utilisation dans le Code

### Utiliser le composable useElectron

```vue
<template>
  <div>
    <div v-if="isElectron">
      <p>App version: {{ appVersion }}</p>
      <p>Platform: {{ platform.platform }}</p>
    </div>

    <button @click="handlePrint">Imprimer</button>
    <button @click="handleNotify">Notifier</button>
  </div>
</template>

<script setup lang="ts">
import { useElectron } from '@/composables/useElectron';

const {
  isElectron,
  appVersion,
  platform,
  printDocument,
  showNotification,
} = useElectron();

const handlePrint = async () => {
  const html = `
    <div class="print-header">
      <h1>SGHI - Fiche Patient</h1>
    </div>
    <div class="print-content">
      <p>Contenu du document...</p>
    </div>
  `;

  await printDocument(html, { landscape: false });
};

const handleNotify = () => {
  showNotification('Succès', 'Opération réussie!');
};
</script>
```

### Exemple d'impression PDF

```typescript
import { useElectron } from '@/composables/useElectron';

const { printToPDF } = useElectron();

const exportPDF = async () => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Rapport</title>
      </head>
      <body>
        <h1>Rapport Médical</h1>
        <p>Contenu du rapport...</p>
      </body>
    </html>
  `;

  try {
    const filePath = await printToPDF(html, {
      pageSize: 'A4',
      landscape: false,
    });

    if (filePath) {
      console.log('PDF saved to:', filePath);
    }
  } catch (error) {
    console.error('Error exporting PDF:', error);
  }
};
```

### Exemple de sélection de fichier

```typescript
const { selectFile } = useElectron();

const importFile = async () => {
  const filePath = await selectFile({
    filters: [
      { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
      { name: 'Documents', extensions: ['pdf', 'doc', 'docx'] },
    ],
  });

  if (filePath) {
    console.log('Selected file:', filePath);
  }
};
```

## 🎯 Développement

### Démarrer en mode développement

```bash
npm run electron:dev
```

Cette commande:
1. Lance le serveur de développement Vue.js sur `http://localhost:8080`
2. Attend que le serveur soit prêt
3. Lance Electron qui se connecte au serveur de développement
4. Active le hot-reload

### DevTools

Les DevTools sont automatiquement ouverts en mode développement:
- F12 pour ouvrir/fermer
- Vue DevTools disponible si installé

## 📦 Build Production

### Build pour Windows

```bash
npm run electron:build:win
```

Génère:
- Installeur NSIS (.exe)
- Version portable (.exe)

Sortie dans `dist_electron/`

### Build pour macOS

```bash
npm run electron:build:mac
```

Génère:
- DMG (.dmg)
- ZIP (.zip)

### Build pour Linux

```bash
npm run electron:build:linux
```

Génère:
- AppImage (.AppImage)
- DEB (.deb)
- RPM (.rpm)

### Build pour toutes les plateformes

```bash
npm run electron:build
```

**Note**: Certaines plateformes ne peuvent être buildées que sur leur OS natif (ex: macOS sur Mac uniquement).

## 🔄 Auto-Updater

L'auto-updater est automatiquement activé en production.

### Configuration GitHub Releases

1. Créer un repository GitHub pour l'application
2. Configurer dans `package.json`:

```json
"build": {
  "publish": {
    "provider": "github",
    "owner": "votre-username",
    "repo": "sghi-desktop",
    "releaseType": "release"
  }
}
```

3. Générer un token GitHub avec scope `repo`
4. Exporter le token:

```bash
export GH_TOKEN="votre-token-github"
```

5. Publier une release:

```bash
npm run electron:build -- --publish always
```

### Tester l'auto-updater

En développement, les mises à jour sont désactivées. Pour tester:

1. Build une version de production
2. Installer l'application
3. Incrémenter le numéro de version dans `package.json`
4. Publier une nouvelle release
5. L'application vérifiera automatiquement les mises à jour au démarrage

## 🎨 Personnalisation

### Changer l'icône de la fenêtre

Remplacer `public/icon.png` par votre icône (512x512 minimum).

### Personnaliser le menu

Modifier `electron/menu.js` pour ajouter/supprimer des entrées de menu.

### Personnaliser le tray

Modifier `electron/tray.js` pour changer les options du menu tray.

### Changer la taille de fenêtre par défaut

Modifier dans `electron/windows/main.window.js`:

```javascript
const mainWindow = new BrowserWindow({
  width: 1600,  // Votre largeur
  height: 1000, // Votre hauteur
  // ...
});
```

## 🔐 Sécurité

L'application suit les meilleures pratiques:

✅ **Context Isolation** - Activé
✅ **Node Integration** - Désactivé dans le renderer
✅ **Sandbox** - Activé
✅ **CSP** - Content Security Policy
✅ **Remote Module** - Désactivé

### Ajouter des IPC Handlers sécurisés

1. Ajouter le handler dans `electron/main.js`:

```javascript
ipcMain.handle('mon-operation', async (event, data) => {
  // Votre logique
  return result;
});
```

2. Exposer dans `electron/preload.js`:

```javascript
contextBridge.exposeInMainWorld('electronAPI', {
  monOperation: (data) => ipcRenderer.invoke('mon-operation', data),
});
```

3. Utiliser dans Vue:

```typescript
const result = await window.electronAPI.monOperation(data);
```

## 🐛 Débogage

### Logs Electron

Les logs sont affichés dans:
- **Développement**: Console du terminal
- **Production**:
  - Windows: `%APPDATA%\sghi-desktop\logs\`
  - macOS: `~/Library/Logs/sghi-desktop/`
  - Linux: `~/.config/sghi-desktop/logs/`

### Activer les DevTools en production

Modifier `electron/windows/main.window.js`:

```javascript
// Temporairement pour déboguer
if (isDevelopment || true) { // Forcer DevTools
  mainWindow.webContents.openDevTools();
}
```

## 📱 Features Desktop Natives

### Notifications système

```typescript
showNotification('Titre', 'Message');
```

### Ouvrir des liens externes

```typescript
openExternalLink('https://example.com');
```

### Contrôles de fenêtre

```typescript
minimizeWindow();
maximizeWindow();
closeWindow();
```

### Dialogs natifs

```typescript
const file = await selectFile();
const dir = await selectDirectory();
const savePath = await saveFile();
```

## ✅ Checklist avant Release

- [ ] Version incrémentée dans `package.json`
- [ ] Icône de l'application créée (512x512)
- [ ] Tests effectués sur la plateforme cible
- [ ] Auto-updater configuré (si applicable)
- [ ] License.txt créé
- [ ] README.md à jour
- [ ] Changelog créé
- [ ] Build de production testé
- [ ] Signature de code configurée (macOS/Windows)

## 🆘 Problèmes Courants

### L'application ne démarre pas

- Vérifier que le port 8080 est libre
- Vérifier les logs dans la console
- Essayer de supprimer `node_modules` et réinstaller

### Fenêtre blanche au démarrage

- Vérifier que Vue.js utilise le mode hash (`createWebHashHistory`)
- Vérifier le `publicPath` dans `vue.config.js`
- Vérifier les DevTools pour les erreurs

### Auto-updater ne fonctionne pas

- Vérifier que l'app est en mode production
- Vérifier la configuration `publish` dans `package.json`
- Vérifier le token GitHub
- Vérifier les logs d'update

## 📚 Ressources

- [Electron Documentation](https://www.electronjs.org/docs)
- [electron-builder Documentation](https://www.electron.build/)
- [Vue.js + Electron Guide](https://nklayman.github.io/vue-cli-plugin-electron-builder/)

## 🎓 Prochaines Étapes

1. Configurer le router Vue en mode hash
2. Créer l'icône de l'application
3. Tester en mode développement
4. Créer un build de test
5. Configurer l'auto-updater
6. Publier une première release
