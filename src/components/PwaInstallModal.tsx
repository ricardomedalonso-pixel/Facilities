import React from 'react';
import {
  DownloadCloud,
  X,
  Smartphone,
  Laptop,
  Share2,
  PlusSquare,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  WifiOff
} from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => Promise<boolean>;
  isInstallable: boolean;
  isInstalled: boolean;
  isIos: boolean;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({
  isOpen,
  onClose,
  onInstall,
  isInstallable,
  isInstalled,
  isIos
}) => {
  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await onInstall();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0b1329] via-[#172554] to-[#1e1b4b] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white p-2 shadow-md flex items-center justify-center border border-white/20">
              <img
                src="/logo-shopee-1024.png"
                alt="Shopee Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full inline-block">
                Progressive Web App (PWA)
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                Instalar Aplicativo Oficial
              </h3>
              <p className="text-xs text-blue-200">
                Shopee Facilities &amp; CCM Central CW
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          {/* Status banner */}
          {isInstalled ? (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-xs">Aplicativo já instalado no seu dispositivo!</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Você já pode abri-lo diretamente da sua tela inicial ou barra de tarefas.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <Zap className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                <span className="font-bold text-slate-800 block text-[11px]">Inicialização</span>
                <span className="text-[10px] text-slate-500">Super Rápida</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <WifiOff className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="font-bold text-slate-800 block text-[11px]">Modo Offline</span>
                <span className="text-[10px] text-slate-500">Cache Local</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <span className="font-bold text-slate-800 block text-[11px]">Tela Cheia</span>
                <span className="text-[10px] text-slate-500">Sem barra URL</span>
              </div>
            </div>
          )}

          {/* Action button if install prompt is ready */}
          {isInstallable && !isInstalled && (
            <button
              onClick={handleInstallClick}
              className="w-full py-3 px-4 bg-[#EE4D2D] hover:bg-[#d84223] text-white font-bold rounded-xl shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all text-sm"
            >
              <DownloadCloud className="w-5 h-5" />
              <span>Instalar Aplicativo Agora</span>
            </button>
          )}

          {/* Instructions by Platform */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <span className="font-bold text-slate-900 block text-xs">
              Instruções de Instalação:
            </span>

            {/* Android / Chrome */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
              <Smartphone className="w-5 h-5 text-[#EE4D2D] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">Android &amp; Google Chrome</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Clique no botão <strong>Instalar</strong> acima ou toque nos 3 pontinhos (⋮) do Chrome e selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
                </p>
              </div>
            </div>

            {/* iOS Safari */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
              <Share2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">iPhone &amp; iPad (iOS Safari)</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  No Safari, toque no botão <strong>Compartilhar</strong> (ícone do quadrado com a seta para cima <Share2 className="w-3 h-3 inline text-blue-600" />), role para baixo e toque em <strong>"Adicionar à Tela de Início"</strong>.
                </p>
              </div>
            </div>

            {/* Windows / Mac */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
              <Laptop className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">Computador (Windows / Mac / Linux)</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  No Google Chrome ou Microsoft Edge, clique no ícone de instalação <DownloadCloud className="w-3 h-3 inline text-indigo-600" /> que aparece à direita na barra de endereços do navegador.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500">
            Versão PWA Standalone Oficial
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
