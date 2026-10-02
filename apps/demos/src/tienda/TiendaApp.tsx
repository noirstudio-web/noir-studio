import { useEffect, useMemo, useRef, useState } from 'react';
import { HOME, money, pub, storage } from '../shared/security';
import {
  BY_ID, COUPONS, FILTERS, FREE_SHIP, PAY_METHODS, PRODUCTS, SEED_ORDERS, SHIP, WEEK,
  type CartLine, type Filter, type Order, type PayMethod, type Product,
} from './data';

const img = (id: string) => pub(`tienda/img/${id}.webp`);
type View = 'shop' | 'panel';
type Layer = null | 'cart' | 'checkout' | { product: Product };

export function TiendaApp() {
  const [view, setView] = useState<View>(() => (location.hash === '#panel' ? 'panel' : 'shop'));
  const [cart, setCart] = useState<CartLine[]>(() => storage.get<CartLine[]>('atelier-cart', []));
  const [stock, setStock] = useState<Record<string, number>>(() =>
    storage.get('atelier-stock', Object.fromEntries(PRODUCTS.map((p) => [p.id, p.stock]))));
  const [orders, setOrders] = useState<Order[]>(() => storage.get<Order[]>('atelier-orders', []));
  const [coupon, setCoupon] = useState<string | null>(null);
  const [layer, setLayer] = useState<Layer>(null);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(0);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => storage.set('atelier-cart', cart), [cart]);
  useEffect(() => storage.set('atelier-stock', stock), [stock]);
  useEffect(() => storage.set('atelier-orders', orders), [orders]);

  const notify = (t: string) => { setToast(t); clearTimeout(toastTimer.current); toastTimer.current = window.setTimeout(() => setToast(''), 1800); };
  const inCart = (id: string) => cart.filter((l) => l.id === id).reduce((a, l) => a + l.qty, 0);

  const addToCart = (id: string, size: string | null = null, qty = 1) => {
    const p = BY_ID[id];
    if (inCart(id) + qty > stock[id]) { notify('No hay más unidades disponibles'); return; }
    const s = size ?? (p.sizes ? p.sizes[Math.min(1, p.sizes.length - 1)] : null);
    setCart((c) => {
      const i = c.findIndex((l) => l.id === id && l.size === s);
      if (i >= 0) return c.map((l, j) => (j === i ? { ...l, qty: l.qty + qty } : l));
      return [...c, { id, size: s, qty }];
    });
    notify(`✓ ${p.name} agregado`);
  };

  const totals = useMemo(() => {
    const sub = cart.reduce((a, l) => a + BY_ID[l.id].price * l.qty, 0);
    const disc = coupon ? Math.round(sub * COUPONS[coupon]) : 0;
    const ship = sub - disc >= FREE_SHIP || !sub ? 0 : SHIP;
    return { sub, disc, ship, total: sub - disc + ship };
  }, [cart, coupon]);

  const open = (l: Layer) => { lastFocus.current = document.activeElement as HTMLElement; setLayer(l); };
  const close = () => { setLayer(null); lastFocus.current?.focus(); };
  useEffect(() => {
    document.body.style.overflow = layer ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [layer]);

  const go = (v: View) => { setLayer(null); setView(v); window.scrollTo({ top: 0 }); };

  const placeOrder = (o: Omit<Order, 'n' | 'items'>) => {
    const n = 1049 + orders.length;
    setOrders((prev) => [{ ...o, n, items: cart.reduce((a, l) => a + l.qty, 0) }, ...prev]);
    setStock((s) => { const next = { ...s }; cart.forEach((l) => { next[l.id] = Math.max(0, next[l.id] - l.qty); }); return next; });
    setCart([]);
    setCoupon(null);
    return n;
  };

  const count = cart.reduce((a, l) => a + l.qty, 0);
  const isProduct = layer && typeof layer === 'object';

  return (
    <>
      <div className="demo-bar">✦ Demo de tienda online por <strong>Noir Studio</strong> · Pagos simulados · <a href={`${HOME}#contacto`}>Quiero mi tienda</a></div>

      <header>
        <div className="wrap bar">
          <a className="logo" href="#" onClick={(e) => { e.preventDefault(); go('shop'); }}>ATELIER</a>
          <div className="tabs" role="tablist" aria-label="Vista">
            {(['shop', 'panel'] as View[]).map((v) => (
              <button key={v} type="button" role="tab" aria-selected={view === v} className={view === v ? 'is-on' : ''} onClick={() => go(v)}>
                {v === 'shop' ? 'Tienda' : 'Panel admin'}
              </button>
            ))}
          </div>
          <button className="cart-btn" type="button" aria-label="Abrir carrito" onClick={() => open('cart')}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14l-1.2 11.1A2 2 0 0 1 15.8 20H8.2a2 2 0 0 1-2-1.9Z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" /></svg>
            <span className="lbl">Carrito</span><em>{count}</em>
          </button>
        </div>
      </header>

      {view === 'shop'
        ? <Shop stock={stock} onOpen={(p) => open({ product: p })} onQuick={(p) => (p.sizes && p.sizes.length > 1 ? open({ product: p }) : addToCart(p.id))} />
        : <Panel orders={orders} stock={stock} onStock={(id, d) => setStock((s) => ({ ...s, [id]: Math.max(0, s[id] + d) }))} />}

      <footer className="wrap">Tienda demo hecha por <a href={HOME}>Noir Studio ✦</a> · Código que construye tu visión</footer>

      <div className={`scrim ${layer ? 'is-on' : ''}`} onClick={close} />

      <CartDrawer open={layer === 'cart'} cart={cart} totals={totals} coupon={coupon} stock={stock}
        onClose={close} onCoupon={setCoupon} onCheckout={() => setLayer('checkout')}
        onQty={(i, d) => {
          const line = cart[i];
          if (d > 0 && inCart(line.id) >= stock[line.id]) { notify('No hay más unidades disponibles'); return; }
          setCart((c) => c.map((l, j) => (j === i ? { ...l, qty: l.qty + d } : l)).filter((l) => l.qty > 0));
        }} />

      <div className={`modal ${isProduct ? 'is-on' : ''}`} role="dialog" aria-modal="true" aria-labelledby="pd-name">
        {isProduct && <ProductModal key={layer.product.id} p={layer.product} stock={stock[layer.product.id]} onClose={close}
          onAdd={(size, qty) => { addToCart(layer.product.id, size, qty); close(); }} />}
      </div>

      <div className={`modal modal--checkout ${layer === 'checkout' ? 'is-on' : ''}`} role="dialog" aria-modal="true" aria-labelledby="co-title">
        {layer === 'checkout' && <Checkout total={totals.total} onClose={close} onPlace={placeOrder} onPanel={() => go('panel')} />}
      </div>

      <div className={`toast ${toast ? 'is-on' : ''}`} role="status">{toast}</div>
    </>
  );
}

/* ---------- Tienda ---------- */
function Shop({ stock, onOpen, onQuick }: { stock: Record<string, number>; onOpen: (p: Product) => void; onQuick: (p: Product) => void }) {
  const [filter, setFilter] = useState<Filter>('Todo');
  const [sort, setSort] = useState<'pop' | 'asc' | 'desc'>('pop');
  const list = PRODUCTS
    .filter((p) => filter === 'Todo' || (filter === 'Ofertas' ? !!p.old : p.cat === filter))
    .sort((a, b) => (sort === 'asc' ? a.price - b.price : sort === 'desc' ? b.price - a.price : a.pop - b.pop));
  const showOffers = () => { setFilter('Ofertas'); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <main className="wrap">
      <section className="hero">
        <div>
          <p className="eyebrow">Colección Noche · 2026</p>
          <h1>Piezas para quienes se visten de noche.</h1>
          <p>Ropa, calzado y accesorios en tonos oscuros, hechos para durar. Envío gratis desde {money(FREE_SHIP)}.</p>
          <div className="btns">
            <a className="btn" href="#catalogo">Comprar ahora</a>
            <button className="btn btn--ghost" type="button" onClick={showOffers}>Ver ofertas</button>
          </div>
          <div className="perks"><span>🚚 Envíos a todo el país</span><span>🔒 Pago seguro</span><span>↩️ Cambios en 30 días</span></div>
        </div>
        <div className="hero__imgs">
          <img src={img('chaqueta')} alt="Chaqueta de cuero negra" width={480} height={480} />
          <img src={img('poncho')} alt="Poncho tejido color arena" width={480} height={480} />
        </div>
      </section>

      <div className="toolbar" id="catalogo">
        <div className="chips" role="tablist" aria-label="Categorías">
          {FILTERS.map((f) => (
            <button key={f} type="button" role="tab" aria-selected={f === filter} className={`chip ${f === filter ? 'is-on' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <select className="select" aria-label="Ordenar" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
          <option value="pop">Más vendidos</option><option value="asc">Menor precio</option><option value="desc">Mayor precio</option>
        </select>
      </div>

      <div className="grid">
        {list.map((p) => (
          <article className="card" key={p.id}>
            <button className="card__img" type="button" aria-label={`Ver ${p.name}`} onClick={() => onOpen(p)}>
              <img src={img(p.id)} alt={p.name} width={480} height={480} loading="lazy" />
              {p.old && <span className="tag">-{Math.round((1 - p.price / p.old) * 100)}%</span>}
              {stock[p.id] <= 4 && <span className="tag tag--low">{stock[p.id] ? `Últimas ${stock[p.id]}` : 'Agotado'}</span>}
            </button>
            <div className="card__body">
              <span className="card__cat">{p.cat}</span>
              <button className="card__name" type="button" onClick={() => onOpen(p)}>{p.name}</button>
              <div className="price">{money(p.price)} {p.old && <s>{money(p.old)}</s>}</div>
              <button className="card__add" type="button" disabled={!stock[p.id]} onClick={() => onQuick(p)}>
                {stock[p.id] ? 'Agregar al carrito' : 'Agotado'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

/* ---------- Carrito ---------- */
function CartDrawer({ open, cart, totals, coupon, onClose, onCoupon, onCheckout, onQty }: {
  open: boolean; cart: CartLine[]; totals: { sub: number; disc: number; ship: number; total: number }; coupon: string | null;
  stock: Record<string, number>; onClose: () => void; onCoupon: (c: string | null) => void; onCheckout: () => void; onQty: (i: number, d: number) => void;
}) {
  const [code, setCode] = useState(coupon ?? '');
  const [bad, setBad] = useState(false);
  const left = Math.max(0, FREE_SHIP - (totals.sub - totals.disc));
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (open) closeRef.current?.focus(); }, [open]);

  return (
    <aside className={`drawer ${open ? 'is-on' : ''}`} role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <div className="drawer__head">
        <h2 id="cart-title" className="serif text-[1.6rem]">Tu carrito</h2>
        <button ref={closeRef} className="x" type="button" aria-label="Cerrar" onClick={onClose}>✕</button>
      </div>
      <div className="drawer__body">
        {cart.length ? cart.map((l, i) => (
          <div className="line" key={`${l.id}-${l.size}`}>
            <img src={img(l.id)} alt="" width={64} height={64} />
            <div><b>{BY_ID[l.id].name}</b><small>{l.size ? `Talla ${l.size} · ` : ''}{money(BY_ID[l.id].price)}</small></div>
            <div className="stepper">
              <button type="button" aria-label="Quitar uno" onClick={() => onQty(i, -1)}>−</button>
              <span>{l.qty}</span>
              <button type="button" aria-label="Agregar uno" onClick={() => onQty(i, 1)}>+</button>
            </div>
          </div>
        )) : <p className="empty">Tu carrito está vacío.</p>}
      </div>
      {cart.length > 0 && (
        <div className="drawer__foot">
          <div className="text-[.84rem] text-[var(--muted)]">
            {left ? <>Te faltan <b className="text-[var(--text)]">{money(left)}</b> para envío gratis</> : '🎉 ¡Tienes envío gratis!'}
          </div>
          <div className="ship-bar"><i style={{ width: `${Math.min(100, ((totals.sub - totals.disc) / FREE_SHIP) * 100)}%` }} /></div>
          <form className="coupon" onSubmit={(e) => {
            e.preventDefault();
            const c = code.trim().toUpperCase();
            if (COUPONS[c]) { onCoupon(c); setBad(false); } else { onCoupon(null); setBad(true); }
          }}>
            <input className="input" placeholder="Cupón (prueba NOIR10)" aria-label="Cupón de descuento" value={code} onChange={(e) => setCode(e.target.value)} />
            <button className="small-btn" type="submit">Aplicar</button>
          </form>
          <p className={`msg ${coupon ? 'ok' : bad ? 'bad' : ''}`}>{coupon ? `Cupón ${coupon} aplicado: -10 %` : bad ? 'Cupón no válido' : ''}</p>
          <div className="sum">
            <div><span>Subtotal</span><span>{money(totals.sub)}</span></div>
            {totals.disc > 0 && <div><span>Descuento</span><span className="text-[var(--ok)]">-{money(totals.disc)}</span></div>}
            <div><span>Envío</span><span>{totals.ship ? money(totals.ship) : 'Gratis'}</span></div>
            <div className="grand"><span>Total</span><span>{money(totals.total)}</span></div>
          </div>
          <button className="btn btn--block mt-4" type="button" onClick={onCheckout}>Pagar {money(totals.total)}</button>
        </div>
      )}
    </aside>
  );
}

/* ---------- Detalle de producto ---------- */
function ProductModal({ p, stock, onAdd, onClose }: { p: Product; stock: number; onAdd: (size: string | null, qty: number) => void; onClose: () => void }) {
  const [size, setSize] = useState<string | null>(p.sizes ? p.sizes[Math.min(1, p.sizes.length - 1)] : null);
  const [qty, setQty] = useState(1);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { closeRef.current?.focus(); }, []);
  return (
    <>
      <button ref={closeRef} className="x" type="button" aria-label="Cerrar" onClick={onClose}>✕</button>
      <div className="pd">
        <img src={img(p.id)} alt={p.name} width={480} height={480} />
        <div className="pd__info">
          <span className="eyebrow">{p.cat}</span>
          <h2 id="pd-name">{p.name}</h2>
          <div className="price text-[1.3rem]">{money(p.price)} {p.old && <s>{money(p.old)}</s>}</div>
          <p>{p.desc}</p>
          {p.sizes && <>
            <span className="label">Talla</span>
            <div className="sizes">
              {p.sizes.map((s) => (
                <button key={s} type="button" className={`size ${s === size ? 'is-on' : ''}`} aria-pressed={s === size} onClick={() => setSize(s)}>{s}</button>
              ))}
            </div>
          </>}
          <span className="label">Cantidad</span>
          <div className="stepper self-start">
            <button type="button" aria-label="Menos" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span>{qty}</span>
            <button type="button" aria-label="Más" onClick={() => setQty((q) => Math.min(stock || 1, q + 1))}>+</button>
          </div>
          <span className={`text-[.82rem] ${stock <= 4 ? 'text-[var(--warn)]' : 'text-[var(--muted)]'}`}>
            {stock ? `${stock} unidades disponibles` : 'Agotado'}
          </span>
          <button className="btn btn--block mt-2" type="button" disabled={!stock} onClick={() => onAdd(size, qty)}>Agregar al carrito</button>
        </div>
      </div>
    </>
  );
}

/* ---------- Pago (simulado) ---------- */
function Checkout({ total, onClose, onPlace, onPanel }: {
  total: number; onClose: () => void; onPlace: (o: Omit<Order, 'n' | 'items'>) => number; onPanel: () => void;
}) {
  const [pay, setPay] = useState<PayMethod>('Tarjeta');
  const [data, setData] = useState({ name: '', email: '', address: '', city: '', phone: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ n: number; total: number } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { closeRef.current?.focus(); }, []);
  const set = (k: keyof typeof data) => (e: React.ChangeEvent<HTMLInputElement>) => setData((d) => ({ ...d, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const bad = (Object.keys(data) as (keyof typeof data)[]).find((k) => !data[k].trim() || (k === 'email' && !/^\S+@\S+\.\S+$/.test(data.email)));
    if (bad) { setError('Completa tus datos correctamente.'); (document.getElementById(`co-${bad}`) as HTMLInputElement | null)?.focus(); return; }
    setError(''); setBusy(true);
    setTimeout(() => {
      const [first, last = ''] = data.name.trim().split(' ');
      const n = onPlace({
        who: `${first} ${last.charAt(0)}.`, total, st: pay === 'Contra entrega' ? 'pend' : 'paid', today: true,
        when: `Hoy ${new Date().toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' })}`,
      });
      setDone({ n, total });
      setBusy(false);
    }, 1400);
  };

  if (done) {
    return (
      <>
        <button ref={closeRef} className="x" type="button" aria-label="Cerrar" onClick={onClose}>✕</button>
        <div className="success">
          <div className="check">✓</div>
          <h2 className="serif text-[2rem]" id="co-title">¡Gracias por tu compra!</h2>
          <p className="mt-2 text-[var(--muted)]">Pedido <b className="mono text-[var(--text)]">#{done.n}</b> · {money(done.total)} · {pay}</p>
          <p className="mt-1 text-[var(--muted)]">Te enviamos la confirmación a tu correo.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            <button className="btn btn--ghost" type="button" onClick={onClose}>Seguir comprando</button>
            <button className="btn" type="button" onClick={onPanel}>Ver pedido en el panel</button>
          </div>
        </div>
      </>
    );
  }

  const field = (k: keyof typeof data, ph: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <input className={`input ${extra.className ?? ''}`} id={`co-${k}`} placeholder={ph} aria-label={ph} value={data[k]} onChange={set(k)} {...extra} />
  );

  return (
    <>
      <button ref={closeRef} className="x" type="button" aria-label="Cerrar" onClick={onClose}>✕</button>
      <form className="checkout" noValidate onSubmit={submit}>
        <h2 id="co-title">Finalizar compra</h2>
        <div className="steps"><span className="is-on">1. Datos</span>·<span className="is-on">2. Pago</span>·<span>3. Confirmación</span></div>
        <div className="form-grid">
          {field('name', 'Nombre completo', { autoComplete: 'name' })}
          {field('email', 'Correo', { type: 'email', autoComplete: 'email' })}
          {field('address', 'Dirección de envío', { autoComplete: 'street-address', className: 'full' })}
          {field('city', 'Ciudad', { autoComplete: 'address-level2' })}
          {field('phone', 'Celular', { type: 'tel', autoComplete: 'tel' })}
        </div>
        <p className="label mt-[18px] mb-2">Método de pago</p>
        <div className="pays">
          {PAY_METHODS.map((m) => (
            <button key={m} type="button" className={`pay ${m === pay ? 'is-on' : ''}`} aria-pressed={m === pay} onClick={() => setPay(m)}>
              {m === 'Tarjeta' ? '💳' : m === 'PSE' ? '🏦' : '💵'} {m}
            </button>
          ))}
        </div>
        {pay === 'Tarjeta' && (
          <div className="form-grid mt-3">
            <input className="input full" inputMode="numeric" defaultValue="4242 4242 4242 4242" aria-label="Número de tarjeta (demo)" />
            <input className="input" defaultValue="12/29" aria-label="Vencimiento" />
            <input className="input" defaultValue="123" aria-label="CVC" />
          </div>
        )}
        <p className="msg bad mt-2.5" role="alert">{error}</p>
        <button className="btn btn--block mt-2" type="submit" disabled={busy}>
          {busy ? <><span className="spinner" /> Procesando pago…</> : `Pagar ${money(total)}`}
        </button>
        <p className="mt-2.5 text-center text-[.78rem] text-[var(--muted)]">🔒 Demo: el pago es simulado, no se cobra nada.</p>
      </form>
    </>
  );
}

/* ---------- Panel administrativo ---------- */
function Panel({ orders, stock, onStock }: { orders: Order[]; stock: Record<string, number>; onStock: (id: string, d: number) => void }) {
  const today = orders.filter((o) => o.today);
  const todaySales = 450000 + today.reduce((a, o) => a + o.total, 0);
  const all = [...orders, ...SEED_ORDERS];
  const avg = all.reduce((a, o) => a + o.total, 0) / all.length;
  const low = PRODUCTS.filter((p) => stock[p.id] <= 4).length;
  const days = ['Jue', 'Vie', 'Sáb', 'Dom', 'Lun', 'Mar', 'Hoy'];
  const vals = [...WEEK, todaySales];
  const max = Math.max(...vals);
  const label: Record<Order['st'], [string, string]> = { paid: ['Pagado', 'st--paid'], ship: ['Enviado', 'st--ship'], pend: ['Pendiente', 'st--pend'] };

  return (
    <main className="wrap panel">
      <p className="eyebrow">Panel administrativo</p>
      <h1>Hola, Atelier 👋</h1>
      <div className="kpis">
        <div className="kpi"><span>Ventas hoy</span><b>{money(todaySales)}</b><small>▲ 18 % vs. ayer</small></div>
        <div className="kpi"><span>Pedidos</span><b>{all.length}</b><small>{today.length ? `+${today.length} desde la demo` : 'Esta semana'}</small></div>
        <div className="kpi"><span>Ticket promedio</span><b>{money(avg)}</b><small>▲ 6 %</small></div>
        <div className="kpi"><span>Stock bajo</span><b>{low}</b><small className="text-[var(--warn)]">productos por reponer</small></div>
      </div>
      <div className="panel-grid">
        <div className="box">
          <h3>Ventas de los últimos 7 días</h3>
          <div className="chart">
            {vals.map((v, i) => (
              <div key={days[i]}><i className={i === 6 ? 'today' : ''} style={{ height: `${(v / max) * 100}%` }} title={money(v)} /><span>{days[i]}</span></div>
            ))}
          </div>
        </div>
        <div className="box">
          <h3>Inventario</h3>
          {PRODUCTS.map((p) => {
            const s = stock[p.id];
            const col = s <= 2 ? 'var(--bad)' : s <= 4 ? 'var(--warn)' : 'var(--ok)';
            return (
              <div className="inv" key={p.id}>
                <img src={img(p.id)} alt="" width={40} height={40} loading="lazy" />
                <div>
                  <b className="text-[.88rem]">{p.name}</b><small>{s} en stock</small>
                  <div className="stock"><i style={{ width: `${Math.min(100, (s / 15) * 100)}%`, background: col }} /></div>
                </div>
                <div className="stepper">
                  <button type="button" aria-label={`Restar stock de ${p.name}`} onClick={() => onStock(p.id, -1)}>−</button>
                  <button type="button" aria-label={`Sumar stock de ${p.name}`} onClick={() => onStock(p.id, 1)}>+</button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="box col-span-full">
          <h3>Pedidos recientes</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Pedido</th><th>Cliente</th><th>Productos</th><th>Total</th><th>Estado</th><th>Fecha</th></tr></thead>
              <tbody>
                {all.slice(0, 8).map((o) => (
                  <tr key={o.n}>
                    <td className="mono">#{o.n}</td><td>{o.who}</td><td>{o.items}</td><td><b>{money(o.total)}</b></td>
                    <td><span className={`st ${label[o.st][1]}`}>{label[o.st][0]}</span></td>
                    <td className="text-[var(--muted)]">{o.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
