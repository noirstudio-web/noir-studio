'use client';

import { useEffect, useState } from 'react';
import { asset, BASE_PATH, NAV_LINKS } from '@/lib/site';

/** Barra fija: blur al hacer scroll, menú móvil y enlace activo según la sección visible. */
export function Nav({ onHome = true }: { onHome?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const home = onHome ? '' : `${BASE_PATH}/`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Bloquea el scroll de fondo con el menú abierto; Esc y pantalla grande lo cierran
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const mq = window.matchMedia('(min-width: 901px)');
    const onMq = () => mq.matches && setOpen(false);
    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => { document.removeEventListener('keydown', onKey); mq.removeEventListener('change', onMq); };
  }, [open]);

  useEffect(() => {
    if (!onHome || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(`#${e.target.id}`); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    NAV_LINKS.forEach((l) => { const s = document.querySelector(l.href); if (s) io.observe(s); });
    return () => io.disconnect();
  }, [onHome]);

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`} id="nav">
      <div className="nav__inner container">
        <a className="nav__logo" href={onHome ? '#inicio' : `${BASE_PATH}/`} aria-label="Noir Studio, ir al inicio">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset('/assets/logo-navbar-para-fondo-oscuro.png')}
            srcSet={`${asset('/assets/logo-navbar-240.png')} 240w, ${asset('/assets/logo-navbar-para-fondo-oscuro.png')} 420w`}
            sizes="120px" width={420} height={123} alt="Noir Studio"
          />
        </a>

        <nav className="nav__menu" id="nav-menu" aria-label="Principal" onClick={(e) => { if ((e.target as HTMLElement).closest('a')) setOpen(false); }}>
          <ul className="nav__links">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={`${home}${l.href}`} className={active === l.href ? 'is-active' : undefined}>{l.label}</a>
              </li>
            ))}
          </ul>
          <a className="btn btn--chrome btn--sm nav__cta" href={`${home}#contacto`}>Cotizar proyecto</a>
        </nav>

        <button
          className="nav__toggle" type="button" aria-controls="nav-menu"
          aria-expanded={open} aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span />
        </button>
      </div>
    </header>
  );
}
