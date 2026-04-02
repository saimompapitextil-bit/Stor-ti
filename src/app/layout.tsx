import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const fontSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "STOR — Controle de estoque",
  description: "Gestão de produtos e movimentações",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${fontSans.variable} min-h-screen bg-slate-100 font-sans`}>{children}</body>
    </html>
  );
}
