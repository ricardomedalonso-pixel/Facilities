import React, { useState } from 'react';
import {
  X,
  BellRing,
  Send,
  CheckCircle,
  ExternalLink,
  MessageSquare,
  ShieldAlert,
  Clock,
  Sparkles
} from 'lucide-react';
import { Incident } from '../types/facilities';

interface AutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: Incident[];
}

export const AutomationModal: React.FC<AutomationModalProps> = ({
  isOpen,
  onClose,
  incidents
}) => {
  if (!isOpen) return null;

  const [simulating, setSimulating] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Pick a critical or urgent ticket for the simulation
  const criticalTicket =
    incidents.find((i) => i.prioridade === 'Crítica' && i.status !== 'Concluído') ||
    incidents.find((i) => i.prioridade === 'Crítica') ||
    incidents[0];

  const handleSimulateWebhook = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                Simulador de Automação &amp; Microsoft Teams
              </h3>
              <p className="text-[11px] text-slate-400">
                Integração Power BI Alert &gt; Power Automate &gt; Adaptive Card Teams
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Quando a medida DAX{' '}
            <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono font-bold">
              [Backlog Crítico &gt; 24h]
            </code>{' '}
            ou uma nova ocorrência de severidade <strong>Crítica (SLA 4h)</strong> é detectada, o
            fluxo automatizado dispara o card abaixo no canal <strong>#facilities-emergencias</strong>:
          </p>

          {/* Teams Adaptive Card Preview */}
          <div className="bg-[#464775]/5 border border-[#464775]/20 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                <span className="font-bold text-red-700 text-xs uppercase tracking-wider">
                  Alerta Crítico: Facilities Shopee
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Power Automate Bot</span>
            </div>

            <div className="space-y-1.5">
              <div className="font-bold text-sm text-slate-900">
                {criticalTicket?.equipamento_afetado || 'Niveladora Doca 14 Travada'}
              </div>
              <p className="text-slate-600 text-xs">
                {criticalTicket?.descricao ||
                  'Falha crítica com risco iminente de parada na linha de expedição.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 p-2.5 bg-white rounded-lg border border-slate-200 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">Unidade Afetada:</span>
                <strong className="text-slate-800">{criticalTicket?.unidade}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">SLA Contratual:</span>
                <strong className="text-red-600 font-mono">
                  {criticalTicket?.sla_horas_limite} Horas (Urgência 1)
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Fornecedor Responsável:</span>
                <strong className="text-slate-800">{criticalTicket?.fornecedor}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Protocolo:</span>
                <strong className="text-slate-800 font-mono">{criticalTicket?.protocolo}</strong>
              </div>
              <div className="col-span-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                <span>Destinatário: <strong className="text-slate-700">ricardomedalonso@gmail.com</strong></span>
                <span>Canal: <strong className="text-indigo-600">#facilities-emergencias</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleSimulateWebhook}
                disabled={simulating}
                className="flex-1 py-1.5 bg-[#464775] hover:bg-[#3b3c66] text-white rounded font-medium text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                {simulating ? (
                  <span>Disparando Webhook...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Disparar Alerta de Teste Agora</span>
                  </>
                )}
              </button>
            </div>

            {sentSuccess && (
              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  Payload JSON enviado com sucesso para o webhook do canal Teams! Status 200 OK.
                </span>
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-500 text-[11px] leading-relaxed">
            Consulte o arquivo <strong>Automatizacao_PowerBI.md</strong> na aba de Modelagem para ver
            o diagrama de arquitetura completo, credenciais de gateway e regras RLS.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg text-xs transition-colors"
          >
            Fechar Simulador
          </button>
        </div>
      </div>
    </div>
  );
};
