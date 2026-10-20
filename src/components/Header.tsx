import React from 'react';
import {
  LayoutDashboard,
  Clock,
  DollarSign,
  TableProperties,
  FileCode,
  PlusCircle,
  BellRing,
  DownloadCloud,
  Building2,
  Settings,
  FolderArchive,
  Database,
  RotateCcw,
  Mail,
  Smartphone,
  Sparkles,
  User,
  Users,
  ShieldCheck,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { AppUser } from '../types/facilities';

interface HeaderProps {
  activeTab: 'chamados' | 'executive' | 'sla' | 'costs' | 'table' | 'cds' | 'params' | 'docs' | 'usuarios';
  setActiveTab: (tab: 'chamados' | 'executive' | 'sla' | 'costs' | 'table' | 'cds' | 'params' | 'docs' | 'usuarios') => void;
  onOpenNewModal: () => void;
  onOpenAutomationModal: () => void;
  onExportCsv: () => void;
  totalFilteredCount: number;
  datasetMode?: 'real' | 'mock' | 'all';
  onChangeDatasetMode?: (mode: 'real' | 'mock' | 'all') => void;
  onRestoreRealData?: () => void;
  onOpenPwaModal?: () => void;
  isPwaInstalled?: boolean;
  currentUser?: AppUser | null;
  onOpenLoginModal?: () => void;
  onOpenAuditModal?: () => void;
  auditLogsCount?: number;
  registeredUsersCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewModal,
  onOpenAutomationModal,
  onExportCsv,
  totalFilteredCount,
  datasetMode = 'real',
  onChangeDatasetMode,
  onRestoreRealData,
  onOpenPwaModal,
  isPwaInstalled = false,
  currentUser = null,
  onOpenLoginModal,
  onOpenAuditModal,
  auditLogsCount = 0,
  registeredUsersCount
}) => {
  return (
    <header className="bg-[#172554] border-b border-blue-900 text-slate-100 sticky top-0 z-30 shadow-md">
      {/* Top Header Logos Bar - Imagem 1024 do lado esquerdo e a outra à direita */}
      <div className="bg-[#0b1329] border-b border-blue-900/60 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Lado Esquerdo: Imagem 1024 (Shopee) */}
          <div className="flex items-center gap-3">
            <div className="bg-white px-2.5 py-1 rounded-md shadow-xs flex items-center h-9 sm:h-10 hover:shadow-md transition-shadow">
              <img
                src="/logo-shopee-1024.png"
                alt="Shopee 1024"
                className="h-6 sm:h-7 w-auto object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('.svg')) {
                    target.src = '/logo-shopee-1024.svg';
                  }
                }}
              />
            </div>
            <div className="hidden sm:block border-l border-blue-800/80 pl-3">
              <span className="text-[11px] font-bold tracking-wider text-slate-100 uppercase">
                Shopee Facilities &amp; CCM
              </span>
              <span className="text-[10px] text-blue-300 block -mt-0.5">
                Central de Contingências e Gestão Predial de Centros de Distribuição
              </span>
            </div>
          </div>

          {/* Lado Direito: Usuário Autenticado & CW Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <div
                onClick={onOpenLoginModal}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-blue-950/80 hover:bg-blue-900 border border-blue-800 transition-all cursor-pointer group"
                title="Sessão autenticada. Clique para alternar perfil de usuário."
              >
                <div
                  className={`w-7 h-7 rounded-lg ${currentUser.avatarColor || 'bg-emerald-600'} text-white font-bold text-[11px] flex items-center justify-center shrink-0 shadow-xs relative`}
                >
                  {currentUser.nome
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#0b1329]"></span>
                </div>
                <div className="text-left hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">
                      {currentUser.nome}
                    </span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded font-semibold uppercase">
                      Logado
                    </span>
                  </div>
                  <span className="text-[10px] text-blue-300 block -mt-0.5 truncate max-w-[150px]">
                    {currentUser.cargo}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors hidden sm:block" />
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#EE4D2D] hover:bg-[#d84223] text-white shadow-xs transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>Entrar / Login</span>
              </button>
            )}

            <div className="hidden md:block text-right border-l border-blue-800/80 pl-3">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium block">
                Operação &amp; Facilities
              </span>
              <span className="text-[10px] text-blue-200 block -mt-0.5 font-medium">
                Cushman &amp; Wakefield
              </span>
            </div>
            <div className="bg-white px-2.5 py-1 rounded-md shadow-xs flex items-center h-9 sm:h-10 hover:shadow-md transition-shadow">
              <img
                src="/CW_Logo_Color.png"
                alt="Cushman &amp; Wakefield"
                className="h-5 sm:h-6 w-auto object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('.svg')) {
                    target.src = '/CW_Logo_Color.svg';
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white p-1.5 flex items-center justify-center shadow-lg shadow-orange-950/40 border border-[#EE4D2D]/30 flex-shrink-0">
              <img
                src="/logo-shopee-1024.png"
                alt="Shopee Icon"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">Facilities / CCM</span>
                <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-[#EE4D2D]/20 text-[#EE4D2D] border border-[#EE4D2D]/30">
                  CCM_Facilities_Contingencias.pbix
                </span>
                <span className="hidden lg:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded font-mono bg-blue-900/60 text-blue-200 border border-blue-700/50">
                  <FolderArchive className="w-3 h-3 text-amber-400" />
                  Pacote_PowerBI_Facilities_CCM (1).zip
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-200 mt-0.5">
                <span>Base Operacional</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  DimData 1:N FatoOcorrencias
                </span>
                <span aria-hidden="true">·</span>
                <span>{totalFilteredCount} ocorrências</span>
                <span aria-hidden="true" className="hidden sm:inline">·</span>
                <span className="hidden sm:inline text-slate-300 font-mono text-[11px]">ricardomedalonso@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Base Operacional Oficial (79 Ocorrências Reais) */}
            <div className="flex items-center bg-blue-950/90 rounded-lg p-0.5 border border-blue-800 text-[11px]">
              <div
                title="79 ocorrências reais de contingência de campo (CONT-001 a CONT-079)"
                className="px-2.5 py-1 rounded-md font-semibold bg-[#EE4D2D] text-white shadow-xs flex items-center gap-1.5"
              >
                <Database className="w-3 h-3 text-amber-300" />
                <span>Base Oficial Real (79)</span>
              </div>
              {onRestoreRealData && (
                <button
                  onClick={onRestoreRealData}
                  title="Restaurar ocorrências originais da Base de Contingências (CONT-001 a CONT-079)"
                  className="px-2 py-1 text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden xl:inline text-[10px]">Restaurar</span>
                </button>
              )}
            </div>

            <button
              onClick={onOpenAutomationModal}
              title="Simular disparo de alerta em canal Teams via Power Automate"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-950/80 hover:bg-blue-900 text-blue-200 border border-blue-800 transition-colors"
            >
              <BellRing className="w-3.5 h-3.5 text-amber-400" />
              <span>Simular Alerta Teams</span>
            </button>

            {onOpenPwaModal && (
              <button
                onClick={onOpenPwaModal}
                title="Instalar App no celular, tablet ou computador (PWA Standalone)"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                  isPwaInstalled
                    ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60'
                    : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white border border-orange-400/50 shadow-orange-950/40'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{isPwaInstalled ? 'App Instalado' : 'Instalar App'}</span>
              </button>
            )}

            {onOpenAuditModal && (
              <button
                onClick={onOpenAuditModal}
                title="Visualizar histórico e trilha de auditoria (quem abriu OS, mudou status ou alterou cadastros)"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-950/80 hover:bg-blue-900 text-blue-200 border border-blue-800 transition-colors shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Auditoria &amp; Logs ({auditLogsCount || 0})</span>
              </button>
            )}

            <button
              onClick={onExportCsv}
              title="Exportar base de dados filtrada para CSV"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-950/80 hover:bg-blue-900 text-blue-200 border border-blue-800 transition-colors"
            >
              <DownloadCloud className="w-3.5 h-3.5 text-sky-400" />
              <span>Exportar Excel / CSV</span>
            </button>

            <button
              onClick={() => setActiveTab('chamados')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#EE4D2D] hover:bg-[#d84223] text-white shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Abrir Chamado (E-mail)</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pt-3 border-t border-blue-900/80 mt-3 no-scrollbar">
          <button
            onClick={() => setActiveTab('chamados')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-t-md transition-all whitespace-nowrap border-b-2 ${
              activeTab === 'chamados'
                ? 'bg-[#EE4D2D] text-white border-white shadow-md'
                : 'text-amber-300 hover:text-white border-transparent hover:bg-blue-900/40 bg-amber-500/10'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-amber-300" />
            <span>Abertura de Chamados (E-mail)</span>
            <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.2 rounded-full font-bold uppercase animate-pulse">
              Novo
            </span>
          </button>

          <button
            onClick={() => setActiveTab('executive')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-t-md transition-all whitespace-nowrap border-b-2 ${
              activeTab === 'executive'
                ? 'bg-blue-950 text-white border-[#EE4D2D]'
                : 'text-blue-300 hover:text-white border-transparent hover:bg-blue-900/40'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#EE4D2D]" />
            <span>1. Visão Executiva</span>
          </button>

          <button
            onClick={() => setActiveTab('sla')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-t-md transition-all whitespace-nowrap border-b-2 ${
              activeTab === 'sla'
                ? 'bg-blue-950 text-white border-[#EE4D2D]'
                : 'text-blue-300 hover:text-white border-transparent hover:bg-blue-900/40'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>2. Nível de Serviço &amp; SLA</span>
          </button>

          <button
            onClick={() => setActiveTab('costs')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-t-md transition-all whitespace-nowrap border-b-2 ${
              activeTab === 'costs'
                ? 'bg-blue-950 text-white border-[#EE4D2D]'
                : 'text-blue-300 hover:text-white border-transparent hover:bg-blue-900/40'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            <span>3. Gestão Financeira SPOT</span>
          </button>

          <button
            onClick={() => setActiveTab('table')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-t-md transition-all whitespace-nowrap border-b-2 ${
              activeTab === 'table'
                ? 'bg-blue-950 text-white border-[#EE4D2D]'
                : 'text-blue-300 hover:text-white border-transparent hover:bg-blue-900/40'
            }`}
          >
            <TableProperties className="w-3.5 h-3.5 text-sky-400" />
            <span>4. Tabela Fato</span>
          </button>

          <button
            onClick={() => setActiveTab('cds')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-t-md transition-all whitespace-nowrap border-b-2 ${
              activeTab === 'cds'
                ? 'bg-blue-950 text-white border-[#EE4D2D]'
                : 'text-blue-300 hover:text-white border-transparent hover:bg-blue-900/40'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>5. Cadastro de CDs &amp; Hubs</span>
          </button>

          <button
            onClick={() => setActiveTab('params')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-t-md transition-all whitespace-nowrap border-b-2 ${
              activeTab === 'params'
                ? 'bg-blue-950 text-white border-[#EE4D2D]'
                : 'text-blue-300 hover:text-white border-transparent hover:bg-blue-900/40'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span>6. Parâmetros &amp; Pacote ZIP</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-t-md transition-all whitespace-nowrap border-b-2 ${
              activeTab === 'docs'
                ? 'bg-blue-950 text-white border-[#EE4D2D]'
                : 'text-blue-300 hover:text-white border-transparent hover:bg-blue-900/40'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-orange-400" />
            <span>7. Modelagem &amp; DAX</span>
          </button>

          <button
            onClick={() => setActiveTab('usuarios')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-t-md transition-all whitespace-nowrap border-b-2 ${
              activeTab === 'usuarios'
                ? 'bg-blue-950 text-white border-[#EE4D2D]'
                : 'text-blue-300 hover:text-white border-transparent hover:bg-blue-900/40'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>8. Cadastro de Usuários</span>
            {registeredUsersCount !== undefined && (
              <span className="text-[9px] bg-blue-900/80 border border-blue-700/60 text-amber-300 font-mono px-1.5 py-0.2 rounded-full font-bold">
                {registeredUsersCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
