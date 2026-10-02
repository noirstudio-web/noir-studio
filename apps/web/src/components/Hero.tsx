import { asset } from '@/lib/site';
import { WaLink } from './WaLink';

const STATS = [
  { value: '100 %', label: 'a medida' },
  { value: '0', label: 'plantillas' },
  { value: '24/7', label: 'en línea' },
];

export function Hero() {
  const mono = (w: number, file: string) => `${asset(`/assets/${file}`)} ${w}w`;
  return (
    <section className="hero">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="badge intro" style={{ '--i': '0s' } as React.CSSProperties}>
            <span className="badge__dot" aria-hidden="true" /> Disponible para nuevos proyectos
          </p>

          <h1 className="hero__title intro intro--soft" style={{ '--i': '0s' } as React.CSSProperties}>
            <span className="shine">Código que construye tu&nbsp;visión.</span>
          </h1>

          <p className="hero__lead intro intro--soft" style={{ '--i': '.06s' } as React.CSSProperties}>
            Diseño y programo páginas web, tiendas online y apps a medida para negocios que quieren verse
            premium y vender más. Sin plantillas, sin intermediarios: tu idea convertida en un producto
            rápido, seguro y listo para crecer.
          </p>

          <div className="hero__actions intro" style={{ '--i': '.24s' } as React.CSSProperties}>
            <WaLink wa="cotizar" className="btn btn--chrome">
              Cotizar mi proyecto <span aria-hidden="true">✦</span>
            </WaLink>
            <a className="link-arrow hero__more" href="#trabajos">Ver trabajos <span aria-hidden="true">↓</span></a>
          </div>

          <dl className="hero__stats intro" style={{ '--i': '.32s' } as React.CSSProperties}>
            {STATS.map((s) => (
              <div key={s.label}><dt>{s.value.replace(' ', ' ')}</dt><dd>{s.label}</dd></div>
            ))}
          </dl>
        </div>

        <div className="hero__art intro" style={{ '--i': '.1s' } as React.CSSProperties} aria-hidden="true">
          <div className="mono">
            <div className="mono__halo" />
            <div className="mono__ring" />
            <div className="mono__ring mono__ring--inner" />
            <picture>
              <source
                type="image/webp"
                srcSet={[mono(320, 'noir-monograma-320.webp'), mono(480, 'noir-monograma-480.webp'), mono(634, 'noir-monograma.webp')].join(', ')}
                sizes="(max-width: 900px) 40vw, 240px"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="mono__img" src={asset('/assets/noir-monograma.png')} width={634} height={760} alt="" fetchPriority="high" decoding="async" />
            </picture>
          </div>
        </div>
      </div>
    </section>
  );
}
