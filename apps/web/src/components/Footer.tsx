'use client';

import { useEffect, useState } from 'react';
import { asset, BASE_PATH, DISCORD_URL, NAV_LINKS } from '@/lib/site';
import { WhatsAppIcon } from './Icon';
import { WaLink } from './WaLink';

export function Footer({ onHome = true }: { onHome?: boolean }) {
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);
  const home = onHome ? '' : `${BASE_PATH}/`;

  return (
    <>
      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset('/assets/noir-wordmark-blanco.png')}
              srcSet={`${asset('/assets/noir-wordmark-440.png')} 440w, ${asset('/assets/noir-wordmark-blanco.png')} 640w`}
              sizes="(max-width: 900px) 160px, 220px" width={640} height={178} alt="Noir" loading="lazy" />
            <p className="footer__motto">Ideas <span>/</span> Código <span>/</span> Resultados</p>
            <p className="footer__slogan">Código que construye tu visión.</p>
          </div>
          <nav className="footer__nav" aria-label="Pie de página">
            {NAV_LINKS.map((l) => <a key={l.href} href={`${home}${l.href}`}>{l.label}</a>)}
          </nav>
          <div className="footer__contact">
            <WaLink wa="cotizar">WhatsApp</WaLink>
            <a href={DISCORD_URL} target="_blank" rel="noopener">Discord</a>
          </div>
        </div>
        <div className="container footer__bottom">
          <p>© {year} Noir Studio. Todos los derechos reservados.</p>
          <p className="footer__legal">
            <a href={`${BASE_PATH}/terminos/`}>Términos y condiciones</a> · <a href={`${BASE_PATH}/terminos/#privacidad`}>Privacidad</a>
          </p>
        </div>
      </footer>

      <WaLink wa="flotante" className="wa-float" aria-label="Escríbeme por WhatsApp"><WhatsAppIcon /></WaLink>
    </>
  );
}
