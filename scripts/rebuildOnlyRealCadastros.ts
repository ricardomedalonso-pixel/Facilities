import fs from 'fs';
import { CADASTRO_CDS } from '../src/data/cadastrosCDs';
import { REAL_CONTINGENCY_INCIDENTS } from '../src/data/realContingencyIncidents';
import { CentroDistribuicao } from '../src/types/facilities';

const realUnitsSet = new Set(REAL_CONTINGENCY_INCIDENTS.map(i => i.unidade));

const onlyRealUnits: CentroDistribuicao[] = CADASTRO_CDS.filter(c => realUnitsSet.has(c.unidade));

const socs = onlyRealUnits.filter(c => c.unidade.startsWith('SOC') || c.tipo_ativo === 'SOC')
  .sort((a, b) => a.unidade.localeCompare(b.unidade, 'pt-BR', { numeric: true }));

const hubs = onlyRealUnits.filter(c => !c.unidade.startsWith('SOC') && c.tipo_ativo !== 'SOC')
  .sort((a, b) => a.unidade.localeCompare(b.unidade, 'pt-BR', { numeric: true }));

console.log('Total real units:', onlyRealUnits.length);
console.log('Real SOCs (CDs):', socs.length, socs.map(s => s.unidade));
console.log('Real HUBs:', hubs.length, hubs.map(h => h.unidade));

const allRealSorted = [...socs, ...hubs];

const fileContent = `import { CentroDistribuicao } from '../types/facilities';

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
    cidLower.includes('são pedro da aldeia') ||
    cidLower.includes('petrópolis') ||
    cidLower.includes('petropolis')
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

// 1. FULL: Base oficial de ocorrências reais não contém chamados em FULL
export const CADASTRO_FULL: CentroDistribuicao[] = [];

// 2. SOC (Centros de Distribuição e Triagem / Sortation Centers) - Exatamente os 7 da base real
export const CADASTRO_SOC: CentroDistribuicao[] = ${JSON.stringify(socs, null, 2)};

// 3. HUBS (Hubs Operacionais e Last Mile) - Exatamente os 48 da base real
export const CADASTRO_HUB: CentroDistribuicao[] = ${JSON.stringify(hubs, null, 2)};

// 4. CADASTRO CONSOLIDADO OFICIAL - 55 Unidades Reais (Sem modelos sintéticos)
export const CADASTRO_CDS: CentroDistribuicao[] = [
  ...CADASTRO_SOC,
  ...CADASTRO_HUB
];

export const CADASTRO_CDS_ALFABETICO: CentroDistribuicao[] = [...CADASTRO_CDS].sort((a, b) =>
  a.unidade.localeCompare(b.unidade, 'pt-BR', { numeric: true, sensitivity: 'base' })
);

export const LISTA_UFS: string[] = Array.from(new Set(CADASTRO_CDS.map(c => c.uf).filter(Boolean))).sort();

export const LISTA_REGIONAIS_CDS: string[] = Array.from(new Set(CADASTRO_CDS.map(c => c.regional).filter(Boolean))).sort();

// Agrupamento de Centros de Distribuição (SOC) por Região
export const CDS_E_SOCS_POR_REGIAO: Record<MacroRegiao, CentroDistribuicao[]> = {
  'São Paulo (Sudeste)': CADASTRO_SOC.filter(c => getMacroRegion(c.regional, c.uf, c.cidade) === 'São Paulo (Sudeste)'),
  'Minas Gerais': CADASTRO_SOC.filter(c => getMacroRegion(c.regional, c.uf, c.cidade) === 'Minas Gerais'),
  'Rio de Janeiro': CADASTRO_SOC.filter(c => getMacroRegion(c.regional, c.uf, c.cidade) === 'Rio de Janeiro'),
  'Espírito Santo': CADASTRO_SOC.filter(c => getMacroRegion(c.regional, c.uf, c.cidade) === 'Espírito Santo'),
  'Nordeste': CADASTRO_SOC.filter(c => getMacroRegion(c.regional, c.uf, c.cidade) === 'Nordeste'),
  'Sul': CADASTRO_SOC.filter(c => getMacroRegion(c.regional, c.uf, c.cidade) === 'Sul'),
  'Centro-Oeste & Norte': CADASTRO_SOC.filter(c => getMacroRegion(c.regional, c.uf, c.cidade) === 'Centro-Oeste & Norte')
};

// Agrupamento de HUBs por Região
export const HUBS_POR_REGIAO: Record<MacroRegiao, CentroDistribuicao[]> = {
  'São Paulo (Sudeste)': CADASTRO_HUB.filter(c => getMacroRegion(c.regional, c.uf, c.cidade) === 'São Paulo (Sudeste)'),
  'Minas Gerais': CADASTRO_HUB.filter(c => getMacroRegion(c.regional, c.uf, c.cidade) === 'Minas Gerais'),
  'Rio de Janeiro': CADASTRO_HUB.filter(c => getMacroRegion(c.regional, c.uf, c.cidade) === 'Rio de Janeiro'),
  'Espírito Santo': CADASTRO_HUB.filter(c => getMacroRegion(c.regional, c.uf, c.cidade) === 'Espírito Santo'),
  'Nordeste': CADASTRO_HUB.filter(c => getMacroRegion(c.regional, c.uf, c.cidade) === 'Nordeste'),
  'Sul': CADASTRO_HUB.filter(c => getMacroRegion(c.regional, c.uf, c.cidade) === 'Sul'),
  'Centro-Oeste & Norte': CADASTRO_HUB.filter(c => getMacroRegion(c.regional, c.uf, c.cidade) === 'Centro-Oeste & Norte')
};
`;

fs.writeFileSync('src/data/cadastrosCDs.ts', fileContent, 'utf8');
console.log('Successfully written src/data/cadastrosCDs.ts with 55 real units only!');
