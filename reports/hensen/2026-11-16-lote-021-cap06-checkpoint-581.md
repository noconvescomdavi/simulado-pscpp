# Checkpoint 581 — Hensen L021/C06 — 2026-11-16

PR: https://github.com/noconvescomdavi/simulado-pscpp/pull/173
Branch: audit/hensen-lote-001-20261029
HEAD antes: f308bffeddaf6f587ed82a0638ae558ce9f4376e
Banco: data/question-extensions/hensen-lote-021.json (blob ae347943f242267fd0a12014bcea2ec042182d2b)
Fonte primária: https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view — Henk Hensen, Tug Use in Port, 4ª ed. (2021).

## Cotejo individual (5 questões, 25 alternativas)

| ID | Gabarito antes → depois | Evidência primária, análise das alternativas e decisão |
|---|---|---|
| ANV-HENSEN-C06-L021-01 | A → A | §6.2.3 p.150: interação determinada pela velocidade relativa da água ao casco, independentemente de navio avançar na água ou água passar pelo navio. SOG zero e corrente de 3 nós são aplicação consistente. B confunde SOG e velocidade relativa; C/D/E são parâmetros alheios à causa. Enunciado, gabarito, explicação e localizador preservados. |
| ANV-HENSEN-C06-L021-02 | D → D | §6.3.2 p.156, figura 6.7B: exemplo de rebocador convencional comprimido contra o casco ao tentar escapar com máquina toda avante e leme; autor recomenda toda força a ré. A/B/C/E não corrigem a situação perigosa. Preservada a ressalva de que é a situação específica descrita, não uma regra universal. Sem mudança. |
| ANV-HENSEN-C06-L021-03 | B → B | §6.3.5 pp.159–160: guarnição deve preparar pelo menos duas retinidas adequadas antes da chegada; atraso força rebocador a permanecer mais tempo na região de risco próxima à proa. A/C/D/E não decorrem do texto. Sem mudança. |
| ANV-HENSEN-C06-L021-04 | E → E | §6.3.12 p.164: sob nevoeiro, cabeços e ganchos não confiáveis dificultam soltura sob tensão; guincho de liberação confiável operável no passadiço e no próprio guincho é a opção mais segura. A/B/C/D contradizem a recomendação. O texto também ressalva preferência ocasional por cabo do navio em cabeço/gancho; não altera a resposta da pergunta. Sem mudança. |
| ANV-HENSEN-C06-L021-05 | C → C | §6.3.13 p.168: limites específicos para conectar bow-to-bow (alguns ASD 3–4 nós) e operar conectado (alguns 4–5 nós), ambos em velocidade através da água e dependentes das ondas. A/B/D/E são generalizações ou confusão com GPS. Valores 4/5 são exemplo compatível com a obra, não limite universal. Sem mudança. |

## Resultado e pendências

Cotejo textual substantivo concluído para os cinco IDs e 25 alternativas. Nenhum erro inequívoco exigiu correção do JSON; antes/depois de conteúdo: inalterado. **Não homologar definitivamente:** falta inspeção visual das páginas/figuras, deduplicação semântica cruzada integral contra lotes 001–022 e históricos, e gates do HEAD final. Não marcar duplicate_checked=true. Os 119 históricos continuam em quarentena; nenhum reativado ou revisado individualmente nesta rodada.

Comparações cruzadas prioritárias: C06-L021-01 versus demais questões sobre velocidade na água e interação; C06-L021-02 versus acidentes de rebocadores na proa; C06-L021-04 versus quick release nos capítulos 6–7; C06-L021-05 versus limites bow-to-bow dos lotes 019–020. Estes são candidatos de verificação, não duplicatas comprovadas.

PR consultado aberto, mergeable=false no SHA inicial. Nenhum teste ou gate final foi executado nesta rodada; Vercel Production READY não certificado. **Sem merge/deploy.** Próximo bloco L021/C07.
