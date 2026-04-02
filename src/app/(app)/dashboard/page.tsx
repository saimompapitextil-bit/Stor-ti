import Link from "next/link";
import { mockAlerts, mockStats } from "@/data/mock";

export default function DashboardPage() {
  const alerts = mockAlerts;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-white">Painel</h1>
        <p className="mt-1 text-sm text-slate-400">
          Dados de demonstração — sem backend conectado
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-stor-700 bg-stor-900/60 p-5">
          <p className="text-sm text-slate-400">Produtos ativos</p>
          <p className="mt-2 text-3xl font-semibold text-stor-accent">{mockStats.productsActive}</p>
        </div>
        <div className="rounded-xl border border-stor-700 bg-stor-900/60 p-5">
          <p className="text-sm text-slate-400">Armazéns ativos</p>
          <p className="mt-2 text-3xl font-semibold text-stor-accent">{mockStats.warehousesActive}</p>
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
            Ver estoque
          </Link>
        </div>
        <ul className="divide-y divide-stor-800">
          {alerts.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
              <span className="text-slate-200">
                {s.sku} — {s.productName}
              </span>
              <span className="text-slate-500">
                {s.warehouseCode}: {s.quantity} / mín. {s.minStock}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
