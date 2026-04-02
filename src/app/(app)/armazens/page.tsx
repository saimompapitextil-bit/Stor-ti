import { mockWarehouses } from "@/data/mock";

export default function ArmazensPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Armazéns</h1>
        <p className="mt-2 text-sm text-slate-400">Centros fictícios</p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {mockWarehouses.map((w) => (
          <li
            key={w.code}
            className="rounded-xl border border-stor-700 bg-stor-900/50 p-4 text-sm"
          >
            <p className="font-mono text-stor-accent">{w.code}</p>
            <p className="mt-1 font-medium text-white">{w.name}</p>
            <p className="mt-0.5 text-slate-400">{w.city}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
