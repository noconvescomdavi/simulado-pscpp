/// <reference types="@capacitor/cli" />
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "br.com.estibordo.pscpp",
  appName: "ESTIBORDO",
  webDir: "public",
  server: {
    url: "https://simulado-pscpp.vercel.app",
    cleartext: false,
    androidScheme: "https"
  },
  android: {
    allowMixedContent: false,
    backgroundColor: "#070b10"
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1800,
      launchAutoHide: true,
      backgroundColor: "#070b10",
      showSpinner: false
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#070b10"
    }
  }
};
export default config;
