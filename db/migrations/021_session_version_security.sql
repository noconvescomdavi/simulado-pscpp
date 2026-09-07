BEGIN;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS session_version integer NOT NULL DEFAULT 1;

UPDATE users
SET session_version = 1
WHERE session_version IS NULL OR session_version < 1;

ALTER TABLE users
  ADD CONSTRAINT users_session_version_positive
  CHECK (session_version >= 1);

COMMIT;
