import type { Metadata } from "next";

import { createSeoMetadata, seoPages } from "@/lib/seo";

import { WalletSetupContent } from "./WalletSetupContent";

export const metadata: Metadata = createSeoMetadata(seoPages.walletSetup);

export default function WalletSetupPage() {
  return <WalletSetupContent />;
}
