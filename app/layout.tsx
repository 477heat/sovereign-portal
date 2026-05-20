import "./globals.css";
import React from "react";
import { Chakra_Petch } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react"

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-chakra",
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${chakraPetch.variable}`}>
      <body className="bg-black antialiased font-sans flex flex-col min-h-screen">
        <div className="flex-grow">
          {children}
        </div>
        <footer className="py-12 px-8 flex justify-center items-center border-t border-white/5">
          <Link 
            href="/process_flow_chart.md" 
            className="text-[10px] tracking-[0.4em] uppercase text-white/40 hover:text-white transition-colors duration-500"
          >
            Process Flow Chart
          </Link>
        </footer>
      </body>
    </html>
  );
}
