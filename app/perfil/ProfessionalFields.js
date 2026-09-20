"use client";
import {useState} from "react";
import styles from "./profile.module.css";

const GROUPS=[
["1º GRUPO — MARÍTIMOS · CONVÉS",["CAPITÃO DE LONGO CURSO — CLC","CAPITÃO DE CABOTAGEM — CCB","PRIMEIRO OFICIAL DE NÁUTICA — 1ON","SEGUNDO OFICIAL DE NÁUTICA — 2ON","MESTRE DE CABOTAGEM — MCB","CONTRAMESTRE — CTR","MARINHEIRO DE CONVÉS — MNC","MOÇO DE CONVÉS — MOC","MARINHEIRO AUXILIAR DE CONVÉS — MAC"]],
["1º GRUPO — MARÍTIMOS · MÁQUINAS",["OFICIAL SUPERIOR DE MÁQUINAS — OSM","PRIMEIRO OFICIAL DE MÁQUINAS — 1OM","SEGUNDO OFICIAL DE MÁQUINAS — 2OM","CONDUTOR DE MÁQUINAS — CDM","ELETRICISTA — ELT","MARINHEIRO DE MÁQUINAS — MNM","MOÇO DE MÁQUINAS — MOM","MARINHEIRO AUXILIAR DE MÁQUINAS — MAM"]],
["2º GRUPO — FLUVIÁRIOS · CONVÉS",["CAPITÃO FLUVIAL — CFL","PILOTO FLUVIAL — PLF","MESTRE FLUVIAL — MFL","CONTRAMESTRE FLUVIAL — CMF","MARINHEIRO FLUVIAL DE CONVÉS — MFC","MARINHEIRO FLUVIAL AUXILIAR DE CONVÉS — MAF"]],
["2º GRUPO — FLUVIÁRIOS · MÁQUINAS",["SUPERVISOR MAQUINISTA MOTORISTA FLUVIAL — SUF","CONDUTOR MAQUINISTA MOTORISTA FLUVIAL — CTF","MARINHEIRO FLUVIAL DE MÁQUINAS — MFM","MARINHEIRO FLUVIAL AUXILIAR DE MÁQUINAS — MMA"]],
["3º GRUPO — PESCADORES · CONVÉS",["PATRÃO DE PESCA DE ALTO MAR — PAP","PATRÃO DE PESCA NA NAVEGAÇÃO INTERIOR — PPI","CONTRAMESTRE DE PESCA NA NAVEGAÇÃO INTERIOR — CPI","PESCADOR PROFISSIONAL ESPECIALIZADO — PEP","PESCADOR PROFISSIONAL — POP","APRENDIZ DE PESCA — APP"]],
["3º GRUPO — PESCADORES · MÁQUINAS",["CONDUTOR MOTORISTA DE PESCA — CMP","MOTORISTA DE PESCA — MOP","APRENDIZ DE MOTORISTA — APM"]],
["3º GRUPO — PESCADORES · SAÚDE/CÂMARA",["ENFERMEIRO — ENF","AUXILIAR DE SAÚDE — ASA","TAIFEIRO — TAA","COZINHEIRO — CZA"]],
["4º GRUPO — MERGULHADORES",["MERGULHADOR QUE OPERA COM MISTURA GASOSA ARTIFICIAL — MGP","MERGULHADOR QUE OPERA COM AR COMPRIMIDO — MGE"]],
["5º GRUPO — PRÁTICOS",["PRÁTICO — PRT","PRATICANTE DE PRÁTICO — PRP"]],
["6º GRUPO — MANOBRA E DOCAGEM",["AGENTE DE MANOBRA E DOCAGEM — AMD"]]
];
const AMADORES=["ARRAIS AMADOR — ARA","MESTRE AMADOR — MTA","CAPITÃO AMADOR — CPA"];
const MB_POSTOS=[
  "OFICIAL GENERAL / SUPERIOR — MB",
  "CAPITÃO-TENENTE — MB",
  "1º TENENTE — MB",
  "2º TENENTE — MB"
];

export default function ProfessionalFields({initialType="",initialCategory="",initialEmbarkationDays=0,initialCommandDays=0}){
 const normalized=["aquaviario","militar_mb","nao_aquaviario","outros"].includes(initialType)?initialType:"";
 const [type,setType]=useState(normalized);
 return <div className={styles.professionGrid}>
   <label>Atuação
     <select name="occupation_type" value={type} onChange={e=>setType(e.target.value)}>
       <option value="">Prefiro não informar</option>
       <option value="aquaviario">Marítimo/Aquaviário</option>
       <option value="militar_mb">Militar / Ex-militar da MB</option>\n       <option value="nao_aquaviario">Não Aquaviário</option>
       <option value="outros">Outros</option>
     </select>
   </label>
   {type==="aquaviario"&&<label>Categoria
     <select name="occupation_category" defaultValue={initialCategory}>
       <option value="">Selecione sua categoria</option>
       {GROUPS.map(([group,items])=><optgroup label={group} key={group}>{items.map(item=><option key={item} value={item}>{item}</option>)}</optgroup>)}
     </select>
   </label>}
   {type==="militar_mb"&&<label>Posto / Graduação
     <select name="occupation_category" defaultValue={initialCategory}>
       <option value="">Selecione o posto ou graduação</option>
       {MB_POSTOS.map(item=><option key={item} value={item}>{item}</option>)}
     </select>
   </label>}
   {type==="nao_aquaviario"&&<label>Habilitação
     <select name="occupation_category" defaultValue={initialCategory}>
       <option value="">Selecione sua habilitação</option>
       {AMADORES.map(item=><option key={item} value={item}>{item}</option>)}
     </select>
   </label>}
   {type==="outros"&&<label>Profissão
     <input name="occupation_other" defaultValue={initialCategory} maxLength="120" placeholder="Informe sua profissão"/>
   </label>}
 </div>;
}
