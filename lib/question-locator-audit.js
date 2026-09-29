// Audit the rendered command, not just source.locator (which is legitimate
// bibliographic metadata). Include the runtime templates that used to evade
// the old double-escaped regular expressions.
export function hasLocatorOnlyCommand(question = {}) {
  const stem = String(question.question || question.stem || '').trim();
  const runtimeTemplate = /^(?:De acordo com .+, acerca de .+, assinale a alternativa (?:que apresenta corretamente a disposição, requisito ou conceito previsto na publicação\.|(?:NÃO|EXCETO|INCORRETA), conforme solicitado\.)|Em uma situação que exija a aplicação de .+ de .+, qual alternativa apresenta a conduta, requisito ou conceito compatível com a publicação\?|Considerando os requisitos estabelecidos em .+ de .+, qual alternativa apresenta corretamente uma das disposições aplicáveis\?)$/;
  if (runtimeTemplate.test(stem)) return true;
  const targetPattern = /qual disposição (?:pertence|está expressamente associada) a\s+(?:art\.?|item|anexo|cap[ií]tulo|se[cç][aã]o)|o que se afirma corretamente em\s+(?:art\.?|item|anexo|cap[ií]tulo|se[cç][aã]o)|recorre a\s+(?:art\.?|item|anexo|cap[ií]tulo|se[cç][aã]o).+qual regra deve observar|requisitos estabelecidos em\s+(?:art\.?|item|anexo|cap[ií]tulo|se[cç][aã]o)/i;
  const explicitObject = /(?:sobre|relativo a|referente a|em relação a|que trata de)\s+(?!art\.?\s*\d|item\s*\d)[^?.:]{8,}/i.test(stem);
  return targetPattern.test(stem) && !explicitObject;
}
