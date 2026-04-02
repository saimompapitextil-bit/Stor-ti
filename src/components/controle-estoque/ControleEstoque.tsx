"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpDown,
  ChevronDown,
  Package,
  Plus,
  Search,
} from "lucide-react";

type TabKey = "atual" | "historico";

export function ControleEstoque() {
  const [tab, setTab] = useState<TabKey>("atual");
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [exibir, setExibir] = useState("10");

  return (
    <div className="p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">Controle de Estoque</h1>
        <p className="mt-1 text-slate-600">Gerencie produtos, entradas, saídas e movimentações</p>

        <div className="mt-6 inline-flex rounded-lg bg-slate-200/90 p-1">
          <button
            type="button"
            onClick={() => setTab("atual")}
            className={
              tab === "atual"
                ? "rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm"
                : "rounded-md px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
            }
          >
            Estoque Atual
          </button>
          <button
            type="button"
            onClick={() => setTab("historico")}
            className={
              tab === "historico"
                ? "rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm"
                : "rounded-md px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
            }
          >
            Histórico de Movimentações
          </button>
        </div>
      </header>

      <section className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Package className="h-6 w-6" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Total em Estoque</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">0 itens</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <ArrowDownRight className="h-6 w-6" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Produtos Cadastrados</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">0</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <AlertTriangle className="h-6 w-6" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Estoque Crítico</p>
              <p className="mt-1 text-2xl font-bold text-red-600">0</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:p-5">
          <div className="relative min-w-[200px] flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar produto..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none ring-blue-500 transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm text-slate-700 outline-none ring-blue-500 focus:border-blue-500 focus:ring-2"
              >
                <option value="todas">Todas categorias</option>
                <option value="rede">Rede</option>
                <option value="escritorio">Escritório</option>
                <option value="ti">TI</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Cadastrar Produto
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Exibir:</span>
              <div className="relative">
                <select
                  value={exibir}
                  onChange={(e) => setExibir(e.target.value)}
                  className="cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    Produto
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                  </span>
                </th>
                <th className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    Estoque Atual
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                  </span>
                </th>
                <th className="px-4 py-3">Mínimo</th>
                <th className="px-4 py-3">Máximo</th>
                <th className="px-4 py-3">Unidade</th>
                <th className="px-4 py-3">Localização</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="px-4 py-16 text-center text-slate-500">
                  {tab === "atual" ? (
                    <p>
                      Nenhum produto cadastrado. Clique em &apos;Cadastrar Produto&apos; para começar.
                    </p>
                  ) : (
                    <p>Nenhuma movimentação registrada neste período.</p>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
