import React, { useState } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';
import { Incident, StatusGerencial } from '../types/facilities';

interface IncidentsTableViewProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onUpdateStatus: (id: string, newStatus: any) => void;
  onExportCsv: () => void;
}

type SortField =
  | 'id'
  | 'data'
  | 'unidade'
  | 'regiao'
  | 'criticidade'
  | 'prioridade_alerta'
  | 'sla_gerencial'
  | 'mtta_min'
  | 'mttr_h'
  | 'valor_spot'
  | 'reincidente'
  | 'status_gerencial';

export const IncidentsTableView: React.FC<IncidentsTableViewProps> = ({
  incidents,
  onSelectIncident,
  onUpdateStatus,
  onExportCsv
}) => {
  const [sortField, setSortField] = useState<SortField>('data');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedIncidents = [...incidents].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (sortField === 'data') {
      aVal = new Date(a.data_hora_abertura || a.data_abertura || a.data).getTime();
      bVal = new Date(b.data_hora_abertura || b.data_abertura || b.data).getTime();
    }

    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedIncidents.length / itemsPerPage) || 1;
  const paginatedItems = sortedIncidents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Tabela FatoOcorrencias ({incidents.length} registros)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Estrutura idêntica ao modelo tabular do Power BI com colunas gerenciais
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Baixar CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
            <tr>
              <th
                onClick={() => handleSort('id')}
                className="py-3 px-3 font-semibold cursor-pointer hover:text-slate-800"
              >
                <div className="flex items-center gap-1">
                  <span>ID / Protocolo</span>
                  {sortField === 'id' && (sortAsc ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                </div>
              </th>
              <th
                onClick={() => handleSort('data')}
                className="py-3 px-3 font-semibold cursor-pointer hover:text-slate-800"
              >
                <div className="flex items-center gap-1">
                  <span>Data</span>
                  {sortField === 'data' && (sortAsc ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                </div>
              </th>
              <th
                onClick={() => handleSort('unidade')}
                className="py-3 px-3 font-semibold cursor-pointer hover:text-slate-800"
              >
                <div className="flex items-center gap-1">
                  <span>Unidade &amp; Região</span>
                  {sortField === 'unidade' && (sortAsc ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                </div>
              </th>
              <th
                onClick={() => handleSort('criticidade')}
                className="py-3 px-3 font-semibold cursor-pointer hover:text-slate-800 text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Criticidade</span>
                  {sortField === 'criticidade' && (sortAsc ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                </div>
              </th>
              <th
                onClick={() => handleSort('prioridade_alerta')}
                className="py-3 px-3 font-semibold cursor-pointer hover:text-slate-800 text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Alerta</span>
                  {sortField === 'prioridade_alerta' && (sortAsc ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                </div>
              </th>
              <th
                onClick={() => handleSort('sla_gerencial')}
                className="py-3 px-3 font-semibold cursor-pointer hover:text-slate-800"
              >
                <div className="flex items-center gap-1">
                  <span>SLA Gerencial</span>
                  {sortField === 'sla_gerencial' && (sortAsc ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                </div>
              </th>
              <th
                onClick={() => handleSort('mtta_min')}
                className="py-3 px-3 font-semibold cursor-pointer hover:text-slate-800 text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>MTTA</span>
                  {sortField === 'mtta_min' && (sortAsc ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                </div>
              </th>
              <th
                onClick={() => handleSort('mttr_h')}
                className="py-3 px-3 font-semibold cursor-pointer hover:text-slate-800 text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>MTTR</span>
                  {sortField === 'mttr_h' && (sortAsc ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                </div>
              </th>
              <th
                onClick={() => handleSort('valor_spot')}
                className="py-3 px-3 font-semibold cursor-pointer hover:text-slate-800 text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Valor SPOT</span>
                  {sortField === 'valor_spot' && (sortAsc ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                </div>
              </th>
              <th
                onClick={() => handleSort('reincidente')}
                className="py-3 px-3 font-semibold cursor-pointer hover:text-slate-800 text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Reincidente</span>
                  {sortField === 'reincidente' && (sortAsc ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                </div>
              </th>
              <th
                onClick={() => handleSort('status_gerencial')}
                className="py-3 px-3 font-semibold cursor-pointer hover:text-slate-800"
              >
                <div className="flex items-center gap-1">
                  <span>Status Gerencial</span>
                  {sortField === 'status_gerencial' && (sortAsc ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                </div>
              </th>
              <th className="py-3 px-3 font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-8 text-center text-slate-400">
                  Nenhuma ocorrência encontrada com os filtros selecionados.
                </td>
              </tr>
            ) : (
              paginatedItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => onSelectIncident(item)}
                >
                  {/* ID / Protocolo */}
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    <div>{item.id}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{item.protocolo}</div>
                  </td>

                  {/* Data */}
                  <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-mono">
                    <div>{item.data || (item.data_abertura ? item.data_abertura.slice(0, 10) : '')}</div>
                    <div className="text-[10px] text-slate-400">
                      {item.hora_abertura || (item.data_abertura ? new Date(item.data_abertura).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '')}
                    </div>
                  </td>

                  {/* Unidade & Região */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          item.tipo_unidade === 'CD' || item.unidade.startsWith('SOC') || item.unidade.startsWith('FULL') || item.unidade.startsWith('CD')
                            ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {item.unidade.startsWith('SOC') ? 'SOC' : item.unidade.startsWith('FULL') || item.unidade.startsWith('CD') ? 'CD' : 'HUB'}
                      </span>
                      <span className="font-semibold text-slate-800">{item.unidade}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {item.regiao} {item.regional ? `· ${item.regional}` : ''}
                    </span>
                  </td>

                  {/* Criticidade */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span
                      className={`inline-block font-bold font-mono px-2 py-0.5 rounded text-[11px] ${
                        item.criticidade === 1
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : item.criticidade === 2
                          ? 'bg-orange-100 text-orange-700 border border-orange-200'
                          : item.criticidade === 3
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      C{item.criticidade}
                    </span>
                  </td>

                  {/* Prioridade Alerta */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span
                      className={`inline-block font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${
                        item.prioridade_alerta === 4
                          ? 'bg-red-600 text-white animate-pulse'
                          : item.prioridade_alerta >= 2
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.prioridade_alerta === 4 ? 'ESTOURADO' : `Nível ${item.prioridade_alerta}`}
                    </span>
                  </td>

                  {/* SLA Gerencial */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`font-semibold text-[11px] ${
                        item.sla_gerencial === 'Dentro do SLA'
                          ? 'text-emerald-700'
                          : 'text-red-700 font-bold'
                      }`}
                    >
                      {item.sla_gerencial}
                    </span>
                  </td>

                  {/* MTTA (min) */}
                  <td className="py-3 px-3 text-right font-mono whitespace-nowrap">
                    {item.mtta_min !== null ? (
                      <span
                        className={item.mtta_min <= 15 ? 'text-slate-800' : 'text-red-600 font-bold'}
                      >
                        {item.mtta_min} min
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>

                  {/* MTTR (h) */}
                  <td className="py-3 px-3 text-right font-mono whitespace-nowrap">
                    {item.mttr_h !== null ? (
                      <span>{item.mttr_h.toFixed(1)} h</span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>

                  {/* Valor SPOT */}
                  <td className="py-3 px-3 text-right font-mono font-semibold text-slate-900 whitespace-nowrap">
                    R$ {item.valor_spot.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>

                  {/* Reincidente */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span
                      className={`font-semibold text-[11px] ${
                        item.reincidente === 'Sim' ? 'text-purple-700' : 'text-slate-400'
                      }`}
                    >
                      {item.reincidente}
                    </span>
                  </td>

                  {/* Status Gerencial */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <select
                      value={item.status_gerencial}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        onUpdateStatus(item.id, e.target.value as StatusGerencial)
                      }
                      className={`text-xs font-medium rounded px-2 py-0.5 border ${
                        item.status_gerencial === 'Encerrado'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : item.status_gerencial === 'Em Atendimento'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : item.status_gerencial === 'Aguardando Peças'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-800 border-slate-300'
                      }`}
                    >
                      <option value="Encerrado">Encerrado</option>
                      <option value="Em Aberto">Em Aberto</option>
                      <option value="Em Atendimento">Em Atendimento</option>
                      <option value="Aguardando Peças">Aguardando Peças</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </td>

                  {/* Ações */}
                  <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onSelectIncident(item)}
                      title="Ver detalhes do chamado"
                      className="p-1 text-slate-400 hover:text-[#EE4D2D] hover:bg-orange-50 rounded transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <div>
          Página <strong className="text-slate-800">{currentPage}</strong> de{' '}
          <strong className="text-slate-800">{totalPages}</strong> (
          {sortedIncidents.length} ocorrências)
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1 rounded border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-mono text-slate-700">{currentPage}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1 rounded border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
