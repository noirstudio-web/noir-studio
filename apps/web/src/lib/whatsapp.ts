import { WA_MESSAGES, WHATSAPP_PARTS, type WaKey } from './site';

/** El número completo solo se arma en el navegador (no aparece en el HTML). */
export const whatsappNumber = () => WHATSAPP_PARTS.join('');

export const waLink = (msg?: string) =>
  `https://wa.me/${whatsappNumber()}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`;

export const waLinkFor = (key: WaKey) => waLink(WA_MESSAGES[key].join('\n'));

/** +57 313 563 9329 para números colombianos; para otros, solo antepone "+". */
export const formatPhone = (n = whatsappNumber()) => {
  const m = /^57(\d{3})(\d{3})(\d{4})$/.exec(n);
  return m ? `+57 ${m[1]} ${m[2]} ${m[3]}` : `+${n}`;
};
