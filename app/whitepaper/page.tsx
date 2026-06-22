import type { Metadata } from "next";
import {
  CommandPageShell,
  type CommandDrawerAction,
  type CommandPanel,
  type CommandPanelGroup,
} from "@/components/command/CommandPageShell";
import { preLaunchOfferSummary } from "@/lib/preLaunchOffer";
import { createSeoMetadata, seoPages } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata(seoPages.whitepaper);

const soulDeedContractAddress = "0x2df9151c4e32082a05c686bd3092180134d17deb";

const whitepaperGhostAsset = {
  src: "/whitepaper-assets/Frameless_Deed.jpg",
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
    body: [
      "Sovereign Engine begins with a Genesis Access mint. An eligible Base wallet passes Coinbase EAS, completes the mint path, receives generated metadata, and gets a Soul Deed artifact minted on Base.",
      `The current public-facing pre-launch offer is ${preLaunchOfferSummary} The important idea is simple: one real participant starts one origin, and future Engine branches can build from that origin instead of starting over every time.`,
      {
        label: "Genesis Path",
        items: [
          "Base wallet",
          "Coinbase EAS check",
          "Generated metadata",
          "Soul Deed artifact",
        ],
      },
    ],
  },
  {
    id: "live-contract",
    number: "02",
    label: "Contract",
    value: "SLDD",
    title: "Live Contract",
    body: [
      "This is the current live Soul Deed contract used by the Portal. The earlier pilot contract was superseded during the clean public reset and should not be treated as the active address.",
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
      "For normal users, this means the Portal should point to one current contract path, not a mix of older test addresses and current public mint rails.",
    ],
  },
  {
    id: "eligibility-gate",
    number: "03",
    label: "Gate",
    value: "EAS",
    title: "Eligibility Gate",
    body: [
      "Coinbase EAS is used as the live eligibility signal for the one-person, one-Genesis posture.",
      "It is not presented as perfect legal identity or absolute Sybil prevention. It is a practical verified-account gate that helps reduce empty wallets, bot farming, and duplicate claims.",
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
      "The mint pipeline is the protected path from Portal input to final onchain token.",
      "The browser does not mint directly. The Portal owns the user journey, the Engine owns generation truth, and the worker executes the onchain write with backend authority.",
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
    ],
  },
  {
    id: "image-burner",
    number: "05",
    label: "Burner",
    value: "Hash",
    title: "Image Burner",
    body: [
      "The image burner creates the final visible artifact after the Engine has the approved inputs.",
      "Raw DOB is not public NFT metadata. The public image receives readable marks and a cryptographic marker, while private source inputs stay out of the marketplace trait list.",
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
    ],
  },
  {
    id: "contract-powers",
    number: "06",
    label: "Powers",
    value: "Onchain",
    title: "Contract Powers",
    body: [
      "These are real contract rails, not decorative language. They let the project protect the live system, preserve original-minter history, and support future Engine behavior without casually breaking minted tokens.",
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
      "For users, the key point is that minting, reveal, transfer controls, and metadata protections are contract-level concerns, not just frontend promises.",
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
      "Royalty rails are configured to support creator and original-minter attribution where marketplaces honor the signal and route payment correctly.",
      "This is user-beneficial, but not universal enforcement. Public wording should stay honest: supported markets can send royalties to the token splitter.",
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
    ],
  },
  {
    id: "future-dev-direction",
    number: "08",
    label: "Future",
    value: "Build",
    title: "Dev Direction",
    body: [
      "The next direction is to stabilize Genesis first, make the zodiac stat layer legible, then let future items, creatures, developer systems, and preview branches grow from a real minted origin.",
      "That keeps the public mint path understandable while leaving room for richer Progeny projects once the foundation is steady.",
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
    ],
  },
];

const whitepaperGroups: CommandPanelGroup[] = [
  {
    label: "",
    eyebrow: "Whitepaper Control",
    panels: withWhitepaperShellAssets([
      ...originPanels,
      implementationPanels[0],
    ]),
  },
  {
    label: "",
    eyebrow: "Whitepaper Control",
    panels: withWhitepaperShellAssets([
      ...implementationPanels.slice(1),
      ...forwardPanels,
    ]),
  },
];

const drawerActions: CommandDrawerAction[] = [
  { href: "/", label: "Home" },
  { href: "/vanguard", label: "Vanguard", variant: "opposite" },
  { href: "/access", label: "Access" },
  { href: "/whitepaper", label: "Litepaper", variant: "opposite" },
  { href: "/developer", label: "Developer" },
  { href: "/alliant", label: "Alliant" },
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
