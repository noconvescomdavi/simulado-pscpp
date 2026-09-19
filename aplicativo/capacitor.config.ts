import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.estibordo.pscpp',
  appName: 'ESTIBORDO',
  webDir: 'www',
  appendUserAgent: ' ESTIBORDO-ANDROID',
  android: {
    allowMixedContent: false
  }
};

export default config;
