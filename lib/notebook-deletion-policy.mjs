// Núcleo testável da exclusão, sem dependência da aplicação ou do PostgreSQL.
// transaction é a função de transação injetada pelo serviço servidor.
export const isNotebookId=value=>
  /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(String(value||""));

export async function deleteNotebookRecord(userId,notebookId,transaction){
  if(!isNotebookId(notebookId)){
    return {error:"Identificador de caderno inválido.",status:400};
  }
  return transaction(async client=>{
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

    // Marcador permanente de exclusão para respeitar o limite do teste grátis.
    await client.query(
      "insert into product_events(user_id,event_name,metadata) values($1,$2,$3::jsonb)",
      [userId,"question_notebook_deleted",JSON.stringify({
        notebook_id:String(notebook.id),
        answered_count:answered,
        total_questions:Number(notebook.total_questions||0),
        completed:answered>=Number(notebook.total_questions||0)
      })]
    );

    // As respostas internas são removidas pela FK ON DELETE CASCADE.
    // Histórico global (question_answers, question_stats, study_days) permanece.
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
