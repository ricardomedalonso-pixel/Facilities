import { useState, useEffect, useCallback } from 'react';
import { RegistroAuditoria, TipoAcaoAuditoria, Incident, AppUser, CentroDistribuicao } from '../types/facilities';
import { INITIAL_AUDIT_LOGS } from '../data/authUsers';

export const AUDIT_STORAGE_KEY = 'facilities_audit_trail_v1';

export function useAuditLog() {
  const [logs, setLogs] = useState<RegistroAuditoria[]>(() => {
    try {
      const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error reading audit logs from localStorage:', err);
    }
    return INITIAL_AUDIT_LOGS;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
    } catch (err) {
      console.error('Error saving audit logs to localStorage:', err);
    }
  }, [logs]);

  // Generic add log function
  const addLog = useCallback(
    (
      entry: Omit<RegistroAuditoria, 'id' | 'timestamp'> & {
        timestamp?: string;
        id?: string;
      }
    ): RegistroAuditoria => {
      const newEntry: RegistroAuditoria = {
        id: entry.id || `AUD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: entry.timestamp || new Date().toISOString(),
        tipo: entry.tipo,
        usuarioNome: entry.usuarioNome || 'Usuário Operacional',
        usuarioEmail: entry.usuarioEmail || 'facilities@shopee.com',
        usuarioCargo: entry.usuarioCargo || 'Equipe Facilities',
        entidade: entry.entidade,
        entidadeId: entry.entidadeId,
        titulo: entry.titulo,
        detalhes: entry.detalhes,
        valorAnterior: entry.valorAnterior,
        valorNovo: entry.valorNovo
      };

      setLogs((prev) => [newEntry, ...prev]);
      return newEntry;
    },
    []
  );

  // Intercepta e registra abertura de OS
  const logIncidentCreation = useCallback(
    (incident: Incident, user: AppUser | null): RegistroAuditoria => {
      const autorNome = user?.nome || incident.aberto_por_usuario || incident.solicitante || 'Usuário Operacional';
      const autorEmail = user?.email || incident.aberto_por_email || 'nao-informado@shopee.com';
      const autorCargo = user?.cargo || incident.aberto_por_cargo || 'Solicitante Local';

      const critText = incident.faixa_criticidade || `C${incident.criticidade}`;
      const equipText = incident.equipamento_afetado || incident.sistema || 'Equipamento Predial';
      const hubText = incident.hub_soc_full || incident.unidade;

      return addLog({
        tipo: 'OS_ABERTURA',
        usuarioNome: autorNome,
        usuarioEmail: autorEmail,
        usuarioCargo: autorCargo,
        entidade: 'OS',
        entidadeId: incident.id_automatico || incident.id,
        titulo: `Abertura de OS registrada (${incident.protocolo || incident.id})`,
        detalhes: `Chamado aberto para ${hubText} (${equipText}) por ${autorNome}. Criticidade: ${critText}. Impacto: ${incident.impacto_operacional || 'Operacional'}. Fornecedor acionado: ${incident.fornecedor}.`,
        valorNovo: 'Aberto'
      });
    },
    [addLog]
  );

  // Intercepta e registra atualizações de status da OS (Em Andamento, Encerrado, Cancelado, etc.)
  const logIncidentStatusChange = useCallback(
    (
      incident: Incident,
      oldStatus: string,
      newStatus: string,
      user: AppUser | null,
      motivo?: string
    ): RegistroAuditoria => {
      const autorNome = user?.nome || 'Gestor Facilities / Central CW';
      const autorEmail = user?.email || 'facilities@shopee.com';
      const autorCargo = user?.cargo || 'Facilities & CCM';

      let tipo: TipoAcaoAuditoria = 'OS_STATUS_ALTERADO';
      let acaoTitulo = `Status alterado para "${newStatus}"`;

      if (newStatus === 'Em Atendimento') {
        tipo = 'OS_STATUS_EM_ANDAMENTO';
        acaoTitulo = 'OS colocada Em Atendimento (Em Andamento)';
      } else if (newStatus === 'Encerrado' || newStatus === 'Concluído') {
        tipo = 'OS_STATUS_ENCERRADO';
        acaoTitulo = 'OS encerrada e normalizada';
      } else if (newStatus === 'Cancelado') {
        tipo = 'OS_STATUS_CANCELADO';
        acaoTitulo = 'OS cancelada';
      }

      return addLog({
        tipo,
        usuarioNome: autorNome,
        usuarioEmail: autorEmail,
        usuarioCargo: autorCargo,
        entidade: 'OS',
        entidadeId: incident.id_automatico || incident.id,
        titulo: `${acaoTitulo} (${incident.protocolo || incident.id})`,
        detalhes: `Status gerencial da ocorrência ${incident.id} (${incident.unidade} - ${incident.equipamento_afetado || incident.sistema}) alterado de "${oldStatus}" para "${newStatus}" por ${autorNome}.${motivo ? ` Motivo/Observação: "${motivo}".` : ''}`,
        valorAnterior: oldStatus,
        valorNovo: newStatus
      });
    },
    [addLog]
  );

  // Intercepta e registra anotações e histórico da OS
  const logIncidentNote = useCallback(
    (incident: Incident, note: string, user: AppUser | null): RegistroAuditoria => {
      const autorNome = user?.nome || 'Acompanhamento CCM';
      const autorEmail = user?.email || 'facilities@shopee.com';
      const autorCargo = user?.cargo || 'Central de Acionamento';

      return addLog({
        tipo: 'OS_NOTA_ADICIONADA',
        usuarioNome: autorNome,
        usuarioEmail: autorEmail,
        usuarioCargo: autorCargo,
        entidade: 'OS',
        entidadeId: incident.id_automatico || incident.id,
        titulo: `Anotação inserida na OS ${incident.protocolo || incident.id}`,
        detalhes: `Nota registrada por ${autorNome}: "${note}".`,
        valorNovo: note
      });
    },
    [addLog]
  );

  // Intercepta e registra alterações de Cadastro (CDs, HUBs, SOCs)
  const logCadastroChange = useCallback(
    (
      unidade: string,
      action: 'create' | 'update' | 'delete',
      details: string,
      user: AppUser | null,
      oldVal?: string,
      newVal?: string
    ): RegistroAuditoria => {
      const autorNome = user?.nome || 'Administrador de Cadastro';
      const autorEmail = user?.email || 'facilities@shopee.com';
      const autorCargo = user?.cargo || 'Gestor de Facilities';

      const tipo: TipoAcaoAuditoria =
        action === 'create'
          ? 'CADASTRO_CRIADO'
          : action === 'delete'
          ? 'CADASTRO_REMOVIDO'
          : 'CADASTRO_ATUALIZADO';

      const titulos: Record<string, string> = {
        create: `Nova unidade cadastrada (${unidade})`,
        update: `Atualização cadastral da unidade ${unidade}`,
        delete: `Unidade removida do cadastro (${unidade})`
      };

      return addLog({
        tipo,
        usuarioNome: autorNome,
        usuarioEmail: autorEmail,
        usuarioCargo: autorCargo,
        entidade: 'CADASTRO',
        entidadeId: unidade,
        titulo: titulos[action] || `Alteração em Cadastro (${unidade})`,
        detalhes: details,
        valorAnterior: oldVal,
        valorNovo: newVal
      });
    },
    [addLog]
  );

  // Intercepta e registra alterações no Cadastro de Usuários
  const logUserChange = useCallback(
    (
      targetUser: AppUser,
      action: 'create' | 'update' | 'delete',
      user: AppUser | null,
      details?: string
    ): RegistroAuditoria => {
      const autorNome = user?.nome || 'Administrador de Sistema';
      const autorEmail = user?.email || 'admin.facilities@shopee.com';
      const autorCargo = user?.cargo || 'Administrador';

      const tipo: TipoAcaoAuditoria =
        action === 'create'
          ? 'USUARIO_CRIADO'
          : action === 'delete'
          ? 'USUARIO_REMOVIDO'
          : 'USUARIO_ATUALIZADO';

      const titulos: Record<string, string> = {
        create: `Novo usuário cadastrado: ${targetUser.nome}`,
        update: `Dados do usuário ${targetUser.nome} atualizados`,
        delete: `Usuário ${targetUser.nome} desativado/removido`
      };

      const defaultDetails =
        action === 'create'
          ? `Usuário ${targetUser.nome} (${targetUser.email}) criado com cargo "${targetUser.cargo}", regional "${targetUser.regional}". Unidades vinculadas: ${targetUser.acessoTodos ? 'Acesso Total (Todos os 63 CDs/HUBs/SOCs)' : `${targetUser.unidadesPermitidas?.length || 0} unidades selecionadas`}.`
          : action === 'update'
          ? `Permissões e cadastro do usuário ${targetUser.nome} (${targetUser.email}) atualizados. Unidades: ${targetUser.acessoTodos ? 'Acesso Total' : `${targetUser.unidadesPermitidas?.length || 0} unidades vinculadas`}.`
          : `Usuário ${targetUser.nome} (${targetUser.email}) removido da base operacional.`;

      return addLog({
        tipo,
        usuarioNome: autorNome,
        usuarioEmail: autorEmail,
        usuarioCargo: autorCargo,
        entidade: 'USUARIO',
        entidadeId: targetUser.id || targetUser.email,
        titulo: titulos[action] || `Alteração de Usuário (${targetUser.nome})`,
        detalhes: details || defaultDetails,
        valorNovo: targetUser.cargo
      });
    },
    [addLog]
  );

  // Registra Login de Usuário
  const logLogin = useCallback(
    (user: AppUser): RegistroAuditoria => {
      const unidadesDesc = user.acessoTodos
        ? 'Acesso Geral (Todos os CDs, HUBs e SOCs)'
        : `${user.unidadesPermitidas?.length || 0} unidades vinculadas`;

      return addLog({
        tipo: 'LOGIN_EFETUADO',
        usuarioNome: user.nome,
        usuarioEmail: user.email,
        usuarioCargo: user.cargo,
        entidade: 'SISTEMA',
        entidadeId: user.id || 'SESSAO',
        titulo: `Login realizado: ${user.nome}`,
        detalhes: `Sessão autenticada no Sistema de Facilities & CCM por ${user.nome} (${user.email}) - Cargo: ${user.cargo}. Regional: ${user.regional}. Permissão: ${unidadesDesc}. Rastreabilidade total ativada para todas as alterações.`
      });
    },
    [addLog]
  );

  // Registra Logout de Usuário
  const logLogout = useCallback(
    (user: AppUser): RegistroAuditoria => {
      return addLog({
        tipo: 'LOGOUT_EFETUADO',
        usuarioNome: user.nome,
        usuarioEmail: user.email,
        usuarioCargo: user.cargo,
        entidade: 'SISTEMA',
        entidadeId: user.id || 'SESSAO',
        titulo: `Logout efetuado: ${user.nome}`,
        detalhes: `Sessão de ${user.nome} finalizada. Rastreabilidade mantida no histórico local.`
      });
    },
    [addLog]
  );

  // Limpar logs com confirmação
  const clearLogs = useCallback(() => {
    setLogs([]);
    try {
      localStorage.removeItem(AUDIT_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  // Exportar logs para CSV
  const exportLogsCsv = useCallback(() => {
    const headers = [
      'ID Auditoria',
      'Data/Hora ISO',
      'Data Formatada',
      'Tipo de Ação',
      'Entidade',
      'ID da Ocorrência/Entidade',
      'Nome do Autor',
      'E-mail do Autor',
      'Cargo do Autor',
      'Título da Ação',
      'Detalhes Completos',
      'Valor Anterior',
      'Valor Novo'
    ];

    const rows = logs.map((log) => [
      `"${log.id}"`,
      `"${log.timestamp}"`,
      `"${new Date(log.timestamp).toLocaleString('pt-BR')}"`,
      `"${log.tipo}"`,
      `"${log.entidade}"`,
      `"${log.entidadeId}"`,
      `"${log.usuarioNome.replace(/"/g, '""')}"`,
      `"${log.usuarioEmail.replace(/"/g, '""')}"`,
      `"${log.usuarioCargo.replace(/"/g, '""')}"`,
      `"${log.titulo.replace(/"/g, '""')}"`,
      `"${log.detalhes.replace(/"/g, '""')}"`,
      `"${(log.valorAnterior || '').replace(/"/g, '""')}"`,
      `"${(log.valorNovo || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Auditoria_Facilities_Shopee_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [logs]);

  return {
    logs,
    addLog,
    logIncidentCreation,
    logIncidentStatusChange,
    logIncidentNote,
    logCadastroChange,
    logUserChange,
    logLogin,
    logLogout,
    clearLogs,
    exportLogsCsv
  };
}
