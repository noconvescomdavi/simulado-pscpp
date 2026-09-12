CREATE TABLE IF NOT EXISTS platform_settings (
  setting_key TEXT PRIMARY KEY,
  setting_value TEXT NOT NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO platform_settings(setting_key,setting_value)
VALUES
  ('subscription_price_cents','259900'),
  ('contramestre_price_cents','10000')
ON CONFLICT(setting_key) DO NOTHING;
