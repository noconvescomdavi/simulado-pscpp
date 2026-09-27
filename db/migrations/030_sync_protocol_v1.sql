BEGIN;

CREATE TABLE IF NOT EXISTS sync_entity_versions (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entity_type VARCHAR(80) NOT NULL,
  entity_id VARCHAR(180) NOT NULL,
  version BIGINT NOT NULL DEFAULT 0,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(user_id,entity_type,entity_id)
);
CREATE INDEX IF NOT EXISTS sync_entity_versions_user_updated_idx ON sync_entity_versions(user_id,updated_at DESC);

CREATE TABLE IF NOT EXISTS sync_change_log (
  seq BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entity_type VARCHAR(80) NOT NULL,
  entity_id VARCHAR(180) NOT NULL,
  version BIGINT NOT NULL,
  operation VARCHAR(20) NOT NULL DEFAULT 'upsert',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS sync_change_log_user_seq_idx ON sync_change_log(user_id,seq);

ALTER TABLE offline_sync_events ADD COLUMN IF NOT EXISTS result JSONB;
ALTER TABLE offline_sync_events ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

COMMIT;
