import React, { useState } from 'react';
import {
  FileCode,
  Copy,
  Check,
  Download,
  Search,
  Code2,
  FileSpreadsheet,
  FileText,
  Palette,
  ExternalLink,
  BookOpen,
  CheckSquare,
  Sparkles
} from 'lucide-react';
import { DOC_ASSETS, DAX_MEASURES } from '../data/powerBiAssets';
import { DocAsset } from '../types/facilities';

interface DocumentationViewerProps {
  initialAssetId?: string;
}

export const DocumentationViewer: React.FC<DocumentationViewerProps> = ({
  initialAssetId = 'layout-relatorio'
}) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>(initialAssetId);
  const [copied, setCopied] = useState<boolean>(false);
  const [daxSearch, setDaxSearch] = useState<string>('');

  const currentAsset = DOC_ASSETS.find((a) => a.id === selectedAssetId) || DOC_ASSETS[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (asset: DocAsset) => {
    const blob = new Blob([asset.conteudo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = asset.arquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredDax = DAX_MEASURES.filter(
    (m) =>
      m.nome.toLowerCase().includes(daxSearch.toLowerCase()) ||
      m.categoria.toLowerCase().includes(daxSearch.toLowerCase()) ||
      m.formula.toLowerCase().includes(daxSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-orange-100 text-[#EE4D2D]">
              Repositório Oficial Power BI
            </span>
            <span className="text-xs text-slate-500">Versão 2.4</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Central de Arquivos, Scripts &amp; Modelagem Power BI
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Arquivos prontos para download e importação direta no Microsoft Power BI Desktop
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(currentAsset.conteudo)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiado!' : 'Copiar Conteúdo'}</span>
          </button>
          <button
            onClick={() => handleDownload(currentAsset)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#EE4D2D] hover:bg-[#d84223] text-white transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Baixar {currentAsset.arquivo}</span>
          </button>
        </div>
      </div>

      {/* Main Area: Sidebar of Documents + Editor/Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Files (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-3 border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 uppercase tracking-wider">
            Arquivos do Projeto
          </div>

          <div className="divide-y divide-slate-100">
            {DOC_ASSETS.map((asset) => {
              const isSelected = asset.id === selectedAssetId;
              return (
                <button
                  key={asset.id}
                  onClick={() => setSelectedAssetId(asset.id)}
                  className={`w-full text-left p-3.5 transition-colors flex items-start gap-3 ${
                    isSelected
                      ? 'bg-orange-50/60 border-l-4 border-l-[#EE4D2D] text-slate-900'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="mt-0.5">
                    {asset.linguagem === 'powerquery' && <Code2 className="w-4 h-4 text-blue-600" />}
                    {asset.linguagem === 'dax' && <FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
                    {asset.linguagem === 'json' && <Palette className="w-4 h-4 text-orange-500" />}
                    {asset.linguagem === 'markdown' && <FileText className="w-4 h-4 text-slate-600" />}
                    {asset.linguagem === 'text' && <CheckSquare className="w-4 h-4 text-amber-600" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">{asset.titulo}</span>
                      <span className="text-[10px] font-mono text-slate-400 ml-1">
                        .{asset.arquivo.split('.').pop()}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
                      {asset.arquivo}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                      {asset.descricao}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Guide Card */}
          <div className="p-3.5 bg-slate-50 border-t border-slate-200 mt-auto text-xs text-slate-600 space-y-1.5">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#EE4D2D]" />
              Como Usar no Power BI Desktop:
            </span>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              1. No Power BI, abra <strong>Transformar Dados</strong> &gt; <strong>Editor Avançado</strong> e cole o código M.
              <br />
              2. Em <strong>Exibir</strong> &gt; <strong>Temas</strong> &gt; <strong>Procurar Temas</strong>, importe o arquivo JSON.
            </p>
          </div>
        </div>

        {/* Right Column: Code Viewer / DAX Explorer (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          {/* Top Bar of Viewer */}
          <div className="p-3 border-b border-slate-200 bg-slate-900 text-slate-300 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-white font-semibold">{currentAsset.arquivo}</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                {currentAsset.linguagem}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(currentAsset.conteudo)}
                className="flex items-center gap-1 text-[11px] hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* Specific DAX Measures Search & Visualizer */}
          {currentAsset.id === 'medidas-dax' ? (
            <div className="p-4 space-y-4 flex-1 overflow-y-auto max-h-[600px]">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={daxSearch}
                  onChange={(e) => setDaxSearch(e.target.value)}
                  placeholder="Pesquisar medida DAX por nome, categoria ou fórmula..."
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#EE4D2D]"
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                {filteredDax.map((measure) => (
                  <div
                    key={measure.id}
                    className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <span className="text-xs font-bold text-slate-900">{measure.nome}</span>
                        <span className="text-[10px] text-slate-500 font-mono ml-2">
                          [{measure.categoria}]
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(measure.formula)}
                        className="text-[11px] text-[#EE4D2D] hover:underline flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copiar DAX</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 mb-2">{measure.descricao}</p>

                    <pre className="p-2.5 rounded bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto">
                      <code>{measure.formula}</code>
                    </pre>

                    <div className="mt-1.5 text-[10px] text-slate-400">
                      Formatação sugerida: <span className="font-mono text-slate-600">{measure.formato}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* General Code/Markdown Viewer */
            <div className="p-4 flex-1 overflow-y-auto max-h-[600px] bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed">
              <pre className="whitespace-pre-wrap select-text">
                <code>{currentAsset.conteudo}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
