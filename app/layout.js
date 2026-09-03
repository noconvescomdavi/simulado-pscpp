
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
  return <html lang="pt-BR"><body>{children}<SiteDesignRuntime /></body></html>
}

