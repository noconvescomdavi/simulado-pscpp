BEGIN;

CREATE TABLE IF NOT EXISTS student_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  session_minutes INT NOT NULL DEFAULT 45 CHECK (session_minutes BETWEEN 15 AND 180),
  study_mode VARCHAR(30) NOT NULL DEFAULT 'balanced' CHECK (study_mode IN ('balanced','questions','reading','review')),
  dashboard_density VARCHAR(20) NOT NULL DEFAULT 'standard' CHECK (dashboard_density IN ('compact','standard','detailed')),
  smart_nudges BOOLEAN NOT NULL DEFAULT TRUE,
  prioritize_due_reviews BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_name VARCHAR(80) NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_product_events_name_created ON product_events(event_name,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_events_user_created ON product_events(user_id,created_at DESC);

CREATE TABLE IF NOT EXISTS experiment_assignments (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  experiment_key VARCHAR(80) NOT NULL,
  variant VARCHAR(40) NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id,experiment_key)
);
CREATE INDEX IF NOT EXISTS idx_experiment_assignments_key ON experiment_assignments(experiment_key,variant);

COMMIT;
