import Link from "next/link";
import SnippetBlock from "@/components/SnippetBlock";

export default function EconomicsPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8 md:p-24 relative">
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,255,255,0.01),rgba(255,255,255,0.01),rgba(255,255,255,0.01))] bg-[length:100%_2px,3px_100%] opacity-20"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <nav className="mb-16 flex justify-between items-center border-b border-white/10 pb-8">
          <Link href="/" className="text-[10px] tracking-[0.4em] uppercase opacity-50 hover:opacity-100 transition-opacity">
            ← Back to Genesis
          </Link>
          <div className="text-[10px] tracking-[0.4em] uppercase opacity-30">
            Economic Intelligence // Protocol v1.0
          </div>
        </nav>

        <header className="mb-20">
          <h1 className="text-5xl md:text-7xl font-light uppercase tracking-[0.4em] mb-6">
            Economic Mandates
          </h1>
          <p className="text-base tracking-[0.5em] opacity-40 uppercase">
            Sovereign Engine Protocol Liquidity & Utility Models
          </p>
        </header>

        <div className="space-y-20">
          {/* Pillar 1: Vanguard Protocol */}
          <section>
            <div className="flex items-center gap-4 mb-12">
              <div className="h-[1px] flex-1 bg-white/10"></div>
              <h2 className="text-xs font-bold uppercase tracking-[0.6em] text-white">The Vanguard Protocol</h2>
              <div className="h-[1px] flex-1 bg-white/10"></div>
            </div>
            <p className="text-base opacity-50 mb-12 max-w-2xl italic">
              "Sell the art. Keep the yield. Own the infrastructure."
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <SnippetBlock
                title="Immutable Indenture Yield"
                content="3.5% perpetual royalty routed to the original Vanguard wallet on every secondary market transaction."
                label="REVENUE_STREAM"
              />
              <SnippetBlock
                title="Passive $OBOL Farming"
                content="Vanguard status allows wallets to accumulate $OBOL over time, securing the next phase of economy."
                label="ASSET_ACCUMULATION"
              />
              <SnippetBlock
                title="Execution Subsidies"
                content="Hardcoded, permanent discounts on all future engine iterations (Phase 2 & 3)."
                label="UPGRADE_PATH"
              />
            </div>
          </section>

          {/* Pillar 2: Collector's Dilemma */}
          <section>
            <div className="flex items-center gap-4 mb-12">
              <div className="h-[1px] flex-1 bg-white/10"></div>
              <h2 className="text-xs font-bold uppercase tracking-[0.6em] text-white">The Collector's Dilemma</h2>
              <div className="h-[1px] flex-1 bg-white/10"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-xl font-light uppercase tracking-widest">Verifiable Existence</h3>
                <p className="text-base opacity-60 leading-relaxed">
                  Moving beyond speculative PFP culture. We tokenize the ultimate scarce asset: <span className="text-white">Human Existence</span>. Leveraging Coinbase EAS for absolute, KYC-verified certainty.
                </p>
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-light uppercase tracking-widest">The Scarcity Loop</h3>
                <p className="text-base opacity-60 leading-relaxed">
                  Secondary collectors must purchase $OBOL liquidity directly from Vanguard early adopters to participate in upgrades, creating a robust, player-driven micro-economy.
                </p>
              </div>
            </div>
          </section>

          {/* Pillar 3: The Sovereign API */}
          <section>
            <div className="flex items-center gap-4 mb-12">
              <div className="h-[1px] flex-1 bg-white/10"></div>
              <h2 className="text-xs font-bold uppercase tracking-[0.6em] text-white">The Sovereign API</h2>
              <div className="h-[1px] flex-1 bg-white/10"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 border border-white/10 bg-white/[0.02]">
                <h4 className="text-xs font-bold tracking-[0.3em] uppercase text-white/70 mb-4">Character Primitive</h4>
                <p className="text-sm opacity-50 leading-relaxed">
                  Standardized 7-core stats (Vitality, Vigor, Intuition, Resolve, Intellect, Spirit, Charisma) for instant integration into on-chain gaming and metaverses.
                </p>
              </div>
              <div className="p-8 border border-white/10 bg-white/[0.02]">
                <h4 className="text-xs font-bold tracking-[0.3em] uppercase text-white/70 mb-4">Metaphysical Credit</h4>
                <p className="text-sm opacity-50 leading-relaxed">
                  KYC-backed human presence allows DeFi protocols to leverage Personhood Contracts as an immutable, under-collateralized "Credit Score."
                </p>
              </div>
              <div className="p-8 border border-white/10 bg-white/[0.02]">
                <h4 className="text-xs font-bold tracking-[0.3em] uppercase text-white/70 mb-4">Sybil Annihilation</h4>
                <p className="text-sm opacity-50 leading-relaxed">
                  Zero-knowledge proof of humanity for DAOs. Instantly inherit flawless Sybil-resistance by requiring Personhood Contract ownership for voting.
                </p>
              </div>
              <div className="p-8 border border-white/10 bg-white/[0.02]">
                <h4 className="text-xs font-bold tracking-[0.3em] uppercase text-white/70 mb-4">Reputation Locking</h4>
                <p className="text-sm opacity-50 leading-relaxed">
                  Integration with Lens/Farcaster to gate "human-only" channels, eliminating bot spam and AI-generated engagement.
                </p>
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-40 pt-12 border-t border-white/10 text-center">
          <p className="text-[10px] tracking-[0.5em] opacity-30 uppercase">
            Execution is immutable. The ledger is permanent.
          </p>
        </footer>
      </div>
    </main>
  );
}
