"use client";
import Link from "next/link";
import Image from "next/image";
import SnippetBlock from "@/components/SnippetBlock";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8 md:p-24 overflow-hidden relative">
      
      {/* Ambient background effects */}
      <div className="scanline-overlay"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="flex flex-col items-center mb-32 text-center">
          <h1 className="text-6xl md:text-9xl font-light uppercase tracking-[0.5em] drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Sovereign Engine Protocol
          </h1>
          <p className="mt-8 text-lg md:text-2xl tracking-[0.5em] opacity-40 uppercase font-light">
            Contractual Conveyance
          </p>
        </header>

          <nav className="flex flex-wrap justify-center gap-8">
            <Link href="/whitepaper" className="group relative px-12 py-4 border border-white/10 transition-all duration-500 hover:border-white/40 bg-white/[0.01] backdrop-blur-sm">
              <span className="text-sm tracking-[0.4em] font-bold uppercase">Whitepaper</span>
            </Link>
            <Link href="/economics" className="group relative px-12 py-4 border border-white/10 transition-all duration-500 hover:border-white/40 bg-white/[0.01] backdrop-blur-sm">
              <span className="text-sm tracking-[0.4em] font-bold uppercase">Economics</span>
            </Link>
            <Link href="/portal" className="group relative px-12 py-4 border border-white transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] bg-white text-black">
              <span className="text-sm tracking-[0.4em] font-black uppercase">Enter Portal</span>
            </Link>
          </nav>
          
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-28">
          <SnippetBlock
            title="The Protocol"
            content="A decentralized spiritual ledger ensuring absolute immutability of the soul."
            label="CORE_FUNCTION"
          />
          <SnippetBlock
            title="Identity Gate"
            content="Mandatory 'One Human, One Soul' attestation via Coinbase EAS."
            label="SECURITY_LAYER"
          />
          <SnippetBlock
            title="Immutability"
            content="Cryptographic certainty for the non-physical domain."
            label="VERIFICATION"
          />
        </section>

        {/* Centered Artifact Asset */}
        <section className="flex flex-col items-center gap-16 mb-32">
          <div className="relative w-full max-w-4xl aspect-video border border-white/10 bg-white/[0.02] overflow-hidden group">
             <Image
                src="/artifact.png"
                alt="Genesis Artifact"
                fill
                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-1000"
             />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-[1px] bg-white/10"></div>
                <div className="absolute w-[1px] h-full bg-white/10"></div>
             </div>
          </div>

        </section>
      </div>
    </main>
  );
}

