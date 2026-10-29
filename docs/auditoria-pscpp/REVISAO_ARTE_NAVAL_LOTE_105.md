# Lote 105 — espaço limitado e mudança do bordo de atracação

Seis novos IDs ativos parcialmente corrigidos, incluindo dois defeitos estruturais. Acumulado: **427 IDs únicos parcialmente corrigidos,430 primeiras conferências parciais,zero aprovações finais**. Restam96 defeitos estruturais,3.189 outros IDs alertados e quatro retenções;10.426 IDs sem alerta automático não estão aprovados. Nenhuma recontagem de decisões094/096/100/101,520decisões antigas,15repetições090 ou rechecagem093.

## Base e fonte

Ambiente005 recuperado por fast-forward até104: pacote233.590.954bytes,SHA2569debbaa2e1db6eaab33117782fd5a3d35ebdf14c631c202e6c68a44e0373a79e. Tamanho/SHA256 integral,CRC/SHA256 de todos os membros,MANIFEST,PACKtrailer,bundle,HEADf539db8c e árvorec4c66989 exatos. Nenhum lote refeito/recontado; alterações e temporários preservados. PR172 aberto/draft e remoto083d5f13548 conferidos antes de editar; publicação não tentada. Lock próprio105.

Fonseca,*Arte Naval*,v.2,8ªed.,2019: **12.31,pp.832–833/PDF193–194,figura12-17;12.32,pp.833–834/PDF194–195,figura12-18**. Seções completas em texto/imagem,fronteiras e numerais832/833/834 conferidos. TextoPDF193–196 para contexto;12.33/12.33.1 não contados nesta rodada. JPEGs fechados/fsync,carregados integralmente porPillow e inspecionados visualmente. Figura12-17 representa duas posições de aproximação entre dois navios com espia pela bochecha;12-18 representa três posições,espias e corrente na mudança de bordo. Não foram medidas escalas,cargas,velocidades ou capacidades pelas figuras. Nenhuma questão depende de figura ausente. HashPDF6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1;hashes do texto/JPEGs nas evidências. Proveniência oficial e alinhamento ao edital ainda não homologados.

## Relatório individual

| ID | Defeito e correção concreta | Fonte verificada | Gabarito |
|---|---|---|---|
| AN-C12-1231-M1 | Proposições ausentes no carregamento e falsas sem refutação. Restaurados quatro itens sobre espaço restrito,espias,porte e ambiente; refutadas exclusão das espias e dispensa de rebocador,com cinco justificativas. |12.31,pp.832–833/PDF193–194|A mantido|
| AN-C12-1231-M2 | Pergunta prescritiva,distratores heterogêneos e explicação repetitiva. Criados cinco pares comparáveis de prioridade da espia/auxílio,com dois cenários e ordem explícitos,individualmente justificados. |12.31,pp.832–833/PDF193–194|B mantido|
| AN-C12-1231-M3 | V/F sem escopo suficiente e falsas apenas repetidas. Delimitados porte,transporte das espias e exemplo da figura12-17,com refutação da dispensa das espias e cinco justificativas. |12.31,pp.832–833/PDF193–194,fig12-17|C mantido|
| AN-C12-1232-M1 | Proposições ausentes e cenário não delimitado. Restaurados quatro itens distinguindo preferência por rebocador,direção da corrente,par de espias e defensas; falsas explicadas. |12.32,pp.833–834/PDF194–195|D mantido|
| AN-C12-1232-M2 | Comando prático sem escopo,distratores heterogêneos e explicação mínima. Criados cinco pares comparáveis de condição de maré/intensidade de corrente,com justificativas individuais e limite bibliográfico. |12.32,pp.833–834/PDF194–195|E mantido|
| AN-C12-1232-M3 | Generalização do governo e falsa sem refutação. Diferenciados pares de espias para corrente pela proa/popa e precauções com defensas/hélices; retirada certificação geral de giro/governo. |12.32,pp.833–834/PDF194–195,fig12-18|A mantido|

M1VVFF resolveA/D;M3VVFV resolveC/A.1231M2B=Vante/rebocador,na ordem cenário de vento vindo do cais/cenário de vento ou corrente forte pela popa.1232M2E=maré favorável/corrente muito fraca,na ordem explicitada. Quatro proposições quando aplicável,cinco opções e cinco justificativas por questão conferidas individualmente; nenhum campo de feedback usado como alternativa. Gabaritos mantidos após fonte e solução única. Comandos V/F antes dos quatro itens,preservando o parser. Compreensão2 atribuída;calibração cognitiva independente e dificuldade legada não aprovadas.

As passagens são descrições condicionadas da edição,sem prescrição operacional universal,autorização prática ou regra legal atual. Não certificada a explicação simplificada de resistência ao vento/água como lei de qualquer navio,nem facilidade universal com rebocador ou giro sobre ponto fixo. Sem rebocador,as condições ambientais citadas não são garantia suficiente para uma operação real. Não prescritos velocidade,ângulo,potência,RPM,tensão,carga ou sequência atual de emergência. As advertências e proteções da obra foram preservadas em seu contexto.

## Verificação e pendências

Exatamente seis deltas físicos e efetivos desde104;nenhum ID ativo acrescentado/removido.12.102cadernos+1.984simulado=14.086ocorrências,13.715IDs;simulado integralmente inalterado. Todos seis objetos finais idênticos ao runtime e invariantes nas duas transformações existentes;nenhuma regra,filtro,política ou flag afrouxada. Três modelos físicos por item preservados. Inativos127M1/M2,1219M1,1226M2 literalmente inalterados e ausentes antes/depois,sem revisão/correção contada ou reativação.

Regressão final427deltas cumulativos/1.052proposições/820opçõesdiretas passou. Runtime,matriz100=25/25/10/10/10/10/10,proveniência,catálogo,quatro gerações e quatro checks passaram. BuildNext final completo passou na repetição em cache limpo,saída0,com log contínuo e timeout240s. A tentativa anterior sobre os mesmos hashes finais falhou comENOTEMPTY ao remover.next/export;causa não inferida,cache preservado emnext-cache-failed105 e log real incluído nas evidências. Repetiu-se somente o build,sem alterar fonte,pois os testes dos hashes finais já haviam passado. Cache anterior preservado emnext-cache-before105;cache do primeiro passe emnext-cache-draft105. O primeiro passe passou;uma concordância gramatical da justificativaA de1231M3 foi refinada depois e todas as gerações,inventário,checks e build foram repetidos para os hashes finais,sem mudança de vetor/gabarito. Logs dos dois passes e da repetição de build preservados nas evidências.

Falhas conhecidas mantidas:stems1 porANV0142,localizadores1 por77pendências,gate2 com0aceitos/14.086pendentes. Gate executado após inventário e todos14.086hashes conferidos contra runtime atual. Oito gates pendentes/falhos;rechecagem por outro avaliador,cobertura integral,programa/edição oficial,dificuldade,SQL/offline e demais disciplinas continuam pendentes.

Comparação lexical somente localizou candidatos,sem substituir revisão semântica. Leitura dos candidatos confirmou sobreposição da competência de mudança de bordo de ANV0020 com a família1232. ANV0020 não foi alterado,recontado ou aprovado. Variantes dos próprios grupos também compartilham competência e não estão homologadas para coexistir na mesma prova;prevenção global de coexistência segue pendente. Demais candidatos próximos compartilham vocabulário de espias/ambiente mas abordam outros casos;nenhuma aprovação semântica global inferida. Somente dois IDs CORRIGIR removidos da fila,nenhum dos3.189outrosIDs dado como resolvido.

Alerta098,12.16p817/PDF178:repetição impressa ambígua na comparação de intensidades permanece,não usada como premissa verdadeira,errata não obtida e livro inalterado.11.10SOLAS exige conferência normativa oficial própria;ANV0142 e77localizadores continuam pendentes.

## Preservação e continuação

Commit local na branch da auditoria;SHA/árvore exatos vinculados pelo MANIFEST do pacote105 e relatório final. Rejeição084 continua impedindo publicação pública sem autorização explícita posterior;sem merge/deploy. Pacote cumulativo084–105 com lista explícita de membros,sem livros ou temporários parciais. ZIP temporário fechado/fsync e renomeado atomicamente antes do fluxo preparado;materializar salvo e conferir tamanho/SHA256 integral,CRC/SHA256 de todos os membros,MANIFEST,HEAD/árvore,PACKtrailer e bundle antes de declarar durável. ZIP091 antigo incompleto não deve ser usado;commit/árvore originais recuperados092 presentes no cumulativo.

Próximo1233M1/M2/M3 após fonte integral/elegibilidade;depois12331. Todos seis presentes e não contados na pré-checagem105,sem dispensar nova conferência de estado/fonte.1228/1215/1263/125 já corrigidos,não recontar.
