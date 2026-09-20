import fs from 'node:fs';
import path from 'node:path';
import {appendToFloor, assertUniqueIds} from './lib/question-expansion.mjs';

const root = process.cwd();
const P = (a,b) => [a,b];

function load(name){
  const file=path.join(root,'data','questions',name+'.json');
  return {file,bank:JSON.parse(fs.readFileSync(file,'utf8'))};
}
function save(file,bank){fs.writeFileSync(file,JSON.stringify(bank,null,2)+'\n');}
function runJobs({name,subjectId,subjectSlug,prefix,jobs}){
  const {file,bank}=load(name); const report=[];
  for(const j of jobs){
    const r=appendToFloor({bank,subjectId,subjectSlug,prefix,bibliographyId:j.bibliographyId,sectionKey:j.sectionKey,pairs:j.pairs,source:j.source,module:j.module,floor:25});
    report.push({key:`${j.bibliographyId}::${j.sectionKey}`,before:r.before,after:r.after,added:r.added.length});
  }
  assertUniqueIds(bank); save(file,bank);
  fs.writeFileSync(path.join(root,'reports',`${name}-expansion.json`),JSON.stringify({generated_at:new Date().toISOString(),subject_slug:subjectSlug,rows:report},null,2)+'\n');
  console.log(name,JSON.stringify(report));
}

const rlesPairs=[
P('Marítimos','Aquaviários que operam embarcações classificadas para navegação em mar aberto, apoio marítimo, apoio portuário e navegação interior em áreas marítimas consideradas abrigadas.'),
P('Fluviários','Aquaviários que operam embarcações classificadas para navegação interior em lagos, rios e apoio portuário fluvial.'),
P('Pescadores','Aquaviários que exercem atividades a bordo de embarcações de pesca.'),
P('Mergulhadores','Tripulantes ou profissionais não-tripulantes habilitados pela Autoridade Marítima para atribuições ligadas a operações subaquáticas e serviços eventuais a bordo.'),
P('Práticos','Aquaviários não-tripulantes que prestam serviços de praticagem embarcados.'),
P('Agentes de Manobra e Docagem','Aquaviários não-tripulantes que manobram navios em fainas de diques, estaleiros e carreiras.'),
P('Amadores','Pessoas enquadradas no grupo próprio de amadores, com categorias previstas no regulamento, distintas dos grupos profissionais de aquaviários.'),
P('Navegação de mar aberto','Navegação realizada em águas marítimas consideradas desabrigadas.'),
P('Longo curso','Modalidade de navegação de mar aberto realizada entre portos brasileiros e estrangeiros.'),
P('Cabotagem','Modalidade realizada entre portos ou pontos do território brasileiro utilizando a via marítima ou esta e vias navegáveis interiores.'),
P('Apoio marítimo','Navegação para apoio logístico a embarcações e instalações que atuem em pesquisa e lavra de minerais e hidrocarbonetos em águas nacionais e na ZEE.'),
P('Navegação interior','Navegação realizada em hidrovias interiores, como rios, lagos, canais, lagoas, baías, angras, enseadas e áreas marítimas consideradas abrigadas.'),
P('Apoio portuário','Navegação realizada exclusivamente em portos e terminais aquaviários para atendimento de embarcações e instalações portuárias.')
];

const sarPairs=[
P('SALVAMAR','Denominação pela qual é conhecido o Serviço de Busca e Salvamento da Marinha do Brasil.'),
P('Busca e salvamento marítimo','Atos e atividades destinados a prestar auxílio à vida humana em perigo no mar, nos portos e nas vias navegáveis interiores.'),
P('SALVAMAR BRASIL / MRCC BRAZIL','Órgão responsável pela supervisão das atividades do Serviço de Busca e Salvamento Marítimo brasileiro.'),
P('SRR marítima do Brasil','Região de Busca e Salvamento sob responsabilidade brasileira que abrange a costa e se estende no Atlântico até o limite oriental definido para a área SAR.'),
P('Centros regionais MRCC/RCC','Centros que coordenam incidentes SAR nas sub-regiões atribuídas aos Distritos Navais.'),
P('MRSC/RSC','Subcentro de coordenação SAR que pode ser ativado mais próximo da área de operações para apoiar a coordenação de uma missão.'),
P('SRU','Unidade ou recurso de busca e salvamento empregado operacionalmente em resposta a um incidente SAR.'),
P('SISTRAM','Sistema que auxilia a rápida localização de embarcações próximas capazes de prestar auxílio em caso de incidente SAR.'),
P('GMDSS no SAR','Sistema global de socorro e segurança marítima que integra meios de alerta e disseminação relevantes às operações SAR.'),
P('Telefone 185','Canal telefônico de emergência marítima e fluvial para acionamento do Serviço de Busca e Salvamento no Brasil.')
];

const portoPairs=[
P('Autoridade portuária','Administração do porto organizado, exercida diretamente pela União, por delegatária ou por entidade concessionária.'),
P('Cumprimento normativo','Competência da autoridade portuária de cumprir e fazer cumprir leis, regulamentos e contratos de concessão.'),
P('Melhoramento e aparelhamento','Competência de assegurar ao comércio e à navegação o gozo das vantagens decorrentes do melhoramento e aparelhamento do porto.'),
P('Pré-qualificação de operadores','Competência de pré-qualificar operadores portuários conforme as normas estabelecidas pelo poder concedente.'),
P('Arrecadação tarifária','Competência da autoridade portuária de arrecadar os valores das tarifas relativas às suas atividades.'),
P('Obras portuárias','Competência de fiscalizar ou executar obras de construção, reforma, ampliação, melhoramento e conservação das instalações portuárias.'),
P('Fiscalização da operação portuária','Competência de zelar para que as operações ocorram com regularidade, eficiência, segurança e respeito ao meio ambiente.'),
P('Remoção de embarcações ou cascos','Medida que pode ser promovida quando embarcações ou cascos prejudiquem o acesso ao porto.'),
P('Entrada, saída e fundeio','Atos que a autoridade portuária pode autorizar na área do porto, ouvidas as demais autoridades portuárias competentes.'),
P('Suspensão de operações','Competência de suspender operações que prejudiquem o funcionamento do porto, ressalvados os aspectos de interesse da Autoridade Marítima ligados à segurança do tráfego aquaviário.'),
P('Balizamento do canal e bacia','Atividade da administração do porto, sob coordenação da Autoridade Marítima, de estabelecer, manter e operar o balizamento do canal de acesso e da bacia de evolução.'),
P('Calado máximo operacional','Valor que a administração do porto estabelece e divulga, sob coordenação da Autoridade Marítima, em função dos levantamentos batimétricos sob sua responsabilidade.')
];

const dragPairs=[
P('Programa Nacional de Dragagem Portuária e Hidroviária II','Programa instituído para abranger obras e serviços de dragagem, sinalização e balizamento, monitoramento ambiental e gerenciamento de execução.'),
P('Dragagem','Obra ou serviço de engenharia que consiste em limpeza, desobstrução, remoção, derrocamento ou escavação de material do fundo de corpos d’água e canais.'),
P('Draga','Equipamento especializado acoplado a embarcação ou plataforma, fixa, móvel ou flutuante, utilizado em obras ou serviços de dragagem.'),
P('Material dragado','Material retirado ou deslocado do leito de corpos d’água pela dragagem e transferido para local de despejo autorizado.'),
P('Empresa de dragagem','Pessoa jurídica que tenha por objeto a realização de obra ou serviço de dragagem, com ou sem utilização de embarcação.'),
P('Sinalização e balizamento','Sinais náuticos destinados ao auxílio à navegação e à transmissão de informações que possibilitem posicionamento e tráfego seguros.'),
P('Dragagem de manutenção ou ampliação','Obras e serviços que podem alcançar canais de navegação, bacias de evolução e fundeio e berços de atracação.'),
P('Monitoramento ambiental','Atividade expressamente abrangida pelo Programa Nacional de Dragagem Portuária e Hidroviária II.'),
P('Dragagem por resultado','Contratação voltada a aprofundamento, alargamento ou expansão de áreas portuárias e hidrovias e à manutenção das condições de profundidade e segurança do projeto.'),
P('Garantia do contratado','Exigência obrigatória prevista para a contratação de dragagem por resultado.'),
P('Segurança das embarcações de dragagem','As embarcações destinadas à dragagem sujeitam-se às normas específicas de segurança da navegação estabelecidas pela Autoridade Marítima.')
];

const lc97Pairs=[
P('Marinha Mercante e defesa nacional','A Marinha deve orientar e controlar a Marinha Mercante e suas atividades correlatas no que interessa à defesa nacional.'),
P('Segurança da navegação aquaviária','Atribuição subsidiária particular da Marinha de prover a segurança da navegação aquaviária.'),
P('Políticas nacionais relativas ao mar','Atribuição de contribuir para a formulação e condução de políticas nacionais que digam respeito ao mar.'),
P('Fiscalização de leis e regulamentos','Atribuição de implementar e fiscalizar o cumprimento de leis e regulamentos no mar e nas águas interiores.'),
P('Cooperação contra delitos','Atribuição de cooperar com órgãos federais, quando necessário, na repressão a delitos de repercussão nacional ou internacional quanto ao uso do mar, águas interiores e áreas portuárias.'),
P('Coordenação interorgânica','A fiscalização marítima pode ser realizada em coordenação com outros órgãos do Poder Executivo federal ou estadual quando competências específicas assim exigirem.'),
P('Âmbito aquaviário da fiscalização','O art. 17 alcança o mar e as águas interiores no exercício da implementação e fiscalização de leis e regulamentos.'),
P('Apoio na repressão a delitos','A cooperação prevista pode ocorrer por apoio logístico, de inteligência, de comunicações e de instrução.')
];

const rebPairs=[
P('Registro Especial Brasileiro – REB','Registro especial instituído para embarcações abrangidas pela legislação de transporte aquaviário e efetuado no Tribunal Marítimo.'),
P('Complementaridade do REB','O REB não suprime o registro da propriedade marítima; é complementar a ele.'),
P('Certificado do REB','Documento emitido pelo Tribunal Marítimo para embarcações incluídas no Registro Especial Brasileiro.'),
P('Cadastro específico do REB','Cadastro atualizado mantido pelo Tribunal Marítimo para embarcações pré-registradas e registradas no REB.'),
P('Embarcação brasileira operada por EBN','Categoria que pode ser registrada no REB nos termos da regulamentação vigente.'),
P('Afretamento a casco nu com suspensão de bandeira','Situação de embarcação operada por empresa brasileira de navegação que pode enquadrar-se no REB conforme a redação vigente.'),
P('Pré-registro no REB','Registro provisório relacionado à embarcação em construção em estaleiro brasileiro, no território nacional, para os fins previstos na regulamentação.'),
P('Tribunal Marítimo e procedimentos do REB','O Tribunal Marítimo estabelece, por ato normativo, procedimentos de pré-registro, registro, renovações, averbações, cancelamentos e reativações do REB.')
];

const pemPairs=[
P('Procuradoria Especial da Marinha – PEM','Órgão em que se transformou a Procuradoria junto ao Tribunal Marítimo, conforme a Lei nº 7.642/1987.'),
P('Observância da ordem jurídica marítima','Responsabilidade da PEM perante o Tribunal Marítimo pela fiel observância da Constituição, das leis e dos atos dos poderes públicos referentes às atividades marítimas, fluviais e lacustres.'),
P('Atuação nos processos do Tribunal Marítimo','Competência da PEM de atuar nos processos da competência do Tribunal Marítimo em todas as suas fases.'),
P('Consultas ao Tribunal Marítimo','Competência da PEM de oficiar em todas as consultas feitas ao Tribunal Marítimo.'),
P('Arquivamento de inquéritos','Competência da PEM de requerer perante o Tribunal Marítimo o arquivamento de inquéritos provenientes de órgão competente.'),
P('Solicitação de instauração de inquérito','Competência de oficiar à autoridade competente solicitando inquérito ao tomar conhecimento de acidente ou fato da navegação.'),
P('Registros marítimos','Competência de oficiar em processos de registro de propriedade marítima, de armador, de hipoteca e demais ônus reais sobre embarcação.'),
P('Assistência judiciária gratuita','Competência da PEM de promover assistência judiciária gratuita aos acusados sem recursos e a outros casos previstos na lei.')
];

const normam701Pairs=[
P('NORMAM-701/DHN','Norma da Autoridade Marítima para as atividades de Meteorologia Marítima na área de responsabilidade brasileira.'),
P('METAREA V','Área marítima de responsabilidade do Brasil para a prestação e disseminação de informações meteorológicas marítimas.'),
P('Serviço Meteorológico Marinho – SMM','Conjunto de atividades de aquisição de dados e produção de análises e previsões meteoceanográficas para prover informações de segurança marítima na METAREA V.'),
P('CHM','Organização da Marinha responsável pela operação do Serviço Meteorológico Marinho, sob supervisão da DHN.'),
P('METEOROMARINHA','Boletim meteorológico do SMM emitido duas vezes ao dia e que inclui avisos de mau tempo em vigor.'),
P('Avisos de Mau Tempo','Produtos de segurança marítima disseminados pelo SMM quando as condições previstas exigem alerta aos navegantes.'),
P('Programa de Navios Observadores Voluntários – VOS','Programa que integra navios voluntários à realização e transmissão de observações meteorológicas de superfície.'),
P('SafetyNET II e SafetyCAST','Serviços satelitais usados na disseminação de boletins e avisos no contexto do GMDSS, conforme a atualização de 2026 da NORMAM-701/DHN.')
];

const icsGeneral=[
P('NC','Sinal de perigo que exprime que o navio está em perigo e necessita de assistência imediata.'),
P('AC','Sinal que informa: estou abandonando meu navio.'),
P('AN','Sinal que informa necessidade de médico.'),
P('CD','Sinal que solicita assistência imediata.'),
P('DV','Sinal que informa que a embarcação está à deriva.'),
P('GW','Sinal associado a homem ao mar e à necessidade de efetuar sua recolha.'),
P('RU','Sinal que determina manter-se afastado porque o navio está manobrando com dificuldade.'),
P('SO','Sinal que determina que o outro navio pare imediatamente.'),
P('QX','Sinal que solicita autorização para fundear.'),
P('G – Golf','Bandeira de letra única que, no significado geral, indica que o navio necessita de um prático.'),
P('H – Hotel','Bandeira de letra única que indica que o navio tem prático a bordo.'),
P('V – Victor','Bandeira de letra única que significa “I require assistance”.'),
P('W – Whiskey','Bandeira de letra única que significa “I require medical assistance”.'),
P('Z – Zulu','Bandeira de letra única cujo significado geral inclui “I require a tug”.')
];

const icsAppendices=[
P('Apêndice 1','Parte do Código Internacional de Sinais dedicada aos sinais de perigo (Distress signals).'),
P('Apêndice 2','Parte do Código Internacional de Sinais que apresenta a tabela das bandeiras de sinalização.'),
P('Apêndice 4','Parte do Código Internacional de Sinais dedicada aos procedimentos de radiotelefonia.'),
P('Alfa – A','Bandeira de letra única que indica mergulhador na água e requer que outras embarcações se mantenham bem afastadas e a baixa velocidade.'),
P('Bravo – B','Bandeira de letra única associada a carregar, descarregar ou transportar carga perigosa.'),
P('Delta – D','Bandeira de letra única que significa manter-se afastado porque o navio está manobrando com dificuldade.'),
P('Oscar – O','Bandeira de letra única que significa homem ao mar.'),
P('Uniform – U','Bandeira de letra única que significa que o destinatário está se dirigindo para um perigo.'),
P('Xray – X','Bandeira de letra única que manda parar as intenções/manobras e observar os sinais do emissor.'),
P('Yankee – Y','Bandeira de letra única que significa que o navio está garrando/arrastando a âncora.'),
P('November + Charlie','Combinação internacional N+C utilizada como sinal de perigo.'),
P('Radiotelefonia no CIS','Procedimento que usa linguagem e pronúncia padronizadas para reduzir ambiguidades na transmissão de sinais por voz.')
];

runJobs({name:'legislacao-regulamentacao',subjectId:'IV',subjectSlug:'legislacao-regulamentacao',prefix:'LEG',jobs:[
 {bibliographyId:'leg-doc-9',sectionKey:'integral',pairs:rlesPairs,source:{author:'Brasil',title:'Decreto nº 2.596/1998 — RLESTA',edition:'texto compilado',locator:'Anexo, arts. 1º a 5º'},module:'RLESTA — pessoal, navegação e competências'},
 {bibliographyId:'leg-doc-13',sectionKey:'integral',pairs:sarPairs,source:{author:'Marinha do Brasil',title:'Serviço de Busca e Salvamento Marítimo — SALVAMAR',edition:'informações institucionais vigentes',locator:'Estrutura SAR e informações gerais'},module:'Serviço SAR no Brasil'},
 {bibliographyId:'lei12815',sectionKey:'ch4',pairs:portoPairs,source:{author:'Brasil',title:'Lei nº 12.815/2013',edition:'texto compilado',locator:'Capítulo IV, arts. 17 a 19'},module:'Lei dos Portos — Administração do Porto Organizado'},
 {bibliographyId:'lei12815',sectionKey:'ch8',pairs:dragPairs,source:{author:'Brasil',title:'Lei nº 12.815/2013',edition:'texto compilado',locator:'Capítulo VIII, arts. 53 a 55'},module:'Programa Nacional de Dragagem Portuária e Hidroviária II'},
 {bibliographyId:'lc97',sectionKey:'art17',pairs:lc97Pairs,source:{author:'Brasil',title:'Lei Complementar nº 97/1999',edition:'texto compilado',locator:'Art. 17'},module:'Atribuições subsidiárias particulares da Marinha'},
 {bibliographyId:'leg-extra-4',sectionKey:'integral',pairs:rebPairs,source:{author:'Brasil',title:'Decreto nº 2.256/1997 — Registro Especial Brasileiro',edition:'texto compilado com alterações vigentes',locator:'arts. 1º a 11-A'},module:'Registro Especial Brasileiro — REB'},
 {bibliographyId:'leg-extra-5',sectionKey:'integral',pairs:pemPairs,source:{author:'Brasil',title:'Lei nº 7.642/1987 — Procuradoria Especial da Marinha',edition:'texto legal',locator:'arts. 1º a 5º'},module:'Procuradoria Especial da Marinha — PEM'}
]});

runJobs({name:'meteorologia-oceanografia',subjectId:'V',subjectSlug:'meteorologia-oceanografia',prefix:'MET',jobs:[
 {bibliographyId:'normam701',sectionKey:'integral',pairs:normam701Pairs,source:{author:'Marinha do Brasil — DHN',title:'NORMAM-701/DHN — Atividades de Meteorologia Marítima',edition:'Edição 2023, Mod. 1/2026',locator:'Introdução; capítulos 1 a 3; Portaria DHN/DGN/MB nº 31/2026'},module:'NORMAM-701/DHN — Meteorologia Marítima'}
]});

runJobs({name:'comunicacoes',subjectId:'VI',subjectSlug:'comunicacoes',prefix:'COM',jobs:[
 {bibliographyId:'ics',sectionKey:'general',pairs:icsGeneral,source:{author:'International Maritime Organization',title:'International Code of Signals',edition:'2005',locator:'General Section — Distress, Assistance, Manoeuvres and Pilot'},module:'Código Internacional de Sinais — Seção Geral'},
 {bibliographyId:'ics',sectionKey:'appendices',pairs:icsAppendices,source:{author:'International Maritime Organization',title:'International Code of Signals',edition:'2005',locator:'Appendices 1, 2 and 4'},module:'Código Internacional de Sinais — Apêndices'}
]});
