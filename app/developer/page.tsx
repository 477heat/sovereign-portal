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
    label: "Profile",
    value: "Source",
    body: "Use Engine-approved profile outputs as the origin layer for characters, classes, and persistent user identity.",
  },
  {
    id: "progeny-trees",
    label: "Progeny",
    value: "Trees",
    body: "Request a character, item, creature, vehicle, or project-specific attribute structure for a game world.",
  },
  {
    id: "traceable-lineage-summary",
    label: "Lineage",
    value: "Traceable",
    body: "Generated assets can preserve parent/source relationships so Progeny stays tied to its origin profile.",
  },
  {
    id: "routing-conditional-summary",
    label: "Royalty",
    value: "Path",
    body: "Wallet-linked attribution can be designed into assets where contract and marketplace support exists.",
  },
];

const developerSections = [
  {
    id: "profile-layer",
    number: "01",
    label: "Profile",
    value: "Layer",
    title: "Profile Layer",
    body: "Sovereign Engine reads participant inputs into a stable profile origin. For games, that turns a player into a consistent source signal instead of a random roll.",
    link: { href: "/engine", label: "View Engine" },
  },
  {
    id: "progeny-structures",
    number: "02",
    label: "Attribute",
    value: "Trees",
    title: "Attribute Trees",
    body: "A Progeny Project defines what gets generated from a source profile: creatures, characters, gear, transport, adversaries, locations, or other game objects.",
    link: { href: "/economics#progeny-model", label: "Open Progeny" },
  },
  {
    id: "possibility-space",
    number: "03",
    label: "Actual",
    value: "Supply",
    title: "Actual Supply",
    body: "One verified Genesis origin gives developers cleaner supply. Players cannot spam new profiles until the numbers finally surrender.",
    link: { href: "/whitepaper#progeny", label: "Read Model" },
  },
  {
    id: "lineage",
    number: "04",
    label: "Lineage",
    value: "Trace",
    title: "Traceable Lineage",
    body: "Progeny assets inherit source-profile qualities. Games can trace a character, item, or construct back to the origin that created it.",
    link: { href: "/economics#developer-access", label: "Builder Use" },
  },
  {
    id: "vanguard-collections",
    number: "05",
    label: "Vanguard",
    value: "Collections",
    title: "Vanguard Collections",
    body: "Developers can design systems where users generate from their own profile or acquire assets from a Vanguard collection. Scarcity follows the project rules.",
    link: { href: "/vanguard", label: "Vanguard" },
  },
  {
    id: "royalty-routing",
    number: "06",
    label: "Royalty",
    value: "Routing",
    title: "Royalty Routing",
    body: "Lineage assets use wallet-linked attribution where the contract and marketplace route support it. This is marketplace-dependent, not universal enforcement.",
    link: { href: "/economics#royalty-routing", label: "Routing" },
  },
  {
    id: "integration-boundary",
    number: "07",
    label: "Controlled",
    value: "Review",
    title: "Integration Boundary",
    body: "Developer access is controlled review, structure design, and integration planning. Sovereign Engine owns generation truth; game clients consume approved outputs.",
    link: { href: "/whitepaper#deterministic-engine", label: "Litepaper" },
  },
  {
    id: "privacy",
    number: "08",
    label: "Privacy",
    value: "Metadata",
    title: "Privacy And Metadata",
    body: "Integrations use derived stats, lineage references, token IDs, wallet-linked ownership state, and approved metadata. Raw personal intake data stays out of public clients.",
    link: { href: "/whitepaper#privacy-practices", label: "Privacy" },
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
      label: section.label,
      value: section.value,
      title: section.title,
      body: section.body,
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
