BEGIN;

CREATE TABLE IF NOT EXISTS product_events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_name VARCHAR(80) NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_product_events_name_date ON product_events(event_name,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_events_user_date ON product_events(user_id,created_at DESC);

CREATE TABLE IF NOT EXISTS app_error_events (
  id BIGSERIAL PRIMARY KEY,
  route TEXT,
  error_code TEXT,
  message TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_app_error_events_date ON app_error_events(created_at DESC);

COMMIT;
