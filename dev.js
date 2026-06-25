const { spawn } = require('child_process');
const path = require('path');

console.log('\x1b[33m%s\x1b[0m', '==================================================');
console.log('\x1b[33m%s\x1b[0m', '      AURUM LIVE - DEV STACK STARTUPING...        ');
console.log('\x1b[33m%s\x1b[0m', '==================================================');

// Start Express Scraper Backend
console.log('\x1b[36m%s\x1b[0m', '-> Starting backend server on port 5000...');
const server = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'server'),
  shell: true,
  stdio: 'inherit'
});

// Start Vite React Frontend
console.log('\x1b[32m%s\x1b[0m', '-> Starting frontend dev server...');
const client = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  shell: true,
  stdio: 'inherit'
});

// Keep main thread alive and handle clean shutdown
process.on('SIGINT', () => {
  console.log('\n\x1b[31m%s\x1b[0m', 'Shutting down servers...');
  server.kill('SIGINT');
  client.kill('SIGINT');
  process.exit();
});
