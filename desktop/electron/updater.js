const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron');

function initializeUpdater(mainWindow) {
  // Configure auto-updater
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  // Update available
  autoUpdater.on('update-available', (info) => {
    mainWindow.webContents.send('update-available', info);

    dialog
      .showMessageBox(mainWindow, {
        type: 'info',
        title: 'Mise à jour disponible',
        message: `Une nouvelle version (${info.version}) est disponible.`,
        detail: 'Voulez-vous télécharger la mise à jour maintenant?',
        buttons: ['Télécharger', 'Plus tard'],
        defaultId: 0,
        cancelId: 1,
      })
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.downloadUpdate();
        }
      });
  });

  // Update not available
  autoUpdater.on('update-not-available', () => {
    mainWindow.webContents.send('update-not-available');
  });

  // Download progress
  autoUpdater.on('download-progress', (progress) => {
    mainWindow.webContents.send('download-progress', {
      percent: progress.percent,
      transferred: progress.transferred,
      total: progress.total,
    });

    mainWindow.setProgressBar(progress.percent / 100);
  });

  // Update downloaded
  autoUpdater.on('update-downloaded', (info) => {
    mainWindow.setProgressBar(-1);
    mainWindow.webContents.send('update-downloaded', info);

    dialog
      .showMessageBox(mainWindow, {
        type: 'info',
        title: 'Mise à jour téléchargée',
        message: 'La mise à jour a été téléchargée.',
        detail: 'L\'application va redémarrer pour installer la mise à jour.',
        buttons: ['Redémarrer', 'Plus tard'],
        defaultId: 0,
        cancelId: 1,
      })
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall(false, true);
        }
      });
  });

  // Error handling
  autoUpdater.on('error', (error) => {
    mainWindow.webContents.send('update-error', error.message);

    dialog.showMessageBox(mainWindow, {
      type: 'error',
      title: 'Erreur de mise à jour',
      message: 'Une erreur est survenue lors de la mise à jour',
      detail: error.message,
    });
  });

  // Check for updates on startup (after 5 seconds)
  setTimeout(() => {
    autoUpdater.checkForUpdates();
  }, 5000);

  return autoUpdater;
}

module.exports = { initializeUpdater };
