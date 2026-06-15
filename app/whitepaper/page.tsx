import {
  CommandPageShell,
  type CommandDrawerAction,
  type CommandPanelGroup,
} from "@/components/command/CommandPageShell";
import type { GlossaryTermKey } from "@/lib/glossary";

const litepaperGlossaryTerms: GlossaryTermKey[] = [
  "Artifact",
  "Base-native",
  "Deterministic Profile",
  "Genesis",
  "Genesis Mint",
  "Lineage",
  "Metadata",
  "Progeny",
  "Royalty",
  "Sovereign Engine",
  "Traceable",
  "Vanguard",
  "Wallet",
  "wallet-linked",
];

const litepaperPanels = [
  {
    id: "genesis-engine",
    index: "01",
    label: "Genesis",
    value: "Engine",
    title: "Genesis Engine",
    copy: [
      "Genesis is the starting point: one verified person creates one stable profile from birth-date signal, not from rerolling a random collectible until the numbers behave.",
      "The Engine begins with Western and Chinese zodiac systems, their elemental logic, and the character traditions attached to them. That signal becomes twelve Soul Attributes the user can keep carrying into future branches.",
    ],
  },
  {
    id: "vanguard-access",
    index: "02",
    label: "Vanguard",
    value: "Access",
    title: "Vanguard Access",
    copy: [
      "Vanguard marks the wallets that stepped in during the Genesis phase. The point is simple: early support should stay visible instead of getting buried every time the Engine opens a new branch.",
      "Vanguards do not pay membership or subscription fees. New releases still publish their own rates and rules, but the original support does not vanish into the background.",
    ],
  },
  {
    id: "progeny-layer",
    index: "03",
    label: "Progeny",
    value: "Builds",
    title: "Progeny Layer",
    copy: [
      "Progeny is what the profile can create: Kindred Creatures, items, adversaries, transport, characters, and project-specific assets.",
      "Genesis stays scarce because it represents the person. Progeny can use different supply rules because games need usable assets, trade, and community movement.",
    ],
  },
  {
    id: "royalty-boundaries",
    index: "04",
    label: "Rules",
    value: "Routing",
    title: "Royalties And Boundaries",
    copy: [
      "The Soul Deed records the original minter and can signal royalty routing where marketplaces support the standard. That helps preserve attribution without pretending every marketplace enforces royalties the same way.",
      "Private intake data belongs in protected generation. Public metadata should show useful derived traits, token references, and readable terms, not raw birth records or private identity details.",
    ],
  },
];

const litepaperGroups: CommandPanelGroup[] = [
  {
    label: "Core Brief",
    eyebrow: "Litepaper Control",
    panels: litepaperPanels.map((section) => ({
      id: section.id,
      number: section.index,
      label: section.label,
      value: section.value,
      title: section.title,
      body: section.copy,
    })),
  },
];

const drawerActions: CommandDrawerAction[] = [
  { href: "/", label: "Home" },
  { href: "/vanguard", label: "Vanguard", variant: "opposite" },
  { href: "/economics", label: "Access", variant: "opposite" },
  { href: "/developer", label: "Developer" },
  { href: "/portal", label: "Portal", variant: "primary" },
];

export default function ExecutiveSummaryPage() {
  return (
    <CommandPageShell
      drawerActions={drawerActions}
      drawerContentId="litepaper-drawer"
      drawerLabel="Litepaper drawer"
      glossaryTerms={litepaperGlossaryTerms}
      groups={litepaperGroups}
    />
  );
}
