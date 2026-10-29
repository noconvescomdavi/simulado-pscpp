# Lote 061 — um hélice adiante e outro atrás

Base remota `2b99202affef81d984dc475dab92360618ff159f`; HEAD e PR #172 aberto/draft consultados antes de editar. Cópia local antiga rastreada limpa atualizada por fast-forward; CHECKPOINT060 e relatório060 lidos. Temporários preservados. Enumeração de processos por `ps -eo pid,comm` falhou com `fatal library error, lookup self`; não se afirma inspeção global bem-sucedida de escritores. Hashes estáveis e expected_sha sem force exigem parar diante de divergência detectável.

## Fonte, condições e anomalia textual

Fonseca,Arte Naval v.2,8ª edição (2019),12.15,pp.813–815/PDF174–176. Contexto12.10,pp.810–811/PDF171–172 e12.16/fig12-9,p.815/PDF176. Essas cinco páginas foram lidas integralmente em texto e imagens. A p.809/PDF170 efig12-8 foram lidas como contexto adicional,sem usar a manobra de um hélice como premissa para o arranjo de dois. Não se afirma leitura integral de12.9 ou12.16 além das páginas disponíveis.

SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`;Drive`1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Livro e imagens privados não publicados. Identidade binária dos anexos oficiais,programa/edital e rechecagem independente pendentes.

12.15 distingue navio com seguimento e partida do repouso. Na segunda situação,o modelo não garante giro no mesmo ponto com rotações iguais; descreve ligeiro avanço e ajuste experimental diferente entre navios. No arranjo convencional,a proa tende ao bordo do hélice que dá atrás. Sem seguimento,o texto indica leme a meio ou cerca de10° no bordo da guinada,e15° se compensado. Os valores são da configuração examinada,não limites universais para propulsão azimutal,passo controlável,dois lemes ou qualquer condição de vento/mar.

A figura12-9 compara um leme entre as descargas com dois lemes diretamente nas descargas; é contexto de geometria,não desenho da manobra com comandos opostos nem escala para calcular forças. As questões são autossuficientes e não exigem a figura para resolver. Não se introduziu razão numérica universal de rotações/potência,raio ou cálculo novo. Os exemplos de regimes de máquina da obra foram lidos,mas não transformados em receitas universais.

**Anomalia conferida na imagem da p.813/PDF174:** o parágrafo de navio com seguimento repete uma condição de marchaAR com instruções de leme referidas ora à proa,ora à popa. O exemplo deBE da p.814 traz a distinção entre seguimentoAV eAR. Não se escolheu uma redação como errata oficial,nem se atribuiu a divergência apenas ao OCR. Os enunciados deste lote evitam usar a instrução conflitante emAR: usam partida do repouso ou caso explícito de seguimentoAV. Reconciliação de edição/errata e rechecagem independente permanecem pendentes; a fonte inteira não foi declarada isenta de inconsistências.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0278 | Proposições apagadas,afirmação genérica potencialmente verdadeira tratada como distrator e explicação genérica. | Quatro proposições autossuficientes sobre comandos opostos,rotações iguais,ajuste experimental e bordo da guinada; substituída a afirmação ambígua; explicação e cinco justificativas;páginas/hash;Médio/L2 proposto. |12.15,p.814/PDF175.|C mantido;F/F/V/V|
| ANV-0676 | Comando genérico e opções de configuração/tipo de hélice/leme heterogêneas. | Cinco associações comparáveis entre comandos e resultado,sem garantia indevida de giro estacionário; explicação e cinco justificativas;páginas/hash;Médio/L2 proposto. |12.15,pp.813–814/PDF174–175.|A mantido|
| ANV-0926 | Fragmento de extração e identificação apresentada como caso aplicado. | Caso de partida do repouso comBE atrás/BB adiante e rotações iguais,sem influências externas; cinco respostas comparáveis,explicação e justificativas;páginas/hash;Médio/L3 proposto. |12.15,p.814/PDF175.|A mantido|
| AN-C12-1215-M1 | Proposições apagadas,comando por artigo e explicação repetitiva;generalização do conjugado/leme. | Quatro proposições autossuficientes,arranjo convencional explícito e distinção entre rotações iguais e giro estacionário; explicação e cinco justificativas;páginas/hash;Médio/L2 proposto. |12.15,pp.813–814/PDF174–175;contrastefig12-9.|E mantido;V/V/F/F|
| AN-C12-1215-M2 | Resposta mais detalhada que os distratores,opções arbitrárias e explicação apenas repetitiva. | Cinco orientações comparáveis de posição/bordo/condição do leme;10° e15° condicionados ao trecho e ao leme compensado; explicação e cinco justificativas;páginas/hash;Médio/L2 proposto. |12.15,p.814/PDF175;contraste12.16.|A mantido|
| AN-C12-1215-M3 | Comando sem objeto,V/F sem blocos reconhecidos e explicação sem julgamentos. | Quatro itens estruturados,seguimentoAV e partida do repouso explícitos,falsidade de todo o leme sem seguimento e bordo correto; explicação e cinco justificativas;páginas/hash;Médio/L2 proposto. |12.15,pp.813–815/PDF174–176.|B mantido;V/V/F/V|

Seis correções primárias parciais,30 justificativas,zero aprovações finais. ChavesC/A/A/E/A/B preservadas. M3 já continha os textos das afirmações: não se afirma que esses textos estivessem apagados; a correção estrutura os itens e explicita julgamentos. Regime de três modelos assertion_combination/conceptual/true_false e marcas legadas preservados. Níveis propostos sem calibração histórica/psicométrica aprovada.

## Julgamentos e unicidade

0278:I falsa por colocar os dois hélices adiante;II falsa por garantir giro estacionário com rotações iguais;III verdadeira pelo ajuste experimental;IV verdadeira pelo bordo do hélice que dá atrás. SóC reúneIII/IV. A incluiI/omiteIII;B reúneI/II falsas;D incluiII/omiteIII;E incluiI/omiteIV. A antigaII sobre aproveitar fluxos não foi declarada falsa por coincidência com a chave: foi substituída por afirmação específica verificável.

0676:A conserva comandos opostos e ausência de garantia de giro estacionário. B deixa um hélice parado;C/D põem os dois no mesmo sentido;E afirma garantia que a fonte rejeita. 0926:A associaBE atrás à proa paraBE e ligeiro avanço no modelo;B inverte bordo;C erra giro estacionário;D erra ambos;E omite a tendência de guinada.

M1:I/II verdadeiras,III/IV falsas. A incluiIII;B incluiIV;C reúne duas falsas;D incluiIII/IV;E únicaI/II. M2:A reúne apenas posições indicadas. B inclui pequeno ângulo no bordo oposto;C/D incluem todo o leme sem seguimento;E inverte bordo e elimina condição de compensação. A pergunta exige que todas as posições da opção sejam indicadas: a presença de a meio emB não valida o restante errado.

M3:V/V/F/V,únicaB. A erraII/III/IV;C erraI/III/IV;D erraI/II/III;E erraIII. As condições de seguimento e arranjo não foram apagadas da explicação nem generalizadas a dois lemes.

## Precedência e diversidade

As seis versões já eram ativas e vêm do principal. Nenhuma restauração/extensão prevalece. ANV-0477 permanece inalterada e ausente runtime: bruta ativa,após transformações excluída por stem-quotes-source-answer. Sem ativação,nova quarentena ou conferência contabilizada. Todas as seis versões finais atravessam reformulateLeakingStem e normalizeEditorialStem integralmente intactas;auditQuestion sem issues e política ativa. Nenhuma exceção,flag nova ou relaxamento de critérios.

As variantes old-101/anv2-12.15 compartilham competência e não devem coexistir na mesma prova. Prevenção semântica global e rechecagem independente pendentes. Tracking/taxonomy legados v1 foram preservados,com source v2 explícito e reconciliação global pendente; não se declara normalização integral dos filtros. Demais consumidores não foram aprovados apenas por associação de tópico.

## Validação e continuidade

Gerados runtime PSCPP, bancos, catálogo e flashcards; validações de bancos, matriz de seleção, proveniência e catálogo passaram; check:pscpp-bank passou. Regressão acumulada:168 deltas exatos,11934 ocorrências de cadernos preservadas,364 proposições renderizadas e385 alternativas diretas preservadas. Frente ao checkpoint060,exatamente seis IDs mudaram; todos os1984 registros PSCPP e a composição14086=12102+1984 permaneceram iguais. Sem inclusão/exclusão de ID.27435 registros físicos e13715 IDs únicos mantidos.

Build completo npm run build passou em cópia isolada: compilação,lint/tipos,101/101 páginas e tabela de rotas confirmados no log integral. A primeira tentativa retornou0 com log vazio e não foi aceita como evidência; repetição direta teve saída integral. Todos os arquivos rastreados fora de docs e os seis artefatos gerados foram comparados byte a byte com a cópia testada. A triagem terminou0 com log vazio; o artefato foi conferido diretamente:176 candidatos sem proposições e77 por localizador.

Falhas conhecidas mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 nos77 localizadores;validate-pscpp-editorial-evidence exit2,zero evidências finais aceitas/14086 pendentes. Critérios não relaxados. REVISOES_EDITORIAIS intacto. As162 correções anteriores permanecem exatamente iguais no ledger; seis novas elevam o acumulado a168,com171 conferências bibliográficas parciais eZERO aprovações finais. Dos256 candidatos originais,77 corrigidos+3 falsos positivos+176 restantes;91 correções fora dessa triagem,sem dupla contagem.

Próxima falha independente:ANV-0279,seguimento para vante com máquina atrás,Fonseca v2 12.6.3. Impedimentos0142/0840,0176/0874 e0253/0651 e reconciliação da fraseAR na fonte permanecem abertos. Publicação deste relatório e CHECKPOINT no mesmo commit da branch,com comparação da árvore Git local/remota e expected_sha sem force; o SHA definitivo é o commit que contém este arquivo.

Todos os oito gates pendentes/falhos,merge_permitted=false. Revisão individual de100% das ocorrências ativas,rechecagem independente,programa/edital,bibliografia/normas completas,prevenção semântica,consumidores/offline/SQL e homologação de produção pendentes. Sem merge,deploy ou mutação de dados de usuários.
