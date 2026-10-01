import fs from "node:fs";

const replacements = {
  "NAV-MIGV3-C37-UC002-M2": "Considere um sistema de navegação por satélite capaz de fornecer posição e velocidade em tempo real com elevada acurácia, porém cuja cobertura está restrita a determinada região do globo. À luz da definição de GNSS adotada para sistemas de cobertura global, esse sistema:",
  "NAV-MIGV3-C37-UC003-M2": "Na aproximação de um porto, um sistema de radionavegação candidato ao reconhecimento mundial deve ser confrontado com o padrão de acurácia posicional adotado pela IMO para o WWRNS. Qual desempenho corresponde ao padrão para entradas e aproximações de portos e águas costeiras?",
  "NAV-MIGV3-C37-UC003-M3": "Julgue as afirmativas relativas ao WWRNS e aos requisitos da IMO:\nI. A revisão do Capítulo V da SOLAS, em vigor a partir de 2002, passou a exigir meio de radionavegação capaz de estabelecer e atualizar automaticamente a posição do navio durante toda a viagem.\nII. O MSC adotou padrões de desempenho específicos para receptores GPS, GLONASS, DGPS/DGLONASS e equipamentos combinados GPS/GLONASS.\nIII. A Resolução A.1046(27) revogou a A.953(23), mantendo os padrões de acurácia de posicionamento mencionados na resolução anterior.\nIV. A concepção do WWRNS pressupõe que o emprego de vários sistemas reduz a geometria disponível e, por isso, diminui a integridade e a confiança do usuário.",
  "NAV-MIGV3-C37-UC005-M1": "A respeito da arquitetura e do funcionamento geral do GPS, analise:\nI. O sistema é composto pelos segmentos espacial, terrestre de monitoramento e controle, e do usuário.\nII. A configuração inicial adotou 24 satélites distribuídos em 6 planos orbitais, com inclinação de 55° e altitude aproximada de 20.200 km.\nIII. O projeto buscou assegurar que pelo menos quatro satélites estivessem acima do horizonte, com elevação superior à mínima de 5°, em qualquer ponto da Terra e durante todo o dia.\nIV. O segmento de controle rastreia os satélites, monitora transmissões, mantém referência comum de tempo, determina dados orbitais e envia comandos e informações à constelação.",
  "NAV-MIGV3-C37-UC007-M2": "Um navio dispõe de receptor GPS convencional, sem padrão atômico próprio para determinar a hora independentemente, mas sua altitude é conhecida com acurácia. Considerando a determinação da posição GPS por pseudodistâncias, qual é a configuração mínima indicada para resolver a posição horizontal e o tempo?",
  "NAV-MIGV3-C37-UC010-M2": "Qual conjunto de parâmetros corresponde à configuração do segmento espacial do GLONASS?",
  "NAV-MIGV3-C37-UC012-M2": "Um candidato compara os parâmetros de desempenho do GLONASS para uso civil. Qual alternativa apresenta corretamente os valores de acurácia atribuídos ao sistema?",
  "NAV-MIGV3-C37-UC012-M3": "Julgue as afirmativas considerando exclusivamente os valores de acurácia apresentados para o GLONASS:\nI. A acurácia horizontal civil indicada é numericamente menor que a acurácia vertical civil indicada.\nII. A referência de 95% está associada no texto ao valor horizontal civil de 100 m.\nIII. A faixa de 10 a 20 m corresponde à acurácia horizontal dos códigos militares.\nIV. O texto atribui aos códigos militares acurácia vertical de 10 a 20 m e não fornece qualquer valor horizontal para eles.",
  "NAV-MIGV3-C37-UC015-M2": "Um receptor Galileo precisa obter os elementos necessários à solução completa de posição, navegação e tempo (PNT). Qual conjunto corresponde aos quatro tipos de dados de navegação transmitidos pelo sistema?",
  "NAV-MIGV3-C37-UC020-M2": "Um receptor compatível com o BDS está configurado para acompanhar o sinal cuja frequência central é 1176,45 MHz e cuja largura de banda é 20,46 MHz. Esse sinal é o:",
  "NAV-MIGV3-C37-UC021-M2": "Qual associação entre sinal e formato de mensagem NAV do BeiDou está correta?",
  "NAV-MIGV3-C37-UC024-M2": "Na terminologia de compatibilidade e interoperabilidade entre o BDS e outros GNSS, qual situação representa especificamente a interoperabilidade?",
  "NAV-MIGV3-C37-UC025-M1": "A respeito dos sistemas regionais de navegação por satélite NavIC e QZSS, analise as afirmativas:\nI. O NavIC é um sistema regional indiano, concebido para atender a Índia e uma região em torno do país.\nII. O QZSS é um sistema regional japonês desenvolvido para complementar o GPS, especialmente onde obstáculos reduzem a visibilidade dos satélites.\nIII. Tanto o NavIC quanto o QZSS foram reconhecidos pela IMO como sistemas regionais componentes do WWRNS.\nIV. Ambos foram concebidos como GNSS de cobertura mundial, dispensando a integração com sistemas globais.",
  "NAV-MIGV3-C37-UC025-M2": "Considerando as características dos sistemas regionais NavIC e QZSS, qual alternativa melhor expressa uma característica comum aos dois sistemas?",
  "NAV-MIGV3-C37-UC028-M2": "Um sistema regional melhora a solução GNSS do usuário transmitindo sinais adicionais a partir de uma estação instalada em terra. Pela classificação dos sistemas de aumento de desempenho GNSS, esse sistema é:",
  "NAV-MIGV3-C37-UC029-M2": "Uma rede de estações terrestres calcula correções diferenciais utilizando simultaneamente sinais GPS e Galileo e as transmite aos navegantes de sua área de cobertura. Segundo a nomenclatura dos sistemas diferenciais GNSS, essa rede deve ser denominada:",
  "NAV-MIGV3-C37-UC032-M1": "A respeito dos receptores GNSS multissistemas embarcados, analise:\nI. Para GNSS reconhecido pela IMO como componente do WWRNS, os receptores devem observar requisitos aplicáveis aos equipamentos de determinação de posição referidos no Capítulo V da SOLAS.\nII. O equipamento multissistema deve poder indicar a qualidade e a confiabilidade dos dados PNT e identificar os sistemas de radionavegação utilizados.\nIII. Entre os requisitos operacionais está o emprego de sinais de acesso civil de pelo menos dois GNSS independentes reconhecidos pela IMO como parte do WWRNS.\nIV. Depois de combinar as fontes disponíveis em uma solução PNT única, o equipamento deve impedir o acesso do usuário às informações individuais de cada fonte.",
  "NAV-MIGV3-C37-UC032-M2": "Um receptor GNSS multissistema de bordo precisa voltar a produzir uma solução PNT com a precisão requerida em diferentes condições de inicialização. Qual alternativa reproduz corretamente os tempos de aquisição e recuperação previstos para o equipamento?",
  "NAV-MIGV3-C38-UC033-M2": "Durante uma patrulha submersa, deseja-se manter uma solução de navegação sem depender da recepção contínua de radiofrequência, de satélites nem da transmissão de pulsos pelo próprio navio. Qual sistema de navegação atende diretamente a essa característica?",
  "NAV-MIGV3-C38-UC040-M2": "Qual relação entre Latitude e Longitude está de acordo com o princípio de funcionamento do Sistema de Navegação Inercial (SNI)?",
  "NAV-MIGV3-C38-UC044-M2": "Qual descrição sintetiza corretamente o Sistema de Navegação Sonar Doppler?",
  "NAV-MIGV3-C40-UC053-M3": "Julgue as afirmativas relativas às vias de navegação interior:\nI. Navegação interior é a navegação realizada em vias navegáveis interiores e em áreas marítimas consideradas abrigadas.\nII. Hidrovias podem dispor de eclusas para transposição de desníveis.\nIII. O Brasil já utiliza comercialmente praticamente toda a sua malha hidroviária potencial de 63 mil km.\nIV. Via navegável é o espaço físico, natural ou não, utilizado para a navegação em oceanos, mares, rios, lagos e lagoas.",
  "NAV-MIGV3-C40-UC054-M1": "Considerando os fatores que determinam a navegabilidade dos rios, analise:\nI. Rios de alto curso tendem a apresentar gradiente elevado, corredeiras e condições precárias para embarcações de porte.\nII. Rios de médio curso podem possuir longos estirões navegáveis interrompidos por rápidos, corredeiras ou quedas.\nIII. Rios de baixo curso são sempre totalmente livres de obstáculos à navegação.\nIV. O tipo de fundo, as cheias e as estiagens podem alterar significativamente as condições de navegabilidade.",
  "NAV-MIGV3-C40-UC060-M2": "Na cartografia destinada à navegação fluvial, em quais duas categorias principais se dividem os documentos cartográficos?",
  "NAV-MIGV3-C40-UC064-M2": "Entre as publicações de segurança da navegação fluvial, qual recebe relevância especial por descrever detalhadamente as condições de navegabilidade da hidrovia?",
  "NAV-MIGV3-C40-UC066-M2": "No sistema de divulgação dos níveis dos rios, qual distinção entre o Portal HidroWeb e o Portal Telemetria está correta?",
  "NAV-MIGV3-C40-UC070-M2": "Qual conjunto reúne apenas características gerais desejáveis para embarcações destinadas à navegação fluvial?",
  "NAV-MIGV3-C40-UC071-M1": "Na síntese das particularidades da navegação fluvial, compare a navegação descendo e subindo o rio:\nI. Descendo o rio, a embarcação tem maior velocidade absoluta.\nII. Descendo o rio, a capacidade de manobra tende a ser menor e um encalhe pode ser mais grave.\nIII. Subindo o rio, a embarcação tende a ter melhores qualidades de manobra.\nIV. Em águas restritas, a embarcação que sobe deve, se necessário, aguardar a que desce concluir uma travessia ou passagem estreita.",
  "NAV-MIGV3-C42-UC072-M2": "Qual interpretação melhor traduz a diferença entre a propagação da onda e o movimento das partículas de água?",
  "NAV-MIGV3-C42-UC076-M2": "Uma onda cujo comprimento seja aproximadamente duas vezes o comprimento do navio pode gerar qual situação de risco para a embarcação?",
  "NAV-MIGV3-C42-UC080-M2": "Na classificação geral dos ciclones, quais são as três categorias apresentadas?",
  "NAV-MIGV3-C42-UC082-M2": "Um sistema subtropical apresenta vento máximo sustentado de 40 nós. Conforme a classificação dos ciclones subtropicais por vento máximo sustentado, qual denominação é apropriada?",
  "MEO-MIGV3-C45-UC086-M1": "Considerando a atmosfera e sua circulação geral, analise:\nI. A atmosfera apresenta composição e estrutura em camadas que influenciam os fenômenos meteorológicos.\nII. O aquecimento desigual da superfície terrestre e da atmosfera contribui para a circulação geral.\nIII. A circulação geral transporta calor das regiões tropicais para médias e altas latitudes.\nIV. A circulação geral da atmosfera independe das diferenças de balanço energético entre regiões tropicais e polares.",
  "MEO-MIGV3-C45-UC086-M2": "Qual encadeamento melhor representa a relação entre aquecimento desigual da superfície terrestre e circulação geral da atmosfera?",
  "MEO-MIGV3-C45-UC090-M2": "Qual alternativa apresenta exatamente os sete elementos meteorológicos empregados para descrever as condições do tempo?",
  "MEO-MIGV3-C45-UC094-M2": "Em uma carta meteorológica, as isóbaras aparecem muito próximas umas das outras. Qual interpretação é compatível com a relação entre gradiente barométrico e intensidade do vento?",
  "MEO-MIGV3-C45-UC098-M2": "Qual encadeamento representa adequadamente a relação entre massas de ar, frentes e depressões extratropicais?",
  "MEO-MIGV3-C45-UC104-M2": "Qual prática melhor representa o método de previsão do tempo a bordo recomendado ao navegante?",
  "MEO-MIGV3-C45-UC110-M2": "Um navio registra diminuição contínua da diferença entre temperatura do ar e ponto de orvalho. Qual interpretação é coerente com a observação desses parâmetros para prognóstico do tempo?",
  "MEO-MIGV3-C45-UC125-M2": "Na classificação de nuvens apresentada no apêndice meteorológico, quais três classes gerais aparecem explicitamente nas figuras?",
  "MEO-MIGV3-C45-UC125-M3": "Julgue as afirmativas sobre a classificação de nuvens apresentada no apêndice meteorológico:\nI. A classificação é apresentada como extrato de uma publicação da DHN.\nII. O International Cloud Atlas da OMM é citado como fonte.\nIII. O apêndice apresenta figuras específicas para nuvens altas, médias e baixas.\nIV. A classificação de nuvens é destinada à classificação do estado do mar pela escala Douglas.",
  "MEO-MIGV3-C45-UC126-M3": "Julgue as afirmativas sobre a classificação do estado do mar:\nI. A classificação relaciona visualmente aparência do mar e força Beaufort.\nII. A força indicada nas imagens refere-se ao vento.\nIII. A escala Douglas é utilizada para graduar o desenvolvimento do mar.\nIV. O texto afirma que Beaufort e Douglas são a mesma escala e possuem exatamente a mesma finalidade."
};
const targets = [
  ["data/questions/navegacao-aguas-restritas.json", /^NAV-MIGV3-C(37|38|40|42)-/, 255, 2080],
  ["data/questions/meteorologia-oceanografia.json", /^MEO-MIGV3-C45-/, 123, 1353]
];

const locatorDependent = (stem) => {
  const hasLocator = /\b(?:item|itens|art(?:igo)?\.?|artigos?|se[cç][aã]o|cap[ií]tulo|al[ií]nea|par[aá]grafo|anexo|regra)\s+(?:n[º°.]?\s*)?[0-9IVXLCDM]/i.test(stem);
  const hasObject = /[“"][^”"]{8,}[”"]|(?:sobre|relativo a|referente a|em relação a|que trata de)\s+[^?.:]{8,}/i.test(stem);
  return hasLocator && !hasObject;
};

let changed = 0;
for (const [path, matcher, expectedNew, expectedTotal] of targets) {
  const bank = JSON.parse(fs.readFileSync(path, "utf8"));
  if (bank.questions.length !== expectedTotal) throw new Error(path + ": total inesperado");

  const selected = bank.questions.filter(q => matcher.test(String(q.id || "")));
  if (selected.length !== expectedNew) throw new Error(path + ": conjunto Miguens incompleto");

  for (const q of selected) {
    if (Object.prototype.hasOwnProperty.call(replacements, q.id)) {
      q.question = replacements[q.id];
      changed++;
    }
    if (locatorDependent(q.question)) {
      throw new Error(q.id + ": ainda depende de localizador: " + q.question.split("\n")[0]);
    }
  }

  fs.writeFileSync(path, JSON.stringify(bank, null, 2) + "\n");
}
if (changed !== 42) throw new Error("Foram alterados " + changed + " enunciados; esperado 42");
console.log(JSON.stringify({ changed }));
