module.exports = {
  apps: [
    {
      name: 'nathracker-staging',
      script: './node_modules/@react-router/serve/bin.js',
      args: './build/server/index.js',
      env: {
        NODE_ENV: 'staging',
        PORT: 3000,
      },
    },
    {
      name: 'nathracker',
      script: './node_modules/@react-router/serve/bin.js',
      args: './build/server/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
