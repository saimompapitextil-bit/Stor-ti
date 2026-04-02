import { mockSuppliers } from "@/data/mock";

export default function FornecedoresPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Fornecedores</h1>
        <p className="mt-2 text-sm text-slate-400">Cadastro fictício</p>
      </div>
      <ul className="space-y-3">
        {mockSuppliers.map((s) => (
          <li
            key={s.doc}
            className="rounded-xl border border-stor-700 bg-stor-900/50 px-4 py-3 text-sm"
          >
            <p className="font-medium text-white">{s.name}</p>
            <p className="mt-1 text-slate-400">
              {s.doc} · {s.city}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
