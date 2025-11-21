// server/minimal.js - minimal HTTP server to verify binding
import http from 'http';

const PORT = 4242;
const HOST = '127.0.0.1';

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('ok');
  }
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('hello');
});

server.on('error', (err) => {
  console.error('[minimal] server error:', err);
});

server.listen(PORT, HOST, () => {
  const addr = server.address();
  console.log('[minimal] listening on', addr);
});
