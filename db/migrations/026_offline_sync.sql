BEGIN;

CREATE TABLE IF NOT EXISTS offline_sync_events (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id VARCHAR(180) NOT NULL,
  event_type VARCHAR(60) NOT NULL,
  device_id VARCHAR(180),
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, event_id)
);

CREATE INDEX IF NOT EXISTS offline_sync_events_user_date_idx
  ON offline_sync_events(user_id, processed_at DESC);

COMMIT;
