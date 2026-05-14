// app/layout.tsx
import "./globals.css";
import React from "react";

// Define the shape of the props for the layout 
export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en">
      <body className="bg-black antialiased">
        {children}
      </body>
    </html>
  );
}