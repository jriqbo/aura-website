const fs = require('fs');
const path = require('path');

const T = path.join(__dirname, '..', 'pages', 'rutas', 'template.html');
const D = path.join(__dirname, '..', 'pages', 'rutas');

const r = [
  { 
    id: 'transfer-santiago-valle-nevado', 
    origen: 'Santiago', 
    destino: 'Valle Nevado', 
    precio: '120.000', 
    precio_num: '120000',
    meta_title: 'Transfer Santiago a Valle Nevado | Aura Travel', 
    meta_desc: 'Transporte de lujo y transfer privado a Valle Nevado. Flota ejecutiva.',
    tiempo: '1h 30m',
    distancia: '65 km',
    altitud: '3.025',
    icon: '<i class="fas fa-snowflake"></i>',
    img_1: '/img/home/aura_hero_portillo_suv_1777816891017.png',
    img_2: '/img/home/aura_van_turismo_night_branded_8k_gold_andes_1777937976484.png',
    img_3: '/img/home/aura_luxury_van_andes_sunset_1777851568919.png',
    img_4: '/img/home/aura_van_turismo_night_branded_8k_gold_andes_1777937976484.png',
    img_5: '/img/home/aura_luxury_andes_sunset_gold_1777850731239.png'
  },
  { 
    id: 'transfer-santiago-portillo', 
    origen: 'Santiago', 
    destino: 'Portillo', 
    precio: '140.000', 
    precio_num: '140000',
    meta_title: 'Transfer Privado a Portillo | Aura Travel', 
    meta_desc: 'Viaja a Portillo con la máxima comodidad. Conductores profesionales.',
    tiempo: '2h 15m',
    distancia: '160 km',
    altitud: '2.880',
    icon: '<i class="fas fa-mountain"></i>',
    img_1: '/img/home/aura_hero_portillo_suv_1777816891017.png',
    img_2: '/img/home/aura_van_turismo_night_branded_8k_gold_andes_1777937976484.png',
    img_3: '/img/home/aura_luxury_van_andes_sunset_1777851568919.png',
    img_4: '/img/home/aura_van_turismo_night_branded_8k_gold_andes_1777937976484.png',
    img_5: '/img/home/aura_luxury_andes_sunset_gold_1777850731239.png'
  },
  { 
    id: 'transfer-santiago-farellones', 
    origen: 'Santiago', 
    destino: 'Farellones', 
    precio: '100.000', 
    precio_num: '100000',
    meta_title: 'Transfer Santiago a Farellones | Aura Travel', 
    meta_desc: 'Servicio exclusivo de transporte hacia el centro de esquí Farellones.',
    tiempo: '1h 15m',
    distancia: '50 km',
    altitud: '2.400',
    icon: '<i class="fas fa-snowflake"></i>',
    img_1: '/img/home/aura_van_turismo_night_branded_8k_gold_andes_1777937976484.png',
    img_2: '/img/home/aura_luxury_van_andes_sunset_1777851568919.png',
    img_3: '/img/home/aura_van_turismo_night_branded_8k_gold_andes_1777937976484.png',
    img_4: '/img/home/aura_luxury_van_andes_sunset_1777851568919.png',
    img_5: '/img/home/aura_luxury_andes_sunset_gold_1777850731239.png'
  },
  { 
    id: 'transfer-aeropuerto-la-florida', 
    origen: 'Aeropuerto SCL', 
    destino: 'La Florida', 
    precio: '38.000', 
    precio_num: '38000',
    meta_title: 'Transfer Aeropuerto SCL a La Florida | Aura Travel', 
    meta_desc: 'Traslados ejecutivos desde el Aeropuerto de Santiago hacia La Florida.',
    tiempo: '45m',
    distancia: '35 km',
    altitud: '550',
    icon: '<i class="fas fa-plane"></i>'
  },
  { 
    id: 'transfer-la-florida-aeropuerto', 
    origen: 'La Florida', 
    destino: 'Aeropuerto SCL', 
    precio: '38.000', 
    precio_num: '38000',
    meta_title: 'Transfer La Florida a Aeropuerto SCL | Aura Travel', 
    meta_desc: 'Transporte privado puntual y seguro desde La Florida al Aeropuerto.',
    tiempo: '45m',
    distancia: '35 km',
    altitud: '550',
    icon: '<i class="fas fa-plane"></i>'
  },
  { 
    id: 'transfer-aeropuerto-la-granja', 
    origen: 'Aeropuerto SCL', 
    destino: 'La Granja', 
    precio: '35.000', 
    precio_num: '35000',
    meta_title: 'Transfer Aeropuerto SCL a La Granja | Aura Travel', 
    meta_desc: 'Conecta el Aeropuerto de Santiago con La Granja en transporte VIP.',
    tiempo: '40m',
    distancia: '32 km',
    altitud: '540',
    icon: '<i class="fas fa-plane"></i>'
  },
  { 
    id: 'transfer-la-granja-aeropuerto', 
    origen: 'La Granja', 
    destino: 'Aeropuerto SCL', 
    precio: '35.000', 
    precio_num: '35000',
    meta_title: 'Transfer La Granja al Aeropuerto SCL | Aura Travel', 
    meta_desc: 'Llega a tiempo a tu vuelo. Transfer privado desde La Granja al Aeropuerto.',
    tiempo: '40m',
    distancia: '32 km',
    altitud: '540',
    icon: '<i class="fas fa-plane"></i>'
  },
  { 
    id: 'transfer-corporativo-santiago', 
    origen: 'Santiago', 
    destino: 'Sanhattan', 
    precio: '45.000', 
    precio_num: '45000',
    meta_title: 'Transporte Corporativo VIP en Santiago | Aura Travel', 
    meta_desc: 'Soluciones de transporte B2B para empresas y ejecutivos en Santiago.',
    tiempo: '30m',
    distancia: '15 km',
    altitud: '600',
    icon: '<i class="fas fa-building"></i>'
  },
  { 
    id: 'transfer-santiago-aeropuerto-scl', 
    origen: 'Santiago', 
    destino: 'Aeropuerto SCL', 
    precio: '35.000', 
    precio_num: '35000',
    meta_title: 'Transfer Santiago a Aeropuerto SCL | Aura Travel', 
    meta_desc: 'Transporte privado al Aeropuerto Arturo Merino Benítez.',
    tiempo: '35m',
    distancia: '28 km',
    altitud: '520',
    icon: '<i class="fas fa-plane"></i>'
  },
  { 
    id: 'transfer-santiago-colchagua', 
    origen: 'Santiago', 
    destino: 'Colchagua', 
    precio: '180.000', 
    precio_num: '180000',
    meta_title: 'Tour Privado Valle de Colchagua | Aura Travel', 
    meta_desc: 'Expedición de lujo a las mejores viñas de Colchagua.',
    tiempo: '2h 45m',
    distancia: '185 km',
    altitud: '200',
    icon: '<i class="fas fa-wine-glass"></i>'
  },
  { 
    id: 'transfer-santiago-torres-del-paine', 
    origen: 'SCL', 
    destino: 'Torres del Paine', 
    precio: '450.000', 
    precio_num: '450000',
    meta_title: 'Expedición Torres del Paine | Aura Travel', 
    meta_desc: 'Logística de lujo para el Parque Nacional Torres del Paine.',
    tiempo: '4h+',
    distancia: '3.000 km+',
    altitud: '100',
    icon: '<i class="fas fa-compass"></i>'
  }
];

const t = fs.readFileSync(T, 'utf-8');

r.forEach(x => {
  let h = t;
  
  // Set defaults and calculated values
  x.canonical = `https://auratravel.cl/pages/rutas/${x.id}.html`;
  x.schema_type = 'Service';
  x.temporada = 'TEMPORADA 2026';
  x.destino_upper = x.destino.toUpperCase();
  x.hud_ruta = `${x.origen.toUpperCase()} // ${x.destino.toUpperCase()}`;
  x.terminal_id = `TERM-${x.id.toUpperCase().split('-').slice(-1)}-2026`;
  x.form_id = `form-${x.id}`;
  
  // Default images if not provided
  if (!x.img_1) x.img_1 = '/img/home/aura_supreme_hero_night_motion_8k_gold_1777938401922.png';
  if (!x.img_2) x.img_2 = '/img/home/aura_luxury_van_airport_night_1777851584322.png';
  if (!x.img_3) x.img_3 = '/img/home/aura_hero_executive_interior_1777815946299.png';
  if (!x.img_4) x.img_4 = '/img/home/aura_van_turismo_night_branded_8k_gold_andes_1777937976484.png';
  if (!x.img_5) x.img_5 = '/img/home/aura_fleet_night_8k_1778058439627.png';

  // Replace placeholders
  Object.keys(x).forEach(k => {
    const regex = new RegExp(`{{${k}}}`, 'g');
    h = h.replace(regex, x[k]);
  });

  fs.writeFileSync(path.join(D, `${x.id}.html`), h);
});

// SITEMAP GENERATION
const b = 'https://auratravel.cl';
const d = ['aeropuerto.html', 'contacto.html', 'corporativo.html', 'delivery.html', 'embajadas.html', 'eventos.html', 'salud.html', 'turismo.html'];
let s = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
s += `  <url><loc>${b}/</loc><priority>1.0</priority></url>\n`;
d.forEach(x => s += `  <url><loc>${b}/pages/${x}</loc><priority>0.9</priority></url>\n`);
r.forEach(x => s += `  <url><loc>${b}/pages/rutas/${x.id}.html</loc><priority>0.8</priority></url>\n`);
s += `</urlset>`;

fs.writeFileSync(path.join(__dirname, '..', 'sitemap.xml'), s);
console.log('✅ pSEO pages generated and Sitemap updated.');



