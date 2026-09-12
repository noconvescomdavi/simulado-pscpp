# Biblioteca do aluno — Google Drive + Adobe PDF Embed

Os PDFs dos alunos permanecem no Google Drive de cada aluno. A ESTIBORDO armazena apenas metadados, referência do arquivo e progresso de leitura no PostgreSQL.

## Credenciais necessárias na Vercel

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY`
- `NEXT_PUBLIC_GOOGLE_DRIVE_APP_ID` (Project Number do Google Cloud)
- `NEXT_PUBLIC_ADOBE_PDF_CLIENT_ID`
- `GOOGLE_TOKEN_ENCRYPTION_SECRET` (recomendado; mínimo 32 caracteres)
- `NEXT_PUBLIC_APP_URL=https://simulado-pscpp.vercel.app`

## Google Cloud

Ative Google Drive API e Google Picker API. Crie um OAuth 2.0 Client ID do tipo Web application.
Authorized JavaScript origin: `https://simulado-pscpp.vercel.app`.
Authorized redirect URI: `https://simulado-pscpp.vercel.app/api/library/google/callback`.
O sistema solicita somente `https://www.googleapis.com/auth/drive.file`.

## Adobe

Crie uma credencial PDF Embed API para o domínio `simulado-pscpp.vercel.app` e salve o Client ID em `NEXT_PUBLIC_ADOBE_PDF_CLIENT_ID`.

## Banco

Aplicar `db/migrations/024_google_drive_student_library.sql`.

## Segurança

Tokens OAuth são criptografados com AES-256-GCM. O endpoint de conteúdo exige sessão e valida o proprietário do documento. PDFs são transmitidos sob demanda do Drive com cache privado desabilitado. Nenhum PDF é versionado no GitHub nem persistido no PostgreSQL.
