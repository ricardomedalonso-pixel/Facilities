export type CriticidadeNivel = 1 | 2 | 3 | 4 | 5; // C1 a C5
export type PrioridadeAlertaNivel = 0 | 1 | 2 | 3 | 4; // 4 = ESTOURADO, 3 = CRÍTICO, 2 = ATENÇÃO, 1 = NORMAL
export type StatusGerencial = 'Encerrado' | 'Em Atendimento' | 'Aberto' | 'Aguardando Peças' | 'Cancelado';
export type SLAGerencial = 'Dentro do SLA' | 'Fora do SLA' | 'Em aberto' | 'Sem classificação';
export type ReincidenteTipo = 'Sim' | 'Não';

export interface Incident {
  // Exact Power Query / Base Operacional Schema
  id_automatico: string; // "ID (automático)"
  id: string; // compatibility alias
  protocolo: string;
  data: string; // "Data" (YYYY-MM-DD)
  unidade: string; // "Unidade"
  cidade: string; // "Cidade"
  regiao: string; // "Região"
  solicitante: string; // "Solicitante"
  descricao_ocorrencia: string; // "Descrição da Ocorrência"
  descricao: string; // alias
  impacto_operacional: string; // "Impacto Operacional"
  sistema: string; // "Sistema"
  categoria: string; // alias
  criticidade: CriticidadeNivel; // "Criticidade" (1 a 5)
  faixa_criticidade: string; // "Faixa Criticidade" ("C1 - Crítica", "C2 - Alta", etc.)
  fornecedor: string; // "Fornecedor"
  acao_executada: string; // "Ação Executada"
  hora_abertura: string; // "Hora Abertura"
  hora_acionamento: string; // "Hora Acionamento"
  hora_normalizacao: string | null; // "Hora Normalização"
  data_hora_abertura: string; // "DataHoraAbertura"
  data_hora_acionamento: string; // "DataHoraAcionamento"
  data_hora_normalizacao: string | null; // "DataHoraNormalizacao"
  status: string; // "Status"
  status_gerencial: StatusGerencial; // "Status Gerencial"
  valor_spot: number; // "Valor SPOT"
  numero_manusis: string; // "Nº Manusis"
  mtta_min: number | null; // "MTTA (min)"
  mttr_h: number | null; // "MTTR (h)"
  sla: string; // "SLA" ("Dentro SLA", "Fora SLA", "Aberto")
  sla_gerencial: SLAGerencial; // "SLA Gerencial"
  semaforo_sla: string; // "Semáforo SLA"
  tempo_em_aberto_h: number | null; // "Tempo em Aberto (h)"
  alerta_sla: string; // "Alerta SLA" ("ESTOURADO...", "CRÍTICO...", "ATENÇÃO...", "NORMAL")
  prioridade_alerta: PrioridadeAlertaNivel; // "Prioridade Alerta" (4, 3, 2, 1, 0)
  causa_raiz: string; // "Causa Raiz"
  acao_preventiva: string; // "Ação Preventiva"
  responsavel_acompanhamento: string; // "Responsável Acompanhamento"
  reincidencia_30d: number; // "Reincidência 30d"
  reincidente: ReincidenteTipo; // "Reincidente" ("Sim", "Não")

  // Additional helper fields
  data_abertura?: string;
  data_fechamento?: string | null;
  equipamento_afetado: string;
  regional?: string;
  tipo_unidade?: string;
  tipo_manutencao?: string;
  prioridade?: string;
  sla_horas_limite?: number;
  tempo_resolucao_horas?: number | null;
  sla_status?: string;
  custo_estimado?: number;
  custo_real?: number;
  solicitante_cargo?: string;
  tecnico_responsavel?: string;
  // Campos do Modelo Padrão: Acionamento Central CW
  tipo_ativo_operacional?: 'HUB' | 'SOC' | 'FULL';
  hub_soc_full?: string; // Ex: "FULL - CD Cajamar" ou "HUB - Campinas"
  descricao_servico?: string; // Descrição do serviço para a Central
  urgencia?: string; // Ex: "Urgência: C1 - Crítico (4h)"
  contato_local?: string; // "SL/Líder: Ricardo Silva - (11) 98765-4321 - Turno 1"
  contato_mantenedora?: string; // "Cushman & Wakefield Plantão / Thorio"
  // Auditoria e Rastreabilidade de Usuário
  aberto_por_usuario?: string; // Ex: "Ricardo Alonso (ricardomedalonso@gmail.com)"
  aberto_por_email?: string;
  aberto_por_cargo?: string;
  data_hora_criacao?: string;
  atualizado_por_usuario?: string;
  atualizado_em?: string;
  historico?: {
    data: string;
    autor: string;
    acao: string;
  }[];
}

export interface FilterState {
  search: string;
  unidade: string;
  cidade: string;
  regiao: string;
  regional: string;
  categoria: string;
  sistema: string;
  criticidade: string;
  faixaCriticidade: string;
  statusGerencial: string;
  slaGerencial: string;
  reincidente: string;
  alertaSla: string;
  alertaNivel: string;
  fornecedor: string;
  prioridade: string;
  status: string;
  slaStatus: string;
  tipoManutencao: string;
  periodo: '7d' | '30d' | '90d' | 'all';
}

export interface DAXMeasure {
  id: string;
  nome: string;
  categoria: string;
  formula: string;
  descricao: string;
  formato: string;
}

export interface DocAsset {
  id: string;
  titulo: string;
  arquivo: string;
  descricao: string;
  linguagem: string;
  conteudo: string;
}

export interface PackageItem {
  arquivo: string;
  tipo: string;
  descricao: string;
  tamanhoAprox: string;
  obrigatorio: boolean;
  funcaoPowerBi: string;
}

export interface CentroDistribuicao {
  unidade: string; // Ex: "HUB-LPB-02"
  cnpj?: string;
  razao_social?: string;
  cep?: string;
  logradouro?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade: string;
  uf: string;
  regional: string;
  instalacao_eletrica?: string;
  instalacao_agua?: string;
  status_energia?: string;
  status_agua?: string;
  responsavel?: string;
  telefone?: string;
  email?: string;
  pendencias?: string;
  tipo_ativo?: 'HUB' | 'SOC' | 'FULL' | 'CD';
  status_regularizacao?: 'Regularizado' | 'Pendente Utilidades' | 'Pendente CNPJ' | 'Incompleto';
  // Auditoria de Cadastro
  cadastrado_por?: string;
  cadastrado_em?: string;
  atualizado_por?: string;
  atualizado_em?: string;
}

export interface AppUser {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  regional: string;
  role: 'admin' | 'gestor' | 'lider_sl' | 'analista' | 'central_cw' | 'operador';
  avatarColor: string;
  telefone?: string;
  loggedAt?: string;
  createdAt?: string;
  // Permissões / Seleção de CDs, HUBs e SOC para o usuário
  acessoTodos?: boolean; // Se tem acesso irrestrito a todas as unidades
  unidadesPermitidas?: string[]; // Lista de códigos das unidades vinculadas (ex: ['HUB-OSP-03', 'HUB-LSP-07', 'CD Cajamar'])
  tiposPermitidos?: ('HUB' | 'SOC' | 'FULL' | 'CD')[]; // Filtro por tipos de ativo permitidos
  totalChamados?: number; // Total histórico de chamados/ocorrências abertas
}

export type TipoAcaoAuditoria =
  | 'OS_ABERTURA'
  | 'OS_STATUS_EM_ANDAMENTO'
  | 'OS_STATUS_ENCERRADO'
  | 'OS_STATUS_CANCELADO'
  | 'OS_STATUS_ALTERADO'
  | 'OS_NOTA_ADICIONADA'
  | 'CADASTRO_CRIADO'
  | 'CADASTRO_ATUALIZADO'
  | 'CADASTRO_REMOVIDO'
  | 'USUARIO_CRIADO'
  | 'USUARIO_ATUALIZADO'
  | 'USUARIO_REMOVIDO'
  | 'EMAIL_ALERTA_ENVIADO'
  | 'LOGIN_EFETUADO'
  | 'LOGOUT_EFETUADO';

export interface RegistroAuditoria {
  id: string;
  timestamp: string; // ISO
  tipo: TipoAcaoAuditoria;
  usuarioNome: string;
  usuarioEmail: string;
  usuarioCargo: string;
  entidade: 'OS' | 'CADASTRO' | 'SISTEMA' | 'EMAIL' | 'USUARIO';
  entidadeId: string; // Ex: CONT-045, HUB-OSP-03, USR-001
  titulo: string;
  detalhes: string;
  valorAnterior?: string;
  valorNovo?: string;
}

export interface ProjectParameters {
  pCaminhoArquivo: string;
  nomePacoteOrigem: string;
  mimeTypePacote: string;
  arquivoExcel: string;
  abaExcel: string;
  arquivoPbixRecomendado: string;
  userEmail: string;
  devAppUrl: string;
  sharedAppUrl: string;
  localTime: string;
  model: string;
  mttaMetaMin: number;
  slaMetaPercent: number;
  reincidenciaDias: number;
  teamsChannel: string;
}

export interface EmailAlert {
  id: string;
  ticketId: string;
  protocolo: string;
  timestamp: string;
  recipient: string; // e.g. ricardomedalonso@gmail.com
  ccRecipients: string[];
  subject: string;
  status: 'Enviado' | 'Entregue' | 'Pendente';
  priority: string;
  criticidade: CriticidadeNivel;
  faixaCriticidade: string;
  unidade: string;
  equipamento: string;
  solicitante: string;
  descricao: string;
  slaHoras: number;
  prazoSlaEstimado: string;
  bodyPreview: string;
  htmlBody: string;
  sentAt: string;
  openedViaMailtoCount?: number;
  hub_soc_full?: string;
  descricao_servico?: string;
  urgencia?: string;
  contato_local?: string;
  contato_mantenedora?: string;
}
