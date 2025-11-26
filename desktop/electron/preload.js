const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use ipcRenderer
contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),

  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppPath: (name) => ipcRenderer.invoke('get-app-path', name),

  // File system
  selectFile: (options) => ipcRenderer.invoke('select-file', options),
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  saveFile: (options) => ipcRenderer.invoke('save-file', options),

  // Print
  printDocument: (options) => ipcRenderer.invoke('print-document', options),
  printToPDF: (options) => ipcRenderer.invoke('print-to-pdf', options),

  // External links
  openExternalLink: (url) => ipcRenderer.send('open-external-link', url),

  // Notifications
  showNotification: (options) => ipcRenderer.send('show-notification', options),

  // Database
  backupDatabase: () => ipcRenderer.invoke('backup-database'),

  // Event listeners
  on: (channel, callback) => {
    const validChannels = ['update-available', 'update-downloaded', 'update-error'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },

  removeListener: (channel, callback) => {
    ipcRenderer.removeListener(channel, callback);
  },
});

// Platform information
contextBridge.exposeInMainWorld('platform', {
  isWindows: process.platform === 'win32',
  isMac: process.platform === 'darwin',
  isLinux: process.platform === 'linux',
  platform: process.platform,
});
