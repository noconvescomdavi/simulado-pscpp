import "./globals.css";
import { Poppins, Montserrat } from "next/font/google";

const poppins = Poppins({
  subsets:["latin"],
  weight:["500","600","700","800"],
  variable:"--font-poppins",
  display:"swap"
});

const montserrat = Montserrat({
  subsets:["latin"],
  weight:["400","500","600","700"],
  variable:"--font-montserrat",
  display:"swap"
});

export const metadata={
  title:{
    default:"ESTIBORDO | Preparação para a Praticagem",
    template:"%s | ESTIBORDO"
  },
  description:"Plataforma de estudos e preparação para o PSCPP. Questões, simulados, RIPEAM, Código Internacional de Sinais e acompanhamento de desempenho.",
  icons:{icon:"/estibordo/icons/bandeira-hotel.svg"}
};

export default function RootLayout({children}){
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  )
}