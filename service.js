var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Discord Statuser',
  description: 'Application build on NodeJS to keep discord status updated',
  script: 'C:\\Users\\neila\\Sync\\Basement Bot\\send.js',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ],
  wait: 2,
  grow: .5,
  maxRestarts: 6
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();