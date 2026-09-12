# ESTIBORDO Android

Camada Android isolada da aplicação web principal.

## Objetivo

O aplicativo usa Capacitor como runtime Android e carrega a plataforma publicada em:

https://simulado-pscpp.vercel.app

Assim, conteúdo e funcionalidades web publicados na Vercel podem chegar ao aplicativo sem exigir uma nova versão do APK/AAB. Alterações nativas continuam exigindo uma nova versão na Google Play.

## Requisitos locais

- Node.js 22+
- Android Studio 2025.2.1+
- Android SDK 36

## Primeira geração local

```bash
cd mobile
npm install
npm run android:add
npm run android:open
```

O diretório `android/` é gerado pelo Capacitor.

## Identidade

- App name: ESTIBORDO
- Application ID: `br.com.estibordo.pscpp`
- Target SDK: 36 via Capacitor 8

> O Application ID deve ser tratado como permanente antes da primeira publicação na Google Play.

## Builds

Debug APK:

```bash
cd mobile
npm install
npx cap add android
cd android
./gradlew assembleDebug
```

Release AAB:

```bash
cd mobile
npm install
npx cap add android
cd android
./gradlew bundleRelease
```

Para publicação real, o AAB de release deve ser assinado com uma chave de upload protegida. Nunca comite o keystore ou senhas no repositório.

## Atualizações

### Não exigem nova versão da Play Store

Mudanças servidas pela aplicação web, como páginas, componentes, banco de questões, simulados, plano de estudos, conteúdo e correções web.

### Exigem nova versão

Mudanças nativas, como permissões Android, plugins Capacitor, notificações push, biometria, recursos de armazenamento nativo ou alterações no package/application ID.
