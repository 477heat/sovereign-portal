import {
  CommandPageShell,
  type CommandDrawerAction,
  type CommandPanel,
  type CommandPanelGroup,
} from "@/components/command/CommandPageShell";
import { preLaunchOfferSummary } from "@/lib/preLaunchOffer";

const accessGhostAsset = {
  src: "/Blueprint.png",
  variant: "network" as const,
};

const accessPanelIcons: Record<string, NonNullable<CommandPanel["icon"]>> = {
  "builder-use": "network",
  "many-builds": "orbital",
  "marketplace-limits": "royalty",
  "one-genesis": "scroll",
  "progeny-builds": "creature",
  "royalty-path": "royalty",
  "supply-rules": "network",
  "vanguard-access": "badge",
};

const accessPanels = [
  {
    id: "vanguard-access",
    label: "Vanguard",
    value: "Access",
    body: [
      "Vanguard access is the early-supporter lane for wallets that enter during the Genesis phase.",
      `The current pre-launch offer is ${preLaunchOfferSummary} It gives the Engine a clear way to recognize those wallets later, so future in-house mints, discounts, and claim windows can identify who helped before the public path was fully opened.`,
      {
        label: "User Value",
        items: [
          "Recognized early wallet",
          "No recurring membership",
          "Future access checks",
          "Better in-house pricing",
        ],
      },
    ],
  },
  {
    id: "progeny-builds",
    label: "Progeny",
    value: "Builds",
    body: [
      "Progeny is the repeatable creation layer built from a Genesis profile: creatures, items, adversaries, transport, characters, and project-specific assets.",
      "The Genesis mint stays limited, while Progeny lets a real user keep creating useful game-native assets from the same origin.",
      {
        label: "Creation Path",
        items: [
          "One Genesis origin",
          "Many project branches",
          "Rules set per release",
          "Attributes stay traceable",
        ],
      },
    ],
  },
  {
    id: "royalty-path",
    label: "Royalty",
    value: "Path",
    body: [
      "Royalty routing is the path that can send resale royalties back through the contract-supported wallet routes.",
      "It works best when the contract rules and marketplace support line up. ERC-2981 is a royalty signal supported marketplaces can honor; it is not guaranteed enforcement across every marketplace.",
      {
        label: "Common Rule",
        items: [
          "Use approved marketplaces",
          "Wallet routes matter",
          "Support can vary",
          "Terms should stay honest",
        ],
      },
    ],
  },
  {
    id: "builder-use",
    label: "Developer",
    value: "Use",
    body: [
      "Developers can request Progeny structures, attribute trees, supply rules, and project limits that fit their game or collection.",
      "The benefit is practical: builders can use an existing verified-origin and stat layer instead of inventing identity checks, metadata logic, supply rules, and attribution from scratch.",
      {
        label: "Builder Use",
        items: [
          "Project-specific trees",
          "Cleaner supply rules",
          "Less random rerolling",
          "User-linked outputs",
        ],
      },
    ],
  },
];

const policyPanels = [
  {
    id: "one-genesis",
    number: "01",
    label: "One",
    value: "Genesis",
    title: "One Genesis",
    body: [
      "Genesis is built around one person, one mint path. The point is to make the first origin scarce because the person behind it is unique.",
      "The first stats are astrologically based, but the profile is more complex than simply being an Aries, Capricorn, or any other single sign. Every user runs through the same Engine rules instead of rerolling until the output looks perfect.",
      {
        label: "Why It Matters",
        items: [
          "One origin per person",
          "Less profile spam",
          "Stable starting stats",
          "Cleaner future branches",
        ],
      },
    ],
  },
  {
    id: "many-builds",
    number: "02",
    label: "Many",
    value: "Builds",
    title: "Many Builds",
    body: [
      "Progeny can repeat under asset-specific rules. This is where the system can grow without turning Genesis into an unlimited mint.",
      "A person only needs one Genesis, but future releases can allow many Engine-derived assets: creatures, gear, characters, transport, and other project objects.",
      {
        label: "Growth Layer",
        items: [
          "Genesis stays limited",
          "Progeny can expand",
          "Each project sets rules",
          "Users keep one origin",
        ],
      },
    ],
  },
  {
    id: "supply-rules",
    number: "03",
    label: "Supply",
    value: "Rules",
    title: "Supply Rules",
    body: [
      "Supply rules decide how many of something can exist and how strict the mint should be.",
      "Characters may need tight limits, while items, transport, companions, and adversaries may need more supply for play, trade, and community use. Each project should publish its supply model before minting opens.",
      {
        label: "User Check",
        items: [
          "Know what is limited",
          "Know what can repeat",
          "Know the mint price",
          "Know marketplace rules",
        ],
      },
    ],
  },
  {
    id: "marketplace-limits",
    number: "04",
    label: "Market",
    value: "Limits",
    title: "Marketplace Limits",
    body: [
      "Marketplaces do not all behave the same. Some honor royalty routes and some may not, so users should know where supported trading is expected to work.",
      "The experiment is the full mix: verified human origin, profile-based generation, Progeny assets, and royalty-aware routing. The system works best when users stay inside approved routes.",
      {
        label: "Limit",
        items: [
          "Royalties need support",
          "Approved routes matter",
          "Unsupported sales can vary",
          "Public claims stay measured",
        ],
      },
    ],
  },
];

const accessGroups: CommandPanelGroup[] = [
  {
    label: "Access Matrix",
    eyebrow: "Access Layer",
    panels: accessPanels.map((panel, index) => ({
      id: panel.id,
      number: String(index + 1).padStart(2, "0"),
      label: panel.label,
      value: panel.value,
      title: `${panel.label} ${panel.value}`,
      body: panel.body,
      ghostAsset: accessGhostAsset,
      icon: accessPanelIcons[panel.id] ?? "network",
    })),
  },
  {
    label: "Project Rules",
    eyebrow: "Progeny Routing",
    panels: policyPanels.map((panel) => ({
      ...panel,
      ghostAsset: accessGhostAsset,
      icon: accessPanelIcons[panel.id] ?? "network",
    })),
  },
];

const drawerActions: CommandDrawerAction[] = [
  { href: "/", label: "Home" },
  { href: "/access", label: "Access", variant: "opposite" },
  { href: "/vanguard", label: "Vanguard", variant: "opposite" },
  { href: "/whitepaper", label: "Litepaper", variant: "opposite" },
  { href: "/developer", label: "Developer" },
  { href: "/engine", label: "Engine" },
  { href: "/portal", label: "Portal", variant: "primary" },
];

export default function AccessPage() {
  return (
    <CommandPageShell
      drawerActions={drawerActions}
      drawerContentId="access-drawer"
      drawerLabel="Access drawer"
      groups={accessGroups}
    />
  );
}
