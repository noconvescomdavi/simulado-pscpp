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

## Banco de questões de Manobrabilidade

O catálogo das questões fica em `data/questions/manobrabilidade.json`, fora da pasta pública. A rota protegida `/api/questions/manobrabilidade` somente entrega o conteúdo para usuário autenticado e com licença ativa.

Para importar ou substituir o banco, coloque `banco_300_questoes_manobrabilidade.json` em Downloads e execute, na raiz do projeto:

```cmd
IMPORTAR-MANOBRABILIDADE.cmd
```

Também é possível informar outro caminho:

```cmd
IMPORTAR-MANOBRABILIDADE.cmd "D:\Bancos\manobrabilidade.json"
```

O importador valida quantidade, IDs, alternativas, gabarito, comentários e fontes antes de gravar o arquivo utilizado pela plataforma. Ao final, ele executa o build de produção.

## Prova interativa e métricas

O simulado de Manobrabilidade utiliza duas etapas por questão: o aluno seleciona uma alternativa e clica em **Salvar resposta**. Somente após o servidor registrar e corrigir a resposta são exibidos o gabarito, o comentário e a fonte. Em seguida, o botão **Próxima questão** é liberado.

As respostas alimentam as tabelas existentes `question_answers` e `question_stats`. Ao encerrar a prova, o resumo é registrado em `exam_attempts`. Não é necessária nova migração SQL.

A Área do Aluno apresenta:

- provas realizadas, questões, acertos, erros e aproveitamento na soma das matérias;
- as mesmas estatísticas para cada uma das sete disciplinas;
- melhor nota por disciplina;
- tópicos com maior recorrência e percentual de erros;
- ranking geral de conteúdos prioritários para revisão.

A API foi preparada para bancos de outras matérias. Cada novo banco deve ser registrado em `lib/question-banks.js`; as métricas passam a agrupá-lo automaticamente pela disciplina, módulo e tópico.

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

## Painel administrativo

Rota: `/admin`

O painel valida a sessão e confirma no PostgreSQL que o usuário possui `role='admin'` e `status='active'`. Operações de ativação/revogação de licença e bloqueio/desbloqueio de conta também são validadas no servidor.

Para ativar o primeiro administrador, execute `ATIVAR-PAINEL-ADMIN.sql` no Neon SQL Editor. Depois acesse `/admin` ou use o botão `Admin` exibido na Área do Aluno.

Recursos atuais do painel:
- indicadores de alunos, licenças ativas, pendentes e contas bloqueadas;
- pesquisa por e-mail;
- situação da conta e da licença;
- data de cadastro, último login e ativação;
- número de simulados, questões respondidas, média e progresso;
- ativação e revogação de licença;
- bloqueio e desbloqueio de conta;
- registro das ações administrativas em `audit_log`.
