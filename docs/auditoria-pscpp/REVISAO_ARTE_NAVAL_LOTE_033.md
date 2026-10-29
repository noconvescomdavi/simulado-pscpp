# Lote 033 — transmissão mecânica rígida do comando de governo

Base remota 9f877d64f776e34b5aa00a400d3556dfc56a41c9. PR #172 aberto,
draft, não mergeado. HEAD, checkpoint e relatório 032 lidos antes da edição.
Árvore rastreada inicialmente limpa; fast-forward a partir do lote005, sem
repetir lotes intermediários. Temporários não rastreados preservados. A inspeção
de processos visíveis não mostrou outro escritor. Publicação condicionada ao
mesmo HEAD remoto com expected_sha, sem force.

## Fonte e limites

Fonseca, Arte Naval v.2, 8ª ed., 2019, art.11.5.a p.760/PDF121.
Contrastes 11.5.b–c pp.760–761/PDF121–122 e 11.6 p.761/PDF122.
Texto extraído e imagens de PDF121/122 lidos; paginação impressa conferida.
SHA256 recalculado: 6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1.
Drive: 1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec. Livro/imagens mantidos privados.
Nenhuma figura é necessária para resolver os novos enunciados autossuficientes.
A figura11-2 é apenas referência de contexto citada pela obra; não se pediu
identificação visual. Não foram extrapolados limites angulares, regra atual de
instalação ou requisitos normativos a partir de descrição bibliográfica.

O texto descreve vergalhões de ferro nas embarcações miúdas e eixos nas
maiores; juntas universais tipo Cardan nas pequenas mudanças de direção e
engrenagens cônicas nas maiores. Gualdropes pertencem à transmissão mecânica
flexível. Pressão líquida/telemotor pertence à hidráulica; motores selsyn e
condutores pertencem à elétrica. Uma transmissão elétrica pode comandar um
servomotor hidrelétrico: não se confundiu o meio de transmissão do comando
com a fonte de potência do atuador.

## Relatório obrigatório por questão

| ID | Defeito encontrado | Correção concreta | Fonte verificada | Gabarito |
|---|---|---|---|---|
| ANV-0145 | A restauração prevalente tinha redação genérica e afirmações próximas de definições literais. O reformulador answer-leak-v1 removia as quatro proposições, deixando opções por conjuntos sem os itens a julgar. | Reescritas I–IV: contraste elétrico, elementos rígidos, juntas/engrenagens e contraste hidráulico. Explicação e cinco justificativas específicas; página impressa/PDF e hash adicionados. Fonte e runtime agora contêm o mesmo objeto, sem reformulação destrutiva. | v.2,11.5.a p.760/PDF121;11.5.b–c e11.6 pp.760–761/PDF121–122 | E mantido; F/V/V/F, somente II e III |
| ANV-0843 | O comando de identificação por definição sofria a mesma reformulação para pergunta bibliográfica genérica; alternativas curtas não testavam de forma homogênea a distinção de elementos e mudanças de direção. | Enunciado explícito sobre transmissão rígida; cinco opções reescritas para contrastar elementos e recursos de transmissão. Explicação e cinco justificativas, referência exata e hash adicionados. Objeto integral preservado no runtime. | Mesmos localizadores | C mantido |

Ambas são correções primárias parciais, não aprovações editoriais finais.
Propostas L2/Médio, sem alegação de calibração psicométrica ou histórica.
ANV-0145 antes rotulada Difícil; ajustada a Médio pela compreensão de distinções.
ANV-0843 mantém Médio. Formatos B/A, IDs, conceitos, filtros e opções A–E
preservados. Não há cálculos nem figura ausente necessária às respostas.

## Julgamento individual ANV-0145

I falsa: descreve 11.5.c, transmissão elétrica por receptor e condutores.
II verdadeira: elementos rígidos descritos em 11.5.a, p.760.
III verdadeira: aplicações de juntas universais e engrenagens cônicas em 11.5.a.
IV falsa: descreve 11.5.b e 11.6, transmissão hidráulica/telemotor.

| Opção | Conjunto | Justificativa |
|---|---|---|
| A | I/IV | Duas falsas; faltam II/III |
| B | I/III | I falsa; falta II |
| C | III/IV | IV falsa; falta II |
| D | II/IV | IV falsa; falta III |
| E | II/III | Único conjunto completo das verdadeiras |

## Julgamento individual ANV-0843

| Opção | Justificativa |
|---|---|
| A | Inverte juntas universais e engrenagens cônicas nas mudanças de direção |
| B | Introduz gualdropes da transmissão flexível na descrição da rígida |
| C | Correta: vergalhões/eixos e correspondência dos recursos de mudança de direção |
| D | Descreve transmissão hidráulica e telemotor |
| E | Descreve transmissão elétrica por motores autossincronizados |

## Precedência, identidade e sobreposição

ANV-0145 prevalece na restauração old-078 já carregada antes do lote.
Principal concorrente 0145 sobre gualdropes preservado integralmente, sem
inferir flags ausentes, alterar estado ou ativar nova versão. ANV-0843 prevalece
no principal. Nenhuma das duas consta de notebook-complete-stems.
Busca no runtime por old-078 encontrou estas duas variantes, ambas lidas;
compartilham competência e não devem coexistir na mesma prova. Isso não prova
ausência de variantes com outro código: revisão semântica global e prevenção
de coexistência ainda pendentes. Nenhum modelo/ID criado ou removido;
regime específico de três modelos por item preservado.

auditQuestion: zero achados nas duas; política ativa e transformações atuais
preservaram os objetos integralmente antes da geração. Igualdade completa
fonte/runtime após geração verificada. Nenhum normalizador/filtro/gate relaxado.
Contrato de regressão direta só acrescido de 0843. Hashes antes/depois em
CORRECOES_RUNTIME.json; duas evidências em CONFERENCIAS_BIBLIOGRAFICAS.jsonl.

Acumulado: 66 correções primárias distintas, 69 conferências parciais;
ZERO aprovações finais. Par 0142/0840 e achados dos lotes anteriores mantidos
pendentes, sem incremento de checks para buscas já documentadas. Programa e
edital oficial, rechecagem independente, cobertura, estados, semântica e
offline/produção ainda pendentes. Testes efetivos em TESTES_E_EVIDENCIAS.md.
Sem merge, deploy ou mudanças de usuários; oito gates pendentes/falhos.
