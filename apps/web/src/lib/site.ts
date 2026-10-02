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
export const WHATSAPP_PARTS = ['57', '313', '563', '9329'] as const;
export const DISCORD_URL = 'https://discord.gg/fNWeKew86h';

export type WaKey = 'cotizar' | 'barberia' | 'menu' | 'tienda' | 'flotante' | 'terminos';

// ✦ Mensajes que llegan a tu WhatsApp desde cada botón. El cliente completa los espacios.
export const WA_MESSAGES: Record<WaKey, string[]> = {
  cotizar: [
    '¡Hola, Noir Studio! 👋',
    'Vengo de tu web y quiero cotizar un proyecto.',
    '',
    '📌 *Mi negocio:* ',
    '🧩 *Lo que necesito:* (página web, tienda online, app, sistema…)',
    '🎯 *Objetivo:* (vender más, recibir reservas, verme profesional…)',
    '📅 *Para cuándo lo necesito:* ',
    '💰 *Presupuesto aproximado:* ',
    '',
    '¿Me cuentas cómo trabajas y qué incluye?',
  ],
  barberia: [
    '¡Hola, Noir Studio! 💈',
    'Vi tu plataforma de reservas para barberías y la quiero para mi negocio.',
    '',
    '📌 *Nombre de la barbería:* ',
    '👥 *Número de barberos:* ',
    '📍 *Ciudad:* ',
    '📲 *Instagram o web actual:* ',
    '',
    '¿Me explicas los planes y cómo activo la prueba gratis de 7 días?',
  ],
  menu: [
    '¡Hola, Noir Studio! 🍽️',
    'Probé la demo de Noir Menu y quiero un menú digital para mi restaurante.',
    '',
    '📌 *Nombre del restaurante:* ',
    '🍔 *Cantidad aproximada de platos:* ',
    '🛵 *Pedidos para:* (mesa / domicilio / para recoger / todos)',
    '📍 *Ciudad:* ',
    '',
    '¿Cuánto costaría y en cuánto tiempo estaría listo?',
  ],
  tienda: [
    '¡Hola, Noir Studio! 🛍️',
    'Probé la demo de la tienda online y quiero una para mi negocio.',
    '',
    '📌 *Mi negocio:* ',
    '👕 *Qué vendo:* ',
    '📦 *Cantidad aproximada de productos:* ',
    '💳 *Cómo quiero cobrar:* (tarjeta, PSE, Nequi, contra entrega…)',
    '🚚 *¿Hago envíos?:* ',
    '',
    '¿Me ayudas con una cotización?',
  ],
  flotante: [
    '¡Hola, Noir Studio! 👋',
    'Estoy viendo tu web y me gustaría hablar sobre un proyecto para mi negocio.',
    '',
    '📌 *Mi negocio:* ',
    '🧩 *Lo que tengo en mente:* ',
  ],
  terminos: ['Hola, Noir Studio 👋 Leí los términos y condiciones y tengo una pregunta:'],
};

// ✦ Rangos de presupuesto en pesos colombianos (las demás monedas se calculan solas)
export const BUDGET_COP: { min?: number; max?: number }[] = [
  { max: 1_000_000 },
  { min: 1_000_000, max: 3_000_000 },
  { min: 3_000_000, max: 6_000_000 },
  { min: 6_000_000 },
];

// ✦ Tecnologías de la cinta
export const TECH = [
  'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Astro', 'Vite', 'Tailwind CSS',
  'Node.js', 'Express', 'Python', 'PostgreSQL', 'MySQL', 'MongoDB', 'Supabase', 'Firebase', 'Prisma',
  'Git', 'GitHub', 'Docker',
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
  | 'bolt' | 'phone' | 'search' | 'shield' | 'chat' | 'key' | 'support';

export const SERVICES: { icon: IconName; title: string; text: string; tags: string[] }[] = [
  { icon: 'web', title: 'Páginas web', text: 'Sitios corporativos y de marca personal que transmiten confianza y convierten visitas en clientes.', tags: ['Corporativas', 'Portafolios', 'SEO'] },
  { icon: 'landing', title: 'Landing pages', text: 'Una página enfocada en una sola acción: vender, captar contactos o lanzar tu producto.', tags: ['Campañas', 'Lanzamientos', 'Ads'] },
  { icon: 'store', title: 'Tiendas online', text: 'Catálogo, carrito, pagos en línea y panel para gestionar productos y pedidos sin depender de nadie.', tags: ['E-commerce', 'Pagos', 'Inventario'] },
  { icon: 'app', title: 'Apps', text: 'Aplicaciones web progresivas que se instalan en el celular y funcionan rápido en cualquier dispositivo.', tags: ['PWA', 'Mobile-first', 'Tiempo real'] },
  { icon: 'system', title: 'Sistemas', text: 'Reservas, inventarios, dashboards y paneles administrativos hechos a la medida de tu operación.', tags: ['Dashboards', 'Reservas', 'APIs'] },
  { icon: 'star', title: 'Branding', text: 'Logo, paleta, tipografías y piezas para redes: una identidad coherente para que tu marca se recuerde.', tags: ['Logo', 'Identidad', 'Redes'] },
];

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
  { time: 'Día de entrega', title: 'Lanzamiento', tagline: 'Tu web, en línea y a tu nombre', text: 'La publico en tu dominio, la dejo lista para Google y te enseño a usarla. Pagas el 50 % restante solo cuando la apruebas.', get: 'tu web publicada, todos los accesos y soporte.' },
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
];

export const PERKS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'bolt', title: 'Entrega rápida', text: 'Plazos claros y cumplidos. Una landing puede estar lista en días.' },
  { icon: 'star', title: '100 % a medida', text: 'Nada de plantillas: cada pixel pensado para tu marca.' },
  { icon: 'phone', title: 'Mobile-first', text: 'Diseñado primero para el celular, donde están tus clientes.' },
  { icon: 'search', title: 'Listo para Google', text: 'SEO técnico, velocidad y metadatos para que te encuentren.' },
  { icon: 'shield', title: 'Seguro', text: 'HTTPS, buenas prácticas y datos protegidos desde el primer día.' },
  { icon: 'chat', title: 'Trato directo', text: 'Hablas conmigo, no con un call center ni con intermediarios.' },
  { icon: 'key', title: 'El proyecto es tuyo', text: 'Código, dominio y accesos quedan a tu nombre. Sin ataduras.' },
  { icon: 'support', title: 'Soporte real', text: 'Acompañamiento después del lanzamiento, no desaparezco.' },
];

export const FAQ = [
  { q: '¿Cuánto tiempo tarda mi proyecto?', a: 'Depende del alcance. Una landing page suele estar lista en 5 a 7 días, una web corporativa en 2 a 3 semanas y una tienda online o app en 3 a 6 semanas. En la propuesta recibes la fecha de entrega por escrito.' },
  { q: '¿Cómo es la forma de pago?', a: 'Trabajo con 50 % de anticipo para iniciar y el 50 % restante al entregar el proyecto terminado y aprobado por ti. Así ambos tenemos tranquilidad.' },
  { q: '¿Puedo pedir cambios?', a: 'Sí. El diseño se ajusta contigo antes de programar y hay una revisión final antes de publicar. Los cambios dentro del alcance acordado están incluidos; si surge algo nuevo, lo cotizamos aparte con total transparencia.' },
  { q: 'No tengo logo ni textos, ¿es un problema?', a: 'Para nada. Puedo crear tu identidad de marca (logo, colores, tipografías) y ayudarte a redactar los textos para que comuniquen y vendan.' },
  { q: '¿Qué pasa con el dominio y el hosting?', a: 'Te asesoro para elegir y comprar tu dominio (por ejemplo tunegocio.com) y me encargo de la configuración. Todo queda registrado a tu nombre. Para muchos proyectos el hosting puede ser gratuito o de muy bajo costo.' },
  { q: '¿Trabajas con clientes de otros países?', a: 'Sí. Trabajo 100 % remoto con clientes de Colombia y de cualquier país de habla hispana. Coordinamos por WhatsApp, Discord o videollamada y acordamos un método de pago internacional.' },
];

export const NEEDS = ['Página web', 'Landing page', 'Tienda online', 'App', 'Sistema a medida', 'Branding', 'Otro / no estoy seguro'];
