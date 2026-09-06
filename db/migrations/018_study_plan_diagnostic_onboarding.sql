BEGIN;

CREATE TABLE IF NOT EXISTS student_onboarding_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  onboarding_version INT NOT NULL DEFAULT 2,
  daily_minutes_by_day JSONB NOT NULL DEFAULT '{}'::jsonb,
  routine_type VARCHAR(32) NOT NULL DEFAULT 'fixed',
  prior_question_level VARCHAR(32) NOT NULL DEFAULT 'rarely',
  prior_simulations BOOLEAN NOT NULL DEFAULT FALSE,
  prior_accuracy_band VARCHAR(24),
  missed_day_strategy VARCHAR(32) NOT NULL DEFAULT 'redistribute_week',
  weekend_compensation BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMIT;
