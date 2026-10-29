# Contrato das revisões e bloqueio de liberação

Cada linha de `REVISOES_EDITORIAIS.jsonl` registra uma revisão efetivamente concluída,
identificada por `consumer`, `id` e `hash` do inventário efetivo. Não preencher com
aprovações automáticas, flags históricas do banco ou referências não consultadas.

Campos exigidos: `reviewer`, `reviewed_at`, `concept`, `format` (A-E),
`cognitive_level` (L1-L4), `verdict`, `rationale`, `primary_sources` (lista com
`title`, `edition`, `locator`, `sha256`, `supports_answer`),
`alternative_rationales` (A-E), `unique_answer_verified`,
`program_alignment_verified`, `independent_recheck`.

O hash é SHA-256 do objeto completo com chaves ordenadas recursivamente,
incluindo os dados após restaurações/normalizações. Alterações invalidam a
aprovação anterior. Uma ocorrência de ID em outro consumidor requer evidência
que se aplique explicitamente à versão daquele consumidor.

Executar `node scripts/validate-pscpp-editorial-evidence.mjs`. Saída 2 significa
revisão ausente/incompleta. O script apenas verifica completude da trilha;
a existência de campos preenchidos não prova a correção das afirmações.
Não substitui a leitura e a conferência primária, nem autoriza merge.

O ledger começa vazio porque nenhuma questão recebeu ainda a revisão integral
exigida nesta nova auditoria. Não confundir inventário com revisão aprovada.

Os inventários volumosos são versionados como `.csv.gz` e `.jsonl.gz`, sem
perda de conteúdo. Descompactar antes de abrir no Excel ou de processar o CSV.
As cópias CSV expandidas são saídas locais regeneráveis, não fontes de verdade.
