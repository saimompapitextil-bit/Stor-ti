"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Painel" },
  { href: "/produtos", label: "Produtos" },
  { href: "/armazens", label: "Armazéns" },
  { href: "/estoque", label: "Estoque" },
  { href: "/movimentacoes", label: "Movimentações" },
  { href: "/ordens-compra", label: "Ordens de compra" },
  { href: "/fornecedores", label: "Fornecedores" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-stor-700 bg-stor-900">
      <div className="border-b border-stor-700 p-4">
        <Link href="/dashboard" className="block">
          <span className="text-lg font-semibold tracking-tight text-white">STOR</span>
          <span className="mt-0.5 block text-xs text-stor-muted">Gestão de estoque</span>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-2">
        {links.map((l) => {
          const active = pathname === l.href || (l.href !== "/dashboard" && pathname.startsWith(l.href));
          return (
            <Link
              key={l.href}
              href={l.href}
              className={
                active
                  ? "rounded-lg bg-stor-800 px-3 py-2 text-sm font-medium text-stor-accent"
                  : "rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-stor-800/80 hover:text-white"
              }
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
