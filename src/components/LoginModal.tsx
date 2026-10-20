import React, { useState } from 'react';
import {
  Lock,
  User,
  Mail,
  ShieldCheck,
  Building2,
  LogIn,
  CheckCircle2,
  Sparkles,
  X,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { AppUser } from '../types/facilities';
import { OFFICIAL_USERS, getStoredUsers } from '../data/authUsers';
import { CADASTRO_CDS } from '../data/cadastrosCDs';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser | null;
  onLogin: (user: AppUser) => void;
  users?: AppUser[];
  onOpenUserManagement?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  users = [],
  onOpenUserManagement
}) => {
  const [activeMode, setActiveMode] = useState<'quick' | 'custom'>('quick');

  // Custom user inputs
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cargo, setCargo] = useState('Líder Operacional (SL)');
  const [regional, setRegional] = useState('São Paulo 1');
  const [senha, setSenha] = useState('');
  const [acessoTodos, setAcessoTodos] = useState(false);
  const [selectedHub, setSelectedHub] = useState('HUB-OSP-03');

  if (!isOpen) return null;

  const displayUsers = users && users.length > 0 ? users : getStoredUsers();

  const handleSelectQuick = (user: AppUser) => {
    onLogin({
      ...user,
      loggedAt: new Date().toISOString()
    });
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) return;

    const roleDetermined: AppUser['role'] = cargo.toLowerCase().includes('admin')
      ? 'admin'
      : cargo.toLowerCase().includes('gestor') || cargo.toLowerCase().includes('supervisor')
      ? 'gestor'
      : cargo.toLowerCase().includes('central')
      ? 'central_cw'
      : cargo.toLowerCase().includes('analista')
      ? 'analista'
      : 'lider_sl';

    const newUser: AppUser = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      cargo: cargo.trim(),
      regional,
      role: roleDetermined,
      avatarColor: 'bg-emerald-600',
      acessoTodos,
      unidadesPermitidas: acessoTodos ? [] : [selectedHub],
      tiposPermitidos: ['HUB', 'SOC', 'FULL', 'CD'],
      loggedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    onLogin(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0b1329] via-[#172554] to-[#1e1b4b] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white p-2 shadow-md flex items-center justify-center border border-white/20 shrink-0">
              <img
                src="/logo-shopee-1024.png"
                alt="Shopee Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full inline-block">
                Autenticação &amp; Auditoria de Facilities
              </span>
              <h3 className="text-base font-bold text-white mt-1 flex items-center gap-2">
                <span>{currentUser ? 'Alternar Usuário / Perfil' : 'Acesso ao Sistema de Facilities'}</span>
              </h3>
              <p className="text-xs text-blue-200">
                Shopee Operations &amp; Cushman Wakefield CCM
              </p>
            </div>
          </div>
          {currentUser && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-amber-50 border-b border-amber-200/80 p-3 px-5 flex items-center gap-2 text-xs text-amber-900">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Rastreabilidade Ativa:</strong> Qualquer ação realizada (abertura de OS, mudança para Em Andamento, Encerrada, Cancelada ou alterações em Cadastro) será carimbada com o nome e e-mail do usuário autenticado.
          </span>
        </div>

        {/* Tabs: Perfil Homologado vs Credenciais */}
        <div className="p-2 bg-slate-100 border-b border-slate-200 flex items-center gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveMode('quick')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-center transition-all ${
              activeMode === 'quick'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Perfis Oficiais Homologados (1-Clique)
          </button>
          <button
            onClick={() => setActiveMode('custom')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-center transition-all ${
              activeMode === 'custom'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Entrar com Outro Usuário / E-mail
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto max-h-[60vh]">
          {activeMode === 'quick' ? (
            <div className="space-y-2.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Selecione seu perfil oficial da operação:
              </span>

              {displayUsers.map((user) => {
                const isCurrent = currentUser?.email === user.email;
                const assignedUnits = user.acessoTodos
                  ? 'Acesso Geral (Todos os CDs/HUBs/SOCs)'
                  : user.unidadesPermitidas && user.unidadesPermitidas.length > 0
                  ? `${user.unidadesPermitidas.length} unidades: ${user.unidadesPermitidas.slice(0, 3).join(', ')}${user.unidadesPermitidas.length > 3 ? '...' : ''}`
                  : 'Nenhuma unidade vinculada';

                return (
                  <div
                    key={user.id}
                    onClick={() => handleSelectQuick(user)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isCurrent
                        ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 hover:border-[#EE4D2D]/60 hover:bg-orange-50/20 shadow-xs hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${user.avatarColor || 'bg-slate-700'} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
                      >
                        {user.nome
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#EE4D2D] transition-colors">
                            {user.nome}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.2 rounded-full font-bold">
                              Sessão Atual
                            </span>
                          )}
                          <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold uppercase">
                            {user.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium">
                          {user.cargo}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {user.email} · {user.regional}
                        </p>
                        <p className="text-[10px] text-blue-700 font-medium mt-0.5 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-blue-500 shrink-0" />
                          <span className="truncate max-w-[280px]">{assignedUnits}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-slate-400 group-hover:text-[#EE4D2D] transition-colors">
                      <span className="text-xs font-semibold">Acessar</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}

              {onOpenUserManagement && (
                <div className="pt-2 border-t border-slate-200 mt-3 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenUserManagement();
                    }}
                    className="w-full py-2 px-3 border border-dashed border-blue-400 rounded-xl text-blue-700 hover:bg-blue-50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>Abrir Cadastro Completo de Usuários &amp; Seleção de CDs/HUBs</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: João Silva"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#EE4D2D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  E-mail Corporativo (@shopee.com ou parceiro)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="joao.silva@shopee.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#EE4D2D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Cargo / Função
                  </label>
                  <select
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#EE4D2D]"
                  >
                    <option value="Líder Operacional (SL)">Líder Operacional (SL)</option>
                    <option value="Supervisor de Facilities">Supervisor de Facilities</option>
                    <option value="Gestor de Facilities & CCM">Gestor de Facilities &amp; CCM</option>
                    <option value="Analista de Operações / SL">Analista de Operações / SL</option>
                    <option value="Central Cushman & Wakefield">Central Cushman &amp; Wakefield</option>
                    <option value="Técnico de Manutenção Local">Técnico de Manutenção Local</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Regional
                  </label>
                  <select
                    value={regional}
                    onChange={(e) => setRegional(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#EE4D2D]"
                  >
                    <option value="São Paulo 1">São Paulo 1</option>
                    <option value="São Paulo 2">São Paulo 2</option>
                    <option value="São Paulo (Sudeste)">São Paulo (Sudeste)</option>
                    <option value="Minas Gerais">Minas Gerais</option>
                    <option value="Rio de Janeiro">Rio de Janeiro</option>
                    <option value="Nordeste">Nordeste</option>
                    <option value="Sul">Sul</option>
                    <option value="Centro-Oeste & Norte">Centro-Oeste &amp; Norte</option>
                    <option value="Nacional (Brasil)">Nacional (Brasil)</option>
                  </select>
                </div>
              </div>

              {/* Seleção de Unidade para o Usuário Customizado */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-semibold text-slate-800 block text-[11px]">
                  Unidade Principal / Permissão:
                </span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="permRadio"
                      checked={!acessoTodos}
                      onChange={() => setAcessoTodos(false)}
                      className="text-[#EE4D2D]"
                    />
                    <span>Unidade Específica</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="permRadio"
                      checked={acessoTodos}
                      onChange={() => setAcessoTodos(true)}
                      className="text-[#EE4D2D]"
                    />
                    <span>Acesso Geral (Todos os 63 CDs/HUBs/SOCs)</span>
                  </label>
                </div>

                {!acessoTodos && (
                  <select
                    value={selectedHub}
                    onChange={(e) => setSelectedHub(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#EE4D2D]"
                  >
                    {CADASTRO_CDS.map((c) => (
                      <option key={c.unidade} value={c.unidade}>
                        {c.unidade} - {c.cidade}/{c.uf} ({c.tipo_ativo || 'HUB'})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Senha / PIN de Segurança (Opcional para ambiente interno)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#EE4D2D]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 bg-[#EE4D2D] hover:bg-[#d84223] text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Autenticar e Iniciar Sessão com Rastreabilidade</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sessão persistida com segurança localmente</span>
          </div>
          {currentUser && (
            <button
              onClick={onClose}
              className="text-slate-600 hover:text-slate-900 font-semibold"
            >
              Permanecer como {currentUser.nome.split(' ')[0]}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
