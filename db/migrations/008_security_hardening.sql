BEGIN;

CREATE TABLE IF NOT EXISTS auth_rate_limits (
  action VARCHAR(40) NOT NULL,
  key_hash VARCHAR(128) NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  window_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (action, key_hash)
);

CREATE INDEX IF NOT EXISTS auth_rate_limits_updated_idx
  ON auth_rate_limits(updated_at);

COMMIT;
