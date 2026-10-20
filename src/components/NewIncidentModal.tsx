import React, { useState, useMemo, useEffect } from 'react';
import { X, PlusCircle, AlertCircle, Building2, Wrench, Mail } from 'lucide-react';
import {
  Incident,
  CriticidadeNivel,
  PrioridadeAlertaNivel,
  ReincidenteTipo,
  StatusGerencial,
  SLAGerencial,
  CentroDistribuicao,
  AppUser
} from '../types/facilities';
import { SISTEMAS_LISTA, FORNECEDORES_LISTA, UNIDADES_LISTA } from '../data/mockFacilitiesData';
import {
  CADASTRO_CDS,
  CADASTRO_FULL,
  CADASTRO_SOC,
  CADASTRO_HUB,
  CDS_E_SOCS_POR_REGIAO,
  HUBS_POR_REGIAO,
  MACRO_REGIOES
} from '../data/cadastrosCDs';

interface NewIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (incident: Incident) => void;
  initialCd?: CentroDistribuicao | null;
  currentUser?: AppUser | null;
}

export const NewIncidentModal: React.FC<NewIncidentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCd,
  currentUser
}) => {
  if (!isOpen) return null;

  const defaultUnit = initialCd || CADASTRO_CDS[0] || { unidade: 'SOC-SP06', cidade: 'São Paulo', regional: 'Sudeste SP' };
  const [unidade, setUnidade] = useState(defaultUnit.unidade);
  const [cidade, setCidade] = useState(defaultUnit.cidade);
  const [regiao, setRegiao] = useState(defaultUnit.regional);

  useEffect(() => {
    if (initialCd) {
      setUnidade(initialCd.unidade);
      setCidade(initialCd.cidade);
      setRegiao(initialCd.regional);
      if (initialCd.responsavel) setSolicitante(initialCd.responsavel);
    }
  }, [initialCd]);
  const [sistema, setSistema] = useState('Elétrico');
  const [equipamento, setEquipamento] = useState('');
  const [criticidade, setCriticidade] = useState<CriticidadeNivel>(2);
  const [alertaSla, setAlertaSla] = useState('ATENÇÃO - Em monitoramento operacional');
  const [impacto, setImpacto] = useState('Impacto Moderado');
  const [valorSpot, setValorSpot] = useState('0');
  const [reincidente, setReincidente] = useState<ReincidenteTipo>('Não');
  const [solicitante, setSolicitante] = useState(
    currentUser ? `${currentUser.nome} (${currentUser.cargo})` : 'Equipe Facilities / SL'
  );
  const [fornecedor, setFornecedor] = useState('Thorio');
  const [descricao, setDescricao] = useState('');
  const [acaoExecutada, setAcaoExecutada] = useState('');
  const [causaRaiz, setCausaRaiz] = useState('');
  const [acaoPreventiva, setAcaoPreventiva] = useState('');

  const cleanSistemas = SISTEMAS_LISTA.filter((s) => s !== 'Todos os Sistemas');
  const cleanUnits = useMemo(() => {
    return CADASTRO_CDS.map((c) => `${c.unidade} - ${c.cidade}/${c.uf}`).sort((a, b) =>
      a.localeCompare(b, 'pt-BR', { numeric: true, sensitivity: 'base' })
    );
  }, []);

  const suppliersList = useMemo(() => {
    return [...FORNECEDORES_LISTA].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, []);

  const handleUnitChange = (val: string) => {
    setUnidade(val);
    const code = val.split(' - ')[0];
    const found = CADASTRO_CDS.find((c) => c.unidade === code || c.unidade === val);
    if (found) {
      setCidade(found.cidade);
      setRegiao(found.regional);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) return;

    const randNum = Math.floor(100 + Math.random() * 900);
    const idAuto = `CONT-${randNum}`;
    const manusis = `OM ${Math.floor(250000 + Math.random() * 5000)}`;
    const nowIso = new Date().toISOString();
    const todayYmd = nowIso.slice(0, 10);
    const nowTime = nowIso.slice(11, 19);

    let prioridadeAlertaNum: PrioridadeAlertaNivel = 1;
    if (alertaSla.startsWith('ESTOURADO')) prioridadeAlertaNum = 4;
    else if (alertaSla.startsWith('CRÍTICO')) prioridadeAlertaNum = 3;
    else if (alertaSla.startsWith('ATENÇÃO')) prioridadeAlertaNum = 2;

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

    const parsedSpot = parseFloat(valorSpot) || 0;

    const newTicket: Incident = {
      id_automatico: idAuto,
      id: idAuto,
      protocolo: `SHO-${idAuto}`,
      data: todayYmd,
      unidade,
      cidade,
      regiao,
      solicitante,
      descricao_ocorrencia: descricao,
      descricao,
      impacto_operacional: impacto,
      sistema,
      categoria: sistema,
      criticidade,
      faixa_criticidade: faixaCrit,
      fornecedor,
      acao_executada: acaoExecutada || 'Atendimento em andamento.',
      hora_abertura: nowTime,
      hora_acionamento: nowTime,
      hora_normalizacao: null,
      data_hora_abertura: nowIso,
      data_hora_acionamento: nowIso,
      data_hora_normalizacao: null,
      status: 'Aberto',
      status_gerencial: 'Aberto',
      valor_spot: parsedSpot,
      numero_manusis: manusis,
      mtta_min: 10,
      mttr_h: null,
      sla: 'Aberto',
      sla_gerencial: 'Em aberto',
      semaforo_sla: 'Amarelo',
      tempo_em_aberto_h: 0.1,
      alerta_sla: alertaSla,
      prioridade_alerta: prioridadeAlertaNum,
      causa_raiz: causaRaiz || 'Em investigação.',
      acao_preventiva: acaoPreventiva || 'A ser definida.',
      responsavel_acompanhamento: solicitante,
      reincidencia_30d: reincidente === 'Sim' ? 1 : 0,
      reincidente,
      equipamento_afetado: equipamento || sistema,
      tipo_ativo_operacional: unidade.startsWith('SOC') ? 'SOC' : unidade.startsWith('HUB') ? 'HUB' : 'FULL',
      hub_soc_full: `${unidade.startsWith('SOC') ? 'SOC' : unidade.startsWith('HUB') ? 'HUB' : 'FULL'} - ${unidade}`,
      descricao_servico: descricao,
      urgencia: `C${criticidade} (${faixaCrit})`,
      contato_local: solicitante,
      contato_mantenedora: fornecedor,
      aberto_por_usuario: currentUser ? `${currentUser.nome} (${currentUser.email})` : solicitante,
      aberto_por_email: currentUser?.email || 'facilities@shopee.com',
      aberto_por_cargo: currentUser?.cargo || 'Solicitante Local',
      data_hora_criacao: nowIso,
      historico: [
        {
          data: nowIso,
          autor: currentUser ? `${currentUser.nome} (${currentUser.cargo})` : solicitante,
          acao: `Abertura da ocorrência ${idAuto} registrada por ${currentUser ? currentUser.nome : solicitante}`
        }
      ]
    };

    onSave(newTicket);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EE4D2D] flex items-center justify-center text-white">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Registrar Ocorrência na Base Operacional
              </h3>
              <p className="text-xs text-slate-500">
                Alinhada ao script PowerQuery_FatoOcorrencias.m e medidas DAX
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Alert Banner */}
        <div className="bg-amber-50 px-6 py-2.5 border-b border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#EE4D2D]" />
            <span>Alerta automático por e-mail configurado para: <strong className="font-mono">ricardomedalonso@gmail.com</strong></span>
          </div>
          <span className="text-[10px] font-bold bg-amber-200/80 text-amber-800 px-2 py-0.5 rounded-full">
            Notificação Imediata
          </span>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Row 1: Unidade e Sistema */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Unidade / Cidade *
              </label>
              <select
                value={unidade}
                onChange={(e) => handleUnitChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-[#EE4D2D]"
              >
                <optgroup label="🏢 ── CENTROS DE DISTRIBUIÇÃO & SORTATION (CDs / SOCs) ──">
                </optgroup>
                {MACRO_REGIOES.map((reg) => {
                  const list = CDS_E_SOCS_POR_REGIAO[reg];
                  if (!list || list.length === 0) return null;
                  return (
                    <optgroup key={`cd-${reg}`} label={`🏢 ${reg} — (${list.length} CDs/SOCs)`}>
                      {list.map((c) => (
                        <option key={c.unidade} value={c.unidade}>
                          [{c.tipo_ativo}] {c.unidade} — {c.cidade}/{c.uf}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}

                <optgroup label="🚚 ── HUBS OPERACIONAIS LAST-MILE (AGRUPADOS POR REGIÃO) ──">
                </optgroup>
                {MACRO_REGIOES.map((reg) => {
                  const list = HUBS_POR_REGIAO[reg];
                  if (!list || list.length === 0) return null;
                  return (
                    <optgroup key={`hub-${reg}`} label={`🚚 ${reg} — (${list.length} Hubs)`}>
                      {list.map((c) => (
                        <option key={c.unidade} value={c.unidade}>
                          {c.unidade} — {c.cidade}/{c.uf}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Sistema *
              </label>
              <select
                value={sistema}
                onChange={(e) => setSistema(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-[#EE4D2D]"
              >
                {cleanSistemas.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Equipamento e Fornecedor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Equipamento / Ativo Afetado *
              </label>
              <input
                type="text"
                required
                value={equipamento}
                onChange={(e) => setEquipamento(e.target.value)}
                placeholder="Ex: Niveladora Doca 14, Chiller Trane, QGBT..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-[#EE4D2D]"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Fornecedor *
              </label>
              <select
                value={fornecedor}
                onChange={(e) => setFornecedor(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-[#EE4D2D]"
              >
                {suppliersList.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Criticidade, Alerta SLA, Reincidente */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Criticidade *
              </label>
              <select
                value={criticidade}
                onChange={(e) => setCriticidade(parseInt(e.target.value) as CriticidadeNivel)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-[#EE4D2D]"
              >
                <option value="1">1 - C1 (Crítica)</option>
                <option value="2">2 - C2 (Alta)</option>
                <option value="3">3 - C3 (Média)</option>
                <option value="4">4 - C4 (Baixa)</option>
                <option value="5">5 - C5 (Muito Baixa)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Alerta SLA
              </label>
              <select
                value={alertaSla}
                onChange={(e) => setAlertaSla(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-[#EE4D2D]"
              >
                <option value="NORMAL">NORMAL</option>
                <option value="ATENÇÃO - Prazo Próximo">ATENÇÃO (Nível 2)</option>
                <option value="CRÍTICO - Risco Iminente">CRÍTICO (Nível 3)</option>
                <option value="ESTOURADO - SLA Vencido">ESTOURADO (Nível 4)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Reincidência 30d
              </label>
              <select
                value={reincidente}
                onChange={(e) => setReincidente(e.target.value as ReincidenteTipo)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-[#EE4D2D]"
              >
                <option value="Não">Não</option>
                <option value="Sim">Sim (Reincidente)</option>
              </select>
            </div>
          </div>

          {/* Row 4: Valor SPOT e Solicitante */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Valor SPOT (R$)
              </label>
              <input
                type="number"
                value={valorSpot}
                onChange={(e) => setValorSpot(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-[#EE4D2D]"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Solicitante *
              </label>
              <input
                type="text"
                required
                value={solicitante}
                onChange={(e) => setSolicitante(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-[#EE4D2D]"
              />
            </div>
          </div>

          {/* Row 5: Descrição da Ocorrência */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Descrição da Ocorrência *
            </label>
            <textarea
              required
              rows={2}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o sintoma da falha operacional..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-[#EE4D2D]"
            ></textarea>
          </div>

          {/* Row 6: Causa Raiz e Ação Preventiva */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Causa Raiz
              </label>
              <input
                type="text"
                value={causaRaiz}
                onChange={(e) => setCausaRaiz(e.target.value)}
                placeholder="Ex: Desgaste natural, sobretensão..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-[#EE4D2D]"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Ação Preventiva
              </label>
              <input
                type="text"
                value={acaoPreventiva}
                onChange={(e) => setAcaoPreventiva(e.target.value)}
                placeholder="Ex: Inclusão em checklist preventivo..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-[#EE4D2D]"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-[#EE4D2D] hover:bg-[#d84223] text-white rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Salvar na Base Operacional</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
