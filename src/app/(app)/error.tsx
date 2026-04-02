"use client";

import { useEffect } from "react";

export default function AppError({
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
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-xl font-semibold text-white">Algo deu errado</h1>
      <p className="max-w-md text-sm text-slate-400">
        Exceção no servidor. Se o digest aparecer na Vercel, veja os logs da função na aba de deployment.
      </p>
      {error.digest ? (
        <p className="font-mono text-xs text-slate-500">Digest: {error.digest}</p>
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
