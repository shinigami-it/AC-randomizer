module.exports = {
  apps: [
    {
      name: 'ac-randomizer',
      script: 'npx',
      args: 'nodemon server.js',
      watch: ['server.js', 'protected', 'routes', 'views'],
      interpreter: 'node',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}