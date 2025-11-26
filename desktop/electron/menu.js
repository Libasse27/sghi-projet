const { Menu, shell } = require('electron');

function initializeMenu(mainWindow) {
  const isMac = process.platform === 'darwin';

  const template = [
    // App menu (macOS only)
    ...(isMac
      ? [
          {
            label: 'SGHI',
            submenu: [
              { label: 'À propos de SGHI', role: 'about' },
              { type: 'separator' },
              { label: 'Préférences...', accelerator: 'Cmd+,', click: () => mainWindow.webContents.send('open-settings') },
              { type: 'separator' },
              { label: 'Masquer SGHI', role: 'hide' },
              { label: 'Masquer les autres', role: 'hideOthers' },
              { label: 'Tout afficher', role: 'unhide' },
              { type: 'separator' },
              { label: 'Quitter SGHI', role: 'quit' },
            ],
          },
        ]
      : []),

    // File menu
    {
      label: 'Fichier',
      submenu: [
        {
          label: 'Nouveau Patient',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow.webContents.send('navigate', '/patients/create'),
        },
        {
          label: 'Nouvelle Consultation',
          accelerator: 'CmdOrCtrl+Shift+N',
          click: () => mainWindow.webContents.send('navigate', '/consultations/create'),
        },
        { type: 'separator' },
        {
          label: 'Importer...',
          accelerator: 'CmdOrCtrl+I',
          click: () => mainWindow.webContents.send('import-data'),
        },
        {
          label: 'Exporter...',
          accelerator: 'CmdOrCtrl+E',
          click: () => mainWindow.webContents.send('export-data'),
        },
        { type: 'separator' },
        {
          label: 'Sauvegarder la base de données',
          click: () => mainWindow.webContents.send('backup-database'),
        },
        { type: 'separator' },
        {
          label: 'Imprimer',
          accelerator: 'CmdOrCtrl+P',
          click: () => mainWindow.webContents.send('print'),
        },
        { type: 'separator' },
        isMac ? { label: 'Fermer la fenêtre', role: 'close' } : { label: 'Quitter', role: 'quit' },
      ],
    },

    // Edit menu
    {
      label: 'Édition',
      submenu: [
        { label: 'Annuler', role: 'undo' },
        { label: 'Refaire', role: 'redo' },
        { type: 'separator' },
        { label: 'Couper', role: 'cut' },
        { label: 'Copier', role: 'copy' },
        { label: 'Coller', role: 'paste' },
        ...(isMac
          ? [
              { label: 'Supprimer', role: 'delete' },
              { label: 'Tout sélectionner', role: 'selectAll' },
            ]
          : [
              { label: 'Supprimer', role: 'delete' },
              { type: 'separator' },
              { label: 'Tout sélectionner', role: 'selectAll' },
            ]),
      ],
    },

    // View menu
    {
      label: 'Affichage',
      submenu: [
        {
          label: 'Tableau de bord',
          accelerator: 'CmdOrCtrl+D',
          click: () => mainWindow.webContents.send('navigate', '/dashboard'),
        },
        {
          label: 'Patients',
          accelerator: 'CmdOrCtrl+1',
          click: () => mainWindow.webContents.send('navigate', '/patients'),
        },
        {
          label: 'Consultations',
          accelerator: 'CmdOrCtrl+2',
          click: () => mainWindow.webContents.send('navigate', '/consultations'),
        },
        {
          label: 'Urgences',
          accelerator: 'CmdOrCtrl+3',
          click: () => mainWindow.webContents.send('navigate', '/emergency'),
        },
        { type: 'separator' },
        { label: 'Recharger', role: 'reload' },
        { label: 'Forcer le rechargement', role: 'forceReload' },
        { label: 'Outils de développement', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Plein écran', role: 'togglefullscreen' },
        { label: 'Zoom avant', role: 'zoomIn' },
        { label: 'Zoom arrière', role: 'zoomOut' },
        { label: 'Réinitialiser le zoom', role: 'resetZoom' },
      ],
    },

    // Navigate menu
    {
      label: 'Navigation',
      submenu: [
        {
          label: 'Retour',
          accelerator: 'Alt+Left',
          click: () => mainWindow.webContents.goBack(),
        },
        {
          label: 'Suivant',
          accelerator: 'Alt+Right',
          click: () => mainWindow.webContents.goForward(),
        },
        { type: 'separator' },
        {
          label: 'Rechercher...',
          accelerator: 'CmdOrCtrl+F',
          click: () => mainWindow.webContents.send('open-search'),
        },
      ],
    },

    // Help menu
    {
      label: 'Aide',
      submenu: [
        {
          label: 'Documentation',
          click: () => shell.openExternal('https://sghi-docs.example.com'),
        },
        {
          label: 'Raccourcis clavier',
          click: () => mainWindow.webContents.send('show-shortcuts'),
        },
        { type: 'separator' },
        {
          label: 'Signaler un problème',
          click: () => shell.openExternal('https://github.com/sghi/issues'),
        },
        { type: 'separator' },
        {
          label: 'Vérifier les mises à jour',
          click: () => mainWindow.webContents.send('check-updates'),
        },
        ...(!isMac
          ? [
              { type: 'separator' },
              {
                label: 'À propos',
                click: () => mainWindow.webContents.send('show-about'),
              },
            ]
          : []),
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  return menu;
}

module.exports = { initializeMenu };
