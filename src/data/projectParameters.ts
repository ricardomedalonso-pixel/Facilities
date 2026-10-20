import { ProjectParameters, PackageItem } from '../types/facilities';

export const DEFAULT_PROJECT_PARAMETERS: ProjectParameters = {
  pCaminhoArquivo: 'C:\\PowerBI\\Base_Facilities_PowerBI.xlsx',
  nomePacoteOrigem: 'Pacote_PowerBI_Facilities_CCM (1).zip',
  mimeTypePacote: 'application/x-zip-compressed',
  arquivoExcel: 'Base_Facilities_PowerBI.xlsx',
  abaExcel: 'Base Operacional',
  arquivoPbixRecomendado: 'CCM_Facilities_Contingencias.pbix',
  userEmail: 'ricardomedalonso@gmail.com',
  devAppUrl: 'https://ais-dev-djpgqmw5m7nirbmkn4rotg-192872898274.us-east5.run.app',
  sharedAppUrl: 'https://ais-pre-djpgqmw5m7nirbmkn4rotg-192872898274.us-east5.run.app',
  localTime: '2026-09-29T13:40:06-07:00',
  model: 'models/gemini-3.8-flash',
  mttaMetaMin: 15,
  slaMetaPercent: 95.0,
  reincidenciaDias: 30,
  teamsChannel: '#facilities-emergencias'
};

export const PACKAGE_FILES_METADATA: PackageItem[] = [
  {
    arquivo: 'Base_Facilities_PowerBI.xlsx',
    tipo: 'Microsoft Excel (.xlsx)',
    descricao: 'Planilha contendo a aba "Base Operacional" com histórico de ocorrências, horários, MTTA/MTTR, criticidades C1-C5 e custos SPOT.',
    tamanhoAprox: '185 KB',
    obrigatorio: true,
    funcaoPowerBi: 'Fonte de dados primária carregada via Power Query M'
  },
  {
    arquivo: 'PowerQuery_FatoOcorrencias.m',
    tipo: 'Power Query M (.m)',
    descricao: 'Script M avançado de extração, tipagem pt-BR, ajuste de transição de meia-noite (24h) e criação de colunas de apoio gerencial.',
    tamanhoAprox: '4.8 KB',
    obrigatorio: true,
    funcaoPowerBi: 'Gera a tabela fato FatoOcorrencias com parâmetro pCaminhoArquivo'
  },
  {
    arquivo: 'Medidas_DAX.txt',
    tipo: 'Script DAX (.txt)',
    descricao: 'Código completo da tabela DimData (CALENDAR) e medidas executivas: Total Ocorrências, Aderência SLA %, MTTA, MTTR, SPOT e Rankings.',
    tamanhoAprox: '6.2 KB',
    obrigatorio: true,
    funcaoPowerBi: 'Cria DimData e todas as métricas analíticas e de semáforo'
  },
  {
    arquivo: 'Tema_Facilities_Shopee.json',
    tipo: 'JSON Theme (.json)',
    descricao: 'Tema visual do Power BI Desktop com as cores oficiais Shopee (#EE4D2D, #172554, #0EA5E9, #16A34A, #F59E0B, #DC2626).',
    tamanhoAprox: '1.2 KB',
    obrigatorio: false,
    funcaoPowerBi: 'Padronização visual automática dos gráficos, cartões e matrizes'
  },
  {
    arquivo: 'Layout_Relatorio.md',
    tipo: 'Markdown (.md)',
    descricao: 'Especificação técnica do layout do dashboard: cartões de KPIs executivos, matriz de fornecedores e segmentadores de dados.',
    tamanhoAprox: '3.4 KB',
    obrigatorio: false,
    funcaoPowerBi: 'Guia de montagem das abas no Power BI Desktop'
  },
  {
    arquivo: 'Automatizacao_PowerBI.md',
    tipo: 'Markdown (.md)',
    descricao: 'Arquitetura de atualização programada no Power BI Service, On-Premises Data Gateway e disparo de alertas automáticos via Power Automate.',
    tamanhoAprox: '3.8 KB',
    obrigatorio: false,
    funcaoPowerBi: 'Integração de alertas críticos no canal Teams #facilities-emergencias'
  },
  {
    arquivo: 'Checklist_Implantacao.txt',
    tipo: 'Texto (.txt)',
    descricao: 'Roteiro prático em 9 etapas consecutivas para subir o relatório do zero até publicação no Power BI Service.',
    tamanhoAprox: '1.5 KB',
    obrigatorio: false,
    funcaoPowerBi: 'Validação de etapas e garantia de conformidade de publicação'
  },
  {
    arquivo: 'Referencias_Microsoft.md',
    tipo: 'Markdown (.md)',
    descricao: 'Links e documentação oficial da Microsoft para configuração de Gateway corporativo, Alertas de Dados e integrações Power Automate.',
    tamanhoAprox: '1.1 KB',
    obrigatorio: false,
    funcaoPowerBi: 'Documentação de suporte técnico para administradores'
  }
];

export function generateCustomPowerQuery(customPath: string): string {
  const sanitizedPath = customPath.replace(/\\/g, '\\\\');
  return `let
    // Parâmetro configurado pelo usuário no portal
    pCaminhoArquivo = "${sanitizedPath}",

    Fonte = Excel.Workbook(File.Contents(pCaminhoArquivo), null, true),
    AbaBase = Fonte{[Item="Base Operacional",Kind="Sheet"]}[Data],
    Cabecalhos = Table.PromoteHeaders(AbaBase, [PromoteAllScalars=true]),

    // Remove linhas sem ID real de ocorrência
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
}
