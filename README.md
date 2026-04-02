# STOR TI

Front (Next.js + Tailwind + Lucide) + **PostgreSQL** via **Prisma**.

## Banco de dados

1. Crie um projeto no [Supabase](https://supabase.com/) ou use Postgres local.
2. Copie `.env.example` → `.env` e ajuste `DATABASE_URL`.
3. Aplique o schema e (opcional) dados de exemplo:

```bash
npm install
npx prisma db push
npm run db:seed
```

## Desenvolvimento

```bash
npm run dev
```

- **`/estoque`** — painel com KPIs, tabela, filtros, cadastro de produto, entrada/saída rápida e histórico de movimentações.
- Sem `DATABASE_URL`, a página de estoque mostra instruções de configuração.

## Deploy (Vercel)

- Variável **`DATABASE_URL`** (Production e Preview).
- Build: `prisma generate` roda no `postinstall` e no `build`.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run db:push` | Sincroniza tabelas com `schema.prisma` |
| `npm run db:seed` | Popula categorias, unidades, armazéns e produtos de teste |
| `npm run db:studio` | Interface visual do Prisma |

## Modelo (resumo)

- **Category**, **UnitOfMeasure**, **Warehouse**, **Product**, **StockLevel** (produto + armazém + qtd + mín/máx + local).
- **StockMovement** + **StockMovementLine** — histórico (entrada / saída / ajuste).

Server Actions em `src/actions/estoque.ts`; regras de movimentação em `src/lib/stock.ts`.
