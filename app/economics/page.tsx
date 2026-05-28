import Link from "next/link";
import TunnelBackdrop from "@/components/TunnelBackdrop";

const metrics = [
  {
    label: "Access",
    value: "Soul Deed",
    detail: "Current Genesis access token",
  },
  {
    label: "Progeny",
    value: "Guaranteed",
    detail: "For Soul Deed and future access-token holders",
  },
  {
    label: "Royalty",
    value: "7%",
    detail: "ERC-2981 signal, venue-dependent",
  },
  {
    label: "Gate",
    value: "EAS",
    detail: "Coinbase eligible wallet path",
  },
];

const models = [
  {
    title: "Access Token Promise",
    body: "The Certificate of Title for Soul Ownership functions as the first Soul Deed Access token. Holders of this token, or any future access token, are guaranteed access to Progeny when that Engine branch opens.",
  },
  {
    title: "Genesis Lineage",
    body: "A Genesis mint creates the origin record. Its deterministic stats are not random, so the Progeny variety attached to that origin can only trace back to the qualifying access token.",
  },
  {
    title: "Royalty Routing",
    body: "The contract records the original minter and exposes token royalty information. Future lineage NFTs should route the linked wallet as a royalty receiver when the marketplace honors the configured path.",
  },
  {
    title: "Current Limits",
    body: "Access is guaranteed, but the Progeny interface, exact mint mechanics, lineage NFT format, and marketplace-specific royalty behavior still need to be implemented, tested, and published before launch.",
  },
];

export default function EconomicsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-5 py-6 text-white md:px-8">
      <TunnelBackdrop />

      <div className="mx-auto max-w-6xl">
        <nav className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-cyan-200/15 bg-black/80 px-4 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl md:text-sm">
          <Link href="/" className="chamfer-nav-link chamfer-nav-link--compact">
            Back to Genesis
          </Link>
          <div className="text-[11px] tracking-[0.28em] text-cyan-100/72">
            Access + Royalties // Current Terms
          </div>
        </nav>

        <header className="py-10">
          <p className="text-[11px] uppercase tracking-[0.38em] text-yellow-100/75">
            Access Layer
          </p>
          <h1 className="mt-4 max-w-5xl text-5xl font-light uppercase leading-tight tracking-[0.12em] md:text-7xl">
            Access, Progeny, Royalties
          </h1>
          <p className="mt-6 max-w-3xl text-sm leading-7 text-white/60">
            This page replaces the early economics draft. The current story is
            simpler: the Soul Deed is the first access token, Progeny access is
            guaranteed for qualifying holders, and royalty routing depends on
            contract configuration plus marketplace support.
          </p>
        </header>

        <section className="grid gap-3 md:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="border border-white/10 bg-black/55 p-5">
              <div className="text-[10px] uppercase tracking-[0.26em] text-white/40">
                {metric.label}
              </div>
              <div className="mt-3 text-2xl uppercase tracking-[0.12em] text-cyan-100">
                {metric.value}
              </div>
              <p className="mt-3 text-xs leading-5 text-white/50">{metric.detail}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
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
            Royalty Boundary
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-yellow-50/75">
            Public copy can say access is guaranteed for qualifying token
            holders. It should not say marketplace royalties are guaranteed.
            ERC-2981 is a signal and receiver path; collection still depends on
            the venue honoring and routing royalties correctly.
          </p>
        </section>
      </div>
    </main>
  );
}
