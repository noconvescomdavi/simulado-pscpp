BEGIN;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS session_version integer NOT NULL DEFAULT 1;

UPDATE users
SET session_version = 1
WHERE session_version IS NULL OR session_version < 1;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'users_session_version_positive'
      AND conrelid = 'users'::regclass
  ) THEN
    ALTER TABLE users
      ADD CONSTRAINT users_session_version_positive
      CHECK (session_version >= 1);
  END IF;
END $$;

COMMIT;
