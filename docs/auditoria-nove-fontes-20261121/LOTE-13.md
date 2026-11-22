# LOTE-13 — 22/11/2026 11h America/Sao_Paulo

## Leituras e concorrência
Prompt-mestre integral, CHECKPOINT 12 e PR #262 consultados. Main avançou de `6f5b7ea2dcf63baefdc51b4f484b63ca397bf8bc` para `43571dfab37cc00de75faa12c10ee3baaf393dd1` via PR #273. Diff: pacote `manobrabilidade-msc137-lote-15.json` adicionado (blob `77ff1b3fa9e080b92750a3d443d87c2d61169ed4`) e `lib/question-restorations.js` alterado (blob `83fdb9fbcda0152dc904b57e05536488ca549a34`).

## Triagem estrutural
15 registros, 15 IDs distintos; 15 registros com cinco alternativas A–E e chave presente. IDs: MAN-1569, MAN-1570, MAN-1571, MAN-1572, MAN-1573, MAN-1574, MAN-1575, MAN-1576, MAN-1577, MAN-1578, MAN-1623, MAN-1624, MAN-1625, MAN-1626, MAN-1627.

Fontes declaradas: Explanatory Notes to the Standards for Ship Manoeuvrability (7); Standards for Ship Manoeuvrability (7); A Manobrabilidade do Navio no Século 21 (1). Registros que declaram Santos: MAN-1577. Isto não é cotejo bibliográfico e não demonstra correção do gabarito.

## Origem efetiva e bloqueios
O consumidor usa `Map` por ID com precedência do último pacote, substitui apenas IDs presentes no banco-base e aplica `reformulateLeakingStem`. A origem efetiva de cada ID exige reconstrução de todos os pacotes, base e consumidor final; comparação global dos 3.051 candidatos permanece pendente. Seis IDs Santos anteriores (MAN-1253, MAN-1307, MAN-1361, MAN-1415, MAN-1469, MAN-1523) seguem sem cotejo primário. PIANC 117 integral segue não comprovado.

## Gates
Nenhuma questão homologada, corrigida ou revisada em segunda passagem. Testes reais desta rodada: parse JSON, contagem/unicidade local, estrutura A–E, presença de chave e comparação de commits. Não executados: teste integrado do runtime, deduplicação global, build, CI, Vercel ou validação da taxonomia Arte Naval (falha preexistente). Sem merge do PR #262.

## Próxima etapa
Conferir edição primária Santos CONAPRA 2021 e reconstruir os hashes/origens efetivas dos 3.051 candidatos antes de qualquer edição ou integração.
