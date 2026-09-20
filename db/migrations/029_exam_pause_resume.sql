ALTER TABLE exam_sessions
  ADD COLUMN IF NOT EXISTS paused_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS remaining_seconds INTEGER;

ALTER TABLE exam_sessions DROP CONSTRAINT IF EXISTS exam_sessions_status_check;
ALTER TABLE exam_sessions
  ADD CONSTRAINT exam_sessions_status_check
  CHECK (status IN ('in_progress','paused','completed','expired','abandoned'));

DROP INDEX IF EXISTS exam_sessions_one_active_uidx;
CREATE UNIQUE INDEX exam_sessions_one_active_uidx
  ON exam_sessions(user_id,subject)
  WHERE status IN ('in_progress','paused');

ALTER TABLE exam_sessions DROP CONSTRAINT IF EXISTS exam_sessions_remaining_seconds_check;
ALTER TABLE exam_sessions
  ADD CONSTRAINT exam_sessions_remaining_seconds_check
  CHECK (remaining_seconds IS NULL OR remaining_seconds BETWEEN 0 AND 14400);
