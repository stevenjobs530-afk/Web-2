// Local preview of dist/ (clean URLs like Vercel). `npm run dev`, then open http://localhost:4321
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain' };
const port = Number(process.env.PORT) || 4321;

createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  let file = join(dist, path);
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { 'Content-Type': types['.html'] });
    res.end(await readFile(join(dist, '404.html')));
  }
}).listen(port, () => console.log(`http://localhost:${port}`));
