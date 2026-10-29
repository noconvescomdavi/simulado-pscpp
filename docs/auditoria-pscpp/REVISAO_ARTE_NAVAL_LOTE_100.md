# Lote 100 — preparação naval para atracação e desatracação

Seis novos IDs parcialmente corrigidos,dois defeitos estruturais e dois alertas específicos de um outro ID resolvidos. Acumulado: **398 IDs únicos parcialmente corrigidos,401 primeiras conferências parciais,zero aprovações finais**. Restam106 defeitos estruturais,3.190 outros IDs alertados,quatro retenções;10.415 sem alerta automático não aprovados. Nenhuma recontagem de094/096,520decisões antigas,15repetições090 ou rechecagem093.

## Base e fonte

Recuperado099 íntegro:177.570.562bytes,SHA256801b61482bed68fac7bf442cc3d01cc0c69962a8ccc7a8cf554cc6c7900ebecd. CRC/SHA256 de todos os membros,MANIFEST,trailerPACK,bundle e HEAD6b8bef4c/árvore5c7aaea5 exatos. Fast-forward preservou temporários,sem refazer/recontar. PR172 aberto/draft e remoto083 d5f13548 conferidos antes de editar;nenhuma publicação tentada. Lock próprio100 e ausência de outra execução verificados.

Fonseca,*Arte Naval*,v.2,8ªed.,2019:item12.21,p.820/PDF181;12.22,p.821/PDF182. Lidos integralmente os onze subitens de cada lista em texto e imagem,numerais e fronteiras conferidos. TextoPDF180–184 lido para contexto,sem contar seções seguintes como revisão. Alvos sem figuras/quadros. **12.21 termina inteiro na p.820**;localizador820–821 corrigido nos três modelos. HashPDF6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1;hashes dos recortes/texto emEVIDENCIAS_LOTE_100.json. Livro não alterado;identidade oficial/programa ainda não homologados.

## Relatório individual

| ID | Defeito e correção concreta | Fonte verificada | Gabarito |
|---|---|---|---|
| AN-C12-1221-M1 | Proposições ausentes do runtime, falsas sem refutação e escopo naval omitido. Restaurados quatro itens sobre coordenação, ambiente, ferro e comunicações; referência reduzida à p.820. | cap. 12, item 12.21, p. 820/PDF181 | C mantido |
| AN-C12-1221-M2 | Comando genérico ou explicação mínima e alternativas heterogêneas. Comando autossuficiente e cinco pares comparáveis de posição do ferro e das defensas, com justificativas; referência corrigida. | cap. 12, item 12.21, p. 820/PDF181 | D mantido |
| AN-C12-1221-M3 | Contexto naval omitido e falsa sem refutação individual. Delimitados procedimento naval, bordo do Oficial de Segurança, defensas e coordenação; falsas explicadas; referência corrigida. | cap. 12, item 12.21, p. 820/PDF181 | E mantido |
| AN-C12-1222-M1 | Proposições ausentes do runtime, falsas sem refutação e escopo naval omitido. Restaurados quatro itens sobre coordenação, retirada de acessórios, condição para balanceamento e testes sonoros. | cap. 12, item 12.22, p. 821/PDF182 | A mantido |
| AN-C12-1222-M2 | Comando genérico ou explicação mínima e alternativas heterogêneas. Cinco relações comparáveis entre condição e autorização do balanceamento; explicitados caráter eventual e verificação prévia da popa. | cap. 12, item 12.22, p. 821/PDF182 | B mantido |
| AN-C12-1222-M3 | Contexto naval omitido e falsa sem refutação individual. Delimitadas verificações prévias, acerto de relógios, equipamentos de comunicação e pronto ao Imediato, com refutação. | cap. 12, item 12.22, p. 821/PDF182 | C mantido |

As quatro proposições,cinco alternativas e cinco justificativas de cada questão foram conferidas individualmente. M1VVFF resolveC/A;M3VVFV resolveE/C.1221M2D=BB/BE,na ordem ferro/defensas,para atracaçãoBE;legenda explícita evita inferência de sentidos.1222M2B=quando necessário/após verificar popa clara. Nenhuma troca de alternativas/justificativas;chaves preservadas após leitura e solução única. Todos seis compreensão2,dificuldade legada não aprovada.

As funções militares e listas de preparação são do contexto naval da obra,não obrigações legais universais ou organização de todo navio civil. Ferro pronto para largar não significa largada obrigatória. O balanceamento é eventual,com verificação prévia da popa clara. Questões interpretam relações bibliográficas,sem autorizar execução de manobra real,fixar regimes ou oferecer sequência operacional completa.

## Alertas e testes

Os dois M1 tinham proposições ausentes no runtime.1221M2 tinha LOCATOR_OR_GENERIC_COMMAND e SAME_STEM_OTHER_ID com1221M1:comando técnico estável,fonte individual,enunciados finais distintos e cinco pares justificados. Resolvidos somente esses dois alertas desse ID,3191→3190;nenhuma prevenção semântica global ou aprovação final. Decisões,hashes e sinais anteriores emREVISOES_ALERTAS_LOTE_100.json.

Primeiro draft falhou na regressão:comando após os itens V/F impedia o parser de reconhecer as quatro proposições. Comando movido para antes dos itens nos dois M3;nenhum filtro,política ou flag afrouxado. Geração completa,checks e build refeitos após a correção. Logs da falha e do build anterior preservados nas evidências,não apresentados como validação final.

Verificação final:exatamente seis deltas físicos/efetivos,sem adicionar/remover IDs ativos.12.102cadernos+1.984simulado=14.086ocorrências,13.715IDs;simulado inteiro inalterado. Todos seis objetos finais iguais ao runtime,invariantes nas duas transformações. Regressão398deltas cumulativos/972proposições/775opçõesdiretas passou;runtime,matriz100=25/25/10/10/10/10/10,proveniência,catálogo,quatro gerações e quatro checks passaram. BuildNext completo em cache limpo saída0;cache anterior preservado por renomeação audit-private/next-cache-before100 e cache do primeiro draft preservado separadamente.

Falhas reais:stems1 porANV0142,localizadores1 por77pendências,gate2 com0aceitos/14.086pendentes. Gate após inventário completo,todos14.086hashes conferidos contra inventário atual. Todos oito gates pendentes/falhos. Rechecagem por outro avaliador,edição/programa oficial,dificuldade,diversidade/cobertura semântica global,SQL/offline e demais disciplinas pendentes. Variantes próximas não homologadas para coexistir na mesma prova. Inativos127M1/M2 e1219M1 preservados literalmente e ausentes antes/depois,sem contagem.

## Persistência e continuação

Sem publicação pública,merge ou deploy. Rejeição084 exige autorização explícita posterior antes de nova tentativa;trabalho local autorizado continua. Pacote100 cumulativo com todos os commits084–100 e evidências,sem livros/temporários parciais,lista explícita de membros. ZIP temporário fechado/fsync,renomeado atomicamente antes do fluxo preparado;materializar arquivo salvo e conferir tamanho/SHA256,CRC/SHA256 de todos os membros,MANIFEST,HEAD/árvore,trailerPACK e bundle antes de declarar durável. ZIP091 antigo incompleto não deve ser usado;commit original recuperado092 está no cumulativo.

Próximo1223M1/M2/M3,depois12231,após leitura integral,figuras/quadros e elegibilidade atual. Ambos os grupos presentes e ainda não contados na pré-checagem100.125/1263/1215 já corrigidos,não recontar. Alerta098 de frase ambígua12.16p817/PDF178 mantido;errata não obtida,não inferir correção.11.10SOLAS exige fonte normativa oficial própria;ANV0142 e77localizadores permanecem bloqueados/pendentes.
