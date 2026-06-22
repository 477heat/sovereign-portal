import type { Metadata } from "next";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://soulmaster.xyz";

export const siteName = "Sovereign Engine";

export const siteDescription =
  "Mint a Base-native Genesis Access artifact for real participants, with Vanguard Honor for early supporters and future Engine-driven creations.";

export const defaultOgImage = {
  alt: "Sovereign Engine Genesis Access preview",
  height: 630,
  url: "/opengraph-image.jpg",
  width: 1200,
};

export type SeoPage = {
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  description: string;
  image?: typeof defaultOgImage;
  path: string;
  priority?: number;
  title: string;
};

export const seoPages = {
  access: {
    changeFrequency: "monthly",
    description:
      "See how Sovereign Engine access works for Vanguard supporters, Progeny projects, royalty routing, and one-person Genesis mint rules.",
    path: "/access",
    priority: 0.72,
    title: "Access",
  },
  alliant: {
    changeFrequency: "weekly",
    description:
      "Read the Alliant Chapter 1 storyboard: SI, the Quantum Tunnel, the Great Ruin, Sweetpea, AL, and the beacon calling heroes to the Portal.",
    image: {
      alt: "Alliant storyboard scene from Sovereign Engine",
      height: 630,
      url: "/media/alliant-storyboard/chapter-1/web_08_Beacon.webp",
      width: 1200,
    },
    path: "/alliant",
    priority: 0.66,
    title: "Alliant Storyboard",
  },
  archive: {
    changeFrequency: "monthly",
    description:
      "View the archived Architect Certificate of Title artifact, metadata links, and Genesis Access display record.",
    image: {
      alt: "Architect Certificate of Title Genesis Access artifact",
      height: 8064,
      url: "https://gateway.pinata.cloud/ipfs/QmVfRQWBT4Xk2MdQ7xHYaArutxLKdpPqTGXmULDPC342o6",
      width: 5881,
    },
    path: "/archive",
    priority: 0.52,
    title: "Archive",
  },
  artifact: {
    changeFrequency: "monthly",
    description:
      "Try a prototype Sovereign Engine artifact preview that turns birthday and profile inputs into a mock readout.",
    path: "/artifact",
    priority: 0.48,
    title: "Artifact Preview",
  },
  coinbase: {
    changeFrequency: "weekly",
    description:
      "Enter Sovereign Engine from Base with Coinbase-aligned verification, Genesis Access, and a direct path to the Portal.",
    image: {
      alt: "Sovereign Engine Coinbase and Base entry preview",
      height: 630,
      url: "/coinbase-assets/cover-1200x630.jpg",
      width: 1200,
    },
    path: "/coinbase",
    priority: 1,
    title: "Coinbase Entry",
  },
  contractTerms: {
    changeFrequency: "monthly",
    description:
      "Read the formal Certificate of Title agreement wording referenced before the Sovereign Engine Genesis mint.",
    path: "/contract-terms",
    priority: 0.58,
    title: "Contract Terms",
  },
  developer: {
    changeFrequency: "monthly",
    description:
      "Explore how game developers can use Sovereign Engine profile outputs, attribute trees, Actual Supply, lineage, and royalty routing.",
    path: "/developer",
    priority: 0.66,
    title: "Developers",
  },
  dictionary: {
    changeFrequency: "monthly",
    description:
      "Plain-language Sovereign Engine definitions for terms like Genesis Access, Progeny, Vanguard, Coinbase EAS, and royalty routing.",
    path: "/dictionary",
    priority: 0.5,
    title: "Dictionary",
  },
  engine: {
    changeFrequency: "weekly",
    description:
      "Use the prototype Engine Room to explore mock stat generation, profile readouts, and future artifact generation concepts.",
    path: "/engine",
    priority: 0.7,
    title: "Engine Room",
  },
  engineLab: {
    changeFrequency: "weekly",
    description:
      "Preview Sovereign Engine command-shell interface patterns, artifact reveal concepts, and future control deck visuals.",
    path: "/engine-lab",
    priority: 0.5,
    title: "Engine Lab",
  },
  home: {
    changeFrequency: "weekly",
    description: siteDescription,
    path: "/",
    priority: 0.95,
    title: "Genesis Access",
  },
  portal: {
    changeFrequency: "daily",
    description:
      "Open the live Sovereign Engine mint path for the $3 first-100 Genesis Access offer with Vanguard Honor included.",
    path: "/portal",
    priority: 0.92,
    title: "Mint Path",
  },
  privacyPolicy: {
    changeFrequency: "monthly",
    description:
      "Read how Sovereign Engine handles wallet, order, verification, and Yoti-related information for one-person account checks.",
    path: "/privacy-policy",
    priority: 0.44,
    title: "Privacy Policy",
  },
  transporter: {
    changeFrequency: "monthly",
    description:
      "Explore the mock Transporter Room interface and Native Matrix scan visual experiment.",
    path: "/transporter",
    priority: 0.38,
    title: "Transporter Room",
  },
  vanguard: {
    changeFrequency: "weekly",
    description:
      "Learn what Vanguard status means for initial supporters, including Launch Day Progeny, future mints, and early wallet recognition.",
    image: {
      alt: "Sovereign Engine Vanguard badge",
      height: 1200,
      url: "/vanguard-assets/golden-v-vanguard-badge.png",
      width: 1200,
    },
    path: "/vanguard",
    priority: 0.78,
    title: "Vanguard Status",
  },
  whitepaper: {
    changeFrequency: "monthly",
    description:
      "Read the Sovereign Engine litepaper covering Genesis Access, Coinbase EAS eligibility, mint flow, metadata, royalties, and future developer direction.",
    image: {
      alt: "Sovereign Engine Certificate of Title artifact",
      height: 1200,
      url: "/whitepaper-assets/Frameless_Deed.jpg",
      width: 875,
    },
    path: "/whitepaper",
    priority: 0.68,
    title: "Litepaper",
  },
} satisfies Record<string, SeoPage>;

export const publicSeoPages: readonly SeoPage[] = [
  seoPages.coinbase,
  seoPages.home,
  seoPages.portal,
  seoPages.vanguard,
  seoPages.access,
  seoPages.whitepaper,
  seoPages.contractTerms,
  seoPages.alliant,
  seoPages.developer,
  seoPages.dictionary,
  seoPages.archive,
  seoPages.privacyPolicy,
  seoPages.engine,
  seoPages.engineLab,
  seoPages.artifact,
  seoPages.transporter,
] as const;

export function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function createSeoMetadata(page: SeoPage): Metadata {
  const image = page.image ?? defaultOgImage;

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: page.path,
    },
    openGraph: {
      type: "website",
      url: page.path,
      siteName,
      title: `${page.title} | ${siteName}`,
      description: page.description,
      images: [
        {
          url: image.url,
          width: image.width,
          height: image.height,
          alt: image.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.title} | ${siteName}`,
      description: page.description,
      images: [image.url],
    },
  };
}
