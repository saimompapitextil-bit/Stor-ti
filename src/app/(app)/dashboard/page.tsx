import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { Prisma as PrismaRuntime } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";

type StockWithRelations = Prisma.StockLevelGetPayload<{
  include: { product: true; warehouse: true };
}>;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isInitError(err: unknown): boolean {
  return (
    err instanceof PrismaRuntime.PrismaClientInitializationError ||
    (err instanceof Error && err.name === "PrismaClientInitializationError")
  );
}

function isKnownRequest(err: unknown): err is PrismaRuntime.PrismaClientKnownRequestError {
  return err instanceof PrismaRuntime.PrismaClientKnownRequestError;
}

function SetupCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-amber-500/40 bg-amber-950/30 p-6">
      <h1 className="text-xl font-semibold text-amber-200">{title}</h1>
      <div className="mt-4 space-y-3 text-sm text-slate-300">{children}</div>
    </div>
  );
}

export default async function DashboardPage() {
  if (!process.env.DATABASE_URL?.trim()) {
    return (
      <SetupCard title="Variável DATABASE_URL ausente">
        <p>
          Configure <code className="rounded bg-stor-900 px-1 py-0.5 text-stor-accent">DATABASE_URL</code> na Vercel
          em <strong>Settings → Environment Variables</strong> para <strong>Production</strong>{" "}
          <em>e</em> <strong>Preview</strong> (se usar branch/PR). Inclua{" "}
          <code className="rounded bg-stor-900 px-0.5">?sslmode=require</code> se o Supabase indicar.
        </p>
        <p>Depois: <strong>Deployments → … → Redeploy</strong>.</p>
      </SetupCard>
    );
  }

  let products: number;
  let warehouses: number;
  let lowStock: StockWithRelations[];

  try {
    const prisma = getPrisma();
    [products, warehouses, lowStock] = await Promise.all([
      prisma.product.count({ where: { active: true } }),
      prisma.warehouse.count({ where: { active: true } }),
      prisma.stockLevel.findMany({
        where: { minStock: { gt: 0 } },
        include: { product: true, warehouse: true },
      }),
    ]);
  } catch (err: unknown) {
    let hint =
      "Na Vercel: projeto → último Deployment → Logs (Functions). Procure pela mensagem após o Digest.";

    if (isInitError(err)) {
      hint =
        "Não foi possível conectar ao Postgres. Confira DATABASE_URL (host db.xxx.supabase.co, porta 5432, senha sem caracteres mal escapados na URI). Use a string «URI» do Supabase; em geral acrescente ?sslmode=require.";
    } else if (isKnownRequest(err)) {
      if (err.code === "P2021" || err.code === "P2010" || err.message.includes("does not exist")) {
        hint =
          "Tabelas ainda não criadas. No PC: exporte DATABASE_URL igual à Vercel e rode: npx prisma db push && npm run db:seed";
      }
    }

    const detail = err instanceof Error ? err.message : String(err);

    return (
      <SetupCard title="Erro ao acessar o banco de dados">
        <p className="text-slate-400">{hint}</p>
        <p className="rounded-lg border border-stor-800 bg-stor-900/80 p-3 font-mono text-xs text-slate-500 break-all">
          {detail}
        </p>
        <p>
          <Link href="https://supabase.com/dashboard" className="text-stor-accent hover:underline">
            Abrir Supabase
          </Link>
        </p>
      </SetupCard>
    );
  }

  const alerts = lowStock.filter((s) => s.quantity <= s.minStock).slice(0, 8);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Painel</h1>
        <p className="mt-1 text-sm text-slate-400">Visão geral do estoque — STOR</p>
      </div>

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
          <p className="text-sm text-slate-400">Alertas (abaixo do mínimo)</p>
          <p className="mt-2 text-3xl font-semibold text-amber-400">{alerts.length}</p>
        </div>
      </div>

      <div className="rounded-xl border border-stor-700 bg-stor-900/40 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-white">Itens em atenção</h2>
          <Link href="/estoque" className="text-sm text-stor-accent hover:underline">
            Ver estoque
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
      </div>
    </div>
  );
}
