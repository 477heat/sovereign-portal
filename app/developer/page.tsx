import {
  CommandPageShell,
  type CommandDrawerAction,
  type CommandPanelGroup,
} from "@/components/command/CommandPageShell";

const builderPanels = [
  {
    id: "profile-source",
    label: "Profile",
    value: "Source",
    body: [
      "Use Engine-approved profile outputs as the starting point for characters, classes, and persistent player identity.",
      "The profile begins with a stable user marker and birthday-based zodiac signal, then expands into Soul Attributes. Developers get personalization without relying on random rolls alone.",
      {
        label: "Useful For",
        items: [
          "Player identity",
          "Starting attributes",
          "Class direction",
          "Future character rules",
        ],
      },
    ],
  },
  {
    id: "progeny-trees",
    label: "Progeny",
    value: "Trees",
    body: [
      "Request the trait structure your game actually needs: character, item, creature, vehicle, weapon, path, or another project-specific asset.",
      "The goal is not a generic generator. It is a generation system shaped around the world you are building, using the stats and elements that matter to that world.",
      {
        label: "Developer Choice",
        items: [
          "Choose asset type",
          "Choose needed attributes",
          "Choose supply rules",
          "Choose what users can mint",
        ],
      },
    ],
  },
  {
    id: "traceable-lineage-summary",
    label: "Lineage",
    value: "Traceable",
    body: [
      "Generated assets can keep a readable link back to the profile that created them.",
      "That helps players, collectors, and communities understand where an item, creature, or character came from instead of treating every asset like it appeared from nowhere.",
      {
        label: "Why It Helps",
        items: [
          "Clear parent profile",
          "Better story logic",
          "Traceable collections",
          "Less anonymous output",
        ],
      },
    ],
  },
  {
    id: "routing-conditional-summary",
    label: "Royalty",
    value: "Path",
    body: [
      "Wallet-linked attribution can be designed into assets where contracts and marketplaces support it.",
      "That is useful for creator credit, resale routing, and collection history, but it should stay framed as support-dependent instead of guaranteed everywhere.",
      {
        label: "Boundary",
        items: [
          "Contract support required",
          "Marketplace support required",
          "Wallet routes must match",
          "Claims should stay clear",
        ],
      },
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
      "Sovereign Engine turns approved user inputs into a stable profile that games and collections can build from.",
      "For developers, that means a player can have one consistent identity source instead of a fresh random result every time they enter a project. The first layer uses birth date and zodiac logic; deeper trees can be added only when the project actually needs them.",
      {
        label: "Design Use",
        items: [
          "Consistent player source",
          "Repeatable stat logic",
          "Less reroll abuse",
          "Expandable profile depth",
        ],
      },
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
      "An attribute tree defines what a Progeny project needs before an asset can exist in a game.",
      "For example, a creature may need temperament, element, movement, rarity, and role. A weapon may need damage style, material, class limit, and upgrade path. The tree turns profile data into usable game design instead of disconnected traits.",
      {
        label: "Tree Answers",
        items: [
          "What can be minted",
          "What stats matter",
          "What limits apply",
          "How it fits the game",
        ],
      },
    ],
    link: { href: "/access#progeny-model", label: "Open Progeny" },
  },
  {
    id: "possibility-space",
    number: "03",
    label: "Actual",
    value: "Supply",
    title: "Actual Supply",
    body: [
      "One verified Genesis origin gives developers a cleaner supply base.",
      "The point is to reduce profile spam, so players cannot keep creating new accounts until they get the best result. If the profile source is stable, game balance can plan around real variation instead of endless rerolls.",
      {
        label: "Supply Benefit",
        items: [
          "Fewer duplicate users",
          "Cleaner launch counts",
          "More honest rarity",
          "Better balance planning",
        ],
      },
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
      "That gives games and communities a way to trace an item, character, creature, or construct back to its source. It also gives players a better story for why their assets feel connected.",
      {
        label: "Lineage Use",
        items: [
          "Parent profile visible",
          "Traits have context",
          "Collections tell a story",
          "Assets feel less random",
        ],
      },
    ],
    link: { href: "/access#developer-access", label: "Builder Use" },
  },
  {
    id: "vanguard-collections",
    number: "05",
    label: "Vanguard",
    value: "Collections",
    title: "Vanguard Collections",
    body: [
      "Developers can design systems where users generate from their own profile or acquire assets from a Vanguard collection.",
      "That creates room for personal identity, trading, and curated project releases. Scarcity follows the published project rules instead of forcing one mint rule onto every asset.",
      {
        label: "Collection Options",
        items: [
          "User-generated assets",
          "Vanguard-origin assets",
          "Project-defined scarcity",
          "Marketplace movement",
        ],
      },
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
      "This helps creator credit survive resale better than a loose promise in a chat post. It also keeps the limitation clear: routing depends on the contract path and the marketplace honoring it.",
      {
        label: "Routing Need",
        items: [
          "Supported marketplace",
          "Correct wallet route",
          "Contract-aware metadata",
          "Clear public terms",
        ],
      },
    ],
    link: { href: "/access#royalty-routing", label: "Routing" },
  },
  {
    id: "integration-boundary",
    number: "07",
    label: "Controlled",
    value: "Review",
    title: "Integration Boundary",
    body: [
      "Developer access is reviewed and scoped before integration.",
      "That boundary matters because the Portal can display approved outputs, but the Engine remains the source of truth for generation, metadata, and protected rules. Developers can build on the system without rewriting the rules themselves.",
      {
        label: "Boundary",
        items: [
          "Engine owns truth",
          "Portal displays outputs",
          "Projects request scopes",
          "Protected rules stay protected",
        ],
      },
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
      "Raw personal intake data should stay out of public clients. The system should be useful to games without asking users to turn private details into public collectibles.",
      {
        label: "Public Surface",
        items: [
          "Derived stats only",
          "Approved metadata",
          "Wallet-linked ownership",
          "Private inputs protected",
        ],
      },
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
    panels: developerSections.slice(0, 4).map((section) => ({
      id: section.id,
      number: section.number,
      label: section.label,
      value: section.value,
      title: section.title,
      body: section.body,
    })),
  },
  {
    label: "Developer Boundary",
    eyebrow: "Scoped Access",
    panels: developerSections.slice(4).map((section) => ({
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
  { href: "/access", label: "Access", variant: "opposite" },
  { href: "/vanguard", label: "Vanguard" },
  { href: "/developer", label: "Developer" },
  { href: "/alliant", label: "Alliant" },
  { href: "/portal", label: "Portal", variant: "primary" },
];

export default function DeveloperPage() {
  return (
    <CommandPageShell
      drawerActions={drawerActions}
      drawerContentId="developer-drawer"
      drawerLabel="Developer drawer"
      groups={developerGroups}
    />
  );
}
