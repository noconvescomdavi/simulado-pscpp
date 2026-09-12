import "./globals.css";
import "./estibordo-polish.css";
import SiteDesignRuntime from "./site-editor/SiteDesignRuntime";
import SiteDesignProRuntime from "./site-editor/SiteDesignProRuntime";
import PwaRuntime from "./components/PwaRuntime";
import WebVitalsReporter from "./components/WebVitalsReporter";
import MobileAppRuntime from "./components/MobileAppRuntime";
import OfflineSyncRuntime from "./components/OfflineSyncRuntime";

export const metadata = {
  metadataBase: new URL("https://simulado-pscpp.vercel.app"),
  title: {
    default: "ESTIBORDO | Plataforma de estudos PSCPP",
    template: "%s | ESTIBORDO"
  },
  description: "Plataforma de preparação para o PSCPP com questões, simulados, RIPEAM, Código Internacional de Sinais e análise de desempenho.",
  applicationName: "ESTIBORDO",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "ESTIBORDO",
    statusBarStyle: "black-translucent"
  },
  formatDetection: { telephone: false },
  icons: {
    icon: "/estibordo/icones/bandeira-hotel.svg",
    apple: [{ url: "/pwa-icon", sizes: "180x180", type: "image/png" }]
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#07141f"
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/pwa-icon" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="ESTIBORDO" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="theme-color" content="#07141f" />
        <link rel="apple-touch-startup-image" href="/pwa-splash" />
      </head>
      <body>
        {children}
        <SiteDesignRuntime />
        <SiteDesignProRuntime />
        <PwaRuntime />
        <WebVitalsReporter />
        <MobileAppRuntime />
        <OfflineSyncRuntime />
      </body>
    </html>
  );
}
