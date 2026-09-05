BEGIN;

CREATE TABLE IF NOT EXISTS student_onboarding (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  experience_level VARCHAR(24) NOT NULL DEFAULT 'beginner'
    CHECK (experience_level IN ('beginner','studying','advanced')),
  started_before BOOLEAN NOT NULL DEFAULT FALSE,
  months_studying INT NOT NULL DEFAULT 0 CHECK (months_studying BETWEEN 0 AND 240),
  daily_minutes INT NOT NULL DEFAULT 60 CHECK (daily_minutes BETWEEN 15 AND 720),
  study_days SMALLINT[] NOT NULL DEFAULT ARRAY[1,2,3,4,5,6]::SMALLINT[],
  studied_subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
  confidence_by_subject JSONB NOT NULL DEFAULT '{}'::jsonb,
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_plan_task_progress (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_key VARCHAR(220) NOT NULL,
  plan_date DATE NOT NULL,
  task_type VARCHAR(30) NOT NULL,
  subject_slug VARCHAR(120),
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','done','skipped')),
  completed_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, task_key, plan_date)
);

CREATE INDEX IF NOT EXISTS idx_student_plan_progress_user_date
  ON student_plan_task_progress(user_id, plan_date);

CREATE TABLE IF NOT EXISTS student_bibliography_progress (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bibliography_key VARCHAR(180) NOT NULL,
  subject_slug VARCHAR(120) NOT NULL,
  section_key VARCHAR(180) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','reading','done')),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, bibliography_key, section_key)
);

CREATE INDEX IF NOT EXISTS idx_student_bibliography_progress_subject
  ON student_bibliography_progress(user_id, subject_slug, status);

INSERT INTO student_study_goals(user_id,daily_minutes,weekly_questions,target_exam_date,study_days)
SELECT id,60,100,DATE '2027-11-01',ARRAY[1,2,3,4,5,6]::SMALLINT[]
FROM users
ON CONFLICT(user_id) DO UPDATE SET
  target_exam_date=DATE '2027-11-01',
  updated_at=NOW();

COMMIT;
