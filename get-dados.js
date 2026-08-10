import fetch from 'node-fetch';

const SUPABASE_URL = 'https://bmrdukmzlchggatgvwuc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtcmR1a216bGNoZ2dhdGd2d3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNjcxMDksImV4cCI6MjEwMTk0MzEwOX0.YK_qRkU4wmctOxDZ7IXVUFRnOeDU8-8a07_N61qE0ZE';

async function sbFetch(endpoint, options = {}) {
    const url = `${SUPABASE_URL}/rest/v1${endpoint}`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    });

    if (!response.ok) {
        throw new Error(`Supabase error: ${response.statusText}`);
    }

    return response.json();
}

export default async function handler(req, res) {
    // Permitir CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const { region } = req.query;

        // Definir estações por região
        const estacoesPorRegiao = {
            sinimbu: ['est_wund_isinim1', 'est_unisc_22', 'est_unisc_16', 'est_unisc_17'],
            'rio-pardinho': ['est_wund_isinim1', 'est_wund_ivennc40', 'est_unisc_22']
        };

        const estacoes = estacoesPorRegiao[region] || estacoesPorRegiao.sinimbu;

        // Buscar dados mais recentes de cada estação
        const dados = await sbFetch(
            `/dados_meteorologicos?estacao_id=in.(${estacoes.map(e => `"${e}"`).join(',')})&order=data_medicao.desc&limit=1`,
            { method: 'GET' }
        );

        return res.status(200).json({
            sucesso: true,
            dados: dados || [],
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        return res.status(500).json({
            sucesso: false,
            error: error.message
        });
    }
}
