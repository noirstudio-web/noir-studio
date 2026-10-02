import type { Metadata } from 'next';
import { asset, BASE_PATH } from '@/lib/site';

export const metadata: Metadata = { title: 'Página no encontrada · Noir Studio', robots: { index: false } };

/** Página 404 (hecha con utilidades de Tailwind CSS). */
export default function NotFound() {
  return (
    <main id="inicio" tabIndex={-1} className="grid min-h-screen place-items-center bg-[radial-gradient(60%_50%_at_50%_0%,rgba(212,216,222,.08),transparent_70%)] px-4 py-8 text-center">
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset('/assets/noir-monograma-320.webp')} width={320} height={384} alt=""
          className="mx-auto h-auto w-28 motion-safe:animate-[float_6s_ease-in-out_infinite]" />
        <p aria-hidden="true" className="shine mt-7 block font-display text-[clamp(3.5rem,16vw,7rem)] leading-none">404</p>
        <h1 className="mt-3 font-display text-[clamp(1.1rem,4vw,1.5rem)] font-normal text-white">Esta página se perdió en el espacio</h1>
        <p className="mx-auto mt-3.5 max-w-[42ch] text-noir-muted">
          El enlace que abriste no existe o cambió de lugar. Vuelve al inicio o escríbeme y te ayudo.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a className="btn btn--chrome" href={`${BASE_PATH}/`}>Volver al inicio ✦</a>
          <a className="btn btn--ghost" href={`${BASE_PATH}/#contacto`}>Escribir por WhatsApp</a>
        </div>
        <p className="mt-10 font-mono text-xs uppercase tracking-[.14em] text-noir-muted">✦ Noir Studio · Código que construye tu visión</p>
      </div>
    </main>
  );
}
