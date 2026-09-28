import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.estibordo.pscpp',
  appName: 'ESTIBORDO',
  webDir: 'www',
  appendUserAgent: ' ESTIBORDO-ANDROID',
  server: {
    url: 'https://estibordo-pscpp.vercel.app',
    cleartext: false,
    androidScheme: 'https',
    allowNavigation: ['estibordo-pscpp.vercel.app'],
    errorPath: 'offline.html'
  },
  android: {
    allowMixedContent: false
  }
};

export default config;
