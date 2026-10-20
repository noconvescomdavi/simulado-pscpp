# Auditoria de enunciados genéricos — PSCPP
Data de referência: 2026-10-20
Repositório: noconvescomdavi/simulado-pscpp
Base: main, commit 012b562b0eb6f7fec78773b339e4a53b3643e791

## Recorte identificado
No banco data/questions/manobrabilidade.json foram localizadas 2.501 questões contendo a construção `precisa ser interpretado corretamente`, dentro de 4.089 questões. São candidatas à substituição editorial, NÃO questões automaticamente inválidas.

Contagem de candidatos por fonte bibliográfica:
- Ship Resistance and Flow (Larsson & Raven): 470
- Principles of Naval Architecture, Volume II (Lewis): 467
- Standards for Ship Manoeuvrability (IMO MSC.137(76)): 460
- Principles of Naval Architecture, Volume III (Lewis): 736
- Revised guidance to the master for avoiding dangerous situations in adverse weather and sea conditions (MSC.1/Circ.1228): 368

Marcadores textuais sobrepostos:
- "Sob essa ótica": 500
- "qual leitura evita uma interpretação hidrodinâmica incorreta": 233
- "o tópico ... precisa ser interpretado corretamente": 2.501

## Critérios de produção por obra
1. Inventariar IDs, módulos, tópicos, capítulo, autor, locator, alternative, gabarito, explicação, taxonomia e rastreamento.
2. Agrupar pelo conceito avaliado, normalizando sinônimos e variantes, não apenas pelo título do tópico.
3. Conferir item do Conteúdo Programático — FINAL.pdf e delimitar o escopo bibliográfico obrigatório.
4. Conferir diretamente no exemplar correspondente da obra a definição exata, sua página/seção e edição.
5. Buscar outros conceitos, nomenclaturas e definições realmente cobertos pelo item programático e ainda não examinados; evitar redundâncias entre obras.
6. Redigir questão conceitual: "De acordo com [AUTOR], em [OBRA], o termo [TERMO] pode ser definido como: Assinale a alternativa CORRETA." Obras sem autor pessoal: citar obra/entidade.
7. Cinco alternativas (A-E), com apenas uma tecnicamente correta. Distratores semanticamente próximos, porém inequivocamente falsos na bibliografia; evitar ambiguidades e trocas de palavras que mantenham equivalência técnica.
8. Preservar IDs e rastreamento para questões reescritas. Para questões inteiramente novas, criar IDs estáveis sem colisão. Preservar toda a proveniência bibliográfica por edição e capítulo.
9. Organizar UM bloco por obra, incluindo todas as questões daquela obra a serem substituídas, com registro das excluídas/duplicadas.
10. Submeter TODOS os blocos à aprovação expressa do usuário ANTES de alterar banco runtime ou abrir merge.
11. Nenhum status "aprovado" pode ser marcado sem verificação bibliográfica e editorial individual.

## Estado deste checkpoint
- Criada branch exclusiva de auditoria.
- Detectados 2.501 candidatos em manobrabilidade e sua divisão por cinco obras.
- Conteúdo Programático localizado em Drive/Library; leitura completa item a item e bibliografias originais ainda pendentes.
- Ainda não concluída a deduplicação conceitual nem elaborados os cinco blocos. Nenhum enunciado original foi alterado.
