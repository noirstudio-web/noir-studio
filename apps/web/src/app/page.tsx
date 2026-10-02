import { preload } from 'react-dom';
import { Contact } from '@/components/Contact';
import { Effects } from '@/components/Effects';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Nav } from '@/components/Nav';
import { Process } from '@/components/Process';
import { Faq, Marquee, Perks, Projects, Services } from '@/components/Sections';
import { asset, DISCORD_URL, FAQ, SITE_URL } from '@/lib/site';

const business = {
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#negocio`,
  name: 'Noir Studio',
  slogan: 'Código que construye tu visión',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/icon-512.png`,
  image: `${SITE_URL}/assets/og-image.png`,
  description: 'Estudio de desarrollo web a medida: páginas web, landing pages, tiendas online, apps y sistemas.',
  areaServed: 'Worldwide',
  address: { '@type': 'PostalAddress', addressCountry: 'CO' },
  sameAs: [DISCORD_URL],
  knowsLanguage: 'es',
  priceRange: '$$',
  makesOffer: ['Páginas web', 'Landing pages', 'Tiendas online', 'Apps', 'Sistemas a medida', 'Branding']
    .map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
};
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    business,
    { '@type': 'WebSite', '@id': `${SITE_URL}/#web`, url: `${SITE_URL}/`, name: 'Noir Studio', inLanguage: 'es', publisher: { '@id': `${SITE_URL}/#negocio` } },
    { '@type': 'FAQPage', mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ],
};

export default function Home() {
  // El monograma es lo más grande de la primera pantalla: se descarga primero
  preload(asset('/assets/noir-monograma.webp'), {
    as: 'image', fetchPriority: 'high', type: 'image/webp',
    imageSrcSet: `${asset('/assets/noir-monograma-320.webp')} 320w, ${asset('/assets/noir-monograma-480.webp')} 480w, ${asset('/assets/noir-monograma.webp')} 634w`,
    imageSizes: '(max-width: 900px) 40vw, 240px',
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Effects />
      <Nav />
      <main id="inicio" tabIndex={-1}>
        <Hero />
        <Marquee />
        <Services />
        <Projects />
        <Process />
        <Perks />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
