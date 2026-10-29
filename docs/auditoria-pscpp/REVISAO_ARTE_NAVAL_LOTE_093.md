# Lote 093 — seguimento para ré e hélice dando adiante

Três novos IDs com correções bibliográficas parciais, incluindo um defeito estrutural. Uma questão do lote 092 também foi corrigida em rechecagem, sem nova contagem. Acumulado: **356 IDs únicos parcialmente corrigidos, 359 primeiras conferências parciais e zero aprovações finais**. Restam 119 defeitos estruturais, 3.193 outros IDs alertados e quatro retenções. Os 10.399 sem alerta automático não estão aprovados. As 520 decisões anteriores de duplicidade não foram recontadas.

## Base e fontes

Ambiente antigo 005 recuperado por fast-forward. Pacote 092 materializado: tamanho, SHA256 integral, CRC/SHA256 de todos os membros e trailer SHA1 do pack conferidos. Commit `00841f87cc2b4095fbd022649d3cfc6884a3d9c3` e árvore `78b0c05c4212070e69cf8c2df39805595ba45fcb` verificados. Nenhum lote refeito ou recontado; temporários preservados. HEAD remoto/PR 172 ainda em 083, `d5f13548`, aberto e draft.

Fonseca, *Arte Naval*, v. 2, 8ª ed., 2019: item 12.6.4, pp. 803–804/PDF164–165, figura 12-5; quadro de síntese p.805/PDF166. Hipóteses no item 12.6, p.798/PDF159. Texto PDF164–168 lido para limites e contexto; imagens PDF164–166 e numerais 803/804/805 conferidos. O quadro não elimina a ressalva de impossibilidade de generalização prática com leme a meio. Texto e figura em 803–804 foram distinguidos do quadro de síntese em 805. SHA256 do PDF: `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`.

A rechecagem de AN-C12-1262-M2 usa o item 12.6.2, pp.799–800/PDF160–161, figura 12-3 conferida no lote 092 e texto relido nesta rodada.

## Relatório individual

| ID | Defeito e correção concreta | Contagem | Gabarito |
|---|---|---|---|
| AN-C12-1264-M1 | Afirmações ausentes e falsas sem explicação; restaurados quatro itens sobre forças, oposição de efeitos e limite da previsão com leme a meio, com cinco justificativas. | Novo ID parcialmente corrigido | C mantido |
| AN-C12-1264-M2 | Cobrava apenas enumeração e repetia a resposta; refeito como associação dos três sentidos da popa com leme a bombordo, usando cinco combinações comparáveis e justificadas. | Novo ID parcialmente corrigido | D mantido |
| AN-C12-1264-M3 | V/F sem escopo e falsa não refutada; explicitadas as condições, a diferença entre proa/popa e a ressalva prática, substituindo recomendação de manobra por análise do modelo. | Novo ID parcialmente corrigido | E mantido |
| AN-C12-1262-M2 | Rechecagem do092: justificativas foram inseridas como alternativas e as alternativas como justificativas por troca de campos. Restauradas cinco afirmações técnicas nas opções e respectivas explicações, sem nova contagem de ID ou defeito estrutural. | Rechecagem; não recontado | C mantido |

Os três modelos 1264 usam a fonte 12.6.4 indicada acima. A questão 1262-M2 usa 12.6.2. Todos são parciais, sem aprovação final. Nos modelos 1264, as previsões foram limitadas ao estudo de um hélice de passo direito, seguimento para ré e hélice dando adiante, sem vento/corrente. Não se prescreve uma sequência universal de reversão ou força da máquina. A questão direta distingue sentidos separados da popa e não promete uma resultante operacional.

## Rechecagem e testes

Um erro de montagem do lote 092 trocou alternativas e justificativas em AN-C12-1262-M2. O conteúdo técnico estava presente, mas as opções mostravam feedback e as explicações apenas rotulavam as afirmações pretendidas. As posições dos campos foram corrigidas e as cinco opções e cinco justificativas conferidas individualmente. O contrato de hash do ID existente foi atualizado; a evidência 092 foi preservada e nenhuma nova correção acumulada ou primeira conferência foi contada para esse ID. A regressão passou a impedir feedback inicial como alternativa nas questões diretas auditadas.

Exatamente quatro deltas físicos e efetivos desde 092: três novos IDs e uma rechecagem. Nenhum ID ativo acrescentado/removido; 12.102 cadernos + 1.984 simulado = 14.086 ocorrências e 13.715 IDs. Simulado inalterado. Quatro objetos iguais ao runtime e invariantes nas transformações; políticas, filtros e flags preservados. Gerações e quatro checks, runtime, matriz 100 = 25/25/10/10/10/10/10, proveniência e catálogo passaram. Regressão: 356 deltas cumulativos, 860 proposições renderizadas e 705 opções diretas preservadas. Vetores TTFF/TTFT e direção BB/BE/BE conferidos na fonte; chaves C/D/E e C mantidas. Build Next completo: saída 0. Diff sem erros de whitespace antes do commit.

Gate executado após o inventário: 14.086 hashes conferidos, zero aceitos. Persistem ANV-0142, 77 localizadores e falha editorial. Rechecagem por avaliador independente, programa/edital oficial, calibração da dificuldade legada, prevenção semântica global e SQL/offline continuam pendentes. Três modelos por item preservados; variantes da mesma competência não devem coexistir numa prova. Compreensão cognitiva 2, sem aprovação final.

## Persistência e próximo

Commit local na branch de auditoria. Publicação pública não tentada por rejeição 084, que exige autorização explícita posterior. Sem merge/deploy. Novo pacote cumulativo criado em nome temporário, fechado/fsync e renomeado atomicamente; salvar por fluxo preparado e materializar para conferir SHA256/tamanho/membros/trailer antes de declarar persistência. Próximo: AN-C12-127-M1/M2/M3 após leitura INTEGRAL do item, figuras/quadros e elegibilidade. Experimentos históricos não autorizam generalizar números, tempos ou instruções de emergência. 1263 e125 já corrigidos, sem recontagem;11.10 SOLAS exige fonte normativa oficial própria.
