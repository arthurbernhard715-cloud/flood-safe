/**
 * Flood Safe - Backend API
 * Responsável por extrair dados das fontes e atualizar Supabase
 * 
 * Deploy no Vercel como Edge Function
 */

const SUPABASE_URL = 'https://bmrdukmzlchggatgvwuc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtcmR1a216bGNoZ2dhdGd2d3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNjcxMDksImV4cCI6MjEwMTk0MzEwOX0.YK_qRkU4wmctOxDZ7IXVUFRnOeDU8-8a07_N61qE0ZE';

// Helper para fazer requisições ao Supabase
async function sbFetch(endpoint, options = {}) {
    const url = `${SUPABASE_URL}/rest/v1${endpoint}`;
    const headers = {
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        ...options.headers
    };

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (!response.ok) {
        throw new Error(`Supabase error: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Função para extrair dados do Wunderground
 * Nota: Isso requer scraping do HTML ou uso de API oficial
 */
async function extrairWunderground(idEstacao, urlFonte) {
    try {
        const response = await fetch(urlFonte);
        const html = await response.text();
        
        // Procurar dados no HTML
        const tempMatch = html.match(/temperature['":\s]+([0-9.]+)/i);
        const humidMatch = html.match(/humidity['":\s]+([0-9.]+)/i);
        const precipMatch = html.match(/precip['":\s]+([0-9.]+)/i);

        return {
            idEstacao,
            temperatura: tempMatch ? parseFloat(tempMatch[1]) : null,
            umidade: humidMatch ? parseFloat(humidMatch[1]) : null,
            precipitacao: precipMatch ? parseFloat(precipMatch[1]) : null,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error(`Erro ao extrair Wunderground ${idEstacao}:`, error);
        return null;
    }
}

/**
 * Função para extrair dados da UNISC
 */
async function extrairUNISC(idEstacao, urlFonte) {
    try {
        const response = await fetch(urlFonte);
        const html = await response.text();
        
        // Procurar dados no HTML da UNISC
        const tempMatch = html.match(/temperatura['":\s]+([0-9.]+)/i);
        const chuvaMatch = html.match(/chuva['":\s]+([0-9.]+)/i);
        const umidMatch = html.match(/umidade['":\s]+([0-9.]+)/i);

        return {
            idEstacao,
            temperatura: tempMatch ? parseFloat(tempMatch[1]) : null,
            precipitacao: chuvaMatch ? parseFloat(chuvaMatch[1]) : null,
            umidade: umidMatch ? parseFloat(umidMatch[1]) : null,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error(`Erro ao extrair UNISC ${idEstacao}:`, error);
        return null;
    }
}

/**
 * Função para extrair nível do rio (Defesa Civil)
 */
async function extrairDefesaCivil(idEstacao, urlFonte) {
    try {
        const response = await fetch(urlFonte);
        const html = await response.text();
        
        // Procurar nível no HTML
        const nivelMatch = html.match(/n[ií]vel['":\s]+([0-9.,]+)/i);

        return {
            idEstacao,
            nivelMetros: nivelMatch ? parseFloat(nivelMatch[1].replace(',', '.')) : null,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error(`Erro ao extrair Defesa Civil ${idEstacao}:`, error);
        return null;
    }
}

/**
 * Determinar status do rio baseado no nível
 */
function determinarStatusRio(nivelMetros) {
    if (nivelMetros < 1.3) return 'normal';
    if (nivelMetros < 1.5) return 'atencao';
    if (nivelMetros < 1.7) return 'alerta';
    return 'emergencia';
}

/**
 * Salvar dados no Supabase
 */
async function salvarDadosMeteorologicos(estacaoId, dados) {
    if (!dados || !dados.temperatura) return null;

    const payload = {
        estacao_id: estacaoId,
        temperatura: dados.temperatura,
        umidade: dados.umidade,
        precipitacao: dados.precipitacao,
        pressao: dados.pressao,
        data_medicao: dados.timestamp
    };

    return sbFetch('/dados_meteorologicos', {
        method: 'POST',
        body: JSON.stringify([payload])
    });
}

async function salvarNivelRio(estacaoId, dados) {
    if (!dados || !dados.nivelMetros) return null;

    const status = determinarStatusRio(dados.nivelMetros);

    const payload = {
        estacao_id: estacaoId,
        nivel_metros: dados.nivelMetros,
        status: status,
        data_medicao: dados.timestamp
    };

    return sbFetch('/nivel_rio', {
        method: 'POST',
        body: JSON.stringify([payload])
    });
}

/**
 * Criar alerta se necessário
 */
async function criarAlertaSENecessario(estacaoId, nivelMetros) {
    const status = determinarStatusRio(nivelMetros);
    
    if (['alerta', 'emergencia'].includes(status)) {
        const payload = {
            estacao_id: estacaoId,
            tipo_alerta: 'nivel_rio_critico',
            mensagem: `Nível do rio em ${nivelMetros}m - Status: ${status.toUpperCase()}`,
            severidade: status === 'emergencia' ? 'critica' : 'alta',
            data_alerta: new Date().toISOString()
        };

        return sbFetch('/alertas', {
            method: 'POST',
            body: JSON.stringify([payload])
        });
    }

    return null;
}

/**
 * Função principal - atualizar todos os dados
 */
export async function atualizarDados() {
    console.log('🌊 Flood Safe - Iniciando atualização de dados');

    const estacoes = [
        { id: 'est_wund_isinim1', tipo: 'wunderground', url: 'https://www.wunderground.com/dashboard/pws/ISINIM1' },
        { id: 'est_wund_ivennc40', tipo: 'wunderground', url: 'https://www.wunderground.com/dashboard/pws/IVENNC40' },
        { id: 'est_unisc_22', tipo: 'unisc', url: 'https://online.unisc.br/tempo2/22' },
        { id: 'est_unisc_16', tipo: 'unisc', url: 'https://online.unisc.br/tempo2/16' },
        { id: 'est_unisc_17', tipo: 'unisc', url: 'https://online.unisc.br/tempo2/17' },
        { id: 'est_rio_dcrs', tipo: 'defesa_civil', url: 'https://redehidrometeorologica.defesacivil.rs.gov.br/Estacao/DCRS-00029' }
    ];

    let sucessos = 0;
    let erros = 0;

    for (const est of estacoes) {
        try {
            let dados = null;

            if (est.tipo === 'wunderground') {
                dados = await extrairWunderground(est.id, est.url);
                if (dados) {
                    await salvarDadosMeteorologicos(est.id, dados);
                    sucessos++;
                }
            } else if (est.tipo === 'unisc') {
                dados = await extrairUNISC(est.id, est.url);
                if (dados) {
                    await salvarDadosMeteorologicos(est.id, dados);
                    sucessos++;
                }
            } else if (est.tipo === 'defesa_civil') {
                dados = await extrairDefesaCivil(est.id, est.url);
                if (dados) {
                    await salvarNivelRio(est.id, dados);
                    await criarAlertaSENecessario(est.id, dados.nivelMetros);
                    sucessos++;
                }
            }
        } catch (error) {
            console.error(`Erro ao processar estação ${est.id}:`, error);
            erros++;
        }
    }

    console.log(`✅ Atualização concluída: ${sucessos} sucessos, ${erros} erros`);
    
    return {
        timestamp: new Date().toISOString(),
        sucessos,
        erros,
        status: erros === 0 ? 'sucesso' : 'parcial'
    };
}

/**
 * Vercel Edge Function Handler
 */
export default async function handler(req, res) {
    // Apenas POST aceito
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const resultado = await atualizarDados();
        return res.status(200).json(resultado);
    } catch (error) {
        console.error('Erro fatal:', error);
        return res.status(500).json({
            error: 'Falha na atualização',
            message: error.message
        });
    }
}

/**
 * Cron Job Configuration
 * Adicione isso no vercel.json:
 * 
 * {
 *   "crons": [{
 *     "path": "/api/update-dados",
 *     "schedule": "*/5 * * * *"
 *   }]
 * }
 */
