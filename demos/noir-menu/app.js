'use strict';

// ✦ Seguridad: impide que otra web muestre esta página dentro de un marco (clickjacking)
if (window.top !== window.self) {
  document.documentElement.style.display = 'none';
  try { window.top.location.replace(window.self.location.href); } catch (e) { /* el navegador lo bloqueó: la página queda oculta */ }
}

// Número que recibe los pedidos (código de país + número)
const WHATSAPP_NUMBER = ['57', '313', '563', '9329'].join('');

const MENU = [
  { cat: 'Hamburguesas', items: [
    { id: 'b1', name: 'Burger Noir', desc: 'Doble carne angus, cheddar añejo, cebolla caramelizada y salsa de la casa.', price: 28000, img: 'burger-noir', badge: 'Más pedido' },
    { id: 'b2', name: 'Smash con papas', desc: 'Carne smash crocante, queso americano, pepinillos y papas rústicas.', price: 26000, img: 'smash-papas' },
    { id: 'b3', name: 'Doble Bacon', desc: 'Dos carnes, tocineta ahumada, cheddar y BBQ de panela.', price: 32000, img: 'doble-bacon', badge: 'Nuevo' },
  ]},
  { cat: 'Platos fuertes', items: [
    { id: 'f1', name: 'Lomo a la brasa', desc: 'Lomo fino 300 g con papas a la francesa y chimichurri.', price: 46000, img: 'lomo-papas', badge: 'Recomendado' },
    { id: 'f2', name: 'Penne arrabbiata', desc: 'Pasta corta en salsa de tomate picante, albahaca y parmesano.', price: 29000, img: 'penne', badge: 'Picante' },
    { id: 'f3', name: 'Arroz con camarones', desc: 'Arroz cremoso, camarones salteados, cilantro y limón.', price: 38000, img: 'arroz-camarones' },
    { id: 'f4', name: 'Pizza de la casa', desc: 'Masa madre, pepperoni, cebolla morada y albahaca fresca.', price: 34000, img: 'pizza' },
    { id: 'f5', name: 'Ensalada de lomo', desc: 'Lomo en tiras, hojas verdes, marañón y vinagreta de ají.', price: 31000, img: 'ensalada-lomo' },
  ]},
  { cat: 'Bowls', items: [
    { id: 'w1', name: 'Bowl de pollo', desc: 'Pollo a la plancha, maíz, aguacate, repollo morado y arroz.', price: 27000, img: 'bowl-pollo' },
    { id: 'w2', name: 'Bowl veggie', desc: 'Garbanzos, aguacate, tomate cherry, batata asada y hummus.', price: 24000, img: 'bowl-veggie', badge: 'Veggie' },
    { id: 'w3', name: 'Ensalada verde', desc: 'Mix de hojas, zanahoria, cebolla encurtida y queso feta.', price: 19000, img: 'ensalada-verde', badge: 'Veggie' },
  ]},
  { cat: 'Postres', items: [
    { id: 'p1', name: 'Brownie Noir', desc: 'Chocolate 70 % tibio con salsa de chocolate.', price: 14000, img: 'brownie' },
    { id: 'p2', name: 'Torta de chocolate', desc: 'Tres capas de bizcocho húmedo y ganache.', price: 15000, img: 'torta' },
    { id: 'p3', name: 'Malteada Oreo', desc: 'Helado de vainilla, galleta Oreo y crema batida.', price: 16000, img: 'malteada', badge: 'Más pedido' },
    { id: 'p4', name: 'Pancakes', desc: 'Torre de pancakes con miel de maple y fruta.', price: 18000, img: 'pancakes' },
  ]},
  { cat: 'Bebidas', items: [
    { id: 'd1', name: 'Limonada de hierbabuena', desc: 'Natural, 16 oz.', price: 9000, img: 'mojito' },
    { id: 'd2', name: 'Cócteles de la casa', desc: 'Pregunta por el cóctel del día.', price: 22000, img: 'cocteles' },
    { id: 'd3', name: 'Café frío', desc: 'Cold brew con leche y un toque de vainilla.', price: 10000, img: 'cafe-frio' },
  ]},
];
const DELIVERY_FEE = 5000;

const $ = (s) => document.querySelector(s);
const money = (n) => '$' + n.toLocaleString('es-CO');
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-');
const byId = Object.fromEntries(MENU.flatMap((c) => c.items).map((i) => [i.id, i]));
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const mesa = new URLSearchParams(location.search).get('mesa');
if (mesa) { const t = $('#table-tag'); t.textContent = 'Mesa ' + mesa; t.hidden = false; }

let cart = {};
try { cart = JSON.parse(localStorage.getItem('casa-brasa-cart')) || {}; } catch { cart = {}; }
let order = { type: mesa ? 'Mesa' : 'Domicilio', pay: 'Efectivo', name: '', address: '', notes: '' };
const save = () => { try { localStorage.setItem('casa-brasa-cart', JSON.stringify(cart)); } catch {} };

/* ---- Menú ---- */
const renderMenu = (q = '') => {
  const term = slug(q.trim());
  let any = false;
  $('#menu').innerHTML = MENU.map((c) => {
    const items = c.items.filter((i) => !term || slug(i.name + ' ' + i.desc).includes(term));
    if (!items.length) return '';
    any = true;
    return `<section id="${slug(c.cat)}" aria-labelledby="h-${slug(c.cat)}"><h2 id="h-${slug(c.cat)}">${c.cat}</h2><div class="items">${items.map((i) => `
      <div class="item" role="button" tabindex="0" data-open="${i.id}" aria-label="${esc(i.name)}, ${money(i.price)}">
        <div>${i.badge ? `<span class="badge">${i.badge}</span>` : ''}<h3>${i.name}</h3><p>${i.desc}</p><div class="price">${money(i.price)}</div></div>
        <div class="thumb"><img src="img/${i.img}.webp" alt="" width="104" height="104" loading="lazy">
          ${cart[i.id] ? `<span class="qty-pill">${cart[i.id].qty}</span>` : ''}
          <button class="add" type="button" data-add="${i.id}" aria-label="Agregar ${esc(i.name)}">+</button></div>
      </div>`).join('')}</div></section>`;
  }).join('');
  $('#empty').hidden = any;
  $('#chips').innerHTML = MENU.filter((c) => document.getElementById(slug(c.cat)))
    .map((c) => `<a class="chip" href="#${slug(c.cat)}">${c.cat}</a>`).join('');
  spy();
};

let observer;
const spy = () => {
  if (observer) observer.disconnect();
  if (!('IntersectionObserver' in window)) return;
  observer = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    document.querySelectorAll('.chip').forEach((ch) => {
      const on = ch.getAttribute('href') === '#' + e.target.id;
      ch.classList.toggle('is-on', on);
      if (on) ch.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    });
  }), { rootMargin: '-140px 0px -60% 0px' });
  document.querySelectorAll('#menu section').forEach((s) => observer.observe(s));
};

/* ---- Carrito ---- */
const count = () => Object.values(cart).reduce((a, l) => a + l.qty, 0);
const subtotal = () => Object.entries(cart).reduce((a, [id, l]) => a + byId[id].price * l.qty, 0);
const add = (id, qty = 1, note = '') => {
  const l = cart[id] || { qty: 0, note: '' };
  l.qty += qty; if (note) l.note = note;
  if (l.qty <= 0) delete cart[id]; else cart[id] = l;
  save(); refresh();
};
const refresh = () => {
  const n = count();
  $('#cartbar').classList.toggle('is-on', n > 0);
  $('#cart-count').textContent = n;
  $('#cart-total').textContent = money(subtotal());
  renderMenu($('#q').value);
  if ($('#cart').classList.contains('is-on')) renderCart();
};

const toast = (t) => { const el = $('#toast'); el.textContent = t; el.classList.add('is-on'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('is-on'), 1600); };

/* ---- Hojas ---- */
let lastFocus;
const openSheet = (el) => { lastFocus = document.activeElement; $('#scrim').classList.add('is-on'); el.classList.add('is-on'); document.body.style.overflow = 'hidden'; setTimeout(() => (el.querySelector('[data-close]') || el).focus(), 50); };
const closeSheets = () => { document.querySelectorAll('.sheet.is-on').forEach((s) => s.classList.remove('is-on')); $('#scrim').classList.remove('is-on'); document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); };

const openDetail = (id) => {
  const i = byId[id]; let qty = 1;
  const el = $('#detail');
  el.innerHTML = `<button class="sheet__close" data-close aria-label="Cerrar">✕</button>
    <div class="detail"><img src="img/${i.img}.webp" alt="${esc(i.name)}" width="480" height="360">
    <div class="pad">${i.badge ? `<span class="badge">${i.badge}</span>` : ''}<h3 id="d-name">${i.name}</h3><p>${i.desc}</p>
    <label class="small" for="d-note">¿Alguna indicación?</label>
    <textarea class="field" id="d-note" placeholder="Ej: sin cebolla, término medio…">${cart[id] ? esc(cart[id].note || '') : ''}</textarea>
    <div class="row"><div class="stepper"><button type="button" data-q="-1" aria-label="Menos">−</button><span id="d-qty">1</span><button type="button" data-q="1" aria-label="Más">+</button></div>
    <button class="btn" id="d-add" type="button">Agregar ${money(i.price)}</button></div></div></div>`;
  el.querySelectorAll('[data-q]').forEach((b) => b.onclick = () => { qty = Math.max(1, qty + +b.dataset.q); $('#d-qty').textContent = qty; $('#d-add').textContent = 'Agregar ' + money(i.price * qty); });
  $('#d-add').onclick = () => { add(id, qty, $('#d-note').value.trim()); closeSheets(); toast('✓ ' + i.name + ' agregado'); };
  openSheet(el);
};

const renderCart = () => {
  const el = $('#cart');
  const lines = Object.entries(cart);
  const fee = order.type === 'Domicilio' ? DELIVERY_FEE : 0;
  el.innerHTML = `<div class="sheet__grab"></div><button class="sheet__close" data-close aria-label="Cerrar">✕</button>
    <div class="pad cart"><h3 id="c-title">Tu pedido</h3>
    ${lines.length ? lines.map(([id, l]) => `<div class="line"><img src="img/${byId[id].img}.webp" alt="" width="56" height="56">
      <div><b>${byId[id].name}</b><small>${money(byId[id].price)}${l.note ? ' · ' + esc(l.note) : ''}</small></div>
      <div class="stepper"><button type="button" data-l="${id}" data-d="-1" aria-label="Quitar uno">−</button><span>${l.qty}</span><button type="button" data-l="${id}" data-d="1" aria-label="Agregar uno">+</button></div></div>`).join('')
      : '<p class="empty">Tu pedido está vacío.</p>'}
    <label class="small">¿Cómo lo quieres?</label>
    <div class="seg" role="radiogroup" aria-label="Tipo de pedido">${['Mesa', 'Domicilio', 'Recoger'].map((t) => `<button type="button" role="radio" aria-checked="${order.type === t}" class="${order.type === t ? 'is-on' : ''}" data-type="${t}">${t === 'Mesa' ? '🍽️' : t === 'Domicilio' ? '🛵' : '🛍️'} ${t}</button>`).join('')}</div>
    <label class="small" for="o-name">Tu nombre</label><input class="field" id="o-name" autocomplete="name" value="${esc(order.name)}" placeholder="Nombre">
    ${order.type === 'Mesa' ? `<label class="small" for="o-table">Número de mesa</label><input class="field" id="o-table" inputmode="numeric" value="${esc(mesa || order.table || '')}" placeholder="Ej: 4">` : ''}
    ${order.type === 'Domicilio' ? `<label class="small" for="o-address">Dirección de entrega</label><input class="field" id="o-address" autocomplete="street-address" value="${esc(order.address)}" placeholder="Calle, número, barrio">` : ''}
    <label class="small" for="o-pay">Forma de pago</label>
    <select class="field" id="o-pay">${['Efectivo', 'Transferencia / Nequi', 'Datáfono'].map((p) => `<option ${order.pay === p ? 'selected' : ''}>${p}</option>`).join('')}</select>
    <div class="totals"><div><span>Subtotal</span><span>${money(subtotal())}</span></div>
      ${fee ? `<div><span>Domicilio</span><span>${money(fee)}</span></div>` : ''}
      <div class="grand"><span>Total</span><span>${money(subtotal() + fee)}</span></div></div>
    <p class="err" id="o-err" role="alert"></p>
    <button class="btn btn--wa" id="send" type="button" ${lines.length ? '' : 'disabled'}>
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm5.5-5.8c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1l-.9 1.2c-.2.2-.3.2-.6.1-1.6-.8-2.7-1.5-3.8-3.4-.3-.5.3-.5.8-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.6.7.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3Z"/></svg>
      Enviar pedido por WhatsApp</button>
    <p class="note">El restaurante recibe tu pedido al instante y te confirma por WhatsApp.</p></div>`;
  const keep = () => { order.name = $('#o-name').value; if ($('#o-address')) order.address = $('#o-address').value; if ($('#o-table')) order.table = $('#o-table').value; order.pay = $('#o-pay').value; };
  el.querySelectorAll('[data-l]').forEach((b) => b.onclick = () => { keep(); add(b.dataset.l, +b.dataset.d); });
  el.querySelectorAll('[data-type]').forEach((b) => b.onclick = () => { keep(); order.type = b.dataset.type; renderCart(); });
  $('#send').onclick = () => {
    keep();
    const err = $('#o-err');
    if (!order.name.trim()) { err.textContent = 'Escribe tu nombre.'; $('#o-name').focus(); return; }
    if (order.type === 'Domicilio' && !order.address.trim()) { err.textContent = 'Escribe la dirección de entrega.'; $('#o-address').focus(); return; }
    if (order.type === 'Mesa' && !(order.table || '').trim()) { err.textContent = 'Escribe el número de mesa.'; $('#o-table').focus(); return; }
    const msg = [
      '🔥 *Nuevo pedido — Casa Brasa*', '',
      ...lines.map(([id, l]) => `• ${l.qty}× ${byId[id].name} — ${money(byId[id].price * l.qty)}${l.note ? `\n   _${l.note}_` : ''}`), '',
      `🧾 Subtotal: ${money(subtotal())}`, ...(fee ? [`🛵 Domicilio: ${money(fee)}`] : []), `💰 *Total: ${money(subtotal() + fee)}*`, '',
      `👤 ${order.name.trim()}`,
      order.type === 'Mesa' ? `🍽️ Mesa ${order.table}` : order.type === 'Domicilio' ? `🛵 Domicilio: ${order.address.trim()}` : '🛍️ Para recoger',
      `💳 Pago: ${order.pay}`, '', '_Pedido de prueba enviado desde la demo de Noir Menu ✦_',
    ].join('\n');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  };
};

/* ---- Eventos ---- */
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-add]');
  if (a) { e.stopPropagation(); add(a.dataset.add); toast('✓ ' + byId[a.dataset.add].name + ' agregado'); return; }
  const o = e.target.closest('[data-open]');
  if (o) return openDetail(o.dataset.open);
  if (e.target.closest('[data-close]') || e.target.id === 'scrim') closeSheets();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSheets();
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-open]')) { e.preventDefault(); openDetail(e.target.dataset.open); }
});
$('#cartbar').onclick = () => { renderCart(); openSheet($('#cart')); };
$('#q').addEventListener('input', (e) => renderMenu(e.target.value));

refresh();
