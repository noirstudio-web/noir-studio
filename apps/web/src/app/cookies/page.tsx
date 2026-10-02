import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { BASE_PATH, GOATCOUNTER_CODE, LEGAL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Aviso de cookies · Noir Studio',
  description: 'Noir Studio no usa cookies de rastreo ni de publicidad. Qué se guarda en tu navegador y por qué.',
  alternates: { canonical: 'cookies/' },
  openGraph: { title: 'Aviso de cookies · Noir Studio', url: 'cookies/', images: [{ url: 'assets/og-image.png', width: 1200, height: 630 }] },
};

const STORAGE = [
  { key: 'noir-currency', what: 'La moneda que elegiste en el formulario', time: 'Hasta que la borres' },
  { key: 'noir-rates', what: 'Las tasas de cambio del día (para no descargarlas cada vez)', time: '12 horas' },
  { key: 'noir-form-sends', what: 'La hora de tus envíos del formulario, para evitar spam', time: '10 minutos' },
  { key: 'noir-aviso-cookies', what: 'Que ya leíste este aviso, para no mostrarlo de nuevo', time: 'Hasta que la borres' },
  { key: 'casa-brasa-cart / atelier-*', what: 'Carritos y pedidos de prueba de las demos', time: 'Hasta que la borres' },
];

export default function Cookies() {
  return (
    <LegalPage
      title="Aviso de cookies"
      lead="Resumen: esta web no usa cookies de rastreo ni de publicidad. Solo recuerda algunas preferencias en tu propio navegador."
      updated={LEGAL.actualizado}
      question="¿Tienes dudas sobre las cookies?"
      sections={[
        { id: 'que-son', title: '¿Qué son las cookies?', body: <p>Son pequeños archivos que una web guarda en tu navegador. Algunas sirven para que la web funcione y otras para seguirte y mostrarte publicidad.</p> },
        { id: 'esta-web', title: 'Lo que usa esta web', body: <ul>
          <li><strong>Cookies propias de rastreo o publicidad: ninguna.</strong></li>
          <li><strong>Cookies de terceros (Google, Facebook, etc.): ninguna.</strong></li>
          <li>{GOATCOUNTER_CODE
            ? <>Medimos visitas con <strong>GoatCounter, que no usa cookies</strong> y solo registra datos anónimos y agregados.</>
            : <>Por ahora no medimos visitas.</>}</li>
          <li>Usamos el <strong>almacenamiento local</strong> de tu navegador solo para recordar preferencias (abajo está la lista completa). Esa información nunca sale de tu dispositivo.</li>
        </ul> },
        { id: 'lista', title: 'Lo que se guarda en tu navegador', body: (
          <div className="table-wrap">
            <table className="legal-table">
              <thead><tr><th>Nombre</th><th>Para qué sirve</th><th>Duración</th></tr></thead>
              <tbody>{STORAGE.map((s) => <tr key={s.key}><td><code>{s.key}</code></td><td>{s.what}</td><td>{s.time}</td></tr>)}</tbody>
            </table>
          </div>
        ) },
        { id: 'externos', title: 'Sitios externos', body: <p>Si haces clic para ir a <strong>WhatsApp</strong> o <strong>Discord</strong>, esos sitios pueden usar sus propias cookies según sus políticas. Las <strong>demos</strong> cargan tipografías de Google Fonts.</p> },
        { id: 'borrar', title: 'Cómo borrar esta información', body: <p>Desde la configuración de tu navegador puedes borrar los datos de este sitio cuando quieras (en Chrome: <em>Configuración → Privacidad y seguridad → Datos de sitios</em>). La web seguirá funcionando; solo olvidará tus preferencias. Más detalles en la <a href={`${BASE_PATH}/privacidad/`}>Política de privacidad</a>.</p> },
      ]}
    />
  );
}
