BEGIN;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS admin_mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS admin_mfa_secrets (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  secret_enc TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  enabled_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS admin_mfa_recovery_codes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code_hash VARCHAR(64) NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, code_hash)
);
CREATE INDEX IF NOT EXISTS admin_mfa_recovery_codes_user_idx
  ON admin_mfa_recovery_codes(user_id, used_at);

CREATE TABLE IF NOT EXISTS admin_access_control (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  is_superadmin BOOLEAN NOT NULL DEFAULT FALSE,
  permissions TEXT[] NOT NULL DEFAULT '{}'::text[],
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO admin_access_control(user_id,is_superadmin)
SELECT id,TRUE FROM users WHERE role='admin'
ON CONFLICT(user_id) DO NOTHING;

CREATE TABLE IF NOT EXISTS app_performance_events (
  id BIGSERIAL PRIMARY KEY,
  metric_name VARCHAR(32) NOT NULL,
  metric_value DOUBLE PRECISION NOT NULL,
  rating VARCHAR(24),
  route VARCHAR(500),
  navigation_type VARCHAR(50),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS app_performance_events_metric_date_idx
  ON app_performance_events(metric_name, created_at DESC);

COMMIT;
