-- SIMULADOS PSCPP — Painel administrativo
-- A estrutura inicial já suporta role='admin'.
-- Esta migração adiciona apenas índices úteis para o painel.

CREATE INDEX IF NOT EXISTS users_created_at_idx ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS users_status_role_idx ON users(status, role);
CREATE INDEX IF NOT EXISTS audit_log_created_at_idx ON audit_log(created_at DESC);

-- Para transformar a sua conta em administradora, execute uma única vez:
-- UPDATE users
-- SET role='admin', updated_at=NOW()
-- WHERE LOWER(email)=LOWER('SEU_EMAIL_AQUI');
