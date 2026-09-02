-- ============================================================
-- SIMULADOS PSCPP — PostgreSQL
-- @noconvescomdavi
-- Banco para contas, acesso vitalício, progresso, provas,
-- respostas individuais, sessões/auditoria e conquistas.
-- Não armazena nome, CPF, telefone ou endereço.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(320) NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student'
        CHECK (role IN ('student','admin')),
    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active','blocked','deleted')),
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_uidx ON users (LOWER(email));

CREATE TABLE IF NOT EXISTS user_access (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_code VARCHAR(80) NOT NULL DEFAULT 'pscpp-vitalicio',
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending','active','revoked','refunded')),
    lifetime BOOLEAN NOT NULL DEFAULT TRUE,
    payment_provider VARCHAR(40),
    payment_id VARCHAR(160),
    activated_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, product_code)
);
CREATE UNIQUE INDEX IF NOT EXISTS user_access_payment_uidx
    ON user_access(payment_provider,payment_id)
    WHERE payment_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS study_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(120) NOT NULL,
    percent SMALLINT NOT NULL DEFAULT 0 CHECK(percent BETWEEN 0 AND 100),
    completed_items INTEGER NOT NULL DEFAULT 0 CHECK(completed_items >= 0),
    total_items INTEGER NOT NULL DEFAULT 0 CHECK(total_items >= 0),
    studied_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, subject)
);

CREATE TABLE IF NOT EXISTS exam_attempts (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module VARCHAR(120) NOT NULL,
    subject VARCHAR(120) NOT NULL,
    score_percent NUMERIC(5,2) NOT NULL CHECK(score_percent BETWEEN 0 AND 100),
    correct_answers INTEGER NOT NULL DEFAULT 0 CHECK(correct_answers >= 0),
    wrong_answers INTEGER NOT NULL DEFAULT 0 CHECK(wrong_answers >= 0),
    total_questions INTEGER NOT NULL DEFAULT 0 CHECK(total_questions >= 0),
    duration_seconds INTEGER NOT NULL DEFAULT 0 CHECK(duration_seconds >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS question_answers (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    attempt_id BIGINT REFERENCES exam_attempts(id) ON DELETE CASCADE,
    question_id VARCHAR(120) NOT NULL,
    subject VARCHAR(120) NOT NULL,
    selected_answer TEXT,
    is_correct BOOLEAN NOT NULL,
    response_time_ms INTEGER CHECK(response_time_ms IS NULL OR response_time_ms >= 0),
    answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS question_answers_user_question_idx
    ON question_answers(user_id, question_id, answered_at DESC);

CREATE TABLE IF NOT EXISTS question_stats (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id VARCHAR(120) NOT NULL,
    subject VARCHAR(120) NOT NULL,
    answer_count INTEGER NOT NULL DEFAULT 0,
    correct_count INTEGER NOT NULL DEFAULT 0,
    error_count INTEGER NOT NULL DEFAULT 0,
    last_answered_at TIMESTAMPTZ,
    PRIMARY KEY(user_id, question_id)
);

CREATE TABLE IF NOT EXISTS achievements (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(80) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS user_achievements (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id BIGINT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY(user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS study_days (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    study_date DATE NOT NULL DEFAULT CURRENT_DATE,
    activity_count INTEGER NOT NULL DEFAULT 1 CHECK(activity_count > 0),
    PRIMARY KEY(user_id, study_date)
);

CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(80) NOT NULL,
    ip_hash VARCHAR(128),
    user_agent_hash VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS progress_user_idx ON study_progress(user_id);
CREATE INDEX IF NOT EXISTS attempts_user_date_idx ON exam_attempts(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS access_user_idx ON user_access(user_id,status);
CREATE INDEX IF NOT EXISTS study_days_user_idx ON study_days(user_id,study_date DESC);

INSERT INTO achievements(code,name,description,icon) VALUES
('FIRST_EXAM','Primeiro embarque','Concluir o primeiro simulado','⚓'),
('ACCURACY_80','Precisão','Obter 80% ou mais em um simulado','🎯'),
('ACCURACY_90','Alta precisão','Obter 90% ou mais em um simulado','🏹'),
('PERFECT_EXAM','Prova perfeita','Obter 100% em um simulado','💯'),
('SEVEN_DAYS','Consistência','Registrar atividade em sete dias diferentes','🔥'),
('THOUSAND_QUESTIONS','Mil questões','Responder 1.000 questões','🧭'),
('COMPLETE_COURSE','Rota completa','Concluir 100% das sete disciplinas','🏆')
ON CONFLICT(code) DO NOTHING;

-- Exemplo para ativação manual enquanto o gateway não estiver conectado:
-- UPDATE user_access
-- SET status='active', lifetime=TRUE, activated_at=NOW()
-- WHERE user_id=(SELECT id FROM users WHERE LOWER(email)=LOWER('aluno@email.com'))
--   AND product_code='pscpp-vitalicio';

-- Exemplo para consultar alunos e licenças:
-- SELECT u.id,u.email,u.created_at,a.status,a.lifetime,a.activated_at
-- FROM users u
-- LEFT JOIN user_access a ON a.user_id=u.id
-- ORDER BY u.created_at DESC;
