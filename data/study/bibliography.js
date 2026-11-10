export const EXAM_DATE = "2027-11-01";
const S=(key,label,chapter=label)=>({key,label,chapter,pageStart:null,pageEnd:null});
const E=(key,title,sections,source="Anexo 2-B — Bibliografia sugerida PSCPP")=>({key,title,source,sections});
// Obras integrais cujo sumário foi conferido na edição indicada.
// As páginas são páginas impressas da obra, não índices do arquivo PDF.
// Nas faixas com verified=false os limites ainda precisam de inspeção.
const VERIFIED_WHOLE_BOOKS={
  "met-0": {
    "key": "met-0",
    "name": "YNOUE — Meteorologia: Noções Básicas (2017)",
    "source": "Sumário da edição de 2017 no Google Drive",
    "url": "https://drive.google.com/file/d/1U3X0yOf1zIPLwvr3waCAOkstAY6aq5w4/view",
    "entries": [
      {
        "key": "ch1",
        "label": "Capítulo 1 — Atmosfera terrestre",
        "pageStart": 11,
        "pageEnd": 16,
        "verified": true
      },
      {
        "key": "ch2",
        "label": "Capítulo 2 — Radiação solar e terrestre e o balanço de energia global",
        "pageStart": 17,
        "pageEnd": 24,
        "verified": true
      },
      {
        "key": "ch3",
        "label": "Capítulo 3 — Temperatura",
        "pageStart": 25,
        "pageEnd": 36,
        "verified": true
      },
      {
        "key": "ch4",
        "label": "Capítulo 4 — Umidade do ar",
        "pageStart": 37,
        "pageEnd": 48,
        "verified": true
      },
      {
        "key": "ch5",
        "label": "Capítulo 5 — Estabilidade atmosférica, nuvens e precipitação",
        "pageStart": 49,
        "pageEnd": 58,
        "verified": true
      },
      {
        "key": "ch6",
        "label": "Capítulo 6 — Pressão atmosférica e ventos",
        "pageStart": 59,
        "pageEnd": 74,
        "verified": true
      },
      {
        "key": "ch7",
        "label": "Capítulo 7 — Dados atmosféricos",
        "pageStart": 75,
        "pageEnd": 84,
        "verified": true
      },
      {
        "key": "ch8",
        "label": "Capítulo 8 — Circulação geral da atmosfera",
        "pageStart": 85,
        "pageEnd": 100,
        "verified": true
      },
      {
        "key": "ch9",
        "label": "Capítulo 9 — Sistemas atmosféricos",
        "pageStart": 101,
        "pageEnd": 120,
        "verified": true
      },
      {
        "key": "ch10",
        "label": "Capítulo 10 — Poluição atmosférica",
        "pageStart": 121,
        "pageEnd": 130,
        "verified": true
      },
      {
        "key": "ch11",
        "label": "Capítulo 11 — Classificação climática",
        "pageStart": 131,
        "pageEnd": 144,
        "verified": true
      },
      {
        "key": "ch12",
        "label": "Capítulo 12 — Previsão de tempo e clima",
        "pageStart": 145,
        "pageEnd": 154,
        "verified": true
      },
      {
        "key": "ch13",
        "label": "Capítulo 13 — Mudanças climáticas",
        "pageStart": 155,
        "pageEnd": 172,
        "verified": true
      }
    ]
  },
  "met-1": {
    "key": "met-1",
    "name": "LOBO & SOARES — Meteorologia e Oceanografia, 4ª ed.",
    "source": "Sumário detalhado da 4ª edição no Google Drive (paginação de limites requer conferência visual nos capítulos sem números legíveis)",
    "url": "https://drive.google.com/file/d/1qcF61kvGvSOIUd9M961OtTc8TWeplzKb/view",
    "entries": [
      {
        "key": "ch1",
        "label": "Capítulo 1 — Interação e variação dos principais elementos meteorológicos",
        "pageStart": 19,
        "pageEnd": 68,
        "verified": false
      },
      {
        "key": "ch2",
        "label": "Capítulo 2 — Circulação do ar e ventos",
        "pageStart": 69,
        "pageEnd": 98,
        "verified": false
      },
      {
        "key": "ch3",
        "label": "Capítulo 3 — Desenvolvimento de atividades convectivas e Cb",
        "pageStart": 99,
        "pageEnd": 112,
        "verified": false
      },
      {
        "key": "ch4",
        "label": "Capítulo 4 — Sistemas tropicais",
        "pageStart": 113,
        "pageEnd": 146,
        "verified": true
      },
      {
        "key": "ch5",
        "label": "Capítulo 5 — Sistemas frontais",
        "pageStart": 147,
        "pageEnd": 170,
        "verified": true
      },
      {
        "key": "ch6",
        "label": "Capítulo 6 — Interpretação de informações meteorológicas",
        "pageStart": 171,
        "pageEnd": 240,
        "verified": true
      },
      {
        "key": "ch7",
        "label": "Capítulo 7 — Observações e mensagens meteorológicas",
        "pageStart": 241,
        "pageEnd": 258,
        "verified": true
      },
      {
        "key": "ch8",
        "label": "Capítulo 8 — Ondas, vagas e marulhos",
        "pageStart": 259,
        "pageEnd": 296,
        "verified": true
      },
      {
        "key": "ch9",
        "label": "Capítulo 9 — Marés",
        "pageStart": 297,
        "pageEnd": 314,
        "verified": true
      },
      {
        "key": "ch10",
        "label": "Capítulo 10 — Correntes oceânicas e costeiras",
        "pageStart": 315,
        "pageEnd": 336,
        "verified": false
      },
      {
        "key": "ch11",
        "label": "Capítulo 11 — Estudo dos oceanos — Amazônia Azul",
        "pageStart": 337,
        "pageEnd": 360,
        "verified": false
      },
      {
        "key": "ch12",
        "label": "Capítulo 12 — Navegação em altas latitudes e no gelo",
        "pageStart": 361,
        "pageEnd": 378,
        "verified": false
      },
      {
        "key": "ch13",
        "label": "Capítulo 13 — Climatologia e cartas-piloto",
        "pageStart": 379,
        "pageEnd": 406,
        "verified": false
      },
      {
        "key": "ch14",
        "label": "Capítulo 14 — Navegação meteorológica e oceanográfica",
        "pageStart": 407,
        "pageEnd": 424,
        "verified": false
      }
    ]
  },
  "radioperador": {
    "key": "radioperador",
    "name": "DPC — Apostila de Radioperador Geral, 3ª ed.",
    "source": "Sumário da Apostila de Radioperador Geral (EROG), 3ª ed. no Google Drive",
    "url": "https://drive.google.com/file/d/1njDH2YqB2t219UjL0vE7cDpLBurpwxxA/view",
    "entries": [
      {
        "key": "unit1",
        "label": "Unidade 1 — Princípios das radiocomunicações marítimas",
        "pageStart": 9,
        "pageEnd": 58,
        "verified": true
      },
      {
        "key": "unit2",
        "label": "Unidade 2 — Socorro e salvamento",
        "pageStart": 59,
        "pageEnd": 72,
        "verified": true
      },
      {
        "key": "unit3",
        "label": "Unidade 3 — GMDSS",
        "pageStart": 73,
        "pageEnd": 136,
        "verified": true
      },
      {
        "key": "annexes",
        "label": "Anexos 1 a 29 — tabelas, procedimentos e operação GMDSS",
        "pageStart": 138,
        "pageEnd": 189,
        "verified": true
      }
    ]
  },
  "normam701": {
    "key": "normam701",
    "name": "NORMAM-701/DHN — Meteorologia Marítima",
    "source": "Sumário NORMAM-701/DHN do Google Drive",
    "url": "https://drive.google.com/file/d/1-wD_9bz6kajb7gpeNKrjHszoIUw_E3of/view",
    "entries": [
      {
        "key": "ch1",
        "label": "Capítulo 1 — Pressupostos básicos",
        "verified": false
      },
      {
        "key": "ch2",
        "label": "Capítulo 2 — Serviço Meteorológico Marinho (SMM)",
        "verified": false
      },
      {
        "key": "ch3",
        "label": "Capítulo 3 — Navios observadores voluntários",
        "verified": false
      },
      {
        "key": "annexA",
        "label": "Anexo A — METAREA V",
        "verified": false
      },
      {
        "key": "annexB",
        "label": "Anexo B — Escala Beaufort",
        "verified": false
      },
      {
        "key": "annexC",
        "label": "Anexo C — Escala Douglas",
        "verified": false
      },
      {
        "key": "annexD",
        "label": "Anexo D — Procedimentos para avisos especiais (incluindo apêndice)",
        "verified": false
      },
      {
        "key": "annexE",
        "label": "Anexo E — Metadados dos navios observadores voluntários",
        "verified": false
      }
    ]
  },
  "normam501": {
    "key": "normam501",
    "name": "NORMAM-501/DHN — Levantamentos Hidrográficos",
    "source": "Sumário NORMAM-501/DHN do Google Drive",
    "url": "https://drive.google.com/file/d/1jfSwkGMv8QuDrrnVqr1hTV85VIqs8UFY/view",
    "entries": [
      {
        "key": "ch1",
        "label": "Capítulo 1 — Pressupostos básicos",
        "verified": false
      },
      {
        "key": "ch2",
        "label": "Capítulo 2 — Levantamentos hidrográficos por entidades executantes",
        "verified": false
      },
      {
        "key": "ch3",
        "label": "Capítulo 3 — Disposições finais",
        "verified": false
      },
      {
        "key": "annexA",
        "label": "Anexo A — material complementar e modelos da norma",
        "verified": false
      },
      {
        "key": "annexB",
        "label": "Anexo B — material complementar e modelos da norma",
        "verified": false
      },
      {
        "key": "annexC",
        "label": "Anexo C — material complementar e modelos da norma",
        "verified": false
      },
      {
        "key": "annexD",
        "label": "Anexo D — material complementar e modelos da norma",
        "verified": false
      },
      {
        "key": "annexE",
        "label": "Anexo E — material complementar e modelos da norma",
        "verified": false
      },
      {
        "key": "annexF",
        "label": "Anexo F — material complementar e modelos da norma",
        "verified": false
      },
      {
        "key": "annexG",
        "label": "Anexo G — material complementar e modelos da norma",
        "verified": false
      },
      {
        "key": "annexH",
        "label": "Anexo H — material complementar e modelos da norma",
        "verified": false
      },
      {
        "key": "annexI",
        "label": "Anexo I — material complementar e modelos da norma",
        "verified": false
      },
      {
        "key": "annexJ",
        "label": "Anexo J — material complementar e modelos da norma",
        "verified": false
      },
      {
        "key": "annexK",
        "label": "Anexo K — material complementar e modelos da norma",
        "verified": false
      },
      {
        "key": "annexL",
        "label": "Anexo L — material complementar e modelos da norma",
        "verified": false
      },
      {
        "key": "annexM",
        "label": "Anexo M — material complementar e modelos da norma",
        "verified": false
      }
    ]
  },
  "normam224": {
    "key": "normam224",
    "name": "NORMAM-224/DPC — Folga Dinâmica Abaixo da Quilha",
    "source": "Sumário NORMAM-224/DPC do Google Drive",
    "url": "https://drive.google.com/file/d/1OltMiSPOWH4oieTQgV3mh-EAmNS6pbmx/view",
    "entries": [
      {
        "key": "ch1",
        "label": "Capítulo 1 — Pressupostos básicos",
        "verified": false
      },
      {
        "key": "ch2",
        "label": "Capítulo 2 — Concepção e requisitos mínimos dos sistemas de folga dinâmica abaixo da quilha",
        "verified": false
      },
      {
        "key": "ch3",
        "label": "Capítulo 3 — Procedimentos para operação dos sistemas",
        "verified": false
      }
    ]
  }
};
// Sem exemplar integral para conferir o sumário: carga provisória baseada em
// 196 páginas da edição CONAPRA 2021. Não afirmar nomes de capítulos.
VERIFIED_WHOLE_BOOKS["met-2"]={
  key:"met-2",name:"SANTOS — Princípios de Hidrodinâmica e Ação das Ondas",
  source:"Bibliografia PSCPP: obra integral; edição CONAPRA 2021 informada com 196 páginas, capítulos ainda não verificados.",
  url:"https://www.escavador.com/sobre/983049/edson-mesquita-dos-santos",
  entries:[{"key":"block01","label":"Bloco de leitura 1/17 — páginas 1–12 (capítulo a conferir)","pageStart":1,"pageEnd":12,"verified":false},{"key":"block02","label":"Bloco de leitura 2/17 — páginas 13–24 (capítulo a conferir)","pageStart":13,"pageEnd":24,"verified":false},{"key":"block03","label":"Bloco de leitura 3/17 — páginas 25–36 (capítulo a conferir)","pageStart":25,"pageEnd":36,"verified":false},{"key":"block04","label":"Bloco de leitura 4/17 — páginas 37–48 (capítulo a conferir)","pageStart":37,"pageEnd":48,"verified":false},{"key":"block05","label":"Bloco de leitura 5/17 — páginas 49–60 (capítulo a conferir)","pageStart":49,"pageEnd":60,"verified":false},{"key":"block06","label":"Bloco de leitura 6/17 — páginas 61–72 (capítulo a conferir)","pageStart":61,"pageEnd":72,"verified":false},{"key":"block07","label":"Bloco de leitura 7/17 — páginas 73–84 (capítulo a conferir)","pageStart":73,"pageEnd":84,"verified":false},{"key":"block08","label":"Bloco de leitura 8/17 — páginas 85–96 (capítulo a conferir)","pageStart":85,"pageEnd":96,"verified":false},{"key":"block09","label":"Bloco de leitura 9/17 — páginas 97–108 (capítulo a conferir)","pageStart":97,"pageEnd":108,"verified":false},{"key":"block10","label":"Bloco de leitura 10/17 — páginas 109–120 (capítulo a conferir)","pageStart":109,"pageEnd":120,"verified":false},{"key":"block11","label":"Bloco de leitura 11/17 — páginas 121–132 (capítulo a conferir)","pageStart":121,"pageEnd":132,"verified":false},{"key":"block12","label":"Bloco de leitura 12/17 — páginas 133–144 (capítulo a conferir)","pageStart":133,"pageEnd":144,"verified":false},{"key":"block13","label":"Bloco de leitura 13/17 — páginas 145–156 (capítulo a conferir)","pageStart":145,"pageEnd":156,"verified":false},{"key":"block14","label":"Bloco de leitura 14/17 — páginas 157–168 (capítulo a conferir)","pageStart":157,"pageEnd":168,"verified":false},{"key":"block15","label":"Bloco de leitura 15/17 — páginas 169–180 (capítulo a conferir)","pageStart":169,"pageEnd":180,"verified":false},{"key":"block16","label":"Bloco de leitura 16/17 — páginas 181–192 (capítulo a conferir)","pageStart":181,"pageEnd":192,"verified":false},{"key":"block17","label":"Bloco de leitura 17/17 — páginas 193–196 (capítulo a conferir)","pageStart":193,"pageEnd":196,"verified":false}]
};
const fullBookSections=(key,fallback)=>{
  const book=VERIFIED_WHOLE_BOOKS[key];
  return book?book.entries.map(item=>({
    ...S(item.key,item.label),
    pageStart:item.pageStart??null,pageEnd:item.pageEnd??null,
    pagesVerified:item.verified===true,
    sectionSource:book.source,documentUrl:book.url
  })):fallback;
};
export const WHOLE_BOOK_CHAPTER_SOURCES=Object.fromEntries(Object.entries(VERIFIED_WHOLE_BOOKS).map(([key,value])=>[key,{source:value.source,documentUrl:value.url,chapterCount:value.entries.length}]));

export const BIBLIOGRAPHY={
manobrabilidade:[
E("crenshaw-naval-shiphandling","CRENSHAW — Naval Shiphandling, 4ª ed.",[S("ch2","Chapter 2 – Forces Affecting the Ship")]),
E("pna-v2","LEWIS — Principles of Naval Architecture, Volume II",[{...S("ch5-s1","Chapter V – Resistance — Section 1: Introduction"),pageStart:11,pageEnd:12},{...S("ch5-s3","Chapter V – Resistance — Section 3: Frictional Resistance"),pageStart:17,pageEnd:24},{...S("ch5-s4","Chapter V – Resistance — Section 4: Wave-Making Resistance"),pageStart:25,pageEnd:36},{...S("ch5-s5","Chapter V – Resistance — Section 5: Other Components of Resistance"),pageStart:37,pageEnd:62},{...S("ch6-s1","Chapter VI – Propulsion — Section 1: Powering of Ships"),pageStart:136,pageEnd:139},{...S("ch6-s2","Chapter VI – Propulsion — Section 2: Theory of Propeller Action"),pageStart:140,pageEnd:151},{...S("ch6-s4","Chapter VI – Propulsion — Section 4: Interaction between Hull and Propeller"),pageStart:154,pageEnd:161},{...S("ch6-s6","Chapter VI – Propulsion — Section 6: Geometry of the Screw Propeller"),pageStart:173,pageEnd:179},{...S("ch6-s7","Chapter VI – Propulsion — Section 7: Cavitation"),pageStart:180,pageEnd:191},{...S("ch6-s10","Chapter VI – Propulsion — Section 10: Other propulsion devices"),pageStart:234,pageEnd:248}]),
E("pna-v3","LEWIS — Principles of Naval Architecture, Volume III",[{...S("ch9-s1","Chapter IX – Controllability — Section 1: Introduction"),pageStart:200,pageEnd:200},{...S("ch9-s3","Chapter IX — Section 3: Motion Stability"),pageStart:204,pageEnd:207},{...S("ch9-s4","Chapter IX — Section 4: Analysis of Course Keeping and Controls-fixed Stability"),pageStart:208,pageEnd:213},{...S("ch9-s5","Chapter IX — Section 5: Stability and Control"),pageStart:214,pageEnd:217},{...S("ch9-s6","Chapter IX — Section 6: Analysis of Turning Ability"),pageStart:218,pageEnd:223},{...S("ch9-s10","Chapter IX — Section 10: Accelerating, Stopping and Backing"),pageStart:260,pageEnd:272},{...S("ch9-s12","Chapter IX — Section 12: Effects of the Environment"),pageStart:277,pageEnd:287},{...S("ch9-s13","Chapter IX — Section 13: Vessel Waterway Interactions"),pageStart:288,pageEnd:299},{...S("ch9-s14","Chapter IX — Section 14: Hydrodynamics of Control Surfaces"),pageStart:300,pageEnd:324}]),
E("larsson-resistance","LARSSON & RAVEN — Ship Resistance and Flow",[1,2,3,4,5,6,7,8].map(n=>S("ch"+n,"Chapter "+n)) ),
E("bertram","BERTRAM — Practical Ship Hydrodynamics, 2ª ed.",[S("ch2","Chapter 2 – Propellers"),S("ch3","Chapter 3 – Resistance and Propulsion"),S("ch6","Chapter 6 – Ship manoeuvering")]),
E("msc1053","IMO MSC/Circ.1053 — Explanatory Notes to Standards for Ship Manoeuvrability",[S("ch1","Chapter 1 – General principles"),S("ch2","Chapter 2 – Guidelines for application of the standards"),S("ch3","Chapter 3 – Prediction guidance")]),
E("msc137","IMO Resolution MSC.137(76) — Standards for Ship Manoeuvrability",[S("annex6","Annex 6 – Standards for Ship Manoeuvrability")]),
E("santos-manobrabilidade","SANTOS — A Manobrabilidade do Navio no Século 21",[1,2,3,4,5,6,7,8,9,10,11].map(n=>S("ch"+n,"Capítulo "+n)) ),
E("santos-hidrodinamica","SANTOS — Princípios de Hidrodinâmica e Ação das Ondas",[S("ch3","Capítulo 3 – O movimento do navio em ondas regulares"),S("ch4","Capítulo 4 – O mar irregular e o mar confuso – o movimento do navio")]),
E("msc1228","IMO MSC.1/Circ.1228 — Revised Guidance in Adverse Weather",[S("s1","1. General"),S("s3","3. Dangerous phenomena"),S("s4","4. Operational guidance")]),
E("a601","IMO Resolution A.601(15) — Provision and Display of Manoeuvring Information",[S("s1","1. Manoeuvring information")])
],
"arte-naval":[
E("fonseca-arte-v1","FONSECA — Arte Naval, Volume 1, 8ª ed.",[
{...S("ch1","Capítulo 1 – Nomenclatura do Navio"),pageStart:21,pageEnd:74},
{...S("ch2","Capítulo 2 – Geometria do Navio"),pageStart:75,pageEnd:128},
{...S("ch3","Capítulo 3 – Classificação dos Navios"),pageStart:129,pageEnd:216},
{...S("ch8","Capítulo 8 – Trabalhos do Marinheiro"),pageStart:535,pageEnd:656},
{...S("ch9","Capítulo 9 – Poleame, Aparelhos de Laborar e Acessórios"),pageStart:657,pageEnd:704},
{...S("ch10","Capítulo 10 – Aparelho de Fundear e Suspender"),pageStart:705,pageEnd:754},
{...S("ch11","Capítulo 11 – Aparelho de Governo, Mastreação e Aparelhos de Carga"),pageStart:755,pageEnd:790},
{...S("ch12","Capítulo 12 – Manobra do Navio"),pageStart:791,pageEnd:936}
]),
E("macelrevey","MacELREVEY — Shiphandling for the Mariner, 4ª ed.",[
S("ch1","Chapter 1 – Arrival"),
S("ch2","Chapter 2 – Shiphandling in a Channel"),
S("ch3","Chapter 3 – Use of Tugs"),
S("ch4","Chapter 4 – Approaching the Berth"),
S("ch5","Chapter 5 – Docking"),
S("ch6","Chapter 6 – Undocking"),
S("ch7","Chapter 7 – Departure"),
S("ch8","Chapter 8 – Anchoring and Shiphandling with Anchors"),
S("ch9","Chapter 9 – Special Maneuvers"),
S("ch10","Chapter 10 – Training"),
S("ch11","Chapter 11 – Master/Pilot Relationship and Bridge Resource Management"),
S("ch12","Chapter 12 – Vessel Operations")
]),
E("solas-v23","IMO SOLAS 1974",[S("v-23-3-3","Regulation V/23.3.3")]),E("msc1495","IMO MSC.1/Circ.1495/Rev.1",[S("integral","Unified interpretation of SOLAS regulation V/23.3.3")]),E("msc1428","IMO MSC.1/Circ.1428",[S("integral","Required pilot transfer arrangements")]),E("a1045","IMO Resolution A.1045(27)",[S("integral","Pilot transfer arrangements")]),E("a1108","IMO Resolution A.1108(29)",[S("integral","Amendments to A.1045(27)")]),
E("nayak-arte","NAYAK — Theory and Practices of Marine Pilotage",[3,4,13,14,15,16,17,18,19].map(n=>S("ch"+n,"Chapter "+n))),
E("hensen-tug","HENSEN — Tug Use in Port, 4ª ed.",[1,2,3,4,5,6,7,9].map(n=>S("ch"+n,"Chapter "+n))),E("hensen-estabilidade","HENSEN & VAN DER LAAN — Estabilidade dos Rebocadores",[S("ch2","Capítulo 2 – Princípios básicos de estabilidade")]),E("clark","CLARK — Mooring and Anchoring Ships, Vol. 1",[S("ch6","Chapter 6 – Anchor and cable")]),E("fragoso","FRAGOSO & CAJATY — Rebocadores Portuários",[S("ch1","Capítulo 1 — Classificação dos Rebocadores"),S("ch2","Capítulo 2 — Métodos de Utilização"),S("ch3","Capítulo 3 — Potência, Força de Tração Estática e Número de Rebocadores"),S("ch4","Capítulo 4 — Segurança do Rebocador"),S("ch5","Capítulo 5 — Navios com Recursos Especiais"),S("ch6","Capítulo 6 — Formação e Atualização de Práticos e Mestres"),S("anexo1","Anexo 1 — Disponibilidade de Rebocadores por ZP"),S("anexo2","Anexo 2 — Serviço de Rebocadores"),S("anexo3","Anexo 3 — ORITEC 008/01 e 009/01"),S("anexo4","Anexo 4 — OCIMF — Recomendações para equipamentos de rebocadores"),S("anexo5","Anexo 5 — Det Norske Veritas — Escort Vessels")]),E("pianc-dimensions","PIANC — Ship Dimensions and Data for Design of Marine Infrastructure",[S("ch1","Chapter 1 – Introduction"),S("ch2","Chapter 2 – Vessel characteristics")])
],
"navegacao-aguas-restritas":[
E("swift-btm","SWIFT & BAILEY — Bridge Team Management, 2ª ed.",[1,2,3,4,5,6,7].map(n=>S("ch"+n,"Chapter "+n))),
E("miguens-v1","MIGUENS — Navegação: a Ciência e a Arte, Volume I",[1,2,3,4,5,6,7,8,10,11,12,13,14].map(n=>S("ch"+n,"Capítulo "+n))),
E("miguens-v3-nav","MIGUENS — Navegação: a Ciência e a Arte, Volume III",[37,38,40,42].map(n=>S("ch"+n,"Capítulo "+n))),
E("ics-bpg","ICS — Bridge Procedures Guide, 6ª ed.",[2,3,5,6].map(n=>S("ch"+n,"Chapter "+n))),E("solas-2024","IMO SOLAS — Consolidated Edition 2024",[S("ch-v","Chapter V – Safety of Navigation")]),E("bento","BENTO — Navegação Integrada, 4ª ed.",[1,2,3,4].map(n=>S("ch"+n,"Capítulo "+n))),E("nayak-nav","NAYAK — Theory and Practices of Marine Pilotage",[5,6,13].map(n=>S("ch"+n,"Chapter "+n))),E("normam202","NORMAM-202/DPC",[S("ch11","Capítulo 11 – Regras Especiais para Evitar Abalroamento")]),
E("nav-normam601","NORMAM-601/DHN — Auxílios à Navegação",[S("ch2","Capítulo 2 — Definições, sinais, luzes, alcances e eficácia — arts. 2.1–2.49"),S("ch3-iala","Capítulo 3 — Sistema IALA Região B e sinalização complementar — arts. 3.1–3.19"),S("ch3-special","Capítulo 3 — Balizamentos especiais e estruturas offshore — arts. 3.20–3.55")],"NORMAM-601/DHN — sumário verificado na publicação do Drive"),
E("nav-normam602","NORMAM-602/DHN — Serviço de Tráfego de Embarcações (VTS)",[S("ch1","Capítulo 1 — O Serviço de Tráfego de Embarcações — arts. 1.1–1.5"),S("ch2","Capítulo 2 — Implantação de um VTS — arts. 2.1–2.5"),S("ch3","Capítulo 3 — Serviço e operação de um VTS — arts. 3.1–3.6"),S("ch4","Capítulo 4 — Outros serviços: VTMIS, LPS e E-Navigation — arts. 4.1–4.4")],"NORMAM-602/DHN — sumário verificado na publicação do Drive"),
...["NORMAM-511/DHN","IMO Resolution MSC.192(79)","IMO Resolution A.1106(29)","IMO Resolution MSC.530(106)","IMO MSC.1/Circ.738/Rev.2","IMO MSC.1/Circ.1580"].map((t,i)=>E("nav-doc-"+i,t,[S("integral","Publicação indicada — sem recorte adicional no Anexo 2-B")])),
E("colreg","IMO COLREG — Consolidated Edition 2018",[...["A","B","C","D","E","F"].map(x=>S("part-"+x,"Part "+x)),S("annex-I","Annex I — Positioning and technical details of lights and shapes"),S("annex-II","Annex II — Additional signals for fishing vessels fishing in close proximity"),S("annex-III","Annex III — Technical details of sound signal appliances"),S("annex-IV","Annex IV — Distress signals")]),E("normam501","NORMAM-501/DHN",fullBookSections("normam501",[S("integral","Sumário da obra ainda não verificado")]))
],
"legislacao-regulamentacao":[
E("normam201","NORMAM-201/DPC",[S("ch7","Capítulo 7 – Borda-livre e Estabilidade Intacta — arts. 7.1–7.3 e 7.10–7.14")]),
E("normam204","NORMAM-204/DPC — Tráfego e Permanência de Embarcações em AJB",[
S("ch1-intro","Capítulo 1 — Entrada, despacho e saída — arts. 1.1–1.4","Capítulo 1 — arts. 1.1–1.4: obrigatoriedade, dispensa, etapas e validade do despacho"),
S("ch1-s1","Capítulo 1, Seção I — Procedimentos para despacho — arts. 1.5–1.12","Capítulo 1 — Seção I: procedimentos para despacho"),
S("ch1-s2","Capítulo 1, Seção II — Casos especiais — arts. 1.13–1.14","Capítulo 1 — Seção II: casos especiais"),
S("ch1-s3","Capítulo 1, Seção III — Tramitação — arts. 1.15–1.16","Capítulo 1 — Seção III: tramitação de informações"),
S("ch1-s4","Capítulo 1, Seção IV — Disposições gerais — art. 1.17","Capítulo 1 — Seção IV: disposições gerais"),
S("ch2-s1","Capítulo 2, Seção I — Tráfego em AJB — arts. 2.1–2.6","Capítulo 2 — Seção I: tráfego em AJB"),
S("ch2-s2","Capítulo 2, Seção II — Informações sobre o tráfego — arts. 2.7–2.18","Capítulo 2 — Seção II: informações sobre o tráfego"),
S("ch2-s3","Capítulo 2, Seção III — Sistemas de controle — arts. 2.19–2.23","Capítulo 2 — Seção III: SISTRAM, LRIT, SIMMAP e monitoramento"),
S("ch3-s1","Capítulo 3, Seção I — Procedimento nos portos — arts. 3.1–3.4","Capítulo 3 — Seção I: procedimento nos portos"),
S("ch3-s2","Capítulo 3, Seção II — Arribada e abrigo — art. 3.5","Capítulo 3 — Seção II: arribada e abrigo"),
S("ch3-s3","Capítulo 3, Seção III — Fiscalização — arts. 3.6–3.7","Capítulo 3 — Seção III: fiscalização por autoridades nacionais"),
S("ch3-s4","Capítulo 3, Seção IV — Situações especiais — art. 3.8","Capítulo 3 — Seção IV: embarcação fora de operação"),
S("ch4","Capítulo 4 — Transbordo de pessoal — arts. 4.1–4.4","Capítulo 4 — Transbordo de pessoal entre embarcações em águas não abrigadas"),
S("ch5-s1","Capítulo 5, Seção I — Bunkering — arts. 5.1–5.5","Capítulo 5 — Seção I: transferência de óleo / bunkering"),
S("ch5-s2","Capítulo 5, Seção II — Ship to Ship (STS) — arts. 5.6–5.11","Capítulo 5 — Seção II: operações STS"),
S("ch5-s3","Capítulo 5, Seção III — Ship to Barge (STB) — arts. 5.12–5.16","Capítulo 5 — Seção III: operações STB"),
S("ch5-s4","Capítulo 5, Seção IV — Transshipment — arts. 5.17–5.18","Capítulo 5 — Seção IV: transbordo de granéis sólidos"),
S("ch6","Capítulo 6 — Homologação de comboios fluviais — arts. 6.1–6.11","Capítulo 6 — Homologação de comboios fluviais")
],"NORMAM-204/DPC 2025 — sumário verificado na publicação"),
E("normam302","NORMAM-302/DPC — IAFN e ISAIM",[
S("ch1-1","Capítulo 1 — IAFN: propósito, aplicação, competência, precedência e prazo — arts. 1.1–1.5"),
S("ch1-2","Capítulo 1 — Acidentes e fatos da navegação; situações especiais — arts. 1.6–1.7"),
S("ch1-3","Capítulo 1 — Provas e depoimento — arts. 1.8–1.9"),
S("ch1-4","Capítulo 1 — Documentos, prazos e competências — arts. 1.10–1.12"),
S("ch2-1","Capítulo 2 — ISAIM: propósito, aplicação, prazos e definições — arts. 2.1–2.5"),
S("ch2-2","Capítulo 2 — Responsáveis, notificações, cooperação e relatórios — arts. 2.6–2.9"),
S("annex","Anexo — Código de Investigação de Acidentes (CIA)")
],"NORMAM-302/DPC — sumário verificado na publicação do Drive"),
E("normam311","NORMAM-311/DPC — Serviço de Praticagem",[
S("ch1","Capítulo 1 — Estrutura do Serviço de Praticagem — arts. 1.1–1.7"),
S("ch2-s1a","Capítulo 2, Seção I — Processo seletivo — arts. 2.1–2.12"),
S("ch2-s1b","Capítulo 2, Seção I — Seleção psicofísica, TSF e etapas finais — arts. 2.13–2.21"),
S("ch2-s2","Capítulo 2, Seção II — Certificação, qualificação e habilitação — arts. 2.22–2.24"),
S("ch2-s3","Capítulo 2, Seção III — Execução e ERU — arts. 2.25–2.27"),
S("ch2-s4","Capítulo 2, Seção IV — Deveres e condições desfavoráveis — arts. 2.28–2.35"),
S("ch2-s5-6","Capítulo 2, Seções V–VI — Afastamento e manutenção da habilitação — arts. 2.36–2.41"),
S("ch2-s7","Capítulo 2, Seção VII — Certificado de Isenção de Praticagem — arts. 2.42–2.44"),
S("ch2-s8-11","Capítulo 2, Seções VIII–XI — Lotação, exames, Praticagem do Brasil e atualização — arts. 2.45–2.51"),
S("ch3","Capítulo 3 — Lancha de Prático, lancha de apoio e Atalaia — arts. 3.1–3.15"),
S("ch4","Capítulo 4 — Zonas de Praticagem — arts. 4.1–4.5"),
S("ch5","Capítulo 5 — Cobrança/reciprocidade — art. 5.1")
],"NORMAM-311/DPC — sumário verificado na publicação do Drive"),
E("normam601-leg","NORMAM-601/DHN — Auxílios à Navegação",[
S("ch1","Capítulo 1 — Pressupostos básicos — arts. 1.1–1.8"),
S("ch2-s1-2","Capítulo 2, Seções I–II — Conceitos principais e tipos de sinais — arts. 2.1–2.16"),
S("ch2-s3-4","Capítulo 2, Seções III–IV — Auxílios radioelétricos e acessórios — arts. 2.17–2.24"),
S("ch2-s5","Capítulo 2, Seção V — Luzes e características — arts. 2.25–2.42"),
S("ch2-s6-7","Capítulo 2, Seções VI–VII — Alcances e índice de eficácia — arts. 2.43–2.49"),
S("ch3-s1","Capítulo 3, Seção I — Sistema IALA Região B — arts. 3.1–3.14"),
S("ch3-s2","Capítulo 3, Seção II — Sinalização náutica complementar — arts. 3.15–3.19"),
S("ch3-s3-7","Capítulo 3, Seções III–VII — Balizamentos especiais e estruturas offshore — arts. 3.20–3.55"),
S("ch4","Capítulo 4 — Estabelecimento, cancelamento e alteração de auxílios à navegação"),
S("ch5","Capítulo 5 — Comunicação de alteração em auxílios à navegação"),
S("ch6","Capítulo 6 — Disposições gerais")
],"NORMAM-601/DHN — sumário verificado na publicação do Drive"),
E("normam112","NORMAM-112/DPC — Cerimonial da Marinha Mercante",[
S("ch1","Capítulo 1 — Propósito e responsabilidades — arts. 1.1–1.2"),
S("ch2","Capítulo 2 — Honras — arts. 2.1–2.5"),
S("ch3","Capítulo 3 — Honras fúnebres — arts. 3.1–3.3"),
S("ch4","Capítulo 4 — Bandeira Nacional — arts. 4.1–4.5"),
S("ch5a","Capítulo 5 — Embandeiramento — arts. 5.1–5.6"),
S("ch5b","Capítulo 5 — Embandeiramento — arts. 5.7–5.11"),
S("ch6","Capítulo 6 — Penalidades — art. 6.1")
],"NORMAM-112/DPC — sumário verificado na publicação do Drive"),
E("normam602-leg","NORMAM-602/DHN — Serviço de Tráfego de Embarcações (VTS)",[
S("ch1","Capítulo 1 — O Serviço de Tráfego de Embarcações — arts. 1.1–1.5"),
S("ch2","Capítulo 2 — Implantação de um VTS — arts. 2.1–2.5"),
S("ch3a","Capítulo 3 — Serviço e operação — arts. 3.1–3.3"),
S("ch3b","Capítulo 3 — Contingência, procedimentos e visitas técnicas — arts. 3.4–3.6"),
S("ch4","Capítulo 4 — VTMIS, LPS e E-Navigation — arts. 4.1–4.4"),
S("annexes","Anexos A–G — implantação, requisitos, pessoal, operação, auditorias e publicações IALA")
],"NORMAM-602/DHN — sumário verificado na publicação do Drive"),
...["Lei nº 2.180/1954 — Tribunal Marítimo","Lei nº 9.537/1997 — LESTA","Lei nº 14.813/2024 — Praticagem","Decreto nº 2.596/1998 — RLESTA","Portaria nº 37/MB/2022","IMO COLREG 1972","Publicações Náuticas da DHN","Serviço SAR no Brasil"].map((t,i)=>E("leg-doc-"+(i+6),t,[S("integral","Conteúdo indicado no Anexo 2-B")])),
E("lei12815","Lei nº 12.815/2013",[S("ch1","Capítulo I – Definições e objetivos"),S("ch4","Capítulo IV – Administração do Porto Organizado"),S("ch8","Capítulo VIII – Programa nacional de dragagem")]),E("lc97","Lei Complementar nº 97/1999",[S("art17","Capítulo VI – Art. 17")]),
...["IMO Resolution A.960(23)","MD35-G-01 — Glossário das Forças Armadas, 5ª ed.","Política Nacional de Defesa — 2025","Decreto nº 12.481/2025 — Política Marítima Nacional","Decreto nº 2.256/1997","Lei nº 7.642/1987 — PEM","Lei nº 7.652/1988 — Registro da Propriedade Marítima","Lei nº 9.432/1997 — Transporte Aquaviário"].map((t,i)=>E("leg-extra-"+i,t,[S("integral","Conteúdo indicado no Anexo 2-B")]))
],
"meteorologia-oceanografia":[E("miguens-met","MIGUENS — Navegação: a Ciência e a Arte, Volume III",[S("ch45","Capítulo 45 – Noções de Meteorologia para Navegantes")]),...["YNOUE et al. — Meteorologia: Noções Básicas","LOBO & SOARES — Meteorologia e Oceanografia, 4ª ed.","SANTOS — Princípios de Hidrodinâmica e Ação das Ondas"].map((t,i)=>E("met-"+i,t,fullBookSections("met-"+i,[S("integral","Sumário da obra ainda não verificado")]))),E("pianc-hydromet","PIANC Report 117 — Use of Hydro/Meteo Information",[2,3,4,5,6].map(n=>S("ch"+n,"Chapter "+n))),E("normam701","NORMAM-701/DHN",fullBookSections("normam701",[S("integral","Sumário da obra ainda não verificado")]))],
comunicacoes:[E("smcp","IMO Standard Marine Communication Phrases — A.918(22)",["Introduction","General","Glossary"].map((x,i)=>S("s"+i,x))),E("radioperador","DPC — Manual do Curso Especial de Radioperador Geral",fullBookSections("radioperador",[S("integral","Sumário da obra ainda não verificado")])),E("ics","IMO — International Code of Signals, 2005",[S("chapters","Capítulos I a V, VII, VIII, X, XI e XII"),S("general","Seção Geral — Distress; Casualties; Aids to navigation; Manoeuvres; Pilot"),S("medical","Seção Médica — Request for Medical Assistance, Chapter I"),S("appendices","Apêndices 1, 2 e 4")])],
"conhecimentos-gerais":[E("fal6","IMO FAL.6/Circ.14/Rev.2 — Ship/Port Interface",[S("integral","Publicação indicada")]),E("conapra-port","CONAPRA — Planejamento Portuário: Recomendações para Acessos Náuticos",[S("ch2","Capítulo 2 – Vias de Acesso a Instalações Portuárias"),S("ch8","Capítulo 8 – Análise de Risco e Planejamento Portuário")]),E("pianc-channels","PIANC — Harbour Approach Channels: Design Guidelines",[1,2,3].map(n=>S("ch"+n,"Chapter "+n))),E("normam224","NORMAM-224/DPC — Folga Dinâmica Abaixo da Quilha",fullBookSections("normam224",[S("integral","Sumário da obra ainda não verificado")])),E("fatigue","IMO MSC.1/Circ.1598 — Guidelines on Fatigue",[S("integral","Publicação indicada")]),E("livingstone","LIVINGSTONE — Shiphandling the Beautiful Game, Vol. 1",[1,3,11,12].map(n=>S("ch"+n,"Chapter "+n))),E("udhr","ONU — Declaração Universal dos Direitos Humanos",[S("integral","Publicação indicada")]),E("marpol","Decreto nº 2.508/1998 — MARPOL 73/78",[S("integral","Publicação indicada")]),E("stopford","STOPFORD — Economia Marítima, 3ª ed.",[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].map(n=>S("ch"+n,"Capítulo "+n))),E("pimenta","PIMENTA — Direito Processual Marítimo, 3ª ed.",[1,2,3,4,5,7,8,9,10,11].map(n=>S("ch"+n,"Capítulo "+n)))]
};
export const OFFICIAL_BIBLIOGRAPHY_URL="https://www.marinha.mil.br/dpc/revisao-dos-anexos-2-e-2-b-da-normam-311dpc";
export function bibliographyUnits(){return Object.entries(BIBLIOGRAPHY).flatMap(([subjectSlug,entries])=>entries.flatMap((entry,publicationIndex)=>entry.sections.map((section,sectionIndex)=>({subject_slug:subjectSlug,bibliography_key:entry.key,publication:entry.title,source:entry.source,section_key:section.key,section:section.label,chapter:section.chapter||section.label,page_start:Number.isInteger(section.pageStart)?section.pageStart:null,page_end:Number.isInteger(section.pageEnd)?section.pageEnd:null,pages_verified:section.pagesVerified===true,page_reference:section.sectionSource||null,document_url:section.documentUrl||null,required:section.required!==false,order:publicationIndex*100+sectionIndex}))).filter(x=>x.required));}
