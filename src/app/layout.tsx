import type { Metadata } from "next";
import "flag-icons/css/flag-icons.min.css";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Artech CRM",
  description: "Müşteri, teklif ve görev yönetim sistemi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}