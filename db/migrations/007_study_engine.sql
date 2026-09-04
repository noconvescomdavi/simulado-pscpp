BEGIN;

CREATE TABLE IF NOT EXISTS student_topic_mastery (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_slug TEXT NOT NULL,
  topic_code TEXT NOT NULL,
  answered_count INT NOT NULL DEFAULT 0,
  correct_count INT NOT NULL DEFAULT 0,
  error_count INT NOT NULL DEFAULT 0,
  mastery_score NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (mastery_score BETWEEN 0 AND 100),
  confidence NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (confidence BETWEEN 0 AND 100),
  last_answered_at TIMESTAMPTZ,
  last_studied_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, subject_slug, topic_code)
);

CREATE INDEX IF NOT EXISTS idx_student_topic_mastery_review
  ON student_topic_mastery(user_id, next_review_at);

CREATE TABLE IF NOT EXISTS student_review_queue (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_slug TEXT NOT NULL,
  topic_code TEXT,
  source_type TEXT NOT NULL CHECK (source_type IN ('question','flashcard','topic','library')),
  source_key TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'new'
    CHECK (state IN ('new','learning','review','relearning','suspended')),
  difficulty NUMERIC(6,3) NOT NULL DEFAULT 5,
  stability NUMERIC(10,3) NOT NULL DEFAULT 0,
  review_count INT NOT NULL DEFAULT 0,
  lapse_count INT NOT NULL DEFAULT 0,
  last_reviewed_at TIMESTAMPTZ,
  due_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, source_type, source_key)
);

CREATE INDEX IF NOT EXISTS idx_student_review_queue_due
  ON student_review_queue(user_id, due_at)
  WHERE state <> 'suspended';

CREATE TABLE IF NOT EXISTS student_notes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_slug TEXT,
  topic_code TEXT,
  title TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_notes_topic
  ON student_notes(user_id, subject_slug, topic_code);

CREATE TABLE IF NOT EXISTS student_bookmarks (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL
    CHECK (resource_type IN ('question','flashcard','topic','library','exam')),
  resource_key TEXT NOT NULL,
  subject_slug TEXT,
  topic_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, resource_type, resource_key)
);

CREATE TABLE IF NOT EXISTS student_study_goals (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  daily_minutes INT NOT NULL DEFAULT 60 CHECK (daily_minutes BETWEEN 10 AND 720),
  weekly_questions INT NOT NULL DEFAULT 100 CHECK (weekly_questions BETWEEN 1 AND 10000),
  target_exam_date DATE,
  study_days SMALLINT[] NOT NULL DEFAULT ARRAY[1,2,3,4,5,6,7]::SMALLINT[],
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_study_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL DEFAULT 'study',
  subject_slug TEXT,
  topic_code TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INT NOT NULL DEFAULT 0,
  questions_answered INT NOT NULL DEFAULT 0,
  correct_answers INT NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB
);

CREATE INDEX IF NOT EXISTS idx_student_study_sessions_user_started
  ON student_study_sessions(user_id, started_at DESC);

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id BIGSERIAL PRIMARY KEY,
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_key TEXT,
  before_data JSONB,
  after_data JSONB,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created
  ON admin_audit_log(created_at DESC);

COMMIT;
