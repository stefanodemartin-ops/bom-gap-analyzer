import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BOM Gap Analyzer",
  description: "OEM vs CMMS parts reconciliation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
