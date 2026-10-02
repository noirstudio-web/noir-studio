'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { BUDGET_COP, NEEDS } from '@/lib/site';
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

type Fields = { nombre: string; negocio: string; necesidad: string; presupuesto: string; mensaje: string };
const RULES: Record<keyof Fields, (v: string) => string> = {
  nombre: (v) => (v.length >= 2 ? '' : 'Escribe tu nombre.'),
  negocio: () => '',
  necesidad: (v) => (v ? '' : 'Elige qué necesitas.'),
  presupuesto: (v) => (v ? '' : 'Elige un rango de presupuesto.'),
  mensaje: (v) => (v.length >= 10 ? '' : 'Cuéntame un poco más sobre tu proyecto (mínimo 10 caracteres).'),
};

export function QuoteForm() {
  const [fields, setFields] = useState<Fields>({ nombre: '', negocio: '', necesidad: '', presupuesto: '', mensaje: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [tried, setTried] = useState(false);
  const [status, setStatus] = useState<React.ReactNode>('');

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
  const validate = (f: Fields) => {
    const errs: Partial<Record<keyof Fields, string>> = {};
    (Object.keys(RULES) as (keyof Fields)[]).forEach((k) => { const m = RULES[k](f[k].trim()); if (m) errs[k] = m; });
    return errs;
  };
  const update = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const f = { ...fields, [k]: e.target.value };
    setFields(f);
    if (tried) setErrors(validate(f));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTried(true);
    const errs = validate(fields);
    setErrors(errs);
    const first = (Object.keys(errs) as (keyof Fields)[])[0];
    if (first) {
      (e.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus();
      setStatus('Revisa los campos marcados.');
      return;
    }
    // Robot que llenó la trampa: se descarta en silencio
    if (honeypot.current?.value) {
      setFields({ nombre: '', negocio: '', necesidad: '', presupuesto: '', mensaje: '' });
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

    const v = (k: keyof Fields) => fields[k].trim();
    const text = [
      '¡Hola, Noir Studio! 👋',
      'Llené el formulario de tu web y quiero cotizar este proyecto:',
      '',
      `👤 *Nombre:* ${v('nombre')}`,
      `🏢 *Negocio:* ${v('negocio') || 'No especificado'}`,
      `🧩 *Necesito:* ${v('necesidad')}`,
      `💰 *Presupuesto:* ${v('presupuesto')}${v('presupuesto') === UNSURE ? ` (moneda: ${currency})` : ''}`,
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
    store.set(RATE_KEY, recentSends().concat(Date.now()));
    resetVerify();                 // cada envío necesita una verificación nueva
    setStatus(<>✦ ¡Listo! Se abrió WhatsApp con tu mensaje. ¿No se abrió? <a href={url} target="_blank" rel="noopener">Toca aquí</a>.</>);
  };

  const countHuman = (e: React.SyntheticEvent) => { if (e.nativeEvent.isTrusted) humanEvents.current++; };
  const err = (k: keyof Fields) => ({ 'aria-invalid': errors[k] ? true : undefined, 'aria-describedby': `f-${k}-err` });

  return (
    <form className="form reveal" id="quote-form" noValidate onSubmit={onSubmit}
      onPointerDown={countHuman} onKeyDown={countHuman} onInput={countHuman}>
      <h3 className="form__title">Cotiza tu proyecto</h3>
      <p className="form__sub">Al enviar se abrirá WhatsApp con tu mensaje listo.</p>

      <div className="form__row">
        <div className="field">
          <label htmlFor="f-nombre">Nombre <span className="req" aria-hidden="true">*</span></label>
          <input id="f-nombre" name="nombre" type="text" autoComplete="name" required maxLength={60} placeholder="Tu nombre"
            value={fields.nombre} onChange={update('nombre')} {...err('nombre')} />
          <p className="field__error" id="f-nombre-err" aria-live="polite">{errors.nombre}</p>
        </div>
        <div className="field">
          <label htmlFor="f-negocio">Negocio</label>
          <input id="f-negocio" name="negocio" type="text" autoComplete="organization" maxLength={80} placeholder="Tu negocio o marca (opcional)"
            value={fields.negocio} onChange={update('negocio')} {...err('negocio')} />
          <p className="field__error" id="f-negocio-err" aria-live="polite">{errors.negocio}</p>
        </div>
      </div>

      <div className="field">
        <label htmlFor="f-necesidad">¿Qué necesitas? <span className="req" aria-hidden="true">*</span></label>
        <select id="f-necesidad" name="necesidad" required value={fields.necesidad} onChange={update('necesidad')} {...err('necesidad')}>
          <option value="">Selecciona una opción</option>
          {NEEDS.map((n) => <option key={n}>{n}</option>)}
        </select>
        <p className="field__error" id="f-necesidad-err" aria-live="polite">{errors.necesidad}</p>
      </div>

      <div className="form__row form__row--budget">
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
        <div className="field">
          <label htmlFor="f-presupuesto">Presupuesto <span className="req" aria-hidden="true">*</span></label>
          <select id="f-presupuesto" name="presupuesto" required value={fields.presupuesto} onChange={update('presupuesto')} {...err('presupuesto')}>
            <option value="">Selecciona un rango</option>
            {budgetOptions.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <p className="field__error" id="f-presupuesto-err" aria-live="polite">{errors.presupuesto}</p>
        </div>
      </div>

      <div className="field">
        <label htmlFor="f-mensaje">Mensaje <span className="req" aria-hidden="true">*</span></label>
        <textarea id="f-mensaje" name="mensaje" rows={5} required maxLength={1200}
          placeholder="Cuéntame tu idea, qué te gustaría lograr y para cuándo lo necesitas."
          value={fields.mensaje} onChange={update('mensaje')} {...err('mensaje')} />
        <p className="field__error" id="f-mensaje-err" aria-live="polite">{errors.mensaje}</p>
      </div>

      {/* Trampa para robots: invisible para personas; si llega con texto, el envío se descarta */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="f-web">No llenes este campo</label>
        <input id="f-web" name="sitio_web" type="text" tabIndex={-1} autoComplete="off" ref={honeypot} />
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

      <button className="btn btn--chrome btn--block" type="submit">
        Enviar por WhatsApp <span aria-hidden="true">✦</span>
      </button>
      <p className="form__status" id="form-status" role="status" aria-live="polite">{status}</p>
      <p className="form__legal">
        Los campos con <span aria-hidden="true">*</span><span className="sr-only">asterisco</span> son obligatorios.
        Tu información es confidencial. Al enviar aceptas los <a href="terminos/">términos y condiciones</a> y la <a href="terminos/#privacidad">política de privacidad</a>.
      </p>
    </form>
  );
}
