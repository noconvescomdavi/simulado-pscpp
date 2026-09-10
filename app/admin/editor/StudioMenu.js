"use client";
import {useEffect,useMemo,useState} from "react";
import BlockTree from "./BlockTree";

const ICONS=[
{c:"Marítimo",name:"Âncora",path:"M12 2v14m-5-4h10M5 10h14M4 15c1.5 4 4.3 6 8 6s6.5-2 8-6l-3-1c-.8 2.3-2.4 3.6-5 3.6S7.8 16.3 7 14l-3 1Z"},
{c:"Marítimo",name:"Navio",path:"M3 18h18l-2.5-6H5.5L3 18Zm4-6V8h4v4m2 0V5h4v7M2 20c2 1 4 1 6 0 2 1 4 1 6 0 2 1 4 1 6 0"},
{c:"Marítimo",name:"Bússola",path:"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm3-13-2 6-6 2 2-6 6-2Z"},
{c:"Marítimo",name:"Ondas",path:"M2 8c2 1.5 4 1.5 6 0 2 1.5 4 1.5 6 0 2 1.5 4 1.5 6 0M2 13c2 1.5 4 1.5 6 0 2 1.5 4 1.5 6 0 2 1.5 4 1.5 6 0M2 18c2 1.5 4 1.5 6 0 2 1.5 4 1.5 6 0 2 1.5 4 1.5 6 0"},
{c:"Marítimo",name:"Farol",path:"M9 22h6l-1-12h-4L9 22Zm1-12 2-5 2 5M7 13l-4 2m14-2 4 2M6 8 2 6m16 2 4-2"},
{c:"Marítimo",name:"Leme",path:"M12 4v4m0 8v4M4 12h4m8 0h4M6.3 6.3l2.8 2.8m5.8 5.8 2.8 2.8m0-11.4-2.8 2.8m-5.8 5.8-2.8 2.8M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"},
{c:"Marítimo",name:"Boia",path:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-6.4-9.4 3 3m6.8 4.8 3 3m0-10.8-3 3m-6.8 4.8-3 3"},
{c:"Marítimo",name:"Porto",path:"M4 20V9m16 11V9M2 20h20M5 9l3-4h8l3 4M8 9v11m8-11v11M10 13h4"},
{c:"Marítimo",name:"Contêiner",path:"M3 7h18v10H3zM7 7v10m5-10v10m5-10v10"},
{c:"Marítimo",name:"Radar",path:"M12 12 7 7m5 5 6-2M4 18a10 10 0 0 1 14-14M7 20a7 7 0 0 1 10-10M10 22a4 4 0 0 1 6-6"},
{c:"Marítimo",name:"Sino",path:"M6 17h12l-2-3V9a4 4 0 0 0-8 0v5l-2 3Zm4 3h4"},
{c:"Marítimo",name:"Rosa dos ventos",path:"M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2L12 2Z"},
{c:"Navegação",name:"Mapa",path:"m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Zm6-3v15m6-12v15"},
{c:"Navegação",name:"Localização",path:"M12 21s6-5.3 6-11a6 6 0 1 0-12 0c0 5.7 6 11 6 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"},
{c:"Navegação",name:"Rota",path:"M4 18c4-8 12-2 16-12M5 18h5m10-12h-5"},
{c:"Navegação",name:"Globo",path:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-18c3 3 3 15 0 18M3 12h18M5 7h14M5 17h14"},
{c:"Interface",name:"Home",path:"M3 11 12 3l9 8v10h-6v-6H9v6H3V11Z"},
{c:"Interface",name:"Busca",path:"M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 5 5"},
{c:"Interface",name:"Menu",path:"M4 6h16M4 12h16M4 18h16"},
{c:"Interface",name:"Configurações",path:"M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0-12v2m0 13v2m8.5-8.5h-2m-13 0h-2m14.5-6-1.5 1.5m-9 9L6 18m12 0-1.5-1.5m-9-9L6 6"},
{c:"Interface",name:"Usuário",path:"M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0"},
{c:"Interface",name:"Cadeado",path:"M6 10h12v10H6V10Zm3 0V7a3 3 0 0 1 6 0v3"},
{c:"Interface",name:"Download",path:"M12 3v12m-4-4 4 4 4-4M4 20h16"},
{c:"Interface",name:"Upload",path:"M12 17V5m-4 4 4-4 4 4M4 20h16"},
{c:"Interface",name:"Editar",path:"m4 16-1 5 5-1L19 9l-4-4L4 16Zm9-9 4 4"},
{c:"Interface",name:"Excluir",path:"M4 7h16M9 7V4h6v3m-9 0 1 14h10l1-14M10 11v6m4-6v6"},
{c:"Interface",name:"Favorito",path:"m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"},
{c:"Interface",name:"Check",path:"m4 12 5 5L20 6"},
{c:"Interface",name:"Alerta",path:"M12 3 2 20h20L12 3Zm0 6v5m0 3h.01"},
{c:"Interface",name:"Info",path:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v6m0-9h.01"},
{c:"Estudo",name:"Livro",path:"M4 5c4-1 6 0 8 2v13c-2-2-4-3-8-2V5Zm16 0c-4-1-6 0-8 2v13c2-2 4-3 8-2V5Z"},
{c:"Estudo",name:"Graduação",path:"m2 9 10-5 10 5-10 5L2 9Zm4 2v5c3 3 9 3 12 0v-5"},
{c:"Estudo",name:"Lâmpada",path:"M9 18h6m-5 3h4m3-10a5 5 0 1 0-10 0c0 2 1 3 2 4l1 2h4l1-2c1-1 2-2 2-4Z"},
{c:"Estudo",name:"Checklist",path:"M8 5h12M8 12h12M8 19h12M3 5l1 1 2-2M3 12l1 1 2-2M3 19l1 1 2-2"},
{c:"Estudo",name:"Troféu",path:"M8 4h8v5a4 4 0 0 1-8 0V4Zm0 2H4c0 4 2 6 5 6m7-6h4c0 4-2 6-5 6m-3 1v5m-4 2h8"},
{c:"Estudo",name:"Relógio",path:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3 2"},
{c:"Comunicação",name:"Email",path:"M3 5h18v14H3V5Zm0 2 9 7 9-7"},
{c:"Comunicação",name:"Chat",path:"M4 5h16v11H9l-5 4V5Z"},
{c:"Comunicação",name:"Telefone",path:"M7 3 4 6c1 7 7 13 14 14l3-3-4-4-3 2c-2-1-4-3-5-5l2-3-4-4Z"},
{c:"Comunicação",name:"Link",path:"M9 15 7 17a4 4 0 0 1-6-6l3-3a4 4 0 0 1 6 0M15 9l2-2a4 4 0 0 1 6 6l-3 3a4 4 0 0 1-6 0M8 16l8-8"},
{c:"Mídia",name:"Play",path:"M8 5v14l11-7L8 5Z"},
{c:"Mídia",name:"Câmera",path:"M3 7h5l2-3h4l2 3h5v13H3V7Zm9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"},
{c:"Mídia",name:"Imagem",path:"M3 4h18v16H3V4Zm4 11 4-4 3 3 2-2 5 5M8 9h.01"},
{c:"Mídia",name:"Som",path:"M4 10h4l5-4v12l-5-4H4v-4Zm12-1c2 2 2 4 0 6m3-9c4 4 4 8 0 12"},
{c:"Comércio",name:"Carrinho",path:"M3 4h2l2 11h10l3-8H6M9 20h.01M17 20h.01"},
{c:"Comércio",name:"Cartão",path:"M3 6h18v12H3V6Zm0 4h18M7 15h4"},
{c:"Comércio",name:"Etiqueta",path:"m4 4 7 1 9 9-6 6-9-9-1-7Zm5 5h.01"},
{c:"Comércio",name:"Gráfico",path:"M4 20V10h4v10M10 20V4h4v16m2 0v-7h4v7"}
];


const CIS=[
["A","Tenho um mergulhador na água; mantenha-se bem afastado e a baixa velocidade.","splitV","#ffffff","#0057a6"],
["B","Estou carregando, descarregando ou transportando mercadorias perigosas.","solid","#d71920",""],
["C","Sim (afirmativo).","h3","#0057a6,#ffffff,#d71920",""],
["D","Mantenha-se afastado de mim; estou manobrando com dificuldade.","h3","#f4c300,#0057a6,#f4c300",""],
["E","Estou guinando para boreste.","splitH","#0057a6","#d71920"],
["F","Estou à matroca; comunique-se comigo.","whiteDiamond","#ffffff","#d71920"],
["G","Necessito de um prático.","v6","#f4c300,#0057a6,#f4c300,#0057a6,#f4c300,#0057a6",""],
["H","Tenho um prático a bordo.","splitV","#ffffff","#d71920"],
["I","Estou guinando para bombordo.","circle","#f4c300","#000000"],
["J","Mantenha-se bem afastado de mim. Tenho incêndio a bordo e carga perigosa.","h3","#0057a6,#ffffff,#0057a6",""],
["K","Desejo comunicar-me com você.","splitV","#f4c300","#0057a6"],
["L","Pare imediatamente o seu navio.","quarters","#f4c300","#000000"],
["M","Meu navio está parado e sem seguimento.","x","#0057a6","#ffffff"],
["N","Não (negativo).","checker","#0057a6","#ffffff"],
["O","Homem ao mar.","diag","#f4c300","#d71920"],
["P","Todos devem regressar a bordo; o navio vai sair.","center","#0057a6","#ffffff"],
["Q","Meu navio está sem contaminação e peço livre prática.","solid","#f4c300",""],
["R","Sinal R do CIS.","cross","#d71920","#f4c300"],
["S","Minhas máquinas estão dando atrás.","center","#ffffff","#0057a6"],
["T","Mantenha-se afastado; estou fazendo arrasto em paralelo.","v3","#d71920,#ffffff,#0057a6",""],
["U","Você se dirige para um perigo.","quarters","#d71920","#ffffff"],
["V","Necessito de auxílio.","x","#ffffff","#d71920"],
["W","Necessito de assistência médica.","center","#0057a6","#d71920"],
["X","Suspenda o que está fazendo e observe meus sinais.","cross","#ffffff","#0057a6"],
["Y","Minha âncora está garrando.","diag","#f4c300","#d71920"],
["Z","Necessito de rebocador.","quarters","#f4c300","#0057a6"],
["0","Galhardete numeral zero.","h5","#f4c300,#d71920,#f4c300,#d71920,#f4c300",""],
["1","Galhardete numeral um.","center","#ffffff","#d71920"],
["2","Galhardete numeral dois.","splitV","#0057a6","#ffffff"],
["3","Galhardete numeral três.","v3","#d71920,#ffffff,#0057a6",""],
["4","Galhardete numeral quatro.","cross","#d71920","#ffffff"],
["5","Galhardete numeral cinco.","splitV","#f4c300","#0057a6"],
["6","Galhardete numeral seis.","h2","#000000,#ffffff",""],
["7","Galhardete numeral sete.","h2","#f4c300,#d71920",""],
["8","Galhardete numeral oito.","cross","#ffffff","#d71920"],
["9","Galhardete numeral nove.","quarters","#ffffff","#0057a6"]
].map(([code,meaning,pattern,a,b])=>({code,meaning,pattern,a,b}));
const MARINE_ASSETS=[
{c:"Navios",name:"Navio mercante",path:"M2 16h20l-3 4H6l-4-4Zm4 0V9h5v7m2 0V6h5v10M7 9h10M9 6h4M4 21c2 1 4 1 6 0 2 1 4 1 6 0 2 1 4 1 6 0"},
{c:"Navios",name:"Petroleiro",path:"M2 15h20l-3 5H6l-4-5Zm4 0v-4h12v4M8 11V8h8v3M5 18h14"},
{c:"Navios",name:"Porta-contêiner",path:"M2 16h20l-3 4H6l-4-4Zm4-7h4v3H6V9Zm5 0h4v3h-4V9Zm5 0h3v3h-3V9ZM8 13h10v3"},
{c:"Navios",name:"Rebocador",path:"M3 15h18l-3 5H7l-4-5Zm5 0V9h8l3 6M10 9V6h4v3M5 20c2 1 4 1 6 0 2 1 4 1 6 0"},
{c:"Navios",name:"Veleiro",path:"M12 3v14M11 5 5 15h6V5Zm2 2 6 8h-6V7ZM4 17h16l-3 4H7l-3-4Z"},
{c:"Navios",name:"Pesqueiro",path:"M3 16h18l-3 4H7l-4-4Zm6 0V9h7l3 7M11 9V6h4v3M5 12h4M18 8l3-3"},
{c:"Navios",name:"Draga",path:"M2 16h16l-3 4H6l-4-4Zm5 0V9h7v7m1-5 6-5m-4 3 4 7"},
{c:"Navios",name:"Offshore PSV",path:"M2 16h20l-3 4H6l-4-4Zm5 0V8h6v8m2 0V11h5M9 8V5h3v3"},
{c:"Navegação",name:"ECDIS",path:"M3 4h18v14H3V4Zm3 11 4-5 3 2 5-5M8 21h8M12 18v3"},
{c:"Navegação",name:"AIS",path:"M12 12h.01M8 16a6 6 0 0 1 0-8m8 0a6 6 0 0 1 0 8M5 19a10 10 0 0 1 0-14m14 0a10 10 0 0 1 0 14"},
{c:"Navegação",name:"Radar ARPA",path:"M12 12 19 5M12 3a9 9 0 1 0 9 9M12 7a5 5 0 1 0 5 5M12 12l4 6"},
{c:"Navegação",name:"Waypoint",path:"M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Zm0-8 3-3-3-3-3 3 3 3Z"},
{c:"Navegação",name:"Carta náutica",path:"M3 5l6-2 6 2 6-2v16l-6 2-6-2-6 2V5Zm6-2v16m6-14v16M5 14c3-4 5-4 8-1 2 2 4 1 6-2"},
{c:"Navegação",name:"Rosa dos ventos 16",path:"M12 2l1.7 7.1L19 5l-4.1 5.3L22 12l-7.1 1.7L19 19l-5.3-4.1L12 22l-1.7-7.1L5 19l4.1-5.3L2 12l7.1-1.7L5 5l5.3 4.1L12 2Z"},
{c:"RIPEAM",name:"Luz de navegação",path:"M12 3v3m7-1-2 2m5 5h-3M5 7 3 5M5 12H2m6 7h8l-1-8H9l-1 8Zm2-8V8h4v3"},
{c:"RIPEAM",name:"Marca esférica",path:"M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"},
{c:"RIPEAM",name:"Marca cônica",path:"M12 4 4 20h16L12 4Z"},
{c:"RIPEAM",name:"Marca bicônica",path:"M12 3 5 11h14L12 3Zm0 18 7-8H5l7 8Z"},
{c:"RIPEAM",name:"Marca cilíndrica",path:"M6 4h12v16H6V4Z"},
{c:"Balizamento",name:"Boia lateral",path:"M8 20h8l-1-9h-6l-1 9Zm2-9V7h4v4M7 20h10"},
{c:"Balizamento",name:"Boia cardinal",path:"M8 20h8l-1-9h-6l-1 9Zm4-16 3 5H9l3-5Z"},
{c:"Equipamento",name:"Âncora Hall",path:"M12 2v14m-5-4h10M5 10h14M4 15c1 4 4 6 8 6s7-2 8-6l-3-1c-1 2-2 4-5 4s-4-2-5-4l-3 1Z"},
{c:"Equipamento",name:"Guincho",path:"M5 17h14M7 17v-5a5 5 0 0 1 10 0v5M9 12h6M12 7v5"},
{c:"Equipamento",name:"Bote salva-vidas",path:"M3 14h18l-4 6H7l-4-6Zm4 0 2-5h6l2 5M9 9V6h6v3"},
{c:"Equipamento",name:"Extintor",path:"M8 21h8V8H8v13Zm2-13V5h5l2 2m-5-2V3m4 7h3"}
];

const PRO_MARINE_ASSETS=[
{c:"Passadiço",name:"Timão profissional",path:"M12 2v4m0 12v4M2 12h4m12 0h4M5 5l3 3m8 8 3 3m0-14-3 3M8 16l-3 3M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-3a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"},
{c:"Passadiço",name:"Telégrafo de máquinas",path:"M6 21h12M8 21V9a4 4 0 0 1 8 0v12M12 9l4-5M9 14h6M10 17h4"},
{c:"Passadiço",name:"Binóculo",path:"M3 18 6 7h4l2 5 2-5h4l3 11h-6l-3-6-3 6H3Zm3-11 1-3h3v3m8 0-1-3h-3v3"},
{c:"Passadiço",name:"VHF marítimo",path:"M7 5h10v16H7V5Zm3 3h4m-4 4h4m-5 5h6M15 5l3-3"},
{c:"Passadiço",name:"Agulha giroscópica",path:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-15v12m-6-6h12m-6-6 2 6-2 6-2-6 2-6Z"},
{c:"Passadiço",name:"Piloto automático",path:"M4 18h16V7H4v11Zm4-7h8m-4-4v8M7 21h10"},
{c:"Navegação",name:"GPS/GNSS",path:"M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0-5 3-8-8 3 5 5ZM12 2v2m0 16v2M2 12h2m16 0h2"},
{c:"Navegação",name:"Sextante",path:"M5 19 19 5M6 18a9 9 0 0 0 12 0M8 15h8M5 19l3-8 8 8"},
{c:"Navegação",name:"Farol costeiro",path:"M9 21h6l-1-11h-4L9 21Zm1-11 2-5 2 5M6 13 2 15m16-2 4 2M7 7 3 5m14 2 4-2"},
{c:"Navegação",name:"Derrota/Track",path:"M3 18c4-10 9-2 13-10m-1 0h5v5M3 18h5M18 5l2 3-3 2"},
{c:"Balizamento",name:"Cardinal Norte",path:"M8 21h8l-1-9H9l-1 9Zm4-17 4 6H8l4-6Z"},
{c:"Balizamento",name:"Cardinal Sul",path:"M8 21h8l-1-9H9l-1 9Zm4 7 4-6H8l4 6Z"},
{c:"Balizamento",name:"Perigo isolado",path:"M8 21h8l-1-9H9l-1 9ZM10 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm4 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"},
{c:"Balizamento",name:"Águas seguras",path:"M8 21h8l-1-9H9l-1 9M12 12V4m-3 3h6"},
{c:"Segurança",name:"Balsa salva-vidas",path:"M4 14c2-4 14-4 16 0l-2 5H6l-2-5Zm3 0c2-2 8-2 10 0M8 19v2m8-2v2"},
{c:"Segurança",name:"Boia circular",path:"M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0-5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-6-9 3 3m6 6 3 3m0-12-3 3m-6 6-3 3"},
{c:"Segurança",name:"EPIRB",path:"M9 21h6l1-13-2-3h-4L8 8l1 13Zm3-16V2m-5 4L4 3m13 3 3-3M10 12h4"},
{c:"Segurança",name:"SART",path:"M8 21h8V8H8v13Zm4-13V3m-3 2 3-2 3 2M10 12h4m-4 4h4"},
{c:"Convés",name:"Cabeço de amarração",path:"M6 20h12M8 20V9h8v11M6 9h12M9 9V5h6v4"},
{c:"Convés",name:"Molinete de âncora",path:"M5 18h14M7 18v-6h10v6M9 12a3 3 0 1 1 6 0M12 9V5m-2 0h4"},
{c:"Convés",name:"Escovém",path:"M4 18h16M6 18l2-9h8l2 9M10 13h4m-2-4V4"},
{c:"Convés",name:"Guindaste naval",path:"M7 21h8M9 21V6h4v15M13 7h7l-7 5m6-5v7m-2 0h4"},
{c:"Navios",name:"LNG Carrier",path:"M2 16h20l-3 4H6l-4-4Zm5 0v-5h10v5M9 11c0-4 6-4 6 0M6 20h12"},
{c:"Navios",name:"Ro-Ro",path:"M2 16h20l-3 4H6l-4-4Zm5 0V8h11v8M9 11h7m-7 3h7M5 20h14"},
{c:"Navios",name:"Cruzeiro",path:"M3 16h18l-3 4H7l-4-4Zm4 0V7h10v9M9 9h6m-6 3h6M11 7V4h4v3"},
{c:"Navios",name:"Navio de Prático",path:"M3 16h18l-3 4H7l-4-4Zm6 0V9h7l3 7M11 9V6h3v3M5 20c2 1 4 1 6 0 2 1 4 1 6 0"}
];

const LOGOS=[
{name:"ESTIBORDO · Âncora",mark:"M12 2v14m-5-4h10M5 10h14M4 15c1.5 4 4.3 6 8 6s6.5-2 8-6",wordmark:"ESTIBORDO",tagline:"PREPARAÇÃO PSCPP",shape:"none"},
{name:"ESTIBORDO · Bússola",mark:"M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2L12 2Z",wordmark:"ESTIBORDO",tagline:"NAVEGUE MAIS LONGE",shape:"circle"},
{name:"ESTIBORDO · Ondas",mark:"M2 9c3 2 5 2 8 0 3 2 5 2 8 0M2 15c3 2 5 2 8 0 3 2 5 2 8 0",wordmark:"ESTIBORDO",tagline:"ESTUDOS MARÍTIMOS",shape:"rounded"},
{name:"No Convés",mark:"M3 18h18l-2.5-6H5.5L3 18Zm4-6V8h4v4m2 0V5h4v7",wordmark:"NO CONVÉS",tagline:"COM DAVI",shape:"badge"},
{name:"Monograma E",mark:"M7 4h10M7 12h8M7 20h10M7 4v16",wordmark:"ESTIBORDO",tagline:"EDITOR STUDIO",shape:"square"},
{name:"Lighthouse",mark:"M9 22h6l-1-12h-4L9 22Zm1-12 2-5 2 5M7 13l-4 2m14-2 4 2",wordmark:"ESTIBORDO",tagline:"RUMO À APROVAÇÃO",shape:"crest"},
{name:"Praticagem",mark:"M12 3 4 8l8 4 8-4-8-5Zm0 9v9M7 17h10",wordmark:"PSCPP",tagline:"PREPARAÇÃO PARA PRATICAGEM",shape:"circle"},
{name:"Nautical Academy",mark:"M2 9 12 4l10 5-10 5L2 9Zm4 2v5c3 3 9 3 12 0v-5",wordmark:"ESTIBORDO",tagline:"ACADEMIA MARÍTIMA",shape:"rounded"}
];

const MORGUE=[["Navios","ship"],["Portos","harbor"],["Oceano","ocean"],["Faróis","lighthouse"],["Náutica","nautical"],["Barcos","boat"]];
const CATS=["Todos",...Array.from(new Set(ICONS.map(x=>x.c)))];
function Icon({path}){return <svg viewBox="0 0 24 24"><path d={path}/></svg>}

export default function StudioMenu({open,onClose,replacementMode,replacementType,selectionMode,onSelectionMode,siteMap,page,onPageChange,layers,onSelectLayer,blocks,selectedBlockId,onSelectBlock,onOpenBuilder,onOpenFlashcards,media,onUploadMedia,onAddIcon,onAddLogo,onAddSignalFlag,onImportImage,customCode,onCustomCode,breakpoints,onBreakpoints}){
  const [tab,setTab]=useState("site");const [assetTab,setAssetTab]=useState("cis");const [asset,setAsset]=useState({url:"",name:"",source:"Morguefile",license:"Free Personal & Commercial Use"});const [iconCat,setIconCat]=useState("Todos");const [iconSearch,setIconSearch]=useState("");
  useEffect(()=>{if(open&&replacementMode){setTab("assets");setAssetTab(replacementType==="signalFlag"?"cis":replacementType==="logo"?"logos":replacementType==="image"?"photos":"marine");return}if(open&&selectionMode)setTab("layers")},[open,replacementMode,replacementType,selectionMode]);
  const totalPages=useMemo(()=>siteMap.reduce((n,g)=>n+(g.pages?.length||0),0),[siteMap]);
  const filtered=useMemo(()=>ICONS.filter(x=>(iconCat==="Todos"||x.c===iconCat)&&(!iconSearch||x.name.toLowerCase().includes(iconSearch.toLowerCase()))),[iconCat,iconSearch]);
  return <div className={"ev-studio-backdrop "+(open?"is-open":"")} onMouseDown={e=>e.target===e.currentTarget&&onClose()}><aside className="ev-studio-menu"><header><button className="ev-studio-close" onClick={onClose}>☰</button><div><b>ESTIBORDO STUDIO</b><span>{totalPages} páginas · ferramentas profissionais</span></div><button className="ev-studio-x" onClick={onClose}>×</button></header><nav>{[["site","Site"],["layers","Camadas"],["tools","Ferramentas"],["assets","Assets"],["code","Código"]].map(([id,label])=><button key={id} className={tab===id?"is-active":""} onClick={()=>setTab(id)}>{label}</button>)}</nav><div className="ev-studio-scroll">
  {replacementMode&&<div className="ev-replace-banner"><b>↻ SUBSTITUIR OBJETO</b><span>Escolha um ícone, objeto marítimo, bandeira, logo ou imagem. Posição, tamanho, breakpoint e animações serão preservados.</span></div>}
  {tab==="site"&&siteMap.map(group=><section key={group.group}><h4>{group.group}</h4>{group.pages.map(([url,label,meta])=><button className={"ev-studio-page "+(page===url?"is-active":"")} key={url} onClick={()=>onPageChange(url)}><b>{label}</b><span>{url}</span>{meta?.hidden&&<em>oculta</em>}</button>)}</section>)}
  {tab==="layers"&&<><div className="ev-layer-mode-tabs"><button className={selectionMode!=="objects"?"is-active":""} onClick={()=>onSelectionMode?.("layers")}>Selecionar camada</button><button className={selectionMode==="objects"?"is-active":""} onClick={()=>onSelectionMode?.("objects")}>Selecionar objeto</button></div>{selectionMode!=="objects"&&<section><h4>Camadas da página · {layers.length}</h4><div className="ev-studio-layer-list">{layers.map(x=><button key={x.selector+x.index} onClick={()=>onSelectLayer(x.selector)}><small>{x.tag}</small><span>{x.label||x.selector}</span></button>)}</div></section>}{selectionMode==="objects"&&<section><h4>Objetos e blocos da página</h4><p className="ev-studio-help">Selecione um objeto para abrir suas propriedades. Arraste itens na árvore para reorganizar a hierarquia.</p><BlockTree blocks={blocks} selectedId={selectedBlockId} onSelect={onSelectBlock}/></section>}</>}
  {tab==="tools"&&<><div className="ev-studio-tool-grid"><button onClick={onOpenBuilder}><i>＋</i><b>Page Builder</b><span>Blocos, templates e layouts</span></button><button onClick={onOpenFlashcards}><i>▣</i><b>Flashcards</b><span>Gerenciador acadêmico</span></button></div><section><h4>Responsividade / Breakpoints</h4><div className="ev-breakpoint-editor"><label><span>Tablet até</span><input type="number" value={breakpoints.tablet||1024} onChange={e=>onBreakpoints({tablet:Number(e.target.value)||1024})}/><small>px</small></label><label><span>Mobile até</span><input type="number" value={breakpoints.mobile||620} onChange={e=>onBreakpoints({mobile:Number(e.target.value)||620})}/><small>px</small></label></div></section></>}
  {tab==="assets"&&<>
    <div className="ev-asset-tabs">{[["cis","CIS"],["marine","Marítimo Pro"],["icons","Ícones"],["logos","Logos"],["photos","Fotos"]].map(([id,label])=><button key={id} className={assetTab===id?"is-active":""} onClick={()=>setAssetTab(id)}>{label}</button>)}</div>
    {assetTab==="cis"&&<section><h4>Código Internacional de Sinais · A–Z e 0–9</h4><p className="ev-studio-help">Bandeiras vetoriais escaláveis para material didático e composição visual. Cada item conserva código e significado no bloco.</p><div className="ev-cis-library">{CIS.map(flag=><button key={flag.code} onClick={()=>onAddSignalFlag(flag)} title={flag.meaning}><span className="ev-cis-preview" data-pattern={flag.pattern} style={{"--a":flag.a,"--b":flag.b}}><i></i></span><b>{flag.code}</b><small>{flag.meaning}</small></button>)}</div></section>}
    {assetTab==="marine"&&<section><h4>Marítimo Pro · instrumentos, navios, segurança e convés</h4><p className="ev-studio-help">Assets vetoriais detalhados, escaláveis e adequados a diagramas, cards, aulas e interfaces náuticas.</p><div className="ev-marine-library">{[...MARINE_ASSETS,...PRO_MARINE_ASSETS].map(icon=><button key={icon.c+icon.name} onClick={()=>onAddIcon(icon)}><Icon path={icon.path}/><div><b>{icon.name}</b><small>{icon.c}</small></div></button>)}</div></section>}
    {assetTab==="icons"&&<section><h4>Biblioteca de ícones · {ICONS.length} opções</h4><div className="ev-icon-search"><input placeholder="Buscar ícone..." value={iconSearch} onChange={e=>setIconSearch(e.target.value)}/><select value={iconCat} onChange={e=>setIconCat(e.target.value)}>{CATS.map(c=><option key={c}>{c}</option>)}</select></div><div className="ev-icon-library">{filtered.map(icon=><button key={icon.c+icon.name} title={icon.c+" · "+icon.name} onClick={()=>onAddIcon(icon)}><Icon path={icon.path}/><span>{icon.name}</span><small>{icon.c}</small></button>)}</div><a className="ev-external-source" href="https://svg.icones.pro/" target="_blank" rel="noreferrer">Explorar mais no Icones.pro ↗</a></section>}
    {assetTab==="logos"&&<section><h4>Logos & Identidade Visual</h4><div className="ev-logo-library">{LOGOS.map(logo=><button key={logo.name} onClick={()=>onAddLogo(logo)}><div className={"ev-logo-preview is-"+logo.shape}><Icon path={logo.mark}/></div><div><b>{logo.wordmark}</b><span>{logo.tagline}</span><small>{logo.name}</small></div></button>)}</div><p className="ev-studio-help">Os presets são vetoriais e editáveis no canvas: texto, tagline, cor, fundo, tamanho e posição.</p></section>}
    {assetTab==="photos"&&<><section><h4>Fotos marítimas · Morguefile</h4><div className="ev-source-chips">{MORGUE.map(([label,term])=><a key={term} href={"https://morguefile.com/search?term="+encodeURIComponent(term)} target="_blank" rel="noreferrer">{label} ↗</a>)}</div><label className="ev-mini-field"><span>URL pública da imagem</span><input value={asset.url} onChange={e=>setAsset(v=>({...v,url:e.target.value}))}/></label><label className="ev-mini-field"><span>Nome</span><input value={asset.name} onChange={e=>setAsset(v=>({...v,name:e.target.value}))}/></label><button className="ev-import-asset" disabled={!asset.url} onClick={()=>onImportImage(asset)}>＋ Adicionar à biblioteca e ao canvas</button></section>
    <section><h4>Upload próprio</h4><label className="ev-media-library-upload"><input type="file" accept="image/*,video/*,audio/*" onChange={e=>onUploadMedia(e.target.files?.[0])}/><span>＋ Enviar arquivo</span></label><div className="ev-media-list">{(media||[]).slice().reverse().slice(0,10).map((m,i)=><div key={(m.url||"")+i}><b>{m.name||"Arquivo"}</b><small>{m.source?m.source+" · ":""}{m.url}</small></div>)}</div></section></>}
  </>}
  {tab==="code"&&<><section><h4>Custom CSS</h4><textarea className="ev-code-editor" spellCheck="false" value={customCode.css||""} onChange={e=>onCustomCode({css:e.target.value})}/></section><section><h4>HTML seguro</h4><textarea className="ev-code-editor" spellCheck="false" value={customCode.html||""} onChange={e=>onCustomCode({html:e.target.value})}/></section></>}
</div></aside></div>}
