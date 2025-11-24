const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

// Get the default config
const defaultConfig = getDefaultConfig(__dirname);

// Custom configuration to override deprecated options
const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'],
  },
};

// Merge and remove deprecated options
const mergedConfig = mergeConfig(defaultConfig, config);

// Explicitly remove deprecated options that cause warnings
delete mergedConfig.server?.forwardClientLogs;
delete mergedConfig.watcher?.unstable_workerThreads;

module.exports = mergedConfig;
