import { DAXMeasure, DocAsset } from '../types/facilities';

export const OFFICIAL_USER_POWER_QUERY = `let
    // Ajuste apenas este parâmetro para o caminho definitivo do arquivo Excel.
    pCaminhoArquivo = "C:\\PowerBI\\Base_Facilities_PowerBI.xlsx",

    Fonte = Excel.Workbook(File.Contents(pCaminhoArquivo), null, true),
    AbaBase = Fonte{[Item="Base Operacional",Kind="Sheet"]}[Data],
    Cabecalhos = Table.PromoteHeaders(AbaBase, [PromoteAllScalars=true]),

    // Remove linhas sem ID real de ocorrência.
    LinhasValidas = Table.SelectRows(
        Cabecalhos,
        each [#"ID (automático)"] <> null and Text.Trim(Text.From([#"ID (automático)"])) <> ""
    ),

    Tipos = Table.TransformColumnTypes(LinhasValidas,{
        {"ID (automático)", type text},
        {"Data", type date},
        {"Unidade", type text},
        {"Cidade", type text},
        {"Região", type text},
        {"Solicitante", type text},
        {"Descrição da Ocorrência", type text},
        {"Impacto Operacional", type text},
        {"Sistema", type text},
        {"Criticidade", Int64.Type},
        {"Fornecedor", type text},
        {"Ação Executada", type text},
        {"Hora Abertura", type time},
        {"Hora Acionamento", type time},
        {"Hora Normalização", type time},
        {"Status", type text},
        {"Valor SPOT", Currency.Type},
        {"Nº Manusis", type text},
        {"MTTA (min)", type number},
        {"MTTR (h)", type number},
        {"SLA", type text},
        {"Semáforo SLA", type text},
        {"Tempo em Aberto (h)", type number},
        {"Alerta SLA", type text},
        {"Causa Raiz", type text},
        {"Ação Preventiva", type text},
        {"Responsável Acompanhamento", type text},
        {"Reincidência 30d", Int64.Type}
    }, "pt-BR"),

    DataHoraAbertura = Table.AddColumn(Tipos, "DataHoraAbertura", each
        if [Data] = null or [Hora Abertura] = null then null
        else #datetime(
            Date.Year([Data]), Date.Month([Data]), Date.Day([Data]),
            Time.Hour([Hora Abertura]), Time.Minute([Hora Abertura]), Time.Second([Hora Abertura])
        ), type datetime),

    DataHoraAcionamento = Table.AddColumn(DataHoraAbertura, "DataHoraAcionamento", each
        if [Data] = null or [Hora Acionamento] = null then null
        else
            let
                dtBase = #datetime(
                    Date.Year([Data]), Date.Month([Data]), Date.Day([Data]),
                    Time.Hour([Hora Acionamento]), Time.Minute([Hora Acionamento]), Time.Second([Hora Acionamento])
                ),
                dtFinal = if [DataHoraAbertura] <> null and dtBase < [DataHoraAbertura]
                          then DateTime.From(dtBase + #duration(1,0,0,0))
                          else dtBase
            in dtFinal, type datetime),

    DataHoraNormalizacao = Table.AddColumn(DataHoraAcionamento, "DataHoraNormalizacao", each
        if [Data] = null or [Hora Normalização] = null then null
        else
            let
                dtBase = #datetime(
                    Date.Year([Data]), Date.Month([Data]), Date.Day([Data]),
                    Time.Hour([Hora Normalização]), Time.Minute([Hora Normalização]), Time.Second([Hora Normalização])
                ),
                referencia = if [DataHoraAcionamento] <> null then [DataHoraAcionamento] else [DataHoraAbertura],
                dtFinal = if referencia <> null and dtBase < referencia
                          then DateTime.From(dtBase + #duration(1,0,0,0))
                          else dtBase
            in dtFinal, type datetime),

    FaixaCriticidade = Table.AddColumn(DataHoraNormalizacao, "Faixa Criticidade", each
        if [Criticidade] = 1 then "C1 - Crítica"
        else if [Criticidade] = 2 then "C2 - Alta"
        else if [Criticidade] = 3 then "C3 - Média"
        else if [Criticidade] = 4 then "C4 - Baixa"
        else if [Criticidade] = 5 then "C5 - Muito Baixa"
        else "Não classificada", type text),

    StatusGerencial = Table.AddColumn(FaixaCriticidade, "Status Gerencial", each
        if [Status] = "Encerrado" then "Encerrado"
        else if [Status] = "Em Atendimento" then "Em Atendimento"
        else "Aberto", type text),

    SLAStatusGerencial = Table.AddColumn(StatusGerencial, "SLA Gerencial", each
        if [SLA] = "Fora SLA" then "Fora do SLA"
        else if [SLA] = "Dentro SLA" then "Dentro do SLA"
        else if [SLA] = "Aberto" then "Em aberto"
        else "Sem classificação", type text),

    ReincidenteFlag = Table.AddColumn(SLAStatusGerencial, "Reincidente", each
        if [#"Reincidência 30d"] <> null and [#"Reincidência 30d"] >= 1 then "Sim" else "Não", type text),

    AlertaPrioridade = Table.AddColumn(ReincidenteFlag, "Prioridade Alerta", each
        if [Alerta SLA] = null then 0
        else if Text.StartsWith([Alerta SLA], "ESTOURADO") then 4
        else if Text.StartsWith([Alerta SLA], "CRÍTICO") then 3
        else if Text.StartsWith([Alerta SLA], "ATENÇÃO") then 2
        else 1, Int64.Type),

    Resultado = Table.SelectColumns(AlertaPrioridade,{
        "ID (automático)","Data","Unidade","Cidade","Região","Solicitante",
        "Descrição da Ocorrência","Impacto Operacional","Sistema","Criticidade",
        "Faixa Criticidade","Fornecedor","Ação Executada","Hora Abertura",
        "Hora Acionamento","Hora Normalização","DataHoraAbertura","DataHoraAcionamento",
        "DataHoraNormalizacao","Status","Status Gerencial","Valor SPOT","Nº Manusis",
        "MTTA (min)","MTTR (h)","SLA","SLA Gerencial","Semáforo SLA",
        "Tempo em Aberto (h)","Alerta SLA","Prioridade Alerta","Causa Raiz",
        "Ação Preventiva","Responsável Acompanhamento","Reincidência 30d","Reincidente"
    })
in
    Resultado`;

export const OFFICIAL_USER_DAX = `// ===== TABELA CALENDÁRIO =====
DimData =
ADDCOLUMNS(
    CALENDAR(MIN(FatoOcorrencias[Data]), MAX(FatoOcorrencias[Data])),
    "Ano", YEAR([Date]),
    "MesNum", MONTH([Date]),
    "Mes", FORMAT([Date], "mmm"),
    "MesAno", FORMAT([Date], "mmm/yyyy"),
    "AnoMes", YEAR([Date]) * 100 + MONTH([Date]),
    "Trimestre", "T" & FORMAT([Date], "Q"),
    "DiaSemana", FORMAT([Date], "ddd")
)

// Depois de criar DimData:
// 1) Classifique DimData[Mes] por DimData[MesNum]
// 2) Classifique DimData[MesAno] por DimData[AnoMes]
// 3) Relacione DimData[Date] (1) -> FatoOcorrencias[Data] (*)

// ===== MEDIDAS EXECUTIVAS =====
Total Ocorrencias =
COUNTROWS(FatoOcorrencias)

Encerradas =
CALCULATE(
    [Total Ocorrencias],
    FatoOcorrencias[Status Gerencial] = "Encerrado"
)

Em Aberto Atendimento =
CALCULATE(
    [Total Ocorrencias],
    FatoOcorrencias[Status Gerencial] <> "Encerrado"
)

Dentro SLA =
CALCULATE(
    [Total Ocorrencias],
    FatoOcorrencias[SLA Gerencial] = "Dentro do SLA"
)

Fora SLA =
CALCULATE(
    [Total Ocorrencias],
    FatoOcorrencias[SLA Gerencial] = "Fora do SLA"
)

Aderencia SLA % =
DIVIDE(
    [Dentro SLA],
    [Dentro SLA] + [Fora SLA]
)

MTTA Medio min =
AVERAGEX(
    FILTER(FatoOcorrencias, NOT ISBLANK(FatoOcorrencias[MTTA (min)])),
    FatoOcorrencias[MTTA (min)]
)

MTTR Medio h =
AVERAGEX(
    FILTER(FatoOcorrencias, NOT ISBLANK(FatoOcorrencias[MTTR (h)])),
    FatoOcorrencias[MTTR (h)]
)

SPOT Total =
SUM(FatoOcorrencias[Valor SPOT])

Ticket Medio SPOT =
DIVIDE(
    [SPOT Total],
    CALCULATE(
        [Total Ocorrencias],
        FatoOcorrencias[Valor SPOT] > 0
    )
)

Reincidentes 30d =
CALCULATE(
    [Total Ocorrencias],
    FatoOcorrencias[Reincidente] = "Sim"
)

Taxa Reincidencia % =
DIVIDE([Reincidentes 30d], [Total Ocorrencias])

Alertas SLA =
CALCULATE(
    [Total Ocorrencias],
    FatoOcorrencias[Prioridade Alerta] >= 2,
    FatoOcorrencias[Status Gerencial] <> "Encerrado"
)

SLA Estourado =
CALCULATE(
    [Total Ocorrencias],
    FatoOcorrencias[Prioridade Alerta] = 4,
    FatoOcorrencias[Status Gerencial] <> "Encerrado"
)

Criticos C1 C2 =
CALCULATE(
    [Total Ocorrencias],
    FatoOcorrencias[Criticidade] <= 2
)

Ocorrencias C1 =
CALCULATE(
    [Total Ocorrencias],
    FatoOcorrencias[Criticidade] = 1
)

Ocorrencias C2 =
CALCULATE(
    [Total Ocorrencias],
    FatoOcorrencias[Criticidade] = 2
)

Fornecedores Acionados =
DISTINCTCOUNT(FatoOcorrencias[Fornecedor])

Unidades Afetadas =
DISTINCTCOUNT(FatoOcorrencias[Unidade])

Regioes Afetadas =
DISTINCTCOUNT(FatoOcorrencias[Região])

// ===== INDICADORES DE GESTÃO =====
% Encerradas =
DIVIDE([Encerradas], [Total Ocorrencias])

% Em Aberto =
DIVIDE([Em Aberto Atendimento], [Total Ocorrencias])

% Criticos C1 C2 =
DIVIDE([Criticos C1 C2], [Total Ocorrencias])

MTTA Meta Status =
VAR Meta = 15
RETURN IF([MTTA Medio min] <= Meta, "Dentro da Meta", "Acima da Meta")

SLA Cor =
SWITCH(
    TRUE(),
    [Aderencia SLA %] >= 0.95, "#16A34A",
    [Aderencia SLA %] >= 0.90, "#F59E0B",
    "#DC2626"
)

Alerta Cor =
SWITCH(
    TRUE(),
    [SLA Estourado] > 0, "#DC2626",
    [Alertas SLA] > 0, "#F59E0B",
    "#16A34A"
)

// ===== TENDÊNCIA =====
Ocorrencias Mes Anterior =
CALCULATE(
    [Total Ocorrencias],
    DATEADD(DimData[Date], -1, MONTH)
)

Variacao Ocorrencias % =
DIVIDE(
    [Total Ocorrencias] - [Ocorrencias Mes Anterior],
    [Ocorrencias Mes Anterior]
)

MTTR Mes Anterior =
CALCULATE(
    [MTTR Medio h],
    DATEADD(DimData[Date], -1, MONTH)
)

Variacao MTTR % =
DIVIDE(
    [MTTR Medio h] - [MTTR Mes Anterior],
    [MTTR Mes Anterior]
)

// ===== RANKING =====
Rank Unidade Volume =
RANKX(
    ALLSELECTED(FatoOcorrencias[Unidade]),
    [Total Ocorrencias],
    ,
    DESC,
    DENSE
)

Rank Fornecedor Fora SLA =
RANKX(
    ALLSELECTED(FatoOcorrencias[Fornecedor]),
    [Fora SLA],
    ,
    DESC,
    DENSE
)`;

export const THEME_JSON = {
  name: "Facilities Shopee Executive",
  dataColors: [
    "#EE4D2D",
    "#172554",
    "#0EA5E9",
    "#16A34A",
    "#F59E0B",
    "#DC2626",
    "#7C3AED",
    "#64748B"
  ],
  background: "#F8FAFC",
  foreground: "#0F172A",
  tableAccent: "#EE4D2D",
  visualStyles: {
    "*": {
      "*": {
        title: [
          {
            show: true,
            fontFamily: "Segoe UI",
            fontSize: 12,
            fontColor: {
              solid: {
                color: "#172554"
              }
            }
          }
        ],
        background: [
          {
            show: true,
            color: {
              solid: {
                color: "#FFFFFF"
              }
            },
            transparency: 0
          }
        ]
      }
    }
  }
};

export const README_MD = `# Pacote Power BI — Facilities / CCM

Este pacote foi preparado a partir da planilha de contingências.

## Arquivos
- \`Base_Facilities_PowerBI.xlsx\`: base operacional e dashboard Excel existente.
- \`PowerQuery_FatoOcorrencias.m\`: consulta Power Query para criar a fato principal.
- \`Medidas_DAX.txt\`: calendário e medidas de gestão.
- \`Tema_Facilities_Shopee.json\`: tema visual importável no Power BI.
- \`Layout_Relatorio.md\`: especificação das páginas e visuais.
- \`Automatizacao_PowerBI.md\`: configuração de atualização agendada e alertas.
- \`Checklist_Implantacao.txt\`: sequência prática de implantação.

## Resultado esperado
Modelo em estrela simples:
- DimData -> FatoOcorrencias
- Demais filtros podem começar como atributos da própria fato e virar dimensões separadas conforme o volume crescer.

## Nome recomendado do arquivo Power BI
\`CCM_Facilities_Contingencias.pbix\`

## Observação importante
Este ambiente não gera um arquivo \`.pbix\` nativo do Power BI Desktop. O pacote contém os componentes prontos para montar o PBIX de forma rápida e padronizada.`;

export const REFERENCIAS_MICROSOFT_MD = `# Referências oficiais Microsoft

- Atualização de Excel local / Gateway:
  https://learn.microsoft.com/en-us/power-bi/connect-data/refresh-excel-file-local-drive

- Atualização agendada:
  https://learn.microsoft.com/pt-br/power-bi/connect-data/refresh-scheduled-refresh

- Gerenciamento de fonte e gateway:
  https://learn.microsoft.com/en-us/power-bi/connect-data/service-gateway-enterprise-manage-scheduled-refresh

- Alertas de dados:
  https://learn.microsoft.com/pt-br/power-bi/create-reports/service-set-data-alerts

- Integração de alertas com Power Automate:
  https://learn.microsoft.com/pt-br/power-bi/collaborate-share/office-integration/service-flow-integration`;

export const DOC_ASSETS: DocAsset[] = [
  {
    id: 'readme',
    titulo: 'Pacote Power BI — Facilities / CCM',
    arquivo: 'README.md',
    linguagem: 'markdown',
    descricao: 'Apresentação oficial do pacote de contingências CCM e recomendação do arquivo PBIX.',
    conteudo: README_MD
  },
  {
    id: 'powerquery-m',
    titulo: 'Power Query M (Fato Principal)',
    arquivo: 'PowerQuery_FatoOcorrencias.m',
    linguagem: 'powerquery',
    descricao: 'Script M oficial de tratamento da aba Base Operacional com tratamento de virada de dia e colunas calculadas.',
    conteudo: OFFICIAL_USER_POWER_QUERY
  },
  {
    id: 'medidas-dax',
    titulo: 'Medidas DAX & DimData',
    arquivo: 'Medidas_DAX.txt',
    linguagem: 'dax',
    descricao: 'Código DAX completo incluindo Tabela Calendário (DimData), Medidas Executivas, Indicadores de Gestão, Tendências e Rankings.',
    conteudo: OFFICIAL_USER_DAX
  },
  {
    id: 'tema-shopee',
    titulo: 'Tema Visual Shopee Executive',
    arquivo: 'Tema_Facilities_Shopee.json',
    linguagem: 'json',
    descricao: 'Tema oficial do Power BI Desktop com paleta Shopee (#EE4D2D, #172554, #0EA5E9, #16A34A).',
    conteudo: JSON.stringify(THEME_JSON, null, 2)
  },
  {
    id: 'referencias',
    titulo: 'Referências Oficiais Microsoft',
    arquivo: 'Referencias_Microsoft.md',
    linguagem: 'markdown',
    descricao: 'Links oficiais da documentação Microsoft para Gateway, Agendamento e Power Automate.',
    conteudo: REFERENCIAS_MICROSOFT_MD
  },
  {
    id: 'layout-relatorio',
    titulo: 'Layout do Relatório Power BI',
    arquivo: 'Layout_Relatorio.md',
    linguagem: 'markdown',
    descricao: 'Especificação técnica da arquitetura visual e organização dos cartões executivos.',
    conteudo: `# Layout do Relatório - CCM Facilities Contingências

## Visão Geral Executiva
- PBIX Recomendado: \`CCM_Facilities_Contingencias.pbix\`
- Tema Aplicado: \`Facilities Shopee Executive\`
- Tabela Fato: \`FatoOcorrencias\` alimentada pela \`Base Operacional\` via \`PowerQuery_FatoOcorrencias.m\`
- Tabela Calendário: \`DimData\` (1:N com \`FatoOcorrencias[Data]\`)`
  },
  {
    id: 'checklist',
    titulo: 'Checklist de Implantação',
    arquivo: 'Checklist_Implantacao.txt',
    linguagem: 'text',
    descricao: 'Sequência prática de implantação do pacote no Power BI Service e Desktop.',
    conteudo: `CHECKLIST DE IMPLANTAÇÃO - CCM FACILITIES CONTINGÊNCIAS
[✓] 01. Apontar parâmetro pCaminhoArquivo para "C:\\PowerBI\\Base_Facilities_PowerBI.xlsx"
[✓] 02. Carregar consulta FatoOcorrencias da aba "Base Operacional"
[✓] 03. Criar tabela DimData com CALENDAR(MIN(FatoOcorrencias[Data]), MAX(FatoOcorrencias[Data]))
[✓] 04. Classificar DimData[Mes] por DimData[MesNum]
[✓] 05. Classificar DimData[MesAno] por DimData[AnoMes]
[✓] 06. Criar relacionamento 1 -> * entre DimData[Date] e FatoOcorrencias[Data]
[✓] 07. Importar Tema_Facilities_Shopee.json
[✓] 08. Inserir todas as medidas do arquivo Medidas_DAX.txt
[✓] 09. Salvar como CCM_Facilities_Contingencias.pbix`
  }
];

export const DAX_MEASURES: DAXMeasure[] = [
  {
    id: 'dax-total',
    nome: 'Total Ocorrencias',
    categoria: 'Medidas Executivas',
    formula: `Total Ocorrencias = COUNTROWS(FatoOcorrencias)`,
    descricao: 'Contagem total de registros de chamados na tabela fato.',
    formato: '#,##0'
  },
  {
    id: 'dax-encerradas',
    nome: 'Encerradas',
    categoria: 'Medidas Executivas',
    formula: `Encerradas = CALCULATE([Total Ocorrencias], FatoOcorrencias[Status Gerencial] = "Encerrado")`,
    descricao: 'Total de ocorrências já encerradas no sistema.',
    formato: '#,##0'
  },
  {
    id: 'dax-aberto',
    nome: 'Em Aberto Atendimento',
    categoria: 'Medidas Executivas',
    formula: `Em Aberto Atendimento = CALCULATE([Total Ocorrencias], FatoOcorrencias[Status Gerencial] <> "Encerrado")`,
    descricao: 'Backlog ativo de ocorrências pendentes.',
    formato: '#,##0'
  },
  {
    id: 'dax-aderencia',
    nome: 'Aderencia SLA %',
    categoria: 'Medidas Executivas',
    formula: `Aderencia SLA % = DIVIDE([Dentro SLA], [Dentro SLA] + [Fora SLA])`,
    descricao: 'Taxa de aderência ao SLA contratual.',
    formato: '0.0%'
  },
  {
    id: 'dax-mtta',
    nome: 'MTTA Medio min',
    categoria: 'Performance & Tempos',
    formula: `MTTA Medio min = AVERAGEX(FILTER(FatoOcorrencias, NOT ISBLANK(FatoOcorrencias[MTTA (min)])), FatoOcorrencias[MTTA (min)])`,
    descricao: 'Tempo Médio de Atendimento inicial em minutos (Meta: 15 min).',
    formato: '0.0 "min"'
  },
  {
    id: 'dax-mttr',
    nome: 'MTTR Medio h',
    categoria: 'Performance & Tempos',
    formula: `MTTR Medio h = AVERAGEX(FILTER(FatoOcorrencias, NOT ISBLANK(FatoOcorrencias[MTTR (h)])), FatoOcorrencias[MTTR (h)])`,
    descricao: 'Tempo Médio de Reparo da abertura até normalização em horas.',
    formato: '0.0 "h"'
  },
  {
    id: 'dax-spot',
    nome: 'SPOT Total',
    categoria: 'Financeiro SPOT',
    formula: `SPOT Total = SUM(FatoOcorrencias[Valor SPOT])`,
    descricao: 'Soma total dos valores despendidos em contratações SPOT.',
    formato: 'R$ #,##0.00'
  },
  {
    id: 'dax-ticket-spot',
    nome: 'Ticket Medio SPOT',
    categoria: 'Financeiro SPOT',
    formula: `Ticket Medio SPOT = DIVIDE([SPOT Total], CALCULATE([Total Ocorrencias], FatoOcorrencias[Valor SPOT] > 0))`,
    descricao: 'Valor médio por chamado com contratação SPOT.',
    formato: 'R$ #,##0.00'
  }
];
