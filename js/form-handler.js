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
        prefix: 'SCL-CORP',
        agent: 'AURA GOOGLE ADS EXPERT',
        specialization: 'High-Intent Corporate Search'
    },
    'SALUD': {
        email: 'salud@auratravel.cl',
        emoji: '🏥',
        greeting: 'Solicitud de Inteligencia Clínica',
        prefix: 'SCL-SALUD-INTEL',
        agent: 'AURA CLINICAL STRATEGIST',
        specialization: 'B2B Healthcare Logistics & Reporting'
    },
    'TURISMO': {
        email: 'turismo@auratravel.cl',
        emoji: '🏔️',
        greeting: 'Solicitud de Expedición Turística',
        prefix: 'SCL-TUR',
        agent: 'AURA BRAND SENIOR',
        specialization: 'Premium Experience Curated'
    },
    'EVENTOS': {
        email: 'eventos@auratravel.cl',
        emoji: '🎭',
        greeting: 'Solicitud de Coordinación de Evento',
        prefix: 'SCL-EVT',
        agent: 'AURA CRO MASTER',
        specialization: 'Large Scale Logistics'
    },
    'AEROPUERTO': {
        email: 'aeropuerto@auratravel.cl',
        emoji: '✈️',
        greeting: 'Solicitud de Transfer Aeroportuario',
        prefix: 'SCL-AIR',
        agent: 'AURA PERFORMANCE LEAD',
        specialization: 'AirProtocol Logistics'
    },
    'DELIVERY': {
        email: 'logistica@auratravel.cl',
        emoji: '📦',
        greeting: 'Solicitud de Custodia y Entrega',
        prefix: 'SCL-DLV',
        agent: 'AURA GROWTH OPS',
        specialization: 'Secure Last-Mile Delivery'
    },
    'DIPLOMATICO': {
        email: 'diplomatico@auratravel.cl',
        emoji: '🏛️',
        greeting: 'Solicitud de Protocolo Diplomático',
        prefix: 'SCL-DIPL',
        agent: 'AURA LINKEDIN ABM LEAD',
        specialization: 'Account-Based Diplomatic Protocol'
    },
    'GENERAL': {
        email: 'contacto@auratravel.cl',
        emoji: '🚐',
        greeting: 'Solicitud de Servicio AURA',
        prefix: 'SCL-GEN',
        agent: 'AURA ZENITH SYSTEM',
        specialization: 'Global Institucional Mobility'
    }
};

/**
 * Initialize Google Places Autocomplete for specific fields
 */
function initAutocomplete() {
    if (typeof google === 'undefined' || !google.maps || !google.maps.places) return;

    const options = {
        componentRestrictions: { country: "cl" },
        fields: ["address_components", "geometry", "icon", "name", "formatted_address"]
    };

    const originInput = document.getElementById('direccion-origen');
    if (originInput) {
        const autoOrigin = new google.maps.places.Autocomplete(originInput, options);
        autoOrigin.addListener("place_changed", () => {
            const place = autoOrigin.getPlace();
            if (place.geometry) console.log('[AURA MAPS] Origen validado:', place.formatted_address || place.name);
        });
        // Prevenir "Enter" submit form
        originInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') e.preventDefault(); });
    }

    const destInput = document.getElementById('direccion-destino');
    if (destInput) {
        const autoDest = new google.maps.places.Autocomplete(destInput, options);
        autoDest.addListener("place_changed", () => {
            const place = autoDest.getPlace();
            if (place.geometry) console.log('[AURA MAPS] Destino validado:', place.formatted_address || place.name);
        });
        // Prevenir "Enter" submit form
        destInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') e.preventDefault(); });
    }
}

// Global exposure for Google Maps callback
window.initAutocomplete = initAutocomplete;

/**
 * AURA // AGENTIC BRIDGE
 * Connects UI events to MCP Orchestrator Zenith
 */
async function triggerAgenticHandshake(data) {
    if (window.AgentOrchestrator) {
        const division = detectDivision().toLowerCase();
        console.log(`[AURA HANDSHAKE] Delegando a Orchestrator para división: ${division}`);
        return await window.AgentOrchestrator.triggerAgenticHandshake(data, division);
    }
    return Promise.resolve();
}

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

        // === AGENT LIVE INSIGHT: Inject dynamic expert panel ===
        if (!form.querySelector('.agent-live-insight')) {
            const insightPanel = document.createElement('div');
            insightPanel.className = 'agent-live-insight';
            insightPanel.id = 'agentLiveInsight';
            insightPanel.innerHTML = `
                <div class="insight-icon"><i class="fas fa-brain"></i></div>
                <div class="insight-text-wrapper">
                    <div class="insight-header">
                        <span class="insight-agent-name">AURA INTEL</span>
                        <span class="insight-status">RESONANDO...</span>
                    </div>
                    <p class="insight-message">Analizando requerimientos en tiempo real...</p>
                </div>
            `;
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) form.insertBefore(insightPanel, submitBtn);
        }

        // Listen for live changes to trigger agent advice
        const liveFields = form.querySelectorAll('input, select, textarea');
        liveFields.forEach(field => {
            field.addEventListener('input', debounce(async () => {
                // === B2B TEST MODE TRIGGER ===
                if (field.value === 'DEBUG_B2B') {
                    console.log('[AURA DEBUG] 🛠️ Modo Test B2B activado para webhook.');
                    showNotification('DEBUG MODE', 'Enviando payload de prueba al webhook de Make.com...', 'info');
                    const testPayload = {
                        _leadId: 'DEBUG-TEST-' + Date.now().toString(36).toUpperCase(),
                        _division: detectDivision(),
                        nombre: 'TEST AGENTE AURA',
                        email: 'test@auratravel.cl',
                        empresa: 'AURA TESTING CORP',
                        lead_type: 'CORPORATIVO B2B',
                        _is_debug: true,
                        _timestamp: new Date().toISOString()
                    };
                    try {
                        await fetch(WEBHOOK_URL, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(testPayload),
                            mode: 'no-cors'
                        });
                        showNotification('DEBUG SUCCESS', 'Payload enviado correctamente. Verifique su CRM/Make.com', 'success');
                    } catch (e) {
                        showNotification('DEBUG ERROR', 'Fallo al conectar con el webhook.', 'error');
                    }
                    field.value = ''; // Clear the trigger
                    return;
                }

                if (!window.AuraAgents) return;
                
                const formData = new FormData(form);
                const allData = Object.fromEntries(formData.entries());
                const advice = await window.AuraAgents.getLiveAdvice(field.name, field.value, allData);
                
                const panel = form.querySelector('.agent-live-insight');
                if (advice && panel) {
                    panel.querySelector('.insight-agent-name').textContent = advice.agent;
                    panel.querySelector('.insight-message').innerHTML = advice.message;
                    panel.querySelector('.insight-icon i').className = `fas ${advice.icon}`;
                    panel.classList.add('active');
                } else if (panel) {
                    // Only hide if it wasn't already active with important info
                    // or if value is cleared
                    if (!field.value) panel.classList.remove('active');
                }
            }, 800));
        });

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
            submitBtn.innerHTML = '<span>CONSULTANDO AURA AGENTS...</span> <i class="fas fa-microchip fa-spin"></i>';
            
            const formData = new FormData(form);
            let enrichedData = {};
            
            try {
                if (window.AuraAgents) {
                    const agentResult = await window.AuraAgents.processLead(formData);
                    enrichedData = agentResult.final_payload;
                    console.log('[AURA AGENTS] Handshake completo:', agentResult.agents_report);
                    
                    // Show transparency reasoning in UI if available
                    if (agentResult.agents_report.transparency_audit.explanation) {
                        showNotification('AURA REASONING', agentResult.agents_report.transparency_audit.explanation, 'info');
                    }
                } else {
                    enrichedData = Object.fromEntries(formData.entries());
                }
            } catch (agentError) {
                console.error('[AURA AGENTS] Error en handshake:', agentError);
                enrichedData = Object.fromEntries(formData.entries());
            }

            const data = enrichedData;
            
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
            
            const email = (data.email || '').toLowerCase();
            data.lead_type = (!email.includes('@gmail.com') && !email.includes('@yahoo.com') && !email.includes('@hotmail.com')) ? 'CORPORATIVO B2B' : 'PARTICULAR';
            
            // Detect snow season for early booking flag (CRM Metadata)
            const destValue = (data.destino || '').toLowerCase();
            const isMountain = ['valle-nevado', 'portillo', 'farellones'].some(m => destValue.includes(m));
            if (isMountain) {
                data._early_booking_2026 = true;
                data._discount_applied = '15%';
                data._campaign_tag = 'WINTER_2026_EB';
            }

            console.log(`[AURA] form_submit | ${division} | ${leadId}`);
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', { event_category: 'lead', event_label: division, lead_id: leadId });
            }
            
            try {
                // STEP 1: Institutional Handshake (HubSpot + WhatsApp MCP)
                await triggerAgenticHandshake(data);

                // STEP 2: Send to webhook (if configured)
                if (WEBHOOK_URL) {
                    try {
                        // Normalize data for Email Templates ({{nombre}}, etc)
                        data.nombre = data.nombre || data.name || data.clinica || data.empresa || 'Cliente';
                        
                        // Add extra info for the Agent reasoning display in email
                        data._agents_status = 'VERIFIED';
                        data._automation_heartbeat = new Date().toISOString();

                        console.log(`[AURA AUTOMATION] 🧠 Payload optimizado para ${division}:`, data);

                        await fetch(WEBHOOK_URL, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data),
                            mode: 'no-cors'
                        });
                        console.log(`[AURA WEBHOOK] ✅ ${leadId} enviado a CRM + Email Queue`);
                    } catch (wErr) {
                        console.warn(`[AURA WEBHOOK] ⚠️ Falló, continuando con WhatsApp`);
                    }
                }
                
                // STEP 3: Build and open WhatsApp
                const waMessage = buildWhatsAppMessage(data, config, division);
                const waURL = `https://wa.me/${AURA_WHATSAPP}?text=${encodeURIComponent(waMessage)}`;
                await new Promise(resolve => setTimeout(resolve, 800));
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
        let p = [...(pricing[div] || pricing['GENERAL'])];
        
        // Night surcharge (22:00 - 06:00)
        const hour = new Date().getHours();
        if (hour >= 22 || hour < 6) p = p.map(x => x * 1.3);

        // Destination specific logic
        const dest = (document.querySelector('[name="destino"]') || {value:''}).value.toLowerCase();
        const mountain = ['valle-nevado', 'portillo', 'farellones'].some(m => dest.includes(m));
        
        // EARLY BOOKING SNOW 2026 (15% Discount for early snow reservations)
        const isSnowSeason = mountain;
        if (isSnowSeason) {
            p = p.map(x => x * 0.85); // 15% Early Booking Discount
            console.log('[AURA PRICING] Early Booking Snow 2026 Applied');
            
            // Show discount in UI if possible
            const insightPanel = document.querySelector('.agent-live-insight');
            if (insightPanel && !insightPanel.classList.contains('active')) {
                insightPanel.querySelector('.insight-agent-name').textContent = 'AURA SALES';
                insightPanel.querySelector('.insight-message').innerHTML = '<strong>❄️ BENEFICIO ACTIVADO:</strong> Early Booking Snow 2026 (15% OFF) aplicado por reserva anticipada.';
                insightPanel.querySelector('.insight-icon i').className = 'fas fa-percentage';
                insightPanel.classList.add('active');
            }
        }

        const container = document.querySelector('.terminal-pricing-display');
        if (!container) return;
        container.innerHTML = `
            <div class="price-tier"><span>EJECUTIVO</span><strong>$${Math.round(p[0]).toLocaleString()}</strong></div>
            <div class="price-tier featured"><span>PREMIUM</span><strong>$${Math.round(p[1]).toLocaleString()}</strong></div>
            <div class="price-tier"><span>DIPLOMATIC</span><strong>$${Math.round(p[2]).toLocaleString()}</strong></div>
            ${isSnowSeason ? '<div class="price-badge-discount">EARLY BOOKING -15%</div>' : ''}
        `;
    }

    document.querySelectorAll('.t-nav-btn, input[name="destino"], select[name="destino"]').forEach(el => {
        el.addEventListener('change', updatePrices);
        el.addEventListener('click', () => setTimeout(updatePrices, 50));
    });
    updatePrices();

    // Init Autocomplete if API is already loaded
    if (typeof google !== 'undefined' && google.maps && google.maps.places) {
        initAutocomplete();
    }
    // === PREDICTIVE FLOW: MUERTE AL FORMULARIO ===
    // (Consolidado al final del archivo para máxima limpieza arquitectónica)

    // === B2B DOSSIER TRACKING ===
    document.querySelectorAll('.btn-aura-mission, .btn-dossier, [href*="pdf"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const label = btn.innerText.trim() || 'Dossier General';
            console.log(`[AURA ANALYTICS] dossier_click | ${label}`);
            if (typeof gtag !== 'undefined') {
                gtag('event', 'dossier_interaction', {
                    'event_category': 'B2B_Conversion',
                    'event_label': label,
                    'page_path': window.location.pathname
                });
            }
            
            // If it's the PDF generator button
            if (btn.classList.contains('generate-pdf-trigger')) {
                e.preventDefault();
                generateAuraDossier();
            }
        });
    });
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
    
    const isInstitutional = data.lead_type === 'CORPORATIVO B2B';
    const isEarlyBooking = ['valle-nevado', 'portillo', 'farellones'].some(m => (data.destino || '').includes(m));
    
    let message = `${config.emoji} *AURA TRAVEL — ${config.greeting}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📋 *División:* ${division}\n`;
    message += `🕐 *Fecha:* ${timestamp}\n`;
    message += `🛡️ *Estatus:* ${isInstitutional ? 'INSTITUCIONAL VERIFICADO ✅' : 'PARTICULAR'}\n`;
    if (isEarlyBooking) message += `❄️ *Promo:* EARLY BOOKING SNOW 2026 (-15%) 🏷️\n`;
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
        'tipo_servicio': '🎯 Servicio',
        'service_type': '🎯 Servicio',
        'fecha': '📅 Fecha',
        'date': '📅 Fecha',
        'hora': '⏰ Hora',
        'time': '⏰ Hora',
        'origen': '📍 Origen',
        'destino': '📍 Destino',
        'pasajeros': '👥 Pax',
        'passengers': '👥 Pax',
        'motivo': '🎯 Objetivo B2B',
        'clinica': '🏛️ Centro/Clínica',
        'cargo': '💼 Cargo',
        'mensaje': '📝 Requerimientos',
        'detalle': '📝 Detalles Operativos',
        'message': '📝 Requerimientos'
    };
    
    // Build data section
    for (const [key, value] of Object.entries(data)) {
        if (key.startsWith('_')) continue;
        if (!value || value.trim() === '') continue;
        
        const label = fieldLabels[key.toLowerCase()] || `📌 ${key.charAt(0).toUpperCase() + key.slice(1)}`;
        message += `${label}: ${value}\n`;
    }
    
    message += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `👤 *Especialista:* ${config.agent}\n`;
    message += `🎯 *Foco:* ${config.specialization}\n`;
    message += `📩 *Responder a:* ${config.email}\n`;
    message += `🔖 *ID:* ${data._leadId || 'SCL-' + Date.now().toString(36).toUpperCase()}\n`;
    message += `\n_AURA Zenith System: Senior Protocol Verified_`;
    
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
                    : type === 'info'
                        ? '<i class="fas fa-brain"></i>'
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

/**
 * AURA B2B - PDF Dossier Generator
 */
function generateAuraDossier() {
    if (typeof html2pdf === 'undefined') {
        showNotification('Error del Sistema', 'Motor de PDF no disponible. Por favor, recargue la página o contáctenos directamente.', 'error');
        return;
    }

    const btn = document.querySelector('.btn-aura-mission');
    if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>GENERANDO DOSSIER...</span> <i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        const element = document.getElementById('dossier-b2b');
        
        // Setup PDF Options for High Quality
        const opt = {
            margin:       10,
            filename:     'AURA_Dossier_Movilidad_B2B.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, logging: false },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        const division = detectDivision();
        const config = DIVISION_CONFIG[division] || DIVISION_CONFIG['GENERAL'];
        const pdfId = `DOSS-${division.substring(0,3)}-${Date.now().toString(36).toUpperCase()}`;
        
        const pdfHeader = document.createElement('div');
        pdfHeader.innerHTML = `
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 2px solid #C9A96E;">
                <h1 style="color: #0A0A0F; margin: 0; font-family: 'Inter', sans-serif; font-weight: 800; letter-spacing: 2px;">AURA TRAVEL</h1>
                <p style="color: #C9A96E; margin: 5px 0 0 0; font-family: 'Inter', sans-serif; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">División ${division} | Dossier Técnico Institucional</p>
                <p style="color: #64748B; margin: 2px 0 0 0; font-family: 'Inter', sans-serif; font-size: 10px;">ID: ${pdfId} | DOCUMENTO CONFIDENCIAL</p>
            </div>
        `;
        element.insertBefore(pdfHeader, element.firstChild);

        // Temporarily adjust styles for PDF generation (white background for print)
        const originalBg = element.style.background;
        const originalColor = element.style.color;
        element.style.background = '#ffffff';
        element.style.color = '#1E293B';
        
        const darkElements = element.querySelectorAll('.dc, .norm-card, h2, h3, h4, p');
        const originalStyles = [];
        darkElements.forEach(el => {
            originalStyles.push({ el: el, color: el.style.color, background: el.style.background });
            if(el.tagName === 'P') el.style.color = '#475569';
            if(el.tagName === 'H2' || el.tagName === 'H3' || el.tagName === 'H4') el.style.color = '#0F172A';
            if(el.classList.contains('dc') || el.classList.contains('norm-card')) {
                el.style.background = '#F8FAFC';
                el.style.borderColor = '#E2E8F0';
            }
        });

        // Track Event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'download_b2b_dossier', {
                'event_category': 'B2B',
                'event_label': 'Corporate Dossier PDF Download'
            });
            console.log('[AURA Analytics] Evento download_b2b_dossier registrado.');
        }

        // Generate PDF
        html2pdf().set(opt).from(element).save().then(() => {
            showNotification('Operación Exitosa', 'El Dossier Institucional ha sido descargado correctamente.', 'success');
        }).catch(err => {
            console.error('[AURA PDF Error]', err);
            showNotification('Error', 'No se pudo generar el documento. Intente nuevamente.', 'error');
        }).finally(() => {
            // Restore UI
            element.removeChild(pdfHeader);
            element.style.background = originalBg;
            element.style.color = originalColor;
            originalStyles.forEach(style => {
                style.el.style.color = style.color;
                style.el.style.background = style.background;
                if(style.el.classList.contains('dc') || style.el.classList.contains('norm-card')) {
                    style.el.style.borderColor = '';
                }
            });
            
            btn.innerHTML = originalText;
            btn.disabled = false;
        });
    }
}

/**
 * Utility: Debounce function to prevent agent spam
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * AURA // ORQUESTADOR PREDICTIVO — "Muerte al Formulario"
 * Automatiza el pre-llenado de datos basados en la interacción previa del usuario.
 */
/**
 * AURA // ORQUESTADOR PREDICTIVO — "Muerte al Formulario"
 * Automatiza el pre-llenado de datos basados en la interacción previa del usuario.
 */
function initPredictiveFlow() {
    console.log('[AURA // ORQUESTADOR] Inicializando sistema de pre-llenado...');
    
    const prefillButtons = document.querySelectorAll('[data-aura-action="prefill"]');
    const terminalForm = document.getElementById('contact-form') || document.querySelector('form.terminal-form');

    if (!terminalForm) {
        console.warn('[AURA // ORQUESTADOR] Error: Terminal de mando no encontrado.');
        return;
    }

    prefillButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const service = btn.getAttribute('data-aura-service') || btn.dataset.auraService;
            const destination = btn.getAttribute('data-aura-destination') || btn.dataset.auraDestination;
            
            console.log(`[AURA // ORQUESTADOR] Interacción detectada. Servicio: ${service}, Destino: ${destination}`);
            
            // Orquestación Predictiva en el Terminal
            const serviceField = terminalForm.querySelector('[name="servicio"]');
            const destinationField = terminalForm.querySelector('[name="direccion-destino"]') || terminalForm.querySelector('[name="destino"]');
            const detailField = terminalForm.querySelector('[name="mensaje"]') || terminalForm.querySelector('[name="detalle"]');

            // 1. Highlight the transition
            btn.classList.add('btn-clicked');
            
            setTimeout(() => {
                // 2. Pre-fill with animation
                if (service && serviceField) {
                    serviceField.value = service;
                    serviceField.setAttribute('value', service);
                    serviceField.classList.add('predicted-value', 'has-value');
                    serviceField.dispatchEvent(new Event('change', { bubbles: true }));
                }

                if (destination && destinationField) {
                    destinationField.value = destination;
                    destinationField.setAttribute('value', destination);
                    destinationField.classList.add('predicted-value', 'has-value');
                    destinationField.dispatchEvent(new Event('input', { bubbles: true }));
                    destinationField.dispatchEvent(new Event('change', { bubbles: true }));

                    // AURA AGENTIC: Trigger route calculation via Maps MCP
                    if (window.AgentOrchestrator) {
                        window.AgentOrchestrator.calculateAuraRoute('Santiago (SCL)', destination);
                    }
                }

                if (detailField) {
                    const divisionName = service ? service.charAt(0).toUpperCase() + service.slice(1) : 'General';
                    detailField.value = `Consulta Prioritaria: División ${divisionName}. Destino solicitado: ${destination || 'Por definir'}.`;
                    detailField.classList.add('predicted-value', 'has-value');
                }

                // 3. Update Insight Panel
                const insightPanel = document.getElementById('agentLiveInsight');
                if (insightPanel) {
                    const division = service ? service.toUpperCase() : 'GENERAL';
                    const config = DIVISION_CONFIG[division] || DIVISION_CONFIG['GENERAL'];
                    
                    insightPanel.innerHTML = `
                        <div class="insight-icon"><i class="fas fa-brain"></i></div>
                        <div class="insight-text-wrapper">
                            <span class="insight-agent">${config.agent}</span>
                            <p class="insight-msg">He pre-llenado el terminal con el protocolo de <strong>${division}</strong> para ahorrarle tiempo. ¿Desea proceder?</p>
                        </div>
                    `;
                    insightPanel.classList.add('insight-active');
                }

                // 4. Scroll suave al terminal de mando (Sección #contacto)
                const terminalSection = document.getElementById('contacto') || terminalForm;
                terminalSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // 5. Visual confirmation
                if (typeof showNotification === 'function') {
                    showNotification('ZENITH ACTIVO', 'Protocolo de pre-llenado ejecutado con éxito.', 'info');
                }
            }, 300);
        });
    });

    // Gestión dinámica de estados visuales
    terminalForm.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('focus', () => {
            field.classList.remove('predicted-value');
        });

        field.addEventListener('blur', () => {
            if (field.value) field.classList.add('has-value');
            else field.classList.remove('has-value');
        });

        if (field.value) field.classList.add('has-value');
    });
}

// Inicialización Global AURA 2026
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPredictiveFlow);
} else {
    initPredictiveFlow();
}

console.log('[AURA // SYSTEM] Zenith Monolith Script Loaded.');



