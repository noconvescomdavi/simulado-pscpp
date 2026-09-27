# Contrato de sincronização standalone → Neon

O APK registra alterações locais em um journal append-only. O arquivo exportado usa `format=estibordo-standalone-progress`, `export_version=1` e `schema_version=1`.

## Eventos
Os eventos reutilizam os tipos já empregados pelo offline web sempre que possível: `notebook.create`, `notebook.answer`, `exam.snapshot`, `study.task`, `reading.progress` e `library.progress`. Novos domínios devem manter IDs estáveis e timestamps ISO.

## Merge futuro no Neon
O importador web deve ser idempotente por `event.id`. Nunca deve truncar tabelas nem substituir o usuário inteiro. Para registros mutáveis, comparar timestamps/versionamento; para respostas/tentativas históricas, inserir somente quando a identidade lógica ainda não existir. Conflitos devem ser reportados, não silenciosamente descartados.

## Segurança
O export não contém senha, hash, token, segredo MFA/OAuth, DATABASE_URL ou cookie de sessão. A associação ao usuário será feita pelo importador autenticado da plataforma online, não por credenciais armazenadas no APK.
