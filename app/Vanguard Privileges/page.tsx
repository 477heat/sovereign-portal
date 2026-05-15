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

        <div className="grid grid-cols-1 gap-12">
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
