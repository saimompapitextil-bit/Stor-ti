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
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-100 p-8 text-center">
      <h1 className="text-xl font-semibold text-slate-900">Erro na aplicação</h1>
      <p className="max-w-md text-sm text-slate-600">
        Algo falhou ao renderizar. Se estiver na Vercel, confira os logs do deployment.
      </p>
      {error.digest ? (
        <p className="font-mono text-xs text-amber-200/90">Digest: {error.digest}</p>
      ) : null}
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Tentar novamente
      </button>
    </div>
  );
}
