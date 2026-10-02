// Agrega una política de seguridad (Content-Security-Policy) a cada página exportada.
// Next.js escribe pequeños <script> dentro del HTML; aquí se calcula el hash de cada uno
// para permitir SOLO esos scripts exactos. Cualquier código inyectado queda bloqueado.
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('../out/', import.meta.url));

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(p);
    else if (entry.name.endsWith('.html')) yield p;
  }
}

const sha = (text) => `'sha256-${createHash('sha256').update(text, 'utf8').digest('base64')}'`;

let pages = 0;
for await (const file of htmlFiles(OUT)) {
  let html = await readFile(file, 'utf8');
  html = html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/, '');

  const hashes = new Set();
  for (const [, attrs, body] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/\bsrc=/.test(attrs) || /type="application\/(ld\+)?json"/.test(attrs)) continue;
    hashes.add(sha(body));
  }

  const csp = [
    "default-src 'self'",
    `script-src 'self' ${[...hashes].join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data:",
    "connect-src 'self' https://open.er-api.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-src 'none'",
    "worker-src 'none'",
    "manifest-src 'self'",
    'upgrade-insecure-requests',
  ].join('; ');

  const meta = `<meta http-equiv="Content-Security-Policy" content="${csp}"/>`;
  const charset = /<meta charSet="utf-8"\s*\/?>/i;
  if (!charset.test(html)) throw new Error(`Sin <meta charset> en ${file}`);
  html = html.replace(charset, (m) => `${m}${meta}`);
  await writeFile(file, html);
  pages++;
}
console.log(`✓ Política de seguridad agregada a ${pages} páginas`);
