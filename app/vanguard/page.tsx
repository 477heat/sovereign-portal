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
  "Artifact Item",
  "Base network gas",
  "Genesis",
  "Genesis Mint",
  "Full Natal Chart",
  "Kindred Creature",
  "Launch Day",
  "Marketplace",
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
    body: "Vanguard status carries into Progeny drops, early rate classes, and future project systems.",
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
    body: "The first Progeny mint is the Kindred Creature Mint on Launch Day. Pre-launch supporters receive it for $0.02 plus Base network gas, currently estimated around $0.04-$0.06 but subject to network conditions.",
    link: { href: "/whitepaper#vanguard", label: "Read Vanguard" },
  },
  {
    id: "wallet-linked",
    number: "02",
    title: "Included Engine Mints",
    body: "Vanguards receive the Full Natal Chart Mint when the Engine is ready, plus an Artifact Item Mint at the same early-supporter rate.",
    link: { href: "/whitepaper#genesis-access", label: "Open Access" },
  },
  {
    id: "legacy",
    number: "03",
    title: "Future Progeny Rates",
    body: "Future Progeny mints use a Vanguard rate class when a project supports it, with final pricing set by each project's published specs. In-house Progeny will publish its own launch terms before each release.",
    link: { href: "/economics#developer-access", label: "Builder Use" },
  },
  {
    id: "royalty-routing",
    number: "04",
    title: "Third-party Progeny",
    body: "Third-party Progeny pricing will be set by the developer building that project. Vanguard access may still apply, but each outside launch will publish its own pricing, access rules, and mint details.",
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

            <div className="command-room__viewport-content relative z-10 grid min-h-[34rem] content-start gap-8 p-5 md:p-8">
              <div>
                <div
                  className="command-room__signal-row"
                  style={{
                    background: "rgba(3, 17, 23, 0.78)",
                    border: "1px solid rgba(165, 243, 252, 0.2)",
                    boxShadow: "0 0 18px rgba(125, 211, 252, 0.1)",
                    clipPath:
                      "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                    flexWrap: "nowrap",
                    fontSize: "0.42rem",
                    gap: "0.24rem",
                    justifySelf: "start",
                    letterSpacing: "0.06em",
                    marginBottom: "-0.75rem",
                    marginLeft: "-0.35rem",
                    maxWidth: "100%",
                    padding: "0.36rem 0.5rem",
                    transform: "translateY(-1.22rem)",
                    whiteSpace: "nowrap",
                    width: "fit-content",
                  }}
                >
                  <b style={{ fontWeight: 500 }}>Initial Supporters</b>
                  <i
                    aria-hidden="true"
                    style={{
                      background: "rgba(165, 243, 252, 0.24)",
                      display: "block",
                      flex: "0 0 0.34rem",
                      height: "1px",
                    }}
                  />
                  <b style={{ fontWeight: 500 }}>wallet-linked</b>
                  <i
                    aria-hidden="true"
                    style={{
                      background: "rgba(165, 243, 252, 0.24)",
                      display: "block",
                      flex: "0 0 0.34rem",
                      height: "1px",
                    }}
                  />
                  <b style={{ fontWeight: 500 }}>legacy status</b>
                </div>
                <p className="mt-3 text-[0.68rem] uppercase tracking-[0.32em] text-cyan-100/58">
                  Charter Layer
                </p>
                <h1 className="command-lab__headline mt-3 max-w-3xl text-3xl uppercase leading-tight text-cyan-50 md:text-5xl">
                  Vanguard Status
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-cyan-50/72 md:text-base">
                  <GlossaryText
                    terms={vanguardGlossaryTerms}
                    text="Vanguards are the Initial Supporters class for Sovereign Engine: wallet-linked origin wallets with Launch Day Progeny access, future Engine mints, and published early-supporter rate classes."
                  />
                </p>
              </div>
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
