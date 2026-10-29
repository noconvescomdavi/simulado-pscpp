# Lote 058 — servomotor elétrico por alavanca

Base remota `0ac5541e3b2f3cecf089073d015e87a2bfe4a3c1`; HEAD e PR #172 aberto/draft consultados antes de editar. Cópia local antiga, rastreada limpa, atualizada por fast-forward; CHECKPOINT057 e relatório057 lidos. Temporários preservados. A enumeração global por `ps` falhou com `fatal library error, lookup self`; não se afirma inspeção global bem-sucedida de escritores. A publicação exige hashes estáveis e expected_sha sem force, interrompendo diante de divergência detectável.

## Fonte e escopo

Fonseca, Arte Naval v.2, 8ª edição (2019), 11.4.e, pp.759–760/PDF120–121; contraste com mecanismo compensador em11.4.d, p.759/PDF120. Ambas as páginas integralmente lidas em texto e imagens. Não há figura própria exigida para essas respostas; a referência a figura no contexto hidrelétrico não foi usada para medições ou inferência de desenho ausente. Nenhum cálculo novo.

SHA256 recalculado `6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1`; Drive `1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec`. Livro e imagens privados não publicados. Identidade binária dos anexos oficiais, programa/edital e rechecagem independente continuam pendentes.

A descrição de2019 relaciona direita/boreste, esquerda/bombordo e alavanca neutra/motor parado; o freio conserva o leme na posição desejada. Neutro do comando não é ordem de centralização do leme. A dispensa do compensador pertence à configuração da obra; não se generaliza a toda instalação elétrica moderna ou à ausência de realimentação em qualquer aparelho. As questões não certificam equipamentos nem estabelecem procedimentos de emergência.

## Relatório individual obrigatório

| ID | Defeito encontrado | Correção concreta | Fonte/localizador | Gabarito |
|---|---|---|---|---|
| ANV-0263 | I–IV apagadas no runtime, mistura com punhos/localização e explicação genérica. | Quatro proposições autossuficientes sobre controle, neutro, parada e freio; eliminada mistura; explicação, cinco justificativas, páginas/hash; Médio/L2 proposto. |11.4.e, pp.759–760/PDF120–121.|C mantido;V/F/F/V|
| ANV-0661 | Comando genérico e sobreposição entre servomotor elétrico e categoria geral de servomotor. | Cinco associações comparáveis entre comando e resposta; explicado por que a antiga categoria geral não era simplesmente falsa; cinco justificativas, páginas/hash; Médio/L2 proposto. |11.4.e, pp.759–760/PDF120–121.|A mantido|
| ANV-0921 | Fragmento de extração e mera identificação apresentada como situação aplicada; alternativas de categorias diferentes. | Caso de interrupção do giro sem retorno automático a meio; cinco procedimentos/resultados comparáveis, explicação e justificativas; páginas/hash; Médio/L3 proposto. |11.4.e, p.760/PDF121.|A mantido|
| AN-C11-114e-M1 | Proposições apagadas no runtime; explicação repetia inclusive as falsas sem julgá-las. | Quatro proposições autossuficientes, controles/estações/bordos versus marcha no neutro/compensador; explicação e cinco justificativas, páginas/hash; Médio/L2 proposto. |11.4.e e contraste11.4.d, pp.759–760/PDF120–121.|D mantido;V/V/F/F|
| AN-C11-114e-M2 | Comando por artigo, resposta destacadamente longa e explicação apenas repetitiva. | Comando autossuficiente, cinco causas comparáveis, distinção entre freio e compensação; explicação e cinco justificativas, páginas/hash; Médio/L2 proposto. |11.4.e e contraste11.4.d, pp.759–760/PDF120–121.|E mantido|
| AN-C11-114e-M3 | V/F aparecia como parágrafos sem blocos de proposições parseados; explicação não identificava a falsidade deIII. | V/F preservado, quatro itens estruturados; motor parado no neutro e limites da descrição explicitados; explicação e cinco justificativas, páginas/hash; Médio/L2 proposto. |11.4.e, pp.759–760/PDF120–121.|A mantido;V/V/F/V|

Seis correções primárias parciais,30 justificativas,zero aprovações finais. IDs e chaves C/A/A/D/E/A preservados. M3 já continha os textos das afirmações antes do lote: não se afirma que esses textos estivessem apagados; a correção melhora estrutura e julgamentos. Os três modelos assertion_combination/conceptual/true_false e suas marcas legadas permanecem; as validações antigas não comprovam aprovação desta auditoria. Níveis propostos, sem calibração histórica/psicométrica aprovada.

## Julgamentos e unicidade

0263:I verdadeira pelo controle elétrico;II falsa por centralização automática;III falsa por marcha no neutro;IV verdadeira pela retenção por freio. SóC reúneI/IV. A incluiII/omiteIV;B reúneII/III falsas;D incluiIII/omiteI;E incluiII/omiteI.

0661:A corresponde aos bordos descritos;B inverte direita/esquerda;C confunde neutro com centralização;D inventa marcha no neutro/compensador;E inverte marcha e parada. A antiga alternativaB abrangia a categoria geral; sua falsidade não foi inferida da chaveA. Foi substituída por erro específico e verificável.

0921:A neutraliza o comando e conserva o ângulo por freio. B mantém ordem para boreste;C ordena bombordo;D inventa centralização;E inventa marcha e compensador. Não se extrapola o caso para falha de energia, frenagem de emergência ou instalação não descrita.

M1:I/II verdadeiras;III/IV falsas. A incluiIII;B incluiIV;C reúne duas falsas;D únicaI/II;E incluiIII/IV. M2:E combina interrupção no neutro e retenção pelo freio. A inventa molas;B mantém marcha;C transfere controle hidrelétrico;D inventa retorno automático ao centro.

M3:V/V/F/V,únicaA. B erraII/III/IV;C erraI/III/IV;D erraI/II/III;E erraIII. A formulação ampla de controle foi mantida dentro da configuração da fonte, sem criar novos limites numéricos.

## Precedência, preservação e diversidade

As seis versões já eram ativas e vêm do principal. Nenhuma restauração/extensão prevalece. Objetos finais atravessam reformulateLeakingStem e normalizeEditorialStem intactos; auditQuestion sem issues e política ativa, sem novas flags, exceções ou relaxamento de heurísticas. ANV-0462 permanece inalterada e ausente runtime, pelo motivo preexistente answer-leak:stem_answer_continuation, sem nova ativação/quarentena ou conferência contabilizada.

As seis variantes old-076/anv2-11.4.e compartilham competência e não devem coexistir na mesma prova. Formatos ou IDs diferentes não autorizam repetição. Prevenção semântica global e rechecagem independente pendentes. Tracking/taxonomy legados que identificam v1 nos antigos IDs foram preservados para evitar migração parcial dos filtros; source v2 é explícito e a reconciliação global desses identificadores permanece pendente. Não se declara normalização integral da taxonomia.

## Validação e continuidade

Build completo isolado: `npm run build` exit0, compilação, lint/tipos,101 páginas/rotas confirmados; dependências locais, execução final com npmoffline e telemetria desativada. Todos os rastreados fora de docs e seis artefatos gerados iguais byte a byte à cópia testada. A primeira chamada por subprocess retornou0 sem evidência de compilação e foi rejeitada; a execução direta terminou0, mas sua saída foi truncada. A repetição com log integral confirmou as etapas, preservando as tentativas. O ENOTEMPTY antigo não é declarado resolvido.

Passaram as quatro gerações, validate-runtime-question-banks, validate-pscpp-exam-selection, test-question-source-provenance, validate-runtime-question-catalog, test-pscpp-audit-anv0005, triagem/inventário echeck:pscpp-bank. Regressão:151 deltas acumulados exatos,11.951 ocorrências de cadernos e todas1.984PSCPP intactas contra baseline;328 proposições renderizadas e345 opções diretas preservadas. Nenhuma asserção anterior relaxada. Matriz100=25/25/10/10/10/10/10 preservada.

Entre057 e058,somente os seis IDs da tabela mudam no principal e inventário efetivo. Objetos finais integralmente iguais ao runtime;151 hashes corrigidos conferidos. Metadados de topo,0462,demais questões/restaurações/extensões e todasPSCPP intactos. IDs,estados,modelos,marcas legadas,tracking e taxonomy preservados;hashes antes/depois emCORRECOES_RUNTIME.json eCONFERENCIAS_BIBLIOGRAFICAS.jsonl.

Falhas reais mantidas:test-notebook-complete-stems exit1 emANV-0142;validate-editorial-runtime exit1 com77 localizadores;validate-pscpp-editorial-evidence exit2,zero aprovadas/14.086 pendentes. Gate regenerado após inventário,hashes conferidos;REVISOES_EDITORIAIS.jsonl inalterado.

Acumulado151 IDs distintos corrigidos,154 conferências primárias parciais,zero aprovações finais. Triagem182 sem proposições e77 localizadores:71 candidatos corrigidos+3 falsos positivos anteriores+182 restantes=256;80 correções fora dessa triagem.27.435 físicos,14.086 ocorrências(12.102 cadernos+1.984PSCPP),13.715 IDs únicos. Próxima independenteANV-0269,atracação a contrabordo,Fonseca v2 12.37. Impedimentos0142/0840,0176/0874 e0253/0651 preservados,sem recontagem.

Todos os oito gates pendentes/falhos, merge_permitted=false. Revisão individual de100% das ocorrências ativas, rechecagem independente, programa/edital, bibliografia/normas completas, prevenção semântica, consumidores/offline/SQL e homologação de produção pendentes. Sem merge, deploy ou mutação de dados de usuários.
