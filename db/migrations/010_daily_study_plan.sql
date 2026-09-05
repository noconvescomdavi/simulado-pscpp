BEGIN;

CREATE TABLE IF NOT EXISTS student_daily_plan_items (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_date DATE NOT NULL,
  task_key VARCHAR(160) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, plan_date, task_key)
);

CREATE INDEX IF NOT EXISTS idx_student_daily_plan_items_user_date
  ON student_daily_plan_items(user_id, plan_date);

COMMIT;
