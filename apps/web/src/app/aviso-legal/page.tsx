import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { PhoneText, WaLink } from '@/components/WaLink';
import { BASE_PATH, DISCORD_URL, LEGAL, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Aviso legal · Noir Studio',
  description: 'Información legal del sitio web de Noir Studio: titular, propiedad intelectual, responsabilidad y ley aplicable.',
  alternates: { canonical: 'aviso-legal/' },
  openGraph: { title: 'Aviso legal · Noir Studio', url: 'aviso-legal/', images: [{ url: 'assets/og-image.png', width: 1200, height: 630 }] },
};

export default function AvisoLegal() {
  return (
    <LegalPage
      title="Aviso legal"
      lead="Quién está detrás de esta web y las reglas para usarla."
      updated={LEGAL.actualizado}
      question="¿Tienes alguna consulta legal?"
      sections={[
        { id: 'titular', title: 'Titular del sitio', body: <ul>
          <li><strong>Nombre comercial:</strong> Noir Studio — estudio de desarrollo web a medida.</li>
          {LEGAL.titular && <li><strong>Titular:</strong> {LEGAL.titular}</li>}
          {LEGAL.documento && <li><strong>Identificación:</strong> {LEGAL.documento}</li>}
          {LEGAL.ciudad && <li><strong>Domicilio:</strong> {LEGAL.ciudad}</li>}
          <li><strong>Sitio web:</strong> {SITE_URL.replace('https://', '')}</li>
          <li><strong>Contacto:</strong> WhatsApp <WaLink wa="terminos"><PhoneText fallback="desde el botón de esta web" /></WaLink>{LEGAL.correo && <> · {LEGAL.correo}</>} · <a href={DISCORD_URL} target="_blank" rel="noopener">Discord</a></li>
        </ul> },
        { id: 'objeto', title: 'Objeto del sitio', body: <p>Esta web presenta los servicios de Noir Studio (diseño y desarrollo de páginas web, tiendas online, apps, sistemas y branding), muestra proyectos y demos, y permite pedir una cotización. Usarla implica aceptar este aviso. La contratación de servicios se rige por los <a href={`${BASE_PATH}/terminos/`}>Términos y condiciones</a>.</p> },
        { id: 'propiedad', title: 'Propiedad intelectual', body: <ul>
          <li>La marca <strong>Noir Studio</strong>, sus logos, el diseño, los textos y el código de esta web pertenecen a Noir Studio. No se pueden copiar, modificar ni usar sin autorización por escrito.</li>
          <li>Las fotos de las demos provienen de Unsplash y se usan bajo su licencia.</li>
          <li>WhatsApp, Discord y otras marcas mencionadas pertenecen a sus respectivos dueños.</li>
        </ul> },
        { id: 'responsabilidad', title: 'Responsabilidad', body: <ul>
          <li>Los precios, rangos y tiempos que aparecen en la web son orientativos; lo que vale es la propuesta escrita de cada proyecto.</li>
          <li>Las demos son ejemplos: sus negocios, productos, pedidos y pagos son ficticios.</li>
          <li>Hacemos todo lo posible para que la web esté disponible y sin errores, pero no podemos garantizar que funcione sin interrupciones.</li>
          <li>No respondemos por el contenido de los sitios externos a los que enlazamos.</li>
        </ul> },
        { id: 'datos', title: 'Datos personales y cookies', body: <p>El tratamiento de tus datos se explica en la <a href={`${BASE_PATH}/privacidad/`}>Política de privacidad</a> y el uso del navegador en el <a href={`${BASE_PATH}/cookies/`}>Aviso de cookies</a>. Toda la información de nuestros clientes es <strong>confidencial</strong>.</p> },
        { id: 'ley', title: 'Ley aplicable', body: <p>Este sitio y su uso se rigen por las leyes de la República de Colombia, incluida la Ley 527 de 1999 sobre comercio electrónico. Cualquier diferencia se intentará resolver primero de forma directa y amistosa.</p> },
      ]}
    />
  );
}
