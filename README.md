# Noir Studio ✦

**Código que construye tu visión** · Ideas / Código / Resultados

## 👉 [Ver la web en vivo](https://noirstudio-web.github.io/noir-studio/)

https://noirstudio-web.github.io/noir-studio/

- WhatsApp: [+57 313 563 9329](https://wa.me/573135639329)
- Comunidad en Discord: [discord.gg/fNWeKew86h](https://discord.gg/fNWeKew86h)

---

## Páginas

| Página | Archivo |
|---|---|
| Inicio | `index.html` |
| Términos y condiciones + privacidad | `terminos.html` |
| Demo Noir Menu | `demos/noir-menu/index.html` |
| Demo Tienda online | `demos/tienda/index.html` |
| Página no encontrada | `404.html` |

## Cómo cambiar lo más común

| Quiero cambiar… | Dónde |
|---|---|
| Número de WhatsApp | `js/main.js` → `WHATSAPP_NUMBER` (y los `href="https://wa.me/…"` de los HTML como respaldo) |
| Mensajes que llegan por WhatsApp | `js/main.js` → `WA_MESSAGES` |
| Rangos de presupuesto | `js/main.js` → `BUDGET_COP` (en pesos colombianos; las demás monedas se calculan solas) |
| Textos de la web | `index.html` |
| Proyectos de "Trabajos" | `index.html`, sección `TRABAJOS` (hay un comentario con los pasos) |
| Colores y diseño | `css/styles.css` (variables al inicio) |
| Términos y condiciones | `terminos.html` |

**Después de cada cambio en CSS o JS**, sube el número `?v=` en `index.html` y `terminos.html`
(por ejemplo `styles.css?v=2` → `styles.css?v=3`) para que los visitantes vean la versión nueva.

## Publicación

La web se publica sola con **GitHub Pages** cada vez que se suben cambios a la rama `main` (tarda 1–2 minutos).

### Conectar un dominio propio
1. Compra el dominio (Namecheap, Porkbun, Cloudflare, GoDaddy…).
2. En GitHub: **Settings → Pages → Custom domain** → escribe tu dominio → Save.
3. En el panel del dominio crea estos registros DNS:
   - `A` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` `www` → `noirstudio-web.github.io`
4. Cuando cargue, activa **Enforce HTTPS** en Settings → Pages.
5. Reemplaza `https://noirstudio-web.github.io/noir-studio/` por tu dominio en `index.html`, `terminos.html`, `sitemap.xml` y `robots.txt`.
