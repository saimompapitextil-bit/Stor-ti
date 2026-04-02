"use client";

import { useEffect } from "react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stor-950 p-8 text-center">
      <h1 className="text-xl font-semibold text-white">Erro no servidor</h1>
      <p className="max-w-lg text-sm text-slate-400">
        Ocorreu uma exceção ao renderizar a página. Em produção (Vercel), abra o deployment →{" "}
        <strong className="text-slate-300">Logs</strong> e filtre por erros da função. Causas frequentes:{" "}
        <code className="text-stor-muted">DATABASE_URL</code> ausente ou inválida, banco inacessível, ou tabelas
        Prisma não criadas (<code className="text-stor-muted">npx prisma db push</code>).
      </p>
      {error.digest ? (
        <p className="font-mono text-xs text-amber-200/80">Digest: {error.digest}</p>
      ) : null}
      {error.message ? (
        <p className="max-w-xl break-all font-mono text-xs text-slate-500">{error.message}</p>
      ) : null}
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-lg bg-stor-accent px-4 py-2 text-sm font-medium text-stor-950 hover:opacity-90"
      >
        Tentar novamente
      </button>
    </div>
  );
}
