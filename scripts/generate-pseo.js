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
  { id: 'transfer-corporativo-santiago', origen: 'Santiago', destino: 'Reuniones Corporativas', precio: 'A convenir', meta_title: 'Transporte Corporativo VIP en Santiago | Aura Travel', meta_desc: 'Soluciones de transporte B2B para empresas y ejecutivos en Santiago.' }
];
const t = fs.readFileSync(T, 'utf-8');
r.forEach(x => {
  let h = t;
  Object.keys(x).forEach(k => h = h.split(`{{${k}}}`).join(x[k]));
  fs.writeFileSync(path.join(D, `${x.id}.html`), h);
});
