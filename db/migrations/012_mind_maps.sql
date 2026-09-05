BEGIN;

CREATE TABLE IF NOT EXISTS mind_maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(180) NOT NULL,
  subject_slug VARCHAR(120),
  description TEXT NOT NULL DEFAULT '',
  canvas JSONB NOT NULL DEFAULT '{"nodes":[],"edges":[],"viewport":{"x":0,"y":0,"zoom":1}}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mind_maps_user_updated
  ON mind_maps(user_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS mind_map_flashcards (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mind_map_id UUID NOT NULL REFERENCES mind_maps(id) ON DELETE CASCADE,
  node_id VARCHAR(120) NOT NULL,
  subject_slug VARCHAR(120),
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, mind_map_id, node_id)
);

CREATE INDEX IF NOT EXISTS idx_mind_map_flashcards_user
  ON mind_map_flashcards(user_id, updated_at DESC);

COMMIT;
