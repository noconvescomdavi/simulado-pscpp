# Contrato Mestre de Rastreabilidade — Banco de Questões ESTIBORDO

## Objetivo
Este contrato é o padrão canônico para TODAS as matérias. O conteúdo das questões continua nos arquivos `data/questions/*.json`; a rastreabilidade permite filtrar, medir cobertura e ligar Plano de Estudos → Caderno de Fixação.

## Regra central
IDs são chaves de sistema e não devem depender do texto visível. Textos podem ser corrigidos; IDs permanecem estáveis.

## Modelo v2 por questão
```json
{
  "id": "MAN-0001",
  "subject": "I — Manobrabilidade do Navio",
  "module": "Forças que atuam no navio",
  "topic_code": "MAN.01.01",
  "topic": "Efeito do vento",
  "difficulty": "Médio",
  "style": "Aplicada",
  "question": "...",
  "options": [{"key":"A","text":"..."}],
  "correct_answer": "A",
  "explanation": "...",
  "taxonomy": {
    "subject_id": "I",
    "subject_slug": "manobrabilidade",
    "bibliography_id": "crenshaw-naval-shiphandling",
    "chapter_id": "crenshaw-naval-shiphandling::ch2",
    "topic_id": "MAN-CRENSHAW-CH02-WIND",
    "subtopic_id": null
  },
  "source": {
    "author": "...",
    "title": "Naval Shiphandling",
    "edition": "4th",
    "locator": "Chapter 2"
  },
  "tags": ["vento","forcas-externas","manobrabilidade"]
}
```

## Campos obrigatórios da taxonomia
- `subject_id`: I a VII.
- `subject_slug`: slug canônico do banco.
- `bibliography_id`: deve existir na taxonomia oficial.
- `chapter_id`: `bibliography_id::section_key`, exatamente como definido na bibliografia.
- `topic_id`: ID estável e único do assunto dentro da taxonomia. Não usar texto livre como chave.
- `subtopic_id`: opcional; usar quando a granularidade justificar.

## Fonte x taxonomia x tags
- **taxonomy** é usada por filtros, plano, cobertura e cadernos. É determinística.
- **source** é a referência bibliográfica auditável.
- **tags** servem apenas à busca flexível. Tags NÃO substituem taxonomy.

## Filtros oficiais
A UI/API deve suportar em cascata:
`matéria → publicação → capítulo/seção → assunto → subassunto → dificuldade → estilo`.

## Compatibilidade
Questões legadas sem `taxonomy` continuam carregando durante a migração. O relatório as marca como `LEGACY`. Bancos novos/atualizados devem usar v2.

## Cobertura
Meta administrativa recomendada: 25–50 questões por capítulo/assunto, sem duplicação artificial. O painel deve distinguir:
- 0 = crítico
- 1–24 = insuficiente
- 25–50 = alvo
- >50 = cobertura ampla

## Proibições
- não inferir capítulo em runtime por similaridade textual quando `taxonomy.chapter_id` existir;
- não criar IDs diferentes para o mesmo capítulo em matérias distintas;
- não alterar IDs depois que uma questão tiver histórico de aluno;
- não usar página de PDF como único identificador de conteúdo;
- não expor `correct_answer`, `explanation` ou `source` antes da resposta.

## Migração
1. preservar IDs atuais das questões;
2. acrescentar `taxonomy`;
3. validar `bibliography_id/chapter_id` contra o catálogo;
4. gerar relatório de cobertura;
5. somente depois habilitar filtros v2 como padrão.
