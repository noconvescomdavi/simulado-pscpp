import { query } from "./db";

function clean(value, max = 180) {
  return String(value || "").trim().slice(0, max);
}

function clampLimit(value, fallback = 20, max = 50) {
  const n = Number(value);
  return Math.max(1, Math.min(max, Number.isFinite(n) ? n : fallback));
}

/**
 * Busca global na biblioteca.
 * A matéria NÃO bloqueia resultados de outros documentos:
 * documentos associados à disciplina recebem apenas um bônus de ranking.
 */
export async function searchLibrary({ q, subject = "", limit = 20 }) {
  q = clean(q, 240);
  subject = clean(subject, 100);
  limit = clampLimit(limit, 20, 50);

  if (q.length < 2) return [];

  const result = await query(
    `WITH p AS (
       SELECT
         websearch_to_tsquery('portuguese', unaccent($1)) AS qpt,
         websearch_to_tsquery('english', unaccent($1)) AS qen
     )
     SELECT
       c.id,
       c.page_start,
       c.page_end,
       c.heading,
       c.content,
       d.id AS document_id,
       d.title,
       d.authors,
       d.edition,
       d.publication_year,
       d.language,
       (
         GREATEST(
           ts_rank_cd(c.search_pt, p.qpt),
           ts_rank_cd(c.search_en, p.qen)
         )
         +
         CASE
           WHEN $2 <> '' AND EXISTS (
             SELECT 1
             FROM library_document_subjects ds
             WHERE ds.document_id = d.id
               AND ds.subject_slug = $2
           )
           THEN 0.20
           ELSE 0
         END
       ) AS rank
     FROM library_chunks c
     JOIN library_documents d
       ON d.id = c.document_id
      AND d.is_active = TRUE
     CROSS JOIN p
     WHERE
       c.search_pt @@ p.qpt
       OR c.search_en @@ p.qen
       OR unaccent(c.content) ILIKE '%' || unaccent($1) || '%'
     ORDER BY rank DESC, d.title, c.page_start
     LIMIT $3`,
    [q, subject, limit]
  );

  return result.rows;
}

export async function listSyllabusTopics(subject, limit = 2000) {
  subject = clean(subject, 100);
  limit = clampLimit(limit, 2000, 2500);

  if (!subject) return [];

  const result = await query(
    `SELECT
       id,
       subject_slug,
       topic_code,
       title_pt,
       title_en,
       parent_code,
       sort_order
     FROM syllabus_topics
     WHERE subject_slug = $1
     ORDER BY sort_order, id
     LIMIT $2`,
    [subject, limit]
  );

  return result.rows;
}

export async function getTopicSources(subject, code, limit = 8) {
  subject = clean(subject, 100);
  code = clean(code, 80);
  limit = clampLimit(limit, 8, 30);

  const curated = await query(
    `SELECT
       t.subject_slug,
       t.topic_code,
       t.title_pt,
       t.title_en,
       s.relevance,
       s.note_pt,
       s.note_en,
       s.reviewed,
       c.id AS chunk_id,
       c.page_start,
       c.page_end,
       c.content,
       d.id AS document_id,
       d.title,
       d.authors,
       d.edition,
       d.publication_year,
       d.language
     FROM syllabus_topics t
     JOIN syllabus_topic_sources s ON s.topic_id = t.id
     JOIN library_chunks c ON c.id = s.chunk_id
     JOIN library_documents d
       ON d.id = c.document_id
      AND d.is_active = TRUE
     WHERE t.subject_slug = $1
       AND t.topic_code = $2
     ORDER BY
       s.is_primary DESC,
       s.reviewed DESC,
       s.relevance DESC
     LIMIT $3`,
    [subject, code, limit]
  );

  if (curated.rowCount) {
    return { mode: "curated", rows: curated.rows };
  }

  const topic = await query(
    `SELECT title_pt, title_en
     FROM syllabus_topics
     WHERE subject_slug = $1
       AND topic_code = $2
     LIMIT 1`,
    [subject, code]
  );

  if (!topic.rowCount) return { mode: "missing", rows: [] };

  const q = [topic.rows[0].title_pt, topic.rows[0].title_en]
    .filter(Boolean)
    .join(" ");

  return {
    mode: "automatic",
    rows: await searchLibrary({ q, subject, limit }),
  };
}
