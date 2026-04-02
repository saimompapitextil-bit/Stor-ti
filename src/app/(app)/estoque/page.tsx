import { mockStockPositions } from "@/data/mock";

export default function EstoquePage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Estoque</h1>
        <p className="mt-2 text-sm text-slate-400">Posições fictícias por armazém</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-stor-700">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stor-700 bg-stor-900/80 text-slate-400">
            <tr>
              <th className="p-3 font-medium">SKU</th>
              <th className="p-3 font-medium">Produto</th>
              <th className="p-3 font-medium">Armazém</th>
              <th className="p-3 font-medium text-right">Qtd</th>
            </tr>
          </thead>
          <tbody>
            {mockStockPositions.map((row, i) => (
              <tr key={`${row.sku}-${row.warehouseCode}-${i}`} className="border-b border-stor-800/80 last:border-0">
                <td className="p-3 font-mono text-stor-muted">{row.sku}</td>
                <td className="p-3 text-slate-200">{row.productName}</td>
                <td className="p-3 text-slate-400">{row.warehouseCode}</td>
                <td className="p-3 text-right tabular-nums text-slate-200">{row.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
