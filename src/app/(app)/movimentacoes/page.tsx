const mockMovements = [
  { id: "M-001", type: "Entrada — compra", ref: "NF 4521", date: "02/04/2026", warehouse: "SP-MAT" },
  { id: "M-002", type: "Saída — consumo", ref: "OS 892", date: "01/04/2026", warehouse: "RJ-FIL" },
  { id: "M-003", type: "Transferência", ref: "TR SP→MG", date: "31/03/2026", warehouse: "SP-MAT → MG-FIL" },
];

export default function MovimentacoesPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Movimentações</h1>
        <p className="mt-2 text-sm text-slate-400">Registros fictícios</p>
      </div>
      <ul className="space-y-2">
        {mockMovements.map((m) => (
          <li
            key={m.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-stor-700 bg-stor-900/40 px-4 py-3 text-sm"
          >
            <span className="font-mono text-stor-muted">{m.id}</span>
            <span className="text-slate-200">{m.type}</span>
            <span className="text-slate-400">{m.ref}</span>
            <span className="text-slate-500">{m.date}</span>
            <span className="text-slate-500">{m.warehouse}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
