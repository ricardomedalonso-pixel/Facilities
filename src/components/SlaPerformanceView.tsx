import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  Zap,
  TrendingDown,
  BarChart3,
  ArrowUpDown,
  ArrowDownWideNarrow
} from 'lucide-react';
import { Incident } from '../types/facilities';

interface SlaPerformanceViewProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
}

export const SlaPerformanceView: React.FC<SlaPerformanceViewProps> = ({
  incidents,
  onSelectIncident
}) => {
  const [sortBy, setSortBy] = useState<
    'total' | 'foraSla' | 'dentroSla' | 'aderencia' | 'spotSum' | 'mtta' | 'mttr'
  >('total');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleToggleSort = (
    field: 'total' | 'foraSla' | 'dentroSla' | 'aderencia' | 'spotSum' | 'mtta' | 'mttr'
  ) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };
  // Criticidade C1 a C4 Matrix
  const criticidades = [1, 2, 3, 4] as const;

  const criticidadeStats = criticidades.map((c) => {
    const list = incidents.filter((i) => i.criticidade === c);
    const dentroSla = list.filter((i) => i.sla_gerencial === 'Dentro do SLA').length;
    const foraSla = list.filter((i) => i.sla_gerencial === 'Fora do SLA').length;
    const encerradas = list.filter((i) => i.status_gerencial === 'Encerrado').length;
    const abertas = list.filter((i) => i.status_gerencial !== 'Encerrado').length;
    const aderencia = dentroSla + foraSla > 0 ? (dentroSla / (dentroSla + foraSla)) * 100 : 100;

    const mttaValid = list.filter((i) => i.mtta_min !== null);
    const mttaAvg =
      mttaValid.length > 0
        ? mttaValid.reduce((acc, curr) => acc + (curr.mtta_min || 0), 0) / mttaValid.length
        : 0;

    const mttrValid = list.filter((i) => i.mttr_h !== null);
    const mttrAvg =
      mttrValid.length > 0
        ? mttrValid.reduce((acc, curr) => acc + (curr.mttr_h || 0), 0) / mttrValid.length
        : 0;

    const spotSum = list.reduce((acc, curr) => acc + (curr.valor_spot || 0), 0);

    return {
      nivel: c,
      label: c === 1 ? 'C1 (Emergência Parada)' : c === 2 ? 'C2 (Alta Urgência)' : c === 3 ? 'C3 (Média)' : 'C4 (Baixa)',
      metaSla: c === 1 ? '4h' : c === 2 ? '12h' : c === 3 ? '24h' : '48h',
      total: list.length,
      dentroSla,
      foraSla,
      encerradas,
      abertas,
      aderencia,
      mttaAvg,
      mttrAvg,
      spotSum
    };
  });

  // Rank Fornecedor Fora SLA (Official DAX)
  const fornecedorMap = new Map<
    string,
    { total: number; dentroSla: number; foraSla: number; mttaSum: number; mttaCount: number; mttrSum: number; mttrCount: number; spotSum: number }
  >();

  incidents.forEach((i) => {
    const entry = fornecedorMap.get(i.fornecedor) || {
      total: 0,
      dentroSla: 0,
      foraSla: 0,
      mttaSum: 0,
      mttaCount: 0,
      mttrSum: 0,
      mttrCount: 0,
      spotSum: 0
    };
    entry.total += 1;
    if (i.sla_gerencial === 'Dentro do SLA') entry.dentroSla += 1;
    if (i.sla_gerencial === 'Fora do SLA') entry.foraSla += 1;
    if (i.mtta_min !== null) {
      entry.mttaSum += i.mtta_min;
      entry.mttaCount += 1;
    }
    if (i.mttr_h !== null) {
      entry.mttrSum += i.mttr_h;
      entry.mttrCount += 1;
    }
    entry.spotSum += i.valor_spot || 0;
    fornecedorMap.set(i.fornecedor, entry);
  });

  const rankedFornecedores = Array.from(fornecedorMap.entries())
    .map(([fornecedor, data]) => {
      const base = data.dentroSla + data.foraSla;
      const aderencia = base > 0 ? (data.dentroSla / base) * 100 : 100;
      const mtta = data.mttaCount > 0 ? data.mttaSum / data.mttaCount : 0;
      const mttr = data.mttrCount > 0 ? data.mttrSum / data.mttrCount : 0;
      return {
        fornecedor,
        total: data.total,
        dentroSla: data.dentroSla,
        foraSla: data.foraSla,
        aderencia,
        mtta,
        mttr,
        spotSum: data.spotSum
      };
    })
    .sort((a, b) => {
      const dir = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'total') {
        if (b.total !== a.total) return (b.total - a.total) * (sortOrder === 'asc' ? -1 : 1);
        return b.foraSla - a.foraSla;
      }
      if (sortBy === 'foraSla') {
        if (b.foraSla !== a.foraSla) return (b.foraSla - a.foraSla) * (sortOrder === 'asc' ? -1 : 1);
        return b.total - a.total;
      }
      if (sortBy === 'dentroSla') {
        return (b.dentroSla - a.dentroSla) * (sortOrder === 'asc' ? -1 : 1);
      }
      if (sortBy === 'aderencia') {
        return (b.aderencia - a.aderencia) * (sortOrder === 'asc' ? -1 : 1);
      }
      if (sortBy === 'mtta') {
        return (a.mtta - b.mtta) * dir;
      }
      if (sortBy === 'mttr') {
        return (a.mttr - b.mttr) * dir;
      }
      if (sortBy === 'spotSum') {
        return (b.spotSum - a.spotSum) * (sortOrder === 'asc' ? -1 : 1);
      }
      return (b.total - a.total) * (sortOrder === 'asc' ? -1 : 1);
    });

  // Tickets with SLA Estourado (Prioridade Alerta = 4, Status <> Encerrado)
  const slaEstouradoTickets = incidents.filter(
    (i) => i.prioridade_alerta === 4 && i.status_gerencial !== 'Encerrado'
  );

  // Tickets with Alertas SLA (Prioridade Alerta >= 2, Status <> Encerrado)
  const alertaTickets = incidents.filter(
    (i) => i.prioridade_alerta >= 2 && i.status_gerencial !== 'Encerrado'
  );

  return (
    <div className="space-y-6">
      {/* Table: Criticidade C1 a C4 Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Matriz de Criticidade (DAX: C1, C2, C3, C4) &amp; Prazos</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Acompanhamento de MTTA (min), MTTR (h) e Aderência SLA por nível de gravidade
            </p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
            Meta MTTA: ≤ 15 min · Meta SLA: ≥ 95%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Nível</th>
                <th className="py-2.5 px-4 font-semibold">SLA Alvo</th>
                <th className="py-2.5 px-4 font-semibold text-center">Total</th>
                <th className="py-2.5 px-4 font-semibold text-center text-emerald-600">Dentro SLA</th>
                <th className="py-2.5 px-4 font-semibold text-center text-red-600">Fora SLA</th>
                <th className="py-2.5 px-4 font-semibold text-center text-amber-600">Em Aberto</th>
                <th className="py-2.5 px-4 font-semibold text-right">MTTA Médio</th>
                <th className="py-2.5 px-4 font-semibold text-right">MTTR Médio</th>
                <th className="py-2.5 px-4 font-semibold text-right">Aderência SLA %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {criticidadeStats.map((row) => (
                <tr key={row.nivel} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-medium flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        row.nivel === 1
                          ? 'bg-red-500'
                          : row.nivel === 2
                          ? 'bg-orange-500'
                          : row.nivel === 3
                          ? 'bg-blue-500'
                          : 'bg-slate-400'
                      }`}
                    ></span>
                    <strong className="text-slate-900">{row.label}</strong>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-600">
                    {row.metaSla}
                  </td>
                  <td className="py-3 px-4 text-center font-semibold">{row.total}</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">
                    {row.dentroSla}
                  </td>
                  <td className="py-3 px-4 text-center text-red-600 font-bold">
                    {row.foraSla}
                  </td>
                  <td className="py-3 px-4 text-center text-amber-600 font-bold">
                    {row.abertas}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    <span
                      className={`font-semibold ${
                        row.mttaAvg <= 15 ? 'text-emerald-700' : 'text-red-600'
                      }`}
                    >
                      {row.mttaAvg.toFixed(1)} min
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-800">
                    {row.mttrAvg.toFixed(1)} h
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        row.aderencia >= 95
                          ? 'bg-emerald-50 text-emerald-700'
                          : row.aderencia >= 90
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {row.aderencia.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table: Rank Fornecedor Fora SLA & Volume Total (DAX) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-slate-700" />
              <span>Rank Fornecedores por Volume Total de Chamados &amp; SLA</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Classificação descendente ordenada por quantidade total de chamados atendidos (DENSE) e aderência aos prazos
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <span className="text-[11px] font-medium text-slate-500 px-2 flex items-center gap-1">
              <ArrowDownWideNarrow className="w-3.5 h-3.5" />
              Ordenar:
            </span>
            <button
              onClick={() => handleToggleSort('total')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                sortBy === 'total'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              Total Chamados {sortBy === 'total' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button
              onClick={() => handleToggleSort('foraSla')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                sortBy === 'foraSla'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              Fora SLA {sortBy === 'foraSla' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button
              onClick={() => handleToggleSort('aderencia')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                sortBy === 'aderencia'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              Aderência % {sortBy === 'aderencia' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Rank</th>
                <th className="py-2.5 px-4 font-semibold">Fornecedor</th>
                <th
                  onClick={() => handleToggleSort('total')}
                  className="py-2.5 px-4 font-bold text-center text-blue-700 cursor-pointer hover:bg-blue-50 transition-colors select-none"
                  title="Clique para ordenar por Quantidade Total de Chamados"
                >
                  <div className="inline-flex items-center gap-1 justify-center">
                    <span>[TOTAL CHAMADOS]</span>
                    <ArrowUpDown className="w-3 h-3 text-blue-600" />
                  </div>
                </th>
                <th
                  onClick={() => handleToggleSort('foraSla')}
                  className="py-2.5 px-4 font-semibold text-center text-red-600 cursor-pointer hover:bg-red-50 transition-colors select-none"
                  title="Clique para ordenar por Fora SLA"
                >
                  <div className="inline-flex items-center gap-1 justify-center">
                    <span>[FORA SLA]</span>
                    <ArrowUpDown className="w-3 h-3 text-red-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleToggleSort('dentroSla')}
                  className="py-2.5 px-4 font-semibold text-center text-emerald-600 cursor-pointer hover:bg-emerald-50 transition-colors select-none"
                  title="Clique para ordenar por Dentro SLA"
                >
                  <div className="inline-flex items-center gap-1 justify-center">
                    <span>[DENTRO SLA]</span>
                    <ArrowUpDown className="w-3 h-3 text-emerald-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleToggleSort('aderencia')}
                  className="py-2.5 px-4 font-semibold text-right cursor-pointer hover:bg-slate-100 transition-colors select-none"
                  title="Clique para ordenar por Aderência SLA %"
                >
                  <div className="inline-flex items-center gap-1 justify-end">
                    <span>Aderência SLA %</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleToggleSort('mtta')}
                  className="py-2.5 px-4 font-semibold text-right cursor-pointer hover:bg-slate-100 transition-colors select-none"
                >
                  MTTA (min)
                </th>
                <th
                  onClick={() => handleToggleSort('mttr')}
                  className="py-2.5 px-4 font-semibold text-right cursor-pointer hover:bg-slate-100 transition-colors select-none"
                >
                  MTTR (h)
                </th>
                <th
                  onClick={() => handleToggleSort('spotSum')}
                  className="py-2.5 px-4 font-semibold text-right cursor-pointer hover:bg-slate-100 transition-colors select-none"
                >
                  SPOT Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {rankedFornecedores.map((sup, idx) => (
                <tr key={sup.fornecedor} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-500">#{idx + 1}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{sup.fornecedor}</td>
                  <td className="py-3 px-4 text-center font-mono">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 shadow-2xs">
                      {sup.total}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold font-mono text-red-600">
                    {sup.foraSla}
                  </td>
                  <td className="py-3 px-4 text-center font-bold font-mono text-emerald-600">
                    {sup.dentroSla}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold">
                    <span
                      className={
                        sup.aderencia >= 95
                          ? 'text-emerald-700'
                          : sup.aderencia >= 90
                          ? 'text-amber-700'
                          : 'text-red-700'
                      }
                    >
                      {sup.aderencia.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono">{sup.mtta.toFixed(1)}m</td>
                  <td className="py-3 px-4 text-right font-mono">{sup.mttr.toFixed(1)}h</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-800 font-semibold">
                    R$ {sup.spotSum.toLocaleString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 3: SLA Estourado & Alertas SLA Spotlight */}
      <div className="bg-white rounded-xl border border-red-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-red-50/60 border-b border-red-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <h3 className="text-sm font-bold text-red-900">
              SLA Estourado (Prioridade Alerta = 4) &amp; Alertas SLA (≥ 2)
            </h3>
          </div>
          <span className="text-xs text-red-700 font-medium">
            {slaEstouradoTickets.length} Estourados · {alertaTickets.length} Alertas Ativos
          </span>
        </div>

        {alertaTickets.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            Nenhum chamado com alerta de SLA no momento.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {alertaTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => onSelectIncident(ticket)}
                className="p-3.5 hover:bg-slate-50 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{ticket.id}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-semibold text-slate-800">{ticket.unidade}</span>
                    <span className="text-slate-400">·</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        ticket.prioridade_alerta === 4
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ticket.prioridade_alerta === 4 ? 'SLA ESTOURADO' : `ALERTA NÍVEL ${ticket.prioridade_alerta}`}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600 font-mono">C{ticket.criticidade}</span>
                  </div>
                  <div className="text-slate-700">{ticket.descricao}</div>
                  <div className="text-[11px] text-slate-400">
                    Fornecedor: <strong className="text-slate-600">{ticket.fornecedor}</strong> ·
                    MTTA: {ticket.mtta_min} min · Status: {ticket.status_gerencial}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right flex-shrink-0">
                  <div>
                    <div className="text-red-600 font-bold font-mono">
                      {ticket.sla_gerencial}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      SPOT: R$ {ticket.valor_spot.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
