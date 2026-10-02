'use client';

import { useEffect, useState } from 'react';
import type { WaKey } from '@/lib/site';
import { formatPhone, waLinkFor } from '@/lib/whatsapp';

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { wa: WaKey; fallback?: string };

/**
 * Enlace a WhatsApp con mensaje listo. En el HTML estático apunta a #contacto;
 * el número real se arma en el navegador, así los robots que leen el código no lo ven.
 */
export function WaLink({ wa, fallback = '#contacto', children, ...rest }: Props) {
  const [href, setHref] = useState(fallback);
  useEffect(() => setHref(waLinkFor(wa)), [wa]);
  return (
    <a href={href} target="_blank" rel="noopener" {...rest}>
      {children}
    </a>
  );
}

/** Muestra el número formateado solo en el navegador. */
export function PhoneText({ fallback }: { fallback: string }) {
  const [text, setText] = useState(fallback);
  useEffect(() => setText(formatPhone()), []);
  return <>{text}</>;
}
