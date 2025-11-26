const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { createMainWindow } = require('./windows/main.window');
const { createPrintWindow } = require('./windows/print.window');
const { initializeMenu } = require('./menu');
const { initializeUpdater } = require('./updater');
const { initializeTray } = require('./tray');

const isDevelopment = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

let mainWindow = null;
let printWindow = null;
let tray = null;

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    mainWindow = createMainWindow(isDevelopment);
    initializeMenu(mainWindow);
    tray = initializeTray(mainWindow);
    if (!isDevelopment) initializeUpdater(mainWindow);

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        mainWindow = createMainWindow(isDevelopment);
      }
    });
  });
}

app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});

app.on('before-quit', () => {
  if (tray) tray.destroy();
});

// IPC Handlers
ipcMain.on('minimize-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) window.minimize();
});

ipcMain.on('maximize-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    window.isMaximized() ? window.unmaximize() : window.maximize();
  }
});

ipcMain.on('close-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) window.close();
});

ipcMain.handle('get-app-version', () => app.getVersion());

ipcMain.on('show-notification', (event, options) => {
  const { Notification } = require('electron');
  if (Notification.isSupported()) {
    const notification = new Notification({
      title: options.title,
      body: options.body,
      icon: options.icon,
    });
    notification.on('click', () => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
      }
    });
    notification.show();
  }
});

module.exports = { getMainWindow: () => mainWindow };
