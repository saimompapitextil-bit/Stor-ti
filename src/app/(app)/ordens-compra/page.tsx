const mockOrders = [
  { number: "PO-2026-0001", supplier: "TechSupply Brasil", status: "Enviado", total: "R$ 132.250" },
  { number: "PO-2026-0002", supplier: "Papelaria Central", status: "Rascunho", total: "R$ 8.400" },
];

export default function OrdensCompraPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Ordens de compra</h1>
        <p className="mt-2 text-sm text-slate-400">Pedidos fictícios</p>
      </div>
      <ul className="space-y-3">
        {mockOrders.map((o) => (
          <li
            key={o.number}
            className="rounded-xl border border-stor-700 bg-stor-900/50 p-4 text-sm"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-mono text-stor-accent">{o.number}</span>
              <span className="text-slate-200">{o.supplier}</span>
            </div>
            <div className="mt-2 flex justify-between text-slate-400">
              <span>{o.status}</span>
              <span className="tabular-nums text-slate-300">{o.total}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
