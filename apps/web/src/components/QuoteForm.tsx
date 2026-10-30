'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { BUDGET_COP, SERVICES, servicePrice } from '@/lib/site';
import { waLink } from '@/lib/whatsapp';

/* ---------- Monedas ---------- */
type Rates = Record<string, number>;
const RATES_URL = 'https://open.er-api.com/v6/latest/USD';   // gratis, sin clave, se actualiza a diario
const RATES_KEY = 'noir-rates';
const CURRENCY_KEY = 'noir-currency';
const FALLBACK: Rates = { USD: 1, COP: 3334, MXN: 18.1, EUR: 0.88, ARS: 1518, PEN: 3.44, CLP: 973, BRL: 5.2 };
const FEATURED = ['COP', 'USD', 'MXN', 'EUR', 'ARS', 'CLP', 'PEN', 'BRL', 'UYU', 'BOB', 'PYG', 'VES', 'GTQ', 'CRC', 'DOP', 'HNL', 'NIO', 'PAB', 'CAD', 'GBP'];
const TZ_CURRENCY: Record<string, string> = {
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
const UNSURE = 'Aún no lo tengo claro';

const store = {
  get<T>(k: string): T | null { try { return JSON.parse(localStorage.getItem(k) ?? 'null') as T | null; } catch { return null; } },
  set(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } },
};
const num = (n: number) => new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(n);
// Redondeo "bonito": 2 cifras significativas (4.312 → 4.300)
const nice = (x: number) => {
  if (x < 10) return Math.max(1, Math.round(x));
  const mag = 10 ** (Math.floor(Math.log10(x)) - 1);
  return Math.round(x / mag) * mag;
};
const validRates = (r: unknown): r is Rates =>
  !!r && typeof r === 'object' && Object.values(r as Rates).every((v) => typeof v === 'number' && Number.isFinite(v) && v > 0);

function guessCurrency() {
  const saved = store.get<string>(CURRENCY_KEY);
  if (saved) return saved;
  let tz = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { /* sin zona */ }
  if (TZ_CURRENCY[tz]) return TZ_CURRENCY[tz];
  if (tz.startsWith('Europe/')) return 'EUR';
  return 'COP';
}

/* ---------- Anti-robots ---------- */
const MIN_TIME_MS = 4000;                       // nadie llena el formulario en menos tiempo
const RATE_KEY = 'noir-form-sends';
const RATE_MAX = 3, RATE_WINDOW = 10 * 60 * 1000; // máximo 3 envíos cada 10 minutos
const recentSends = () => (store.get<number[]>(RATE_KEY) ?? []).filter((t) => Date.now() - t < RATE_WINDOW);

type Fields = {
  nombre: string; negocio: string; ciudad: string; correo: string;
  servicio: string; web: string; plazo: string; presupuesto: string; mensaje: string;
};
type FieldKey = keyof Fields;
const EMPTY: Fields = { nombre: '', negocio: '', ciudad: '', correo: '', servicio: '', web: '', plazo: '', presupuesto: '', mensaje: '' };

const WEB_OPTIONS = ['No, es nueva', 'Sí, quiero renovarla', 'Sí, necesito mejoras'];
const PLAZOS = ['Lo antes posible', 'En 2 a 4 semanas', 'En 1 a 2 meses', 'Sin fecha definida'];
const ASSETS = ['Logo', 'Textos', 'Fotos', 'Dominio'];

const RULES: Partial<Record<FieldKey, (v: string) => string>> = {
  nombre: (v) => (v.length >= 2 ? '' : 'Escribe tu nombre.'),
  correo: (v) => (!v || /^\S+@\S+\.\S{2,}$/.test(v) ? '' : 'Revisa el correo (o déjalo vacío).'),
  servicio: (v) => (v ? '' : 'Elige el servicio que te interesa.'),
  presupuesto: (v) => (v ? '' : 'Elige un rango de presupuesto.'),
  mensaje: (v) => (v.length >= 15 ? '' : 'Cuéntame un poco más sobre tu proyecto (mínimo 15 caracteres).'),
};

export function QuoteForm() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [have, setHave] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FieldKey | 'consent', string>>>({});
  const [tried, setTried] = useState(false);
  const [status, setStatus] = useState<React.ReactNode>('');
  const [picked, setPicked] = useState(false);

  // "Cotizar" en una tarjeta de servicio → llega aquí con ese servicio elegido
  useEffect(() => {
    const onPick = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (!SERVICES.some((s) => s.id === id)) return;
      setFields((f) => ({ ...f, servicio: id }));
      setPicked(true);
      window.setTimeout(() => setPicked(false), 1600);
    };
    window.addEventListener('noir:service', onPick);
    return () => window.removeEventListener('noir:service', onPick);
  }, []);

  // Monedas
  const [rates, setRates] = useState<Rates>(FALLBACK);
  const [currency, setCurrency] = useState('COP');
  const userChose = useRef(false);
  const names = useMemo(() => { try { return new Intl.DisplayNames(['es'], { type: 'currency' }); } catch { return null; } }, []);
  const nameOf = (code: string) => {
    let n = '';
    try { n = names?.of(code) ?? ''; } catch { n = ''; }
    return n && n !== code ? n[0].toUpperCase() + n.slice(1) : code;
  };

  useEffect(() => {
    const wanted = guessCurrency();
    const cached = store.get<{ t: number; rates: Rates }>(RATES_KEY);
    if (cached && validRates(cached.rates) && Date.now() - cached.t < 12 * 3600e3) {
      setRates(cached.rates);
      setCurrency(cached.rates[wanted] ? wanted : 'COP');
      return;
    }
    setCurrency(FALLBACK[wanted] ? wanted : 'COP');
    fetch(RATES_URL)
      .then((r) => r.json())
      .then((d: { result?: string; rates?: unknown }) => {
        if (d.result !== 'success' || !validRates(d.rates) || !d.rates.COP) return;
        setRates(d.rates);
        store.set(RATES_KEY, { t: Date.now(), rates: d.rates });
        if (!userChose.current) setCurrency((d.rates as Rates)[wanted] ? wanted : 'COP');
      })
      .catch(() => { /* se queda con el respaldo */ });
  }, []);

  const budgetOptions = useMemo(() => {
    const convert = (cop: number) => (currency === 'COP' ? cop : nice((cop / rates.COP) * rates[currency]));
    return BUDGET_COP.map((r) =>
      r.min == null ? `Menos de ${num(convert(r.max!))} ${currency}`
        : r.max == null ? `Más de ${num(convert(r.min))} ${currency}`
          : `${num(convert(r.min))} – ${num(convert(r.max))} ${currency}`).concat(UNSURE);
  }, [currency, rates]);

  const currencyGroups = useMemo(() => {
    const codes = Object.keys(rates);
    const featured = FEATURED.filter((c) => rates[c]);
    const rest = codes.filter((c) => !featured.includes(c)).sort((a, b) => nameOf(a).localeCompare(nameOf(b), 'es'));
    return { featured, rest };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rates]);

  const changeCurrency = (c: string) => {
    // conserva el rango elegido (misma posición) en la moneda nueva
    const idx = budgetOptions.indexOf(fields.presupuesto);
    userChose.current = true;
    setCurrency(c);
    store.set(CURRENCY_KEY, c);
    if (idx >= 0) {
      const convert = (cop: number) => (c === 'COP' ? cop : nice((cop / rates.COP) * rates[c]));
      const r = BUDGET_COP[idx];
      const label = !r ? UNSURE : r.min == null ? `Menos de ${num(convert(r.max!))} ${c}`
        : r.max == null ? `Más de ${num(convert(r.min))} ${c}` : `${num(convert(r.min))} – ${num(convert(r.max))} ${c}`;
      setFields((f) => ({ ...f, presupuesto: label }));
    }
  };

  const service = SERVICES.find((s) => s.id === fields.servicio);
  const approx = (cop: number) => (currency === 'COP' ? '' : ` ≈ ${num(nice((cop / rates.COP) * rates[currency]))} ${currency}`);

  /* ---------- Verificación humana ---------- */
  const loadedAt = useRef(0);
  const humanEvents = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const drag = useRef({ dragging: false, start: 0, moves: 0, last: 0 });
  const [slider, setSlider] = useState(0);
  const [verified, setVerified] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  useEffect(() => { loadedAt.current = performance.now(); }, []);

  const resetVerify = (msg = '') => {
    setVerified(false);
    setVerifyError(msg);
    drag.current = { dragging: false, start: 0, moves: 0, last: 0 };
    // vuelve suavemente al inicio
    let v = Number(rangeRef.current?.value ?? 0);
    const back = () => { v = Math.max(0, v - 8); setSlider(v); if (v > 0) requestAnimationFrame(back); };
    back();
  };

  // "change" nativo = el usuario soltó el deslizador
  useEffect(() => {
    const el = rangeRef.current;
    if (!el) return;
    const onChange = (e: Event) => {
      if (verified) return;
      const d = drag.current;
      if (Number(el.value) < 97) { if (d.dragging) resetVerify(); d.dragging = false; return; }
      d.dragging = false;
      const human = e.isTrusted
        && performance.now() - d.start > 150      // nadie arrastra en 0 ms
        && d.moves >= 3                            // movimiento progresivo, no un salto
        && performance.now() - loadedAt.current > 1500;
      if (human) { setVerified(true); setSlider(100); setVerifyError(''); }
      else resetVerify('No pudimos verificarte. Desliza de nuevo, un poco más despacio.');
    };
    el.addEventListener('change', onChange);
    return () => el.removeEventListener('change', onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verified]);

  const onSlide = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (verified) return;
    if (!e.nativeEvent.isTrusted) { setSlider(0); return; }   // movido por código → no cuenta
    const d = drag.current;
    const v = Number(e.target.value);
    if (!d.start) d.start = performance.now();
    if (v !== d.last) { d.moves++; d.last = v; }
    setSlider(v);
  };

  /* ---------- Validación y envío ---------- */
  const validate = (f: Fields, ok = consent) => {
    const errs: Partial<Record<FieldKey | 'consent', string>> = {};
    (Object.keys(RULES) as FieldKey[]).forEach((k) => { const m = RULES[k]!(f[k].trim()); if (m) errs[k] = m; });
    if (!ok) errs.consent = 'Debes aceptar la política de privacidad para enviar.';
    return errs;
  };
  const set = (k: FieldKey, value: string) => {
    const f = { ...fields, [k]: value };
    setFields(f);
    if (tried) setErrors(validate(f));
  };
  const update = (k: FieldKey) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => set(k, e.target.value);
  const toggleHave = (a: string) => setHave((h) => (h.includes(a) ? h.filter((x) => x !== a) : [...h, a]));

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTried(true);
    const errs = validate(fields);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(`f-${first}`)?.focus();
      setStatus('Revisa los campos marcados.');
      return;
    }
    // Robot que llenó la trampa: se descarta en silencio
    if (honeypot.current?.value) {
      setFields(EMPTY);
      setStatus('✦ ¡Gracias! Te responderé pronto.');
      return;
    }
    if (!verified) {
      setVerifyError('Desliza el círculo para confirmar que eres humano.');
      rangeRef.current?.focus();
      setStatus('Falta la verificación humana.');
      return;
    }
    if (!e.nativeEvent.isTrusted || humanEvents.current < 3 || performance.now() - loadedAt.current < MIN_TIME_MS) {
      resetVerify('No pudimos confirmar que eres humano. Inténtalo de nuevo.');
      return;
    }
    if (recentSends().length >= RATE_MAX) {
      setStatus('Ya enviaste varias solicitudes. Espera unos minutos o escríbeme directo por WhatsApp.');
      return;
    }

    const v = (k: FieldKey) => fields[k].trim();
    const opt = (label: string, k: FieldKey) => (v(k) ? [`• *${label}:* ${v(k)}`] : []);
    const text = [
      'Hola, Noir Studio ✦',
      'Te escribo desde tu web para solicitar una cotización.',
      '',
      '*1. Mis datos*',
      `• *Nombre:* ${v('nombre')}`,
      `• *Negocio:* ${v('negocio') || 'Sin especificar'}`,
      ...opt('Ubicación', 'ciudad'),
      ...opt('Correo', 'correo'),
      '',
      '*2. Mi proyecto*',
      `• *Servicio:* ${service ? `${service.title}${service.price != null ? ` (referencia: ${servicePrice(service)})` : ''}` : v('servicio')}`,
      ...opt('Web actual', 'web'),
      ...opt('Para cuándo', 'plazo'),
      `• *Presupuesto:* ${v('presupuesto')}${v('presupuesto') === UNSURE ? ` (moneda: ${currency})` : ''}`,
      ...(have.length ? [`• *Ya tengo:* ${have.join(', ')}`] : []),
      '',
      '*3. Detalles*',
      v('mensaje'),
      '',
      'Quedo atento(a) a tu propuesta. ¡Gracias!',
    ].join('\n');

    const url = waLink(text);
    const a = Object.assign(document.createElement('a'), { href: url, target: '_blank', rel: 'noopener' });
    document.body.append(a);
    a.click();
    a.remove();
    store.set(RATE_KEY, recentSends().concat(Date.now()));
    resetVerify();                 // cada envío necesita una verificación nueva
    setStatus(<>✦ ¡Listo! Se abrió WhatsApp con tu solicitud. ¿No se abrió? <a href={url} target="_blank" rel="noopener">Toca aquí</a>.</>);
  };

  const countHuman = (e: React.SyntheticEvent) => { if (e.nativeEvent.isTrusted) humanEvents.current++; };
  const aria = (k: FieldKey) => ({ 'aria-invalid': errors[k] ? true : undefined, 'aria-describedby': `f-${k}-err` });
  const Err = ({ k }: { k: FieldKey | 'consent' }) => <p className="field__error" id={`f-${k}-err`} aria-live="polite">{errors[k]}</p>;

  return (
    <form className="form form--pro reveal" id="quote-form" noValidate onSubmit={onSubmit}
      onPointerDown={countHuman} onKeyDown={countHuman} onInput={countHuman}>
      <header className="form__head">
        <div>
          <h3 className="form__title">Solicita tu cotización</h3>
          <p className="form__sub">Gratis y sin compromiso. Al enviar se abre WhatsApp con tu solicitud lista.</p>
        </div>
        <ul className="form__badges" aria-label="Lo que incluye">
          <li>✦ Respuesta personal</li><li>✦ Precio cerrado</li><li>✦ 100 % confidencial</li>
        </ul>
      </header>

      {/* 1 · Datos */}
      <fieldset className="form__step">
        <legend><span>01</span> Tus datos</legend>
        <div className="form__row">
          <div className="field">
            <label htmlFor="f-nombre">Nombre completo <span className="req" aria-hidden="true">*</span></label>
            <input id="f-nombre" name="nombre" type="text" autoComplete="name" required maxLength={60} placeholder="Ej: Laura Gómez"
              value={fields.nombre} onChange={update('nombre')} {...aria('nombre')} />
            <Err k="nombre" />
          </div>
          <div className="field">
            <label htmlFor="f-negocio">Negocio o empresa</label>
            <input id="f-negocio" name="negocio" type="text" autoComplete="organization" maxLength={80} placeholder="Ej: Café La Esquina"
              value={fields.negocio} onChange={update('negocio')} {...aria('negocio')} />
            <Err k="negocio" />
          </div>
        </div>
        <div className="form__row">
          <div className="field">
            <label htmlFor="f-ciudad">Ciudad y país</label>
            <input id="f-ciudad" name="ciudad" type="text" autoComplete="address-level2" maxLength={60} placeholder="Ej: Medellín, Colombia"
              value={fields.ciudad} onChange={update('ciudad')} {...aria('ciudad')} />
            <Err k="ciudad" />
          </div>
          <div className="field">
            <label htmlFor="f-correo">Correo <span className="opt">(opcional)</span></label>
            <input id="f-correo" name="correo" type="email" autoComplete="email" inputMode="email" maxLength={80} placeholder="Para enviarte la propuesta"
              value={fields.correo} onChange={update('correo')} {...aria('correo')} />
            <Err k="correo" />
          </div>
        </div>
      </fieldset>

      {/* 2 · Proyecto */}
      <fieldset className="form__step">
        <legend><span>02</span> Tu proyecto</legend>
        <div className={`field ${picked ? 'is-picked' : ''}`}>
          <label htmlFor="f-servicio">Servicio <span className="req" aria-hidden="true">*</span></label>
          <select id="f-servicio" name="servicio" required value={fields.servicio} onChange={update('servicio')} {...aria('servicio')}>
            <option value="">Selecciona un servicio</option>
            {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.title} · {servicePrice(s)}</option>)}
          </select>
          <Err k="servicio" />
          {service && (
            <p className="price-ref" aria-live="polite">
              <span>Precio de referencia</span>
              <b>{service.price != null ? servicePrice(service) : 'Cotización a medida'}</b>
              {service.price != null && <small>{service.price != null && approx(service.price) ? `${approx(service.price).trim()} aprox.` : 'Pesos colombianos'}</small>}
            </p>
          )}
        </div>

        <div className="field">
          <span className="field__label" id="f-web-label">¿Ya tienes página web?</span>
          <div className="chips" role="radiogroup" aria-labelledby="f-web-label">
            {WEB_OPTIONS.map((o) => (
              <label key={o} className={`chip ${fields.web === o ? 'is-on' : ''}`}>
                <input type="radio" name="web" value={o} checked={fields.web === o} onChange={() => set('web', o)} />{o}
              </label>
            ))}
          </div>
        </div>

        <div className="form__row">
          <div className="field">
            <label htmlFor="f-plazo">¿Para cuándo lo necesitas?</label>
            <select id="f-plazo" name="plazo" value={fields.plazo} onChange={update('plazo')}>
              <option value="">Selecciona un plazo</option>
              {PLAZOS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-moneda">Moneda</label>
            <select id="f-moneda" name="moneda" aria-describedby="f-moneda-hint" value={currency} onChange={(e) => changeCurrency(e.target.value)}>
              <optgroup label="Más usadas">
                {currencyGroups.featured.map((c) => <option key={c} value={c}>{c} · {nameOf(c)}</option>)}
              </optgroup>
              <optgroup label="Todas las monedas">
                {currencyGroups.rest.map((c) => <option key={c} value={c}>{c} · {nameOf(c)}</option>)}
              </optgroup>
            </select>
            <p className="field__hint" id="f-moneda-hint">{currency === 'COP' ? 'Elige la de tu país' : 'Valores aproximados según la tasa del día'}</p>
          </div>
        </div>

        <div className="field">
          <label htmlFor="f-presupuesto">Presupuesto disponible <span className="req" aria-hidden="true">*</span></label>
          <select id="f-presupuesto" name="presupuesto" required value={fields.presupuesto} onChange={update('presupuesto')} {...aria('presupuesto')}>
            <option value="">Selecciona un rango</option>
            {budgetOptions.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <Err k="presupuesto" />
        </div>
      </fieldset>

      {/* 3 · Detalles */}
      <fieldset className="form__step">
        <legend><span>03</span> Detalles</legend>
        <div className="field">
          <label htmlFor="f-mensaje">Cuéntame sobre tu proyecto <span className="req" aria-hidden="true">*</span></label>
          <textarea id="f-mensaje" name="mensaje" rows={5} required maxLength={1500}
            placeholder="¿Qué hace tu negocio? ¿Qué quieres lograr con la web? ¿Alguna página que te guste como referencia?"
            value={fields.mensaje} onChange={update('mensaje')} {...aria('mensaje')} />
          <p className="field__count" aria-hidden="true">{fields.mensaje.length} / 1500</p>
          <Err k="mensaje" />
        </div>
        <div className="field">
          <span className="field__label" id="f-have-label">¿Qué tienes listo? <span className="opt">(marca lo que aplique)</span></span>
          <div className="chips" role="group" aria-labelledby="f-have-label">
            {ASSETS.map((a) => (
              <label key={a} className={`chip ${have.includes(a) ? 'is-on' : ''}`}>
                <input type="checkbox" value={a} checked={have.includes(a)} onChange={() => toggleHave(a)} />{have.includes(a) ? '✓ ' : ''}{a}
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      {/* Trampa para robots: invisible para personas; si llega con texto, el envío se descarta */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="f-web-site">No llenes este campo</label>
        <input id="f-web-site" name="sitio_web" type="text" tabIndex={-1} autoComplete="off" ref={honeypot} />
      </div>

      {/* Verificación humana */}
      <div className={`verify ${verified ? 'is-ok' : ''} ${verifyError ? 'is-error' : ''}`} id="verify">
        <p className="verify__label" id="verify-label">Verificación humana <span className="req" aria-hidden="true">*</span></p>
        <div className="verify__track" style={{ '--v': slider } as React.CSSProperties}>
          <span className="verify__fill" aria-hidden="true" />
          <span className="verify__text" aria-hidden="true">{verified ? '✓ Verificado' : 'Desliza para verificar'}</span>
          <input className="verify__range" id="f-human" type="range" min={0} max={100} step={1} ref={rangeRef}
            value={slider} disabled={verified} onChange={onSlide}
            onPointerDown={() => { drag.current.dragging = true; }}
            aria-labelledby="verify-label" aria-describedby="verify-hint f-human-err"
            aria-valuetext={verified ? 'Verificado' : slider ? `${slider} %` : 'Sin verificar'} />
        </div>
        <p className="field__hint" id="verify-hint">Arrastra el círculo hasta el final (o usa las flechas del teclado).</p>
        <p className="field__error" id="f-human-err" aria-live="polite">{verifyError}</p>
      </div>

      {/* Autorización de datos (Ley 1581 de 2012) */}
      <div className="consent">
        <label className={`consent__box ${errors.consent ? 'is-error' : ''}`}>
          <input id="f-consent" type="checkbox" checked={consent} aria-describedby="f-consent-err"
            onChange={(e) => { setConsent(e.target.checked); if (tried) setErrors(validate(fields, e.target.checked)); }} />
          <span>Autorizo el tratamiento de mis datos según la <a href="privacidad/">política de privacidad</a> y acepto los <a href="terminos/">términos y condiciones</a>. Mi información es confidencial.</span>
        </label>
        <Err k="consent" />
      </div>

      <button className="btn btn--chrome btn--block" type="submit">
        Cotizar mi proyecto <span aria-hidden="true">✦</span>
      </button>
      <p className="form__status" id="form-status" role="status" aria-live="polite">{status}</p>
      <p className="form__legal">Los campos con <span aria-hidden="true">*</span><span className="sr-only">asterisco</span> son obligatorios.</p>
    </form>
  );
}
