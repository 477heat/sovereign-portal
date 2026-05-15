import Link from "next/link";

export default function VanguardPrivilegesPage() {
  const privileges = [
    {
      title: "The Vanguard Charter",
      description: "The fundamental decoupling of the visual asset from economic privilege.",
      items: [
        "Non-Transferable Status: Bound permanently to the originating wallet.",
        "Perpetual Dividend: 3.5% royalty on all secondary market sales.",
        "Execution Subsidies: Permanent discounts on all future engine iterations."
      ]
    },
    {
      title: "The Ferryman's Toll",
      description: "The economic engine of the Sovereign ecosystem.",
      items: [
        "Native $OBOL Access: Early access to the ecosystem's utility token.",
        "Passive Farming: Accumulate $OBOL simply by holding Vanguard status.",
        "Attribute Ascension: Priority upgrades for Phase 2 profile mutations."
      ]
    },
    {
      title: "The Identity Layer",
      description: "The cryptographic foundation of your digital existence.",
      items: [
        "Verified Humanity: Absolute certainty through Coinbase EAS integration.",
        "Immutable Stats: 7 core baseline stats etched into the soul.",
        "Deterministic Scaling: Unique, mathematically-derived identity attributes."
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-black text-white p-8 md:p-24 relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,255,255,0.01),rgba(255,255,255,0.01),rgba(255,255,255,0.01))] bg-[length:100%_2px,3px_100%] opacity-20"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <nav className="mb-16 flex justify-between items-center border-b border-white/10 pb-8">
          <Link href="/" className="text-[10px] tracking-[0.4em] uppercase opacity-50 hover:opacity-100 transition-opacity">
            ← Back to Genesis
          </Link>
          <div className="text-[10px] tracking-[0.4em] uppercase opacity-30">
            Access Level // Vanguard
          </div>
        </nav>

        <header className="mb-20">
          <h1 className="text-4xl md:text-6xl font-light uppercase tracking-[0.3em] mb-6">
            Vanguard Privileges
          </h1>
          <p className="text-base tracking-[0.4em] opacity-40 uppercase">
            Tier 0 Access: The Sovereign Charter
          </p>
        </header>

        {/* CORE PRIVILEGES GRID */}
        <div className="grid grid-cols-1 gap-12 mb-32">
          {privileges.map((priv, index) => (
            <section key={index} className="p-8 md:p-12 border border-white/10 bg-white/[0.01] backdrop-blur-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-widest text-white mb-2">{priv.title}</h2>
                  <p className="text-sm opacity-50">{priv.description}</p>
                </div>
                <div className="text-[10px] font-mono opacity-30 tracking-widest">
                  PRIVILEGE_ID_{index + 1}
                </div>
              </div>
              
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {priv.items.map((item, i) => (
                  <li key={i} className="text-sm text-gray-400 leading-relaxed border-l border-white/10 pl-4">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* ADVANCED PROTOCOL MODULES */}
        <section className="mb-32">
          <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-white mb-12 border-l-2 border-white pl-4">
            02. Advanced Protocol Modules
          </h2>

          <div className="space-y-12">
            {/* Module 1: Progeny Engine */}
            <div className="group p-8 border border-white/10 bg-white/[0.01]">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-light opacity-30">//</span>
                <h3 className="text-xl font-bold uppercase tracking-widest text-white">The Progeny Construct Engine</h3>
              </div>
              <div className="space-y-6 text-sm text-gray-400 leading-relaxed">
                <p>
                  The Sovereign ecosystem will not remain a static registry. In future deployments, Vanguard Charter holders will be granted access to the Progeny Construct Engine. This system transforms early adopters from mere collectors into active metaphysical architects.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="p-4 bg-white/[0.02] border border-white/5">
                    <h4 className="text-xs font-bold uppercase text-white mb-2">Execution via Toll</h4>
                    <p className="text-xs leading-relaxed">
                      Vanguard members may expend (burn) $OBOL to execute algorithmic sub-routines, minting entirely new, standalone ERC-721 digital entities (Characters/Progeny).
                    </p>
                  </div>
                  <div className="p-4 bg-white/[0.02] border border-white/5">
                    <h4 className="text-xs font-bold uppercase text-white mb-2">Lineage Royalties</h4>
                    <p className="text-xs leading-relaxed">
                      When a Vanguard member utilizes their Genesis Soul to mint a Progeny Construct, their wallet is permanently hardcoded as the "Lineage Architect." If that character is sold, the original Vanguard wallet receives a permanent commission.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Module 2: Lineage Constraints */}
            <div className="group p-8 border border-white/10 bg-white/[0.01]">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-light opacity-30">//</span>
                <h3 className="text-xl font-bold uppercase tracking-widest text-white">Metaphysical Lineage Constraints</h3>
              </div>
              <div className="space-y-6 text-sm text-gray-400 leading-relaxed">
                <p>
                  To ensure absolute scarcity and foster a player-driven, decentralized economy, the creation of Progeny Constructs is strictly governed by the statistical makeup of the user's Phase 1 Genesis Soul.
                </p>
                <div className="p-6 border-l-2 border-white/20 bg-white/[0.01]">
                  <h4 className="text-xs font-bold uppercase text-white mb-2">The Constraint</h4>
                  <p className="text-xs leading-relaxed italic">
                    A Genesis Soul may only spawn subordinate characters that mathematically align with its own core stats and elemental affinity.
                  </p>
                </div>
                <p className="text-sm">
                  <span className="text-white font-bold">Economic Impact:</span> This forces a highly liquid marketplace. If a future Web3 integration requires specific character classes, users must trade with Vanguard members whose Genesis Souls possess the correct cryptographic traits.
                </p>
              </div>
            </div>

            {/* Module 3: Vessel 0000 */}
            <div className="group p-8 border border-white/10 bg-white/[0.01] border-l-4 border-l-white">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-light opacity-30">//</span>
                <h3 className="text-xl font-bold uppercase tracking-widest text-white">Vessel 0000: The Architect's Tithe</h3>
              </div>
              <div className="space-y-6 text-sm text-gray-400 leading-relaxed">
                <p>
                  The inaugural asset of the Sovereign Engine—Vessel 0000 (The Founder's Soul)—is exempt from standard operational constraints and carries unique, hardcoded network privileges.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border border-white/10">
                    <h4 className="text-xs font-bold uppercase text-white mb-2">The Architect's Tithe</h4>
                    <p className="text-xs leading-relaxed">
                      The wallet holding Vessel 0000 is designated as the network Apex. A hardcoded smart contract override ensures a percentage of all $OBOL expended system-wide for Progeny generation is routed to this holder.
                    </p>
                  </div>
                  <div className="p-4 border border-white/10">
                    <h4 className="text-xs font-bold uppercase text-white mb-2">Status</h4>
                    <p className="text-xs leading-relaxed">
                      Holding Vessel 0000 is not legal corporate equity; it is an on-chain, mathematical claim to the algorithmic exhaust (revenue) of the entire Sovereign Engine network.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-32 pt-12 border-t border-white/10 text-center">
          <div className="text-[10px] tracking-[0.5em] uppercase opacity-30 space-y-2">
            <p>Relinquish the vessel; retain the yield.</p>
            <p>&copy; 2026 Sovereign Contracts Registry</p>
          </div>
        </footer>
      </div>
    </main>
  );
}

