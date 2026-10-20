import React, { useState } from 'react';
import {
  X,
  Mail,
  Send,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  Clock,
  Building2,
  FileText,
  Eye,
  Code,
  Sparkles,
  AlertOctagon,
  MessageSquare
} from 'lucide-react';
import { Incident, EmailAlert } from '../types/facilities';
import {
  createMailtoUrl,
  generateEmailHtml,
  generateEmailPlainText,
  generateCentralCwAcionamentoText,
  DEFAULT_ALERT_EMAIL,
  DEFAULT_CC_EMAILS,
  getSlaHoursByCriticidade
} from '../utils/emailTemplateGenerator';

interface EmailAlertPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident | null;
  alertEmail?: string;
  ccEmails?: string[];
  alertRecord?: EmailAlert | null;
}

export const EmailAlertPreviewModal: React.FC<EmailAlertPreviewModalProps> = ({
  isOpen,
  onClose,
  incident,
  alertEmail = DEFAULT_ALERT_EMAIL,
  ccEmails = DEFAULT_CC_EMAILS,
  alertRecord
}) => {
  const [viewMode, setViewMode] = useState<'preview' | 'cw' | 'text' | 'html'>('cw');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !incident) return null;

  const targetEmail = alertRecord?.recipient || alertEmail;
  const targetCcs = alertRecord?.ccRecipients || ccEmails;
  const slaHours = getSlaHoursByCriticidade(incident.criticidade);

  const hubSocFull = incident.hub_soc_full || `${incident.tipo_ativo_operacional || 'FULL'} - ${incident.unidade}`;
  const subject = `[ACIONAMENTO CENTRAL CW] ${incident.protocolo} - ${hubSocFull} - ${incident.equipamento_afetado || incident.sistema}`;
  const htmlContent = generateEmailHtml(incident, targetEmail, targetCcs);
  const textContent = generateEmailPlainText(incident, targetEmail, targetCcs);
  const cwModelText = generateCentralCwAcionamentoText(incident);
  const mailtoLink = createMailtoUrl(incident, targetEmail, targetCcs);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const criticidadeBadgeColor =
    incident.criticidade === 1
      ? 'bg-red-600 text-white'
      : incident.criticidade === 2
      ? 'bg-orange-500 text-white'
      : incident.criticidade === 3
      ? 'bg-amber-500 text-white'
      : 'bg-blue-600 text-white';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-4 sm:px-6 bg-[#0b1329] text-white flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EE4D2D] flex items-center justify-center text-white shadow-md">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">🚨 ACIONAMENTO CENTRAL CW</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${criticidadeBadgeColor}`}>
                  C{incident.criticidade} · SLA {slaHours}h
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Informações organizadas e envio de alerta para <span className="text-amber-300 font-mono font-semibold">{targetEmail}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dispatch Status Bar */}
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold">Alerta disparado com sucesso pelo sistema</span>
            <span className="text-emerald-700 hidden sm:inline">
              · Protocolo: {incident.protocolo}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Visualizar:</span>
            <div className="flex bg-white rounded-md border border-slate-200 p-0.5 text-[11px]">
              <button
                onClick={() => setViewMode('cw')}
                className={`px-2.5 py-0.5 rounded flex items-center gap-1 font-bold transition-all ${
                  viewMode === 'cw'
                    ? 'bg-[#EE4D2D] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <span>🚨 Modelo CW</span>
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-2 py-0.5 rounded flex items-center gap-1 font-medium transition-all ${
                  viewMode === 'preview'
                    ? 'bg-[#172554] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>E-mail HTML</span>
              </button>
              <button
                onClick={() => setViewMode('text')}
                className={`px-2 py-0.5 rounded flex items-center gap-1 font-medium transition-all ${
                  viewMode === 'text'
                    ? 'bg-[#172554] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3 h-3" />
                <span>Texto Completo</span>
              </button>
              <button
                onClick={() => setViewMode('html')}
                className={`px-2 py-0.5 rounded flex items-center gap-1 font-medium transition-all ${
                  viewMode === 'html'
                    ? 'bg-[#172554] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code className="w-3 h-3" />
                <span>Código HTML</span>
              </button>
            </div>
          </div>
        </div>

        {/* Envelope Metadata */}
        <div className="bg-slate-50 px-4 sm:px-6 py-2.5 border-b border-slate-200 text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500 w-16">Para:</span>
            <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800 font-semibold">
              {targetEmail}
            </span>
            <span className="text-slate-400 text-[11px]">(Destinatário Principal)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500 w-16">Cc:</span>
            <div className="flex flex-wrap gap-1">
              {targetCcs.map((cc, idx) => (
                <span key={idx} className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-700 text-[11px]">
                  {cc}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-start gap-2 pt-0.5">
            <span className="font-semibold text-slate-500 w-16">Assunto:</span>
            <span className="font-semibold text-slate-900">
              {subject}
            </span>
          </div>
        </div>

        {/* Main Content Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100">
          
          {/* TAB 1: MODELO CENTRAL CW */}
          {viewMode === 'cw' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-orange-500 to-[#EE4D2D] p-3 rounded-xl text-white text-xs font-semibold flex items-center justify-between">
                <span>Padrão Oficial de Acionamento Central CW</span>
                <span className="bg-white/20 px-2 py-0.5 rounded font-mono text-[10px]">Pronto para Copiar</span>
              </div>

              <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl font-mono text-xs whitespace-pre-wrap leading-relaxed border border-slate-700 shadow-inner select-all">
                {cwModelText}
              </div>
            </div>
          )}

          {viewMode === 'preview' && (
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mx-auto max-w-2xl">
              <div
                className="w-full"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>
          )}

          {viewMode === 'text' && (
            <div className="bg-slate-900 text-slate-100 p-5 rounded-xl font-mono text-xs whitespace-pre-wrap leading-relaxed border border-slate-700 shadow-inner max-w-2xl mx-auto select-all">
              {textContent}
            </div>
          )}

          {viewMode === 'html' && (
            <div className="bg-slate-900 text-emerald-300 p-4 rounded-xl font-mono text-xs whitespace-pre-wrap leading-relaxed border border-slate-700 shadow-inner max-h-[400px] overflow-y-auto max-w-2xl mx-auto">
              {htmlContent}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:px-6 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>Notificação vinculada ao Protocolo <strong>{incident.protocolo}</strong></span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleCopy(viewMode === 'cw' ? cwModelText : viewMode === 'html' ? htmlContent : textContent)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Modelo CW</span>
                </>
              )}
            </button>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(cwModelText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp CW</span>
            </a>

            <a
              href={mailtoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-[#EE4D2D] hover:bg-[#d84223] text-white shadow-md shadow-orange-500/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Enviar via E-mail (Gmail/Outlook)</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
