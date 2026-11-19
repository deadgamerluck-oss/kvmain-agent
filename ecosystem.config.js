module.exports = {
  apps: [
    {
      name: 'ai-counsellor-api',
      cwd: './server',
      script: 'dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      }
    }
  ]
};
