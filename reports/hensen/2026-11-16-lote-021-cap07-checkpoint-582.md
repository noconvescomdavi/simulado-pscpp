# Checkpoint 582 — Hensen L021/C07 — 2026-11-16

PR: https://github.com/noconvescomdavi/simulado-pscpp/pull/173
Branch: audit/hensen-lote-001-20261029
Fonte primária consultada: https://drive.google.com/file/d/1TzakagjCKQ_p7kaMbWPV-MHShIZ6AXG9/view (Henk Hensen, *Tug Use in Port*, 4ª ed., 2021).
Banco: data/question-extensions/hensen-lote-021.json.

## Cotejo individual textual (5 questões, 25 alternativas)
| ID | Antes → depois | Evidência / avaliação das alternativas |
|---|---|---|
| ANV-HENSEN-C07-L021-01 | B → B; texto inalterado | §7.2.2, p.178: abertura transversal do towing staple permite deslizamento do cabo ao bordo baixo, criando momento adicional de endireitamento e provável abrasão adicional. A inverte momento/abrasão; C nega deslizamento; D confunde com carrousel; E presume redução universal da tensão. Localizador coerente. |
| ANV-HENSEN-C07-L021-02 | E → E; texto inalterado | §7.3.3.4, p.186: tambor com diâmetro pelo menos 14 vezes o diâmetro do cabo, respeitando raio de curvatura do fabricante. 14 × 40 mm = 560 mm. A/B/C inferiores ao mínimo; D impõe diâmetro fixo sem base. Atenção: regra reproduzida de DNVGL, não universal para todos os cabos. |
| ANV-HENSEN-C07-L021-03 | C → C; texto inalterado | §7.3.3.4, p.186: fonte de energia adicional para blackout suficiente para três ativações do sistema de liberação; quando mecanismo exige alimentação contínua, mínimo de cinco minutos. A insuficiente; B recolhimento não é liberação; D infinito; E iluminação irrelevante. **Ressalva:** explicação deve futuramente mencionar alternativa de cinco minutos, conforme aplicabilidade. |
| ANV-HENSEN-C07-L021-04 | A → A; texto inalterado | Fator de segurança 3,0 × resistência residual 0,5 = 1,5, com carga constante; B/C/D/E aritmeticamente incorretas. **Ressalva:** conta correta como aplicação mecânica, mas não foi isolado trecho específico de §7.5.4, p.198, que formule esse exemplo; não certificar a atribuição bibliográfica até inspeção da página. |
| ANV-HENSEN-C07-L021-05 | D → D; texto inalterado | §7.8, p.210: componentes de reboque de emergência para petroleiros >=50.000 dwt com resistência de trabalho >=2.000 kN; 55.000 dwt pertence à faixa. A/B/C abaixo; E acima mas não mínimo exigido. Trata-se de equipamento de reboque de emergência, não de toda operação portuária. |

## Decisão e pendências
Nenhuma correção segura no JSON nesta rodada; não alterar validação nem declarar homologação definitiva. Fonte textual consultada efetivamente, mas inspeção visual das páginas/figuras e conferência de paginação PDF não concluídas. Deduplicação semântica cruzada dos lotes 001–022 e históricos não concluída; candidatos: C07-L021-03 versus C07-L020-03 (três liberações) e C07-L021-01 versus outras questões de towing point. Não classificar automaticamente duplicatas. 119 históricos preservados em quarentena, sem revisão individual nesta rodada.

PR aberto e mergeable=false na consulta; checks e testes do SHA final não executados nesta rodada. Vercel Production READY não certificado. Sem merge nem deploy. Próximo: L021/C09, ressalvas C07-L021-03/04 e deduplicação.
