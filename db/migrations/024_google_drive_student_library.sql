BEGIN;

CREATE TABLE IF NOT EXISTS google_drive_connections (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  access_token_enc TEXT,
  refresh_token_enc TEXT,
  token_expiry TIMESTAMPTZ,
  scope TEXT,
  connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_drive_files (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  drive_file_id TEXT NOT NULL,
  name VARCHAR(500) NOT NULL,
  mime_type VARCHAR(160) NOT NULL DEFAULT 'application/pdf',
  size_bytes BIGINT,
  modified_time TIMESTAMPTZ,
  web_view_link TEXT,
  icon_link TEXT,
  last_page INT NOT NULL DEFAULT 1 CHECK (last_page >= 1),
  progress_percent NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  last_opened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, drive_file_id)
);

CREATE INDEX IF NOT EXISTS idx_student_drive_files_user_updated
  ON student_drive_files(user_id, updated_at DESC);

COMMIT;
