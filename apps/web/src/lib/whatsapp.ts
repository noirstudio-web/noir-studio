import { WA_MESSAGES, WHATSAPP_PARTS, type WaKey } from './site';

/** El número completo solo se arma en el navegador (no aparece en el HTML). */
export const whatsappNumber = () => WHATSAPP_PARTS.join('');

/**
 * Quita los emojis "grandes" (fuera del plano básico de Unicode, como 👋📌): algunos WhatsApp
 * los muestran como "�" cuando llegan en un enlace. Símbolos como ✦ • — sí se ven bien.
 */
export const safeText = (text: string) =>
  text.replace(/[\u{10000}-\u{10FFFF}]\uFE0F?/gu, '').replace(/[ \t]+\n/g, (m) => m.replace(/[ \t]+/, ' ')).replace(/ {2,}/g, ' ');

export const waLink = (msg?: string) =>
  `https://wa.me/${whatsappNumber()}${msg ? `?text=${encodeURIComponent(safeText(msg))}` : ''}`;

export const waLinkFor = (key: WaKey) => waLink(WA_MESSAGES[key].join('\n'));

/** Formato +57 XXX XXX XXXX para números colombianos; para otros, solo antepone "+". */
export const formatPhone = (n = whatsappNumber()) => {
  const m = /^57(\d{3})(\d{3})(\d{4})$/.exec(n);
  return m ? `+57 ${m[1]} ${m[2]} ${m[3]}` : `+${n}`;
};
