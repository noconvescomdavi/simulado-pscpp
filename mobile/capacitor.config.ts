import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.estibordo.pscpp',
  appName: 'ESTIBORDO',
  webDir: 'www',
  server: {
    url: 'https://simulado-pscpp.vercel.app',
    cleartext: false,
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: false
  }
};

export default config;
