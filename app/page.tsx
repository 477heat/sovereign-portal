import Link from "next/link";
import Image from "next/image";

export default function WhitepaperPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8 md:p-24 relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,255,255,0.01),rgba(255,255,255,0.01),rgba(255,255,255,0.01))] bg-[length:100%_2px,3px_100%] opacity-20"></div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <nav className="mb-16 flex justify-between items-center border-b border-white/10 pb-8">
          <Link href="/" className="text-[10px] tracking-[0.4em] uppercase opacity-50 hover:opacity-100 transition-opacity">
            ← Back to Genesis
          </Link>
          <div className="text-[10px] tracking-[0.4em] uppercase opacity-30">
            Document // Unrestricted
          </div>
        </nav>

        <header className="mb-20 text-center">
          <h1 className="text-4xl md:text-5xl font-light uppercase tracking-[0.3em] mb-6">
            Sovereign Protocol Engine
          </h1>
          <p className="text-base italic opacity-40 tracking-widest uppercase">
            A Metaphysical Contract for Proof of Concept
          </p>
          <div className="mt-12 p-6 border border-white/10 bg-white/[0.02] text-left">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-2">Notice of Compliance</p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Strict EAS verification is required. All metaphysical conveyances are executed strictly via the server-side Minter Role following successful intake.
            </p>
          </div>
        </header>

        <div className="space-y-16 text-base leading-relaxed text-gray-300">
          {/* Irreverent Summary */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-white mb-8 border-b border-white/10 pb-2">
              01. The Irreverent Summary
            </h2>
            <div className="space-y-6">
              <p>
                Forget the Faustian legalese: You are contractually shackling your actual, literal soul to an internet token so you can pawn it off to the highest bidder like the idiot founder. Upon its <span className="text-white font-bold">Initial Mint</span> you have absolute discretion to hold it, barter it, sell it, give it to your spouse. You probably owe them eternal servitude anyway.
              </p>
              <p>
                Servitude begins at the moment of <span className="text-white font-bold">DEATH</span> as per the contract agreements. You retain full physical autonomy and a small Commission while breathing, but the holder claims rights to your spirit, <span className="italic">Ex Anima</span>.
              </p>
            </div>
          </section>

          {/* Section I */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-white mb-8 border-b border-white/10 pb-2">
              02. Genesis Proof of Concept
            </h2>
            <div className="space-y-6">
              <p>
                The Genesis Soul Contract serves as the foundational Proof of Concept for a standardized metaphysical identity layer on the Base network. It is engineered as a Deterministic Developer Primitive—a plug-and-play character foundation that provides every human participant with an immutable, balanced set of baseline stats.
              </p>
              <p>
                By utilizing the Sovereign Engine to pre-calculate essence, vigor, and spirit, external developers are liberated from the architectural burden of character generation logic and Sybil-defense.
              </p>
            </div>
          </section>

          {/* Section II */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-white mb-8 border-b border-white/10 pb-2">
              03. Architecture & Mechanics
            </h2>
            <div className="space-y-6">
              <p>
                The metaphysical value of each vessel is deterministically quantified by the Sovereign Engine, a closed-source architectural framework.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="p-6 border border-white/10 bg-white/[0.01]">
                  <h3 className="text-xs font-bold uppercase mb-3 text-white">Diverse Duality</h3>
                  <p className="text-sm text-gray-400">The engine measures internal synergy and contradiction. If a user exhibits profound internal clashes, the engine triggers a 1.7x spike to their top two base stats.</p>
                </div>
                <div className="p-6 border border-white/10 bg-white/[0.01]">
                  <h3 className="text-xs font-bold uppercase mb-3 text-white">Anomalous Designations</h3>
                  <p className="text-sm text-gray-400">Mathematically constrained to produce unique permutations. Only a statistically rare subset will receive the coveted "Anomalous" designation.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section III */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-white mb-8 border-b border-white/10 pb-2">
              04. The Vanguard Charter
            </h2>
            <div className="space-y-6">
              <p>
                Minting a Phase 1 Genesis Soul Contract automatically registers the originating wallet under The Vanguard Charter.
              </p>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <span className="text-white font-bold text-xs">/01</span>
                  <p className="text-sm text-gray-400"><span className="text-white">Non-Transferable Rights:</span> The Vanguard Charter is permanently bound to the minting wallet, regardless of whether the Deed (NFT) is sold.</p>
                </li>
                <li className="flex gap-4">
                  <span className="text-white font-bold text-xs">/02</span>
                  <p className="text-sm text-gray-400"><span className="text-white">Perpetual Dividend:</span> A hardcoded 3.5% perpetual dividend on every future secondary sale of that specific contract.</p>
                </li>
                <li className="flex gap-4">
                  <span className="text-white font-bold text-xs">/03</span>
                  <p className="text-sm text-gray-400"><span className="text-white">Execution Subsidies:</span> Charter holders receive grandfathered discounts for Phase 2 and Phase 3 engine iterations.</p>
                </li>
              </ul>
              <p className="text-center italic text-sm text-gray-500 mt-12">"Relinquish the vessel; retain the yield."</p>
            </div>
          </section>

          {/* Section IV */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-white mb-8 border-b border-white/10 pb-2">
              05. Cryptographic Integrity
            </h2>
            <div className="space-y-6">
              <p>
                The engine utilizes an AES encryption key to lock the user's mortal wallet and origin data into a permanent, base64-encoded string injected directly into the ERC-721 metadata.
              </p>
              <div className="p-6 border-l-2 border-white bg-white/[0.02]">
                <p className="text-sm text-gray-400 italic">
                  The registry maintains zero persistent records of raw personal data. Once the anchor is cast, we are incapable of tracking or utilizing your origin data.
                </p>
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 text-center">
          <div className="text-[10px] tracking-[0.5em] uppercase opacity-30 space-y-2">
            <p>Fiat Lux • Caveat Emptor • Memento Mori</p>
            <p>&copy; 2026 Sovereign Contracts Registry</p>
          </div>
        </footer>
      </div>
    </main>
  );
}

