# ESTIBORDO Windows — arquitetura local-first

## Regra de fronteira

O executável Windows não acessa PostgreSQL/Neon. O runtime desktop usa SQLite para dados mutáveis do aluno e snapshots JSON para conteúdo acadêmico estático. A sincronização remota usa somente HTTPS contra a API PSCPP.

```
ESTIBORDO.exe
  -> Electron
  -> Next.js standalone local
  -> SQLite local
  -> Sync Engine
  -> HTTPS API PSCPP
  -> PostgreSQL/Neon
```

## Fontes de verdade

- SQLite: perfil local mínimo, progresso, sessões/simulados, respostas, plano, preferências, outbox, cursor e conflitos.
- JSON versionado: bancos de questões e conteúdo acadêmico essencialmente estático.
- IndexedDB/Cache API: camada de compatibilidade e cache durante a migração; não será a única fonte de verdade de atividade do aluno.
- PostgreSQL: estado remoto canônico, acessível ao cliente apenas via API.

## Contrato de sincronização v1

`POST /api/sync/v1` recebe `protocol_version`, `device_id`, `cursor` e até 200 eventos. Cada evento tem UUID/id idempotente, tipo de entidade, ID global, operação, `base_version`, timestamp e payload. A resposta retorna resultado individual (`applied`, `duplicate`, `conflict`), novo cursor e alterações incrementais do servidor.

O servidor registra IDs de eventos já processados. Reenvio do mesmo evento não repete efeitos. Conflitos não são resolvidos apagando silenciosamente o lado local: são persistidos e tratados por política de entidade.

## Política inicial de conflitos

- respostas já registradas: append-only/idempotentes;
- sessão de simulado: maior versão válida, preservando respostas por ID;
- progresso/estatísticas derivadas: recalcular a partir de eventos/respostas quando possível;
- preferências: last-write-wins por `updated_at`, com versão;
- plano de estudos: merge por `plan_date + task_key`;
- conteúdo estático: versão do snapshot, nunca merge de atividade do aluno.

## Autenticação

Primeiro login é online. O desktop recebe credencial própria de sessão/sincronização da API e a armazena no cofre do sistema operacional via keytar/Windows Credential Manager. Senha não é persistida. O SQLite guarda apenas perfil/entitlement mínimo e timestamps, não segredos reutilizáveis.

A validação offline será vinculada ao dispositivo e terá política de expiração/revalidação definida na fase de autenticação. Administração continua online-only.

## Migração progressiva

1. manter IndexedDB funcionando;
2. espelhar gravações críticas no SQLite;
3. trocar leituras desktop para SQLite por domínio;
4. validar equivalência;
5. retirar IndexedDB como fonte de verdade apenas após cada domínio passar seu gate.

## Gate de segurança

Nenhum `DATABASE_URL`, segredo de autenticação do servidor ou credencial administrativa pode ser empacotado no instalador. O build desktop deve falhar se detectar esses valores ou imports proibidos no runtime distribuído.
