import type { Metadata } from 'next';
import { Effects } from '@/components/Effects';
import { Footer } from '@/components/Footer';
import { Nav } from '@/components/Nav';
import { PhoneText, WaLink } from '@/components/WaLink';
import { BASE_PATH, LEGAL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Términos y condiciones · Noir Studio',
  description: 'Términos y condiciones de servicio de Noir Studio: propuesta, pagos, plazos, confidencialidad, contrato de entrega y garantía.',
  alternates: { canonical: 'terminos/' },
  openGraph: {
    type: 'website', locale: 'es_CO', siteName: 'Noir Studio', url: 'terminos/',
    title: 'Términos y condiciones · Noir Studio',
    description: 'Cómo trabajamos: propuesta escrita, precio cerrado, pagos 50 % / 50 % y privacidad de tus datos.',
    images: [{ url: 'assets/og-image.png', width: 1200, height: 630 }],
  },
};

export default function Terminos() {
  return (
    <>
      <Effects />
      <Nav onHome={false} />
      <main id="inicio" tabIndex={-1} className="legal-page">
        <div className="container">
      <header className="legal-hero reveal">
        <p className="eyebrow"><span aria-hidden="true">✦</span> Legal</p>
        <h1 className="section__title legal-hero__title">Términos y condiciones</h1>
        <p className="section__lead">Reglas claras para trabajar juntos. Están escritas en lenguaje sencillo: si algo no queda claro, escríbeme y lo hablamos antes de empezar.</p>
        <p className="legal-hero__date">Última actualización: {LEGAL.actualizado}</p>
      </header>

      <div className="legal">
        <nav className="legal__toc reveal" aria-label="Contenido">
          <p className="legal__toc-title">Contenido</p>
          <ol>
            <li><a href="#quienes">Quiénes somos</a></li>
            <li><a href="#propuesta">Cotización y propuesta</a></li>
            <li><a href="#pagos">Precio y pagos</a></li>
            <li><a href="#plazos">Plazos de entrega</a></li>
            <li><a href="#cambios">Cambios y revisiones</a></li>
            <li><a href="#cliente">Tus responsabilidades</a></li>
            <li><a href="#terceros">Servicios de terceros</a></li>
            <li><a href="#propiedad">Propiedad del proyecto</a></li>
            <li><a href="#confidencialidad">Confidencialidad</a></li>
            <li><a href="#contrato">Contrato de entrega</a></li>
            <li><a href="#garantia">Garantía y soporte</a></li>
            <li><a href="#cancelacion">Cancelación</a></li>
            <li><a href="#suscripciones">Planes mensuales</a></li>
            <li><a href="#demos">Demos de esta web</a></li>
            <li><a href="#responsabilidad">Límite de responsabilidad</a></li>
            <li><a href="#ley">Ley aplicable</a></li>
            <li><a href="#privacidad">Privacidad y cookies</a></li>
          </ol>
        </nav>

        <article className="legal__body">
          <section id="quienes" className="reveal">
            <h2><span>01</span> Quiénes somos</h2>
            <p><strong>Noir Studio</strong> es un estudio de desarrollo web que diseña y programa páginas web, landing pages, tiendas online, aplicaciones, sistemas a medida y piezas de branding.</p>
            <p>Puedes contactarnos por WhatsApp al <WaLink wa="cotizar"><PhoneText fallback="nuestro WhatsApp" /></WaLink> o en nuestra <a href="https://discord.gg/fNWeKew86h" target="_blank" rel="noopener">comunidad de Discord</a>.</p>
            <p>Al aceptar una propuesta o pagar el anticipo de un proyecto, aceptas estos términos. Si la propuesta escrita dice algo distinto, manda lo que diga la propuesta.</p>
          </section>

          <section id="propuesta" className="reveal">
            <h2><span>02</span> Cotización y propuesta</h2>
            <ul>
              <li>La cotización y la primera conversación son <strong>gratis y sin compromiso</strong>.</li>
              <li>Antes de empezar recibes una <strong>propuesta escrita</strong> con el alcance (qué incluye y qué no), los entregables, la fecha estimada de entrega y el precio.</li>
              <li>El precio de la propuesta se mantiene durante el plazo de vigencia indicado en ella.</li>
              <li>Los rangos de presupuesto que aparecen en esta web son orientativos; el precio final es el de la propuesta.</li>
            </ul>
          </section>

          <section id="pagos" className="reveal">
            <h2><span>03</span> Precio y forma de pago</h2>
            <ul>
              <li>Trabajamos con <strong>precio cerrado</strong>: lo acordado por escrito es lo que pagas, sin costos ocultos.</li>
              <li><strong>50&nbsp;% de anticipo</strong> para reservar la agenda y empezar el trabajo.</li>
              <li><strong>50&nbsp;% restante</strong> al entregar el proyecto terminado y aprobado por ti, antes de publicarlo en tu dominio definitivo y entregar los accesos.</li>
              <li>La moneda y los medios de pago se acuerdan en la propuesta. Las comisiones bancarias o de plataformas de pago corren por cuenta de quien envía el pago.</li>
              <li>Si se necesita factura o documento soporte, solicítalo antes del primer pago.</li>
            </ul>
          </section>

          <section id="plazos" className="reveal">
            <h2><span>04</span> Plazos de entrega</h2>
            <ul>
              <li>El plazo empieza a contar cuando recibimos el anticipo <strong>y</strong> el material necesario (textos, logo, fotos, accesos, etc.).</li>
              <li>Si el material o tus respuestas se retrasan, la fecha de entrega se corre el mismo tiempo.</li>
              <li>Si pasan 30 días sin respuesta de tu parte, el proyecto queda en pausa y se retoma según la disponibilidad de agenda.</li>
              <li>Los tiempos que aparecen en esta web (por ejemplo, “1–3 semanas”) son aproximados; la fecha que vale es la de tu propuesta.</li>
            </ul>
          </section>

          <section id="cambios" className="reveal">
            <h2><span>05</span> Cambios y revisiones</h2>
            <ul>
              <li>Los ajustes <strong>dentro del alcance acordado</strong> están incluidos, tanto en la etapa de diseño como en la revisión final.</li>
              <li>Las secciones, funciones o páginas nuevas que no estén en la propuesta se cotizan aparte <strong>antes</strong> de hacerlas. Nunca cobramos nada que no hayas aprobado.</li>
              <li>Una vez aprobado el diseño, los cambios grandes de estructura o estilo se consideran trabajo adicional.</li>
            </ul>
          </section>

          <section id="cliente" className="reveal">
            <h2><span>06</span> Tus responsabilidades</h2>
            <ul>
              <li>Entregar contenido veraz y tener los derechos de uso de los textos, logos, fotos y marcas que nos envíes.</li>
              <li>Revisar los avances y responder en tiempos razonables.</li>
              <li>Eres responsable del contenido publicado en tu web y de cumplir las normas propias de tu negocio (precios, garantías, devoluciones, facturación, protección de datos de tus clientes, etc.).</li>
            </ul>
          </section>

          <section id="terceros" className="reveal">
            <h2><span>07</span> Servicios de terceros</h2>
            <p>Algunos proyectos usan servicios externos como dominio, hosting, pasarelas de pago, correo, bases de datos o herramientas de pago. Para esos servicios:</p>
            <ul>
              <li>Sus costos corren por tu cuenta, salvo que la propuesta diga otra cosa.</li>
              <li>Se registran <strong>a tu nombre</strong> siempre que sea posible, para que sean tuyos.</li>
              <li>Cada proveedor tiene sus propios términos. Noir Studio no responde por caídas, cambios de precio o de condiciones de esos proveedores, pero te ayuda a resolverlo.</li>
            </ul>
          </section>

          <section id="propiedad" className="reveal">
            <h2><span>08</span> Propiedad del proyecto</h2>
            <ul>
              <li>Cuando el proyecto está <strong>pagado al 100&nbsp;%</strong>, eres dueño del diseño y del código desarrollados para ti, y recibes todos los accesos.</li>
              <li>Noir Studio conserva el derecho sobre sus herramientas, componentes y conocimientos genéricos, que puede seguir usando en otros proyectos. Las librerías de código abierto se rigen por sus propias licencias.</li>
              <li>Tu proyecto es confidencial: solo lo mostramos en nuestro portafolio o redes si nos das tu <strong>autorización por escrito</strong>.</li>
            </ul>
          </section>

          <section id="confidencialidad" className="reveal">
            <h2><span>09</span> Confidencialidad</h2>
            <p><strong>Todo lo que compartes con Noir Studio es confidencial.</strong> Esto incluye tus ideas, la información de tu negocio y de tus clientes, contraseñas y accesos, archivos, precios y estrategias.</p>
            <ul>
              <li>No compartimos, vendemos ni usamos tu información para nada distinto a tu proyecto.</li>
              <li>Los accesos y contraseñas se usan solo para trabajar en tu proyecto. Al entregarlo, te recomendamos cambiarlos.</li>
              <li>La confidencialidad se mantiene <strong>durante y después</strong> del proyecto, incluso si se cancela.</li>
              <li>Si tu proyecto lo requiere, podemos firmar un acuerdo de confidencialidad antes de empezar.</li>
            </ul>
          </section>

          <section id="contrato" className="reveal">
            <h2><span>10</span> Contrato de entrega</h2>
            <p>Cuando terminamos tu proyecto, <strong>recibes un contrato</strong> que formaliza la entrega. En él queda por escrito:</p>
            <ul>
              <li>Lo que se desarrolló y se entregó, y los accesos que recibes.</li>
              <li>Que el diseño y el código desarrollados para ti quedan <strong>a tu nombre</strong>, una vez pagado el 100&nbsp;%.</li>
              <li>La garantía y el soporte incluidos.</li>
              <li>El compromiso de confidencialidad sobre tu información y tu proyecto.</li>
            </ul>
          </section>

          <section id="garantia" className="reveal">
            <h2><span>11</span> Garantía y soporte</h2>
            <ul>
              <li>Corregimos <strong>sin costo</strong> los errores de programación de lo entregado que se reporten dentro del periodo de garantía indicado en la propuesta.</li>
              <li>La garantía no cubre cambios hechos por ti o por terceros, funciones nuevas, contenido nuevo ni fallas de proveedores externos.</li>
              <li>El mantenimiento continuo, las actualizaciones y las mejoras se cotizan aparte.</li>
            </ul>
          </section>

          <section id="cancelacion" className="reveal">
            <h2><span>12</span> Cancelación</h2>
            <ul>
              <li>Puedes cancelar el proyecto en cualquier momento avisando por escrito.</li>
              <li>El anticipo cubre la reserva de agenda y el trabajo ya realizado, por eso <strong>no es reembolsable una vez iniciado el trabajo</strong>.</li>
              <li>Si Noir Studio no puede continuar por causas propias, devuelve la parte proporcional del trabajo no realizado.</li>
            </ul>
          </section>

          <section id="suscripciones" className="reveal">
            <h2><span>13</span> Planes mensuales</h2>
            <p>Los servicios por suscripción (por ejemplo, la plataforma de reservas para barberías) se pagan mes a mes, sin contrato de permanencia, y puedes cancelarlos cuando quieras. Si un mes no se renueva, el servicio se suspende. Las condiciones de cada plan (precio, límites y funciones) son las publicadas para ese plan al momento de contratarlo.</p>
          </section>

          <section id="demos" className="reveal">
            <h2><span>14</span> Demos de esta web</h2>
            <p>Los proyectos marcados como <strong>“Demo”</strong> son ejemplos para mostrar lo que podemos construir: los negocios, productos, precios, pedidos y estadísticas son ficticios y los pagos son simulados (no se cobra nada). Las fotos de las demos provienen de Unsplash, bajo su licencia de uso libre.</p>
          </section>

          <section id="responsabilidad" className="reveal">
            <h2><span>15</span> Límite de responsabilidad</h2>
            <ul>
              <li>Ponemos todo nuestro esfuerzo en que tu proyecto funcione y te ayude a crecer, pero no podemos garantizar resultados comerciales específicos (ventas, clientes o posiciones en Google), porque dependen de factores externos.</li>
              <li>La responsabilidad total de Noir Studio frente a un proyecto se limita al valor pagado por ese proyecto.</li>
            </ul>
          </section>

          <section id="ley" className="reveal">
            <h2><span>16</span> Ley aplicable y cambios</h2>
            <ul>
              <li>Estos términos se rigen por las leyes de la República de Colombia.</li>
              <li>Cualquier diferencia la resolvemos primero de forma directa y amistosa.</li>
              <li>Podemos actualizar estos términos. A cada proyecto se le aplica la versión vigente en la fecha en que aceptaste la propuesta.</li>
            </ul>
          </section>

          <section id="privacidad" className="reveal">
            <h2><span>17</span> Privacidad, cookies y aviso legal</h2>
            <p>Tu información es confidencial. Cómo tratamos tus datos está en la <a href={`${BASE_PATH}/privacidad/`}>Política de privacidad</a>, lo que se guarda en tu navegador en el <a href={`${BASE_PATH}/cookies/`}>Aviso de cookies</a> y los datos del titular de la web en el <a href={`${BASE_PATH}/aviso-legal/`}>Aviso legal</a>.</p>
          </section>

          <div className="legal__cta reveal">
            <p><b>¿Tienes dudas sobre estos términos?</b> Pregúntame antes de empezar, sin compromiso.</p>
            <WaLink wa="terminos" className="btn btn--chrome">Escribir por WhatsApp <span aria-hidden="true">✦</span></WaLink>
          </div>
        </article>
      </div>
    
        </div>
      </main>
      <Footer onHome={false} />
    </>
  );
}
