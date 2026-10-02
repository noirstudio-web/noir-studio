import type { NextConfig } from 'next';

// En GitHub Pages la web vive en /noir-studio. Con dominio propio, deja BASE_PATH vacío.
const basePath = process.env.BASE_PATH ?? '/noir-studio';

const nextConfig: NextConfig = {
  output: 'export',          // genera HTML estático (sirve en GitHub Pages)
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  poweredByHeader: false,
};

export default nextConfig;
