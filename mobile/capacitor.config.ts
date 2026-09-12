import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.estibordo.pscpp',
  appName: 'ESTIBORDO',
  webDir: 'www',
  appendUserAgent: ' ESTIBORDO-ANDROID',
  server: {
    url: 'https://simulado-pscpp.vercel.app',
    cleartext: false,
    androidScheme: 'https',
    allowNavigation: ['simulado-pscpp.vercel.app'],
    errorPath: 'offline.html'
  },
  android: {
    allowMixedContent: false
  }
};

export default config;
