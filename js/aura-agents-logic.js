/**
 * AURA ELITE SQUAD — Logic Module
 * Implements autonomous behaviors for the Senior Agent Squad.
 */

const AuraAgents = {
    /**
     * Agent: aura-city-flow (Senior)
     * Detects user location and predicts the origin route to reduce friction.
     */
    initGeolocationIntelligence: function() {
        console.log("AURA [city-flow]: Initiating proximity handshake...");
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                // Simplified SCL check
                const isSantiago = (lat < -33.0 && lat > -33.8 && lon < -70.4 && lon > -71.0);
                
                if (isSantiago) {
                    this.updateTerminalWithPrediction("📍 UBICACIÓN ACTUAL (Santiago)");
                    AuraHUD.log("aura-city-flow", "Ubicación detectada: Santiago. Ruta pre-calculada.");
                }
            }, (error) => {
                console.warn("AURA [city-flow]: Geolocation denied. Falling back to manual entry.");
            });
        }
    },

    updateTerminalWithPrediction: function(locationName) {
        const originInput = document.querySelector('input[placeholder*="ORIGEN"]');
        if (originInput && !originInput.value) {
            originInput.value = locationName;
            originInput.classList.add('predicted-value');
        }
    },

    /**
     * Agent: aura-performance-lead (Senior)
     * Simulates dynamic pricing and Early Booking incentives.
     */
    initEarlyBookingEngine: function() {
        const dateInput = document.querySelector('input[type="date"]');
        if (!dateInput) return;

        dateInput.addEventListener('change', (e) => {
            const selectedDate = new Date(e.target.value);
            const today = new Date();
            const diffTime = Math.abs(selectedDate - today);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays >= 30) {
                this.applyIncentive("EARLY BOOKING DETECTED: 15% Descuento aplicado.");
                if (window.AuraHUD) AuraHUD.log("aura-performance-lead", "Incentivo Early Booking activado para reserva a " + diffDays + " días.");
            }
        });
    },

    /**
     * CityFlow Telemetry Engine
     * Simulates real-time traffic and weather for the Hub Vivo.
     */
    initCityFlowTelemetry: function() {
        const routes = [
            { id: 'flow-costanera', name: 'COSTANERA NORTE' },
            { id: 'flow-vespucio', name: 'VESPUCIO ORIENTE' },
            { id: 'flow-kennedy', name: 'AV. KENNEDY' }
        ];

        const states = [
            { text: 'FLUIDO', class: 'status-fluid' },
            { text: 'MODERADO', class: 'status-moderate' },
            { text: 'DENSO', class: 'status-congested' },
            { text: 'CRÍTICO', class: 'status-congested' }
        ];

        setInterval(() => {
            routes.forEach(route => {
                const el = document.getElementById(route.id);
                if (el) {
                    const newState = states[Math.floor(Math.random() * states.length)];
                    el.innerText = newState.text;
                    el.className = 'm-value ' + newState.class;
                }
            });

            // Update Weather Telemetry
            this.updateWeatherTelemetry();
        }, 5000);
    },

    /**
     * Weather Simulation Engine
     * Mock data for SCL.
     */
    updateWeatherTelemetry: function() {
        const tempEl = document.getElementById('weather-temp');
        const visEl = document.getElementById('weather-visibility');
        const descEl = document.getElementById('weather-desc');

        if (tempEl) {
            const baseTemp = 14; // May average in SCL
            const vari = (Math.random() * 4) - 2;
            tempEl.innerText = (baseTemp + vari).toFixed(1) + "°C";
        }
        if (visEl) {
            const vis = 85 + (Math.random() * 15);
            visEl.innerText = vis.toFixed(0) + "%";
        }
        if (descEl) {
            const conditions = ["DESPEJADO", "PARCIAL", "NEBLINA SCL"];
            descEl.innerText = conditions[Math.floor(Math.random() * conditions.length)];
        }
    },

    /**
     * Muerte al Formulario: Destination Tags
     */
    initDestinationTags: function() {
        const tags = document.querySelectorAll('.f-dest-tag');
        const destInput = document.getElementById('direccion-destino');

        tags.forEach(tag => {
            tag.addEventListener('click', () => {
                if (destInput) {
                    destInput.value = tag.innerText;
                    destInput.classList.add('predicted-value');
                    destInput.dispatchEvent(new Event('input', { bubbles: true }));
                    
                    if (window.AuraHUD) AuraHUD.log("aura-city-flow", "Destino frecuente seleccionado: " + tag.innerText);
                }
            });
        });
    },

    applyIncentive: function(message) {
        const statusDisplay = document.getElementById('aura-intelligence-pulse');
        if (statusDisplay) {
            statusDisplay.innerHTML = `<span class="incentive-badge">${message}</span>`;
            statusDisplay.style.color = 'var(--aura-gold)';
        }
    },

    /**
     * Agent: aura-intel (Senior)
     * Provides real-time feedback based on form input.
     */
    getLiveAdvice: async function(fieldName, fieldValue, allData) {
        if (!fieldValue || fieldValue.length < 3) return null;

        const adviceMap = {
            'email': (val) => {
                if (val.includes('@') && !['gmail', 'outlook', 'yahoo', 'hotmail'].some(p => val.includes(p))) {
                    return {
                        agent: 'AURA B2B LEAD',
                        message: '<strong>Dominio Corporativo Detectado.</strong> Activando protocolo de prioridad institucional.',
                        icon: 'fa-building'
                    };
                }
                return null;
            },
            'destino': (val) => {
                const mountain = ['valle', 'nevado', 'portillo', 'farellones'].some(m => val.toLowerCase().includes(m));
                if (mountain) {
                    return {
                        agent: 'AURA SNOW CONCIERGE',
                        message: '<strong>Ruta de Alta Montaña.</strong> Sugerimos Van 4x4 con equipamiento de invierno incluido.',
                        icon: 'fa-snowflake'
                    };
                }
                return null;
            }
        };

        return adviceMap[fieldName] ? adviceMap[fieldName](fieldValue) : null;
    },

    /**
     * Final Lead Processing
     * Enriches the payload before transmission.
     */
    processLead: async function(formData) {
        const data = Object.fromEntries(formData.entries());
        
        return {
            final_payload: {
                ...data,
                _agent_verification: 'ZENITH-2026-ACTIVE',
                _risk_score: 0.02
            },
            agents_report: {
                transparency_audit: {
                    explanation: 'La solicitud ha sido procesada por la red de agentes AURA para optimizar la logística de ruta.'
                }
            }
        };
    }
};

// Initialize Agents when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    AuraAgents.initGeolocationIntelligence();
    AuraAgents.initEarlyBookingEngine();
    AuraAgents.initCityFlowTelemetry();
    AuraAgents.initDestinationTags();
});
