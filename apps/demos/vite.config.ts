import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

const root = fileURLToPath(new URL('.', import.meta.url));

// En GitHub Pages las demos viven en /noir-studio/demos/
const base = `${process.env.BASE_PATH ?? '/noir-studio'}/demos/`;

// Política de seguridad solo en producción (en desarrollo Vite necesita scripts propios)
const csp: Plugin = {
  name: 'noir-csp',
  apply: 'build',
  transformIndexHtml: (html) => html.replace(
    '<meta charset="UTF-8" />',
    `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-src 'none'; upgrade-insecure-requests" />\n    <meta name="referrer" content="strict-origin-when-cross-origin" />`,
  ),
};

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), csp],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        menu: resolve(root, 'noir-menu/index.html'),
        tienda: resolve(root, 'tienda/index.html'),
      },
    },
  },
});
