import Link from "next/link";
import { GlossaryText } from "@/components/GlossaryTerm";
import TunnelBackdrop from "@/components/TunnelBackdrop";
import type { GlossaryTermKey } from "@/lib/glossary";

const litepaperGlossaryTerms: GlossaryTermKey[] = [
  "Artifact",
  "Base-native",
  "Deterministic Profile",
  "Genesis",
  "Genesis Character",
  "Genesis Mint",
  "Lineage",
  "Metadata",
  "Progeny",
  "Royalty",
  "Sovereign Engine",
  "Traceable",
  "Vanguard",
  "Wallet",
  "wallet-linked",
];

const operatorPanels = [
  {
    href: "#deterministic-engine",
    label: "Deterministic Stats",
    copy: "Your profile is generated from stable personal inputs, not random rolls. The same source signal produces the same core profile.",
  },
  {
    href: "#genesis-access",
    label: "Genesis Access",
    copy: "The Deed is your Genesis Character. It starts the profile layer that future Engine systems can read from.",
  },
  {
    href: "#progeny",
    label: "Progeny Systems",
    copy: "Children, gear, creatures, vehicles, adversaries, and other project assets can inherit traceable qualities from their source profile.",
  },
  {
    href: "#royalty-routing",
    label: "Royalty Routing",
    copy: "Future lineage mints are planned around wallet-linked routing so creators and Vanguards can be attached to the assets they originate.",
  },
];

const detailSections = [
  {
    id: "deterministic-engine",
    index: "01",
    title: "Deterministic Engine",
    copy: [
      "Sovereign Engine is a deterministic profile and artifact system. Each individual has data that can be parsed into constant stats, which means the result is derived rather than randomly assigned.",
      "The user benefit is continuity. A profile can move across characters, legacy creations, and partner projects while keeping the same origin logic intact.",
    ],
    link: { href: "/engine", label: "Open Artifact" },
  },
  {
    id: "genesis-access",
    index: "02",
    title: "Genesis Access",
    copy: [
      "The Deed is your Genesis Character. It contains stats that remain with your profile whether the artifact is sold, transferred, or held.",
      "One Genesis mint per person protects the launch from empty-wallet harvesting and keeps early access focused on real community formation.",
    ],
    link: { href: "/vanguard", label: "Read Access" },
  },
  {
    id: "vanguard",
    index: "03",
    title: "Vanguard Status",
    copy: [
      "Day One supporters are introduced as Vanguards. Vanguard status is intended to carry forward through legacy creations and later Sovereign Engine projects.",
      "Benefits tied to future systems will depend on published terms for each launch, but the design goal is persistent recognition for origin wallets.",
    ],
    link: { href: "/vanguard", label: "Read Vanguard" },
  },
  {
    id: "progeny",
    index: "04",
    title: "Progeny As The Future",
    copy: [
      "Progeny includes children and material items: clothing, armor, weapons, creatures, adversarial constructs, transport modes, and other generated assets.",
      "Because each Progeny is derived from parent qualities, a child or item can be traced back to the profile lineage that created it.",
      "The Engine can attribute 479,001,600 possibilities completely unique to a user for each Progeny Project.",
    ],
    link: { href: "/economics", label: "Review Progeny" },
  },
  {
    id: "royalty-routing",
    index: "05",
    title: "Royalty Routing",
    copy: [
      "Future launches are planned around user-linked royalty routing. When a lineage NFT is minted, the originating wallet can be written into the asset as a royalty receiver where the contract and marketplace flow support it.",
      "This is not vague affiliate language. The intent is a rewarded community structure with wallet-linked attribution, contract-level rules, and clear project terms.",
    ],
    link: { href: "/economics", label: "Open Economics" },
  },
  {
    id: "privacy-practices",
    index: "06",
    title: "Privacy And Boundaries",
    copy: [
      "Protected inputs should be used for generation and routing, not exposed as ordinary public content. Public metadata should describe the artifact without revealing raw personal intake data.",
      "The Litepaper should remain clear about what is active today, what is planned, and which benefits require future published terms.",
    ],
    link: { href: "/vanguard", label: "Open Status" },
  },
];

export default function ExecutiveSummaryPage() {
  return (
    <main className="info-control-page relative isolate min-h-screen overflow-x-hidden bg-black px-5 py-6 font-mono text-white md:px-10 md:py-10">
      <TunnelBackdrop layer="page" variant="diffused" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <nav className="mb-8 flex flex-col gap-3 border-b border-cyan-200/10 pb-5 text-[0.62rem] uppercase tracking-[0.22em] text-cyan-50/70 md:flex-row md:items-center md:justify-between">
          <Link
            href="/"
            className="chamfer-nav-link chamfer-nav-link--compact"
          >
            Home
          </Link>
          <div className="text-cyan-100/70">Litepaper // Control Document</div>
        </nav>

        <header className="chamfer-panel chamfer-panel--command mb-8 px-6 py-7 md:px-10 md:py-9">
          <div className="mb-5 flex flex-wrap items-center gap-3 text-[0.62rem] uppercase tracking-[0.22em] text-yellow-100/80">
            <span>Base-native</span>
            <span className="h-px w-10 bg-cyan-100/20" />
            <span>wallet-linked</span>
            <span className="h-px w-10 bg-cyan-100/20" />
            <span>artifact engine</span>
          </div>
          <div className="grid gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-end">
            <div>
              <p className="mb-3 text-[0.68rem] uppercase tracking-[0.32em] text-cyan-100/55">
                Sovereign Engine
              </p>
              <h1 className="max-w-2xl text-3xl font-semibold uppercase leading-none tracking-normal text-cyan-50 md:text-5xl">
                Litepaper
              </h1>
            </div>
            <p className="max-w-xl text-sm leading-6 text-cyan-50/72 md:text-base">
              <GlossaryText
                terms={litepaperGlossaryTerms}
                text="Sovereign Engine turns deterministic personal data into persistent character stats, Genesis access, and future Progeny structures that can carry traceable origin and wallet-linked royalty routing."
              />
            </p>
          </div>
        </header>

        <section className="mb-9 grid gap-4 md:grid-cols-4">
          {operatorPanels.map((panel) => (
            <Link
              key={panel.href}
              href={panel.href}
              className="chamfer-panel chamfer-panel--interactive chamfer-panel--small p-5"
            >
              <p className="mb-3 text-[0.62rem] uppercase tracking-[0.22em] text-yellow-100/80">
                {panel.label}
              </p>
              <p className="text-sm leading-6 text-cyan-50/68">{panel.copy}</p>
            </Link>
          ))}
        </section>

        <section className="chamfer-panel chamfer-panel--wide mb-9 px-6 py-7 md:px-9 md:py-8">
          <div className="grid gap-5 md:grid-cols-[0.7fr_1.3fr] md:items-center">
            <div>
              <p className="mb-2 text-[0.62rem] uppercase tracking-[0.26em] text-cyan-100/50">
                Operator Summary
              </p>
              <h2 className="text-xl font-semibold uppercase text-cyan-50 md:text-2xl">
                What Users Should Understand First
              </h2>
            </div>
            <p className="text-sm leading-6 text-cyan-50/70 md:text-base">
              <GlossaryText
                terms={litepaperGlossaryTerms}
                text="The Deed is the first artifact in a broader Engine. It introduces the user profile, the Vanguard launch class, and the future pattern for Progeny generation. The full policy layer belongs in detailed terms, but the front-facing promise is simple: stable identity-derived stats, clear lineage, and no empty-wallet community theater."
              />
            </p>
          </div>
        </section>

        <div className="space-y-5 pb-16">
          {detailSections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="chamfer-panel chamfer-panel--policy mx-auto max-w-5xl scroll-mt-24 px-6 py-6 md:px-8"
            >
              <div className="grid gap-5 md:grid-cols-[6rem_1fr_auto] md:items-start">
                <div>
                  <p className="mb-2 text-[0.62rem] uppercase tracking-[0.32em] text-cyan-100/35">
                    {section.index}
                  </p>
                  <div className="h-px w-8 bg-cyan-100/20" />
                </div>
                <div>
                  <h2 className="mb-4 text-lg font-semibold uppercase tracking-normal text-cyan-50 md:text-xl">
                    {section.title}
                  </h2>
                  <div className="space-y-3 text-sm leading-6 text-cyan-50/68 md:text-base">
                    {section.copy.map((paragraph) => (
                      <p key={paragraph}>
                        <GlossaryText
                          terms={litepaperGlossaryTerms}
                          text={paragraph}
                        />
                      </p>
                    ))}
                  </div>
                </div>
                <Link
                  href={section.link.href}
                  className="chamfer-hero-link chamfer-hero-link--secondary justify-self-start md:justify-self-end"
                >
                  {section.link.label}
                </Link>
              </div>
            </section>
          ))}
        </div>

        <footer className="border-t border-cyan-100/10 pt-6 text-center text-[0.62rem] uppercase tracking-[0.28em] text-cyan-100/35">
          Sovereign Engine // Litepaper draft // 2026
        </footer>
      </div>
    </main>
  );
}
