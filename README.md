# Dashboard de Controle de Temperatura - Câmaras Frias

Sistema de monitoramento em tempo real para controle de temperatura de câmaras frias com alertas e geração de relatórios em PDF.

## 🚀 Funcionalidades Principais

### 🎨 Design Moderno
- **Tema Dark**: Interface em preto, branco e roxo vibrante
- **Layout Responsivo**: Sidebar com lista de sensores e área principal de gráficos
- **Seleção Interativa**: Clique em qualquer sensor para visualizar seus gráficos detalhados

### 📊 Visualizações Avançadas
- **Gráfico em Tempo Real**: Últimas 100 medições condensadas em 30 pontos
- **Gráfico Semanal**: Dados da última semana com média de 30 pontos
- **Gráfico Mensal**: Dados do último mês com média de 30 pontos
- **Gráfico Pizza**: Porcentagem de tempo em cada status (Normal/Atenção/Crítico)

### 🚨 Sistema de Alertas
- **LEDs Indicadores**: Cores baseadas na temperatura:
  - 🟢 Verde: Normal (-15°C a -6°C)
  - 🟡 Amarelo: Atenção (-6°C a -2°C)  
  - 🔴 Vermelho: Crítico (acima de -2°C)
- **Alertas em Tempo Real**: Notificações visuais para temperaturas críticas

### 📄 Gerador de Relatórios PDF
- **Modal Configurável**: Pop-up para seleção de métricas e período
- **Períodos Disponíveis**: 1 mês, 3 meses ou 6 meses
- **Conteúdo Personalizável**:
  - Estatísticas resumidas (média, mín, máx por sensor)
  - Tabela completa de medições por timestamp
  - Seleção de sensores específicos
- **Formato Profissional**: PDF com tabelas organizadas e cores da marca

## 🛠️ Tecnologias

- **Next.js 16** - Framework React com Turbopack
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização com tema customizado
- **Recharts** - Gráficos interativos (linha e pizza)
- **jsPDF + autoTable** - Geração de relatórios PDF
- **Lucide React** - Ícones modernos

## 📊 Estrutura dos Sensores

O sistema simula 6 câmaras frias com dados históricos de 6 meses:
- **Câmara Fria 01** - Setor A (Carnes)
- **Câmara Fria 02** - Setor B (Laticínios)
- **Câmara Fria 03** - Setor C (Congelados)
- **Câmara Fria 04** - Setor D (Frutas)
- **Câmara Fria 05** - Setor E (Vegetais)
- **Câmara Fria 06** - Setor F (Bebidas)

## 🌡️ Faixas de Temperatura

- **Ideal**: -15°C a -6°C (Verde) - 70% de probabilidade
- **Atenção**: -6°C a -2°C (Amarelo) - 20% de probabilidade
- **Crítico**: Acima de -2°C (Vermelho) - 10% de probabilidade

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Acessar no navegador
http://localhost:3000
```

## 📱 Como Usar

1. **Visualizar Sensores**: Lista lateral mostra todos os sensores com status atual
2. **Selecionar Sensor**: Clique em qualquer sensor para ver seus gráficos detalhados
3. **Analisar Dados**: 
   - Gráfico em tempo real com últimas 100 medições
   - Histórico semanal e mensal
   - Distribuição de status em pizza
4. **Gerar Relatório**: 
   - Clique no botão "Gerar Relatório PDF"
   - Configure período e métricas desejadas
   - Selecione sensores específicos
   - Baixe o PDF gerado

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx              # Página principal
│   ├── layout.tsx            # Layout da aplicação
│   └── globals.css           # Estilos globais (tema roxo)
├── components/
│   ├── Dashboard.tsx         # Dashboard principal com layout lateral
│   ├── SensorList.tsx        # Lista lateral de sensores
│   ├── TemperatureChart.tsx  # Gráficos de linha
│   ├── StatusPieChart.tsx    # Gráfico de pizza para status
│   ├── StatusLED.tsx         # LED indicador de status
│   └── ReportGenerator.tsx   # Modal e geração de PDF
├── hooks/
│   └── useTemperatureData.ts # Hook com dados estendidos (6 meses)
├── types/
│   └── temperature.ts        # Tipos TypeScript
└── utils/
    └── temperatureUtils.ts   # Utilitários para temperatura
```

## 🔄 Atualizações em Tempo Real

- **Intervalo**: Dados atualizados a cada 30 segundos
- **Simulação Realista**: Variações de temperatura baseadas em probabilidades
- **Histórico Dinâmico**: Mantém últimas 100 leituras por sensor
- **Status Automático**: Cálculo automático de status baseado na temperatura

## 📊 Relatórios PDF

### Conteúdo Disponível:
- **Estatísticas**: Temperatura média, mínima, máxima e total de leituras
- **Tabela Completa**: Timestamp na primeira coluna, sensores nas demais
- **Períodos**: 1, 3 ou 6 meses de dados históricos
- **Seleção Flexível**: Escolha quais sensores incluir

### Formato do Relatório:
- **Header**: Título, período e data de geração
- **Resumo**: Tabela com estatísticas por sensor
- **Dados**: Tabela cronológica com todas as medições
- **Cores da Marca**: Roxo vibrante nos cabeçalhos

## 🎯 Próximos Passos

Quando o backend estiver pronto:

1. **Integração API**: Substituir dados mockados por endpoints reais
2. **WebSocket**: Atualizações em tempo real via WebSocket
3. **Autenticação**: Sistema de login e permissões
4. **Alertas**: Notificações por email/SMS para temperaturas críticas
5. **Histórico**: Persistência de dados em banco de dados
6. **Configurações**: Personalização de faixas de temperatura por sensor

## 🔌 Endpoints Futuros

```
GET /api/sensors                    # Lista de sensores
GET /api/sensors/{id}/readings      # Leituras históricas
GET /api/sensors/{id}/current       # Leitura atual
GET /api/sensors/{id}/stats         # Estatísticas do sensor
POST /api/reports                   # Geração de relatórios
WebSocket /ws/sensors               # Atualizações em tempo real
```

## 🎨 Tema Visual

- **Cor Primária**: #8b5cf6 (Roxo vibrante)
- **Cor Secundária**: #7c3aed (Roxo escuro)
- **Fundo**: #000000 (Preto)
- **Texto**: #ffffff (Branco)
- **Cards**: #1f2937 (Cinza escuro)
- **Bordas**: #374151 (Cinza médio)
