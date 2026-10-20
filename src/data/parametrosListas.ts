import { CADASTRO_CDS } from './cadastrosCDs';

export interface ParametrosConfig {
  limiteAtencaoPercent: number; // 70%
  limiteCriticoPercent: number; // 90%
  avisoHorasRestantes: number; // 1.0 h
  prefixoIdAutomatico: string; // "CONT-"
}

export interface MetaCriticidadeItem {
  criticidade: 'C1' | 'C2' | 'C3' | 'C4';
  nivel: number;
  metaMttaMin: number;
  metaMttrH: number;
  descricao: string;
}

export interface UnidadeCadastro {
  codigo: string;
  unidade: string;
  cidade: string;
  uf: string;
  regiao: string;
}

export const METAS_CRITICIDADE: MetaCriticidadeItem[] = [
  {
    criticidade: 'C1',
    nivel: 1,
    metaMttaMin: 10,
    metaMttrH: 4,
    descricao: 'Crítico — parada total'
  },
  {
    criticidade: 'C2',
    nivel: 2,
    metaMttaMin: 20,
    metaMttrH: 8,
    descricao: 'Alto — impacto parcial grave'
  },
  {
    criticidade: 'C3',
    nivel: 3,
    metaMttaMin: 60,
    metaMttrH: 24,
    descricao: 'Médio — impacto parcial'
  },
  {
    criticidade: 'C4',
    nivel: 4,
    metaMttaMin: 180,
    metaMttrH: 48,
    descricao: 'Baixo — sem impacto'
  }
];

export const CONFIG_SLA_PADRAO: ParametrosConfig = {
  limiteAtencaoPercent: 70, // 70% da meta MTTR consumida
  limiteCriticoPercent: 90, // 90% da meta MTTR consumida
  avisoHorasRestantes: 1.0, // Avisar quando faltar menos de 1h
  prefixoIdAutomatico: 'CONT-'
};

export const LISTA_SISTEMAS = [
  'Elétrico',
  'Climatização',
  'Hidráulico',
  'Civil',
  'Mecânico',
  'Combustível',
  'Serralheria'
];

export const LISTA_IMPACTOS = ['Total', 'Parcial', 'Nenhum'];

export const LISTA_STATUS = ['Aberto', 'Em Atendimento', 'Encerrado', 'Cancelado'];

export const LISTA_CAUSA_RAIZ = [
  'Falha de equipamento',
  'Falta de energia da concessionária',
  'Falta de manutenção preventiva',
  'Erro operacional',
  'Fim de vida útil',
  'Falha do fornecedor',
  'Causa externa',
  'Em investigação',
  'Nível de combustível'
];

export const LISTA_REGIONAIS = [
  'Espirito Santo',
  'Minas Gerais',
  'Minas Gerais 03',
  'Nordeste 01',
  'Nordeste 03',
  'Nordeste 04',
  'Nordeste 05',
  'Rio de Janeiro 01',
  'Rio de Janeiro 02',
  'Sudeste SP',
  'Sul 1',
  'Sul 2',
  'Sul 3',
  'Sul 4',
  'São Paulo 1',
  'São Paulo 2',
  'São Paulo 3',
  'São Paulo 4',
  'São Paulo 5',
  'São Paulo 6',
  'São Paulo 7',
  'São Paulo 8'
];

export const CADASTRO_UNIDADES: UnidadeCadastro[] = CADASTRO_CDS.map((cd) => ({
  codigo: cd.unidade,
  unidade: cd.unidade,
  cidade: cd.cidade,
  uf: cd.uf,
  regiao: cd.regional
}));

export function calcularAlertaSla(
  tempoEmAbertoH: number,
  criticidadeNivel: number,
  config: ParametrosConfig = CONFIG_SLA_PADRAO
): {
  alertaSla: string;
  prioridadeAlerta: 0 | 1 | 2 | 3 | 4;
  semaforoCor: string;
  metaMttrH: number;
  pctConsumida: number;
} {
  const metaItem = METAS_CRITICIDADE.find((m) => m.nivel === criticidadeNivel) || METAS_CRITICIDADE[1];
  const metaMttrH = metaItem.metaMttrH;
  const pctConsumida = metaMttrH > 0 ? (tempoEmAbertoH / metaMttrH) * 100 : 0;
  const horasRestantes = metaMttrH - tempoEmAbertoH;

  // 1. ESTOURADO (>= 100% da meta consumida)
  if (pctConsumida >= 100) {
    return {
      alertaSla: `ESTOURADO - Reparo excedeu SLA contratual de ${metaMttrH}h`,
      prioridadeAlerta: 4,
      semaforoCor: '#DC2626', // Vermelho
      metaMttrH,
      pctConsumida
    };
  }

  // 2. CRÍTICO (>= 90% da meta consumida OU falta menos de 1h)
  if (pctConsumida >= config.limiteCriticoPercent || (horasRestantes <= config.avisoHorasRestantes && horasRestantes > 0)) {
    return {
      alertaSla: `CRÍTICO - Vence em breve (${horasRestantes.toFixed(1)}h restantes)`,
      prioridadeAlerta: 3,
      semaforoCor: '#EA580C', // Laranja
      metaMttrH,
      pctConsumida
    };
  }

  // 3. ATENÇÃO (>= 70% da meta consumida)
  if (pctConsumida >= config.limiteAtencaoPercent) {
    return {
      alertaSla: `ATENÇÃO - ${pctConsumida.toFixed(0)}% do prazo consumido`,
      prioridadeAlerta: 2,
      semaforoCor: '#F59E0B', // Âmbar
      metaMttrH,
      pctConsumida
    };
  }

  // 4. NORMAL (< 70% da meta consumida)
  return {
    alertaSla: 'NORMAL',
    prioridadeAlerta: 1,
    semaforoCor: '#16A34A', // Verde
    metaMttrH,
    pctConsumida
  };
}
