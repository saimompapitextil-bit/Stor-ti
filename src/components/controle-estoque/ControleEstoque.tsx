"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpDown,
  ChevronDown,
  Minus,
  Package,
  Plus,
  Search,
} from "lucide-react";
import { cadastrarProduto, registrarEntradaRapida, registrarSaidaRapida } from "@/actions/estoque";
import type {
  EstoqueStats,
  MovementTableRow,
  SelectOption,
  StockTableRow,
} from "@/types/estoque";

type TabKey = "atual" | "historico";

const tipoMovLabels: Record<string, string> = {
  ENTRADA: "Entrada",
  SAIDA: "Saída",
  AJUSTE: "Ajuste",
};

type Props = {
  categories: SelectOption[];
  units: SelectOption[];
  warehouses: SelectOption[];
  rows: StockTableRow[];
  movements: MovementTableRow[];
  stats: EstoqueStats;
};

export function ControleEstoque({
  categories,
  units,
  warehouses,
  rows: initialRows,
  movements,
  stats,
}: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("atual");
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [exibir, setExibir] = useState("10");
  const [modalCadastro, setModalCadastro] = useState(false);
  const [movimento, setMovimento] = useState<{
    tipo: "ENTRADA" | "SAIDA";
    row: StockTableRow;
  } | null>(null);
  const [erroCadastro, setErroCadastro] = useState<string | null>(null);
  const [erroMovimento, setErroMovimento] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const rowsFiltrados = useMemo(() => {
    let r = initialRows;
    if (categoria !== "todas") {
      r = r.filter((x) => x.categoryId === categoria);
    }
    const q = busca.trim().toLowerCase();
    if (q) {
      r = r.filter(
        (x) =>
          x.sku.toLowerCase().includes(q) || x.productName.toLowerCase().includes(q),
      );
    }
    return r;
  }, [initialRows, categoria, busca]);

  const limite = Number(exibir) || 10;
  const rowsPagina = rowsFiltrados.slice(0, limite);

  function refresh() {
    startTransition(() => router.refresh());
  }

  return (
    <div className="p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
          Controle de Estoque
        </h1>
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
              <p className="mt-1 text-2xl font-bold text-slate-900">{stats.totalItens} itens</p>
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
              <p className="mt-1 text-2xl font-bold text-slate-900">{stats.produtosCadastrados}</p>
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
              <p className="mt-1 text-2xl font-bold text-red-600">{stats.estoqueCritico}</p>
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
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            <button
              type="button"
              onClick={() => {
                setErroCadastro(null);
                setModalCadastro(true);
              }}
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
          {tab === "atual" ? (
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
                {rowsPagina.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center text-slate-500">
                      {initialRows.length === 0 ? (
                        <p>
                          Nenhum produto cadastrado. Clique em &apos;Cadastrar Produto&apos; para começar.
                        </p>
                      ) : (
                        <p>Nenhum resultado para os filtros atuais.</p>
                      )}
                    </td>
                  </tr>
                ) : (
                  rowsPagina.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{row.productName}</div>
                        <div className="text-xs text-slate-500">{row.sku}</div>
                      </td>
                      <td className="px-4 py-3 tabular-nums text-slate-800">{row.quantity}</td>
                      <td className="px-4 py-3 tabular-nums text-slate-600">{row.minStock}</td>
                      <td className="px-4 py-3 tabular-nums text-slate-600">
                        {row.maxStock ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{row.unitCode}</td>
                      <td className="px-4 py-3 text-slate-600">{row.location}</td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            row.status === "critico"
                              ? "inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800"
                              : "inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800"
                          }
                        >
                          {row.status === "critico" ? "Crítico" : "OK"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            title="Entrada"
                            onClick={() => {
                              setErroMovimento(null);
                              setMovimento({ tipo: "ENTRADA", row });
                            }}
                            className="rounded-md border border-slate-200 bg-white p-1.5 text-emerald-700 hover:bg-emerald-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            title="Saída"
                            onClick={() => {
                              setErroMovimento(null);
                              setMovimento({ tipo: "SAIDA", row });
                            }}
                            className="rounded-md border border-slate-200 bg-white p-1.5 text-red-700 hover:bg-red-50"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Produto</th>
                  <th className="px-4 py-3 text-right">Qtd</th>
                  <th className="px-4 py-3">Armazém</th>
                  <th className="px-4 py-3">Referência</th>
                </tr>
              </thead>
              <tbody>
                {movements.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center text-slate-500">
                      Nenhuma movimentação registrada neste período.
                    </td>
                  </tr>
                ) : (
                  movements.map((m) => (
                    <tr key={m.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                        {new Date(m.createdAt).toLocaleString("pt-BR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="px-4 py-3">{tipoMovLabels[m.type] ?? m.type}</td>
                      <td className="px-4 py-3 text-slate-800">{m.productName}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{m.quantity}</td>
                      <td className="px-4 py-3 text-slate-600">{m.warehouseCode}</td>
                      <td className="px-4 py-3 text-slate-500">{m.reference ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {modalCadastro ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">Cadastrar produto</h2>
            <p className="mt-1 text-sm text-slate-500">Cria o produto e a primeira posição de estoque.</p>
            <form
              className="mt-4 space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                setErroCadastro(null);
                const fd = new FormData(e.currentTarget);
                const r = await cadastrarProduto(fd);
                if (r.ok) {
                  setModalCadastro(false);
                  refresh();
                } else setErroCadastro(r.error);
              }}
            >
              <div>
                <label className="text-xs font-medium text-slate-600">SKU</label>
                <input
                  name="sku"
                  required
                  className="mt-0.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Nome</label>
                <input
                  name="name"
                  required
                  className="mt-0.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600">Categoria</label>
                  <select
                    name="categoryId"
                    required
                    className="mt-0.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    <option value="">—</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Unidade</label>
                  <select
                    name="unitId"
                    required
                    className="mt-0.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    <option value="">—</option>
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.code} — {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Armazém</label>
                <select
                  name="warehouseId"
                  required
                  className="mt-0.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="">—</option>
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.code} — {w.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600">Qtd inicial</label>
                  <input
                    name="quantity"
                    type="number"
                    min={0}
                    step={1}
                    defaultValue={0}
                    className="mt-0.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Mínimo</label>
                  <input
                    name="minStock"
                    type="number"
                    min={0}
                    step={1}
                    defaultValue={0}
                    className="mt-0.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Máximo</label>
                  <input
                    name="maxStock"
                    type="number"
                    min={0}
                    step={1}
                    className="mt-0.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    placeholder="opcional"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Localização (prateleira)</label>
                <input
                  name="locationLabel"
                  className="mt-0.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  placeholder="ex.: A-01"
                />
              </div>
              {erroCadastro ? <p className="text-sm text-red-600">{erroCadastro}</p> : null}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalCadastro(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {movimento ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">
              {movimento.tipo === "ENTRADA" ? "Entrada" : "Saída"} de estoque
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {movimento.row.productName} ({movimento.row.sku})
            </p>
            <form
              className="mt-4 space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                setErroMovimento(null);
                const fd = new FormData(e.currentTarget);
                const r =
                  movimento.tipo === "ENTRADA"
                    ? await registrarEntradaRapida(fd)
                    : await registrarSaidaRapida(fd);
                if (r.ok) {
                  setMovimento(null);
                  refresh();
                } else setErroMovimento(r.error);
              }}
            >
              <input type="hidden" name="productId" value={movimento.row.productId} />
              <input type="hidden" name="warehouseId" value={movimento.row.warehouseId} />
              <div>
                <label className="text-xs font-medium text-slate-600">Quantidade</label>
                <input
                  name="quantity"
                  type="number"
                  min={1}
                  step={1}
                  required
                  className="mt-0.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Referência (NF, OS…)</label>
                <input
                  name="reference"
                  className="mt-0.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              {erroMovimento ? <p className="text-sm text-red-600">{erroMovimento}</p> : null}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMovimento(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
