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
      "Vanguards will never pay a membership or Subscription.",
      "During pre-launch, support is crucial and deeply appreciated by the solo developer creating this Alliant Studio branch.",
    ],
    ghostAsset: vanguardGhostAsset,
    icon: "badge",
  },
  {
    id: "rail-wallet",
    number: "02",
    label: "Access",
    value: "Forever",
    title: "Early Access",
    body: [
      "Early support stays with you.",
      "That support matters before launch, when the branch is still being built and every early wallet helps carry it forward.",
      "The original support lane stays tied to the wallet instead of being replaced by later hype.",
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
      "There is no recurring fee for Vanguard access.",
      "Vanguards will never pay a membership or subscription.",
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
      "Your wallet is the anchor that keeps your profile connected to you across the platform.",
      "Once your wallet is confirmed, each mint carries that same link so the system recognizes you as Vanguard and routes royalties back to your wallet when marketplace systems support it.",
      {
        label: "Chain Trust",
        items: [
          "Blockchain activity is permanent by design, so wallet history stays visible over time.",
          "Wallets are the way people verify assets across Bitcoin, Ethereum, Base, and other chains you can route through in this ecosystem.",
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
      "Creatures are part of the Progeny family, shaped from your Astro Stats.",
      "Kindred Creature is your first one-to-one mint: it belongs to your profile and stays with you unless the game rules later remove it.",
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
      "Items are also Progeny, created from your Astro Stats and carrying powers from your profile.",
      "Items can be minted in multiples, but each one stays tied to your unique Astro Stats and a confirmed EAS wallet, so they are not mass-made duplicates.",
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
      "Progeny includes future Items, Characters, Creatures, and Artifacts built from your original Soul Stat sheet.",
      "Your Progeny access follows your Vanguard line and the published lineage rules, so your future branch stays connected to where you started.",
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
      {
        label: "Perks",
        items: [
          "No subscription fees ever",
          "No membership fees ever",
          "Vanguard Artifact",
          "Wallet access",
          "Royalty routes",
          "Random Item Drops",
          "Bonus Forge Items",
          "Kindred Creature access",
          "Progeny priority",
          "Future offers",
        ],
      },
      "Your wallet is confirmed during mint and stays attached to your assets, so the system recognizes you as Vanguard and royalty routing can follow the same wallet when marketplace support is available.",
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
  { href: "/engine-lab", label: "Engine Lab", variant: "opposite" },
  { href: "/economics", label: "Access", variant: "opposite" },
  { href: "/whitepaper#vanguard", label: "Whitepaper" },
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
