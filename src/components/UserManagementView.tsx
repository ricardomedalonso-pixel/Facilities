import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Building2,
  Warehouse,
  Boxes,
  Truck,
  CheckCircle2,
  ShieldCheck,
  Edit2,
  Trash2,
  LogIn,
  X,
  Phone,
  Mail,
  Briefcase,
  MapPin,
  Check,
  Filter,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AppUser, CentroDistribuicao } from '../types/facilities';
import { CADASTRO_CDS, CADASTRO_HUB, CADASTRO_SOC, CADASTRO_FULL, LISTA_REGIONAIS_CDS } from '../data/cadastrosCDs';

interface UserManagementViewProps {
  users: AppUser[];
  currentUser: AppUser | null;
  onSelectUserForLogin: (user: AppUser) => void;
  onSaveUser: (user: AppUser, isNew: boolean) => void;
  onDeleteUser: (userId: string) => void;
}

const AVATAR_COLORS = [
  'bg-emerald-600',
  'bg-orange-600',
  'bg-blue-600',
  'bg-indigo-600',
  'bg-purple-600',
  'bg-rose-600',
  'bg-teal-600',
  'bg-slate-700'
];

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  currentUser,
  onSelectUserForLogin,
  onSaveUser,
  onDeleteUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [regionalFilter, setRegionalFilter] = useState('ALL');

  // Modal / Drawer state for Create / Edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Form Fields
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cargo, setCargo] = useState('Líder Operacional (SL)');
  const [regional, setRegional] = useState('São Paulo 1');
  const [role, setRole] = useState<AppUser['role']>('lider_sl');
  const [telefone, setTelefone] = useState('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [acessoTodos, setAcessoTodos] = useState(false);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);

  // Facility selector internal filters in modal
  const [facilitySearch, setFacilitySearch] = useState('');
  const [facilityTypeTab, setFacilityTypeTab] = useState<'ALL' | 'CD' | 'HUB' | 'SOC'>('ALL');
  const [facilityRegionalFilter, setFacilityRegionalFilter] = useState('ALL');

  // Open Create Form
  const handleOpenCreate = () => {
    setEditingUserId(null);
    setNome('');
    setEmail('');
    setCargo('Líder Operacional (SL)');
    setRegional('São Paulo 1');
    setRole('lider_sl');
    setTelefone('');
    setAvatarColor(AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]);
    setAcessoTodos(false);
    setSelectedUnits(['HUB-OSP-03']);
    setFacilitySearch('');
    setFacilityTypeTab('ALL');
    setFacilityRegionalFilter('ALL');
    setIsFormOpen(true);
  };

  // Open Edit Form
  const handleOpenEdit = (user: AppUser) => {
    setEditingUserId(user.id);
    setNome(user.nome);
    setEmail(user.email);
    setCargo(user.cargo);
    setRegional(user.regional);
    setRole(user.role);
    setTelefone(user.telefone || '');
    setAvatarColor(user.avatarColor || AVATAR_COLORS[0]);
    setAcessoTodos(user.acessoTodos ?? false);
    setSelectedUnits(user.unidadesPermitidas || []);
    setFacilitySearch('');
    setFacilityTypeTab('ALL');
    setFacilityRegionalFilter('ALL');
    setIsFormOpen(true);
  };

  // Toggle unit selection
  const handleToggleUnit = (unitCode: string) => {
    setSelectedUnits((prev) =>
      prev.includes(unitCode) ? prev.filter((u) => u !== unitCode) : [...prev, unitCode]
    );
  };

  // Bulk actions for units
  const handleSelectAllHubs = () => {
    const hubCodes = CADASTRO_HUB.map((h) => h.unidade);
    setSelectedUnits((prev) => Array.from(new Set([...prev, ...hubCodes])));
  };

  const handleSelectAllCds = () => {
    const cdCodes = CADASTRO_FULL.map((c) => c.unidade);
    setSelectedUnits((prev) => Array.from(new Set([...prev, ...cdCodes])));
  };

  const handleSelectAllSocs = () => {
    const socCodes = CADASTRO_SOC.map((s) => s.unidade);
    setSelectedUnits((prev) => Array.from(new Set([...prev, ...socCodes])));
  };

  const handleClearUnits = () => {
    setSelectedUnits([]);
  };

  // Save handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) return;

    const userObj: AppUser = {
      id: editingUserId || `USR-${Date.now().toString().slice(-4)}`,
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      cargo: cargo.trim(),
      regional,
      role,
      telefone: telefone.trim(),
      avatarColor,
      acessoTodos,
      unidadesPermitidas: acessoTodos ? [] : selectedUnits,
      tiposPermitidos: ['HUB', 'SOC', 'FULL', 'CD'],
      loggedAt: editingUserId ? users.find((u) => u.id === editingUserId)?.loggedAt : new Date().toISOString(),
      createdAt: editingUserId ? users.find((u) => u.id === editingUserId)?.createdAt : new Date().toISOString()
    };

    onSaveUser(userObj, !editingUserId);
    setIsFormOpen(false);
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
      if (regionalFilter !== 'ALL' && u.regional !== regionalFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = u.nome.toLowerCase().includes(q);
        const matchesEmail = u.email.toLowerCase().includes(q);
        const matchesCargo = u.cargo.toLowerCase().includes(q);
        const matchesUnits = (u.unidadesPermitidas || []).some((unit) => unit.toLowerCase().includes(q));
        if (!matchesName && !matchesEmail && !matchesCargo && !matchesUnits) return false;
      }
      return true;
    });
  }, [users, roleFilter, regionalFilter, searchTerm]);

  // Filtered Facilities inside Modal
  const modalFacilities = useMemo(() => {
    return CADASTRO_CDS.filter((cd) => {
      // Type Tab
      if (facilityTypeTab === 'CD' && cd.tipo_ativo !== 'FULL' && cd.tipo_ativo !== 'CD' && !cd.unidade.toLowerCase().includes('cd')) return false;
      if (facilityTypeTab === 'HUB' && cd.tipo_ativo !== 'HUB' && !cd.unidade.startsWith('HUB')) return false;
      if (facilityTypeTab === 'SOC' && cd.tipo_ativo !== 'SOC' && !cd.unidade.startsWith('SOC')) return false;

      // Regional Filter
      if (facilityRegionalFilter !== 'ALL' && cd.regional !== facilityRegionalFilter) return false;

      // Search
      if (facilitySearch.trim()) {
        const q = facilitySearch.toLowerCase();
        const mUnit = cd.unidade.toLowerCase().includes(q);
        const mCity = cd.cidade.toLowerCase().includes(q);
        const mUf = cd.uf.toLowerCase().includes(q);
        const mResp = (cd.responsavel || '').toLowerCase().includes(q);
        if (!mUnit && !mCity && !mUf && !mResp) return false;
      }

      return true;
    });
  }, [facilityTypeTab, facilityRegionalFilter, facilitySearch]);

  // Counts of selected types
  const selectedCounts = useMemo(() => {
    let cdsCount = 0;
    let hubsCount = 0;
    let socsCount = 0;

    for (const code of selectedUnits) {
      if (code.startsWith('SOC')) socsCount++;
      else if (code.startsWith('HUB')) hubsCount++;
      else cdsCount++;
    }

    return { total: selectedUnits.length, cdsCount, hubsCount, socsCount };
  }, [selectedUnits]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-gradient-to-r from-[#0b1329] via-[#172554] to-[#1e1b4b] rounded-2xl p-6 text-white shadow-xl border border-blue-900/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md p-3 flex items-center justify-center border border-white/20 shadow-inner">
              <Users className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full inline-block">
                  Segurança, Rastreabilidade &amp; Controle de Acesso
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full inline-block">
                  Auditoria Automática Ativa
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Cadastro de Usuários &amp; Vínculo de Unidades
              </h1>
              <p className="text-xs text-blue-200 mt-0.5 max-w-2xl">
                Gerencie quem pode operar o sistema e configure a quais CDs, HUBs e SOCs cada usuário possui acesso.
                Qualquer criação, alteração ou exclusão é carimbada na trilha de auditoria.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#EE4D2D] hover:bg-[#d84223] text-white shadow-lg shadow-orange-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Novo Usuário</span>
            </button>
          </div>
        </div>

        {/* Quick Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-blue-900/60">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[10px] uppercase font-semibold text-blue-300 block">Total de Usuários</span>
            <span className="text-xl font-bold text-white mt-0.5 block">{users.length}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[10px] uppercase font-semibold text-blue-300 block">Usuário em Sessão</span>
            <span className="text-xs font-bold text-emerald-400 mt-1 block truncate">
              {currentUser ? currentUser.nome : 'Nenhum autenticado'}
            </span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[10px] uppercase font-semibold text-blue-300 block">Unidades no Sistema</span>
            <span className="text-xl font-bold text-white mt-0.5 block">{CADASTRO_CDS.length} ativas</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[10px] uppercase font-semibold text-blue-300 block">Tipos de Ativo</span>
            <span className="text-xs font-bold text-amber-300 mt-1 block">
              6 FULL · 50 HUBs · 7 SOCs
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, e-mail, cargo ou unidade..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#EE4D2D]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700">Filtros:</span>
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 text-xs focus:outline-none focus:border-[#EE4D2D]"
          >
            <option value="ALL">Todos os Perfis (Roles)</option>
            <option value="admin">Administrador</option>
            <option value="gestor">Gestor Facilities</option>
            <option value="lider_sl">Líder Operacional (SL)</option>
            <option value="analista">Analista de Operações</option>
            <option value="central_cw">Central CW Plantão</option>
            <option value="operador">Operador Local</option>
          </select>

          <select
            value={regionalFilter}
            onChange={(e) => setRegionalFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 text-xs focus:outline-none focus:border-[#EE4D2D]"
          >
            <option value="ALL">Todas as Regionais</option>
            {LISTA_REGIONAIS_CDS.map((reg) => (
              <option key={reg} value={reg}>
                {reg}
              </option>
            ))}
            <option value="Nacional (Brasil)">Nacional (Brasil)</option>
          </select>

          {(searchTerm || roleFilter !== 'ALL' || regionalFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('ALL');
                setRegionalFilter('ALL');
              }}
              className="text-xs text-slate-500 hover:text-red-600 px-2 py-1 underline font-medium"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => {
          const isCurrent = currentUser?.email === user.email;
          const assignedCount = user.acessoTodos ? CADASTRO_CDS.length : user.unidadesPermitidas?.length || 0;

          return (
            <div
              key={user.id}
              className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden group shadow-xs hover:shadow-md ${
                isCurrent
                  ? 'border-emerald-400 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-blue-400'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-3 bg-gradient-to-br from-slate-50/70 to-white">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl ${user.avatarColor || 'bg-slate-700'} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs relative`}
                  >
                    {user.nome
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                    {isCurrent && (
                      <span
                        title="Sessão Ativa"
                        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white"
                      ></span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-slate-900 text-xs group-hover:text-[#EE4D2D] transition-colors">
                        {user.nome}
                      </h3>
                      {isCurrent && (
                        <span className="text-[9px] bg-emerald-600 text-white px-2 py-0.2 rounded-full font-bold">
                          Logado
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">{user.cargo}</p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono mt-0.5">
                      <Mail className="w-3 h-3" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                    user.role === 'admin'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : user.role === 'gestor'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : user.role === 'central_cw'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}
                >
                  {user.role}
                </span>
              </div>

              {/* Card Body - Facilities & Info */}
              <div className="p-4 space-y-3 text-xs flex-1">
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Regional:</span>
                    <strong className="text-slate-800">{user.regional}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Telefone:</span>
                    <strong className="text-slate-800">{user.telefone || '—'}</strong>
                  </div>
                </div>

                {/* Seleção de CDs, HUBs e SOC do Usuário */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Unidades Permitidas:</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {user.acessoTodos ? 'Acesso Total (63)' : `${assignedCount} unidades`}
                    </span>
                  </div>

                  {user.acessoTodos ? (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        <strong>Acesso Geral Homologado:</strong> Visualização e abertura liberadas para todos os Centros de Distribuição, HUBs e SOCs.
                      </span>
                    </div>
                  ) : user.unidadesPermitidas && user.unidadesPermitidas.length > 0 ? (
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1 no-scrollbar p-1 bg-slate-50 rounded-lg border border-slate-200">
                      {user.unidadesPermitidas.map((unit) => {
                        const isSoc = unit.startsWith('SOC');
                        const isHub = unit.startsWith('HUB');
                        return (
                          <span
                            key={unit}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border flex items-center gap-1 ${
                              isSoc
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : isHub
                                ? 'bg-orange-50 text-orange-700 border-orange-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            {isSoc ? <Boxes className="w-2.5 h-2.5" /> : isHub ? <Truck className="w-2.5 h-2.5" /> : <Warehouse className="w-2.5 h-2.5" />}
                            {unit}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px]">
                      Nenhuma unidade específica vinculada. Clique em editar para selecionar.
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectUserForLogin(user)}
                  disabled={isCurrent}
                  title={isCurrent ? 'Você já está operando com este usuário' : 'Fazer Login e operar com este perfil'}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isCurrent
                      ? 'bg-emerald-100 text-emerald-800 cursor-default opacity-80'
                      : 'bg-[#172554] hover:bg-[#1e1b4b] text-white shadow-xs'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{isCurrent ? 'Sessão Ativa' : 'Entrar com este Usuário'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(user)}
                    title="Editar dados e seleção de CDs/HUBs/SOCs"
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Deseja realmente excluir o usuário "${user.nome}"? A alteração será gravada no log de auditoria.`)) {
                        onDeleteUser(user.id);
                      }
                    }}
                    title="Remover usuário"
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0b1329] via-[#172554] to-[#1e1b4b] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <UserPlus className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingUserId ? 'Editar Usuário & Unidades Vinculadas' : 'Novo Cadastro de Usuário'}
                  </h3>
                  <p className="text-xs text-blue-200">
                    Defina perfil de acesso e selecione os Centros de Distribuição, HUBs e SOCs permitidos.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* Informações Pessoais & Função */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>1. Informações Básicas &amp; Perfil</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex: Vinicius Carlos Santos"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#EE4D2D]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">E-mail Corporativo *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vinicius.santos@shopee.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#EE4D2D]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Telefone / WhatsApp</label>
                    <input
                      type="text"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="(11) 99785-8303"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#EE4D2D]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Cargo / Função *</label>
                    <input
                      type="text"
                      required
                      value={cargo}
                      onChange={(e) => setCargo(e.target.value)}
                      placeholder="Líder Operacional (SL)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#EE4D2D]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Regional Operacional *</label>
                    <select
                      value={regional}
                      onChange={(e) => setRegional(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#EE4D2D]"
                    >
                      {LISTA_REGIONAIS_CDS.map((reg) => (
                        <option key={reg} value={reg}>
                          {reg}
                        </option>
                      ))}
                      <option value="Nacional (Brasil)">Nacional (Brasil)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nível de Permissão (Role) *</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as AppUser['role'])}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#EE4D2D]"
                    >
                      <option value="lider_sl">Líder Operacional (SL)</option>
                      <option value="gestor">Gestor Facilities</option>
                      <option value="admin">Administrador Geral</option>
                      <option value="analista">Analista de Operações</option>
                      <option value="central_cw">Central CW Plantão 24h</option>
                      <option value="operador">Operador Local</option>
                    </select>
                  </div>
                </div>

                {/* Avatar Color Picker */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="font-semibold text-slate-700 text-[11px]">Cor do Avatar:</span>
                  <div className="flex items-center gap-1.5">
                    {AVATAR_COLORS.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setAvatarColor(col)}
                        className={`w-6 h-6 rounded-full ${col} flex items-center justify-center text-white transition-transform ${
                          avatarColor === col ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'opacity-80 hover:opacity-100'
                        }`}
                      >
                        {avatarColor === col && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SELEÇÃO DE CDS, HUBS E SOC PARA O USUÁRIO */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#EE4D2D]" />
                      <span>2. Seleção de CDs, HUBs e SOC para o Usuário</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Determine as unidades físicas de operação sobre as quais o usuário pode registrar OS e consultar dados.
                    </p>
                  </div>

                  {/* Switch Acesso Total vs Seleção Específica */}
                  <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
                    <button
                      type="button"
                      onClick={() => setAcessoTodos(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        acessoTodos ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Acesso Total (Todos os 63)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAcessoTodos(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        !acessoTodos ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Seleção Específica ({selectedCounts.total})
                    </button>
                  </div>
                </div>

                {acessoTodos ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-900">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <h5 className="font-bold text-xs">Acesso Geral Ativado</h5>
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        O usuário terá permissão para visualizar e abrir ocorrências em todas as 63 unidades ativas (Centros de Distribuição FULL, HUBs de última milha e SOCs regionais).
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Controls & Quick Select */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-2.5 items-center justify-between">
                      {/* Search & Sub-tabs */}
                      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <div className="relative w-48">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={facilitySearch}
                            onChange={(e) => setFacilitySearch(e.target.value)}
                            placeholder="Buscar código ou cidade..."
                            className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-[11px] text-slate-800 focus:outline-none focus:border-[#EE4D2D]"
                          />
                        </div>

                        {/* Type Tabs */}
                        <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-300 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setFacilityTypeTab('ALL')}
                            className={`px-2 py-1 rounded font-medium ${
                              facilityTypeTab === 'ALL' ? 'bg-[#EE4D2D] text-white' : 'text-slate-600'
                            }`}
                          >
                            Todas ({CADASTRO_CDS.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setFacilityTypeTab('HUB')}
                            className={`px-2 py-1 rounded font-medium ${
                              facilityTypeTab === 'HUB' ? 'bg-[#EE4D2D] text-white' : 'text-slate-600'
                            }`}
                          >
                            HUBs ({CADASTRO_HUB.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setFacilityTypeTab('SOC')}
                            className={`px-2 py-1 rounded font-medium ${
                              facilityTypeTab === 'SOC' ? 'bg-[#EE4D2D] text-white' : 'text-slate-600'
                            }`}
                          >
                            SOCs ({CADASTRO_SOC.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setFacilityTypeTab('CD')}
                            className={`px-2 py-1 rounded font-medium ${
                              facilityTypeTab === 'CD' ? 'bg-[#EE4D2D] text-white' : 'text-slate-600'
                            }`}
                          >
                            CDs FULL
                          </button>
                        </div>

                        {/* Regional Filter */}
                        <select
                          value={facilityRegionalFilter}
                          onChange={(e) => setFacilityRegionalFilter(e.target.value)}
                          className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 text-[11px] focus:outline-none"
                        >
                          <option value="ALL">Todas Regionais</option>
                          {LISTA_REGIONAIS_CDS.map((reg) => (
                            <option key={reg} value={reg}>
                              {reg}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quick Select Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                        <button
                          type="button"
                          onClick={handleSelectAllHubs}
                          className="px-2 py-1 text-[10px] font-bold bg-orange-100 hover:bg-orange-200 text-orange-800 rounded transition-colors"
                        >
                          + Todos HUBs
                        </button>
                        <button
                          type="button"
                          onClick={handleSelectAllCds}
                          className="px-2 py-1 text-[10px] font-bold bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition-colors"
                        >
                          + Todos CDs
                        </button>
                        <button
                          type="button"
                          onClick={handleSelectAllSocs}
                          className="px-2 py-1 text-[10px] font-bold bg-purple-100 hover:bg-purple-200 text-purple-800 rounded transition-colors"
                        >
                          + Todos SOCs
                        </button>
                        <button
                          type="button"
                          onClick={handleClearUnits}
                          className="px-2 py-1 text-[10px] font-medium text-slate-500 hover:text-red-600 underline"
                        >
                          Desmarcar
                        </button>
                      </div>
                    </div>

                    {/* Counter Pill */}
                    <div className="flex items-center justify-between text-[11px] px-1 text-slate-600">
                      <span>
                        Exibindo <strong>{modalFacilities.length}</strong> unidades no filtro:
                      </span>
                      <span className="font-semibold text-slate-800">
                        {selectedCounts.total} selecionadas ({selectedCounts.cdsCount} CDs, {selectedCounts.hubsCount} HUBs, {selectedCounts.socsCount} SOCs)
                      </span>
                    </div>

                    {/* Facility Checkbox Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                      {modalFacilities.map((cd) => {
                        const isChecked = selectedUnits.includes(cd.unidade);
                        const isSoc = cd.tipo_ativo === 'SOC' || cd.unidade.startsWith('SOC');
                        const isCd = cd.tipo_ativo === 'FULL' || cd.tipo_ativo === 'CD';

                        return (
                          <div
                            key={cd.unidade}
                            onClick={() => handleToggleUnit(cd.unidade)}
                            className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                              isChecked
                                ? 'bg-orange-50/80 border-[#EE4D2D] ring-1 ring-[#EE4D2D]/30 shadow-2xs'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleUnit(cd.unidade)}
                                className="w-3.5 h-3.5 text-[#EE4D2D] rounded border-slate-300 focus:ring-[#EE4D2D]"
                              />
                              <div className="overflow-hidden">
                                <div className="flex items-center gap-1.5">
                                  <strong className="text-xs text-slate-900 font-mono truncate">{cd.unidade}</strong>
                                  <span
                                    className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                      isSoc
                                        ? 'bg-purple-100 text-purple-800'
                                        : isCd
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}
                                  >
                                    {cd.tipo_ativo || 'HUB'}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-500 block truncate">
                                  {cd.cidade}/{cd.uf} · {cd.regional}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium rounded-xl text-xs transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#EE4D2D] hover:bg-[#d84223] text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingUserId ? 'Salvar Alterações e Registrar Auditoria' : 'Cadastrar Usuário'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
