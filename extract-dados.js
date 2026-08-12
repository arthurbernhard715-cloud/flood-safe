export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Simular extração de dados
  const resultado = {
    timestamp: new Date().toISOString(),
    sucessos: 2,
    erros: 0,
    status: 'sucesso',
    mensagem: 'Dados extraídos e salvos com sucesso'
  };

  return res.status(200).json(resultado);
}
