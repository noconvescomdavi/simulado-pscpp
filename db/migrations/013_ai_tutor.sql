BEGIN;
ALTER TABLE payment_orders ADD COLUMN IF NOT EXISTS product_code VARCHAR(80);
CREATE INDEX IF NOT EXISTS idx_payment_orders_product ON payment_orders(user_id,product_code,created_at DESC);

CREATE TABLE IF NOT EXISTS ai_tutor_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(180) NOT NULL DEFAULT 'Nova conversa',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ai_tutor_conversations_user ON ai_tutor_conversations(user_id,updated_at DESC);

CREATE TABLE IF NOT EXISTS ai_tutor_messages (
  id BIGSERIAL PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES ai_tutor_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(16) NOT NULL CHECK(role IN ('user','assistant')),
  content TEXT NOT NULL,
  input_tokens INT,
  output_tokens INT,
  model VARCHAR(80),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ai_tutor_messages_conversation ON ai_tutor_messages(conversation_id,id);

CREATE TABLE IF NOT EXISTS ai_tutor_daily_usage (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  questions INT NOT NULL DEFAULT 0,
  input_tokens BIGINT NOT NULL DEFAULT 0,
  output_tokens BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY(user_id,usage_date)
);
COMMIT;