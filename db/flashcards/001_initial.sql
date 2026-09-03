CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(120) NOT NULL UNIQUE,
  subject_slug VARCHAR(120) NOT NULL,
  subject_label VARCHAR(160) NOT NULL,
  title VARCHAR(220) NOT NULL,
  description TEXT,
  cards JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS decks_subject_idx
  ON decks(subject_slug, sort_order, title);

CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  deck_id UUID NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
  mode VARCHAR(20) NOT NULL CHECK(mode IN ('study','exam')),
  status VARCHAR(20) NOT NULL DEFAULT 'in_progress'
    CHECK(status IN ('in_progress','completed','abandoned')),
  answered_count INTEGER NOT NULL DEFAULT 0 CHECK(answered_count >= 0),
  correct_count INTEGER NOT NULL DEFAULT 0 CHECK(correct_count >= 0),
  wrong_count INTEGER NOT NULL DEFAULT 0 CHECK(wrong_count >= 0),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS study_sessions_user_deck_idx
  ON study_sessions(user_id, deck_id, started_at DESC);

CREATE TABLE IF NOT EXISTS answer_events (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID REFERENCES study_sessions(id) ON DELETE SET NULL,
  user_id UUID NOT NULL,
  deck_id UUID NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
  card_key VARCHAR(120) NOT NULL,
  is_correct BOOLEAN NOT NULL,
  response_time_ms INTEGER CHECK(response_time_ms IS NULL OR response_time_ms >= 0),
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS answer_events_user_deck_idx
  ON answer_events(user_id, deck_id, answered_at DESC);

CREATE INDEX IF NOT EXISTS answer_events_card_idx
  ON answer_events(user_id, deck_id, card_key, answered_at DESC);

CREATE TABLE IF NOT EXISTS card_progress (
  user_id UUID NOT NULL,
  deck_id UUID NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
  card_key VARCHAR(120) NOT NULL,
  correct_count INTEGER NOT NULL DEFAULT 0 CHECK(correct_count >= 0),
  wrong_count INTEGER NOT NULL DEFAULT 0 CHECK(wrong_count >= 0),
  difficult BOOLEAN NOT NULL DEFAULT FALSE,
  last_answer_correct BOOLEAN,
  last_seen_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(user_id, deck_id, card_key)
);

CREATE INDEX IF NOT EXISTS card_progress_review_idx
  ON card_progress(user_id, deck_id, difficult, last_answer_correct);
