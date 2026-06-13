import {
  CommandPageShell,
  type CommandDrawerAction,
  type CommandPanelGroup,
} from "@/components/command/CommandPageShell";
import type { GlossaryTermKey } from "@/lib/glossary";

const economicsGlossaryTerms: GlossaryTermKey[] = [
  "Access Token",
  "Attribute Tree",
  "Contract Address",
  "Genesis",
  "Genesis Mint",
  "Lineage",
  "Marketplace",
  "Mint",
  "Progeny",
  "Royalty",
  "Traceable",
  "Vanguard",
  "Wallet",
  "wallet-linked",
];

const accessPanels = [
  {
    id: "vanguard-access",
    label: "Vanguard",
    value: "Access",
    body: "Vanguard is the legacy access class for Genesis-phase wallets. It carries recognition into published Engine branches without becoming a subscription.",
  },
  {
    id: "progeny-builds",
    label: "Progeny",
    value: "Builds",
    body: "Progeny is the repeatable creation layer: creatures, items, adversaries, transport, characters, and project-specific assets derived from the Genesis profile.",
  },
  {
    id: "royalty-path",
    label: "Royalty",
    value: "Path",
    body: "Royalty routing works when contract rules and marketplace support line up. Approved routes protect attribution better than unsupported venues.",
  },
  {
    id: "builder-use",
    label: "Developer",
    value: "Use",
    body: "Developers can request Progeny structures, attribute trees, and supply rules that fit their game or collection.",
  },
];

const policyPanels = [
  {
    id: "one-genesis",
    number: "01",
    label: "One",
    value: "Genesis",
    title: "One Genesis",
    body: "Genesis remains one person, one mint. That protects the origin layer from wallet farming and keeps each profile anchored to a real participant path.",
  },
  {
    id: "many-builds",
    number: "02",
    label: "Many",
    value: "Builds",
    title: "Many Builds",
    body: "Progeny can repeat under asset-specific rules. Vanguards and eligible access-token holders can create multiple Engine-derived assets where the release allows it.",
  },
  {
    id: "supply-rules",
    number: "03",
    label: "Supply",
    value: "Rules",
    title: "Supply Rules",
    body: "Characters can be strict. Items, transport, companions, and adversaries can be looser. Each project publishes the supply model before minting opens.",
  },
  {
    id: "marketplace-limits",
    number: "04",
    label: "Market",
    value: "Limits",
    title: "Marketplace Limits",
    body: "ERC-2981 is a royalty signal. OpenSea and other supported routes can honor creator earnings, but no marketplace is treated as guaranteed enforcement.",
  },
];

const economicsGroups: CommandPanelGroup[] = [
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
    })),
  },
  {
    label: "Project Rules",
    eyebrow: "Progeny Routing",
    panels: policyPanels,
  },
];

const drawerActions: CommandDrawerAction[] = [
  { href: "/", label: "Home" },
  { href: "/vanguard", label: "Vanguard", variant: "opposite" },
  { href: "/whitepaper", label: "Litepaper", variant: "opposite" },
  { href: "/developer", label: "Developer" },
  { href: "/portal", label: "Portal", variant: "primary" },
];

export default function EconomicsPage() {
  return (
    <CommandPageShell
      drawerActions={drawerActions}
      drawerContentId="economics-drawer"
      drawerLabel="Access drawer"
      glossaryTerms={economicsGlossaryTerms}
      groups={economicsGroups}
    />
  );
}
