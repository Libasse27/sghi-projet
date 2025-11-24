const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

const isDevelopment = process.env.NODE_ENV !== 'production';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    title: 'SGHI - Système de Gestion Hospitalière',
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    backgroundColor: '#f0f2f5',
    show: false,
  });

  // Afficher la fenêtre une fois prête pour éviter le flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (isDevelopment) {
    // En développement, charger depuis le serveur Vite
    mainWindow.loadURL('http://localhost:5173');
    // Ouvrir les DevTools
    mainWindow.webContents.openDevTools();
  } else {
    // En production, charger le fichier HTML
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Créer le menu de l'application
  createMenu();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createMenu() {
  const template = [
    {
      label: 'Fichier',
      submenu: [
        {
          label: 'Nouveau patient',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('navigate', '/patients/create');
          },
        },
        { type: 'separator' },
        {
          label: 'Paramètres',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            mainWindow.webContents.send('navigate', '/settings');
          },
        },
        { type: 'separator' },
        {
          label: 'Quitter',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Édition',
      submenu: [
        { role: 'undo', label: 'Annuler' },
        { role: 'redo', label: 'Refaire' },
        { type: 'separator' },
        { role: 'cut', label: 'Couper' },
        { role: 'copy', label: 'Copier' },
        { role: 'paste', label: 'Coller' },
        { role: 'selectAll', label: 'Tout sélectionner' },
      ],
    },
    {
      label: 'Affichage',
      submenu: [
        { role: 'reload', label: 'Actualiser' },
        { role: 'forceReload', label: 'Forcer l\'actualisation' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Zoom par défaut' },
        { role: 'zoomIn', label: 'Zoomer' },
        { role: 'zoomOut', label: 'Dézoomer' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Plein écran' },
      ],
    },
    {
      label: 'Aide',
      submenu: [
        {
          label: 'Documentation',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://sghi.com/docs');
          },
        },
        { type: 'separator' },
        {
          label: 'À propos',
          click: () => {
            mainWindow.webContents.send('show-about');
          },
        },
      ],
    },
  ];

  // Ajouter le menu développeur en mode développement
  if (isDevelopment) {
    template.push({
      label: 'Développeur',
      submenu: [
        { role: 'toggleDevTools', label: 'Outils de développement' },
      ],
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Événement ready
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quitter l'application quand toutes les fenêtres sont fermées (sauf sur macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Gérer les erreurs non capturées
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});
