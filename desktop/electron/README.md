# SGHI Desktop - Electron Architecture

Architecture complète de l'application desktop SGHI utilisant Electron.

## 📁 Structure

```
electron/
├── main.js                 # Process principal Electron
├── preload.js             # Script de préchargement (contextBridge)
├── menu.js                # Menu de l'application
├── updater.js             # Auto-updater (electron-updater)
├── tray.js                # System tray
└── windows/
    ├── main.window.js     # Fenêtre principale
    └── print.window.js    # Fenêtre d'impression
```

## 🚀 Fichiers Créés

### main.js
Process principal Electron qui gère:
- Création des fenêtres
- Single instance lock
- IPC handlers (communication avec le renderer)
- Gestion des événements système
- Handlers d'impression et PDF
- Opérations fichiers
- Notifications système

**IPC Channels disponibles:**
- `minimize-window` - Minimiser la fenêtre
- `maximize-window` - Maximiser/Restaurer la fenêtre
- `close-window` - Fermer la fenêtre
- `print-document` - Imprimer un document
- `print-to-pdf` - Exporter en PDF
- `select-file` - Sélectionner un fichier
- `select-directory` - Sélectionner un dossier
- `save-file` - Enregistrer un fichier
- `open-external-link` - Ouvrir un lien externe
- `show-notification` - Afficher une notification système
- `get-app-version` - Obtenir la version de l'app
- `backup-database` - Sauvegarder la base de données

### preload.js
Expose les APIs Electron au renderer de manière sécurisée via `contextBridge`.

**APIs exposées:**
- Window controls (minimize, maximize, close)
- App info (version, paths)
- File system (select, save)
- Print (document, PDF)
- External links
- Notifications
- Database backup
- Event listeners

**Platform info:**
- `isWindows`, `isMac`, `isLinux`
- `platform` (win32, darwin, linux)

### menu.js
Menu de l'application avec raccourcis clavier.

**Raccourcis clavier:**
- `Cmd/Ctrl+N` - Nouveau patient
- `Cmd/Ctrl+Shift+N` - Nouvelle consultation
- `Cmd/Ctrl+P` - Imprimer
- `Cmd/Ctrl+D` - Tableau de bord
- `Cmd/Ctrl+1/2/3` - Navigation rapide
- `Cmd/Ctrl+F` - Rechercher
- `Alt+Left/Right` - Navigation historique

### updater.js
Auto-updater utilisant `electron-updater`.

**Events:**
- `update-available` - Mise à jour disponible
- `download-progress` - Progression du téléchargement
- `update-downloaded` - Mise à jour téléchargée
- `update-error` - Erreur de mise à jour

### tray.js
Icône dans la barre système (tray).

**Interactions:**
- Clic simple: Afficher/Masquer
- Double-clic: Afficher et focus
- Clic droit: Menu contextuel

### windows/main.window.js
Fenêtre principale de l'application.

**Configuration:**
- Taille: 1400x900 (min: 1024x768)
- Title bar personnalisée (hidden)
- Context isolation activé
- Sandbox mode activé
- Preload script

### windows/print.window.js
Fenêtre d'impression invisible avec template HTML professionnel.

## 🔧 Configuration package.json

```json
{
  "main": "electron/main.js",
  "scripts": {
    "electron:dev": "concurrently \"npm run serve\" \"wait-on http://localhost:8080 && electron .\"",
    "electron:build": "npm run build && electron-builder",
    "electron:build:win": "npm run build && electron-builder --win"
  },
  "build": {
    "appId": "com.sghi.desktop",
    "productName": "SGHI",
    "directories": {
      "output": "dist_electron"
    },
    "files": ["dist/**/*", "electron/**/*", "public/icon.png"],
    "win": {
      "target": ["nsis", "portable"],
      "icon": "public/icon.png"
    }
  }
}
```

## 📦 Dépendances

```bash
npm install --save-dev electron electron-builder electron-updater concurrently wait-on
```

## 🚀 Utilisation

### Développement
```bash
npm run electron:dev
```

### Build Production
```bash
npm run electron:build:win
```

## 🔐 Sécurité

✅ Context Isolation activée
✅ Sandbox Mode activé
✅ No Node Integration
✅ Preload Script sécurisé
✅ External Links ouverture externe

## 📱 Fonctionnalités Desktop

- ✅ Fenêtre native avec title bar personnalisée
- ✅ Menu natif avec raccourcis clavier
- ✅ System tray avec menu contextuel
- ✅ Notifications système natives
- ✅ Impression native et export PDF
- ✅ Auto-updater avec progression
- ✅ Dialogs natifs (fichiers, sauvegarde)
- ✅ Single instance lock
- ✅ Minimiser vers le tray
- ✅ Gestion des états de fenêtre

## 🌐 Utilisation dans Vue

```javascript
// Dans un composant Vue
const print = async () => {
  await window.electronAPI.printDocument({
    html: content.value,
    landscape: false
  });
};

const notify = () => {
  window.electronAPI.showNotification({
    title: 'Nouveau patient',
    body: 'Patient créé avec succès'
  });
};
```

## 🎯 Prochaines Étapes

1. Créer `public/icon.png` (icône de l'application)
2. Mettre à jour `package.json` avec la configuration build
3. Configurer le router Vue pour mode hash (#/)
4. Implémenter les stores Pinia pour communication IPC
5. Tester sur toutes les plateformes
