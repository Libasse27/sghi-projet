const { contextBridge, ipcRenderer } = require('electron');

// Exposer des APIs sécurisées au renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Navigation
  onNavigate: (callback) => ipcRenderer.on('navigate', callback),

  // Fenêtre
  onShowAbout: (callback) => ipcRenderer.on('show-about', callback),

  // Notifications
  sendNotification: (title, body) => {
    return new Notification(title, { body });
  },

  // Version de l'app
  getAppVersion: () => process.env.npm_package_version || '1.0.0',

  // Plateforme
  getPlatform: () => process.platform,
});
