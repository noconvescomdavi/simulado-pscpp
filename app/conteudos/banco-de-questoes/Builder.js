"use client";
import {useState} from "react";
import styles from "./bank.module.css";

export default function Builder({banks,trial=false}){
  const [s,setS]=useState(banks.filter(x=>x.count).map(x=>x.slug));
  const [n,setN]=useState(trial?10:20);
  const [e,setE]=useState("");

  async function go(){
    setE("");
    const r=await fetch("/api/question-notebooks",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({subjects:s,count:trial?10:n})
    });
    const p=await r.json().catch(()=>({}));

    if(!r.ok){
      if(r.status===429 && trial){
        location.href="/teste-gratis-excedido?recurso=caderno";
        return;
      }
      setE(p.error||"Erro");
      return;
    }

    location.href=`/conteudos/caderno/${p.notebook.id}`;
  }

  return (
    <section className={styles.box}>
      <div className={styles.banks}>
        {banks.map(x=>(
          <label key={x.slug} className={!x.count?styles.off:""}>
            <input
              type="checkbox"
              disabled={!x.count}
              checked={s.includes(x.slug)}
              onChange={()=>setS(v=>v.includes(x.slug)?v.filter(y=>y!==x.slug):[...v,x.slug])}
            />
            <span>
              <b>{x.title}</b>
              <small>{x.count?`${x.count} questÃµes`:"Aguardando upload"}</small>
            </span>
          </label>
        ))}
      </div>

      <label>
        Quantidade
        <input
          type="number"
          min={trial?10:1}
          max={trial?10:100}
          disabled={trial}
          value={trial?10:n}
          onChange={x=>setN(Math.max(1,Math.min(100,+x.target.value||1)))}
        />
      </label>

      {trial&&<p><strong>Teste gratuito:</strong> este serÃ¡ seu Ãºnico caderno, com 10 questÃµes aleatÃ³rias entre as matÃ©rias disponÃ­veis.</p>}
      {e&&<p>{e}</p>}
      <button onClick={go} disabled={!s.length}>Criar caderno</button>
    </section>
  );
}