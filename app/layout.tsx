import "./globals.css";
import React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

const siteTitle = "Sovereign Engine | Genesis Access";
const siteDescription =
  "A Base-native Genesis Access artifact for real participants, built for future Engine-driven Progeny creations.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sovengine.xyz"),
  title: {
    default: siteTitle,
    template: "%s | Sovereign Engine",
  },
  description: siteDescription,
  applicationName: "Sovereign Engine",
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Sovereign Engine",
    "Soul Deed",
    "Genesis Access",
    "Base",
    "Coinbase",
    "NFT",
    "Progeny",
  ],
  icons: {
    icon: [
      {
        url: "/coinbase-assets/app-icon-1024.png",
        sizes: "1024x1024",
        type: "image/png",
      },
      {
        url: "/coinbase-assets/app-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        url: "/coinbase-assets/app-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/coinbase-assets/app-icon-180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Sovereign Engine",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sovereign Engine Genesis Access preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/twitter-image.jpg"],
  },
  other: {
    "base:app_id": "69fb33172763280abf41cd7a",
  },
};

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
