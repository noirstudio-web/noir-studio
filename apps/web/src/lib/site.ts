/* =========================================================
   NOIR STUDIO — datos del sitio
   Casi todo lo que quieras cambiar (número, mensajes, precios,
   servicios, proyectos, preguntas…) está en este archivo.
   ========================================================= */

/** Ruta base: /noir-studio en GitHub Pages, vacía con dominio propio. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
/** URL pública completa (para Google y vistas previas al compartir). */
export const SITE_URL = 'https://noirstudio-web.github.io/noir-studio';
/** Convierte una ruta de /public en una URL que funciona con la ruta base. */
export const asset = (path: string) => `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`;

// ✦ Tu número de WhatsApp: código de país + número, partido en trozos para que los robots
//   que recolectan teléfonos no lo encuentren en el código. Para cambiarlo, edita los trozos.
export const WHATSAPP_PARTS = ['57', '310', '373', '5812'] as const;
export const DISCORD_URL = 'https://discord.gg/fNWeKew86h';

// ✦ Datos legales del titular (aparecen en el Aviso legal y la Política de privacidad).
//   Déjalos vacíos ('') para no mostrarlos; complétalos cuando los tengas.
export const LEGAL = {
  titular: '',        // nombre completo o razón social, ej. 'Juan Pérez' o 'Noir Studio S.A.S.'
  documento: '',      // NIT o cédula, ej. 'NIT 900.123.456-7'
  ciudad: '',         // ej. 'Bogotá, Colombia'
  correo: '',         // ej. 'hola@noirstudio.co'
  actualizado: '2 de octubre de 2026',
};

// ✦ Analítica sin cookies (GoatCounter, gratis). Crea tu cuenta en https://www.goatcounter.com
//   y escribe aquí el código que elegiste (ej. 'noirstudio' → noirstudio.goatcounter.com).
//   Vacío = la analítica está apagada.
export const GOATCOUNTER_CODE = '';

export type WaKey = 'cotizar' | 'barberia' | 'menu' | 'tienda' | 'flotante' | 'terminos';

// ✦ Mensajes que llegan a tu WhatsApp desde cada botón. El cliente solo completa los espacios.
//   Usa símbolos simples (✦ •). Los emojis "grandes" (👋📌) se ven rotos (�) en algunos WhatsApp,
//   por eso la web los quita automáticamente antes de enviar.
export const WA_MESSAGES: Record<WaKey, string[]> = {
  // Botones "Cotizar mi proyecto" (menú, inicio, proceso, contacto, footer)
  cotizar: [
    'Hola, Noir Studio ✦',
    'Vi tu página web y quiero cotizar un proyecto.',
    '',
    '• *Mi nombre:* ',
    '• *Mi negocio:* ',
    '• *Qué necesito:* (página web, landing, tienda online, app, sistema o branding)',
    '• *Objetivo principal:* (vender más, recibir reservas, verme más profesional…)',
    '• *Para cuándo lo necesito:* ',
    '• *Presupuesto aproximado:* ',
    '',
    '¿Me cuentas cómo trabajas y cuáles serían los siguientes pasos?',
    '¡Gracias!',
  ],
  // Proyecto real: reservas para barberías
  barberia: [
    'Hola, Noir Studio ✦',
    'Vi tu plataforma de reservas para barberías y me interesa para mi negocio.',
    '',
    '• *Mi nombre:* ',
    '• *Nombre de la barbería:* ',
    '• *Número de barberos:* ',
    '• *Ciudad:* ',
    '• *Instagram o web actual:* ',
    '',
    '¿Me explicas los planes y cómo activo la prueba gratis de 7 días?',
    '¡Gracias!',
  ],
  // Demo Noir Menu
  menu: [
    'Hola, Noir Studio ✦',
    'Probé la demo de Noir Menu y quiero un menú digital para mi restaurante.',
    '',
    '• *Mi nombre:* ',
    '• *Nombre del restaurante:* ',
    '• *Ciudad:* ',
    '• *Cantidad aproximada de platos:* ',
    '• *Pedidos para:* (mesa, domicilio, para recoger o todos)',
    '',
    '¿Cuánto costaría y en cuánto tiempo estaría listo?',
    '¡Gracias!',
  ],
  // Demo Tienda online
  tienda: [
    'Hola, Noir Studio ✦',
    'Probé la demo de la tienda online y quiero una para mi negocio.',
    '',
    '• *Mi nombre:* ',
    '• *Mi negocio:* ',
    '• *Qué vendo:* ',
    '• *Cantidad aproximada de productos:* ',
    '• *Cómo quiero cobrar:* (tarjeta, PSE, Nequi, contra entrega…)',
    '• *¿Hago envíos?:* ',
    '',
    '¿Me ayudas con una cotización?',
    '¡Gracias!',
  ],
  // Botón verde flotante: corto, para quien apenas está mirando
  flotante: [
    'Hola, Noir Studio ✦',
    'Estoy viendo tu página web y me gustaría trabajar contigo.',
    '',
    '• *Mi nombre:* ',
    '• *Mi negocio:* ',
    '• *Lo que necesito:* ',
    '',
    '¿Cuándo podemos hablar? ¡Gracias!',
  ],
  // Páginas legales
  terminos: [
    'Hola, Noir Studio ✦',
    'Leí la información legal de tu web y tengo una pregunta:',
    '',
  ],
};

// ✦ Rangos de presupuesto en pesos colombianos (las demás monedas se calculan solas)
export const BUDGET_COP: { min?: number; max?: number }[] = [
  { max: 1_000_000 },
  { min: 1_000_000, max: 3_000_000 },
  { min: 3_000_000, max: 6_000_000 },
  { min: 6_000_000 },
];

// ✦ Frases de la cinta que se mueve debajo del hero
export const MARQUEE = [
  'Páginas web', 'Tiendas online', 'Landing pages', 'Apps', 'Sistemas a medida', 'Branding',
  'Ideas / Código / Resultados', '100 % a medida', 'Cero plantillas', 'Listo para Google',
  'Precio cerrado', 'Trato directo', 'Soporte real', 'Tu proyecto es tuyo',
];

export const NAV_LINKS = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#trabajos', label: 'Trabajos' },
  { href: '#proceso', label: 'Proceso' },
  { href: '#preguntas', label: 'Preguntas' },
  { href: '#contacto', label: 'Contacto' },
];

export type IconName =
  | 'web' | 'landing' | 'store' | 'app' | 'system' | 'star'
  | 'bolt' | 'phone' | 'search' | 'shield' | 'chat' | 'key' | 'support'
  | 'building' | 'pen' | 'wrench' | 'gear' | 'plus';

// ✦ Servicios y precios (pesos colombianos). Para cambiar un precio, edita "price".
//   from: true → se muestra "Desde"; unit → texto después del precio (ej. "/ mes").
export type Service = {
  id: string; icon: IconName; title: string; text: string; tags: string[];
  price?: number; from?: boolean; unit?: string;
};
export const SERVICES: Service[] = [
  { id: 'landing', icon: 'landing', title: 'Landing page', price: 890_000, text: 'Una página enfocada en una sola acción: vender, captar contactos o lanzar tu producto.', tags: ['Campañas', 'Ventas', 'Ads'] },
  { id: 'web-basica', icon: 'web', title: 'Página web básica', price: 1_690_000, text: 'Hasta 5 secciones para presentar tu negocio, tus servicios y tus datos de contacto.', tags: ['Hasta 5 secciones', 'SEO', 'Mobile-first'] },
  { id: 'web-corporativa', icon: 'building', title: 'Página web corporativa', price: 2_990_000, text: 'De 6 a 10 secciones para empresas que necesitan mostrar más servicios, equipo y trabajos.', tags: ['6 a 10 secciones', 'Empresas', 'SEO'] },
  { id: 'tienda', icon: 'store', title: 'Tienda online', price: 3_490_000, from: true, text: 'Catálogo, carrito, pagos en línea y panel para gestionar productos y pedidos sin depender de nadie.', tags: ['Pagos', 'Inventario', 'Envíos'] },
  { id: 'sistema', icon: 'system', title: 'Sistema a medida', price: 4_990_000, from: true, text: 'Reservas, inventarios, dashboards y paneles administrativos hechos a la medida de tu operación.', tags: ['Reservas', 'Dashboards', 'Usuarios'] },
  { id: 'app', icon: 'app', title: 'App a medida', price: 8_900_000, from: true, text: 'Aplicaciones para celular y computador, diseñadas desde cero para tu negocio y tus clientes.', tags: ['Mobile', 'Tiempo real', 'A medida'] },
  { id: 'marca', icon: 'star', title: 'Identidad de marca completa', price: 990_000, text: 'Logo, paleta de colores, tipografías y piezas base para que tu marca se vea coherente en todas partes.', tags: ['Logo', 'Colores', 'Tipografías'] },
  { id: 'logo', icon: 'pen', title: 'Logo', price: 390_000, text: 'Diseño de logo profesional para tu negocio, listo para usar en tu web y tus redes.', tags: ['Logo', 'Archivos finales'] },
  { id: 'mantenimiento', icon: 'wrench', title: 'Mantenimiento web', price: 149_000, unit: '/ mes', text: 'Cambios de contenido, ajustes y soporte mes a mes para que tu web siga al día.', tags: ['Mensual', 'Soporte', 'Ajustes'] },
  { id: 'instalacion', icon: 'gear', title: 'Instalación de planes mensuales', price: 199_000, unit: 'pago único', text: 'Configuración inicial de los planes por suscripción, como la plataforma de reservas para barberías.', tags: ['Pago único', 'Configuración'] },
  { id: 'otros', icon: 'plus', title: 'Otros', text: '¿Necesitas algo que no está en la lista? Cuéntame tu idea y te preparo una cotización a medida, gratis y sin compromiso.', tags: ['A medida', 'Cotización gratis'] },
];

export const SERVICE_CONDITIONS = [
  { icon: '📄', text: 'Precio cerrado: lo acordado por escrito es lo que se paga.' },
  { icon: '💳', text: 'Pago 50 % al iniciar y 50 % al aprobar el proyecto terminado.' },
  { icon: '🌐', text: 'No incluye dominio, hosting ni comisiones de pasarelas de pago (van a nombre del cliente).' },
  { icon: '🔎', text: '"Desde": el precio final depende del alcance y se confirma en la propuesta.' },
];

/** "$1.690.000" · "Desde $3.490.000" · "$149.000 / mes" */
export const formatCOP = (n: number) => `$${new Intl.NumberFormat('es-CO').format(n)}`;
export const servicePrice = (s: Service) =>
  s.price == null ? 'A cotizar' : `${s.from ? 'Desde ' : ''}${formatCOP(s.price)}${s.unit ? ` ${s.unit}` : ''}`;

export type Project = {
  status: 'live' | 'demo';
  type: string;
  title: string;
  text: string;
  points: string[];
  tags: string[];
  url: string;           // link "Ver proyecto / Ver demo"
  external: boolean;     // true = otro sitio; false = demo dentro de esta web
  wa: WaKey;
  frame: 'browser' | 'phone';
  urlLabel?: string;     // texto de la barra del navegador
  shot: { jpg: string; webp: { src: string; w: number }[]; w: number; h: number; alt: string };
};

// ✦ Proyectos de la sección "Trabajos". Para agregar uno real, copia el primero y cambia los datos.
export const PROJECTS: Project[] = [
  {
    status: 'live', type: 'Barberías · SaaS', title: 'Reservas para barberías',
    text: 'Plataforma para barberías con web propia: los clientes eligen servicio, barbero y hora, y la cita llega directo por WhatsApp. Se activa el mismo día.',
    points: ['Panel de agenda diaria y semanal por barbero', 'Recordatorios automáticos por WhatsApp', 'Cada barbero con su propio usuario', 'Planes mensuales con 7 días de prueba gratis'],
    tags: ['Next.js', 'Vercel', 'WhatsApp'],
    url: 'https://barberia-reservas-seven.vercel.app/', external: true, wa: 'barberia', frame: 'browser',
    urlLabel: 'barberia-reservas-seven.vercel.app',
    shot: { jpg: '/assets/proyectos/barberia-reservas.jpg', webp: [{ src: '/assets/proyectos/barberia-reservas-640.webp', w: 640 }, { src: '/assets/proyectos/barberia-reservas.webp', w: 1200 }], w: 1200, h: 625, alt: 'Captura de la web de reservas para barberías: agenda en celular y web de Filo Barber Club' },
  },
  {
    status: 'demo', type: 'Restaurantes', title: 'Noir Menu',
    text: 'Menú digital con código QR: el cliente escanea, elige y envía su pedido directo a WhatsApp, sin apps ni comisiones.',
    points: ['Menú con fotos, categorías y buscador', 'Carrito con notas por plato y pedido a WhatsApp', 'Mesa, domicilio o para recoger · QR por mesa'],
    tags: ['React', 'TypeScript', 'Vite'],
    url: '/demos/noir-menu/?mesa=4', external: false, wa: 'menu', frame: 'phone',
    shot: { jpg: '/assets/proyectos/noir-menu.jpg', webp: [{ src: '/assets/proyectos/noir-menu-300.webp', w: 300 }, { src: '/assets/proyectos/noir-menu.webp', w: 520 }], w: 520, h: 1125, alt: 'Captura de Noir Menu: menú digital de Casa Brasa con hamburguesas y pedido en curso' },
  },
  {
    status: 'demo', type: 'E-commerce', title: 'Tienda online',
    text: 'Tienda completa con catálogo, carrito, pagos en línea y un panel para ver ventas y gestionar inventario.',
    points: ['Catálogo con filtros, tallas y ofertas', 'Carrito con cupones y envío gratis por monto', 'Checkout con tarjeta, PSE o contra entrega', 'Panel de ventas, pedidos e inventario'],
    tags: ['React', 'TypeScript', 'Tailwind CSS'],
    url: '/demos/tienda/', external: false, wa: 'tienda', frame: 'browser', urlLabel: 'atelier.tienda',
    shot: { jpg: '/assets/proyectos/tienda-atelier.jpg', webp: [{ src: '/assets/proyectos/tienda-atelier-640.webp', w: 640 }, { src: '/assets/proyectos/tienda-atelier.webp', w: 1200 }], w: 1200, h: 625, alt: 'Captura de la tienda online ATELIER con colección de chaquetas y ponchos' },
  },
];

export const STEPS = [
  { time: 'Día 1 · Gratis', title: 'Idea', tagline: 'Hablamos de tu negocio', text: 'Una charla por WhatsApp o videollamada sobre tus clientes, tu competencia y lo que quieres lograr. Tú hablas de tu negocio; yo me encargo de la parte técnica.', get: 'claridad sobre lo que necesitas (y lo que no).' },
  { time: 'En 24–48 h', title: 'Propuesta', tagline: 'Precio cerrado, por escrito', text: 'Te envío el alcance, la fecha de entrega y un precio fijo. Si te convence, arrancamos con el 50 % de anticipo.', get: 'una propuesta clara, sin letra pequeña.' },
  { time: '2–5 días', title: 'Diseño', tagline: 'Lo ves antes de programarlo', text: 'Diseño tu web a medida, con tu marca, para celular y computador. La ajustamos juntos hasta que te encante.', get: 'el diseño completo para aprobar.' },
  { time: '1–3 semanas', title: 'Código', tagline: 'Avances reales, no promesas', text: 'Programo con tecnologías modernas y te comparto un link de prueba para que veas el progreso en vivo, desde tu celular.', get: 'un link de avance siempre actualizado.' },
  { time: 'Día de entrega', title: 'Lanzamiento', tagline: 'Tu web, en línea y a tu nombre', text: 'La publico en tu dominio, la dejo lista para Google y te enseño a usarla. Pagas el 50 % restante solo cuando la apruebas.', get: 'tu web publicada, todos los accesos, soporte y tu contrato de entrega.' },
];

// Lo que escribe la terminal del panel en cada paso. "$" = comando, "✓"/"✦" = resultado, [[texto]] = resaltado
export const STAGES = [
  { status: 'Conversando', lines: ['$ noir brief --negocio "tu-negocio"', '✓ Objetivo: más clientes por WhatsApp', '✓ Público y competencia analizados', '✓ Plan claro, sin tecnicismos'] },
  { status: 'Propuesta enviada', lines: ['$ noir propuesta --enviar', '✓ Alcance: 5 secciones + formulario', '✓ Entrega: [[2 semanas]]', '✓ Precio cerrado · anticipo 50 %'] },
  { status: 'Diseñando', lines: ['$ noir diseño --preview', '✓ Colores y estilo de tu marca', '✓ Versión celular y computador', '✓ Diseño [[aprobado]] por ti'] },
  { status: 'Programando', lines: ['$ npm run build', '✓ Compilado en 2.1s · 0 errores', '✓ Avance → [[preview.tunegocio.com]]', '✓ Lighthouse [[98]]/100'] },
  { status: 'En línea', lines: ['$ vercel deploy --prod', '✓ Dominio conectado · HTTPS activo', '✓ Lista para Google', '✦ Tu web está en línea → [[tunegocio.com]]'] },
];

export const PROMISES = [
  { icon: '📄', title: 'Precio cerrado', text: 'Lo acordado por escrito es lo que pagas' },
  { icon: '💳', title: '50 % / 50 %', text: 'El resto, solo cuando apruebas' },
  { icon: '💬', title: 'Avances por WhatsApp', text: 'Siempre sabes en qué va tu proyecto' },
  { icon: '🔑', title: 'Todo a tu nombre', text: 'Código, dominio y accesos son tuyos' },
  { icon: '🔒', title: 'Confidencialidad total', text: 'Tu información y tu proyecto no se comparten' },
  { icon: '📝', title: 'Contrato al entregar', text: 'Formaliza la entrega y que todo es tuyo' },
];

export const PERKS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'bolt', title: 'Entrega rápida', text: 'Plazos claros y cumplidos. Una landing puede estar lista en días.' },
  { icon: 'star', title: '100 % a medida', text: 'Nada de plantillas: cada pixel pensado para tu marca.' },
  { icon: 'phone', title: 'Mobile-first', text: 'Diseñado primero para el celular, donde están tus clientes.' },
  { icon: 'search', title: 'Listo para Google', text: 'SEO técnico, velocidad y metadatos para que te encuentren.' },
  { icon: 'shield', title: 'Confidencial y seguro', text: 'Tu información es confidencial y tus datos están protegidos.' },
  { icon: 'chat', title: 'Trato directo', text: 'Hablas conmigo, no con un call center ni con intermediarios.' },
  { icon: 'key', title: 'El proyecto es tuyo', text: 'Código, dominio y accesos a tu nombre, con contrato de entrega.' },
  { icon: 'support', title: 'Soporte real', text: 'Acompañamiento después del lanzamiento, no desaparezco.' },
];

export const FAQ = [
  { q: '¿Cuánto cuesta una página web?', a: 'Una landing page cuesta $890.000, una página web básica $1.690.000 y una corporativa $2.990.000 (pesos colombianos). Las tiendas online van desde $3.490.000, los sistemas a medida desde $4.990.000 y las apps desde $8.900.000. El precio final se confirma por escrito en la propuesta y no incluye dominio, hosting ni comisiones de pasarelas de pago.' },
  { q: '¿Cuánto tiempo tarda mi proyecto?', a: 'Depende del alcance. Una landing page suele estar lista en 5 a 7 días, una web corporativa en 2 a 3 semanas y una tienda online o app en 3 a 6 semanas. En la propuesta recibes la fecha de entrega por escrito.' },
  { q: '¿Cómo es la forma de pago?', a: 'Trabajo con 50 % de anticipo para iniciar y el 50 % restante al entregar el proyecto terminado y aprobado por ti. Así ambos tenemos tranquilidad.' },
  { q: '¿Puedo pedir cambios?', a: 'Sí. El diseño se ajusta contigo antes de programar y hay una revisión final antes de publicar. Los cambios dentro del alcance acordado están incluidos; si surge algo nuevo, lo cotizamos aparte con total transparencia.' },
  { q: 'No tengo logo ni textos, ¿es un problema?', a: 'Para nada. Puedo crear tu identidad de marca (logo, colores, tipografías) y ayudarte a redactar los textos para que comuniquen y vendan.' },
  { q: '¿Qué pasa con el dominio y el hosting?', a: 'Te asesoro para elegir y comprar tu dominio (por ejemplo tunegocio.com) y me encargo de la configuración. Todo queda registrado a tu nombre. Para muchos proyectos el hosting puede ser gratuito o de muy bajo costo.' },
  { q: '¿Mi información y mi proyecto son confidenciales?', a: 'Sí. Todo lo que me compartes (ideas, datos de tu negocio, accesos y archivos) es confidencial y no se comparte con nadie, ni durante ni después del proyecto. Solo muestro un trabajo en mi portafolio si me das tu autorización por escrito.' },
  { q: '¿Recibo algún contrato?', a: 'Sí. Al terminar tu proyecto te entrego un contrato que formaliza la entrega: lo que se hizo, los accesos, que el diseño y el código quedan a tu nombre, la garantía y el compromiso de confidencialidad.' },
  { q: '¿Trabajas con clientes de otros países?', a: 'Sí. Trabajo 100 % remoto con clientes de Colombia y de cualquier país de habla hispana. Coordinamos por WhatsApp, Discord o videollamada y acordamos un método de pago internacional.' },
];


