/**
 * AURA Travel — Google Analytics 4 + Event Tracking
 * Carga GA4 e implementa tracking de eventos clave:
 * - page_view (automático)
 * - form_submit (formulario completado)
 * - whatsapp_click (clic en WhatsApp)
 * - cta_click (clic en botones CTA)
 * - scroll_75 (scroll 75% de la página)
 * 
 * SETUP: Reemplazar G-XXXXXXXXXX con tu Measurement ID real de GA4.
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════
    // CONFIGURACIÓN — REEMPLAZAR CON TU ID REAL
    // ═══════════════════════════════════════════
    const GA_MEASUREMENT_ID = 'G-9WMGVTMDMT'; // AURA Travel — Propiedad GA4 activa

    // Cargar script de GA4
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
        send_page_view: true,
        cookie_flags: 'SameSite=None;Secure'
    });

    // ═══════════════════════════════════════════
    // EVENTO: form_submit
    // ═══════════════════════════════════════════
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (!form || form.tagName !== 'FORM') return;

        const division = detectDivisionGA();
        const servicio = form.querySelector('[name="servicio"]');

        gtag('event', 'form_submit', {
            event_category: 'lead',
            event_label: division,
            service_type: servicio ? servicio.value : 'general',
            page_path: window.location.pathname
        });
    });

    // ═══════════════════════════════════════════
    // EVENTO: whatsapp_click
    // ═══════════════════════════════════════════
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href*="wa.me"], a[href*="whatsapp"]');
        if (link) {
            gtag('event', 'whatsapp_click', {
                event_category: 'contact',
                event_label: detectDivisionGA(),
                page_path: window.location.pathname
            });
        }
    });

    // ═══════════════════════════════════════════
    // EVENTO: cta_click (botones principales)
    // ═══════════════════════════════════════════
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn-luxury-mission, .btn-terminal-submit, .btn-outline, [class*="btn-cta"]');
        if (btn) {
            gtag('event', 'cta_click', {
                event_category: 'engagement',
                event_label: btn.textContent.trim().substring(0, 50),
                page_path: window.location.pathname
            });
        }
    });

    // ═══════════════════════════════════════════
    // EVENTO: scroll_75 (scroll profundo)
    // ═══════════════════════════════════════════
    let scrollTracked = false;
    window.addEventListener('scroll', function() {
        if (scrollTracked) return;
        const scrollPercent = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
        if (scrollPercent >= 0.75) {
            scrollTracked = true;
            gtag('event', 'scroll_75', {
                event_category: 'engagement',
                event_label: detectDivisionGA(),
                page_path: window.location.pathname
            });
        }
    }, { passive: true });

    // ═══════════════════════════════════════════
    // EVENTO: UTM tracking (para Google Ads)
    // ═══════════════════════════════════════════
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    if (utmSource) {
        gtag('event', 'campaign_visit', {
            utm_source: utmSource,
            utm_medium: urlParams.get('utm_medium') || '',
            utm_campaign: urlParams.get('utm_campaign') || '',
            utm_term: urlParams.get('utm_term') || ''
        });
    }

    // Helper: detectar división desde URL
    function detectDivisionGA() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('corporativo')) return 'corporativo';
        if (path.includes('salud') || path.includes('dialisis')) return 'salud';
        if (path.includes('turismo') || path.includes('valle-nevado') || path.includes('portillo')) return 'turismo';
        if (path.includes('evento')) return 'eventos';
        if (path.includes('aeropuerto') || path.includes('airport') || path.includes('scl')) return 'aeropuerto';
        if (path.includes('delivery')) return 'delivery';
        return 'home';
    }

})();
