BEGIN;

-- ESTIBORDO Learning Engine V3
-- Snapshots imutáveis, trilha de eventos e reprogramações auditáveis.

CREATE TABLE IF NOT EXISTS student_plan_snapshots (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  algorithm_version VARCHAR(40) NOT NULL DEFAULT 'v3',
  source VARCHAR(30) NOT NULL DEFAULT 'weekly_plan',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  frozen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT student_plan_snapshots_week_check CHECK (week_end >= week_start),
  CONSTRAINT student_plan_snapshots_unique_week UNIQUE (user_id, week_start)
);

CREATE INDEX IF NOT EXISTS idx_student_plan_snapshots_user_week
  ON student_plan_snapshots(user_id, week_start DESC);

CREATE TABLE IF NOT EXISTS student_plan_snapshot_tasks (
  id BIGSERIAL PRIMARY KEY,
  snapshot_id BIGINT NOT NULL REFERENCES student_plan_snapshots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_date DATE NOT NULL,
  task_key VARCHAR(220) NOT NULL,
  task_type VARCHAR(30) NOT NULL,
  subject_slug VARCHAR(120),
  position SMALLINT NOT NULL DEFAULT 0,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT student_plan_snapshot_tasks_unique_task UNIQUE (snapshot_id, plan_date, task_key)
);

CREATE INDEX IF NOT EXISTS idx_student_plan_snapshot_tasks_user_date
  ON student_plan_snapshot_tasks(user_id, plan_date);

CREATE INDEX IF NOT EXISTS idx_student_plan_snapshot_tasks_snapshot_position
  ON student_plan_snapshot_tasks(snapshot_id, plan_date, position);

CREATE TABLE IF NOT EXISTS student_plan_events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type VARCHAR(60) NOT NULL,
  task_key VARCHAR(220),
  plan_date DATE,
  subject_slug VARCHAR(120),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_student_plan_events_user_time
  ON student_plan_events(user_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_student_plan_events_user_plan_date
  ON student_plan_events(user_id, plan_date, event_type);

CREATE TABLE IF NOT EXISTS student_plan_reschedules (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_key VARCHAR(220) NOT NULL,
  original_plan_date DATE NOT NULL,
  target_plan_date DATE NOT NULL,
  reason VARCHAR(80) NOT NULL DEFAULT 'adaptive_backlog',
  status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','completed','cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT student_plan_reschedules_unique_active
    UNIQUE (user_id, task_key, original_plan_date, target_plan_date)
);

CREATE INDEX IF NOT EXISTS idx_student_plan_reschedules_user_target
  ON student_plan_reschedules(user_id, target_plan_date, status);

-- Índices para os caminhos quentes do backlog/aderência.
CREATE INDEX IF NOT EXISTS idx_student_plan_progress_user_status_date
  ON student_plan_task_progress(user_id, status, plan_date DESC);

CREATE INDEX IF NOT EXISTS idx_student_plan_progress_pending
  ON student_plan_task_progress(user_id, plan_date DESC)
  WHERE status='pending';

COMMIT;
