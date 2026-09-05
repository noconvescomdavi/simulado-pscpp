import {query} from "../../../lib/db";
import ContramestreLibrary from "./ContramestreLibrary";
import styles from "./contramestre.module.css";

export const dynamic="force-dynamic";

export default async function ContramestreAdmin(){
  const [settings,files,usage]=await Promise.all([
    query("select vector_store_id,updated_at from ai_tutor_settings where id=1").catch(()=>({rows:[]})),
    query("select id,openai_file_id,filename,bytes,status,created_at from ai_tutor_library_files order by created_at desc limit 200").catch(()=>({rows:[]})),
    query(`select coalesce(sum(questions),0)::bigint questions,
                  coalesce(sum(input_tokens),0)::bigint input_tokens,
                  coalesce(sum(output_tokens),0)::bigint output_tokens
             from ai_tutor_daily_usage
            where usage_date>=current_date-interval '30 days'`).catch(()=>({rows:[{}]}))
  ]);
  const keyReady=Boolean(String(process.env.OPENAI_API_KEY||"").trim());
  return <main className={styles.page}>
    <section className={styles.hero}>
      <div><span>INTELIGÊNCIA ESTIBORDO</span><h1>⚓ CONTRAMESTRE</h1><p>Gerencie a bibliografia consultada pelo tutor e acompanhe o uso da IA.</p></div>
      <div className={keyReady?styles.ready:styles.notReady}>{keyReady?"OPENAI CONECTADA":"OPENAI_API_KEY PENDENTE"}</div>
    </section>

    <section className={styles.metrics}>
      <article><span>PERGUNTAS · 30 DIAS</span><strong>{Number(usage.rows[0]?.questions||0).toLocaleString("pt-BR")}</strong></article>
      <article><span>TOKENS DE ENTRADA</span><strong>{Number(usage.rows[0]?.input_tokens||0).toLocaleString("pt-BR")}</strong></article>
      <article><span>TOKENS DE SAÍDA</span><strong>{Number(usage.rows[0]?.output_tokens||0).toLocaleString("pt-BR")}</strong></article>
      <article><span>ARQUIVOS NO ACERVO</span><strong>{files.rows.length}</strong></article>
    </section>

    <ContramestreLibrary initialFiles={files.rows} vectorStoreId={settings.rows[0]?.vector_store_id||""} keyReady={keyReady}/>
  </main>;
}
