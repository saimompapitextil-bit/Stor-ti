import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [products, warehouses, lowStock] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.warehouse.count({ where: { active: true } }),
    prisma.stockLevel.findMany({
      where: { minStock: { gt: 0 } },
      include: { product: true, warehouse: true },
    }),
  ]);

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
