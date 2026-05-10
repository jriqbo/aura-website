/**
 * AURA Global Elite — Form Handler (PRODUCTION + AUTOMATION)
 * Routes forms to WhatsApp + Webhook (Make.com/n8n) for CRM automation.
 * Division-aware: detects which service page the form lives on.
 * 
 * SETUP: Set WEBHOOK_URL below to your Make.com webhook to enable CRM.
 */

const AURA_WHATSAPP = '56926151427';
// Webhook para Make.com / n8n — dejar vacío para solo WhatsApp
const WEBHOOK_URL = 'https://hook.us2.make.com/t9mp19gn6el6pw33pd5q8gwtetnncdal';

const DIVISION_CONFIG = {
    'CORPORATIVO': {
        email: 'corporativo@auratravel.cl',
        emoji: '🏢',
        greeting: 'Solicitud de Servicio Corporativo',
        prefix: 'SCL-CORP'
    },
    'SALUD': {
        email: 'salud@auratravel.cl',
        emoji: '🏥',
        greeting: 'Solicitud de Protocolo Clínico',
        prefix: 'SCL-SALUD'
    },
    'TURISMO': {
        email: 'turismo@auratravel.cl',
        emoji: '🏔️',
        greeting: 'Solicitud de Expedición Turística',
        prefix: 'SCL-TUR'
    },
    'EVENTOS': {
        email: 'eventos@auratravel.cl',
        emoji: '🎭',
        greeting: 'Solicitud de Coordinación de Evento',
        prefix: 'SCL-EVT'
    },
    'AEROPUERTO': {
        email: 'aeropuerto@auratravel.cl',
        emoji: '✈️',
        greeting: 'Solicitud de Transfer Aeroportuario',
        prefix: 'SCL-AIR'
    },
    'DELIVERY': {
        email: 'logistica@auratravel.cl',
        emoji: '📦',
        greeting: 'Solicitud de Custodia y Entrega',
        prefix: 'SCL-DLV'
    },
    'DIPLOMATICO': {
        email: 'diplomatico@auratravel.cl',
        emoji: '🏛️',
        greeting: 'Solicitud de Protocolo Diplomático',
        prefix: 'SCL-DIPL'
    },
    'GENERAL': {
        email: 'contacto@auratravel.cl',
        emoji: '🚐',
        greeting: 'Solicitud de Servicio AURA',
        prefix: 'SCL-GEN'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const quoteForms = document.querySelectorAll('form');
    
    quoteForms.forEach(form => {
        // Anti-spam: Record when form was loaded (bots submit in < 3 seconds)
        form.dataset.loadTime = Date.now().toString();
        
        // Real-time field validation feedback
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value.trim() !== '') {
                    input.classList.add('touched');
                }
            });
        });

        // === ANTI-SPAM: Inject honeypot field (hidden trap for bots) ===
        if (!form.querySelector('.aura-hp-field')) {
            const hp = document.createElement('div');
            hp.className = 'aura-hp-field';
            hp.style.cssText = 'position:absolute;left:-9999px;top:-9999px;opacity:0;height:0;width:0;overflow:hidden;';
            hp.innerHTML = '<input type="text" name="_aura_website_url" tabindex="-1" autocomplete="off" aria-hidden="true">';
            form.appendChild(hp);
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // === ANTI-SPAM CHECK 1: Honeypot (bots fill hidden fields) ===
            const honeypot = form.querySelector('[name="_aura_website_url"]');
            if (honeypot && honeypot.value.trim() !== '') {
                console.warn('[AURA] Bot detected via honeypot');
                // Fake success to not alert the bot
                const fakeBtn = form.querySelector('button[type="submit"]');
                if (fakeBtn) fakeBtn.innerHTML = '✅ TRANSMISIÓN EXITOSA';
                return;
            }
            
            // === ANTI-SPAM CHECK 2: Rate limiting (max 3 per 5 min) ===
            const now = Date.now();
            const submissions = JSON.parse(sessionStorage.getItem('_aura_submissions') || '[]');
            const recentSubs = submissions.filter(t => now - t < 300000); // 5 min window
            if (recentSubs.length >= 3) {
                console.warn('[AURA] Rate limit exceeded');
                alert('Ha enviado múltiples solicitudes. Por favor espere unos minutos.');
                return;
            }
            recentSubs.push(now);
            sessionStorage.setItem('_aura_submissions', JSON.stringify(recentSubs));
            
            // === ANTI-SPAM CHECK 3: Time-based (form filled in < 3 seconds = bot) ===
            const formLoadTime = parseInt(form.dataset.loadTime || '0');
            if (formLoadTime && (now - formLoadTime) < 3000) {
                console.warn('[AURA] Bot detected via speed check');
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // UI Feedback: Start Submission
            submitBtn.disabled = true;
            submitBtn.classList.add('submitting');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> TRANSMITIENDO...';
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Remove honeypot field from data
            delete data._aura_website_url;
            
            // Detect division from page context
            const division = detectDivision();
            const config = DIVISION_CONFIG[division] || DIVISION_CONFIG['GENERAL'];
            const leadId = `${config.prefix}-${Date.now().toString(36).toUpperCase()}`;
            
            data._division = division;
            data._divisionEmail = config.email;
            data._leadId = leadId;
            data._timestamp = new Date().toISOString();
            data._source = window.location.pathname;
            data._referrer = document.referrer || 'directo';
            
            // UTM tracking for ad campaigns
            const urlParams = new URLSearchParams(window.location.search);
            data._utm_source = urlParams.get('utm_source') || '';
            data._utm_medium = urlParams.get('utm_medium') || '';
            data._utm_campaign = urlParams.get('utm_campaign') || '';
            
            console.log(`[AURA] form_submit | ${division} | ${leadId}`);
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', { event_category: 'lead', event_label: division, lead_id: leadId });
            }
            
            try {
                // STEP 1: Send to webhook (if configured)
                if (WEBHOOK_URL) {
                    try {
                        await fetch(WEBHOOK_URL, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data),
                            mode: 'no-cors'
                        });
                        console.log(`[AURA WEBHOOK] ✅ ${leadId} enviado a CRM`);
                    } catch (wErr) {
                        console.warn(`[AURA WEBHOOK] ⚠️ Falló, continuando con WhatsApp`);
                    }
                }
                
                // STEP 2: Build and open WhatsApp
                const waMessage = buildWhatsAppMessage(data, config, division);
                const waURL = `https://wa.me/${AURA_WHATSAPP}?text=${encodeURIComponent(waMessage)}`;
                await new Promise(resolve => setTimeout(resolve, 1200));
                window.open(waURL, '_blank');
                
                // Success State
                showNotification(
                    'Misión Confirmada', 
                    `Solicitud ${leadId} registrada. Se abrirá WhatsApp para confirmar con nuestro equipo.`, 
                    'success'
                );
                form.reset();
                inputs.forEach(i => i.classList.remove('touched'));
                
                // Analytics: successful submission
                console.log(`[AURA ANALYTICS] form_success | division: ${division} | channel: whatsapp`);
                
            } catch (error) {
                console.error('Transmission Error:', error);
                
                // Fallback: copy message to clipboard
                const fallbackMsg = buildWhatsAppMessage(data, config, division);
                try {
                    await navigator.clipboard.writeText(fallbackMsg);
                    showNotification(
                        'Enlace Alternativo', 
                        'Mensaje copiado al portapapeles. Envíelo vía WhatsApp al +56 9 2615 1427.', 
                        'warning'
                    );
                } catch (clipErr) {
                    showNotification(
                        'Error de Enlace', 
                        `No se pudo abrir WhatsApp. Contáctenos directamente al +56 9 2615 1427 o a ${config.email}`, 
                        'error'
                    );
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.classList.remove('submitting');
                submitBtn.innerHTML = originalBtnText;
            }
        });
    });
    
    const pricing = {
        'CORPORATIVO': [50000, 80000, 150000],
        'TURISMO': [70000, 110000, 200000],
        'SALUD': [40000, 60000, 120000],
        'EVENTOS': [80000, 130000, 250000],
        'AEROPUERTO': [35000, 55000, 100000],
        'DELIVERY': [15000, 25000, 50000],
        'DIPLOMATICO': [100000, 180000, 350000],
        'GENERAL': [40000, 60000, 110000]
    };

    function updatePrices() {
        const div = detectDivision();
        const p = pricing[div] || pricing['GENERAL'];
        const container = document.querySelector('.terminal-pricing-display');
        if (!container) return;
        container.innerHTML = `
            <div class="price-tier"><span>EJECUTIVO</span><strong>$${p[0].toLocaleString()}</strong></div>
            <div class="price-tier featured"><span>PREMIUM</span><strong>$${p[1].toLocaleString()}</strong></div>
            <div class="price-tier"><span>DIPLOMATIC</span><strong>$${p[2].toLocaleString()}</strong></div>
        `;
    }

    document.querySelectorAll('.t-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => setTimeout(updatePrices, 50));
    });
    updatePrices();
});

/**
 * Detect current division based on body class or URL
 */
function detectDivision() {
    const body = document.body;
    const path = window.location.pathname.toLowerCase();
    
    if (body.classList.contains('service-empresa') || path.includes('corporativo')) return 'CORPORATIVO';
    if (body.classList.contains('service-salud') || path.includes('salud') || path.includes('dialisis')) return 'SALUD';
    if (body.classList.contains('service-turismo') || path.includes('turismo')) return 'TURISMO';
    if (body.classList.contains('service-eventos') || path.includes('eventos')) return 'EVENTOS';
    if (body.classList.contains('service-aeropuerto') || path.includes('aeropuerto')) return 'AEROPUERTO';
    if (body.classList.contains('service-delivery') || path.includes('delivery')) return 'DELIVERY';
    if (body.classList.contains('service-diplomatico') || path.includes('embajadas') || path.includes('diplomatico')) return 'DIPLOMATICO';
    return 'GENERAL';
}

/**
 * Build formatted WhatsApp message from form data
 */
function buildWhatsAppMessage(data, config, division) {
    const timestamp = new Date().toLocaleString('es-CL', { 
        timeZone: 'America/Santiago',
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    
    let message = `${config.emoji} *AURA TRAVEL — ${config.greeting}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📋 *División:* ${division}\n`;
    message += `🕐 *Fecha:* ${timestamp}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    // Map common field names to readable labels
    const fieldLabels = {
        'nombre': '👤 Nombre',
        'name': '👤 Nombre',
        'empresa': '🏢 Empresa',
        'company': '🏢 Empresa',
        'institucion': '🏛️ Institución',
        'email': '📧 Email',
        'telefono': '📱 Teléfono',
        'phone': '📱 Teléfono',
        'tipo_servicio': '🎯 Tipo de Servicio',
        'service_type': '🎯 Tipo de Servicio',
        'fecha': '📅 Fecha',
        'date': '📅 Fecha',
        'hora': '⏰ Hora',
        'time': '⏰ Hora',
        'origen': '📍 Origen',
        'destino': '📍 Destino',
        'pasajeros': '👥 Pasajeros',
        'passengers': '👥 Pasajeros',
        'detalle': '📝 Detalle',
        'mensaje': '📝 Mensaje',
        'message': '📝 Mensaje',
        'idioma': '🌐 Idioma',
        'vuelo': '✈️ N° Vuelo',
        'aerolinea': '✈️ Aerolínea',
        'destino_turistico': '🏔️ Destino',
        'tipo_paquete': '📦 Tipo de Paquete',
        'prioridad': '⚡ Prioridad'
    };
    
    // Build data section
    for (const [key, value] of Object.entries(data)) {
        // Skip internal fields
        if (key.startsWith('_')) continue;
        if (!value || value.trim() === '') continue;
        
        const label = fieldLabels[key.toLowerCase()] || `📌 ${key.charAt(0).toUpperCase() + key.slice(1)}`;
        message += `${label}: ${value}\n`;
    }
    
    message += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📩 *Responder a:* ${config.email}\n`;
    message += `🔖 *ID:* ${config.prefix}-${Date.now().toString(36).toUpperCase()}\n`;
    message += `\n_Mensaje generado por AURA Command Terminal_`;
    
    return message;
}

/**
 * Command Terminal Notification System
 */
function showNotification(title, message, type) {
    // Remove any existing notifications
    document.querySelectorAll('.aura-notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `aura-notification ${type}`;
    notification.innerHTML = `
        <div class="notif-icon">
            ${type === 'success' 
                ? '<i class="fas fa-check-circle"></i>' 
                : type === 'warning'
                    ? '<i class="fas fa-exclamation-circle"></i>'
                    : '<i class="fas fa-exclamation-triangle"></i>'}
        </div>
        <div class="notif-content">
            <div class="notif-title">${title.toUpperCase()}</div>
            <div class="notif-msg">${message}</div>
        </div>
        <button class="notif-close" onclick="this.parentElement.remove()">&times;</button>
        <div class="notif-progress"></div>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger entrance animation
    requestAnimationFrame(() => {
        notification.classList.add('visible');
    });
    
    // Auto-remove after 8 seconds (longer for reading)
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 8000);
}
