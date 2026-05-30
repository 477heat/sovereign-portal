import Link from "next/link";
import { GlossaryText } from "@/components/GlossaryTerm";
import TunnelBackdrop from "@/components/TunnelBackdrop";
import type { GlossaryTermKey } from "@/lib/glossary";

const vanguardGlossaryTerms: GlossaryTermKey[] = [
  "Access Token",
  "Genesis",
  "Genesis Mint",
  "Marketplace",
  "Mint",
  "Royalty",
  "Token",
  "Traceable",
  "Vanguard",
  "Wallet",
  "wallet-linked",
];

const statusPanels = [
  {
    href: "#day-one",
    label: "Day One",
    value: "Origin",
    body: "Day One supporters are introduced as Vanguards: the first public access class for the Engine.",
  },
  {
    href: "#wallet-linked",
    label: "Wallet",
    value: "Linked",
    body: "Recognition is designed around the wallet-linked Genesis mint, not anonymous mint farming.",
  },
  {
    href: "#legacy",
    label: "Legacy",
    value: "Carry-forward",
    body: "Vanguard status is intended to remain visible through later creations and project systems.",
  },
  {
    href: "#royalty-routing",
    label: "Routing",
    value: "Conditional",
    body: "Royalty participation depends on contract rules, marketplace support, and published terms.",
  },
];

const policyPanels = [
  {
    id: "day-one",
    number: "01",
    title: "Legacy Access Tier",
    body: "Vanguard is a legacy access tier. As new Access Token variants launch, Vanguard benefits carry forward, keep pace with current rewards, and include eligible future project access by default.",
    link: { href: "/whitepaper#vanguard", label: "Read Vanguard" },
  },
  {
    id: "wallet-linked",
    number: "02",
    title: "Wallet-linked Status",
    body: "The access model is built around one Genesis mint per person and a wallet-linked origin. The goal is to keep the community layer human, traceable, and resistant to empty-wallet harvesting.",
    link: { href: "/whitepaper#genesis-access", label: "Open Access" },
  },
  {
    id: "legacy",
    number: "03",
    title: "Legacy Recognition",
    body: "Vanguards keep the royalty rate assigned to their tier. Future tiers may launch with lower rates, but Vanguard royalty terms are protected from reduction and may only improve.",
    link: { href: "/economics#developer-access", label: "Builder Use" },
  },
  {
    id: "royalty-routing",
    number: "04",
    title: "Routing Limits",
    body: "Not every marketplace honors royalty routing. To protect Vanguard benefits, use approved marketplaces that support the collection's royalty flow; OpenSea is one approved option when creator earnings are supported.",
    link: { href: "/economics#royalty-routing", label: "Open Routing" },
  },
];

export default function VanguardPrivilegesPage() {
  return (
    <main className="info-control-page relative isolate min-h-screen overflow-x-hidden bg-black px-5 py-6 font-mono text-white md:px-10 md:py-10">
      <TunnelBackdrop layer="page" variant="diffused" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <nav className="mb-8 flex flex-col gap-3 border-b border-cyan-200/10 pb-5 text-[0.62rem] uppercase tracking-[0.22em] text-cyan-50/70 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="chamfer-nav-link chamfer-nav-link--compact">
            Home
          </Link>
          <div>Access // Vanguard Status</div>
        </nav>

        <header className="chamfer-panel chamfer-panel--command mb-8 px-6 py-7 md:px-10 md:py-9">
          <div className="mb-5 flex flex-wrap items-center gap-3 text-[0.62rem] uppercase tracking-[0.22em] text-yellow-100/80">
            <span>Day One</span>
            <span className="h-px w-10 bg-cyan-100/20" />
            <span>wallet-linked</span>
            <span className="h-px w-10 bg-cyan-100/20" />
            <span>legacy status</span>
          </div>
          <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <div>
              <p className="mb-3 text-[0.68rem] uppercase tracking-[0.32em] text-cyan-100/55">
                Charter Layer
              </p>
              <h1 className="max-w-3xl text-3xl font-semibold uppercase leading-none tracking-normal text-cyan-50 md:text-5xl">
                Vanguard Status
              </h1>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-cyan-50/72 md:text-base">
              <GlossaryText
                terms={vanguardGlossaryTerms}
                text="Vanguards are the Day One supporter class for Sovereign Engine: wallet-linked origin wallets with planned recognition across future creations, access systems, and published project terms."
              />
            </p>
          </div>
        </header>

        <section className="mb-9 grid gap-4 md:grid-cols-4">
          {statusPanels.map((panel) => (
            <Link
              key={panel.label}
              href={panel.href}
              className="chamfer-panel chamfer-panel--interactive chamfer-panel--small p-5"
            >
              <div className="text-[0.62rem] uppercase tracking-[0.22em] text-yellow-100/80">
                {panel.label}
              </div>
              <div className="mt-3 text-2xl uppercase tracking-normal text-cyan-50">
                {panel.value}
              </div>
              <p className="mt-3 text-sm leading-6 text-cyan-50/66">{panel.body}</p>
            </Link>
          ))}
        </section>

        <section className="chamfer-panel chamfer-panel--wide mb-9 px-6 py-7 md:px-9 md:py-8">
          <div className="grid gap-5 md:grid-cols-[0.75fr_1.25fr] md:items-center">
            <div>
              <p className="mb-2 text-[0.62rem] uppercase tracking-[0.26em] text-cyan-100/50">
                User Summary
              </p>
              <h2 className="text-xl font-semibold uppercase text-cyan-50 md:text-2xl">
                What Vanguard Means
              </h2>
            </div>
            <p className="text-sm leading-6 text-cyan-50/70 md:text-base">
              <GlossaryText
                terms={vanguardGlossaryTerms}
                text="Vanguard status is not generic affiliate language. It is the named early-supporter layer for wallets that enter the Engine at the Genesis stage, with future benefits defined by each launch."
              />
            </p>
          </div>
        </section>

        <div className="space-y-5 pb-16">
          {policyPanels.map((panel) => (
            <section
              key={panel.id}
              id={panel.id}
              className="chamfer-panel chamfer-panel--policy mx-auto max-w-5xl scroll-mt-24 px-6 py-6 md:px-8"
            >
              <div className="grid gap-5 md:grid-cols-[6rem_1fr_auto] md:items-start">
                <div>
                  <p className="mb-2 text-[0.62rem] uppercase tracking-[0.32em] text-cyan-100/35">
                    {panel.number}
                  </p>
                  <div className="h-px w-8 bg-cyan-100/20" />
                </div>
                <div>
                  <h2 className="mb-4 text-lg font-semibold uppercase tracking-normal text-cyan-50 md:text-xl">
                    {panel.title}
                  </h2>
                  <p className="text-sm leading-6 text-cyan-50/68 md:text-base">
                    <GlossaryText
                      terms={vanguardGlossaryTerms}
                      text={panel.body}
                    />
                  </p>
                </div>
                <Link
                  href={panel.link.href}
                  className="chamfer-hero-link chamfer-hero-link--secondary justify-self-start md:justify-self-end"
                >
                  {panel.link.label}
                </Link>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
