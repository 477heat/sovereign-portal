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
    id: "initial-supporters",
    label: "Initial Supporters",
    value: "Vanguard",
    body: "Vanguard is the legacy access tier. Benefits carry forward as new Access Token variants launch.",
  },
  {
    id: "progeny-inheritance",
    label: "Progeny",
    value: "Inheritance",
    body: "Characters, children, gear, creatures, and project assets can inherit traceable source qualities.",
  },
  {
    id: "approved-routing",
    label: "Routing",
    value: "Approved",
    body: "Royalty benefits depend on approved marketplace routes that honor the collection's royalty flow.",
  },
  {
    id: "builder-use",
    label: "Builder Use",
    value: "Trees",
    body: "Developers can choose a Progeny structure or request a project-specific attribute tree.",
  },
];

const policyPanels = [
  {
    id: "day-one-access",
    number: "01",
    title: "Legacy Access",
    body: "Vanguard wallets keep their access tier as the Engine expands. New Access Token variants may introduce new benefits, but Vanguard eligibility is designed to carry forward by default.",
    link: { href: "/vanguard", label: "Read Vanguard" },
  },
  {
    id: "progeny-model",
    number: "02",
    title: "Progeny Model",
    body: "Progeny includes children and material assets: clothing, armor, weapons, creatures, adversarial constructs, transport, and project objects. Each Progeny Project can draw from 479,001,600 user-specific possibilities, with supply rules shaped by the asset type and published project terms.",
    link: { href: "/whitepaper#progeny", label: "Open Progeny" },
  },
  {
    id: "royalty-routing",
    number: "03",
    title: "Royalty Routing",
    body: "When the contract and marketplace route support it, the originating wallet is written into a lineage NFT as a royalty receiver. Approved marketplaces, including OpenSea when creator earnings are supported, help preserve that route.",
    link: { href: "/whitepaper#royalty-routing", label: "Open Routing" },
  },
  {
    id: "developer-access",
    number: "04",
    title: "Developer Access",
    body: "Developers can choose which Progeny structure fits their game or request a specific character attribute tree for users to generate from or purchase through a Vanguard collection.",
    link: { href: "/engine", label: "Open Engine" },
  },
  {
    id: "marketplace-limits",
    number: "05",
    title: "Marketplace Limits",
    body: "Some marketplaces do not honor royalty routing. Users should use approved marketplaces for Vanguard and Progeny sales so contract-level attribution has the best chance to work as intended.",
    link: { href: "/whitepaper#privacy-practices", label: "Read Limits" },
  },
];

const progenyExplainer = [
  {
    label: "Genesis stays scarce",
    body: "The Genesis Soul Deed is intended as the one-person entry point. It anchors the profile layer before later Engine branches open.",
  },
  {
    label: "Progeny can repeat",
    body: "Future Progeny is planned as the repeatable creation layer. Eligible users, especially Vanguards, may be able to generate and sell multiple assets over time.",
  },
  {
    label: "Rules fit the asset",
    body: "A developer game character can be strict if the game needs one active character per player. Weapons, armor, transport, companions, and similar assets can stay more flexible.",
  },
];

const futureProgenyBody = [
  "Early users should think of Genesis as the origin deed, not the entire Engine. Progeny is planned to become the layer where characters, gear, vehicles, creatures, and project-specific assets can be generated from that origin.",
  ...progenyExplainer.map((item) => `${item.label}: ${item.body}`),
  "In a later release, Vanguard inventory may let users compare generated Progeny by type or game, request a mint from a Vanguard-generated asset, or purchase through approved routes where the contract and marketplace support the flow. These mechanics are roadmap direction until published in live terms.",
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
    label: "Progeny Flow",
    eyebrow: "Future Builds",
    panels: [
      {
        id: "future-progeny-flow",
        number: "01",
        label: "One Genesis",
        value: "Many Builds",
        title: "One Genesis. Many Future Builds.",
        body: futureProgenyBody,
      },
    ],
  },
  {
    label: "Policy Nodes",
    eyebrow: "Progeny Routing",
    panels: policyPanels.map((panel) => ({
      id: panel.id,
      number: panel.number,
      label: panel.title,
      value: panel.link.label,
      title: panel.title,
      body: panel.body,
      link: panel.link,
    })),
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
