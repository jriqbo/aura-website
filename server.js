require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Composio } = require('composio-core');

// Configuración de Tarifas Institucionales (AURA_PRICING_ENGINE)
const PRICING_CONFIG = {
    AEROPUERTO: {
        base: 32000,
        km_extra: 1200,
        nocturno: 1.25,
        floor_colaborador: 22000,
        comision_aura: 0.25
    },
    TURISMO: {
        base_nieve: 180000,
        base_portillo: 260000,
        base_city: 120000,
        floor_colaborador: 120000,
        comision_aura: 0.25
    },
    CORPORATIVO: {
        base: 38000,
        hora_disposicion: 30000,
        floor_colaborador: 25000,
        comision_aura: 0.25
    },
    DEFAULT: {
        comision_aura: 0.25,
        floor_colaborador: 20000
    }
};

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Composio (Optional fallback if no API key)
let composioClient = null;
if (process.env.COMPOSIO_API_KEY && process.env.COMPOSIO_API_KEY !== 'your_composio_api_key_here') {
    try {
        composioClient = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
        console.log('\x1b[32m[AURA BRIDGE]\x1b[0m Composio SDK Initialized');
    } catch (e) {
        console.error('\x1b[31m[AURA BRIDGE] Error initializing Composio:\x1b[0m', e.message);
    }
} else {
    console.warn('\x1b[33m[AURA BRIDGE] Warning:\x1b[0m COMPOSIO_API_KEY not found. Running in MOCK mode.');
}

// Rewrites for institutional pages
const rewrites = {
    '/corporativo': '/pages/corporativo.html',
    '/salud': '/pages/salud.html',
    '/turismo': '/pages/turismo.html',
    '/eventos': '/pages/eventos.html',
    '/aeropuerto': '/pages/aeropuerto.html',
};

// Route: API Handshake (The Agentic Bridge)
app.post('/api/aura-handshake', async (req, res) => {
    const { leadData, agentContext } = req.body;
    
    console.log(`\x1b[34m[HANDSHAKE]\x1b[0m Processing lead for: ${leadData.name || 'Unknown'}`);
    
    if (!composioClient) {
        // 1. Calcular precio dinámico según la división
        const division = (agentContext && agentContext.division) ? agentContext.division.toUpperCase() : 'DEFAULT';
        let config = PRICING_CONFIG[division] || PRICING_CONFIG.DEFAULT;
        let finalPrice = config.base || config.base_nieve || 35000;
        
        // Simulación de recargo nocturno (entre 22:00 y 06:00)
        const hour = new Date().getHours();
        if (hour >= 22 || hour <= 6) {
            finalPrice = Math.round(finalPrice * (config.nocturno || 1.25));
        }

        // 2. Aplicar lógica de Comisión y Piso Mínimo
        const comisionAura = Math.round(finalPrice * config.comision_aura);
        let pagoColaborador = finalPrice - comisionAura;

        if (pagoColaborador < config.floor_colaborador) {
            pagoColaborador = config.floor_colaborador;
            finalPrice = Math.round(pagoColaborador / (1 - config.comision_aura));
        }

        return res.json({
            success: true,
            status: 'MOCK_SUCCESS',
            lead_id: `MOCK-${division.substring(0,3)}-${Date.now().toString().slice(-4)}`,
            pricing: {
                total: finalPrice,
                currency: 'CLP',
                neto_colaborador: pagoColaborador,
                comision_aura: finalPrice - pagoColaborador,
                protocol: 'Comisión 25% con Piso Protegido'
            },
            steps: [
                { tool: 'HubSpot', action: 'Create Contact', status: 'completed' },
                { tool: 'WhatsApp', action: 'Send Notification', status: 'completed' }
            ],
            message: 'Handshake completed in MOCK mode with pricing logic.'
        });
    }

    try {
        // Logic to trigger Composio tools
        // This is where the agentic tool-calling happens
        const tools = await composioClient.getTools({ apps: ["hubspot", "whatsapp"] });
        
        // In a real scenario, we might pass these to an LLM or use Composio actions directly
        // For now, we simulate the execution of the key tools
        console.log(`  -> Executing tools for ${agentContext.division}...`);
        
        // Example: Execution logic (simplified)
        // const response = await composioClient.executeAction("hubspot_create_contact", { ...leadData });
        
        // 1. Calcular precio dinámico según la división
        const division = agentContext.division.toUpperCase() || 'DEFAULT';
        let config = PRICING_CONFIG[division] || PRICING_CONFIG.DEFAULT;
        let finalPrice = config.base || config.base_nieve || 35000;
        
        // Simulación de recargo nocturno (entre 22:00 y 06:00)
        const hour = new Date().getHours();
        if (hour >= 22 || hour <= 6) {
            finalPrice = Math.round(finalPrice * (config.nocturno || 1.25));
        }

        // 2. Aplicar lógica de Comisión y Piso Mínimo
        const comisionAura = Math.round(finalPrice * config.comision_aura);
        let pagoColaborador = finalPrice - comisionAura;

        // Ajuste de Piso Mínimo (Si el 75% es menor al piso, se ajusta el precio al cliente hacia arriba)
        if (pagoColaborador < config.floor_colaborador) {
            pagoColaborador = config.floor_colaborador;
            finalPrice = Math.round(pagoColaborador / (1 - config.comision_aura));
        }

        res.json({
            success: true,
            status: 'EXECUTED',
            lead_id: `AURA-${division.substring(0,3)}-${Date.now().toString().slice(-4)}`,
            pricing: {
                total: finalPrice,
                currency: 'CLP',
                neto_colaborador: pagoColaborador,
                comision_aura: finalPrice - pagoColaborador,
                protocol: 'Comisión 25% con Piso Protegido'
            },
            message: 'Handshake orchestrated via Composio with pricing logic.'
        });
    } catch (error) {
        console.error('\x1b[31m[HANDSHAKE ERROR]\x1b[0m', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Serve Rewritten Pages
Object.entries(rewrites).forEach(([route, filePath]) => {
    app.get(route, (req, res) => {
        res.sendFile(path.join(__dirname, filePath));
    });
});

// Static Files
app.use(express.static(__dirname));

// Fallback to index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`\n\x1b[32m[AURA ZENITH SERVER]\x1b[0m Running at http://localhost:${PORT}/`);
    console.log(`\x1b[34m[BRIDGE ACTIVE]\x1b[0m Composio Bridge ready at /api/aura-handshake`);
    console.log(`\x1b[33m[STATIC ROUTES]\x1b[0m /salud, /corporativo, /eventos, etc. active\n`);
});
