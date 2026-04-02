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
      <body className="min-h-screen bg-stor-950 p-8 text-center text-slate-200 antialiased">
        <h1 className="text-xl font-semibold text-white">Erro crítico</h1>
        <p className="mx-auto mt-4 max-w-lg text-sm text-slate-400">
          Falha no layout raiz. Verifique os logs na Vercel e variáveis de ambiente.
        </p>
        {error.digest ? (
          <p className="mt-4 font-mono text-xs text-amber-200/80">Digest: {error.digest}</p>
        ) : null}
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-stor-accent px-4 py-2 text-sm font-medium text-stor-950"
        >
          Tentar novamente
        </button>
      </body>
    </html>
  );
}
