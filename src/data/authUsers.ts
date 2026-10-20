import { AppUser, RegistroAuditoria } from '../types/facilities';

export const OFFICIAL_USERS: AppUser[] = [
  {
    id: 'USR-001',
    nome: 'Gustavo Oliveira',
    email: 'gustavo.oliveira@shopee.com',
    cargo: 'Líder Operações SL / Turno Noite',
    regional: 'São Paulo (Sudeste)',
    role: 'lider_sl',
    avatarColor: 'bg-emerald-600',
    telefone: '(11) 99123-8901',
    acessoTodos: false,
    unidadesPermitidas: [
      'SOC-SP06',
      'SOC-SP7',
      'HUB-LSP-37',
      'HUB-LSP-008',
      'HUB-LSP-100',
      'CD Cajamar',
      'HUB-LPE-11',
      'HUB-LCE-05',
      'HUB-LPA-03',
      'HUB-LRJ-21',
      'HUB-LPR-26'
    ],
    tiposPermitidos: ['FULL', 'HUB', 'SOC'],
    totalChamados: 12,
    createdAt: '2026-01-10T08:00:00.000Z'
  },
  {
    id: 'USR-002',
    nome: 'Daniela Domingues',
    email: 'daniela.domingues@shopee.com',
    cargo: 'Analista de Operações / SL Facilities',
    regional: 'Minas Gerais',
    role: 'analista',
    avatarColor: 'bg-indigo-600',
    telefone: '(31) 99876-5432',
    acessoTodos: false,
    unidadesPermitidas: [
      'HUB-NFU-02',
      'HUB-LMG-56',
      'HUB-LMG-59',
      'HUB-LMG-45',
      'HUB-LMG-61',
      'HUB-LSP-41',
      'HUB-LCE-01',
      'HUB-LPE-03',
      'HUB-LRJ-02'
    ],
    tiposPermitidos: ['HUB', 'SOC', 'FULL'],
    totalChamados: 10,
    createdAt: '2026-01-12T09:00:00.000Z'
  },
  {
    id: 'USR-003',
    nome: 'Chris Macedo',
    email: 'chris.macedo@shopee.com',
    cargo: 'Supervisor de Facilities Nordeste',
    regional: 'Nordeste',
    role: 'gestor',
    avatarColor: 'bg-sky-600',
    telefone: '(81) 98765-1122',
    acessoTodos: false,
    unidadesPermitidas: ['SOC-CE-003', 'SOC-PE-04', 'HUB-LPB-04', 'HUB-LPE-03', 'HUB-LPE-04'],
    tiposPermitidos: ['HUB', 'SOC'],
    totalChamados: 6,
    createdAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 'USR-004',
    nome: 'Francivania Oliva',
    email: 'francivania.oliva@shopee.com',
    cargo: 'Líder de Operações SL - Paraná',
    regional: 'Sul',
    role: 'lider_sl',
    avatarColor: 'bg-rose-600',
    telefone: '(41) 99234-5678',
    acessoTodos: false,
    unidadesPermitidas: ['HUB-LPR-26', 'HUB-LPR-24', 'HUB-LPR-12'],
    tiposPermitidos: ['HUB', 'SOC'],
    totalChamados: 5,
    createdAt: '2026-01-18T14:00:00.000Z'
  },
  {
    id: 'USR-005',
    nome: 'Marcelly Silva',
    email: 'marcelly.silva@shopee.com',
    cargo: 'Analista de Facilities RJ',
    regional: 'Rio de Janeiro',
    role: 'analista',
    avatarColor: 'bg-violet-600',
    telefone: '(21) 98321-4567',
    acessoTodos: false,
    unidadesPermitidas: ['HUB-LRJ-05', 'HUB-LRJ-21', 'HUB-LRJ-02', 'HUB-LRJ-07'],
    tiposPermitidos: ['HUB', 'SOC'],
    totalChamados: 5,
    createdAt: '2026-01-19T11:00:00.000Z'
  },
  {
    id: 'USR-006',
    nome: 'Alan Augusto',
    email: 'alan.augusto@shopee.com',
    cargo: 'Supervisor Operacional SL MG',
    regional: 'Minas Gerais',
    role: 'lider_sl',
    avatarColor: 'bg-teal-600',
    telefone: '(31) 98456-7890',
    acessoTodos: false,
    unidadesPermitidas: ['HUB-LMG-59', 'HUB-NFU-02', 'HUB-LMG-45', 'HUB-LMG-36'],
    tiposPermitidos: ['HUB', 'SOC'],
    totalChamados: 4,
    createdAt: '2026-01-20T10:00:00.000Z'
  },
  {
    id: 'USR-007',
    nome: 'Elton Silva',
    email: 'elton.silva@shopee.com',
    cargo: 'Líder SL Regional Sudeste/Nordeste',
    regional: 'Rio de Janeiro',
    role: 'lider_sl',
    avatarColor: 'bg-amber-600',
    telefone: '(21) 97654-3210',
    acessoTodos: false,
    unidadesPermitidas: [
      'HUB-LRJ-29',
      'HUB-LPI-01',
      'HUB-LPE-02',
      'HUB-LPE-03',
      'HUB-LPR-12',
      'HUB-LCE-04',
      'SOC-PE-04'
    ],
    tiposPermitidos: ['HUB', 'SOC'],
    totalChamados: 4,
    createdAt: '2026-01-20T14:00:00.000Z'
  },
  {
    id: 'USR-008',
    nome: 'Izabel Sergio',
    email: 'izabel.sergio@shopee.com',
    cargo: 'Coordenadora de Operações SL SP',
    regional: 'São Paulo 1',
    role: 'gestor',
    avatarColor: 'bg-pink-600',
    telefone: '(11) 97123-4567',
    acessoTodos: false,
    unidadesPermitidas: ['HUB-LSP-37', 'HUB-LSP-62', 'HUB-LSP-100', 'CD Cajamar'],
    tiposPermitidos: ['FULL', 'HUB', 'SOC'],
    totalChamados: 4,
    createdAt: '2026-01-21T09:30:00.000Z'
  },
  {
    id: 'USR-009',
    nome: 'Isabella Fernandes',
    email: 'isabella.fernandes@shopee.com',
    cargo: 'Analista de Facilities SP Interior',
    regional: 'São Paulo (Sudeste)',
    role: 'analista',
    avatarColor: 'bg-fuchsia-600',
    telefone: '(19) 98123-4567',
    acessoTodos: false,
    unidadesPermitidas: ['SOC-SP35', 'SOC-SP18', 'HUB-LSP-07', 'HUB-LSP-35', 'CD Louveira'],
    tiposPermitidos: ['FULL', 'HUB', 'SOC'],
    totalChamados: 4,
    createdAt: '2026-01-22T08:00:00.000Z'
  },
  {
    id: 'USR-010',
    nome: 'Izabelle Melo',
    email: 'izabelle.melo@shopee.com',
    cargo: 'Líder de Operações SL MG/RJ',
    regional: 'Minas Gerais',
    role: 'lider_sl',
    avatarColor: 'bg-cyan-600',
    telefone: '(31) 99111-2233',
    acessoTodos: false,
    unidadesPermitidas: ['HUB-LMG-49', 'HUB-LRJ-07', 'HUB-LMG-56'],
    tiposPermitidos: ['HUB', 'SOC'],
    totalChamados: 4,
    createdAt: '2026-01-22T10:00:00.000Z'
  },
  {
    id: 'USR-011',
    nome: 'Marcela Brito',
    email: 'marcela.brito@shopee.com',
    cargo: 'Supervisora de Operações SL Ceará/RN',
    regional: 'Nordeste',
    role: 'lider_sl',
    avatarColor: 'bg-red-600',
    telefone: '(85) 98877-6655',
    acessoTodos: false,
    unidadesPermitidas: ['HUB-LRN-04', 'HUB-LCE-04', 'HUB-LCE-01'],
    tiposPermitidos: ['HUB', 'SOC'],
    totalChamados: 3,
    createdAt: '2026-01-23T11:00:00.000Z'
  },
  {
    id: 'USR-012',
    nome: 'Daniele Constantino',
    email: 'daniele.constantino@shopee.com',
    cargo: 'Analista de Facilities Minas Gerais',
    regional: 'Minas Gerais',
    role: 'analista',
    avatarColor: 'bg-purple-600',
    telefone: '(31) 98777-8899',
    acessoTodos: false,
    unidadesPermitidas: ['HUB-LMG-61', 'HUB-LMG-49'],
    tiposPermitidos: ['HUB', 'SOC'],
    totalChamados: 3,
    createdAt: '2026-01-24T15:00:00.000Z'
  },
  {
    id: 'USR-013',
    nome: 'Ricardo Alonso',
    email: 'ricardomedalonso@gmail.com',
    cargo: 'Líder Operações SL / Gestor Facilities',
    regional: 'São Paulo (Sudeste)',
    role: 'gestor',
    avatarColor: 'bg-emerald-600',
    telefone: '(11) 98765-4321',
    acessoTodos: true,
    unidadesPermitidas: [],
    tiposPermitidos: ['FULL', 'HUB', 'SOC'],
    totalChamados: 2,
    createdAt: '2026-01-15T08:00:00.000Z'
  },
  {
    id: 'USR-014',
    nome: 'Milena Maia',
    email: 'milena.maia@shopee.com',
    cargo: 'Líder Operações SL Rio Grande do Sul',
    regional: 'Sul',
    role: 'lider_sl',
    avatarColor: 'bg-blue-600',
    telefone: '(51) 99888-7766',
    acessoTodos: false,
    unidadesPermitidas: ['HUB-LRS-06', 'HUB-LRS-03', 'HUB-LRS-09'],
    tiposPermitidos: ['HUB', 'SOC'],
    totalChamados: 2,
    createdAt: '2026-01-25T11:00:00.000Z'
  },
  {
    id: 'USR-015',
    nome: 'Mariana Menossi',
    email: 'mariana.menossi@shopee.com',
    cargo: 'Supervisora Operações SP Capital',
    regional: 'São Paulo 1',
    role: 'gestor',
    avatarColor: 'bg-lime-600',
    telefone: '(11) 99345-6789',
    acessoTodos: false,
    unidadesPermitidas: ['HUB-LSP-83', 'HUB-LSP-37', 'CD Cajamar'],
    tiposPermitidos: ['FULL', 'HUB', 'SOC'],
    totalChamados: 2,
    createdAt: '2026-01-25T14:30:00.000Z'
  },
  {
    id: 'USR-016',
    nome: 'Caio Augusto',
    email: 'caio.augusto@shopee.com',
    cargo: 'Líder de Operações SL Sudeste',
    regional: 'São Paulo (Sudeste)',
    role: 'lider_sl',
    avatarColor: 'bg-orange-600',
    telefone: '(11) 98234-5678',
    acessoTodos: false,
    unidadesPermitidas: ['HUB-OSP-02', 'HUB-OSP-03', 'CD Cajamar'],
    tiposPermitidos: ['FULL', 'HUB', 'SOC'],
    totalChamados: 2,
    createdAt: '2026-01-26T09:00:00.000Z'
  },
  {
    id: 'USR-017',
    nome: 'Leticia Mourato',
    email: 'leticia.mourato@shopee.com',
    cargo: 'Líder Operacional Pernambuco',
    regional: 'Nordeste',
    role: 'lider_sl',
    avatarColor: 'bg-yellow-600',
    telefone: '(81) 99222-3344',
    acessoTodos: false,
    unidadesPermitidas: ['HUB-LPE-06', 'HUB-LPE-08'],
    tiposPermitidos: ['HUB', 'SOC'],
    totalChamados: 2,
    createdAt: '2026-01-26T11:00:00.000Z'
  },
  {
    id: 'USR-018',
    nome: 'Flavia Lacerda',
    email: 'flavia.lacerda@shopee.com',
    cargo: 'Analista de Facilities Pará / Norte',
    regional: 'Nordeste',
    role: 'analista',
    avatarColor: 'bg-emerald-700',
    telefone: '(91) 98111-4455',
    acessoTodos: false,
    unidadesPermitidas: ['HUB-LPA-03'],
    tiposPermitidos: ['HUB', 'SOC'],
    totalChamados: 1,
    createdAt: '2026-01-27T08:00:00.000Z'
  },
  {
    id: 'USR-019',
    nome: 'Melissa Kamei',
    email: 'melissa.kamei@shopee.com',
    cargo: 'Analista SL Paraná',
    regional: 'Sul',
    role: 'analista',
    avatarColor: 'bg-rose-700',
    telefone: '(41) 99111-2244',
    acessoTodos: false,
    unidadesPermitidas: ['HUB-LPR-24'],
    tiposPermitidos: ['HUB', 'SOC'],
    totalChamados: 1,
    createdAt: '2026-01-27T10:00:00.000Z'
  },
  {
    id: 'USR-020',
    nome: 'Guilherme Vastay',
    email: 'guilherme.vastay@shopee.com',
    cargo: 'Líder Operações SL Londrina / PR',
    regional: 'Sul',
    role: 'lider_sl',
    avatarColor: 'bg-indigo-700',
    telefone: '(43) 98888-2233',
    acessoTodos: false,
    unidadesPermitidas: ['HUB-LPR-12'],
    tiposPermitidos: ['HUB', 'SOC'],
    totalChamados: 1,
    createdAt: '2026-01-28T09:00:00.000Z'
  },
  {
    id: 'USR-021',
    nome: 'Jose Carlos',
    email: 'jose.carlos@shopee.com',
    cargo: 'Líder de Manutenção e SL Recife',
    regional: 'Nordeste',
    role: 'lider_sl',
    avatarColor: 'bg-slate-700',
    telefone: '(81) 98333-4455',
    acessoTodos: false,
    unidadesPermitidas: ['HUB-LPE-04'],
    tiposPermitidos: ['HUB', 'SOC'],
    totalChamados: 1,
    createdAt: '2026-01-28T14:00:00.000Z'
  },
  {
    id: 'USR-022',
    nome: 'Guilherme Persio',
    email: 'guilherme.persio@shopee.com',
    cargo: 'Supervisor de Facilities Vitória / ES',
    regional: 'Espírito Santo',
    role: 'lider_sl',
    avatarColor: 'bg-sky-700',
    telefone: '(27) 99777-6655',
    acessoTodos: false,
    unidadesPermitidas: ['HUB-LES-01', 'HUB-LES-16', 'SOC-ES02'],
    tiposPermitidos: ['HUB', 'SOC'],
    totalChamados: 1,
    createdAt: '2026-01-29T10:00:00.000Z'
  },
  {
    id: 'USR-023',
    nome: 'João Henrique',
    email: 'joao.henrique@shopee.com',
    cargo: 'Líder Operacional SL Campinas',
    regional: 'São Paulo (Sudeste)',
    role: 'lider_sl',
    avatarColor: 'bg-amber-700',
    telefone: '(19) 99444-5566',
    acessoTodos: false,
    unidadesPermitidas: ['HUB-LSP-68', 'CD Louveira'],
    tiposPermitidos: ['FULL', 'HUB', 'SOC'],
    totalChamados: 1,
    createdAt: '2026-01-29T15:00:00.000Z'
  },
  {
    id: 'USR-024',
    nome: 'Joliel Silva',
    email: 'joliel.silva@shopee.com',
    cargo: 'Operador SL Serra / ES',
    regional: 'Espírito Santo',
    role: 'operador',
    avatarColor: 'bg-teal-700',
    telefone: '(27) 99555-4433',
    acessoTodos: false,
    unidadesPermitidas: ['SOC-ES02'],
    tiposPermitidos: ['SOC'],
    totalChamados: 1,
    createdAt: '2026-01-30T08:30:00.000Z'
  },
  {
    id: 'USR-025',
    nome: 'Humberto Alves',
    email: 'humberto.alves@shopee.com',
    cargo: 'Líder de Turno SOC Paulínia',
    regional: 'São Paulo (Sudeste)',
    role: 'lider_sl',
    avatarColor: 'bg-violet-700',
    telefone: '(19) 98777-3322',
    acessoTodos: false,
    unidadesPermitidas: ['SOC-SP35'],
    tiposPermitidos: ['SOC'],
    totalChamados: 1,
    createdAt: '2026-01-30T11:00:00.000Z'
  },
  {
    id: 'USR-026',
    nome: 'Juliana Pironelli',
    email: 'juliana.pironelli@shopee.com',
    cargo: 'Analista de Qualidade e Facilities',
    regional: 'São Paulo (Sudeste)',
    role: 'analista',
    avatarColor: 'bg-pink-700',
    telefone: '(11) 98666-5544',
    acessoTodos: false,
    unidadesPermitidas: ['HUB-LSP-43', 'CD Cajamar'],
    tiposPermitidos: ['FULL', 'HUB', 'SOC'],
    totalChamados: 1,
    createdAt: '2026-01-31T09:00:00.000Z'
  },
  {
    id: 'USR-027',
    nome: 'Danyela Pina',
    email: 'danyela.pina@shopee.com',
    cargo: 'Supervisora SL Ribeirão Preto',
    regional: 'São Paulo (Sudeste)',
    role: 'lider_sl',
    avatarColor: 'bg-red-700',
    telefone: '(16) 99111-8899',
    acessoTodos: false,
    unidadesPermitidas: ['HUB-LSP-63'],
    tiposPermitidos: ['HUB', 'SOC'],
    totalChamados: 1,
    createdAt: '2026-01-31T14:00:00.000Z'
  },
  {
    id: 'USR-028',
    nome: 'Andressa Nascimento',
    email: 'andressa.nascimento@shopee.com',
    cargo: 'Analista Operações Sul',
    regional: 'Sul',
    role: 'analista',
    avatarColor: 'bg-cyan-700',
    telefone: '(51) 98222-3311',
    acessoTodos: false,
    unidadesPermitidas: ['HUB-LRS-09'],
    tiposPermitidos: ['HUB', 'SOC'],
    totalChamados: 1,
    createdAt: '2026-02-01T10:00:00.000Z'
  },
  {
    id: 'USR-029',
    nome: 'Desireé Santos',
    email: 'desiree.santos@shopee.com',
    cargo: 'Analista de Facilities & Helpdesk',
    regional: 'São Paulo (Sudeste)',
    role: 'analista',
    avatarColor: 'bg-fuchsia-700',
    telefone: '(11) 98999-1122',
    acessoTodos: false,
    unidadesPermitidas: ['CD Cajamar', 'HUB-OSP-02', 'HUB-OSP-03'],
    tiposPermitidos: ['FULL', 'HUB', 'SOC'],
    totalChamados: 1,
    createdAt: '2026-02-01T11:30:00.000Z'
  },
  {
    id: 'USR-030',
    nome: 'Daniel Silvano',
    email: 'daniel.silvano@shopee.com',
    cargo: 'Líder Operações SL',
    regional: 'São Paulo (Sudeste)',
    role: 'lider_sl',
    avatarColor: 'bg-blue-700',
    telefone: '(11) 98777-2233',
    acessoTodos: false,
    unidadesPermitidas: ['CD Louveira', 'HUB-LSP-12', 'HUB-LSP-13'],
    tiposPermitidos: ['FULL', 'HUB', 'SOC'],
    totalChamados: 1,
    createdAt: '2026-02-02T09:00:00.000Z'
  },
  {
    id: 'USR-031',
    nome: 'Mari Marinho',
    email: 'mari.marinho@shopee.com',
    cargo: 'Supervisora de Operações SL',
    regional: 'São Paulo (Sudeste)',
    role: 'gestor',
    avatarColor: 'bg-emerald-800',
    telefone: '(11) 99888-3344',
    acessoTodos: false,
    unidadesPermitidas: ['CD Cajamar', 'HUB-LSP-74', 'HUB-LSP-77'],
    tiposPermitidos: ['FULL', 'HUB', 'SOC'],
    totalChamados: 1,
    createdAt: '2026-02-02T14:00:00.000Z'
  },
  {
    id: 'USR-032',
    nome: 'Keven Teixeira',
    email: 'Keven.teixeira@shopee.com',
    cargo: 'Supervisor de Facilities SP1',
    regional: 'São Paulo 1',
    role: 'admin',
    avatarColor: 'bg-orange-600',
    telefone: '(11) 99785-8303',
    acessoTodos: false,
    unidadesPermitidas: [
      'HUB-OSP-03',
      'HUB-OSP-02',
      'HUB-LSP-07',
      'HUB-LSP-12',
      'HUB-LSP-13',
      'HUB-LSP-74',
      'HUB-LSP-77',
      'HUB-LSP-94',
      'HUB-LSP-119',
      'CD Cajamar',
      'CD Louveira',
      'SOC-SP06'
    ],
    tiposPermitidos: ['HUB', 'FULL', 'SOC'],
    totalChamados: 1,
    createdAt: '2026-01-20T09:00:00.000Z'
  },
  {
    id: 'USR-033',
    nome: 'Central CW Plantão 24h',
    email: 'plantao.facilities@cushmanwakefield.com',
    cargo: 'Central de Acionamento Cushman & Wakefield',
    regional: 'Nacional (Brasil)',
    role: 'central_cw',
    avatarColor: 'bg-purple-600',
    telefone: '0800 770 1234',
    acessoTodos: true,
    unidadesPermitidas: [],
    tiposPermitidos: ['FULL', 'HUB', 'SOC'],
    totalChamados: 1,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'USR-034',
    nome: 'Mateus Bezerra De Lima',
    email: 'mateus.delima@shopee.com',
    cargo: 'Líder Operacional (SL) · HUB-LSP-07',
    regional: 'São Paulo 1',
    role: 'lider_sl',
    avatarColor: 'bg-blue-600',
    telefone: '(11) 98111-2233',
    acessoTodos: false,
    unidadesPermitidas: ['HUB-LSP-07'],
    tiposPermitidos: ['HUB'],
    totalChamados: 1,
    createdAt: '2026-02-10T11:00:00.000Z'
  }
];

export const USERS_STORAGE_KEY = 'facilities_users_registry_v3';
export const CURRENT_USER_STORAGE_KEY = 'facilities_auth_current_user_v3';

export function getStoredUsers(): AppUser[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed: AppUser[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge with OFFICIAL_USERS so all predefined users are guaranteed present and enriched
        const existingEmails = new Set(parsed.map((u) => u.email.toLowerCase()));
        const missing = OFFICIAL_USERS.filter((o) => !existingEmails.has(o.email.toLowerCase()));
        if (missing.length > 0) {
          const merged = [...parsed, ...missing];
          saveStoredUsers(merged);
          return merged;
        }
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  // Initialize storage with official users
  saveStoredUsers(OFFICIAL_USERS);
  return OFFICIAL_USERS;
}

export function saveStoredUsers(users: AppUser[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving users to localStorage:', err);
  }
}

export function getStoredCurrentUser(): AppUser {
  try {
    const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.email) {
        return parsed;
      }
    }
    // Also check previous storage key if present
    const legacyRaw = localStorage.getItem('facilities_auth_current_user');
    if (legacyRaw) {
      const parsedLegacy = JSON.parse(legacyRaw);
      if (parsedLegacy && parsedLegacy.email) {
        saveStoredCurrentUser(parsedLegacy);
        return parsedLegacy;
      }
    }
  } catch {
    // fallback
  }
  return OFFICIAL_USERS[0]; // Gustavo Oliveira as first default (most tickets)
}

export function saveStoredCurrentUser(user: AppUser | null): void {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Error saving current user:', err);
  }
}

export const INITIAL_AUDIT_LOGS: RegistroAuditoria[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-10-19T08:30:00.000Z',
    tipo: 'LOGIN_EFETUADO',
    usuarioNome: 'Gustavo Oliveira',
    usuarioEmail: 'gustavo.oliveira@shopee.com',
    usuarioCargo: 'Líder Operações SL / Turno Noite',
    entidade: 'SISTEMA',
    entidadeId: 'SESSAO-INICIAL',
    titulo: 'Login realizado no sistema',
    detalhes: 'Sessão autenticada via portal Shopee Facilities com perfil de Líder SL.'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-10-19T08:35:12.000Z',
    tipo: 'CADASTRO_ATUALIZADO',
    usuarioNome: 'Keven Teixeira',
    usuarioEmail: 'Keven.teixeira@shopee.com',
    usuarioCargo: 'Supervisor de Facilities SP1',
    entidade: 'CADASTRO',
    entidadeId: 'HUB-OSP-03',
    titulo: 'Atualização Cadastral de Unidade',
    detalhes: 'Unidade HUB-OSP-03 vinculada ao Líder Vinicius Carlos Pereira Dos Santos (11 99785-8303) e endereço confirmado na Rua Cadiriri.',
    valorAnterior: 'Incompleto',
    valorNovo: 'Regularizado'
  },
  {
    id: 'AUD-003',
    timestamp: '2026-10-19T09:12:44.000Z',
    tipo: 'OS_ABERTURA',
    usuarioNome: 'Daniela Domingues',
    usuarioEmail: 'daniela.domingues@shopee.com',
    usuarioCargo: 'Analista de Operações / SL Facilities',
    entidade: 'OS',
    entidadeId: 'CONT-001',
    titulo: 'Abertura de OS registrada',
    detalhes: 'Chamado aberto para HUB-NFU-02 (Gerador Diesel com alarmes recorrentes) sob OM 240551. Criticidade C4.'
  },
  {
    id: 'AUD-004',
    timestamp: '2026-10-19T09:45:00.000Z',
    tipo: 'OS_STATUS_EM_ANDAMENTO',
    usuarioNome: 'Central CW Plantão 24h',
    usuarioEmail: 'plantao.facilities@cushmanwakefield.com',
    usuarioCargo: 'Central de Acionamento Cushman & Wakefield',
    entidade: 'OS',
    entidadeId: 'CONT-001',
    titulo: 'OS colocada Em Atendimento',
    detalhes: 'Equipe da fornecedora Tecnogera acionada para vistoria no local.',
    valorAnterior: 'Aberto',
    valorNovo: 'Em Atendimento'
  }
];
