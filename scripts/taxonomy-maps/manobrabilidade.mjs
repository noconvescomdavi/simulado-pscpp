const norm=(v)=>String(v??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
const has=(s,...terms)=>terms.some(t=>s.includes(norm(t)));

export const sourceAvailability={
  "crenshaw-naval-shiphandling":false,
  "pna-v2":true,
  "pna-v3":true,
  "larsson-resistance":true,
  "bertram":true,
  "msc1053":true,
  "msc137":true,
  "santos-manobrabilidade":false,
  "santos-hidrodinamica":false,
  "msc1228":true,
  "a601":true
};

export const sourcePendingNotes={
  "crenshaw-naval-shiphandling":"Fonte integral exata (Crenshaw, Naval Shiphandling, 4ª ed., Chapter 2) não localizada na Library; somente resumo do Chapter 2 disponível.",
  "santos-manobrabilidade":"Edição bibliográfica exata de 2021 não localizada na Library; existe material relacionado do mesmo autor, mas não foi tratado como substituto integral.",
  "santos-hidrodinamica":"Obra bibliográfica exata de 2021 não localizada na Library."
};

function pnaV2(q){
  const m=norm(q.module), t=norm(q.topic), c=norm(q.topic_code), s=`${m} ${t} ${c}`;
  if(has(m,"resistencia do navio")){
    if(has(t,"friccional","friccao","rugosidade","reynolds"))return "ch5-s3";
    if(has(t,"onda","wave","interferencia","kelvin","froude"))return "ch5-s4";
    if(has(t,"viscosa de pressao","separacao","eddy","ar ","vento","appendage","apendice","trim","aguas rasas","shallow","leeway","heel","resistencia adicional"))return "ch5-s5";
    return "ch5-s1";
  }
  if(has(t,"cavit"))return "ch6-s7";
  if(has(t,"passo controlavel","controllable pitch","jato","waterjet","pump jet","cicloidal","vertical","paddle","roda de pa","contra rot","contrarrot","tandem","supercavit","sobreposto","overlapping","parcialmente submers"))return "ch6-s10";
  if(has(t,"deducao de empuxo","thrust deduction","esteira","wake","eficiencia do casco","hull efficiency","eficiencia rotativa","relative rotative","interacao casco propulsor","interacao casco helice","slip"))return "ch6-s4";
  if(has(t,"geometr","passo geometrico","diametro","area de pa","razao de area","rake","skew","helice geometr"))return "ch6-s6";
  if(has(t,"potencia","powering","maquinaria","propulsive efficiency","eficiencia propulsiva"))return "ch6-s1";
  if(has(t,"empuxo","thrust","torque","razao de avanco","numero de avanco","advance ratio","momentum","blade element","circulation","acao do propulsor"))return "ch6-s2";
  if(has(m,"propulsao"))return "ch6-s2";
  return null;
}

function pnaV3(q){
  const m=norm(q.module), t=norm(q.topic), s=`${m} ${t} ${norm(q.topic_code)}`;
  if(has(t,"leme","rudder","superficie de controle","control surface","flap","madre","aspecto do leme","razao de aspecto","stall","estol" )||has(m,"superficies de controle"))return "ch9-s14";
  if(has(t,"aguas rasas","shallow","squat","efeito de banco","bank","canal","channel","waterway","folga sob a quilha","under keel","interacao navio","interacao entre navios","ship ship","sinkage","afundamento","trim em aguas","blockage"))return "ch9-s13";
  if(has(t,"vento","wind","corrente","current","ondas","waves","environment","ambient"))return "ch9-s12";
  if(has(t,"parada","stopping","stop","aceleracao","acceleration","desaceleracao","backing","movimento a re","a re","coasting"))return "ch9-s10";
  if(has(t,"curva de giro","turning","giro","tactical","diametro tatico","advance","avanco","transfer","fases da curva","fase inicial","raio de giro","steady turning","varredura da popa","heel em curva","adernamento em curva","ponto pivo","pivot point"))return "ch9-s6";
  if(has(t,"zig zag","zigzag","zigue zague","overshoot","quebra da guinada","yaw checking","nomoto","indices k","indice k","indice t","course keeping","manutencao do rumo"))return "ch9-s5";
  if(has(t,"espiral","spiral","bech","estabilidade direcional","course stability","controls fixed","laço de instabilidade","laco de instabilidade"))return "ch9-s4";
  if(has(t,"derivada hidrodinamica","hydrodynamic derivative","equacao de movimento","linear","motion stability","estabilidade dinamica","cross flow","escoamento cruzado","munk"))return "ch9-s3";
  if(has(t,"controlabilidade","qualidades de manobra","caracteristicas de manobrabilidade","definicao","escopo"))return "ch9-s1";
  if(has(m,"efeitos ambientais"))return "ch9-s13";
  if(has(m,"controlabilidade"))return "ch9-s5";
  return null;
}

function larsson(q){
  const t=norm(q.topic), c=norm(q.topic_code);
  if(has(t,"conservacao de massa","conservacao da quantidade de movimento","navier","governing","pressao hidrodinamica","forcas de pressao"))return "ch2";
  if(has(t,"similaridade","similitude","froude","reynolds","escala de"))return "ch3";
  if(has(t,"onda","wave","kelvin","aguas rasas","shallow","canal","channel","wave breaking"))return "ch5";
  if(has(t,"friccional","boundary","camada limite","separacao","viscosa","rugosidade","roughness","fouling","arrasto viscoso"))return "ch6";
  if(has(t,"apendice","appendage","arrasto induzido","induced","vento","wind","air resistance","resistencia do ar"))return "ch7";
  if(has(t,"ensaio","testes com modelos","model test","medicao","measurement","esteira nominal","wake survey","ittc","metodo de froude","potencia efetiva","correlacao modelo navio","fator de forma"))return "ch8";
  if(has(t,"decomposicao","resistencia total","resistencia em agua calma","calm water","componentes da resistencia"))return "ch4";
  if(has(t,"metodos empiricos","modelos numericos","computacional","previsao de resistencia","formas de prever","importance","importancia"))return "ch1";
  if(c.startsWith("5 1"))return "ch1";
  if(c.startsWith("5 2"))return "ch2";
  if(c.startsWith("5 3"))return "ch3";
  if(c.startsWith("5 4"))return "ch4";
  if(c.startsWith("5 5"))return "ch5";
  if(c.startsWith("5 6"))return "ch6";
  if(c.startsWith("5 7"))return "ch7";
  if(c.startsWith("5 8")||c.startsWith("5 9"))return "ch8";
  return null;
}

function bertram(q){
  const m=norm(q.module), t=norm(q.topic), c=norm(q.topic_code);
  if(has(m,"superficies de controle","controlabilidade")||has(t,"leme","rudder","curva de emergencia","qualidades de manobra","manobra","maneuver"))return "ch6";
  if(has(m,"resistencia")||has(t,"decomposicao da resistencia","resistencia friccional","resistencia viscosa","potencia efetiva","previsao de potencia","wake","esteira","deducao de empuxo","thrust deduction","eficiencia do casco","hull efficiency","eficiencia propulsiva","potencia entregue","interacao casco"))return "ch3";
  if(has(t,"propuls","helice","propeller","empuxo","thrust","torque","avanco","advance","coeficiente","cavit","geometr","passo","rake","area de pa","curvas de agua aberta","quatro quadrantes","pressao induzida"))return "ch2";
  if(c.startsWith("7 ")||c.startsWith("8 "))return "ch6";
  if(c.startsWith("5 ")||c.startsWith("6 7"))return "ch3";
  return "ch2";
}

function msc1053(q){
  const t=norm(q.topic), c=norm(q.topic_code);
  if(has(t,"metodos de previsao","previsao","prediction","modelo cativo","pmm","projeto para manobrabilidade","design","simulacao","regression","derivadas hidrodinamicas"))return "ch3";
  if(has(t,"corrente no ensaio","limite de ondas","limite de vento","profundidade de ensaio","correcao ambiental","registro de dados","condicao de ensaio","full load","carregamento","trim de ensaio","metacentric","agua profunda","deep water"))return "ch2";
  return "ch1";
}

function santos(q){
  const t=norm(q.topic);
  if(has(t,"equacao de movimento","equacoes de movimento"))return "ch2";
  if(has(t,"cross flow","escoamento cruzado","derivada hidrodinamica","munk","asa","forca hidrodinamica"))return "ch3";
  if(has(t,"espiral","estabilidade dinamica","estabilidade direcional","laco de instabilidade"))return "ch4";
  if(has(t,"zig","nomoto","manutencao do rumo","quebra da guinada","overshoot"))return "ch5";
  if(has(t,"curva","giro","raio","pivot point","ponto pivo","varredura da popa"))return "ch6";
  if(has(t,"parada","aceler","desaceler","movimento a re","ponto pivo a re"))return "ch7";
  if(has(t,"vento","rajada","ambient","corrente"))return "ch8";
  if(has(t,"aguas rasas","squat","folga sob a quilha","lama fluida","shallow","thruster em aguas rasas","sinais de aguas rasas"))return "ch9";
  if(has(t,"canal","blockage","efeito de banco","interacao","encontro de navios","ultrapassagem","navio atracado","rebocadores","velocidade segura"))return "ch10";
  if(has(t,"giro em espaco confinado","manobra especial","thruster com seguimento"))return "ch11";
  return null;
}

function msc1228(q){
  const t=norm(q.topic), c=norm(q.topic_code);
  if(has(t,"prevencao","evitar","orientacao operacional","uso da orientacao","sucessivos","ataques sucessivos","perigo","zona perigosa"))return "s4";
  if(has(t,"surf riding","broaching","rolamento sincron","synchronous","rolamento parametr","parametric","estabilidade na crista","combinacao de fenomenos"))return "s3";
  if(has(t,"comprimento","periodo de onda","periodo de encontro","estado do mar","condicoes de carregamento","informacao de manobra a bordo","wave period","wave length"))return "s1";
  if(c.startsWith("9 4 2")||c.startsWith("9 4 2 3")||c.startsWith("9 1 4 1"))return "s4";
  if(c.startsWith("9 1")||c.startsWith("9 2")||c.startsWith("9 3")||c.startsWith("9 4"))return "s3";
  return "s1";
}

export function classifyManobrabilidade(q){
  const title=norm(q?.source?.title), author=norm(q?.source?.author);
  if(title.includes("naval shiphandling")||author.includes("crenshaw"))return {bibliography_id:"crenshaw-naval-shiphandling",section_key:"ch2",confidence:"high",basis:"obra/unidade única"};
  if(title.includes("principles of naval architecture")&&title.includes("volume ii")){
    const k=pnaV2(q);return k?{bibliography_id:"pna-v2",section_key:k,confidence:"high",basis:"tópico + sumário real da obra"}:null;
  }
  if(title.includes("principles of naval architecture")&&title.includes("volume iii")){
    const k=pnaV3(q);return k?{bibliography_id:"pna-v3",section_key:k,confidence:"high",basis:"tópico + sumário real do Chapter IX"}:null;
  }
  if(title.includes("ship resistance and flow")||author.includes("larsson")){
    const k=larsson(q);return k?{bibliography_id:"larsson-resistance",section_key:k,confidence:"high",basis:"tópico + sumário real Chapters 1–8"}:null;
  }
  if(title.includes("practical ship hydrodynamics")||author.includes("bertram")){
    const k=bertram(q);return k?{bibliography_id:"bertram",section_key:k,confidence:"high",basis:"tópico + capítulos 2, 3 e 6"}:null;
  }
  if(title.includes("explanatory notes")||title.includes("msc circ 1053")||title.includes("msc 1 circ 1053")){
    return {bibliography_id:"msc1053",section_key:msc1053(q),confidence:"high",basis:"tópico + estrutura Chapters 1–3"};
  }
  if((title.includes("standards for ship manoeuvrability")||title.includes("standards for ship maneuverability")||title.includes("msc 137"))&&!title.includes("explanatory"))return {bibliography_id:"msc137",section_key:"annex6",confidence:"high",basis:"Annex 6 é a unidade canônica"};
  if(title.includes("manobrabilidade do navio no seculo 21")||author.includes("edson mesquita")){
    const k=santos(q);return k?{bibliography_id:"santos-manobrabilidade",section_key:k,confidence:"medium",basis:"tópico + títulos de capítulos da bibliografia oficial; fonte integral pendente"}:null;
  }
  if(title.includes("principios de hidrodinamica")||title.includes("acao das ondas"))return null;
  if(title.includes("revised guidance")||title.includes("msc 1 circ 1228")||title.includes("msc circ 1228"))return {bibliography_id:"msc1228",section_key:msc1228(q),confidence:"high",basis:"tópico + Sections 1, 3 e 4.2 da circular"};
  if(title.includes("provision and display of manoeuvring information")||title.includes("provision and display of maneuvering information")||title.includes("a 601"))return {bibliography_id:"a601",section_key:"s1",confidence:"high",basis:"unidade canônica única"};
  return null;
}
