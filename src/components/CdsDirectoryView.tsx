import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  Search,
  Filter,
  MapPin,
  Mail,
  Phone,
  Zap,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Download,
  PlusCircle,
  FileSpreadsheet,
  X,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Layers,
  Sparkles,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Warehouse,
  Boxes,
  Truck,
  Compass,
  LayoutGrid,
  Table as TableIcon,
  Copy,
  Eye,
  Navigation,
  Check
} from 'lucide-react';
import { CentroDistribuicao, AppUser } from '../types/facilities';
import {
  CADASTRO_CDS,
  CADASTRO_FULL,
  CADASTRO_SOC,
  CADASTRO_HUB,
  CADASTRO_CDS_ALFABETICO,
  LISTA_UFS,
  LISTA_REGIONAIS_CDS,
  MACRO_REGIOES,
  MacroRegiao,
  getMacroRegion,
  CDS_E_SOCS_POR_REGIAO,
  HUBS_POR_REGIAO
} from '../data/cadastrosCDs';

interface CdsDirectoryViewProps {
  onOpenNewIncidentWithCd?: (cd: CentroDistribuicao) => void;
  currentUser?: AppUser | null;
  onAuditLog?: (
    unidade: string,
    action: 'create' | 'update' | 'delete',
    details: string,
    user: AppUser | null,
    oldVal?: string,
    newVal?: string
  ) => void;
}

type TipoFilter = 'TODOS' | 'CDS_TODOS' | 'FULL' | 'SOC' | 'HUB';
type ViewMode = 'regional' | 'tabela';
type SortField = 'tipo_ativo' | 'unidade' | 'cidade' | 'uf' | 'regional' | 'status_regularizacao';

export const CdsDirectoryView: React.FC<CdsDirectoryViewProps> = ({
  onOpenNewIncidentWithCd,
  currentUser,
  onAuditLog
}) => {
  const [cds, setCds] = useState<CentroDistribuicao[]>(CADASTRO_CDS);

  useEffect(() => {
    setCds(CADASTRO_CDS);
  }, []);
  const [activeTipoTab, setActiveTipoTab] = useState<TipoFilter>('TODOS');
  const [viewMode, setViewMode] = useState<ViewMode>('regional');
  const [selectedMacroRegion, setSelectedMacroRegion] = useState<string>('TODAS');
  const [collapsedRegions, setCollapsedRegions] = useState<Record<string, boolean>>({});

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUf, setSelectedUf] = useState('');
  const [selectedRegional, setSelectedRegional] = useState('');
  const [filterPendencia, setFilterPendencia] = useState('');
  const [sortField, setSortField] = useState<SortField>('tipo_ativo');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedCd, setSelectedCd] = useState<CentroDistribuicao | null>(null);
  const [copiedCd, setCopiedCd] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const handleCopyCdDetails = (cd: CentroDistribuicao) => {
    const macro = getMacroRegion(cd.regional, cd.uf, cd.cidade);
    const text = `📦 FICHA CADASTRAL SHOPEE FACILITIES
Unidade: ${cd.unidade} (${cd.tipo_ativo || 'HUB'})
Macrorregião: ${macro}
Regional: ${cd.regional}
Cidade/UF: ${cd.cidade}/${cd.uf}
Endereço: ${cd.endereco || cd.logradouro || 'Não informado'}
Bairro: ${cd.bairro || '—'} | CEP: ${cd.cep || '—'}
Responsável / SL: ${cd.responsavel || 'SL Local'}
Telefone: ${cd.telefone || '—'}
E-mail: ${cd.email || '—'}
CNPJ: ${cd.cnpj || '—'}
Razão Social: ${cd.razao_social || 'SHPS OPERAÇÕES LOGÍSTICAS LTDA'}
Status de Regularização: ${cd.status_regularizacao || 'Regularizado'}${cd.complemento ? `\nObservações: ${cd.complemento}` : ''}`;
    navigator.clipboard.writeText(text);
    setCopiedCd(true);
    setTimeout(() => setCopiedCd(false), 2500);
  };

  // New CD form state
  const [formCd, setFormCd] = useState<Partial<CentroDistribuicao>>({
    unidade: 'HUB-',
    cidade: '',
    uf: 'SP',
    regional: 'São Paulo 2',
    tipo_ativo: 'HUB',
    status_regularizacao: 'Incompleto'
  });

  // Statistics
  const stats = useMemo(() => {
    const total = cds.length;
    const fullCount = cds.filter((c) => c.tipo_ativo === 'FULL').length;
    const socCount = cds.filter((c) => c.tipo_ativo === 'SOC').length;
    const cdsTotal = fullCount + socCount;
    const hubCount = cds.filter((c) => c.tipo_ativo === 'HUB' || (!c.tipo_ativo && !c.unidade.startsWith('SOC') && !c.unidade.startsWith('FULL'))).length;
    const comCnpj = cds.filter((c) => !!c.cnpj).length;
    const comResp = cds.filter((c) => !!c.responsavel).length;
    const ufsCount = new Set(cds.map((c) => c.uf)).size;
    return { total, fullCount, socCount, cdsTotal, hubCount, comCnpj, comResp, ufsCount };
  }, [cds]);

  const toggleRegionCollapse = (reg: string) => {
    setCollapsedRegions((prev) => ({ ...prev, [reg]: !prev[reg] }));
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const applyPresetOrder = (preset: 'padrao' | 'alfabetica') => {
    if (preset === 'padrao') {
      setSortField('tipo_ativo');
      setSortDirection('asc');
    } else {
      setSortField('unidade');
      setSortDirection('asc');
    }
  };

  // Filtered & Sorted List
  const processedCds = useMemo(() => {
    const filtered = cds.filter((cd) => {
      // Tipo tab filter
      if (activeTipoTab === 'CDS_TODOS') {
        if (cd.tipo_ativo !== 'FULL' && cd.tipo_ativo !== 'SOC') return false;
      } else if (activeTipoTab !== 'TODOS') {
        if (cd.tipo_ativo !== activeTipoTab) return false;
      }

      // Macro region filter
      if (selectedMacroRegion !== 'TODAS') {
        const cdMacro = getMacroRegion(cd.regional, cd.uf, cd.cidade);
        if (cdMacro !== selectedMacroRegion) return false;
      }

      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matches =
          cd.unidade.toLowerCase().includes(query) ||
          cd.cidade.toLowerCase().includes(query) ||
          (cd.responsavel && cd.responsavel.toLowerCase().includes(query)) ||
          (cd.endereco && cd.endereco.toLowerCase().includes(query)) ||
          (cd.logradouro && cd.logradouro.toLowerCase().includes(query)) ||
          (cd.cnpj && cd.cnpj.includes(query)) ||
          (cd.email && cd.email.toLowerCase().includes(query));
        if (!matches) return false;
      }
      if (selectedUf && cd.uf !== selectedUf) return false;
      if (selectedRegional && cd.regional !== selectedRegional) return false;
      if (filterPendencia) {
        if (filterPendencia === 'com_cnpj' && !cd.cnpj) return false;
        if (filterPendencia === 'sem_cnpj' && cd.cnpj) return false;
        if (filterPendencia === 'com_responsavel' && !cd.responsavel) return false;
        if (filterPendencia === 'sem_responsavel' && cd.responsavel) return false;
        if (filterPendencia === 'regularizado' && cd.status_regularizacao !== 'Regularizado') return false;
      }
      return true;
    });

    const tipoPriority: Record<string, number> = { FULL: 1, CD: 1, SOC: 2, HUB: 3 };

    return filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === 'tipo_ativo') {
        const pA = tipoPriority[a.tipo_ativo || 'HUB'] || 4;
        const pB = tipoPriority[b.tipo_ativo || 'HUB'] || 4;
        if (pA !== pB) {
          comparison = pA - pB;
        } else {
          comparison = a.unidade.localeCompare(b.unidade, 'pt-BR', { numeric: true, sensitivity: 'base' });
        }
      } else if (sortField === 'unidade') {
        comparison = a.unidade.localeCompare(b.unidade, 'pt-BR', { numeric: true, sensitivity: 'base' });
      } else if (sortField === 'cidade') {
        comparison = a.cidade.localeCompare(b.cidade, 'pt-BR');
      } else if (sortField === 'uf') {
        comparison = a.uf.localeCompare(b.uf, 'pt-BR');
      } else if (sortField === 'regional') {
        comparison = a.regional.localeCompare(b.regional, 'pt-BR');
      } else if (sortField === 'status_regularizacao') {
        comparison = (a.status_regularizacao || '').localeCompare(b.status_regularizacao || '');
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [cds, activeTipoTab, selectedMacroRegion, searchTerm, selectedUf, selectedRegional, filterPendencia, sortField, sortDirection]);

  // Grouped by Macro Region for the Regional View Mode
  const groupedByRegion = useMemo(() => {
    const groups: {
      region: MacroRegiao;
      cds: CentroDistribuicao[];
      hubs: CentroDistribuicao[];
      totalCount: number;
    }[] = [];

    MACRO_REGIOES.forEach((reg) => {
      if (selectedMacroRegion !== 'TODAS' && selectedMacroRegion !== reg) return;

      const unitsInReg = processedCds.filter((c) => getMacroRegion(c.regional, c.uf, c.cidade) === reg);
      const cdsInReg = unitsInReg.filter((c) => c.tipo_ativo === 'FULL' || c.tipo_ativo === 'SOC');
      const hubsInReg = unitsInReg.filter((c) => c.tipo_ativo === 'HUB');

      if (unitsInReg.length > 0) {
        groups.push({
          region: reg,
          cds: cdsInReg,
          hubs: hubsInReg,
          totalCount: unitsInReg.length
        });
      }
    });

    return groups;
  }, [processedCds, selectedMacroRegion]);

  const handleExportCsv = () => {
    const headers = [
      'Tipo',
      'Unidade (CD/HUB)',
      'Macrorregião',
      'CNPJ',
      'Razão Social',
      'Endereço',
      'Cidade',
      'UF',
      'Regional Shopee',
      'Responsável / SL',
      'Telefone',
      'E-mail',
      'Status Regularização'
    ];

    const rows = processedCds.map((c) => [
      c.tipo_ativo || 'HUB',
      c.unidade,
      getMacroRegion(c.regional, c.uf, c.cidade),
      c.cnpj || '',
      c.razao_social || '',
      `"${c.endereco || c.logradouro || ''}"`,
      c.cidade,
      c.uf,
      c.regional,
      c.responsavel || '',
      c.telefone || '',
      c.email || '',
      c.status_regularizacao || ''
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cadastro_CDs_e_Hubs_Shopee_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveNewCd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCd.unidade || !formCd.cidade) return;

    const newEntry: CentroDistribuicao = {
      unidade: formCd.unidade.trim(),
      cnpj: formCd.cnpj || '',
      razao_social: 'SHPX LOGISTICA LTDA.',
      endereco: formCd.endereco || formCd.logradouro || '',
      bairro: formCd.bairro || '',
      cidade: formCd.cidade.trim(),
      uf: formCd.uf || 'SP',
      regional: formCd.regional || 'São Paulo 2',
      responsavel: formCd.responsavel || '',
      telefone: formCd.telefone || '',
      email: formCd.email || '',
      tipo_ativo: (formCd.tipo_ativo as 'HUB' | 'SOC' | 'FULL') || 'HUB',
      status_regularizacao: formCd.cnpj ? 'Regularizado' : 'Incompleto',
      cadastrado_por: currentUser ? `${currentUser.nome} (${currentUser.email})` : 'Operação Facilities',
      cadastrado_em: new Date().toISOString()
    };

    setCds([newEntry, ...cds]);
    setIsNewModalOpen(false);
    setSelectedCd(newEntry);

    if (onAuditLog) {
      onAuditLog(
        newEntry.unidade,
        'create',
        `Unidade ${newEntry.unidade} (${newEntry.tipo_ativo || 'HUB'}) cadastrada em ${newEntry.cidade}/${newEntry.uf} por ${currentUser ? currentUser.nome : 'Operação Facilities'}.`,
        currentUser || null,
        undefined,
        newEntry.status_regularizacao
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total de Ativos
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-slate-900">{stats.total}</span>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-orange-100 text-[#EE4D2D]">
              Oficial CW
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {stats.cdsTotal} CDs & SOCs · {stats.hubCount} HUBs
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Centros de Distribuição (CDs / SOCs)
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-indigo-600">{stats.socCount}</span>
            <span className="text-xs text-purple-600 font-mono">
              Sortation Centers
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Mega Centros de Triagem</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Hubs de Entrega (HUBs)
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-emerald-600">{stats.hubCount}</span>
            <span className="text-xs text-emerald-700 font-mono">Last-Mile</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">7 Macrorregiões do Brasil</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Estados (UFs) Ativos
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-blue-600">{stats.ufsCount}</span>
            <span className="text-xs text-slate-400 font-mono">
              {stats.comResp} com SL
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Cobertura nacional Shopee</span>
        </div>
      </div>

      {/* Categorias Principais (CDs vs HUBs Separados) */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTipoTab('TODOS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTipoTab === 'TODOS'
                ? 'bg-[#0b1329] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Todos os Ativos ({stats.total})</span>
          </button>

          <button
            onClick={() => setActiveTipoTab(activeTipoTab === 'SOC' || activeTipoTab === 'CDS_TODOS' ? 'TODOS' : 'SOC')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTipoTab === 'SOC' || activeTipoTab === 'CDS_TODOS'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
            }`}
            title="Separar somente Centros de Distribuição (SOCs)"
          >
            <Warehouse className="w-3.5 h-3.5 text-purple-500" />
            <span>🏢 Centros de Distribuição (CDs / SOCs: {stats.socCount})</span>
          </button>

          <button
            onClick={() => setActiveTipoTab(activeTipoTab === 'HUB' ? 'TODOS' : 'HUB')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTipoTab === 'HUB'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
            title="Separar somente Hubs Operacionais Last-Mile"
          >
            <Truck className="w-3.5 h-3.5 text-emerald-500" />
            <span>🚚 Hubs Operacionais (HUBs: {stats.hubCount})</span>
          </button>
        </div>

        {/* Alternância de Modo: Agrupado por Região vs Tabela */}
        <div className="flex items-center gap-2">
          <div className="p-0.5 bg-slate-100 rounded-lg border border-slate-200 flex items-center text-xs">
            <button
              onClick={() => setViewMode('regional')}
              className={`px-3 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'regional'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#EE4D2D]" />
              <span>Agrupado por Região</span>
            </button>
            <button
              onClick={() => setViewMode('tabela')}
              className={`px-3 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'tabela'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>Tabela Geral</span>
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Filtros por Macrorregião (Pills de navegação rápida) */}
      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-500 font-semibold px-2 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-[#EE4D2D]" />
          <span>Filtrar Região:</span>
        </span>
        <button
          onClick={() => setSelectedMacroRegion('TODAS')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            selectedMacroRegion === 'TODAS'
              ? 'bg-[#0b1329] text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          Todas as Regiões
        </button>
        {MACRO_REGIOES.map((reg) => (
          <button
            key={reg}
            onClick={() => setSelectedMacroRegion(reg)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              selectedMacroRegion === reg
                ? 'bg-[#EE4D2D] text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {reg}
          </button>
        ))}
      </div>

      {/* Control Bar: Search & Specific Slicers */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative min-w-[240px] flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por Unidade (CD Cajamar, HUB-LBA, SOC-SP), Cidade, Responsável, CNPJ..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#EE4D2D]"
            />
          </div>

          {/* UF Filter */}
          <select
            value={selectedUf}
            onChange={(e) => setSelectedUf(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700"
          >
            <option value="">Todas as UFs ({LISTA_UFS.length})</option>
            {LISTA_UFS.map((uf) => (
              <option key={uf} value={uf}>
                UF: {uf}
              </option>
            ))}
          </select>

          {/* Regional Filter */}
          <select
            value={selectedRegional}
            onChange={(e) => setSelectedRegional(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 max-w-[180px]"
          >
            <option value="">Todas as Regionais</option>
            {LISTA_REGIONAIS_CDS.map((reg) => (
              <option key={reg} value={reg}>
                {reg}
              </option>
            ))}
          </select>
        </div>

        {/* Preset Order buttons (Table mode) */}
        {viewMode === 'tabela' && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Ordem:</span>
            <button
              onClick={() => applyPresetOrder('padrao')}
              className={`px-2 py-1 rounded border text-xs font-semibold ${
                sortField === 'tipo_ativo' ? 'bg-[#EE4D2D] text-white border-[#EE4D2D]' : 'bg-slate-50 text-slate-600'
              }`}
            >
              CDs → SOCs → HUBs
            </button>
            <button
              onClick={() => applyPresetOrder('alfabetica')}
              className={`px-2 py-1 rounded border text-xs font-semibold ${
                sortField === 'unidade' ? 'bg-[#EE4D2D] text-white border-[#EE4D2D]' : 'bg-slate-50 text-slate-600'
              }`}
            >
              A-Z
            </button>
          </div>
        )}
      </div>

      {/* MODO 1: VISUALIZAÇÃO AGRUPADA POR REGIÃO (CDs E HUBs SEPARADOS) */}
      {viewMode === 'regional' && (
        <div className="space-y-6">
          {groupedByRegion.map((group) => {
            const isCollapsed = !!collapsedRegions[group.region];

            return (
              <div
                key={group.region}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all"
              >
                {/* Header da Região */}
                <div
                  onClick={() => toggleRegionCollapse(group.region)}
                  className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <button className="text-slate-400 hover:text-white transition-colors">
                      {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    <div>
                      <h3 className="font-bold text-sm tracking-wide flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#EE4D2D]" />
                        <span>{group.region}</span>
                      </h3>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        {group.totalCount} {group.totalCount === 1 ? 'ativo operacional' : 'ativos operacionais'} nesta região
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {group.cds.length > 0 && (
                      <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 rounded-lg font-mono font-semibold">
                        🏢 {group.cds.length} {group.cds.length === 1 ? 'CD/SOC' : 'CDs/SOCs'}
                      </span>
                    )}
                    {group.hubs.length > 0 && (
                      <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 rounded-lg font-mono font-semibold">
                        🚚 {group.hubs.length} {group.hubs.length === 1 ? 'HUB' : 'HUBs'}
                      </span>
                    )}
                  </div>
                </div>

                {!isCollapsed && (
                  <div className="p-4 space-y-6 bg-slate-50/50">
                    {/* SEÇÃO 1: CENTROS DE DISTRIBUIÇÃO & SOCS DA REGIÃO */}
                    {group.cds.length > 0 && (activeTipoTab === 'TODOS' || activeTipoTab === 'CDS_TODOS' || activeTipoTab === 'FULL' || activeTipoTab === 'SOC') && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                          <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-2">
                            <Warehouse className="w-4 h-4 text-indigo-600" />
                            <span>Centros de Distribuição & Triagem ({group.cds.length} Unidades em {group.region})</span>
                          </h4>
                          <span className="text-[11px] text-indigo-600 font-medium">FULL & Sortation Centers</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {group.cds.map((cd) => (
                            <div
                              key={cd.unidade}
                              onClick={() => setSelectedCd(cd)}
                              className="bg-white border-2 border-indigo-100 hover:border-indigo-400 rounded-xl p-3.5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <span
                                      className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider mb-1 ${
                                        cd.tipo_ativo === 'FULL'
                                          ? 'bg-indigo-600 text-white'
                                          : 'bg-purple-600 text-white'
                                      }`}
                                    >
                                      {cd.tipo_ativo} · CD
                                    </span>
                                    <h5 className="font-bold text-sm text-slate-900 group-hover:text-indigo-700 transition-colors">{cd.unidade}</h5>
                                  </div>
                                  <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-semibold">
                                    {cd.uf}
                                  </span>
                                </div>

                                <p className="text-xs text-slate-600 font-medium mt-1">
                                  {cd.cidade} · <span className="text-slate-400">{cd.regional}</span>
                                </p>

                                {cd.endereco && (
                                  <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">
                                    📍 {cd.endereco}
                                  </p>
                                )}

                                <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                                  {cd.responsavel && (
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-slate-400">SL:</span>
                                      <span className="font-medium text-slate-800">{cd.responsavel}</span>
                                    </div>
                                  )}
                                  {cd.telefone && (
                                    <div className="flex items-center gap-1.5 text-slate-500">
                                      <Phone className="w-3 h-3 text-slate-400" />
                                      <span>{cd.telefone}</span>
                                    </div>
                                  )}
                                  {cd.cnpj && (
                                    <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
                                      <span>CNPJ: {cd.cnpj}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCd(cd);
                                  }}
                                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Ficha</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenNewIncidentWithCd?.(cd);
                                  }}
                                  className="text-xs font-bold text-[#EE4D2D] hover:text-[#d03b1d] flex items-center gap-1"
                                >
                                  <span>Acionar CW</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SEÇÃO 2: HUBS OPERACIONAIS DA REGIÃO */}
                    {group.hubs.length > 0 && (activeTipoTab === 'TODOS' || activeTipoTab === 'HUB') && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                          <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-2">
                            <Truck className="w-4 h-4 text-emerald-600" />
                            <span>Hubs Operacionais Last-Mile ({group.hubs.length} Hubs em {group.region})</span>
                          </h4>
                          <span className="text-[11px] text-emerald-600 font-medium">Bases Operacionais Last-Mile</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
                          {group.hubs.map((cd) => (
                            <div
                              key={cd.unidade}
                              onClick={() => setSelectedCd(cd)}
                              className="bg-white border border-slate-200 hover:border-emerald-400 rounded-xl p-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                                    HUB
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-500 font-semibold">
                                    {cd.uf}
                                  </span>
                                </div>
                                <h5 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors">{cd.unidade}</h5>
                                <p className="text-[11px] text-slate-600 font-medium">
                                  {cd.cidade}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  {cd.regional}
                                </p>
                                {cd.endereco && (
                                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-1" title={cd.endereco}>
                                    📍 {cd.endereco}
                                  </p>
                                )}
                              </div>

                              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCd(cd);
                                  }}
                                  className="text-[11px] font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Ficha</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenNewIncidentWithCd?.(cd);
                                  }}
                                  className="text-[11px] font-bold text-[#EE4D2D] hover:underline flex items-center gap-0.5"
                                >
                                  <span>Acionar</span>
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MODO 2: VISUALIZAÇÃO EM TABELA GERAL */}
      {viewMode === 'tabela' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-semibold border-b border-slate-800">
                  <th
                    onClick={() => handleSort('tipo_ativo')}
                    className="p-3 cursor-pointer hover:bg-slate-800 transition-colors w-28"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Tipo</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('unidade')}
                    className="p-3 cursor-pointer hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Unidade</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="p-3">Macrorregião</th>
                  <th
                    onClick={() => handleSort('cidade')}
                    className="p-3 cursor-pointer hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Cidade / UF</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('regional')}
                    className="p-3 cursor-pointer hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Regional Shopee</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="p-3">CNPJ</th>
                  <th className="p-3">Responsável</th>
                  <th className="p-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {processedCds.map((cd) => {
                  const macro = getMacroRegion(cd.regional, cd.uf, cd.cidade);
                  const isCdType = cd.tipo_ativo === 'FULL' || cd.tipo_ativo === 'SOC';

                  return (
                    <tr
                      key={cd.unidade}
                      onClick={() => setSelectedCd(cd)}
                      className={`hover:bg-slate-100/80 transition-colors cursor-pointer ${
                        isCdType ? 'bg-indigo-50/20' : ''
                      }`}
                    >
                      <td className="p-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            cd.tipo_ativo === 'FULL'
                              ? 'bg-indigo-600 text-white'
                              : cd.tipo_ativo === 'SOC'
                              ? 'bg-purple-600 text-white'
                              : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {cd.tipo_ativo || 'HUB'}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                        {isCdType ? (
                          <Warehouse className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                        ) : (
                          <Truck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        )}
                        <span>{cd.unidade}</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium text-[11px]">
                          {macro}
                        </span>
                      </td>
                      <td className="p-3 text-slate-700">
                        {cd.cidade} / <span className="font-semibold">{cd.uf}</span>
                      </td>
                      <td className="p-3 text-slate-600">{cd.regional}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-500">
                        {cd.cnpj || '—'}
                      </td>
                      <td className="p-3 text-slate-700">
                        {cd.responsavel || '—'}
                      </td>
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedCd(cd)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold text-xs transition-colors flex items-center gap-1"
                            title="Ver Ficha Cadastral Completa"
                          >
                            <Eye className="w-3 h-3 text-slate-500" />
                            <span>Ficha</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenNewIncidentWithCd?.(cd)}
                            className="px-2.5 py-1 bg-[#EE4D2D]/10 hover:bg-[#EE4D2D] text-[#EE4D2D] hover:text-white rounded-md font-bold text-xs transition-colors"
                          >
                            Acionar CW
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL FICHA CADASTRAL OFICIAL */}
      {selectedCd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0b1329] via-[#172554] to-[#1e1b4b] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white p-2 shadow-md flex items-center justify-center border border-white/20 shrink-0">
                  <img
                    src="/logo-shopee-1024.png"
                    alt="Shopee Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full inline-block">
                      Ficha Cadastral Oficial Shopee
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        selectedCd.tipo_ativo === 'FULL'
                          ? 'bg-indigo-600 text-white'
                          : selectedCd.tipo_ativo === 'SOC'
                          ? 'bg-purple-600 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {selectedCd.tipo_ativo || 'HUB'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5 flex items-center gap-2">
                    <span>{selectedCd.unidade}</span>
                    <span className="text-xs font-normal text-blue-200">
                      ({selectedCd.cidade} - {selectedCd.uf})
                    </span>
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedCd(null)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              {/* Highlight Banner se Keven Teixeira / Gestor Facilities */}
              {selectedCd.complemento && selectedCd.complemento.includes('Keven Teixeira') && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <span className="font-bold text-amber-950 block text-xs">
                        Regional: São Paulo 1 · Gestão de Facilities
                      </span>
                      <span className="text-[11px] text-amber-800">
                        Supervisor: Keven Teixeira (Keven.teixeira@shopee.com)
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-200/60 text-amber-900 rounded font-semibold text-[10px]">
                    Base Real Shopee
                  </span>
                </div>
              )}

              {/* Grid 2 colunas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Coluna 1: Endereço & Localização */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-blue-900">
                    <MapPin className="w-3.5 h-3.5 text-[#EE4D2D]" />
                    <span>Localização &amp; Endereço</span>
                  </h4>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Endereço Completo:</span>
                    <p className="font-medium text-slate-900 mt-0.5 leading-relaxed">
                      {selectedCd.endereco || selectedCd.logradouro || 'Não informado'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Bairro:</span>
                      <span className="font-medium text-slate-800">{selectedCd.bairro || '—'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">CEP:</span>
                      <span className="font-medium font-mono text-slate-800">{selectedCd.cep || '—'}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Macrorregião:</span>
                      <span className="font-semibold text-slate-800">
                        {getMacroRegion(selectedCd.regional, selectedCd.uf, selectedCd.cidade)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Regional Shopee:</span>
                      <span className="font-medium text-slate-800">{selectedCd.regional}</span>
                    </div>
                  </div>
                </div>

                {/* Coluna 2: Responsável Local & Contatos */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-blue-900">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Responsável Local (SL) &amp; Contato</span>
                  </h4>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Líder / SL Local:</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">
                      {selectedCd.responsavel || 'SL Local'}
                    </p>
                  </div>
                  <div className="pt-1 border-t border-slate-200/60 space-y-1.5">
                    {selectedCd.telefone && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>Telefone:</span>
                        </span>
                        <a
                          href={`tel:${selectedCd.telefone.replace(/\D/g, '')}`}
                          className="font-semibold text-blue-700 hover:underline font-mono"
                        >
                          {selectedCd.telefone}
                        </a>
                      </div>
                    )}
                    {selectedCd.email && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>E-mail:</span>
                        </span>
                        <a
                          href={`mailto:${selectedCd.email}`}
                          className="font-medium text-[#EE4D2D] hover:underline truncate max-w-[180px]"
                        >
                          {selectedCd.email}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <span className="text-slate-500">Regularização:</span>
                      <span className="px-2 py-0.5 rounded-full font-semibold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {selectedCd.status_regularizacao || 'Regularizado'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações Fiscais & Utilidades */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
                <div>
                  <span className="text-slate-400 block">CNPJ:</span>
                  <span className="font-mono font-medium text-slate-800">{selectedCd.cnpj || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Razão Social:</span>
                  <span className="font-medium text-slate-800 truncate block">
                    {selectedCd.razao_social || 'SHPS OPERAÇÕES LOGÍSTICAS'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Energia Elétrica:</span>
                  <span className="font-medium text-emerald-700 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-500" />
                    {selectedCd.status_energia || 'Regular'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Abastecimento de Água:</span>
                  <span className="font-medium text-emerald-700 flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-blue-500" />
                    {selectedCd.status_agua || 'Regular'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer com Ações */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyCdDetails(selectedCd)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  {copiedCd ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copiar Ficha</span>
                    </>
                  )}
                </button>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${selectedCd.unidade} ${selectedCd.endereco || ''} ${selectedCd.cidade} ${selectedCd.uf}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5 text-sky-600" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCd(null)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const cd = selectedCd;
                    setSelectedCd(null);
                    onOpenNewIncidentWithCd?.(cd);
                  }}
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-[#EE4D2D] hover:bg-[#d84223] text-white shadow-sm transition-all flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Acionar Central CW com esta Unidade</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
