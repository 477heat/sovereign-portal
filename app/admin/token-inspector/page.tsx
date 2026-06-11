"use client";

import Link from "next/link";
import { FormEvent, ReactNode, useState } from "react";
import { createThirdwebClient, getContract, readContract } from "thirdweb";
import { base } from "thirdweb/chains";
import {
  ConnectButton,
  ThirdwebProvider,
  useActiveAccount,
} from "thirdweb/react";
import { formatEther, parseEther } from "ethers";
import { ipfsGatewayUrl, ipfsGatewayUrls } from "@/lib/ipfs";
import { SOUL_DEED_CONTRACT_ADDRESS } from "@/lib/soulContract";

const CONTRACT_ADDRESS = SOUL_DEED_CONTRACT_ADDRESS;
const thirdwebClientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
const thirdwebClient = thirdwebClientId
  ? createThirdwebClient({ clientId: thirdwebClientId })
  : null;
const soulContract = thirdwebClient
  ? getContract({
      client: thirdwebClient,
      chain: base,
      address: CONTRACT_ADDRESS,
    })
  : null;

const STAT_TRAIT_LABELS = [
  "Presence",
  "Wealth",
  "Fortitude",
  "Cunning",
  "Flair",
  "Vigor",
  "Kinship",
  "Potency",
  "Wisdom",
  "Prestige",
  "Influence",
  "Arcana",
];
const SUMMARY_TRAIT_LABELS = new Set([
  "Age",
  "Karmic Debt",
  "Power Score",
  "Soul Stat Total",
  "Stat Total",
]);

type TokenMetadataAttribute = {
  display_type?: string;
  trait_type?: string;
  value?: string | number | boolean;
};

type TokenMetadata = {
  name?: string;
  description?: string;
  image?: string;
  external_url?: string;
  attributes?: TokenMetadataAttribute[];
  attribute_profile?: string;
  contract_terms?: string;
  contract_terms_url?: string;
  contract_terms_format?: string;
  contract_wording_version?: string;
  encrypted_hash?: string;
  [key: string]: unknown;
};

type TokenLookup = {
  lookupInput: string;
  tokenId?: bigint;
  owner?: string;
  originalMinter?: string;
  royaltySplitter?: string;
  tokenURI: string;
  metadataUrl?: string;
  imageURI?: string;
  imageUrl?: string;
  metadata?: TokenMetadata;
  salePriceWei?: bigint;
  royaltyReceiver?: string;
  royaltyAmountWei?: bigint;
};

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatNativeAmount(value: bigint) {
  return `${formatEther(value)} ETH`;
}

function parsePositiveEth(value: string, label: string) {
  const amount = parseEther(value.trim());

  if (amount <= BigInt(0)) {
    throw new Error(`${label} must be greater than zero.`);
  }

  return amount;
}

function parseTokenId(value: string) {
  const tokenId = BigInt(value.trim());

  if (tokenId < BigInt(0)) {
    throw new Error("Token ID cannot be negative.");
  }

  return tokenId;
}

function stripMetadataPrefix(traitType?: string) {
  return (traitType ?? "")
    .replace(/^\d{2}\s+/, "")
    .replace(/^\*/, "")
    .replace(/^x/, "");
}

function isMetadataResource(value: string) {
  return Boolean(ipfsGatewayUrl(value.trim()));
}

function isStatTrait(attribute: TokenMetadataAttribute) {
  return STAT_TRAIT_LABELS.includes(stripMetadataPrefix(attribute.trait_type));
}

function isSummaryTrait(attribute: TokenMetadataAttribute) {
  const trait = attribute.trait_type ?? "";

  return (
    trait.startsWith("x") || SUMMARY_TRAIT_LABELS.has(stripMetadataPrefix(trait))
  );
}

function sortStatAttributes(attributes: TokenMetadataAttribute[]) {
  return [...attributes].sort((left, right) => {
    const leftIndex = STAT_TRAIT_LABELS.indexOf(
      stripMetadataPrefix(left.trait_type),
    );
    const rightIndex = STAT_TRAIT_LABELS.indexOf(
      stripMetadataPrefix(right.trait_type),
    );

    return leftIndex - rightIndex;
  });
}

function formatMetadataValue(value: TokenMetadataAttribute["value"]) {
  if (value === undefined || value === null) {
    return "Empty";
  }

  return String(value);
}

function getMetadataGroups(metadata?: TokenMetadata) {
  const attributes = metadata?.attributes ?? [];
  const stats = sortStatAttributes(attributes.filter(isStatTrait));
  const summaries = attributes.filter(
    (attribute) => !isStatTrait(attribute) && isSummaryTrait(attribute),
  );

  return {
    profile: attributes.filter((attribute) =>
      attribute.trait_type?.startsWith("*"),
    ),
    stats,
    summaries,
    other: attributes.filter((attribute) => {
      const trait = attribute.trait_type ?? "";

      return (
        !trait.startsWith("*") &&
        !isStatTrait(attribute) &&
        !isSummaryTrait(attribute)
      );
    }),
  };
}

function getMetadataFacts(metadata?: TokenMetadata) {
  if (!metadata) {
    return [];
  }

  const facts: TokenMetadataAttribute[] = [];

  if (metadata.attribute_profile) {
    facts.push({
      trait_type: "Attribute Profile",
      value: metadata.attribute_profile,
    });
  }

  if (metadata.contract_wording_version) {
    facts.push({
      trait_type: "Contract Wording Version",
      value: metadata.contract_wording_version,
    });
  }

  if (metadata.contract_terms) {
    facts.push({ trait_type: "Contract Terms URI", value: metadata.contract_terms });
  }

  if (metadata.contract_terms_url) {
    facts.push({
      trait_type: "Contract Terms URL",
      value: metadata.contract_terms_url,
    });
  }

  if (metadata.contract_terms_format) {
    facts.push({
      trait_type: "Contract Terms Format",
      value: metadata.contract_terms_format,
    });
  }

  if (metadata.encrypted_hash) {
    facts.push({
      trait_type: "Encrypted Identity Payload",
      value: metadata.encrypted_hash,
    });
  }

  return facts;
}

async function fetchTokenMetadata(tokenURI: string) {
  const metadataUrls = ipfsGatewayUrls(tokenURI);

  if (!metadataUrls.length) {
    throw new Error(
      "Token URI must be an ipfs:// URI, bare IPFS CID, or https:// gateway URL.",
    );
  }

  const attempts: string[] = [];

  for (const metadataUrl of metadataUrls) {
    try {
      const response = await fetch(metadataUrl, { cache: "no-store" });

      attempts.push(`${metadataUrl} returned ${response.status}`);

      if (!response.ok) {
        continue;
      }

      const metadata = (await response.json()) as TokenMetadata;
      const imageURI =
        typeof metadata.image === "string" ? metadata.image : undefined;
      const imageUrl = imageURI ? ipfsGatewayUrl(imageURI) : undefined;

      return {
        metadata,
        metadataUrl,
        imageURI,
        imageUrl,
      };
    } catch (caughtError) {
      attempts.push(
        `${metadataUrl} failed: ${
          caughtError instanceof Error ? caughtError.message : "unknown error"
        }`,
      );
    }
  }

  throw new Error(`Metadata fetch failed across gateways. ${attempts.join(" | ")}`);
}

function StatusLine({
  tone,
  children,
}: {
  tone: "idle" | "ok" | "warn";
  children: ReactNode;
}) {
  const classes = {
    idle: "border-white/10 bg-white/[0.03] text-white/60",
    ok: "border-emerald-300/35 bg-emerald-300/10 text-emerald-100",
    warn: "border-rose-300/35 bg-rose-300/10 text-rose-100",
  };

  return (
    <div className={`border px-3 py-3 text-sm ${classes[tone]}`}>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  step,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number";
  step?: string;
}) {
  return (
    <label className="grid gap-2 text-[10px] uppercase tracking-[0.18em] text-white/45">
      <span>{label}</span>
      <input
        className="min-h-10 w-full border border-white/15 bg-black/70 px-3 text-sm tracking-normal text-white outline-none transition focus:border-yellow-200/70"
        inputMode={type === "number" ? "decimal" : undefined}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        step={step}
        type={type}
        value={value}
      />
    </label>
  );
}

function StatRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-white/10 py-2 text-xs sm:grid-cols-[150px_minmax(0,1fr)]">
      <div className="uppercase tracking-[0.16em] text-white/35">{label}</div>
      <div className="break-all text-white/75">{value}</div>
    </div>
  );
}

function AttributeGrid({
  title,
  attributes,
  compact = false,
}: {
  title: string;
  attributes: TokenMetadataAttribute[];
  compact?: boolean;
}) {
  if (!attributes.length) {
    return null;
  }

  return (
    <div className="grid gap-2">
      <h3 className="text-[10px] uppercase tracking-[0.24em] text-white/42">
        {title}
      </h3>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {attributes.map((attribute) => (
          <div
            className="border border-white/10 bg-black/35 px-2.5 py-2"
            key={`${title}-${attribute.trait_type}`}
          >
            <div className="text-[9px] uppercase tracking-[0.16em] text-white/32">
              {attribute.trait_type}
            </div>
            <div
              className={`mt-1 break-words text-white/82 ${
                compact ? "text-xs" : "text-sm"
              }`}
            >
              {formatMetadataValue(attribute.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatAttributeGrid({ attributes }: { attributes: TokenMetadataAttribute[] }) {
  if (!attributes.length) {
    return null;
  }

  return (
    <div className="grid gap-2">
      <h3 className="text-[10px] uppercase tracking-[0.24em] text-cyan-100/55">
        House Stats
      </h3>
      <div className="grid grid-cols-3 gap-2 md:grid-cols-4 xl:grid-cols-6">
        {attributes.map((attribute) => (
          <div
            className="control-surface-soft border border-cyan-200/20 bg-cyan-200/[0.04] px-2.5 py-2"
            key={attribute.trait_type}
          >
            <div className="text-[9px] uppercase tracking-[0.13em] text-cyan-100/45">
              {attribute.trait_type}
            </div>
            <div className="mt-1 text-lg font-semibold text-cyan-50">
              {formatMetadataValue(attribute.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TokenInspectorContent() {
  const account = useActiveAccount();
  const [owner, setOwner] = useState("");
  const [pendingAction, setPendingAction] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [lookupInput, setLookupInput] = useState("0");
  const [salePrice, setSalePrice] = useState("1");
  const [tokenLookup, setTokenLookup] = useState<TokenLookup | null>(null);
  const [imageExpanded, setImageExpanded] = useState(false);

  const ownerConnected = Boolean(
    owner &&
      account?.address &&
      owner.toLowerCase() === account.address.toLowerCase(),
  );
  const busy = Boolean(pendingAction);
  const tokenMetadataGroups = getMetadataGroups(tokenLookup?.metadata);
  const tokenMetadataFacts = getMetadataFacts(tokenLookup?.metadata);

  async function openInspector() {
    if (!soulContract || !account?.address) {
      return;
    }

    setPendingAction("Owner check");
    setError("");
    setNotice("");
    setTokenLookup(null);

    try {
      const nextOwner = await readContract({
        contract: soulContract,
        method: "function owner() view returns (address)",
      });

      setOwner(nextOwner);

      if (nextOwner.toLowerCase() !== account.address.toLowerCase()) {
        setError("This wallet is not the contract owner. Inspector is locked.");
        return;
      }

      setNotice("Owner wallet confirmed.");
    } catch {
      setError("Could not confirm contract owner from Base.");
    } finally {
      setPendingAction("");
    }
  }

  async function lookupToken(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!soulContract || !ownerConnected) {
      return;
    }

    setPendingAction("Token lookup");
    setError("");
    setNotice("");
    setImageExpanded(false);

    try {
      const nextLookupInput = lookupInput.trim();
      const salePriceWei = parsePositiveEth(salePrice, "Sale price");

      if (!nextLookupInput) {
        throw new Error("Enter a token ID or metadata URI.");
      }

      if (isMetadataResource(nextLookupInput)) {
        const metadataResult = await fetchTokenMetadata(nextLookupInput);

        setTokenLookup({
          lookupInput: nextLookupInput,
          tokenURI: nextLookupInput,
          metadataUrl: metadataResult.metadataUrl,
          imageURI: metadataResult.imageURI,
          imageUrl: metadataResult.imageUrl,
          metadata: metadataResult.metadata,
        });
        setNotice("Token metadata loaded from URI.");
        return;
      }

      const nextTokenId = parseTokenId(nextLookupInput);
      const [ownerAddress, originalMinter, royaltySplitter, tokenURI, royaltyInfo] =
        await Promise.all([
          readContract({
            contract: soulContract,
            method: "function ownerOf(uint256 tokenId) view returns (address)",
            params: [nextTokenId],
          }),
          readContract({
            contract: soulContract,
            method: "function originalMinter(uint256 tokenId) view returns (address)",
            params: [nextTokenId],
          }),
          readContract({
            contract: soulContract,
            method:
              "function royaltySplitter(uint256 tokenId) view returns (address)",
            params: [nextTokenId],
          }),
          readContract({
            contract: soulContract,
            method: "function tokenURI(uint256 tokenId) view returns (string)",
            params: [nextTokenId],
          }),
          readContract({
            contract: soulContract,
            method:
              "function royaltyInfo(uint256 tokenId, uint256 salePrice) view returns (address receiver, uint256 royaltyAmount)",
            params: [nextTokenId, salePriceWei],
          }),
        ]);
      const metadataResult = await fetchTokenMetadata(tokenURI);

      setTokenLookup({
        lookupInput: nextLookupInput,
        tokenId: nextTokenId,
        owner: ownerAddress,
        originalMinter,
        royaltySplitter,
        tokenURI,
        metadataUrl: metadataResult.metadataUrl,
        imageURI: metadataResult.imageURI,
        imageUrl: metadataResult.imageUrl,
        metadata: metadataResult.metadata,
        salePriceWei,
        royaltyReceiver: royaltyInfo[0],
        royaltyAmountWei: royaltyInfo[1],
      });
      setNotice("Token inspection complete.");
    } catch (caughtError) {
      setTokenLookup(null);
      setError(
        caughtError instanceof Error ? caughtError.message : "Token lookup failed.",
      );
    } finally {
      setPendingAction("");
    }
  }

  if (!thirdwebClient || !soulContract) {
    return (
      <main className="min-h-screen bg-[#050505] px-4 py-6 text-white md:px-8">
        <div className="mx-auto max-w-3xl">
          <StatusLine tone="warn">
            `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` is required before the inspector can
            connect.
          </StatusLine>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-5 text-white md:px-8 md:py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex flex-wrap gap-4">
            <Link
              className="text-[10px] uppercase tracking-[0.35em] text-white/50 transition hover:text-white"
              href="/admin"
            >
              Admin
            </Link>
            <Link
              className="text-[10px] uppercase tracking-[0.35em] text-white/50 transition hover:text-white"
              href="/admin/operations"
            >
              Operations
            </Link>
          </div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-yellow-300/70">
            Token Inspector
          </div>
        </nav>

        <section className="control-surface grid gap-4 border border-yellow-200/25 bg-yellow-200/[0.045] p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="grid gap-2">
            <div className="text-[10px] uppercase tracking-[0.3em] text-yellow-100/55">
              Metadata Console
            </div>
            <h1 className="text-2xl font-semibold uppercase tracking-[0.16em] text-white md:text-3xl">
              Token Inspector
            </h1>
            <div className="flex flex-wrap gap-2 text-xs text-white/55">
              <span className="border border-white/10 bg-white/[0.03] px-3 py-2">
                Owner {owner ? shortAddress(owner) : "Unchecked"}
              </span>
              <span className="border border-white/10 bg-white/[0.03] px-3 py-2">
                Connected {account?.address ? shortAddress(account.address) : "None"}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <ConnectButton client={thirdwebClient} chain={base} />
            {account?.address && (
              <button
                className="min-h-10 border border-yellow-200/55 bg-yellow-200/10 px-4 text-xs font-medium uppercase tracking-[0.18em] text-yellow-100 transition hover:bg-yellow-200/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-white/30"
                disabled={busy}
                onClick={openInspector}
                type="button"
              >
                Arm
              </button>
            )}
          </div>
        </section>

        {!account?.address && (
          <StatusLine tone="idle">Connect the contract owner wallet.</StatusLine>
        )}
        {account?.address && owner && !ownerConnected && (
          <StatusLine tone="warn">
            This wallet is not the contract owner. Token inspection is locked.
          </StatusLine>
        )}
        {ownerConnected && notice && <StatusLine tone="ok">{notice}</StatusLine>}
        {busy && (
          <StatusLine tone="idle">
            {pendingAction} in progress. Keep the wallet prompt open if one appears.
          </StatusLine>
        )}
        {error && <StatusLine tone="warn">{error}</StatusLine>}

        {ownerConnected && (
          <section className="control-surface border border-cyan-200/20 bg-cyan-200/[0.035] p-4">
            <form
              className="grid gap-3 md:grid-cols-[minmax(260px,1fr)_160px_92px]"
              onSubmit={lookupToken}
            >
              <Field
                label="Token ID / URI / CID"
                onChange={setLookupInput}
                placeholder="0 or ipfs://..."
                value={lookupInput}
              />
              <Field
                label="Sale Quote"
                onChange={setSalePrice}
                step="any"
                type="number"
                value={salePrice}
              />
              <button
                aria-label="Inspect token"
                className="min-h-10 self-end border border-yellow-200/55 bg-yellow-200/10 px-4 text-xs font-medium uppercase tracking-[0.18em] text-yellow-100 transition hover:bg-yellow-200/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-white/30"
                disabled={busy}
                title="Inspect token"
                type="submit"
              >
                Scan
              </button>
            </form>
          </section>
        )}

        {tokenLookup && (
          <section className="control-surface grid gap-4 border border-yellow-200/20 bg-black/55 p-4 xl:grid-cols-[180px_minmax(0,1fr)]">
            <div className="grid content-start gap-3">
              <div className="border border-yellow-200/20 bg-black/45 p-2">
                {tokenLookup.imageUrl ? (
                  <button
                    className="block w-full"
                    onClick={() => setImageExpanded(true)}
                    title="Open full image"
                    type="button"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={`Image preview for ${
                        tokenLookup.metadata?.name ?? tokenLookup.lookupInput
                      }`}
                      className="mx-auto max-h-44 w-auto border border-white/10 bg-black object-contain"
                      src={tokenLookup.imageUrl}
                    />
                  </button>
                ) : (
                  <div className="flex min-h-32 items-center justify-center border border-white/10 bg-white/[0.03] text-center text-[10px] uppercase tracking-[0.18em] text-white/35">
                    No Image
                  </div>
                )}
              </div>

              {tokenLookup.imageUrl && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="border border-cyan-200/35 bg-cyan-200/10 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-cyan-100 transition hover:bg-cyan-200/20"
                    onClick={() => setImageExpanded(true)}
                    type="button"
                  >
                    Full
                  </button>
                  <a
                    className="border border-white/15 bg-white/[0.03] px-3 py-2 text-center text-[10px] uppercase tracking-[0.16em] text-white/60 transition hover:text-white"
                    href={tokenLookup.imageUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Open
                  </a>
                </div>
              )}
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <div className="text-[10px] uppercase tracking-[0.3em] text-yellow-100/60">
                  Metadata Signal
                </div>
                <h2 className="text-xl font-semibold text-white">
                  {tokenLookup.metadata?.name ?? "Unnamed Token"}
                </h2>
                {tokenLookup.metadata?.description && (
                  <p className="max-w-5xl text-xs leading-5 text-white/55">
                    {tokenLookup.metadata.description}
                  </p>
                )}
              </div>

              <div className="grid gap-x-5 lg:grid-cols-2">
                <StatRow
                  label="Token ID"
                  value={tokenLookup.tokenId?.toString() ?? "URI lookup only"}
                />
                <StatRow label="Owner" value={tokenLookup.owner ?? "URI lookup only"} />
                <StatRow
                  label="Original minter"
                  value={tokenLookup.originalMinter ?? "URI lookup only"}
                />
                <StatRow
                  label="Royalty splitter"
                  value={tokenLookup.royaltySplitter ?? "URI lookup only"}
                />
                <StatRow
                  label="Royalty receiver"
                  value={tokenLookup.royaltyReceiver ?? "URI lookup only"}
                />
                <StatRow
                  label="Royalty quote"
                  value={
                    tokenLookup.royaltyAmountWei !== undefined &&
                    tokenLookup.salePriceWei !== undefined
                      ? `${formatNativeAmount(
                          tokenLookup.royaltyAmountWei,
                        )} on ${formatNativeAmount(tokenLookup.salePriceWei)}`
                      : "URI lookup only"
                  }
                />
                <StatRow label="Token URI" value={tokenLookup.tokenURI || "Empty"} />
                <StatRow
                  label="Metadata URL"
                  value={
                    tokenLookup.metadataUrl ? (
                      <a
                        className="underline decoration-cyan-100/40 underline-offset-4"
                        href={tokenLookup.metadataUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {tokenLookup.metadataUrl}
                      </a>
                    ) : (
                      "Unavailable"
                    )
                  }
                />
              </div>

              <AttributeGrid
                attributes={tokenMetadataGroups.profile}
                compact
                title="Origin Traits"
              />
              <StatAttributeGrid attributes={tokenMetadataGroups.stats} />
              <AttributeGrid
                attributes={tokenMetadataGroups.summaries}
                compact
                title="Summary Traits"
              />
              <AttributeGrid
                attributes={tokenMetadataGroups.other}
                compact
                title="Other Metadata"
              />
              <AttributeGrid
                attributes={tokenMetadataFacts}
                compact
                title="Links And Encrypted Payload"
              />

              <div className="border border-cyan-200/20 bg-cyan-200/[0.04] px-3 py-3">
                <div className="text-[10px] uppercase tracking-[0.24em] text-cyan-100/55">
                  Progeny Registry
                </div>
                <p className="mt-2 text-xs leading-5 text-white/50">
                  Future tool. It needs a real Progeny registry or indexed mint
                  event before it can return child artifacts for this Soul Deed.
                </p>
              </div>

              {tokenLookup.metadata && (
                <details className="border border-white/10 bg-black/40 p-3">
                  <summary className="cursor-pointer text-[10px] uppercase tracking-[0.22em] text-white/45">
                    Raw Metadata
                  </summary>
                  <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-white/55">
                    {JSON.stringify(tokenLookup.metadata, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </section>
        )}

        {imageExpanded && tokenLookup?.imageUrl && (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4"
            role="dialog"
          >
            <button
              aria-label="Close image preview"
              className="absolute right-4 top-4 border border-white/20 bg-black/80 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/70 transition hover:text-white"
              onClick={() => setImageExpanded(false)}
              type="button"
            >
              Close
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={`Full image preview for ${
                tokenLookup.metadata?.name ?? tokenLookup.lookupInput
              }`}
              className="max-h-[90vh] max-w-[92vw] object-contain"
              src={tokenLookup.imageUrl}
            />
          </div>
        )}
      </div>
    </main>
  );
}

export default function TokenInspectorPage() {
  return (
    <ThirdwebProvider>
      <TokenInspectorContent />
    </ThirdwebProvider>
  );
}
