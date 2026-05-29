import Link from "next/link";
import TunnelBackdrop from "@/components/TunnelBackdrop";

const accessPanels = [
  {
    href: "/vanguard",
    label: "Day One",
    value: "Vanguard",
    body: "Vanguard is the legacy access tier. Benefits carry forward as new Access Token variants launch.",
  },
  {
    href: "#progeny-model",
    label: "Progeny",
    value: "Inheritance",
    body: "Characters, children, gear, creatures, and project assets can inherit traceable source qualities.",
  },
  {
    href: "#royalty-routing",
    label: "Routing",
    value: "Approved",
    body: "Royalty benefits depend on approved marketplace routes that honor the collection's royalty flow.",
  },
  {
    href: "#developer-access",
    label: "Builder Use",
    value: "Trees",
    body: "Developers can choose a Progeny structure or request a project-specific attribute tree.",
  },
];

const policyPanels = [
  {
    id: "day-one-access",
    number: "01",
    title: "Legacy Access",
    body: "Vanguard wallets keep their access tier as the Engine expands. New Access Token variants may introduce new benefits, but Vanguard eligibility is designed to carry forward by default.",
    link: { href: "/vanguard", label: "Read Vanguard" },
  },
  {
    id: "progeny-model",
    number: "02",
    title: "Progeny Model",
    body: "Progeny includes children and material assets: clothing, armor, weapons, creatures, adversarial constructs, transport, and project objects. Each Progeny Project can draw from 479,001,600 user-specific possibilities.",
    link: { href: "/whitepaper#progeny", label: "Open Progeny" },
  },
  {
    id: "royalty-routing",
    number: "03",
    title: "Royalty Routing",
    body: "When the contract and marketplace route support it, the originating wallet can be written into a lineage NFT as a royalty receiver. Approved marketplaces, including OpenSea when creator earnings are supported, help preserve that route.",
    link: { href: "/whitepaper#royalty-routing", label: "Open Routing" },
  },
  {
    id: "developer-access",
    number: "04",
    title: "Developer Access",
    body: "Developers can choose which Progeny structure fits their game or request a specific character attribute tree for users to generate from or purchase through a Vanguard collection.",
    link: { href: "/engine", label: "Open Engine" },
  },
  {
    id: "marketplace-limits",
    number: "05",
    title: "Marketplace Limits",
    body: "Some marketplaces do not honor royalty routing. Users should use approved marketplaces for Vanguard and Progeny sales so contract-level attribution has the best chance to work as intended.",
    link: { href: "/whitepaper#privacy-practices", label: "Read Limits" },
  },
];

export default function EconomicsPage() {
  return (
    <main className="info-control-page relative isolate min-h-screen overflow-x-hidden bg-black px-5 py-6 font-mono text-white md:px-10 md:py-10">
      <TunnelBackdrop layer="page" variant="diffused" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <nav className="mb-8 flex flex-col gap-3 border-b border-cyan-200/10 pb-5 text-[0.62rem] uppercase tracking-[0.22em] text-cyan-50/70 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="chamfer-nav-link chamfer-nav-link--compact">
            Home
          </Link>
          <div>Access // Progeny Routing</div>
        </nav>

        <header className="chamfer-panel chamfer-panel--command mb-8 px-6 py-7 md:px-10 md:py-9">
          <div className="mb-5 flex flex-wrap items-center gap-3 text-[0.62rem] uppercase tracking-[0.22em] text-yellow-100/80">
            <span>Vanguard class</span>
            <span className="h-px w-10 bg-cyan-100/20" />
            <span>Progeny logic</span>
            <span className="h-px w-10 bg-cyan-100/20" />
            <span>royalty-routing</span>
          </div>
          <div className="grid gap-8 md:grid-cols-[0.92fr_1.08fr] md:items-end">
            <div>
              <p className="mb-3 text-[0.68rem] uppercase tracking-[0.32em] text-cyan-100/55">
                Access Layer
              </p>
              <h1 className="max-w-3xl text-3xl font-semibold uppercase leading-none tracking-normal text-cyan-50 md:text-5xl">
                Access And Progeny
              </h1>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-cyan-50/72 md:text-base">
              This page explains how Vanguard access, Progeny creation, and
              royalty routing connect. The practical rule is simple: source
              profiles create traceable assets, and approved routes preserve
              wallet-linked benefits where supported.
            </p>
          </div>
        </header>

        <section className="mb-9 grid gap-4 md:grid-cols-4">
          {accessPanels.map((panel) => (
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
                Why This Page Exists
              </h2>
            </div>
            <p className="text-sm leading-6 text-cyan-50/70 md:text-base">
              Users should understand what carries forward, what can be
              generated from their profile, and where marketplace support matters.
              This is the short version before reading the full policy layer.
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
                    {panel.body}
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
