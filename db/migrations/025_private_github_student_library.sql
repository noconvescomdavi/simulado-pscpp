BEGIN;

CREATE TABLE IF NOT EXISTS student_library_files (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(40) NOT NULL DEFAULT 'github',
  repository_owner VARCHAR(180) NOT NULL,
  repository_name VARCHAR(180) NOT NULL,
  repository_path TEXT NOT NULL,
  github_sha VARCHAR(80),
  name VARCHAR(500) NOT NULL,
  mime_type VARCHAR(160) NOT NULL DEFAULT 'application/pdf',
  size_bytes BIGINT,
  last_page INT NOT NULL DEFAULT 1 CHECK (last_page >= 1),
  progress_percent NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  last_opened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, repository_owner, repository_name, repository_path)
);

CREATE INDEX IF NOT EXISTS idx_student_library_files_user_updated
  ON student_library_files(user_id, updated_at DESC);

COMMIT;
