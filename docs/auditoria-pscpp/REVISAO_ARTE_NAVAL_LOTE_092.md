# Lote 092 — navio e hélice em marcha a ré

Três novas correções bibliográficas parciais, incluindo um defeito estrutural. Acumulado: **353 IDs únicos parcialmente corrigidos, 356 conferências parciais e zero aprovações finais**. Restam 120 defeitos estruturais, 3.193 outros IDs com alertas e quatro retenções. Os 10.398 IDs sem alerta automático não estão aprovados. As 520 decisões anteriores de duplicidade não foram recontadas.

## Recuperação do checkpoint anterior

O pacote 091 recuperado tinha 75.870.202 bytes e SHA256 `b3d28a06a01928b032d88b839a8deabc99fe0e36b4726417faec2c0bd4cdc44d`, divergentes dos 88.906.300 bytes e SHA256 `d00d2818affc66a75a503d11a1e700c8e8b1b2adb6b9556c67d5cf95790e4d52` registrados. Faltavam o diretório central do ZIP e o fim do bundle. A causa é desconhecida; o recibo anterior de sucesso não comprovou a recuperação integral.

A base 090 foi recuperada e verificada integralmente. Arquivos completos do prefixo 091 tiveram CRC e SHA256 conferidos. Objetos completos do pack parcial foram recuperados, sem declarar aquele pack íntegro. Os 14 blobs alterados no lote 091 foram conferidos por SHA1 Git contra a árvore original. O commit `f27c53ec2a25f07e98a4966311054c8c150eed9c` e a árvore `0cf660cd26bc93e1fea46c6752cd700cd7046010` foram recuperados exatamente e aplicados por fast-forward, preservando os temporários. Nenhuma correção foi refeita ou recontada. O procedimento está em RECUPERACAO_091_LOTE_092.json.

HEAD remoto e PR 172 conferidos em `d5f13548`, lote 083. Nenhuma publicação nova tentada.

## Fonte e relatório individual

Fonseca, *Arte Naval*, v. 2, 8ª edição, 2019: item 12.6.2, pp. 799–800 / PDF 160–161, figura 12-3; hipóteses do item 12.6, p. 798 / PDF 159. Texto PDF 159–162 lido para contexto; imagens PDF 160–161, figura e numerais 799/800 conferidos. SHA256 do PDF: `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`.

| ID | Defeito e correção concreta | Gabarito |
|---|---|---|
| AN-C12-1262-M1 | Afirmações ausentes e efeitos sem condições suficientes; restaurados quatro itens sobre leme a meio/boreste, forças opostas e esteira, com refutação das falsas. | B mantido |
| AN-C12-1262-M2 | Comando apresentava indicação de leme como regra geral e explicação repetia a resposta; refeito como análise bibliográfica de forças opostas, com cinco alternativas e sem garantia operacional. | C mantido |
| AN-C12-1262-M3 | V/F vago e falsa sem explicação; explicitadas fases de velocidade e condições do leme, refutada garantia de trajetória reta e delimitado o modelo bibliográfico. | D mantido |

A fonte acima foi verificada para cada um dos três IDs. As questões se limitam ao modelo convencional de um hélice de passo direito, com navio e hélice em ré e sem vento/corrente. A indicação de leme a boreste não foi transformada em garantia universal de trajetória reta. Não foram prescritos parada repentina de máquina nem limiares quantitativos de velocidade.

## Verificações e limites

Exatamente três deltas físicos e efetivos desde 091; nenhum ID ativo adicionado ou removido. Mantidas 12.102 ocorrências de cadernos e 1.984 de simulado: 14.086 ocorrências e 13.715 IDs únicos. Simulado inalterado. Os três objetos finais são iguais ao runtime e invariantes nas duas transformações. Políticas, filtros e flags preservados.

As quatro gerações e os quatro checks passaram. Runtime, matriz de 100 questões em 25/25/10/10/10/10/10, proveniência e catálogo passaram. Regressão: 353 deltas cumulativos, 852 proposições renderizadas e 700 opções diretas preservadas. Vetores TTFF/TTFT e unicidade B/C/D conferidos manualmente na fonte. Build Next completo: saída 0. Diff sem erros de whitespace antes do commit.

Gate executado após o inventário; seus 14.086 hashes correspondem ao runtime atual, com zero aceitos. Persistem ANV-0142, os 77 localizadores e a falha do gate editorial. Rechecagem independente, programa/edital oficial, calibração da dificuldade legada, prevenção semântica global e SQL/offline seguem pendentes. Os três modelos foram preservados; variantes da mesma competência não devem coexistir numa prova. Compreensão cognitiva 2, sem aprovação final.

## Persistência e próximo lote

Commit local na branch de auditoria. A rejeição 084 exige autorização explícita posterior para publicação pública; nenhuma tentativa equivalente foi feita. Sem merge ou deploy.

O novo pacote 092 será criado atomicamente, materializado depois de salvo e verificado integralmente antes de se declarar persistência. Ele substituirá a referência de recuperação 091 incompleta. Próximo: AN-C12-1264-M1/M2/M3, após leitura integral da fonte/figuras e elegibilidade. Os itens 1263 e 125 já foram corrigidos e não devem ser recontados. A família 11.10 SOLAS exige conferência normativa oficial própria.
