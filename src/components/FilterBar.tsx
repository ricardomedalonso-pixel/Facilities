import React from 'react';
import {
  Search,
  Filter,
  XCircle,
  Calendar,
  Layers,
  MapPin,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { FilterState } from '../types/facilities';
import { CATEGORIAS, UNIDADES_LISTA, REGIONAIS } from '../data/mockFacilitiesData';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalCount: number;
  filteredCount: number;
  onResetFilters: () => void;
  availableUnits?: string[];
  availableRegionals?: string[];
  availableSistemas?: string[];
  availableFornecedores?: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  totalCount,
  filteredCount,
  onResetFilters,
  availableUnits,
  availableRegionals,
  availableSistemas,
  availableFornecedores
}) => {
  const isFiltered =
    filters.search !== '' ||
    filters.unidade !== '' ||
    filters.regional !== '' ||
    filters.sistema !== '' ||
    filters.categoria !== '' ||
    filters.fornecedor !== '' ||
    filters.criticidade !== '' ||
    filters.statusGerencial !== '' ||
    filters.slaGerencial !== '' ||
    filters.reincidente !== '' ||
    filters.alertaNivel !== '' ||
    filters.periodo !== 'all';

  const unitsList = availableUnits && availableUnits.length > 0 ? availableUnits : UNIDADES_LISTA;
  const regionalsList = availableRegionals && availableRegionals.length > 0 ? availableRegionals : REGIONAIS;
  const sistemasList = availableSistemas && availableSistemas.length > 0 ? availableSistemas : CATEGORIAS;
  const fornecedoresList = availableFornecedores || [];

  return (
    <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        {/* Row 1: Search + Quick Period Segments + Reset */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              placeholder="Buscar em FatoOcorrencias (protocolo, fornecedor, equipamento, etc.)..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]/20 focus:border-[#EE4D2D] transition-all"
            />
            {filters.search && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Period Segmented Buttons (Calendar / DimData context) */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setFilters((prev) => ({ ...prev, periodo: '7d' }))}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filters.periodo === '7d'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                7 Dias
              </button>
              <button
                onClick={() => setFilters((prev) => ({ ...prev, periodo: '30d' }))}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filters.periodo === '30d'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                30 Dias
              </button>
              <button
                onClick={() => setFilters((prev) => ({ ...prev, periodo: '90d' }))}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filters.periodo === '90d'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                90 Dias
              </button>
              <button
                onClick={() => setFilters((prev) => ({ ...prev, periodo: 'all' }))}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filters.periodo === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                DimData Todos
              </button>
            </div>

            {/* Clear filters */}
            {isFiltered && (
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-[#EE4D2D] hover:bg-orange-50 rounded-md transition-colors"
                title="Limpar todos os filtros aplicados"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpar Slicers</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Slicers matching DAX Schema */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">
          {/* Unidade */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Unidade (Hub)
            </label>
            <select
              value={filters.unidade}
              onChange={(e) => setFilters((prev) => ({ ...prev, unidade: e.target.value }))}
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:border-[#EE4D2D] text-xs truncate"
            >
              {unitsList.map((u) => (
                <option key={u} value={u === 'Todas as Unidades' ? '' : u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Regional */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Regional
            </label>
            <select
              value={filters.regional}
              onChange={(e) => setFilters((prev) => ({ ...prev, regional: e.target.value }))}
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:border-[#EE4D2D] text-xs truncate"
            >
              {regionalsList.map((r) => (
                <option key={r} value={r === 'Todas as Regiões' ? '' : r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Sistema / Categoria */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Sistema / Categoria
            </label>
            <select
              value={filters.sistema || filters.categoria}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sistema: e.target.value,
                  categoria: e.target.value
                }))
              }
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:border-[#EE4D2D] text-xs truncate"
            >
              {sistemasList.map((s) => (
                <option key={s} value={s === 'Todos os Sistemas' ? '' : s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Criticidade C1 a C4 */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Criticidade
            </label>
            <select
              value={filters.criticidade}
              onChange={(e) => setFilters((prev) => ({ ...prev, criticidade: e.target.value }))}
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:border-[#EE4D2D] text-xs truncate"
            >
              <option value="">Todas (C1 a C4)</option>
              <option value="1">C1 (Crítico Parada)</option>
              <option value="2">C2 (Alta Urgência)</option>
              <option value="3">C3 (Média)</option>
              <option value="4">C4 (Baixa)</option>
            </select>
          </div>

          {/* Status Gerencial */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Status Gerencial
            </label>
            <select
              value={filters.statusGerencial}
              onChange={(e) => setFilters((prev) => ({ ...prev, statusGerencial: e.target.value }))}
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:border-[#EE4D2D] text-xs truncate"
            >
              <option value="">Todos</option>
              <option value="Encerrado">Encerrado</option>
              <option value="Em Aberto">Em Aberto</option>
              <option value="Em Atendimento">Em Atendimento</option>
              <option value="Aguardando Peças">Aguardando Peças</option>
            </select>
          </div>

          {/* SLA Gerencial */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              SLA Gerencial
            </label>
            <select
              value={filters.slaGerencial}
              onChange={(e) => setFilters((prev) => ({ ...prev, slaGerencial: e.target.value }))}
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:border-[#EE4D2D] text-xs truncate"
            >
              <option value="">Todos</option>
              <option value="Dentro do SLA">Dentro do SLA</option>
              <option value="Fora do SLA">Fora do SLA</option>
            </select>
          </div>

          {/* Reincidente */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Reincidente (30d)
            </label>
            <select
              value={filters.reincidente}
              onChange={(e) => setFilters((prev) => ({ ...prev, reincidente: e.target.value }))}
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:border-[#EE4D2D] text-xs truncate"
            >
              <option value="">Todos</option>
              <option value="Sim">Sim (Reincidentes)</option>
              <option value="Não">Não</option>
            </select>
          </div>

          {/* Prioridade Alerta */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Prioridade Alerta
            </label>
            <select
              value={filters.alertaNivel}
              onChange={(e) => setFilters((prev) => ({ ...prev, alertaNivel: e.target.value }))}
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:border-[#EE4D2D] text-xs truncate"
            >
              <option value="">Todos os Níveis</option>
              <option value="4">Nível 4 (SLA Estourado)</option>
              <option value="alertas">Níveis ≥ 2 (Alertas SLA)</option>
              <option value="1">Nível 1 (Normal)</option>
            </select>
          </div>
        </div>

        {/* Filter Summary Counter */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-slate-700">Contexto de Filtro VertiPaq:</span>
            <span>
              Exibindo <strong className="text-slate-900">{filteredCount}</strong> de {totalCount} ocorrências
            </span>
          </div>
          {isFiltered && (
            <span className="text-[#EE4D2D] font-medium">
              Slicers ativos filtrando medidas DAX
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
