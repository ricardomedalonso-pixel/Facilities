import { Incident } from '../types/facilities';
import { CADASTRO_CDS } from './cadastrosCDs';
import { REAL_CONTINGENCY_INCIDENTS } from './realContingencyIncidents';

// Base oficial oficial sem modelos sintéticos: 79 ocorrências reais
export const INITIAL_INCIDENTS: Incident[] = REAL_CONTINGENCY_INCIDENTS;

export const REGIONAIS = [
  'Todas as Regiões',
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

export const SISTEMAS_LISTA = [
  'Todos os Sistemas',
  'Civil',
  'Climatização',
  'Combustivel',
  'Elétrico',
  'Hidráulico',
  'Mecânico',
  'Serralheria'
];

export const CATEGORIAS = SISTEMAS_LISTA;

// 55 Unidades Reais (Sem modelos sintéticos de teste)
export const UNIDADES_LISTA = [
  'Todas as Unidades',
  ...CADASTRO_CDS.map((c) => c.unidade).sort((a, b) =>
    a.localeCompare(b, 'pt-BR', { numeric: true, sensitivity: 'base' })
  )
];

// Fornecedores Reais das 79 ocorrências de contingência
export const FORNECEDORES_LISTA = [
  'Alamo',
  'Brasil Serviços',
  'EFS Manutenções',
  'GPS',
  'Home Safe',
  'Inovação Construtiva',
  'JLL',
  'Mantedendor Interno',
  'Meta',
  'NB Construções',
  'Proprio Condominio',
  'Tecnogera',
  'Thorio',
  'Vitha Facility'
];
