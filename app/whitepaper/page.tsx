import {
  CommandPageShell,
  type CommandDrawerAction,
  type CommandPanel,
  type CommandPanelGroup,
} from "@/components/command/CommandPageShell";

const soulDeedContractAddress = "0x2df9151c4e32082a05c686bd3092180134d17deb";

const whitepaperGhostAsset = {
  src: "/whitepaper-assets/t-bre-soul-deed-portrait.png",
  variant: "card" as const,
};

const whitepaperPanelIcons: Record<string, NonNullable<CommandPanel["icon"]>> = {
  "contract-powers": "network",
  "eligibility-gate": "wallet",
  "future-dev-direction": "orbital",
  "genesis-origin": "scroll",
  "image-burner": "scroll",
  "live-contract": "network",
  "mint-pipeline": "network",
  "royalty-rails": "royalty",
};

function withWhitepaperShellAssets(panels: CommandPanel[]): CommandPanel[] {
  return panels.map((panel) => ({
    ...panel,
    ghostAsset: panel.ghostAsset ?? whitepaperGhostAsset,
    icon: panel.icon ?? whitepaperPanelIcons[panel.id] ?? "scroll",
  }));
}

const originPanels: CommandPanel[] = [
  {
    id: "genesis-origin",
    number: "01",
    label: "Origin",
    value: "Genesis",
    title: "Genesis Origin",
    body:
      "Sovereign Engine is live as a Genesis Access mint: an eligible Base wallet passes Coinbase EAS, completes checkout, receives generated metadata, and gets a Soul Deed artifact minted on Base. Thank you for reading early; this moved from premise to working rails quickly, and your support is why the next Engine branches can be built.",
  },
  {
    id: "live-contract",
    number: "02",
    label: "Contract",
    value: "SLDD",
    title: "Live Contract",
    body: [
      {
        label: "Current Address",
        items: [
          "Base Mainnet",
          "Chain ID 8453",
          "Collection: Soul Deed",
          "Symbol: SLDD",
          `Contract: ${soulDeedContractAddress}`,
          "UUPS proxy contract",
        ],
      },
      "This is the current live Soul Deed contract used by the Portal. The earlier pilot contract was superseded during the clean public reset and should not be treated as the active address.",
    ],
  },
  {
    id: "eligibility-gate",
    number: "03",
    label: "Gate",
    value: "EAS",
    title: "Eligibility Gate",
    body: [
      {
        label: "Mint Gate",
        items: [
          "Base wallet required",
          "Coinbase EAS checked server-side",
          "Paid mint order required",
          "Contract acceptance required",
          "Rate limits on mint calls",
          "Backend-only contract mint",
        ],
      },
      "Coinbase EAS is used as the live eligibility signal. We do not pretend it is perfect legal identity or absolute Sybil prevention; it is a practical verified-account gate for a one-person, one-Genesis posture.",
    ],
  },
];

const implementationPanels: CommandPanel[] = [
  {
    id: "mint-pipeline",
    number: "04",
    label: "Pipeline",
    value: "Engine",
    title: "Mint Pipeline",
    body: [
      {
        label: "Execution Path",
        items: [
          "Portal validates wallet and order",
          "Portal re-checks EAS before mint",
          "Engine Lambda builds metadata",
          "Base image loads from S3",
          "Burner creates final JPG",
          "Image pins to Pinata",
          "Worker pins metadata JSON",
          "Thirdweb Engine calls backendMint",
        ],
      },
      "The browser never mints directly. The Portal owns the user journey, the Engine owns generation truth, and the worker executes the onchain write with backend authority.",
    ],
  },
  {
    id: "image-burner",
    number: "05",
    label: "Burner",
    value: "Hash",
    title: "Image Burner",
    body: [
      {
        label: "Artifact Burn",
        items: [
          "ORDO secret required",
          "DOB plus wallet salt encrypted",
          "Short visual hash derived",
          "Initials burned into art",
          "Signature mark burned into art",
          "Twelve stat pip stacks drawn",
          "Finished JPG becomes IPFS image",
          "Metadata receives encrypted_hash",
        ],
      },
      "Raw DOB is not public NFT metadata. The public artifact receives a cryptographic marker and readable visual marks, while the private source inputs stay out of the marketplace trait list.",
    ],
  },
  {
    id: "contract-powers",
    number: "06",
    label: "Powers",
    value: "Onchain",
    title: "Contract Powers",
    body: [
      {
        label: "Current Powers",
        items: [
          "ERC-721 token mint",
          "Token URI storage",
          "Reveal and placeholder controls",
          "Original minter recorded",
          "isVanguard wallet read",
          "Transfer and soulbound controls",
          "Pause and blacklist safeguards",
          "Metadata freeze option",
          "Backend burn path",
          "Upgradeable implementation",
        ],
      },
      "These are real contract rails, not decorative language. They let us protect the live system, preserve original-minter history, and add future Engine behavior without casually breaking minted tokens.",
    ],
  },
];

const forwardPanels: CommandPanel[] = [
  {
    id: "royalty-rails",
    number: "07",
    label: "Royalty",
    value: "Split",
    title: "Royalty Rails",
    body: [
      {
        label: "Configured Route",
        items: [
          "ERC-2981 royalty signal",
          "700 bps total royalty",
          "Per-token splitter clone",
          "50% founder route",
          "50% original minter route",
          "Claim path through splitter",
          "Original minter stays recorded",
          "Marketplace support required",
        ],
      },
      "The royalty route is configured and user-beneficial where marketplaces honor the signal and route payment correctly. It is not universal enforcement, so public language stays honest: supported markets can send royalties to the token splitter.",
    ],
  },
  {
    id: "future-dev-direction",
    number: "08",
    label: "Future",
    value: "Build",
    title: "Dev Direction",
    body: [
      {
        label: "Next Branches",
        items: [
          "Natal Stat with time and location",
          "Kindred Creature as first Progeny",
          "Personal item planning",
          "Adversary branch planning",
          "Holder-gated previews",
          "Developer read-only schemas",
          "Privacy-first metadata rules",
          "Command Shell template hardening",
        ],
      },
      "The direction is deliberate: stabilize Genesis first, make the zodiac stat layer legible, then let future items, creatures, developer systems, and preview branches grow from a real minted origin.",
    ],
  },
];

const whitepaperGroups: CommandPanelGroup[] = [
  {
    label: "System Paper",
    eyebrow: "Whitepaper Control",
    panels: withWhitepaperShellAssets(originPanels),
  },
  {
    label: "Implementation",
    eyebrow: "Whitepaper Control",
    panels: withWhitepaperShellAssets(implementationPanels),
  },
  {
    label: "Forward Rails",
    eyebrow: "Whitepaper Control",
    panels: withWhitepaperShellAssets(forwardPanels),
  },
];

const drawerActions: CommandDrawerAction[] = [
  { href: "/", label: "Home" },
  { href: "/engine-lab", label: "Engine Lab", variant: "opposite" },
  { href: "/vanguard", label: "Vanguard", variant: "opposite" },
  { href: "/economics", label: "Access" },
  { href: "/developer", label: "Developer" },
  { href: "/portal", label: "Portal", variant: "primary" },
];

export default function WhitepaperPage() {
  return (
    <CommandPageShell
      drawerActions={drawerActions}
      drawerContentId="whitepaper-drawer"
      drawerLabel="Whitepaper drawer"
      groups={whitepaperGroups}
    />
  );
}
