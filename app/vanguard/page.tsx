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
  "Launch Day",
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
    label: "Initial Supporters",
    value: "Origin",
    title: "Vanguard Origin",
    body: "Pre-launch supporters enter as Vanguards, the first public access class for the Engine.",
  },
  {
    id: "rail-wallet",
    number: "02",
    label: "Wallet",
    value: "Linked",
    title: "Wallet Linked",
    body: "Recognition is designed around the wallet-linked Genesis mint, not anonymous mint farming.",
  },
  {
    id: "rail-legacy",
    number: "03",
    label: "Legacy",
    value: "Carry-forward",
    title: "Vanguard Legacy",
    body: "Vanguard status carries into Progeny drops, early rate classes, and future project systems. Vanguards will never pay a subscription or membership fee.",
  },
  {
    id: "rail-routing",
    number: "04",
    label: "Routing",
    value: "Conditional",
    title: "Royalty Routing",
    body: "Royalty participation depends on contract rules, marketplace support, and published terms.",
  },
];

type LinkedPolicyPanel = Omit<CommandPanel, "label" | "value"> & {
  link: NonNullable<CommandPanel["link"]>;
};

const policyPanels: LinkedPolicyPanel[] = [
  {
    id: "initial-supporters",
    number: "01",
    title: "Launch Day Progeny",
    body: "The first Progeny mint is the Kindred Creature Mint on Launch Day. Pre-launch supporters receive it for $0.02 plus Base network gas, currently estimated around $0.04-$0.06 but subject to network conditions.",
    link: { href: "/whitepaper#vanguard", label: "Read Vanguard" },
  },
  {
    id: "wallet-linked",
    number: "02",
    title: "Included Engine Mints",
    body: "Vanguards receive the Full Natal Chart Mint when the Engine is ready, plus an Artifact Item Mint at the same early-supporter rate.",
    link: { href: "/whitepaper#genesis-access", label: "Open Access" },
  },
  {
    id: "legacy",
    number: "03",
    title: "Future Progeny Rates",
    body: "Future Progeny mints use a Vanguard rate class when a project supports it, with final pricing set by each project's published specs. In-house Progeny will publish its own launch terms before each release.",
    link: { href: "/economics#developer-access", label: "Builder Use" },
  },
  {
    id: "royalty-routing",
    number: "04",
    title: "Third-party Progeny",
    body: "Third-party Progeny pricing will be set by the developer building that project. Vanguard access may still apply, but each outside launch will publish its own pricing, access rules, and mint details.",
    link: { href: "/economics#royalty-routing", label: "Open Routing" },
  },
];

const drawerGroups: CommandPanelGroup[] = [
  {
    label: "Vanguard Rail",
    eyebrow: "Initial Supporter Layer",
    panels: statusPanels,
  },
  {
    label: "Privilege Queue",
    eyebrow: "Launch Access Layer",
    panels: policyPanels.map((panel) => ({
      ...panel,
      label: panel.title,
      value: panel.link.label,
    })),
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
