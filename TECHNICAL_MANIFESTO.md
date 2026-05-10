# AURA TRAVEL — Technical Manifesto & Standard Operating Procedures (SOP)

Este documento define los estándares de ingeniería para prevenir fallas estructurales y asegurar una experiencia de lujo consistente.

## 1. Arquitectura de Estilos (Modular CSS)
El sistema ahora utiliza una arquitectura modular. **NUNCA** edites `aura.css` directamente para agregar estilos extensos. Usa los módulos en `css/modules/`:

- `vars.css`: Tokens de diseño (colores, fuentes, sombras).
- `reset.css`: Estilos base y normalización.
- `header.css`: Navegación soberana y branding.
- `components.css`: Botones, Bento grids y animaciones.
- `terminal.css`: Lógica visual del Command Terminal.

## 2. Reglas de Desarrollo
1. **Rutas Absolutas**: Todos los activos deben referenciarse desde la raíz (ej: `/css/aura.css`, `/img/logo.png`).
2. **Validación de Sintaxis**: Antes de guardar cualquier archivo CSS, verifica que todas las llaves `{}` estén cerradas.
3. **Nomenclatura BEM**: Usa clases descriptivas (ej: `.terminal-body`, `.t-nav-btn`) para evitar colisiones.
4. **Respeto al "Midnight Opulence"**: Los fondos deben ser oscuros, las transparencias deben usar `backdrop-filter` y los bordes deben ser sutiles (`0.1` de opacidad).

## 3. Protocolo de Verificación (QA)
Antes de marcar una tarea como completada, se DEBEN realizar las siguientes acciones:

1. **Auditoría Multi-Página**: Cargar `index.html`, `salud.html` y `corporativo.html` en el navegador.
2. **Consola de Errores**: Verificar que no haya errores 404 de activos en la consola (F12).
3. **Prueba de Responsive**: Verificar que el Terminal no se desborde en pantallas pequeñas.
4. **Check de Branding**: Confirmar que el logo dice "AURA TRAVEL" y no versiones antiguas.

## 4. Agentes y Herramientas de Control
- **Browser Subagent**: Para validación visual en tiempo real.
- **Verification Skill**: Obligatorio correr un chequeo de integridad antes de reportar éxito al usuario.

---
**ESTADO DEL SISTEMA: OPERATIVO // MODULARIZADO**
