import React, { useState, useMemo, useEffect } from 'react';
import { Incident, FilterState, StatusGerencial, EmailAlert, CentroDistribuicao, AppUser } from './types/facilities';
import { REAL_CONTINGENCY_INCIDENTS } from './data/realContingencyIncidents';
import { CADASTRO_CDS } from './data/cadastrosCDs';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { ExecutiveOverview } from './components/ExecutiveOverview';
import { SlaPerformanceView } from './components/SlaPerformanceView';
import { CostsView } from './components/CostsView';
import { IncidentsTableView } from './components/IncidentsTableView';
import { CdsDirectoryView } from './components/CdsDirectoryView';
import { ParametersView } from './components/ParametersView';
import { DocumentationViewer } from './components/DocumentationViewer';
import { IncidentDetailsDrawer } from './components/IncidentDetailsDrawer';
import { NewIncidentModal } from './components/NewIncidentModal';
import { AutomationModal } from './components/AutomationModal';
import { ChamadosHelpdeskView } from './components/ChamadosHelpdeskView';
import { EmailAlertPreviewModal } from './components/EmailAlertPreviewModal';
import { PwaInstallModal } from './components/PwaInstallModal';
import { LoginModal } from './components/LoginModal';
import { AuditTrailModal } from './components/AuditTrailModal';
import { UserManagementView } from './components/UserManagementView';
import { usePwaInstall } from './hooks/usePwaInstall';
import { useAuditLog } from './hooks/useAuditLog';
import {
  getStoredUsers,
  saveStoredUsers,
  getStoredCurrentUser,
  saveStoredCurrentUser
} from './data/authUsers';
import {
  DEFAULT_ALERT_EMAIL,
  DEFAULT_CC_EMAILS,
  getSlaHoursByCriticidade
} from './utils/emailTemplateGenerator';
import { CheckCircle2 } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  search: '',
  unidade: '',
  cidade: '',
  regiao: '',
  regional: '',
  categoria: '',
  sistema: '',
  criticidade: '',
  faixaCriticidade: '',
  statusGerencial: '',
  slaGerencial: '',
  reincidente: '',
  alertaSla: '',
  alertaNivel: '',
  fornecedor: '',
  prioridade: '',
  status: '',
  slaStatus: '',
  tipoManutencao: '',
  periodo: 'all'
};

export default function App() {
  const [datasetMode, setDatasetMode] = useState<'real' | 'mock' | 'all'>('real');
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    try {
      const saved = localStorage.getItem('facilities_real_incidents_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 79) return parsed;
      }
    } catch {
      // fallback to official base
    }
    return REAL_CONTINGENCY_INCIDENTS;
  });
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [activeTab, setActiveTab] = useState<'chamados' | 'executive' | 'sla' | 'costs' | 'table' | 'cds' | 'params' | 'docs' | 'usuarios'>('chamados');
  const [docsAssetId, setDocsAssetId] = useState<string>('layout-relatorio');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedCdForNewIncident, setSelectedCdForNewIncident] = useState<CentroDistribuicao | null>(null);
  const [isAutomationModalOpen, setIsAutomationModalOpen] = useState(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  const { isInstallable, isInstalled, isIos, promptInstall } = usePwaInstall();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sistema de Auditoria & Rastreabilidade de Alterações
  const {
    logs: auditLogs,
    logIncidentCreation,
    logIncidentStatusChange,
    logIncidentNote,
    logCadastroChange,
    logUserChange,
    logLogin,
    logLogout,
    clearLogs,
    exportLogsCsv
  } = useAuditLog();

  // Sistema de Autenticação & Cadastro de Usuários (com seleção de CDs/HUBs/SOCs)
  const [users, setUsers] = useState<AppUser[]>(getStoredUsers);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(getStoredCurrentUser);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Sync users & session to localStorage
  useEffect(() => {
    saveStoredUsers(users);
  }, [users]);

  useEffect(() => {
    saveStoredCurrentUser(currentUser);
  }, [currentUser]);

  const handleLogin = (user: AppUser) => {
    setCurrentUser(user);
    saveStoredCurrentUser(user);
    logLogin(user);
    showToast(`Sessão iniciada como ${user.nome} (${user.cargo})`);
  };

  const handleSaveUser = (user: AppUser, isNew: boolean) => {
    setUsers((prev) => {
      const idx = prev.findIndex((u) => u.id === user.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = user;
        return next;
      }
      return [user, ...prev];
    });

    logUserChange(user, isNew ? 'create' : 'update', currentUser);

    if (currentUser?.id === user.id) {
      setCurrentUser(user);
    }

    showToast(isNew ? `Usuário ${user.nome} cadastrado com sucesso!` : `Cadastro de ${user.nome} atualizado!`);
  };

  const handleDeleteUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    logUserChange(target, 'delete', currentUser);
    if (currentUser?.id === userId) {
      const fallback = users.find((u) => u.id !== userId) || null;
      setCurrentUser(fallback);
    }
    showToast(`Usuário ${target.nome} removido da base operacional.`);
  };

  // Email Alert States
  const [emailAlerts, setEmailAlerts] = useState<EmailAlert[]>(() => {
    try {
      const saved = localStorage.getItem('facilities_email_alerts_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    // Seed default alert based on real operational incident
    return [
      {
        id: 'ALT-1001',
        ticketId: 'CONT-001',
        protocolo: 'OM 240551',
        timestamp: new Date().toISOString(),
        recipient: DEFAULT_ALERT_EMAIL,
        ccRecipients: DEFAULT_CC_EMAILS,
        subject: `[ALERTA DE CHAMADO C4] OM 240551 - HUB-NFU-02 - Gerador Diesel`,
        status: 'Entregue',
        priority: 'C4 - Baixa',
        criticidade: 4,
        faixaCriticidade: 'C4 - Baixa',
        unidade: 'HUB-NFU-02',
        equipamento: 'Grupo Gerador Diesel',
        solicitante: 'Daniela Domingues (Analista Operações / SL)',
        descricao: 'Gerador gera alarmes recorrentes, liga e desliga com baixa tensão intermitente.',
        slaHoras: 48,
        prazoSlaEstimado: '48 horas',
        bodyPreview: 'Alerta Operacional registrado para a equipe de Facilities Central CW...',
        htmlBody: '',
        sentAt: 'Hoje às 08:30'
      }
    ];
  });
  const [previewEmailTicket, setPreviewEmailTicket] = useState<Incident | null>(null);
  const [activeEmailAlertRecord, setActiveEmailAlertRecord] = useState<EmailAlert | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Sync email alerts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('facilities_email_alerts_v2', JSON.stringify(emailAlerts));
    } catch {
      // ignore
    }
  }, [emailAlerts]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('facilities_real_incidents_v4', JSON.stringify(incidents));
    } catch {
      // ignore
    }
  }, [incidents]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleChangeDatasetMode = (mode: 'real' | 'mock' | 'all') => {
    setDatasetMode('real');
    setIncidents(REAL_CONTINGENCY_INCIDENTS);
    showToast('Base Operacional Oficial (79 Ocorrências Reais de Contingência: CONT-001 a CONT-079) ativa');
  };

  const handleRestoreRealData = () => {
    setDatasetMode('real');
    setIncidents(REAL_CONTINGENCY_INCIDENTS);
    try {
      localStorage.removeItem('facilities_real_incidents_v4');
    } catch {
      // ignore
    }
    showToast('Base Operacional Oficial (79 Ocorrências) restaurada com sucesso!');
  };

  // Filter application matching DAX logic
  const filteredIncidents = useMemo(() => {
    return incidents.filter((item) => {
      // Search
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesQuery =
          item.id.toLowerCase().includes(query) ||
          item.protocolo.toLowerCase().includes(query) ||
          item.equipamento_afetado.toLowerCase().includes(query) ||
          item.descricao.toLowerCase().includes(query) ||
          item.fornecedor.toLowerCase().includes(query) ||
          (item.tecnico_responsavel && item.tecnico_responsavel.toLowerCase().includes(query)) ||
          item.solicitante.toLowerCase().includes(query) ||
          item.cidade.toLowerCase().includes(query) ||
          item.sistema.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // Unidade
      if (filters.unidade && item.unidade !== filters.unidade) return false;

      // Regional
      if (filters.regional && item.regional && item.regional !== filters.regional) return false;

      // Categoria / Sistema
      if (filters.categoria && item.sistema !== filters.categoria && item.categoria !== filters.categoria) return false;

      // Criticidade C1 a C5
      if (filters.criticidade && item.criticidade !== parseInt(filters.criticidade)) return false;

      // Status Gerencial
      if (filters.statusGerencial && item.status_gerencial !== filters.statusGerencial) return false;

      // SLA Gerencial
      if (filters.slaGerencial && item.sla_gerencial !== filters.slaGerencial) return false;

      // Reincidente
      if (filters.reincidente && item.reincidente !== filters.reincidente) return false;

      // Prioridade Alerta
      if (filters.alertaNivel) {
        if (filters.alertaNivel === '4' && item.prioridade_alerta !== 4) return false;
        if (filters.alertaNivel === 'alertas' && item.prioridade_alerta < 2) return false;
        if (filters.alertaNivel === '1' && item.prioridade_alerta !== 1) return false;
      }

      // Período
      if (filters.periodo !== 'all') {
        const incidentDate = new Date(item.data_abertura || item.data).getTime();
        const now = new Date('2026-09-29T23:59:59').getTime();
        const diffDays = (now - incidentDate) / (1000 * 3600 * 24);

        if (filters.periodo === '7d' && diffDays > 7) return false;
        if (filters.periodo === '30d' && diffDays > 30) return false;
        if (filters.periodo === '90d' && diffDays > 90) return false;
      }

      return true;
    });
  }, [incidents, filters]);

  // Update status handler (interceptado e auditado com rastreabilidade de quem realizou a mudança)
  const handleUpdateStatus = (id: string, newStatus: any, motivo?: string) => {
    const targetInc = incidents.find((i) => i.id === id);
    if (targetInc) {
      logIncidentStatusChange(targetInc, targetInc.status_gerencial, newStatus, currentUser, motivo);
    }

    setIncidents((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isEncerrado = newStatus === 'Encerrado' || newStatus === 'Concluído';
          const nowIso = new Date().toISOString();
          const fechamento = isEncerrado ? nowIso : null;

          let mttrH = item.mttr_h;
          let slaGerencial = item.sla_gerencial;

          if (isEncerrado) {
            const diffHours =
              (new Date(nowIso).getTime() - new Date(item.data_abertura || item.data).getTime()) /
              (1000 * 3600);
            mttrH = Math.round(diffHours * 10) / 10;
            const slaLimit = item.sla_horas_limite || (item.criticidade === 1 ? 4 : item.criticidade === 2 ? 12 : 24);
            slaGerencial = mttrH <= slaLimit ? 'Dentro do SLA' : 'Fora do SLA';
          }

          const autorDesc = currentUser ? `${currentUser.nome} (${currentUser.cargo})` : 'Facilities / CCM';
          const updated: Incident = {
            ...item,
            status_gerencial: isEncerrado ? 'Encerrado' : (newStatus as StatusGerencial),
            status: isEncerrado ? 'Encerrado' : newStatus,
            data_fechamento: fechamento,
            hora_normalizacao: isEncerrado ? nowIso.slice(11, 19) : null,
            data_hora_normalizacao: isEncerrado ? nowIso : null,
            mttr_h: mttrH,
            sla_gerencial: slaGerencial,
            prioridade_alerta: isEncerrado ? 1 : item.prioridade_alerta,
            alerta_sla: isEncerrado ? 'NORMAL' : item.alerta_sla,
            atualizado_por_usuario: currentUser ? `${currentUser.nome} (${currentUser.email})` : 'Facilities / CCM',
            atualizado_em: nowIso,
            historico: [
              ...(item.historico || []),
              {
                data: nowIso,
                autor: autorDesc,
                acao: `Status gerencial atualizado para "${newStatus}" por ${autorDesc}${motivo ? ` (Obs: ${motivo})` : ''}`
              }
            ]
          };

          if (selectedIncident?.id === id) {
            setSelectedIncident(updated);
          }

          return updated;
        }
        return item;
      })
    );

    showToast(`Status da ocorrência ${id} atualizado para "${newStatus}" por ${currentUser?.nome || 'Facilities'}`);
  };

  // Add History Note (auditado)
  const handleAddHistoryNote = (id: string, note: string) => {
    const nowIso = new Date().toISOString();
    const targetInc = incidents.find((i) => i.id === id);
    if (targetInc) {
      logIncidentNote(targetInc, note, currentUser);
    }

    const autorDesc = currentUser ? `${currentUser.nome} (${currentUser.cargo})` : 'Acompanhamento CCM';
    setIncidents((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated: Incident = {
            ...item,
            atualizado_por_usuario: currentUser ? `${currentUser.nome} (${currentUser.email})` : item.atualizado_por_usuario,
            atualizado_em: nowIso,
            historico: [
              ...(item.historico || []),
              {
                data: nowIso,
                autor: autorDesc,
                acao: note
              }
            ]
          };
          if (selectedIncident?.id === id) {
            setSelectedIncident(updated);
          }
          return updated;
        }
        return item;
      })
    );
    showToast(`Anotação de acompanhamento adicionada por ${currentUser?.nome || 'Usuário'}`);
  };

  // Add New Incident with Automatic Email Alert & Audit Log
  const handleSaveNewIncident = (
    newTicket: Incident,
    targetEmail = DEFAULT_ALERT_EMAIL,
    ccList = DEFAULT_CC_EMAILS
  ) => {
    const nowIso = new Date().toISOString();
    const ticketWithAudit: Incident = {
      ...newTicket,
      aberto_por_usuario: newTicket.aberto_por_usuario || (currentUser ? `${currentUser.nome} (${currentUser.email})` : 'Operação Facilities'),
      aberto_por_email: newTicket.aberto_por_email || currentUser?.email || 'facilities@shopee.com',
      aberto_por_cargo: newTicket.aberto_por_cargo || currentUser?.cargo || 'Solicitante Local',
      data_hora_criacao: newTicket.data_hora_criacao || nowIso
    };

    setIncidents((prev) => [ticketWithAudit, ...prev]);

    // Registra abertura na trilha de auditoria
    logIncidentCreation(ticketWithAudit, currentUser);

    const slaHours = getSlaHoursByCriticidade(ticketWithAudit.criticidade);
    const alertId = `ALT-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowTime = new Date().toLocaleTimeString('pt-BR');

    const hubSocFull = ticketWithAudit.hub_soc_full || `${ticketWithAudit.tipo_ativo_operacional || 'FULL'} - ${ticketWithAudit.unidade}`;
    const newAlert: EmailAlert = {
      id: alertId,
      ticketId: ticketWithAudit.id,
      protocolo: ticketWithAudit.protocolo,
      timestamp: nowIso,
      recipient: targetEmail,
      ccRecipients: ccList,
      subject: `[ACIONAMENTO CENTRAL CW] ${ticketWithAudit.protocolo} - ${hubSocFull} - ${ticketWithAudit.equipamento_afetado || ticketWithAudit.sistema}`,
      status: 'Entregue',
      priority: `C${ticketWithAudit.criticidade} - ${ticketWithAudit.faixa_criticidade}`,
      criticidade: ticketWithAudit.criticidade,
      faixaCriticidade: ticketWithAudit.faixa_criticidade,
      unidade: ticketWithAudit.unidade,
      equipamento: ticketWithAudit.equipamento_afetado || ticketWithAudit.sistema,
      solicitante: ticketWithAudit.solicitante,
      descricao: ticketWithAudit.descricao_ocorrencia || ticketWithAudit.descricao,
      slaHoras: slaHours,
      prazoSlaEstimado: `${slaHours} horas`,
      bodyPreview: `Acionamento Central CW: ${hubSocFull} - ${ticketWithAudit.descricao_servico || ticketWithAudit.descricao}`,
      htmlBody: '',
      sentAt: `Hoje às ${nowTime}`,
      hub_soc_full: hubSocFull,
      descricao_servico: ticketWithAudit.descricao_servico || ticketWithAudit.descricao,
      urgencia: ticketWithAudit.urgencia || `C${ticketWithAudit.criticidade} (${ticketWithAudit.faixa_criticidade})`,
      contato_local: ticketWithAudit.contato_local || ticketWithAudit.solicitante,
      contato_mantenedora: ticketWithAudit.contato_mantenedora || ticketWithAudit.fornecedor
    };

    setEmailAlerts((prev) => [newAlert, ...prev]);
    setPreviewEmailTicket(ticketWithAudit);
    setActiveEmailAlertRecord(newAlert);
    setIsEmailModalOpen(true);

    showToast(`Chamado ${ticketWithAudit.protocolo} aberto por ${currentUser?.nome || 'Usuário'}! Notificação enviada para ${targetEmail}`);
  };

  // Export CSV matching exact Power Query schema
  const handleExportCsv = () => {
    const headers = [
      'ID (automático)',
      'Data',
      'Unidade',
      'Cidade',
      'Região',
      'Solicitante',
      'Descrição da Ocorrência',
      'Impacto Operacional',
      'Sistema',
      'Criticidade',
      'Faixa Criticidade',
      'Fornecedor',
      'Ação Executada',
      'Hora Abertura',
      'Hora Acionamento',
      'Hora Normalização',
      'DataHoraAbertura',
      'DataHoraAcionamento',
      'DataHoraNormalizacao',
      'Status',
      'Status Gerencial',
      'Valor SPOT',
      'Nº Manusis',
      'MTTA (min)',
      'MTTR (h)',
      'SLA',
      'SLA Gerencial',
      'Semáforo SLA',
      'Tempo em Aberto (h)',
      'Alerta SLA',
      'Prioridade Alerta',
      'Causa Raiz',
      'Ação Preventiva',
      'Responsável Acompanhamento',
      'Reincidência 30d',
      'Reincidente'
    ];

    const rows = filteredIncidents.map((i) => [
      `"${i.id_automatico || i.id}"`,
      `"${i.data || (i.data_abertura ? i.data_abertura.slice(0, 10) : '')}"`,
      `"${i.unidade}"`,
      `"${i.cidade}"`,
      `"${i.regiao}"`,
      `"${i.solicitante}"`,
      `"${(i.descricao_ocorrencia || i.descricao).replace(/"/g, '""')}"`,
      `"${i.impacto_operacional}"`,
      `"${i.sistema}"`,
      i.criticidade,
      `"${i.faixa_criticidade}"`,
      `"${i.fornecedor}"`,
      `"${(i.acao_executada || '').replace(/"/g, '""')}"`,
      `"${i.hora_abertura}"`,
      `"${i.hora_acionamento}"`,
      `"${i.hora_normalizacao || ''}"`,
      `"${i.data_hora_abertura || i.data_abertura || i.data}"`,
      `"${i.data_hora_acionamento || i.data_abertura}"`,
      `"${i.data_hora_normalizacao || i.data_fechamento || ''}"`,
      `"${i.status}"`,
      `"${i.status_gerencial}"`,
      i.valor_spot,
      `"${i.numero_manusis}"`,
      i.mtta_min !== null ? i.mtta_min : '',
      i.mttr_h !== null ? i.mttr_h : '',
      `"${i.sla}"`,
      `"${i.sla_gerencial}"`,
      `"${i.semaforo_sla}"`,
      i.tempo_em_aberto_h !== null ? i.tempo_em_aberto_h : '',
      `"${i.alerta_sla}"`,
      i.prioridade_alerta,
      `"${(i.causa_raiz || '').replace(/"/g, '""')}"`,
      `"${(i.acao_preventiva || '').replace(/"/g, '""')}"`,
      `"${i.responsavel_acompanhamento}"`,
      i.reincidencia_30d,
      `"${i.reincidente}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Base_Operacional_Facilities_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Base Operacional exportada para CSV compatível com Power BI!');
  };

  const handleFilterByHub = (hub: string) => {
    setFilters((prev) => ({ ...prev, unidade: hub }));
    showToast(`Slicer aplicado: Unidade "${hub}"`);
  };

  const handleFilterByCategory = (cat: string) => {
    setFilters((prev) => ({ ...prev, categoria: cat, sistema: cat }));
    showToast(`Slicer aplicado: Sistema "${cat}"`);
  };

  // Dynamic filter options derived from real incidents & CD registry
  const availableUnits = useMemo(() => {
    const fromIncidents = incidents.map((i) => i.unidade).filter(Boolean);
    const fromCds = CADASTRO_CDS.map((c) => c.unidade).filter(Boolean);
    const set = new Set([...fromIncidents, ...fromCds]);
    return ['Todas as Unidades', ...Array.from(set).sort()];
  }, [incidents]);

  const availableRegionals = useMemo(() => {
    const fromIncidents = incidents.map((i) => i.regional || i.regiao).filter(Boolean);
    const fromCds = CADASTRO_CDS.map((c) => c.regional).filter(Boolean);
    const set = new Set([...fromIncidents, ...fromCds]);
    return ['Todas as Regiões', ...Array.from(set).sort()];
  }, [incidents]);

  const availableSistemas = useMemo(() => {
    const fromIncidents = incidents.map((i) => i.sistema || i.categoria).filter(Boolean);
    const set = new Set(fromIncidents);
    return ['Todos os Sistemas', ...Array.from(set).sort()];
  }, [incidents]);

  const availableFornecedores = useMemo(() => {
    const fromIncidents = incidents.map((i) => i.fornecedor).filter(Boolean);
    const set = new Set(fromIncidents);
    return ['Todos os Fornecedores', ...Array.from(set).sort()];
  }, [incidents]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-[#EE4D2D]/20 selection:text-[#EE4D2D]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#172554] text-white px-4 py-2.5 rounded-xl shadow-xl border border-blue-900 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewModal={() => {
          setSelectedCdForNewIncident(null);
          setIsNewModalOpen(true);
        }}
        onOpenAutomationModal={() => setIsAutomationModalOpen(true)}
        onExportCsv={handleExportCsv}
        totalFilteredCount={filteredIncidents.length}
        datasetMode={datasetMode}
        onChangeDatasetMode={handleChangeDatasetMode}
        onRestoreRealData={handleRestoreRealData}
        onOpenPwaModal={() => setIsPwaModalOpen(true)}
        isPwaInstalled={isInstalled}
        currentUser={currentUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
        auditLogsCount={auditLogs.length}
        registeredUsersCount={users.length}
      />

      {/* Slicers Filter Bar */}
      {activeTab !== 'docs' && activeTab !== 'chamados' && activeTab !== 'usuarios' && (
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          totalCount={incidents.length}
          filteredCount={filteredIncidents.length}
          onResetFilters={() => setFilters(INITIAL_FILTERS)}
          availableUnits={availableUnits}
          availableRegionals={availableRegionals}
          availableSistemas={availableSistemas}
          availableFornecedores={availableFornecedores}
        />
      )}

      {/* Page Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'chamados' && (
          <ChamadosHelpdeskView
            incidents={incidents}
            onSaveNewTicket={handleSaveNewIncident}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
            onOpenEmailPreview={(inc, record) => {
              setPreviewEmailTicket(inc);
              setActiveEmailAlertRecord(record || null);
              setIsEmailModalOpen(true);
            }}
            emailAlerts={emailAlerts}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'executive' && (
          <ExecutiveOverview
            incidents={filteredIncidents}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
            onFilterByHub={handleFilterByHub}
            onFilterByCategory={handleFilterByCategory}
          />
        )}

        {activeTab === 'sla' && (
          <SlaPerformanceView
            incidents={filteredIncidents}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
          />
        )}

        {activeTab === 'costs' && (
          <CostsView
            incidents={filteredIncidents}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
          />
        )}

        {activeTab === 'table' && (
          <IncidentsTableView
            incidents={filteredIncidents}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
            onUpdateStatus={handleUpdateStatus}
            onExportCsv={handleExportCsv}
          />
        )}

        {activeTab === 'cds' && (
          <CdsDirectoryView
            onOpenNewIncidentWithCd={(cd) => {
              setSelectedCdForNewIncident(cd);
              setIsNewModalOpen(true);
            }}
            currentUser={currentUser}
            onAuditLog={logCadastroChange}
          />
        )}

        {activeTab === 'usuarios' && (
          <UserManagementView
            users={users}
            currentUser={currentUser}
            onSelectUserForLogin={handleLogin}
            onSaveUser={handleSaveUser}
            onDeleteUser={handleDeleteUser}
          />
        )}

        {activeTab === 'params' && (
          <ParametersView
            onNavigateToDocs={(assetId) => {
              setDocsAssetId(assetId);
              setActiveTab('docs');
            }}
            onOpenAutomationModal={() => setIsAutomationModalOpen(true)}
          />
        )}

        {activeTab === 'docs' && <DocumentationViewer initialAssetId={docsAssetId} />}
      </main>

      {/* Side Details Drawer */}
      <IncidentDetailsDrawer
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onUpdateStatus={handleUpdateStatus}
        onAddHistoryNote={handleAddHistoryNote}
      />

      {/* New Incident Modal */}
      <NewIncidentModal
        isOpen={isNewModalOpen}
        onClose={() => {
          setIsNewModalOpen(false);
          setSelectedCdForNewIncident(null);
        }}
        onSave={handleSaveNewIncident}
        initialCd={selectedCdForNewIncident}
        currentUser={currentUser}
      />

      {/* Login & User Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        users={users}
        onOpenUserManagement={() => setActiveTab('usuarios')}
      />

      {/* Audit Trail & Compliance Modal */}
      <AuditTrailModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        logs={auditLogs}
      />

      {/* Teams Automation Simulator Modal */}
      <AutomationModal
        isOpen={isAutomationModalOpen}
        onClose={() => setIsAutomationModalOpen(false)}
        incidents={incidents}
      />

      {/* Email Alert Preview & Dispatch Modal */}
      <EmailAlertPreviewModal
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
          setPreviewEmailTicket(null);
          setActiveEmailAlertRecord(null);
        }}
        incident={previewEmailTicket}
        alertRecord={activeEmailAlertRecord}
        alertEmail={DEFAULT_ALERT_EMAIL}
        ccEmails={DEFAULT_CC_EMAILS}
      />

      {/* PWA Install Modal */}
      <PwaInstallModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
        onInstall={promptInstall}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        isIos={isIos}
      />

      {/* Footer */}
      <footer className="bg-[#172554] border-t border-blue-900 py-4 text-center text-xs text-blue-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Pacote Power BI — Facilities / CCM</span>
            <span>· CCM_Facilities_Contingencias.pbix</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-blue-300">
            <span>Power Query M</span>
            <span>·</span>
            <span>DimData 1:N FatoOcorrencias</span>
            <span>·</span>
            <span>Medidas DAX</span>
            <span>·</span>
            <span>Tema Facilities Shopee Executive</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
