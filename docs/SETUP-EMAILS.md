# AURA Travel — Configuración de Emails Institucionales

## Buzones a Crear en tu Panel de Hosting

| Email | División | Uso |
|---|---|---|
| contacto@auratravel.cl | General | Bandeja principal, consultas generales |
| turismo@auratravel.cl | Turismo | Cotizaciones nieve, destinos |
| corporativo@auratravel.cl | Corporativo | Convenios, propuestas B2B |
| salud@auratravel.cl | Salud | Protocolos clínicos, diálisis |
| eventos@auratravel.cl | Eventos | Coordinación de galas, congresos |
| aeropuerto@auratravel.cl | Aeropuerto | Transfers VIP, tracking |
| logistica@auratravel.cl | Delivery | Custodia, entregas urgentes |
| diplomatico@auratravel.cl | Diplomático | Embajadas, protocolo internacional |

## Cómo Crear los Buzones

### Si tu hosting es cPanel:
1. Entra a cPanel → "Cuentas de email"
2. Crea cada buzón con contraseña segura
3. Configura reenvío a tu Gmail si quieres centralizarlos

### Si tu dominio está en Vercel:
Vercel no ofrece email. Opciones:
- **Zoho Mail Free** (5 buzones gratis) → zoho.com/mail
- **Google Workspace** ($6/usuario/mes) → workspace.google.com
- **Cloudflare Email Routing** (gratis, solo reenvío) → cloudflare.com

### Configuración DNS (MX Records):
Depende del proveedor que elijas. Ejemplo Zoho:
```
MX  @  mx.zoho.com      10
MX  @  mx2.zoho.com     20
MX  @  mx3.zoho.com     50
TXT @  v=spf1 include:zoho.com ~all
```

## Firma de Email Recomendada

```html
--
AURA Travel ✦ Transporte Ejecutivo de Lujo
[Tu Nombre] — [División]
📱 +56 9 2615 1427
🌐 auratravel.cl
📍 Santiago, Chile
```

## Consejo: Centralizar Todo en Gmail

Si prefieres revisar todo desde un solo lugar:
1. Crea los buzones en tu hosting
2. Configura reenvío (forward) de todos → tu Gmail personal
3. En Gmail: Ajustes → "Enviar como" → agrega cada dirección
4. Así puedes responder DESDE turismo@auratravel.cl directamente en Gmail

---

*Con esto tu comunicación queda 100% institucional.* 🏴
