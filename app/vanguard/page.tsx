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
  opacity: 0.24,
  pointerEvents: "none",
  position: "absolute",
  right: "clamp(-0.5rem, 4vw, 3rem)",
  top: "clamp(1.8rem, 7vh, 4.25rem)",
  width: "clamp(13rem, 34vw, 28rem)",
  zIndex: 0,
};

const statusPanels: CommandPanel[] = [
  {
    id: "rail-origin",
    number: "01",
    label: "Origin",
    value: "Vanguard",
    title: "Vanguard Origin",
    body: "Vanguards are the Genesis-phase access class: wallet-linked participants who entered before the Engine branches outward.",
  },
  {
    id: "rail-wallet",
    number: "02",
    label: "Wallet",
    value: "Linked",
    title: "Wallet Linked",
    body: "Recognition follows the original Genesis mint wallet. This keeps the access trail tied to origin wallets instead of anonymous wallet farming.",
  },
  {
    id: "rail-legacy",
    number: "03",
    label: "No Fees",
    value: "Legacy",
    title: "Vanguard Legacy",
    body: "Vanguards keep legacy recognition across published Engine branches and never pay a subscription or membership fee.",
  },
  {
    id: "rail-routing",
    number: "04",
    label: "Royalties",
    value: "Signal",
    title: "Royalty Signal",
    body: "Royalty participation follows contract rules, marketplace support, and published release terms. No marketplace is treated as automatic enforcement.",
  },
];

const policyPanels: CommandPanel[] = [
  {
    id: "kindred-creature",
    number: "01",
    label: "Kindred",
    value: "Creature",
    title: "Kindred Creature",
    body: "Kindred Creature is the first Progeny branch. It is the creature-style mint tied to the Genesis profile rather than a generic drop.",
  },
  {
    id: "natal-chart",
    number: "02",
    label: "Natal",
    value: "Chart",
    title: "Full Natal Chart",
    body: "Full Natal Chart access belongs to the Vanguard benefit set. That branch extends the profile with birth date, time, and location inputs.",
  },
  {
    id: "artifact-item",
    number: "03",
    label: "Artifact",
    value: "Item",
    title: "Artifact Item",
    body: "Artifact Item access uses the Vanguard path. Item releases can use flexible supply when the design calls for multiple tradeable copies.",
  },
  {
    id: "partner-projects",
    number: "04",
    label: "Partner",
    value: "Projects",
    title: "Partner Projects",
    body: "Partner projects publish their own access rules. Vanguard status can be recognized while each project defines supply, pricing, and marketplace routes.",
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
