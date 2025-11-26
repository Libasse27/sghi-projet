// Type definitions for Electron API exposed via preload script

export interface ElectronAPI {
  // Window controls
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;

  // App info
  getAppVersion: () => Promise<string>;
  getAppPath: (name: 'home' | 'appData' | 'userData' | 'temp' | 'desktop' | 'documents' | 'downloads') => Promise<string>;

  // File system operations
  selectFile: (options?: {
    filters?: Array<{ name: string; extensions: string[] }>;
  }) => Promise<string | undefined>;
  selectDirectory: () => Promise<string | undefined>;
  saveFile: (options?: {
    defaultPath?: string;
    filters?: Array<{ name: string; extensions: string[] }>;
  }) => Promise<string | undefined>;

  // Print operations
  printDocument: (options: {
    html: string;
    landscape?: boolean;
    copies?: number;
  }) => Promise<void>;
  printToPDF: (options: {
    html: string;
    landscape?: boolean;
    pageSize?: 'A4' | 'A5' | 'Letter';
  }) => Promise<string | null>;

  // External links
  openExternalLink: (url: string) => void;

  // Notifications
  showNotification: (options: {
    title: string;
    body: string;
    icon?: string;
  }) => void;

  // Database
  backupDatabase: () => Promise<string | null>;

  // Event listeners
  on: (channel: 'update-available' | 'update-downloaded' | 'update-error', callback: (...args: any[]) => void) => void;
  removeListener: (channel: string, callback: (...args: any[]) => void) => void;
}

export interface Platform {
  isWindows: boolean;
  isMac: boolean;
  isLinux: boolean;
  platform: 'win32' | 'darwin' | 'linux';
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
    platform: Platform;
  }
}

export {};
