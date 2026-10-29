# Lote 062 — casco com seguimento para vante e hélice dando atrás

Base remota `7bd228f02c31895cac9c153711d77bee0f63b8fc`. HEAD remoto e PR172 aberto/draft consultados antes de editar; CHECKPOINT061, relatório061 e Prompt-Mestre integral lidos. Cópia local rastreada limpa, antiga, atualizada por fast-forward; sem commit duplicado ou descarte de temporários. `ps -eo pid,comm` falhou com `fatal library error, lookup self`: não se afirma inspeção global bem-sucedida de escritores. Comparações de hashes/árvore e expected_sha sem force protegem a publicação contra divergência detectável.

## Fonte primária e limites

Fonseca, Arte Naval v.2,8ª edição,2019,12.6.3,pp.800–803/PDF161–164 e figura12-4,p.801/PDF162. Contexto12.6,p.798/PDF159;12.6.2,pp.799–800/PDF160–161;12.3–12.4,pp.795–796/PDF156–157. Oito páginas únicas lidas integralmente em texto e imagens:795/796/798/799/800/801/802/803. SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`;Drive`1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Não se publicam livro ou imagens privados. Programa/edital e equivalência binária com anexos oficiais continuam pendentes.

O texto distingue a marcha do hélice do sentido de movimento do casco. Na condição de12.6.3, a sucção contraria a ação do leme devida ao seguimento para vante; não se deve transferir para essa condição o reforço descrito para navio e hélice ambos em marchaAR em12.6.2/fig12-3. As referências aBB/BE estão limitadas ao arranjo convencional de passo direito,explicitado em12.3–12.4. Não foram generalizadas a passo controlável,azimutais ou outras instalações.

A figura12-4 mostra três posições do leme e contribuições de sucção,descarga,pressão lateral e efeito do leme; identifica navio a vante mesmo com hélice atrás. Seus rótulos de tendência não equivalem a garantia de força predominante a cada instante. O corpo das pp.801–802 explicita hipóteses de regime e ocasião de aplicação,além da possibilidade de respostas diferentes conforme o navio. Não se mediram forças,tempos,ângulos ou distâncias pela figura; os cinco enunciados são resolvíveis sem imagem ausente.

A sequência das pp.802–803 aproveita o seguimento e a velocidade angular iniciada antes da reversão. A redação das questões mantém as condições normais e a necessidade de experiências no próprio navio,sem transformar o trecho em garantia universal de manobra. Não foi afirmada vigência operacional moderna nem inventada uma razão de rotações,tempo de governo ou cálculo. A inconsistência AR de12.15 registrada no061 permanece aberta e não foi usada como premissa deste lote.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0279 | Proposições desapareciam no carregamento;mistura de definições/efeitos e explicação genérica. | Quatro proposições autossuficientes distinguem marcha do hélice,seguimento do casco,sucção e duração limitada do governo;explicação e cinco justificativas;páginas/hash;Médio/L2 proposto. |12.6.3,pp.800–803/PDF161–164.|D mantido;V/F/V/F|
| ANV-0677 | Comando genérico e opções de definição,força e situação sem paralelismo. | Cinco associações entre ação hidrodinâmica e efeito,com condição de seguimento e arranjo explícita;explicação e cinco justificativas;páginas/hash;Médio/L2 proposto. |12.6.3,p.801/PDF162;context12.3–12.4.|B mantido|
| AN-C12-1263-M1 | Proposições apagadas,comando por artigo e explicação que repetia o texto sem fundamentar os erros. | Quatro proposições autossuficientes distinguem popa/proa,incidência da descarga,oposição da sucção e ocasião do leme;explicação e cinco justificativas;páginas/hash;Médio/L2 proposto. |12.6.3,p.801–803/PDF162–164 efig12-4.|E mantido;V/V/F/F|
| AN-C12-1263-M2 | Explicação mínima,distratores desiguais e comando que era substituído por formulação genérica no pipeline. | Caso explícito de reversão com casco ainda avançando;cinco procedimentos comparáveis,sequência temporal e limites explicados;cinco justificativas;páginas/hash;Médio/L2 proposto. |12.6.3,pp.802–803/PDF163–164.|A mantido|
| AN-C12-1263-M3 | Comando sem objeto,V/F sem estrutura reconhecida e explicação sem julgamentos individuais. | Quatro itens estruturados com condição de seguimento explícita;falsidade do governo indefinido substitui repetição da relação de sucção;explicação e cinco justificativas;páginas/hash;Médio/L2 proposto. |12.6.3,pp.801–803/PDF162–164.|B mantido;V/V/F/V|

Cinco correções primárias parciais e25 justificativas. Zero aprovações finais. As chavesD/B/E/A/B foram conservadas por conferência das alternativas,sem forçar a verdade para manter letra. M3 já continha textos de afirmações: não se declara que eles estivessem apagados; o problema era estrutura reconhecida e fundamentação. Os três modelos assertion_combination/conceptual/true_false e flags legadas foram preservados; tais flags não são evidência aceita de aprovação. NívelL2 e dificuldadeMédio são propostas,sem calibração psicométrica/histórica final.

## Julgamentos, unicidade e duplicidade semântica

0279:I verdadeira por distinguir movimentos;II falsa porque a sucção se opõe à ação do leme;III verdadeira porque velocidades/ocasião importam;IV falsa por anular governo instantaneamente. SóD reúneI/III;A reúneII/IV falsas;B eC incluemIV;E incluiII. A antigaII genérica não foi considerada falsa apenas por ausência na chave: foi substituída por inversão técnica específica e verificável.

0677:sóB associa sucção à oposição na condição estudada. A inverte a relação;C confunde forças distintas com eliminação;D transfere a descarga da marchaAV para o héliceAR;E troca o bordo da pressão lateral para o arranjo de passo direito. Não se deduz a guinada total apenas dessa contribuição.

M1:I/II verdadeiras,III/IV falsas. A incluiIII;B incluiIV;C reúne duas falsas;D incluiIII/IV;E únicaI/II. M2:sóA aplica o leme antes da reversão para iniciar a guinada desejada;B posterga,C aguarda outro sentido de movimento,D inicia guinada contrária,E dispensa a ação inicial. Não se afirma que as demais sejam impossíveis em qualquer manobra real: não correspondem à orientação pedida no cenário/fonte.

M3:V/V/F/V,únicaB. A erraII/III/IV;C erraI/III/IV;D erraI/II/III;E erraIII. I refere-se ao cascoAV e héliceAR;IV refere-se à popa,evitando inverter a proa. A limitação de governo após reversão foi mantida.

As cinco variantes old095/anv2-12.6.3 avaliam a mesma competência e não devem coexistir na mesma prova. A prevenção semântica global está pendente; diversidade de redação não as torna competências diferentes. Regime de três modelos preservado. Tracking/taxonomy legados v1 de0279/0677 permanecem como dívida de reconciliação,com fonte v2 explícita;não se declara normalização integral de filtros.

## Precedência, transforms e falhas de sondagem

As cinco versões já eram ativas e vêm do principal;nenhuma restauração/extensão prevalece. ANV-0478 permanece inalterada e ausente runtime:objeto bruto passa na política,mas após as transformações preexistentes é excluído por stem-quotes-source-answer. Não houve ativação,nova quarentena ou conferência contabilizada desse ID.

A primeira sondagem detectou a transformação deM2 em comando genérico,apesar da primeira reescrita. O comando foi ajustado para tornar o cenário/pergunta claros sem repetir a formulação da alternativa correta. A sondagem final confirmou igualdade integral principal/versão efetiva para as cinco questões e invariância nas duas transformações,com auditQuestion sem issues/política ativa. Nenhum bypass,flag nova ou relaxamento de critérios foi introduzido. Escores automáticos não são aprovação editorial.

## Validação, acumulado e continuidade

Regenerados runtime PSCPP,bancos,catálogo e flashcards. Passaram validate-runtime-question-banks,validate-pscpp-exam-selection,test-question-source-provenance,validate-runtime-question-catalog,test-pscpp-audit-anv0005 e check:pscpp-bank. Regressão:173 deltas acumulados exatos,11929 ocorrências de cadernos preservadas,376 proposições renderizadas e395 alternativas diretas preservadas. Frente ao061,exatamente cinco IDs efetivos e cinco objetos do principal mudaram;168 correções anteriores permanecem intactas. Todos os1984 registros PSCPP,IDs ativos e composição14086=12102+1984 preservados.27435 registros físicos e13715 IDs únicos mantidos;matriz100=25/25/10/10/10/10/10 preservada pela validação pertinente.

Build completo npm run build passou em cópia isolada,com log integral confirmando compilação,lint/tipos,101/101 páginas e tabela de rotas. Todos os arquivos rastreados fora de docs e seis artefatos gerados foram comparados byte a byte com a cópia testada. Não se confunde código de saída isolado com evidência de execução.

Falhas conhecidas mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 nos77 localizadores;validate-pscpp-editorial-evidence exit2,zero aceitas/14086 pendentes. Triagem e inventário regenerados;artefato de triagem conferido diretamente:174 candidatos sem proposições e77 por localizador. REVISOES_EDITORIAIS permaneceu byte a byte igual. Critérios não relaxados.

Acumulado sem recontagem:173 IDs corrigidos e176 conferências bibliográficas parciais,ZERO aprovações finais. Dos256 candidatos originais,79 corrigidos+3 falsos positivos+174 restantes;94 correções fora dessa triagem,79+94=173. Este lote acrescenta cinco correções e cinco conferências,sem recontar os168 IDs anteriores. Próxima falha independente:ANV-0283,virar a máquina de suspender,Fonseca10.32/10.36. Impedimentos0142/0840,0176/0874 e0253/0651,reconciliaçãoAR do061 e demais pendências globais preservados.

Todos os oito gates pendentes/falhos e merge_permitted=false. Revisão individual de100% das ocorrências ativas,rechecagem independente,programa/edital,árvores bibliográficas completas,normas,prevenção semântica,consumidores/offline/SQL e homologação continuam pendentes. Sem merge,deploy ou mutação de dados de usuários. SHA definitivo é o commit que contém este relatório e CHECKPOINT;publicação exige árvore local/remota idêntica e expected_sha sem force.
