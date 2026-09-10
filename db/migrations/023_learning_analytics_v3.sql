BEGIN;

-- Learning Analytics V3.
-- IMPORTANT: 007_study_engine.sql created earlier versions of
-- student_study_sessions and student_topic_mastery. This migration must
-- upgrade those tables in-place instead of assuming CREATE TABLE IF NOT EXISTS
-- changes an existing schema.

CREATE TABLE IF NOT EXISTS student_study_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_type VARCHAR(40) NOT NULL DEFAULT 'study',
  subject_slug VARCHAR(120),
  task_key VARCHAR(220),
  plan_date DATE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_heartbeat_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration_seconds INT NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE student_study_sessions
  ADD COLUMN IF NOT EXISTS task_key VARCHAR(220),
  ADD COLUMN IF NOT EXISTS plan_date DATE,
  ADD COLUMN IF NOT EXISTS last_heartbeat_at TIMESTAMPTZ;

UPDATE student_study_sessions
   SET last_heartbeat_at = COALESCE(last_heartbeat_at, ended_at, started_at)
 WHERE last_heartbeat_at IS NULL;

ALTER TABLE student_study_sessions
  DROP CONSTRAINT IF EXISTS student_study_sessions_duration_nonnegative;
ALTER TABLE student_study_sessions
  ADD CONSTRAINT student_study_sessions_duration_nonnegative
  CHECK (duration_seconds >= 0) NOT VALID;
ALTER TABLE student_study_sessions
  VALIDATE CONSTRAINT student_study_sessions_duration_nonnegative;

-- Older schemas allowed more than one unfinished session per user. Keep the
-- newest open and close older stale rows at their last known activity.
WITH ranked_open AS (
  SELECT id,
         row_number() OVER (
           PARTITION BY user_id
           ORDER BY started_at DESC, id DESC
         ) AS rn
    FROM student_study_sessions
   WHERE ended_at IS NULL
)
UPDATE student_study_sessions s
   SET ended_at = COALESCE(s.last_heartbeat_at, s.started_at),
       last_heartbeat_at = COALESCE(s.last_heartbeat_at, s.started_at),
       metadata = COALESCE(s.metadata, '{}'::jsonb)
         || '{"auto_closed":"migration_023_duplicate_open_session"}'::jsonb
  FROM ranked_open r
 WHERE s.id = r.id
   AND r.rn > 1;

CREATE INDEX IF NOT EXISTS idx_student_study_sessions_user_started
  ON student_study_sessions(user_id, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_student_study_sessions_user_plan_date
  ON student_study_sessions(user_id, plan_date, started_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_student_study_sessions_one_open
  ON student_study_sessions(user_id)
  WHERE ended_at IS NULL;

CREATE TABLE IF NOT EXISTS student_topic_mastery (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_slug VARCHAR(120) NOT NULL,
  topic_code VARCHAR(120) NOT NULL DEFAULT '',
  topic_label VARCHAR(300) NOT NULL,
  mastery_score NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (mastery_score BETWEEN 0 AND 100),
  confidence_score NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (confidence_score BETWEEN 0 AND 100),
  accuracy NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (accuracy BETWEEN 0 AND 100),
  answers INT NOT NULL DEFAULT 0,
  errors INT NOT NULL DEFAULT 0,
  review_count INT NOT NULL DEFAULT 0,
  lapse_count INT NOT NULL DEFAULT 0,
  last_activity_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, subject_slug, topic_code, topic_label)
);

ALTER TABLE student_topic_mastery
  ADD COLUMN IF NOT EXISTS topic_label VARCHAR(300),
  ADD COLUMN IF NOT EXISTS confidence_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS accuracy NUMERIC(5,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS answers INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS errors INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS review_count INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS lapse_count INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ;

-- Preserve and reuse metrics from the legacy 007 schema when those columns
-- exist. Dynamic SQL keeps this migration valid for both legacy and fresh DBs.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_schema='public' AND table_name='student_topic_mastery'
       AND column_name='answered_count'
  ) THEN
    EXECUTE 'UPDATE student_topic_mastery
                SET answers = GREATEST(answers, COALESCE(answered_count,0))';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_schema='public' AND table_name='student_topic_mastery'
       AND column_name='error_count'
  ) THEN
    EXECUTE 'UPDATE student_topic_mastery
                SET errors = GREATEST(errors, COALESCE(error_count,0))';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_schema='public' AND table_name='student_topic_mastery'
       AND column_name='confidence'
  ) THEN
    EXECUTE 'UPDATE student_topic_mastery
                SET confidence_score = GREATEST(confidence_score, COALESCE(confidence,0))';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_schema='public' AND table_name='student_topic_mastery'
       AND column_name='last_answered_at'
  ) THEN
    EXECUTE 'UPDATE student_topic_mastery
                SET last_activity_at = COALESCE(last_activity_at,last_answered_at)';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_schema='public' AND table_name='student_topic_mastery'
       AND column_name='correct_count'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_schema='public' AND table_name='student_topic_mastery'
       AND column_name='answered_count'
  ) THEN
    EXECUTE 'UPDATE student_topic_mastery
                SET accuracy = CASE
                  WHEN COALESCE(answered_count,0)>0
                  THEN ROUND((COALESCE(correct_count,0)::numeric / answered_count::numeric)*100,2)
                  ELSE accuracy
                END';
  END IF;
END $$;

UPDATE student_topic_mastery
   SET topic_label = COALESCE(NULLIF(topic_label,''), NULLIF(topic_code,''), 'Conteúdo geral')
 WHERE topic_label IS NULL OR topic_label='';

ALTER TABLE student_topic_mastery
  ALTER COLUMN topic_label SET NOT NULL;

-- 007 used (user_id, subject_slug, topic_code). V3 distinguishes labels too,
-- which is required when multiple uncoded topics share topic_code=''.
DO $$
DECLARE
  pk_name text;
  pk_cols text[];
BEGIN
  SELECT c.conname,
         array_agg(a.attname::text ORDER BY u.ord)
    INTO pk_name, pk_cols
    FROM pg_constraint c
    JOIN LATERAL unnest(c.conkey) WITH ORDINALITY u(attnum,ord) ON true
    JOIN pg_attribute a ON a.attrelid=c.conrelid AND a.attnum=u.attnum
   WHERE c.conrelid='student_topic_mastery'::regclass
     AND c.contype='p'
   GROUP BY c.conname;

  IF pk_cols IS DISTINCT FROM ARRAY['user_id','subject_slug','topic_code','topic_label']::text[] THEN
    IF pk_name IS NOT NULL THEN
      EXECUTE format('ALTER TABLE student_topic_mastery DROP CONSTRAINT %I',pk_name);
    END IF;
    ALTER TABLE student_topic_mastery
      ADD CONSTRAINT student_topic_mastery_pkey
      PRIMARY KEY (user_id,subject_slug,topic_code,topic_label);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_student_topic_mastery_user_score
  ON student_topic_mastery(user_id, mastery_score ASC, confidence_score DESC);

COMMIT;
