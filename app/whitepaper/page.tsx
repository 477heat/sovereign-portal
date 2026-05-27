import Link from "next/link";

export default function ExecutiveSummaryPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8 md:p-24 relative overflow-x-hidden font-mono">
      {/* Background Scanline/Gradient Effect */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,255,255,0.01),rgba(255,255,255,0.01),rgba(255,255,255,0.01))] bg-[length:100%_2px,3px_100%] opacity-20 z-0"></div>
      
      {/* Subtle "Tunnel" Glow to match Portal Page */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[160px] bg-white/[0.05]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header / Navigation */}
        <nav className="mb-20 flex justify-between items-center border-b border-white/10 pb-8">
          <Link href="/" className="text-[10px] tracking-[0.4em] uppercase opacity-50 hover:opacity-100 transition-opacity">
            ← Back to SovEng
          </Link>
          <div className="text-[10px] tracking-[0.4em] uppercase opacity-30">
            Protocol Documentation // Version 1.0.4
          </div>
        </nav>

        <header className="mb-32">
          <div className="inline-block px-3 py-1 border border-white/20 text-[10px] tracking-[0.3em] uppercase mb-6 opacity-60">
            Classification: Restricted // Subject: Sovereign Engine Protocol
          </div>
          <h1 className="text-5xl md:text-7xl font-light uppercase tracking-tighter mb-8 leading-none">
            The Sovereign <br /> <span className="opacity-50">Manifesto</span>
          </h1>
          <div className="h-px w-full bg-gradient-to-r from-white/40 to-transparent mb-8"></div>
          <p className="text-xl text-gray-400 max-w-2xl leading-relaxed font-sans">
            Codifying the shift from speculative assets to cryptographically verifiable human existence.
          </p>
        </header>

        <div className="space-y-40">
          
          {/* 1. INTRODUCTION */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs opacity-30">01</span>
              <h2 className="text-xl uppercase tracking-[0.2em] font-bold">Introduction & Founder&apos;s Note</h2>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>
            <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-sans">
              <p>
                The Web3 consumer landscape is shifting away from speculative, low-utility assets toward utility-driven, cryptographically verifiable on-chain experiences. The <span className="text-white font-semibold">Sovereign Engine Protocol</span> is an advanced decentralized application (dApp) designed to tokenize verified human existence into an immutable digital asset known as a <span className="italic text-white">Personhood Contract</span>.
              </p>
              <p className="border-l-2 border-white/20 pl-6 italic text-gray-400">
                &quot;As a sole owner and developer, I have invested countless hours architecting, coding, and refining this multi-stack infrastructure. The goal was to build a foundational &apos;Identity Lego&apos; for the broader Web3 space—a secure, Sybil-resistant, and dynamically generated metaphysical registry built on the Base Layer-2 network.&quot;
              </p>
            </div>
          </section>

          {/* 2. PROOF OF PERSONHOOD */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs opacity-30">02</span>
              <h2 className="text-xl uppercase tracking-[0.2em] font-bold">Proof of Personhood & Privacy</h2>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>
            
            <div className="grid grid-cols-1 gap-12">
              <div className="group p-8 border border-white/10 bg-white/[0.02] hover:border-white/30 transition-colors">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  The EAS Bottleneck (Sybil Resistance)
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  The protocol establishes an absolute one-to-one ratio between verified humans and on-chain assets. Before interaction, the frontend queries the <span className="text-white">Coinbase Ethereum Attestation Service (EAS)</span>. If the wallet lacks a &quot;Verified Account&quot; attestation, the transaction is blocked at the EVM level.
                </p>
              </div>

              <div className="group p-8 border border-white/10 bg-white/[0.02] hover:border-white/30 transition-colors">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  The Cryptographic Soul Anchor (Data Privacy)
                </h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Protecting Personally Identifiable Information (PII) is paramount. Our strict zero-retention policy ensures user data is never stored permanently.
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-gray-500 uppercase">
                  <li className="flex items-center gap-2"><span className="text-white">→</span> AWS Lambda Volatile Memory (3-5s)</li>
                  <li className="flex items-center gap-2"><span className="text-white">→</span> Irreversible AES Encryption</li>
                  <li className="flex items-center gap-2"><span className="text-white">→</span> Metadata Soul Anchor Injection</li>
                  <li className="flex items-center gap-2"><span className="text-white">→</span> Zero Permanent PII Storage</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. DECOUPLED ARCHITECTURE */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs opacity-30">03</span>
              <h2 className="text-xl uppercase tracking-[0.2em] font-bold">The Decoupled Architecture</h2>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>
            
            <div className="relative">
              {/* Vertical Line connecting nodes */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent hidden md:block"></div>
              
              <div className="space-y-12">
                {[
                  {
                    title: "The Portal (Frontend)",
                    desc: "Next.js/React application hosted on Vercel. Acts as the bureaucratic interface, verifying EAS status and passing secure intake data.",
                    tags: ["Next.js", "Vercel", "React"]
                  },
                  {
                    title: "The Metaphysical Forge (Backend)",
                    desc: "Serverless Python architecture on AWS Lambda. Deterministically calculates unique user stats: Intellect, Vigor, Spirit, Vitality, Intuition, Resolve, and Charisma.",
                    tags: ["Python", "AWS Lambda", "Sovereign Engine"]
                  },
                  {
                    title: "The Hybrid Cryptographic Burner",
                    desc: "Uses Pillow (PIL) to dynamically composite 4K assets, physically burning personalized initials and a 12-character Hash ID onto the digital parchment. Uploaded via Pinata IPFS.",
                    tags: ["Pillow", "IPFS", "4K Composition"]
                  },
                  {
                    title: "The Ledger (Smart Contract)",
                    desc: "Solidity-based, deployed on Base via Thirdweb. Restricts minting exclusively to the AWS backend server wallet.",
                    tags: ["Solidity", "Base", "Thirdweb"]
                  }
                ].map((item, idx) => (
                  <div key={idx} className="relative md:pl-12 group">
                    <div className="absolute left-[-4px] top-2 w-2 h-2 bg-black border border-white rounded-full z-10 group-hover:bg-white transition-colors"></div>
                    <h3 className="text-lg text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed mb-4 font-sans">{item.desc}</p>
                    <div className="flex gap-2">
                      {item.tags.map(tag => (
                        <span key={tag} className="text-[9px] px-2 py-1 border border-white/10 text-gray-500 uppercase tracking-widest">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. TOKENOMICS */}
          <section className="bg-white/[0.02] border border-white/10 p-8 md:p-16">
            <div className="flex items-center gap-4 mb-12">
              <span className="text-xs opacity-30">04</span>
              <h2 className="text-xl uppercase tracking-[0.2em] font-bold">Tokenomics & The Vanguard Charter</h2>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white">The Vanguard Status</h3>
                <p className="text-gray-400 leading-relaxed font-sans">
                  The cryptographic wallet that originally mints a Phase 1 Genesis Soul Contract is permanently granted <span className="text-white">Vanguard status</span>. This status is irrevocably bound to the original wallet, even through secondary market transfers.
                </p>
                <p className="text-xs leading-relaxed text-gray-500">
                  Potestas Contractus: the contract can mint the ERC-721 deed,
                  record the original minter, expose metadata and royalty info,
                  permit transfers while enabled, and support a controlled
                  owner-reviewed burn path. The upgradeable master contract can
                  also support later aesthetic or metadata implementations,
                  subject to upgrade authority and metadata-freeze limits.
                  Future benefits require future published terms.
                </p>
              </div>
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white">Royalty Signal</h3>
                <p className="text-gray-400 leading-relaxed font-sans">
                  The intended Genesis royalty path uses ERC-2981 marketplace signaling with a 7% total royalty, split 50/50 when the sale venue honors and routes royalties:
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-xs text-gray-500 uppercase">3.5% Vanguard Share</span>
                    <span className="text-xs text-white">To Original Vanguard</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-xs text-gray-500 uppercase">3.5% Architect&apos;s Tithe</span>
                    <span className="text-xs text-white">To Sovereign R&D</span>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-gray-500">
                  Caveat Mercator: royalties are not universal law. They depend on marketplace support, proper routing, and the contract actually receiving funds to split.
                </p>
              </div>
            </div>
          </section>

          {/* 5. FUTURE TRAJECTORY */}
          <section className="pb-32">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs opacity-30">05</span>
              <h2 className="text-xl uppercase tracking-[0.2em] font-bold">Future Trajectory: Phase 2</h2>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 border border-white/5">
                <h4 className="text-xs font-bold uppercase mb-4 text-white">The Ferryman&apos;s Toll ($OBOL)</h4>
                <p className="text-sm text-gray-500 leading-relaxed">A future-token idea reserved for later published terms. No automatic farming is active in the Genesis mint.</p>
              </div>
              <div className="p-6 border border-white/5">
                <h4 className="text-xs font-bold uppercase mb-4 text-white">Progeny Constructs</h4>
                <p className="text-sm text-gray-500 leading-relaxed">A future Engine branch that may use Genesis stats and verified wallet history, subject to terms published on the site.</p>
              </div>
              <div className="p-6 border border-white/5">
                <h4 className="text-xs font-bold uppercase mb-4 text-white">Asset Forfeiture & Upgrade</h4>
                <p className="text-sm text-gray-500 leading-relaxed">A burn request path may be offered only to the original holder before sale or transfer, with owner review and burn fee controls.</p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
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
