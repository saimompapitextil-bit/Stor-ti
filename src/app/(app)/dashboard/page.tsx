import type { ReactNode } from "react";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { Prisma as PrismaNS } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type StockRow = Prisma.StockLevelGetPayload<{
  include: { product: true; warehouse: true };
}>;

function Card({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-6">
      <h1 className="text-xl font-semibold text-amber-200">{title}</h1>
      <div className="mt-4 space-y-3 text-sm text-slate-300">{children}</div>
    </div>
  );
}

function isInitError(e: unknown): boolean {
  return (
    e instanceof PrismaNS.PrismaClientInitializationError ||
    (e instanceof Error && e.name === "PrismaClientInitializationError")
  );
}

function isKnown(e: unknown): e is PrismaNS.PrismaClientKnownRequestError {
  return e instanceof PrismaNS.PrismaClientKnownRequestError;
}

export default async function DashboardPage() {
  const dbUrl = process.env.DATABASE_URL?.trim();
  if (!dbUrl) {
    return (
      <Card title="DATABASE_URL ausente">
        <p>
          Em <strong>Vercel → Settings → Environment Variables</strong>, defina <code>DATABASE_URL</code>{" "}
          para <strong>Production</strong> e <strong>Preview</strong>. Use a URI <em>Direct</em> do Supabase
          (porta 5432), de preferência com <code>?sslmode=require</code>.
        </p>
        <p>Salve e faça <strong>Redeploy</strong>.</p>
      </Card>
    );
  }

  let products: number;
  let warehouses: number;
  let stockRows: StockRow[];

  try {
    const prisma = getPrisma();
    [products, warehouses, stockRows] = await Promise.all([
      prisma.product.count({ where: { active: true } }),
      prisma.warehouse.count({ where: { active: true } }),
      prisma.stockLevel.findMany({
        where: { minStock: { gt: 0 } },
        include: { product: true, warehouse: true },
      }),
    ]);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);

    let hint: ReactNode = (
      <p className="text-slate-400">
        Abra o deployment na Vercel → guia <strong className="text-slate-300">Logs</strong> (Functions) para
        ver o stack trace completo.
      </p>
    );

    if (isInitError(err)) {
      hint = (
        <p className="text-slate-400">
          Falha de conexão com o Postgres. Revise usuário, senha, host (
          <code className="text-stor-muted">db.xxx.supabase.co</code>) e{" "}
          <code className="text-stor-muted">?sslmode=require</code> na URI.
        </p>
      );
    } else if (isKnown(err)) {
      if (err.code === "P2021" || err.code === "P2010" || err.message.includes("does not exist")) {
        hint = (
          <p className="text-slate-400">
            Tabelas não existem. Localmente, com a mesma{" "}
            <code className="text-stor-muted">DATABASE_URL</code>: rode{" "}
            <code className="text-stor-muted">npx prisma db push</code> e{" "}
            <code className="text-stor-muted">npm run db:seed</code>.
          </p>
        );
      }
    }

    return (
      <Card title="Erro ao acessar o banco">
        {hint}
        <pre className="whitespace-pre-wrap break-all rounded-lg border border-stor-800 bg-stor-900/80 p-3 font-mono text-xs text-slate-500">
          {msg}
        </pre>
        <Link className="inline-block text-stor-accent hover:underline" href="https://supabase.com/dashboard">
          Abrir Supabase
        </Link>
      </Card>
    );
  }

  const alerts = stockRows.filter((s) => s.quantity <= s.minStock).slice(0, 10);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-white">Painel</h1>
        <p className="mt-1 text-sm text-slate-400">Resumo do estoque</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-stor-700 bg-stor-900/60 p-5">
          <p className="text-sm text-slate-400">Produtos ativos</p>
          <p className="mt-2 text-3xl font-semibold text-stor-accent">{products}</p>
        </div>
        <div className="rounded-xl border border-stor-700 bg-stor-900/60 p-5">
          <p className="text-sm text-slate-400">Armazéns ativos</p>
          <p className="mt-2 text-3xl font-semibold text-stor-accent">{warehouses}</p>
        </div>
        <div className="rounded-xl border border-stor-700 bg-stor-900/60 p-5 sm:col-span-2 lg:col-span-1">
          <p className="text-sm text-slate-400">Itens abaixo do mínimo</p>
          <p className="mt-2 text-3xl font-semibold text-amber-400">{alerts.length}</p>
        </div>
      </div>

      <section className="rounded-xl border border-stor-700 bg-stor-900/40 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-white">Alertas</h2>
          <Link href="/estoque" className="text-sm text-stor-accent hover:underline">
            Estoque
          </Link>
        </div>
        {alerts.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhum item abaixo do estoque mínimo.</p>
        ) : (
          <ul className="divide-y divide-stor-800">
            {alerts.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <span className="text-slate-200">
                  {s.product.sku} — {s.product.name}
                </span>
                <span className="text-slate-500">
                  {s.warehouse.code}: {s.quantity} / mín. {s.minStock}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
