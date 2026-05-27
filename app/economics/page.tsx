import Link from "next/link";
import TunnelBackdrop from "@/components/TunnelBackdrop";

const metrics = [
  { label: "Network", value: "Base", detail: "Mainnet deployment target" },
  { label: "Royalty", value: "7%", detail: "ERC-2981 signal, venue-dependent" },
  { label: "Stats", value: "12", detail: "Limited previews stay separate" },
  { label: "Gate", value: "EAS", detail: "Coinbase attestation path" },
];

const models = [
  {
    title: "Actual Contract Powers",
    body: "The live contract can mint the ERC-721 deed, record the original minter, expose token royalty info, point to metadata, support transfers when allowed, permit a controlled burn path, and accept future upgrade implementations for new aesthetics or metadata behavior.",
  },
  {
    title: "Per-NFT Royalty Clones",
    body: "Each deed should expose the configured royalty path for that token. Collection still depends on the marketplace honoring ERC-2981 and routing proceeds correctly.",
  },
  {
    title: "Artifact Preview Layer",
    body: "Visitors can test date-based resonance without exposing the protected Genesis Engine output or the true Soul Contract metadata.",
  },
];

export default function EconomicsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-5 py-6 text-white md:px-8">
      <TunnelBackdrop />

      <div className="mx-auto max-w-6xl">
        <nav className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 text-[10px] uppercase tracking-[0.3em] text-white/45">
          <Link href="/" className="transition hover:text-white">
            Back to Genesis
          </Link>
          <div>Economic Intelligence // Protocol Draft</div>
        </nav>

        <header className="py-10">
          <p className="text-[11px] uppercase tracking-[0.38em] text-yellow-100/75">
            Protocol Economics
          </p>
          <h1 className="mt-4 max-w-5xl text-5xl font-light uppercase leading-tight tracking-[0.12em] md:text-7xl">
            Yield, Access, Lineage
          </h1>
          <p className="mt-6 max-w-3xl text-sm leading-7 text-white/60">
            The economic model needs to match the contract reality: mainnet
            minting, per-token royalty routing, and future systems that can
            recognize the original verified wallet.
          </p>
        </header>

        <section className="grid gap-3 md:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="border border-white/10 bg-black/55 p-5">
              <div className="text-[10px] uppercase tracking-[0.26em] text-white/40">
                {metric.label}
              </div>
              <div className="mt-3 text-3xl uppercase tracking-[0.12em] text-cyan-100">
                {metric.value}
              </div>
              <p className="mt-3 text-xs leading-5 text-white/50">{metric.detail}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-3">
          {models.map((model) => (
            <article key={model.title} className="border border-white/10 bg-black/55 p-6">
              <h2 className="text-xl uppercase tracking-[0.14em] text-white">
                {model.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/58">{model.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 border border-yellow-200/25 bg-yellow-200/10 p-6">
          <div className="text-[10px] uppercase tracking-[0.3em] text-yellow-100/70">
            Launch Rule
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-yellow-50/75">
            Do not advertise an automatic split until `royaltyInfo()` returns a
            token-specific receiver. Public language should say royalties are
            intended and configured, not universally guaranteed.
          </p>
        </section>
      </div>
    </main>
  );
}
