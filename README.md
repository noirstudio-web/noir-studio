# Noir Studio ✦

**Código que construye tu visión** · Ideas / Código / Resultados

## 👉 [Ver la web en vivo](https://noirstudio-web.github.io/noir-studio/)

- WhatsApp: escríbenos desde la web
- Comunidad en Discord: [discord.gg/fNWeKew86h](https://discord.gg/fNWeKew86h)

---

## Tecnologías

| Parte | Tecnologías |
|---|---|
| Web principal (`apps/web`) | **Next.js 16** · **React 19** · **TypeScript** · **Tailwind CSS 4** · Node.js |
| Demos (`apps/demos`) | **Vite 8** · **React 19** · **TypeScript** · **Tailwind CSS 4** |
| Publicación | **Git** · **GitHub** · GitHub Actions → GitHub Pages |

## Estructura

```
apps/
├── web/                     ← Next.js (exporta HTML estático)
│   ├── src/app/             ← páginas: inicio, /terminos, 404
│   ├── src/components/      ← secciones en React (Hero, Process, QuoteForm, Effects…)
│   ├── src/lib/site.ts      ← ✦ DATOS: número, mensajes, precios, servicios, proyectos, FAQ
│   ├── public/              ← logos, imágenes, favicons, robots.txt, sitemap.xml
│   └── scripts/csp.mjs      ← agrega la política de seguridad a cada página
└── demos/                   ← Vite: /demos/noir-menu y /demos/tienda
scripts/merge.mjs            ← une web + demos en _site/
.github/workflows/deploy.yml ← compila y publica solo en cada cambio
```

## Cómo cambiar lo más común

Casi todo está en **`apps/web/src/lib/site.ts`**:

| Quiero cambiar… | Busca en `site.ts` |
|---|---|
| Número de WhatsApp | `WHATSAPP_PARTS` |
| Mensajes que llegan por WhatsApp | `WA_MESSAGES` |
| Rangos de presupuesto (en COP) | `BUDGET_COP` |
| Frases de la cinta | `MARQUEE` |
| Servicios, proyectos, pasos, ventajas, preguntas | `SERVICES`, `PROJECTS`, `STEPS`, `PERKS`, `FAQ` |

Para agregar un proyecto real: copia el primer elemento de `PROJECTS`, cambia los datos y pon su captura en `apps/web/public/assets/proyectos/`.

## Trabajar en tu computador

```bash
npm install          # una sola vez
npm run dev          # web en http://localhost:3000/noir-studio
npm run dev:demos    # demos en http://localhost:5173/noir-studio/demos/
npm run build        # compila todo en _site/
```

Al subir cambios a `main` (`git push`), GitHub Actions compila y publica la web en 1–3 minutos.

## Seguridad

- **Política de seguridad (CSP)** en cada página: solo se ejecuta el código de esta web (los hashes se calculan solos al compilar).
- **Anti-clickjacking**: si otra web intenta mostrar esta dentro de un marco, la página se oculta.
- **Formulario anti-robots**: verificación humana deslizable, trampa invisible, detección de acciones automáticas, tiempo mínimo y máximo 3 envíos cada 10 minutos.
- **Número de WhatsApp oculto** para robots (se arma en el navegador).
- **Tipografías propias**: la web principal no hace peticiones a Google al visitarla.
- **robots.txt** bloquea robots de IA y de herramientas SEO (efectivo con dominio propio).

## Dominio propio

1. Compra el dominio y en GitHub ve a **Settings → Pages → Custom domain**.
2. DNS: registros `A` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` y `CNAME www` → `noirstudio-web.github.io`.
3. En `.github/workflows/deploy.yml` agrega `BASE_PATH: ""` como variable de entorno del paso de compilación,
   y cambia `SITE_URL` en `site.ts`, `sitemap.xml` y `robots.txt` por tu dominio.

La versión anterior (HTML, CSS y JavaScript puro) quedó guardada en la etiqueta `v1-html`.
