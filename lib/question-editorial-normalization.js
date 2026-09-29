// Editorial normalization for question stems.
// Bibliographic locators remain in question.source.locator for traceability; they must not
// replace the technical object the student is expected to understand.
const LOCATOR_WORDS = String.raw`(?:item|itens|art(?:igo)?\\.?|artigos?|se[cç][aã]o|cap[ií]tulo|al[ií]nea|par[aá]grafo|anexo|regra|verbete)`;


function deriveTechnicalObject(question) {
  const topic = String(question?.topic || question?.tracking?.topic?.title || "").replace(/\s+/g, " ").trim();
  const answer = String((question?.options || []).find((option) => option?.key === question?.correct_answer)?.text || "");
  const module = String(question?.module || "").trim();
  const rules = [
    [/Escuta Hidrofônica/i, "a definição de escuta hidrofônica"],
    [/Tripulação Simples/i, "a definição de tripulação simples"],
    [/Consciência situacional marítima/i, "a definição de consciência situacional marítima"],
    [/EMPRESA BRASILEIRA DE NAVEGAÇÃO/i, "a definição de empresa brasileira de navegação"],
    [/^Marinho refere-se/i, "a distinção entre os conceitos de marinho e marítimo"],
    [/Amazônia Azul/i, "a definição de Amazônia Azul"],
    [/^Armador/i, "a definição de armador"],
    [/Certificado de Isenção de Praticagem/i, "as condições para concessão do Certificado de Isenção de Praticagem"],
    [/infrações, para efeito de multa/i, "a classificação das infrações para efeito de multa"],
    [/soberania brasileira/i, "o princípio de defesa da soberania brasileira na Política Marítima Nacional"],
    [/Proteção marítima/i, "o conceito de proteção marítima"],
    [/Distritos Navais/i, "as atribuições dos Comandantes dos Distritos Navais relativas à Inspeção Naval"],
    [/fortalecer a posição do Brasil/i, "o objetivo de fortalecimento da posição do Brasil como ator marítimo"],
    [/direito estadual, municipal/i, "a prova de direito estadual, municipal, costumeiro, singular ou estrangeiro perante o Tribunal Marítimo"],
    [/Concluído o registro/i, "o documento entregue ao proprietário após o registro ou a inscrição da embarcação"],
    [/recurso contra a aplicação da pena/i, "o recurso contra a aplicação da pena de multa"],
    [/aquisição no exterior/i, "o procedimento de registro de embarcação adquirida no exterior"],
    [/colchão de ar/i, "as luzes exibidas por embarcação de colchão de ar operando sem calado"],
    [/reincidência/i, "o conceito de reincidência para gradação das penalidades"],
    [/remoção de mercadorias/i, "a autorização para remoção de mercadorias da área portuária"],
    [/curso da ação privada/i, "a desistência das partes no curso da ação privada perante o Tribunal Marítimo"],
    [/movimentação de carga/i, "a autorização para movimentação de carga das embarcações na área portuária"],
    [/navegação em água doce, a borda livre/i, "a correção da borda livre para navegação em água doce"],
    [/mau aparelhamento/i, "o mau aparelhamento ou a impropriedade da embarcação e a deficiência da equipagem"],
    [/cumprir e fazer cumprir a bordo, os procedimentos/i, "os deveres do comandante quanto à salvaguarda da vida humana, ao meio ambiente e à segurança da navegação"],
    [/competência do representante da autoridade marítima/i, "a competência do representante da autoridade marítima na aplicação de multa e suspensão"],
    [/assessoria jurídica/i, "a competência da Procuradoria Especial da Marinha para prestar assessoria jurídica"],
    [/execução do serviço de praticagem/i, "a habilitação exigida para a execução do serviço de praticagem"],
    [/penas de multa e suspensão/i, "a substituição das penas de multa e suspensão pelo Tribunal Marítimo"],
    [/palavra [“"]apito/i, "a definição de apito no RIPEAM/COLREG"],
    [/processos de registro/i, "a atuação da Procuradoria Especial da Marinha nos processos de registro"],
    [/estabilidade intacta/i, "o âmbito de aplicação das regras de estabilidade intacta"],
    [/doença ou acidente/i, "a reavaliação do prático após doença ou acidente que possa afetar sua aptidão"],
    [/alcance do racon/i, "os requisitos de alcance de um racon"],
    [/acidente ou fato da navegação/i, "a atuação da Procuradoria Especial da Marinha ao tomar conhecimento de acidente ou fato da navegação"],
    [/cumprir e fazer cumprir a bordo, a legislação/i, "os deveres do comandante quanto ao cumprimento da legislação e das normas a bordo"],
    [/dispensada de borda livre/i, "as exigências aplicáveis à embarcação dispensada de borda livre, mas obrigada a portar CSN"],
    [/capacidade de manobra restrita/i, "a dispensa aplicável à embarcação com capacidade de manobra restrita em esquema de separação de tráfego"],
    [/procedimento administrativo/i, "o procedimento administrativo para aplicação de penalidades"],
    [/Procuradoria Especial da Marinha, diretamente/i, "a finalidade institucional da Procuradoria Especial da Marinha"],
    [/atribuições subsidiárias/i, "a atribuição subsidiária relacionada à Marinha Mercante"],
    [/Sinais Para Chamar a Atenção/i, "os sinais permitidos para chamar a atenção de outra embarcação"],
    [/folha substituta/i, "a numeração de folha substituta nas publicações náuticas"],
    [/direito de promover os atos/i, "a prática de atos processuais por litisconsortes"],
    [/fortalecimento do registro/i, "o fortalecimento do registro de embarcações e trabalhadores no País"],
    [/ANTT/i, "a instituição e a vinculação da ANTT e da ANTAQ"],
    [/Aviso-Rádio Náutico NAVAREA/i, "a divulgação e o recebimento de Avisos-Rádio Náuticos e Avisos SAR"],
    [/destinação constitucional, as Forças Armadas/i, "a estruturação das Forças Armadas em torno de capacidades"],
    [/Comandante de Operações Navais/i, "as competências do Comandante de Operações Navais em assistência, salvamento e socorro"],
    [/contrato levado a registro/i, "os elementos que devem constar do contrato levado a registro"],
    [/argüição contra normas/i, "o encaminhamento de arguição contra normas ou atos decorrentes da LESTA"]
  ];
  for (const [pattern, label] of rules) if (pattern.test(topic)) return label;
  if (/Serviço de Praticagem/i.test(answer) && /Penalidade:/i.test(answer)) return "a penalidade por descumprimento das normas da autoridade marítima sobre o Serviço de Praticagem";
  if (/seguro e resseguro/i.test(answer)) return "a contratação de seguro e resseguro por empresas brasileiras de navegação";
  if (/tráfego de socorro/i.test(answer)) return "o conceito e a condução do tráfego de socorro";
  if (/radar/i.test(answer) && /movimento de embarcações/i.test(topic)) return "os fatores considerados na determinação da velocidade de segurança com uso do radar";
  if (topic && !/(?:\b(?:de|do|da|dos|das|e|ou|com|para|por|no|na|em)\s*$)/i.test(topic)) return topic;
  return module ? `o conteúdo técnico de ${module}` : "";
}

function locatorAsQuestionTarget(stem) {
  return /qual disposição (?:pertence|está expressamente associada) a|o que se afirma corretamente em\\s+(?:art|item|anexo|cap[ií]tulo|se[cç][aã]o)|recorre a\\s+(?:art|item|anexo|cap[ií]tulo|se[cç][aã]o).+qual regra deve observar|requisitos estabelecidos em\\s+(?:art|item|anexo|cap[ií]tulo|se[cç][aã]o)|qual enunciado define corretamente o conteúdo de\\s+(?:art|item|anexo|cap[ií]tulo|se[cç][aã]o|regra)|(?:art|item|anexo|cap[ií]tulo|se[cç][aã]o|regra)\\s+[^,.]{1,40}\\s+aborda\\s+[“"]|Para cumprir\\s+(?:art|item|anexo|cap[ií]tulo|se[cç][aã]o|regra)|como deve ser compreendido\\s+(?:art|item|anexo|cap[ií]tulo|se[cç][aã]o|regra)/i.test(stem);
}

export function hasLocatorDependentStem(question) {
  const stem = String(question?.question || question?.stem || "");
  const hasLocator = new RegExp(`\\b${LOCATOR_WORDS}\\s+(?:n[º°.]?\\s*)?[0-9IVXLCDM]`, "i").test(stem);
  const hasExplicitObject = /[“"][^”"]{8,}[”"]|(?:sobre|relativo a|referente a|em relação a|que trata de)\s+[^?.:]{8,}/i.test(stem);
  return hasLocator && !hasExplicitObject;
}

export function normalizeEditorialStem(question) {
  if (!question || typeof question !== "object") return question;
  let stem = String(question.question || question.stem || "");
  const original = stem;

  // When the command asks the student to identify a rule by article/item number,
  // replace the locator-as-object construction with the actual technical object.
  // The locator remains available in source.locator for bibliographic traceability.
  if (locatorAsQuestionTarget(stem) && !/\n\s*\(I\)|complete corretamente as lacunas/i.test(stem)) {
    const object = deriveTechnicalObject(question);
    const work = String(question.module || question.source?.title || "").trim();
    if (object && work) stem = `Com base em ${work}, sobre ${object}, assinale a alternativa tecnicamente correta.`;
  }

  // Internal generator coordinates ("item 7", "cenário 3") do not belong in the exam command.
  stem = stem.replace(/,\s*(?:item|cen[aá]rio)\s+\d+[A-Za-z]?\s*,\s*/gi, ", ");

  // Keep chapter/section/item coordinates in source.locator, not as a prerequisite to understand the command.
  stem = stem.replace(
    /(De acordo com o contido em [“"][^”"]+[”"])\s*\((?:cap[ií]tulo|cap\.|anexo|se[cç][aã]o|item)[^)]+\)(?=,\s*(?:considere|analise))/gi,
    "$1"
  );

  let match = stem.match(/^(?:Conforme|Considerando a ordem normativa de)\s+(.+?),\s+qual disposição (?:está expressamente associada a|pertence a)\s+.+?(?:,\s+que trata de|\s+no tema)\s+[“"]([^”"]+)[”"]\??$/i);
  if (match) {
    stem = `De acordo com ${match[1]}, sobre “${match[2]}”, qual alternativa apresenta corretamente a disposição aplicável?`;
  }

  match = stem.match(/^Considerando os conceitos adotados por\s+(.+?),\s+o que se afirma corretamente em\s+.+?\s+sobre\s+[“"]([^”"]+)[”"]\??$/i);
  if (match) {
    stem = `De acordo com ${match[1]}, sobre “${match[2]}”, o que se afirma corretamente?`;
  }

  match = stem.match(/^Ao analisar um caso prático sobre\s+[“"]([^”"]+)[”"],\s+o responsável recorre a\s+.+?\s+de\s+(.+?)\.\s+Qual regra deve observar\?$/i);
  if (match) {
    stem = `De acordo com ${match[2]}, em relação a “${match[1]}”, qual regra deve ser observada?`;
  }

  // A bare chapter label must not be the object; preserve the named concept instead.
  stem = stem.replace(
    /^Considerando\s+(?:Cap[ií]tulo|Se[cç][aã]o|Anexo)\s+[^,]+,\s+(qual alternativa caracteriza corretamente\s+[“"][^”"]+[”"]\?)/i,
    "Considerando o conceito indicado, $1"
  );

  // Last-resort repair for commands that still expose only a bibliographic coordinate.
  // Use existing bank metadata; never invent a topic from general knowledge.
  const probe = { ...question, question: stem };
  if (hasLocatorDependentStem(probe)) {
    const topic = String(question.topic || question.tracking?.topic?.title || "").trim();
    const work = String(question.module || question.source?.title || question.tracking?.work?.title || "").trim();
    const usableTopic = topic.length >= 3 && topic.length <= 220 && !/^(?:conte[uú]do indicado|integral|cap[ií]tulo|se[cç][aã]o|item\\b)/i.test(topic);
    if (usableTopic && work) {
      const asksIncorrect = /\\bINCORRETA\\b/i.test(stem);
      stem = `De acordo com ${work}, sobre “${topic}”, assinale a alternativa ${asksIncorrect ? "INCORRETA" : "correta"}.`;
    }
  }

  stem = stem.replace(/\s{2,}/g, " ").replace(/\s+([,.;:?])/g, "$1").trim();
  if (stem === original) return question;
  return {
    ...question,
    question: stem,
    editorial_review: {
      ...(question.editorial_review || {}),
      locator_dependency_repaired: true,
      rule: "technical_object_explicit_locator_metadata_only",
    },
  };
}
