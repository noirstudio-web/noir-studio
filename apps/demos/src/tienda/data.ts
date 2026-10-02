export type Category = 'Ropa' | 'Calzado' | 'Accesorios' | 'Tecnología';
export type Product = {
  id: string; name: string; cat: Category; price: number; old?: number;
  stock: number; sizes?: string[]; pop: number; desc: string;
};
export type OrderStatus = 'paid' | 'ship' | 'pend';
export type Order = { n: number; who: string; items: number; total: number; st: OrderStatus; when: string; today?: boolean };
export type CartLine = { id: string; size: string | null; qty: number };

export const PRODUCTS: Product[] = [
  { id: 'chaqueta', name: 'Chaqueta Onyx', cat: 'Ropa', price: 289000, stock: 12, sizes: ['S', 'M', 'L', 'XL'], pop: 1, desc: 'Cuero sintético premium con cierres metálicos y forro interior suave. Corte recto.' },
  { id: 'tenis', name: 'Tenis Carbon', cat: 'Calzado', price: 239000, stock: 15, sizes: ['38', '39', '40', '41', '42', '43'], pop: 2, desc: 'Malla transpirable, suela de espuma ligera y cordones de alta resistencia.' },
  { id: 'audifonos', name: 'Audífonos Studio', cat: 'Tecnología', price: 349000, old: 399000, stock: 10, pop: 3, desc: 'Inalámbricos, cancelación de ruido y 30 horas de batería.' },
  { id: 'reloj', name: 'Reloj Classic Sand', cat: 'Accesorios', price: 189000, stock: 9, pop: 4, desc: 'Caja de acero de 38 mm, correa de cuero y resistencia al agua.' },
  { id: 'poncho', name: 'Poncho Knit Arena', cat: 'Ropa', price: 159000, old: 199000, stock: 7, sizes: ['Única'], pop: 5, desc: 'Tejido a mano en algodón, con flecos y caída ligera.' },
  { id: 'mochila', name: 'Mochila Cuero Cognac', cat: 'Accesorios', price: 269000, stock: 6, pop: 6, desc: 'Cuero curtido, bolsillo para portátil de 15" y herrajes ocultos.' },
  { id: 'smartwatch', name: 'Smartwatch Pulse', cat: 'Tecnología', price: 459000, stock: 3, pop: 7, desc: 'Ritmo cardíaco, GPS, notificaciones y 7 días de batería.' },
  { id: 'zapato', name: 'Derby Suede Jade', cat: 'Calzado', price: 219000, stock: 4, sizes: ['39', '40', '41', '42'], pop: 8, desc: 'Gamuza color jade con suela de cuero cosida.' },
];
export const BY_ID: Record<string, Product> = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

export const FILTERS = ['Todo', 'Ropa', 'Calzado', 'Accesorios', 'Tecnología', 'Ofertas'] as const;
export type Filter = (typeof FILTERS)[number];

export const FREE_SHIP = 300000;
export const SHIP = 12000;
export const COUPONS: Record<string, number> = { NOIR10: 0.1 };

// Datos de ejemplo del panel (la demo suma los pedidos que hagas)
export const SEED_ORDERS: Order[] = [
  { n: 1048, who: 'Valentina R.', items: 2, total: 528000, st: 'ship', when: 'Hoy 9:12' },
  { n: 1047, who: 'Andrés M.', items: 1, total: 349000, st: 'paid', when: 'Hoy 8:40' },
  { n: 1046, who: 'Laura G.', items: 3, total: 667000, st: 'ship', when: 'Ayer' },
  { n: 1045, who: 'Camilo P.', items: 1, total: 189000, st: 'pend', when: 'Ayer' },
];
export const WEEK = [820000, 1150000, 640000, 1390000, 980000, 1620000];
export const PAY_METHODS = ['Tarjeta', 'PSE', 'Contra entrega'] as const;
export type PayMethod = (typeof PAY_METHODS)[number];
