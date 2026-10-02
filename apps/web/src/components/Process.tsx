'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PROMISES, STAGES, STEPS } from '@/lib/site';
import { SectionHead } from './SectionHead';
import { WaLink } from './WaLink';

const LAST = STAGES.length - 1;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** "✓ Entrega: [[2 semanas]]" → nodos con colores */
function Output({ line }: { line: string }) {
  const mark = line[0];
  return (
    <>
      <span className={mark === '✦' ? 't-star' : 't-ok'}>{mark}</span>
      {line.slice(1).split(/(\[\[.*?\]\])/).map((part, i) =>
        part.startsWith('[[') ? <span className="t-hl" key={i}>{part.slice(2, -2)}</span> : part)}
    </>
  );
}

export function Process() {
  const [stage, setStage] = useState(LAST);         // sin JS: proyecto terminado
  const [typed, setTyped] = useState(STAGES[LAST].lines[0].length - 1);
  const [shown, setShown] = useState(STAGES[LAST].lines.length - 1);
  const run = useRef(0);
  const manual = useRef(false);
  const trackerRef = useRef<HTMLDivElement>(null);

  // Escribe el paso i como en una terminal; devuelve false si otro paso lo interrumpió
  const play = useCallback(async (i: number, animate: boolean) => {
    const id = ++run.current;
    const [cmd, ...outs] = STAGES[i].lines;
    setStage(i);
    if (!animate) { setTyped(cmd.length - 1); setShown(outs.length); return true; }
    setTyped(0); setShown(0);
    for (let c = 1; c < cmd.length; c++) {
      if (id !== run.current) return false;
      setTyped(c);
      await sleep(24 + Math.random() * 40);
    }
    await sleep(380);
    for (let o = 1; o <= outs.length; o++) {
      if (id !== run.current) return false;
      setShown(o);
      await sleep(300);
    }
    return id === run.current;
  }, []);

  // Recorrido automático mientras el panel está en pantalla
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window) || !trackerRef.current) return;
    let visible = false, looping = false;
    const loop = async () => {
      if (looping) return;
      looping = true;
      let i = 0;
      while (visible && !manual.current) {
        if (!(await play(i, true))) break;
        await sleep(i === LAST ? 4200 : 2200);
        i = i === LAST ? 0 : i + 1;
      }
      looping = false;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !manual.current) loop();
    }, { threshold: 0.35 });
    io.observe(trackerRef.current);
    return () => { io.disconnect(); run.current++; };
  }, [play]);

  const choose = (i: number) => {
    manual.current = true;
    play(i, !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  };

  const pct = Math.round(((stage + 1) / STAGES.length) * 100);
  const [cmd, ...outs] = STAGES[stage].lines;

  return (
    <section className="section" id="proceso" aria-labelledby="proceso-title">
      <div className="container">
        <SectionHead id="proceso-title" eyebrow="03 — Proceso" title={<>De tu idea a tu web en línea, en 5&nbsp;pasos</>}
          lead="Sin tecnicismos ni sorpresas: sabes qué pasa, qué recibes y cuándo, desde el primer mensaje hasta el día del lanzamiento." />

        <div className="process">
          <ol className="steps" style={{ '--fill': String((stage / LAST) * 100) } as React.CSSProperties}>
            {STEPS.map((s, n) => {
              const cls = n === stage ? 'is-active' : n < stage || stage === LAST ? 'is-done' : '';
              return (
                <li className={`step reveal ${cls}`} key={s.title} onClick={() => choose(n)}>
                  <span className="step__num" aria-hidden="true">{String(n + 1).padStart(2, '0')}</span>
                  <div className="step__body">
                    <span className="step__time">{s.time}</span>
                    <h3><button className="step__btn" type="button" aria-controls="tracker" aria-pressed={n === stage}>{s.title}</button></h3>
                    <p className="step__tagline">{s.tagline}</p>
                    <p>{s.text}</p>
                    <p className="step__get"><span aria-hidden="true">✦</span> Recibes: {s.get}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="tracker reveal" id="tracker" ref={trackerRef} aria-label="Seguimiento de ejemplo de un proyecto">
            <div className="tracker__head">
              <div>
                <span className="tracker__label">Tu proyecto</span>
                <b className="tracker__site">tunegocio.com</b>
              </div>
              <span className={`tracker__status ${stage < LAST ? 'is-working' : ''}`} aria-live="polite">
                <i aria-hidden="true" /><span>{STAGES[stage].status}</span>
              </span>
            </div>
            <div className="tracker__progress">
              <div className="tracker__bar"><i style={{ width: `${pct}%` }} /></div>
              <span className="tracker__pct">{pct}&nbsp;%</span>
            </div>
            <ol className="tracker__miles">
              {STEPS.map((s, n) => (
                <li key={s.title} className={n === stage ? 'is-active' : n < stage || stage === LAST ? 'is-done' : ''}>{s.title}</li>
              ))}
            </ol>
            <div className="terminal">
              <div className="terminal__bar"><i /><i /><i /><span>noir@studio: ~/tu-proyecto</span></div>
              <pre className="terminal__body"><code>
                <span className="t-p">$</span>{cmd.slice(1, typed + 1)}
                {outs.slice(0, shown).map((l) => <span key={l}>{'\n'}<Output line={l} /></span>)}
                <span className="caret" aria-hidden="true" />
              </code></pre>
            </div>
          </div>
        </div>

        <ul className="promises reveal" aria-label="Lo que te garantizo">
          {PROMISES.map((p) => (
            <li key={p.title}><span aria-hidden="true">{p.icon}</span><div><b>{p.title}</b><small>{p.text}</small></div></li>
          ))}
        </ul>

        <div className="process__cta reveal">
          <p><b>¿Damos el paso 1?</b> La primera charla es gratis y sin compromiso.</p>
          <WaLink wa="cotizar" className="btn btn--chrome">Cotizar mi proyecto <span aria-hidden="true">✦</span></WaLink>
        </div>
      </div>
    </section>
  );
}
