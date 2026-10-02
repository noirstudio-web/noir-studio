import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Manrope, Michroma } from 'next/font/google';
import { asset, SITE_URL } from '@/lib/site';
import './globals.css';

// Tipografías servidas desde la propia web (sin peticiones a Google al visitar)
const michroma = Michroma({ weight: '400', subsets: ['latin'], variable: '--font-michroma', display: 'swap' });
const manrope = Manrope({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-manrope', display: 'swap' });
const jetbrains = JetBrains_Mono({ weight: ['400', '500'], subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: 'Noir Studio · Desarrollo web a medida — Código que construye tu visión',
  description: 'Noir Studio diseña y programa páginas web, landing pages, tiendas online y apps a medida. Sin plantillas, rápidas, listas para Google. Cotiza tu proyecto por WhatsApp.',
  authors: [{ name: 'Noir Studio' }],
  alternates: { canonical: './' },
  openGraph: {
    type: 'website', locale: 'es_CO', siteName: 'Noir Studio', url: './',
    title: 'Noir Studio — Código que construye tu visión',
    description: 'Páginas web, tiendas online y apps a medida. Ideas / Código / Resultados.',
    images: [{ url: 'assets/og-image.png', width: 1200, height: 630, alt: 'Logotipo de Noir Studio sobre fondo negro' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Noir Studio — Código que construye tu visión',
    description: 'Páginas web, tiendas online y apps a medida.',
    images: ['assets/og-image.png'],
  },
  icons: {
    icon: [
      { url: asset('/favicon.ico'), sizes: '48x48' },
      { url: asset('/favicon-32x32.png'), type: 'image/png', sizes: '32x32' },
      { url: asset('/favicon-16x16.png'), type: 'image/png', sizes: '16x16' },
    ],
    apple: asset('/apple-touch-icon.png'),
  },
  manifest: asset('/site.webmanifest'),
  referrer: 'strict-origin-when-cross-origin',
};

export const viewport: Viewport = { themeColor: '#07070A', colorScheme: 'dark' };

// Se ejecuta antes de pintar: activa las animaciones y bloquea que otra web muestre esta dentro de un marco.
// (Su hash se agrega solo a la política de seguridad en scripts/csp.mjs)
const BOOT = "document.documentElement.classList.add('js');if(window.top!==window.self){document.documentElement.style.display='none';try{window.top.location.replace(window.self.location.href)}catch(e){}}";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${michroma.variable} ${manrope.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body>
        <a className="skip-link" href="#inicio">Saltar al contenido</a>
        {children}
      </body>
    </html>
  );
}
