# 🤖 AURA Travel — Flujos de Automatización Make.com

## Resumen de Flujos

| # | Flujo | Trigger | Acción |
|---|---|---|---|
| 1 | Lead Nuevo → CRM + Alerta | Webhook form-handler.js | HubSpot + WhatsApp Team |
| 2 | Reserva Confirmada → Cliente | Manual en CRM | Email + WhatsApp Cliente |
| 3 | Recordatorio 24h | Scheduler | WhatsApp Cliente + Conductor |
| 4 | Reporte Semanal | Cada Lunes 8AM | Email resumen al equipo |
| 5 | Cotización Auto → PDF | Webhook especial | PDF + Email al prospecto |

---

## FLUJO 1: LEAD NUEVO → CRM + ALERTA (YA CONECTADO)

### Diagrama:
```
[Webhook] ──→ [Router por División]
                ├─→ [HubSpot: Create/Update Contact]
                ├─→ [WhatsApp: Notificar Equipo Comercial]
                └─→ [Google Sheets: Log Backup]
```

### Configuración:
1. **Webhook**: Ya configurado en `form-handler.js` línea 11
   - URL: `https://hook.us2.make.com/t9mp19gn6el6pw33pd5q8gwtetnncdal`
2. **Router**: Filtrar por `{{_division}}`
   - CORPORATIVO → notificar a equipo B2B
   - TURISMO → notificar a operaciones turismo
   - SALUD/DIALISIS → notificar a coordinador clínico
   - AEROPUERTO → notificar a dispatch
3. **HubSpot**: Crear contacto con campos mapeados
   - Email, Nombre, Empresa, Teléfono, División, Lead ID, UTM Source
4. **WhatsApp Cloud API**: Template `new_lead_alert`
   - "🚨 NUEVO LEAD {{division}} | {{nombre}} | {{leadId}}"
5. **Google Sheets** (backup): Agregar fila con todos los campos

### Campos del Webhook:
```json
{
  "nombre": "string",
  "empresa": "string", 
  "email": "string",
  "telefono": "string",
  "tipo_servicio": "string",
  "detalle": "string",
  "_division": "CORPORATIVO|TURISMO|SALUD|AEROPUERTO|EVENTOS|DELIVERY",
  "_leadId": "SCL-CORP-M4Q8R2",
  "_timestamp": "2026-05-09T12:00:00.000Z",
  "_source": "/pages/corporativo.html",
  "_utm_source": "google",
  "_utm_medium": "cpc",
  "_utm_campaign": "corporativo_q2"
}
```

---

## FLUJO 2: RESERVA CONFIRMADA → CLIENTE

### Diagrama:
```
[HubSpot: Deal Stage Change → "Reserva Confirmada"]
    ├─→ [Resend: Email Confirmación al Cliente]
    │       └─→ Template: CONFIRMATION-EMAIL.html
    └─→ [WhatsApp: Mensaje al Cliente]
            └─→ "Su reserva AURA está confirmada ✦"
```

### Configuración:
1. **Trigger**: HubSpot webhook cuando Deal pasa a stage "Reserva Confirmada"
2. **Email** (Resend.com):
   - From: contacto@auratravel.cl
   - Subject: "AURA Travel — Su reserva está confirmada ✦ {{leadId}}"
   - Template: `CONFIRMATION-EMAIL.html` (ya diseñado)
   - Variables: nombre, división, fecha, servicio, leadId
3. **WhatsApp al Cliente**:
   - Template: `booking_confirmed`
   - Mensaje: "✦ AURA TRAVEL | Su reserva {{leadId}} ha sido confirmada. Fecha: {{fecha}}. Conductor asignado: {{conductor}}. Para cualquier cambio: +56 9 2615 1427"

---

## FLUJO 3: RECORDATORIO 24H

### Diagrama:
```
[Scheduler: Cada día 18:00]
    └─→ [HubSpot: Get Deals con fecha = mañana]
            ├─→ [WhatsApp: Recordatorio al Cliente]
            └─→ [WhatsApp: Alerta al Conductor]
```

### Configuración:
1. **Scheduler**: Ejecutar diario a las 18:00 Chile
2. **HubSpot API**: GET deals donde `fecha_servicio` = mañana
3. **WhatsApp Cliente**:
   - "📋 AURA TRAVEL | Recordatorio: Su servicio mañana {{fecha}} está confirmado. Conductor: {{conductor}}. Hora estimada: {{hora}}. Ante cualquier cambio: +56 9 2615 1427"
4. **WhatsApp Conductor**:
   - "🚐 SERVICIO MAÑANA | Cliente: {{nombre}} | Hora: {{hora}} | Origen: {{origen}} | Destino: {{destino}} | División: {{division}} | ID: {{leadId}}"

---

## FLUJO 4: REPORTE SEMANAL

### Diagrama:
```
[Scheduler: Lunes 8:00 AM]
    └─→ [Google Sheets: Contar leads por división]
            └─→ [Email: Resumen al equipo]
```

### Configuración:
1. **Scheduler**: Cada lunes 8:00 AM
2. **Google Sheets**: Contar filas de la última semana agrupadas por `_division`
3. **Email** al equipo:
```
📊 REPORTE SEMANAL AURA — Semana {{semana}}
━━━━━━━━━━━━━━━━━━
🏢 Corporativo: {{n_corp}} leads
🏔️ Turismo: {{n_tur}} leads  
🏥 Salud/Diálisis: {{n_salud}} leads
✈️ Aeropuerto: {{n_air}} leads
🎭 Eventos: {{n_evt}} leads
📦 Delivery: {{n_dlv}} leads
━━━━━━━━━━━━━━━━━━
TOTAL: {{total}} leads
Fuente principal: {{top_source}}
```

---

## FLUJO 5: COTIZACIÓN AUTOMÁTICA → PDF

### Diagrama:
```
[Webhook Especial: "Solicitar Cotización"]
    └─→ [Google Docs: Llenar Template Cotización]
            └─→ [Google Drive: Exportar PDF]
                    └─→ [Resend: Enviar PDF al prospecto]
```

### Configuración:
1. **Trigger**: Webhook separado (activar desde botón "Descargar Cotización" en web)
2. **Google Docs Template**: Cotización con logo AURA, datos del cliente, servicios, precios
3. **Export PDF**: Google Drive API
4. **Email**: "Estimado/a {{nombre}}, adjuntamos su cotización personalizada AURA Travel."

---

## 🔧 CHECKLIST DE IMPLEMENTACIÓN

- [ ] Crear cuenta Make.com (plan Free: 1.000 ops/mes, suficiente para empezar)
- [ ] Configurar Flujo 1 (ya tiene webhook activo)
- [ ] Crear Google Sheet "AURA — Leads 2026" con columnas del JSON
- [ ] Configurar WhatsApp Business API (ver SETUP-WHATSAPP-BUSINESS.md)
- [ ] Crear cuenta Resend.com para emails transaccionales
- [ ] Subir template CONFIRMATION-EMAIL.html a Resend
- [ ] Crear cuenta HubSpot Free (CRM + Pipeline)
- [ ] Configurar Flujo 2 → 3 → 4 en ese orden
- [ ] Flujo 5 (cotización PDF) es opcional — implementar cuando haya volumen

---

*Prioridad: Flujo 1 (ya semi-activo) → Flujo 3 (recordatorio) → Flujo 2 (confirmación).* 🤖
