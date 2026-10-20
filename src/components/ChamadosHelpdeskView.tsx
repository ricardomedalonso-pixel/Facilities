import React, { useState, useMemo } from 'react';
import {
  PlusCircle,
  Mail,
  Send,
  Clock,
  AlertTriangle,
  Building2,
  Wrench,
  CheckCircle2,
  Search,
  Filter,
  FileText,
  User,
  Phone,
  Paperclip,
  Eye,
  RotateCcw,
  ShieldCheck,
  Flame,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  Inbox,
  Copy,
  Check,
  Share2,
  AlertOctagon,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import {
  Incident,
  CriticidadeNivel,
  PrioridadeAlertaNivel,
  ReincidenteTipo,
  EmailAlert,
  AppUser
} from '../types/facilities';
import {
  CADASTRO_CDS,
  CADASTRO_FULL,
  CADASTRO_SOC,
  CADASTRO_HUB,
  CADASTRO_CDS_ALFABETICO,
  MACRO_REGIOES,
  CDS_E_SOCS_POR_REGIAO,
  HUBS_POR_REGIAO,
  getMacroRegion
} from '../data/cadastrosCDs';
import { SISTEMAS_LISTA, FORNECEDORES_LISTA } from '../data/mockFacilitiesData';
import {
  DEFAULT_ALERT_EMAIL,
  DEFAULT_CC_EMAILS,
  getSlaHoursByCriticidade,
  generateEmailHtml,
  generateEmailPlainText,
  generateCentralCwAcionamentoText,
  createMailtoUrl
} from '../utils/emailTemplateGenerator';

interface ChamadosHelpdeskViewProps {
  incidents: Incident[];
  onSaveNewTicket: (incident: Incident, alertEmail: string, ccEmails: string[]) => void;
  onSelectIncident: (incident: Incident) => void;
  onOpenEmailPreview: (incident: Incident, record?: EmailAlert) => void;
  emailAlerts: EmailAlert[];
  currentUser?: AppUser | null;
}

export const ChamadosHelpdeskView: React.FC<ChamadosHelpdeskViewProps> = ({
  incidents,
  onSaveNewTicket,
  onSelectIncident,
  onOpenEmailPreview,
  emailAlerts,
  currentUser
}) => {
  const [subTab, setSubTab] = useState<'abertura' | 'chamados' | 'alertas'>('abertura');

  // Modelo Oficial Central CW: HUB/SOC/FULL
  const [tipoAtivo, setTipoAtivo] = useState<'SOC' | 'HUB'>('SOC');
  const [selectedUnitCode, setSelectedUnitCode] = useState('SOC-SP06');
  const [cidade, setCidade] = useState('São Paulo');
  const [regiao, setRegiao] = useState('São Paulo (Sudeste)');
  const [customUnitDetail, setCustomUnitDetail] = useState('');
  const [filtroRegiaoHelpdesk, setFiltroRegiaoHelpdesk] = useState<string>('TODAS');

  // 1. HUB/SOC/FULL
  const computedHubSocFull = useMemo(() => {
    if (customUnitDetail.trim()) {
      return customUnitDetail.trim().startsWith(tipoAtivo)
        ? customUnitDetail.trim()
        : `${tipoAtivo} - ${customUnitDetail.trim()}`;
    }
    if (selectedUnitCode.startsWith(`${tipoAtivo} -`)) {
      return selectedUnitCode;
    }
    if (selectedUnitCode.startsWith(`${tipoAtivo}-`)) {
      return selectedUnitCode;
    }
    return `${tipoAtivo} - ${selectedUnitCode}`;
  }, [tipoAtivo, selectedUnitCode, customUnitDetail]);

  // 2. Descrição do serviço
  const [descricaoServico, setDescricaoServico] = useState(
    'Niveladora hidráulica da Doca 14 travada em desnível com vazamento de fluido. Impede atracamento seguro de carretas na rota de interior. Necessário desobstrução, substituição de gaxeta e sangria do circuito.'
  );

  // 3. Urgência
  const [criticidade, setCriticidade] = useState<CriticidadeNivel>(1);

  // 4. Contato local: SL/Líder
  const [contatoLocal, setContatoLocal] = useState('Ricardo Alonso (Líder SL Noite) - (11) 98765-4321 / Rádio Ch. 04');

  // 5. Contato mantenedora/SPOT
  const [contatoMantenedora, setContatoMantenedora] = useState('Cushman & Wakefield Plantão 24h / DocaTech Soluções - Eng. Marcos (11) 91234-5678');

  // Campos técnicos complementares
  const [sistema, setSistema] = useState('Docas / Niveladoras');
  const [equipamento, setEquipamento] = useState('Niveladora Hidráulica Doca 14');
  const [impacto, setImpacto] = useState('Gargalo Crítico de Expedição - Caminhões aguardando');
  const [fornecedor, setFornecedor] = useState('DocaTech Soluções');
  const [acaoImediata, setAcaoImediata] = useState('Doca 14 isolada com cones e fita zebrada. Cargas redirecionadas para a doca 16.');
  const [anexoSimulado, setAnexoSimulado] = useState('evidencia_doca14_travada.jpg');

  // Configurações de Envio de E-mail
  const [targetEmail, setTargetEmail] = useState(DEFAULT_ALERT_EMAIL);
  const [ccEmailsInput, setCcEmailsInput] = useState(DEFAULT_CC_EMAILS.join(', '));
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filtros na listagem
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const slaHours = getSlaHoursByCriticidade(criticidade);

  const urgenciaTextoFormatted = useMemo(() => {
    switch (criticidade) {
      case 1:
        return 'C1 - Emergência Crítica (SLA 4h) - Risco operacional/Parada imediata';
      case 2:
        return 'C2 - Alta (SLA 12h) - Impacto direto na expedição/capacidade';
      case 3:
        return 'C3 - Média (SLA 24h) - Operação com contingência acionada';
      case 4:
        return 'C4 - Baixa (SLA 48h) - Manutenção corretiva rotineira';
      case 5:
        return 'C5 - Programada (SLA 72h) - Preventiva / Sem risco iminente';
      default:
        return `C${criticidade} - SLA ${slaHours}h`;
    }
  }, [criticidade, slaHours]);

  // Texto oficial gerado em tempo real no modelo exato
  const liveCwTemplateText = useMemo(() => {
    return `Informações organizadas e facilitar o atendimento pela Central. 🚨

🚨 ACIONAMENTO CENTRAL CW

HUB/SOC/FULL:
${computedHubSocFull}

Descrição do serviço:
${descricaoServico}

Urgência: 
${urgenciaTextoFormatted}

Contato local: SL/Líder:
${contatoLocal}

Contato mantenedora/SPOT:
${contatoMantenedora}`;
  }, [computedHubSocFull, descricaoServico, urgenciaTextoFormatted, contatoLocal, contatoMantenedora]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyCwTemplate = () => {
    navigator.clipboard.writeText(liveCwTemplateText);
    setCopiedTemplate(true);
    showNotification('Modelo Padrão Central CW copiado para a área de transferência!');
    setTimeout(() => setCopiedTemplate(false), 2500);
  };

  const handleUnitSelect = (val: string) => {
    setSelectedUnitCode(val);
    const found = CADASTRO_CDS.find((c) => c.unidade === val || `${c.unidade} - ${c.cidade}/${c.uf}` === val);
    if (found) {
      setCidade(found.cidade);
      const macro = getMacroRegion(found.regional, found.uf, found.cidade);
      setRegiao(macro);
      if (found.responsavel) {
        const tel = found.telefone ? ` - ${found.telefone}` : '';
        const em = found.email ? ` / ${found.email}` : '';
        setContatoLocal(`${found.responsavel}${tel}${em}`);
      }
    }
  };

  // Preenchimentos Rápidos baseados em ocorrências reais da Central CW
  const applyQuickExample = (ex: 'soc_pe' | 'soc_sp' | 'hub_nfu') => {
    if (ex === 'soc_pe') {
      setTipoAtivo('SOC');
      setSelectedUnitCode('SOC-PE-04');
      setCidade('Jaboatão dos Guararapes');
      setRegiao('Nordeste');
      setCustomUnitDetail('');
      setSistema('Climatização');
      setEquipamento('Chiller / Ar Condicionado Central');
      setCriticidade(1);
      setDescricaoServico('Falha no circuito elétrico do chiller central, alarme recorrente de sobretensão. Climatização inoperante no galpão de triagem.');
      setContatoLocal('Chris Macedo (SL Líder Operações) - (81) 98765-4304');
      setContatoMantenedora('Cushman & Wakefield Plantão 24h / GPS Facilities - Tel (81) 98111-2233');
      setAcaoImediata('Isolada a área de circulação e acionados exaustores axiais de contingência.');
      setFornecedor('GPS');
    } else if (ex === 'soc_sp') {
      setTipoAtivo('SOC');
      setSelectedUnitCode('SOC-SP06');
      setCidade('São Paulo');
      setRegiao('São Paulo (Sudeste)');
      setCustomUnitDetail('');
      setSistema('Elétrico');
      setEquipamento('Quadro Geral de Baixa Tensão (QGBT)');
      setCriticidade(2);
      setDescricaoServico('Queda de energia externa da concessionária. Gerador operando normalmente, necessário medição de carga e rearme programado.');
      setContatoLocal('Gustavo Oliveira (Líder SL Turno Noite) - (11) 99123-8901');
      setContatoMantenedora('Cushman & Wakefield Emergência Elétrica / Thorio - Tel (11) 97766-5544');
      setAcaoImediata('Gerador acionado automaticamente. Medições de carga realizadas no QGBT.');
      setFornecedor('Thorio');
    } else if (ex === 'hub_nfu') {
      setTipoAtivo('HUB');
      setSelectedUnitCode('HUB-NFU-02');
      setCidade('Nova Friburgo');
      setRegiao('Minas Gerais');
      setCustomUnitDetail('');
      setSistema('Elétrico');
      setEquipamento('Grupo Gerador Diesel');
      setCriticidade(4);
      setDescricaoServico('Gerador gera alarmes recorrentes, liga e desliga com baixa tensão intermitente. Necessário agendar preventiva.');
      setContatoLocal('Daniela Domingues (Analista Operações / SL) - (22) 99876-5432');
      setContatoMantenedora('Cushman & Wakefield Manutenção / Tecnogera - Tel (21) 98888-7777');
      setAcaoImediata('Registrada OM 240551 no Manusis e alinhada vistoria técnica.');
      setFornecedor('Tecnogera');
    }
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricaoServico.trim()) return;

    const randNum = Math.floor(100 + Math.random() * 900);
    const idAuto = `CONT-${randNum}`;
    const manusis = `OM ${Math.floor(250000 + Math.random() * 5000)}`;
    const nowIso = new Date().toISOString();
    const todayYmd = nowIso.slice(0, 10);
    const nowTime = nowIso.slice(11, 19);

    const faixaCrit =
      criticidade === 1
        ? 'C1 - Crítica'
        : criticidade === 2
        ? 'C2 - Alta'
        : criticidade === 3
        ? 'C3 - Média'
        : criticidade === 4
        ? 'C4 - Baixa'
        : 'C5 - Muito Baixa';

    let prioridadeAlertaNum: PrioridadeAlertaNivel = 1;
    if (criticidade === 1) prioridadeAlertaNum = 4;
    else if (criticidade === 2) prioridadeAlertaNum = 3;
    else if (criticidade === 3) prioridadeAlertaNum = 2;

    const ccList = ccEmailsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newTicket: Incident = {
      id_automatico: idAuto,
      id: idAuto,
      protocolo: `SHO-FAC-${randNum}`,
      data: todayYmd,
      unidade: selectedUnitCode,
      cidade,
      regiao,
      solicitante: contatoLocal,
      descricao_ocorrencia: descricaoServico,
      descricao: descricaoServico,
      impacto_operacional: impacto,
      sistema,
      categoria: sistema,
      criticidade,
      faixa_criticidade: faixaCrit,
      fornecedor: contatoMantenedora.split('/')[0]?.trim() || fornecedor,
      acao_executada: acaoImediata || 'Acionamento Central CW realizado.',
      hora_abertura: nowTime,
      hora_acionamento: nowTime,
      hora_normalizacao: null,
      data_hora_abertura: nowIso,
      data_hora_acionamento: nowIso,
      data_hora_normalizacao: null,
      status: 'Aberto',
      status_gerencial: 'Aberto',
      valor_spot: criticidade === 1 ? 4500 : 1800,
      numero_manusis: manusis,
      mtta_min: 8,
      mttr_h: null,
      sla: 'Aberto',
      sla_gerencial: 'Em aberto',
      semaforo_sla: criticidade === 1 ? 'Vermelho' : 'Amarelo',
      tempo_em_aberto_h: 0.1,
      alerta_sla: criticidade === 1 ? 'CRÍTICO - Acionamento Imediato C&W' : 'ATENÇÃO - Em monitoramento',
      prioridade_alerta: prioridadeAlertaNum,
      causa_raiz: 'Em investigação técnica pela mantenedora acionada.',
      acao_preventiva: 'Inspeção preventiva agendada pós-reparo.',
      responsavel_acompanhamento: contatoLocal.split('(')[0]?.trim() || 'SL Local',
      reincidencia_30d: 0,
      reincidente: 'Não',
      equipamento_afetado: equipamento || sistema,

      // Modelo Central CW Fields
      tipo_ativo_operacional: tipoAtivo,
      hub_soc_full: computedHubSocFull,
      descricao_servico: descricaoServico,
      urgencia: urgenciaTextoFormatted,
      contato_local: contatoLocal,
      contato_mantenedora: contatoMantenedora,
      aberto_por_usuario: currentUser ? `${currentUser.nome} (${currentUser.email})` : contatoLocal,
      aberto_por_email: currentUser?.email || 'facilities@shopee.com',
      aberto_por_cargo: currentUser?.cargo || 'Solicitante Local',
      data_hora_criacao: nowIso,

      historico: [
        {
          data: nowIso,
          autor: currentUser ? `${currentUser.nome} (${currentUser.cargo})` : contatoLocal.split('-')[0]?.trim() || 'SL Local',
          acao: `Acionamento Central CW registrado por ${currentUser ? currentUser.nome : 'SL Local'} para ${computedHubSocFull}. Notificação automática enviada para ${targetEmail}.`
        }
      ]
    };

    onSaveNewTicket(newTicket, targetEmail, ccList);
    showNotification(`Chamado ${newTicket.protocolo} aberto e notificação enviada para ${targetEmail}!`);
    setSubTab('chamados');
  };

  const filteredTickets = useMemo(() => {
    return incidents.filter((item) => {
      if (statusFilter !== 'Todos' && item.status_gerencial !== statusFilter) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return (
          item.protocolo.toLowerCase().includes(q) ||
          item.unidade.toLowerCase().includes(q) ||
          (item.hub_soc_full && item.hub_soc_full.toLowerCase().includes(q)) ||
          item.descricao.toLowerCase().includes(q) ||
          (item.descricao_servico && item.descricao_servico.toLowerCase().includes(q)) ||
          (item.contato_local && item.contato_local.toLowerCase().includes(q)) ||
          item.equipamento_afetado.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [incidents, statusFilter, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b1329] text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-500/50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-[#0b1329] via-[#172554] to-[#1e1b4b] rounded-2xl p-6 text-white shadow-xl border border-blue-900/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#EE4D2D]/15 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#EE4D2D] text-white text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
                <span>🚨 ACIONAMENTO CENTRAL CW</span>
              </span>
              <span className="text-amber-300 text-xs font-mono font-medium">
                Modelo Oficial de Facilities &amp; CCM
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>Abertura de Chamados com Alerta por E-mail</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Informações organizadas e facilitar o atendimento pela Central. Ao submeter a solicitação, 
              o alerta estruturado no padrão <strong>HUB/SOC/FULL</strong> é despachado automaticamente para 
              <span className="text-amber-300 font-mono font-bold ml-1">{targetEmail}</span> e equipes de plantão C&amp;W.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
              <span className="text-[10px] text-blue-200 uppercase font-semibold block">Total Ativos</span>
              <span className="text-xl font-bold text-white">{incidents.length}</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">Sincronizado</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
              <span className="text-[10px] text-blue-200 uppercase font-semibold block">Críticos C1/C2</span>
              <span className="text-xl font-bold text-amber-400">
                {incidents.filter((i) => i.criticidade <= 2 && i.status_gerencial !== 'Encerrado').length}
              </span>
              <span className="text-[10px] text-amber-300 block mt-0.5">Plantão CW</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
              <span className="text-[10px] text-blue-200 uppercase font-semibold block">Alertas E-mail</span>
              <span className="text-xl font-bold text-white">{emailAlerts.length}</span>
              <span className="text-[10px] text-blue-300 block mt-0.5">Disparados</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
              <span className="text-[10px] text-blue-200 uppercase font-semibold block">Destinatário</span>
              <span className="text-xs font-bold text-amber-300 truncate block mt-1" title={targetEmail}>
                ricardo...
              </span>
              <span className="text-[10px] text-emerald-300 block">Ativo 24x7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Internal Navigation SubTabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('abertura')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              subTab === 'abertura'
                ? 'bg-[#EE4D2D] text-white shadow-md shadow-orange-500/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span>🚨 Abrir Chamado (Modelo Central CW)</span>
          </button>

          <button
            onClick={() => setSubTab('chamados')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              subTab === 'chamados'
                ? 'bg-[#172554] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Fila de Chamados &amp; SLA</span>
            <span className="bg-slate-200/80 text-slate-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
              {incidents.length}
            </span>
          </button>

          <button
            onClick={() => setSubTab('alertas')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              subTab === 'alertas'
                ? 'bg-[#172554] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Histórico de Alertas de E-mail</span>
            <span className="bg-orange-100 text-[#EE4D2D] text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
              {emailAlerts.length}
            </span>
          </button>
        </div>

        {subTab === 'abertura' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCwTemplate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 shadow-xs transition-colors"
              title="Copiar texto formatado para colar no WhatsApp, Teams ou Central"
            >
              {copiedTemplate ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copiar Modelo Central CW</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* VIEW 1: FORMULÁRIO DE ABERTURA NO MODELO PADRÃO CENTRAL CW */}
      {subTab === 'abertura' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Form (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
            
            {/* Header Padrão CW */}
            <div className="bg-gradient-to-r from-orange-500 via-amber-600 to-[#EE4D2D] rounded-xl p-4 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-md">
                    🚨 ACIONAMENTO CENTRAL CW
                  </span>
                  <span className="text-xs text-orange-100">Padrão Operacional</span>
                </div>
                <h2 className="text-base font-bold mt-1">
                  Informações organizadas e facilitar o atendimento pela Central. 🚨
                </h2>
                <p className="text-[11px] text-orange-100/90 mt-0.5">
                  Preencha os 5 blocos abaixo para acionamento imediato da Central Cushman &amp; Wakefield e disparo automático do e-mail.
                </p>
              </div>

              {/* Botões de Exemplos Rápidos Reais */}
              <div className="flex sm:flex-col gap-1.5 shrink-0">
                <span className="text-[10px] text-orange-100 font-semibold hidden sm:block">Preenchimento rápido:</span>
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => applyQuickExample('soc_pe')}
                    className="px-2 py-1 text-[10px] bg-white text-orange-900 rounded font-bold hover:bg-orange-50 transition-colors"
                  >
                    Ex. Clima C1 (SOC-PE-04)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyQuickExample('soc_sp')}
                    className="px-2 py-1 text-[10px] bg-white text-orange-900 rounded font-bold hover:bg-orange-50 transition-colors"
                  >
                    Ex. Elétrica C2 (SOC-SP06)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyQuickExample('hub_nfu')}
                    className="px-2 py-1 text-[10px] bg-white text-orange-900 rounded font-bold hover:bg-orange-50 transition-colors"
                  >
                    Ex. Gerador C4 (HUB-NFU-02)
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              
              {/* CAMPO 1: HUB/SOC/FULL */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#EE4D2D]" />
                    <span>1. HUB/SOC/FULL *</span>
                  </label>
                  <span className="text-[11px] font-mono font-bold text-[#EE4D2D] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                    {computedHubSocFull}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {/* Seletor do Tipo Principal & Filtro de Região */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Tipo de Unidade Operacional</label>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setTipoAtivo('SOC');
                            handleUnitSelect(CADASTRO_SOC[0]?.unidade || 'SOC-SP06');
                          }}
                          className={`py-1.5 px-3 text-center font-bold text-xs rounded-lg border transition-all ${
                            tipoAtivo === 'SOC'
                              ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          🏢 CD / SOC ({CADASTRO_SOC.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTipoAtivo('HUB');
                            handleUnitSelect(CADASTRO_HUB[0]?.unidade || 'HUB-NFU-02');
                          }}
                          className={`py-1.5 px-3 text-center font-bold text-xs rounded-lg border transition-all ${
                            tipoAtivo === 'HUB'
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          🚚 HUB ({CADASTRO_HUB.length})
                        </button>
                      </div>
                    </div>

                    {/* Filtro Rápido de Macrorregião */}
                    <div className="sm:text-right">
                      <label className="block text-slate-500 font-medium mb-1 text-[11px]">Filtrar por Região</label>
                      <select
                        value={filtroRegiaoHelpdesk}
                        onChange={(e) => setFiltroRegiaoHelpdesk(e.target.value)}
                        className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-medium focus:ring-1 focus:ring-[#EE4D2D]"
                      >
                        <option value="TODAS">Todas as Regiões (Nacional)</option>
                        {MACRO_REGIOES.map((reg) => (
                          <option key={reg} value={reg}>
                            📍 {reg}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Seleção do Centro de Distribuição / Hub Agrupado por Região */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-slate-600 font-medium">
                        {tipoAtivo === 'HUB' ? 'Hub Operacional Last-Mile' : 'Centro de Distribuição / Sortation'} (Agrupado por Região A-Z)
                      </label>
                      <span className="text-[10px] text-slate-400 font-mono font-medium">
                        {tipoAtivo === 'SOC'
                          ? `${CADASTRO_SOC.length} SOCs`
                          : `${CADASTRO_HUB.length} HUBs`}
                      </span>
                    </div>

                    <select
                      value={selectedUnitCode}
                      onChange={(e) => handleUnitSelect(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-[#EE4D2D] outline-none"
                    >
                      {/* Se for CD (SOC) */}
                      {tipoAtivo === 'SOC' && (
                        <>
                          {MACRO_REGIOES.filter((reg) => filtroRegiaoHelpdesk === 'TODAS' || filtroRegiaoHelpdesk === reg).map((reg) => {
                            const groupList = CDS_E_SOCS_POR_REGIAO[reg];
                            if (!groupList || groupList.length === 0) return null;

                            return (
                              <optgroup
                                key={reg}
                                label={`📍 ${reg} — (${groupList.length} CDs / SOCs)`}
                              >
                                {groupList.map((c) => (
                                  <option key={c.unidade} value={c.unidade}>
                                    {c.unidade} — {c.cidade}/{c.uf} ({c.regional})
                                  </option>
                                ))}
                              </optgroup>
                            );
                          })}

                          <optgroup label="── Alternar para Hubs Operacionais (Last-Mile) ──">
                            {CADASTRO_HUB.slice(0, 10).map((c) => (
                              <option key={c.unidade} value={c.unidade}>
                                [HUB] {c.unidade} — {c.cidade}/{c.uf}
                              </option>
                            ))}
                          </optgroup>
                        </>
                      )}

                      {/* Se for HUB */}
                      {tipoAtivo === 'HUB' && (
                        <>
                          {MACRO_REGIOES.filter((reg) => filtroRegiaoHelpdesk === 'TODAS' || filtroRegiaoHelpdesk === reg).map((reg) => {
                            const groupList = HUBS_POR_REGIAO[reg];
                            if (!groupList || groupList.length === 0) return null;

                            return (
                              <optgroup key={reg} label={`🚚 ${reg} — (${groupList.length} Hubs)`}>
                                {groupList.map((c) => (
                                  <option key={c.unidade} value={c.unidade}>
                                    {c.unidade} — {c.cidade}/{c.uf} ({c.regional})
                                  </option>
                                ))}
                              </optgroup>
                            );
                          })}

                          <optgroup label="── Alternar para Centros de Distribuição (SOC) ──">
                            {CADASTRO_SOC.map((c) => (
                              <option key={c.unidade} value={c.unidade}>
                                [SOC] {c.unidade} — {c.cidade}/{c.uf}
                              </option>
                            ))}
                          </optgroup>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* Linha complementar de customização do HUB/SOC/FULL se necessário */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1 text-[11px] text-slate-500">
                  <span className="shrink-0">Complemento / Nome exato se preferir:</span>
                  <input
                    type="text"
                    value={customUnitDetail}
                    onChange={(e) => setCustomUnitDetail(e.target.value)}
                    placeholder={`Ex: ${selectedUnitCode} - Galpão 02 / Modulo B`}
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 outline-none focus:border-[#EE4D2D]"
                  />
                  <span className="text-slate-400">Cidade: {cidade} ({regiao})</span>
                </div>
              </div>

              {/* CAMPO 2: Descrição do serviço */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span>2. Descrição do serviço *</span>
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Detalhes do serviço e problema para a Central CW
                  </span>
                </div>

                <div>
                  <textarea
                    rows={3}
                    value={descricaoServico}
                    onChange={(e) => setDescricaoServico(e.target.value)}
                    required
                    placeholder="Descreva claramente o serviço a ser executado, sintoma de falha, localização física e o que a equipe técnica deve realizar..."
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:ring-2 focus:ring-[#EE4D2D] outline-none leading-relaxed font-sans"
                  />
                </div>

                {/* Subdados técnicos opcionais que enriquecem o Manusis e Power BI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Sistema de Facilities</label>
                    <select
                      value={sistema}
                      onChange={(e) => setSistema(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#EE4D2D]"
                    >
                      {SISTEMAS_LISTA.filter((s) => s !== 'Todos os Sistemas').map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Equipamento / Ativo Específico</label>
                    <input
                      type="text"
                      value={equipamento}
                      onChange={(e) => setEquipamento(e.target.value)}
                      placeholder="Ex: Niveladora Doca 14, Chiller 02, QGBT 01..."
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#EE4D2D]"
                    />
                  </div>
                </div>
              </div>

              {/* CAMPO 3: Urgência */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>3. Urgência *</span>
                  </label>
                  <span className="text-[11px] font-bold text-slate-700">
                    SLA Máximo: <span className="text-[#EE4D2D] font-mono">{slaHours} Horas</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <button
                    type="button"
                    onClick={() => setCriticidade(1)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      criticidade === 1
                        ? 'border-red-600 bg-red-50 text-red-900 ring-2 ring-red-500/30'
                        : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-red-600">C1 - Crítica</span>
                      <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.2 rounded font-bold">4h</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1 leading-tight">
                      Parada total / Risco grave
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCriticidade(2)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      criticidade === 2
                        ? 'border-orange-500 bg-orange-50 text-orange-900 ring-2 ring-orange-500/30'
                        : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-orange-600">C2 - Alta</span>
                      <span className="text-[10px] bg-orange-500 text-white px-1.5 py-0.2 rounded font-bold">12h</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1 leading-tight">
                      Impacto em expedição
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCriticidade(3)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      criticidade === 3
                        ? 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500/30'
                        : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-amber-600">C3 - Média</span>
                      <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded font-bold">24h</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1 leading-tight">
                      Com contingência
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCriticidade(4)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      criticidade === 4
                        ? 'border-blue-500 bg-blue-50 text-blue-900 ring-2 ring-blue-500/30'
                        : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-blue-600">C4 - Baixa</span>
                      <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.2 rounded font-bold">48h</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1 leading-tight">
                      Reparo programado
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCriticidade(5)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      criticidade === 5
                        ? 'border-slate-700 bg-slate-200 text-slate-900 ring-2 ring-slate-400'
                        : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-700">C5 - Prog.</span>
                      <span className="text-[10px] bg-slate-600 text-white px-1.5 py-0.2 rounded font-bold">72h</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1 leading-tight">
                      Ação preventiva
                    </span>
                  </button>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-700 flex items-center justify-between">
                  <span className="font-semibold text-slate-500">Texto no Padrão Central CW:</span>
                  <span className="font-bold text-[#EE4D2D]">{urgenciaTextoFormatted}</span>
                </div>
              </div>

              {/* CAMPO 4: Contato local: SL/Líder */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>4. Contato local: SL/Líder *</span>
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Shift Leader ou Líder operacional responsável no CD
                  </span>
                </div>

                <div>
                  <input
                    type="text"
                    value={contatoLocal}
                    onChange={(e) => setContatoLocal(e.target.value)}
                    required
                    placeholder="Ex: Ricardo Alonso (Líder SL Noite) - (11) 98765-4321 / Rádio Ch. 04"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-[#EE4D2D] outline-none"
                  />
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Nome, cargo/turno e telefone com WhatsApp para alinhamento imediato com a Central e técnico.
                  </span>
                </div>
              </div>

              {/* CAMPO 5: Contato mantenedora/SPOT */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-emerald-600" />
                    <span>5. Contato mantenedora/SPOT *</span>
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Empresa de manutenção, contrato fixo ou fornecedor SPOT
                  </span>
                </div>

                <div>
                  <input
                    type="text"
                    value={contatoMantenedora}
                    onChange={(e) => setContatoMantenedora(e.target.value)}
                    required
                    placeholder="Ex: Cushman & Wakefield Plantão 24h / DocaTech Soluções - Eng. Marcos (11) 91234-5678"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-[#EE4D2D] outline-none"
                  />
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Identificação da equipe de campo credenciada ou mantenedora SPOT acionada.
                  </span>
                </div>

                {/* Ação Imediata & Evidência */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Ação Imediata Adotada (Contenção)</label>
                    <input
                      type="text"
                      value={acaoImediata}
                      onChange={(e) => setAcaoImediata(e.target.value)}
                      placeholder="Ex: Área isolada com cones e carga redirecionada..."
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#EE4D2D]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Evidência Fotográfica Anexa</label>
                    <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-600">
                      <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate flex-1 font-mono text-[11px]">{anexoSimulado}</span>
                      <button
                        type="button"
                        onClick={() => setAnexoSimulado(`foto_avaria_${Date.now().toString().slice(-4)}.jpg`)}
                        className="text-[10px] text-[#EE4D2D] hover:underline font-bold"
                      >
                        Simular
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* CONFIGURAÇÃO DO DISPARO DE E-MAIL */}
              <div className="bg-amber-50/70 border border-amber-300/80 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-[#EE4D2D]" />
                    <span>Disparo Automático de Alerta por E-mail</span>
                  </label>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-600 text-white rounded-full">
                    Ativo 24/7
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-amber-900 font-semibold mb-1">
                      Destinatário Principal:
                    </label>
                    <input
                      type="email"
                      value={targetEmail}
                      onChange={(e) => setTargetEmail(e.target.value)}
                      required
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-medium focus:ring-2 focus:ring-[#EE4D2D] outline-none"
                    />
                    <span className="text-[11px] text-amber-700 block mt-1">
                      Receberá o card completo de SLA e o modelo <strong>Acionamento Central CW</strong>.
                    </span>
                  </div>

                  <div>
                    <label className="block text-amber-900 font-semibold mb-1">
                      Cópia (CC) de Governança:
                    </label>
                    <input
                      type="text"
                      value={ccEmailsInput}
                      onChange={(e) => setCcEmailsInput(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono text-[11px] focus:ring-2 focus:ring-[#EE4D2D] outline-none"
                    />
                    <span className="text-[11px] text-amber-700 block mt-1">
                      Central C&amp;W e gestão predial Shopee.
                    </span>
                  </div>
                </div>
              </div>

              {/* Botões Finais de Ação */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Será gerado Protocolo Oficial e integrado à Central CW.</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleCopyCwTemplate}
                    className="flex-1 sm:flex-none px-4 py-3 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center gap-2"
                  >
                    {copiedTemplate ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar Modelo CW</span>
                      </>
                    )}
                  </button>

                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-xs bg-[#EE4D2D] hover:bg-[#d84223] text-white shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Abrir Chamado &amp; Enviar Alerta por E-mail</span>
                  </button>
                </div>
              </div>

            </form>
          </div>

          {/* Right Live Preview Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* CARD MODELO PADRÃO CENTRAL CW - LIVE PREVIEW */}
            <div className="bg-gradient-to-b from-[#0b1329] to-[#172554] text-white rounded-2xl shadow-xl p-5 space-y-4 border border-blue-900/60 relative">
              <div className="flex items-center justify-between border-b border-blue-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Modelo Central CW (Tempo Real)
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-[#EE4D2D] px-2 py-0.5 rounded text-white font-bold">
                  Padrão Oficial
                </span>
              </div>

              {/* Box de Exibição do Texto Exato */}
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-[11px] text-slate-200 leading-relaxed space-y-3 whitespace-pre-wrap select-all">
                <div className="text-amber-300 font-bold">
                  Informações organizadas e facilitar o atendimento pela Central. 🚨
                </div>
                <div className="text-red-400 font-extrabold text-xs">
                  🚨 ACIONAMENTO CENTRAL CW
                </div>
                <div>
                  <span className="text-orange-300 font-bold block">HUB/SOC/FULL:</span>
                  <span className="text-white font-semibold">{computedHubSocFull}</span>
                </div>
                <div>
                  <span className="text-orange-300 font-bold block">Descrição do serviço:</span>
                  <span className="text-slate-300">{descricaoServico || '(Aguardando preenchimento...)'}</span>
                </div>
                <div>
                  <span className="text-orange-300 font-bold block">Urgência:</span>
                  <span className="text-amber-400 font-bold">{urgenciaTextoFormatted}</span>
                </div>
                <div>
                  <span className="text-orange-300 font-bold block">Contato local: SL/Líder:</span>
                  <span className="text-slate-300">{contatoLocal || '(Aguardando preenchimento...)'}</span>
                </div>
                <div>
                  <span className="text-orange-300 font-bold block">Contato mantenedora/SPOT:</span>
                  <span className="text-slate-300">{contatoMantenedora || '(Aguardando preenchimento...)'}</span>
                </div>
              </div>

              {/* Botões de Ação Rápida */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyCwTemplate}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-white/15"
                >
                  {copiedTemplate ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">Copiado para WhatsApp / Teams / Central!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Padrão Acionamento Central CW</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(liveCwTemplateText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Enviar para WhatsApp da Central CW</span>
                </a>
              </div>
            </div>

            {/* SLA Preview Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#EE4D2D]" />
                  <span>SLA de Atendimento Central CW</span>
                </span>
                <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {slaHours}h Meta
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Classificação:</span>
                  <strong className="text-slate-900 font-bold">C{criticidade}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Prazo Limite:</span>
                  <strong className="text-[#EE4D2D] font-bold">Hoje + {slaHours} horas</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Notificação enviada:</span>
                  <strong className="text-slate-900 font-mono text-[11px] truncate max-w-[170px]" title={targetEmail}>
                    {targetEmail}
                  </strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Cópia (CC):</span>
                  <span className="text-slate-500 text-[11px]">Cushman &amp; Wakefield</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: CHAMADOS & ACOMPANHAMENTO */}
      {subTab === 'chamados' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por protocolo, HUB/SOC/FULL, serviço ou contato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#EE4D2D] outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-slate-500 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:ring-2 focus:ring-[#EE4D2D] outline-none"
              >
                <option value="Todos">Todos os Status</option>
                <option value="Aberto">Aberto</option>
                <option value="Em Atendimento">Em Atendimento</option>
                <option value="Aguardando Peças">Aguardando Peças</option>
                <option value="Encerrado">Encerrado</option>
              </select>

              <button
                onClick={() => setSubTab('abertura')}
                className="ml-auto sm:ml-2 flex items-center gap-1.5 px-3.5 py-2 bg-[#EE4D2D] hover:bg-[#d84223] text-white rounded-xl font-bold shadow-xs transition-colors shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>🚨 Novo Acionamento Central CW</span>
              </button>
            </div>
          </div>

          {/* Cards List */}
          <div className="grid grid-cols-1 gap-3">
            {filteredTickets.map((ticket) => {
              const ticketSla = getSlaHoursByCriticidade(ticket.criticidade);
              const cwFormatted = generateCentralCwAcionamentoText(ticket);

              return (
                <div
                  key={ticket.id_automatico}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-slate-300 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-extrabold text-sm text-[#0b1329]">
                        {ticket.protocolo}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-orange-100 text-[#EE4D2D] border border-orange-200">
                        {ticket.hub_soc_full || `${ticket.tipo_ativo_operacional || 'FULL'} - ${ticket.unidade}`}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ticket.criticidade === 1
                            ? 'bg-red-600 text-white'
                            : ticket.criticidade === 2
                            ? 'bg-orange-500 text-white'
                            : ticket.criticidade === 3
                            ? 'bg-amber-500 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        C{ticket.criticidade} · SLA {ticketSla}h
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {ticket.cidade} - {ticket.regiao}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          ticket.status_gerencial === 'Aberto'
                            ? 'bg-amber-100 text-amber-800'
                            : ticket.status_gerencial === 'Em Atendimento'
                            ? 'bg-blue-100 text-blue-800'
                            : ticket.status_gerencial === 'Aguardando Peças'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {ticket.status_gerencial}
                      </span>
                    </div>
                  </div>

                  {/* Informações organizadas Modelo Central CW */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                    <div className="md:col-span-8 space-y-2">
                      <div>
                        <span className="font-bold text-slate-700 block mb-0.5">Descrição do serviço:</span>
                        <p className="text-slate-800 leading-relaxed font-normal bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          {ticket.descricao_servico || ticket.descricao_ocorrencia || ticket.descricao}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                          <strong className="text-slate-600 block">Contato local: SL/Líder:</strong>
                          <span className="text-slate-800 font-medium">{ticket.contato_local || ticket.solicitante}</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                          <strong className="text-slate-600 block">Contato mantenedora/SPOT:</strong>
                          <span className="text-slate-800 font-medium">{ticket.contato_mantenedora || ticket.fornecedor}</span>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-4 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-[11px]">
                      <div>
                        <span className="text-slate-500">Sistema / Equipamento:</span>
                        <strong className="text-slate-800 block">{ticket.equipamento_afetado || ticket.sistema}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Ordem Manusis OM:</span>
                        <strong className="text-slate-800 block font-mono">{ticket.numero_manusis}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Abertura:</span>
                        <span className="text-slate-700 block">{ticket.data} às {ticket.hora_abertura}</span>
                      </div>

                      {/* Botões de Ação para o Chamado */}
                      <div className="pt-2 border-t border-slate-200 flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(cwFormatted);
                            showNotification(`Padrão Central CW do chamado ${ticket.protocolo} copiado!`);
                          }}
                          className="w-full flex items-center justify-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-semibold text-[11px] transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copiar Padrão CW</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenEmailPreview(ticket)}
                          className="w-full flex items-center justify-center gap-1 px-2.5 py-1.5 bg-[#EE4D2D] hover:bg-[#d84223] text-white rounded-lg font-bold text-[11px] transition-colors shadow-xs"
                        >
                          <Mail className="w-3 h-3" />
                          <span>Ver / Reenviar E-mail</span>
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: HISTÓRICO DE ALERTAS DE E-MAIL */}
      {subTab === 'alertas' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-[#EE4D2D]" />
                  <span>Caixa de Saída &amp; Auditoria de Alertas por E-mail</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Registro cronológico de todos os disparos automáticos e notificações enviadas para a Central CW e gestão Shopee.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-bold">
                  {emailAlerts.length} Notificações Entregues
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 mt-3">
              {emailAlerts.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Nenhum alerta disparado ainda. Abra um novo chamado para gerar o primeiro disparo.
                </div>
              ) : (
                emailAlerts.map((alert) => {
                  const matchTicket = incidents.find((i) => i.protocolo === alert.protocolo);
                  return (
                    <div key={alert.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">{alert.protocolo}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            {alert.status}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(alert.sentAt || alert.timestamp).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <div className="text-slate-700 font-medium">
                          {alert.subject}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Destinatário: <strong className="text-slate-800 font-mono">{alert.recipient}</strong>
                          {alert.ccRecipients?.length > 0 && (
                            <span className="ml-1 text-slate-400">
                              (Cópia: {alert.ccRecipients.join(', ')})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {matchTicket && (
                          <button
                            type="button"
                            onClick={() => {
                              const txt = generateCentralCwAcionamentoText(matchTicket);
                              navigator.clipboard.writeText(txt);
                              showNotification(`Texto Central CW copiado para ${alert.protocolo}`);
                            }}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Padrão CW</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (matchTicket) onOpenEmailPreview(matchTicket, alert);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#EE4D2D] hover:bg-[#d84223] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver Notificação</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
