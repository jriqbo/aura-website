# 💼 ACTIVAR HUBSPOT CRM — GUÍA 15 MINUTOS

## ¿Por qué es urgente?
Sin CRM, los leads llegan por WhatsApp y se pierden en la conversación.
No hay visibilidad de quién está en qué etapa, ni follow-up automático.
**Un lead sin seguimiento a las 48h tiene 80% menos probabilidad de cerrar.**

---

## PASO 1: Crear Cuenta Gratis (2 min)

1. Ve a **app.hubspot.com/signup-hubspot/crm**
2. Registra con tu email de AURA (contacto@auratravel.cl)
3. Nombre de empresa: AURA Travel
4. Industria: Transporte
5. Tamaño: 1-10 empleados
6. Plan: **Free CRM** (no necesitas pagar nada)

---

## PASO 2: Configurar Pipeline (5 min)

1. Ir a **CRM → Deals → Board View**
2. Editar pipeline → Crear estas 7 etapas:

| # | Etapa | Probabilidad |
|---|---|---|
| 1 | Nuevo Lead | 10% |
| 2 | Contactado | 20% |
| 3 | Cotización Enviada | 40% |
| 4 | Negociación | 60% |
| 5 | Reserva Confirmada | 90% |
| 6 | Servicio Completado | 100% |
| 7 | Cliente Recurrente | 100% |

---

## PASO 3: Crear Propiedades de Contacto (3 min)

Ir a Settings → Properties → Crear:

| Propiedad | Tipo | Valores |
|---|---|---|
| División AURA | Dropdown | Corporativo, Salud, Turismo, Eventos, Aeropuerto, Delivery |
| Tipo de Servicio | Texto | (libre) |
| Ruta Solicitada | Texto | (libre) |
| Fuente de Lead | Dropdown | Google Ads, WhatsApp, Web, Referido, Cold Email, LinkedIn |
| NPS Score | Número | 1-10 |

---

## PASO 4: Conectar Webhook (5 min)

Tu `form-handler.js` ya envía datos al webhook de Make.com.
Ahora conectamos Make.com → HubSpot:

### En Make.com:
1. Abrir tu escenario de "Lead Nuevo"
2. Después del módulo de WhatsApp, agregar módulo: **HubSpot → Create Contact**
3. Mapear campos:
   - Email → `{{email}}`
   - First Name → `{{empresa}}`
   - Phone → `{{telefono}}`
   - Division → `{{_division}}`
   - Lead Source → `{{_utm_source}}` o "Web"
4. Agregar segundo módulo: **HubSpot → Create Deal**
   - Deal Name → `"Transfer {{_division}} — {{empresa}}"`
   - Pipeline → Tu pipeline
   - Deal Stage → "Nuevo Lead"
   - Associated Contact → el contacto creado

### Resultado:
```
Formulario web → Make.com → WhatsApp + HubSpot (automático)
```

---

## PASO 5: Crear Vistas (2 min)

### Vista 1: "Leads HOY"
- Filtro: Create Date = Hoy
- Ordenar por: Más reciente primero

### Vista 2: "Deals en Riesgo"
- Filtro: Deal Stage = Contactado + Última actividad > 3 días
- Esto muestra deals que se están enfriando

### Vista 3: "Pipeline por División"
- Agrupar por: División AURA
- Ver cuántos leads hay por cada servicio

---

## PASO 6: Instalar App Móvil

1. Descargar **HubSpot** en iPhone/Android
2. Login con tu cuenta
3. Activar notificaciones push para "Nuevo Deal"
4. Ahora recibes alerta en el celular cada vez que llega un lead

---

## Checklist Final:
- [ ] Cuenta HubSpot Free creada
- [ ] Pipeline de 7 etapas configurado
- [ ] Propiedades custom creadas (División, Fuente, NPS)
- [ ] Make.com → HubSpot conectado
- [ ] App móvil instalada con notificaciones
- [ ] Vista "Leads HOY" creada

---

**Tiempo total: 15 minutos. Resultado: pipeline visual de todos los deals + notificaciones en celular.**
