import type { Metadata } from "next";
import Link from "next/link";
import TunnelBackdrop from "@/components/TunnelBackdrop";

export const metadata: Metadata = {
  title: "Coinbase Entry | Sovereign Engine",
  description:
    "A Base-native entry point for Sovereign Engine.",
};

const readinessChips = [
  "Base-native",
  "Coinbase Verified Account check",
  "One Genesis Mint",
];

export default function CoinbaseEntryPage() {
  return (
    <main className="info-control-page relative isolate min-h-screen overflow-x-hidden bg-black px-5 py-6 font-mono text-white md:px-10 md:py-10">
      <TunnelBackdrop layer="page" variant="diffused" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl flex-col">
        <nav className="mb-8 flex flex-col gap-3 border-b border-cyan-200/10 pb-5 text-[0.62rem] uppercase tracking-[0.22em] text-cyan-50/70 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="chamfer-nav-link chamfer-nav-link--compact">
            Home
          </Link>
          <div>Base Entry // Sovereign Engine</div>
        </nav>

        <section className="flex flex-1 items-center py-8 md:py-14">
          <div className="chamfer-panel chamfer-panel--command w-full px-6 py-8 md:px-10 md:py-10">
            <p className="mb-4 text-[0.68rem] uppercase tracking-[0.32em] text-cyan-100/55">
              Sovereign Engine
            </p>
            <h1 className="max-w-4xl text-3xl font-semibold uppercase leading-none tracking-normal text-cyan-50 md:text-5xl">
              Your Origin, Your Creation, Your Artifact.
            </h1>
            <p className="mt-5 max-w-2xl text-sm font-semibold uppercase leading-6 tracking-[0.18em] text-yellow-100/82 md:text-base">
              Deterministic, Unique, Identifiably Yours.
            </p>
            <p className="mt-7 max-w-2xl text-sm leading-6 text-cyan-50/72 md:text-base">
              Sovereign Engine creates one Genesis artifact for one real person.
              Enter the main site to see the Engine, the Portal, and the future
              Progeny path.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {readinessChips.map((chip) => (
                <span
                  key={chip}
                  className="border border-cyan-100/20 bg-cyan-100/[0.04] px-3 py-2 text-[0.62rem] uppercase tracking-[0.18em] text-cyan-50/68"
                >
                  {chip}
                </span>
              ))}
            </div>

            <Link
              href="/"
              className="chamfer-hero-link chamfer-hero-link--primary mt-8 max-sm:!h-14 max-sm:!max-w-none max-sm:!min-w-0"
            >
              Enter SovEngine
            </Link>
          </div>
        </section>

        <footer className="border-t border-cyan-100/10 pt-6 text-center text-[0.62rem] uppercase tracking-[0.28em] text-cyan-100/35">
          Sovereign Engine // Coinbase/Base routed entry
        </footer>
      </div>
    </main>
  );
}
