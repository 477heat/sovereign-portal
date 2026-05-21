import "./globals.css";
import React from "react";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black antialiased font-sans flex flex-col min-h-screen">
        <div className="flex-grow">
          {children}
        </div>
        <Analytics />
        <footer className="flex flex-wrap items-center justify-center gap-5 border-t border-white/5 px-8 py-12">
          <Link 
            href="/process_flow_chart.md" 
            className="text-[10px] tracking-[0.4em] uppercase text-white/40 hover:text-white transition-colors duration-500"
          >
            Process Flow Chart
          </Link>
          <Link
            href="/admin"
            className="text-[10px] uppercase tracking-[0.4em] text-white/20 transition-colors duration-500 hover:text-white"
          >
            Admin
          </Link>
        </footer>
      </body>
    </html>
  );
}
