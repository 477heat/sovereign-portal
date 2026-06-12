import Link from "next/link";
import { AnimatedFrame } from "@/components/command/AnimatedFrame";
import { AssemblingPanel } from "@/components/command/AssemblingPanel";
import { MovingLines } from "@/components/command/MovingLines";
import { PuffField } from "@/components/command/PuffField";
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
  "Sovereign Engine",
  "Token",
  "Traceable",
  "Vanguard",
  "Wallet",
  "wallet-linked",
];

const statusPanels = [
  {
    href: "#initial-supporters",
    label: "Initial Supporters",
    value: "Origin",
    body: "Pre-launch supporters enter as Vanguards, the first public access class for the Engine.",
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
    body: "Vanguard status carries into planned Progeny drops, in-house discounts, and future project systems.",
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
    id: "initial-supporters",
    number: "01",
    title: "Launch Day Progeny",
    body: "The first planned Progeny mint is the Kindred Creature Mint on Launch Day. Pre-launch supporters are planned to receive it for $0.02 plus Base network gas, currently estimated around $0.04-$0.06 but subject to network conditions.",
    link: { href: "/whitepaper#vanguard", label: "Read Vanguard" },
  },
  {
    id: "wallet-linked",
    number: "02",
    title: "Included Engine Mints",
    body: "Vanguards are also planned to receive the Full Natal Chart Mint when the Engine is ready, plus an Artifact Item Mint at the same early-supporter rate.",
    link: { href: "/whitepaper#genesis-access", label: "Open Access" },
  },
  {
    id: "legacy",
    number: "03",
    title: "Future Progeny Discounts",
    body: "Future Progeny mints are planned to stay discounted for Vanguards, with final rates set by each project's published specs. In-house Progeny is planned at 50% off, and most in-house Progeny is expected to cost less than a dollar.",
    link: { href: "/economics#developer-access", label: "Builder Use" },
  },
  {
    id: "royalty-routing",
    number: "04",
    title: "Third-party Progeny",
    body: "Third-party Progeny pricing will be set by the developer building that project. Vanguard discounts may still apply, but each outside launch will publish its own pricing, access rules, and mint details.",
    link: { href: "/economics#royalty-routing", label: "Open Routing" },
  },
];

export default function VanguardPrivilegesPage() {
  return (
    <main className="info-control-page command-room-page relative isolate min-h-screen overflow-x-hidden bg-black px-4 py-5 font-mono text-white md:px-8">
      <TunnelBackdrop layer="page" variant="diffused" rings />

      <div className="command-room relative z-10 mx-auto flex min-h-screen max-w-[96rem] flex-col">
        <nav className="command-room__topbar">
          <Link href="/" className="chamfer-nav-link chamfer-nav-link--compact">
            Home
          </Link>
          <div>Charter Bay // Vanguard Status</div>
          <Link href="/engine-lab" className="chamfer-nav-link chamfer-nav-link--compact">
            Engine Lab
          </Link>
        </nav>

        <section className="command-room__grid grid flex-1 gap-5 py-5">
          <AssemblingPanel
            className="command-room__rail border border-cyan-200/15 bg-black/50 p-4"
            title="Vanguard Rail"
          >
            <div className="command-room__status-stack">
              {statusPanels.map((panel) => (
                <Link
                  className="command-room__status-link"
                  href={panel.href}
                  key={panel.label}
                >
                  <span>{panel.label}</span>
                  <strong>{panel.value}</strong>
                  <small>{panel.body}</small>
                </Link>
              ))}
            </div>

            <div className="command-room__rail-actions">
              <Link href="/economics" className="chamfer-nav-link chamfer-nav-link--compact">
                Economy
              </Link>
              <Link href="/whitepaper#vanguard" className="chamfer-nav-link chamfer-nav-link--compact">
                Whitepaper
              </Link>
              <Link href="/portal" className="chamfer-nav-link chamfer-nav-link--compact">
                Portal
              </Link>
            </div>
          </AssemblingPanel>

          <AnimatedFrame
            className="command-room__viewport min-h-[38rem]"
            label="Initial Supporter Array"
          >
            <MovingLines />
            <PuffField />
            <div className="engine-screen-grid absolute inset-0 opacity-45" aria-hidden="true" />
            <div className="engine-sweep absolute inset-x-0 top-0 h-28" aria-hidden="true" />
            <div className="command-room__beacon" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>

            <div className="command-room__viewport-content relative z-10 grid min-h-[34rem] content-between gap-8 p-5 md:p-8">
              <div>
                <div className="command-room__signal-row">
                  <span>Initial Supporters</span>
                  <span>wallet-linked</span>
                  <span>legacy status</span>
                </div>
                <p className="mt-7 text-[0.68rem] uppercase tracking-[0.32em] text-cyan-100/58">
                  Charter Layer
                </p>
                <h1 className="command-lab__headline mt-4 max-w-3xl text-3xl uppercase leading-tight text-cyan-50 md:text-5xl">
                  Vanguard Status
                </h1>
                <p className="mt-5 max-w-3xl text-sm leading-7 text-cyan-50/72 md:text-base">
                  <GlossaryText
                    terms={vanguardGlossaryTerms}
                    text="Vanguards are the Initial Supporters class for Sovereign Engine: wallet-linked origin wallets with planned Launch Day Progeny access, future Engine mints, and discounted project benefits."
                  />
                </p>
              </div>

              <section className="command-room__summary">
                <div>
                  <span>User Summary</span>
                  <h2>What Vanguard Means</h2>
                </div>
                <p>
                  <GlossaryText
                    terms={vanguardGlossaryTerms}
                    text="Vanguard status is the named early-supporter layer for wallets that enter the Engine before Launch Day. The goal is simple: early supporters keep visible access, receive planned Progeny opportunities, and get better pricing on in-house creations as the Engine expands."
                  />
                </p>
              </section>
            </div>
          </AnimatedFrame>

          <AssemblingPanel
            className="command-room__policy-feed border border-white/10 bg-black/50 p-4"
            delay="medium"
            title="Privilege Queue"
          >
            <div className="command-room__policy-stack">
              {policyPanels.map((panel) => (
                <section
                  className="command-room__policy-node"
                  id={panel.id}
                  key={panel.id}
                >
                  <div className="command-room__policy-index">{panel.number}</div>
                  <div>
                    <h2>{panel.title}</h2>
                    <p>
                      <GlossaryText
                        terms={vanguardGlossaryTerms}
                        text={panel.body}
                      />
                    </p>
                    <Link href={panel.link.href}>{panel.link.label}</Link>
                  </div>
                </section>
              ))}
            </div>
          </AssemblingPanel>
        </section>
      </div>
    </main>
  );
}
