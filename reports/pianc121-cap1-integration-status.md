# PIANC 121 — Situação da integração e requisitos de homologação

## Resultado confirmado
- 46 questões incorporadas na branch feature/pianc121-cge-cap1-quarentena.
- Taxonomia válida: VII / Planejamento Portuário — Vias de acesso / pianc-channels / pianc-channels::ch1.
- Todas as 46 questões permanecem active=false e status=quarantined.
- Teste específico de runtime aprovado: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/38974018130
- O teste gerou 12.158 questões ativas no conjunto e confirmou zero questões PIANC deste lote no runtime ativo.

## Pendências editoriais antes da liberação
1. Confrontar individualmente os 46 enunciados, cinco alternativas, gabaritos, explicações e paginação com a PIANC 121 original.
2. Resolver a cobertura parcial de competências do § 1.3.4.3 (matriz editorial V11: quatro de onze competências avaliadas), sem alterar automaticamente a regra de uma questão por item.
3. Conservar os §§ 1.2.4–1.2.6 em quarentena para simulados técnicos por tratarem de temas histórico-administrativos.
4. Conferir possíveis duplicidades semânticas em relação às demais questões de Conhecimentos Gerais.

## Diagnóstico de CI
- Audit Main Question Banks: sucesso.
- CI: falha em test-notebook-complete-stems.mjs, arte-naval/ANV-0005 (combinação sem proposições). Arte Naval e o teste permanecem idênticos a main.
- Full Question Bank Audit: auditoria abrangente falhou com 2.752 achados.
- PSCPP Integral Bank Audit: falhou no exame global; resultados gerais não devem ser atribuídos às 46 PIANC sem análise.

Não realizar merge para main nem ativar questões até completar a homologação técnica.
