import {
  CommandPageShell,
  type CommandDrawerAction,
  type CommandPanelGroup,
} from "@/components/command/CommandPageShell";
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
    id: "profile-source",
    label: "Source",
    value: "Profiles",
    body: "Use deterministic profile outputs as the origin layer for characters, classes, and persistent user identity.",
  },
  {
    id: "progeny-trees",
    label: "Progeny",
    value: "Trees",
    body: "Request a character, item, creature, vehicle, or project-specific attribute structure for your game world.",
  },
  {
    id: "traceable-lineage-summary",
    label: "Lineage",
    value: "Traceable",
    body: "Generated assets can preserve parent/source relationships so Progeny remains tied to its origin profile.",
  },
  {
    id: "routing-conditional-summary",
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

const developerGroups: CommandPanelGroup[] = [
  {
    label: "Builder Matrix",
    eyebrow: "Developer Control",
    panels: builderPanels.map((panel, index) => ({
      id: panel.id,
      number: String(index + 1).padStart(2, "0"),
      label: panel.label,
      value: panel.value,
      title: `${panel.label} ${panel.value}`,
      body: panel.body,
    })),
  },
  {
    label: "Integration Queue",
    eyebrow: "Progeny Structures",
    panels: developerSections.map((section) => ({
      id: section.id,
      number: section.number,
      label: section.title,
      value: section.link.label,
      title: section.title,
      body: section.body,
      link: section.link,
    })),
  },
];

const drawerActions: CommandDrawerAction[] = [
  { href: "/", label: "Home" },
  { href: "/whitepaper", label: "Litepaper", variant: "opposite" },
  { href: "/economics", label: "Access", variant: "opposite" },
  { href: "/vanguard", label: "Vanguard" },
  { href: "/portal", label: "Portal", variant: "primary" },
];

export default function DeveloperPage() {
  return (
    <CommandPageShell
      drawerActions={drawerActions}
      drawerContentId="developer-drawer"
      drawerLabel="Developer drawer"
      glossaryTerms={developerGlossaryTerms}
      groups={developerGroups}
    />
  );
}
