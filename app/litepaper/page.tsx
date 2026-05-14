"use client";

import Link from "next/link";
import SnippetBlock from "@/components/SnippetBlock";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans p-8 md:p-24 overflow-hidden relative">
      
      {/* --- THE GLOW ENGINE --- */}
      {/* Ambient background orbs providing depth to the 'Digital Void' */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Texture: Subtle scanline overlay to prevent the black from looking 'flat' */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,255,255,0.01),rgba(255,255,255,0.01),rgba(255,255,255,0.01))] bg-[length:100%_2px,3px_100%] opacity-20"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* --- HEADER SECTION --- */}
        <header className="mb-32 flex flex-col items-start gap-6">
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-extralight uppercase tracking-[0.8em] leading-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Genesis
            </h1>
            <p className="text-[10px] md:text-[12px] tracking-[0.6em] opacity-30 uppercase font-light ml-2">
              Sovereign Spiritual Protocol // v4.1
            </p>
          </div>
          <div className="h-[1px] w-24 bg-gradient-to-r from-white/40 to-transparent"></div>
        </header>

        {/* --- MODULAR SNIPPET GRID --- */}
        {/* This grid will now render your 'Artifact' and other data blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">
          <SnippetBlock 
            title="The Protocol" 
            label="ARCHIVE_01"
            content="A decentralized spiritual ledger ensuring absolute immutability of the soul via Base Sepolia." 
            image="/artifact.png" 
          />
          <SnippetBlock 
            title="Identity Gate" 
            label="AUTH_GATE"
            content="Mandatory 'One Human, One Soul' attestation. Multi-sig validation required for conveyance."
          />
          <SnippetBlock 
            title="The Ledger" 
            label="SYNC_STATUS"
            content="Real-time synchronization between mortal wallets and eternal on-chain state." 
          />
        </div>

        {/* --- NAVIGATION CTA --- */}
        <div className="flex flex-col items-center justify-center pt-12 border-t border-white/5">
          <Link 
            href="/portal" 
            className="group relative px-20 py-6 border border-white/10 transition-all duration-1000 hover:border-white/40 bg-white/[0.01] backdrop-blur-xl overflow-hidden"
          >
            {/* Hover Glow Effect inside the button */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-700"></div>
            
            <span className="relative z-10 text-[13px] tracking-[0.8em] font-black uppercase text-white/80 group-hover:text-white group-hover:tracking-[1em] transition-all">
              Initialize_Portal
            </span>
          </Link>
          
          <Link href="/litepaper" className="mt-12 text-[9px] tracking-[0.4em] opacity-20 hover:opacity-100 transition-all uppercase underline-offset-8 hover:underline">
            [ Read_Manifesto ]
          </Link>
        </div>
      </div>

      {/* --- FOOTER STATUS --- */}
      <footer className="fixed bottom-8 left-8 right-8 flex justify-between items-center pointer-events-none">
        <span className="text-[8px] tracking-[0.4em] opacity-10 uppercase">Node_Status: Active</span>
        <span className="text-[8px] tracking-[0.4em] opacity-10 uppercase">© 2026 Sovereign_Conveyance</span>
      </footer>
    </main>
  );
}