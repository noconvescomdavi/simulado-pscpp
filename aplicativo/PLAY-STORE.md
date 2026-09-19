# Publicação da ESTIBORDO na Google Play

## Identidade do aplicativo

- Nome: ESTIBORDO
- Application ID: `br.com.estibordo.pscpp`
- Plataforma: Android
- Formato de publicação: Android App Bundle (AAB)
- Target SDK: 36
- Site carregado pelo app: `https://simulado-pscpp.vercel.app`

## Estratégia de atualização

A plataforma web continua sendo publicada pela Vercel. Alterações web chegam ao app sem exigir novo AAB.

Uma nova versão na Google Play é necessária quando houver mudanças nativas: plugins Capacitor, permissões, push, biometria, deep links, integração com Android ou alterações no shell do aplicativo.

## Assinatura

Use Google Play App Signing.

A chave de upload deve permanecer fora do repositório.

Segredos esperados no GitHub Actions:

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

O workflow decodifica temporariamente o keystore no runner e o remove quando o job termina.

## Criar chave de upload

Exemplo com keytool:

```bash
keytool -genkeypair -v \
  -keystore estibordo-upload.jks \
  -alias estibordo-upload \
  -keyalg RSA \
  -keysize 4096 \
  -validity 10000
```

Depois, salve o arquivo em local seguro e configure os segredos no repositório.

## Primeira publicação

1. Criar a conta Play Console.
2. Criar o app ESTIBORDO.
3. Usar `br.com.estibordo.pscpp` como package name.
4. Ativar Play App Signing.
5. Enviar o primeiro AAB assinado para teste interno.
6. Preencher ficha da loja, política de privacidade, segurança de dados, classificação indicativa e acesso ao app.
7. Se a conta pessoal estiver sujeita ao requisito de teste fechado, cumprir o período e quantidade de testadores exigidos antes da produção.
8. Solicitar produção.

## Dados e privacidade

A ficha de Segurança de dados deve refletir exatamente o comportamento real da plataforma e dos SDKs usados. Não marque categorias de dados sem confirmar o que o backend coleta, compartilha ou retém.
