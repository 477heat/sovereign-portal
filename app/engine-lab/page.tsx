import type { Metadata } from "next";
import TunnelBackdrop from "@/components/TunnelBackdrop";
import { CommandDeckLab } from "@/components/command/CommandDeckLab";

export const metadata: Metadata = {
  title: "Engine Lab",
  description:
    "A public UI sandbox for the Sovereign Engine command deck interface.",
  alternates: {
    canonical: "/engine-lab",
  },
};

export default function EngineLabPage() {
  return (
    <main className="info-control-page command-lab-page relative isolate min-h-screen overflow-x-hidden bg-black text-white">
      <TunnelBackdrop layer="page" variant="diffused" rings />
      <CommandDeckLab />
    </main>
  );
}
