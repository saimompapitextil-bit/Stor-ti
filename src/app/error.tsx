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
      <h1 className="text-xl font-semibold text-white">Erro na aplicação</h1>
      <p className="max-w-md text-sm text-slate-400">
        Verifique na Vercel os <strong>Logs</strong> do deployment. Em geral: <code>DATABASE_URL</code>{" "}
        ausente ou banco sem schema (<code>npx prisma db push</code>).
      </p>
      {error.digest ? (
        <p className="font-mono text-xs text-amber-200/90">Digest: {error.digest}</p>
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
