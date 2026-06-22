import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createSeoMetadata, seoPages } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata(seoPages.vanguard);

export default function VanguardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
