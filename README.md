# 🌊 Flood Safe

**Sistema Inteligente de Monitoramento de Enchentes para Sinimbu/RS**

---

## 📋 O que é?

Flood Safe é uma plataforma que centraliza dados de 6 estações meteorológicas e do nível do rio em um único dashboard, permitindo:

- 📊 **Monitoramento em tempo real** de temperatura, umidade, chuva e nível do rio
- 📈 **Histórico de dados** dos últimos 30+ dias
- 🗺️ **Mapa interativo** com localização das estações
- 🔔 **Alertas automáticos** quando o rio sobe (futuro)
- 💰 **Sistema de pagamento** por usuário (futuro)

---

## 🎯 Estações Incluídas

1. **Sinimbu - ISINIM1** (Wunderground)
2. **Venâncio Aires - IVENNC40** (Wunderground)
3. **UNISC Campus - Estação 22** (UNISC)
4. **UNISC Campus - Estação 16** (UNISC)
5. **UNISC Campus - Estação 17** (UNISC)
6. **Rio Pardinho - DCRS-00029** (Defesa Civil)

---

## 🚀 Início Rápido

### 1️⃣ Preparar o Banco de Dados (5 min)

```bash
# Acesse https://supabase.com/dashboard
# Selecione seu projeto
# Vá em SQL Editor
# Cole o arquivo database_schema.txt
# Clique "Run"
```

### 2️⃣ Fazer Upload no GitHub (3 min)

```bash
git clone https://github.com/SEU_USER/flood-safe.git
cd flood-safe
cp /caminho/dos/arquivos/* .
git add .
git commit -m "Initial commit"
git push origin main
```

### 3️⃣ Deploy no Vercel (5 min)

```
1. Acesse https://vercel.com/dashboard
2. Clique "Add New Project"
3. Selecione seu repo flood-safe
4. Clique "Deploy"
5. Pronto! Seu site está no ar!
```

---

## 📁 Estrutura dos Arquivos

```
flood-safe/
├── index.html              # Dashboard visual (design dark mode)
├── database_schema.txt     # Script SQL para criar tabelas
├── api-backend.js          # Backend para extrair dados
├── vercel.json             # Configuração do Vercel
├── package.json            # Dependências Node.js
├── PASSO_A_PASSO.txt       # Guia detalhado (LEIA PRIMEIRO!)
└── README.md               # Este arquivo
```

---

## 📊 Dashboard Features

### Cards Principais
- **Temperatura Média**: Média de todas as 6 estações
- **Precipitação 24h**: Acumulado de chuva
- **Nível do Rio**: Status em tempo real (Normal/Atenção/Alerta/Emergência)
- **Estações Ativas**: Quantas estão conectadas
- **Umidade Média**: Média geral
- **Alertas Ativos**: Contagem de alertas

### Gráfico Interativo
- Últimos 7 dias
- Temperatura (linha azul)
- Precipitação (linha verde)

### Mapa
- 6 estações com marcadores
- Cores diferentes por status
- Popup com informações

### Botões de Ação
- 📥 Exportar Dados (em breve)
- 📊 Comparar Períodos (em breve)
- 🔮 Previsão 48h (em breve)
- 🔔 Alertas WhatsApp (em breve)

---

## 🎨 Design

**Tema:** Dark Mode Elegante
**Cores principais:**
- Neon Cyan: `#06B6D4` (destaque)
- Verde: `#10B981` (positivo)
- Amarelo: `#F59E0B` (alerta)
- Vermelho: `#EF4444` (crítico)

**Responsivo:** Funciona em desktop, tablet e mobile

---

## 🔧 Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript Vanilla
- **Gráficos:** Chart.js
- **Mapas:** Leaflet + OpenStreetMap
- **Backend:** Node.js
- **Banco:** Supabase (PostgreSQL)
- **Hospedagem:** Vercel
- **CI/CD:** Git + GitHub

---

## 💾 Dados Atuais vs. Histórico

### Agora (Teste)
- Dados **fake** (para testar a interface)
- Atualiza ao recarregar a página
- Sem conexão com Supabase

### Depois (Real)
- Dados **reais** das 6 estações
- Atualiza a cada **5 minutos** (cron job)
- Histórico desde **2023** no Supabase
- Alertas automáticos quando necessário

---

## 🔐 Segurança

- ✅ RLS (Row Level Security) habilitado no Supabase
- ✅ Dados públicos são acessíveis sem autenticação
- ✅ Dados sensíveis protegidos por policies
- ✅ APIs de terceiros (Wunderground, UNISC) validadas
- ✅ Sem chaves secretas expostas no frontend

---

## 💰 Custos

### Atual (Gratuito)
- Vercel: R$ 0/mês
- Supabase: R$ 0/mês (free tier)
- Domínio: R$ 0 (vercel.app)
- **Total: R$ 0/mês**

### Com 500 Usuários Pagos (R$ 19,90/mês)
- Faturamento: R$ 9.950/mês
- Supabase (premium): ~R$ 25/mês
- Vercel (premium): ~R$ 20/mês
- Stripe/PagSeg (1.5%): ~R$ 150/mês
- **Total custo: ~R$ 195/mês**
- **Lucro: ~R$ 9.755/mês** (após impostos MEI ~8%)

---

## 📈 Roadmap

### ✅ Fase 1 (Agora)
- [x] Dashboard público
- [x] Dados de 6 estações
- [x] Design dark mode
- [x] Responsivo

### 🔄 Fase 2 (Próximas semanas)
- [ ] Sistema de Login
- [ ] Integração com Supabase real
- [ ] Cron jobs (atualização a cada 5 min)
- [ ] Histórico desde 2023

### 💰 Fase 3 (Próximos meses)
- [ ] Sistema de Pagamento (Stripe)
- [ ] Planos (Grátis/Premium)
- [ ] Alertas por Email
- [ ] Download de dados (CSV/Excel)
- [ ] Previsão 48h (com ML)
- [ ] API pública para terceiros

### 🚀 Fase 4 (Futuro)
- [ ] App mobile (iOS/Android)
- [ ] Integração com Defesa Civil
- [ ] Análise histórica comparativa
- [ ] Relatórios automáticos
- [ ] Webhooks para integrações

---

## 🐛 Troubleshooting

### ❌ Site em branco
**Solução:** Abra F12 (DevTools) → Console → veja mensagens de erro

### ❌ Gráfico/Mapa não aparece
**Solução:** Aguarde 3 segundos para carregar, recarregue a página

### ❌ Dados não atualizam
**Solução:** Isso é esperado agora (dados são fake). Depois será automático.

### ❌ Erro "Cannot read properties"
**Solução:** Limpe cache do navegador (Ctrl+Shift+Del)

---

## 📞 Suporte

**Projeto:** Flood Safe
**Autor:** Arthur
**Email:** contatososajudaai@gmail.com
**GitHub:** [seu-username]/flood-safe

---

## 📄 Licença

MIT License - Use livremente!

---

## 🙏 Agradecimentos

- Wunderground (dados meteorológicos)
- UNISC (estações meteorológicas)
- Defesa Civil RS (nível de rio)
- OpenStreetMap (mapas)
- Vercel (hospedagem)
- Supabase (banco de dados)

---

## 🎯 Próximo Passo

👉 **Leia o arquivo `PASSO_A_PASSO.txt` para instruções detalhadas de deploy!**

---

**Última atualização:** August 10, 2026
**Versão:** 1.0.0 - Beta
