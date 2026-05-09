# AURA Travel — Guía de Automatización con Make.com

## Paso 1: Crear Cuenta Make.com
1. Ve a make.com y regístrate (plan gratis: 1.000 operaciones/mes)
2. Crea un escenario nuevo llamado "AURA — Nuevo Lead"

## Paso 2: Obtener Webhook URL
1. En Make.com: + Agregar módulo → "Webhooks" → "Custom webhook"
2. Copia la URL generada (algo como: https://hook.make.com/abc123xyz)
3. Pega esa URL en el archivo `form-handler.js` línea 11:

```javascript
const WEBHOOK_URL = 'https://hook.make.com/TU_URL_AQUI';
```

## Paso 3: Configurar el Flujo

### Flujo: Nuevo Lead → CRM + Notificación

```
[Webhook] → [Router]
                ├→ [HubSpot: Create Contact]
                ├→ [WhatsApp Cloud: Send Message to Team]
                └→ [Resend: Send Confirmation Email]
```

### Módulo 1: Webhook (trigger)
- Ya configurado. Recibe JSON con todos los campos del formulario.

### Módulo 2: HubSpot - Crear Contacto
- Conexión: API key de HubSpot
- Mapear campos:
  - Email → `{{email}}`
  - Firstname → `{{nombre}}`
  - Company → `{{empresa}}`
  - Phone → `{{telefono}}`
  - Propiedad personalizada "division" → `{{_division}}`
  - Propiedad personalizada "lead_id" → `{{_leadId}}`
  - Propiedad personalizada "utm_source" → `{{_utm_source}}`

### Módulo 3: WhatsApp Cloud - Notificar al Equipo
- Template: "new_lead_notification"
- Número destino: Grupo AURA Operaciones
- Variables:
  - {{1}} = división
  - {{2}} = nombre
  - {{3}} = servicio solicitado

### Módulo 4: Resend - Email Confirmación al Cliente
- From: "AURA Travel" <contacto@auratravel.cl>
- To: {{email}}
- Subject: "AURA Travel — Recibimos su solicitud ✦"
- HTML: Template de confirmación (ver template adjunto)

## Datos que Recibes del Formulario

Cada vez que un cliente envía un formulario, Make.com recibe este JSON:

```json
{
  "nombre": "Juan Pérez",
  "empresa": "Minera Escondida",
  "tipo_servicio": "TRASLADO EJECUTIVO",
  "email": "juan@minera.cl",
  "telefono": "+56912345678",
  "detalle": "Necesitamos 5 vans para equipo directivo",
  "_division": "CORPORATIVO",
  "_divisionEmail": "corporativo@auratravel.cl",
  "_leadId": "SCL-CORP-M4Q8R2",
  "_timestamp": "2026-05-08T04:30:00.000Z",
  "_source": "/pages/corporativo.html",
  "_referrer": "https://google.com",
  "_utm_source": "google",
  "_utm_medium": "cpc",
  "_utm_campaign": "corporativo_q2"
}
```

## Pipeline HubSpot (6 Etapas)

Crea estas etapas en HubSpot → Ventas → Pipeline:

1. **Nuevo Lead** (automático al crear contacto)
2. **Contactado** (cuando respondes el WhatsApp)
3. **Cotización Enviada** (cuando envías precio)
4. **Reserva Confirmada** (cuando el cliente acepta)
5. **Servicio Completado** (post-servicio)
6. **Cliente Recurrente** (segunda reserva en adelante)

---

*Cuando tengas Make.com configurado, pega la URL del webhook y todo se conecta automáticamente.* 🏴
