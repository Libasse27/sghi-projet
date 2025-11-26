const { Tray, Menu, nativeImage } = require('electron');
const path = require('path');

function initializeTray(mainWindow) {
  const iconPath = path.join(__dirname, '../public/icon.png');
  const trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });

  const tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Ouvrir SGHI',
      click: () => {
        mainWindow.show();
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
      },
    },
    { type: 'separator' },
    {
      label: 'Tableau de bord',
      click: () => {
        mainWindow.show();
        mainWindow.webContents.send('navigate', '/dashboard');
      },
    },
    {
      label: 'Patients',
      click: () => {
        mainWindow.show();
        mainWindow.webContents.send('navigate', '/patients');
      },
    },
    {
      label: 'Consultations',
      click: () => {
        mainWindow.show();
        mainWindow.webContents.send('navigate', '/consultations');
      },
    },
    {
      label: 'Urgences',
      click: () => {
        mainWindow.show();
        mainWindow.webContents.send('navigate', '/emergency');
      },
    },
    { type: 'separator' },
    {
      label: 'Paramètres',
      click: () => {
        mainWindow.show();
        mainWindow.webContents.send('navigate', '/settings');
      },
    },
    { type: 'separator' },
    {
      label: 'Quitter',
      click: () => {
        mainWindow.destroy();
        require('electron').app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('SGHI - Système de Gestion Hospitalière');

  // Click on tray icon
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  // Double click on tray icon
  tray.on('double-click', () => {
    mainWindow.show();
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });

  return tray;
}

module.exports = { initializeTray };
