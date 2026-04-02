import Link from "next/link";

export function EstoqueConfigMissing({ falhaConexao = false }: { falhaConexao?: boolean }) {
  return (
    <div className="p-6 lg:p-8">
      <div className="mx-auto max-w-lg rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <h1 className="text-lg font-semibold">Banco de dados não configurado</h1>
        <p className="mt-2 text-sm text-amber-900/90">
          {falhaConexao
            ? "Não foi possível conectar. Confira DATABASE_URL (Postgres / Supabase) e se o schema foi aplicado."
            : "Defina DATABASE_URL no arquivo .env na raiz do projeto."}
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
          <li>
            Copie <code className="rounded bg-white/80 px-1">.env.example</code> para{" "}
            <code className="rounded bg-white/80 px-1">.env</code> e preencha a URI do Postgres.
          </li>
          <li>
            Rode <code className="rounded bg-white/80 px-1">npx prisma db push</code>
          </li>
          <li>
            Opcional: <code className="rounded bg-white/80 px-1">npm run db:seed</code>
          </li>
        </ol>
        <p className="mt-4 text-sm">
          <Link className="font-medium text-blue-700 underline" href="https://supabase.com/dashboard">
            Abrir Supabase
          </Link>
        </p>
      </div>
    </div>
  );
}
