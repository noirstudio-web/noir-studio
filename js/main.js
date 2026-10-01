/* =========================================================
   NOIR STUDIO — interacciones
   ========================================================= */

// ✦ Cambia aquí tu número de WhatsApp (código de país + número, sin "+" ni espacios)
const WHATSAPP_NUMBER = '573135639329';
// ✦ Invitación a la comunidad de Discord
const DISCORD_URL = 'https://discord.gg/fNWeKew86h';

// ✦ Mensajes que llegan a tu WhatsApp desde cada botón de la web.
//   El cliente solo completa los espacios después de cada ":" antes de enviar.
const WA_MESSAGES = {
  // Botones "Cotizar mi proyecto", tarjeta de WhatsApp y footer
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
  // Proyecto real: reservas para barberías
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
  // Demo Noir Menu
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
  // Demo Tienda online
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
  // Botón verde flotante
  flotante: [
    '¡Hola, Noir Studio! 👋',
    'Estoy viendo tu web y me gustaría hablar sobre un proyecto para mi negocio.',
    '',
    '📌 *Mi negocio:* ',
    '🧩 *Lo que tengo en mente:* ',
  ],
};

(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Enlaces de WhatsApp y Discord ---------- */
  const waLink = (msg) =>
    `https://wa.me/${WHATSAPP_NUMBER}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`;

  const formatPhone = (n) => {
    // +57 313 563 9329 para números colombianos; para otros, solo antepone "+"
    const m = /^57(\d{3})(\d{3})(\d{4})$/.exec(n);
    return m ? `+57 ${m[1]} ${m[2]} ${m[3]}` : `+${n}`;
  };

  $$('[data-wa]').forEach((a) => {
    const msg = WA_MESSAGES[a.dataset.wa];
    a.href = waLink(msg ? msg.join('\n') : a.dataset.wa);
  });
  $$('[data-wa-display]').forEach((el) => { el.textContent = formatPhone(WHATSAPP_NUMBER); });
  $$('[data-discord]').forEach((a) => { a.href = DISCORD_URL; });

  /* ---------- Año automático ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Navbar: blur al hacer scroll + menú móvil ---------- */
  const nav = $('#nav');
  const toggle = $('#nav-toggle');
  const menu = $('#nav-menu');

  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.documentElement.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Enlace activo según la sección visible ---------- */
  const navLinks = $$('.nav__links a');
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach((l) => {
      const href = l.getAttribute('href');
      const s = href.startsWith('#') && $(href);
      if (s) spy.observe(s);
    });
  }

  /* ---------- Aparición al hacer scroll ---------- */
  const reveals = $$('.reveal');
  // Escalonado entre hermanos (tarjetas, pasos, etc.)
  reveals.forEach((el) => {
    const siblings = Array.from(el.parentElement.children).filter((c) => c.classList.contains('reveal'));
    const i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty('--d', `${Math.min(i, 6) * 80}ms`);
  });

  if (!('IntersectionObserver' in window) || reducedMotion.matches) {
    reveals.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
    // Red de seguridad: nada se queda invisible
    window.addEventListener('load', () => setTimeout(() => {
      reveals.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in');
      });
    }, 1200));
  }

  /* =========================================================
     EXPERIENCIA INMERSIVA
     Puntero / giroscopio → estrellas 3D, monograma 3D y tarjetas que se inclinan
     ========================================================= */
  const immersive = !reducedMotion.matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  // Posición del puntero normalizada de -1 a 1 (la comparten todas las capas)
  const pointer = { x: 0, y: 0, seen: false };
  window.addEventListener('pointermove', (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    pointer.px = e.clientX; pointer.py = e.clientY; pointer.seen = true;
  }, { passive: true });
  // En celulares Android, inclinar el teléfono mueve la escena
  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma == null || e.beta == null) return;
    pointer.x = clamp(e.gamma / 30, -1, 1);
    pointer.y = clamp((e.beta - 45) / 30, -1, 1);
  }, { passive: true });

  /* ---------- Tarjetas: brillo + inclinación 3D ---------- */
  if (finePointer) {
    const active = new Set();
    let tiltRaf = 0;
    const tiltLoop = () => {
      active.forEach((t) => {
        t.rx += (t.trx - t.rx) * 0.14;
        t.ry += (t.tryy - t.ry) * 0.14;
        t.lift += (t.tlift - t.lift) * 0.14;
        t.el.style.transform = `perspective(1000px) rotateX(${t.rx.toFixed(2)}deg) rotateY(${t.ry.toFixed(2)}deg) translateY(${t.lift.toFixed(2)}px)`;
        if (!t.on && Math.abs(t.rx) + Math.abs(t.ry) + Math.abs(t.lift) < 0.05) {
          t.el.style.transform = '';
          t.el.classList.remove('is-tilting');
          active.delete(t);
        }
      });
      tiltRaf = active.size ? requestAnimationFrame(tiltLoop) : 0;
    };

    $$('.glow').forEach((el) => {
      const max = el.matches('.project__media') ? 4 : 7;            // grados máximos
      const lift = el.matches('.card') ? -8 : el.matches('.project__media') ? -2 : -6;
      const t = { el, rx: 0, ry: 0, lift: 0, trx: 0, tryy: 0, tlift: 0, on: false };
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        el.style.setProperty('--mx', `${x}px`);
        el.style.setProperty('--my', `${y}px`);
        if (!immersive) return;
        t.on = true;
        t.tryy = (x / r.width - 0.5) * 2 * max;
        t.trx = -(y / r.height - 0.5) * 2 * max;
        t.tlift = lift;
        el.classList.add('is-tilting');
        active.add(t);
        if (!tiltRaf) tiltRaf = requestAnimationFrame(tiltLoop);
      });
      el.addEventListener('pointerleave', () => { t.on = false; t.trx = 0; t.tryy = 0; t.tlift = 0; });
    });
  }

  /* ---------- Escena: estrellas 3D, monograma, luz y progreso ---------- */
  const canvas = $('#stars');
  const ctx = canvas && canvas.getContext('2d');
  const hero = $('.hero');
  const mono = $('.mono');
  const heroCopy = $('.hero__copy');
  const heroArt = $('.hero__art');

  let spot = null, progress = null;
  if (immersive) {
    progress = Object.assign(document.createElement('div'), { className: 'scroll-progress' });
    progress.setAttribute('aria-hidden', 'true');
    document.body.append(progress);
    if (finePointer && canvas) {
      spot = Object.assign(document.createElement('div'), { className: 'spotlight' });
      spot.setAttribute('aria-hidden', 'true');
      canvas.after(spot);
    }
  }

  if (ctx) {
    let w = 0, h = 0, dpr = 1, stars = [], raf = 0, last = 0;
    let sx = 0, sy = 0;                         // puntero suavizado
    let scrollVel = 0, lastScroll = window.scrollY, warp = 0;

    // Cada estrella vive en un espacio 3D: x, y de -1 a 1 y profundidad z (1 = lejos, 0 = encima tuyo)
    const makeStar = (z = Math.random()) => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: Math.max(0.08, z),
      big: Math.random() < 0.07,
      phase: Math.random() * Math.PI * 2,
      tw: 0.0008 + Math.random() * 0.0016,
      px: null, py: null,
    });

    const resize = () => {
      const newW = window.innerWidth;
      const widthChanged = newW !== w;
      w = newW; h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (widthChanged || !stars.length) {
        const count = clamp(Math.round((w * h) / 8000), 60, 220);
        stars = Array.from({ length: count }, () => makeStar());
      }
    };

    // Estrella de 4 puntas ✦
    const drawStar = (x, y, r) => {
      const k = r * 0.16;
      ctx.beginPath();
      ctx.moveTo(x, y - r);
      ctx.quadraticCurveTo(x + k, y - k, x + r, y);
      ctx.quadraticCurveTo(x + k, y + k, x, y + r);
      ctx.quadraticCurveTo(x - k, y + k, x - r, y);
      ctx.quadraticCurveTo(x - k, y - k, x, y - r);
      ctx.fill();
    };

    const render = (t, dt) => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2 + sx * -w * 0.04;
      const cy = h / 2 + sy * -h * 0.04;
      const spread = Math.max(w, h) * 0.55;
      const speed = 0.000035 + warp;          // avance en profundidad por ms
      const streak = warp > 0.00012;

      for (const s of stars) {
        const pz = s.z;
        s.z -= speed * dt;
        if (s.z <= 0.06) { Object.assign(s, makeStar(1)); continue; }
        const scale = 1 / s.z;
        const x = cx + s.x * spread * scale * 0.5 - sx * 26 * scale;
        const y = cy + s.y * spread * scale * 0.5 - sy * 26 * scale;
        if (x < -60 || x > w + 60 || y < -60 || y > h + 60) { Object.assign(s, makeStar(1)); continue; }

        const near = 1 - s.z;                                  // 0 lejos → 1 cerca
        const twinkle = 0.6 + 0.4 * Math.sin(t * s.tw + s.phase);
        const a = clamp(0.12 + near * 1.6, 0, 1) * twinkle * (s.big ? 1 : 0.85);
        const r = (0.35 + near * near * 2.6) * (s.big ? 2.2 : 1);

        if (streak && s.px != null && pz !== s.z) {           // salto a velocidad warp
          ctx.strokeStyle = `rgba(232, 233, 238, ${a * 0.55})`;
          ctx.lineWidth = Math.max(0.6, r * 0.45);
          ctx.beginPath(); ctx.moveTo(s.px, s.py); ctx.lineTo(x, y); ctx.stroke();
        }
        if (s.big && near > 0.35) {
          ctx.fillStyle = `rgba(232, 233, 238, ${a * 0.07})`;
          ctx.beginPath(); ctx.arc(x, y, r * 2.4, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = `rgba(${s.big ? '255, 255, 255' : '232, 233, 238'}, ${a})`;
        drawStar(x, y, r * 1.8);
        s.px = x; s.py = y;
      }
    };

    // Alturas cacheadas: se actualizan solo cuando cambia el tamaño de la página
    let heroH = hero ? hero.offsetHeight : 1;
    let docMax = document.documentElement.scrollHeight - window.innerHeight;
    const measure = () => {
      heroH = hero ? hero.offsetHeight : 1;
      docMax = document.documentElement.scrollHeight - window.innerHeight;
    };
    if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.body);
    window.addEventListener('resize', measure);

    // Monograma, luz del cursor y barra de progreso (una sola vuelta por cuadro)
    let lastP = -1;
    const scene = () => {
      sx += (pointer.x - sx) * 0.05;
      sy += (pointer.y - sy) * 0.05;

      const y = window.scrollY;
      scrollVel += ((y - lastScroll) - scrollVel) * 0.2;
      lastScroll = y;
      warp += (clamp(Math.abs(scrollVel) * 0.000014, 0, 0.0011) - warp) * 0.08;

      if (mono) mono.style.transform = `rotateX(${(-sy * 16).toFixed(2)}deg) rotateY(${(sx * 22).toFixed(2)}deg)`;

      // Al bajar, "atraviesas" el hero: el texto se aleja y el monograma viene hacia ti
      if (hero) {
        const p = clamp(y / (heroH * 0.85), 0, 1);
        if (Math.abs(p - lastP) > 0.001) {
          lastP = p;
          if (p > 0) {
            heroCopy.style.transform = `translate3d(0, ${(p * 90).toFixed(1)}px, 0)`;
            heroCopy.style.opacity = String(clamp(1 - p * 1.25, 0, 1));
            heroArt.style.transform = `translate3d(0, ${(p * -30).toFixed(1)}px, 0) scale(${(1 + p * 0.5).toFixed(3)})`;
            heroArt.style.opacity = String(clamp(1 - p * 1.1, 0, 1));
          } else {
            heroCopy.style.transform = heroCopy.style.opacity = heroArt.style.transform = heroArt.style.opacity = '';
          }
        }
      }

      if (spot && pointer.seen) {
        spot.classList.add('is-on');
        spot.style.transform = `translate3d(${pointer.px}px, ${pointer.py}px, 0)`;
      }
      if (progress) {
        progress.style.transform = `scaleX(${docMax > 0 ? clamp(y / docMax, 0, 1).toFixed(4) : 0})`;
      }
    };

    const loop = (t) => {
      const dt = Math.min(t - (last || t), 50);
      last = t;
      scene();
      render(t, dt);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (!immersive) { render(0, 0); return; }
      last = 0;
      raf = requestAnimationFrame(loop);
    };

    resize();
    start();
    let rt;
    window.addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => { resize(); if (!immersive) render(0, 0); }, 150);
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf); else start();
    });
  }

  /* ---------- Proceso: pasos + panel de seguimiento ---------- */
  const stepsEl = $('#steps');
  const term = $('#terminal');
  if (stepsEl && term) {
    // Lo que muestra el panel en cada paso. "$" = comando, "✓"/"✦" = resultado, [[texto]] = resaltado
    const STAGES = [
      { status: 'Conversando', lines: ['$ noir brief --negocio "tu-negocio"', '✓ Objetivo: más clientes por WhatsApp', '✓ Público y competencia analizados', '✓ Plan claro, sin tecnicismos'] },
      { status: 'Propuesta enviada', lines: ['$ noir propuesta --enviar', '✓ Alcance: 5 secciones + formulario', '✓ Entrega: [[2 semanas]]', '✓ Precio cerrado · anticipo 50 %'] },
      { status: 'Diseñando', lines: ['$ noir diseño --preview', '✓ Colores y estilo de tu marca', '✓ Versión celular y computador', '✓ Diseño [[aprobado]] por ti'] },
      { status: 'Programando', lines: ['$ npm run build', '✓ Compilado en 2.1s · 0 errores', '✓ Avance → [[preview.tunegocio.com]]', '✓ Lighthouse [[98]]/100'] },
      { status: 'En línea', lines: ['$ vercel deploy --prod', '✓ Dominio conectado · HTTPS activo', '✓ Lista para Google', '✦ Tu web está en línea → [[tunegocio.com]]'] },
    ];
    const steps = $$('.step', stepsEl);
    const miles = $$('#trk-miles li');
    const statusEl = $('#trk-status');
    const code = $('code', term);
    const last = STAGES.length - 1;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const animate = !reducedMotion.matches && 'IntersectionObserver' in window;

    const caret = Object.assign(document.createElement('span'), { className: 'caret' });
    caret.setAttribute('aria-hidden', 'true');
    const span = (cls, text = '') => {
      const el = document.createElement('span');
      if (cls) el.className = cls;
      el.textContent = text;
      return el;
    };
    // Convierte "✓ Entrega: [[2 semanas]]" en nodos con sus colores
    const outputNodes = (line) => {
      const nodes = [span(line[0] === '✦' ? 't-star' : 't-ok', line[0])];
      line.slice(1).split(/(\[\[.*?\]\])/).forEach((part) => {
        if (part) nodes.push(part.startsWith('[[') ? span('t-hl', part.slice(2, -2)) : document.createTextNode(part));
      });
      return nodes;
    };

    let run = 0;
    const typeStage = async (i) => {
      const id = ++run;
      code.textContent = '';
      code.append(caret);
      for (const [n, line] of STAGES[i].lines.entries()) {
        if (n) code.insertBefore(document.createTextNode('\n'), caret);
        if (line.startsWith('$')) {
          code.insertBefore(span('t-p', '$'), caret);
          const cmd = code.insertBefore(span(''), caret);
          if (!animate) { cmd.textContent = line.slice(1); continue; }
          for (const ch of line.slice(1)) {
            if (id !== run) return false;
            cmd.textContent += ch;
            await sleep(24 + Math.random() * 40);
          }
          await sleep(380);
        } else {
          outputNodes(line).forEach((node) => code.insertBefore(node, caret));
          if (animate) await sleep(300);
        }
        if (id !== run) return false;
      }
      return true;
    };

    let current = last;
    const setStep = (i) => {
      current = i;
      steps.forEach((el, n) => {
        el.classList.toggle('is-active', n === i);
        el.classList.toggle('is-done', n < i || i === last);
        el.querySelector('.step__btn').setAttribute('aria-pressed', String(n === i));
      });
      miles.forEach((el, n) => {
        el.classList.toggle('is-active', n === i);
        el.classList.toggle('is-done', n < i || i === last);
      });
      const pct = Math.round(((i + 1) / STAGES.length) * 100);
      stepsEl.style.setProperty('--fill', String((i / last) * 100));
      $('#trk-bar').style.width = `${pct}%`;
      $('#trk-pct').textContent = `${pct} %`;
      statusEl.lastElementChild.textContent = STAGES[i].status;
      statusEl.classList.toggle('is-working', i < last);
      return typeStage(i);
    };

    // Clic en un paso: lo muestra y detiene el recorrido automático
    let manual = false;
    steps.forEach((el, n) => el.addEventListener('click', () => { manual = true; setStep(n); }));

    if (!animate) {
      setStep(last);
    } else {
      // Recorrido automático mientras el panel está en pantalla
      let visible = false, looping = false;
      const loop = async () => {
        if (looping) return;
        looping = true;
        let i = current === last ? 0 : current + 1;
        while (visible && !manual) {
          const done = await setStep(i);
          if (!done) break;
          await sleep(i === last ? 4200 : 2200);
          i = i === last ? 0 : i + 1;
        }
        looping = false;
      };
      new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        if (visible && !manual) loop();
      }, { threshold: 0.35 }).observe($('#tracker'));
    }
  }

  /* ---------- Presupuesto en cualquier moneda ---------- */
  const currencySel = $('#f-currency');
  const budgetSel = $('#f-budget');
  if (currencySel && budgetSel) {
    // Rangos base en pesos colombianos (cámbialos aquí si ajustas tus precios)
    const BUDGET_COP = [
      { max: 1000000 },
      { min: 1000000, max: 3000000 },
      { min: 3000000, max: 6000000 },
      { min: 6000000 },
    ];
    const UNSURE = 'Aún no lo tengo claro';
    const RATES_URL = 'https://open.er-api.com/v6/latest/USD';   // gratis, sin clave, se actualiza a diario
    const CACHE_KEY = 'noir-rates';
    // Respaldo aproximado (USD = 1) por si no hay conexión con el servicio de tasas
    const FALLBACK = { USD: 1, COP: 3334, MXN: 18.1, EUR: 0.88, ARS: 1518, PEN: 3.44, CLP: 973, BRL: 5.2 };
    // Monedas que aparecen primero en la lista
    const FEATURED = ['COP', 'USD', 'MXN', 'EUR', 'ARS', 'CLP', 'PEN', 'BRL', 'UYU', 'BOB', 'PYG', 'VES', 'GTQ', 'CRC', 'DOP', 'HNL', 'NIO', 'PAB', 'CAD', 'GBP'];
    // Zona horaria del visitante → moneda sugerida
    const TZ_CURRENCY = {
      'America/Bogota': 'COP', 'America/Mexico_City': 'MXN', 'America/Monterrey': 'MXN', 'America/Cancun': 'MXN',
      'America/Merida': 'MXN', 'America/Chihuahua': 'MXN', 'America/Hermosillo': 'MXN', 'America/Mazatlan': 'MXN',
      'America/Tijuana': 'MXN', 'America/Argentina/Buenos_Aires': 'ARS', 'America/Buenos_Aires': 'ARS',
      'America/Argentina/Cordoba': 'ARS', 'America/Argentina/Mendoza': 'ARS', 'America/Santiago': 'CLP',
      'America/Lima': 'PEN', 'America/Guayaquil': 'USD', 'America/Caracas': 'VES', 'America/La_Paz': 'BOB',
      'America/Asuncion': 'PYG', 'America/Montevideo': 'UYU', 'America/Sao_Paulo': 'BRL', 'America/Guatemala': 'GTQ',
      'America/Costa_Rica': 'CRC', 'America/Santo_Domingo': 'DOP', 'America/Tegucigalpa': 'HNL', 'America/Managua': 'NIO',
      'America/Panama': 'USD', 'America/El_Salvador': 'USD', 'America/Puerto_Rico': 'USD', 'America/New_York': 'USD',
      'America/Chicago': 'USD', 'America/Denver': 'USD', 'America/Los_Angeles': 'USD', 'America/Phoenix': 'USD',
      'America/Toronto': 'CAD', 'America/Vancouver': 'CAD', 'Europe/Madrid': 'EUR', 'Atlantic/Canary': 'EUR', 'Europe/London': 'GBP',
    };

    const store = {
      get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
      set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } },
    };

    let rates = FALLBACK;
    let names;
    try { names = new Intl.DisplayNames(['es'], { type: 'currency' }); } catch { names = null; }
    const nameOf = (code) => {
      let n = '';
      try { n = names && names.of(code); } catch { n = ''; }
      return n && n !== code ? n.charAt(0).toUpperCase() + n.slice(1) : code;
    };

    // Redondeo "bonito": 2 cifras significativas (4.312 → 4.300; 1.517.520 → 1.500.000)
    const nice = (x) => {
      if (x < 10) return Math.max(1, Math.round(x));
      const mag = Math.pow(10, Math.floor(Math.log10(x)) - 1);
      return Math.round(x / mag) * mag;
    };
    const num = (n) => new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(n);

    const convert = (cop, code) => (code === 'COP' ? cop : nice((cop / rates.COP) * rates[code]));

    const renderBudget = () => {
      const code = currencySel.value;
      if (!rates[code] || !rates.COP) return;
      const prevIndex = budgetSel.selectedIndex;
      const labels = BUDGET_COP.map((r) => {
        if (r.min == null) return `Menos de ${num(convert(r.max, code))} ${code}`;
        if (r.max == null) return `Más de ${num(convert(r.min, code))} ${code}`;
        return `${num(convert(r.min, code))} – ${num(convert(r.max, code))} ${code}`;
      });
      budgetSel.innerHTML = '';
      budgetSel.append(new Option('Selecciona un rango', ''));
      labels.concat(UNSURE).forEach((l) => budgetSel.append(new Option(l, l)));
      budgetSel.selectedIndex = prevIndex;
      const approx = code !== 'COP';
      $('#f-currency-hint').textContent = approx ? 'Valores aproximados según la tasa del día' : 'Elige la de tu país';
    };

    const renderCurrencies = (selected) => {
      const codes = Object.keys(rates).sort((a, b) => nameOf(a).localeCompare(nameOf(b), 'es'));
      const featured = FEATURED.filter((c) => rates[c]);
      currencySel.innerHTML = '';
      const g1 = Object.assign(document.createElement('optgroup'), { label: 'Más usadas' });
      featured.forEach((c) => g1.append(new Option(`${c} · ${nameOf(c)}`, c)));
      const g2 = Object.assign(document.createElement('optgroup'), { label: 'Todas las monedas' });
      codes.filter((c) => !featured.includes(c)).forEach((c) => g2.append(new Option(`${c} · ${nameOf(c)}`, c)));
      currencySel.append(g1, g2);
      currencySel.value = rates[selected] ? selected : 'COP';
    };

    const guessCurrency = () => {
      const saved = store.get('noir-currency');
      if (saved) return saved;
      let tz = '';
      try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { /* sin zona */ }
      if (TZ_CURRENCY[tz]) return TZ_CURRENCY[tz];
      if (/^Europe\//.test(tz)) return 'EUR';
      return 'COP';
    };

    const init = (selected) => { renderCurrencies(selected); renderBudget(); };

    currencySel.addEventListener('change', () => { store.set('noir-currency', currencySel.value); renderBudget(); });

    const cached = store.get(CACHE_KEY);
    const wanted = guessCurrency();
    if (cached && cached.rates && Date.now() - cached.t < 12 * 3600e3) {
      rates = cached.rates;
      init(wanted);
    } else {
      init(wanted); // primero con el respaldo, luego con tasas reales
      fetch(RATES_URL)
        .then((r) => r.json())
        .then((d) => {
          if (d.result !== 'success' || !d.rates || !d.rates.COP) return;
          rates = d.rates;
          store.set(CACHE_KEY, { t: Date.now(), rates });
          init(currencySel.value || wanted);
        })
        .catch(() => { /* se queda con el respaldo */ });
    }
  }

  /* ---------- Formulario → WhatsApp ---------- */
  const form = $('#quote-form');
  if (form) {
    const status = $('#form-status');
    const rules = {
      nombre: (v) => (v.length >= 2 ? '' : 'Escribe tu nombre.'),
      negocio: () => '',
      necesidad: (v) => (v ? '' : 'Elige qué necesitas.'),
      presupuesto: (v) => (v ? '' : 'Elige un rango de presupuesto.'),
      mensaje: (v) => (v.length >= 10 ? '' : 'Cuéntame un poco más sobre tu proyecto (mínimo 10 caracteres).'),
    };
    let tried = false;

    const check = (field) => {
      const msg = rules[field.name](field.value.trim());
      const err = document.getElementById(field.getAttribute('aria-describedby'));
      field.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) err.textContent = msg;
      return !msg;
    };

    form.addEventListener('input', (e) => { if (tried && rules[e.target.name]) check(e.target); });
    form.addEventListener('change', (e) => { if (tried && rules[e.target.name]) check(e.target); });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      tried = true;
      const fields = Object.keys(rules).map((n) => form.elements[n]);
      const invalid = fields.filter((f) => !check(f));
      if (invalid.length) {
        invalid[0].focus();
        if (status) status.textContent = 'Revisa los campos marcados.';
        return;
      }

      const v = (n) => form.elements[n].value.trim();
      const text = [
        '¡Hola, Noir Studio! 👋',
        'Llené el formulario de tu web y quiero cotizar este proyecto:',
        '',
        `👤 *Nombre:* ${v('nombre')}`,
        `🏢 *Negocio:* ${v('negocio') || 'No especificado'}`,
        `🧩 *Necesito:* ${v('necesidad')}`,
        `💰 *Presupuesto:* ${v('presupuesto')}${form.elements.moneda && !/[A-Z]{3}$/.test(v('presupuesto')) ? ` (moneda: ${v('moneda')})` : ''}`,
        '',
        '📝 *Sobre mi proyecto:*',
        v('mensaje'),
        '',
        'Quedo atento(a) a tu propuesta. ¡Gracias! ✦',
      ].join('\n');

      const url = waLink(text);
      const a = Object.assign(document.createElement('a'), { href: url, target: '_blank', rel: 'noopener' });
      document.body.append(a);
      a.click();
      a.remove();

      if (status) {
        status.innerHTML = '';
        status.append('✦ ¡Listo! Se abrió WhatsApp con tu mensaje. ¿No se abrió? ');
        const retry = Object.assign(document.createElement('a'), { href: url, target: '_blank', rel: 'noopener', textContent: 'Toca aquí' });
        status.append(retry, '.');
      }
    });
  }
})();
