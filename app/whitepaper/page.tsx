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
  "Genesis Character",
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

const operatorPanels = [
  {
    id: "deterministic-stats",
    label: "Deterministic Stats",
    body: "Your profile is generated from stable personal inputs, not random rolls. The same source signal produces the same core profile.",
  },
  {
    id: "genesis-access-summary",
    label: "Genesis Access",
    body: "The Deed is your Genesis Character. It starts the profile layer that future Engine systems can read from.",
  },
  {
    id: "progeny-systems",
    label: "Progeny Systems",
    body: "Children, gear, creatures, vehicles, adversaries, and other project assets can inherit traceable qualities from their source profile.",
  },
  {
    id: "royalty-routing-summary",
    label: "Royalty Routing",
    body: "Future lineage mints are planned around wallet-linked routing so creators and Vanguards can be attached to the assets they originate.",
  },
];

const detailSections = [
  {
    id: "deterministic-engine",
    index: "01",
    title: "Deterministic Engine",
    copy: [
      "Sovereign Engine is a deterministic profile and artifact system. Each individual has data that can be parsed into constant stats, which means the result is derived rather than randomly assigned.",
      "The user benefit is continuity. A profile can move across characters, legacy creations, and partner projects while keeping the same origin logic intact.",
    ],
    link: { href: "/engine", label: "Open Artifact" },
  },
  {
    id: "genesis-access",
    index: "02",
    title: "Genesis Access",
    copy: [
      "The Deed is your Genesis Character. It contains stats that remain with your profile whether the artifact is sold, transferred, or held.",
      "One Genesis mint per person protects the launch from empty-wallet harvesting and keeps early access focused on real community formation.",
    ],
    link: { href: "/vanguard", label: "Read Access" },
  },
  {
    id: "vanguard",
    index: "03",
    title: "Vanguard Status",
    copy: [
      "Initial Supporters are introduced as Vanguards. Vanguard status is intended to carry forward through legacy creations and later Sovereign Engine projects.",
      "Benefits tied to future systems will depend on published terms for each launch, but the design goal is persistent recognition for origin wallets.",
    ],
    link: { href: "/vanguard", label: "Read Vanguard" },
  },
  {
    id: "progeny",
    index: "04",
    title: "Progeny As The Future",
    copy: [
      "Progeny includes children and material items: clothing, armor, weapons, creatures, adversarial constructs, transport modes, and other generated assets.",
      "Because each Progeny is derived from parent qualities, a child or item can be traced back to the profile lineage that created it.",
      "The Engine can attribute 479,001,600 possibilities completely unique to a user for each Progeny Project.",
    ],
    link: { href: "/economics", label: "Review Progeny" },
  },
  {
    id: "royalty-routing",
    index: "05",
    title: "Royalty Routing",
    copy: [
      "Future launches are planned around user-linked royalty routing. When a lineage NFT is minted, the originating wallet can be written into the asset as a royalty receiver where the contract and marketplace flow support it.",
      "This is not vague affiliate language. The intent is a rewarded community structure with wallet-linked attribution, contract-level rules, and clear project terms.",
    ],
    link: { href: "/economics", label: "Open Economics" },
  },
  {
    id: "privacy-practices",
    index: "06",
    title: "Privacy And Boundaries",
    copy: [
      "Protected inputs should be used for generation and routing, not exposed as ordinary public content. Public metadata should describe the artifact without revealing raw personal intake data.",
      "The Litepaper should remain clear about what is active today, what is planned, and which benefits require future published terms.",
    ],
    link: { href: "/vanguard", label: "Open Status" },
  },
];

const litepaperGroups: CommandPanelGroup[] = [
  {
    label: "Operator Array",
    eyebrow: "Litepaper Control",
    panels: operatorPanels.map((panel, index) => ({
      id: panel.id,
      number: String(index + 1).padStart(2, "0"),
      label: panel.label,
      value: "Summary",
      title: panel.label,
      body: panel.body,
    })),
  },
  {
    label: "Control Nodes",
    eyebrow: "Sovereign Engine",
    panels: detailSections.map((section) => ({
      id: section.id,
      number: section.index,
      label: section.title,
      value: section.link.label,
      title: section.title,
      body: section.copy,
      link: section.link,
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
