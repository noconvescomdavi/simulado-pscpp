# Lote 02 — reconciliação da main, origem e concorrência

Data da rodada: 2026-11-22, 00h00 America/Sao_Paulo. **Estado: reconciliação estrutural parcial; nenhuma homologação editorial autoral.**

## Bases verificadas
- `main`: `14c6afed392cb6d87e80c8ff3453299e949039b4`, igual ao baseline do checkpoint 01. Os últimos commits da main (PRs #258–#261) alteraram questões MSC.137(76) em Manobrabilidade antes da criação da branch.
- PR #262: aberto, draft, HEAD pré-rodada `cf64490c9125c347122dba70c2e4955dddab22cc`. Os arquivos alterados no PR são apenas `docs/auditoria-nove-fontes-20261121/*`, sem edição de questões.
- PRs paralelos de auditoria: #172, #173, #175, além de #184 (deduplicação conceitual). Não transplantar alterações de PRs antigos nem supor que seus dados já estejam em main.
- Os sete arquivos canônicos em `data/questions` foram localizados por SHA de blob. Não houve diferença de base a reconciliar entre checkpoint 01 e main, mas o cotejo de hashes por **ID** e de overrides runtime permanece pendente, pois os arquivos completos são grandes demais para leitura via conector GitHub desta rodada.

## Manifesto de blobs da main
| Arquivo | Blob SHA | Bytes |
|---|---|---:|
| arte-naval.json | e745ff262af143b59c5f629f59d8f42edecd303e | 9.712.305 |
| comunicacoes.json | 9b0459a90756c864a45a556dc5ec6406d4e7f404 | 3.673.645 |
| conhecimentos-gerais.json | 1943eaf1093e401efc1abfd6ebde06b99f1a9021 | 4.556.573 |
| legislacao-regulamentacao.json | cd7b16ea5cdef66c708f30c35bd8e408ff158676 | 5.798.582 |
| manobrabilidade.json | 7d91a960b5901e1595e723d0382ddd3693616a62 | 15.283.829 |
| meteorologia-oceanografia.json | a19068ec68e381fd4a2cbbf5cd9b21ce2492cd1c | 4.960.979 |
| navegacao-aguas-restritas.json | 6bfacdbad217943ce9b7270faca5a0fb31890d27 | 6.650.344 |

Diretórios adicionais: `data/questions/imports` = `8f158dbe78632aac108809fb607d98b9db627f17`; `data/questions/patches` = `a93559c92c13cc789ce089bbe83b0315d96b070e`.

**Achado de proveniência:** há `data/questions/imports/pianc121-cap1-quarentena.json` e `data/questions/patches/pianc121-cap1-editorial-001.json`, referentes a **PIANC 121**, e não ao **PIANC 117** do escopo. Não misturar os dois relatórios, não homologar por associação lexical PIANC e não reativar registros em quarentena.

## Cobertura e limites
- O inventário preliminar do checkpoint 01 contém 3.051 candidatos autorais (2.555 com referência explícita; 496 somente por tema). São **candidatos**, não questões bibliograficamente homologadas.
- A etapa 01 documentou 264 itens históricos (254 válidos e 10 anulados). Não recontar como 264 itens autorais aprovados.
- **Nesta rodada: 0 questões autorais lidas integralmente com obra primária; 0 corrigidas; 0 homologadas; 3.051 candidatos ainda pendentes.** Não houve alteração de bancos, de gabaritos ou de produção.
- Falha preexistente registrada no checkpoint 01: `validate:taxonomy:arte-naval` reprovado na base; 1.327 pendências ativas preexistentes em `validate:taxonomy:master`. Os testes não foram reexecutados nesta rodada; seus estados são históricos, não resultados novos.

## Próxima execução efetiva
1. Materializar os sete JSONs da main e os consumidores, identificar por ID os 48 candidatos hidrodinâmica (incluindo `CGE-1111`, `MAN-287`, `MAN-2941`) e calcular hashes dos registros completos e da origem efetiva.
2. Cotejar esses IDs com os capítulos 3 e 4 do OCR de Santos *Princípios de hidrodinâmica...*, incluindo legibilidade e páginas impressas, antes de corrigir ou aprovar.
3. Registrar evidências por ID, fazer segunda passagem, executar testes e atualizar os CSV/JSON/MD cumulativos.
4. Não alterar `main`, não realizar merge e não alegar Production READY sem lotes homologados.
