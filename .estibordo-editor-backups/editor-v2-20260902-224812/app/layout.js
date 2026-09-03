
import "./globals.css";

export const metadata={
  title:{
    default:"ESTIBORDO | Preparação para a Praticagem",
    template:"%s | ESTIBORDO"
  },
  description:"Plataforma de preparação para o PSCPP com questões, simulados, RIPEAM, Código Internacional de Sinais e análise de desempenho.",
  icons:{icon:"/estibordo/icones/bandeira-hotel.svg"}
};

export default function RootLayout({children}){
  return <html lang="pt-BR"><body>{children}</body></html>
}
