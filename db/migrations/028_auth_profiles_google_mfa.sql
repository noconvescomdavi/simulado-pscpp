BEGIN;

ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS student_mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(30) NOT NULL DEFAULT 'password';

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(180) NOT NULL,
  cpf_hash VARCHAR(128) UNIQUE,
  cpf_enc TEXT,
  phone_enc TEXT,
  phone_last4 VARCHAR(4),
  postal_code VARCHAR(12),
  address_enc TEXT,
  maritime_role VARCHAR(80),
  experience_level VARCHAR(40),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS oauth_identities (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(30) NOT NULL,
  provider_subject VARCHAR(255) NOT NULL,
  provider_email VARCHAR(320),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(provider,provider_subject)
);
CREATE INDEX IF NOT EXISTS oauth_identities_user_idx ON oauth_identities(user_id);

CREATE TABLE IF NOT EXISTS student_mfa_secrets (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  secret_enc TEXT NOT NULL,
  enabled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_mfa_recovery_codes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code_hash VARCHAR(64) NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id,code_hash)
);

COMMIT;
