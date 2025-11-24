module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@screens': './src/screens',
          '@components': './src/components',
          '@navigation': './src/navigation',
          '@store': './src/store',
          '@services': './src/services',
          '@utils': './src/utils',
          '@assets': './src/assets',
          '@styles': './src/styles',
          '@types': './src/types',
          '@shared': '../shared',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
