"use client";
import Link from "next/link";
import SnippetBlock from "@/components/SnippetBlock";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans p-8 md:p-24 overflow-hidden relative">
      
      {/* --- THE GLOW ENGINE --- */}
      {/* Large, slow-pulsing background light */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Subtle Scanline Overlay for texture */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,255,255,0.01),rgba(255,255,255,0.01),rgba(255,255,255,0.01))] bg-[length:100%_2px,3px_100%] opacity-20"></div>
      {/* ----------------------- */}

      <div className="relative z-10 max-w-6xl mx-auto">
        <header className="mb-32">
          <h1 className="text-6xl md:text-8xl font-extralight uppercase tracking-[0.8em] drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Genesis
          </h1>
          <p className="mt-6 text-[10px] tracking-[0.5em] opacity-30 uppercase font-light">
            Sovereign Spiritual Protocol
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          <SnippetBlock 
            title="The Protocol" 
            content="A decentralized spiritual ledger ensuring absolute immutability of the soul." 
          />
          <SnippetBlock   
            title="The Protocol" 
            content="A decentralized spiritual ledger ensuring absolute immutability of the soul." 
            image="/artifact.png" // Path relative to the public folder
          />
          <SnippetBlock 
            title="Identity Gate" 
            content="Mandatory 'One Human, One Soul' attestation via Coinbase EAS."
          />
          <SnippetBlock 
            title="The Ledger" 
            content="Real-time synchronization between mortal wallets and eternal state." 
          />
        </div>

        <div className="flex flex-col items-center gap-12">
          <Link href="/portal" className="group relative px-16 py-5 border border-white/20 transition-all duration-700 hover:border-white hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] bg-white/[0.01] backdrop-blur-sm">
            <span className="text-[12px] tracking-[0.6em] font-black uppercase">
              Enter Portal
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}