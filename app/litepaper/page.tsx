"use client";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Spectral Glow */}
      <div className="absolute w-[800px] h-[800px] bg-white/5 rounded-full blur-[160px] animate-pulse"></div>

      <div className="relative z-10 text-center space-y-12">
        <header className="space-y-4">
          <h1 className="text-7xl font-extralight uppercase tracking-[0.8em] drop-shadow-2xl">
            Genesis
          </h1>
          <p className="text-[10px] tracking-[0.6em] opacity-30 uppercase font-light">
            Sovereign Spiritual Protocol // v4.1
          </p>
        </header>

        <nav className="flex flex-col items-center gap-8 mt-24">
          <Link href="/portal" className="group relative px-12 py-4 border border-white/20 transition-all duration-700 hover:border-white hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <span className="text-[11px] tracking-[0.4em] font-black group-hover:tracking-[0.6em] transition-all">
              INITIALIZE_CONVEYANCE
            </span>
          </Link>
          
          <Link href="/litepaper" className="text-[9px] tracking-[0.3em] opacity-30 hover:opacity-100 transition-opacity">
            [ VIEW_MANIFESTO ]
          </Link>
        </nav>
      </div>

      <footer className="absolute bottom-12 w-full text-center text-[8px] tracking-[0.5em] opacity-20 uppercase">
        Immutable // Eternal // Sovereign
      </footer>
    </main>
  );
}