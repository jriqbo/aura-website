/**
 * 🚀 AURA MARKETING & GROWTH ENGINE
 * Orquestación de captura de leads y analítica predictiva
 */

const AuraGrowth = {
    init() {
        this.trackScrollIntention();
        this.initConversionTriggers();
        console.log("🚀 AURA GROWTH ENGINE: Online // Monitoring Intent...");
    },

    /**
     * Detecta intención de salida o scroll profundo para inyectar micro-CTAs
     */
    trackScrollIntention() {
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercent > 70) {
                this.triggerSoftConversion("¿Necesitas un convenio corporativo? AURA es el estándar.");
            }
        });
    },

    /**
     * Trigger de conversión suave (No invasivo)
     */
    triggerSoftConversion(message) {
        if (!document.querySelector('.growth-toast')) {
            const toast = document.createElement('div');
            toast.className = 'growth-toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: rgba(10, 10, 15, 0.95);
                border: 1px solid var(--aura-gold);
                color: #fff;
                padding: 1.5rem;
                border-radius: 12px;
                backdrop-filter: blur(20px);
                z-index: 9999;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                font-family: 'Inter', sans-serif;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                gap: 1rem;
                animation: slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            `;
            toast.innerHTML = `
                <i class="fas fa-rocket" style="color: var(--aura-gold)"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.remove()" style="background: none; border: none; color: var(--aura-gold); cursor: pointer;">
                    <i class="fas fa-times"></i>
                </button>
            `;
            document.body.appendChild(toast);
        }
    },

    initConversionTriggers() {
        // Reservado para integración con Google Ads / Meta Conversions API
    }
};

document.addEventListener('DOMContentLoaded', () => AuraGrowth.init());
