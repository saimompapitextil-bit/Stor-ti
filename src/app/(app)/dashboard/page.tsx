import Link from "next/link";
import { LayoutDashboard, Package } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">Dashboard</h1>
      <p className="mt-1 text-slate-600">Visão geral do STOR</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/estoque"
          className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Controle de Estoque</p>
            <p className="text-sm text-slate-500">Produtos e movimentações</p>
          </div>
        </Link>
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm opacity-80">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Resumos</p>
            <p className="text-sm text-slate-500">Em breve</p>
          </div>
        </div>
      </div>
    </div>
  );
}
