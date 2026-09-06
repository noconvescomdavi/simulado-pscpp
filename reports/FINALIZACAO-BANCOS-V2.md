# Fechamento — Bancos de questões V2

Este arquivo registra o estado de fechamento da branch `feat/bancos-v2-todas-materias-20260905` antes da integração em `main`.

## Resultado

- Taxonomia V2 aplicada aos bancos de Manobrabilidade, Navegação em Águas Restritas, Legislação e Regulamentação, Meteorologia e Oceanografia, Comunicações e Conhecimentos Gerais.
- Arte Naval preservada como banco de referência, sem expansão de conteúdo nesta etapa.
- Total estrutural validado: **10.697 questões**.
- Cobertura mínima de 25 questões concluída em todas as unidades para as quais havia fonte verificável disponível no conjunto de trabalho.
- Unidades ainda abaixo do piso foram classificadas como `fonte_pendente`; nenhuma questão foi criada atribuindo conteúdo a obra não disponível.

## Totais finais

| Matéria | Questões | Déficits acionáveis | Fontes pendentes |
|---|---:|---:|---:|
| Manobrabilidade do Navio | 3.742 | 0 | 12 unidades |
| Arte Naval | 1.150 | — | — |
| Navegação em Águas Restritas | 1.640 | 0 | 5 unidades |
| Legislação e Regulamentação | 1.110 | 0 | 0 |
| Meteorologia e Oceanografia | 1.005 | 0 | 6 unidades |
| Comunicações | 1.050 | 0 | 0 |
| Conhecimentos Gerais | 1.000 | 0 | 34 unidades |

## Fontes pendentes registradas

- Manobrabilidade: unidades das obras catalogadas como `santos-manobrabilidade` e `santos-hidrodinamica`.
- Navegação em Águas Restritas: *Navegação Integrada*, de Carlos Norberto Stumpf Bento, e publicação catalogada como `nav-doc-6`, para a qual a revisão requerida não estava disponível no pacote verificado.
- Meteorologia e Oceanografia: publicação `met-2` e PIANC hidrometeorológico (`pianc-hydromet`).
- Conhecimentos Gerais: PIANC (`pianc-channels`), Livingstone, Stopford e Pimenta.

## Validações

A branch foi submetida ao fluxo `npm run validate`, que encadeia:

1. higiene do repositório;
2. validação estrutural dos bancos;
3. validação da taxonomia mestre;
4. validação específica de Arte Naval; e
5. `next build`.

O workflow **Final Banks V2 Validation** concluiu com sucesso antes da integração.
