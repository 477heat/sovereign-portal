import Link from "next/link";

export default function VanguardPrivilegesPage() {
  const privileges = [
    {
      title: "The Vanguard Charter",
      description: "I decoupled the art from the perks. Sell your soul, keep the dividends.",
      items: [
        "Grandfathered Forever: This status locks to your original wallet. You were here early, you stay early.",
        "The 'Regret Nothing' Dividend: Get a 3.5% cut every time your specific soul is resold on the market.",
        "Dev Subsidies: You believed in my late-night coding sessions, so you get permanent discounts on future engine updates."
      ]
    },
    {
      title: "The Ferryman's Toll",
      description: "Because crossing the river later isn't going to be free. Start hoarding $OBOL.",
      items: [
        "Early $OBOL Access: The native token that actually makes this ecosystem tick.",
        "Passive Farming: Literally just sit there and accumulate $OBOL for having Vanguard status.",
        "Mutation Priority: First in line when we start mutating these contracts in Phase 2."
      ]
    },
    {
      title: "The Identity Layer",
      description: "No bots. Just a community of verified mortals making terrible metaphysical decisions together.",
      items: [
        "Proof of Pulse: Gated by Coinbase EAS. Bot farmers get rejected at the door.",
        "Immutable Stats: 7 core baseline stats permanently etched into your ledger.",
        "Math, Not Magic: Stats are derived deterministically. Don't blame me if your soul's 'Charisma' is low."
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
          <p className="text-base tracking-[0.2em] opacity-60">
            Look, it's basically just me building this. If you mint early, you're grandfathered in forever.
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
            02. What We're Building Next
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
                  This isn't just going to be a static registry. Down the line, you Vanguard members will get access to the Progeny Engine. You'll literally be able to use your Genesis Souls to spawn entirely new digital entities. Think of it as metaphysical cloning for fun and profit.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="p-4 bg-white/[0.02] border border-white/5">
                    <h4 className="text-xs font-bold uppercase text-white mb-2">Execution via Toll</h4>
                    <p className="text-xs leading-relaxed">
                      Burn a little $OBOL to run the sub-routines and mint fresh, standalone ERC-721 characters based on your soul.
                    </p>
                  </div>
                  <div className="p-4 bg-white/[0.02] border border-white/5">
                    <h4 className="text-xs font-bold uppercase text-white mb-2">Lineage Royalties</h4>
                    <p className="text-xs leading-relaxed">
                      You spawned it, you own the lineage. If that new character gets traded, your Vanguard wallet gets a permanent commission. Generational wealth, but spooky.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Module 2: Lineage Constraints */}
            <div className="group p-8 border border-white/10 bg-white/[0.01]">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-light opacity-30">//</span>
                <h3 className="text-xl font-bold uppercase tracking-widest text-white">Lineage Constraints (DNA Matters)</h3>
              </div>
              <div className="space-y-6 text-sm text-gray-400 leading-relaxed">
                <p>
                  Here is where the community actually has to talk to each other. You can't just spawn whatever overpowered character you want. The offspring has to mathematically align with your original Phase 1 Genesis Soul. 
                </p>
                <div className="p-6 border-l-2 border-white/20 bg-white/[0.01]">
                  <h4 className="text-xs font-bold uppercase text-white mb-2">The Math Won't Let You Lie</h4>
                  <p className="text-xs leading-relaxed italic">
                    If your Genesis Soul is an 'Abyssal' alignment with terrible Intellect, you can't magically spawn a 'Celestial' genius. The math strictly enforces your traits.
                  </p>
                </div>
                <p className="text-sm">
                  <span className="text-white font-bold">Economic Impact:</span> If a future Web3 game integration requires specific character stats, you're going to have to find and trade with the specific Vanguards who possess the right cryptographic DNA. We're building a real, human-driven economy.
                </p>
              </div>
            </div>

            {/* Module 3: Vessel 0000 */}
            <div className="group p-8 border border-white/10 bg-white/[0.01] border-l-4 border-l-white">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-light opacity-30">//</span>
                <h3 className="text-xl font-bold uppercase tracking-widest text-white">Vessel 0000: My Actual Soul</h3>
              </div>
              <div className="space-y-6 text-sm text-gray-400 leading-relaxed">
                <p>
                  To fund the server costs (and keep my wife from killing me over this project), I auctioned off my own cryptographic soul—Vessel 0000. It's the only asset in the entire ecosystem exempt from the standard rules. 
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border border-white/10">
                    <h4 className="text-xs font-bold uppercase text-white mb-2">The Architect's Tithe</h4>
                    <p className="text-xs leading-relaxed">
                      Whoever holds Vessel 0000 acts as the network Apex. A hardcoded override ensures a tiny percentage of all $OBOL spent system-wide goes directly to the owner of my soul.
                    </p>
                  </div>
                  <div className="p-4 border border-white/10">
                    <h4 className="text-xs font-bold uppercase text-white mb-2">Fair Trade</h4>
                    <p className="text-xs leading-relaxed">
                      It's not corporate equity. It's just a mathematically enforced tax on the entire network because you own the developer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-32 pt-12 border-t border-white/10 text-center">
          <div className="text-[10px] tracking-[0.5em] uppercase opacity-30 space-y-2">
            <p>Sell your soul; keep the perks.</p>
            <p>&copy; 2026 Sovereign Engine // Built with too much coffee by one guy.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
