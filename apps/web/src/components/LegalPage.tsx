import { Effects } from './Effects';
import { Footer } from './Footer';
import { Nav } from './Nav';
import { WaLink } from './WaLink';

export type LegalSection = { id: string; title: string; body: React.ReactNode };

/** Plantilla de las páginas legales: índice a la izquierda y secciones numeradas. */
export function LegalPage({ title, lead, updated, sections, question }: {
  title: string; lead: string; updated: string; sections: LegalSection[]; question: string;
}) {
  return (
    <>
      <Effects />
      <Nav onHome={false} />
      <main id="inicio" tabIndex={-1} className="legal-page">
        <div className="container">
          <header className="legal-hero reveal">
            <p className="eyebrow"><span aria-hidden="true">✦</span> Legal</p>
            <h1 className="section__title legal-hero__title">{title}</h1>
            <p className="section__lead">{lead}</p>
            <p className="legal-hero__date">Última actualización: {updated}</p>
          </header>

          <div className="legal">
            <nav className="legal__toc reveal" aria-label="Contenido">
              <p className="legal__toc-title">Contenido</p>
              <ol>{sections.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>)}</ol>
            </nav>

            <article className="legal__body">
              {sections.map((s, i) => (
                <section id={s.id} className="reveal" key={s.id}>
                  <h2><span>{String(i + 1).padStart(2, '0')}</span> {s.title}</h2>
                  {s.body}
                </section>
              ))}
              <div className="legal__cta reveal">
                <p><b>{question}</b> Escríbeme y te respondo personalmente.</p>
                <WaLink wa="terminos" className="btn btn--chrome">Escribir por WhatsApp <span aria-hidden="true">✦</span></WaLink>
              </div>
            </article>
          </div>
        </div>
      </main>
      <Footer onHome={false} />
    </>
  );
}
