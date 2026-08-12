export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Dados mock para teste
  const mockDados = {
    sinimbu: [
      {
        id: 1,
        estacao_id: 'est_wund_isinim1',
        temperatura: 23.5,
        umidade: 75,
        precipitacao: 12.3,
        data_medicao: new Date().toISOString()
      }
    ],
    'rio-pardinho': [
      {
        id: 1,
        estacao_id: 'est_wund_isinim1',
        temperatura: 23.5,
        umidade: 75,
        precipitacao: 12.3,
        data_medicao: new Date().toISOString()
      }
    ]
  };

  const region = req.query.region || 'sinimbu';
  const dados = mockDados[region] || mockDados.sinimbu;

  return res.status(200).json({
    sucesso: true,
    dados: dados,
    timestamp: new Date().toISOString()
  });
}
