/* =========================================================
   NOIR STUDIO — interacciones
   ========================================================= */

// ✦ Cambia aquí tu número de WhatsApp (código de país + número, sin "+" ni espacios)
const WHATSAPP_NUMBER = '573135639329';
// ✦ Invitación a la comunidad de Discord
const DISCORD_URL = 'https://discord.gg/fNWeKew86h';

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

  $$('[data-wa]').forEach((a) => { a.href = waLink(a.dataset.wa); });
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
    navLinks.forEach((l) => { const s = $(l.getAttribute('href')); if (s) spy.observe(s); });
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

  /* ---------- Brillo que sigue al cursor ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('.glow').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------- Fondo de estrellas ✦ ---------- */
  const canvas = $('#stars');
  const ctx = canvas && canvas.getContext('2d');
  if (ctx) {
    let w = 0, h = 0, dpr = 1, stars = [], raf = 0, last = 0;

    const makeStar = (randomY = true) => {
      const big = Math.random() < 0.08;
      return {
        x: Math.random() * w,
        y: randomY ? Math.random() * h : h + 10,
        r: big ? 2.6 + Math.random() * 2.2 : 0.7 + Math.random() * 1.5,
        speed: 0.006 + Math.random() * 0.018,          // px por ms
        alpha: 0.25 + Math.random() * 0.55,
        phase: Math.random() * Math.PI * 2,
        tw: 0.0006 + Math.random() * 0.0016,           // velocidad de titileo
        big,
      };
    };

    const resize = () => {
      const newW = window.innerWidth;
      const widthChanged = newW !== w;
      w = newW; h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Solo regenerar si cambia el ancho (evita saltos con la barra del navegador móvil)
      if (widthChanged || !stars.length) {
        const count = Math.max(36, Math.min(130, Math.round((w * h) / 13000)));
        stars = Array.from({ length: count }, () => makeStar(true));
      }
    };

    // Estrella de 4 puntas
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
      for (const s of stars) {
        s.y -= s.speed * dt;
        if (s.y < -12) { Object.assign(s, makeStar(false)); }
        const twinkle = 0.55 + 0.45 * Math.sin(t * s.tw + s.phase);
        const a = s.alpha * twinkle;
        if (s.big) {
          ctx.fillStyle = `rgba(232, 233, 238, ${a * 0.08})`;
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 2.2, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
          drawStar(s.x, s.y, s.r * 2.4);
        } else {
          ctx.fillStyle = `rgba(232, 233, 238, ${a})`;
          drawStar(s.x, s.y, s.r * 1.8);
        }
      }
    };

    const loop = (t) => {
      const dt = Math.min(t - (last || t), 50);
      last = t;
      render(t, dt);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (reducedMotion.matches) { render(0, 0); return; }
      last = 0;
      raf = requestAnimationFrame(loop);
    };

    resize();
    start();
    let rt;
    window.addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => { resize(); if (reducedMotion.matches) render(0, 0); }, 150);
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf); else start();
    });
    reducedMotion.addEventListener('change', start);
  }

  /* ---------- Terminal que se escribe sola ---------- */
  const term = $('#terminal');
  if (term) {
    const code = $('code', term);
    const caret = document.createElement('span');
    caret.className = 'caret';
    caret.setAttribute('aria-hidden', 'true');

    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      code.append('\n', Object.assign(document.createElement('span'), { className: 't-p', textContent: '$ ' }), caret);
    } else {
      // Divide el contenido original en líneas de segmentos {clase, texto}
      const lines = [[]];
      code.childNodes.forEach((n) => {
        const cls = n.nodeType === 1 ? n.className : '';
        n.textContent.split('\n').forEach((part, i) => {
          if (i > 0) lines.push([]);
          if (part) lines[lines.length - 1].push({ cls, text: part });
        });
      });

      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const add = (cls, text = '') => {
        const node = cls ? Object.assign(document.createElement('span'), { className: cls }) : document.createElement('span');
        node.textContent = text;
        code.insertBefore(node, caret);
        return node;
      };

      const type = async () => {
        code.textContent = '';
        code.append(caret);
        await sleep(400);
        for (let li = 0; li < lines.length; li++) {
          const line = lines[li];
          const isCmd = line[0] && line[0].cls === 't-p';
          for (const seg of line) {
            if (isCmd && seg.cls !== 't-p') {
              const node = add(seg.cls);
              for (const ch of seg.text) { node.textContent += ch; await sleep(28 + Math.random() * 45); }
            } else {
              add(seg.cls, seg.text);
            }
          }
          await sleep(isCmd ? 420 : 260);
          if (li < lines.length - 1) add('', '\n');
        }
        add('', '\n');
        add('t-p', '$ ');
      };

      const tio = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) { tio.disconnect(); type(); }
      }, { threshold: 0.45 });
      tio.observe(term);
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
        '✦ *Nueva solicitud de proyecto — Noir Studio*',
        '',
        `👤 *Nombre:* ${v('nombre')}`,
        `🏢 *Negocio:* ${v('negocio') || 'No especificado'}`,
        `🧩 *Necesito:* ${v('necesidad')}`,
        `💰 *Presupuesto:* ${v('presupuesto')}${form.elements.moneda && !/[A-Z]{3}$/.test(v('presupuesto')) ? ` (moneda: ${v('moneda')})` : ''}`,
        '',
        '📝 *Mensaje:*',
        v('mensaje'),
        '',
        '🌐 Enviado desde la web de Noir Studio',
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
