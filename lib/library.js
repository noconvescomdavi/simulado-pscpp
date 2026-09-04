import { query } from "./db";
function clean(v,max=180){return String(v||"").trim().slice(0,max)}
export async function searchLibrary({q,subject,limit=20}){
  q=clean(q,240);subject=clean(subject,100);limit=Math.max(1,Math.min(50,Number(limit)||20));
  if(q.length<2)return[];
  const r=await query(`WITH p AS (
    SELECT websearch_to_tsquery('portuguese',unaccent($1)) qpt,
           websearch_to_tsquery('english',unaccent($1)) qen)
    SELECT c.id,c.page_start,c.page_end,c.heading,c.content,
           d.id document_id,d.title,d.authors,d.edition,d.publication_year,d.language,
           GREATEST(ts_rank_cd(c.search_pt,p.qpt),ts_rank_cd(c.search_en,p.qen),
                    similarity(unaccent(c.content),unaccent($1))*.20) rank
      FROM library_chunks c
      JOIN library_documents d ON d.id=c.document_id AND d.is_active=TRUE
      CROSS JOIN p
     WHERE ($2='' OR EXISTS(SELECT 1 FROM library_document_subjects ds WHERE ds.document_id=d.id AND ds.subject_slug=$2))
       AND (c.search_pt@@p.qpt OR c.search_en@@p.qen OR unaccent(c.content) ILIKE '%'||unaccent($1)||'%')
     ORDER BY rank DESC,d.title,c.page_start LIMIT $3`,[q,subject,limit]);
  return r.rows;
}
export async function getTopicSources(subject,code,limit=8){
  const r=await query(`SELECT t.subject_slug,t.topic_code,t.title_pt,t.title_en,
      s.relevance,s.note_pt,s.note_en,s.reviewed,c.id chunk_id,c.page_start,c.page_end,c.content,
      d.id document_id,d.title,d.authors,d.edition,d.publication_year,d.language
      FROM syllabus_topics t
      JOIN syllabus_topic_sources s ON s.topic_id=t.id
      JOIN library_chunks c ON c.id=s.chunk_id
      JOIN library_documents d ON d.id=c.document_id AND d.is_active=TRUE
      WHERE t.subject_slug=$1 AND t.topic_code=$2
      ORDER BY s.is_primary DESC,s.reviewed DESC,s.relevance DESC LIMIT $3`,[subject,code,limit]);
  if(r.rowCount)return{mode:"curated",rows:r.rows};
  const t=await query(`SELECT title_pt,title_en FROM syllabus_topics WHERE subject_slug=$1 AND topic_code=$2 LIMIT 1`,[subject,code]);
  if(!t.rowCount)return{mode:"missing",rows:[]};
  return{mode:"automatic",rows:await searchLibrary({q:[t.rows[0].title_pt,t.rows[0].title_en].filter(Boolean).join(" "),subject,limit})};
}
