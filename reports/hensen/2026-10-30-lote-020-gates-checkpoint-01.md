# HENSEN — Lote 020 — checkpoint persistente 01
Data: 2026-10-30. PR #173. Branch `audit/hensen-lote-001-20261029`.

## Inventário e preservação
- Antes: lotes 001–019, 760 questões novas; 170 HENSEN históricos (119 em quarentena e 51 ativos).
- Incluído: lote 020, 40 questões, cinco por capítulo 1–7 e 9, gabaritos A=8 B=8 C=8 D=8 E=8.
- Inventário bruto esperado: 20 lotes / 800 questões novas + 170 históricas = 970 registros HENSEN.
- Arquivos anteriores e históricos preservados; nenhum validador, workflow, configuração de merge ou deploy alterado.

## Commits e arquivos
- `67b1063d8d04c1034cc8f72fa0c9e81f2f7c2200`: inclusão de `data/question-extensions/hensen-lote-020.json`.
- `d4756a2d6a83773b268f45724670342b5ca7720b`: reescrita conceitual de `ANV-HENSEN-C03-L020-02` após alerta de similaridade com lote 019.
- `465a22da7ad24b574d566dcf1935b0335c84c158`: reequilíbrio A–E preservando o gabarito A de C03-L020-02.
- `a1c40592cd47ffa954f6d4bcaa7eb84dfbc35932`: correção/refinamento de 13 localizadores por seção.
- `79fdec9de5c6fa9cca9e4599373a786fc2a5a951`: relatório individual `reports/hensen/2026-10-30-lote-020-auditoria.md` com 40 IDs.

## Testes e evidências
- Fonte: Henk Hensen, *Tug Use in Port*, 4ª ed. (2021), PDF no Google Drive `1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9`.
- 40/40 âncoras localizadas no texto extraído nas regiões das páginas impressas declaradas; PDF p. = impressa + 13.
- Validação estrutural local em memória: 40 IDs, cinco alternativas distintas A–E, uma correta, taxonomia e formato de localizador; zero falhas.
- Confronto literal com 760 questões dos 19 lotes anteriores: zero colisões; Jaccard lexical máximo 0,308, zero pares ≥0,34 após reescrita.
- Confronto literal com 170 históricos de dez blocos: zero colisões; Jaccard máximo 0,250.
- GitHub Actions `Full Question Bank Audit` no commit `465a22d`: **success** (run 41056235713), log `HENSEN_SOURCE_GUARD: 20 lotes, 800 questões, 0 falhas`; auditoria global: 26.345 questões, 2.558 HIGH, zero CRITICAL.
- No commit `a1c4059`: `Full Question Bank Audit` success (41056593234), `Audit Main Question Banks` success (41056593047), `Validate PIANC 121 CGE Quarantine` success (41056593087); `CI` (41056593280) e `PSCPP Integral Bank Audit` (41056593018) ainda em execução na consulta.
- No commit do relatório `79fdec9`: cinco workflows em execução na consulta (CI 41056636248; Audit Main 41056636429; Integral 41056636309; Full 41056636569; PIANC 41056636290).
- Os resultados de commits anteriores **não homologam o HEAD deste checkpoint**; consultar novamente os gates para o commit final.

## Pendências e bloqueios
- Revisão editorial/semântica independente de todos os 40 itens, com comparação aprofundada com os lotes e o banco principal.
- Cotejo visual página a página do PDF e confirmação editorial de localizadores, em particular `C06-L020-03` cuja subseção ainda está indicada como §6.3.
- `data/questions/arte-naval.json` não foi integralmente acessível pelo conector (arquivo grande/truncamento).
- Não foi possível executar `npm` localmente: o ambiente não resolve o host GitHub para clonagem.
- Todos os gates no HEAD final, CI, auditoria integral e Vercel Preview exigem confirmação.
- Status `pending_editorial_review`; **não fazer merge nem deploy** sem todos os gates e homologação editorial.

Próximo lote a verificar no repositório: 021, somente após conferir existência, checkpoints e pendências.

## Revisão editorial adicional — checkpoint 02 (2026-10-30)
- Leitura dirigida de questões anteriores identificou equivalências conceituais não detectadas pela triagem lexical. Foram reescritos **mais oito itens** no commit `5dfd8d420faa3b0c719c8d871c36d1f4ad8cb3bd`: C03-L020-03/05, C05-L020-04/05, C06-L020-02/03/05 e C09-L020-05.
- Uma décima reescrita conceitual do lote, C03-L020-01, foi publicada no commit `20557d919cbf66a8c05e781db6796e48ec4b7190`.
- Todas as dez questões reescritas preservaram IDs e gabaritos; 8 gabaritos por letra, 5 itens por capítulo e 40 âncoras bibliográficas verificadas em texto extraído.
- Relatório individual dos 40 IDs atualizado no commit `95908db741a0c055faf4bce6283a01057f74d547`, com o texto final das questões e registro das dez reescritas.
- Triagem final de 40 itens contra 760 questões anteriores: zero colisões literais; Jaccard máximo **0,300**, nenhum par ≥0,34. Contra 170 históricos: zero colisões literais; Jaccard máximo **0,176**.
- No commit do JSON final `20557d9`, `Full Question Bank Audit` **success** (run 41057026749), `Audit Main Question Banks` **success** (41057026695), `Validate PIANC 121 CGE Quarantine` **success** (41057026816). `CI` (41057026714) e `PSCPP Integral Bank Audit` (41057026689) ainda em execução na consulta.
- Log da auditoria integral do banco no run 41057026749: `HENSEN_SOURCE_GUARD: 20 lotes, 800 questões, 0 falhas`; 26.345 questões examinadas, 0 CRITICAL e 2.558 HIGH na classificação global.
- As aprovações citadas são do commit do JSON, **não do HEAD deste checkpoint**. Reconsultar os workflows e a verificação de preview no HEAD final. `pending_editorial_review` mantido, sem merge ou deploy.
