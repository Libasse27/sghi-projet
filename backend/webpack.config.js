module.exports = function (options, webpack) {
  return {
    ...options,
    externals: {
      // Exclure les modules natifs et leurs dépendances
      'bcrypt': 'commonjs bcrypt',
      '@mapbox/node-pre-gyp': 'commonjs @mapbox/node-pre-gyp',
      'mock-aws-s3': 'commonjs mock-aws-s3',
      'aws-sdk': 'commonjs aws-sdk',
      'nock': 'commonjs nock',
      // Autres modules natifs
      'sqlite3': 'commonjs sqlite3',
      'pg-native': 'commonjs pg-native',
      'redis': 'commonjs redis',
      // Modules pg
      'pg': 'commonjs pg',
      'pg-query-stream': 'commonjs pg-query-stream',
    },
    node: {
      __dirname: false,
      __filename: false,
    },
    module: {
      rules: [
        ...options.module.rules,
        {
          test: /\.html$/,
          use: 'ignore-loader',
        },
      ],
    },
    resolve: {
      ...options.resolve,
      fallback: {
        ...options.resolve?.fallback,
        'mock-aws-s3': false,
        'aws-sdk': false,
        'nock': false,
      },
    },
  };
};
