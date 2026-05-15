/**
 * AURA AGENT ORCHESTRATOR — ZENITH PROTOCOL 2026
 * Central hub for MCP integration (HubSpot, WhatsApp, Google Maps)
 */

const AgentOrchestrator = {
    state: {
        lastSync: null,
        activeAgents: ['HubSpot-SCL', 'WhatsApp-Ops', 'Maps-Logistics'],
        isProcessing: false
    },

    /**
     * Institutional Handshake: Sycnc lead to HubSpot CRM
     * Uses phillipswdc/mcp-server-hubspot logic
     */
    async syncToHubSpot(leadData, division = 'general') {
        console.log('AURA [CRM]: Initiating institutional handshake via Composio...');
        this.notifyUI('Sincronizando con HubSpot CRM (Bridge API)...', 'blue');
        
        try {
            const response = await fetch('/api/aura-handshake', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    leadData, 
                    agentContext: { 
                        division,
                        tool: 'hubspot',
                        action: 'sync'
                    } 
                })
            });
            
            const result = await response.json();
            if (result.success) {
                console.log('AURA [CRM]: Lead successfully processed by Composio Agent.');
                this.notifyUI('Handshake HubSpot: EXITOSO', 'gold');
                return result;
            } else {
                throw new Error(result.error || 'Handshake failed');
            }
        } catch (error) {
            console.error('AURA [CRM] Error:', error.message);
            this.notifyUI('Error en Handshake HubSpot', 'ruby');
            return { status: 'error', message: error.message };
        }
    },

    /**
     * Operational Alert: Notify WhatsApp Ops Team
     * Uses delltrak/wamcp logic
     */
    async notifyWhatsApp(leadData, division = 'general') {
        console.log('AURA [COMMS]: Dispatching priority alert via Composio...');
        
        try {
            const response = await fetch('/api/aura-handshake', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    leadData, 
                    agentContext: { 
                        division,
                        tool: 'whatsapp',
                        action: 'notify'
                    } 
                })
            });
            
            const result = await response.json();
            if (result.success) {
                console.log('AURA [COMMS]: WhatsApp notification orchestrated by Composio Agent.');
                this.notifyUI('Notificación WhatsApp: ENVIADA', 'green');
                return result;
            } else {
                throw new Error(result.error || 'Notification failed');
            }
        } catch (error) {
            console.error('AURA [COMMS] Error:', error.message);
            this.notifyUI('Error en Notificación WhatsApp', 'ruby');
            return { status: 'error', message: error.message };
        }
    },

    /**
     * Institutional Analysis: Real-time intent detection
     * Triggered by 'oninput' on terminal forms
     */
    async analyze(division) {
        const form = document.querySelector('.terminal-form');
        const statusMsg = document.getElementById('agent-status-msg');
        if (!form || !statusMsg) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Intelligence Logic per Division
        let insight = "Analizando entrada de protocolo...";
        
        // 1. Check for global agent advice (AuraAgents 2026)
        if (window.AuraAgents) {
            // Check specific fields like email or destinations
            const emailAdvice = await window.AuraAgents.getLiveAdvice('email', data.email || '', data);
            if (emailAdvice) {
                insight = emailAdvice.message;
            } else {
                const destinationAdvice = await window.AuraAgents.getLiveAdvice('destino', data.destino || '', data);
                if (destinationAdvice) insight = destinationAdvice.message;
            }
        }

        // 2. Division-Specific Logic (Eventos)
        if (division === 'eventos') {
            const tipo = data.tipo_evento;
            const evento = data.evento;
            
            if (evento && evento.length > 5 && insight === "Analizando entrada de protocolo...") {
                insight = `Detectado evento: "${evento}". Verificando disponibilidad de flota VIP...`;
            }
            
            if (tipo === 'gala') {
                insight = "PROTOCOLO GALA: Sugerimos conductores con certificación 'Diplomatic Silver'.";
            } else if (tipo === 'congreso') {
                insight = "LOGÍSTICA CONGRESO: Optimizando rutas para múltiples vanes sincronizadas.";
            } else if (tipo === 'produccion') {
                insight = "PRODUCCIÓN: Activando protocolo de carga segura y discreción total.";
            }
        }

        // Update the Live Insight Panel
        statusMsg.innerHTML = insight; // Use innerHTML to support <strong> tags from agents
        statusMsg.style.color = 'var(--text-titanium)';
        
        // Trigger a pulse animation on the dot
        const dot = document.querySelector('.pulse-dot');
        if (dot) {
            dot.style.animation = 'none';
            dot.offsetHeight; // trigger reflow
            dot.style.animation = 'pulse-aura 1.5s infinite';
        }
    },

    /**
     * Total Autonomy: Orchestrate HubSpot + WhatsApp + Intelligence in one handshake
     */
    async triggerAgenticHandshake(leadData, division) {
        if (this.state.isProcessing) return;
        this.state.isProcessing = true;
        
        console.log(`\x1b[35m[ZENITH HANDSHAKE]\x1b[0m Starting autonomous workflow for ${division}...`);
        this.notifyUI(`Iniciando Protocolo Agéntico: ${division.toUpperCase()}`, 'gold');

        try {
            const response = await fetch('http://localhost:8000/api/aura-handshake', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadData: leadData,
                    agentContext: {
                        division: division,
                        timestamp: new Date().toISOString()
                    }
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.notifyUI('Handshake Exitoso: Sincronización Completa', 'gold');
                
                // Render Insight in Terminal
                const insight = document.getElementById('aura-insight-content');
                if (insight) {
                    const pricing = result.pricing || {};
                    insight.innerHTML = `
                        <div class="insight-status success">HANDSHAKE ACTIVADO</div>
                        <p style="font-size: 0.9em; opacity: 0.7; margin-bottom: 10px;">ID: ${result.lead_id}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                            <span>Tarifa Institucional:</span>
                            <span style="color: var(--aura-gold); font-size: 1.1em; font-weight: bold;">$${pricing.total?.toLocaleString('es-CL')}</span>
                        </div>
                        <div style="font-size: 0.85em; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 10px; margin-top: 10px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <span>Comisión AURA (25%):</span>
                                <span>$${pricing.comision_aura?.toLocaleString('es-CL')}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; color: #4ade80;">
                                <span>Pago Colaborador (75%):</span>
                                <span>$${pricing.neto_colaborador?.toLocaleString('es-CL')}</span>
                            </div>
                        </div>
                    `;
                }
            }
            
            this.state.isProcessing = false;
            this.state.lastSync = new Date();
            return result;

        } catch (error) {
            console.error('Handshake Error:', error);
            this.notifyUI('Error en Protocolo de Mano', 'ruby');
            this.state.isProcessing = false;
            return { success: false, error: error.message };
        }
    },

    /**
     * Logistical Precision: Calculate route via Google Maps
     * Uses cablate/mcp-google-map logic
     */
    async calculateAuraRoute(origin, destination) {
        if (!origin || !destination) return null;
        
        console.log(`AURA [LOGISTICS]: Calculating precision route: ${origin} -> ${destination}`);
        
        // Mocking Maps MCP response for UI feedback
        const routes = {
            'SCL': { 
                'Valle Nevado': { time: '90 min', km: '62' }, 
                'Portillo': { time: '120 min', km: '164' },
                'Casapiedra': { time: '20 min', km: '8' },
                'Espacio Riesco': { time: '25 min', km: '12' }
            }
        };

        const data = routes['SCL']?.[destination] || { time: 'Calculando...', km: '--' };
        
        this.notifyUI(`Ruta optimizada: ${data.time} (${data.km} km)`, 'cyan');
        return data;
    },

    /**
     * UI Feedback: Agentic Transparency Protocol
     */
    notifyUI(message, color) {
        const notifyEl = document.querySelector('.aura-notification-bar');
        const statusMsg = document.getElementById('agent-status-msg');

        // Update the status message in the terminal if it exists
        if (statusMsg) {
            statusMsg.innerText = message;
            statusMsg.style.color = `var(--aura-${color})`;
        }

        if (!notifyEl) return;

        const log = document.createElement('div');
        log.className = `aura-agent-log aura-log-${color}`;
        log.innerHTML = `
            <span class="aura-agent-id">[AGENT_ID: ${this.state.activeAgents[0]}]</span>
            <span class="aura-agent-msg">${message}</span>
        `;
        
        notifyEl.prepend(log);
        
        // Auto-remove after 5s
        setTimeout(() => log.classList.add('fade-out'), 5000);
        setTimeout(() => log.remove(), 6000);
    }
};

window.AgentOrchestrator = AgentOrchestrator;
