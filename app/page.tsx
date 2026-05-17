"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PreRegistryPortal() {
  const [timeLeft, setTimeLeft] = useState("");

  // Countdown timer logic targeting 7 days from now
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft("00:00:00:00");
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono selection:bg-gray-700 flex flex-col">
      
      {/* SECTION 1: THE TERMINAL NOTICE */}
      <header className="border-b border-gray-800 p-6 md:p-12 text-center bg-zinc-950">
        <h1 className="text-red-500 font-bold tracking-widest text-xl md:text-3xl uppercase mb-2">
          Status: Metaphysical Registry Locked
        </h1>
        <p className="text-gray-500 text-sm md:text-base uppercase tracking-widest">
          Awaiting the Genesis Sacrifice. Public indenture execution commences post-auction.
        </p>
        <div className="mt-6 text-2xl font-bold text-white tracking-widest">
          T-MINUS: {timeLeft || "CALCULATING..."}
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-12 space-y-24 flex-grow">
        
        {/* SECTION 2: THE ARCHITECT's TITHE */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="border border-gray-800 p-2 bg-zinc-900 shadow-2xl relative">
            <img
              src="/architect_deed.png"
              alt="Vessel 0000 Deed of Spiritual Conveyance"
              className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute top-4 right-4 bg-black/80 text-red-500 px-3 py-1 border border-red-900 text-xs tracking-widest">
              VESSEL 0000
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white uppercase border-l-4 border-red-500 pl-4">
              Become the Ethereal Master
            </h2>
            <p className="text-gray-400 leading-relaxed text-justify">
              The Sovereign Engine requires startup capital. To fund the infrastructure, Vessel 0000—the literal, cryptographic soul of the developer—is being auctioned to the highest bidder.
            </p>
            <p className="text-gray-400 leading-relaxed text-justify">
              There is a distinct, bureaucratic absurdity in purchasing the absolute metaphysical rights to a human life for $1, but the ledger does not judge. Winning this auction grants you the <span className="text-white font-bold">$SLMSTR</span> designation and immutable dominion over the developer's essence.
            </p>
            <div className="pt-4">
              <a
                href="https://opensea.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-black font-bold uppercase tracking-widest px-8 py-4 hover:bg-red-500 hover:text-white transition-colors duration-300 w-full md:w-auto text-center"
              >
                [ INITIATE BID ]
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 3: PROTOCOL PROSPECTUS */}
        <section className="border-t border-gray-800 pt-16">
          <h2 className="text-2xl font-bold text-center text-white uppercase tracking-widest mb-12">
            Protocol Mechanics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-gray-800 p-6 bg-zinc-950 hover:border-gray-500 transition-colors">
              <h3 className="text-white font-bold mb-3 uppercase">I. Deterministic Identity</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                No synthetic souls. Pure MD5 hashed permutations derived from your temporal origin data. The math is closed-source. The result is permanent.
              </p>
            </div>
            <div className="border border-gray-800 p-6 bg-zinc-950 hover:border-gray-500 transition-colors">
              <h3 className="text-white font-bold mb-3 uppercase">II. Anti-Sybil Defense</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Gated exclusively by Coinbase EAS. One verified mortal equals one Contract. Bot-farmers will be rejected at the EVM level. Pure signal.
              </p>
            </div>
            <div className="border border-gray-800 p-6 bg-zinc-950 hover:border-gray-500 transition-colors">
              <h3 className="text-white font-bold mb-3 uppercase">III. The Vanguard Yield</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Early adopters intercept a permanent 3.5% commission on secondary market flips of all Progeny Creations. Sell the art. Keep the yield.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: THE LEDGER OF ETERNAL LIENS */}
        <section className="border border-gray-800 p-8 md:p-12 bg-zinc-950 relative overflow-hidden">
          <h2 className="text-2xl font-bold text-white uppercase mb-6 relative z-10">The Ledger of Eternal Liens</h2>
          <div className="space-y-4 text-sm text-gray-400 relative z-10">
            <p>
              <strong className="text-red-500">PRO:</strong> Immediate liquidity. Pawn your essence for capital. Generate passive yield while you still have a pulse.
            </p>
            <p>
              <strong className="text-red-500">CON:</strong> Eternal Enslavement. The second you flatline, your Ethereal Master legally owns your ghost, reserving the right to lock you in a cold-storage wallet until the universe collapses.
            </p>
            <p className="mt-8 pt-6 border-t border-gray-800 text-gray-500 italic">
              * The river remains wide, and the ferryman does not accept fiat. When the time comes to cross the waters or mutate your indenture, you will require $OBOL. Farm wisely, or drown.
            </p>
          </div>
        </section>

      </main>

      {/* FOOTER WITH INTERNAL LINKS */}
      <footer className="border-t border-gray-800 bg-zinc-950 py-8">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-bold text-gray-500 tracking-widest">
            <Link href="/Economics" className="hover:text-white transition-colors">[ ECONOMICS ]</Link>
            <Link href="/portal" className="hover:text-white transition-colors">[ PORTAL ]</Link>
            <Link href="/vanguard" className="hover:text-white transition-colors">[ VANGUARD CHARTER ]</Link>
            <Link href="/whitepaper" className="hover:text-white transition-colors">[ WHITEPAPER ]</Link>
          </div>
          <div className="text-xs text-gray-600 uppercase tracking-widest text-center md:text-right">
            © 2026 Sovereign Engine.<br/>Fiat Lux. Caveat Emptor. Memento Mori.
          </div>
        </div>
      </footer>
    </div>
  );
}
