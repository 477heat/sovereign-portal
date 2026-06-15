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
    body: [
      "Vanguard is early-supporter access for Genesis-phase wallets.",
      "It keeps those supporters visible in published Engine branches without turning the project into a subscription club. Early support should create durable recognition, not another monthly charge.",
    ],
  },
  {
    id: "progeny-builds",
    label: "Progeny",
    value: "Builds",
    body: [
      "Progeny is the repeatable creation layer: creatures, items, adversaries, transport, characters, and project-specific builds derived from a Genesis profile.",
      "This lets the community create more things without making the Genesis deed unlimited. One human origin can lead to many useful game-native assets.",
    ],
  },
  {
    id: "royalty-path",
    label: "Royalty",
    value: "Path",
    body: [
      "Royalty routing works when contract rules and marketplace support line up.",
      "That protects attribution better than unsupported venues, but the promise stays honest: ERC-2981 is a signal that supported marketplaces can honor, not a magic spell over every sale on the internet.",
    ],
  },
  {
    id: "builder-use",
    label: "Developer",
    value: "Use",
    body: [
      "Developers can request Progeny structures, attribute trees, and supply rules that fit their game or collection.",
      "The practical benefit is time and trust: builders can use the Engine's verified origin and stat layer instead of inventing identity, metadata, supply logic, and attribution from scratch.",
    ],
  },
];

const policyPanels = [
  {
    id: "one-genesis",
    number: "01",
    label: "One",
    value: "Genesis",
    title: "One Genesis",
    body: [
      "Genesis is built around one person, one mint path.",
      "That single fact is a big part of the value. The first stats come from birthday-based Western and Chinese zodiac logic, then every user runs through the same Engine.",
    ],
  },
  {
    id: "many-builds",
    number: "02",
    label: "Many",
    value: "Builds",
    title: "Many Builds",
    body: [
      "Progeny can repeat under asset-specific rules.",
      "That is where the economy can grow. A person only needs one Genesis, but they can create, trade, or use many Engine-derived assets when a release allows it.",
    ],
  },
  {
    id: "supply-rules",
    number: "03",
    label: "Supply",
    value: "Rules",
    title: "Supply Rules",
    body: [
      "Some assets should be rare. Others need enough supply to support play, trade, and community use.",
      "Characters can be strict while items, transport, companions, and adversaries can be looser. Each project should publish its supply model before minting opens.",
    ],
  },
  {
    id: "marketplace-limits",
    number: "04",
    label: "Market",
    value: "Limits",
    title: "Marketplace Limits",
    body: [
      "ERC-2981 is a royalty signal. OpenSea and other supported routes can honor creator earnings, but no marketplace is treated as guaranteed enforcement.",
      "We have not seen many projects combine verified human origin, profile-based generation, Progeny assets, and royalty-aware routing in this exact way. That mix is the real experiment.",
    ],
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
