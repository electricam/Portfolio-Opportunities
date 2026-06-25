import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Gov Adoption Radar",
  description: "Map venture-backed technology to government adoption pathways.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
