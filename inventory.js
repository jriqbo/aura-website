const fs = require('fs');

const pages = [
  { file: 'index.html', name: 'Inicio', color: '#C9A96E' },
  { file: 'pages/corporativo.html', name: 'Corporativo', color: '#1D4ED8' },
  { file: 'pages/salud.html', name: 'Salud', color: '#10B981' },
  { file: 'pages/aeropuerto.html', name: 'Aeropuerto', color: '#06B6D4' },
  { file: 'pages/eventos.html', name: 'Eventos', color: '#8B5CF6' },
  { file: 'pages/delivery.html', name: 'Delivery', color: '#EF4444' }
];

function parseImages(filePath, pageName, color) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Basic regex to find img tags and their context
  const imgRegex = /<img([^>]+)>/g;
  let match;
  console.log(`\n### ${pageName}`);
  console.log(`Color Principal: ${color}`);
  console.log(`| Sección / Ubicación | Tipo de Activo | Ruta Actual | Atributo Alt | Contexto Operativo (Texto Cercano) |`);
  console.log(`|---|---|---|---|---|`);
  
  while ((match = imgRegex.exec(content)) !== null) {
    const attrs = match[1];
    let src = '';
    let alt = '';
    
    const srcMatch = attrs.match(/src="([^"]+)"/);
    if (srcMatch) src = srcMatch[1];
    
    const altMatch = attrs.match(/alt="([^"]*)"/);
    if (altMatch) alt = altMatch[1];
    
    // Determine type
    let type = 'Imagen de Contenido';
    if (attrs.includes('hero') || src.includes('hero')) type = 'Hero / Board';
    else if (attrs.includes('slide')) type = 'Slider (Carrusel)';
    
    // Find context (look backwards for a heading or p)
    const beforeContext = content.substring(Math.max(0, match.index - 300), match.index);
    let textContext = "Sin texto cercano claro";
    const hMatch = beforeContext.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/g);
    if (hMatch && hMatch.length > 0) {
      textContext = hMatch[hMatch.length - 1].replace(/<[^>]+>/g, '').trim();
    } else {
      const pMatch = beforeContext.match(/<p[^>]*>(.*?)<\/p>/g);
      if (pMatch && pMatch.length > 0) {
        textContext = pMatch[pMatch.length - 1].replace(/<[^>]+>/g, '').trim();
      }
    }
    
    // Clean up text context to be short
    if (textContext.length > 50) textContext = textContext.substring(0, 47) + '...';
    
    console.log(`| ${pageName} | ${type} | \`${src}\` | "${alt}" | Acompaña a: "${textContext}" |`);
  }
}

pages.forEach(p => parseImages(p.file, p.name, p.color));
