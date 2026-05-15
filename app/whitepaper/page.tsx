import Link from "next/link";

export default function ExecutiveSummaryPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8 md:p-24 relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,255,255,0.01),rgba(255,255,255,0.01),rgba(255,255,255,0.01))] bg-[length:100%_2px,3px_100%] opacity-20"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <nav className="mb-16 flex justify-between items-center border-b border-white/10 pb-8">
          <Link href="/" className="text-[10px] tracking-[0.4em] uppercase opacity-50 hover:opacity-100 transition-opacity">
            ← Back to SovEng
          </Link>
          <div className="text-[10px] tracking-[0.4em] uppercase opacity-30">
            Briefing // Executive Summary
          </div>
        </nav>

        <header className="mb-24">
          <div className="inline-block px-3 py-1 border border-white/20 text-[10px] tracking-[0.3em] uppercase mb-6 opacity-60">
            Project: Sovereign Engine Protocol // Network: Base Sepolia
          </div>
          <h1 className="text-4xl md:text-6xl font-light uppercase tracking-[0.2em] mb-6">
            Standard Practices & Procedures
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
            Codifying the operational architecture, cryptographic safeguards, and economic mandates governing the Sovereign Engine ecosystem.
          </p>
        </header>

        {/* SECTION 1: OPERATIONAL ARCHITECTURE */}
        <section className="mb-32">
          <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-white mb-12 border-l-2 border-white pl-4">
            01. System Architecture
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Frontend */}
            <div className="p-8 border border-white/10 bg-white/[0.02]">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-white">Frontend (Sovereign-Portal)</h3>
              <p className="text-xs text-gray-500 mb-4 font-mono uppercase">Stack: Next.js | TypeScript | Tailwind | Vercel</p>
              <ul className="text-sm text-gray-400 space-y-3 list-disc list-inside">
                <li>Thirdweb SDK for secure wallet integration.</li>
                <li>Strict enforcement of Base Sepolia Testnet.</li>
                <li>Optimized SSG/ISR for high-performance loading.</li>
                <li>EAS Verification Gate (Planned implementation).</li>
              </ul>
            </div>

            {/* Backend */}
            <div className="p-8 border border-white/10 bg-white/[0.02]">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-white">Backend (SovereignEngine)</h3>
              <p className="text-xs text-gray-500 mb-4 font-mono uppercase">Stack: Python | AWS Lambda (Serverless)</p>
              <ul className="text-sm text-gray-400 space-y-3 list-disc list-inside">
                <li><span className="text-white">astro_engine.py:</span> Statistical calculations.</li>
                <li><span className="text-white">image_identity_burner.py:</span> Hashing & compositing.</li>
                <li>Secure AES Secret & Private Key management via AWS Env.</li>
                <li>Authenticated API endpoints via secure POST requests.</li>
              </ul>
            </div>

            {/* Storage */}
            <div className="p-8 border border-white/10 bg-white/[0.02]">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-white">Decentralized Storage</h3>
              <p className="text-xs text-gray-500 mb-4 font-mono uppercase">Stack: Pinata IPFS API</p>
              <ul className="text-sm text-gray-400 space-y-3 list-disc list-inside">
                <li>Explicit pinning for image & metadata permanence.</li>
                <li>Standardized, machine-readable JSON metadata.</li>
                <li>OpenSea metadata standard compliance.</li>
              </ul>
            </div>

            {/* Ledger */}
            <div className="p-8 border border-white/10 bg-white/[0.02]">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-white">Blockchain Ledger</h3>
              <p className="text-xs text-gray-500 mb-4 font-mono uppercase">Stack: Solidity | Base Sepolia</p>
              <ul className="text-sm text-gray-400 space-y-3 list-disc list-inside">
                <li>Restricted Minting via dedicated Server Wallet.</li>
                <li>Mandatory permission checks on {@code mintTo}.</li>
                <li>Testnet-first deployment strategy.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 2: THE PIPELINE */}
        <section className="mb-32">
          <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-white mb-12 border-l-2 border-white pl-4">
            02. Operational Pipeline (The Minting Flow)
          </h2>

          <div className="space-y-4">
            {[
              { step: "01", label: "Intake", desc: "User connects wallet via Vercel and completes EAS verification." },
              { step: "02", label: "Submission", desc: "Secure POST request triggers AWS Lambda with encrypted identity data." },
              { step: "03", label: "Forging", desc: "Astro-engine calculates stats; Identity-burner creates unique hashed image." },
              { step: "04", label எழுத="Vaulting", desc: "Lambda uploads PNG and Metadata JSON to Pinata IPFS." },
              { step: "05", label: "Execution", desc: "Server Wallet signs and executes mintTo on Base Sepolia." },
              { step: "06", label: "Finalization", desc: "Vanguard Charter is initialized; transaction confirmed to frontend." }
            ].map((item, i) => (
              <div key={i} className="flex gap-8 items-start group">
                <div className="text-xl font-light opacity-20 group-hover:opacity-100 transition-opacity pt-1">
                  {item.step}
                </div>
                <div className="flex-1 pb-8 border-b border-white/5">
                  <h4 className="text-sm font-bold uppercase tracking-widest mb-1">{item.label}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: PRIVACY & DATA */}
        <section className="mb-32">
          <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-white mb-12 border-l-2 border-white pl-4">
            03. Data Sanctity & Privacy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-white/[0.01] border border-white/10">
              <h3 className="text-sm font-bold uppercase mb-4">Minimization Protocol</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                No raw PII (Names, DOBs) is stored in databases or on-chain. Identity is converted into a reversible AES "Soul Anchor" string, ensuring privacy while allowing future verification.
              </p>
            </div>
            <div className="p-8 bg-white/[0.01] border border-white/10">
              <h3 className="text-sm font-bold uppercase mb-4">Immediate Purging</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Following successful smart contract interaction, all sensitive biological and temporal data is immediately discarded from AWS Lambda temporary volatile memory.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: ECONOMICS */}
        <section className="mb-32">
          <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-white mb-12 border-l-2 border-white pl-4">
            04. Economic Mandates
          </h2>
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="p-6 border border-white/10">
                  <h4 className="text-xs font-bold uppercase mb-2">Vanguard Charter</h4>
                  <p className="text-xs text-gray-400">Permanent decoupling of physical asset from economic status.</p>
               </div>
               <div className="p-6 border border-white/10">
                  <h4 className="text-xs font-bold uppercase mb-2">$OBOL Utility</h4>
                  <p className="text-xs text-gray-400">The mandatory Ferryman's Toll for all Phase 2 mutations.</p>
               </div>
               <div className="p-6 border border-white/10">
                  <h4 className="text-xs font-bold uppercase mb-2">Yield Model</h4>
                  <p className="text-xs text-gray-400">3.5% perpetual smart-contract routed secondary royalties.</p>
               </div>
            </div>
            <div className="p-8 border border-white/10 bg-white/[0.02]">
              <h3 className="text-sm font-bold uppercase mb-4">Tokenomics Philosophy</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                We explicitly reject standard meme-coin supply procedures. The $OBOL supply is designed to be boundless, mirroring the infinite deterministic permutations of the Sovereign Engine itself.
              </p>
            </div>
          </div>
        </section>

        <footer className="pt-12 border-t border-white/10 text-center">
          <div className="text-[10px] tracking-[0.5em] uppercase opacity-30 space-y-2">
            <p>Fiat Lux • Caveat Emptor • Memento Mori</p>
            <p>&copy; 2026 Sovereign Contracts Registry</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
