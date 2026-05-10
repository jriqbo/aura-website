/**
 * AURA TRAVEL — Generador de Páginas pSEO
 * ----------------------------------------
 * Uso: node scripts/generate-pseo.js
 *
 * Lee pages/rutas/template.html, sustituye variables {{variable}}
 * y escribe un archivo HTML por cada ruta definida en ROUTES.
 *
 * Variables disponibles en la plantilla:
 *   {{id}}             → slug del archivo  (ej. transfer-santiago-portillo)
 *   {{origen}}         → ciudad de origen  (ej. Santiago)
 *   {{destino}}        → destino           (ej. Portillo)
 *   {{destino_upper}}  → destino en MAYÚSCULAS
 *   {{precio}}         → precio base CLP   (ej. $85.000)
 *   {{precio_num}}     → precio numérico sin símbolo (ej. 85000)
 *   {{meta_title}}     → <title> de la página
 *   {{meta_desc}}      → <meta description>
 *   {{tiempo}}         → duración del viaje
 *   {{distancia}}      → distancia en km
 *   {{altitud}}        → altitud en msnm
 *   {{tipo}}           → categoría SEO     (ej. nieve, aeropuerto, viñedo)
 *   {{schema_type}}    → tipo Schema.org   (ej. TouristTrip, TaxiService)
 *   {{icon}}           → emoji representativo
 *   {{temporada}}      → texto de temporada
 *   {{img_1..5}}       → rutas de imágenes del slider
 *   {{canonical}}      → URL canónica completa
 *   {{hud_ruta}}       → texto HUD del hero (ej. SCL → PORTILLO)
 *   {{form_id}}        → id único del formulario HTML
 *   {{terminal_id}}    → código de terminal (ej. SCL-POR-2026)
 */

const fs   = require('fs');
const path = require('path');

// ─── Rutas de archivos ────────────────────────────────────────────────────────
const TEMPLATE_PATH = path.join(__dirname, '..', 'pages', 'rutas', 'template.html');
const OUTPUT_DIR    = path.join(__dirname, '..', 'pages', 'rutas');

// ─── Base de datos de rutas ───────────────────────────────────────────────────
// Para agregar una ruta: añadir un objeto a este array y volver a ejecutar el script.
const ROUTES = [
  {
    id:           'transfer-santiago-portillo',
    origen:       'Santiago',
    destino:      'Portillo',
    precio:       '$85.000',
    precio_num:   '85000',
    meta_title:   'Transfer Santiago a Portillo — Van VIP con Cadenas | AURA TRAVEL',
    meta_desc:    'Transfer ejecutivo Santiago a Portillo. Van premium con cadenas, WiFi y conductor todo el día. 2 hrs desde Santiago. Temporada de Nieve 2026. Reserve ahora.',
    tiempo:       '120\'',
    distancia:    '145km',
    altitud:      '2.880',
    tipo:         'nieve',
    schema_type:  'TouristTrip',
    icon:         '⛷️',
    temporada:    'Temporada Nieve 2026 · Junio — Septiembre',
    img_1:        '../../img/turismo/portillo_1.png',
    img_2:        '../../img/turismo/portillo_2.png',
    img_3:        '../../img/turismo/portillo_3.png',
    img_4:        '../../img/turismo/portillo_van.png',
    img_5:        '../../img/turismo/hero_turismo_2.png',
    canonical:    'https://auratravel.cl/pages/rutas/transfer-santiago-portillo.html',
    hud_ruta:     'SCL → PORTILLO',
    form_id:      'portilloForm',
    terminal_id:  'SCL-POR-2026',
  },
  {
    id:           'transfer-santiago-torres-del-paine',
    origen:       'Santiago',
    destino:      'Torres del Paine',
    precio:       '$320.000',
    precio_num:   '320000',
    meta_title:   'Transfer Santiago a Torres del Paine — VIP | AURA TRAVEL',
    meta_desc:    'Traslado ejecutivo a Torres del Paine. Van de lujo, conductor bilingüe y asistencia completa. Patagonia Premium con AURA Travel. Reserve su expedición 2026.',
    tiempo:       'Aéreo + Van',
    distancia:    '2.400km',
    altitud:      '2.500',
    tipo:         'patagonia',
    schema_type:  'TouristTrip',
    icon:         '🏔️',
    temporada:    'Expedición Patagonia 2026 · Todo el año',
    img_1:        '../../img/turismo/torres_paine_1.png',
    img_2:        '../../img/turismo/torres_paine_2.png',
    img_3:        '../../img/turismo/torres_paine_3.png',
    img_4:        '../../img/turismo/torres_paine_van.png',
    img_5:        '../../img/turismo/hero_turismo_3.png',
    canonical:    'https://auratravel.cl/pages/rutas/transfer-santiago-torres-del-paine.html',
    hud_ruta:     'SCL → TORRES DEL PAINE',
    form_id:      'torresForm',
    terminal_id:  'SCL-TDP-2026',
  },
  {
    id:           'transfer-santiago-colchagua',
    origen:       'Santiago',
    destino:      'Valle de Colchagua',
    precio:       '$95.000',
    precio_num:   '95000',
    meta_title:   'Transfer Santiago a Valle Colchagua — Tour Vino VIP | AURA TRAVEL',
    meta_desc:    'Transfer premium Santiago a Valle de Colchagua. Visita bodegas Santa Cruz, Neyen y Montes. Van ejecutiva con sommelier concierge. Reserve su tour de vino 2026.',
    tiempo:       '150\'',
    distancia:    '180km',
    altitud:      '350',
    tipo:         'viñedo',
    schema_type:  'TouristTrip',
    icon:         '🍷',
    temporada:    'Tour de Vino · Cosecha 2026',
    img_1:        '../../img/turismo/colchagua_1.png',
    img_2:        '../../img/turismo/colchagua_2.png',
    img_3:        '../../img/turismo/colchagua_3.png',
    img_4:        '../../img/turismo/colchagua_van.png',
    img_5:        '../../img/turismo/hero_turismo_4.png',
    canonical:    'https://auratravel.cl/pages/rutas/transfer-santiago-colchagua.html',
    hud_ruta:     'SCL → COLCHAGUA',
    form_id:      'colchaguaForm',
    terminal_id:  'SCL-COL-2026',
  }
];

// ─── Función de sustitución ───────────────────────────────────────────────────
/**
 * Reemplaza todas las ocurrencias de {{key}} en el template
 * con los valores del objeto de ruta.
 * @param {string} template - Contenido HTML de la plantilla
 * @param {object} route    - Datos de la ruta
 * @returns {string}        - HTML final con variables sustituidas
 */
function render(template, route) {
  // Agregar variable derivada destino_upper
  const data = {
    ...route,
    destino_upper: route.destino.toUpperCase(),
  };

  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      return data[key];
    }
    // Si la variable no existe en los datos, mantener el placeholder
    // para que sea fácil detectar variables faltantes en la plantilla.
    console.warn(`  ⚠  Variable no definida en ruta: {{${key}}}`);
    return match;
  });
}

// ─── Ejecución principal ──────────────────────────────────────────────────────
function main() {
  console.log('\n🚀 AURA pSEO Generator — Iniciando...\n');

  // 1. Verificar que la plantilla existe
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`❌ Plantilla no encontrada: ${TEMPLATE_PATH}`);
    console.error('   Crea pages/rutas/template.html antes de ejecutar este script.');
    process.exit(1);
  }

  // 2. Leer la plantilla una sola vez (más eficiente que leer en cada iteración)
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
  console.log(`✅ Plantilla cargada: ${TEMPLATE_PATH}`);
  console.log(`📋 Rutas a generar:   ${ROUTES.length}\n`);

  // 3. Asegurar que el directorio de salida exista
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let generadas = 0;
  let errores   = 0;

  // 4. Iterar sobre cada ruta y generar su HTML
  ROUTES.forEach((route) => {
    const outputPath = path.join(OUTPUT_DIR, `${route.id}.html`);

    try {
      const html = render(template, route);
      fs.writeFileSync(outputPath, html, 'utf-8');
      console.log(`  ✅ ${route.id}.html → ${route.destino} (${route.precio})`);
      generadas++;
    } catch (err) {
      console.error(`  ❌ Error generando ${route.id}.html: ${err.message}`);
      errores++;
    }
  });

  // 5. Resumen final
  console.log('\n─────────────────────────────────────────');
  console.log(`✅ Páginas generadas: ${generadas}`);
  if (errores > 0) {
    console.log(`❌ Errores:          ${errores}`);
  }
  console.log(`📁 Directorio:        ${OUTPUT_DIR}`);
  console.log('\n💡 Recuerda añadir las nuevas URLs a sitemap.xml\n');
}

main();
