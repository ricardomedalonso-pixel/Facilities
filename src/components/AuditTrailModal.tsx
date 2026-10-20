import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  X,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Clock,
  ArrowRight,
  FileText,
  Building2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  Activity
} from 'lucide-react';
import { RegistroAuditoria, TipoAcaoAuditoria } from '../types/facilities';

interface AuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: RegistroAuditoria[];
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({
  isOpen,
  onClose,
  logs
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<string>('TODOS');
  const [selectedUser, setSelectedUser] = useState<string>('TODOS');

  if (!isOpen) return null;

  const usersList = Array.from(new Set(logs.map((l) => l.usuarioNome))).sort();

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (selectedTipo !== 'TODOS') {
        if (selectedTipo === 'OS' && !log.tipo.startsWith('OS_')) return false;
        if (selectedTipo === 'OS_ABERTURA' && log.tipo !== 'OS_ABERTURA') return false;
        if (
          selectedTipo === 'OS_STATUS' &&
          log.tipo !== 'OS_STATUS_EM_ANDAMENTO' &&
          log.tipo !== 'OS_STATUS_ENCERRADO' &&
          log.tipo !== 'OS_STATUS_CANCELADO' &&
          log.tipo !== 'OS_STATUS_ALTERADO'
        )
          return false;
        if (selectedTipo === 'CADASTRO' && !log.tipo.startsWith('CADASTRO_')) return false;
        if (selectedTipo === 'USUARIO' && !log.tipo.startsWith('USUARIO_')) return false;
        if (selectedTipo === 'LOGIN' && log.tipo !== 'LOGIN_EFETUADO' && log.tipo !== 'LOGOUT_EFETUADO') return false;
      }

      if (selectedUser !== 'TODOS' && log.usuarioNome !== selectedUser) {
        return false;
      }

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matches =
          log.titulo.toLowerCase().includes(query) ||
          log.detalhes.toLowerCase().includes(query) ||
          log.entidadeId.toLowerCase().includes(query) ||
          log.usuarioNome.toLowerCase().includes(query) ||
          log.usuarioEmail.toLowerCase().includes(query);
        if (!matches) return false;
      }

      return true;
    });
  }, [logs, selectedTipo, selectedUser, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const total = logs.length;
    const osAbertas = logs.filter((l) => l.tipo === 'OS_ABERTURA').length;
    const osStatus = logs.filter((l) => l.tipo.startsWith('OS_STATUS_')).length;
    const cadastro = logs.filter((l) => l.tipo.startsWith('CADASTRO_')).length;
    return { total, osAbertas, osStatus, cadastro };
  }, [logs]);

  const handleExportCsv = () => {
    const headers = [
      'Data/Hora (ISO)',
      'Data Formatada',
      'Tipo de Acao',
      'Entidade',
      'ID Entidade / OS',
      'Usuario Nome',
      'Usuario Email',
      'Usuario Cargo',
      'Titulo',
      'Detalhes',
      'Valor Anterior',
      'Valor Novo'
    ];

    const rows = filteredLogs.map((l) => [
      l.timestamp,
      new Date(l.timestamp).toLocaleString('pt-BR'),
      l.tipo,
      l.entidade,
      l.entidadeId,
      `"${l.usuarioNome}"`,
      l.usuarioEmail,
      `"${l.usuarioCargo}"`,
      `"${l.titulo.replace(/"/g, '""')}"`,
      `"${l.detalhes.replace(/"/g, '""')}"`,
      `"${l.valorAnterior || ''}"`,
      `"${l.valorNovo || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Auditoria_Facilities_Shopee_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTipoBadge = (tipo: TipoAcaoAuditoria) => {
    switch (tipo) {
      case 'OS_ABERTURA':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          label: 'Abertura de OS'
        };
      case 'OS_STATUS_EM_ANDAMENTO':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          label: 'OS Em Andamento'
        };
      case 'OS_STATUS_ENCERRADO':
        return {
          bg: 'bg-purple-100 text-purple-800 border-purple-300',
          label: 'OS Encerrada'
        };
      case 'OS_STATUS_CANCELADO':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          label: 'OS Cancelada'
        };
      case 'OS_STATUS_ALTERADO':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          label: 'Status OS'
        };
      case 'OS_NOTA_ADICIONADA':
        return {
          bg: 'bg-sky-100 text-sky-800 border-sky-300',
          label: 'Anotação / Nota na OS'
        };
      case 'CADASTRO_CRIADO':
        return {
          bg: 'bg-teal-100 text-teal-800 border-teal-300',
          label: 'Novo Cadastro CD/Hub'
        };
      case 'CADASTRO_ATUALIZADO':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          label: 'Cadastro Atualizado'
        };
      case 'CADASTRO_REMOVIDO':
        return {
          bg: 'bg-red-100 text-red-800 border-red-300',
          label: 'Cadastro Removido'
        };
      case 'USUARIO_CRIADO':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          label: 'Novo Usuário Cadastrado'
        };
      case 'USUARIO_ATUALIZADO':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          label: 'Usuário Atualizado'
        };
      case 'USUARIO_REMOVIDO':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          label: 'Usuário Removido'
        };
      case 'LOGIN_EFETUADO':
        return {
          bg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
          label: 'Login Efetuado'
        };
      case 'LOGOUT_EFETUADO':
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          label: 'Logout Efetuado'
        };
      case 'EMAIL_ALERTA_ENVIADO':
        return {
          bg: 'bg-orange-100 text-orange-800 border-orange-300',
          label: 'Alerta E-mail'
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          label: tipo
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0b1329] via-[#172554] to-[#1e1b4b] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600/30 p-2.5 shadow-md flex items-center justify-center border border-white/20 shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full inline-block border border-emerald-400/30">
                  Rastreabilidade Total &amp; Compliance
                </span>
                <span className="text-xs text-blue-200 font-mono">
                  {filteredLogs.length} ações registradas
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                Trilha de Auditoria &amp; Histórico de Alterações
              </h3>
              <p className="text-xs text-blue-200">
                Registro imutável de quem abriu OS, mudou status ou alterou cadastros.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats Bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total de Ações</span>
            <span className="text-lg font-bold text-slate-800">{stats.total}</span>
          </div>
          <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs">
            <span className="text-[10px] text-emerald-600 uppercase font-bold block">Aberturas de OS</span>
            <span className="text-lg font-bold text-emerald-600">{stats.osAbertas}</span>
          </div>
          <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs">
            <span className="text-[10px] text-blue-600 uppercase font-bold block">Mudanças de Status</span>
            <span className="text-lg font-bold text-blue-600">{stats.osStatus}</span>
          </div>
          <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs">
            <span className="text-[10px] text-amber-600 uppercase font-bold block">Ações em Cadastro</span>
            <span className="text-lg font-bold text-amber-600">{stats.cadastro}</span>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="p-3.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por OS, Usuário, E-mail ou Descrição..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#EE4D2D]"
              />
            </div>

            {/* Filter by Category */}
            <select
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
              className="py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 text-xs font-medium focus:border-[#EE4D2D]"
            >
              <option value="TODOS">Todos os Tipos de Ação</option>
              <option value="OS">Todas as Ações em OS</option>
              <option value="OS_ABERTURA">🟢 Somente Aberturas de OS</option>
              <option value="OS_STATUS">🔵 Mudanças de Status (Andamento/Fim)</option>
              <option value="CADASTRO">🏢 Alterações em Cadastro (CDs/Hubs)</option>
              <option value="USUARIO">👥 Ações em Usuários (Cadastro/Permissões)</option>
              <option value="LOGIN">🔑 Logins &amp; Sessões</option>
            </select>

            {/* Filter by User */}
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 text-xs font-medium focus:border-[#EE4D2D]"
            >
              <option value="TODOS">Todos os Usuários ({usersList.length})</option>
              {usersList.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Exportar CSV</span>
          </button>
        </div>

        {/* Logs Timeline Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3 bg-slate-50/60">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
              <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              Nenhum registro de auditoria encontrado para os filtros selecionados.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const badge = getTipoBadge(log.tipo);
              const dateFormatted = new Date(log.timestamp).toLocaleString('pt-BR');

              return (
                <div
                  key={log.id}
                  className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${badge.bg}`}
                      >
                        {badge.label}
                      </span>
                      <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {log.entidadeId}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {dateFormatted}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900">
                      {log.titulo}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {log.detalhes}
                    </p>

                    {(log.valorAnterior || log.valorNovo) && (
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center gap-2 text-[11px] text-slate-700 font-mono">
                        <span className="text-slate-400">Status Anterior:</span>
                        <span className="font-semibold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          {log.valorAnterior || '—'}
                        </span>
                        <ArrowRight className="w-3 h-3 text-[#EE4D2D]" />
                        <span className="text-slate-400">Novo Status:</span>
                        <span className="font-bold text-[#EE4D2D] bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
                          {log.valorNovo || '—'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Usuário Responsável Box */}
                  <div className="sm:text-right shrink-0 p-2.5 bg-slate-50 rounded-lg border border-slate-200/60 min-w-[180px]">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Ação executada por:
                    </span>
                    <strong className="text-xs text-slate-900 block font-bold mt-0.5 flex items-center sm:justify-end gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{log.usuarioNome}</span>
                    </strong>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      {log.usuarioEmail}
                    </span>
                    <span className="text-[10px] text-slate-600 font-medium block mt-0.5">
                      {log.usuarioCargo}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Auditoria contínua de operações Facilities Shopee</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
