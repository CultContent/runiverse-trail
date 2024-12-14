module.exports = {
  apps: [
    {
      name: "next-app",
      script: "npm",
      args: "run start",
      cwd: "/var/www/runiverse.ai/html",
      env: {
        NODE_ENV: "production",
        PORT: 3010
      },
      instances: 1,
      exec_mode: "fork"
    }
  ]
};
