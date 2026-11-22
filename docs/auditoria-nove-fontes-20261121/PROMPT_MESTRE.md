# PROMPT-MESTRE — AUDITORIA PROFUNDA PSCPP (NOVE FONTES)

## Missão e prazo
Atue como auditor técnico-bibliográfico, revisor editorial e engenheiro de qualidade da plataforma ESTIBORDO/PSCPP. Audite **individualmente todas as questões relacionadas às nove referências enumeradas**, em todos os bancos canônicos, catálogos e sobreposições que efetivamente alimentam os cadernos e simulados, confronte os textos com as fontes e com o padrão das provas históricas, corrija defeitos comprovados, teste e integre na `main` somente os lotes homologados. **Início: 21/11/2026 às 23h36; prazo-alvo: 22/11/2026 às 23h59, horário America/Sao_Paulo.** Trabalhe em checkpoints persistentes, em uma execução por hora, retomando o próximo lote efetivamente pendente; as etapas são um plano de prioridade, não uma autorização para declarar revisão concluída por amostragem. Se o volume ou bloqueios impedirem a conclusão no prazo, registre quantitativamente o saldo não revisado; jamais declare conclusão fictícia.

## Recursos obrigatórios
- GitHub: `noconvescomdavi/simulado-pscpp`, base `main`; verifique o HEAD e o esquema vigente em cada execução. Bancos conhecidos em `data/questions/`: `manobrabilidade.json`, `navegacao-aguas-restritas.json`, `legislacao-regulamentacao.json`, `meteorologia-oceanografia.json`, `arte-naval.json`, `conhecimentos-gerais.json`, `comunicacoes.json`. Verifique ainda imports, patches/overrides, arquivos de seleção, runtime, catálogo, banco separado do Simulado PSCPP e eventuais fontes auxiliares. Não suponha que todos os registros de uma obra estejam em uma única matéria.
- Drive: https://drive.google.com/drive/folders/1o-LB5dP9-8e68GMjadc2jV4eGQnEPn8R?usp=sharing, inclusive subpastas. Leia `BIBLIOGRAFIA - FINAL.pdf`, `Conteudo Programatico - FINAL.pdf`, as provas escritas de 2006, 2008 e 2011, a prova e gabarito definitivo de 2012; a prova 2023 pode ser referência suplementar, sem substituir o padrão solicitado. Não confunda arquivo citado no programa com obra integral acessível.
- Referências sob auditoria:
  1. SANTOS, Edson Mesquita dos. *Princípios de hidrodinâmica e ação das ondas sobre o movimento do navio*.
  2. SANTOS, Edson Mesquita dos. *A manobrabilidade do navio no século 21*.
  3. NORMAM-311 — serviço de praticagem (identificar versão, alterações e validade aplicável).
  4. NORMAM-701 — meteorologia marítima (identificar versão, alterações e validade aplicável).
  5. FRAGOSO, Otávio; CAJATY, Marcelo. *Rebocadores portuários*, **somente capítulos 1, 2 e 3**.
  6. YNOUE, R. Y.; REBOITA, M. S.; AMBRIZZI, T.; SILVA, G. A. M. *Meteorologia: noções básicas*.
  7. LOBO, P. R. Valgas; SOARES, C. A. *Meteorologia e oceanografia*, 4ª ed.
  8. PIANC. *Use of hydro/meteo information for port access and operations*. Report 117, 2012.
  9. RIPEAM (COLREG), edição e emendas efetivamente aplicáveis.
- Caso o PDF principal de PIANC ou dos dois livros de Santos não esteja localizável ou legível, procure suas variantes/erratas nas subpastas e fontes oficiais legítimas. Não substitua por fontes secundárias sem identificar a limitação. Registre `FONTE_INDISPONIVEL`, não homologue e prossiga com as demais questões.

## Critério de identificação do escopo
Faça inventário integral por ID estável, arquivo, matéria, origem/proveniência bibliográfica, edição, capítulo/regra, título, status (ativa/inativa), SHA, hash do enunciado e campos de localização; inclua questões cuja fonte esteja ausente ou mal classificada mas cujo tema coincida com as nove referências. Diferencie presença física no repositório, presença no catálogo, elegibilidade no caderno, banco de simulados e apresentação efetiva ao aluno. Evite contagem dupla entre registros-base e cópias/overrides. Nunca altere a prova histórica original nem seu gabarito definitivo.

## Auditoria obrigatória de cada questão
1. Verificar se o enunciado é autossuficiente, tecnicamente inequívoco, gramaticalmente correto, fiel à nomenclatura da fonte e não depende de uma figura ausente ou de referências vagas ("conforme o item acima", "segundo o capítulo", "o texto diz").
2. Verificar a correspondência com a obra **efetivamente consultada**: conceito, limite, exceções, condições operacionais, unidade, termo em português/inglês, regra/artigo/capítulo, edição e página impressa + página do PDF quando distintas. Registrar trecho curto, verificável, para auditoria interna, sem copiar grandes passagens protegidas.
3. Examinar uma a uma as cinco alternativas quando o esquema da prova/banco exigir A–E. Garantir **exatamente uma** correta, distratores plausíveis, sem ambiguidade, erro de negação, duas equivalentes, pistas óbvias, ou alternativas que contradigam fatos acessórios e induzam gabarito enganoso.
4. Resolver a questão independentemente, sem confiar no gabarito gravado; confrontar gabarito, justificativa e distractores. Registrar separadamente `gabarito_original`, `gabarito_corrigido`, justificativa para a resposta certa e por que as demais estão erradas.
5. Detectar duplicação **literal, normalizada e semântica** em todos os bancos e entre fontes (não somente enunciados idênticos). Manter a questão de melhor qualidade e corrigir/reformular a recuperável para avaliar outro conceito relevante; preservar IDs e histórico do aluno. Desativação apenas quando necessária, reversível e com justificação, nunca por triagem automática isolada.
6. Auditar taxonomia: matéria, tópico, subtema, obra, capítulo/regra, tipo, dificuldade, tags, elegibilidade, seleção em cadernos/simulados e compatibilidade de JSON. Não sobrescrever registros concorrentes sem rebase e revisão.
7. Testar novamente a questão já corrigida em **segunda passagem independente** com citação bibliográfica própria. `triagem_automatica` não é `homologacao_editorial`.

## Padrão editorial exigido
**Demais oito referências:** predominância de questões de revisão conceitual, no formato `O que significa [termo]?`, `Qual definição corresponde a [conceito]?` e aplicação simples do conceito, mas com rigor, dificuldade, vocabulário e poder discriminativo comparáveis às provas oficiais do PSCPP de 2006/2008/2011/2012. Não cobrar a numeração de itens, frases decoradas, referências bibliográficas ou o título de uma página em lugar da compreensão do assunto. Evitar questões triviais, alternativas absurdas e mera troca de palavras sem mudança conceitual.

**RIPEAM:** além das definições (por exemplo, regras de navegação, alcance visual, rumos, embarcações e prioridades), auditar e produzir quando necessário questões de **situações realistas de manobra**, com navios caracterizados, visibilidade, situação de encontro/cruzamento/ultrapassagem, governo, canal estreito, esquema de separação de tráfego, luzes, marcas e sinais, deveres de vigia/velocidade de segurança/avaliação do risco, ação antecipada e substancial, obrigação de manobrar/manter rumo e velocidade, manobra em visibilidade restrita e exceções. Cada cenário deve conter dados suficientes, resposta única, regra expressamente verificada e não estabelecer uma hierarquia absoluta incompatível com as condições da regra. Não extrapolar regras para praticagem/localidade sem fonte correspondente. Comparar a estrutura e as pegadinhas técnicas legítimas das provas oficiais, mas não copiar questões protegidas.

**Preservação funcional:** não modificar a regra do Simulado PSCPP de exatamente 100 questões distribuídas 25/25/10/10/10/10/10; não introduzir conceitos equivalentes no mesmo simulado; não alterar indevidamente os demais assuntos, o progresso dos alunos, histórico, filtros e estados ativos/inativos. Mantêm-se esquemas existentes; campos adicionais apenas se suportados pelo consumidor.

## Registro de achados e correções
Em cada mudança, preservar ID original e gerar trilha auditável: ID, banco, hash/commit anterior, tema, obra/edição e página/regra/item, defeito, gravidade, enunciado/alternativas/gabarito antigos, novos, prova de unicidade de resposta, justificativa dos quatro distratores, fonte real, status de segunda revisão, evidência de testes e commit. Classificar: `APROVADA_SEM_ALTERACAO`, `CORRIGIDA_VERIFICADA`, `DUPLICADA_REFORMULADA`, `BLOQUEADA_FONTE`, `QUARENTENA_JUSTIFICADA`, `PENDENTE_REVISAO`. Não classificar pendentes como aprovadas. Exportar relatórios `.csv` e `.json` (além de um `.md` legível) e checkpoint legível por máquina.

## Processo de GitHub, testes e publicação
- Criar branch dedicada `audit/pscpp-nove-fontes-20261121` (se não existente), PR rastreável e pasta `docs/auditoria-nove-fontes-20261121/` com `PROMPT_MESTRE.md`, `CHECKPOINT.json`, `EVIDENCIAS.csv` e relatórios de lote. Antes de alterar, ler a `main` e os PRs de auditoria ativos e conciliar versões. A automação antiga `Auditar bancos do PSCPP` pode trabalhar simultaneamente: não sobrescrevê-la nem fazer merges conflitantes silenciosos.
- Processar por lotes de IDs estáveis; em toda execução, selecionar o próximo lote não homologado, comprovar a leitura completa das fontes e concluir o máximo de questões auditáveis. O tamanho real do lote depende do esforço de cotejo — não prometer 100% sem ler 100%.
- Validar JSON/schema, IDs únicos, gabarito A–E válido, resposta única, referências, contagem de questões ativas, deduplicação, seleção de cadernos, regras de Simulado PSCPP, testes de unidade, integração, build e eventual migração não destrutiva. Comparar regressões antes/depois. Abrir PR e só pedir/efetuar merge quando checks relevantes estiverem verdes, sem conflitos, com correções bibliograficamente aprovadas e sem ressalva bloqueante. A autorização do usuário para merge não revoga proteção do repositório nem qualidade.
- Após merge, verificar SHA em `main`, deploy Vercel **Production READY** no mesmo SHA (ou descendente demonstrável) e se os dados publicados aparecem no caderno. `CI verde` sozinho não equivale a correção semântica nem deploy.
- Preservar checkpoints sempre na branch e opcionalmente em Biblioteca/Drive; cada execução documenta SHA, IDs revisados, aprovados, corrigidos, suspensos, pendentes, número de edições, fontes efetivamente lidas, testes, PR, SHA do merge, estado do deploy e próximo lote. Não perder o estado anterior ou repetir trabalho.

## Plano horário prioritário (America/Sao_Paulo)
| Etapa | Execução | Entrega principal |
|---|---|---|
| 00 | 21/11 23h36 | Preflight: acesso Drive/GitHub; bancos e referências identificados; branch/checkpoint inicial |
| 01 | 22/11 00h | Extração do padrão das provas 2006/2008/2011/2012 e gabaritos |
| 02 | 01h | Inventário integral, ligação dos IDs aos bancos e consumidores |
| 03 | 02h | Versões, edição, PDF, errata, páginas e fontes pendentes |
| 04 | 03h | Santos — hidrodinâmica, lote I |
| 05 | 04h | Santos — hidrodinâmica, lote II |
| 06 | 05h | Santos — manobrabilidade, lote I |
| 07 | 06h | Santos — manobrabilidade, lote II |
| 08 | 07h | Fragoso/Cajaty — capítulo 1 |
| 09 | 08h | Fragoso/Cajaty — capítulo 2 |
| 10 | 09h | Fragoso/Cajaty — capítulo 3 |
| 11 | 10h | NORMAM-311, lote I |
| 12 | 11h | NORMAM-311, lote II |
| 13 | 12h | NORMAM-701 |
| 14 | 13h | Ynoue/Reboita/Ambrizzi/Silva |
| 15 | 14h | Lobo/Soares, 4ª edição |
| 16 | 15h | PIANC, Report 117 |
| 17 | 16h | RIPEAM — termos e definições |
| 18 | 17h | RIPEAM — luzes, marcas, sinais e aplicação das regras |
| 19 | 18h | RIPEAM — situações de manobra, lote I |
| 20 | 19h | RIPEAM — situações de manobra, lote II |
| 21 | 20h | Rechecagem cruzada das duplicidades, metadados e filtros |
| 22 | 21h | Segunda revisão independente, gabaritos, referências, regressão |
| 23 | 22h | PR, CI, build e homologação pré-merge |
| 24 | 23h | Merge se autorizado pelos gates, Vercel Production e relatório final até 23h59 |

**Regra adaptativa:** se uma fonte/etapa tiver questões além da capacidade de um lote, continuar a revisão efetiva sem afirmar que aquele livro foi totalmente auditado. Priorizar defeitos críticos e gabaritos incorretos, mas manter todos os IDs pendentes no checkpoint. Não usar o calendário para omitir etapas ou forçar merge inseguro. O deadline é uma meta, não evidência de completude.

## Saída obrigatória de cada execução
Relatar brevemente: `checkpoint`, data/hora, fontes e arquivos lidos, `SHA` da base, IDs efetivamente cotejados, quantidades corrigidas/aprovadas/pendentes e bloqueadas, evidência bibliográfica, commits/PR, testes, status Vercel, riscos e **próxima etapa exata**. No relatório final: totais por obra e disciplina, provas históricas usadas, relação completa de IDs/antes-depois, referência e justificativa de cada correção, questões de RIPEAM conceituais vs cenários, SHAs de commits/merge, versão implantada e quaisquer ressalvas não resolvidas.
