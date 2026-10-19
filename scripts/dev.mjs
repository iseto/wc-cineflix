import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { spawn } from 'node:child_process';
import movies from '../api/movies.mjs';
const root = resolve('www');
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};
const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost');
  if (url.pathname === '/api/movies') return movies(request, response);
  let path;
  try {
    path = resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
  } catch {
    response.writeHead(400).end();
    return;
  }
  if (!path.startsWith(root + sep)) {
    response.writeHead(403).end();
    return;
  }
  try {
    response.setHeader('Content-Type', types[extname(path)] || 'application/octet-stream');
    response.end(await readFile(path));
  } catch {
    response.writeHead(404).end('Not found. The first build may still be running.');
  }
});
const compiler = spawn(process.execPath, ['node_modules/@stencil/core/bin/stencil', 'build', '--dev', '--watch'], { stdio: 'inherit' });
server.on('error', error => {
  console.error(error.message);
  compiler.kill();
  process.exitCode = 1;
});
server.listen(Number(process.env.PORT) || 3333, '127.0.0.1', () => console.log('Cineflix: http://localhost:3333 (including /api/movies)'));
for (const signal of ['SIGINT', 'SIGTERM'])
  process.on(signal, () => {
    compiler.kill(signal);
    server.close();
  });
compiler.on('exit', code => {
  server.close();
  process.exitCode = code || 0;
});
