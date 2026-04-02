# STOR — Gestão de estoque

Next.js 14 + Prisma + PostgreSQL ([Supabase](https://supabase.com/)). Deploy recomendado na [Vercel](https://vercel.com/).

## Pré-requisitos

- Node.js 20+
- Conta no GitHub, Supabase e Vercel

## 1. Supabase

1. Crie um projeto em [Supabase Dashboard](https://supabase.com/dashboard).
2. Vá em **Project Settings → Database** e copie as strings de conexão.
3. No modo **Transaction pooling** (recomendado para serverless), use a URI na porta **6543** com `pgbouncer=true`.
4. Para migrações Prisma (`db push` / `migrate`), use conexão **direta** na porta **5432** (host `db.<project-ref>.supabase.co` ou “Session mode”, conforme o painel).

Variáveis (local e Vercel):

| Variável       | Uso |
|----------------|-----|
| `DATABASE_URL` | App em runtime (ideal: pooler Supabase). |
| `DIRECT_URL`   | Migrações Prisma (sessão direta 5432). |

Exemplos estão em `.env.example`. **Não commite** o arquivo `.env`.

No seu PC, após configurar `.env`:

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

## 2. GitHub

```bash
git init
git add .
git commit -m "chore: projeto STOR com Supabase"
```

Crie um repositório vazio no GitHub (**sem** README inicial, se for o primeiro push) e conecte:

```bash
git remote add origin https://github.com/SEU_USUARIO/stor.git
git branch -M main
git push -u origin main
```

Substitua `SEU_USUARIO/stor` pelo seu usuário e nome do repo.

## 3. Vercel

1. Em [vercel.com/new](https://vercel.com/new), importe o repositório do GitHub.
2. **Framework Preset:** Next.js (detectado automaticamente).
3. Em **Environment Variables**, adicione:
   - `DATABASE_URL` — string do pooler (ou a mesma da direta em testes).
   - `DIRECT_URL` — string direta 5432 (obrigatória para `prisma db push` no build se você rodar migrações no deploy).
4. Faça o deploy.

O `package.json` já executa `prisma generate` no `postinstall`. O build usa `next build`.

### Primeiro deploy após criar o banco

Se o schema ainda não existir no Supabase, rode **uma vez** contra o Postgres do projeto:

```bash
# Com DIRECT_URL e DATABASE_URL apontando para o mesmo projeto Supabase
npx prisma db push
npm run db:seed
```

Isso pode ser feito localmente (com `.env` do Supabase) ou via CI. Alternativa: adicione um script de release ou execute `db push` manualmente antes de confiar no tráfego de produção.

## Scripts úteis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Desenvolvimento |
| `npm run build` | Build de produção |
| `npx prisma studio` | UI do banco |

## Licença

Uso interno / defina conforme sua organização.
