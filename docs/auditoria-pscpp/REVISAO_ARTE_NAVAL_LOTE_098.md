# Lote 098 — dois lemes e arranjos de três/quatro hélices

Seis novos IDs com correções bibliográficas parciais, incluindo dois defeitos estruturais. Acumulado: **384 IDs únicos parcialmente corrigidos, 387 primeiras conferências parciais e zero aprovações finais**. Restam 110 defeitos estruturais, 3.191 outros IDs alertados e quatro retenções. Os 10.410 sem alerta automático não estão aprovados. Nenhuma nova baixa dos outros IDs, nem recontagem das 520 decisões de cópia, decisões094/096, repetidos090 ou rechecagem093.

## Base e fontes

Ambiente005 recuperado por fast-forward a partir do pacote097, integralmente conferido:155.462.143bytes, SHA256 `7312cd870a6ed78e5482e8545b1d1d7b3736b62805b10dcc640b1e2cffdf38a9`, CRC/SHA256 de todos os membros, trailerPACK e bundle. HEAD `d9a041472086d78ea01f5b87ff5eff5b480d0603`, árvore `2a5aa8693942b3afc75167378d08d42c228327e5` exatos. Nenhum lote refeito/recontado; temporários preservados, lock próprio098 utilizado. Remoto/PR172 conferidos em083 `d5f13548`, aberto/draft. Publicação não tentada.

Fonseca, *Arte Naval*, v.2, 8ªed.,2019:12.16, pp.815–817/PDF176–178, figuras12-9,12-10,12-11;12.17, pp.817–818/PDF178–179. TextoPDF176–181 lido integralmente para contexto; imagens176–179 e numerais815/816/817/818 conferidos. A figura12-9 compara leme central e dois lemes alinhados; a12-10 inclui a força5 do lemeBB, visível na imagem e ausente da extração; a12-11 contém oito combinações e hipótese inicial de repouso. Não foram medidos vetores ou inferidos números dos desenhos. SHA256 do PDF `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`. Leitura dos itens seguintes não contada como revisão.

## Relatório individual

| ID | Defeito e correção concreta | Fonte verificada | Gabarito |
|---|---|---|---|
| AN-C12-1216-M1 | Afirmações ausentes no runtime;restaurados quatro itens sobre posição dos lemes,descarga e predominância do hélice adiante,com refutação das falsas. | 12.16,pp.815–817/PDF176–178;fig.12-9/10/11 | C mantido |
| AN-C12-1216-M2 | Configuração não definida e explicação repetitiva;comparação autossuficiente,cinco relações homogêneas entre posição e escoamento,justificadas. | 12.16,pp.815–817/PDF176–178;fig.12-9/10/11 | D mantido |
| AN-C12-1216-M3 | V/F sem limites e indicação de giro generalizada;predominância lateral e hipóteses vetoriais explicitadas,sem receita de RPM/ângulo ou garantia de giro sobre um ponto. | 12.16,pp.815–817/PDF176–178;fig.12-9/10/11 | E mantido |
| AN-C12-1217-M1 | Afirmações ausentes e emprego atual generalizado;restaurados itens sobre comparação técnica/custo,agrupamentos e par externo,sem inventário contemporâneo da frota. | 12.17,pp.817–818/PDF178–179 | A mantido |
| AN-C12-1217-M2 | Explicação mínima e alternativas heterogêneas;cinco pares comparáveis de posição/geometria,com justificativas individuais. | 12.17,pp.817–818/PDF178–179 | B mantido |
| AN-C12-1217-M3 | V/F com afirmação temporal de não emprego;substituída por conteúdo verificável sobre passo,eficácia geométrica e agrupamentos,com falsa refutada. | 12.17,pp.817–818/PDF178–179 | C mantido |

Todos os quatro itens e cinco alternativas/justificativas de cada modelo foram conferidos. M1=VVFF resolveC/A; M3=VVFV resolveE/C.1216M2D associa posicionamento na descarga ao aumento de ação;1217M2B relaciona externos ao maior afastamento da quilha. Chaves mantidas após conferência primária e resolução única, sem fabricar conteúdo a partir do gabarito ou trocar campos. Todos classificados como compreensão2; dificuldade legada não homologada.

O arranjo de dois lemes diretamente nas descargas é distinto do leme central estudado anteriormente. A afirmação de giro sobre a quilha não foi usada como garantia universal nem convertida em receita de RPM/ângulo. As hipóteses da construção vetorial foram explicitadas. Em12.17, retiradas as afirmações de não emprego atual de três hélices; permanece o confronto técnico da edição, sem inventário contemporâneo ou inferência de prevalência na frota. As questões são autossuficientes, sem depender de imagens ausentes.

**Alerta bibliográfico preservado:** p.817/PDF178, primeiro parágrafo12.16: a comparação de intensidade contém repetição textual sobre marcha simultânea, confirmada na imagem. Não foi suposta uma correção nem adotada uma desigualdade física como premissa. A frase aguarda rechecagem/errata; os trechos inequívocos dão suporte às correções parciais. Livro original não alterado.

## Verificação e limites

Exatamente seis deltas físicos e efetivos desde097, nenhum IDativo adicionado/removido:12.102cadernos+1.984simulado=14.086ocorrências,13.715IDs. Todos seis objetos finais iguais ao runtime e invariantes nas duas transformações; filtros,políticas e flags preservados, três modelos físicos por item. Quatro gerações e quatro checks,runtime,matriz100=25/25/10/10/10/10/10,proveniência e catálogo passaram. Regressão:384deltas cumulativos,936proposições renderizadas,750opções diretas. BuildNext completo em cache limpo, saída0; cache anterior preservado por renomeação audit-private/next-cache-before098.

Falhas reais mantidas:stems sai1 porANV0142,localizadores sai1 por77pendências,gate sai2 com0aceitos/14.086pendentes. Gate após inventário; todos14.086hashes conferidos contra o inventário atual. Logs completos emEVIDENCIAS_LOTE_098.json. Rechecagem por outro avaliador, programa/edição oficial, cobertura/diversidade semântica global,dificuldade,SQL/offline e demais disciplinas pendentes; oito gates não aprovados. Os três modelos de uma competência não estão homologados para coexistir numa prova.

## Persistência e continuação

Commit local na branch de auditoria. Publicação pública não tentada pela rejeição084, que exige autorização explícita posterior. Sem merge/deploy. Pacote098 cumulativo com lista explícita de membros, sem livros/temporários, ZIPtemporário fechado/fsync e renomeado atomicamente antes do fluxo preparado. Materializar salvo para confrontar tamanho/SHA256 integral,CRC/SHA256 de todos os membros,MANIFEST,HEAD/árvore e trailerPACK antes de declarar durável. Não usar ZIP091 antigo,incompleto; commit/árvore originais estão no cumulativo.

Próximo1218-M1/M2/M3 após fonte integral e elegibilidade; depois1219. Pré-checagem de presença:1219M1 já ausente do runtime, sem revisão/correção contada e sem autorização para reativação automática.1215/1263/125 já corrigidos,127M1/M2 inativos preservados.11.10SOLAS requer fonte normativa oficial;ANV0142 e77localizadores continuam pendentes.
