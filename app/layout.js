import "./globals.css";
import "./estibordo-polish.css";
import SiteDesignRuntime from "./site-editor/SiteDesignRuntime";

export const metadata={
  title:{
    default:"ESTIBORDO | Plataforma de estudos PSCPP",
    template:"%s | ESTIBORDO"
  },
  description:"Plataforma de preparação para o PSCPP com questões, simulados, RIPEAM, Código Internacional de Sinais e análise de desempenho.",
  icons:{icon:"/estibordo/icones/bandeira-hotel.svg"}
};

export default function RootLayout({children}){
  return (
    <html lang="pt-BR">
      <head>
        <link rel="apple-touch-icon" href="/estibordo/logos/estibordo-logo-header.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="ESTIBORDO" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#07141f" />
      </head>
      <body>{children}<SiteDesignRuntime /></body>
    </html>
  );
}
