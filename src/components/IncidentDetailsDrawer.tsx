import React, { useState } from 'react';
import {
  X,
  Clock,
  Building,
  User,
  Wrench,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Send,
  Calendar,
  ShieldAlert,
  ArrowRight,
  Zap,
  RotateCcw
} from 'lucide-react';
import { Incident, StatusGerencial } from '../types/facilities';

interface IncidentDetailsDrawerProps {
  incident: Incident | null;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: any) => void;
  onAddHistoryNote: (id: string, note: string) => void;
}

export const IncidentDetailsDrawer: React.FC<IncidentDetailsDrawerProps> = ({
  incident,
  onClose,
  onUpdateStatus,
  onAddHistoryNote
}) => {
  const [newNote, setNewNote] = useState('');

  if (!incident) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddHistoryNote(incident.id, newNote.trim());
    setNewNote('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-[#EE4D2D]">
                {incident.id_automatico || incident.id}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {incident.numero_manusis || incident.protocolo}
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  incident.criticidade === 1
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : incident.criticidade === 2
                    ? 'bg-orange-100 text-orange-700 border border-orange-200'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {incident.faixa_criticidade || `C${incident.criticidade}`}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">
              {incident.equipamento_afetado || incident.sistema}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>{incident.unidade}</span>
              <span aria-hidden="true">·</span>
              <span>{incident.cidade} ({incident.regiao})</span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-slate-700">{incident.sistema}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="p-5 space-y-5 flex-1 text-xs">
          {/* Responsável pela Abertura da OS (Auditoria de Quem Abriu) */}
          <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50/60 rounded-xl border border-blue-200/80 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-900 block tracking-wider">
                  Responsável pela Abertura da OS
                </span>
                <p className="font-bold text-slate-900 text-xs mt-0.5">
                  {incident.aberto_por_usuario || incident.solicitante || 'Ricardo Alonso (ricardomedalonso@gmail.com)'}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-blue-700 font-medium">
                  <span>{incident.aberto_por_cargo || 'Líder Operações SL / CCM'}</span>
                  {incident.aberto_por_email && (
                    <>
                      <span>·</span>
                      <span className="font-mono text-slate-500">{incident.aberto_por_email}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-500 block font-mono">
                {incident.data_hora_abertura ? new Date(incident.data_hora_abertura).toLocaleString('pt-BR') : incident.data}
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded font-bold text-[10px] inline-block mt-0.5">
                Rastreabilidade Ativa
              </span>
            </div>
          </div>

          {/* Status & SLA Badge Bar */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                Status Gerencial
              </span>
              <select
                value={incident.status_gerencial}
                onChange={(e) =>
                  onUpdateStatus(incident.id, e.target.value as StatusGerencial)
                }
                className="font-bold text-xs bg-white border border-slate-300 rounded-md px-2 py-1 text-slate-900 focus:outline-none focus:border-[#EE4D2D]"
              >
                <option value="Aberto">Aberto</option>
                <option value="Em Atendimento">Em Atendimento</option>
                <option value="Aguardando Peças">Aguardando Peças</option>
                <option value="Encerrado">Encerrado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                SLA Gerencial
              </span>
              <span
                className={`font-mono font-bold text-xs ${
                  incident.sla_gerencial === 'Dentro do SLA'
                    ? 'text-emerald-600'
                    : 'text-red-600'
                }`}
              >
                {incident.sla_gerencial}
              </span>
              {incident.alerta_sla && (
                <span className="text-[10px] text-slate-400 block font-mono">
                  {incident.alerta_sla}
                </span>
              )}
            </div>
          </div>

          {/* Time Tracking (Abertura, Acionamento, Normalizacao, MTTA, MTTR) */}
          <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2">
            <span className="text-[10px] uppercase font-bold text-blue-900 tracking-wider block">
              Tempos Operacionais (Power Query M &amp; DAX)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 text-[10px] block">Abertura:</span>
                <strong className="text-slate-800 font-mono">
                  {incident.hora_abertura || (incident.data_abertura ? incident.data_abertura.slice(11, 16) : '')}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Acionamento:</span>
                <strong className="text-slate-800 font-mono">
                  {incident.hora_acionamento || '-'}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">MTTA (min):</span>
                <strong
                  className={`font-mono ${
                    (incident.mtta_min || 0) <= 15 ? 'text-emerald-700' : 'text-red-600'
                  }`}
                >
                  {incident.mtta_min !== null ? `${incident.mtta_min} min` : '-'}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">MTTR (h):</span>
                <strong className="text-slate-800 font-mono">
                  {incident.mttr_h !== null ? `${incident.mttr_h.toFixed(1)} h` : '-'}
                </strong>
              </div>
            </div>
          </div>

          {/* Description & Applied Action */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Descrição da Ocorrência</span>
            </h4>
            <p className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 leading-relaxed">
              {incident.descricao_ocorrencia || incident.descricao}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-slate-500" />
              <span>Ação Executada</span>
            </h4>
            <p className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 leading-relaxed">
              {incident.acao_executada || 'Ação em execução pela equipe técnica.'}
            </p>
          </div>

          {/* Causa Raiz & Ação Preventiva */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Causa Raiz
              </span>
              <p className="text-slate-700 text-[11px]">
                {incident.causa_raiz || 'Em análise técnica.'}
              </p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Ação Preventiva
              </span>
              <p className="text-slate-700 text-[11px]">
                {incident.acao_preventiva || 'A ser definida após conclusão.'}
              </p>
            </div>
          </div>

          {/* Financial & Responsáveis */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Valor SPOT (R$)
              </span>
              <span className="text-base font-bold text-slate-900 font-mono">
                R$ {incident.valor_spot.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Reincidente 30d:{' '}
                <strong className={incident.reincidente === 'Sim' ? 'text-purple-700' : 'text-slate-600'}>
                  {incident.reincidente}
                </strong>
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Responsáveis
              </span>
              <span className="font-semibold text-slate-800 block truncate">
                {incident.fornecedor}
              </span>
              <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                {incident.responsavel_acompanhamento || incident.solicitante}
              </span>
            </div>
          </div>

          {/* Timeline History */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Histórico &amp; Atualizações
            </h4>
            <div className="space-y-3 relative pl-4 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {incident.historico && incident.historico.length > 0 ? (
                incident.historico.map((h, i) => (
                  <div key={i} className="relative text-xs space-y-0.5">
                    <span className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-[#EE4D2D] border-2 border-white"></span>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-800">{h.autor}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(h.data).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{h.acao}</p>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 text-xs">Registro inicial da ocorrência.</div>
              )}
            </div>

            {/* Add note input */}
            <form onSubmit={handleAddNote} className="mt-4 flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Registrar anotação de acompanhamento..."
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#EE4D2D]"
              />
              <button
                type="submit"
                disabled={!newNote.trim()}
                className="px-3 py-1.5 bg-[#EE4D2D] hover:bg-[#d84223] disabled:opacity-50 text-white rounded-lg font-medium text-xs flex items-center gap-1 transition-colors"
              >
                <Send className="w-3 h-3" />
                <span>Salvar</span>
              </button>
            </form>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Data: {incident.data || (incident.data_abertura ? incident.data_abertura.slice(0, 10) : '')}</span>
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
