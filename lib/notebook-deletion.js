import {withTransaction} from "./db";

// A exclusão é limitada ao próprio aluno e preserva métricas globais
// (question_answers, question_stats e study_days).
export const isNotebookId=value=>
  /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(String(value||""));

export async function deleteUserNotebook(userId,notebookId,{transaction=withTransaction}={}){
  if(!isNotebookId(notebookId)){
    return {error:"Identificador de caderno inválido.",status:400};
  }
  return transaction(async client=>{
    // A mesma trava é usada por answerNotebook: a exclusão não se intercala com uma resposta.
    const notebookResult=await client.query(
      "select id,total_questions from question_notebooks where id=$1 and user_id=$2 for update",
      [notebookId,userId]
    );
    const notebook=notebookResult.rows[0];
    if(!notebook)return {error:"Caderno não encontrado.",status:404};

    const answers=await client.query(
      "select count(*)::int as total from question_notebook_answers where notebook_id=$1 and user_id=$2",
      [notebookId,userId]
    );
    const answered=Number(answers.rows[0]?.total||0);

    // Marcador durável: no teste grátis, a exclusão não permite criar
    // cadernos ilimitados por apagar o único caderno emitido.
    await client.query(
      "insert into product_events(user_id,event_name,metadata) values($1,$2,$3::jsonb)",
      [userId,"question_notebook_deleted",JSON.stringify({
        notebook_id:String(notebook.id),
        answered_count:answered,
        total_questions:Number(notebook.total_questions||0),
        completed:answered>=Number(notebook.total_questions||0)
      })]
    );

    // question_notebook_answers tem ON DELETE CASCADE; os resultados globais
    // contabilizados nas outras tabelas não são apagados.
    const removed=await client.query(
      "delete from question_notebooks where id=$1 and user_id=$2 returning id",
      [notebookId,userId]
    );
    if(!removed.rowCount)throw new Error("Exclusão concorrente inesperada");

    return {
      ok:true,deleted:true,
      notebook_id:String(notebook.id),
      answered_count:answered,
      preserved_global_history:true
    };
  });
}
