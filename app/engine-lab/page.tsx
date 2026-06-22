import type { Metadata } from "next";
import TunnelBackdrop from "@/components/TunnelBackdrop";
import { CommandDeckLab } from "@/components/command/CommandDeckLab";
import { createSeoMetadata, seoPages } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata(seoPages.engineLab);

export default function EngineLabPage() {
  return (
    <main className="info-control-page command-lab-page relative isolate min-h-screen overflow-x-hidden bg-black text-white">
      <TunnelBackdrop intensity="faint" layer="page" variant="diffused" />
      <CommandDeckLab />
    </main>
  );
}
