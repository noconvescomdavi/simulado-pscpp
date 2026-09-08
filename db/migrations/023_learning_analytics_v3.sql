BEGIN;

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
  duration_seconds INT NOT NULL DEFAULT 0 CHECK (duration_seconds >= 0),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

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

CREATE INDEX IF NOT EXISTS idx_student_topic_mastery_user_score
  ON student_topic_mastery(user_id, mastery_score ASC, confidence_score DESC);

COMMIT;
