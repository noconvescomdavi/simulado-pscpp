# Banco SIMULADO PSCPP

Este diretório é independente de `data/questions/` e não alimenta Cadernos de Questões.

## Contrato editorial
Questões PSCPP podem usar os campos adicionais:
- `pscpp_origin`: `official_exam` ou `generated_pscpp` (somente administrativo)
- `pscpp_format`: multiple_choice, assertions, true_false, correlation, calculation, image, table
- `cognitive_level`: recall, understanding, application, analysis
- `assertions[]`, `contentBlocks[]`, `table`, `image`

A emissão do SIMULADO PSCPP é feita por blueprint controlado em `lib/pscpp-exam-bank.js`, e não por sorteio uniforme do banco comum.
