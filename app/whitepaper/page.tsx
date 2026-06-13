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
      "Sovereign Engine turns stable participant inputs into a deterministic profile. The Genesis Access deed is the first artifact tied to that origin.",
      "The result is not a random roll. One verified source creates one profile foundation that other Engine branches can read.",
    ],
  },
  {
    id: "vanguard-access",
    index: "02",
    label: "Vanguard",
    value: "Access",
    title: "Vanguard Access",
    copy: [
      "Vanguard is the legacy access class for wallets that entered during the Genesis phase. The original wallet stays visible as the Engine expands.",
      "Vanguards do not pay membership or subscription fees. Mint rates, collection rules, and release terms are published per branch.",
    ],
  },
  {
    id: "progeny-layer",
    index: "03",
    label: "Progeny",
    value: "Builds",
    title: "Progeny Layer",
    copy: [
      "Progeny is the creation layer built from the Genesis profile: Kindred Creatures, items, adversaries, transport, characters, and project-specific assets.",
      "Genesis stays scarce. Progeny can repeat under asset-specific rules so community creation can grow without turning the origin deed into a farm.",
    ],
  },
  {
    id: "royalty-boundaries",
    index: "04",
    label: "Rules",
    value: "Routing",
    title: "Royalties And Boundaries",
    copy: [
      "The current Soul Deed records original minters and uses token-specific royalty routing where marketplaces support it. ERC-2981 is a signal, not universal enforcement.",
      "Personal intake data belongs in protected generation. Public metadata uses derived stats, token references, and readable terms, not raw private inputs.",
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
