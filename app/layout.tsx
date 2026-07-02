import "./globals.css";
import React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SiteBetaBadge } from "@/components/SiteBetaBadge";
import {
  absoluteUrl,
  defaultOgImage,
  seoPages,
  siteDescription,
  siteName,
  siteUrl,
} from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | ${seoPages.home.title}`,
    template: "%s | Sovereign Engine",
  },
  description: siteDescription,
  applicationName: siteName,
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Sovereign Engine",
    "TAC",
    "Tokenized Asset Creation",
    "Soul Deed",
    "Genesis Access",
    "Base",
    "Coinbase",
    "Progeny",
    "Vanguard Honor",
    "Genesis Mint",
    "Coinbase EAS",
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "Web3",
  icons: {
    icon: [
      {
        url: "/icon.png",
        sizes: "any",
        type: "image/png",
      },
      {
        url: "/brand/sovereign-engine-site-logo-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    title: `${siteName} | ${seoPages.home.title}`,
    description: seoPages.home.description,
    images: [
      {
        url: defaultOgImage.url,
        width: defaultOgImage.width,
        height: defaultOgImage.height,
        alt: defaultOgImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | ${seoPages.home.title}`,
    description: seoPages.home.description,
    images: ["/twitter-image.jpg"],
  },
  other: {
    "base:app_id": "69fb33172763280abf41cd7a",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
  description: siteDescription,
  image: absoluteUrl(defaultOgImage.url),
  potentialAction: {
    "@type": "ViewAction",
    target: absoluteUrl(seoPages.portal.path),
    name: "Open Mint Path",
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
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          type="application/ld+json"
        />
        <SiteBetaBadge />
        <div className="flex-grow">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
