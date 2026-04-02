# STOR — Gestão de estoque

Next.js 14 + Prisma + PostgreSQL ([Supabase](https://supabase.com/)). Deploy recomendado na [Vercel](https://vercel.com/).

## Pré-requisitos

- Node.js 20+
- Conta no GitHub, Supabase e Vercel

## 1. Supabase

1. Crie um projeto em [Supabase Dashboard](https://supabase.com/dashboard).
2. Vá em **Project Settings → Database** e copie as strings de conexão.
3. Para este projeto, use de preferência a **Direct connection** (porta **5432**, host `db.<ref>.supabase.co`) como `DATABASE_URL` — evita erros com Prisma e com `db push`. Inclua `?sslmode=require` se necessário.
4. Pooler na porta **6543** é opcional em tráfego alto; exige parâmetros como `pgbouncer=true` e `connection_limit=1` (veja [documentação Supabase + Prisma](https://supabase.com/docs/guides/database/prisma)).

Variável (local e Vercel):

| Variável        | Uso |
|-----------------|-----|
| `DATABASE_URL`  | App + `prisma db push` (ideal: URI direta 5432). |

Exemplos estão em `.env.example`. **Não commite** o arquivo `.env`.

No seu PC, após configurar `.env`:

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

## 2. GitHub

Se ainda não definiu identidade no Git (necessário para commits):

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
```

Se o repositório ainda não existir:

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
# Com DATABASE_URL apontando para o mesmo projeto Supabase
npx prisma db push
npm run db:seed
```

### Erro “Application error” / Digest na Vercel

- Confirme **`DATABASE_URL`** nas variáveis de ambiente e faça **Redeploy**.
- Garanta que o schema existe no banco: `npx prisma db push` (local, com a mesma URL).
- Painel (`/dashboard`) passa a exibir mensagens mais claras se o banco ou a configuração falharem.

Isso pode ser feito localmente (com `.env` do Supabase) ou via CI. Alternativa: adicione um script de release ou execute `db push` manualmente antes de confiar no tráfego de produção.

## Scripts úteis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Desenvolvimento |
| `npm run build` | Build de produção |
| `npx prisma studio` | UI do banco |

## Licença

Uso interno / defina conforme sua organização.
