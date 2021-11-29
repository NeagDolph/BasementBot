module.exports = {
  apps : [{
    name: "basementbot",
    detached: true,
    no_daemon: true,
    script: 'bot.js',
    out_file: 'logs/out.log',
    log_file: 'logs/combined.log',
    exec_mode : "fork",
    watch: '.',
    watch_delay: 1000,
    ignore_watch: [
      "node_modules",
      "logs"
    ],
    env_production: {
      NODE_ENV: "production",
    }
  }],
};
