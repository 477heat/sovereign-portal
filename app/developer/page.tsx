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
    body: [
      "Use Engine-approved profile outputs as the starting point for characters, classes, and persistent player identity.",
      "The profile begins with birth-date zodiac signal and expands into twelve Soul Attributes. Developers get personalization with a stable source instead of relying on random rolls alone.",
    ],
  },
  {
    id: "progeny-trees",
    label: "Progeny",
    value: "Trees",
    body: [
      "Request the trait structure your game actually needs: character, item, creature, vehicle, or another project-specific asset.",
      "The goal is not a generic generator. It is a generation system shaped around the world you are building, using only the stats and elements that matter to that world.",
    ],
  },
  {
    id: "traceable-lineage-summary",
    label: "Lineage",
    value: "Traceable",
    body: [
      "Generated assets can keep a readable link back to the profile that created them.",
      "That helps players, collectors, and communities understand where an asset came from instead of treating every item like it fell out of a black box.",
    ],
  },
  {
    id: "routing-conditional-summary",
    label: "Royalty",
    value: "Path",
    body: [
      "Wallet-linked attribution can be designed into assets where contracts and marketplaces support it.",
      "That is useful for creator credit and resale routing, but it should stay framed as support-dependent instead of guaranteed everywhere.",
    ],
  },
];

const developerSections = [
  {
    id: "profile-layer",
    number: "01",
    label: "Profile",
    value: "Layer",
    title: "Profile Layer",
    body: [
      "Sovereign Engine turns approved user inputs into a stable profile for games and collections.",
      "For developers, that means a player can have a consistent identity source instead of a new random result every time they touch a project. The first layer uses birth date and zodiac logic; the natal expansion adds birth time and location for deeper trees.",
    ],
    link: { href: "/engine", label: "View Engine" },
  },
  {
    id: "progeny-structures",
    number: "02",
    label: "Attribute",
    value: "Trees",
    title: "Attribute Trees",
    body: [
      "A Progeny project defines what can be generated from a Genesis profile: creatures, characters, gear, transport, adversaries, locations, or other game objects.",
      "The tree matters because it turns profile data into useful game design instead of a spreadsheet full of disconnected traits.",
    ],
    link: { href: "/economics#progeny-model", label: "Open Progeny" },
  },
  {
    id: "possibility-space",
    number: "03",
    label: "Actual",
    value: "Supply",
    title: "Actual Supply",
    body: [
      "One verified Genesis origin gives developers a cleaner supply base.",
      "It is designed to make profile spam harder, so players cannot keep rerolling wallets until they get the best outcome. If the birthday is the seed, EAS and mint history help keep that seed tied to a real participant.",
    ],
    link: { href: "/whitepaper#progeny", label: "Read Model" },
  },
  {
    id: "lineage",
    number: "04",
    label: "Lineage",
    value: "Trace",
    title: "Traceable Lineage",
    body: [
      "Progeny assets can inherit qualities from the profile that created them.",
      "That gives games and communities a way to trace an item, character, or construct back to its source.",
    ],
    link: { href: "/economics#developer-access", label: "Builder Use" },
  },
  {
    id: "vanguard-collections",
    number: "05",
    label: "Vanguard",
    value: "Collections",
    title: "Vanguard Collections",
    body: [
      "Developers can design systems where users generate from their own profile or acquire assets from a Vanguard collection.",
      "That creates room for both personal identity and market movement. Scarcity follows the published project rules instead of one rule being forced onto every asset.",
    ],
    link: { href: "/vanguard", label: "Vanguard" },
  },
  {
    id: "royalty-routing",
    number: "06",
    label: "Royalty",
    value: "Routing",
    title: "Royalty Routing",
    body: [
      "Lineage assets can use wallet-linked attribution where the contract and marketplace route support it.",
      "This helps creator credit survive resale better than a loose promise in a Discord post, while staying honest about marketplace-dependent enforcement.",
    ],
    link: { href: "/economics#royalty-routing", label: "Routing" },
  },
  {
    id: "integration-boundary",
    number: "07",
    label: "Controlled",
    value: "Review",
    title: "Integration Boundary",
    body: [
      "Developer access is reviewed and scoped before integration.",
      "That boundary matters because the Portal can display approved outputs, but the Engine remains the source of truth for generation, metadata, and protected rules.",
    ],
    link: { href: "/whitepaper#deterministic-engine", label: "Litepaper" },
  },
  {
    id: "privacy",
    number: "08",
    label: "Privacy",
    value: "Metadata",
    title: "Privacy And Metadata",
    body: [
      "Integrations use derived stats, lineage references, token IDs, wallet-linked ownership state, and approved metadata.",
      "Raw personal intake data stays out of public clients. The system should be useful to games without asking users to turn private details into public collectibles.",
    ],
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
