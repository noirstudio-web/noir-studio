import { useEffect, useMemo, useRef, useState } from 'react';
import { HOME, money, pub, storage, WHATSAPP_NUMBER } from '../shared/security';
import { DELIVERY_FEE, DISHES, MENU, RESTAURANT, slug, type Dish } from './data';

type Line = { qty: number; note: string };
type Cart = Record<string, Line>;
type OrderType = 'Mesa' | 'Domicilio' | 'Recoger';
const CART_KEY = 'casa-brasa-cart';
const img = (name: string) => pub(`noir-menu/img/${name}.webp`);

export function MenuApp() {
  const mesa = useMemo(() => new URLSearchParams(location.search).get('mesa'), []);
  const [cart, setCart] = useState<Cart>(() => storage.get<Cart>(CART_KEY, {}));
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('');
  const [detail, setDetail] = useState<Dish | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(0);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => storage.set(CART_KEY, cart), [cart]);

  const notify = (t: string) => {
    setToast(t);
    clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 1600);
  };
  const add = (id: string, qty = 1, note = '') => setCart((c) => {
    const line = { ...(c[id] ?? { qty: 0, note: '' }) };
    line.qty += qty;
    if (note) line.note = note;
    const next = { ...c };
    if (line.qty <= 0) delete next[id]; else next[id] = line;
    return next;
  });

  const count = Object.values(cart).reduce((a, l) => a + l.qty, 0);
  const subtotal = Object.entries(cart).reduce((a, [id, l]) => a + DISHES[id].price * l.qty, 0);

  // Búsqueda
  const sections = useMemo(() => {
    const term = slug(query.trim());
    return MENU.map((c) => ({ ...c, items: c.items.filter((i) => !term || slug(`${i.name} ${i.desc}`).includes(term)) }))
      .filter((c) => c.items.length);
  }, [query]);

  // Categoría visible → chip activo
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setActiveCat(e.target.id); }),
      { rootMargin: '-140px 0px -60% 0px' });
    document.querySelectorAll('main section').forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [sections]);
  useEffect(() => {
    document.querySelector(`.chip[href="#${activeCat}"]`)?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [activeCat]);

  // Hojas (detalle y carrito)
  const anyOpen = !!detail || cartOpen;
  const open = (fn: () => void) => { lastFocus.current = document.activeElement as HTMLElement; fn(); };
  const close = () => { setDetail(null); setCartOpen(false); lastFocus.current?.focus(); };
  useEffect(() => {
    document.body.style.overflow = anyOpen ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [anyOpen]);

  return (
    <>
      <div className="demo-bar">✦ Demo de <strong>Noir Menu</strong> por Noir Studio · <a href={`${HOME}#contacto`}>Quiero uno así</a></div>

      <div className="app">
        <div className="cover">
          <img src={img('lomo-papas')} alt="" width={480} height={480} />
          {mesa && <span className="table-tag">Mesa {mesa}</span>}
        </div>
        <header className="head">
          <div className="brand">
            <div className="logo" aria-hidden="true">{RESTAURANT.initial}</div>
            <div>
              <h1>{RESTAURANT.name}</h1>
              <div className="text-[.9rem] text-[var(--muted)]">{RESTAURANT.kind}</div>
            </div>
          </div>
          <div className="meta">
            <span><b>● Abierto</b> · cierra 10:00 p. m.</span><span>🛵 Domicilio 30–40 min</span><span>📍 {RESTAURANT.city}</span>
          </div>
        </header>

        <div className="search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
          <input type="search" placeholder="Buscar en el menú" aria-label="Buscar en el menú" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <nav className="chips" aria-label="Categorías">
          {sections.map((c) => (
            <a key={c.cat} className={`chip ${activeCat === slug(c.cat) ? 'is-on' : ''}`} href={`#${slug(c.cat)}`}>{c.cat}</a>
          ))}
        </nav>

        <main>
          {sections.map((c) => (
            <section key={c.cat} id={slug(c.cat)} aria-labelledby={`h-${slug(c.cat)}`}>
              <h2 id={`h-${slug(c.cat)}`}>{c.cat}</h2>
              <div className="items">
                {c.items.map((d) => (
                  <div key={d.id} className="item" role="button" tabIndex={0} aria-label={`${d.name}, ${money(d.price)}`}
                    onClick={() => open(() => setDetail(d))}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(() => setDetail(d)); } }}>
                    <div>
                      {d.badge && <span className="badge">{d.badge}</span>}
                      <h3>{d.name}</h3><p>{d.desc}</p><div className="price">{money(d.price)}</div>
                    </div>
                    <div className="thumb">
                      <img src={img(d.img)} alt="" width={104} height={104} loading="lazy" />
                      {cart[d.id] && <span className="qty-pill">{cart[d.id].qty}</span>}
                      <button className="add" type="button" aria-label={`Agregar ${d.name}`}
                        onClick={(e) => { e.stopPropagation(); add(d.id); notify(`✓ ${d.name} agregado`); }}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </main>
        {!sections.length && <p className="empty">No encontramos platos con esa búsqueda.</p>}

        <footer>Menú digital hecho por <a href={HOME}>Noir Studio ✦</a></footer>
      </div>

      <button className={`cartbar ${count ? 'is-on' : ''}`} type="button" aria-label="Ver pedido" onClick={() => open(() => setCartOpen(true))}>
        <span><span className="count">{count}</span>Ver pedido</span><span>{money(subtotal)}</span>
      </button>

      <div className={`scrim ${anyOpen ? 'is-on' : ''}`} onClick={close} />
      <div className={`sheet ${detail ? 'is-on' : ''}`} role="dialog" aria-modal="true" aria-labelledby="d-name">
        {detail && <DishSheet key={detail.id} dish={detail} line={cart[detail.id]} onClose={close}
          onAdd={(qty, note) => { add(detail.id, qty, note); close(); notify(`✓ ${detail.name} agregado`); }} />}
      </div>
      <div className={`sheet ${cartOpen ? 'is-on' : ''}`} role="dialog" aria-modal="true" aria-labelledby="c-title">
        {cartOpen && <CartSheet cart={cart} mesa={mesa} subtotal={subtotal} onClose={close} onQty={(id, d) => add(id, d)} />}
      </div>
      <div className={`toast ${toast ? 'is-on' : ''}`} role="status">{toast}</div>
    </>
  );
}

function DishSheet({ dish, line, onAdd, onClose }: { dish: Dish; line?: Line; onAdd: (qty: number, note: string) => void; onClose: () => void }) {
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState(line?.note ?? '');
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { closeRef.current?.focus(); }, []);
  return (
    <>
      <button ref={closeRef} className="sheet__close" type="button" aria-label="Cerrar" onClick={onClose}>✕</button>
      <div className="detail">
        <img src={img(dish.img)} alt={dish.name} width={480} height={360} />
        <div className="pad">
          {dish.badge && <span className="badge">{dish.badge}</span>}
          <h3 id="d-name">{dish.name}</h3>
          <p>{dish.desc}</p>
          <label className="small" htmlFor="d-note">¿Alguna indicación?</label>
          <textarea className="field" id="d-note" placeholder="Ej: sin cebolla, término medio…" value={note} onChange={(e) => setNote(e.target.value)} />
          <div className="row">
            <div className="stepper">
              <button type="button" aria-label="Menos" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button type="button" aria-label="Más" onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <button className="btn" type="button" onClick={() => onAdd(qty, note.trim())}>Agregar {money(dish.price * qty)}</button>
          </div>
        </div>
      </div>
    </>
  );
}

function CartSheet({ cart, mesa, subtotal, onClose, onQty }: {
  cart: Cart; mesa: string | null; subtotal: number; onClose: () => void; onQty: (id: string, delta: number) => void;
}) {
  const [type, setType] = useState<OrderType>(mesa ? 'Mesa' : 'Domicilio');
  const [name, setName] = useState('');
  const [table, setTable] = useState(mesa ?? '');
  const [address, setAddress] = useState('');
  const [pay, setPay] = useState('Efectivo');
  const [error, setError] = useState('');
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { closeRef.current?.focus(); }, []);

  const lines = Object.entries(cart);
  const fee = type === 'Domicilio' ? DELIVERY_FEE : 0;

  const send = () => {
    if (!name.trim()) return setError('Escribe tu nombre.');
    if (type === 'Domicilio' && !address.trim()) return setError('Escribe la dirección de entrega.');
    if (type === 'Mesa' && !table.trim()) return setError('Escribe el número de mesa.');
    setError('');
    const msg = [
      `🔥 *Nuevo pedido — ${RESTAURANT.name}*`, '',
      ...lines.map(([id, l]) => `• ${l.qty}× ${DISHES[id].name} — ${money(DISHES[id].price * l.qty)}${l.note ? `\n   _${l.note}_` : ''}`), '',
      `🧾 Subtotal: ${money(subtotal)}`, ...(fee ? [`🛵 Domicilio: ${money(fee)}`] : []), `💰 *Total: ${money(subtotal + fee)}*`, '',
      `👤 ${name.trim()}`,
      type === 'Mesa' ? `🍽️ Mesa ${table.trim()}` : type === 'Domicilio' ? `🛵 Domicilio: ${address.trim()}` : '🛍️ Para recoger',
      `💳 Pago: ${pay}`, '', '_Pedido de prueba enviado desde la demo de Noir Menu ✦_',
    ].join('\n');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  };

  return (
    <>
      <div className="sheet__grab" />
      <button ref={closeRef} className="sheet__close" type="button" aria-label="Cerrar" onClick={onClose}>✕</button>
      <div className="pad cart">
        <h3 id="c-title">Tu pedido</h3>
        {lines.length ? lines.map(([id, l]) => (
          <div className="line" key={id}>
            <img src={img(DISHES[id].img)} alt="" width={56} height={56} />
            <div><b>{DISHES[id].name}</b><small>{money(DISHES[id].price)}{l.note ? ` · ${l.note}` : ''}</small></div>
            <div className="stepper">
              <button type="button" aria-label="Quitar uno" onClick={() => onQty(id, -1)}>−</button>
              <span>{l.qty}</span>
              <button type="button" aria-label="Agregar uno" onClick={() => onQty(id, 1)}>+</button>
            </div>
          </div>
        )) : <p className="empty">Tu pedido está vacío.</p>}

        <label className="small">¿Cómo lo quieres?</label>
        <div className="seg" role="radiogroup" aria-label="Tipo de pedido">
          {(['Mesa', 'Domicilio', 'Recoger'] as OrderType[]).map((t) => (
            <button key={t} type="button" role="radio" aria-checked={type === t} className={type === t ? 'is-on' : ''} onClick={() => setType(t)}>
              {t === 'Mesa' ? '🍽️' : t === 'Domicilio' ? '🛵' : '🛍️'} {t}
            </button>
          ))}
        </div>
        <label className="small" htmlFor="o-name">Tu nombre</label>
        <input className="field" id="o-name" autoComplete="name" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        {type === 'Mesa' && <>
          <label className="small" htmlFor="o-table">Número de mesa</label>
          <input className="field" id="o-table" inputMode="numeric" placeholder="Ej: 4" value={table} onChange={(e) => setTable(e.target.value)} />
        </>}
        {type === 'Domicilio' && <>
          <label className="small" htmlFor="o-address">Dirección de entrega</label>
          <input className="field" id="o-address" autoComplete="street-address" placeholder="Calle, número, barrio" value={address} onChange={(e) => setAddress(e.target.value)} />
        </>}
        <label className="small" htmlFor="o-pay">Forma de pago</label>
        <select className="field" id="o-pay" value={pay} onChange={(e) => setPay(e.target.value)}>
          {['Efectivo', 'Transferencia / Nequi', 'Datáfono'].map((p) => <option key={p}>{p}</option>)}
        </select>

        <div className="totals">
          <div><span>Subtotal</span><span>{money(subtotal)}</span></div>
          {fee > 0 && <div><span>Domicilio</span><span>{money(fee)}</span></div>}
          <div className="grand"><span>Total</span><span>{money(subtotal + fee)}</span></div>
        </div>
        <p className="err" role="alert">{error}</p>
        <button className="btn btn--wa" type="button" disabled={!lines.length} onClick={send}>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm5.5-5.8c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1l-.9 1.2c-.2.2-.3.2-.6.1-1.6-.8-2.7-1.5-3.8-3.4-.3-.5.3-.5.8-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.6.7.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3Z" /></svg>
          Enviar pedido por WhatsApp
        </button>
        <p className="note">El restaurante recibe tu pedido al instante y te confirma por WhatsApp.</p>
      </div>
    </>
  );
}
