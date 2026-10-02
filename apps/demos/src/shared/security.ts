// ✦ Seguridad: impide que otra web muestre esta página dentro de un marco (clickjacking)
export function frameGuard() {
  if (window.top !== window.self) {
    document.documentElement.style.display = 'none';
    try { window.top!.location.replace(window.self.location.href); } catch { /* el navegador lo bloqueó: la página queda oculta */ }
  }
}

/** Número que recibe los pedidos, partido para que los robots no lo detecten. */
export const WHATSAPP_NUMBER = ['57', '313', '563', '9329'].join('');

export const money = (n: number) => '$' + Math.round(n).toLocaleString('es-CO');

export const storage = {
  get<T>(key: string, fallback: T): T {
    try { return (JSON.parse(localStorage.getItem(key) ?? 'null') as T) ?? fallback; } catch { return fallback; }
  },
  set(key: string, value: unknown) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* sin almacenamiento */ } },
};

/** Ruta a un archivo de /public respetando la ruta base de Vite. */
export const pub = (path: string) => `${import.meta.env.BASE_URL}${path}`;

/** Inicio de la web principal (dos niveles arriba de /demos/xxx/). */
export const HOME = `${import.meta.env.BASE_URL}../`;
