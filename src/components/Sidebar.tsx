"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Database,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Package,
  Ticket,
  Users,
  Wrench,
} from "lucide-react";

const gestaoItems = [
  { href: "/colaboradores", label: "Colaboradores", icon: Users },
  { href: "/estoque", label: "Estoque", icon: Package },
  { href: "/incidentes", label: "Incidentes", icon: AlertTriangle },
  { href: "/manutencoes", label: "Manutenções", icon: Wrench },
  { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
] as const;

function NavRow({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "flex items-center gap-3 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-medium text-white shadow-sm"
          : "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
      }
    >
      <Icon className="h-[18px] w-[18px] shrink-0 opacity-90" />
      {label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const gestaoOpenDefault = gestaoItems.some(
    (i) => pathname === i.href || pathname.startsWith(i.href + "/"),
  );
  const [gestaoOpen, setGestaoOpen] = useState(gestaoOpenDefault);

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-slate-950 text-slate-200">
      <div className="border-b border-slate-800/80 px-4 py-5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <Database className="h-8 w-8 text-blue-500" strokeWidth={2} />
          <span className="text-lg font-bold tracking-tight text-white">STOR</span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        <NavRow
          href="/dashboard"
          label="Dashboard"
          icon={LayoutDashboard}
          active={pathname === "/dashboard"}
        />
        <NavRow href="/chamados" label="Chamados" icon={Ticket} active={pathname.startsWith("/chamados")} />

        <div className="mt-1">
          <button
            type="button"
            onClick={() => setGestaoOpen((o) => !o)}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <FolderKanban className="h-[18px] w-[18px] opacity-80" />
              Gestão
            </span>
            {gestaoOpen ? (
              <ChevronDown className="h-4 w-4 shrink-0 opacity-70" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0 opacity-70" />
            )}
          </button>

          {gestaoOpen ? (
            <div className="mt-1 space-y-0.5 border-l border-slate-800 pl-3 ml-3">
              {gestaoItems.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <NavRow
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    active={active}
                  />
                );
              })}
            </div>
          ) : null}
        </div>
      </nav>

      <div className="border-t border-slate-800/80 p-3">
        <div className="rounded-lg bg-slate-900/80 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              T
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-slate-400">tipapitextil@outlook.com</p>
              <span className="mt-1 inline-block rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Usuário
              </span>
            </div>
          </div>
          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 py-2 text-sm text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </div>
    </aside>
  );
}
