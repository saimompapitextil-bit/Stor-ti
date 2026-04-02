"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stor-950 p-8 text-center text-slate-200">
        <h1 className="text-xl font-semibold text-white">Erro crítico</h1>
        {error.digest ? (
          <p className="font-mono text-xs text-amber-200/90">Digest: {error.digest}</p>
        ) : null}
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-stor-accent px-4 py-2 text-sm font-medium text-stor-950"
        >
          Tentar novamente
        </button>
      </body>
    </html>
  );
}
