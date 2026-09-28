# Fase 1 — Auditoria e baseline do ESTIBORDO Windows

Data da auditoria: 2026-09-26
Baseline imutável: `08ce4e96ae8d408dbb12850a3d0e147b127f4035`
Branch de trabalho: `feature/estibordo-windows`

## Gate da Fase 1

A Fase 1 pode ser considerada aprovada quando:
- o baseline web estiver identificado e com CI verde;
- o trabalho desktop estiver isolado do `main`;
- a arquitetura e as dependências online/offline estiverem mapeadas;
- os bloqueadores conhecidos para execução sem internet estiverem identificados;
- houver critérios objetivos de entrada para a Fase 2.

## Baseline verificado

- Next.js 15.5.2 / React 19.1.1 / Node >=20.
- 1.185 arquivos versionados; aproximadamente 162,5 MB.
- 82 páginas App Router e 97 rotas API.
- CI do baseline: build, validações de questões, auditoria semântica e smoke HTTP/Chrome concluídos com sucesso.
- Bancos principais são JSON locais importados por `lib/question-banks.js`.
- PostgreSQL/Neon é usado para identidade, entitlement, histórico, progresso e demais dados transacionais.

## Inventário de peso

Os dois maiores grupos são:
- `public/`: ~79,2 MB;
- `data/`: ~76,3 MB.

Os modelos GLB somam ~71,5 MB. Os JSON somam ~79,7 MB. Para a primeira versão desktop, os bancos JSON são conteúdo essencial; os modelos 3D podem ser empacotados separadamente/como conteúdo opcional se o tamanho do instalador exigir.

## Offline existente

`lib/offline-store.js` já implementa IndexedDB (`estibordo-offline`, versão 2) para:
- questões;
- cadernos;
- simulados;
- fila de sincronização;
- metadados/device id;
- resposta, finalização e pausa/retomada local.

O cliente de simulado já tenta usar esse armazenamento quando `navigator.onLine` é falso ou quando a chamada de rede falha.

### Lacunas confirmadas

No baseline não existem:
- `app/api/offline/manifest`;
- `app/api/offline/bootstrap`;
- service worker registrado/implementado para `CACHE_OFFLINE_ROUTES`.

Apesar disso, `lib/offline-store.js` referencia esses endpoints e mensagens. O fluxo de preparação offline está, portanto, incompleto.

## Bloqueador principal para desktop offline

`getSession()` valida o JWT e em seguida consulta `users` no PostgreSQL. `getEntitlement()` também consulta `user_access`.

Páginas essenciais, incluindo Área do Aluno, Simulados e Banco de Questões, executam autenticação/entitlement no servidor antes de o cliente poder usar o fallback IndexedDB. Sem Neon, o usuário pode ser redirecionado ao login antes de alcançar o motor offline.

A solução desktop deverá preservar a revogação/entitlement online sem criar bypass de produção. A direção aprovada é um contexto desktop explícito e isolado, com credencial/entitlement offline verificável e com validade controlada, nunca um bypass global de autenticação.

## Classificação funcional

### Local/offline por projeto
- shell da aplicação e assets empacotados;
- bancos de questões;
- emissão e execução de simulados;
- cadernos de questões;
- respostas, gabaritos e explicações;
- pausa/retomada;
- histórico local necessário para continuidade;
- fila de eventos para posterior sincronização.

### Híbrido: local + sincronização
- histórico consolidado;
- progresso;
- métricas e insights;
- plano de estudos;
- preferências;
- review queue;
- achievements;
- flashcards com progresso;
- mapas mentais, quando aplicável.

Essas áreas podem manter cópia local e reconciliar com o servidor quando houver conexão. A Fase 4 definirá conflitos e idempotência.

### Obrigatoriamente online
- login/registro e verificação inicial de identidade;
- Mercado Pago e webhooks;
- recuperação de senha/Gmail;
- Google OAuth e Google Drive;
- CONTRAMESTRE/OpenAI;
- administração central;
- suporte central;
- revogação/renovação de entitlement e sincronização remota.

## Estratégia de runtime aprovada para a Fase 2

- Electron como shell Windows.
- Next.js executado localmente em loopback (`127.0.0.1`), usando build standalone específico para desktop.
- BrowserWindow carrega somente o servidor local da aplicação.
- `contextIsolation: true`.
- `nodeIntegration: false`.
- preload mínimo e sem exposição arbitrária de Node.
- IndexedDB mantido como armazenamento offline inicial; SQLite não é pré-requisito.
- build web atual permanece independente; desktop será ativado apenas por script/configuração próprios.
- segredos de Mercado Pago, Google, Gmail, OpenAI e banco não serão embutidos no executável.

## Requisitos de entrada da Fase 2

A Fase 2 deve:
1. adicionar a infraestrutura Electron apenas nesta branch;
2. adicionar build Next standalone condicionado ao desktop;
3. copiar `.next/static` e `public` para o pacote;
4. iniciar o servidor Next em `127.0.0.1` e porta controlada;
5. aguardar health local antes de abrir a janela;
6. encerrar o processo filho ao fechar o app;
7. impedir navegação arbitrária e abertura insegura de URLs;
8. não modificar o comportamento do build/deploy web;
9. criar CI Windows capaz de produzir o primeiro artefato;
10. provar que o shell inicia sem Vercel.

A autenticação offline completa e a sincronização não serão improvisadas na Fase 2: serão introduzidas nas fases próprias, preservando o isolamento de segurança.

## Decisão do gate

APROVADO.

O baseline está reproduzível pelo CI, a branch está isolada, os bloqueadores são conhecidos e existe uma arquitetura de entrada objetiva para a Fase 2.
