export type Dish = { id: string; name: string; desc: string; price: number; img: string; badge?: string };
export type Category = { cat: string; items: Dish[] };

export const RESTAURANT = { name: 'Casa Brasa', initial: 'B', kind: 'Parrilla · Hamburguesas · Bowls', city: 'Bogotá' };
export const DELIVERY_FEE = 5000;

export const MENU: Category[] = [
  { cat: 'Hamburguesas', items: [
    { id: 'b1', name: 'Burger Noir', desc: 'Doble carne angus, cheddar añejo, cebolla caramelizada y salsa de la casa.', price: 28000, img: 'burger-noir', badge: 'Más pedido' },
    { id: 'b2', name: 'Smash con papas', desc: 'Carne smash crocante, queso americano, pepinillos y papas rústicas.', price: 26000, img: 'smash-papas' },
    { id: 'b3', name: 'Doble Bacon', desc: 'Dos carnes, tocineta ahumada, cheddar y BBQ de panela.', price: 32000, img: 'doble-bacon', badge: 'Nuevo' },
  ]},
  { cat: 'Platos fuertes', items: [
    { id: 'f1', name: 'Lomo a la brasa', desc: 'Lomo fino 300 g con papas a la francesa y chimichurri.', price: 46000, img: 'lomo-papas', badge: 'Recomendado' },
    { id: 'f2', name: 'Penne arrabbiata', desc: 'Pasta corta en salsa de tomate picante, albahaca y parmesano.', price: 29000, img: 'penne', badge: 'Picante' },
    { id: 'f3', name: 'Arroz con camarones', desc: 'Arroz cremoso, camarones salteados, cilantro y limón.', price: 38000, img: 'arroz-camarones' },
    { id: 'f4', name: 'Pizza de la casa', desc: 'Masa madre, pepperoni, cebolla morada y albahaca fresca.', price: 34000, img: 'pizza' },
    { id: 'f5', name: 'Ensalada de lomo', desc: 'Lomo en tiras, hojas verdes, marañón y vinagreta de ají.', price: 31000, img: 'ensalada-lomo' },
  ]},
  { cat: 'Bowls', items: [
    { id: 'w1', name: 'Bowl de pollo', desc: 'Pollo a la plancha, maíz, aguacate, repollo morado y arroz.', price: 27000, img: 'bowl-pollo' },
    { id: 'w2', name: 'Bowl veggie', desc: 'Garbanzos, aguacate, tomate cherry, batata asada y hummus.', price: 24000, img: 'bowl-veggie', badge: 'Veggie' },
    { id: 'w3', name: 'Ensalada verde', desc: 'Mix de hojas, zanahoria, cebolla encurtida y queso feta.', price: 19000, img: 'ensalada-verde', badge: 'Veggie' },
  ]},
  { cat: 'Postres', items: [
    { id: 'p1', name: 'Brownie Noir', desc: 'Chocolate 70 % tibio con salsa de chocolate.', price: 14000, img: 'brownie' },
    { id: 'p2', name: 'Torta de chocolate', desc: 'Tres capas de bizcocho húmedo y ganache.', price: 15000, img: 'torta' },
    { id: 'p3', name: 'Malteada Oreo', desc: 'Helado de vainilla, galleta Oreo y crema batida.', price: 16000, img: 'malteada', badge: 'Más pedido' },
    { id: 'p4', name: 'Pancakes', desc: 'Torre de pancakes con miel de maple y fruta.', price: 18000, img: 'pancakes' },
  ]},
  { cat: 'Bebidas', items: [
    { id: 'd1', name: 'Limonada de hierbabuena', desc: 'Natural, 16 oz.', price: 9000, img: 'mojito' },
    { id: 'd2', name: 'Cócteles de la casa', desc: 'Pregunta por el cóctel del día.', price: 22000, img: 'cocteles' },
    { id: 'd3', name: 'Café frío', desc: 'Cold brew con leche y un toque de vainilla.', price: 10000, img: 'cafe-frio' },
  ]},
];

export const DISHES: Record<string, Dish> = Object.fromEntries(MENU.flatMap((c) => c.items).map((d) => [d.id, d]));
export const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-');
