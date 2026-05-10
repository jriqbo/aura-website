const fs = require('fs');
const path = require('path');
const T = path.join(__dirname, '..', 'pages', 'rutas', 'template.html');
const D = path.join(__dirname, '..', 'pages', 'rutas');
const r = [
  { id: 'transfer-santiago-valle-nevado', origen: 'Santiago', destino: 'Valle Nevado', precio: '120.000', meta_title: 'Transfer Santiago a Valle Nevado | Aura Travel', meta_desc: 'Transporte de lujo y transfer privado a Valle Nevado. Flota ejecutiva.' },
  { id: 'transfer-santiago-portillo', origen: 'Santiago', destino: 'Portillo', precio: '140.000', meta_title: 'Transfer Privado a Portillo | Aura Travel', meta_desc: 'Viaja a Portillo con la máxima comodidad. Conductores profesionales.' },
  { id: 'transfer-santiago-farellones', origen: 'Santiago', destino: 'Farellones', precio: '100.000', meta_title: 'Transfer Santiago a Farellones | Aura Travel', meta_desc: 'Servicio exclusivo de transporte hacia el centro de esquí Farellones.' },
  { id: 'transfer-aeropuerto-la-florida', origen: 'Aeropuerto SCL', destino: 'La Florida', precio: '38.000', meta_title: 'Transfer Aeropuerto SCL a La Florida | Aura Travel', meta_desc: 'Traslados ejecutivos desde el Aeropuerto de Santiago hacia La Florida.' },
  { id: 'transfer-la-florida-aeropuerto', origen: 'La Florida', destino: 'Aeropuerto SCL', precio: '38.000', meta_title: 'Transfer La Florida a Aeropuerto SCL | Aura Travel', meta_desc: 'Transporte privado puntual y seguro desde La Florida al Aeropuerto.' },
  { id: 'transfer-aeropuerto-la-granja', origen: 'Aeropuerto SCL', destino: 'La Granja', precio: '35.000', meta_title: 'Transfer Aeropuerto SCL a La Granja | Aura Travel', meta_desc: 'Conecta el Aeropuerto de Santiago con La Granja en transporte VIP.' },
  { id: 'transfer-la-granja-aeropuerto', origen: 'La Granja', destino: 'Aeropuerto SCL', precio: '35.000', meta_title: 'Transfer La Granja al Aeropuerto SCL | Aura Travel', meta_desc: 'Llega a tiempo a tu vuelo. Transfer privado desde La Granja al Aeropuerto.' },
  { id: 'transfer-corporativo-santiago', origen: 'Santiago', destino: 'Reuniones Corporativas', precio: 'A convenir', meta_title: 'Transporte Corporativo VIP en Santiago | Aura Travel', meta_desc: 'Soluciones de transporte B2B para empresas y ejecutivos en Santiago.' },
  { id: 'transfer-santiago-aeropuerto-scl', origen: 'Santiago', destino: 'Aeropuerto SCL', precio: '35.000', meta_title: 'Transfer Santiago a Aeropuerto SCL | Aura Travel', meta_desc: 'Transporte privado al Aeropuerto Arturo Merino Benítez.' },
  { id: 'transfer-santiago-colchagua', origen: 'Santiago', destino: 'Valle de Colchagua', precio: '180.000', meta_title: 'Tour Privado Valle de Colchagua | Aura Travel', meta_desc: 'Expedición de lujo a las mejores viñas de Colchagua.' },
  { id: 'transfer-santiago-torres-del-paine', origen: 'Santiago', destino: 'Torres del Paine', precio: 'Consultar', meta_title: 'Expedición Torres del Paine | Aura Travel', meta_desc: 'Logística de lujo para el Parque Nacional Torres del Paine.' }
];
const t = fs.readFileSync(T, 'utf-8');
r.forEach(x => {
  let h = t;
  Object.keys(x).forEach(k => h = h.split(`{{${k}}}`).join(x[k]));
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
console.log('✅ Sitemap updated with 11 pSEO routes.');
