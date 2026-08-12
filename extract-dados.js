import fetch from 'node-fetch';

const SUPABASE_URL = 'https://bmrdukmzlchggatgvwuc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtcmR1a216bGNoZ2dhdGd2d3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNjcxMDksImV4cCI6MjEwMTk0MzEwOX0.YK_qRkU4wmctOxDZ7IXVUFRnOeDU8-8a07_N61qE0ZE';

async function sbFetch(endpoint, options = {}) {
    const url = `${SUPABASE_URL}/rest/v1${endpoint}`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
            ...options.headers
        },
        ...options
    });

    if (!response.ok) {
        throw new Error(`Supabase error: ${response.statusText}`);
    }

    return response.json();
}

async function extrairWunderground(estacaoId, url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        
        // Extração simples de dados do HTML
        const tempMatch = html.match(/temperature['":\s]*([0-9.]+)/i);
        const humidMatch = html.match(/humidity['":\s]*([0-9.]+)/i);
        const precipMatch = html.match(/precip['":\s]*([0-9.]+)/i);

        return {
            estacao_id: estacaoId,
            temperatura: tempMatch ? parseFloat(tempMatch[1]) : null,
            umidade: humidMatch ? parseFloat(humidMatch[1]) : null,
            precipitacao: precipMatch ? parseFloat(precipMatch[1]) : null,
            data_medicao: new Date().toISOString()
        };
    } catch (error) {
        console.error(`Erro ao extrair Wunderground ${estacaoId}:`, error);
        return null;
    }
}

async function salvarDados(dados) {
    if (!dados || !dados.temperatura) return null;

    try {
        const result = await sbFetch('/dados_meteorologicos', {
            method: 'POST',
            body: JSON.stringify([dados])
        });
        return result;
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        return null;
    }
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Estações para extrair
        const estacoes = [
            { id: 'est_wund_isinim1', url: 'https://www.wunderground.com/dashboard/pws/ISINIM1' },
            { id: 'est_wund_ivennc40', url: 'https://www.wunderground.com/dashboard/pws/IVENNC40' }
        ];

        let sucessos = 0;
        let erros = 0;

        for (const est of estacoes) {
            const dados = await extrairWunderground(est.id, est.url);
            if (dados) {
                await salvarDados(dados);
                sucessos++;
            } else {
                erros++;
            }
        }

        return res.status(200).json({
            timestamp: new Date().toISOString(),
            sucessos,
            erros,
            status: erros === 0 ? 'sucesso' : 'parcial'
        });
    } catch (error) {
        console.error('Erro fatal:', error);
        return res.status(500).json({
            error: 'Falha na atualização',
            message: error.message
        });
    }
}
