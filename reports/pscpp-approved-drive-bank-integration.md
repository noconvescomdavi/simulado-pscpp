# Preparação do banco PSCPP aprovado B001–B020

O banco específico do SIMULADO PSCPP no `main` está em `data/pscpp/`, agregado por `lib/pscpp-exam-bank.js`.

Nesta branch, o banco editorial aprovado foi preparado em `data/pscpp/approved-drive-blocks/`, com 20 arquivos de 70 questões cada.

## Validações estruturais
- 1.400 questões no conjunto B001–B020
- 20 blocos
- 70 questões por bloco
- IDs preservados
- 5 alternativas por questão
- subject normalizado para os slugs usados pelo blueprint histórico

## Compatibilidade aplicada
- `options[].letter` convertido para `options[].key`
- `statements` convertido para `assertions`
- Média/Difícil/Muito difícil convertido para `medium/hard/very_hard`
- `source_subject` normalizado
- taxonomy, tracking, source, validation e provenance preservados

## Integração
`lib/approved-pscpp-drive-blocks.js` agrega os 20 blocos.

`lib/pscpp-exam-bank.js` passa a incluir `approvedPscppDriveQuestions` em `getPscppPool()`.

A emissão permanece sob `buildHistoricalExam()`; portanto o mecanismo de seleção histórica existente não foi substituído.
