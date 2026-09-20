"use client";

import {useEffect,useState} from "react";
import styles from "./TodayExamCountdown.module.css";

const TARGET=new Date("2027-11-01T00:00:00-03:00").getTime();
function remaining(){
  const diff=Math.max(0,TARGET-Date.now());
  return {days:Math.floor(diff/86400000),hours:Math.floor((diff%86400000)/3600000),minutes:Math.floor((diff%3600000)/60000),seconds:Math.floor((diff%60000)/1000)};
}
const two=(value)=>String(value).padStart(2,"0");

export default function TodayExamCountdown(){
  const [value,setValue]=useState(null);
  useEffect(()=>{const update=()=>setValue(remaining());update();const timer=setInterval(update,1000);return()=>clearInterval(timer)},[]);
  const v=value||{days:"—",hours:"—",minutes:"—",seconds:"—"};
  return <section className={styles.card} aria-label="Contagem regressiva para a prova">
    <div><span>CONTAGEM REGRESSIVA PARA A PROVA</span><small>Considerando 01/11/2027</small></div>
    <div className={styles.clock}>
      <b>{v.days}<small>DIAS</small></b><i>:</i>
      <b>{value?two(v.hours):v.hours}<small>HORAS</small></b><i>:</i>
      <b>{value?two(v.minutes):v.minutes}<small>MIN</small></b><i>:</i>
      <b>{value?two(v.seconds):v.seconds}<small>SEG</small></b>
    </div>
  </section>;
}
