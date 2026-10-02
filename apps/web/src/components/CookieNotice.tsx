'use client';

import { useEffect, useState } from 'react';
import { BASE_PATH, GOATCOUNTER_CODE } from '@/lib/site';

const KEY = 'noir-aviso-cookies';

/** Aviso de cookies discreto: se muestra una vez y se cierra con "Entendido". */
export function CookieNotice() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try { setShow(!localStorage.getItem(KEY)); } catch { setShow(true); }
  }, []);
  if (!show) return null;

  const ok = () => {
    try { localStorage.setItem(KEY, '1'); } catch { /* sin almacenamiento */ }
    setShow(false);
  };

  return (
    <div className="cookie-notice" role="region" aria-label="Aviso de cookies">
      <p>
        <span aria-hidden="true">🍪</span> <strong>Sin cookies de rastreo ni publicidad.</strong> Solo recordamos
        preferencias en tu navegador{GOATCOUNTER_CODE ? ' y contamos visitas de forma anónima' : ''}.{' '}
        <a href={`${BASE_PATH}/cookies/`}>Más info</a>
      </p>
      <button type="button" className="btn btn--chrome btn--sm" onClick={ok}>Entendido</button>
    </div>
  );
}
