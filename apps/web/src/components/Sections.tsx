import { asset, FAQ, MARQUEE, PERKS, PROJECTS, SERVICE_CONDITIONS, SERVICES, servicePrice, type Project } from '@/lib/site';
import { Icon } from './Icon';
import { SectionHead } from './SectionHead';
import { ServicePick } from './ServicePick';
import { WaLink } from './WaLink';

/* ---------- Cinta: servicios y beneficios ---------- */
export function Marquee() {
  const items = MARQUEE.map((t) => <li key={t}>{t.replace(' %', ' %')}</li>);
  return (
    <section className="marquee" aria-label="Lo que hacemos en Noir Studio">
      <div className="marquee__row">
        <div className="marquee__track">
          <ul className="marquee__list">{items}</ul>
          <ul className="marquee__list" aria-hidden="true">{items}</ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- Servicios y precios ---------- */
export function Services() {
  return (
    <section className="section" id="servicios" aria-labelledby="servicios-title">
      <div className="container">
        <SectionHead id="servicios-title" eyebrow="01 — Servicios" title="Servicios y precios claros"
          lead="Precios en pesos colombianos. Lo que acordamos por escrito es lo que pagas, sin costos ocultos." />
        <div className="cards cards--3 cards--services">
          {SERVICES.map((s) => (
            <article className={`card card--service glow reveal ${s.id === 'otros' ? 'card--other' : ''}`} key={s.id}>
              <div className="card__top">
                <div className="card__icon" aria-hidden="true"><Icon name={s.icon} /></div>
                <p className="card__price">
                  {s.price == null
                    ? <b>A tu medida</b>
                    : <>{s.from && <small>Desde</small>}<b>{servicePrice({ ...s, from: false, unit: undefined })}</b>{s.unit && <small>{s.unit}</small>}</>}
                </p>
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <ul className="tags">{s.tags.map((t) => <li key={t}>{t}</li>)}</ul>
              <ServicePick id={s.id} title={s.title} />
            </article>
          ))}
        </div>
        <ul className="conditions reveal" aria-label="Condiciones">
          {SERVICE_CONDITIONS.map((c) => <li key={c.text}><span aria-hidden="true">{c.icon}</span>{c.text}</li>)}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Trabajos ---------- */
function Shot({ p }: { p: Project }) {
  const img = (
    <picture>
      <source type="image/webp" srcSet={p.shot.webp.map((s) => `${asset(s.src)} ${s.w}w`).join(', ')}
        sizes={p.frame === 'phone' ? '250px' : '(max-width: 900px) 92vw, 560px'} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={p.frame === 'phone' ? 'phone__shot' : 'project__shot'} src={asset(p.shot.jpg)}
        width={p.shot.w} height={p.shot.h} alt={p.shot.alt} loading="lazy" />
    </picture>
  );
  if (p.frame === 'phone') {
    return (
      <div className="phone">
        <div className="phone__notch" aria-hidden="true" />
        <div className="phone__screen">{img}</div>
      </div>
    );
  }
  return (
    <div className="browser">
      <div className="browser__bar" aria-hidden="true"><i /><i /><i /><span>{p.urlLabel}</span></div>
      {img}
    </div>
  );
}

export function Projects() {
  return (
    <section className="section" id="trabajos" aria-labelledby="trabajos-title">
      <div className="container">
        <SectionHead id="trabajos-title" eyebrow="02 — Trabajos" title="Proyectos que hablan por mí"
          lead="Proyectos en línea y demos funcionales que puedes probar ahora mismo." />
        <div className="projects">
          {PROJECTS.map((p, i) => {
            const url = p.external ? p.url : asset(p.url);
            return (
              <article className={`project reveal ${i % 2 ? 'project--flip' : ''}`} key={p.title}>
                <a className="project__media project__media--live glow" href={url} target="_blank" rel="noopener"
                  aria-label={`Abrir ${p.title} (se abre en otra pestaña)`}>
                  <Shot p={p} />
                </a>
                <div className="project__body">
                  <div className="project__meta">
                    <span className={`pill ${p.status === 'live' ? 'pill--live' : ''}`}>{p.status === 'live' ? 'En línea' : 'Demo'}</span>
                    <span className="project__type">{p.type}</span>
                  </div>
                  <h3 className="project__title">{p.title}</h3>
                  <p>{p.text}</p>
                  <ul className="project__list">{p.points.map((x) => <li key={x}>{x}</li>)}</ul>
                  <ul className="tags">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                  <div className="project__links">
                    <a className="link-arrow" href={url} target="_blank" rel="noopener">
                      {p.status === 'live' ? 'Ver proyecto' : 'Ver demo'} <span aria-hidden="true">↗</span>
                    </a>
                    <WaLink wa={p.wa} className="link-arrow">Cotizar algo así <span aria-hidden="true">→</span></WaLink>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Por qué Noir ---------- */
export function Perks() {
  return (
    <section className="section" id="por-que" aria-labelledby="porque-title">
      <div className="container">
        <SectionHead id="porque-title" eyebrow="04 — Por qué Noir" title="Más que una web bonita"
          lead="Trabajas directamente con quien diseña y programa tu proyecto." />
        <ul className="perks">
          {PERKS.map((p) => (
            <li className="perk glow reveal" key={p.title}>
              <Icon name={p.icon} />
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Preguntas frecuentes ---------- */
export function Faq() {
  return (
    <section className="section" id="preguntas" aria-labelledby="faq-title">
      <div className="container faq">
        <SectionHead id="faq-title" eyebrow="05 — Preguntas" title="Preguntas frecuentes"
          lead="¿No ves tu duda? Escríbeme y te respondo personalmente." />
        <div className="accordion reveal">
          {FAQ.map((f) => (
            <details className="qa" name="faq" key={f.q}>
              <summary>{f.q}</summary>
              <div className="qa__body"><p>{f.a}</p></div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
