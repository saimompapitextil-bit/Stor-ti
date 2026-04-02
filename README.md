# STOR TI

App **Next.js 14** + **Prisma** + **PostgreSQL** ([Supabase](https://supabase.com/)). Deploy na [Vercel](https://vercel.com/).

## Requisitos

- Node.js 18.17+
- Projeto Supabase e repositório Git

## Configuração local

```bash
cp .env.example .env
# Edite DATABASE_URL com a URI Direct (5432) do Supabase
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) — redireciona para `/dashboard`.

## Vercel

1. Importe o repositório.
2. **Environment Variables:** `DATABASE_URL` (Production **e** Preview), URI Direct do Supabase, ex.:  
   `postgresql://postgres:SENHA@db.xxxxx.supabase.co:5432/postgres?sslmode=require`
3. Deploy. O comando de build roda `prisma generate && next build`.
4. Garanta que o schema existe no banco (`npx prisma db push` local contra o mesmo projeto).

**Importante:** use só `next.config.mjs` e `postcss.config.mjs` — o Next 14 da Vercel **não** aceita `next.config.ts`.

## Scripts

| Comando | Função |
|---------|--------|
| `npm run dev` | Desenvolvimento |
| `npm run build` | Build produção |
| `npm run db:push` | Aplicar schema no Postgres |
| `npm run db:seed` | Dados de exemplo |
| `npm run db:studio` | UI do Prisma |

## API

- `GET /api/health` — JSON `{ ok: true }` (sem banco).

## Modelo de dados

Categorias, produtos, unidades, armazéns, níveis de estoque, movimentações, fornecedores e ordens de compra — ver `prisma/schema.prisma`.
