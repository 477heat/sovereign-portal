import Link from "next/link";
import TunnelBackdrop from "@/components/TunnelBackdrop";

const privileges = [
  {
    id: "01",
    title: "Vanguard Charter",
    description:
      "Day One supporter wallets keep the Vanguard status that marks the first lineage of the registry.",
    items: [
      "Vanguard status binds to the original wallet-linked mint.",
      "Royalty participation depends on ERC-2981 support and marketplace routing.",
      "Future engine iterations can recognize this wallet as an early registry actor.",
    ],
  },
  {
    id: "02",
    title: "Artifact Access",
    description:
      "Vanguard wallets become the first testers for artifacts beyond the Genesis deed.",
    items: [
      "Early access to limited preview tools.",
      "Priority for Progeny Engine experiments.",
      "Reserved metadata fields for future lineage mechanics.",
    ],
  },
  {
    id: "03",
    title: "Wallet Gate",
    description:
      "The system is being built around wallet-linked artifacts, not anonymous mint swarms.",
    items: [
      "Coinbase EAS attestation gates the mint path.",
      "The public deed uses a shortened covenant mark.",
      "The full profile uses the protected 12-stat Genesis framework.",
    ],
  },
];

export default function VanguardPrivilegesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-5 py-6 text-white md:px-8">
      <TunnelBackdrop />

      <div className="mx-auto max-w-6xl">
        <nav className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-cyan-200/15 bg-black/80 px-4 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl md:text-sm">
          <Link href="/" className="chamfer-nav-link chamfer-nav-link--compact">
            Back to Genesis
          </Link>
          <div className="text-[11px] tracking-[0.28em] text-cyan-100/72">Access Level // Vanguard</div>
        </nav>

        <header className="grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.38em] text-cyan-100/75">
              Charter Layer
            </p>
            <h1 className="mt-4 max-w-4xl text-5xl font-light uppercase leading-tight tracking-[0.12em] md:text-7xl">
              Vanguard Status
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/60">
              Vanguard is the status attached to Day One supporter wallets:
              early wallets, future lineage mechanics, and royalty terms that
              stay aligned with what the deployed contract and marketplaces can
              actually honor.
            </p>
          </div>

          <aside className="border border-cyan-200/25 bg-black/55 p-5">
            <div className="text-[10px] uppercase tracking-[0.28em] text-cyan-100/70">
              Current Priority
            </div>
            <div className="mt-5 text-3xl uppercase tracking-[0.12em] text-white">
              Per NFT Splits
            </div>
            <p className="mt-4 text-sm leading-6 text-white/55">
              The clean path is token-specific royalty routing, with current
              terms maintained on the site and marketplace limits disclosed.
            </p>
          </aside>
        </header>

        <section className="grid gap-4">
          {privileges.map((privilege) => (
            <article
              key={privilege.id}
              className="grid gap-6 border border-white/10 bg-black/55 p-5 md:grid-cols-[110px_minmax(0,1fr)] md:p-7"
            >
              <div className="text-5xl font-light text-cyan-100/35">
                {privilege.id}
              </div>
              <div>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl uppercase tracking-[0.14em] text-white">
                      {privilege.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
                      {privilege.description}
                    </p>
                  </div>
                  <Link
                    href="/engine"
                    className="border border-cyan-200/30 px-4 py-3 text-[10px] uppercase tracking-[0.24em] text-cyan-100 transition hover:bg-cyan-100 hover:text-black"
                  >
                    Open Engine
                  </Link>
                </div>
                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  {privilege.items.map((item) => (
                    <div
                      key={item}
                      className="border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/58"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
