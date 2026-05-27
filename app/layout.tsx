import "./globals.css";
import React from "react";
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
      </body>
    </html>
  );
}
