-- SIMULADOS PSCPP — ativação do painel administrativo
-- Execute no Neon SQL Editor uma única vez.

CREATE INDEX IF NOT EXISTS users_created_at_idx ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS users_status_role_idx ON users(status, role);
CREATE INDEX IF NOT EXISTS audit_log_created_at_idx ON audit_log(created_at DESC);

UPDATE users
SET role = 'admin', updated_at = NOW()
WHERE LOWER(email) = LOWER('davi.lopes42@hotmail.com');

-- Conferência:
SELECT id, email, role, status, updated_at
FROM users
WHERE LOWER(email) = LOWER('davi.lopes42@hotmail.com');
