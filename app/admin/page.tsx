"use client";

import Link from "next/link";
import { FormEvent, ReactNode, useCallback, useState } from "react";
import {
  createThirdwebClient,
  getContract,
  prepareContractCall,
  readContract,
  sendAndConfirmTransaction,
} from "thirdweb";
import { base } from "thirdweb/chains";
import {
  ConnectButton,
  ThirdwebProvider,
  useActiveAccount,
} from "thirdweb/react";
import { formatEther, parseEther } from "ethers";

const CONTRACT_ADDRESS = "0x8453b77c845c913d8ca3d1a265ba17fc6aa5ea65";
const ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;
const SETTINGS_REFRESH_ATTEMPTS = 6;
const SETTINGS_REFRESH_DELAY_MS = 1200;
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

type ContractSettings = {
  mintPriceWei: bigint;
  burnFeeWei: bigint;
  platformVault: string;
  backendMinter: string;
  backendBurner: string;
  founderWallet: string;
  splitterImplementation: string;
  totalRoyaltyBps: bigint;
  tradingAllowed: boolean;
  isSoulbound: boolean;
  operatorFilterEnabled: boolean;
  publicMintActive: boolean;
  burnActive: boolean;
  paused: boolean;
  metadataFrozen: boolean;
  isRevealed: boolean;
  dynamicStatsActive: boolean;
  placeholderURI: string;
  dynamicURIEndpoint: string;
};

type TokenLookup = {
  tokenId: bigint;
  originalMinter: string;
  royaltySplitter: string;
  tokenURI: string;
  salePriceWei: bigint;
  royaltyReceiver: string;
  royaltyAmountWei: bigint;
};

type PortalMintSettings = {
  paymentAmount: string;
  updatedAt?: string;
  updatedBy?: string;
};

type ComplimentaryOrder = {
  orderId: string;
  status: string;
  wallet: string;
  publicMark: string;
  paymentKind?: string;
  paymentId?: string;
};

type WriteParam = string | boolean | bigint;
type LoadSettingsOptions = {
  quiet?: boolean;
  syncInputs?: boolean;
};
type WriteOptions = {
  expected?: (settings: ContractSettings) => boolean;
};

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function isAddress(value: string) {
  return ADDRESS_PATTERN.test(value.trim());
}

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatNativeAmount(value: bigint) {
  return `${formatEther(value)} ETH`;
}

function buildPublicMark(firstName: string, lastName: string) {
  const firstInitial = firstName.trim().charAt(0).toUpperCase();
  const surnameRoot = lastName.replace(/[^a-z]/gi, "").slice(0, 3);

  if (!firstInitial || !surnameRoot) {
    return "_. ___";
  }

  return `${firstInitial}. ${
    surnameRoot.charAt(0).toUpperCase() + surnameRoot.slice(1).toLowerCase()
  }`;
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

  return <div className={`border px-3 py-3 text-sm ${classes[tone]}`}>{children}</div>;
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border border-white/10 bg-black/55 p-4 md:p-5">
      <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.24em] text-white/60">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number";
}) {
  return (
    <label className="grid gap-2 text-xs uppercase tracking-[0.18em] text-white/45">
      <span>{label}</span>
      <input
        className="min-h-11 w-full border border-white/15 bg-black/70 px-3 text-sm tracking-normal text-white outline-none transition focus:border-yellow-200/70"
        inputMode={type === "number" ? "decimal" : undefined}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </label>
  );
}

function SubmitButton({
  label,
  disabled,
}: {
  label: string;
  disabled: boolean;
}) {
  return (
    <button
      className="min-h-11 border border-yellow-200/55 bg-yellow-200/10 px-4 text-xs font-medium uppercase tracking-[0.22em] text-yellow-100 transition hover:bg-yellow-200/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-white/30"
      disabled={disabled}
      type="submit"
    >
      {label}
    </button>
  );
}

function ToggleButton({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex min-h-14 items-center justify-between border px-3 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "border-yellow-200/55 bg-yellow-200/10 text-yellow-100"
          : "border-white/10 bg-white/[0.03] text-white/65 hover:border-white/25"
      }`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <span>{label}</span>
      <span className="text-[11px] uppercase tracking-[0.2em]">
        {active ? "On" : "Off"}
      </span>
    </button>
  );
}

function StatRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="grid gap-1 border-b border-white/10 py-3 text-sm sm:grid-cols-[170px_minmax(0,1fr)]">
      <div className="text-xs uppercase tracking-[0.18em] text-white/40">{label}</div>
      <div className="break-all text-white/85">{value}</div>
    </div>
  );
}

function AdminContent() {
  const account = useActiveAccount();
  const [owner, setOwner] = useState("");
  const [settings, setSettings] = useState<ContractSettings | null>(null);
  const [portalMintSettings, setPortalMintSettings] =
    useState<PortalMintSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [lastTransactionHash, setLastTransactionHash] = useState("");
  const [mintPrice, setMintPrice] = useState("");
  const [burnFee, setBurnFee] = useState("");
  const [platformVault, setPlatformVault] = useState("");
  const [backendMinter, setBackendMinter] = useState("");
  const [backendBurner, setBackendBurner] = useState("");
  const [founderWallet, setFounderWallet] = useState("");
  const [splitterImplementation, setSplitterImplementation] = useState("");
  const [placeholderURI, setPlaceholderURI] = useState("");
  const [dynamicURIEndpoint, setDynamicURIEndpoint] = useState("");
  const [tokenURIId, setTokenURIId] = useState("");
  const [tokenURIValue, setTokenURIValue] = useState("");
  const [loadedTokenURIId, setLoadedTokenURIId] = useState("");
  const [loadedTokenURIValue, setLoadedTokenURIValue] = useState("");
  const [blacklistAddress, setBlacklistAddress] = useState("");
  const [blacklistBlocked, setBlacklistBlocked] = useState(true);
  const [tokenId, setTokenId] = useState("0");
  const [salePrice, setSalePrice] = useState("1");
  const [tokenLookup, setTokenLookup] = useState<TokenLookup | null>(null);
  const [portalPaymentAmount, setPortalPaymentAmount] = useState("");
  const [compWallet, setCompWallet] = useState("");
  const [compFirstName, setCompFirstName] = useState("");
  const [compLastName, setCompLastName] = useState("");
  const [compReason, setCompReason] = useState("");
  const [complimentaryOrder, setComplimentaryOrder] =
    useState<ComplimentaryOrder | null>(null);

  const ownerConnected = Boolean(
    owner &&
      account?.address &&
      owner.toLowerCase() === account.address.toLowerCase(),
  );

  const busy = Boolean(pendingAction);
  const compPublicMark = buildPublicMark(compFirstName, compLastName);

  const syncFormFields = useCallback((nextSettings: ContractSettings) => {
    setMintPrice(formatEther(nextSettings.mintPriceWei));
    setBurnFee(formatEther(nextSettings.burnFeeWei));
    setPlatformVault(nextSettings.platformVault);
    setBackendMinter(nextSettings.backendMinter);
    setBackendBurner(nextSettings.backendBurner);
    setFounderWallet(nextSettings.founderWallet);
    setSplitterImplementation(nextSettings.splitterImplementation);
    setPlaceholderURI(nextSettings.placeholderURI);
    setDynamicURIEndpoint(nextSettings.dynamicURIEndpoint);
  }, []);

  const loadSettings = useCallback(async (options: LoadSettingsOptions = {}) => {
    if (!soulContract) {
      return null;
    }

    setLoading(true);
    if (!options.quiet) {
      setError("");
    }

    try {
      const [
        mintPriceWei,
        burnFeeWei,
        currentPlatformVault,
        currentBackendMinter,
        currentBackendBurner,
        currentFounderWallet,
        currentSplitterImplementation,
        totalRoyaltyBps,
        tradingAllowed,
        isSoulbound,
        operatorFilterEnabled,
        publicMintActive,
        burnActive,
        paused,
        metadataFrozen,
        isRevealed,
        dynamicStatsActive,
        currentPlaceholderURI,
        currentDynamicURIEndpoint,
      ] = await Promise.all([
        readContract({
          contract: soulContract,
          method: "function mintPrice() view returns (uint256)",
        }),
        readContract({
          contract: soulContract,
          method: "function burnFee() view returns (uint256)",
        }),
        readContract({
          contract: soulContract,
          method: "function platformVault() view returns (address)",
        }),
        readContract({
          contract: soulContract,
          method: "function backendMinter() view returns (address)",
        }),
        readContract({
          contract: soulContract,
          method: "function backendBurner() view returns (address)",
        }),
        readContract({
          contract: soulContract,
          method: "function founderWallet() view returns (address)",
        }),
        readContract({
          contract: soulContract,
          method: "function splitterImplementation() view returns (address)",
        }),
        readContract({
          contract: soulContract,
          method: "function totalRoyaltyBps() view returns (uint96)",
        }),
        readContract({
          contract: soulContract,
          method: "function tradingAllowed() view returns (bool)",
        }),
        readContract({
          contract: soulContract,
          method: "function isSoulbound() view returns (bool)",
        }),
        readContract({
          contract: soulContract,
          method: "function operatorFilterEnabled() view returns (bool)",
        }),
        readContract({
          contract: soulContract,
          method: "function publicMintActive() view returns (bool)",
        }),
        readContract({
          contract: soulContract,
          method: "function burnActive() view returns (bool)",
        }),
        readContract({
          contract: soulContract,
          method: "function paused() view returns (bool)",
        }),
        readContract({
          contract: soulContract,
          method: "function metadataFrozen() view returns (bool)",
        }),
        readContract({
          contract: soulContract,
          method: "function isRevealed() view returns (bool)",
        }),
        readContract({
          contract: soulContract,
          method: "function dynamicStatsActive() view returns (bool)",
        }),
        readContract({
          contract: soulContract,
          method: "function placeholderURI() view returns (string)",
        }),
        readContract({
          contract: soulContract,
          method: "function dynamicURIEndpoint() view returns (string)",
        }),
      ]);

      const nextSettings = {
        mintPriceWei,
        burnFeeWei,
        platformVault: currentPlatformVault,
        backendMinter: currentBackendMinter,
        backendBurner: currentBackendBurner,
        founderWallet: currentFounderWallet,
        splitterImplementation: currentSplitterImplementation,
        totalRoyaltyBps,
        tradingAllowed,
        isSoulbound,
        operatorFilterEnabled,
        publicMintActive,
        burnActive,
        paused,
        metadataFrozen,
        isRevealed,
        dynamicStatsActive,
        placeholderURI: currentPlaceholderURI,
        dynamicURIEndpoint: currentDynamicURIEndpoint,
      };

      setSettings(nextSettings);
      if (options.syncInputs !== false) {
        syncFormFields(nextSettings);
      }

      return nextSettings;
    } catch {
      if (!options.quiet) {
        setError("Could not load the admin contract state from Base.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [syncFormFields]);

  async function loadPortalMintSettings() {
    const response = await fetch("/api/admin/mint-settings", {
      cache: "no-store",
    });
    const result = (await response.json()) as PortalMintSettings & {
      message?: string;
    };

    if (!response.ok) {
      throw new Error(result.message ?? "Could not load Portal mint settings.");
    }

    setPortalMintSettings(result);
    setPortalPaymentAmount(result.paymentAmount);
    return result;
  }

  async function openAdmin() {
    if (!soulContract || !account?.address) {
      return;
    }

    setPendingAction("Owner check");
    setError("");
    setNotice("");
    setSettings(null);
    setPortalMintSettings(null);
    setTokenLookup(null);
    setComplimentaryOrder(null);

    try {
      const nextOwner = await readContract({
        contract: soulContract,
        method: "function owner() view returns (address)",
      });

      setOwner(nextOwner);

      if (nextOwner.toLowerCase() !== account.address.toLowerCase()) {
        setError("This wallet is not the contract owner. Admin writes are locked.");
        return;
      }

      await loadSettings();
      await loadPortalMintSettings();
      setNotice("Owner wallet confirmed.");
    } catch {
      setError("Could not open the admin state from Base.");
    } finally {
      setPendingAction("");
    }
  }

  async function refreshSettingsAfterConfirmation(
    label: string,
    expected?: (settings: ContractSettings) => boolean,
  ) {
    for (let attempt = 1; attempt <= SETTINGS_REFRESH_ATTEMPTS; attempt++) {
      const nextSettings = await loadSettings({
        quiet: attempt > 1,
        syncInputs: !expected,
      });

      if (nextSettings && (!expected || expected(nextSettings))) {
        if (expected) {
          syncFormFields(nextSettings);
        }
        setNotice(`${label} confirmed. Live state refreshed.`);
        return;
      }

      if (attempt < SETTINGS_REFRESH_ATTEMPTS) {
        await wait(SETTINGS_REFRESH_DELAY_MS);
      }
    }

    setNotice(
      `${label} confirmed on Base. Live reads are still catching up; refresh live state in a moment.`,
    );
  }

  async function writeContract(
    label: string,
    method: `function ${string}`,
    params: WriteParam[] = [],
    options: WriteOptions = {},
  ) {
    if (!soulContract || !account || !ownerConnected) {
      return;
    }

    setPendingAction(label);
    setNotice(`${label}: confirm in your wallet, then wait for Base confirmation.`);
    setError("");

    try {
      const transaction = prepareContractCall({
        contract: soulContract,
        method,
        params,
      } as never);
      const receipt = await sendAndConfirmTransaction({
        account,
        transaction,
      });

      setLastTransactionHash(receipt.transactionHash);
      setNotice(`${label} confirmed on Base. Refreshing live state...`);
      await refreshSettingsAfterConfirmation(label, options.expected);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : `${label} was not confirmed.`,
      );
    } finally {
      setPendingAction("");
    }
  }

  async function handleMintPrice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const nextMintPrice = parsePositiveEth(mintPrice, "Mint price");
      await writeContract(
        "Mint price update",
        "function setMintPrice(uint256 newPrice)",
        [nextMintPrice],
        {
          expected: (nextSettings) => nextSettings.mintPriceWei === nextMintPrice,
        },
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Mint price update could not be prepared.",
      );
    }
  }

  async function handleBurnFee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const nextBurnFee = parsePositiveEth(burnFee, "Burn fee");
      await writeContract(
        "Burn fee update",
        "function setBurnFee(uint256 newFee)",
        [nextBurnFee],
        {
          expected: (nextSettings) => nextSettings.burnFeeWei === nextBurnFee,
        },
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Burn fee update could not be prepared.",
      );
    }
  }

  async function handlePortalMintPrice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!ownerConnected) {
      return;
    }

    setPendingAction("Portal mint price update");
    setNotice("");
    setError("");

    try {
      const response = await fetch("/api/admin/mint-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentAmount: portalPaymentAmount,
        }),
      });
      const result = (await response.json()) as PortalMintSettings & {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(result.message ?? "Portal mint price could not be updated.");
      }

      setPortalMintSettings(result);
      setPortalPaymentAmount(result.paymentAmount);
      setNotice(`Portal checkout price updated to $${result.paymentAmount}.`);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Portal mint price could not be updated.",
      );
    } finally {
      setPendingAction("");
    }
  }

  async function handleComplimentaryMint(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!ownerConnected) {
      return;
    }

    if (!isAddress(compWallet)) {
      setError("Complimentary mint wallet must be a valid wallet address.");
      return;
    }

    if (compPublicMark === "_. ___") {
      setError("First and last name are required to create the public mark.");
      return;
    }

    setPendingAction("Complimentary mint order");
    setNotice("");
    setError("");
    setComplimentaryOrder(null);

    try {
      const response = await fetch("/api/admin/comp-mint-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet: compWallet,
          publicMark: compPublicMark,
          reason: compReason,
        }),
      });
      const result = (await response.json()) as ComplimentaryOrder & {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.message ?? "Complimentary mint order could not be created.",
        );
      }

      setComplimentaryOrder(result);
      setNotice(
        `Complimentary mint order created for ${result.publicMark}. The user must connect ${shortAddress(
          result.wallet,
        )} and enter the same name mark.`,
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Complimentary mint order could not be created.",
      );
    } finally {
      setPendingAction("");
    }
  }

  async function handleAddressUpdate(
    event: FormEvent<HTMLFormElement>,
    label: string,
    method: `function ${string}`,
    value: string,
  ) {
    event.preventDefault();

    if (!isAddress(value)) {
      setError(`${label} must be a wallet or contract address.`);
      return;
    }

    await writeContract(label, method, [value.trim()]);
  }

  async function handleMetadataURI(
    event: FormEvent<HTMLFormElement>,
    label: string,
    method: `function ${string}`,
    value: string,
  ) {
    event.preventDefault();
    await writeContract(label, method, [value.trim()]);
  }

  async function handleTokenURI(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await writeContract("Token URI update", "function setTokenURI(uint256 tokenId, string newURI)", [
        parseTokenId(tokenURIId),
        tokenURIValue.trim(),
      ]);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Token URI update could not be prepared.",
      );
    }
  }

  function handleTokenURIIdChange(value: string) {
    setTokenURIId(value);
    setLoadedTokenURIId("");
    setLoadedTokenURIValue("");
  }

  async function readCurrentTokenURI() {
    if (!soulContract || !ownerConnected) {
      return;
    }

    setPendingAction("Token URI read");
    setError("");
    setNotice("");

    try {
      const nextTokenId = parseTokenId(tokenURIId);
      const currentTokenURI = await readContract({
        contract: soulContract,
        method: "function tokenURI(uint256 tokenId) view returns (string)",
        params: [nextTokenId],
      });

      setTokenURIValue(currentTokenURI);
      setLoadedTokenURIId(nextTokenId.toString());
      setLoadedTokenURIValue(currentTokenURI);
      setNotice(`Current Token URI loaded for token ${nextTokenId.toString()}. Review before updating.`);
    } catch (caughtError) {
      setLoadedTokenURIId("");
      setLoadedTokenURIValue("");
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Current Token URI could not be loaded.",
      );
    } finally {
      setPendingAction("");
    }
  }

  async function handleBlacklist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isAddress(blacklistAddress)) {
      setError("Blacklist target must be a wallet or contract address.");
      return;
    }

    await writeContract(
      blacklistBlocked ? "Blacklist update" : "Blacklist removal",
      "function setMarketplaceBlacklist(address account, bool blocked)",
      [blacklistAddress.trim(), blacklistBlocked],
    );
  }

  async function handleFreezeMetadata() {
    if (!window.confirm("Freeze metadata permanently for this contract?")) {
      return;
    }

    await writeContract("Metadata freeze", "function freezeMetadata()");
  }

  async function lookupToken(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!soulContract || !ownerConnected) {
      return;
    }

    setPendingAction("Token lookup");
    setError("");
    setNotice("");

    try {
      const nextTokenId = parseTokenId(tokenId);
      const salePriceWei = parsePositiveEth(salePrice, "Sale price");
      const [originalMinter, royaltySplitter, tokenURI, royaltyInfo] =
        await Promise.all([
          readContract({
            contract: soulContract,
            method: "function originalMinter(uint256 tokenId) view returns (address)",
            params: [nextTokenId],
          }),
          readContract({
            contract: soulContract,
            method: "function royaltySplitter(uint256 tokenId) view returns (address)",
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

      setTokenLookup({
        tokenId: nextTokenId,
        originalMinter,
        royaltySplitter,
        tokenURI,
        salePriceWei,
        royaltyReceiver: royaltyInfo[0],
        royaltyAmountWei: royaltyInfo[1],
      });
      setNotice("Token lookup complete.");
    } catch (caughtError) {
      setTokenLookup(null);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Token lookup failed.",
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
            `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` is required before the admin page can connect.
          </StatusLine>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-5 text-white md:px-8 md:py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex flex-wrap gap-4">
            <Link
              className="text-[10px] uppercase tracking-[0.35em] text-white/50 transition hover:text-white"
              href="/"
            >
              Return Home
            </Link>
            <Link
              className="text-[10px] uppercase tracking-[0.35em] text-white/50 transition hover:text-white"
              href="/admin/operations"
            >
              Operations
            </Link>
          </div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-yellow-300/70">
            Soul Admin
          </div>
        </nav>

        <section className="grid gap-4 border border-white/10 bg-black/55 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:p-5">
          <div className="grid gap-3">
            <div className="text-xs uppercase tracking-[0.28em] text-white/45">
              Base Mainnet Contract
            </div>
            <h1 className="break-all text-2xl font-medium text-white md:text-3xl">
              {CONTRACT_ADDRESS}
            </h1>
            <div className="flex flex-wrap gap-2 text-xs text-white/60">
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
                className="min-h-11 border border-yellow-200/55 bg-yellow-200/10 px-4 text-xs font-medium uppercase tracking-[0.22em] text-yellow-100 transition hover:bg-yellow-200/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-white/30"
                disabled={busy}
                onClick={openAdmin}
                type="button"
              >
                Open Admin
              </button>
            )}
            {ownerConnected && (
              <button
                className="min-h-11 border border-cyan-200/45 bg-cyan-200/10 px-4 text-xs font-medium uppercase tracking-[0.22em] text-cyan-100 transition hover:bg-cyan-200/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-white/30"
                disabled={busy || loading}
                onClick={() => void loadSettings()}
                type="button"
              >
                {loading ? "Refreshing" : "Refresh Live State"}
              </button>
            )}
          </div>
        </section>

        {!account?.address && (
          <StatusLine tone="idle">Connect the contract owner wallet.</StatusLine>
        )}

        {account?.address && owner && !ownerConnected && (
          <StatusLine tone="warn">
            This wallet is not the contract owner. Admin writes are locked.
          </StatusLine>
        )}

        {ownerConnected && notice && <StatusLine tone="ok">{notice}</StatusLine>}
        {ownerConnected && busy && (
          <StatusLine tone="idle">
            {pendingAction} in progress. Keep the wallet prompt open, confirm it,
            then wait for the Base confirmation.
          </StatusLine>
        )}
        {ownerConnected && loading && !busy && (
          <StatusLine tone="idle">Refreshing live contract state from Base...</StatusLine>
        )}
        {error && <StatusLine tone="warn">{error}</StatusLine>}

        {ownerConnected && lastTransactionHash && (
          <StatusLine tone="ok">
            Last transaction{" "}
            <a
              className="break-all underline decoration-yellow-200/60 underline-offset-4"
              href={`https://basescan.org/tx/${lastTransactionHash}`}
              rel="noreferrer"
              target="_blank"
            >
              {lastTransactionHash}
            </a>
          </StatusLine>
        )}

        {ownerConnected && settings && (
          <>
            <Panel title="Live State">
              <div className="grid gap-x-6 xl:grid-cols-2">
                <StatRow label="Mint price" value={formatNativeAmount(settings.mintPriceWei)} />
                <StatRow label="Burn fee" value={formatNativeAmount(settings.burnFeeWei)} />
                <StatRow label="Platform vault" value={settings.platformVault} />
                <StatRow label="Founder wallet" value={settings.founderWallet} />
                <StatRow label="Backend minter" value={settings.backendMinter} />
                <StatRow label="Backend burner" value={settings.backendBurner} />
                <StatRow label="Royalty" value={`${settings.totalRoyaltyBps.toString()} bps`} />
                <StatRow label="Splitter implementation" value={settings.splitterImplementation} />
                <StatRow label="Placeholder URI" value={settings.placeholderURI || "Empty"} />
                <StatRow label="Dynamic URI" value={settings.dynamicURIEndpoint || "Empty"} />
              </div>
            </Panel>

            <Panel title="Portal Checkout And Comp Mints">
              <div className="grid gap-5 xl:grid-cols-2">
                <form className="grid gap-3" onSubmit={handlePortalMintPrice}>
                  <div className="grid gap-2">
                    <Field
                      label="User checkout price in USDC"
                      onChange={setPortalPaymentAmount}
                      placeholder="5.00"
                      type="number"
                      value={portalPaymentAmount}
                    />
                    <p className="text-xs leading-5 text-white/50">
                      This changes the Portal checkout amount for future mint
                      orders. It does not change the on-chain ETH mint price
                      below.
                    </p>
                    {portalMintSettings?.updatedAt && (
                      <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                        Last updated {portalMintSettings.updatedAt}
                      </p>
                    )}
                  </div>
                  <SubmitButton disabled={busy || loading} label="Set Portal Price" />
                </form>

                <form className="grid gap-3" onSubmit={handleComplimentaryMint}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                      label="First name"
                      onChange={setCompFirstName}
                      value={compFirstName}
                    />
                    <Field
                      label="Last name"
                      onChange={setCompLastName}
                      value={compLastName}
                    />
                  </div>
                  <Field
                    label="Recipient wallet"
                    onChange={setCompWallet}
                    placeholder="0x..."
                    value={compWallet}
                  />
                  <Field
                    label="Admin note"
                    onChange={setCompReason}
                    placeholder="Optional reason"
                    value={compReason}
                  />
                  <div className="border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-white/65">
                    Public mark:{" "}
                    <span className="font-semibold text-yellow-100">
                      {compPublicMark}
                    </span>
                  </div>
                  <SubmitButton disabled={busy || loading} label="Give Mint Away" />
                  {complimentaryOrder && (
                    <div className="border border-emerald-300/30 bg-emerald-300/10 px-3 py-3 text-sm leading-6 text-emerald-100">
                      Complimentary order {complimentaryOrder.orderId} is paid
                      for {complimentaryOrder.publicMark}. The user still has
                      to pass wallet, EAS, identity, and terms.
                    </div>
                  )}
                </form>
              </div>
            </Panel>

            <section className="grid gap-5 xl:grid-cols-2">
              <Panel title="Economics">
                <div className="grid gap-4">
                  <form className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]" onSubmit={handleMintPrice}>
                    <Field
                      label="Mint price in ETH"
                      onChange={setMintPrice}
                      type="number"
                      value={mintPrice}
                    />
                    <SubmitButton disabled={busy || loading} label="Set Mint Price" />
                  </form>
                  <form className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]" onSubmit={handleBurnFee}>
                    <Field
                      label="Burn fee in ETH"
                      onChange={setBurnFee}
                      type="number"
                      value={burnFee}
                    />
                    <SubmitButton disabled={busy || loading} label="Set Burn Fee" />
                  </form>
                </div>
              </Panel>

              <Panel title="Contract Switches">
                <div className="grid gap-3 sm:grid-cols-2">
                  <ToggleButton
                    active={!settings.paused}
                    disabled={busy}
                    label="Contract Active"
                    onClick={() => {
                      const nextPaused = !settings.paused;
                      writeContract(
                        settings.paused ? "Contract unpause" : "Contract pause",
                        settings.paused ? "function unpause()" : "function pause()",
                        [],
                        {
                          expected: (nextSettings) =>
                            nextSettings.paused === nextPaused,
                        },
                      );
                    }}
                  />
                  <ToggleButton
                    active={settings.burnActive}
                    disabled={busy}
                    label="Burn Enabled"
                    onClick={() => {
                      const nextBurnActive = !settings.burnActive;
                      writeContract("Burn toggle", "function setBurnActive(bool active)", [
                        nextBurnActive,
                      ], {
                        expected: (nextSettings) =>
                          nextSettings.burnActive === nextBurnActive,
                      });
                    }}
                  />
                  <ToggleButton
                    active={settings.publicMintActive}
                    disabled={busy}
                    label="Public Mint Flag"
                    onClick={() => {
                      const nextPublicMintActive = !settings.publicMintActive;
                      writeContract(
                        "Public mint toggle",
                        "function setPublicMintActive(bool active)",
                        [nextPublicMintActive],
                        {
                          expected: (nextSettings) =>
                            nextSettings.publicMintActive === nextPublicMintActive,
                        },
                      );
                    }}
                  />
                  <ToggleButton
                    active={settings.tradingAllowed}
                    disabled={busy}
                    label="Trading Allowed"
                    onClick={() => {
                      const nextTradingAllowed = !settings.tradingAllowed;
                      writeContract(
                        "Trading toggle",
                        "function setTradingAllowed(bool allowed)",
                        [nextTradingAllowed],
                        {
                          expected: (nextSettings) =>
                            nextSettings.tradingAllowed === nextTradingAllowed,
                        },
                      );
                    }}
                  />
                  <ToggleButton
                    active={settings.isSoulbound}
                    disabled={busy}
                    label="Soulbound"
                    onClick={() => {
                      const nextSoulbound = !settings.isSoulbound;
                      writeContract("Soulbound toggle", "function setSoulbound(bool soulbound)", [
                        nextSoulbound,
                      ], {
                        expected: (nextSettings) =>
                          nextSettings.isSoulbound === nextSoulbound,
                      });
                    }}
                  />
                  <ToggleButton
                    active={settings.operatorFilterEnabled}
                    disabled={busy}
                    label="Operator Filter"
                    onClick={() => {
                      const nextOperatorFilterEnabled =
                        !settings.operatorFilterEnabled;
                      writeContract(
                        "Operator filter toggle",
                        "function setOperatorFilterEnabled(bool enabled)",
                        [nextOperatorFilterEnabled],
                        {
                          expected: (nextSettings) =>
                            nextSettings.operatorFilterEnabled ===
                            nextOperatorFilterEnabled,
                        },
                      );
                    }}
                  />
                </div>
              </Panel>
            </section>

            <Panel title="Wallets And Splitter">
              <div className="grid gap-4 xl:grid-cols-2">
                <form
                  className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"
                  onSubmit={(event) =>
                    handleAddressUpdate(
                      event,
                      "Platform vault update",
                      "function setPlatformVault(address newVault)",
                      platformVault,
                    )
                  }
                >
                  <Field label="Platform vault" onChange={setPlatformVault} value={platformVault} />
                  <SubmitButton disabled={busy} label="Set Vault" />
                </form>
                <form
                  className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"
                  onSubmit={(event) =>
                    handleAddressUpdate(
                      event,
                      "Founder wallet update",
                      "function setFounderWallet(address newFounder)",
                      founderWallet,
                    )
                  }
                >
                  <Field label="Founder wallet" onChange={setFounderWallet} value={founderWallet} />
                  <SubmitButton disabled={busy} label="Set Founder" />
                </form>
                <form
                  className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"
                  onSubmit={(event) =>
                    handleAddressUpdate(
                      event,
                      "Backend minter update",
                      "function setBackendMinter(address newMinter)",
                      backendMinter,
                    )
                  }
                >
                  <Field label="Backend minter" onChange={setBackendMinter} value={backendMinter} />
                  <SubmitButton disabled={busy} label="Set Minter" />
                </form>
                <form
                  className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"
                  onSubmit={(event) =>
                    handleAddressUpdate(
                      event,
                      "Backend burner update",
                      "function setBackendBurner(address newBurner)",
                      backendBurner,
                    )
                  }
                >
                  <Field label="Backend burner" onChange={setBackendBurner} value={backendBurner} />
                  <SubmitButton disabled={busy} label="Set Burner" />
                </form>
                <form
                  className="grid gap-3 xl:col-span-2 sm:grid-cols-[minmax(0,1fr)_auto]"
                  onSubmit={(event) =>
                    handleAddressUpdate(
                      event,
                      "Splitter implementation update",
                      "function setSplitterImplementation(address newImplementation)",
                      splitterImplementation,
                    )
                  }
                >
                  <Field
                    label="Splitter implementation"
                    onChange={setSplitterImplementation}
                    value={splitterImplementation}
                  />
                  <SubmitButton disabled={busy} label="Set Splitter" />
                </form>
              </div>
            </Panel>

            <section className="grid gap-5 xl:grid-cols-2">
              <Panel title="Metadata">
                <div className="grid gap-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <ToggleButton
                      active={settings.isRevealed}
                      disabled={busy}
                      label="Revealed"
                      onClick={() =>
                        writeContract("Reveal toggle", "function setRevealed(bool revealed)", [
                          !settings.isRevealed,
                        ])
                      }
                    />
                    <ToggleButton
                      active={settings.dynamicStatsActive}
                      disabled={busy}
                      label="Dynamic Stats"
                      onClick={() =>
                        writeContract(
                          "Dynamic stats toggle",
                          "function setDynamicStatsActive(bool active)",
                          [!settings.dynamicStatsActive],
                        )
                      }
                    />
                    <ToggleButton
                      active={settings.metadataFrozen}
                      disabled={busy || settings.metadataFrozen}
                      label="Metadata Frozen"
                      onClick={handleFreezeMetadata}
                    />
                  </div>
                  <form
                    className="grid gap-3"
                    onSubmit={(event) =>
                      handleMetadataURI(
                        event,
                        "Placeholder URI update",
                        "function setPlaceholderURI(string newPlaceholder)",
                        placeholderURI,
                      )
                    }
                  >
                    <Field label="Placeholder URI" onChange={setPlaceholderURI} value={placeholderURI} />
                    <SubmitButton disabled={busy || settings.metadataFrozen} label="Set Placeholder" />
                  </form>
                  <form
                    className="grid gap-3"
                    onSubmit={(event) =>
                      handleMetadataURI(
                        event,
                        "Dynamic URI update",
                        "function setDynamicURIEndpoint(string newEndpoint)",
                        dynamicURIEndpoint,
                      )
                    }
                  >
                    <Field
                      label="Dynamic URI endpoint"
                      onChange={setDynamicURIEndpoint}
                      value={dynamicURIEndpoint}
                    />
                    <SubmitButton disabled={busy || settings.metadataFrozen} label="Set Dynamic URI" />
                  </form>
                  <form className="grid gap-3" onSubmit={handleTokenURI}>
                    <div className="grid gap-3 sm:grid-cols-[150px_auto_minmax(0,1fr)]">
                      <Field
                        label="Token ID"
                        onChange={handleTokenURIIdChange}
                        type="number"
                        value={tokenURIId}
                      />
                      <button
                        className="min-h-11 self-end border border-cyan-200/45 bg-cyan-200/10 px-4 text-xs font-medium uppercase tracking-[0.18em] text-cyan-100 transition hover:bg-cyan-200/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-white/30"
                        disabled={busy || !tokenURIId.trim()}
                        onClick={readCurrentTokenURI}
                        type="button"
                      >
                        Read Current URI
                      </button>
                      <Field label="Token URI" onChange={setTokenURIValue} value={tokenURIValue} />
                    </div>
                    {loadedTokenURIId && (
                      <div className="border border-cyan-200/20 bg-cyan-200/[0.06] px-3 py-3 text-sm text-cyan-50/75">
                        <span className="block text-[11px] uppercase tracking-[0.18em] text-cyan-100/55">
                          Loaded current URI for token {loadedTokenURIId}
                        </span>
                        <span className="mt-1 block break-all text-white/70">
                          {loadedTokenURIValue || "Empty"}
                        </span>
                      </div>
                    )}
                    <SubmitButton disabled={busy || settings.metadataFrozen} label="Set Token URI" />
                  </form>
                </div>
              </Panel>

              <Panel title="Blacklist">
                <form className="grid gap-4" onSubmit={handleBlacklist}>
                  <Field
                    label="Marketplace or wallet address"
                    onChange={setBlacklistAddress}
                    value={blacklistAddress}
                  />
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                    <label className="flex min-h-11 items-center justify-between border border-white/10 bg-white/[0.03] px-3 text-sm text-white/70">
                      <span>{blacklistBlocked ? "Block target" : "Allow target"}</span>
                      <input
                        checked={blacklistBlocked}
                        className="h-4 w-4 accent-yellow-200"
                        onChange={(event) => setBlacklistBlocked(event.target.checked)}
                        type="checkbox"
                      />
                    </label>
                    <SubmitButton disabled={busy} label="Update List" />
                  </div>
                </form>
              </Panel>
            </section>

            <Panel title="Token Royalty Lookup">
              <form className="grid gap-3 md:grid-cols-[170px_200px_auto]" onSubmit={lookupToken}>
                <Field label="Token ID" onChange={setTokenId} type="number" value={tokenId} />
                <Field label="Sale price in ETH" onChange={setSalePrice} type="number" value={salePrice} />
                <SubmitButton disabled={busy} label="Read Token" />
              </form>

              {tokenLookup && (
                <div className="mt-4 grid gap-x-6 xl:grid-cols-2">
                  <StatRow label="Token ID" value={tokenLookup.tokenId.toString()} />
                  <StatRow label="Original minter" value={tokenLookup.originalMinter} />
                  <StatRow label="Royalty splitter" value={tokenLookup.royaltySplitter} />
                  <StatRow label="Royalty receiver" value={tokenLookup.royaltyReceiver} />
                  <StatRow
                    label="Royalty quote"
                    value={`${formatNativeAmount(tokenLookup.royaltyAmountWei)} on ${formatNativeAmount(
                      tokenLookup.salePriceWei,
                    )}`}
                  />
                  <StatRow label="Token URI" value={tokenLookup.tokenURI || "Empty"} />
                </div>
              )}
            </Panel>
          </>
        )}
      </div>
    </main>
  );
}

export default function AdminPage() {
  return (
    <ThirdwebProvider>
      <AdminContent />
    </ThirdwebProvider>
  );
}
