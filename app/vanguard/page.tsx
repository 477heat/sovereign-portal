"use client";

import type { CSSProperties } from "react";
import {
  CommandPageShell,
  type CommandDrawerAction,
  type CommandPanel,
  type CommandPanelGroup,
  type CommandShellPanel,
} from "@/components/command/CommandPageShell";
import type { GlossaryTermKey } from "@/lib/glossary";

const vanguardGlossaryTerms: GlossaryTermKey[] = [
  "Access Token",
  "Artifact Item",
  "Base network gas",
  "Genesis",
  "Genesis Mint",
  "Full Natal Chart",
  "Kindred Creature",
  "Marketplace",
  "Royalty",
  "Sovereign Engine",
  "Token",
  "Traceable",
  "Vanguard",
  "Wallet",
  "wallet-linked",
];

const originBadgeBackdropStyle: CSSProperties = {
  backgroundImage: 'url("/vanguard-assets/golden-v-vanguard-badge.png")',
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "contain",
  filter:
    "drop-shadow(0 0 26px rgba(250, 204, 21, 0.34)) drop-shadow(0 0 54px rgba(125, 211, 252, 0.14))",
  height: "clamp(8rem, 22vw, 17rem)",
  opacity: 1,
  pointerEvents: "none",
  position: "relative",
  width: "clamp(8rem, 22vw, 17rem)",
  zIndex: 2,
};

const statusPanels: CommandPanel[] = [
  {
    id: "rail-origin",
    number: "01",
    label: "Vanguard",
    value: "Early",
    title: "Vanguard",
    body: [
      "Vanguards are early supporters of Sovereign Engine.",
      "These perpetual perks are a thank you for early supporters.",
    ],
  },
  {
    id: "rail-wallet",
    number: "02",
    label: "Access",
    value: "Forever",
    title: "Early Access",
    body: [
      "Early support matters. Vanguards keep their privileges in perpetuity.",
      "If you help open the door early, you should not have to earn the same place again later.",
    ],
  },
  {
    id: "rail-legacy",
    number: "03",
    label: "No Fees",
    value: "No Monthly",
    title: "No Membership",
    body: [
      "Vanguard access is $3 during pre-launch.",
      "Early Supporter Vanguards never pay a membership or subscription. They keep their initial perks and receive future offers automatically.",
    ],
  },
  {
    id: "rail-routing",
    number: "04",
    label: "Wallet",
    value: "Recognition",
    title: "Wallet Recognition",
    body: [
      "Vanguards always keep wallet recognition on their mints.",
      "That recognition carries royalty rights in perpetuity. When a marketplace supports royalties, supported royalties are sent automatically to your wallet.",
    ],
  },
];

const policyPanels: CommandPanel[] = [
  {
    id: "kindred-creature",
    number: "01",
    label: "Kindred",
    value: "Creature",
    title: "Kindred Creature",
    body: [
      "Kindred Creature is your pal for the game side.",
      "As an early supporter, it is yours before that side of the Engine opens wider.",
    ],
  },
  {
    id: "natal-chart",
    number: "02",
    label: "Items",
    value: "Drops",
    title: "Random Item Drops",
    body: [
      "Vanguards receive random Item Drops and bonus Forge Items.",
      "Some will be small thank-you drops. Some will be useful later as the game side continues to develop.",
    ],
  },
  {
    id: "artifact-item",
    number: "03",
    label: "Progeny",
    value: "Priority",
    title: "Progeny Priority",
    body: [
      "Progeny are future Items, Characters, Creatures, and Artifacts that grow out of the original Soul Stat sheet.",
      "These future mints are created under your parentage. They are tied to you, unique to your allowable attribute specs, and some can be traded while others cannot.",
    ],
  },
  {
    id: "partner-projects",
    number: "04",
    label: "Perks",
    value: "List",
    title: "Vanguard Perks",
    body: {
      label: "Perks",
      items: [
        "Vanguard Artifact",
        "Wallet recognition",
        "Royalty routes",
        "No membership fees",
        "No subscription fees",
        "Random Item Drops",
        "Bonus Forge Items",
        "Kindred Creature access",
        "Progeny priority",
        "Future offers",
      ],
    },
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
  const renderVanguardPanelBackdrop = (panel: CommandShellPanel) => {
    if (panel.id !== "rail-origin") {
      return null;
    }

    return (
      <div
        className="command-room__origin-badge-backdrop"
        style={originBadgeBackdropStyle}
        aria-hidden="true"
      />
    );
  };

  return (
    <CommandPageShell
      drawerActions={drawerActions}
      drawerContentId="vanguard-drawer"
      drawerLabel="Vanguard drawer"
      glossaryTerms={vanguardGlossaryTerms}
      groups={drawerGroups}
      renderPanelBackdrop={renderVanguardPanelBackdrop}
    />
  );
}
