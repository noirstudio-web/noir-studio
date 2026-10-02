'use strict';

// ✦ Seguridad: impide que otra web muestre esta página dentro de un marco (clickjacking)
if (window.top !== window.self) {
  document.documentElement.style.display = 'none';
  try { window.top.location.replace(window.self.location.href); } catch (e) { /* el navegador lo bloqueó: la página queda oculta */ }
}

const PRODUCTS = [
  { id: 'chaqueta', name: 'Chaqueta Onyx', cat: 'Ropa', price: 289000, stock: 12, sizes: ['S', 'M', 'L', 'XL'], pop: 1, desc: 'Cuero sintético premium con cierres metálicos y forro interior suave. Corte recto.' },
  { id: 'tenis', name: 'Tenis Carbon', cat: 'Calzado', price: 239000, stock: 15, sizes: ['38', '39', '40', '41', '42', '43'], pop: 2, desc: 'Malla transpirable, suela de espuma ligera y cordones de alta resistencia.' },
  { id: 'audifonos', name: 'Audífonos Studio', cat: 'Tecnología', price: 349000, old: 399000, stock: 10, pop: 3, desc: 'Inalámbricos, cancelación de ruido y 30 horas de batería.' },
  { id: 'reloj', name: 'Reloj Classic Sand', cat: 'Accesorios', price: 189000, stock: 9, pop: 4, desc: 'Caja de acero de 38 mm, correa de cuero y resistencia al agua.' },
  { id: 'poncho', name: 'Poncho Knit Arena', cat: 'Ropa', price: 159000, old: 199000, stock: 7, sizes: ['Única'], pop: 5, desc: 'Tejido a mano en algodón, con flecos y caída ligera.' },
  { id: 'mochila', name: 'Mochila Cuero Cognac', cat: 'Accesorios', price: 269000, stock: 6, pop: 6, desc: 'Cuero curtido, bolsillo para portátil de 15" y herrajes ocultos.' },
  { id: 'smartwatch', name: 'Smartwatch Pulse', cat: 'Tecnología', price: 459000, stock: 3, pop: 7, desc: 'Ritmo cardíaco, GPS, notificaciones y 7 días de batería.' },
  { id: 'zapato', name: 'Derby Suede Jade', cat: 'Calzado', price: 219000, stock: 4, sizes: ['39', '40', '41', '42'], pop: 8, desc: 'Gamuza color jade con suela de cuero cosida.' },
];
const FREE_SHIP = 300000, SHIP = 12000, COUPONS = { NOIR10: 0.10 };
const SEED_ORDERS = [
  { n: 1048, who: 'Valentina R.', items: 2, total: 528000, st: 'ship', when: 'Hoy 9:12' },
  { n: 1047, who: 'Andrés M.', items: 1, total: 349000, st: 'paid', when: 'Hoy 8:40' },
  { n: 1046, who: 'Laura G.', items: 3, total: 667000, st: 'ship', when: 'Ayer' },
  { n: 1045, who: 'Camilo P.', items: 1, total: 189000, st: 'pend', when: 'Ayer' },
];
const WEEK = [820000, 1150000, 640000, 1390000, 980000, 1620000]; // 6 días anteriores

const $ = (s) => document.querySelector(s);
const money = (n) => '$' + Math.round(n).toLocaleString('es-CO');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

let cart = load('atelier-cart', []);           // [{id, size, qty}]
let stock = load('atelier-stock', Object.fromEntries(PRODUCTS.map((p) => [p.id, p.stock])));
let orders = load('atelier-orders', []);
let coupon = null, filter = 'Todo', sort = 'pop';

const toast = (t) => { const el = $('#toast'); el.textContent = t; el.classList.add('is-on'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('is-on'), 1800); };

/* ---------- Catálogo ---------- */
const CATS = ['Todo', 'Ropa', 'Calzado', 'Accesorios', 'Tecnología', 'Ofertas'];
const renderChips = () => {
  $('#chips').innerHTML = CATS.map((c) => `<button type="button" role="tab" aria-selected="${c === filter}" class="chip ${c === filter ? 'is-on' : ''}" data-filter="${c}">${c}</button>`).join('');
};
const renderGrid = () => {
  let list = PRODUCTS.filter((p) => filter === 'Todo' || (filter === 'Ofertas' ? p.old : p.cat === filter));
  list = list.slice().sort((a, b) => (sort === 'asc' ? a.price - b.price : sort === 'desc' ? b.price - a.price : a.pop - b.pop));
  $('#grid').innerHTML = list.map((p) => `
    <article class="card">
      <button class="card__img" type="button" data-open="${p.id}" aria-label="Ver ${esc(p.name)}">
        <img src="img/${p.id}.webp" alt="${esc(p.name)}" width="480" height="480" loading="lazy">
        ${p.old ? `<span class="tag">-${Math.round((1 - p.price / p.old) * 100)}%</span>` : ''}
        ${stock[p.id] <= 4 ? `<span class="tag tag--low">${stock[p.id] ? 'Últimas ' + stock[p.id] : 'Agotado'}</span>` : ''}
      </button>
      <div class="card__body">
        <span class="card__cat">${p.cat}</span>
        <button class="card__name" type="button" data-open="${p.id}">${p.name}</button>
        <div class="price">${money(p.price)} ${p.old ? `<s>${money(p.old)}</s>` : ''}</div>
        <button class="card__add" type="button" data-quick="${p.id}" ${stock[p.id] ? '' : 'disabled'}>${stock[p.id] ? 'Agregar al carrito' : 'Agotado'}</button>
      </div>
    </article>`).join('');
};

/* ---------- Carrito ---------- */
const subtotal = () => cart.reduce((a, l) => a + byId[l.id].price * l.qty, 0);
const totals = () => {
  const sub = subtotal(); const disc = coupon ? Math.round(sub * COUPONS[coupon]) : 0;
  const ship = sub - disc >= FREE_SHIP || !sub ? 0 : SHIP;
  return { sub, disc, ship, total: sub - disc + ship };
};
const addToCart = (id, size, qty = 1) => {
  const p = byId[id];
  const inCart = cart.filter((l) => l.id === id).reduce((a, l) => a + l.qty, 0);
  if (inCart + qty > stock[id]) { toast('No hay más unidades disponibles'); return; }
  size = size || (p.sizes ? p.sizes[Math.min(1, p.sizes.length - 1)] : null);
  const line = cart.find((l) => l.id === id && l.size === size);
  if (line) line.qty += qty; else cart.push({ id, size, qty });
  store('atelier-cart', cart); renderCart(); toast(`✓ ${p.name} agregado`);
};
const renderCart = () => {
  $('#cart-count').textContent = cart.reduce((a, l) => a + l.qty, 0);
  const t = totals();
  $('#cart-lines').innerHTML = cart.length ? cart.map((l, i) => `
    <div class="line"><img src="img/${l.id}.webp" alt="" width="64" height="64">
      <div><b>${byId[l.id].name}</b><small>${l.size ? 'Talla ' + l.size + ' · ' : ''}${money(byId[l.id].price)}</small></div>
      <div class="stepper"><button type="button" data-line="${i}" data-d="-1" aria-label="Quitar uno">−</button><span>${l.qty}</span><button type="button" data-line="${i}" data-d="1" aria-label="Agregar uno">+</button></div>
    </div>`).join('') : '<p class="empty">Tu carrito está vacío.</p>';
  const left = Math.max(0, FREE_SHIP - (t.sub - t.disc));
  $('#cart-foot').innerHTML = cart.length ? `
    <div style="font-size:.84rem;color:var(--muted)">${left ? `Te faltan <b style="color:var(--text)">${money(left)}</b> para envío gratis` : '🎉 ¡Tienes envío gratis!'}</div>
    <div class="ship-bar"><i style="width:${Math.min(100, ((t.sub - t.disc) / FREE_SHIP) * 100)}%"></i></div>
    <form class="coupon" id="coupon-form"><input class="input" id="coupon" placeholder="Cupón (prueba NOIR10)" value="${coupon || ''}" aria-label="Cupón de descuento"><button class="small-btn" type="submit">Aplicar</button></form>
    <p class="msg ${coupon ? 'ok' : ''}" id="coupon-msg">${coupon ? `Cupón ${coupon} aplicado: -10 %` : ''}</p>
    <div class="sum"><div><span>Subtotal</span><span>${money(t.sub)}</span></div>
      ${t.disc ? `<div><span>Descuento</span><span style="color:var(--ok)">-${money(t.disc)}</span></div>` : ''}
      <div><span>Envío</span><span>${t.ship ? money(t.ship) : 'Gratis'}</span></div>
      <div class="grand"><span>Total</span><span>${money(t.total)}</span></div></div>
    <button class="btn btn--block" id="go-checkout" type="button" style="margin-top:16px">Pagar ${money(t.total)}</button>` : '';
  const cf = $('#coupon-form');
  if (cf) cf.onsubmit = (e) => {
    e.preventDefault();
    const code = $('#coupon').value.trim().toUpperCase();
    if (COUPONS[code]) { coupon = code; renderCart(); } else { coupon = null; renderCart(); $('#coupon-msg').textContent = 'Cupón no válido'; $('#coupon-msg').className = 'msg bad'; }
  };
  const go = $('#go-checkout'); if (go) go.onclick = openCheckout;
};

/* ---------- Capas ---------- */
let lastFocus;
const open = (el) => { lastFocus = document.activeElement; closeAll(true); $('#scrim').classList.add('is-on'); el.classList.add('is-on'); document.body.style.overflow = 'hidden'; setTimeout(() => (el.querySelector('[data-close]') || el).focus(), 60); };
const closeAll = (keepFocus) => { document.querySelectorAll('.drawer.is-on, .modal.is-on').forEach((e) => e.classList.remove('is-on')); $('#scrim').classList.remove('is-on'); document.body.style.overflow = ''; if (!keepFocus && lastFocus) lastFocus.focus(); };

const openProduct = (id) => {
  const p = byId[id]; let size = p.sizes ? p.sizes[Math.min(1, p.sizes.length - 1)] : null; let qty = 1;
  const el = $('#product');
  el.innerHTML = `<button class="x" type="button" data-close aria-label="Cerrar">✕</button>
    <div class="pd"><img src="img/${p.id}.webp" alt="${esc(p.name)}" width="480" height="480">
    <div class="pd__info"><span class="eyebrow">${p.cat}</span><h2 id="pd-name">${p.name}</h2>
      <div class="price" style="font-size:1.3rem">${money(p.price)} ${p.old ? `<s>${money(p.old)}</s>` : ''}</div>
      <p>${p.desc}</p>
      ${p.sizes ? `<span class="label">Talla</span><div class="sizes">${p.sizes.map((s) => `<button type="button" class="size ${s === size ? 'is-on' : ''}" data-size="${s}" aria-pressed="${s === size}">${s}</button>`).join('')}</div>` : ''}
      <span class="label">Cantidad</span>
      <div class="stepper" style="align-self:flex-start"><button type="button" data-pq="-1" aria-label="Menos">−</button><span id="pq">1</span><button type="button" data-pq="1" aria-label="Más">+</button></div>
      <span style="font-size:.82rem;color:${stock[id] <= 4 ? 'var(--warn)' : 'var(--muted)'}">${stock[id] ? stock[id] + ' unidades disponibles' : 'Agotado'}</span>
      <button class="btn btn--block" id="pd-add" type="button" ${stock[id] ? '' : 'disabled'} style="margin-top:8px">Agregar al carrito</button>
    </div></div>`;
  el.querySelectorAll('[data-size]').forEach((b) => b.onclick = () => { size = b.dataset.size; el.querySelectorAll('[data-size]').forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b); }); });
  el.querySelectorAll('[data-pq]').forEach((b) => b.onclick = () => { qty = Math.min(stock[id] || 1, Math.max(1, qty + +b.dataset.pq)); $('#pq').textContent = qty; });
  $('#pd-add').onclick = () => { addToCart(id, size, qty); closeAll(); };
  open(el);
};

let pay = 'Tarjeta';
const openCheckout = () => {
  const el = $('#checkout'); const t = totals();
  el.innerHTML = `<button class="x" type="button" data-close aria-label="Cerrar">✕</button>
    <form class="checkout" id="co-form" novalidate>
      <h2 id="co-title">Finalizar compra</h2>
      <div class="steps"><span class="is-on">1. Datos</span>·<span class="is-on">2. Pago</span>·<span>3. Confirmación</span></div>
      <div class="form-grid">
        <input class="input" name="name" placeholder="Nombre completo" autocomplete="name" required aria-label="Nombre completo">
        <input class="input" name="email" type="email" placeholder="Correo" autocomplete="email" required aria-label="Correo">
        <input class="input full" name="address" placeholder="Dirección de envío" autocomplete="street-address" required aria-label="Dirección de envío">
        <input class="input" name="city" placeholder="Ciudad" autocomplete="address-level2" required aria-label="Ciudad">
        <input class="input" name="phone" type="tel" placeholder="Celular" autocomplete="tel" required aria-label="Celular">
      </div>
      <p class="label" style="margin:18px 0 8px">Método de pago</p>
      <div class="pays">${['Tarjeta', 'PSE', 'Contra entrega'].map((m) => `<button type="button" class="pay ${m === pay ? 'is-on' : ''}" data-pay="${m}" aria-pressed="${m === pay}">${m === 'Tarjeta' ? '💳' : m === 'PSE' ? '🏦' : '💵'} ${m}</button>`).join('')}</div>
      <div id="card-fields" class="form-grid" style="margin-top:12px" ${pay === 'Tarjeta' ? '' : 'hidden'}>
        <input class="input full" name="card" inputmode="numeric" placeholder="4242 4242 4242 4242" value="4242 4242 4242 4242" aria-label="Número de tarjeta (demo)">
        <input class="input" name="exp" placeholder="MM/AA" value="12/29" aria-label="Vencimiento">
        <input class="input" name="cvc" placeholder="CVC" value="123" aria-label="CVC">
      </div>
      <p class="msg bad" id="co-err" role="alert" style="margin-top:10px"></p>
      <button class="btn btn--block" id="pay-btn" type="submit" style="margin-top:8px">Pagar ${money(t.total)}</button>
      <p style="margin-top:10px;font-size:.78rem;color:var(--muted);text-align:center">🔒 Demo: el pago es simulado, no se cobra nada.</p>
    </form>`;
  el.querySelectorAll('[data-pay]').forEach((b) => b.onclick = () => { pay = b.dataset.pay; el.querySelectorAll('[data-pay]').forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b); }); $('#card-fields').hidden = pay !== 'Tarjeta'; });
  $('#co-form').onsubmit = (e) => {
    e.preventDefault();
    const f = e.target;
    const bad = ['name', 'email', 'address', 'city', 'phone'].find((n) => !f[n].value.trim() || (n === 'email' && !/^\S+@\S+\.\S+$/.test(f[n].value)));
    if (bad) { $('#co-err').textContent = 'Completa tus datos correctamente.'; f[bad].focus(); return; }
    const btn = $('#pay-btn'); btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Procesando pago…';
    setTimeout(() => {
      const n = 1049 + orders.length;
      const now = new Date();
      orders.unshift({ n, who: f.name.value.trim().split(' ')[0] + ' ' + (f.name.value.trim().split(' ')[1] || '').charAt(0) + '.', items: cart.reduce((a, l) => a + l.qty, 0), total: t.total, st: pay === 'Contra entrega' ? 'pend' : 'paid', when: 'Hoy ' + now.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' }), today: true });
      cart.forEach((l) => { stock[l.id] = Math.max(0, stock[l.id] - l.qty); });
      cart = []; coupon = null;
      store('atelier-cart', cart); store('atelier-stock', stock); store('atelier-orders', orders);
      renderCart(); renderGrid(); renderPanel();
      el.innerHTML = `<button class="x" type="button" data-close aria-label="Cerrar">✕</button>
        <div class="success"><div class="check">✓</div><h2 class="serif" style="font-size:2rem">¡Gracias por tu compra!</h2>
        <p style="color:var(--muted);margin-top:8px">Pedido <b class="mono" style="color:var(--text)">#${n}</b> · ${money(t.total)} · ${pay}</p>
        <p style="color:var(--muted);margin-top:4px">Te enviamos la confirmación a tu correo.</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:24px">
          <button class="btn btn--ghost" type="button" data-close>Seguir comprando</button>
          <button class="btn" type="button" data-view="panel">Ver pedido en el panel</button></div></div>`;
    }, 1400);
  };
  open(el);
};

/* ---------- Panel ---------- */
const renderPanel = () => {
  const todayOrders = orders.filter((o) => o.today);
  const todaySales = 450000 + todayOrders.reduce((a, o) => a + o.total, 0);
  const all = orders.concat(SEED_ORDERS);
  const avg = all.reduce((a, o) => a + o.total, 0) / all.length;
  const low = PRODUCTS.filter((p) => stock[p.id] <= 4).length;
  $('#kpis').innerHTML = `
    <div class="kpi"><span>Ventas hoy</span><b>${money(todaySales)}</b><small>▲ 18 % vs. ayer</small></div>
    <div class="kpi"><span>Pedidos</span><b>${all.length}</b><small>${todayOrders.length ? '+' + todayOrders.length + ' desde la demo' : 'Esta semana'}</small></div>
    <div class="kpi"><span>Ticket promedio</span><b>${money(avg)}</b><small>▲ 6 %</small></div>
    <div class="kpi"><span>Stock bajo</span><b>${low}</b><small style="color:var(--warn)">productos por reponer</small></div>`;
  const days = ['Jue', 'Vie', 'Sáb', 'Dom', 'Lun', 'Mar', 'Hoy'];
  const vals = WEEK.concat(todaySales); const max = Math.max(...vals);
  $('#chart').innerHTML = vals.map((v, i) => `<div><i class="${i === 6 ? 'today' : ''}" style="height:${(v / max) * 100}%" title="${money(v)}"></i><span>${days[i]}</span></div>`).join('');
  $('#inventory').innerHTML = PRODUCTS.map((p) => {
    const pct = Math.min(100, (stock[p.id] / 15) * 100);
    const col = stock[p.id] <= 2 ? 'var(--bad)' : stock[p.id] <= 4 ? 'var(--warn)' : 'var(--ok)';
    return `<div class="inv"><img src="img/${p.id}.webp" alt="" width="40" height="40" loading="lazy"><div><b style="font-size:.88rem">${p.name}</b><small>${stock[p.id]} en stock</small><div class="stock"><i style="width:${pct}%;background:${col}"></i></div></div>
      <div class="stepper"><button type="button" data-stock="${p.id}" data-d="-1" aria-label="Restar stock de ${esc(p.name)}">−</button><button type="button" data-stock="${p.id}" data-d="1" aria-label="Sumar stock de ${esc(p.name)}">+</button></div></div>`;
  }).join('');
  const label = { paid: ['Pagado', 'st--paid'], ship: ['Enviado', 'st--ship'], pend: ['Pendiente', 'st--pend'] };
  $('#orders').innerHTML = `<thead><tr><th>Pedido</th><th>Cliente</th><th>Productos</th><th>Total</th><th>Estado</th><th>Fecha</th></tr></thead><tbody>${all.slice(0, 8).map((o) => `
    <tr><td class="mono">#${o.n}</td><td>${esc(o.who)}</td><td>${o.items}</td><td><b>${money(o.total)}</b></td><td><span class="st ${label[o.st][1]}">${label[o.st][0]}</span></td><td style="color:var(--muted)">${o.when}</td></tr>`).join('')}</tbody>`;
};

const setView = (v) => {
  $('#shop').hidden = v !== 'shop'; $('#panel').hidden = v !== 'panel';
  document.querySelectorAll('.tabs [data-view]').forEach((b) => { b.classList.toggle('is-on', b.dataset.view === v); b.setAttribute('aria-selected', b.dataset.view === v); });
  if (v === 'panel') renderPanel();
  scrollTo({ top: 0 });
};

/* ---------- Eventos ---------- */
document.addEventListener('click', (e) => {
  const t = e.target;
  const v = t.closest('[data-view]'); if (v) { e.preventDefault(); closeAll(true); setView(v.dataset.view); return; }
  const f = t.closest('[data-filter]'); if (f) { filter = f.dataset.filter; renderChips(); renderGrid(); if (!t.closest('#chips')) document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' }); return; }
  const q = t.closest('[data-quick]'); if (q) { const p = byId[q.dataset.quick]; if (p.sizes && p.sizes.length > 1) openProduct(p.id); else addToCart(p.id); return; }
  const o = t.closest('[data-open]'); if (o) return openProduct(o.dataset.open);
  const l = t.closest('[data-line]'); if (l) { const line = cart[+l.dataset.line]; const d = +l.dataset.d;
    if (d > 0 && cart.filter((x) => x.id === line.id).reduce((a, x) => a + x.qty, 0) >= stock[line.id]) { toast('No hay más unidades disponibles'); return; }
    line.qty += d; if (line.qty <= 0) cart.splice(+l.dataset.line, 1); store('atelier-cart', cart); renderCart(); return; }
  const s = t.closest('[data-stock]'); if (s) { stock[s.dataset.stock] = Math.max(0, stock[s.dataset.stock] + +s.dataset.d); store('atelier-stock', stock); renderPanel(); renderGrid(); return; }
  if (t.closest('[data-close]') || t.id === 'scrim') closeAll();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });
$('#open-cart').onclick = () => { renderCart(); open($('#cart')); };
$('#sort').onchange = (e) => { sort = e.target.value; renderGrid(); };

renderChips(); renderGrid(); renderCart();
if (location.hash === '#panel') setView('panel');
