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
    "drop-shadow(0 0 22px rgba(250, 204, 21, 0.16)) drop-shadow(0 0 48px rgba(125, 211, 252, 0.08))",
  height: "clamp(13rem, 34vw, 28rem)",
  opacity: 0.38,
  pointerEvents: "none",
  position: "absolute",
  right: "clamp(-0.5rem, 4vw, 3rem)",
  top: "clamp(1.8rem, 7vh, 4.25rem)",
  width: "clamp(13rem, 34vw, 28rem)",
};

const statusPanels: CommandPanel[] = [
  {
    id: "rail-origin",
    number: "01",
    label: "Origin",
    value: "Vanguard",
    title: "Vanguard Origin",
    body: [
      "Vanguards are the Genesis-phase supporters: the people who entered before the Engine branches outward.",
      "That matters because the first community should not become invisible later. Their wallets carry a visible record of early support as new branches and projects are published.",
    ],
  },
  {
    id: "rail-wallet",
    number: "02",
    label: "Wallet",
    value: "Linked",
    title: "Wallet Linked",
    body: [
      "Recognition follows the original Genesis mint wallet. It is not meant to reward whoever can spin up the most throwaway wallets.",
      "For users, that keeps status tied to real participation. For builders, it creates a cleaner access trail than anonymous farming.",
    ],
  },
  {
    id: "rail-legacy",
    number: "03",
    label: "No Fees",
    value: "Legacy",
    title: "Vanguard Legacy",
    body: [
      "Vanguard status is designed as lasting recognition, not a monthly toll booth.",
      "Vanguards never pay a subscription or membership fee. Release prices and rules can still change by project, but keeping your place in the first wave does not become another bill.",
    ],
  },
  {
    id: "rail-routing",
    number: "04",
    label: "Royalties",
    value: "Signal",
    title: "Royalty Signal",
    body: [
      "Royalty participation follows contract rules, marketplace support, and each release's published terms.",
      "That is the honest version: the system can signal attribution and route supported payments, but no marketplace should be treated as automatic enforcement.",
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
      "Kindred Creature is the first Progeny branch: a creature-style mint tied to the Genesis profile.",
      "The creature matters because it comes from the person's profile instead of being a disconnected generic drop. It should feel like it belongs to the holder's origin.",
    ],
  },
  {
    id: "natal-chart",
    number: "02",
    label: "Natal",
    value: "Chart",
    title: "Full Natal Chart",
    body: [
      "Full Natal Chart access belongs to the Vanguard benefit set.",
      "That branch expands the profile with birth date, time, and location inputs, making the Engine more personal without forcing those details into public marketplace metadata.",
    ],
  },
  {
    id: "artifact-item",
    number: "03",
    label: "Artifact",
    value: "Item",
    title: "Artifact Item",
    body: [
      "Artifact Item access uses the Vanguard path for item releases.",
      "Items do not always need the same scarcity as people. Some should exist in small sets, and some should be tradeable in larger counts when a game or community actually needs supply.",
    ],
  },
  {
    id: "partner-projects",
    number: "04",
    label: "Partner",
    value: "Projects",
    title: "Partner Projects",
    body: [
      "Partner projects can recognize Vanguard status while publishing their own rules for price, supply, and marketplace routes.",
      "That gives builders flexibility without hiding the terms from the community. The project can be custom, but the access rules should not be a mystery box.",
    ],
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
