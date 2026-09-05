BEGIN;

ALTER TABLE student_study_goals
  ADD COLUMN IF NOT EXISTS reading_minutes_target INT NOT NULL DEFAULT 120;

ALTER TABLE student_onboarding
  ADD COLUMN IF NOT EXISTS reading_minutes_target INT NOT NULL DEFAULT 120;

ALTER TABLE study_bibliography_catalog
  ADD COLUMN IF NOT EXISTS reading_density VARCHAR(20) NOT NULL DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS pages_verified BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS page_reference TEXT;

CREATE TABLE IF NOT EXISTS student_reading_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bibliography_key VARCHAR(180) NOT NULL,
  subject_slug VARCHAR(120) NOT NULL,
  section_key VARCHAR(180) NOT NULL,
  page_from INT,
  page_to INT,
  pages_completed INT NOT NULL DEFAULT 0,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id,bibliography_key,section_key,page_from,page_to)
);

CREATE INDEX IF NOT EXISTS idx_student_reading_log_user_date
  ON student_reading_log(user_id,logged_at DESC);

COMMIT;
