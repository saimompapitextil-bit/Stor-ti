import { mockProducts } from "@/data/mock";

export default function ProdutosPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Produtos</h1>
        <p className="mt-2 text-sm text-slate-400">Lista fictícia para layout</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-stor-700">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stor-700 bg-stor-900/80 text-slate-400">
            <tr>
              <th className="p-3 font-medium">SKU</th>
              <th className="p-3 font-medium">Nome</th>
              <th className="p-3 font-medium">Categoria</th>
              <th className="p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockProducts.map((p) => (
              <tr key={p.sku} className="border-b border-stor-800/80 last:border-0">
                <td className="p-3 font-mono text-stor-muted">{p.sku}</td>
                <td className="p-3 text-slate-200">{p.name}</td>
                <td className="p-3 text-slate-400">{p.category}</td>
                <td className="p-3">
                  <span
                    className={
                      p.status === "Ativo"
                        ? "rounded-full bg-emerald-500/20 text-emerald-300 px-2 py-0.5 text-xs"
                        : "rounded-full bg-slate-500/20 text-slate-400 px-2 py-0.5 text-xs"
                    }
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
