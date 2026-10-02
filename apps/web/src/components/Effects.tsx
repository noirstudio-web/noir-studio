'use client';

import { useEffect, useRef } from 'react';

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

type Star = { x: number; y: number; z: number; big: boolean; phase: number; tw: number; px: number | null; py: number | null };

/**
 * Experiencia inmersiva:
 *  - estrellas ✦ en 3D que vienen hacia ti (con salto "warp" al hacer scroll rápido)
 *  - monograma 3D que sigue el mouse / el giroscopio
 *  - tarjetas que se inclinan, luz que sigue al cursor y barra de progreso
 *  - secciones que aparecen al hacer scroll
 * Todo se desactiva si el visitante pidió reducir el movimiento.
 */
export function Effects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const immersive = !reduced;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const cleanups: (() => void)[] = [];
    const on = <K extends keyof WindowEventMap>(t: K, fn: (e: WindowEventMap[K]) => void, opts?: AddEventListenerOptions) => {
      window.addEventListener(t, fn, opts);
      cleanups.push(() => window.removeEventListener(t, fn));
    };

    /* ---------- Aparición al hacer scroll ---------- */
    const reveals = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    reveals.forEach((el) => {
      const sib = Array.from(el.parentElement?.children ?? []).filter((c) => c.classList.contains('reveal'));
      const i = sib.indexOf(el);
      if (i > 0) el.style.setProperty('--d', `${Math.min(i, 6) * 80}ms`);
    });
    if (reduced || !('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.setAttribute('data-in', ''));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.setAttribute('data-in', ''); io.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      reveals.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    }

    /* ---------- Puntero / giroscopio ---------- */
    const pointer = { x: 0, y: 0, px: 0, py: 0, seen: false };
    on('pointermove', (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      pointer.px = e.clientX; pointer.py = e.clientY; pointer.seen = true;
    }, { passive: true });
    on('deviceorientation', (e) => {
      if (e.gamma == null || e.beta == null) return;
      pointer.x = clamp(e.gamma / 30, -1, 1);
      pointer.y = clamp((e.beta - 45) / 30, -1, 1);
    }, { passive: true });

    /* ---------- Tarjetas: brillo + inclinación 3D ---------- */
    if (finePointer) {
      type Tilt = { el: HTMLElement; rx: number; ry: number; lift: number; trx: number; tryy: number; tlift: number; on: boolean };
      const active = new Set<Tilt>();
      let tiltRaf = 0;
      const tiltLoop = () => {
        active.forEach((t) => {
          t.rx += (t.trx - t.rx) * 0.14;
          t.ry += (t.tryy - t.ry) * 0.14;
          t.lift += (t.tlift - t.lift) * 0.14;
          t.el.style.transform = `perspective(1000px) rotateX(${t.rx.toFixed(2)}deg) rotateY(${t.ry.toFixed(2)}deg) translateY(${t.lift.toFixed(2)}px)`;
          if (!t.on && Math.abs(t.rx) + Math.abs(t.ry) + Math.abs(t.lift) < 0.05) {
            t.el.style.transform = '';
            t.el.removeAttribute('data-tilting');
            active.delete(t);
          }
        });
        tiltRaf = active.size ? requestAnimationFrame(tiltLoop) : 0;
      };
      document.querySelectorAll<HTMLElement>('.glow').forEach((el) => {
        const max = el.matches('.project__media') ? 4 : 7;
        const lift = el.matches('.card') ? -8 : el.matches('.project__media') ? -2 : -6;
        const t: Tilt = { el, rx: 0, ry: 0, lift: 0, trx: 0, tryy: 0, tlift: 0, on: false };
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const x = e.clientX - r.left, y = e.clientY - r.top;
          el.style.setProperty('--mx', `${x}px`);
          el.style.setProperty('--my', `${y}px`);
          if (!immersive) return;
          t.on = true;
          t.tryy = (x / r.width - 0.5) * 2 * max;
          t.trx = -(y / r.height - 0.5) * 2 * max;
          t.tlift = lift;
          el.setAttribute('data-tilting', '');
          active.add(t);
          if (!tiltRaf) tiltRaf = requestAnimationFrame(tiltLoop);
        };
        const leave = () => { t.on = false; t.trx = 0; t.tryy = 0; t.tlift = 0; };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        cleanups.push(() => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); });
      });
      cleanups.push(() => cancelAnimationFrame(tiltRaf));
    }

    /* ---------- Escena: estrellas 3D, monograma, luz y progreso ---------- */
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return () => cleanups.forEach((f) => f());

    const hero = document.querySelector<HTMLElement>('.hero');
    const mono = document.querySelector<HTMLElement>('.mono');
    const heroCopy = document.querySelector<HTMLElement>('.hero__copy');
    const heroArt = document.querySelector<HTMLElement>('.hero__art');

    let spot: HTMLDivElement | null = null, progress: HTMLDivElement | null = null;
    if (immersive) {
      progress = Object.assign(document.createElement('div'), { className: 'scroll-progress' });
      progress.setAttribute('aria-hidden', 'true');
      document.body.append(progress);
      if (finePointer) {
        spot = Object.assign(document.createElement('div'), { className: 'spotlight' });
        spot.setAttribute('aria-hidden', 'true');
        canvas.after(spot);
      }
      cleanups.push(() => { progress?.remove(); spot?.remove(); });
    }

    let w = 0, h = 0, stars: Star[] = [], raf = 0, last = 0;
    let sx = 0, sy = 0, scrollVel = 0, lastScroll = window.scrollY, warp = 0;
    const makeStar = (z = Math.random()): Star => ({
      x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.max(0.08, z),
      big: Math.random() < 0.07, phase: Math.random() * Math.PI * 2, tw: 0.0008 + Math.random() * 0.0016, px: null, py: null,
    });
    const resize = () => {
      const newW = window.innerWidth;
      const widthChanged = newW !== w;
      w = newW; h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (widthChanged || !stars.length) {
        stars = Array.from({ length: clamp(Math.round((w * h) / 8000), 60, 220) }, () => makeStar());
      }
    };
    // Estrella de 4 puntas ✦
    const drawStar = (x: number, y: number, r: number) => {
      const k = r * 0.16;
      ctx.beginPath();
      ctx.moveTo(x, y - r);
      ctx.quadraticCurveTo(x + k, y - k, x + r, y);
      ctx.quadraticCurveTo(x + k, y + k, x, y + r);
      ctx.quadraticCurveTo(x - k, y + k, x - r, y);
      ctx.quadraticCurveTo(x - k, y - k, x, y - r);
      ctx.fill();
    };
    const render = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2 + sx * -w * 0.04, cy = h / 2 + sy * -h * 0.04;
      const spread = Math.max(w, h) * 0.55;
      const speed = 0.000035 + warp;
      const streak = warp > 0.00012;
      for (const s of stars) {
        const pz = s.z;
        s.z -= speed * dt;
        if (s.z <= 0.06) { Object.assign(s, makeStar(1)); continue; }
        const scale = 1 / s.z;
        const x = cx + s.x * spread * scale * 0.5 - sx * 26 * scale;
        const y = cy + s.y * spread * scale * 0.5 - sy * 26 * scale;
        if (x < -60 || x > w + 60 || y < -60 || y > h + 60) { Object.assign(s, makeStar(1)); continue; }
        const near = 1 - s.z;
        const a = clamp(0.12 + near * 1.6, 0, 1) * (0.6 + 0.4 * Math.sin(t * s.tw + s.phase)) * (s.big ? 1 : 0.85);
        const r = (0.35 + near * near * 2.6) * (s.big ? 2.2 : 1);
        if (streak && s.px != null && s.py != null && pz !== s.z) {
          ctx.strokeStyle = `rgba(232, 233, 238, ${a * 0.55})`;
          ctx.lineWidth = Math.max(0.6, r * 0.45);
          ctx.beginPath(); ctx.moveTo(s.px, s.py); ctx.lineTo(x, y); ctx.stroke();
        }
        if (s.big && near > 0.35) {
          ctx.fillStyle = `rgba(232, 233, 238, ${a * 0.07})`;
          ctx.beginPath(); ctx.arc(x, y, r * 2.4, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = `rgba(${s.big ? '255, 255, 255' : '232, 233, 238'}, ${a})`;
        drawStar(x, y, r * 1.8);
        s.px = x; s.py = y;
      }
    };

    // Alturas cacheadas (evita recálculos de diseño en cada cuadro)
    let heroH = hero?.offsetHeight ?? 1;
    let docMax = document.documentElement.scrollHeight - window.innerHeight;
    const measure = () => { heroH = hero?.offsetHeight ?? 1; docMax = document.documentElement.scrollHeight - window.innerHeight; };
    if ('ResizeObserver' in window) { const ro = new ResizeObserver(measure); ro.observe(document.body); cleanups.push(() => ro.disconnect()); }

    let lastP = -1;
    const scene = () => {
      sx += (pointer.x - sx) * 0.05;
      sy += (pointer.y - sy) * 0.05;
      const y = window.scrollY;
      scrollVel += ((y - lastScroll) - scrollVel) * 0.2;
      lastScroll = y;
      warp += (clamp(Math.abs(scrollVel) * 0.000014, 0, 0.0011) - warp) * 0.08;
      if (mono) mono.style.transform = `rotateX(${(-sy * 16).toFixed(2)}deg) rotateY(${(sx * 22).toFixed(2)}deg)`;
      // Al bajar "atraviesas" el hero: el texto se aleja y el monograma viene hacia ti
      if (hero && heroCopy && heroArt) {
        const p = clamp(y / (heroH * 0.85), 0, 1);
        if (Math.abs(p - lastP) > 0.001) {
          lastP = p;
          if (p > 0) {
            heroCopy.style.transform = `translate3d(0, ${(p * 90).toFixed(1)}px, 0)`;
            heroCopy.style.opacity = String(clamp(1 - p * 1.25, 0, 1));
            heroArt.style.transform = `translate3d(0, ${(p * -30).toFixed(1)}px, 0) scale(${(1 + p * 0.5).toFixed(3)})`;
            heroArt.style.opacity = String(clamp(1 - p * 1.1, 0, 1));
          } else {
            heroCopy.style.transform = heroCopy.style.opacity = heroArt.style.transform = heroArt.style.opacity = '';
          }
        }
      }
      if (spot && pointer.seen) {
        spot.classList.add('is-on');
        spot.style.transform = `translate3d(${pointer.px}px, ${pointer.py}px, 0)`;
      }
      if (progress) progress.style.transform = `scaleX(${docMax > 0 ? clamp(y / docMax, 0, 1).toFixed(4) : 0})`;
    };

    const loop = (t: number) => {
      const dt = Math.min(t - (last || t), 50);
      last = t;
      scene();
      render(t, dt);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      if (!immersive) { render(0, 0); return; }
      last = 0;
      raf = requestAnimationFrame(loop);
    };

    resize();
    // Las estrellas arrancan cuando la página terminó de cargar (no compiten con el primer pintado)
    if (document.readyState === 'complete') start(); else on('load', start, { once: true });
    let rt = 0;
    on('resize', () => {
      measure();
      clearTimeout(rt);
      rt = window.setTimeout(() => { resize(); if (!immersive) render(0, 0); }, 150);
    });
    const onVis = () => { if (document.hidden) cancelAnimationFrame(raf); else start(); };
    document.addEventListener('visibilitychange', onVis);
    cleanups.push(() => { document.removeEventListener('visibilitychange', onVis); cancelAnimationFrame(raf); });

    return () => cleanups.forEach((f) => f());
  }, []);

  return (
    <>
      <canvas id="stars" ref={canvasRef} aria-hidden="true" />
      <div className="bg-glow" aria-hidden="true" />
    </>
  );
}
