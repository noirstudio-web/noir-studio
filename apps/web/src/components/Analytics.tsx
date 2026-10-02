'use client';

import { useEffect } from 'react';
import { GOATCOUNTER_CODE } from '@/lib/site';

/**
 * Analítica sin cookies (GoatCounter). Solo se activa si GOATCOUNTER_CODE tiene valor en site.ts.
 * Registra páginas vistas de forma anónima y agregada; no identifica a nadie.
 */
export function Analytics() {
  useEffect(() => {
    if (!GOATCOUNTER_CODE || document.querySelector('script[data-goatcounter]')) return;
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://gc.zgo.at/count.js';
    s.dataset.goatcounter = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
    document.body.append(s);
  }, []);
  return null;
}
