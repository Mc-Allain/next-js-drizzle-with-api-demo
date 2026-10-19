import type { Metadata } from "next";
import "./globals.css";

// Root layout wraps every page. It stays a Server Component (no "use client")
// because it has no interactivity.
export const metadata: Metadata = {
  title: "Notes CRUD Demo",
  description: "Next.js + Express + Drizzle learning project",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
