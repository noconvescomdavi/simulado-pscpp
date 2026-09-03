-- ESTIBORDO V4.1
-- Torna as métricas por questão seguras para bancos diferentes que reutilizam IDs.
-- Antes a PK era (user_id, question_id). Agora a matéria também faz parte da chave.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
      FROM information_schema.tables
     WHERE table_schema = 'public'
       AND table_name = 'question_stats'
  ) THEN
    ALTER TABLE question_stats DROP CONSTRAINT IF EXISTS question_stats_pkey;

    IF NOT EXISTS (
      SELECT 1
        FROM pg_constraint
       WHERE conname = 'question_stats_pkey'
         AND conrelid = 'question_stats'::regclass
    ) THEN
      ALTER TABLE question_stats
        ADD CONSTRAINT question_stats_pkey
        PRIMARY KEY (user_id, subject, question_id);
    END IF;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS question_stats_user_subject_idx
  ON question_stats(user_id, subject, last_answered_at DESC);
