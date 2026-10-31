# ESTIBORDO/PSCPP — HENSEN — Checkpoint 014: saneamento de duas equivalências do Lote 011

**Data:** 30/10/2026 (America/Sao_Paulo). **Escopo:** exclusivamente Henk Hensen, *Tug Use in Port*, 4ª edição (2021), capítulos 1–7 e 9. **PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173 . **Branch:** `audit/hensen-lote-001-20261029`.

## Diagnóstico e mudança efetiva

O checkpoint 013 registrou duas equivalências conceituais ainda pendentes. Esta execução **substituiu os dois conteúdos** preservando IDs, cinco alternativas, gabaritos e taxonomia `II — Arte Naval / hensen-tug`, sem desativar validações nem alterar a quarentena.

- `ANV-HENSEN-C01-L011-01` repetia `ANV-HENSEN-C01-L001-01` (acesso bilateral em píer em T). A nova competência é **sincronizar a encomenda de rebocadores com a construção de nova bacia**; o §1.2.1, p. 5 (PDF 18), afirma que as empresas podem considerar novas instalações ao encomendar unidades adequadas. Diferencia-se de `C01-L003-01`, que cobra participação dos operadores nos estudos de engenharia, embora compartilhe a mesma passagem; manter revisão semântica independente pendente.
- `ANV-HENSEN-C01-L011-04` repetia `C01-L002-04`, `C01-L007-04` e `C01-L008-04` (treinamento na transição de frota). A nova competência é **reconhecer a tradição operacional local como um dos fatores que influenciam o método de assistência**, sem dispensar análise de segurança; §1.2.5, p. 6 (PDF 19).

**Fonte primária consultada:** https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view . O texto das duas seções foi conferido diretamente no documento da quarta edição; a paginação visual das duas páginas não foi novamente renderizada nesta execução.

## Antes/depois individual

### ANV-HENSEN-C01-L011-01

**Antes (commit 24c35712):**

**Tema:** Acesso bilateral em píeres sobre dolphins

**Enunciado:** Um navio atracará em um píer em T, apoiado em dolphins, e o prático avalia o posicionamento dos rebocadores. Qual possibilidade de assistência difere da atracação junto a um cais contínuo?

- A) Os rebocadores ficam necessariamente limitados ao bordo externo do píer.
- B) A assistência por cabo é incompatível com dolphins, mesmo com área livre.
- C) Os rebocadores podem, conforme o arranjo do píer, atuar nos dois bordos do navio.
- D) A configuração obriga os rebocadores a operar exclusivamente pela popa.
- E) O acesso dos rebocadores depende apenas do calado, não da geometria de amarração.

**Gabarito:** C

**Explicação:** Hensen distingue píeres e dolphins, que podem permitir atuação nos dois bordos, de cais contínuos, onde a assistência costuma ficar restrita a um lado.

**Localizador:** Chapter 1, §1.2.1, p. 4 (PDF p. 17)

**Depois (commit 13b4b611):**

**Tema:** Antecipação da aquisição de rebocadores para nova bacia

**Enunciado:** Uma nova bacia portuária exigirá rebocadores com características diferentes das unidades atuais. A inauguração está prevista para o próximo ano, mas a empresa pretende avaliar a encomenda de novas unidades somente depois de iniciar as operações. Qual providência evita o descompasso identificado por Hensen?

- A) Aguardar a primeira atracação para descobrir se o método atual é compatível, antes de especificar a frota.
- B) Concluir a obra e empregar necessariamente os rebocadores antigos, independentemente das restrições novas.
- C) Antecipar a especificação e a encomenda dos rebocadores compatíveis com a nova bacia, usando as informações do projeto e a experiência operacional antes de sua entrada em serviço.
- D) Substituir a análise de requisitos pelo bollard pull médio dos rebocadores disponíveis em outros portos.
- E) Definir as características dos rebocadores somente após o primeiro incidente na bacia.

**Gabarito:** C

**Explicação:** Ao tratar de novos portos e bacias, Hensen recomenda participação antecipada de práticos e empresas de rebocadores nos estudos. Isso também permite às empresas considerar as novas instalações ao encomendar rebocadores adequados, evitando que a infraestrutura fique pronta sem a frota apropriada. A competência cobrada aqui é a sincronização da aquisição da frota com o desenvolvimento portuário, não apenas a consulta ao projeto.

**Localizador:** Chapter 1, §1.2.1, p. 5 (PDF p. 18)

**Metadados:** `validation_status=pending_editorial_review`; `validation.duplicate_checked=false`. Não há homologação semântica independente. O ID e o gabarito foram preservados.

### ANV-HENSEN-C01-L011-04

**Antes (commit 24c35712):**

**Tema:** Gestão da transição para novo método de assistência

**Enunciado:** Uma autoridade portuária decide substituir um método tradicional por outro que exige manobras e comandos muito diferentes. Qual condição de implantação deve acompanhar a troca de frota?

- A) Introduzir a mudança imediatamente após a entrega do rebocador, sem adaptação dos operadores.
- B) Planejamento de transição com instrução e treinamento de práticos e comandantes de rebocadores antes da operação regular.
- C) Preservar todos os comandos antigos mesmo que produzam movimentos diferentes no novo sistema.
- D) Substituir o treinamento por uma comparação entre potência nominal dos rebocadores.
- E) Dispensar avaliação de riscos porque o método novo é tecnologicamente mais moderno.

**Gabarito:** B

**Explicação:** O §1.2.6 destaca a experiência acumulada com métodos locais e alerta que mudanças de tipo ou método exigem instrução, treinamento e transição planejada.

**Localizador:** Chapter 1, §1.2.6, p. 6 (PDF p. 19)

**Depois (commit 13b4b611):**

**Tema:** Influência da tradição local na escolha do método de assistência

**Enunciado:** Dois portos de geometria semelhante atendem navios comparáveis, mas utilizam métodos diferentes de assistência por rebocadores. Um estudo propõe declarar um dos métodos inadequado apenas por divergir do outro. Segundo os fatores apresentados por Hensen, qual análise é necessária?

- A) Impor o método do porto com maior movimento anual, sem avaliar as condições locais.
- B) Considerar que a tradição operacional local também influencia o método, junto com o arranjo do porto, tipos de navio, condições ambientais e complexidade da navegação.
- C) Admitir que a tradição é o único critério válido e dispensa análise de segurança.
- D) Concluir que métodos distintos só podem resultar de diferenças de potência nominal dos rebocadores.
- E) Descartar a influência de pontes, eclusas e necessidade de escolta porque os navios são semelhantes.

**Gabarito:** B

**Explicação:** Na relação de fatores que determinam o método de assistência, Hensen inclui, além da geometria portuária, navios, ambiente, complexidade da navegação, pontes, eclusas e escolta, a tradição local. Portanto, uma diferença entre métodos não demonstra, por si só, inadequação; ela exige análise operacional e de segurança. A questão não trata do treinamento necessário para trocar de método, já cobrado em outros lotes.

**Localizador:** Chapter 1, §1.2.5, p. 6 (PDF p. 19)

**Metadados:** `validation_status=pending_editorial_review`; `validation.duplicate_checked=false`. Não há homologação semântica independente. O ID e o gabarito foram preservados.

## Verificações e limites da auditoria

- **Commit de conteúdo:** https://github.com/noconvescomdavi/simulado-pscpp/commit/13b4b6119df3e87afef6a09d8ea9c570417e8e92 .
- **Integridade local:** 12 arquivos `hensen-lote-001..012.json`, **480 questões / 480 IDs únicos**, cinco alternativas distintas, explicação e localizador presentes; **96 gabaritos por letra A–E**. Lote 011: 40 questões, 8 por letra.
- **Triagem lexical dos dois novos enunciados contra as 479 outras questões dos 12 lotes:** Jaccard máximo 0,132 para `C01-L011-01` (mais próximo `C01-L010-02`) e 0,179 para `C01-L011-04` (mais próximo `C01-L008-05`). A triagem **não comprova originalidade semântica**; a verificação contra todos os históricos por significado permanece pendente.
- **Históricos confirmados diretamente nos dez arquivos originais:** 170 IDs únicos; **119 com `active=false` e `validation_status=quarantined`**, 51 ativos sob revisão. `ANV-B010-16` é apenas candidato reescrito, ainda em quarentena. Nenhum histórico foi reativado.
- **Full Question Bank Audit no SHA de conteúdo:** PASS; 166 arquivos, 26.025 registros examinados, **0 críticos e 2.558 achados HIGH**: `LOCATOR_DEPENDENT_STEM=816`, `DUPLICATE_STEM=1483`, `GENERIC_TEMPLATE=258`, `OFFICIAL_SOURCE_DUPLICATE_OPTIONS=1`. O workflow PASS **não significa que esses achados foram corrigidos**. Evidência: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41010307910 .
- **Audit Main Question Banks:** PASS no SHA de conteúdo. Evidência: https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41010307903 .
- **CI, PSCPP Integral Bank Audit e Validate PIANC 121 CGE Quarantine:** `in_progress` na última consulta do SHA de conteúdo, respectivamente https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41010307916 , https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41010307915 e https://github.com/noconvescomdavi/simulado-pscpp/actions/runs/41010307946 . Não inferir aprovação.
- **GitHub PR:** aberto, `mergeable=true` na consulta do SHA de conteúdo, mas **merge bloqueado** por gates incompletos, Vercel e revisão editorial.
- **Vercel Preview do SHA de conteúdo:** não encontrado ao filtrar deployments por `13b4b6119df3e87afef6a09d8ea9c570417e8e92`; GitHub `Vercel=failure` com `api-deployments-free-per-day` / limite de builds: https://vercel.com/estibordo?upgradeToPro=build-rate-limit . Alguns previews antigos estão READY, mas **não equivalem ao HEAD**.
- **Vercel Production:** READY exclusivamente para `main@a03ccf972a021f9a2c8fee3ba09de3271fa089a7`, https://vercel.com/estibordo/estibordo-pscpp/Ge8vf857oW5hH1tzasSPgjNbReiJ ; **não contém as alterações HENSEN do PR**.
- **Merge e publicação:** não realizados. Nenhum teste desabilitado, nenhum status alterado para aprovado por inferência.

## Próximo checkpoint

1. Reconsultar todos os cinco workflows no **novo HEAD documental** e identificar falhas reais, se houver.
2. Aguardar legitimamente a liberação da Vercel e exigir Preview READY **no SHA exato**; verificar revisão editorial antes de integrar.
3. Continuar auditoria semântica e bibliográfica independente dos 480 novos, 51 históricos ativos e 119 em quarentena. Não confundir candidato reescrito com reparo definitivo.
4. Antes de novo lote, consultar a existência de `hensen-lote-013.json` e seus checkpoints para evitar duplicação. Não gerar lote novo enquanto o gate do PR estiver bloqueado.

**Estado:** PR #173 aberto, sem merge e sem deploy de produção. Este relatório gera commit documental adicional, que exige reconfirmação dos checks no novo HEAD.
