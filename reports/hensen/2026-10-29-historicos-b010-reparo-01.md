# HENSEN — reparo individual de questão histórica em quarentena — B010 / 01

**Data:** 29/10/2026. **PR:** https://github.com/noconvescomdavi/simulado-pscpp/pull/173  
**Fonte:** Henk Hensen, *Tug Use in Port*, 4ª edição revisada, 2021, capítulo 7, §7.2.1, página impressa **178**, PDF **191**.  
**Arquivo alterado:** `data/question-extensions/pscpp-caderno-bloco-010.json`.  
**Commit de conteúdo:** https://github.com/noconvescomdavi/simulado-pscpp/commit/6eb7a92766566cd7d5bd3d61bd430a2de3b0aee9 .

## Inventário do bloco 010

- **17 questões** com bibliografia `hensen-tug`, IDs `ANV-B010-01` a `ANV-B010-17`, todas em **quarentena reversível** no início e no fim da execução.
- `ANV-B010-01` a `ANV-B010-13`: temas de estrutura do casco, aparelhos e nomenclatura geral de Arte Naval, sem fundamentação específica demonstrada em Hensen. **Mantidas em quarentena**, sem trocar indevidamente a fonte ou simular correção.
- `ANV-B010-14` a `ANV-B010-17`: temas nominalmente pertinentes a rebocadores, mas questões originais têm afirmações de Arte Naval misturadas, gabaritos potencialmente não exclusivos ou estrutura incompleta. Apenas `ANV-B010-16` foi reescrita nesta execução. As demais continuam sem reparo.
- Esta triagem é documental; não declara os outros 16 itens corrigidos.

## ANV-B010-16 — antes/depois

**Antes:**
- Tema: `gob rope e gog line`; estilo `Completar`, `pscpp_format: fill`.
- Enunciado: `Complete corretamente, conforme HENSEN — Tug Use in Port, 4ª ed., a proposição relativa a gob rope e gog line: ______.`
- Alternativas A–E: cinco proposições técnicas independentes, várias defensáveis; a lacuna não define uma resposta unívoca.
- Gabarito registrado: A. Explicação genérica e circular. Localizador `Chapters 4–8`, abrangendo capítulo 8 fora do escopo autorizado.
- Taxonomia: `hensen-tug::b10`; `active=false`; `validation_status=quarantined`.

**Depois:**
- Tema: `Gob rope — comprimento e risco de girting`; estilo `Aplicada`, `pscpp_format: direct`, nível cognitivo 4.
- Enunciado: `Durante a desatracação, um rebocador convencional atua na popa de um navio que começa a ganhar seguimento avante. A gob rope permaneceu conectada e seu comprimento impede o rebocador de girar para acompanhar o movimento. Segundo Hensen, qual é o risco operacional principal?`
- A (correta): `A gob rope tensionada pode impedir a guinada do rebocador e produzir uma situação de girting, com risco de emborcamento.`
- B: `O cabo de reboque necessariamente se rompe antes de surgir qualquer esforço transversal no rebocador.`
- C: `O ponto de reboque se desloca automaticamente para vante, eliminando a possibilidade de girting.`
- D: `O aumento do seguimento do navio sempre reduz a tensão da gob rope, independentemente de seu comprimento.`
- E: `A gob rope, por ser um cabo auxiliar, torna desnecessário controlar a posição e a orientação do rebocador.`
- Explicação: fundamenta a necessidade de controlar o comprimento e desconectar a gob rope quando não necessária, para evitar o bloqueio da guinada e o girting.
- **Localizador exato:** `Chapter 7, §7.2.1, p. 178 (PDF p. 191)`. **Taxonomia:** `arte-naval / hensen-tug / hensen-tug::ch7`.
- **Gabarito A preservado. ID preservado.** Estado **`active=false` e `validation_status=quarantined` preservado**, com `editorial_review.status=rewritten_pending_independent_review` e `independent_review_required=true`.

## Fundamentação e cautelas

A página 178 descreve um rebocador convencional saindo de um berço com gob rope ainda conectada: ao ganhar seguimento, o navio pode tensionar o arranjo e impedir que o rebocador gire, criando situação de girting. A mesma página recomenda desconectar a gob rope quando não necessária e ressalta a necessidade de comprimento seguro. O cenário e a alternativa A refletem diretamente esse mecanismo.

Cotejo preliminar com as 160 novas: `ANV-HENSEN-C07-L001-01` avalia a função geral da gob rope; `ANV-HENSEN-C07-L001-02` avalia o dimensionamento dos componentes. O presente item trata do **risco específico de manter o arranjo conectado em comprimento inadequado durante a desatracação**. Há proximidade temática, mas não identidade literal; **revisão semântica independente ainda é obrigatória**.

**Não houve reativação** nem homologação final. A correção é editorial e bibliográfica, com pendência de validação externa, testes do HEAD e compatibilidade de runtime. Nenhuma das outras 118 questões históricas foi reparada nesta execução.
