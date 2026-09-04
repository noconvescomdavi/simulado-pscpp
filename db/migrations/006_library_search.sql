-- 006_library_search.sql
BEGIN;

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE TABLE IF NOT EXISTS library_documents (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  authors TEXT[] NOT NULL DEFAULT '{}',
  edition TEXT,
  publisher TEXT,
  publication_year INT,
  isbn TEXT,
  language TEXT NOT NULL DEFAULT 'und',
  document_type TEXT NOT NULL DEFAULT 'book',
  file_name TEXT NOT NULL,
  storage_path TEXT,
  sha256 TEXT NOT NULL UNIQUE,
  page_count INT,
  rights_note TEXT,
  metadata_status TEXT NOT NULL DEFAULT 'auto',
  metadata_confidence JSONB NOT NULL DEFAULT '{}'::jsonb,
  metadata_source JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  imported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS library_document_subjects (
  document_id BIGINT NOT NULL REFERENCES library_documents(id) ON DELETE CASCADE,
  subject_slug TEXT NOT NULL,
  PRIMARY KEY(document_id,subject_slug)
);

CREATE TABLE IF NOT EXISTS library_pages (
  id BIGSERIAL PRIMARY KEY,
  document_id BIGINT NOT NULL REFERENCES library_documents(id) ON DELETE CASCADE,
  page_number INT NOT NULL,
  printed_page TEXT,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(document_id,page_number)
);

CREATE TABLE IF NOT EXISTS library_chunks (
  id BIGSERIAL PRIMARY KEY,
  document_id BIGINT NOT NULL REFERENCES library_documents(id) ON DELETE CASCADE,
  page_start INT NOT NULL,
  page_end INT NOT NULL,
  chunk_index INT NOT NULL,
  heading TEXT,
  language TEXT NOT NULL DEFAULT 'und',
  content TEXT NOT NULL,
  char_count INT NOT NULL DEFAULT 0,
  search_pt TSVECTOR,
  search_en TSVECTOR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(document_id,chunk_index)
);

CREATE INDEX IF NOT EXISTS idx_library_chunks_search_pt ON library_chunks USING GIN(search_pt);
CREATE INDEX IF NOT EXISTS idx_library_chunks_search_en ON library_chunks USING GIN(search_en);
CREATE INDEX IF NOT EXISTS idx_library_chunks_content_trgm ON library_chunks USING GIN(content gin_trgm_ops);

CREATE TABLE IF NOT EXISTS library_glossary (
  id BIGSERIAL PRIMARY KEY,
  term_pt TEXT,
  term_en TEXT,
  aliases TEXT[] NOT NULL DEFAULT '{}',
  definition_pt TEXT,
  definition_en TEXT,
  subject_slug TEXT,
  source_chunk_id BIGINT REFERENCES library_chunks(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS syllabus_topics (
  id BIGSERIAL PRIMARY KEY,
  subject_slug TEXT NOT NULL,
  topic_code TEXT NOT NULL,
  title_pt TEXT NOT NULL,
  title_en TEXT,
  parent_code TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE(subject_slug,topic_code)
);

CREATE TABLE IF NOT EXISTS syllabus_topic_sources (
  id BIGSERIAL PRIMARY KEY,
  topic_id BIGINT NOT NULL REFERENCES syllabus_topics(id) ON DELETE CASCADE,
  chunk_id BIGINT NOT NULL REFERENCES library_chunks(id) ON DELETE CASCADE,
  relevance SMALLINT NOT NULL DEFAULT 100 CHECK(relevance BETWEEN 0 AND 100),
  note_pt TEXT,
  note_en TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  reviewed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(topic_id,chunk_id)
);

CREATE OR REPLACE FUNCTION library_chunks_set_search_vectors()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_pt := to_tsvector('portuguese', unaccent(COALESCE(NEW.heading,'') || ' ' || COALESCE(NEW.content,'')));
  NEW.search_en := to_tsvector('english', unaccent(COALESCE(NEW.heading,'') || ' ' || COALESCE(NEW.content,'')));
  NEW.char_count := char_length(COALESCE(NEW.content,''));
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_library_chunks_search_vectors ON library_chunks;
CREATE TRIGGER trg_library_chunks_search_vectors
BEFORE INSERT OR UPDATE OF heading,content ON library_chunks
FOR EACH ROW EXECUTE FUNCTION library_chunks_set_search_vectors();

COMMIT;
