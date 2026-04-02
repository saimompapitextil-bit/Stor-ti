import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const fontSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "STOR TI — Estoque",
  description: "Sistema de gestão de estoque multi-armazém",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${fontSans.variable} min-h-screen font-sans antialiased`}>{children}</body>
    </html>
  );
}
