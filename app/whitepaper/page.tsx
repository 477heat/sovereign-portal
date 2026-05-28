import Link from "next/link";
import TunnelBackdrop from "@/components/TunnelBackdrop";

export default function ExecutiveSummaryPage() {
  return (
    <main className="relative isolate min-h-screen overflow-x-hidden bg-black p-8 font-mono text-white md:p-24">
      <TunnelBackdrop />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header / Navigation */}
        <nav className="mb-20 flex flex-wrap items-center justify-between gap-4 border-b border-cyan-200/15 bg-black/80 px-4 py-5 text-xs uppercase tracking-[0.22em] text-white/70 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl md:text-sm">
          <Link href="/" className="chamfer-nav-link chamfer-nav-link--compact">
            Back to SovEng
          </Link>
          <div className="text-[11px] tracking-[0.28em] text-cyan-100/55">
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
            Defining Sovereign Engine as a deterministic character/stat engine,
            with the Soul Deed as its first access token.
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
                Sovereign Engine is broader than the first Soul Deed mint. It is
                a deterministic character and stat engine that parses individual
                source data into constant traits because the source is not
                random. The <span className="text-white font-semibold">Certificate of Title for Soul Ownership</span> is
                the first public access token and funding mechanism for that
                broader Engine.
              </p>
              <p className="border-l-2 border-white/20 pl-6 italic text-gray-400">
                &quot;As a sole owner and developer, I have invested countless hours
                architecting, coding, and refining this multi-stack
                infrastructure. The goal is a wallet-linked, Base-native Engine
                where real people create real character origins, not a random
                generator, bot farm, or empty-wallet prize loop.&quot;
              </p>
            </div>
          </section>

          {/* 2. WALLET LINKAGE */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs opacity-30">02</span>
              <h2 className="text-xl uppercase tracking-[0.2em] font-bold">Wallet Linkage & Privacy</h2>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>
            
            <div className="grid grid-cols-1 gap-12">
              <div className="group p-8 border border-white/10 bg-white/[0.02] hover:border-white/30 transition-colors">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  Wallet-linked eligibility
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  The protocol uses wallet-linked eligibility checks before the
                  Genesis mint. Before interaction, the frontend queries the <span className="text-white">Coinbase Ethereum Attestation Service (EAS)</span>.
                  If the wallet lacks the required attestation, the mint path
                  remains unavailable.
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
                    desc: "Next.js/React application hosted on Vercel. Handles wallet-linked EAS eligibility, payment, agreement, and secure intake flow.",
                    tags: ["Next.js", "Vercel", "React"]
                  },
                  {
                    title: "The Metaphysical Forge (Backend)",
                    desc: "Serverless Python architecture on AWS Lambda. Deterministically calculates the user's Engine stats from source data rather than random generation.",
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
              <h2 className="text-xl uppercase tracking-[0.2em] font-bold">Access, Royalties & The Vanguard Charter</h2>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white">Vanguard Status</h3>
                <p className="text-gray-400 leading-relaxed font-sans">
                  The cryptographic wallet that originally mints a Certificate
                  of Title for Soul Ownership is treated as a <span className="text-white">Day One supporter</span> wallet
                  with Vanguard status. This status is intended to remain bound
                  to the original wallet, even through secondary market
                  transfers.
                </p>
                <p className="text-xs leading-relaxed text-gray-500">
                  Potestas Contractus: the contract can mint the ERC-721 deed,
                  record the original minter, expose metadata and royalty info,
                  permit transfers while enabled, and support a controlled
                  owner-reviewed burn path. The upgradeable master contract can
                  also support later aesthetic or metadata implementations,
                  subject to upgrade authority and metadata-freeze limits.
                  Soul Deed Access token holders are guaranteed access to
                  Progeny when that Engine branch opens. The exact interface and
                  mint mechanics require future published terms.
                </p>
              </div>
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white">Royalty Signal</h3>
                <p className="text-gray-400 leading-relaxed font-sans">
                  The intended Genesis royalty-routing path uses ERC-2981 marketplace signaling with a 7% total royalty, split 50/50 when the sale venue honors and routes royalties:
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-xs text-gray-500 uppercase">3.5% Vanguard Share</span>
                    <span className="text-xs text-white">To Original Vanguard Wallet</span>
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
                <h4 className="text-xs font-bold uppercase mb-4 text-white">Access Tokens</h4>
                <p className="text-sm text-gray-500 leading-relaxed">The Soul Deed is the first access token. Future access tokens may qualify holders for the same guaranteed Progeny access path.</p>
              </div>
              <div className="p-6 border border-white/5">
                <h4 className="text-xs font-bold uppercase mb-4 text-white">Progeny Constructs</h4>
                <p className="text-sm text-gray-500 leading-relaxed">A guaranteed-access Engine branch for qualifying access-token holders. The interface, mint flow, and lineage NFT format still need published implementation terms.</p>
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
