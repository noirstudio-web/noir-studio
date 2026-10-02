// Une la web (Next.js → apps/web/out) y las demos (Vite → apps/demos/dist) en una sola carpeta: _site/
import { cp, rm } from 'node:fs/promises';

const site = new URL('../_site/', import.meta.url);
await rm(site, { recursive: true, force: true });
await cp(new URL('../apps/web/out/', import.meta.url), site, { recursive: true });
await cp(new URL('../apps/demos/dist/', import.meta.url), new URL('demos/', site), { recursive: true });
console.log('✓ Sitio listo en _site/ (web + demos)');
