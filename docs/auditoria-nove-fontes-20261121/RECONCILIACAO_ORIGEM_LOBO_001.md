# Reconciliação de origem — Lobo e Soares, capítulo IX

Base main observada: `07abec6f74411a1a49fe55dab920bdcf5b96d090`.

Os 12 IDs MEO-0007 a MEO-0018 constam em `data/question-restorations/meteorologia-oceanografia-01.json` (blob `8cfeaba355d7a8ef85b22a37c5ebd0b823094678`). Foi confirmado que `applyQuestionRestorations` substitui por ID apenas registros já presentes na base canônica. A leitura completa do arquivo canônico por este conector retornou conteúdo vazio, logo não foi possível provar a origem efetiva de nenhum dos 12 IDs.

Os seis pares de duplicidade semântica continuam documentados. Foi adicionado `scripts/audit-pscpp-lobo-mares-origin.mjs`, uma verificação local não destrutiva de hashes e da saída de `collectActiveQuestionBanks()`. **Não foi executada** porque o checkout completo não estava disponível neste ambiente. Nenhum item homologado, nenhuma correção aplicada, nenhum merge. Próximo: executar o diagnóstico no checkout completo, verificar páginas do PDF visualmente, depois aplicar alterações apenas ao arquivo efetivo e executar CI.
