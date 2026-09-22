# Banco SIMULADO PSCPP

Este diretório é independente de `data/questions/` e não alimenta Cadernos de Questões.

## Contrato editorial
Questões PSCPP podem usar os campos adicionais:
- `pscpp_origin`: `official_exam` ou `generated_pscpp` (somente administrativo)
- `pscpp_format`: multiple_choice, assertions, true_false, correlation, calculation, image, table
- `cognitive_level`: recall, understanding, application, analysis
- `assertions[]`, `contentBlocks[]`, `table`, `image`

A emissão do SIMULADO PSCPP é feita por blueprint histórico controlado em `lib/pscpp-exam-bank.js`. A composição por matéria reproduz a incidência observada nas 254 questões válidas das provas oficiais de 2006, 2008, 2011 e 2012; questões anuladas não entram na estatística. A seleção dentro de cada estrato varia por emissão, mas não existe sorteio uniforme do banco.


## Banco aprovado B001–B020
As 1.400 questões aprovadas do banco editorial PSCPP estão em `data/pscpp/approved-drive-blocks/`, divididas em 20 arquivos de 70 questões.

A normalização para o simulador aplica:
- `source_subject` conforme os slugs do blueprint histórico;
- alternativas `{ key, text }`;
- `statements` como `assertions`;
- dificuldade `medium/hard/very_hard`;
- preservação de taxonomy, tracking, source e validation.

O agregador é `lib/approved-pscpp-drive-blocks.js` e o pool é incorporado exclusivamente por `lib/pscpp-exam-bank.js`.
