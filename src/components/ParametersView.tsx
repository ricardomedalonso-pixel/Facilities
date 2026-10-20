import React, { useState } from 'react';
import {
  Settings,
  FolderArchive,
  FileSpreadsheet,
  Code2,
  Copy,
  Check,
  Download,
  Mail,
  Globe,
  Clock,
  Cpu,
  Target,
  BellRing,
  ExternalLink,
  ShieldAlert,
  Save,
  RotateCcw,
  CheckCircle2,
  FileCode,
  Sparkles,
  Layers
} from 'lucide-react';
import { ProjectParameters } from '../types/facilities';
import {
  DEFAULT_PROJECT_PARAMETERS,
  PACKAGE_FILES_METADATA,
  generateCustomPowerQuery
} from '../data/projectParameters';
import { DOC_ASSETS } from '../data/powerBiAssets';

interface ParametersViewProps {
  onNavigateToDocs: (assetId: string) => void;
  onOpenAutomationModal: () => void;
}

export const ParametersView: React.FC<ParametersViewProps> = ({
  onNavigateToDocs,
  onOpenAutomationModal
}) => {
  const [params, setParams] = useState<ProjectParameters>(DEFAULT_PROJECT_PARAMETERS);
  const [copiedM, setCopiedM] = useState<boolean>(false);
  const [copiedParams, setCopiedParams] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<boolean>(false);

  const customPowerQueryCode = generateCustomPowerQuery(params.pCaminhoArquivo);

  const handleCopyCode = (text: string, isParamJson = false) => {
    navigator.clipboard.writeText(text);
    if (isParamJson) {
      setCopiedParams(true);
      setTimeout(() => setCopiedParams(false), 2000);
    } else {
      setCopiedM(true);
      setTimeout(() => setCopiedM(false), 2000);
    }
  };

  const handleDownloadCustomM = () => {
    const blob = new Blob([customPowerQueryCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'PowerQuery_FatoOcorrencias.m';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadFile = (filename: string) => {
    const asset = DOC_ASSETS.find((a) => a.arquivo === filename);
    const content = asset ? asset.conteudo : `Arquivo ${filename} do pacote ${params.nomePacoteOrigem}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveParams = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleResetDefaults = () => {
    setParams(DEFAULT_PROJECT_PARAMETERS);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-lg border border-emerald-500 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-xs font-semibold">Parâmetros atualizados com sucesso no ambiente!</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 flex items-center gap-1">
              <Settings className="w-3 h-3" />
              Parâmetros de Produção &amp; Pacote
            </span>
            <span className="text-xs font-mono text-slate-500">
              {params.nomePacoteOrigem}
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Configuração de Parâmetros, Conexão e Metadados do Pacote
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerenciamento do caminho de fonte Excel, parâmetros de consulta M, limiares de SLA e rotas de notificação.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopyCode(JSON.stringify(params, null, 2), true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors shadow-xs"
          >
            {copiedParams ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedParams ? 'Copiado JSON!' : 'Copiar Parâmetros'}</span>
          </button>
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-300"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Restaurar Padrões</span>
          </button>
        </div>
      </div>

      {/* Primary Grid: Parameters Form & Live Query Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Editable Parameters Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleSaveParams} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#EE4D2D]" />
                Parâmetros do Modelo Power BI
              </span>
              <span className="text-[11px] font-mono text-slate-500">pCaminhoArquivo</span>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* pCaminhoArquivo Input */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 flex items-center justify-between">
                  <span>Caminho do Arquivo Excel (pCaminhoArquivo):</span>
                  <span className="text-[10px] text-orange-600 font-mono">Power Query</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={params.pCaminhoArquivo}
                    onChange={(e) => setParams({ ...params, pCaminhoArquivo: e.target.value })}
                    placeholder="Ex: C:\PowerBI\Base_Facilities_PowerBI.xlsx"
                    className="w-full px-3 py-2 font-mono text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#EE4D2D] focus:bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Caminho absoluto local, rede interna ou SharePoint do arquivo Excel.
                </p>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setParams({ ...params, pCaminhoArquivo: 'C:\\PowerBI\\Base_Facilities_PowerBI.xlsx' })}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                  >
                    Local C:\PowerBI
                  </button>
                  <button
                    type="button"
                    onClick={() => setParams({ ...params, pCaminhoArquivo: '\\\\servidor\\facilities\\Base_Facilities_PowerBI.xlsx' })}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                  >
                    Rede Corporativa
                  </button>
                  <button
                    type="button"
                    onClick={() => setParams({ ...params, pCaminhoArquivo: 'https://shopee.sharepoint.com/teams/facilities/Base_Facilities_PowerBI.xlsx' })}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                  >
                    SharePoint / Cloud
                  </button>
                </div>
              </div>

              {/* Excel Sheet Name & Target File */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 text-[11px]">Aba do Excel:</label>
                  <input
                    type="text"
                    value={params.abaExcel}
                    onChange={(e) => setParams({ ...params, abaExcel: e.target.value })}
                    className="w-full px-2.5 py-1.5 font-mono text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 text-[11px]">Arquivo PBIX Alvo:</label>
                  <input
                    type="text"
                    value={params.arquivoPbixRecomendado}
                    onChange={(e) => setParams({ ...params, arquivoPbixRecomendado: e.target.value })}
                    className="w-full px-2.5 py-1.5 font-mono text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-800"
                  />
                </div>
              </div>

              {/* SLA & Performance Targets */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <span className="font-semibold text-slate-800 block text-xs">
                  Metas de Gestão &amp; Limiares DAX:
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-600 flex items-center justify-between">
                      <span>Meta MTTA:</span>
                      <span className="font-bold text-slate-800">{params.mttaMetaMin} min</span>
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={60}
                      value={params.mttaMetaMin}
                      onChange={(e) => setParams({ ...params, mttaMetaMin: Number(e.target.value) })}
                      className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-600 flex items-center justify-between">
                      <span>Meta SLA:</span>
                      <span className="font-bold text-emerald-600">{params.slaMetaPercent}%</span>
                    </label>
                    <input
                      type="number"
                      step={0.5}
                      min={80}
                      max={100}
                      value={params.slaMetaPercent}
                      onChange={(e) => setParams({ ...params, slaMetaPercent: Number(e.target.value) })}
                      className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-600">Janela Reincidência:</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={7}
                        max={90}
                        value={params.reincidenciaDias}
                        onChange={(e) => setParams({ ...params, reincidenciaDias: Number(e.target.value) })}
                        className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-800"
                      />
                      <span className="text-slate-500 text-[11px]">dias</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-600">Canal Teams:</label>
                    <input
                      type="text"
                      value={params.teamsChannel}
                      onChange={(e) => setParams({ ...params, teamsChannel: e.target.value })}
                      className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Responsible Email */}
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <label className="font-semibold text-slate-700 text-[11px] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  Email do Responsável pelas Notificações &amp; Alertas:
                </label>
                <input
                  type="email"
                  value={params.userEmail}
                  onChange={(e) => setParams({ ...params, userEmail: e.target.value })}
                  className="w-full px-2.5 py-1.5 font-mono text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-800"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#EE4D2D] hover:bg-[#d84223] text-white font-semibold text-xs shadow-xs transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Parâmetros e Atualizar Consulta M</span>
                </button>
              </div>
            </div>
          </form>

          {/* Environment Metadata Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600" />
              Metadados do Ambiente de Execução
            </span>

            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="pt-1.5 flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <FolderArchive className="w-3.5 h-3.5 text-amber-500" />
                  Pacote de Origem:
                </span>
                <span className="font-mono font-semibold text-slate-800 text-[11px]">
                  {params.nomePacoteOrigem}
                </span>
              </div>

              <div className="pt-1.5 flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-500" />
                  Motor de IA / Análise:
                </span>
                <span className="font-mono text-slate-700 text-[11px]">
                  {params.model}
                </span>
              </div>

              <div className="pt-1.5 flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  Data/Hora Referência:
                </span>
                <span className="font-mono text-slate-700 text-[11px]">
                  {params.localTime}
                </span>
              </div>

              <div className="pt-1.5 space-y-1">
                <span className="text-slate-500 text-[11px] block">URL de Desenvolvimento:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    readOnly
                    value={params.devAppUrl}
                    className="w-full px-2 py-1 text-[11px] font-mono bg-slate-50 border border-slate-200 rounded text-slate-600 select-all"
                  />
                  <a
                    href={params.devAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-slate-500 hover:text-slate-800"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="pt-1.5 space-y-1">
                <span className="text-slate-500 text-[11px] block">URL Pública / Compartilhada:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    readOnly
                    value={params.sharedAppUrl}
                    className="w-full px-2 py-1 text-[11px] font-mono bg-slate-50 border border-slate-200 rounded text-slate-600 select-all"
                  />
                  <a
                    href={params.sharedAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-slate-500 hover:text-slate-800"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Power Query M Generator with user's parameter (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Power Query Code Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
            <div className="p-3.5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#EE4D2D]" />
                <span className="font-mono font-bold">PowerQuery_FatoOcorrencias.m</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Parâmetro Injetado
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyCode(customPowerQueryCode, false)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                >
                  {copiedM ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedM ? 'Copiado!' : 'Copiar M'}</span>
                </button>
                <button
                  onClick={handleDownloadCustomM}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#EE4D2D] hover:bg-[#d84223] text-white text-xs transition-colors font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar .m</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed max-h-[380px] overflow-y-auto">
              <div className="text-emerald-400 mb-2 text-[11px] pb-2 border-b border-slate-800">
                // Parâmetro dinâmico atualizado: pCaminhoArquivo = "{params.pCaminhoArquivo.replace(/\\/g, '\\\\')}"
              </div>
              <pre className="whitespace-pre-wrap select-text">
                <code>{customPowerQueryCode}</code>
              </pre>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
              <span>
                Cole no Power BI Desktop: <strong>Página Inicial</strong> &gt; <strong>Transformar Dados</strong> &gt; <strong>Editor Avançado</strong>
              </span>
              <button
                onClick={() => onNavigateToDocs('powerquery-m')}
                className="text-[#EE4D2D] font-semibold hover:underline flex items-center gap-1"
              >
                <span>Ver na Central de Docs</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Package Files Manifest Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <FolderArchive className="w-4 h-4 text-amber-500" />
                  Manifesto do Pacote: {params.nomePacoteOrigem}
                </span>
                <span className="text-[11px] text-slate-500">
                  {PACKAGE_FILES_METADATA.length} arquivos essenciais para o Power BI Desktop e Automações
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                ZIP Package
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[360px] overflow-y-auto">
              {PACKAGE_FILES_METADATA.map((file) => (
                <div key={file.arquivo} className="p-3.5 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 truncate">
                        {file.arquivo}
                      </span>
                      {file.obrigatorio && (
                        <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                          Obrigatório
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-slate-400">
                        {file.tamanhoAprox}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-1">
                      {file.descricao}
                    </p>
                    <div className="text-[10px] text-indigo-600 font-medium">
                      Função: {file.funcaoPowerBi}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleDownloadFile(file.arquivo)}
                      title={`Baixar ${file.arquivo}`}
                      className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Responsável técnico cadastrado: <strong>{params.userEmail}</strong>
              </span>
              <button
                onClick={onOpenAutomationModal}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#EE4D2D] hover:underline"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Testar Notificação Teams</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
