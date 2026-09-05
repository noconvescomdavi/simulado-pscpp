BEGIN;

ALTER TABLE student_bibliography_progress
  ADD COLUMN IF NOT EXISTS completed_ranges JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS current_page INT,
  ADD COLUMN IF NOT EXISTS pages_completed INT NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS study_bibliography_catalog (
  id BIGSERIAL PRIMARY KEY,
  subject_slug VARCHAR(120) NOT NULL,
  bibliography_key VARCHAR(180) NOT NULL,
  publication_title TEXT NOT NULL,
  edition VARCHAR(120),
  source TEXT,
  section_key VARCHAR(180) NOT NULL,
  section_label TEXT NOT NULL,
  chapter_label TEXT,
  page_start INT,
  page_end INT,
  required BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INT NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(bibliography_key,section_key)
);

CREATE INDEX IF NOT EXISTS idx_study_bibliography_catalog_subject
  ON study_bibliography_catalog(subject_slug,required,display_order);

COMMIT;
