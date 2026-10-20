import { CentroDistribuicao } from '../types/facilities';

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
export const CADASTRO_SOC: CentroDistribuicao[] = [
  {
    "unidade": "SOC-CE-003",
    "cnpj": "42.446.277/0034-50",
    "razao_social": "SHPX LOGISTICA LTDA.",
    "cep": "60761-000",
    "logradouro": "AVENIDA BERNARDO MANUEL",
    "numero": "1000",
    "complemento": "Sortation Center Fortaleza",
    "bairro": "Mondubim",
    "cidade": "Fortaleza",
    "uf": "CE",
    "regional": "Nordeste 04",
    "responsavel": "Claudio Nobre",
    "telefone": "(85) 99567-2345",
    "email": "claudio.nobre@shopee.com",
    "pendencias": "Nenhuma pendência",
    "tipo_ativo": "SOC",
    "status_regularizacao": "Regularizado"
  },
  {
    "unidade": "SOC-ES02",
    "cnpj": "42.446.277/0035-36",
    "razao_social": "SHPS OPERAÇÕES LOGÍSTICAS LTDA",
    "endereco": "Rodovia Governador Mário Covas, BR-101, Km 300",
    "complemento": "Módulo 02 Log Viana",
    "bairro": "Universal",
    "cidade": "Viana",
    "uf": "ES",
    "cep": "29135-000",
    "regional": "Espirito Santo",
    "responsavel": "Joliel (SL)",
    "telefone": "(27) 98123-4567",
    "email": "soc.es02@shopee.com",
    "status_energia": "Regular",
    "status_agua": "Regular",
    "tipo_ativo": "SOC",
    "status_regularizacao": "Regularizado"
  },
  {
    "unidade": "SOC-PE-04",
    "cnpj": "42.446.277/0034-55",
    "razao_social": "SHPS OPERAÇÕES LOGÍSTICAS LTDA",
    "endereco": "Rodovia BR-101 Sul, Km 82, Muribeca",
    "complemento": "Condomínio Logístico Armazém 04",
    "bairro": "Muribeca",
    "cidade": "Jaboatão dos Guararapes",
    "uf": "PE",
    "cep": "54355-010",
    "regional": "Nordeste 01",
    "responsavel": "Chris Macedo (SL)",
    "telefone": "(81) 98765-4304",
    "email": "soc.pe04@shopee.com",
    "status_energia": "Regular",
    "status_agua": "Regular",
    "tipo_ativo": "SOC",
    "status_regularizacao": "Regularizado"
  },
  {
    "unidade": "SOC-SP06",
    "cnpj": "42.446.277/0046-93",
    "razao_social": "SHPX LOGISTICA LTDA.",
    "cep": "04220-000",
    "logradouro": "AVENIDA PRESIDENTE WILSON",
    "numero": "4500",
    "complemento": "Sortation Center Capital SP Mód. 1 a 4",
    "bairro": "Vila Carioca / Mooca",
    "cidade": "São Paulo",
    "uf": "SP",
    "regional": "Sudeste SP",
    "responsavel": "Fernando Rocha",
    "telefone": "(11) 99123-8901",
    "email": "fernando.rocha@shopee.com",
    "pendencias": "Nenhuma pendência",
    "tipo_ativo": "SOC",
    "status_regularizacao": "Regularizado"
  },
  {
    "unidade": "SOC-SP7",
    "cnpj": "42.446.277/0002-73",
    "razao_social": "SHPX LOGISTICA LTDA.",
    "cep": "13290-150",
    "logradouro": "Rua Wagner Luiz Bevilacqua",
    "numero": "525",
    "complemento": "Modulo 1 ao 4, 9 ao 11",
    "bairro": "Parque dos Estados",
    "cidade": "Louveira",
    "uf": "SP",
    "regional": "Sudeste SP",
    "responsavel": "Felipe Martins",
    "telefone": "(19) 99234-9012",
    "email": "felipe.martins@shopee.com",
    "pendencias": "Falta: inst. elétrica; inst. água",
    "tipo_ativo": "SOC",
    "status_regularizacao": "Pendente Utilidades"
  },
  {
    "unidade": "SOC-SP18",
    "cnpj": "42.446.277/0037-98",
    "razao_social": "SHPS OPERAÇÕES LOGÍSTICAS LTDA",
    "endereco": "Avenida Presidente Wilson, 2800",
    "complemento": "Armazém C",
    "bairro": "Mooca",
    "cidade": "São Paulo",
    "uf": "SP",
    "cep": "03107-000",
    "regional": "Sudeste SP",
    "responsavel": "Isabella Fernandes (SL)",
    "telefone": "(11) 97654-3210",
    "email": "soc.sp18@shopee.com",
    "status_energia": "Regular",
    "status_agua": "Regular",
    "tipo_ativo": "SOC",
    "status_regularizacao": "Regularizado"
  },
  {
    "unidade": "SOC-SP35",
    "cnpj": "42.446.277/0036-17",
    "razao_social": "SHPS OPERAÇÕES LOGÍSTICAS LTDA",
    "endereco": "Avenida Dois Córregos, 3100",
    "complemento": "Galpão 03 Centro Logístico",
    "bairro": "Dois Córregos",
    "cidade": "Piracicaba",
    "uf": "SP",
    "cep": "13423-000",
    "regional": "Sudeste SP",
    "responsavel": "Humberto / Isabella Fernandes",
    "telefone": "(19) 98877-6655",
    "email": "soc.sp35@shopee.com",
    "status_energia": "Regular",
    "status_agua": "Regular",
    "tipo_ativo": "SOC",
    "status_regularizacao": "Regularizado"
  }
];

// 3. HUBS (Hubs Operacionais e Last Mile) - Consolidados e sem duplicatas
export const CADASTRO_HUB: CentroDistribuicao[] = [
  {
    "unidade": "HUB-LAM-002",
    "cnpj": "35.635.824/0042-90",
    "razao_social": "SHPS Tecnologia e Serviços Ltda.",
    "cep": "69041-010",
    "logradouro": "Avenida do Turismo",
    "numero": "13520",
    "complemento": "Galpão 9",
    "bairro": "Tarumã",
    "cidade": "Manaus",
    "uf": "AM",
    "regional": "Nordeste 03",
    "pendencias": "Falta: inst. elétrica; inst. água; responsável",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Pendente Utilidades"
  },
  {
    "unidade": "HUB-LCE-01",
    "cep": "60864-240",
    "logradouro": "AVENIDA PADRE PAULINO",
    "numero": "215",
    "complemento": "N/A",
    "bairro": "Cajazeiras",
    "cidade": "Fortaleza",
    "uf": "CE",
    "regional": "Nordeste 03",
    "responsavel": "Alexandre Silva",
    "telefone": "85 9127-2450",
    "email": "francisco.dasilva@shopee.com",
    "pendencias": "Falta: CNPJ; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LCE-04",
    "cep": "63024-325",
    "logradouro": "RUA JOSIAS INOJOSA DE OLIVEIRA",
    "numero": "14",
    "complemento": "Proximo Anel Viario, Av Francisco Alves Saraiva",
    "bairro": "São José",
    "cidade": "Juazeiro do Norte",
    "uf": "CE",
    "regional": "Nordeste 03",
    "responsavel": "Willan Silva",
    "telefone": "88 9653-3203",
    "email": "willan.silva@shopee.com",
    "pendencias": "Falta: CNPJ; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LCE-05",
    "cep": "61886-170",
    "logradouro": "RODOVIA QUARTO ANEL VIÁRIO",
    "numero": "3955",
    "complemento": "Condominio Log Galpão 01, Armazem 05, 06, 24 e 25",
    "bairro": "Acuri",
    "cidade": "Fortaleza",
    "uf": "CE",
    "regional": "Nordeste 03",
    "responsavel": "Gabriel",
    "telefone": "85 9788-6998",
    "email": "joao.gmrodrigues@shopee.com",
    "pendencias": "Falta: CNPJ; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LES-01",
    "cep": "29322-000",
    "logradouro": "RODOVIA ENGENHEIRO FABIANO VIVACQUA",
    "numero": "1698",
    "complemento": "N/A",
    "bairro": "Morro Grande",
    "cidade": "Itapemirim",
    "uf": "ES",
    "regional": "Espirito Santo",
    "responsavel": "Sanara",
    "telefone": "(28) 999886141",
    "email": "sanara.vargas@shopee.com",
    "pendencias": "Falta: CNPJ; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LES-16",
    "logradouro": "Avenida Norte Sul",
    "numero": "S/N",
    "cidade": "Vitória",
    "uf": "ES",
    "regional": "Espirito Santo",
    "responsavel": "Avenilton",
    "telefone": "(27) 981235352",
    "email": "avenilton.rocha@shopee.com",
    "pendencias": "Falta: CNPJ; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LMG-36",
    "cep": "35502-470",
    "logradouro": "RODOVIA MG-050",
    "numero": "8201",
    "complemento": "KM 127",
    "bairro": "Levindo Paula Pereira",
    "cidade": "Divinópolis",
    "uf": "MG",
    "regional": "Minas Gerais",
    "responsavel": "Raul",
    "telefone": "(31) 99419-3326",
    "email": "raul.vilela@shopee.com",
    "pendencias": "Falta: CNPJ; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LMG-45",
    "cep": "37030-087",
    "logradouro": "RODOVIA BR-491 VARGINHA-ELOI MENDES",
    "numero": "501",
    "complemento": "KM 238, Modulo 3 e 4",
    "bairro": "Aeroporto",
    "cidade": "Varginha",
    "uf": "MG",
    "regional": "Minas Gerais 03",
    "responsavel": "Ailton",
    "telefone": "(35) 98845-8881",
    "email": "ailton.rodrigues@shopee.com",
    "pendencias": "Falta: CNPJ; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LMG-49",
    "cep": "35703-237",
    "logradouro": "RUA JAIR DE SOUZA FONSECA",
    "numero": "109",
    "complemento": "Galpão 9",
    "bairro": "Santa Felicidade",
    "cidade": "Sete Lagoas",
    "uf": "MG",
    "regional": "Minas Gerais",
    "responsavel": "Douglas",
    "telefone": "(31) 9536-9444",
    "email": "douglas.castro@shopee.com",
    "pendencias": "Falta: CNPJ; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LMG-56",
    "cep": "35040-610",
    "logradouro": "AVENIDA INDUSTRIAL",
    "numero": "1777",
    "complemento": "Quadra 06, Lote 9 a 11",
    "bairro": "Distrito Industrial",
    "cidade": "Governador Valadares",
    "uf": "MG",
    "regional": "Minas Gerais",
    "responsavel": "Carlito",
    "telefone": "(11) 913402117",
    "email": "carlito.antonio@shopee.com",
    "pendencias": "Falta: CNPJ; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LMG-59",
    "cep": "36088-410",
    "logradouro": "RODOVIA BR 040",
    "numero": "450",
    "complemento": "Km 783, Galpão 1, Modulo 01 ao 04",
    "bairro": "Santa Cruz",
    "cidade": "Juiz de Fora",
    "uf": "MG",
    "regional": "Minas Gerais 03",
    "responsavel": "Willian Lopes",
    "telefone": "(32) 99138-4256",
    "email": "william.lopes1@shopee.com",
    "pendencias": "Falta: CNPJ; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LMG-61",
    "cep": "33350-000",
    "logradouro": "AVENIDA MARCONI ISSA",
    "numero": "550",
    "complemento": "Galpão A",
    "bairro": "Perobas",
    "cidade": "Vespasiano",
    "uf": "MG",
    "regional": "Minas Gerais",
    "responsavel": "Tiago",
    "telefone": "(31) 98583-2252",
    "email": "tiago.machado@shopee.com",
    "pendencias": "Falta: CNPJ; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LMG-63",
    "cep": "35519-000",
    "logradouro": "Av. Pará",
    "numero": "324",
    "complemento": "N/A",
    "bairro": "Industrial",
    "cidade": "Nova Serrana",
    "uf": "MG",
    "regional": "Minas Gerais",
    "responsavel": "Israel",
    "telefone": "(31) 99988-7408",
    "email": "israel.bailon@shopee.com",
    "pendencias": "Falta: CNPJ; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LPA-03",
    "cep": "67113-320",
    "logradouro": "PASSAGEM SÃO PEDRO",
    "numero": "6",
    "complemento": "N/A",
    "bairro": "Coqueiro",
    "cidade": "Ananindeua",
    "uf": "PA",
    "regional": "Nordeste 04",
    "responsavel": "Ariel",
    "telefone": "(91) 9390-2850",
    "email": "ariel.dlouhy@shopee.com",
    "pendencias": "Falta: CNPJ; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LPB-04",
    "cnpj": "42.446.277/0303-42",
    "razao_social": "SHPX LOGISTICA LTDA.",
    "cep": "58082-015",
    "logradouro": "Rua Norma de Araújo Batista",
    "numero": "951",
    "complemento": "N/A",
    "bairro": "Costa Silva",
    "cidade": "João Pessoa",
    "uf": "PB",
    "regional": "Nordeste 01",
    "responsavel": "André",
    "telefone": "(83) 9 9637-6014",
    "email": "andre.hsouza@shopee.com",
    "pendencias": "Falta: inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Pendente Utilidades"
  },
  {
    "unidade": "HUB-LPE-02",
    "razao_social": "SHPX LOGISTICA LTDA.",
    "cep": "52490-570",
    "logradouro": "RODOVIA BR-101 SUL",
    "numero": "3791",
    "complemento": "Bloco C Anexo 3, 4, 5 e 6",
    "bairro": "Distrito Industrial Santo Estevão",
    "cidade": "Cabo de Santo Agostinho",
    "uf": "PE",
    "regional": "Nordeste 01",
    "responsavel": "Jonas",
    "telefone": "(81) 9 9574-7236",
    "email": "jonas.rocha@shopee.com",
    "pendencias": "Falta: CNPJ; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LPE-03",
    "razao_social": "SHPX LOGISTICA LTDA.",
    "cep": "55099-899",
    "logradouro": "AVENIDA DA RECUPERAÇÃO",
    "numero": "60",
    "complemento": "Galpão 1",
    "bairro": "Guabiraba",
    "cidade": "Recife",
    "uf": "PE",
    "regional": "Nordeste 01",
    "responsavel": "Debora",
    "telefone": "(81) 9 8447-5957",
    "email": "debora.tcampos@shopee.com",
    "pendencias": "Falta: CNPJ; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LPE-04",
    "razao_social": "SHPX LOGISTICA LTDA.",
    "cep": "55099-899",
    "logradouro": "SÍTIO AGRESTE DE TAQUARA E AGRESTE",
    "numero": "278",
    "complemento": "Galpão C",
    "bairro": "Cidade Alta",
    "cidade": "Caruaru",
    "uf": "PE",
    "regional": "Nordeste 01",
    "responsavel": "Joana",
    "telefone": "(81) 9 8971-5101",
    "email": "joana.dark@shopee.com",
    "pendencias": "Falta: CNPJ; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LPE-06",
    "logradouro": "RODOVIA BR 423 KM 100",
    "numero": "1010 A",
    "complemento": "Galpão 1",
    "bairro": "Magano",
    "cidade": "Garanhuns",
    "uf": "PE",
    "regional": "Nordeste 05",
    "responsavel": "André",
    "telefone": "(82) 9 9910-2834",
    "email": "jose.figueiredo@shopee.com",
    "pendencias": "Falta: CNPJ; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LPE-08",
    "razao_social": "SHPX LOGISTICA LTDA.",
    "cep": "55819-317",
    "logradouro": "RODOVIA BR 408",
    "numero": "960",
    "complemento": "Galpão 1 e 2",
    "bairro": "Bairro Novo",
    "cidade": "Carpina",
    "uf": "PE",
    "regional": "Nordeste 01",
    "responsavel": "Caio",
    "telefone": "(81) 9 9820-2743",
    "email": "caio.xavier@shopee.com",
    "pendencias": "Falta: CNPJ; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LPE-11",
    "razao_social": "SHPX LOGISTICA LTDA.",
    "cep": "54819-317",
    "logradouro": "RUA RIO GUAPORÉ",
    "numero": "150",
    "complemento": "Modulo B Loteamento 543 00GLI 0013B",
    "bairro": "Muribeca",
    "cidade": "Jaboatão dos Guararapes",
    "uf": "PE",
    "regional": "Nordeste 01",
    "responsavel": "Glaudistone",
    "telefone": "(81) 9 9455-5014",
    "email": "glaudistone.lemos@shopee.com",
    "pendencias": "Falta: CNPJ; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LPI-01",
    "cep": "64019-330",
    "logradouro": "RUA JOSE TORQUATO VIANA",
    "numero": "2020",
    "complemento": "N/A",
    "bairro": "Picarreira",
    "cidade": "Teresina",
    "uf": "PI",
    "regional": "Nordeste 04",
    "responsavel": "Eduardo Barroso",
    "telefone": "(86) 9978-8499",
    "email": "eduardo.junior@shopee.com",
    "pendencias": "Falta: CNPJ; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LPI-02",
    "cep": "76815-800",
    "logradouro": "RUA RIACHUELO",
    "numero": "3733",
    "complemento": "N/A",
    "bairro": "Tabuleta",
    "cidade": "Teresina",
    "uf": "PI",
    "regional": "Nordeste 04",
    "responsavel": "Pedro Barbosa",
    "telefone": "(86) 9491-6051",
    "email": "pedro.barbosa@shopee.com",
    "pendencias": "Falta: CNPJ; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LPR-12",
    "cnpj": "35.635.824/0001-12",
    "cep": "85859-691",
    "logradouro": "RUA LEOPOLDO CALLEGARIO",
    "numero": "310",
    "complemento": "N/A",
    "bairro": "Alvorada",
    "cidade": "Foz do Iguaçu",
    "uf": "PR",
    "regional": "Sul 1",
    "responsavel": "Anderson Cardoso",
    "telefone": "(45) 99829-4262",
    "email": "anderson.cardoso@shopee.com",
    "pendencias": "Falta: inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Pendente Utilidades"
  },
  {
    "unidade": "HUB-LPR-24",
    "cep": "83070-152",
    "logradouro": "RUA FRANCISCO MUÑOZ MADRID",
    "numero": "625",
    "complemento": "Modulos 207 a 209",
    "bairro": "Roseira de São Sebastião",
    "cidade": "São Jose dos Pinhais",
    "uf": "PR",
    "regional": "Sul 1",
    "responsavel": "Alexandre Silva",
    "telefone": "(41) 9910-6919",
    "email": "alexandre.batista@shopee.com",
    "pendencias": "Falta: CNPJ; região; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LPR-26",
    "cnpj": "35.635.824/0007-08",
    "cep": "85902-600",
    "logradouro": "RODOVIA PARTE SUL DOS LRS 18, 20 E 22",
    "numero": "S/N",
    "complemento": "18, 20, 22 do 1 e 2 Perimetro",
    "bairro": "Recanto Municipal",
    "cidade": "Toledo",
    "uf": "PR",
    "regional": "Sul 1",
    "responsavel": "Eduardo Turola",
    "telefone": "(41) 99917-9832",
    "email": "eduardo.turola@shopee.com",
    "pendencias": "Falta: inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Pendente Utilidades"
  },
  {
    "unidade": "HUB-LRJ-02",
    "cnpj": "42.446.277/0124-41",
    "cep": "28630-310",
    "logradouro": "AV. ANTÔNIO MARIO DE AZEVEDO",
    "numero": "5524",
    "complemento": "Galpão 02",
    "bairro": "Duas Pedras",
    "cidade": "Nova Friburgo",
    "uf": "RJ",
    "regional": "Minas Gerais 03",
    "responsavel": "Emanuel Hansel",
    "telefone": "(24) 99945-6826",
    "email": "emanuel.hansel@shopee.com",
    "pendencias": "Falta: inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Pendente Utilidades"
  },
  {
    "unidade": "HUB-LRJ-05",
    "cnpj": "42.446.277/0134-13",
    "cep": "27930-070",
    "logradouro": "AVENIDA PREFEITO ARISTEU FERREIRA DA SILVA",
    "numero": "2255",
    "complemento": "Quadra X, Lote 01 A, Lote Novo Cavaleiro",
    "bairro": "Vale Encantado",
    "cidade": "Macaé",
    "uf": "RJ",
    "regional": "Rio de Janeiro 01",
    "responsavel": "Vagner Pereira",
    "telefone": "(22) 99876-4855",
    "email": "vagner.pereira@shopee.com",
    "pendencias": "Falta: inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Pendente Utilidades"
  },
  {
    "unidade": "HUB-LRJ-07",
    "cnpj": "35.635.824/0045-33",
    "cep": "20930-460",
    "logradouro": "RUA CONDE DE LEOPOLDINA",
    "numero": "670",
    "complemento": "N/A",
    "bairro": "Vasco da Gama",
    "cidade": "Rio de Janeiro",
    "uf": "RJ",
    "regional": "Rio de Janeiro 02",
    "responsavel": "Monique Portela",
    "telefone": "(11) 98812-2848",
    "email": "monique.portela@shopee.com",
    "pendencias": "Falta: inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Pendente Utilidades"
  },
  {
    "unidade": "HUB-LRJ-21",
    "cnpj": "42.446.277/0167-81",
    "cep": "28949-430",
    "logradouro": "RUA TRES",
    "numero": "308",
    "complemento": "Esquina",
    "bairro": "Balneario das Conchas",
    "cidade": "São Pedro da Aldeia",
    "uf": "RJ",
    "regional": "Rio de Janeiro 01",
    "responsavel": "Dario Gonçalves",
    "telefone": "(21) 98848-2130",
    "email": "dario.goncalves@shopee.com",
    "pendencias": "Falta: inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Pendente Utilidades"
  },
  {
    "unidade": "HUB-LRJ-27",
    "cnpj": "35.635.824/0061-53",
    "cep": "26377-180",
    "logradouro": "RODOVIA PRESIDENTE DUTRA",
    "numero": "25551",
    "complemento": "Bloco 3, Armazens 15 a 20",
    "bairro": "Sarapó",
    "cidade": "Queimados",
    "uf": "RJ",
    "regional": "Rio de Janeiro 02",
    "responsavel": "Juan Machado",
    "telefone": "(21) 99319-8042",
    "email": "juan.machado@shopee.com",
    "pendencias": "Falta: inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Pendente Utilidades"
  },
  {
    "unidade": "HUB-LRJ-29",
    "cnpj": "42.446.277/0136-85",
    "cep": "22775-975",
    "logradouro": "ESTRADA DOS BANDEIRANTES",
    "numero": "3091",
    "complemento": "Armazens 116 ao 123, Bloco 02, Cargo Center",
    "bairro": "Taquara",
    "cidade": "Rio de Janeiro",
    "uf": "RJ",
    "regional": "Rio de Janeiro 01",
    "responsavel": "João Goulart",
    "telefone": "(21) 99864-6448",
    "email": "joao.goulart@shopee.com",
    "pendencias": "Falta: inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Pendente Utilidades"
  },
  {
    "unidade": "HUB-LRN-04",
    "cnpj": "42.446.277/0038-79",
    "razao_social": "SHPS OPERAÇÕES LOGÍSTICAS LTDA",
    "endereco": "Rua das Oficinas, 450",
    "complemento": "Galpão Hub Parnamirim",
    "bairro": "Emaús",
    "cidade": "Parnamirim",
    "uf": "RN",
    "cep": "59149-000",
    "regional": "Nordeste 03",
    "responsavel": "Marcela Brito (Líder Hub)",
    "telefone": "(84) 99876-5432",
    "email": "hub.lrn04@shopee.com",
    "status_energia": "Regular",
    "status_agua": "Regular",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Regularizado"
  },
  {
    "unidade": "HUB-LRS-03",
    "cep": "90220-060",
    "logradouro": "RUA CÂNCIO GOMES",
    "numero": "127",
    "complemento": "N/A",
    "bairro": "Floresta",
    "cidade": "Porto Alegre",
    "uf": "RS",
    "regional": "Sul 2",
    "responsavel": "Vanessa Abdala",
    "telefone": "(51) 98201-5652",
    "email": "vanessa.abdalla@shopee.com",
    "pendencias": "Falta: CNPJ; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LRS-06",
    "cep": "97105-910",
    "logradouro": "RODOVIA SENADOR TARSO DUTRA - RSC 287",
    "numero": "2495",
    "complemento": "RS 030, KM 236",
    "bairro": "Diacomo João Luiz Pozzobom",
    "cidade": "Santa Maria",
    "uf": "RS",
    "regional": "Sul 2",
    "responsavel": "Diogo Luis Jung",
    "telefone": "(55) 99679-1976",
    "email": "diogo.jung@shopee.com",
    "pendencias": "Falta: CNPJ; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LRS-09",
    "cep": "98780-001",
    "logradouro": "AVENIDA BORGES DE MEDEIROS",
    "numero": "192",
    "complemento": "N/A",
    "bairro": "Centro",
    "cidade": "Santa Rosa",
    "uf": "RS",
    "regional": "Sul 3",
    "responsavel": "Marcio Piani",
    "telefone": "(55) 9992-8655",
    "email": "marcio.piani@shopee.com",
    "pendencias": "Falta: CNPJ; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LSP-07",
    "cnpj": "42.446.277/0056-65",
    "razao_social": "SHPS OPERAÇÕES LOGÍSTICAS LTDA",
    "cep": "08295-015",
    "endereco": "AVENIDA JEAN KHOURY FARAH, S/N, VILA CARMOSINA, SÃO PAULO, SP, 08295-015",
    "bairro": "Vila Carmosina",
    "cidade": "São Paulo",
    "uf": "SP",
    "regional": "São Paulo 1",
    "responsavel": "Mateus Bezerra De Lima (SL)",
    "telefone": "(11) 99282-8290",
    "email": "mateus.delima@shopee.com",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Regularizado",
    "status_energia": "Regular",
    "status_agua": "Regular",
    "complemento": "Regional: São Paulo 1 | Gestor: Keven Teixeira (Keven.teixeira@shopee.com)"
  },
  {
    "unidade": "HUB-LSP-008",
    "logradouro": "AVENIDA BANDEIRANTES",
    "numero": "W6666",
    "complemento": "GALPÃO 1",
    "bairro": "JARDIM MARIA AUGUSTA",
    "cidade": "Taubate",
    "uf": "SP",
    "regional": "São Paulo 8",
    "responsavel": "Ozeias",
    "telefone": "(11) 99224-9080",
    "email": "ozeias.moreira@shopee.com",
    "pendencias": "Falta: CNPJ; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LSP-12",
    "cnpj": "42.446.277/0001-92",
    "razao_social": "SHPS OPERAÇÕES LOGÍSTICAS LTDA",
    "cep": "07135-370",
    "endereco": "RUA DOUTOR RICARDO FERREIRA DOS REIS, 132, JARDIM ADRIANA, GUARULHOS, SP, 07135-370",
    "bairro": "Jardim Adriana",
    "cidade": "Guarulhos",
    "uf": "SP",
    "regional": "São Paulo 1",
    "responsavel": "Priscila Pessoa Lorena (SL)",
    "telefone": "(11) 98236-2228",
    "email": "priscila.lorena@shopee.com",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Regularizado",
    "status_energia": "Regular",
    "status_agua": "Regular",
    "complemento": "Regional: São Paulo 1 | Gestor: Keven Teixeira (Keven.teixeira@shopee.com)"
  },
  {
    "unidade": "HUB-LSP-13",
    "cnpj": "42.446.277/0001-92",
    "razao_social": "SHPS OPERAÇÕES LOGÍSTICAS LTDA",
    "cep": "03109-000",
    "endereco": "AVENIDA HENRY FORD, 1245, PARQUE DA MOOCA, SÃO PAULO, SP, 03109-000",
    "bairro": "Mooca",
    "cidade": "São Paulo",
    "uf": "SP",
    "regional": "São Paulo 1",
    "responsavel": "Diego Oliveira Rondado (SL)",
    "telefone": "(11) 97347-4164",
    "email": "diego.rondado@shopee.com",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Regularizado",
    "status_energia": "Regular",
    "status_agua": "Regular",
    "complemento": "Regional: São Paulo 1 | Gestor: Keven Teixeira (Keven.teixeira@shopee.com)"
  },
  {
    "unidade": "HUB-LSP-35",
    "cnpj": "42.446.277/0044-17",
    "razao_social": "SHPS OPERAÇÕES LOGÍSTICAS LTDA",
    "endereco": "Rua Lourenço Prado, 1100",
    "complemento": "Galpão Central",
    "bairro": "Centro",
    "cidade": "Jaú",
    "uf": "SP",
    "cep": "17201-000",
    "regional": "São Paulo 7",
    "responsavel": "Isabella Fernandes (Líder Hub)",
    "telefone": "(14) 99567-8901",
    "email": "hub.lsp35@shopee.com",
    "status_energia": "Regular",
    "status_agua": "Regular",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Regularizado"
  },
  {
    "unidade": "HUB-LSP-37",
    "razao_social": "SHPX LOGISTICA LTDA.",
    "cep": "05318-000",
    "logradouro": "AVENIDA IMPERATRIZ LEOPOLDINA",
    "numero": "1200",
    "complemento": "Galpão Leopoldina",
    "bairro": "Vila Leopoldina",
    "cidade": "São Paulo",
    "uf": "SP",
    "regional": "São Paulo 2",
    "responsavel": "Mariana Duarte",
    "telefone": "(11) 98789-0123",
    "email": "mariana.duarte@shopee.com",
    "pendencias": "Falta: CNPJ; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LSP-41",
    "cep": "06696-060",
    "logradouro": "AVENIDA PORTUGAL",
    "numero": "400",
    "complemento": "GALPÃO B, MÓDULO B-08",
    "bairro": "Itaqui",
    "cidade": "Itapevi",
    "uf": "SP",
    "regional": "São Paulo 2",
    "responsavel": "Marcia Aparecida",
    "telefone": "(11) 99263-8522",
    "email": "marcia.silveira@shopee.com",
    "pendencias": "Falta: CNPJ; inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Incompleto"
  },
  {
    "unidade": "HUB-LSP-43",
    "cnpj": "42.446.277/0042-55",
    "razao_social": "SHPS OPERAÇÕES LOGÍSTICAS LTDA",
    "endereco": "Avenida Engenheiro Necker Carvalho de Camargo, 2100",
    "complemento": "Galpão 02",
    "bairro": "América",
    "cidade": "Barretos",
    "uf": "SP",
    "cep": "14783-000",
    "regional": "São Paulo 6",
    "responsavel": "Juliana Pironelli (Líder Hub)",
    "telefone": "(17) 99345-6789",
    "email": "hub.lsp43@shopee.com",
    "status_energia": "Regular",
    "status_agua": "Regular",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Regularizado"
  },
  {
    "unidade": "HUB-LSP-62",
    "cnpj": "42.446.277/0039-50",
    "razao_social": "SHPS OPERAÇÕES LOGÍSTICAS LTDA",
    "endereco": "Avenida Comendador Leopoldo Dedini, 800",
    "complemento": "Galpão Hub Piracicaba",
    "bairro": "Unileste",
    "cidade": "Piracicaba",
    "uf": "SP",
    "cep": "13422-000",
    "regional": "São Paulo 4",
    "responsavel": "Izabel Sergio (Líder Hub)",
    "telefone": "(19) 99123-4567",
    "email": "hub.lsp62@shopee.com",
    "status_energia": "Regular",
    "status_agua": "Regular",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Regularizado"
  },
  {
    "unidade": "HUB-LSP-63",
    "cnpj": "42.446.277/0043-36",
    "razao_social": "SHPS OPERAÇÕES LOGÍSTICAS LTDA",
    "endereco": "Avenida Ayrton Senna da Silva, 1200",
    "complemento": "Hub Litoral Sul",
    "bairro": "Sítio do Campo",
    "cidade": "Praia Grande",
    "uf": "SP",
    "cep": "11726-000",
    "regional": "São Paulo 5",
    "responsavel": "Danyela Pina (Líder Hub)",
    "telefone": "(13) 99456-7890",
    "email": "hub.lsp63@shopee.com",
    "status_energia": "Regular",
    "status_agua": "Regular",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Regularizado"
  },
  {
    "unidade": "HUB-LSP-68",
    "cnpj": "42.446.277/0041-74",
    "razao_social": "SHPS OPERAÇÕES LOGÍSTICAS LTDA",
    "endereco": "Avenida Cupecê, 3400",
    "complemento": "Galpão Logístico",
    "bairro": "Cidade Ademar",
    "cidade": "São Paulo",
    "uf": "SP",
    "cep": "04366-000",
    "regional": "São Paulo 3",
    "responsavel": "João Henrique (Líder Hub)",
    "telefone": "(11) 98456-7890",
    "email": "hub.lsp68@shopee.com",
    "status_energia": "Regular",
    "status_agua": "Regular",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Regularizado"
  },
  {
    "unidade": "HUB-LSP-74",
    "cnpj": "42.446.277/0001-92",
    "razao_social": "SHPS OPERAÇÕES LOGÍSTICAS LTDA",
    "cep": "08586-415",
    "endereco": "ESTRADA ALBERTO HINOTO, 7655, GALPÃO3 ARMZ 03 04 05 E 06, JARDIM NASCENTE, ITAQUAQUECETUBA, SP, 08586-415",
    "bairro": "Jardim Nascente",
    "cidade": "Itaquaquecetuba",
    "uf": "SP",
    "regional": "São Paulo 1",
    "responsavel": "Douglas O Bryan De Oliveira (SL)",
    "telefone": "(11) 99358-4548",
    "email": "douglas.obryan@shopee.com",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Regularizado",
    "status_energia": "Regular",
    "status_agua": "Regular",
    "complemento": "Regional: São Paulo 1 | Gestor: Keven Teixeira (Keven.teixeira@shopee.com)"
  },
  {
    "unidade": "HUB-LSP-77",
    "cnpj": "42.446.277/0001-92",
    "razao_social": "SHPS OPERAÇÕES LOGÍSTICAS LTDA",
    "cep": "07210-000",
    "endereco": "RODOVIA PRESIDENTE DUTRA, 17744, KM 214, GALPAO 100, ARMZ B, CIDADE INDUSTRIAL SATELITE DE SÃO PAULO, GUARULHOS, SP, 07210-000",
    "bairro": "",
    "cidade": "Guarulhos",
    "uf": "SP",
    "regional": "São Paulo 1",
    "responsavel": "Thuane Maria Ferreira (SL)",
    "telefone": "(11) 99341-7897",
    "email": "thuane.ferreira@shopee.com",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Regularizado",
    "status_energia": "Regular",
    "status_agua": "Regular",
    "complemento": "Regional: São Paulo 1 | Gestor: Keven Teixeira (Keven.teixeira@shopee.com)"
  },
  {
    "unidade": "HUB-LSP-83",
    "cnpj": "42.446.277/0040-93",
    "razao_social": "SHPS OPERAÇÕES LOGÍSTICAS LTDA",
    "endereco": "Avenida Charles Schnneider, 1500",
    "complemento": "Módulo 04",
    "bairro": "Parque Senhor do Bonfim",
    "cidade": "Taubaté",
    "uf": "SP",
    "cep": "12040-000",
    "regional": "São Paulo 8",
    "responsavel": "Mariana Menossi (Líder Hub)",
    "telefone": "(12) 99234-5678",
    "email": "hub.lsp83@shopee.com",
    "status_energia": "Regular",
    "status_agua": "Regular",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Regularizado"
  },
  {
    "unidade": "HUB-LSP-94",
    "cnpj": "42.446.277/0001-92",
    "razao_social": "SHPS OPERAÇÕES LOGÍSTICAS LTDA",
    "cep": "03109-040",
    "endereco": "RUA CADIRIRI, 468, 666, 748, GALPÃO 01, 02 E 04, MOOCA, SÃO PAULO, 03109-040",
    "bairro": "Mooca",
    "cidade": "São Paulo",
    "uf": "SP",
    "regional": "São Paulo 1",
    "responsavel": "Alexandre Moreira Benevenuto (SL)",
    "telefone": "(11) 99132-2686",
    "email": "alexandre.benevenuto@shopee.com",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Regularizado",
    "status_energia": "Regular",
    "status_agua": "Regular",
    "complemento": "Regional: São Paulo 1 | Gestor: Keven Teixeira (Keven.teixeira@shopee.com)"
  },
  {
    "unidade": "HUB-LSP-100",
    "cnpj": "42.446.277/0045-00",
    "razao_social": "SHPS OPERAÇÕES LOGÍSTICAS LTDA",
    "endereco": "Avenida Prefeito Luis Latorre, 4500",
    "complemento": "Condomínio Industrial Módulo 01",
    "bairro": "Vila das Hortênsias",
    "cidade": "Jundiaí",
    "uf": "SP",
    "cep": "13211-000",
    "regional": "São Paulo 6",
    "responsavel": "Izabel Sergio (Líder Hub)",
    "telefone": "(11) 99678-9012",
    "email": "hub.lsp100@shopee.com",
    "status_energia": "Regular",
    "status_agua": "Regular",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Regularizado"
  },
  {
    "unidade": "HUB-LSP-119",
    "cnpj": "42.446.277/0001-92",
    "razao_social": "SHPS OPERAÇÕES LOGÍSTICAS LTDA",
    "cep": "07251-500",
    "endereco": "Av. Julia Gaioli, nº 740, CEP 07251-500, na Cidade de Guarulhos, Estado de São Paulo",
    "bairro": "",
    "cidade": "Guarulhos",
    "uf": "SP",
    "regional": "São Paulo 1",
    "responsavel": "Valéria Carlos (SL)",
    "telefone": "(11) 97796-4423",
    "email": "valeria.carlossilva@shopee.com",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Regularizado",
    "status_energia": "Regular",
    "status_agua": "Regular",
    "complemento": "Regional: São Paulo 1 | Gestor: Keven Teixeira (Keven.teixeira@shopee.com)"
  },
  {
    "unidade": "HUB-NFU-02",
    "cnpj": "42.446.277/0326-39",
    "razao_social": "SHPX LOGISTICA LTDA",
    "cep": "28605-250",
    "logradouro": "R CORONEL LAUDEMIRO DAS MERCES FERREIRA",
    "numero": "260",
    "complemento": "Galpão",
    "bairro": "Loteamento São João",
    "cidade": "Nova Friburgo",
    "uf": "RJ",
    "regional": "Minas Gerais 03",
    "responsavel": "Matheus Silveira",
    "telefone": "(22) 98828-5138",
    "email": "matheus.silveira@shopee.com",
    "pendencias": "Falta: inst. elétrica; inst. água",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Pendente Utilidades"
  },
  {
    "unidade": "HUB-OSP-02",
    "cnpj": "42.446.277/0001-92",
    "razao_social": "SHPS OPERAÇÕES LOGÍSTICAS LTDA",
    "cep": "07022-020",
    "endereco": "AVENIDA GUARULHOS, 57, ANTIGO Nº 525, GALPÃO F, GOPOÚVA, GUARULHOS, SP, 07022-020",
    "bairro": "Gopoúva",
    "cidade": "Guarulhos",
    "uf": "SP",
    "regional": "São Paulo 1",
    "responsavel": "Jose Clebio Benicio Da Silva (SL)",
    "telefone": "(11) 98809-7384",
    "email": "jose.benicio@shopee.com",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Regularizado",
    "status_energia": "Regular",
    "status_agua": "Regular",
    "complemento": "Regional: São Paulo 1 | Gestor: Keven Teixeira (Keven.teixeira@shopee.com)"
  },
  {
    "unidade": "HUB-OSP-03",
    "cnpj": "42.446.277/0001-92",
    "razao_social": "SHPS OPERAÇÕES LOGÍSTICAS LTDA",
    "cep": "03109-040",
    "endereco": "RUA CADIRIRI, 468, 666, 748, GALPÃO 01, 02 E 04, MOOCA, SÃO PAULO, 03109-040",
    "bairro": "Mooca",
    "cidade": "São Paulo",
    "uf": "SP",
    "regional": "São Paulo 1",
    "responsavel": "Vinicius Carlos Pereira Dos Santos (SL)",
    "telefone": "(11) 99785-8303",
    "email": "vinicius.c.santos@shopee.com",
    "tipo_ativo": "HUB",
    "status_regularizacao": "Regularizado",
    "status_energia": "Regular",
    "status_agua": "Regular",
    "complemento": "Regional: São Paulo 1 | Gestor: Keven Teixeira (Keven.teixeira@shopee.com)"
  }
];

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
