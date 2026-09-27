# Android standalone — camada de dados

A versão standalone não usa PostgreSQL em runtime. Dados acadêmicos estáticos permanecem no bundle do aplicativo; estado mutável é persistido em IndexedDB pelo WebView Android.

## Snapshot privado
O snapshot pessoal nunca deve ser commitado. O arquivo de entrada local é `.standalone-private/seed.json`; o script `prepare-standalone-seed.mjs` valida a conta autorizada, remove campos sensíveis e produz temporariamente `public/standalone-private/seed.json` para o build Android.

Conta-alvo do build privado: definida apenas no script de preparação. Não adicionar senha, hash, token, segredo MFA/OAuth, DATABASE_URL ou cookie de sessão ao snapshot.

## Stores
profile, preferences, answers, notebooks, exams, mastery, review_queue, study_sessions, study_plan e bibliography. O store meta controla versão e impede reinstalação destrutiva do seed após o primeiro uso.

## Regra de atualização
O seed é instalado apenas quando não existe estado inicial. Atualizações futuras do APK não sobrescrevem automaticamente o progresso local do aluno.
