# PSCPP — Referência histórica e inventário preliminar

**Base conferida** `14c6afed392cb6d87e80c8ff3453299e949039b4`.  
**Execução** 21 de novembro de 2026, America/Sao_Paulo.  
**Rastreio** [PR #262](https://github.com/noconvescomdavi/simulado-pscpp/pull/262).

A leitura do Anexo 2-A (30 páginas) e do Anexo 2-B (14 páginas) foi usada para enquadrar os assuntos e as edições. A bibliografia reserva ao edital aplicável a confirmação de edição, versão e escopo definitivo. [Programa](https://drive.google.com/file/d/1iQYcejhBTkrkOr78DzCCP2xXzSUSz9iu/view) · [Bibliografia](https://drive.google.com/file/d/1tILRG_As7Zkt0uf6MNBWUur8EyzyUq_Q/view)

## Padrão das provas

| Prova | Itens | Válidos | Anulados | Marca de gabarito cotejada |
|---|---:|---:|---:|---:|
| 2006 | 70 | 70 | 0 | 70/70 |
| 2008 | 73 | 68 | 5 | 73/73 |
| 2011 | 71 | 67 | 4 | 71/71 |
| 2012, Rosa | 50 | 49 | 1 | 50/50 |
| **Total** | **264** | **254** | **10** | **264/264** |

A lista por ID e página está em `EVIDENCIAS.csv`. As provas de 2006 e 2008 trazem marcações com X. As de 2011 e 2012 usam texto em vermelho além das indicações de anulação. Na questão 55 de 2011, o texto da alternativa E está em vermelho e o rótulo em preto. Na questão 7 de 2012, a prova definitiva anula o item por erro de digitação em uma das assertivas. O cotejo compara as marcações visíveis ao corpus do GitHub. A contagem de formatos em `PROVAS.json` usa a classificação do repositório. [Provas da DPC](https://www.marinha.mil.br/dpc/provas-anteriores)

Para orientar a revisão autoral, as provas mostram termos e definições, aplicação em cenários, correlação, assertivas, V/F e cálculo. Os distratores devem diferir em condições, efeitos, grandezas ou procedimentos tecnicamente próximos. Em cenários de RIPEAM, declarar os fatos que mudam a regra aplicável. O exemplo de sinais em cerração da questão 69 de 2006 cobra reconhecimento de um padrão completo, enquanto a questão 55 de 2011 exige interpretar o conjunto de luzes e distinguir restrição por calado de outras condições. A questão 73 de 2008 testa o conceito de arrasto transverso com métodos de utilização de rebocadores como alternativas. [2006](https://drive.google.com/file/d/1Gui93qN4JdJHVa4mPizFyq_H1cNx-6oo/view) · [2008](https://drive.google.com/file/d/1JuBKSAOf0xoVspYRKNpQpsoa8o1-q-VV/view) · [2011](https://drive.google.com/file/d/1ReaJnki3nBYXM59csVUCDucxThicU8dk/view) · [2012](https://drive.google.com/file/d/1dW4A2fuRojlL2Bs3jlVmkD0XjZDKeOAi/view)

## Triagem das questões autorais

O inventário preliminar encontrou **3.051 IDs candidatos**, dos quais **2.555** com referência explícita e **496** identificados somente por tema. Há **2.367** candidatos em pelo menos um dos runtimes locais. Um ID pode aparecer em duas obras ou em consumidores diferentes. Os totais por referência comportam sobreposição. A lista detalhada registra origem, ponteiro no JSON, hashes, edição e localização disponível, presença nos cadernos, catálogo e elegibilidade editorial no Simulado. A presença em produção depende ainda de reconciliação com o fluxo de seleção e observação da interface.

A triagem abrangeu sete bancos físicos, extensões, restaurações, imports e patches JSON com enunciado, lotes do Simulado e os dois runtimes gerados. Faltam a reconciliação integral de parciais sem enunciado e do escopo semântico, a revisão bibliográfica individual e a checagem de exposição efetiva ao aluno. Os **3.051 IDs** permanecem pendentes. A questão `CGE-PIANC121-C1-1-2-3` é uma menção ao Report 117 em pergunta fundamentada expressamente no Report 121, § 1.2.3. Consta na triagem temática para revisão da pertinência. Nenhuma questão foi encontrada com o Report 117 como referência declarada.

## Fontes e versões

- **Santos, hidrodinâmica.** Capa, ficha catalográfica, índice e páginas finais do OCR identificam a 1ª edição CONAPRA de 2021. O arquivo possui 178 páginas de PDF e termina durante o capítulo 6. O índice lista referências a partir da página impressa 185. Confirmar continuidade e legibilidade dos capítulos pertinentes antes de homologar. [Cópia consultada](https://chatgpt.com/library?file_id=libfile_95cb7b83c88881918c6b19329b66c55d&account_id=personal)
- **Santos, manobrabilidade.** O arquivo OCR de 239 páginas foi identificado pela capa e pelo índice. A última página é a 245 impressa e encerra o capítulo 11. A apresentação do Drive tem título e estrutura distintos. O arquivo de erratas foi localizado e ainda precisa de extração e cotejo. [Livro](https://chatgpt.com/library?file_id=libfile_fd17d758c4dc81919dc62b7907afbecf&account_id=personal) · [Apresentação](https://drive.google.com/file/d/1aXKLzchRZiBcuf8xZWXF7vR3ez6LqBnw/view)
- **NORMAM-311.** Usar a versão publicada com a Portaria 206, de 21/09/2026, que revoga a 204. A equivalência da cópia do Drive com a norma vigente precisa ser comprovada. [DPC](https://www.marinha.mil.br/dpc/normam-311)
- **NORMAM-701.** Usar a edição 2023 e conferir as alterações de 2026 no item 2.3 e no Anexo C, respectivamente pelas Portarias DHN 31 e 32. [Portaria 31](https://www.marinha.mil.br/sites/default/files/atos-normativos/dhn/Port-DHN-DGN-MB-31-2026.html) · [Portaria 32](https://www.marinha.mil.br/sites/default/files/atos-normativos/dhn/Port-DHN-DGN-MB-32-2026.html)
- **Fragoso/Cajaty, Ynoue et al. e Lobo/Soares.** Os arquivos foram localizados no Drive. O cotejo deve identificar edição, capítulo e página. Para Fragoso/Cajaty, restringir a revisão aos capítulos 1 a 3. [Fragoso/Cajaty](https://drive.google.com/file/d/1p1tefk-QCefj5F2K-Nf7DOcKSKuxfC3F/view) · [Ynoue et al.](https://drive.google.com/file/d/1U3X0yOf1zIPLwvr3waCAOkstAY6aq5w4/view) · [Lobo/Soares](https://drive.google.com/file/d/1qcF61kvGvSOIUd9M961OtTc8TWeplzKb/view)
- **PIANC 117.** A editora confirma relatório de dezembro de 2012. A página pública é um resumo. A íntegra em fonte autorizada segue indisponível nesta execução. [PIANC](https://www.pianc.org/publication/use-of-hydro-meteo-information-for-port-access-and-operations/)
- **RIPEAM/COLREG.** A bibliografia identifica a edição consolidada de 2018. A Marinha disponibiliza tradução consolidada com emendas de dezembro de 2013. A Resolução A.1085(28) acrescenta a Parte F, regras 39–41. A avaliação por questão deve registrar a regra e as condições aplicáveis. [Marinha](https://www.marinha.mil.br/sites/www.marinha.mil.br.salvamarbrasil/files/ripeam_colreg_consolidada_com_emd_dez2013.pdf) · [IMO](https://wwwcdn.imo.org/localresources/en/KnowledgeCentre/IndexofIMOResolutions/AssemblyDocuments/A.1085%2828%29.pdf)

## Validação e continuidade

Passaram validação estrutural dos sete bancos (14.538 registros), teste de estrutura, blueprint histórico, geração dos dois runtimes, validação dos 12.158 registros ativos e seus filtros de caderno e teste da matriz 25/25/10/10/10/10/10. O build de produção passou com avisos de CSS. O teste de taxonomia geral registrou 1.327 pendências ativas preexistentes e zero novas. A validação específica de rastreio de Arte Naval reprovou na main, com divergências nos IDs e ausência de campos de proveniência em expansões. Os testes de repetição, seleção e validação editorial do runtime passaram. Nenhuma questão autoral foi corrigida ou homologada neste lote. O Vercel retornou Production READY para o SHA da base, relativo ao PR paralelo #261. [Produção da base](https://vercel.com/estibordo/estibordo-pscpp/A31v3RXfFFrtkbr9MnSyoxY9J6CR)

Na próxima rodada, reconciliar os 3.051 IDs com a `main` vigente, cobrir overrides parciais, refinar a classificação temática e iniciar o lote de hidrodinâmica pelos candidatos ativos ancorados nos capítulos 3 e 4. Verificar novamente os PRs #172, #175 e #184 e quaisquer alterações nos IDs compartilhados. O PR #262 fica em rascunho.
