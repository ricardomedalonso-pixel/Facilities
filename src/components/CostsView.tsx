import React from 'react';
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  PieChart,
  BarChart3,
  Building,
  CheckCircle,
  AlertCircle,
  Receipt
} from 'lucide-react';
import { Incident } from '../types/facilities';

interface CostsViewProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
}

export const CostsView: React.FC<CostsViewProps> = ({ incidents, onSelectIncident }) => {
  // SPOT Total = SUM(FatoOcorrencias[Valor SPOT])
  const spotTotal = incidents.reduce((acc, curr) => acc + (curr.valor_spot || 0), 0);

  // Ocorrências com Valor SPOT > 0
  const ocorrenciasComSpot = incidents.filter((i) => (i.valor_spot || 0) > 0);
  const ticketMedioSpot =
    ocorrenciasComSpot.length > 0 ? spotTotal / ocorrenciasComSpot.length : 0;

  // Custo Real Total (incluindo SPOT e contratos)
  const custoRealTotal = incidents.reduce((acc, curr) => acc + (curr.custo_real || curr.valor_spot || 0), 0);

  // Breakdown by Criticidade C1 a C4
  const spotPorCriticidade = [1, 2, 3, 4].map((c) => {
    const list = incidents.filter((i) => i.criticidade === c);
    const sum = list.reduce((acc, curr) => acc + (curr.valor_spot || 0), 0);
    return {
      criticidade: `C${c}`,
      sum,
      count: list.length,
      pct: spotTotal > 0 ? (sum / spotTotal) * 100 : 0
    };
  });

  // Breakdown by Supplier SPOT
  const supMap = new Map<string, { spot: number; count: number }>();
  incidents.forEach((i) => {
    const entry = supMap.get(i.fornecedor) || { spot: 0, count: 0 };
    entry.spot += i.valor_spot || 0;
    entry.count += 1;
    supMap.set(i.fornecedor, entry);
  });
  const supList = Array.from(supMap.entries())
    .map(([fornecedor, data]) => ({ fornecedor, ...data }))
    .sort((a, b) => b.spot - a.spot);

  const maxSupSpot = Math.max(...supList.map((s) => s.spot), 1);

  // Highest SPOT tickets
  const highSpotTickets = [...incidents]
    .sort((a, b) => (b.valor_spot || 0) - (a.valor_spot || 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: SPOT Total */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">SPOT Total (DAX)</span>
            <DollarSign className="w-4 h-4 text-[#EE4D2D]" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            R$ {spotTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
            Soma de <code className="font-mono text-slate-700">FatoOcorrencias[Valor SPOT]</code>
          </div>
        </div>

        {/* KPI 2: Ticket Medio SPOT */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Ticket Médio SPOT (DAX)</span>
            <Receipt className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 tracking-tight">
            R$ {ticketMedioSpot.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
            Em {ocorrenciasComSpot.length} ocorrências com contratação SPOT
          </div>
        </div>

        {/* KPI 3: Custo Real Total */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Custo Real Acumulado</span>
            <BarChart3 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            R$ {custoRealTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
            Total em {incidents.length} chamados registrados
          </div>
        </div>

        {/* KPI 4: SPOT em Críticos C1 C2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">SPOT em Críticos (C1/C2)</span>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600 tracking-tight">
            R${' '}
            {(spotPorCriticidade[0].sum + spotPorCriticidade[1].sum).toLocaleString('pt-BR', {
              minimumFractionDigits: 2
            })}
          </div>
          <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
            Concentração em urgências operacionais de alta severidade
          </div>
        </div>
      </div>

      {/* Row 2: Distribution by Supplier & Criticidade */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Suppliers by SPOT (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Valor SPOT por Fornecedor
              </h3>
              <p className="text-xs text-slate-500">
                Alocação orçamentária SPOT por prestador de serviço
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {supList.slice(0, 6).map((s) => {
              const pct = (s.spot / maxSupSpot) * 100;
              return (
                <div key={s.fornecedor} className="p-1.5 rounded-lg hover:bg-slate-50">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-800">{s.fornecedor}</span>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-slate-500">{s.count} ordens</span>
                      <strong className="text-slate-900">
                        R$ {s.spot.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </strong>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#EE4D2D] rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SPOT by Criticidade C1 a C4 (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              SPOT por Criticidade (C1 a C4)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Dispersão dos custos extraordinários por severidade
            </p>

            <div className="space-y-3">
              {spotPorCriticidade.map((item) => (
                <div key={item.criticidade} className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-800">
                      Criticidade {item.criticidade}
                    </span>
                    <span className="font-mono text-slate-900 font-semibold">
                      R$ {item.sum.toLocaleString('pt-BR')} ({item.pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.criticidade === 'C1'
                          ? 'bg-red-500'
                          : item.criticidade === 'C2'
                          ? 'bg-orange-500'
                          : item.criticidade === 'C3'
                          ? 'bg-blue-500'
                          : 'bg-slate-400'
                      }`}
                      style={{ width: `${item.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 mt-6 border border-slate-200">
            <span className="font-semibold text-slate-800 block mb-0.5">
              Diretriz Shopee SPOT:
            </span>
            Aplica-se aprovação via alçada financeira para ordens SPOT individuais superiores a R$ 3.000,00.
          </div>
        </div>
      </div>

      {/* Row 3: Highest SPOT value individual tickets */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Maiores Valores SPOT Individuais
          </h3>
          <span className="text-xs text-slate-500">Top 5 maiores gastos avulsos</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {highSpotTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => onSelectIncident(ticket)}
              className="p-3.5 hover:bg-slate-50 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{ticket.id}</span>
                  <span className="text-slate-400">·</span>
                  <span className="font-semibold text-slate-800">{ticket.unidade}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600 font-mono">C{ticket.criticidade}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600">{ticket.categoria}</span>
                </div>
                <div className="text-slate-700">{ticket.descricao}</div>
                <div className="text-[11px] text-slate-400">
                  Prestador: <strong className="text-slate-600">{ticket.fornecedor}</strong> · Status:{' '}
                  {ticket.status_gerencial}
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-base font-bold text-slate-900 font-mono">
                  R$ {ticket.valor_spot.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[10px] text-slate-400">
                  {ticket.sla_gerencial}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
