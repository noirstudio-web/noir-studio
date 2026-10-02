import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { PhoneText, WaLink } from '@/components/WaLink';
import { BASE_PATH, GOATCOUNTER_CODE, LEGAL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Política de privacidad · Noir Studio',
  description: 'Cómo Noir Studio recoge, usa y protege tus datos personales, según la Ley 1581 de 2012 de Colombia.',
  alternates: { canonical: 'privacidad/' },
  openGraph: { title: 'Política de privacidad · Noir Studio', url: 'privacidad/', images: [{ url: 'assets/og-image.png', width: 1200, height: 630 }] },
};

const responsable = [LEGAL.titular || 'Noir Studio', LEGAL.documento, LEGAL.ciudad].filter(Boolean).join(' · ');

export default function Privacidad() {
  return (
    <LegalPage
      title="Política de privacidad"
      lead="Tu información es confidencial. Aquí te contamos qué datos recibimos, para qué los usamos y cómo ejercer tus derechos."
      updated={LEGAL.actualizado}
      question="¿Tienes dudas sobre tus datos?"
      sections={[
        { id: 'responsable', title: 'Responsable', body: <>
          <p>El responsable del tratamiento de tus datos es <strong>{responsable}</strong>.</p>
          <p>Contacto: WhatsApp <WaLink wa="terminos"><PhoneText fallback="desde el botón de esta web" /></WaLink>{LEGAL.correo && <> · correo <a href={`mailto:${LEGAL.correo}`}>{LEGAL.correo}</a></>}.</p>
          <p>Cumplimos la <strong>Ley 1581 de 2012</strong> y el <strong>Decreto 1377 de 2013</strong> de Colombia sobre protección de datos personales.</p>
        </> },
        { id: 'datos', title: 'Qué datos recibimos', body: <ul>
          <li>Los que tú decides enviarnos: nombre, nombre de tu negocio, lo que necesitas, presupuesto, mensaje y tu número de WhatsApp.</li>
          <li><strong>El formulario de cotización no guarda tus datos en ningún servidor:</strong> solo arma un mensaje que tú mismo envías por WhatsApp.</li>
          <li>Durante un proyecto, la información y los accesos que nos compartes para desarrollarlo, que tratamos como <strong>confidenciales</strong>.</li>
        </ul> },
        { id: 'finalidad', title: 'Para qué los usamos', body: <ul>
          <li>Responderte, prepararte una cotización, ejecutar tu proyecto y comunicarnos contigo sobre él.</li>
          <li><strong>No vendemos, alquilamos ni compartimos tus datos</strong> con terceros para publicidad.</li>
          <li>No los usamos para nada distinto a tu proyecto, ni durante ni después de terminarlo.</li>
        </ul> },
        { id: 'navegador', title: 'Datos en tu navegador y cookies', body: <>
          <p>Esta web <strong>no usa cookies de rastreo ni de publicidad</strong>. Solo guarda en tu propio navegador algunas preferencias (como la moneda elegida) para que la web funcione mejor.</p>
          <p>El detalle completo está en el <a href={`${BASE_PATH}/cookies/`}>Aviso de cookies</a>.</p>
        </> },
        { id: 'analitica', title: 'Analítica de visitas', body: GOATCOUNTER_CODE
          ? <p>Medimos las visitas con <strong>GoatCounter</strong>, una herramienta <strong>sin cookies</strong> que solo registra datos agregados y anónimos (páginas vistas, país, tipo de dispositivo). No identifica a las personas ni sigue tu actividad en otras webs.</p>
          : <p>Por ahora esta web no mide visitas. Si en el futuro lo hacemos, usaremos una herramienta sin cookies que solo registre datos agregados y anónimos, y lo indicaremos aquí.</p> },
        { id: 'terceros', title: 'Servicios externos', body: <>
          <p>Esta web usa: <strong>GitHub Pages</strong> (alojamiento), <strong>open.er-api.com</strong> (tasas de cambio del formulario){GOATCOUNTER_CODE && <>, <strong>GoatCounter</strong> (analítica sin cookies)</>}, y <strong>WhatsApp</strong> y <strong>Discord</strong> cuando decides escribirnos. Las demos cargan tipografías de <strong>Google Fonts</strong>.</p>
          <p>Estos servicios pueden recibir datos técnicos como tu dirección IP y se rigen por sus propias políticas de privacidad.</p>
        </> },
        { id: 'derechos', title: 'Tus derechos', body: <>
          <p>Puedes <strong>conocer, actualizar, corregir o pedir que eliminemos</strong> tus datos, pedir prueba de tu autorización y revocarla en cualquier momento.</p>
          <p>Escríbenos por WhatsApp <WaLink wa="terminos"><PhoneText fallback="desde esta web" /></WaLink>{LEGAL.correo && <> o al correo {LEGAL.correo}</>}. Respondemos consultas en máximo <strong>10 días hábiles</strong> y reclamos en máximo <strong>15 días hábiles</strong>. Si no quedas satisfecho, puedes acudir a la <strong>Superintendencia de Industria y Comercio (SIC)</strong>.</p>
        </> },
        { id: 'conservacion', title: 'Cuánto tiempo los guardamos', body: <p>Mientras dure nuestra relación comercial y el tiempo que exijan las obligaciones legales o contables. Después se eliminan. Nuestros servicios están dirigidos a personas mayores de edad.</p> },
        { id: 'seguridad', title: 'Seguridad', body: <p>La web funciona solo con conexión segura (HTTPS), tiene una política de seguridad que bloquea código no autorizado y protección contra robots. Los accesos de tus proyectos se usan solo para trabajar en ellos.</p> },
      ]}
    />
  );
}
