import fs from 'fs';
import { CADASTRO_CDS, CADASTRO_SOC, CADASTRO_HUB, getMacroRegion } from '../src/data/cadastrosCDs';
import { CentroDistribuicao } from '../src/types/facilities';

const userListRaw = `HUB\tSão Paulo 1\tKeven Teixeira\tKeven.teixeira@shopee.com\tHUB-OSP-03\t\tRUA CADIRIRI, 468, 666, 748, GALPÃO 01, 02 E 04, MOOCA, SÃO PAULO, 03109-040\tSão Paulo\tSP\tVinicius Carlos Pereira Dos Santos\tvinicius.c.santos@shopee.com\t11 99785-8303
HUB\tSão Paulo 1\tKeven Teixeira\tKeven.teixeira@shopee.com\tHUB-OSP-02\t\tAVENIDA GUARULHOS, 57, ANTIGO Nº 525, GALPÃO F, GOPOÚVA, GUARULHOS, SP, 07022-020\tGuarulhos\tSP\tJose Clebio Benicio Da Silva\tjose.benicio@shopee.com\t11 98809-7384
HUB\tSão Paulo 1\tKeven Teixeira\tKeven.teixeira@shopee.com\tHUB-LSP-07\t\tAVENIDA JEAN KHOURY FARAH, S/N, VILA CARMOSINA, SÃO PAULO, SP, 08295-015\tSão Paulo\tSP\tMateus Bezerra De Lima\tmateus.delima@shopee.com\t11 99282-8290
HUB\tSão Paulo 1\tKeven Teixeira\tKeven.teixeira@shopee.com\tHUB-LSP-12\t\tRUA DOUTOR RICARDO FERREIRA DOS REIS, 132, JARDIM ADRIANA, GUARULHOS, SP, 07135-370\tGuarulhos\tSP\tPriscila Pessoa Lorena\tpriscila.lorena@shopee.com\t11 98236-2228
HUB\tSão Paulo 1\tKeven Teixeira\tKeven.teixeira@shopee.com\tHUB-LSP-13\t\tAVENIDA HENRY FORD, 1245, PARQUE DA MOOCA, SÃO PAULO, SP, 03109-000\tSão Paulo\tSP\tDiego Oliveira Rondado\tdiego.rondado@shopee.com\t11 97347-4164
HUB\tSão Paulo 1\tKeven Teixeira\tKeven.teixeira@shopee.com\tHUB-LSP-74\t\tESTRADA ALBERTO HINOTO, 7655, GALPÃO3 ARMZ 03 04 05 E 06, JARDIM NASCENTE, ITAQUAQUECETUBA, SP, 08586-415\tItaquaquecetuba\tSP\tDouglas O Bryan De Oliveira\tdouglas.obryan@shopee.com\t11 99358-4548
HUB\tSão Paulo 1\tKeven Teixeira\tKeven.teixeira@shopee.com\tHUB-LSP-77\t\tRODOVIA PRESIDENTE DUTRA, 17744, KM 214, GALPAO 100, ARMZ B, CIDADE INDUSTRIAL SATELITE DE SÃO PAULO, GUARULHOS, SP, 07210-000\tGuarulhos\tSP\tThuane Maria Ferreira\tthuane.ferreira@shopee.com\t11 99341-7897
HUB\tSão Paulo 1\tKeven Teixeira\tKeven.teixeira@shopee.com\tHUB-LSP-94\t\tRUA CADIRIRI, 468, 666, 748, GALPÃO 01, 02 E 04, MOOCA, SÃO PAULO, 03109-040\tMooca\tSP\tAlexandre Moreira Benevenuto\talexandre.benevenuto@shopee.com\t11 99132-2686
HUB\tSão Paulo 1\tKeven Teixeira\tKeven.teixeira@shopee.com\tHUB-LSP-119\t\tAv. Julia Gaioli, nº 740, CEP 07251-500, na Cidade de Guarulhos, Estado de São Paulo\tGuarulhos\tSP\tValéria Carlos\tvaleria.carlossilva@shopee.com\t11 97796-4423`;

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

function extractCep(address: string): string {
  const match = address.match(/(\d{5}-\d{3})/);
  return match ? match[1] : '';
}

// Map of existing hubs to detect duplicates
const hubMap = new Map<string, CentroDistribuicao>();
for (const hub of CADASTRO_HUB) {
  hubMap.set(hub.unidade.trim().toUpperCase(), { ...hub });
}

const parsedNewUnits: CentroDistribuicao[] = [];

const lines = userListRaw.trim().split('\n');
for (const line of lines) {
  const parts = line.split('\t');
  if (parts.length < 9) continue;
  
  const tipo = (parts[0] || 'HUB').trim() as 'HUB' | 'SOC';
  const regional = (parts[1] || 'São Paulo 1').trim();
  const gestorRegional = (parts[2] || '').trim();
  const emailGestor = (parts[3] || '').trim();
  const codigo = parts[4].trim();
  const cnpj = (parts[5] || '').trim();
  const enderecoCompleto = (parts[6] || '').trim();
  let cidade = (parts[7] || '').trim();
  const uf = (parts[8] || 'SP').trim().toUpperCase();
  const responsavel = (parts[9] || '').trim();
  const email = (parts[10] || '').trim();
  const telefone = (parts[11] || '').trim();

  // Normalize Mooca to São Paulo if city is Mooca
  let bairro = '';
  if (cidade.toLowerCase() === 'mooca') {
    bairro = 'Mooca';
    cidade = 'São Paulo';
  } else if (enderecoCompleto.toLowerCase().includes('mooca')) {
    bairro = 'Mooca';
  } else if (enderecoCompleto.toLowerCase().includes('gopoúva') || enderecoCompleto.toLowerCase().includes('gopouva')) {
    bairro = 'Gopoúva';
  } else if (enderecoCompleto.toLowerCase().includes('vila carmosina')) {
    bairro = 'Vila Carmosina';
  } else if (enderecoCompleto.toLowerCase().includes('jardim adriana')) {
    bairro = 'Jardim Adriana';
  } else if (enderecoCompleto.toLowerCase().includes('jardim nascente')) {
    bairro = 'Jardim Nascente';
  }

  const cep = extractCep(enderecoCompleto);

  const unitObj: CentroDistribuicao = {
    unidade: codigo,
    cnpj: cnpj || (hubMap.get(codigo.toUpperCase())?.cnpj || '42.446.277/0001-92'),
    razao_social: 'SHPS OPERAÇÕES LOGÍSTICAS LTDA',
    cep: cep || hubMap.get(codigo.toUpperCase())?.cep || '',
    endereco: enderecoCompleto,
    bairro: bairro || hubMap.get(codigo.toUpperCase())?.bairro || '',
    cidade: cidade,
    uf: uf,
    regional: regional,
    responsavel: responsavel ? `${responsavel} (SL)` : (hubMap.get(codigo.toUpperCase())?.responsavel || ''),
    telefone: telefone ? formatPhone(telefone) : (hubMap.get(codigo.toUpperCase())?.telefone || ''),
    email: email || hubMap.get(codigo.toUpperCase())?.email || '',
    tipo_ativo: tipo,
    status_regularizacao: 'Regularizado',
    status_energia: 'Regular',
    status_agua: 'Regular',
    complemento: gestorRegional ? `Regional: ${regional} | Gestor: ${gestorRegional} (${emailGestor})` : undefined
  };

  if (hubMap.has(codigo.toUpperCase())) {
    console.log(`[Deduplicação / Atualização] Unidade ${codigo} já existia no cadastro. Atualizando com os novos dados reais e eliminando duplicata.`);
  } else {
    console.log(`[Novo Cadastro] Inserindo nova unidade ${codigo} (${cidade}/${uf} - ${regional})`);
  }

  hubMap.set(codigo.toUpperCase(), unitObj);
}

// Consolidated HUBs sorted A-Z
const consolidatedHubs = Array.from(hubMap.values()).sort((a, b) =>
  a.unidade.localeCompare(b.unidade, 'pt-BR', { numeric: true, sensitivity: 'base' })
);

console.log('Total de SOCs (CDs):', CADASTRO_SOC.length);
console.log('Total de HUBs pós-cadastro e eliminação de duplicados:', consolidatedHubs.length);
console.log('Total Geral no Cadastro:', CADASTRO_SOC.length + consolidatedHubs.length);

// Generate new cadastrosCDs.ts
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
    cidLower.includes('guarulhos') ||
    cidLower.includes('itaquaquecetuba') ||
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

// 2. SOC (Centros de Distribuição e Triagem / Sortation Centers) - 7 unidades oficiais
export const CADASTRO_SOC: CentroDistribuicao[] = ${JSON.stringify(CADASTRO_SOC, null, 2)};

// 3. HUBS (Hubs Operacionais e Last Mile) - Consolidados e sem duplicatas
export const CADASTRO_HUB: CentroDistribuicao[] = ${JSON.stringify(consolidatedHubs, null, 2)};

// 4. CADASTRO CONSOLIDADO OFICIAL - CDs (SOCs) e HUBs Reais
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
console.log('Arquivo src/data/cadastrosCDs.ts atualizado com sucesso!');
