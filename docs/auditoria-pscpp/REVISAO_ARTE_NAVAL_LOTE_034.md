# Lote 034 — içadores mecânicos de prático

Base remota 8509400ca3073a64111505f41f7c9425b9a73c15; PR #172 aberto/draft.
HEAD remoto consultado e fast-forward de árvore rastreada limpa antes da edição.
CHECKPOINT.json e relatório 033 lidos. Nenhum lote anterior refeito; temporários
preservados. A ferramenta de processos retornou erro de enumeração, portanto
não se afirma inspeção global de processos. Não havia mudanças rastreadas de
outro escritor. Publicação somente com expected_sha, sem force, se o mesmo
HEAD continuar remoto. Prompt-Mestre e benchmark mantidos.

## Fonte primária e revisão normativa delimitada

PDFs obtidos diretamente da IMO em 22/10/2026; URLs, bytes e SHA256 em
EVIDENCIA_NORMATIVA_034.json, sem publicação dos PDFs completos.

- A.1045(27), adotada 30/11/2011: anexo seção 4, p. 4/PDF 5, e dispositivo
  operativo 3, página inicial da resolução/PDF 2. Essa página inicial não tem
  numeral impresso; p. 1 no locator é inferida pela sequência que segue com
  p. 2/PDF 3. Fonte da proibição: seção 4 com numeral 4 explícito. Texto e ambas
  as imagens conferidos. SHA256 d5c0bfb3fad8bd548669e7953669129da8261ed64a69d8b10b54a6181d4c3578.
- A.1108(29), adotada 02/12/2015: texto extraído integral e imagem do anexo,
  p. 2/PDF 3, conferidos. Altera5.1/5.2 de acesso ao convés; não altera seção 4.
  SHA256 827e3c56017f9c759ec3774447b91a3aef0e47c5899c14e2e60b0642c4ab7275.
- MSC.572(110), adotada 26/06/2025: dispositivos operativos 2/3, PDF 2, e futura
  redação V/23.10, p. 3/PDF 4, texto/imagens conferidos. Prevê entrada em vigor
  em 01/01/2028, condicionada à aceitação no procedimento indicado. Proibição
  também consta da redação futura; não se trata essa redação como já vigente.
  SHA256 c7c5f8037bef3677ace13bed04a6365b586985267afda5c4ccd4fe774f9ec5a3.

As perguntas são expressamente limitadas à Resolução A.1045(27) e à proibição
nela descrita, sem certificar SOLAS consolidada, todas as revisões atuais ou
alinhamento com edital-alvo ainda não identificado. Nenhuma premissa depende
dos detalhes de MSC.576(110), cuja íntegra não foi auditada neste lote.
Correspondência binária com cópias Drive não foi demonstrada nem presumida.
Os números de 6 m/navios menores que 90 m, antes usados no distrator III, pertencem
a outro assunto: foram retirados, sem converter seu antigo uso fora de contexto
em aprovação normativa dessa regra dimensional.

## Relatório por questão

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0147 | A restauração prevalente misturava definições de assuntos distintos e recebia answer-leak-v1, que apagava I–IV, deixando conjuntos sem proposições. | Reescritas quatro proposições sobre a vedação e as falsas permissões por supervisão, escada paralela ou teste. Explicação e cinco justificativas específicas; referência, páginas, URL, hash e limites de versão. Carregamento preserva o objeto integral. | A.1045(27), anexo seção 4, p. 4/PDF 5; dispositivo operativo 3/PDF 2; A.1108(29) e MSC.572(110) como confrontos de versão | B mantido; F/V/F/V |
| ANV-0845 | Pergunta por definição era convertida em comando bibliográfico genérico; os distratores eram objetos heterogêneos de outros arranjos. | Novo cenário de transferência, cinco decisões paralelas e justificativas individuais. Teste, oficial, escada disponível e consentimento não criam as permissões sugeridas. Fonte exata e limites adicionados; texto preservado no runtime. | Mesmos localizadores | E mantido |

Duas correções primárias parciais; nenhuma aprovação editorial final.
ANV-0147 passa de Difícil a Médio/L2 proposto, pela compreensão da vedação;
ANV-0845 mantém Médio, com L3 proposto pela aplicação a um cenário explícito.
Sem alegação de calibração psicométrica/histórica. Formatos B/A, IDs, conceitos,
keys e cinco letras A–E preservados. Sem cálculos nem figura necessária ausente.

## Julgamento ANV-0147

I falsa: acompanhamento por oficial não afasta a proibição. II verdadeira:
vedação expressa. III falsa: escada paralela não autoriza o içador. IV verdadeira:
teste satisfatório não cria exceção. As condições propostas são hipóteses dos
distratores, não regras atribuídas à IMO. Aplicação lógica de disposição sem
essas ressalvas; não se transcreveu uma regra sobre ensaios que não existe.

| Opção | Conjunto | Julgamento |
|---|---|---|
| A | III/IV | III falsa; falta II |
| B | II/IV | Único conjunto completo de verdadeiras |
| C | II/III | III falsa; falta IV |
| D | I/III | Ambas falsas; faltam II/IV |
| E | I/IV | I falsa; falta II |

## Julgamento ANV-0845

| Opção | Julgamento |
|---|---|
| A | Teste recente não autoriza a transferência pelo içador |
| B | Supervisão por oficial não autoriza a transferência pelo içador |
| C | Escada paralela não autoriza a transferência pelo içador |
| D | Concordância do prático não autoriza a transferência pelo içador |
| E | Única compatível com a vedação; rejeitar o içador não certifica a conformidade de outro meio |

## Precedência, identidade e evidências de integração

ANV-0147 prevalece na restauração old-247 já efetiva antes deste lote.
Principal concorrente 0147 sobre dimensões do degrau permanece integralmente
inalterado. Não se inferiram flags ausentes, trocaram competências ou ativaram
novas versões. ANV-0845 prevalece no principal. Nenhum dos dois consta de
notebook-complete-stems. Busca no runtime por old-247 encontrou essas duas
variantes, lidas individualmente; elas não devem coexistir na mesma prova.
Busca por código não prova inexistência de variantes com outras tags. Revisão
semântica global e prevenção de coexistência continuam pendentes. Nenhum ID
ou modelo criado/removido; regra específica de três modelos por item preservada.

auditQuestion sem achados, política ativa e transformações preservando ambos
os objetos integralmente antes da geração. Igualdade completa fonte/runtime
depois da geração. Nenhum normalizador/filtro/gate relaxado. Contrato direto
apenas +0845. Hashes em CORRECOES_RUNTIME.json; duas conferências em JSONL.
Testes e resultados reais em TESTES_E_EVIDENCIAS.md.

Acumulado: 68 correções distintas, 71 conferências bibliográficas parciais e
ZERO aprovações finais. Rechecagem independente, programa/edital oficial,
inventário completo de revisões normativas, cobertura, estados, semântica e
offline/produção pendentes. Par 0142/0840 e demais achados anteriores mantidos,
sem recontagem. Oito gates pendentes/falhos. Sem merge/deploy/dados de usuários.
