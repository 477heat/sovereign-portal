import Link from "next/link";
import { GlossaryText } from "@/components/GlossaryTerm";
import TunnelBackdrop from "@/components/TunnelBackdrop";
import type { GlossaryTermKey } from "@/lib/glossary";

const developerGlossaryTerms: GlossaryTermKey[] = [
  "Actual Supply",
  "Attributes",
  "Attribute Tree",
  "Coinbase EAS",
  "Deterministic Profile",
  "Genesis Mint",
  "Lineage",
  "Metadata",
  "Progeny",
  "Royalty",
  "Sovereign Engine",
  "Token ID",
  "Traceable",
  "Vanguard",
  "Wallet",
  "wallet-linked",
];

const builderPanels = [
  {
    href: "#profile-layer",
    label: "Source",
    value: "Profiles",
    body: "Use deterministic profile outputs as the origin layer for characters, classes, and persistent user identity.",
  },
  {
    href: "#progeny-structures",
    label: "Progeny",
    value: "Trees",
    body: "Request a character, item, creature, vehicle, or project-specific attribute structure for your game world.",
  },
  {
    href: "#lineage",
    label: "Lineage",
    value: "Traceable",
    body: "Generated assets can preserve parent/source relationships so Progeny remains tied to its origin profile.",
  },
  {
    href: "#royalty-routing",
    label: "Routing",
    value: "Conditional",
    body: "Where contract and marketplace support exists, assets can be designed around wallet-linked royalty attribution.",
  },
];

const developerSections = [
  {
    id: "profile-layer",
    number: "01",
    title: "Deterministic Profile Layer",
    body: "Sovereign Engine reads from deterministic participant inputs that become a stable profile origin. For games, that means a player profile can become a consistent source signal instead of a random roll. The Engine remains the authority for live generation; partner projects should consume published outputs rather than recreate the math client-side.",
    link: { href: "/engine", label: "View Engine" },
  },
  {
    id: "progeny-structures",
    number: "02",
    title: "Progeny Structures",
    body: "A Progeny Project can define what gets generated from a source profile: children, playable characters, clothing, armor, weapons, creatures, adversarial constructs, transport, locations, or other game objects. Developers can choose an existing structure or request a custom character attribute tree, including stricter one-character or season-limited rules where a game needs them.",
    link: { href: "/economics#progeny-model", label: "Open Progeny" },
  },
  {
    id: "possibility-space",
    number: "03",
    title: "User-specific Variety",
    body: "The current design target gives each Progeny Project access to 479,001,600 possibilities unique to a source profile. The goal is not generic rarity farming; it is repeatable, profile-linked variation that lets one user produce a distinct family of compatible assets.",
    link: { href: "/whitepaper#progeny", label: "Read Model" },
  },
  {
    id: "lineage",
    number: "04",
    title: "Traceable Lineage",
    body: "Progeny assets can inherit qualities and characteristics from their source profile, allowing games to trace a character, child, item, or construct back to its parent origin. This gives developers a clean way to build legacy systems, family trees, crafting inheritance, faction logic, and creator-linked collections.",
    link: { href: "/economics#developer-access", label: "Builder Use" },
  },
  {
    id: "vanguard-collections",
    number: "05",
    title: "Vanguard Collections",
    body: "Developers may design systems where users generate from their own profile or acquire assets from a Vanguard collection. Some categories can stay volume-friendly, while game-critical characters can be stricter when balance requires it. Vanguard status is the Initial Supporters legacy access tier, with benefits defined by each published launch.",
    link: { href: "/vanguard", label: "Vanguard" },
  },
  {
    id: "royalty-routing",
    number: "06",
    title: "Royalty Routing",
    body: "Future lineage assets are planned around wallet-linked attribution. Where the contract and marketplace route support it, the originating wallet can be inserted as a royalty receiver. This depends on approved marketplace behavior and should never be presented as universal royalty enforcement.",
    link: { href: "/economics#royalty-routing", label: "Routing" },
  },
  {
    id: "integration-boundary",
    number: "07",
    title: "Integration Boundary",
    body: "The public developer API is not an open self-serve surface yet. Current game-developer work should be treated as project review, structure design, and controlled integration planning. Sovereign Engine owns generation truth; game clients should receive approved profile, lineage, and metadata outputs.",
    link: { href: "/whitepaper#deterministic-engine", label: "Litepaper" },
  },
  {
    id: "privacy",
    number: "08",
    title: "Privacy And Metadata",
    body: "Game integrations should use derived stats, lineage references, token IDs, wallet-linked ownership state, and approved metadata. Raw personal intake data should not be exposed in game clients, analytics, public URLs, or ordinary NFT metadata.",
    link: { href: "/whitepaper#privacy-practices", label: "Privacy" },
  },
  {
    id: "actual-supply",
    number: "09",
    title: "Actual Supply",
    body: "A single verified mint per participant gives developers a cleaner supply model. Players cannot spam new profiles until an overpowered character appears, so each user has to build around their own attributes. That creates variety without turning balance into a reroll contest. It also avoids the flat feeling of every player starting from identical base stats, while still giving designers a predictable progression curve to tune around.",
    link: { href: "/portal", label: "Mint Path" },
  },
];

export default function DeveloperPage() {
  return (
    <main className="info-control-page relative isolate min-h-screen overflow-x-hidden bg-black px-5 py-6 font-mono text-white md:px-10 md:py-10">
      <TunnelBackdrop layer="page" variant="diffused" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <nav className="mb-8 flex flex-col gap-3 border-b border-cyan-200/10 pb-5 text-[0.62rem] uppercase tracking-[0.22em] text-cyan-50/70 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="chamfer-nav-link chamfer-nav-link--compact">
            Home
          </Link>
          <div>Developer // Progeny Structures</div>
        </nav>

        <header className="chamfer-panel chamfer-panel--command mb-8 px-6 py-7 md:px-10 md:py-9">
          <div className="mb-5 flex flex-wrap items-center gap-3 text-[0.62rem] uppercase tracking-[0.22em] text-yellow-100/80">
            <span>game systems</span>
            <span className="h-px w-10 bg-cyan-100/20" />
            <span>attribute trees</span>
            <span className="h-px w-10 bg-cyan-100/20" />
            <span>lineage assets</span>
          </div>
          <div className="grid gap-8 md:grid-cols-[0.92fr_1.08fr] md:items-end">
            <div>
              <p className="mb-3 text-[0.68rem] uppercase tracking-[0.32em] text-cyan-100/55">
                Builder Layer
              </p>
              <h1 className="max-w-3xl text-3xl font-semibold uppercase leading-none tracking-normal text-cyan-50 md:text-5xl">
                Game Developer Access
              </h1>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-cyan-50/72 md:text-base">
              <GlossaryText
                terms={developerGlossaryTerms}
                text="Sovereign Engine is built around deterministic profile inputs that can serve as a stable origin layer for profiles, characters, items, creatures, and lineage systems."
              />
            </p>
          </div>
        </header>

        <section className="chamfer-panel chamfer-panel--wide mb-9 px-6 py-7 md:px-9 md:py-8">
          <div className="grid gap-5 md:grid-cols-[0.75fr_1.25fr] md:items-center">
            <div>
              <p className="mb-2 text-[0.62rem] uppercase tracking-[0.26em] text-cyan-100/50">
                Marker Access
              </p>
              <h2 className="text-xl font-semibold uppercase text-cyan-50 md:text-2xl">
                Stable By Nature
              </h2>
            </div>
            <p className="text-sm leading-6 text-cyan-50/70 md:text-base">
              <GlossaryText
                terms={developerGlossaryTerms}
                text="The stat-generation method is not exactly secret, but it is being held back while the Engine matures. Approved developer partners may receive deeper disclosure about how profile inputs are interpreted, how stats are derived, and how project-specific Progeny trees can be mapped from them."
              />
            </p>
          </div>
        </section>

        <section className="mb-9 grid gap-4 md:grid-cols-4">
          {builderPanels.map((panel) => (
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
                Builder Summary
              </p>
              <h2 className="text-xl font-semibold uppercase text-cyan-50 md:text-2xl">
                What This Allows
              </h2>
            </div>
            <p className="text-sm leading-6 text-cyan-50/70 md:text-base">
              <GlossaryText
                terms={developerGlossaryTerms}
                text="A developer can build around stable profile stats, choose a Progeny structure, request a custom attribute tree, and design assets that carry source lineage. Open integration is not live yet; this page defines the developer-facing model before partner tooling is exposed."
              />
            </p>
          </div>
        </section>

        <div className="space-y-5 pb-16">
          {developerSections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="chamfer-panel chamfer-panel--policy mx-auto max-w-5xl scroll-mt-24 px-6 py-6 md:px-8"
            >
              <div className="grid gap-5 md:grid-cols-[6rem_1fr_auto] md:items-start">
                <div>
                  <p className="mb-2 text-[0.62rem] uppercase tracking-[0.32em] text-cyan-100/35">
                    {section.number}
                  </p>
                  <div className="h-px w-8 bg-cyan-100/20" />
                </div>
                <div>
                  <h2 className="mb-4 text-lg font-semibold uppercase tracking-normal text-cyan-50 md:text-xl">
                    {section.title}
                  </h2>
                  <p className="text-sm leading-6 text-cyan-50/68 md:text-base">
                    <GlossaryText
                      terms={developerGlossaryTerms}
                      text={section.body}
                    />
                  </p>
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
      </div>
    </main>
  );
}
