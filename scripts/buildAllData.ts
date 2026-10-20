import fs from 'fs';
import { CADASTRO_CDS } from '../src/data/cadastrosCDs';
import { CentroDistribuicao } from '../src/types/facilities';

// 1. MACRO REGION MAPPING
export function getMacroRegion(regional: string = '', uf: string = '', cidade: string = ''): string {
  const regLower = (regional || '').toLowerCase();
  const ufUpper = (uf || '').toUpperCase();
  const cidLower = (cidade || '').toLowerCase();

  if (regLower.includes('são paulo') || regLower.includes('sao paulo') || regLower.includes('sudeste sp') || ufUpper === 'SP' || cidLower.includes('são paulo') || cidLower.includes('barueri') || cidLower.includes('cajamar') || cidLower.includes('jundiaí') || cidLower.includes('jundiai') || cidLower.includes('piracicaba') || cidLower.includes('taubaté') || cidLower.includes('taubate') || cidLower.includes('louveira')) {
    return 'São Paulo (Sudeste)';
  }
  if (regLower.includes('minas') || ufUpper === 'MG' || cidLower.includes('belo horizonte') || cidLower.includes('betim') || cidLower.includes('governador valadares') || cidLower.includes('nova friburgo') || cidLower.includes('juiz de fora') || cidLower.includes('varginha') || cidLower.includes('sete lagoas')) {
    return 'Minas Gerais';
  }
  if (regLower.includes('rio de janeiro') || ufUpper === 'RJ' || cidLower.includes('rio de janeiro') || cidLower.includes('macaé') || cidLower.includes('macae') || cidLower.includes('queimados') || cidLower.includes('são pedro da aldeia')) {
    return 'Rio de Janeiro';
  }
  if (regLower.includes('espirito santo') || regLower.includes('espírito santo') || ufUpper === 'ES' || cidLower.includes('viana') || cidLower.includes('itapemirim') || cidLower.includes('são mateus')) {
    return 'Espírito Santo';
  }
  if (
    regLower.includes('nordeste') ||
    ['BA', 'PE', 'CE', 'PB', 'PI', 'RN', 'AL', 'SE', 'MA'].includes(ufUpper) ||
    cidLower.includes('fortaleza') ||
    cidLower.includes('recife') ||
    cidLower.includes('jaboatão') ||
    cidLower.includes('salvador') ||
    cidLower.includes('teresina') ||
    cidLower.includes('joão pessoa') ||
    cidLower.includes('parnamirim') ||
    cidLower.includes('carpina') ||
    cidLower.includes('garanhuns') ||
    cidLower.includes('guaranhuns') ||
    cidLower.includes('caruaru') ||
    cidLower.includes('cruaru')
  ) {
    return 'Nordeste';
  }
  if (
    regLower.includes('sul') ||
    ['PR', 'SC', 'RS'].includes(ufUpper) ||
    cidLower.includes('curitiba') ||
    cidLower.includes('porto alegre') ||
    cidLower.includes('toledo') ||
    cidLower.includes('foz do iguaçu') ||
    cidLower.includes('santa maria') ||
    cidLower.includes('santa rosa') ||
    cidLower.includes('são jose dos pinhais')
  ) {
    return 'Sul';
  }
  if (
    regLower.includes('centro') ||
    regLower.includes('norte') ||
    ['GO', 'DF', 'MT', 'MS', 'AM', 'PA', 'TO', 'RO', 'AC', 'AP', 'RR'].includes(ufUpper) ||
    cidLower.includes('manaus') ||
    cidLower.includes('ananindeua') ||
    cidLower.includes('anamindeua') ||
    cidLower.includes('brasília') ||
    cidLower.includes('goiânia')
  ) {
    return 'Centro-Oeste & Norte';
  }

  return 'São Paulo (Sudeste)';
}

// 2. ADDITIONAL UNITS TO BE REGISTERED
const additionalUnits: CentroDistribuicao[] = [
  // New SOCs
  {
    unidade: 'SOC-PE-04',
    cnpj: '42.446.277/0034-55',
    razao_social: 'SHPS OPERAÇÕES LOGÍSTICAS LTDA',
    endereco: 'Rodovia BR-101 Sul, Km 82, Muribeca',
    complemento: 'Condomínio Logístico Armazém 04',
    bairro: 'Muribeca',
    cidade: 'Jaboatão dos Guararapes',
    uf: 'PE',
    cep: '54355-010',
    regional: 'Nordeste 01',
    responsavel: 'Chris Macedo (SL)',
    telefone: '(81) 98765-4304',
    email: 'soc.pe04@shopee.com',
    status_energia: 'Regular',
    status_agua: 'Regular',
    tipo_ativo: 'SOC',
    status_regularizacao: 'Regularizado'
  },
  {
    unidade: 'SOC-ES02',
    cnpj: '42.446.277/0035-36',
    razao_social: 'SHPS OPERAÇÕES LOGÍSTICAS LTDA',
    endereco: 'Rodovia Governador Mário Covas, BR-101, Km 300',
    complemento: 'Módulo 02 Log Viana',
    bairro: 'Universal',
    cidade: 'Viana',
    uf: 'ES',
    cep: '29135-000',
    regional: 'Espirito Santo',
    responsavel: 'Joliel (SL)',
    telefone: '(27) 98123-4567',
    email: 'soc.es02@shopee.com',
    status_energia: 'Regular',
    status_agua: 'Regular',
    tipo_ativo: 'SOC',
    status_regularizacao: 'Regularizado'
  },
  {
    unidade: 'SOC-SP35',
    cnpj: '42.446.277/0036-17',
    razao_social: 'SHPS OPERAÇÕES LOGÍSTICAS LTDA',
    endereco: 'Avenida Dois Córregos, 3100',
    complemento: 'Galpão 03 Centro Logístico',
    bairro: 'Dois Córregos',
    cidade: 'Piracicaba',
    uf: 'SP',
    cep: '13423-000',
    regional: 'Sudeste SP',
    responsavel: 'Humberto / Isabella Fernandes',
    telefone: '(19) 98877-6655',
    email: 'soc.sp35@shopee.com',
    status_energia: 'Regular',
    status_agua: 'Regular',
    tipo_ativo: 'SOC',
    status_regularizacao: 'Regularizado'
  },
  {
    unidade: 'SOC-SP18',
    cnpj: '42.446.277/0037-98',
    razao_social: 'SHPS OPERAÇÕES LOGÍSTICAS LTDA',
    endereco: 'Avenida Presidente Wilson, 2800',
    complemento: 'Armazém C',
    bairro: 'Mooca',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '03107-000',
    regional: 'Sudeste SP',
    responsavel: 'Isabella Fernandes (SL)',
    telefone: '(11) 97654-3210',
    email: 'soc.sp18@shopee.com',
    status_energia: 'Regular',
    status_agua: 'Regular',
    tipo_ativo: 'SOC',
    status_regularizacao: 'Regularizado'
  },
  // New HUBs
  {
    unidade: 'HUB-LRN-04',
    cnpj: '42.446.277/0038-79',
    razao_social: 'SHPS OPERAÇÕES LOGÍSTICAS LTDA',
    endereco: 'Rua das Oficinas, 450',
    complemento: 'Galpão Hub Parnamirim',
    bairro: 'Emaús',
    cidade: 'Parnamirim',
    uf: 'RN',
    cep: '59149-000',
    regional: 'Nordeste 03',
    responsavel: 'Marcela Brito (Líder Hub)',
    telefone: '(84) 99876-5432',
    email: 'hub.lrn04@shopee.com',
    status_energia: 'Regular',
    status_agua: 'Regular',
    tipo_ativo: 'HUB',
    status_regularizacao: 'Regularizado'
  },
  {
    unidade: 'HUB-LSP-62',
    cnpj: '42.446.277/0039-50',
    razao_social: 'SHPS OPERAÇÕES LOGÍSTICAS LTDA',
    endereco: 'Avenida Comendador Leopoldo Dedini, 800',
    complemento: 'Galpão Hub Piracicaba',
    bairro: 'Unileste',
    cidade: 'Piracicaba',
    uf: 'SP',
    cep: '13422-000',
    regional: 'São Paulo 4',
    responsavel: 'Izabel Sergio (Líder Hub)',
    telefone: '(19) 99123-4567',
    email: 'hub.lsp62@shopee.com',
    status_energia: 'Regular',
    status_agua: 'Regular',
    tipo_ativo: 'HUB',
    status_regularizacao: 'Regularizado'
  },
  {
    unidade: 'HUB-LSP-83',
    cnpj: '42.446.277/0040-93',
    razao_social: 'SHPS OPERAÇÕES LOGÍSTICAS LTDA',
    endereco: 'Avenida Charles Schnneider, 1500',
    complemento: 'Módulo 04',
    bairro: 'Parque Senhor do Bonfim',
    cidade: 'Taubaté',
    uf: 'SP',
    cep: '12040-000',
    regional: 'São Paulo 8',
    responsavel: 'Mariana Menossi (Líder Hub)',
    telefone: '(12) 99234-5678',
    email: 'hub.lsp83@shopee.com',
    status_energia: 'Regular',
    status_agua: 'Regular',
    tipo_ativo: 'HUB',
    status_regularizacao: 'Regularizado'
  },
  {
    unidade: 'HUB-LSP-68',
    cnpj: '42.446.277/0041-74',
    razao_social: 'SHPS OPERAÇÕES LOGÍSTICAS LTDA',
    endereco: 'Avenida Cupecê, 3400',
    complemento: 'Galpão Logístico',
    bairro: 'Cidade Ademar',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '04366-000',
    regional: 'São Paulo 3',
    responsavel: 'João Henrique (Líder Hub)',
    telefone: '(11) 98456-7890',
    email: 'hub.lsp68@shopee.com',
    status_energia: 'Regular',
    status_agua: 'Regular',
    tipo_ativo: 'HUB',
    status_regularizacao: 'Regularizado'
  },
  {
    unidade: 'HUB-LSP-43',
    cnpj: '42.446.277/0042-55',
    razao_social: 'SHPS OPERAÇÕES LOGÍSTICAS LTDA',
    endereco: 'Avenida Engenheiro Necker Carvalho de Camargo, 2100',
    complemento: 'Galpão 02',
    bairro: 'América',
    cidade: 'Barretos',
    uf: 'SP',
    cep: '14783-000',
    regional: 'São Paulo 6',
    responsavel: 'Juliana Pironelli (Líder Hub)',
    telefone: '(17) 99345-6789',
    email: 'hub.lsp43@shopee.com',
    status_energia: 'Regular',
    status_agua: 'Regular',
    tipo_ativo: 'HUB',
    status_regularizacao: 'Regularizado'
  },
  {
    unidade: 'HUB-LSP-63',
    cnpj: '42.446.277/0043-36',
    razao_social: 'SHPS OPERAÇÕES LOGÍSTICAS LTDA',
    endereco: 'Avenida Ayrton Senna da Silva, 1200',
    complemento: 'Hub Litoral Sul',
    bairro: 'Sítio do Campo',
    cidade: 'Praia Grande',
    uf: 'SP',
    cep: '11726-000',
    regional: 'São Paulo 5',
    responsavel: 'Danyela Pina (Líder Hub)',
    telefone: '(13) 99456-7890',
    email: 'hub.lsp63@shopee.com',
    status_energia: 'Regular',
    status_agua: 'Regular',
    tipo_ativo: 'HUB',
    status_regularizacao: 'Regularizado'
  },
  {
    unidade: 'HUB-LSP-35',
    cnpj: '42.446.277/0044-17',
    razao_social: 'SHPS OPERAÇÕES LOGÍSTICAS LTDA',
    endereco: 'Rua Lourenço Prado, 1100',
    complemento: 'Galpão Central',
    bairro: 'Centro',
    cidade: 'Jaú',
    uf: 'SP',
    cep: '17201-000',
    regional: 'São Paulo 7',
    responsavel: 'Isabella Fernandes (Líder Hub)',
    telefone: '(14) 99567-8901',
    email: 'hub.lsp35@shopee.com',
    status_energia: 'Regular',
    status_agua: 'Regular',
    tipo_ativo: 'HUB',
    status_regularizacao: 'Regularizado'
  },
  {
    unidade: 'HUB-LSP-100',
    cnpj: '42.446.277/0045-00',
    razao_social: 'SHPS OPERAÇÕES LOGÍSTICAS LTDA',
    endereco: 'Avenida Prefeito Luis Latorre, 4500',
    complemento: 'Condomínio Industrial Módulo 01',
    bairro: 'Vila das Hortênsias',
    cidade: 'Jundiaí',
    uf: 'SP',
    cep: '13211-000',
    regional: 'São Paulo 6',
    responsavel: 'Izabel Sergio (Líder Hub)',
    telefone: '(11) 99678-9012',
    email: 'hub.lsp100@shopee.com',
    status_energia: 'Regular',
    status_agua: 'Regular',
    tipo_ativo: 'HUB',
    status_regularizacao: 'Regularizado'
  }
];

// Merge all existing with new
const map = new Map<string, CentroDistribuicao>();
CADASTRO_CDS.forEach(c => map.set(c.unidade, c));
additionalUnits.forEach(c => {
  if (!map.has(c.unidade)) {
    map.set(c.unidade, c);
  }
});

const allCds = Array.from(map.values());

// Order: First FULL, then SOC, then HUB, and within each category sorted alphabetically A-Z
const fulls = allCds.filter(c => c.tipo_ativo === 'FULL').sort((a, b) => a.unidade.localeCompare(b.unidade, 'pt-BR', { numeric: true }));
const socs = allCds.filter(c => c.tipo_ativo === 'SOC').sort((a, b) => a.unidade.localeCompare(b.unidade, 'pt-BR', { numeric: true }));
const hubs = allCds.filter(c => c.tipo_ativo === 'HUB').sort((a, b) => a.unidade.localeCompare(b.unidade, 'pt-BR', { numeric: true }));

const consolidatedCds = [...fulls, ...socs, ...hubs];

console.log('Total consolidated CDs & HUBs:', consolidatedCds.length);
console.log('FULL:', fulls.length);
console.log('SOC:', socs.length);
console.log('HUB:', hubs.length);

// Generate cadastrosCDs.ts content
const cdsTsContent = `import { CentroDistribuicao } from '../types/facilities';

export const MACRO_REGIOES = [
  'São Paulo (Sudeste)',
  'Minas Gerais',
  'Rio de Janeiro',
  'Espírito Santo',
  'Nordeste',
  'Sul',
  'Centro-Oeste & Norte'
] as const;

export type MacroRegiao = typeof MACRO_REGIOES[number];

export function getMacroRegion(regional: string = '', uf: string = '', cidade: string = ''): MacroRegiao {
  const regLower = (regional || '').toLowerCase();
  const ufUpper = (uf || '').toUpperCase();
  const cidLower = (cidade || '').toLowerCase();

  if (
    regLower.includes('são paulo') ||
    regLower.includes('sao paulo') ||
    regLower.includes('sudeste sp') ||
    ufUpper === 'SP' ||
    cidLower.includes('são paulo') ||
    cidLower.includes('barueri') ||
    cidLower.includes('cajamar') ||
    cidLower.includes('jundiaí') ||
    cidLower.includes('jundiai') ||
    cidLower.includes('piracicaba') ||
    cidLower.includes('taubaté') ||
    cidLower.includes('taubate') ||
    cidLower.includes('louveira')
  ) {
    return 'São Paulo (Sudeste)';
  }
  if (
    regLower.includes('minas') ||
    ufUpper === 'MG' ||
    cidLower.includes('belo horizonte') ||
    cidLower.includes('betim') ||
    cidLower.includes('governador valadares') ||
    cidLower.includes('nova friburgo') ||
    cidLower.includes('juiz de fora') ||
    cidLower.includes('varginha') ||
    cidLower.includes('sete lagoas')
  ) {
    return 'Minas Gerais';
  }
  if (
    regLower.includes('rio de janeiro') ||
    ufUpper === 'RJ' ||
    cidLower.includes('rio de janeiro') ||
    cidLower.includes('macaé') ||
    cidLower.includes('macae') ||
    cidLower.includes('queimados') ||
    cidLower.includes('são pedro da aldeia')
  ) {
    return 'Rio de Janeiro';
  }
  if (
    regLower.includes('espirito santo') ||
    regLower.includes('espírito santo') ||
    ufUpper === 'ES' ||
    cidLower.includes('viana') ||
    cidLower.includes('itapemirim') ||
    cidLower.includes('são mateus')
  ) {
    return 'Espírito Santo';
  }
  if (
    regLower.includes('nordeste') ||
    ['BA', 'PE', 'CE', 'PB', 'PI', 'RN', 'AL', 'SE', 'MA'].includes(ufUpper) ||
    cidLower.includes('fortaleza') ||
    cidLower.includes('recife') ||
    cidLower.includes('jaboatão') ||
    cidLower.includes('salvador') ||
    cidLower.includes('teresina') ||
    cidLower.includes('joão pessoa') ||
    cidLower.includes('parnamirim') ||
    cidLower.includes('carpina') ||
    cidLower.includes('garanhuns') ||
    cidLower.includes('guaranhuns') ||
    cidLower.includes('caruaru') ||
    cidLower.includes('cruaru')
  ) {
    return 'Nordeste';
  }
  if (
    regLower.includes('sul') ||
    ['PR', 'SC', 'RS'].includes(ufUpper) ||
    cidLower.includes('curitiba') ||
    cidLower.includes('porto alegre') ||
    cidLower.includes('toledo') ||
    cidLower.includes('foz do iguaçu') ||
    cidLower.includes('santa maria') ||
    cidLower.includes('santa rosa') ||
    cidLower.includes('são jose dos pinhais')
  ) {
    return 'Sul';
  }
  if (
    regLower.includes('centro') ||
    regLower.includes('norte') ||
    ['GO', 'DF', 'MT', 'MS', 'AM', 'PA', 'TO', 'RO', 'AC', 'AP', 'RR'].includes(ufUpper) ||
    cidLower.includes('manaus') ||
    cidLower.includes('ananindeua') ||
    cidLower.includes('anamindeua') ||
    cidLower.includes('brasília') ||
    cidLower.includes('goiânia')
  ) {
    return 'Centro-Oeste & Norte';
  }

  return 'São Paulo (Sudeste)';
}

export const CADASTRO_FULL: CentroDistribuicao[] = ${JSON.stringify(fulls, null, 2)};

export const CADASTRO_SOC: CentroDistribuicao[] = ${JSON.stringify(socs, null, 2)};

export const CADASTRO_HUB: CentroDistribuicao[] = ${JSON.stringify(hubs, null, 2)};

export const CADASTRO_CDS: CentroDistribuicao[] = [
  ...CADASTRO_FULL,
  ...CADASTRO_SOC,
  ...CADASTRO_HUB
];

export const CADASTRO_CDS_ALFABETICO: CentroDistribuicao[] = [...CADASTRO_CDS].sort((a, b) =>
  a.unidade.localeCompare(b.unidade, 'pt-BR', { numeric: true, sensitivity: 'base' })
);

export const LISTA_UFS: string[] = Array.from(new Set(CADASTRO_CDS.map((c) => c.uf))).sort();

export const LISTA_REGIONAIS_CDS: string[] = Array.from(new Set(CADASTRO_CDS.map((c) => c.regional))).sort();

// Agrupamento de Centros de Distribuição (FULL + SOC) por Região
export const CDS_E_SOCS_POR_REGIAO: Record<MacroRegiao, CentroDistribuicao[]> = MACRO_REGIOES.reduce(
  (acc, reg) => {
    acc[reg] = [...CADASTRO_FULL, ...CADASTRO_SOC]
      .filter((c) => getMacroRegion(c.regional, c.uf, c.cidade) === reg)
      .sort((a, b) => a.unidade.localeCompare(b.unidade, 'pt-BR', { numeric: true }));
    return acc;
  },
  {} as Record<MacroRegiao, CentroDistribuicao[]>
);

// Agrupamento de Hubs Operacionais (HUB) por Região
export const HUBS_POR_REGIAO: Record<MacroRegiao, CentroDistribuicao[]> = MACRO_REGIOES.reduce(
  (acc, reg) => {
    acc[reg] = CADASTRO_HUB
      .filter((c) => getMacroRegion(c.regional, c.uf, c.cidade) === reg)
      .sort((a, b) => a.unidade.localeCompare(b.unidade, 'pt-BR', { numeric: true }));
    return acc;
  },
  {} as Record<MacroRegiao, CentroDistribuicao[]>
);
`;

fs.writeFileSync('./src/data/cadastrosCDs.ts', cdsTsContent, 'utf8');
console.log('Saved src/data/cadastrosCDs.ts successfully!');
