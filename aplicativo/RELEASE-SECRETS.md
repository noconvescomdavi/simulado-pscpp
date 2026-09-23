# Segredos necessários para publicação Android

Configure em GitHub > Settings > Secrets and variables > Actions.

## Obrigatórios para AAB assinado

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

## Obrigatório para envio automático à Play

- `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`

A conta de serviço deve ter acesso ao app `br.com.estibordo.pscpp` na Play Console.

## Opcional para push

- `FIREBASE_GOOGLE_SERVICES_JSON_BASE64`

Este valor é o conteúdo de `google-services.json` convertido para base64.

## Vercel

Configure:

- `ANDROID_APP_SHA256_CERT_FINGERPRINT`

Use o SHA-256 do certificado de **App Signing** exibido pela Play Console, não o fingerprint da chave de upload. Essa variável alimenta `/.well-known/assetlinks.json` e permite a verificação oficial dos App Links.

## Observação

Nunca comite keystore, senhas, JSON de conta de serviço ou `google-services.json` no repositório.
