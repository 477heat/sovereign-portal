import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createSeoMetadata, seoPages } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata(seoPages.artifact);

export default function ArtifactLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
