"use client";

import {
  CommandPageShell,
  type CommandDrawerAction,
  type CommandPanel,
  type CommandPanelGroup,
} from "@/components/command/CommandPageShell";

const vanguardGhostAsset = {
  src: "/vanguard-assets/golden-v-vanguard-badge.png",
  variant: "badge" as const,
};

const statusPanels: CommandPanel[] = [
  {
    id: "rail-origin",
    number: "01",
    label: "Vanguard",
    value: "Early",
    title: "Vanguard",
    body: [
      "Vanguard is the initial-supporter status for wallets that helped Sovereign Engine before the full public launch path is finished.",
      "It is meant to keep early supporters visible as the Engine grows, so later launches can recognize who was here at the beginning.",
      {
        label: "Status",
        items: [
          "Recognized wallet status",
          "Early-supporter access",
          "Future Progeny priority",
          "No subscription requirement",
        ],
      },
    ],
    ghostAsset: vanguardGhostAsset,
    icon: "badge",
  },
  {
    id: "rail-wallet",
    number: "02",
    label: "Access",
    value: "Forever",
    title: "Access Protocol",
    body: [
      "Access is granted to the wallet that completes the eligible Vanguard path. That wallet becomes the address the Engine checks when a future mint, discount, or claim window opens.",
      "For Vanguards, access is not just a login. It is the signal that tells the system which wallets should receive early visibility, special pricing, included mints, and future status-based offers.",
      {
        label: "Access Permits",
        items: [
          "Wallet-based checks",
          "Launch Day Progeny access",
          "Discounted in-house mints",
          "Future Vanguard offers",
        ],
      },
      "The common rule is simple: keep control of the wallet that earned Vanguard status, because that wallet is how the Engine knows the access belongs to you.",
    ],
    ghostAsset: vanguardGhostAsset,
    icon: "wallet",
  },
  {
    id: "rail-legacy",
    number: "03",
    label: "No Fees",
    value: "No Monthly",
    title: "No Fees",
    body: [
      "Vanguard is not a subscription club. There is no monthly charge, renewal charge, or membership bill just to keep the status.",
      "Future mints can still have normal costs, such as mint prices, gas, or third-party project rules. The status itself is the part that stays attached without a recurring fee.",
      {
        label: "Fee Boundary",
        items: [
          "No monthly fee",
          "No renewal charge",
          "Mint prices may vary",
          "Network gas can still apply",
        ],
      },
    ],
    ghostAsset: vanguardGhostAsset,
    icon: "badge",
  },
  {
    id: "rail-routing",
    number: "04",
    label: "Wallet",
    value: "Access",
    title: "Wallet Access",
    body: [
      "Your wallet is the anchor that lets the system recognize you without asking you to create a separate Sovereign Engine account.",
      "Once the correct wallet is confirmed, Vanguard checks can use that address to unlock access, attach eligible mints, and route supported royalties where marketplaces honor them.",
      {
        label: "Wallet Rules",
        items: [
          "Your wallet proves asset ownership",
          "Base activity stays visible over time",
          "Approved marketplaces may honor royalty routing",
          "Wrong wallets can miss access checks",
        ],
      },
    ],
    ghostAsset: vanguardGhostAsset,
    icon: "royalty",
  },
];

const policyPanels: CommandPanel[] = [
  {
    id: "kindred-creature",
    number: "01",
    label: "Kindred",
    value: "Creature",
    title: "Progeny Creature",
    body: [
      "Kindred Creature is planned as the first Vanguard Progeny mint on Launch Day. It is the first example of a project branching from the same origin as your Genesis path.",
      "Instead of letting users reroll until they like the result, the creature begins from profile-linked attributes. That keeps each user's creature tied to the same starting identity logic.",
      {
        label: "Launch Use",
        items: [
          "Planned early-supporter pricing",
          "Creature-class Progeny",
          "Profile-linked attributes",
          "Base network gas applies",
        ],
      },
    ],
    ghostAsset: vanguardGhostAsset,
    icon: "creature",
  },
  {
    id: "natal-chart",
    number: "02",
    label: "Items",
    value: "Drops",
    title: "Items",
    body: [
      "Items are also Progeny. Clothing, armor, weapons, tools, and other gear can be created from a user-linked attribute path.",
      "For Vanguards, item mints are planned as a low-cost way to keep building from the same origin instead of starting over with every project.",
      {
        label: "Item Path",
        items: [
          "Profile-linked gear",
          "Future in-house item mints",
          "Developer-defined item rules",
          "Attributes remain traceable",
        ],
      },
    ],
    ghostAsset: vanguardGhostAsset,
    icon: "scroll",
  },
  {
    id: "artifact-item",
    number: "03",
    label: "Progeny",
    value: "Priority",
    title: "Progeny Priority",
    body: [
      "Progeny means future mints that branch from your original profile: characters, creatures, items, weapons, artifacts, and more.",
      "Vanguard priority means early wallets are intended to see in-house Progeny paths before broader public waves, with better pricing when the project allows it.",
      {
        label: "Priority",
        items: [
          "Earlier access windows",
          "Discounted in-house launches",
          "Future project recognition",
          "Lineage remains connected",
        ],
      },
    ],
    ghostAsset: vanguardGhostAsset,
    icon: "orbital",
  },
  {
    id: "partner-projects",
    number: "04",
    label: "Perks",
    value: "List",
    title: "Vanguard Perks",
    body: [
      "Perks are the practical benefits attached to Vanguard status. They are meant to reward early support with access, recognition, lower in-house costs, and first looks at future Engine releases.",
      "This is not meant to be a vague promise of passive income. The useful part is that the same wallet can keep being recognized as new Engine projects arrive.",
      {
        label: "Perks",
        items: [
          "No membership fee",
          "Vanguard recognition",
          "Kindred Creature access",
          "Future item mints",
          "In-house discounts",
          "Royalty-aware wallet routes",
          "Priority Progeny windows",
          "Future access offers",
        ],
      },
      "Third-party projects can set their own prices and rules. In-house launches should keep Vanguard benefits visible, understandable, and easy to claim.",
    ],
    ghostAsset: vanguardGhostAsset,
    icon: "network",
  },
];

const drawerGroups: CommandPanelGroup[] = [
  {
    label: "Vanguard Rail",
    eyebrow: "Initial Supporter Layer",
    panels: statusPanels,
  },
  {
    label: "Access Queue",
    eyebrow: "Vanguard Access",
    panels: policyPanels,
  },
];

const drawerActions: CommandDrawerAction[] = [
  { href: "/", label: "Home" },
  { href: "/vanguard", label: "Vanguard", variant: "opposite" },
  { href: "/access", label: "Access", variant: "opposite" },
  { href: "/whitepaper#vanguard", label: "Whitepaper" },
  { href: "/developer", label: "Developer" },
  { href: "/portal", label: "Portal", variant: "primary" },
];

export default function VanguardPrivilegesPage() {
  return (
    <CommandPageShell
      drawerActions={drawerActions}
      drawerContentId="vanguard-drawer"
      drawerLabel="Vanguard drawer"
      groups={drawerGroups}
    />
  );
}
