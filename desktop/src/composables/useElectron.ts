import { ref, onMounted, onUnmounted } from 'vue';

/**
 * Composable pour utiliser les fonctionnalités Electron
 */
export function useElectron() {
  const isElectron = ref(false);
  const appVersion = ref('');
  const platform = ref({
    isWindows: false,
    isMac: false,
    isLinux: false,
    platform: '' as 'win32' | 'darwin' | 'linux',
  });

  onMounted(async () => {
    // Vérifier si on est dans Electron
    isElectron.value = !!(window.electronAPI && window.platform);

    if (isElectron.value) {
      // Récupérer les infos de la plateforme
      platform.value = { ...window.platform };

      // Récupérer la version de l'app
      try {
        appVersion.value = await window.electronAPI.getAppVersion();
      } catch (error) {
        console.error('Error getting app version:', error);
      }
    }
  });

  /**
   * Contrôles de fenêtre
   */
  const minimizeWindow = () => {
    if (isElectron.value) {
      window.electronAPI.minimizeWindow();
    }
  };

  const maximizeWindow = () => {
    if (isElectron.value) {
      window.electronAPI.maximizeWindow();
    }
  };

  const closeWindow = () => {
    if (isElectron.value) {
      window.electronAPI.closeWindow();
    }
  };

  /**
   * Sélectionner un fichier
   */
  const selectFile = async (options?: {
    filters?: Array<{ name: string; extensions: string[] }>;
  }) => {
    if (!isElectron.value) return null;

    try {
      return await window.electronAPI.selectFile(options);
    } catch (error) {
      console.error('Error selecting file:', error);
      return null;
    }
  };

  /**
   * Sélectionner un dossier
   */
  const selectDirectory = async () => {
    if (!isElectron.value) return null;

    try {
      return await window.electronAPI.selectDirectory();
    } catch (error) {
      console.error('Error selecting directory:', error);
      return null;
    }
  };

  /**
   * Enregistrer un fichier
   */
  const saveFile = async (options?: {
    defaultPath?: string;
    filters?: Array<{ name: string; extensions: string[] }>;
  }) => {
    if (!isElectron.value) return null;

    try {
      return await window.electronAPI.saveFile(options);
    } catch (error) {
      console.error('Error saving file:', error);
      return null;
    }
  };

  /**
   * Imprimer un document
   */
  const printDocument = async (html: string, options?: {
    landscape?: boolean;
    copies?: number;
  }) => {
    if (!isElectron.value) {
      // Fallback: utiliser window.print()
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();
      }
      return;
    }

    try {
      await window.electronAPI.printDocument({
        html,
        landscape: options?.landscape || false,
        copies: options?.copies || 1,
      });
    } catch (error) {
      console.error('Error printing document:', error);
      throw error;
    }
  };

  /**
   * Exporter en PDF
   */
  const printToPDF = async (html: string, options?: {
    landscape?: boolean;
    pageSize?: 'A4' | 'A5' | 'Letter';
  }) => {
    if (!isElectron.value) {
      console.warn('PDF export is only available in Electron');
      return null;
    }

    try {
      return await window.electronAPI.printToPDF({
        html,
        landscape: options?.landscape || false,
        pageSize: options?.pageSize || 'A4',
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw error;
    }
  };

  /**
   * Ouvrir un lien externe
   */
  const openExternalLink = (url: string) => {
    if (isElectron.value) {
      window.electronAPI.openExternalLink(url);
    } else {
      window.open(url, '_blank');
    }
  };

  /**
   * Afficher une notification système
   */
  const showNotification = (title: string, body: string, icon?: string) => {
    if (isElectron.value) {
      window.electronAPI.showNotification({ title, body, icon });
    } else if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(title, { body, icon });
        }
      });
    }
  };

  /**
   * Sauvegarder la base de données
   */
  const backupDatabase = async () => {
    if (!isElectron.value) {
      console.warn('Database backup is only available in Electron');
      return null;
    }

    try {
      return await window.electronAPI.backupDatabase();
    } catch (error) {
      console.error('Error backing up database:', error);
      throw error;
    }
  };

  /**
   * Écouter les événements de mise à jour
   */
  const onUpdateAvailable = (callback: (info: any) => void) => {
    if (isElectron.value) {
      window.electronAPI.on('update-available', callback);
    }
  };

  const onUpdateDownloaded = (callback: (info: any) => void) => {
    if (isElectron.value) {
      window.electronAPI.on('update-downloaded', callback);
    }
  };

  const onUpdateError = (callback: (error: string) => void) => {
    if (isElectron.value) {
      window.electronAPI.on('update-error', callback);
    }
  };

  return {
    // État
    isElectron,
    appVersion,
    platform,

    // Contrôles de fenêtre
    minimizeWindow,
    maximizeWindow,
    closeWindow,

    // Fichiers
    selectFile,
    selectDirectory,
    saveFile,

    // Impression
    printDocument,
    printToPDF,

    // Divers
    openExternalLink,
    showNotification,
    backupDatabase,

    // Événements
    onUpdateAvailable,
    onUpdateDownloaded,
    onUpdateError,
  };
}
