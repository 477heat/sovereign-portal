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
        <header className="flex flex-col items-center mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-light uppercase tracking-[0.3em] drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Sovereign Engine Protocol
          </h1>
          <p className="mt-4 text-base md:text-lg tracking-[0.4em] opacity-40 uppercase font-light">
            Contractual Conveyance
          </p>
        </header>

        {/* Primary Navigation */}
        <nav className="flex flex-wrap justify-center gap-6 mb-20">
          <Link href="/whitepaper" className="group relative px-10 py-3 border border-white/10 transition-all duration-500 hover:border-white/40 bg-white/[0.01] backdrop-blur-sm">
            <span className="text-xs tracking-[0.4em] font-bold uppercase">Whitepaper</span>
          </Link>
          <Link href="/economics" className="group relative px-10 py-3 border border-white/10 transition-all duration-500 hover:border-white/40 bg-white/[0.01] backdrop-blur-sm">
            <span className="text-xs tracking-[0.4em] font-bold uppercase">Economics</span>
          </Link>
          <Link href="/vanguard" className="group relative px-10 py-3 border border-white/10 transition-all duration-500 hover:border-white/40 bg-white/[0.01] backdrop-blur-sm">
            <span className="text-xs tracking-[0.4em] font-bold uppercase">Privileges</span>
          </Link>
          <Link href="/portal" className="group relative px-10 py-3 border border-white transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] bg-white text-black">
            <span className="text-xs tracking-[0.4em] font-black uppercase">Enter Portal</span>
          </Link>
        </nav>
          
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <SnippetBlock
            title="Vanguard Privileges"
            content="See the benefits for users and developers in the privileges section"
            label="COMMUNITY_DRIVEN"
          />
          <SnippetBlock
            title="Progeny Engine"
            content="You don't have to sell; Mint the Soul, Generate Unique Playables, Yield Forever"
            label="ASSET_LAYER"
          />
          <SnippetBlock
            title="DEVELOPER ADAPTATION"
            content="User Attributes Drive Character Generation for a true community of unique players"
            label="DEVELOPER_USAGE"
          />
        </section>
   
        {/* IRREVERENT SUMMARY ADDENDUM */}
        <section className="max-w-3xl mx-auto mb-32">
          <div className="p-8 md:p-12 border border-white/10 bg-white/[0.01] backdrop-blur-sm text-center">
            <h2 className="text-[10px] tracking-[0.5em] uppercase text-white/40 mb-8">
              Contractual Addendum // Notice of Intent
            </h2>
            <div className="space-y-8 text-sm md:text-base text-gray-400 italic leading-relaxed">
              <p>
                Forget the Faustian legalese: You are contractually shackling your actual, literal soul to an internet token so you can pawn it off to the highest bidder like the idiot founder. Upon its <span className="text-white not-italic font-bold">Initial Mint</span> you have absolute discretion to hold it, barter it, sell it, give it to your spouse. You probably owe them eternal servitude anyway.
              </p>
              <p>
                Servitude begins at the moment of <span className="text-white not-italic font-bold">DEATH</span> as per the contract agreements. You retain full physical autonomy and a small Commission while breathing, but the holder claims rights to your spirit, <span className="not-italic">Ex Anima</span>. Enter the Portal to read the contract in its entierty. 
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
