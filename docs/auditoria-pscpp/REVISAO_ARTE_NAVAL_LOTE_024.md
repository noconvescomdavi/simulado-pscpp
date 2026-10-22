# Lote 024 — catenária do reboque

Base remota a68cfb9a51e4b41e37007c8f76f03e01da228b38; PR #172 aberto/draft.
HEAD remoto, CHECKPOINT.json e relatório 023 consultados antes da edição.
Fast-forward da árvore rastreada limpa, sem descartar temporários. Publicação
com lease; nenhuma concorrência de escrita constatada nas superfícies disponíveis.
Prompt-Mestre e benchmark histórico mantidos; não refeitos lotes concluídos.

## Fonte primária e limites

Fonseca, Arte Naval v.2, 8ª ed., 2019, seção F, art.12.70, pp.907–909,
PDF268–270; contexto art.12.69 pp.906–907/PDF267–268 e contraste com
máquina de reboque, art.12.71 p.909/PDF270. Texto e imagens das quatro páginas
inspecionados; figura12-47 também examinada. Ela compara cabo curto e
comprimento adequado em relação às ondas, sem fornecer escala para calcular
um comprimento nesta questão. Nenhuma questão depende de figura ausente.
SHA256 recalculado do volume:
6afafcbe4ace9b708478a9a1ffb28e4ef666cefabe08b9f38fecc539ef8c8ef1.
Drive 1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec; PDF/imagens privados.

A obra distingue elasticidade própria da fibra e elasticidade adicional pela
curvatura. Explica a contribuição do peso da amarra e o amortecimento de
esticões. Também registra o limite: em reboque comprido inteiramente de amarra,
a curvatura excessiva pode levar o dispositivo ao fundo. Portanto, aumentar
curvatura não é benefício sem restrições. Não se confunde catenária com
resistência à ruptura, máquina de reboque ou disposição a contrabordo.

O art.12.69 delimita o escopo da seção, particularmente fainas em determinados
navios da MB, e remete reboques planejados de alto-mar a outras publicações.
A seção não esgota o assunto nem cobre manobras portuárias de curta duração.
As questões conferem conceitos da edição consultada, sem alegar procedimento
universal atual, velocidade segura, comprimento obrigatório ou substituição
do planejamento de uma faina. Sem cálculo ou parâmetros operacionais inventados.
A antiga referência genérica a 12.76 não foi usada como suporte da definição:
o localizador agora individualiza 12.70 e os contrastes efetivamente lidos.

## Precedência e identidade

ANV-0111 é a restauração old-145 sobre catenária já consumida antes do lote.
A versão principal trata de efeito do leme e tem provenance.method
pscpp-style-upgrade-v3, método barrado pela política quando avaliado isoladamente.
Ela não é rotulada aqui como active=false/status=quarantined: esses campos
não constam daquela versão. Todos os campos originais do principal 0111
permanecem intactos; a restauração prevalente foi corrigida no lugar.
Divergência global de identidades/estados entre principal e restauração pendente.

ANV-0809 prevalece no principal. Nenhum dos dois IDs consta de
notebook-complete-stems. O normalizador answer-leak-v1 retirava as proposições
de 0111 e convertia ambos em comandos genéricos. Novos comandos sem aspas
longas, com objeto técnico explícito; nenhuma política/normalizador alterado.
Runtime regenerado, igualdade fonte/runtime e ausência de reformulação posterior
verificadas. IDs, tópicos, formatos principais B/A e keys A/D preservados.
Rótulo legado Associação conceitual mantido em 0809 por compatibilidade;
formato principal efetivo direto/contextual. Locator/tracking.section detalhados.

## ANV-0111 — julgamento individual

I falsa: elasticidade própria da fibra não dispensa curvatura adicional em mar
grosso; a p.907 distingue os efeitos e ressalva a insuficiência de curvatura
pela flutuabilidade. II falsa: a p.908 aponta precisamente risco de arrastar
no fundo com reboque comprido inteiramente de amarra. III verdadeira: a
curvatura contribui com elasticidade adicional/amortecimento. IV verdadeira:
peso excessivo pode produzir catenária demasiadamente grande e contato com o
fundo na condição expressa. Vetor F/F/V/V; único conjunto completo III/IV.

| Opção | Conjunto | Julgamento |
|---|---|---|
| A | III/IV | Único conjunto completo das verdadeiras |
| B | II/IV | II falsa; falta III |
| C | II/III | II falsa; falta IV |
| D | I/II | Ambas falsas; faltam III/IV |
| E | I/IV | I falsa; falta III |

## ANV-0809 — julgamento individual

| Opção | Julgamento |
|---|---|
| A | Falsa: disposição a contrabordo, art.12.69 p.906 |
| B | Falsa: resistência relativa ao diâmetro, não geometria, art.12.70 p.908 |
| C | Falsa: atuação da máquina de reboque, art.12.71 p.909 |
| D | Única correta: curvatura com elasticidade adicional favorecida pelo peso |
| E | Falsa: elasticidade própria da fibra, distinguida do efeito da curvatura |

Distratores testam confusão entre propriedade do material, geometria,
resistência e equipamento, além da generalização indevida do benefício da
curvatura. Dez justificativas específicas. L2/Médio proposto para distinção
causal, sem calibração psicométrica medida ou equivalência histórica aprovada.

## Sobreposição, grupo de três e pendências

Par old-145 lido individualmente; compartilha competência e não deve coexistir
na mesma prova. Busca textual no inventário também localizou referências à
catenária em questões de fundeio e no grupo AN-C12-I12-70-M1/M2/M3. A busca
não comprova deduplicação semântica global. Os três modelos do item12.70 foram
lidos para registrar os defeitos e preservados, sem suprimir o regime de três:
M1 perde proposições no runtime e apresenta enunciado/explicação contraditórios;
M2 contém distratores genéricos e opostos denunciadores; M3 requer rechecagem
individual das proposições, justificativas e transformação. Nenhum recebeu
aprovação nem foi contado como conferência bibliográfica individual concluída
neste lote. A revisão desse grupo e das sobreposições com old-145 permanece
explicitamente pendente; nenhum modelo foi acrescentado/removido.

Acumulado: 41 correções primárias/44 conferências parciais, ZERO aprovações
editoriais finais. Hashes antes/depois em CORRECOES_RUNTIME.json;
CONFERENCIAS_BIBLIOGRAFICAS.jsonl registra o limite parcial das duas conferências.
REVISOES_EDITORIAIS.jsonl não recebeu aprovação sem rechecagem independente,
alinhamento oficial ao programa/edital e revisão semântica global.
Resultados reais em TESTES_E_EVIDENCIAS.md. Sem merge/deploy/dados de usuários.
