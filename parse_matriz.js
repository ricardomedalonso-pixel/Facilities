const fs = require('fs');

const raw = `HUB	Nordeste 01	Leticia	leticia.mourato@shopee.com	HUB-LPB-02	HUB-LPB-02	RUA PERSEU DANTAS, 191, GALPAO F3, VELAME, CAMPINA GRANDE, PB, 58420-450	Campina Grande	PB	Silvano	silvano.moura@shopee.com	(83) 9 9893-5355
HUB	Nordeste 01	Leticia	leticia.mourato@shopee.com	HUB-LPB-03	HUB-LPB-03	RUA NORMA DE ARAUJO BATISTA, 951, GALPÃO E, GRAMAME, JOÃO PESSOA, PB, 58069-263	João Pessoa	PB	Flávia	flavia.menezes@shopee.com	(83) 9 9951-6815
HUB	Nordeste 01	Leticia	leticia.mourato@shopee.com	HUB-LPB-04	HUB-LPB-04	RUA SEM NOME, SN, COSTA E SILVA, JOÃO PESSOA, PB	João Pessoa	PB	André	andre.hsouza@shopee.com	(83) 9 9637-6014
HUB	Nordeste 01	Leticia	leticia.mourato@shopee.com	HUB-LPE-02	HUB-LPE-02	RODOVIA BR-101 SUL, 3791, BLOCO C, ANEXO 3,4,5 E 6, DISTRITO INDUSTRIAL SANTO ESTEVÃO, CABO DE SANTO AGOSTINHO, PE, 54503-010	Cabo de Santo Agostinho	PE	Jonas	jonas.rocha@shopee.com	(81) 9 9574-7236
HUB	Nordeste 01	Leticia	leticia.mourato@shopee.com	HUB-LPE-03	HUB-LPE-03	AVENIDA DA RECUPERAÇÃO, 60, KM BR 101 NORTE, GALPAO 1, KM 60, GUABIRABA, RECIFE, PE, 52490-570	Olinda	PE	Debora	debora.tcampos@shopee.com	(81) 9 8447-5957
HUB	Nordeste 01	Leticia	leticia.mourato@shopee.com	HUB-LPE-04	HUB-LPE-04	SÍTIO AGRESTE DE TAQUARA E AGRESTE, 278, GALPAO C, CIDADE ALTA, CARUARU, PE, 55099-899	Caruaru	PE	Joana	joana.dark@shopee.com	(81) 9 8971-5101
HUB	Nordeste 01	Leticia	leticia.mourato@shopee.com	HUB-LPE-07	HUB-LPE-07	RUA RIACHÃO, 807, GALPÃO A, MURIBECA, JABOATÃO DOS GUARARAPES, PE, 54355-057	Recife	PE	Rayane	rayane.cardoso@shopee.com	(81) 9 9179-6955
HUB	Nordeste 01	Leticia	leticia.mourato@shopee.com	HUB-LPE-08	HUB-LPE-08	RODOVIA BR 408, 960, GALPAO 01 E 02, AV CON EUCARISTICO I, BAIRRO NOVO, CARPINA, PE, 55819-317	Carpina	PE	Caio	caio.xavier@shopee.com	(81) 9 9820-2743
HUB	Nordeste 01	Leticia	leticia.mourato@shopee.com	HUB-LPE-11	HUB-LPE-11	RUA RIO GUAPORÉ, 150, MÓDULO B, LOTEAMENTO 543 00GLI 0013B, MURIBECA, JABOATÃO DOS GUARARAPES, PE, 54350-448	Jabotaão dos Guararapes	PE	Glaudistone	glaudistone.lemos@shopee.com	(81) 9 9455-5014
HUB	Nordeste 01	Leticia	leticia.mourato@shopee.com	HUB-LPE-12	HUB-LPE-12	AVENIDA SEVERINO JOSINO GUERRA, 3305, KM 17, CONDOMÍNIO RB CENTRO LOGÍSTICO, GALPÕES 6 E 7, PARATIBE, PAULISTA, PE, 53413-195	Paulista	PE	Gustavo	gustavo.pereira@shopee.com	(81) 9 9677-7368
HUB	Nordeste 02	Ana Victoria	anavictoria.andrade@shopee.com	HUB-LBA-01	HUB-LBA-01	AVENIDA DEPUTADO LUIS EDUARDO MAGALHÃES, SN, GALPÃO 2, KM 526, BR 324, SENTIDO SALVADOR, HUMILDES, FEIRA DE SANTANA, BA, 44135-000	Feira de Santana	BA	Leandro Arao	leandro.arao@shopee.com	(75) 8152-9998
HUB	Nordeste 02	Ana Victoria	anavictoria.andrade@shopee.com	HUB-LBA-05	HUB-LBA-05	2ª TRAVESSA DO ACOUGUE VELHO, S/N, QUADRA A, LOTE 04, TRECHO 175, SANTA TEREZINHA, SANTO ANTONIO DE JESUS, BA, 44445-618	Santo Antonio de Jesus	BA	Álvaro Jesus	alvaro.jesus@shopee.com	(75) 9883-3124
HUB	Nordeste 02	Ana Victoria	anavictoria.andrade@shopee.com	HUB-LBA-22	HUB-LBA-22	RODOVIA JORGE AMADO - BR 415, SN, KM 24, ILHÉUS, BA, 45662-000	Itabuna	BA	Ualisson Henrique	ualisson.henrique@shopee.com	(73) 9124-5147
HUB	Nordeste 02	Ana Victoria	anavictoria.andrade@shopee.com	HUB-LBA-07	HUB-LBA-07	RODOVIA BR 116, SN, KM 829 RUA G QUADRA E, LOTE 47, 48 49, 50, GALPÃO 01 E 02, AYRTON SENNA, VITÓRIA DA CONQUISTA, BA, 45058-000	Vitoria da Conquista	BA	Jorge Vales	jorge.vales@shopee.com	(77) 9938-2760
HUB	Nordeste 02	Ana Victoria	anavictoria.andrade@shopee.com	HUB-LBA-08	HUB-LBA-08	AVENIDA 2 DE AGOSTO, 450, ESTRADA MEIA HORA, ROD BA 800, KM 0,5, PARQUE INDUSTRIAL 2, IRECÊ, BA, 44871-830	Irece	BA	Ivan Gomes	ivan.gomes@shopee.com	(11) 9 5867-7782
HUB	Nordeste 02	Ana Victoria	anavictoria.andrade@shopee.com	HUB-LBA-12	HUB-LBA-12	AVENIDA JOSEPH WAGNER, 10, JARDIM PETROLAR, ALAGOINHAS, BA, 48005-612	Alagoinhas	BA	Felipe	felipe.carvalho@shopee.com	(75) 9139-4142
HUB	Nordeste 02	Ana Victoria	anavictoria.andrade@shopee.com	HUB-LBA-14	HUB-LBA-14	VIA DE LIGAÇÃO, SN, GALPAO9 E 10, POLO INDUSTRIAL DE CAMAÇARI, CAMAÇARI, BA, 42816-220	Camaçari	BA	Jefferson	jefferson.silva@shopee.com	(71) 8889-6253
HUB	Nordeste 02	Ana Victoria	anavictoria.andrade@shopee.com	HUB-LBA-17	HUB-LBA-17	ESTRADA DO SEST SENAT, 908, ANEXO B10 E B11, GALPÃO 2, CIA I, SIMÕES FILHO, BA, 43700-000	Simões Filho	BA	Fábio Costa	fabio.costa@shopee.com	(71) 9 9964-5828
HUB	Nordeste 02	Ana Victoria	anavictoria.andrade@shopee.com	HUB-LBA-18	HUB-LBA-18	ESTRADA DA IASA, 434, MÓDULO 9, PIRAJÁ, SALVADOR, BA, 41297-355	Salvador	BA	Anthony Posso	anthony.posso@shopee.com	(71) 9 4731-0887
HUB	Nordeste 02	Ana Victoria	anavictoria.andrade@shopee.com	HUB-LBA-19	HUB-LBA-19	RUA MARTINIANO BONFIM, 50, GALPÃO 01 A 04, RETIRO, SALVADOR, BA, 41151-100	Salvador	BA	Lilla Armede	lilla.armede@shopee.com	(75) 9160-0275
HUB	Nordeste 02	Ana Victoria	anavictoria.andrade@shopee.com	HUB-LBA-27	HUB-LBA-27	AVENIDA SANTOS DUMONT, 8262, GALPAO 3, QUADRA UNICA, LOTE DIVER, LOTEAMENTO 58, NOSSA SRA DE LOURDES, BURAQUINHO, LAURO DE FREITAS, BA, 42710-860	Lauro de Freitas	BA	Leonardo	leonardo.csilva@shopee.com	
HUB	Nordeste 02	Ana Victoria	anavictoria.andrade@shopee.com	HUB-LBA-21	HUB-LBA-21	AVENIDA GOVERNADOR JOAO DURVAL CARNEIRO, 4419, SÃO JOÃO, FEIRA DE SANTANA, BA, 44051-335	Feira de Santana	BA	Roberlan Santos	roberlan.santos@shopee.com	(75) 8152-9998
HUB	Nordeste 03	Marcela	marcela.brito@shopee.com	HUB-LCE-01		AVENIDA PADRE PAULINO, 215, CAJAZEIRAS, FORTALEZA, CE, 60864-240	Fortaleza	CE	Alexandre Silva	francisco.dasilva@shopee.com	85 9127-2450
HUB	Nordeste 03	Marcela	marcela.brito@shopee.com	HUB-LCE-02		AVENIDA VEREADOR FRANCISCO PESSOA DE LIMA, 1700, MÓDULO 23, GALPAO 01, SETOR A, TOCO (JUREMA), CAUCAIA, CE, 61663-020	Caucaia	CE	Eduardo Viana	jose.viana@shopee.com	85 9221-4948
HUB	Nordeste 03	Marcela	marcela.brito@shopee.com	HUB-LCE-04		RUA JOSIAS INOJOSA DE OLIVEIRA, 14, PROXIMO AO ANEL VIARIO, AV FCO ALVES SARAIVA, RUA PROJETADA, SAO JOSE, JUAZEIRO DO NORTE, CE, 63024-325	Juazeiro	CE	Willan Silva	willan.silva@shopee.com	88 9653-3203
HUB	Nordeste 03	Marcela	marcela.brito@shopee.com	HUB-LCE-05		RODOVIA QUARTO ANEL VIÁRIO, 3955, CONDOMINIO LOG GALPAO1 ARMZ 05 06 24 25, ANCURI, CE, 61886-170	Fortaleza	CE	Gabriel	joao.gmrodrigues@shopee.com	85 9788-6998
HUB	Nordeste 03	Marcela	marcela.brito@shopee.com	HUB-LRN-01		RUA IRINEU COSTA, 210, PITIMBU, NATAL, RN, 59066-280	Natal	RN	Luci	lucicleide.inacio@shopee.com	(84) 9 9930-7027
HUB	Nordeste 03	Marcela	marcela.brito@shopee.com	HUB-LRN-03		RODOVIA FEDERAL GOVERNADOR MARIO COVAS BR 101, S/N, KM 113 GALPAO1 MOD 3 4 5 QUADRA41, LOTE GL 02, TABORDA, SÃO JOSE DE MIPIBU, RN, 59162-000	Natal	RN	Marta	marta.nobrega@shopee.com	(84) 9 9930-7027
HUB	Nordeste 04	Flávia	flavia.lacerda@shopee.com	HUB-LMA-01		AVENIDA 05, SN, GALPÃO A1, QUADRA D, LOTE 02, DISTRITO INDUSTRIAL, SÃO LUIS, MA, 65090-272	São Luis	MA	Eliel Carvalho	eliel.carvalho@shopee.com	98 8492-0877
HUB	Nordeste 04	Flávia	flavia.lacerda@shopee.com	HUB-LMA-02		RODOVIA BR 135 (AVN.ENG.EMILIANO MACIEIRA), 0, KM 8, MARACANA, SÃO LUIS, MA, 65095-602	São Luis	MA	Warllison Alves	warllison.alves@shopee.com	98 8868-8165
HUB	Nordeste 04	Flávia	flavia.lacerda@shopee.com	HUB-LPA-03		PASSAGEM SÃO PEDRO, 6, COQUEIRO, ANANINDEUA, PA, 67113-320	Belém	PA	Ariel	ariel.dlouhy@shopee.com	91 9390-2850
HUB	Nordeste 04	Flávia	flavia.lacerda@shopee.com	HUB-LPI-01		RUA JOSE TORQUATO VIANA, 2020, PICARREIRA, TERESINA, PI, 64056-330	Teresina	PI	Eduardo Barroso	eduardo.junior@shopee.com	86 9978-8499
HUB	Nordeste 04	Flávia	flavia.lacerda@shopee.com	HUB-LPI-02		RUA RIACHUELO, 3733, TABULETA, TERESINA, PI, 64019-718	Teresina	PI	Pedro Barbosa	pedro.barbosa@shopee.com	86 9491-6051
HUB	Nordeste 04	Flávia	flavia.lacerda@shopee.com	HUB-LRO-01		RODOVIA BR-364, 9351, KM 5 SETOR 17 QUADRA060, CIDADE JARDIM, PORTO VELHO, RO, 76815-800	Porto Velho	RO	Carlison	carlison.silva@shopee.com	62 9262-3765
HUB	Nordeste 04	Flávia	flavia.lacerda@shopee.com	HUB-LTO-01		RUA SR 13, SN, CONJUNTO 05, LOTE 07, QUADRA ASR SE 25 (212 SUL), PLANO DIRETOR SUL, PALMAS, TO, 77020-618	Palmas	TO	Breno	breno.neto@shopee.com	62 9262-3765
HUB	Nordeste 05	Maksmiller	maksmiller.oliveira@shopee.com	HUB-LPE-06		RODOVIA BR 423 KM 100, 1010 A, GALPÃO 01, MAGANO, GARANHUNS, PE, 55294-440	Garanhuns	PE	André	jose.figueiredo@shopee.com	(82) 9 9910-2834
HUB	Nordeste 02	Maksmiller	maksmiller.oliveira@shopee.com	HUB-LSE-01		AVENIDA CHESF, SN, GALPÃO 2, MÓDULO 4B, PARQUE DOS FAROIS, NOSSA SENHORA DO SOCORRO, SE, 49160-000	Aracaju	SE	Andreza Almeida	andreza.almeida@shopee.com	(79) 9628-4373
HUB	Nordeste 02	Maksmiller	maksmiller.oliveira@shopee.com	HUB-LSE-03		RODOVIA BR 235, SN, KM 05, ARMAZENS 01 A 04, CONDOMINIO MB LOG, QUADRA 2464, NOSSA SENHORA DO SOCORRO, SE, 49158-622	Aracaju	SE	Tamires Xavier	tamires.xavier@shopee.com	(79) 8826-2644
HUB	Nordeste 03	Maksmiller	maksmiller.oliveira@shopee.com	HUB-LBA-29		RODOVIA BA 210, 0, DISTRITO INDUSTRIAL, JUAZEIRO, BA, 48909-781	Juazeiro	BA	Larissa Silva	aysllaine.silva@shopee.com	(87) 8131-1075
HUB	Nordeste 03	Maksmiller	maksmiller.oliveira@shopee.com	HUB-LAL-04		ÁREA TABULEIRO DO PINTO, SN, GALPÃO 01, ARMAZENS 04, 05, 06 e 07, ANTÔNIO LINS, RIO LARGO, AL, 57100-000	Maceió	AL	Raquel	raquel.silva@shopee.com	(82) 9 9927-4432
HUB	Nordeste 03	Maksmiller	maksmiller.oliveira@shopee.com	HUB-LAL-02		VIA EM PROJETO, S/N, QUADRA4B LOTE 09, TABULEIRO DO MARTINS, MACEIÓ, AL, 57081-583	Maceió	AL	Yasmin	yasmin.jsantos@shopee.com	(82) 0 9611-9101
HUB	Nordeste 03	Maksmiller	maksmiller.oliveira@shopee.com	HUB-LAL-03		RUA IRENE GONZAGA DE LIMA, 184, ARMZ 01 A 04, GUARIBAS, ARAPIRACA, AL, 57303-747	Arapiraca	AL	Marcelo	antonio.torres@shopee.com	(82) 9 9150-7831
HUB	Centro Oeste	Élida	elida.paixao@shopee.com 	HUB-LDF-01		QUADRA SAAN QUADRA 03, LT 385, ZONA INDUSTRIAL, BRASÍLIA, DF, 70632-340	Brasilia	DF	Thiago	thiago.william@shopee.com	(61) 9629-0412
HUB	Centro Oeste	Élida	elida.paixao@shopee.com 	HUB-LDF-04		RODOVIA DF-290, SN, ARMAZENS 6 E 7, GALPAO 2, CONDOMINIO DF BUSINESS PARK, LOTE 01 A 04, SANTA MARIA, BRASILIA, DF, 72549-490	Brasilia	DF	Vanderson	vanderson.cavalcante@shopee.com	(61) 9204-4109
HUB	Centro Oeste	Élida	elida.paixao@shopee.com 	HUB-LDF-05		TRECHO SIA, SN, TRECHO 2, LOTE 26, ZONA INDUSTRIAL (GUARA), BRASILIA, DF, 71200-010	Brasilia	DF	Raniel	raniel.vieira@shopee.com	(38) 9977-1026
HUB	Centro Oeste	Élida	elida.paixao@shopee.com 	HUB-LDF-03		RODOVIA BR-060, S/N, KM 5, GALPAO 2, MODULO 1 / 2 / 3, CHACARA 30, RECANTO DAS EMAS, BRASILIA, DF, 72668-000	Brasilia	DF	Danilo	danilo.dossantos@shopee.com	(61) 9148-4700
HUB	Centro Oeste	Desirée	desiree.trindade@shopee.com 	HUB-LGO-02		AVENIDA PEDRO LUDOVICO, 4128, PARQUE OESTE INDUSTRIAL, GOIANIA, GO, 74375-400	Goiânia	GO	Leandro	leandro.jeronimo@shopee.com	(62) 9322-1472
HUB	Centro Oeste	Desirée	desiree.trindade@shopee.com 	HUB-LGO-03		AVENIDA SÃO PAULO, SN, LOTE 1 QUADRA C, SETOR INDUSTRIAL AEROPORTO, ANAPOLIS, GO, 75104-350	Anápolis	GO	Gabriel	gabriel.sa@shopee.com	(62) 9331-4460
HUB	Centro Oeste	Desirée	desiree.trindade@shopee.com 	HUB-LGO-04		AVENIDA ANASIA ANTONIO DA CUNHA, SN, QUADRA P REMEM.01/05/06, LOTE 01/05/06, CIDADE EMPRESARIAL NOVA ALIANÇA, RIO VERDE, GO, 75913-220	Rio Verde	GO	Cristiano 	cristiano.correa@shopee.com 	(62) 9257-0009/ 8261-4141
HUB	Centro Oeste	Desirée	desiree.trindade@shopee.com 	HUB-LGO-05		RUA CARIJOS COM RUA AYMORES, SN, QUADRA 19, LOTE 01 AO 32, JARDIM ELDORADO, APARECIDA DE GOIANIA, GO, 74993-080	Aparecida de Goiânia	GO	Lucas	lucas.caetano@shopee.com	(62) 9397-0896
HUB	Centro Oeste	Desirée	desiree.trindade@shopee.com 	HUB-LMS-02		RUA TRES, 6865, GALPAO 01, CHACARA CALIFORNIA, DOURADOS, MS, 79843-122	Dourados	MS	Adara	adara.piccoli@shopee.com 	(67)99291-9748
HUB	Centro Oeste	Desirée	desiree.trindade@shopee.com 	HUB-LMS-03		AVENIDA RANULPHO MARQUES LEAL, 3485, GALPÃO 5, DISTRITO INDUSTRIAL II, TRÊS LAGOAS, MS, 79613-000	Três Lagoas	MS	Leticya	leticya.santos@shopee.com	(67) 8473-2756
HUB	Centro Oeste	Desirée	desiree.trindade@shopee.com 	HUB-LMS-04		AVENIDA ZILA CORREA MACHADO, 9132, GALPAO 2, RITA VIEIRA, CAMPO GRANDE, MS, 79062-002	Campo Grande	MS	Leandro	leandro.jeronimo@shopee.com	(62) 9322-1472
HUB	Centro Oeste	Élida	elida.paixao@shopee.com 	HUB-LMT-01		ALAMEDA C (LOT JD INDUSTRIARIO I), SN, FUNDOS AV. AYRTON SENNA DA SILVA, JARDIM INDUSTRIARIO, CUIABA, MT, 78098-680	Cuiabá	MT	Rafael 	rafael.lazio@shopee.com	(61) 9985-1995
HUB	Centro Oeste	Élida	elida.paixao@shopee.com 	HUB-LMT-02		AVENIDA CORONEL ESTEVAO TORQUATO NETO, 0, GALPAO 1, ARMAZEM 4 / 5 / 17 / 18, CONDOMÍNIO LOG, PASCOAL RAMOS, CUIABÁ, MT, 78098-105	Cuiabá	MT	Lauro Alves	lauro.alves@shopee.com	(96) 8114-8491
HUB	Espirito Santo	Guilherme Persio	guilherme.persio@shopee.com	HUB-LES-01		RODOVIA ENGENHEIRO FABIANO VIVACQUA, 1698, MORRO GRANDE, CACHOEIRO DE ITAPEMIRIM, ES, 29322-000	Cachoeiro de Itapemirim	ES	Sanara	sanara.vargas@shopee.com	28999886141
HUB	Espirito Santo	Guilherme Persio	guilherme.persio@shopee.com	HUB-LES-03		AVENIDA PORTO CANOA, SN, LOTE A3C2, PORTO CANOA, SERRA, ES, 29168-345	Serra	ES	Diogo	diogo.santos@shopee.com	27995837670
HUB	Espirito Santo	Guilherme Persio	guilherme.persio@shopee.com	HUB-LES-04		AVENIDA ALUIZIO ORDONES DE CASTRO, 235, QUADRA 11, LOTE 06, JARDIM SANTA ROSA, GUARAPARI, ES, 29217-305	Guarapari	ES	Paulo	paulo.paiva@shopee.com	27998913900
HUB	Espirito Santo	Guilherme Persio	guilherme.persio@shopee.com	HUB-LES-05		AVENIDA DOS MOVELEIROS, 750, CANIVETE, LINHARES, ES, 29909-120	Linhares	ES	Thiago	thiago.tertuliano@shopee.com	27996259922
HUB	Espirito Santo	Guilherme Persio	guilherme.persio@shopee.com	HUB-LES-16			São Mateus	ES	Avenilton	avenilton.rocha@shopee.com	27981235352
HUB	Espirito Santo	Guilherme Persio	guilherme.persio@shopee.com	HUB-LES-07		RUA CONEGO JOAO GUILHERME, 248, ARMAZÉM 2, GALPÃO MÁRIO GIURIZATTO, COLATINA, ES, 29706-557	Colatina	ES	Luiz	luiz.carrara@shopee.com	27996238501
HUB	Espirito Santo	Guilherme Persio	guilherme.persio@shopee.com	HUB-LES-08		AVENIDA ALCACIBAS FURTADO, 800, GALPÃO 7 ARMAZÉM 2, CANAÃ, VIANA, ES, 29135-008	Cariacica	ES	Jaime	jaime.neto@shopee.com	27998234224
HUB	Espirito Santo	Guilherme Persio	guilherme.persio@shopee.com	HUB-LES-10		RODOVIA DARLY SANTOS, 2455, POLO EMPRESARIAL NOVO MÉXICO, VILA VELHA, ES, 29104-360	Vila Velha	ES	Phelipe	phelipe.silva@shopee.com	21998400624
HUB	Espirito Santo	Guilherme Persio	guilherme.persio@shopee.com	HUB-LBA-33			Barreiras	BA	Eduardo	eduardo.lordelo@shopee.com	
HUB	Minas Gerais	Caio	Caio.agusto@shopee.com	HUB-LMG-05		AVENIDA WILSON TAVARES RIBEIRO, 1400, GALPÃO E, MÓDULOS 3 E 4, EDIFICAÇÃO 11, LOTE 20, QUADRA 02, CHACARAS REUNIDAS SANTA TEREZINHA, CONTAGEM, MG, 32183-680	Contagem	MG	Everton	everton.silva@shopee.com	31 985820010
HUB	Minas Gerais	Caio	Caio.agusto@shopee.com	HUB-LMG-62		RUA HAECKEL BEN-HUR SALVADOR, 1001, GALPÃO 01, MÓDULOS G, H, I E J, CINCO, CONTAGEM, MG, 32010-120	Contagem	MG	Geovanne	geovanne.neves@shopee.com	11 91523-6619
HUB	Minas Gerais	Caio	Caio.agusto@shopee.com	HUB-LMG-43		RUA CORONEL MÁRIO CORDEIRO, 314, JARDIM SERRA VERDE, TEÓFILO OTONI, MG, 39801-457	Teófilo Otoni	MG	Jhonny	jhonny.lopes@shopee.com	3391225975
HUB	Minas Gerais	Caio	Caio.agusto@shopee.com	HUB-LMG-38		RUA 05 - PDV, 310, 340 GLEBA A 05-E, SILVANA, CARATINGA, MG, 35318-000	Ipatinga	MG	Eder	eder.batalha@shopee.com	31 99430-4215
HUB	Minas Gerais	Caio	Caio.agusto@shopee.com	HUB-LMG-27		RUA SECUNDINO RODRIGUES, 838, CHICO MIRANDA, LAGOA DA PRATA, MG, 35592-060	Lagoa da Prata	MG	Uilian	uilian.silva@shopee.com	37 99929-7261
HUB	Minas Gerais	Caio	Caio.agusto@shopee.com	HUB-LMG-56		AVENIDA INDUSTRIAL, 1777, QUADRA 06 LOTE 9 A 11, DISTRITO INDUSTRIAL, GOVERNADOR VALADARES, MG, 35040-610	Governador Valadares	MG	Carlito	carlito.antonio@shopee.com	11913402117
HUB	Minas Gerais	Caio	Caio.agusto@shopee.com	HUB-LMG-63		Av. Pará, 324 - Industrial, Nova Serrana - MG, 35519-000	Nova Serrana	MG	Israel	israel.bailon@shopee.com	31 99988-7408
HUB	Minas Gerais	Daniele	daniele.constantino@shopee.com	HUB-LMG-48		RUA IRENE SILVA BATISTA NENA, 171, UPG PARAÍSO, UBERABA, MG, 38106-000	Uberaba	MG	Michel	michael.adsilva@shopee.com	34 99134-7898
HUB	Minas Gerais	Daniele	daniele.constantino@shopee.com	HUB-LMG-11		AVENIDA DAS INDUSTRIAS, 173, GALPÃO 1, QUADRA 2, LOTE 5 A, DISTRITO INDUSTRIAL, MONTES CLAROS, MG, 39404-621	Montes Claros	MG	Jonathan	jonathan.oliveira@shopee.com	38 9197-4837
HUB	Minas Gerais	Daniele	daniele.constantino@shopee.com	HUB-LMG-36		RODOVIA MG-050, 8201, KM 127, LEVINDO PAULA PEREIRA, DIVINÓPOLIS, MG, 35502-470	Divinópolis	MG	Raul	raul.vilela@shopee.com	31 99419-3326
HUB	Minas Gerais	Daniele	daniele.constantino@shopee.com	HUB-LMG-44		RODOVIA BR 050, 3555, LOTE 03B2 MODULO 12 E 13, NOVO MUNDO, UBERLÂNDIA, MG, 38408-369	Uberlândia	MG	Davi	davi.machado@shopee.com	34 99139-2975
HUB	Minas Gerais	Daniele	daniele.constantino@shopee.com	HUB-LMG-49		RUA JAIR DE SOUZA FONSECA, 109, GALPAO 9, SANTA FELICIDADE, SETE LAGOAS, MG, 35703-237	Sete Lagoas	MG	Douglas	douglas.castro@shopee.com	31 9536-9444
HUB	Minas Gerais	Daniele	daniele.constantino@shopee.com	HUB-LMG-50		AVENIDA MANOEL AFONSO DE PAIVA, 211, GALPÃO1 MODULO 1 2 3 4 9 10 11 12, BAIRRO DAS INDUSTRIAS I, BELO HORIZONTE, MG, 30610-810	Belo Horizonte	MG	Marcos	marcos.bsilva@shopee.com	11 91347-1534
HUB	Minas Gerais	Daniele	daniele.constantino@shopee.com	HUB-LMG-61		AVENIDA MARCONI ISSA, 550, GALPÃO A, PEROBAS, SÃO JOSÉ DA LAPA, MG, 33350-000	Vespasiano	MG	Tiago	tiago.machado@shopee.com	31 98583-2252
HUB	Minas Gerais	Daniele	daniele.constantino@shopee.com	HUB-LMG-40		ESTRADA ANTIGA BH-PEDRO LEOPOLDO, 1150, GALPÃO 13 E 14, FAZENDA CANAVIAL VELHO, VESPASINO, MG, 33206-220	Vespasiano	MG	Renato	renato.santos1@shopee.com	31 98548-0890
HUB	Minas Gerais	Daniele	daniele.constantino@shopee.com	HUB-LMG-39		AVENIDA JUSCELINO KUBITSCHEK DE OLIVEIRA, 1340, QUADRA 1, LOTE H, RESIDENCIAL GRAMADO, PATOS DE MINAS, MG, 38706-215	Patos de Minas	MG	Gabriel	gabriel.lacerda@shopee.com	34 9985-1056
HUB	Minas Gerais 03	Alan	alan.augusto@shopee.com	HUB-LMG-45		RODOVIA BR-491 VARGINHA-ELOI MENDES, 501, KM 238, MÓDULOS 3 E 4, AEROPORTO, VARGINHA, MG, 37030-087	Varginha	MG	Ailton	ailton.rodrigues@shopee.com	35 98845-8881
HUB	Minas Gerais 03	Alan	alan.augusto@shopee.com	HUB-LMG-09		AVENIDA DOUTOR JORGE HANNAS, 42, PONTE DA ALDEIA, MANHUAÇU, MG, 36906-440	Manhuaçu	MG	Paula	paula.teixeira@shopee.com	31 97570-1081
HUB	Minas Gerais 03	Alan	alan.augusto@shopee.com	HUB-LMG-59		RODOVIA BR 040, 450, KM 783, GALPÃO 1, MÓDULOS 01/02/03/04, SANTA CRUZ, JUÍZ DE FORA, MG, 36088-410	Juiz de Fora	MG	Willian Lopes	william.lopes1@shopee.com	32 99138-4256
HUB	Minas Gerais 03	Alan	alan.augusto@shopee.com	HUB-LMG-23		AVENIDA DOUTOR MANOEL LOURENÇO DE AZEVEDO, 369, GALPAO B, PEIXOTO FILHO, UBÁ, MG, 36504-262	Ubá	MG	Roberto	roberto.nascimento@shopee.com	32 98405-1733
HUB	Minas Gerais 03	Alan	alan.augusto@shopee.com	HUB-LMG-20		RODOVIA BR-265, 1109, KM 349, GROGOTO, BARBACENA, MG, 36202-630	Barbacena	MG	Wdson Duarte	wdson.araujo@shopee.com	32 92000-7200
HUB	Minas Gerais 03	Alan	alan.augusto@shopee.com	HUB-LMG-19		AVENIDA JOAQUIM LOURENCO DE LIMA, 2150, MÓDULO G3B, BLOCO 3, DISTRITO INDUSTRIAL VARGEM DO JOAO PINTO, EXTREMA, MG, 37644-901	Extrema	MG	Ailton	ailton.rodrigues@shopee.com	35 98845-8881
HUB	Minas Gerais 03	Alan	alan.augusto@shopee.com	HUB-LMG-21		RUA PREFEITO FRANCISCO TEODORO FILHO, SN, BR-356 KM 248 FAZ RIB VERMELHO, VERMELHO, MURIAÉ, MG, 36892-500	Muriaé	MG	Wesley	wesley.santos@shopee.com	32 99985-2397
HUB	Minas Gerais 03	Alan	alan.augusto@shopee.com	HUB-LRJ-02		AV. ANTÔNIO MARIO DE AZEVEDO, 5524 GALPÃO 02, GLEBA 01 - DUAS PEDRAS - NOVA FRIBURGO - RJ - 28630-310	Nova Friburgo	RJ	Emanuel Hansel	emanuel.hansel@shopee.com	24 99945-6826
HUB	Minas Gerais 03	Alan	alan.augusto@shopee.com	HUB-NFU-02		R CORONEL LAUDEMIRO DAS MERCES FERREIRA, 260, GALPAO, LOTEAMENTO SAO JOAO, NOVA FRIBURGO-RJ	Nova Friburgo 2	RJ	Matheus Silveira	matheus.silveira@shopee.com	22 98828-5138
HUB	Minas Gerais 03	Alan	alan.augusto@shopee.com	HUB-LRJ-11		RUA DOUTOR LIPOLD, 51, CARANGOLA, PETRÓPOLIS, RJ, 25715-250	Petrópolis	RJ	Luiz Souza	luiz.souza@shopee.com	24 98859-7304
HUB	Rio de Janeiro 01	Marcelly	marcelly.silva@shopee.com	HUB-LRJ-03		RODOVIA AMARAL PEIXOTO, KM 106 LOTE 293 - SÃO PEDRO DA ALDEIA, RJ, 28949-464	Cabo Frio	RJ	Dario Gonçalves	dario.goncalves@shopee.com	21 98848-2130
HUB	Rio de Janeiro 01	Marcelly	marcelly.silva@shopee.com 	HUB-LRJ-05		AVENIDA PREFEITO ARISTEU FERREIRA DA SILVA, 2255, QUADRA X, LOTE 01 A, LOTE NOVO CAVALEIRO, VALE ENCANTADO, MACAÉ, RJ, 27930-070	Macaé	RJ	Vagner Pereira	vagner.pereira@shopee.com	22 99876-4855
HUB	Rio de Janeiro 01	Marcelly	marcelly.silva@shopee.com 	HUB-LRJ-08		ESTRADA DE SÃO PEDRO, 555, VISTA ALEGRE, SÃO GONÇALO, RJ, 24725-270	São Gonçalo	RJ	Tiago Santos	tiago.paulo@shopee.com	21 99685-6704
HUB	Rio de Janeiro 01	Marcelly	marcelly.silva@shopee.com 	HUB-LRJ-13		RUA DOIS, 190, QUADRA 14, LOTE 28, INOA, MARICÁ, RJ, 24942-295	Maricá	RJ	Felipe Capistrano	felipe.falcao@shopee.com	24 99933-8857
HUB	Rio de Janeiro 01	Marcelly	marcelly.silva@shopee.com 	HUB-LRJ-19		RODOVIA BR 493, SN, GALPAO2 KM 1 CONDOMINIO THOR GRANITOS, MONTE VERDE(MANILHA), ITABORAI, RJ, 24857-500	Itaboraí	RJ	Leonardo Paiva	leonardo.paiva@shopee.com	21 99807-4716
HUB	Rio de Janeiro 01	Marcelly	marcelly.silva@shopee.com 	HUB-LRJ-21		RUA TRES, 308, ESQUINA, BALNEARIO DAS CONCHAS, SÃO PEDRO DA ALDEIA, RJ, 28949-430	São Pedro da Aldeia	RJ	Dario Gonçalves	dario.goncalves@shopee.com	21 98848-2130
HUB	Rio de Janeiro 01	Marcelly	marcelly.silva@shopee.com 	HUB-LRJ-23		AVENIDA VISCONDE DE SANTAREM, 1761, AREA A, TRIBOBO, SÃO GONCALO, RJ, 24750-071	São Gonçalo	RJ	Giselle Fiuza	giselle.fiuza@shopee.com	21 99156-1221
HUB	Rio de Janeiro 01	Marcelly	marcelly.silva@shopee.com 	HUB-LRJ-24		AVENIDA DOUTOR NILO PEÇANHA, 1516, GALPÃO 5, MÓDULOS 04-09, KM 68, PARQUE DOS RODOVIÁRIOS, CAMPOS DOS GOYTACAZES, RJ, 28030-035	Campos dos Goytacazes	RJ	José Aram (provisório)	jose.aram@shopee.com	22 99610-8489
HUB	Rio de Janeiro 01	Marcelly	marcelly.silva@shopee.com 	HUB-LRJ-29		ESTRADA DOS BANDEIRANTES, 3091, ARMAZENS 116 AO 123, BLOCO 02, CARGO CENTER BANDEIRANTES, TAQUARA, RIO DE JANEIRO, RJ, 22775-975	Rio de Janeiro	RJ	João Goulart	joao.goulart@shopee.com	21 99864-6448
HUB	Rio de Janeiro 02	Izabelle	izabelle.silva@shopee.com	HUB-LRJ-01		AVENIDA ARTHUR ANTONIO SENDAS, 999, VENDA VELHA, SÃO JOÃO DE MERITI, RJ, 25585-021	São João de Meriti	RJ	Erick Szepaniuk	erick.szepaniuk@shopee.com	21 99523-4419
HUB	Rio de Janeiro 02	Izabelle	izabelle.silva@shopee.com	HUB-LRJ-04		AVENIDA BRASIL, 43609, LOTE 01, PAL 47470, MODULO BO4 B I B05, CAMPO GRANDE, RIO DE JANEIRO, RJ, 23089-900	Campo Grande	RJ	Vitória Moura	vitoria.moura@shopee.com	21 97593-0212
HUB	Rio de Janeiro 02	Izabelle	izabelle.silva@shopee.com	HUB-LRJ-07		RUA CONDE DE LEOPOLDINA, 670, VASCO DA GAMA, RIO DE JANEIRO, RJ, 20930-460	São Cristovão	RJ	Monique Portela	monique.portela@shopee.com	11 98812-2848
HUB	Rio de Janeiro 02	Izabelle	izabelle.silva@shopee.com	HUB-LRJ-10		RODOVIA PRESIDENTE DUTRA, 200, KM 268,50, MODULOS 9 10 E 11, LOTE A 2, VILA PRINCIPAL, BARRA MANSA, RJ, 27338-000	Barra Mansa	RJ	Genilson Araujo	genilson.correa@shopee.com	24 99969-5602
HUB	Rio de Janeiro 02	Izabelle	izabelle.silva@shopee.com	HUB-LRJ-14		RODOVIA WASHINGTON LUIZ, 7749, BLOCO 3, ARMAZÉM 8 A 12, JARDIM GRAMACHO, DUQUE DE CAXIAS, RJ, 25065-004	Duque de Caxias	RJ	Didmo Assis	didmo.assis@shopee.com	21 99011-4369
HUB	Rio de Janeiro 02	Izabelle	izabelle.silva@shopee.com	HUB-LRJ-15		RODOVIA SANTOS DUMONT, 4791, ARMAZÉNS 119 121 123, CIDADE PARQUE PAULISTA, DUQUE DE CAXIAS, RJ, 25251-460	Duque de Caxias	RJ	Marília Azevedo	marilia.azevedo@shopee.com	21 97103-9648
HUB	Rio de Janeiro 02	Izabelle	izabelle.silva@shopee.com	HUB-LRJ-18		AVENIDA DO ACESSO OESTE, 31, GALPÃO 02, ARMAZEM 04, PENEDO, ITATIAIA, RJ, 27580-000	Resende	RJ	Aline de Almeida	aline.alves@shopee.com	24 99943-9943
HUB	Rio de Janeiro 02	Izabelle	izabelle.silva@shopee.com	HUB-LRJ-27		RODOVIA PRESIDENTE DUTRA, 25551, KM 188, BLOCO 3, ARMAZÉNS 15 A 20, SARAPÓ, QUEIMADOS, RJ, 26377-180	Queimados	RJ	Juan Machado	juan.machado@shopee.com	21 99319-8042
HUB	Rio de Janeiro 02	Izabelle	izabelle.silva@shopee.com	HUB-LRJ-32		AVENIDA VINTE DE JANEIRO, 0, CPX AEROPORTUARIO RIO GALEAO, GALPÃO 104,105,106, GALEÃO, RIO DE JANEIRO, RJ, 21941-570	Rio de Janeiro	RJ	Alexandre Ribeiro	alexandre.ribeiro@shopee.com	21 98212-8367
HUB	Sul 1	Guilherme Vastay	guilherme.vastay@shopee.com 	HUB-LPR-05		RUA OTACILIO JOSÉ ARRUDA, 7829, PARQUE RESIDENCIAL ÔNIX, UMUARAMA, PR, 87511-076	Umuarama	PR	Arlon Riva	arlon.riva@shopee.com	44 99151-0888
HUB	Sul 1	Guilherme Vastay	guilherme.vastay@shopee.com 	HUB-LPR-06		RUA JOSÉ CARLOS MUFATTO, 1780, BR 277, KM 599, GALPÃO 2, LOTE 89 A 1, CONDOMINIO INTERALLI REALTY, JARDIM RIVIERA, CAMBÉ, PR, 86187-025	Londrina	PR	Alexsander Oliveira	alexsander.oliveira@shopee.com	43 99983-0727
HUB	Sul 1	Guilherme Vastay	guilherme.vastay@shopee.com 	HUB-LPR-10		RODOVIA BR 158, 7071, LOTE 56 A 3 KM 22, AREA URBANIZADA IV, CAMPO MOURÃO, PR, 87313-450	Campo Mourão	PR	Jonatas do Nascimento	jonatas.nascimento@shopee.com	42 99838-8537
HUB	Sul 1	Guilherme Vastay	guilherme.vastay@shopee.com 	HUB-LPR-18		ESTRADA ARACA, 2141, GLEBA PATRIMONIO MARINGA, MARINGÁ, PR, 87070-125	Maringá	PR	Alekcey Pezenti	alekcey.pezenti@shopee.com	44 99742-1074
HUB	Sul 1	Guilherme Vastay	guilherme.vastay@shopee.com 	HUB-LPR-13		AVENIDA DEPUTADO CEZAR SILVESTRI, 863, MORRO ALTO, GUARAPUAVA, PR, 85064-500	Guarapuava	PR	Edson Junior	edson.oliveira@shopee.com	44 98822-5847
HUB	Sul 1	Guilherme Vastay	guilherme.vastay@shopee.com 	HUB-LPR-15		RODOVIA PR 916, 4260, BARRACÃO 1, NUCLEO BOM RETIRO, PATO BRANCO, PR, 85503-378	Pato Branco	PR	Bruna Sokolowski	bruna.sokolowski@shopee.com	46 99130-1031
HUB	Sul 1	Guilherme Vastay	guilherme.vastay@shopee.com 	HUB-LPR-19		RODOVIA BR-277, S/N, KM 599 LOTE 1 C 1 B, ÁREA RURAL, CASCAVEL, PR, 85820-899	Cascavel	PR	Filipe Araujo	filipe.araujo@shopee.com	45 99144-5146
HUB	Sul 1	Guilherme Vastay	guilherme.vastay@shopee.com 	HUB-LPR-20		AVENIDA TIRADENTES, 6640, GALPÃO MODULO 02, 12 e 13, JARDIM ROSICLER, LONDRINA, PR, 86072-000	Londrina	PR	Alexsander Oliveira	alexsander.oliveira@shopee.com	43 99983-0727
HUB	Sul 1	Guilherme Vastay	guilherme.vastay@shopee.com 	HUB-LPR-26		RODOVIA PARTE SUL DOS LRS. 18. 20 E 22 DO 1 E 2 PERÍMETRO, S/N, RECANTO MUNICIPAL, TOLEDO, PR, 85902-600	Toledo	PR	Eduardo Turola	eduardo.turola@shopee.com	41 99917-9832
HUB	Sul 1	Guilherme Vastay	guilherme.vastay@shopee.com 	HUB-LPR-12		RUA LEOPOLDO CALLEGARIO, 310, ALVORADA, FOZ DO IGUAÇU, PR, 85859-691	Foz do Iguaçu	PR	Anderson Cardoso	anderson.cardoso@shopee.com	45 99829-4262
HUB	Sul 1	Guilherme Vastay	guilherme.vastay@shopee.com 	HUB-LSC-05		RUA NOVA ERECHIM, 191, ELDORADO, CHAPECÓ, SC, 89810-210	Chapecó	SC	Roberson Muller	roberson.muller@shopee.com	49 98402-3410
HUB	Sul 2	Milena Maia	milena.maia@shopee.com 	HUB-LRS-13		AVENIDA GUILHERME SCHELL, 130, GALPÃO 2, RIO BRANCO, CANOAS, RS, 92200-148	Canoas	RS	Igor Moraes do Amaral	igor.amaral@shopee.com	(51) 99174-5314
HUB	Sul 2	Milena Maia	milena.maia@shopee.com 	HUB-LRS-15		RODOVIA MÁRIO QUINTANA (ERS118), 12701, RS-118, KM 11, UNIDADE G2, MÓDULOS 1-4, COSTA DO IPIRANGA, GRAVATAÍ, RS, 94100-420	Gravataí	RS	Saulo Mounsquer	saulo.souza@shopee.com	(11) 91343-3720
HUB	Sul 2	Milena Maia	milena.maia@shopee.com 	HUB-LRS-03		RUA CÂNCIO GOMES, 127, FLORESTA, PORTO ALEGRE, RS, 90220-060	Porto Alegre	RS	Vanessa Abdala	vanessa.abdalla@shopee.com	(51) 98201-5652
HUB	Sul 2	Milena Maia	milena.maia@shopee.com 	HUB-LRS-21		RUA BOLZANO, 566, SÃO GOTARDO, FLORES DA CUNHA, RS, 95270-000	Flores da Cunha	RS	Eduardo Mulazzani	eduardo.mulazzani@shopee.com	(51) 99608-2639
HUB	Sul 2	Milena Maia	milena.maia@shopee.com 	HUB-LRS-05		AVENIDA PRESIDENTE JOAO BELCHIOR MARQUES GOULART, 8831, FRAGATA, PELOTAS, RS, 96040-000	Pelotas	RS	Bruno Carvalho	bruno.cmoreira@shopee.com	(53) 99901-1300
HUB	Sul 2	Milena Maia	milena.maia@shopee.com 	HUB-LRS-06		RODOVIA SENADOR TARSO DUTRA - RSC 287, 2495, KM 236, ESQUINA PAVILHAO INDUSTRIAL, DIACONO JOAO LUIZ POZZOBOM, SANTA MARIA, 97105-910	Santa Maria	RS	Diogo Luis Jung	diogo.jung@shopee.com	(55) 99679-1976
HUB	Sul 2	Milena Maia	milena.maia@shopee.com 	HUB-LRS-07		RUA ARTHUR SCHMIDT, 140, QUADRA 2, ANTIGA RUA B, TERRENO 3, BOM PASTOR, LAJEADO, RS, 95905-699	Lajeado	RS	Dionis Fontana	dionis.fontana@shopee.com	(51) 98299-2665
HUB	Sul 2	Milena Maia	milena.maia@shopee.com 	HUB-LRS-10		ESTRADA OSORIO TRAMANDAI, SN, RS 030, KM 88/89, LOTE 21, GLEBA D, EMBOABA, OSÓRIO, RS, 95520-000	Osório	RS	Kleber Pereira	kleber.pereira@shopee.com	(51) 99455-3997
HUB	Sul 2	Milena Maia	milena.maia@shopee.com 	HUB-LRS-20		AVENIDA STANDARD, 100, MÓDULOS 04,05,06, QUADRA 00AFB, SETOR 029, TRÊS PORTOS, ESTEIO, RS, 93270-760	Esteio	RS	Joao Lenon Pereira	joao.lenon@shopee.com	(51) 99143-8177
HUB	Sul 3	Andressa	andressa.nascimento@shopee.com 	HUB-LSC-02		RUA GOVERNADOR PEDRO IVO CAMPOS, 100, DISTRITO INDUSTRIAL, SÃO JOSÉ, SC, 88104-780	São José	SC	Jefferson	jeferson.stacke@shopee.com	48 8875-3324
HUB	Sul 3	Andressa	andressa.nascimento@shopee.com 	HUB-LSC-03		RODOVIA GOVERNADOR JOSÉ LACERDA, 12700, PAVILHÃO 01, VERDINHO, CRICIÚMA, SC, 88814-552	Criciuma	SC	Emerson	emerson.rudolf@shopee.com	48 8416-8967
HUB	Sul 3	Andressa	andressa.nascimento@shopee.com 	HUB-LSC-11		RUA GUEDES DE SOUZA MACHADO, 345, ANTIGA ESTR. RODAGEM, DEPÓSITO 02, VILA BEATRIZ, MARACAJÁ, SC, 88915-000	Maracajá	SC	Talita	talita.erbs@shopee.com	47 8885-5702
HUB	Sul 3	Andressa	andressa.nascimento@shopee.com 	HUB-LSC-06		RODOVIA BR 470 / BLU-NAVEGANTES, 2555, ITOUPAVAZINHA, BLUMENAU, SC, 89056-600	Blumenau	SC	Wagner	wagner.scremin@shopee.com	47 9694-4154
HUB	Sul 3	Andressa	andressa.nascimento@shopee.com 	HUB-LSC-09		RUA BIGUA, 152, LOTE 04, QUADRA 40, PRACA, TIJUCAS, SC, 88200-000	Itapema	SC	Juliano	juliano.poteriko@shopeemobile-external.com	47 9678-0155
HUB	Sul 3	Andressa	andressa.nascimento@shopee.com 	HUB-LSC-10		RUA LOURENÇO WALTRICK VIEIRA, 273, BATES, LAGES, SC, 88524-421	Lages	SC	Eduardo	eduardo.macedo@shopee.com	ST
HUB	Sul 3	Andressa	andressa.nascimento@shopee.com 	HUB-LSC-12		RUA 3 TRANSVERSAL FIRENZE, SN, LOTE 12/13/14, QUADRA 13, ESQ C/ AV NORTE SUL, PACHECOS, PALHOCA, SC, 88134-848	Palhoça	SC	Paulo	paulo.mazine@shopee.com	48 9626-9818
HUB	Sul 3	Andressa	andressa.nascimento@shopee.com 	HUB-LSC-17		RODOVIA NORBERTO BRUNATO, 2355, CONDOMINIO KFG DISTRIBUIDORA, SÃO JOÃO (MARGEM DIREITA), TUBARÃO, SC, 88702-803	Tubarão	SC	Marlon	marlon.eliseu@shopee.com	48 9673-9733
HUB	Sul 3	Andressa	andressa.nascimento@shopee.com 	HUB-LRS-08		RUA EPITACIO PESSOA, 2800, B, ESQUINA COM A ESTRADA GERAL, SÃO LUIZ GONZAGA, PASSO FUNDO, RS, 99054-020	Passo Fundo	RS	Édipo Rodrigues	edipo.rodrigues@shopee.com	(51) 98220-3907
HUB	Sul 3	Andressa	andressa.nascimento@shopee.com 	HUB-LRS-09		AVENIDA BORGES DE MEDEIROS, 192, CENTRO, SANTA ROSA, RS, 98780-001	Santa Rosa	RS	Marcio Piani	marcio.piani@shopee.com	55 9992-8655
HUB	Sul 3	Andressa	andressa.nascimento@shopee.com 	HUB-LRS-22		RODOVIA BR-285, SN, KM 457.650, LAMBARI, IJUÍ, RS, 98700-000	Ijuí	RS	Diogo	diogo.jung@shopee.com	55 9679-1976
HUB	Sul 4	Melissa	melissa.kamei@shopee.com	HUB-LPR-01		RUA ALTONIA, 238, EMILIANO PERNETA, PINHAIS, PR, 83324-350	Pinhais	PR	Pedro Henriques	pedro.henriques@shopee.com	41 9827-4617
HUB	Sul 4	Melissa	melissa.kamei@shopee.com	HUB-LPR-11		AVENIDA DAS PEROLAS, 42, GALPAO01, JARDIM OURO FINO, PARANAGUÁ, PR, 83215-720	Paranaguá	PR	Rodrigo Marciolino	rodrigo.marciolino@shopee.com	11 99405-1892
HUB	Sul 4	Melissa	melissa.kamei@shopee.com	HUB-LPR-16		AVENIDA JUSCELINO KUBITSCHEK DE OLIVEIRA, 4158, CONJUNTO 05, 81260-000	Curitiba	PR	Paulo Weretecki ( Sub regional)	paulo.weretecki@shopee.com	41 9233-9293
HUB	Sul 4	Melissa	melissa.kamei@shopee.com	HUB-LPR-22		RUA JOSE ALVARO GOES (RODOVIA BR-376,36000), 1212, MÓDULO 06, ARMAZENS 26/27/28, CONDOMINIO INTERALLY REALTY, CARA-CARA, PONTA GROSSA, PR, 84043-734	Ponta Grossa	PR	Ivana Souza	ivana.souza@shopee.com	42 9930-7465
HUB	Sul 4	Melissa	melissa.kamei@shopee.com	HUB-LPR-24		RUA FRANCISCO MUÑOZ MADRID, 625, MÓDULOS 207/208/209, ROSEIRA DE SAO SEBASTIAO, SÃO JOSÉ DOS PINHAIS, PR, 83070-152	São José dos Pinhais	PR	Alexandre Silva	alexandre.batista@shopee.com	41 9910-6919
HUB	Sul 4	Melissa	melissa.kamei@shopee.com	HUB-LPR-27		AVENIDA FRANCISCO FERREIRA DA CRUZ, 6030, LOTE UNIDADE 150A, COND EMP. GREEN COMPANY, INDUSTRIAL I, FAZENDA RIO GRANDE, PR, 83820-293	Fazenda Rio Grande	PR	Alexandra Pimentel	alexandra.pimentel@shopee.com	24 99263-8041
HUB	Sul 4	Melissa	melissa.kamei@shopee.com	HUB-LSC-13		RUA DONA FRANCISCA, 8300/8520, BLOCO F, MÓDULOS 5 E 6, ZONA INDUSTRIAL NORTE, JOINVILLE, SC, 89219-900	Joinville	SC	Higor Baccinello	higor.baccinello@shopee.com	41 9803-8477
HUB	Sul 4	Melissa	melissa.kamei@shopee.com	HUB-LSC-15		RODOVIA JORGE LACERDA, 1010, ARMAZEM 01. PAVLH 4 E 5, ESPINHEIROS, ITAJAÍ, SC, 88317-100	Itajaí	SC	Nikolas Lima	nikolas.lima@shopee.com 	67 9346-3622
HUB	Sul 4	Melissa	melissa.kamei@shopee.com	HUB LSC 22			Joinville	SC	Washington Rocha	washington.rocha@shopee.com	47 9139-3267
HUB	São Paulo 1	Keven Teixeira	Keven.teixeira@shopee.com	HUB-OSP-03		RUA CADIRIRI, 468, 666, 748, GALPÃO 01, 02 E 04, MOOCA, SÃO PAULO, 03109-040	São Paulo	SP	Vinicius Carlos Pereira Dos Santos	vinicius.c.santos@shopee.com	11 99785-8303
HUB	São Paulo 1	Keven Teixeira	Keven.teixeira@shopee.com	HUB-OSP-02		AVENIDA GUARULHOS, 57, ANTIGO Nº 525, GALPÃO F, GOPOÚVA, GUARULHOS, SP, 07022-020	Guarulhos	SP	Jose Clebio Benicio Da Silva	jose.benicio@shopee.com	11 98809-7384
HUB	São Paulo 1	Keven Teixeira	Keven.teixeira@shopee.com	HUB-LSP-07		AVENIDA JEAN KHOURY FARAH, S/N, VILA CARMOSINA, SÃO PAULO, SP, 08295-015	São Paulo	SP	Mateus Bezerra De Lima	mateus.delima@shopee.com	11 99282-8290
HUB	São Paulo 1	Keven Teixeira	Keven.teixeira@shopee.com	HUB-LSP-12		RUA DOUTOR RICARDO FERREIRA DOS REIS, 132, JARDIM ADRIANA, GUARULHOS, SP, 07135-370	Guarulhos	SP	Priscila Pessoa Lorena	priscila.lorena@shopee.com	11 98236-2228
HUB	São Paulo 1	Keven Teixeira	Keven.teixeira@shopee.com	HUB-LSP-13		AVENIDA HENRY FORD, 1245, PARQUE DA MOOCA, SÃO PAULO, SP, 03109-000	São Paulo	SP	Diego Oliveira Rondado	diego.rondado@shopee.com	11 97347-4164
HUB	São Paulo 1	Keven Teixeira	Keven.teixeira@shopee.com	HUB-LSP-74		ESTRADA ALBERTO HINOTO, 7655, GALPÃO3 ARMZ 03 04 05 E 06, JARDIM NASCENTE, ITAQUAQUECETUBA, SP, 08586-415	Itaquaquecetuba	SP	Douglas O Bryan De Oliveira	douglas.obryan@shopee.com	11 99358-4548
HUB	São Paulo 1	Keven Teixeira	Keven.teixeira@shopee.com	HUB-LSP-77		RODOVIA PRESIDENTE DUTRA, 17744, KM 214, GALPAO 100, ARMZ B, CIDADE INDUSTRIAL SATELITE DE SÃO PAULO, GUARULHOS, SP, 07210-000	Guarulhos	SP	Thuane Maria Ferreira	thuane.ferreira@shopee.com	11 99341-7897
HUB	São Paulo 1	Keven Teixeira	Keven.teixeira@shopee.com	HUB-LSP-94		RUA CADIRIRI, 468, 666, 748, GALPÃO 01, 02 E 04, MOOCA, SÃO PAULO, 03109-040	Mooca	SP	Alexandre Moreira Benevenuto	alexandre.benevenuto@shopee.com	11 99132-2686
HUB	São Paulo 1	Keven Teixeira	Keven.teixeira@shopee.com	HUB-LSP-119		Av. Julia Gaioli, nº 740, CEP 07251-500, na Cidade de Guarulhos, Estado de São Paulo	Guarulhos	SP	Valéria Carlos	valeria.carlossilva@shopee.com	11 97796-4423
HUB	São Paulo 2	Gil Oliveira	gilvanilson.oliveira@shopee.com	HUB-LSP-10		RUA NATHALIA OREJANA, 671, GALPAO 23, 24, 25, 26 E 27, EDEN, SOROCABA, SP, 18086-601	Sorocaba	SP	Gabriel Visso	gabriel.visso@shopee.com	15 98111-9303
HUB	São Paulo 2	Gil Oliveira	gilvanilson.oliveira@shopee.com	HUB-LSP-36		RUA JOSÉ SEMIÃO RODRIGUES AGOSTINHO, 1370, BR-116, KM 283,5, CLE, MÓDULOS 18, 26 E 27, ÁGUA ESPRAIADA, EMBU DAS ARTES, SP, 06833-370	Embu das Artes	SP	Wala Pereira Da Silva	wala.silva@shopee.com	11 96482-0511
HUB	São Paulo 2	Gil Oliveira	gilvanilson.oliveira@shopee.com	HUB-LSP-41		AVENIDA PORTUGAL, 400, GALPÃO B, MÓDULO B-08, ITAQUI, ITAPEVI, SP, 06696-060	Itapevi	SP	Marcia Aparecida Silveira	marcia.silveira@shopee.com	11 99263-8522
HUB	São Paulo 2	Gil Oliveira	gilvanilson.oliveira@shopee.com	HUB-LSP-51		RUA VICE-PREFEITO NELSON FIUZA, 1400, ARMAZÉNS 3, 4, 5 E 6, JARDIM TERNURA, TATUÍ, SP, 18279-450	Tatuí	SP	Marcos Bovo	marcos.bovo@shopee.com	15 99860-8918
HUB	São Paulo 2	Gil Oliveira	gilvanilson.oliveira@shopee.com	HUB-LSP-53		AVENIDA DOUTOR CYRO ALBUQUERQUE, 4471, GALPÃO1, TABOAOZINHO, ITAPETININGA, SP, 18213-615	Itapetininga	SP	Ricardo R. Celestino	ricardo.rafael@shopee.com	14 99664-7765
HUB	São Paulo 2	Gil Oliveira	gilvanilson.oliveira@shopee.com	HUB-LSP-60		AVENIDA LEONIL CRE BORTOLOSSO, 945, ARMAZÉM 35 E 36, QUITAUNA, OSASCO, SP, 06186-260	Osasco	SP	Luciano Nunes Santos	luciano.santos@shopee.com	11 95480-7727
HUB	São Paulo 2	Gil Oliveira	gilvanilson.oliveira@shopee.com	HUB-LSP-82			Sorocaba	SP	Luis Fernando Dos Santos	luis.fernandosantos@shopee.com	15 99652-0831
HUB	São Paulo 2	Gil Oliveira	gilvanilson.oliveira@shopee.com	HUB-LSP-96		AVENIDA HÉLIO OSSAMU DAIKUARA, 1445, ARMAZEM 12, JARDIM VISTA ALEGRE, EMBU DAS ARTES, SP, 06807-000	Embu das Artes	SP	Dedilson Silva Candido	dedilson.candido@shopee.com	11 98116-1419
HUB	São Paulo 2	Gil Oliveira	gilvanilson.oliveira@shopee.com	HUB-LSP-V36			Embu das Artes	SP	Marcia Aparecida Silveira	marcia.silveira@shopee.com	11 99263-8522
HUB	São Paulo 3	João Henrique	joao.hdsilva@shopee.com	HUB-SAO-71			São Paulo	SP	Luciana Rodrigues Santos	luciana.rodrigues@shopee.com	11 94618-4926
HUB	São Paulo 3	João Henrique	joao.hdsilva@shopee.com	HUB-OSP-01		RUA JOÃO TIBIRICA, 958, ARMZ 24 A 28, LAPA, SÃO PAULO, SP, 05077-000	São Paulo	SP	Alisson Diego Pereira Da Silva	alisson.diego@shopee.com	11 91373-9531
HUB	São Paulo 3	João Henrique	joao.hdsilva@shopee.com	HUB-OSP-04			São Paulo	SP	Francisco Fabiano Coelho Damasceno	francisco.damasceno@shopee.com	11 99785-8303
HUB	São Paulo 3	João Henrique	joao.hdsilva@shopee.com	HUB-LSP-15		RUA BARTOLOMEU PAES, 136, GALPAO 4 e 5 / ANEXO CAMPOS VERGUEIRO 131, VILA ANASTÁCIO, SÃO PAULO, SP, 05092-903	São Paulo	SP	Matheus Araujo De Sousa	matheus.asousa@shopee.com	11 95400-2960
HUB	São Paulo 3	João Henrique	joao.hdsilva@shopee.com	HUB-LSP-18		RUA GALATEA, 1538, 1546/1560/1584, CARANDIRU, SP, 02068-000	São Paulo	SP	Diego Henrique Mendes Da Silva	diego.msilva@shopee.com	11 97676-9448
HUB	São Paulo 3	João Henrique	joao.hdsilva@shopee.com	HUB-LSP-68		RUA MIGUEL MENTEM, 500, ANEXO DONA STA VELOSO 555, VILA GUILHERME, SP, 02050-010	São Paulo	SP	Dayanne Kelle Da Silva Lopes	dayanne.lopes@shopee.com	11 94556-0095
HUB	São Paulo 3	João Henrique	joao.hdsilva@shopee.com	HUB-LSP-81		RUA JUSSARA, 510, GALPAO 1, 2, 3, 4, JARDIM SANTA CECÍLIA, BARUERI, SP, 06465-070	Barueri	SP	Danielly Cristina Dos Santos Silva	danielly.santos@shopee.com	11 97608-0446
HUB	São Paulo 3	João Henrique	joao.hdsilva@shopee.com	HUB-LSP-89		RUA CABO NORBERTO ENRIQUE WEBER, 222, GALPÕES 10, 11, 12, PARQUE NOVO MUNDO, SAO PAULO, SP, 02147-900	São Paulo	SP	Waldir Lopes de Souza	waldir.souza@shopee.com	11 95455-2147
HUB	São Paulo 4	Izabel Sergio	izabel.sergio@shopee.com	HUB-LSP-19		RUA THEREZA MERINO VICENTINI, 1624, KM 87 ROD ANHANGUERA GALPAO2 MOD 8 9 12 13, CHACARAS SAO MARTINHO, CAMPINAS, SP, 13042-838	Campinas	SP	Bruno Lucena Fabio De Lucena	bruno.bueno@shopee.com	19 99287-0818
HUB	São Paulo 4	Izabel Sergio	izabel.sergio@shopee.com	HUB-LSP-20		AVENIDA PREFEITO LUÍS LATORRE, 9450, VILA DAS HORTÊNCIAS, JUNDIAÍ, SP, 13209-430	Jundiaí	SP	Tatiane Barreto dos Santos	daniel.camara@shopee.com	11 99577-7245
HUB	São Paulo 4	Izabel Sergio	izabel.sergio@shopee.com	HUB-LSP-24		RUA ARAUCÁRIA, 595, QUADRA C, LOTE 12 A 14 19 A 22, CENTRO INDUSTRIAL LIMEIRA - CIL, LIMEIRA, SP, 13481-210	Limeira	SP	Emerson do Nascimento	emerson.nascimento@shopee.com	19 99174-2300
HUB	São Paulo 4	Izabel Sergio	izabel.sergio@shopee.com	HUB-LSP-37		RODOVIA ENGENHEIRO JOÃO TOSELLO, 6310, GALPÃO 2, CONDOMINIO INDUSTRIAL W-PARK, SOBRADINHO, MOGI MIRIM, SP, 13814-000	Mogi Mirim	SP	Rafael Novais Forato	rafael.forato@shopee.com	19 99584-2812
HUB	São Paulo 4	Izabel Sergio	izabel.sergio@shopee.com	HUB-LSP-62		ESTRADA MUNICIPAL PIR 196, 0, SANTA HELENA, PIRACICABA, SP, 13400-970	Piracicaba	SP	Emerson do Nascimento	emerson.nascimento@shopee.com	11 976963217
HUB	São Paulo 4	Izabel Sergio	izabel.sergio@shopee.com	HUB-LSP-87		RODOVIA EDGARD MÁXIMO ZAMBOTO, SN, KM 79, GALPÃO 10/11/12, PONTE ALTA, ATIBAIA, SP, 12952-817	Atibaia	SP	Matheus Henrique De Souza	matheus.hsouza@shopee.com	
HUB	São Paulo 4	Izabel Sergio	izabel.sergio@shopee.com	HUB-LSP-88		RODOVIA ADAUTO CAMPO DALL'ORTO, SN, KM 2, GALPAO 1 A 3 E 6 A 8, JARDIM MANCHESTER (NOVA VENEZA), SUMARÉ, SP, 13178-440	Sumaré	SP	Kate De Almeida Silva / Flavia Gehrke	kate.silva@shopee.com	11 94751-0715
HUB	São Paulo 4	Izabel Sergio	izabel.sergio@shopee.com	HUB-LSP-100			Jundiaí	SP	Leonardo Henrique	leonardo.zanello@shopee.com / tatiane.barreto@shopee.com	11 98064-8231
HUB	São Paulo 4	Izabel Sergio	izabel.sergio@shopee.com	HUB-LSP-105		AVENIDA COMENDADOR ALADINO SELMI, 2502, GALPÃO 01-03, 09-11, ANEXO GLEBA 44, PARQUE CIDADE CAMPINAS, CAMPINAS, SP, 13069-036	Campinas	SP	Charles Willian da Cruz da Silva	charles.willian@shopee.com	19 99116-9021
HUB	São Paulo 5	Danyela Pina	danyela.pina@shopee.com	HUB-LSP-06		AVENIDA FRANCISCO ARNALDO GIMENEZ, 47, VILA SANTO ANTÔNIO, GUARUJÁ, SP, 11432-380	Guarujá	SP	Caique Simao Dos Santos	caique.santos@shopee.com	11 99461-4954
HUB	São Paulo 5	Danyela Pina	danyela.pina@shopee.com	HUB-LSP-09		AVENIDA AYRTON SENNA DA SILVA, 613, GALPÃO 611, XIXOVÁ, PRAIA GRANDE, SP, 11726-000	Praia Grande	SP	Kaique Souza	kaique.souza@shopee.com	13 99772-9235
HUB	São Paulo 5	Danyela Pina	danyela.pina@shopee.com	HUB-LSP-16		RUA ARNALDO MAGNICCARO, 521, VILA GEA, SÃO PAULO, SP, 04691-904	São Paulo	SP	Jeisa Ferreira De Farias	jeisa.farias@shopee.com / beatriz.tosin@shopee.com	71 8151-0641
HUB	São Paulo 5	Danyela Pina	danyela.pina@shopee.com	HUB-LSP-39		ESTRADA VICINAL GOVERNADOR MARIO COVAS, 2600, BARRACÃO 01, JARDIM GRAJAU, ITAPEVA, SP, 18404-517	Itapeva	SP	Anderson Diego da Fe	anderson.fe@shopee.com	15 99640-1622
HUB	São Paulo 5	Danyela Pina	danyela.pina@shopee.com	HUB-LSP-40		RUA ARAPONGAL, 20, LOTE 5, ARAPONGAL, REGISTRO, SP, 11900-000	Registro	SP	Alexandre Moreira Benevenuto	alexandre.benevenuto@shopee.com	11 99132-2686
HUB	São Paulo 5	Danyela Pina	danyela.pina@shopee.com	HUB-LSP-63		RUA THERESIA BIRAK NIEDERBICHLER, 200, QUADRA 15/42, MIRIM, PRAIA GRANDE, SP, 11705-105	Praia Grande	SP	Fabiano Vieira Conceicao	fabiano.conceicao@shopee.com	11 99410-5891
HUB	São Paulo 5	Danyela Pina	danyela.pina@shopee.com	HUB-LSP-64		AVENIDA PAPA JOÃO XXIII, 3740, MÓDULO 4, LOTEAMENTO INDUSTRIAL CORAL, MAUÁ, SP, 09370-800	Mauá	SP	Marcos Vinicius	roberto.hsouza@shopee.com	12 99258-8200
HUB	São Paulo 5	Danyela Pina	danyela.pina@shopee.com	HUB-LSP-79		ESTRADA SAMUEL AIZEMBERG, 1707, ALVARENGAS, SÃO BERNARDO DO CAMPO, SP, 09851-550	São Bernardo do Campo	SP	Fernando Neves Moreira	fernando.neves@shopee.com	41 9517-3896
HUB	São Paulo 5	Danyela Pina	danyela.pina@shopee.com	HUB-LSP-93		AVENIDA DOS ESTADOS, 7328, ARMAZEM B26, B27, B28, JARDIM ALZIRA FRANCO, SANTO ANDRÉ, SP, 09290-340	Santo André	SP	Erika Guimarães	erika.guimaraes@shopee.com	11 98336-8404
HUB	São Paulo 6	Juliana Pironelli	juliana.pironelli@shopee.com	HUB-LSP-26		RUA JOÃO BATISTA FERRARI, 225, LTS 01 À 16, QUADRA 31 G1, DISTRITO INDUSTRIAL ANTONIO DELLA TORRE, FRANCA, SP, 14406-118	Franca	SP	Luiz Fernando Del Bianco	luizfernando.delbianco@shopee.com	11 95126-0606
HUB	São Paulo 6	Juliana Pironelli	juliana.pironelli@shopee.com	HUB-LSP-27		RUA GERALDO PASCUTTI, 600, CENTRO INDUSTRIAL PASCUTTI, SÃO JOSÉ DO RIO PRETO, SP, 15077-386	São José do Rio Preto	SP	Davi Vieira Da Silva	davi.vieira@shopee.com	17 99739-9311
HUB	São Paulo 6	Juliana Pironelli	juliana.pironelli@shopee.com	HUB-LSP-28		VIA ANHANGUERA, 0, KM 307,950m, PARQUE RESIDENCIAL CÂNDIDO PORTINARI, RIBEIRÃO PRETO, SP, 14093-500	Ribeirão Preto	SP	Remi Portilho Hordones	remi.hordones@shopee.com	16 99152-1233
HUB	São Paulo 6	Juliana Pironelli	juliana.pironelli@shopee.com	HUB-LSP-43		RUA HELIO BRANDÃO VIDIGAL, 401, ANEXO 415, ZONA DE USO DIVERSIFICADO PEDRO PINTO PAIXÃO, BARRETOS, SP, 14781-138	Barretos	SP	Vinicius Benassi	vinicius.benassi@shopee.com	17 99616-2223
HUB	São Paulo 6	Juliana Pironelli	juliana.pironelli@shopee.com	HUB-LSP-47		RUA LUIZ FERNANDO MARCHI, 400, LOTE 3,4,5,6,7 QUADRA 5, LOTEAMENTO INDUSTRIAL ANHANGUERA, LEME, SP, 13612-454	Leme	SP	Diego Carlos Delphini	diego.delphini@shopee.com	11976963217
HUB	São Paulo 6	Juliana Pironelli	juliana.pironelli@shopee.com	HUB-LSP-55		RUA MIRYAN STRAMBI, 174, QUADRA0004, LOTE P/07 E P/08 SETOR 412, RECREIO ANHANGUERA, RIBEIRÃO PRETO, SP, 14097-052	Ribeirão Preto	SP	Kaline Fernanda Oliveira De Souza	kaline.souza@shopee.com	11 94994-8441
HUB	São Paulo 6	Juliana Pironelli	juliana.pironelli@shopee.com	HUB-LSP-72		AVENIDA SÃO CAETANO, 416, LOTE 27, 38, 39, QUADRA B, FUNDOS ALBERTO BENASSI 4390, LOT. IND. COM. SÃO CAETANO, ARARAQUARA, SP, 14804-318	Araraquara	SP	Daniel Franco Inocente	daniel.inocente@shopee.com	16 997886558
HUB	São Paulo 6	Juliana Pironelli	juliana.pironelli@shopee.com	HUB-LSP-84			São Carlos	SP	Sonival Pereira	sonival.pereira@shopee.com	11 97413-0428
HUB	São Paulo 6	Juliana Pironelli	juliana.pironelli@shopee.com	HUB-LSP-95		RUA GETULINO DE CARVALHO, SN, GALPÃO 1, MÓDULOS 12, 13 E 14, JARDIM IARA, SUB SETOR NORTE 14, RIBEIRÃO PRETO, SP, 14078-810	Ribeirão Preto	SP	Ariel Rodrigo De Souza	ariel.souza@shopee.com	16 99415-7557
HUB	São Paulo 7	Beatriz Camargo	beatriz.campos@shopee.com	FMH-IBT-01		-	Ibitinga	SP	s/SL - Sem operação	-	-
HUB	São Paulo 7	Beatriz Camargo	beatriz.campos@shopee.com	HUB-LSP-46		RODOVIA MARECHAL RONDON SP 254/300, 325, JARDIM NOSSA SENHORA DA PENHA, BOTUCATU, SP, 18606-830	Botucatu	SP	Lucas Miguel Dos Santos	lucas.miguelsantos@shopee.com	14 99611-1859
HUB	São Paulo 7	Beatriz Camargo	beatriz.campos@shopee.com	HUB-LSP-02		RUA BRIGADEIRO FARIA LIMA, 6031, PARQUE INDUSTRIAL DE GRANDES RESIDUOS, ARAÇATUBA, SP, 16080-751	Araçatuba	SP	Ana Paula Souza Carvalho / Raquel Alves Ferreira	ana.paula@shopee.com / raquel.aferreira@shopee.com	18 991803611
HUB	São Paulo 7	Beatriz Camargo	beatriz.campos@shopee.com	HUB-LSP-35		AVENIDA EGISTO FRANCESCHI, 1482, QUADRA H, LOTE 01, LOTEAMENTO INDUSTRIAL QUINTA DA COLINA, JAU, SP, 17206-450	Jaú	SP	Vinícius Fernandez	vinicius.fernandez@shopee.com	11 95203-6133
HUB	São Paulo 7	Beatriz Camargo	beatriz.campos@shopee.com	HUB-LSP-42		RUA HUGO MOSSINI, 260, CENTRO DE DESENVOLVIMENTO DE ASSIS, ASSIS, SP, 19812-110	Assis	SP	Silvio Valeze Moraes	silvio.moraes@shopee.com	1199293-0016
HUB	São Paulo 7	Beatriz Camargo	beatriz.campos@shopee.com	HUB-LSP-66		AVENIDA REPUBLICA, 8066, ANEXO 8034, DISTRITO INDUSTRIAL SANTO BARION, MARILIA, SP, 17512-035	Marília	SP	William De Oliveira Fluminian / Vinicius Roberto Cardoso	william.fluminian@shopee.com / vinicius.roberto@shopee.com	11 98480-138
HUB	São Paulo 7	Beatriz Camargo	beatriz.campos@shopee.com	HUB-LSP-73		RODOVIA ASSIS CHATEAUBRIAND, SN, KM 455 471MTS, VILA MARIA, PRESIDENTE PRUDENTE, SP, 19053-680	Presidente Prudente	SP	Patrick Augusto De Souza	patrick.augusto@shopee.com	18 99726-8096
HUB	São Paulo 7	Beatriz Camargo	beatriz.campos@shopee.com	HUB-LSP-38		AVENIDA MARIANO CORTE, 1850, LOTE 12, QUADRA 1, SIMONSEN, VOTUPORANGA, SP, 15515-001	Votuporanga	SP	Fabio Pinotti	fabio.pinotti@shopee.com	17 98826-2015
HUB	São Paulo 7	Beatriz Camargo	beatriz.campos@shopee.com	HUB-LSP-56		RODOVIA RONDON - SP 300 - KM 345,800 AO KM 349,999, SN, NUCLEO RESIDENCIAL EDISON BASTOS GASPARINI, BAURU, SP, 17022-531	Bauru	SP	Flaviane Novais De Carvalho	flaviane.carvalho@shopee.com	11 98450-1696
HUB	São Paulo 8	Mariana Castilho	Mariana.castilho@shopee.com	HUB-LSP-04		AVENIDA ENGENHEIRO JUAREZ DE SIQUEIRA BRITTO WANDERLEY, 235, ANEXO 255, CONJ. IND. EMP. ELDORADO, QUADRA H, LOTE 11 E 12, ELDORADO, SÃO JOSÉ DOS CAMPOS, SP, 12238-565	São José dos Campos	SP	Marcos Borowiec	marcos.borowiec@shopee.com	11 99410-4695
HUB	São Paulo 8	Mariana Castilho	Mariana.castilho@shopee.com	HUB-LSP-08		AVENIDA BANDEIRANTES, W6666, GALPÃO 1, JARDIM MARIA AUGUSTA, TAUBATÉ, SP, 12070-100	Taubaté	SP	Ozeias Moreira	ozeias.moreira@shopee.com	11 99224-9080
HUB	São Paulo 8	Mariana Castilho	Mariana.castilho@shopee.com	HUB-LSP-33		RODOVIA PREFEITO ARISTEU VIEIRA VILELA, 700, VILA GUARÁ (BAIRRO SÃO BENTO), GUARATINGUETÁ, SP, 12522-091	Guaratingueta	SP	Tiago Henrique Oliveira Rangel	henrique.rangel@shopee.com	12 98242-9667
HUB	São Paulo 8	Mariana Castilho	Mariana.castilho@shopee.com	HUB-LSP-83		AVENIDA INDEPENDENCIA, 3350, LOTE 05 E 06, GALPAO 02, JARDIM INDEPENDENCIA, TAUBATE, SP, 12032-000	Taubaté	SP	Diego Marchete Dos Santos	diego.marchete.hub@shopee.com	12 99667-8609
HUB	São Paulo 8	Mariana Castilho	Mariana.castilho@shopee.com	HUB-LSP-97		RUA BARUEL, 2000, GALPÃO 10, VILA COSTA, SUZANO, SP, 08675-000	Suzano	SP	Edson Batista	edson.batista@shopee.com	11 99365-4363
FULL	Fulfillment	João Paulo Costa	joao.paulocosta@shopee.com	FBS SP9			Franco da Rocha	SP	Aline Ossani	aline.ossani@shopee.com	
FULL	Fulfillment	Lincoln Souza	lincoln.souza@shopee.com	FBS SP20			Franco da Rocha	SP	Aline Ossani	aline.ossani@shopee.com	
FULL	Fulfillment	Cesar Siqueira	cesar.siqueira@shopee.com	FBS SP22/SP21		Av. Condessa Elizabeth de Robiano, 6000 - Jardim America da Penha, São Paulo - SP, 03704-000	Guarulhos	SP	Gustavo Mamede	gustavo.mamede@shopee.com	
FULL	Fulfillment	Cecilia Estrela	cecilia.estrela@shopee.com	FBS GO3			Hidrolândia	GO	Roner Junior	roner.junior@shopee.com	
FULL	Fulfillment	Luiz Guadanini	luiz.guadanini@shopee.com	FBS MG5			Contagem	MG	Roner Junior	roner.junior@shopee.com	
FULL	Fulfillment	TBD	TBD	FBS MG7			Extrema	MG	TBD	TBD	Previsão Nov/27
FULL	Fulfillment	Sarah Ramos	sarah.ramos@shopee.com	FBS PE3		BR 101, SUL KM 87,4 S/N COMPORTAS, JABOATÃO DOS GUARARAPES - PE. CEP: 54335-000	Jabotaão dos Guararapes	PE	Aryane Oliveira	aryane.oliveira@shopee.com	85 8896-4068
FULL	Fulfillment	Edson Santos	edson.ssantos@shopee.com	FBS RS3			Nova Santa Rita	RS	Edvaldo Filho	edvaldo.filho@shopee.com	
SOC	Sul 02	Diego Andrade	diego.andrade@shopee.com.br	SOC-RS1			Gravataí	RS			
SOC	Sul 02	Diego Andrade	diego.andrade@shopee.com.br	SOC-RS2			Gravataí	RS	Sindel Lemos	sindel.lemos@shopee.com	51 8686-7973
SOC	Sul 03	Andressa Paula	andressa.paula@shopee.com	SOC-SC1			Itajaí	SC	Adriana Adur	adriana.adur@shopee.com	21 99712-7052
SOC	Sul 04	João Anjos	joao.anjos@shopee.com	SOC-PR1			Campina Grande do Sul	PR	Ricardo Filho	ricardo.filho@shopee.com	
SOC	Sul 04	João Anjos	joao.anjos@shopee.com	SOC-PR4			Campina Grande do Sul	PR	Ricardo Filho	ricardo.filho@shopee.com	
SOC	Sul 04	Em contratação		SOC-PR5				PR			
SOC	Nordeste 01	Em contratação		SOC-PE1			Cabo de Santo Agostinho	PE			
SOC	Nordeste 01	Sheyle Soares	sheyle.soares@shopee.com	SOC-PE4			Jaboatão dos Guararapes	PE	Felipe Cavalcante	felipe.cavalcanti@shopee.com	
SOC	Nordeste 02	Mariane Marinho	mariane.marinho@shopee.com	SOC-BA2			Simões Filho	BA	Diogo Moreira	diogo.moreira@shopee.com	71 99117-2951
SOC	Nordeste 03	Em contratação	SOC-CE3	SOC-CE3				CE			
SOC	Centro Oeste	Maria Eduarda	maria.sdsilva@shopee.com	SOC-GO2			Goiânia	GO	Tomás Lino	tomas.lino@shopee.com	62 9806-3641
SOC	Sudeste SP	Aldo Meireles	aldo.meireles@shopee.com	SOC-SP2			Santana de Parnaíba	SP	Allan Ribeiro	Allan.ribeiro@shopee.com	34 9139-1100
SOC	Sudeste SP	Tiago Areia	tiago.areia@shopee.com	SOC-SP5			Cravinhos	SP	Wellington Brito	wellington.brito@shopee.com	11 982778671
SOC	Sudeste SP	Gustavo Silva	gustavo.hsilva@shopee.com	SOC-SP6			Guarulhos	SP	Daniel Cavallieri	daniel.cavallieri@shopee.com	11 98913-2138
SOC	Sudeste SP	Angelo Silva	angelo.silva@shopee.com	SOC-SP7			Louveira	SP	Flavio Monteiro	flavio.monteiro@shopee.com	11 94778-5235
SOC	Sudeste SP	Juliano Camargo	juliano.camargo@shopee.com	SOC-SP8			São Bernardo do Campo	SP	Carlos Suffredini	carlos.suffredini@shopee.com	
SOC	Sudeste SP	Daniel Silvano	daniel.silvano@shopee.com	SOC-SP10			Ibitinga	SP	Artur Pina	artur.pina@shopee.com	
SOC	Sudeste SP	Isa Fernandes	isabella.fernandes@shopee.com	SOC-SP18			Piracicaba	SP			
SOC	Sudeste SP	Evelyn Oliveira	evelyn.roliveira@shopee.com	SOC-SP25			Guarulhos	SP	Macelo Cruz	marcelo.cruz@shopee.com	14 99778-8165
SOC	Sudeste SP	Em contratação		SOC-SP31				SP			
SOC	Sudeste SP	Em contratação		SOC-SP33				SP			
SOC	Sudeste SP	Em contratação		SOC-SP34				SP			
SOC	Minas Gerais	Thiago Rodrigues	thiago.fernandes@shopee.com	SOC-MG2			Betim	MG	Thiago Fernandes	vinicius.mcosta@shopee.com	
SOC	Minas Gerais	Camilla Moreira	camilla.moreira@shopee.com	SOC-MG4			Contagem	MG	Thiago Junqueira	thiago.junqueira@shopee.com	(31) 98320-6262
SOC	Rio de Janeiro 01	João Castro	joao.castro@shopee.com	SOC-RJ1			Rio de Janeiro	RJ			
SOC	Rio de Janeiro 02	Pedro Silva	pedro.fdsilva@shopee.com	SOC-RJ2			Duque de Caxias	RJ	Raymenson Kelwen	raymenson.kelwen@shopee.com	55 41 9790-4639
SOC	Rio de Janeiro 02	Rodrigo Sousa	carlos.britto@shopee.com	SOC-RJ4			Rio de Janeiro	RJ	Luiz Curvelo	luiz.curvelo@shopee.com	21 97909-3069
SOC	Espírito Santo	Joliel Marcos	joliel.marcos@shopee.com	SOC-ES2		Avenida Guarapari	Viana	ES	Camila Wosgerau	camila.wosgerau@shopee.com	42 9979-5316
SOC	Espírito Santo	Em contratação		SOC-ES3			SOC-ES3	ES			`;

const lines = raw.trim().split('\n');
console.log('Total lines:', lines.length);

const entries = [];
for (const line of lines) {
  const parts = line.split('\t').map(s => s.trim());
  if (parts.length < 5) continue;
  // Columns:
  // 0: TIPO (HUB, FULL, SOC)
  // 1: REGIONAL
  // 2: ANALISTA FACILITIES
  // 3: E-MAIL ANALISTA
  // 4: CÓDIGO HUB/FULL/SOC
  // 5: Optional extra code / endereco / empty
  // Let's inspect parts
  entries.push({ parts });
}

console.log('Parsed count:', entries.length);
