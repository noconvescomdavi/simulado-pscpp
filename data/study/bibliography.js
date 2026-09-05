export const EXAM_DATE = "2027-11-01";
const S=(key,label,chapter=label)=>({key,label,chapter,pageStart:null,pageEnd:null});
const E=(key,title,sections,source="Anexo 2-B — Bibliografia sugerida PSCPP")=>({key,title,source,sections});
export const BIBLIOGRAPHY={
manobrabilidade:[
E("crenshaw-naval-shiphandling","CRENSHAW — Naval Shiphandling, 4ª ed.",[S("ch2","Chapter 2 – Forces Affecting the Ship")]),
E("pna-v2","LEWIS — Principles of Naval Architecture, Volume II",[{...S("ch5-s1","Chapter V – Resistance — Section 1: Introduction"),pageStart:11,pageEnd:12},{...S("ch5-s3","Chapter V – Resistance — Section 3: Frictional Resistance"),pageStart:17,pageEnd:24},{...S("ch5-s4","Chapter V – Resistance — Section 4: Wave-Making Resistance"),pageStart:25,pageEnd:36},{...S("ch5-s5","Chapter V – Resistance — Section 5: Other Components of Resistance"),pageStart:37,pageEnd:62},{...S("ch6-s1","Chapter VI – Propulsion — Section 1: Powering of Ships"),pageStart:136,pageEnd:139},{...S("ch6-s2","Chapter VI – Propulsion — Section 2: Theory of Propeller Action"),pageStart:140,pageEnd:151},{...S("ch6-s4","Chapter VI – Propulsion — Section 4: Interaction between Hull and Propeller"),pageStart:154,pageEnd:161},{...S("ch6-s6","Chapter VI – Propulsion — Section 6: Geometry of the Screw Propeller"),pageStart:173,pageEnd:179},{...S("ch6-s7","Chapter VI – Propulsion — Section 7: Cavitation"),pageStart:180,pageEnd:191},{...S("ch6-s10","Chapter VI – Propulsion — Section 10: Other propulsion devices"),pageStart:234,pageEnd:248}]),
E("pna-v3","LEWIS — Principles of Naval Architecture, Volume III",[{...S("ch9-s1","Chapter IX – Controllability — Section 1: Introduction"),pageStart:200,pageEnd:200},{...S("ch9-s3","Chapter IX — Section 3: Motion Stability"),pageStart:204,pageEnd:207},{...S("ch9-s4","Chapter IX — Section 4: Analysis of Course Keeping and Controls-fixed Stability"),pageStart:208,pageEnd:213},{...S("ch9-s5","Chapter IX — Section 5: Stability and Control"),pageStart:214,pageEnd:217},{...S("ch9-s6","Chapter IX — Section 6: Analysis of Turning Ability"),pageStart:218,pageEnd:223},{...S("ch9-s10","Chapter IX — Section 10: Accelerating, Stopping and Backing"),pageStart:260,pageEnd:272},{...S("ch9-s12","Chapter IX — Section 12: Effects of the Environment"),pageStart:277,pageEnd:287},{...S("ch9-s13","Chapter IX — Section 13: Vessel Waterway Interactions"),pageStart:288,pageEnd:299},{...S("ch9-s14","Chapter IX — Section 14: Hydrodynamics of Control Surfaces"),pageStart:300,pageEnd:324}]),
E("larsson-resistance","LARSSON & RAVEN — Ship Resistance and Flow",[1,2,3,4,5,6,7,8].map(n=>S("ch"+n,"Chapter "+n)) ),
E("bertram","BERTRAM — Practical Ship Hydrodynamics, 2ª ed.",[S("ch2","Chapter 2 – Propellers"),S("ch3","Chapter 3 – Resistance and Propulsion"),S("ch6","Chapter 6 – Ship manoeuvering")]),
E("msc1053","IMO MSC/Circ.1053 — Explanatory Notes to Standards for Ship Manoeuvrability",[S("ch1","Chapter 1 – General principles"),S("ch2","Chapter 2 – Guidelines for application of the standards"),S("ch3","Chapter 3 – Prediction guidance")]),
E("msc137","IMO Resolution MSC.137(76) — Standards for Ship Manoeuvrability",[S("annex6","Annex 6 – Standards for Ship Manoeuvrability")]),
E("santos-manobrabilidade","SANTOS — A Manobrabilidade do Navio no Século 21",[2,3,4,5,6,7,8,9,10,11].map(n=>S("ch"+n,"Capítulo "+n)) ),
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
E("hensen-tug","HENSEN — Tug Use in Port, 4ª ed.",[1,2,3,4,5,6,7,9].map(n=>S("ch"+n,"Chapter "+n))),E("hensen-estabilidade","HENSEN & VAN DER LAAN — Estabilidade dos Rebocadores",[S("ch2","Capítulo 2 – Princípios básicos de estabilidade")]),E("clark","CLARK — Mooring and Anchoring Ships, Vol. 1",[S("ch6","Chapter 6 – Anchor and cable")]),E("fragoso","FRAGOSO & CAJATY — Rebocadores Portuários",[S("integral","Publicação indicada — sem capítulos delimitados no Anexo 2-B")]),E("pianc-dimensions","PIANC — Ship Dimensions and Data for Design of Marine Infrastructure",[S("ch1","Chapter 1 – Introduction"),S("ch2","Chapter 2 – Vessel characteristics")])
],
"navegacao-aguas-restritas":[
E("swift-btm","SWIFT & BAILEY — Bridge Team Management, 2ª ed.",[1,2,3,4,5,6,7].map(n=>S("ch"+n,"Chapter "+n))),
E("miguens-v1","MIGUENS — Navegação: a Ciência e a Arte, Volume I",[1,2,3,4,5,6,7,8,10,11,12,13,14].map(n=>S("ch"+n,"Capítulo "+n))),
E("miguens-v3-nav","MIGUENS — Navegação: a Ciência e a Arte, Volume III",[37,38,40,42].map(n=>S("ch"+n,"Capítulo "+n))),
E("ics-bpg","ICS — Bridge Procedures Guide, 6ª ed.",[2,3,5,6].map(n=>S("ch"+n,"Chapter "+n))),E("solas-2024","IMO SOLAS — Consolidated Edition 2024",[S("ch-v","Chapter V – Safety of Navigation")]),E("bento","BENTO — Navegação Integrada, 4ª ed.",[1,2,3,4].map(n=>S("ch"+n,"Capítulo "+n))),E("nayak-nav","NAYAK — Theory and Practices of Marine Pilotage",[5,6,13].map(n=>S("ch"+n,"Chapter "+n))),E("normam202","NORMAM-202/DPC",[S("ch11","Capítulo 11 – Regras Especiais para Evitar Abalroamento")]),
...["NORMAM-511/DHN","NORMAM-601/DHN","NORMAM-602/DHN","IMO Resolution MSC.192(79)","IMO Resolution A.1106(29)","IMO Resolution MSC.530(106)","IMO MSC.1/Circ.738/Rev.2","IMO MSC.1/Circ.1580"].map((t,i)=>E("nav-doc-"+i,t,[S("integral","Publicação indicada — sem recorte adicional no Anexo 2-B")])),
E("colreg","IMO COLREG — Consolidated Edition 2018",["A","B","C","D","E"].map(x=>S("part-"+x,"Part "+x))),E("normam501","NORMAM-501/DHN",[S("integral","Publicação indicada — sem recorte adicional no Anexo 2-B")])
],
"legislacao-regulamentacao":[
E("normam201","NORMAM-201/DPC",[S("ch7","Capítulo 7 – Borda-livre e Estabilidade Intacta — arts. 7.1–7.3 e 7.10–7.14")]),
...["NORMAM-204/DPC","NORMAM-302/DPC","NORMAM-311/DPC","NORMAM-601/DHN","NORMAM-112/DPC","NORMAM-602/DHN","Lei nº 2.180/1954 — Tribunal Marítimo","Lei nº 9.537/1997 — LESTA","Lei nº 14.813/2024 — Praticagem","Decreto nº 2.596/1998 — RLESTA","Portaria nº 37/MB/2022","IMO COLREG 1972","Publicações Náuticas da DHN","Serviço SAR no Brasil"].map((t,i)=>E("leg-doc-"+i,t,[S("integral","Conteúdo indicado no Anexo 2-B")])),
E("lei12815","Lei nº 12.815/2013",[S("ch1","Capítulo I – Definições e objetivos"),S("ch4","Capítulo IV – Administração do Porto Organizado"),S("ch8","Capítulo VIII – Programa nacional de dragagem")]),E("lc97","Lei Complementar nº 97/1999",[S("art17","Capítulo VI – Art. 17")]),
...["IMO Resolution A.960(23)","MD35-G-01 — Glossário das Forças Armadas, 5ª ed.","Política Nacional de Defesa — 2025","Decreto nº 12.481/2025 — Política Marítima Nacional","Decreto nº 2.256/1997","Lei nº 7.642/1987 — PEM","Lei nº 7.652/1988 — Registro da Propriedade Marítima","Lei nº 9.432/1997 — Transporte Aquaviário"].map((t,i)=>E("leg-extra-"+i,t,[S("integral","Conteúdo indicado no Anexo 2-B")]))
],
"meteorologia-oceanografia":[E("miguens-met","MIGUENS — Navegação: a Ciência e a Arte, Volume III",[S("ch45","Capítulo 45 – Noções de Meteorologia para Navegantes")]),...["YNOUE et al. — Meteorologia: Noções Básicas","LOBO & SOARES — Meteorologia e Oceanografia, 4ª ed.","SANTOS — Princípios de Hidrodinâmica e Ação das Ondas"].map((t,i)=>E("met-"+i,t,[S("integral","Publicação indicada — sem capítulos delimitados no Anexo 2-B")])),E("pianc-hydromet","PIANC Report 117 — Use of Hydro/Meteo Information",[2,3,4,5,6].map(n=>S("ch"+n,"Chapter "+n))),E("normam701","NORMAM-701/DHN",[S("integral","Publicação indicada — sem recorte adicional no Anexo 2-B")])],
comunicacoes:[E("smcp","IMO Standard Marine Communication Phrases — A.918(22)",["Introduction","General","Glossary"].map((x,i)=>S("s"+i,x))),E("radioperador","DPC — Manual do Curso Especial de Radioperador Geral",[S("integral","Publicação indicada — sem capítulos delimitados no Anexo 2-B")]),E("ics","IMO — International Code of Signals, 2005",[S("chapters","Capítulos I a V, VII, VIII, X, XI e XII"),S("general","Seção Geral — Distress; Casualties; Aids to navigation; Manoeuvres; Pilot"),S("medical","Seção Médica — Request for Medical Assistance, Chapter I"),S("appendices","Apêndices 1, 2 e 4")])],
"conhecimentos-gerais":[E("fal6","IMO FAL.6/Circ.14/Rev.2 — Ship/Port Interface",[S("integral","Publicação indicada")]),E("conapra-port","CONAPRA — Planejamento Portuário: Recomendações para Acessos Náuticos",[S("ch2","Capítulo 2 – Vias de Acesso a Instalações Portuárias"),S("ch8","Capítulo 8 – Análise de Risco e Planejamento Portuário")]),E("pianc-channels","PIANC — Harbour Approach Channels: Design Guidelines",[1,2,3].map(n=>S("ch"+n,"Chapter "+n))),E("normam224","NORMAM-224/DPC — Folga Dinâmica Abaixo da Quilha",[S("integral","Publicação indicada")]),E("fatigue","IMO MSC.1/Circ.1598 — Guidelines on Fatigue",[S("integral","Publicação indicada")]),E("livingstone","LIVINGSTONE — Shiphandling the Beautiful Game, Vol. 1",[1,3,11,12].map(n=>S("ch"+n,"Chapter "+n))),E("udhr","ONU — Declaração Universal dos Direitos Humanos",[S("integral","Publicação indicada")]),E("marpol","Decreto nº 2.508/1998 — MARPOL 73/78",[S("integral","Publicação indicada")]),E("stopford","STOPFORD — Economia Marítima, 3ª ed.",[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].map(n=>S("ch"+n,"Capítulo "+n))),E("pimenta","PIMENTA — Direito Processual Marítimo, 3ª ed.",[1,2,3,4,5,7,8,9,10,11].map(n=>S("ch"+n,"Capítulo "+n)))]
};
export const OFFICIAL_BIBLIOGRAPHY_URL="https://www.marinha.mil.br/dpc/revisao-dos-anexos-2-e-2-b-da-normam-311dpc";
export function bibliographyUnits(){return Object.entries(BIBLIOGRAPHY).flatMap(([subjectSlug,entries])=>entries.flatMap((entry,publicationIndex)=>entry.sections.map((section,sectionIndex)=>({subject_slug:subjectSlug,bibliography_key:entry.key,publication:entry.title,source:entry.source,section_key:section.key,section:section.label,chapter:section.chapter||section.label,page_start:Number.isInteger(section.pageStart)?section.pageStart:null,page_end:Number.isInteger(section.pageEnd)?section.pageEnd:null,required:section.required!==false,order:publicationIndex*100+sectionIndex}))).filter(x=>x.required));}
