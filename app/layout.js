import "./globals.css";
import "./estibordo-polish.css";
import SiteDesignRuntime from "./site-editor/SiteDesignRuntime";

const ESTIBORDO_APP_ICON = "/estibordo/logos/estibordo-logo-header.png";

export const metadata = {
  metadataBase: new URL("https://simulado-pscpp.vercel.app"),
  title: {
    default: "ESTIBORDO | Plataforma de estudos PSCPP",
    template: "%s | ESTIBORDO",
  },
  description:
    "Plataforma de preparação para o PSCPP com questões, simulados, RIPEAM, Código Internacional de Sinais e análise de desempenho.",
  applicationName: "ESTIBORDO",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: ESTIBORDO_APP_ICON, type: "image/png" }],
    shortcut: [{ url: ESTIBORDO_APP_ICON, type: "image/png" }],
    apple: [{ url: ESTIBORDO_APP_ICON, type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "ESTIBORDO",
    statusBarStyle: "black-translucent",
  },
};

export const viewport = {
  themeColor: "#07141f",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <SiteDesignRuntime />
      </body>
    </html>
  );
}
