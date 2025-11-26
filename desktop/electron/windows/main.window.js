const { BrowserWindow } = require('electron');
const path = require('path');

function createMainWindow(isDevelopment) {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    show: false,
    backgroundColor: '#ffffff',
    icon: path.join(__dirname, '../../public/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, '../preload.js'),
    },
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#2563eb',
      symbolColor: '#ffffff',
      height: 40,
    },
  });

  // Load the app
  if (isDevelopment) {
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Handle window close
  mainWindow.on('close', (event) => {
    if (!mainWindow.forceClose) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // Window state management
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window-maximized');
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window-unmaximized');
  });

  mainWindow.on('enter-full-screen', () => {
    mainWindow.webContents.send('window-enter-fullscreen');
  });

  mainWindow.on('leave-full-screen', () => {
    mainWindow.webContents.send('window-leave-fullscreen');
  });

  // Handle navigation
  mainWindow.webContents.on('will-navigate', (event, url) => {
    // Prevent navigation to external URLs
    if (!url.startsWith('http://localhost') && !url.startsWith('file://')) {
      event.preventDefault();
    }
  });

  // Handle new windows
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Open external links in default browser
    if (url.startsWith('http://') || url.startsWith('https://')) {
      require('electron').shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  return mainWindow;
}

module.exports = { createMainWindow };
