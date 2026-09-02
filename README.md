# SIMULADOS PSCPP — Next.js + PostgreSQL

Versão sem Supabase. A autenticação é própria e o banco é PostgreSQL.

## Componentes
- Next.js / Vercel
- PostgreSQL (recomendado: Neon conectado à Vercel)
- `pg` para acesso ao banco
- Argon2id para hash de senhas
- JWT em cookie HttpOnly/Secure/SameSite
- Gateway de pagamento: preparado para ser adicionado depois
- Conteúdo anterior preservado em `public/study-content/`

## 1. Banco
Crie um PostgreSQL e execute:
`db/schema.sql`

Na Vercel, adicione:
`DATABASE_URL`

## 2. Chave da sessão
Crie `AUTH_SECRET` com uma string aleatória longa e salve somente nas Environment Variables da Vercel.

## 3. Desenvolvimento local
Copie `.env.example` para `.env.local` e preencha as variáveis.

```cmd
npm install
npm run dev
```

## 4. Produção
Depois de subir no GitHub, a Vercel detecta Next.js e executa `npm install` + `npm run build`.

## 5. Ativar aluno manualmente durante a fase sem gateway
```sql
UPDATE user_access
SET status='active', lifetime=TRUE, activated_at=NOW()
WHERE user_id=(
  SELECT id FROM users WHERE LOWER(email)=LOWER('aluno@email.com')
)
AND product_code='pscpp-vitalicio';
```

## Segurança
- Nunca envie `.env`, `DATABASE_URL` ou `AUTH_SECRET` ao GitHub.
- Senhas são armazenadas como Argon2id.
- Cookie de sessão é HttpOnly e Secure em produção.
- A API usa queries parametrizadas.
- O gateway futuro deve ativar a licença exclusivamente após confirmação server-to-server.

## Observação importante sobre o conteúdo legado
O portal valida login/licença no servidor antes de mostrar a central de estudos. Entretanto, os módulos RIPEAM/CIS e páginas antigas preservadas em `public/study-content/` continuam sendo arquivos estáticos. Para proteção comercial forte, migre gradualmente esse conteúdo para componentes/rotas Next.js protegidas, em vez de mantê-lo em `/public`.

## Git
```cmd
cd /d "C:\simulado-pscpp"
git add .
git commit -m "Migra plataforma PSCPP para Next.js e PostgreSQL"
git push origin main
```
