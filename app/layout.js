
import "./globals.css";
import SiteDesignRuntime from "./site-editor/SiteDesignRuntime";

export const metadata={
  title:{
    default:"ESTIBORDO | PreparaÃ§Ã£o para a Praticagem",
    template:"%s | ESTIBORDO"
  },
  description:"Plataforma de preparaÃ§Ã£o para o PSCPP com questÃµes, simulados, RIPEAM, CÃ³digo Internacional de Sinais e anÃ¡lise de desempenho.",
  icons:{icon:"/estibordo/icones/bandeira-hotel.svg"}
};

export default function RootLayout({children}){
  return <html lang="pt-BR"><body>{children}<SiteDesignRuntime /></body></html>
}

