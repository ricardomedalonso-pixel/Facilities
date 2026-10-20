import React from 'react';
import {
  CheckCircle2,
  Clock,
  DollarSign,
  ShieldAlert,
  Building,
  RotateCcw,
  Activity,
  Layers,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Zap,
  Target
} from 'lucide-react';
import { Incident } from '../types/facilities';

interface ExecutiveOverviewProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onFilterByHub: (hub: string) => void;
  onFilterByCategory: (cat: string) => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  incidents,
  onSelectIncident,
  onFilterByHub,
  onFilterByCategory
}) => {
  // ===== DAX MEASURES IMPLEMENTATION =====

  // Total Ocorrencias = COUNTROWS(FatoOcorrencias)
  const totalOcorrencias = incidents.length;

  // Encerradas = CALCULATE([Total Ocorrencias], FatoOcorrencias[Status Gerencial] = "Encerrado")
  const encerradas = incidents.filter((i) => i.status_gerencial === 'Encerrado').length;

  // Em Aberto Atendimento = CALCULATE([Total Ocorrencias], FatoOcorrencias[Status Gerencial] <> "Encerrado")
  const emAbertoAtendimento = incidents.filter((i) => i.status_gerencial !== 'Encerrado').length;

  // % Encerradas & % Em Aberto
  const pctEncerradas = totalOcorrencias > 0 ? (encerradas / totalOcorrencias) * 100 : 0;
  const pctEmAberto = totalOcorrencias > 0 ? (emAbertoAtendimento / totalOcorrencias) * 100 : 0;

  // Dentro SLA & Fora SLA
  const dentroSla = incidents.filter((i) => i.sla_gerencial === 'Dentro do SLA').length;
  const foraSla = incidents.filter((i) => i.sla_gerencial === 'Fora do SLA').length;

  // Aderencia SLA % = DIVIDE([Dentro SLA], [Dentro SLA] + [Fora SLA])
  const baseSla = dentroSla + foraSla;
  const aderenciaSlaPct = baseSla > 0 ? (dentroSla / baseSla) * 100 : 100;

  // SLA Cor = SWITCH(TRUE(), [Aderencia SLA %] >= 0.95, "#16A34A", [Aderencia SLA %] >= 0.90, "#F59E0B", "#DC2626")
  let slaCor = '#DC2626';
  if (aderenciaSlaPct >= 95) slaCor = '#16A34A';
  else if (aderenciaSlaPct >= 90) slaCor = '#F59E0B';

  // MTTA Medio min = AVERAGEX(FILTER(FatoOcorrencias, NOT ISBLANK(FatoOcorrencias[MTTA (min)])), FatoOcorrencias[MTTA (min)])
  const mttaValid = incidents.filter((i) => i.mtta_min !== null);
  const mttaMedioMin =
    mttaValid.length > 0
      ? mttaValid.reduce((acc, curr) => acc + (curr.mtta_min || 0), 0) / mttaValid.length
      : 0;

  // MTTA Meta Status = VAR Meta = 15 RETURN IF([MTTA Medio min] <= Meta, "Dentro da Meta", "Acima da Meta")
  const mttaMetaStatus = mttaMedioMin <= 15 ? 'Dentro da Meta' : 'Acima da Meta';

  // MTTR Medio h = AVERAGEX(FILTER(FatoOcorrencias, NOT ISBLANK(FatoOcorrencias[MTTR (h)])), FatoOcorrencias[MTTR (h)])
  const mttrValid = incidents.filter((i) => i.mttr_h !== null);
  const mttrMedioH =
    mttrValid.length > 0
      ? mttrValid.reduce((acc, curr) => acc + (curr.mttr_h || 0), 0) / mttrValid.length
      : 0;

  // SPOT Total = SUM(FatoOcorrencias[Valor SPOT])
  const spotTotal = incidents.reduce((acc, curr) => acc + (curr.valor_spot || 0), 0);

  // Ticket Medio SPOT = DIVIDE([SPOT Total], CALCULATE([Total Ocorrencias], FatoOcorrencias[Valor SPOT] > 0))
  const ocorrenciasComSpot = incidents.filter((i) => i.valor_spot > 0).length;
  const ticketMedioSpot = ocorrenciasComSpot > 0 ? spotTotal / ocorrenciasComSpot : 0;

  // Reincidentes 30d = CALCULATE([Total Ocorrencias], FatoOcorrencias[Reincidente] = "Sim")
  const reincidentes30d = incidents.filter((i) => i.reincidente === 'Sim').length;

  // Taxa Reincidencia % = DIVIDE([Reincidentes 30d], [Total Ocorrencias])
  const taxaReincidenciaPct = totalOcorrencias > 0 ? (reincidentes30d / totalOcorrencias) * 100 : 0;

  // Alertas SLA = CALCULATE([Total Ocorrencias], FatoOcorrencias[Prioridade Alerta] >= 2, FatoOcorrencias[Status Gerencial] <> "Encerrado")
  const alertasSla = incidents.filter(
    (i) => i.prioridade_alerta >= 2 && i.status_gerencial !== 'Encerrado'
  ).length;

  // SLA Estourado = CALCULATE([Total Ocorrencias], FatoOcorrencias[Prioridade Alerta] = 4, FatoOcorrencias[Status Gerencial] <> "Encerrado")
  const slaEstourado = incidents.filter(
    (i) => i.prioridade_alerta === 4 && i.status_gerencial !== 'Encerrado'
  ).length;

  // Alerta Cor = SWITCH(TRUE(), [SLA Estourado] > 0, "#DC2626", [Alertas SLA] > 0, "#F59E0B", "#16A34A")
  let alertaCor = '#16A34A';
  if (slaEstourado > 0) alertaCor = '#DC2626';
  else if (alertasSla > 0) alertaCor = '#F59E0B';

  // Criticos C1 C2 = CALCULATE([Total Ocorrencias], FatoOcorrencias[Criticidade] <= 2)
  const ocorrenciasC1 = incidents.filter((i) => i.criticidade === 1).length;
  const ocorrenciasC2 = incidents.filter((i) => i.criticidade === 2).length;
  const criticosC1C2 = ocorrenciasC1 + ocorrenciasC2;
  const pctCriticos = totalOcorrencias > 0 ? (criticosC1C2 / totalOcorrencias) * 100 : 0;

  // Distinct counts
  const fornecedoresAcionados = new Set(incidents.map((i) => i.fornecedor)).size;
  const unidadesAfetadas = new Set(incidents.map((i) => i.unidade)).size;
  const regioesAfetadas = new Set(incidents.map((i) => i.regiao)).size;

  // Rank Unidade Volume = RANKX(ALLSELECTED(FatoOcorrencias[Unidade]), [Total Ocorrencias], , DESC, DENSE)
  const hubVolumeMap = new Map<string, { total: number; spot: number; foraSla: number }>();
  incidents.forEach((i) => {
    const entry = hubVolumeMap.get(i.unidade) || { total: 0, spot: 0, foraSla: 0 };
    entry.total += 1;
    entry.spot += i.valor_spot || 0;
    if (i.sla_gerencial === 'Fora do SLA') entry.foraSla += 1;
    hubVolumeMap.set(i.unidade, entry);
  });
  const hubRankList = Array.from(hubVolumeMap.entries())
    .map(([unidade, data]) => ({ unidade, ...data }))
    .sort((a, b) => b.total - a.total);

  const maxHubTotal = Math.max(...hubRankList.map((h) => h.total), 1);

  // Rank Fornecedor Fora SLA = RANKX(ALLSELECTED(FatoOcorrencias[Fornecedor]), [Fora SLA], , DESC, DENSE)
  const fornecedorForaSlaMap = new Map<string, { total: number; foraSla: number; spot: number }>();
  incidents.forEach((i) => {
    const entry = fornecedorForaSlaMap.get(i.fornecedor) || { total: 0, foraSla: 0, spot: 0 };
    entry.total += 1;
    if (i.sla_gerencial === 'Fora do SLA') entry.foraSla += 1;
    entry.spot += i.valor_spot || 0;
    fornecedorForaSlaMap.set(i.fornecedor, entry);
  });
  const fornecedorRankList = Array.from(fornecedorForaSlaMap.entries())
    .map(([fornecedor, data]) => ({ fornecedor, ...data }))
    .sort((a, b) => b.total - a.total || b.foraSla - a.foraSla);

  // Urgent tickets for spotlight
  const urgentTickets = incidents
    .filter((i) => i.status_gerencial !== 'Encerrado' && (i.prioridade_alerta >= 2 || i.criticidade <= 2))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Health Status Bar */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-3.5 h-3.5 rounded-full animate-pulse shadow-sm"
            style={{ backgroundColor: alertaCor }}
          ></div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <span>Status Operacional Geral:</span>
              <span
                className="font-bold px-2 py-0.5 rounded text-[11px]"
                style={{
                  backgroundColor: `${alertaCor}15`,
                  color: alertaCor,
                  border: `1px solid ${alertaCor}30`
                }}
              >
                {slaEstourado > 0
                  ? 'CRÍTICO: SLA Estourado Detectado'
                  : alertasSla > 0
                  ? 'ALERTA: Chamados em Risco de Prazo'
                  : 'REGULAR: Operação em Conformidade'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Alerta Cor: <code className="font-mono text-slate-700">{alertaCor}</code> · SLA Cor:{' '}
              <code className="font-mono text-slate-700">{slaCor}</code>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-slate-600">
            Unidades: <strong className="text-slate-900">{unidadesAfetadas}</strong>
          </div>
          <span className="text-slate-300" aria-hidden="true">|</span>
          <div className="text-slate-600">
            Regiões: <strong className="text-slate-900">{regioesAfetadas}</strong>
          </div>
          <span className="text-slate-300" aria-hidden="true">|</span>
          <div className="text-slate-600">
            Fornecedores: <strong className="text-slate-900">{fornecedoresAcionados}</strong>
          </div>
        </div>
      </div>

      {/* Row 1: Executive DAX KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* KPI 1: Total Ocorrencias */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Ocorrências</span>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">{totalOcorrencias}</div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span className="text-emerald-700 font-medium">{encerradas} ({pctEncerradas.toFixed(0)}%) enc.</span>
            <span className="text-amber-700 font-medium">{emAbertoAtendimento} ({pctEmAberto.toFixed(0)}%) ab.</span>
          </div>
        </div>

        {/* KPI 2: Aderencia SLA % */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Aderência SLA %</span>
            <CheckCircle2 className="w-4 h-4" style={{ color: slaCor }} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight" style={{ color: slaCor }}>
              {aderenciaSlaPct.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-400">Meta: ≥95%</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] flex justify-between text-slate-500">
            <span className="text-emerald-700 font-medium">{dentroSla} no prazo</span>
            <span className="text-red-600 font-medium">{foraSla} fora</span>
          </div>
        </div>

        {/* KPI 3: MTTA Medio min (Meta 15 min) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">MTTA Médio</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {mttaMedioMin.toFixed(1)} <span className="text-sm font-normal text-slate-500">min</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[10px]">Meta: ≤ 15 min</span>
            <span
              className={`font-semibold text-[11px] ${
                mttaMetaStatus === 'Dentro da Meta' ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {mttaMetaStatus}
            </span>
          </div>
        </div>

        {/* KPI 4: MTTR Medio h */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">MTTR Médio</span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {mttrMedioH.toFixed(1)} <span className="text-sm font-normal text-slate-500">horas</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>Tempo Médio Reparo</span>
          </div>
        </div>

        {/* KPI 5: SPOT Total & Ticket Medio */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">SPOT Total</span>
            <DollarSign className="w-4 h-4 text-[#EE4D2D]" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            R$ {spotTotal.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>
              Ticket Médio: <strong className="text-slate-700">R$ {ticketMedioSpot.toFixed(0)}</strong>
            </span>
          </div>
        </div>

        {/* KPI 6: Reincidência & Alertas */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Reincidentes 30d</span>
            <RotateCcw className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {taxaReincidenciaPct.toFixed(1)}%
            <span className="text-xs font-normal text-slate-500 ml-1.5">
              ({reincidentes30d} chamados)
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-red-600 font-semibold">{slaEstourado} SLA Estourado</span>
            <span className="text-amber-600 font-semibold">{alertasSla} Alertas</span>
          </div>
        </div>
      </div>

      {/* Row 2: Charts based on Rank Unidade Volume & Rank Fornecedor Fora SLA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Rank Unidade Volume (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-[#EE4D2D]" />
                <span>Rank Unidade Volume (DAX: Rank Unidade Volume)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Classificação DENSE por volume total de ocorrências e gastos SPOT
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">{hubRankList.length} Unidades</span>
          </div>

          <div className="space-y-3">
            {hubRankList.slice(0, 7).map((hub, idx) => {
              const pct = (hub.total / maxHubTotal) * 100;
              return (
                <div
                  key={hub.unidade}
                  onClick={() => onFilterByHub(hub.unidade)}
                  className="group cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-600 flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800 group-hover:text-[#EE4D2D] transition-colors">
                        {hub.unidade}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
                      <span>SPOT: R$ {hub.spot.toLocaleString('pt-BR')}</span>
                      {hub.foraSla > 0 && (
                        <span className="text-red-600 font-bold">{hub.foraSla} fora SLA</span>
                      )}
                      <strong className="text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                        {hub.total} chamados
                      </strong>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#EE4D2D] rounded-full transition-all duration-500 group-hover:opacity-90"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Rank Fornecedor Fora SLA (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span>Rank Fornecedor Fora SLA</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Prestadores com maior número de quebras contratuais
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {fornecedorRankList.slice(0, 6).map((sup, idx) => (
                <div key={sup.fornecedor} className="p-2 rounded-lg hover:bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-slate-400">#{idx + 1}</span>
                      <span className="font-semibold text-slate-800">{sup.fornecedor}</span>
                    </div>
                    <span
                      className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                        sup.foraSla > 0 ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {sup.foraSla} fora SLA
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-1">
                    <span>Total chamados: {sup.total}</span>
                    <span>SPOT: R$ {sup.spot.toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Criticidade C1/C2 Quick Summary */}
          <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-red-50/70 border border-red-200 rounded-lg text-red-900">
              <span className="text-[10px] uppercase font-bold text-red-600 block">
                Ocorrências C1 (Urgência 1)
              </span>
              <strong className="text-lg font-bold font-mono">{ocorrenciasC1}</strong>
            </div>
            <div className="p-2.5 bg-orange-50/70 border border-orange-200 rounded-lg text-orange-900">
              <span className="text-[10px] uppercase font-bold text-orange-600 block">
                Ocorrências C2 (Urgência 2)
              </span>
              <strong className="text-lg font-bold font-mono">{ocorrenciasC2}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Operational Warning Strip & Quick Details */}
      {urgentTickets.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Chamados com Alerta Ativo (Prioridade Alerta ≥ 2 ou C1/C2)
              </span>
            </div>
            <span className="text-xs text-amber-700 font-medium">
              Monitoramento ativo de SLA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {urgentTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => onSelectIncident(ticket)}
                className="bg-white p-3 rounded-lg border border-amber-200 shadow-xs cursor-pointer hover:border-[#EE4D2D] hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-slate-900">{ticket.id}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        ticket.prioridade_alerta === 4
                          ? 'bg-red-100 text-red-700 animate-pulse'
                          : ticket.criticidade === 1
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {ticket.prioridade_alerta === 4
                        ? 'SLA ESTOURADO'
                        : `C${ticket.criticidade} · Alerta ${ticket.prioridade_alerta}`}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                    {ticket.equipamento_afetado}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {ticket.descricao}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-[10px] text-slate-400">
                  <span>{ticket.unidade}</span>
                  <span className="text-[#EE4D2D] font-medium flex items-center">
                    Ver detalhes <ChevronRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
