"use client";

import Link from "next/link";
import {
  FormEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
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
import {
  ADMIN_TOKEN_CONTRACTS,
  CUSTOM_ADMIN_TOKEN_CONTRACT_ID,
  DEFAULT_ADMIN_TOKEN_CONTRACT_ID,
  createCustomAdminTokenContract,
  getAdminTokenContractById,
  isContractAddress,
} from "@/lib/adminTokenContracts";

const SETTINGS_REFRESH_ATTEMPTS = 6;
const SETTINGS_REFRESH_DELAY_MS = 1200;
const thirdwebClientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
const thirdwebClient = thirdwebClientId
  ? createThirdwebClient({ clientId: thirdwebClientId })
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
  return isContractAddress(value);
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
  eyebrow,
  children,
  tone = "cyan",
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  tone?: "cyan" | "gold" | "red";
}) {
  const tones = {
    cyan: "border-cyan-200/20 bg-cyan-200/[0.035]",
    gold: "border-yellow-200/25 bg-yellow-200/[0.045]",
    red: "border-rose-300/25 bg-rose-300/[0.045]",
  };

  return (
    <section
      className={`control-surface relative overflow-hidden border p-4 shadow-[0_0_32px_rgba(34,211,238,0.06)] md:p-5 ${tones[tone]}`}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          {eyebrow && (
            <div className="mb-1 text-[10px] uppercase tracking-[0.32em] text-cyan-100/45">
              {eyebrow}
            </div>
          )}
          <h2 className="text-sm font-medium uppercase tracking-[0.24em] text-white/75">
            {title}
          </h2>
        </div>
        <div className="h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(103,232,249,0.85)]" />
      </div>
      {children}
    </section>
  );
}

function Foldout({
  title,
  subtitle,
  children,
  defaultOpen = false,
  tone = "cyan",
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  defaultOpen?: boolean;
  tone?: "cyan" | "gold" | "red";
}) {
  const tones = {
    cyan: "border-cyan-200/20 bg-cyan-200/[0.035]",
    gold: "border-yellow-200/25 bg-yellow-200/[0.045]",
    red: "border-rose-300/25 bg-rose-300/[0.045]",
  };

  return (
    <details
      className={`control-surface group border p-4 md:p-5 ${tones[tone]}`}
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-medium uppercase tracking-[0.24em] text-white/75">
            {title}
          </div>
          <div className="mt-1 text-xs leading-5 text-white/45">{subtitle}</div>
        </div>
        <span className="border border-white/15 bg-black/45 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-cyan-100/70">
          <span className="group-open:hidden">Open</span>
          <span className="hidden group-open:inline">Close</span>
        </span>
      </summary>
      <div className="mt-5">{children}</div>
    </details>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  step,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number";
  min?: string;
  step?: string;
}) {
  return (
    <label className="grid gap-2 text-xs uppercase tracking-[0.18em] text-white/45">
      <span>{label}</span>
      <input
        className="min-h-11 w-full border border-white/15 bg-black/70 px-3 text-sm tracking-normal text-white outline-none transition focus:border-yellow-200/70"
        inputMode={type === "number" ? "decimal" : undefined}
        min={min}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        step={step}
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

function CommandTile({
  label,
  value,
  tone = "idle",
}: {
  label: string;
  value: ReactNode;
  tone?: "idle" | "ok" | "warn";
}) {
  const tones = {
    idle: "border-white/10 bg-white/[0.03] text-white/75",
    ok: "border-emerald-300/35 bg-emerald-300/10 text-emerald-100",
    warn: "border-rose-300/35 bg-rose-300/10 text-rose-100",
  };

  return (
    <div className={`control-surface-soft border px-3 py-3 ${tones[tone]}`}>
      <div className="text-[10px] uppercase tracking-[0.24em] text-white/40">
        {label}
      </div>
      <div className="mt-2 break-all text-sm font-medium">{value}</div>
    </div>
  );
}

function AdminContent() {
  const account = useActiveAccount();
  const [selectedContractId, setSelectedContractId] = useState(
    DEFAULT_ADMIN_TOKEN_CONTRACT_ID,
  );
  const [customContractAddress, setCustomContractAddress] = useState("");
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
  const [portalPaymentAmount, setPortalPaymentAmount] = useState("");
  const [compWallet, setCompWallet] = useState("");
  const [compFirstName, setCompFirstName] = useState("");
  const [compLastName, setCompLastName] = useState("");
  const [compReason, setCompReason] = useState("");
  const [complimentaryOrder, setComplimentaryOrder] =
    useState<ComplimentaryOrder | null>(null);
  const selectedTokenContract = useMemo(() => {
    if (selectedContractId === CUSTOM_ADMIN_TOKEN_CONTRACT_ID) {
      return createCustomAdminTokenContract(customContractAddress);
    }

    return getAdminTokenContractById(selectedContractId);
  }, [customContractAddress, selectedContractId]);
  const selectedBaseContract = useMemo(() => {
    if (!thirdwebClient || !selectedTokenContract) {
      return null;
    }

    return getContract({
      client: thirdwebClient,
      chain: base,
      address: selectedTokenContract.address,
    });
  }, [selectedTokenContract]);

  const ownerConnected = Boolean(
    owner &&
      account?.address &&
      owner.toLowerCase() === account.address.toLowerCase(),
  );

  const busy = Boolean(pendingAction);
  const compPublicMark = buildPublicMark(compFirstName, compLastName);

  function resetSelectedContractState() {
    setOwner("");
    setSettings(null);
    setNotice("");
    setError("");
    setLastTransactionHash("");
    setLoadedTokenURIId("");
    setLoadedTokenURIValue("");
    setComplimentaryOrder(null);
  }

  function handleSelectedContractChange(value: string) {
    setSelectedContractId(value);
    resetSelectedContractState();
  }

  function handleCustomContractAddressChange(value: string) {
    setCustomContractAddress(value);
    resetSelectedContractState();
  }

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
    if (!selectedBaseContract) {
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
          contract: selectedBaseContract,
          method: "function mintPrice() view returns (uint256)",
        }),
        readContract({
          contract: selectedBaseContract,
          method: "function burnFee() view returns (uint256)",
        }),
        readContract({
          contract: selectedBaseContract,
          method: "function platformVault() view returns (address)",
        }),
        readContract({
          contract: selectedBaseContract,
          method: "function backendMinter() view returns (address)",
        }),
        readContract({
          contract: selectedBaseContract,
          method: "function backendBurner() view returns (address)",
        }),
        readContract({
          contract: selectedBaseContract,
          method: "function founderWallet() view returns (address)",
        }),
        readContract({
          contract: selectedBaseContract,
          method: "function splitterImplementation() view returns (address)",
        }),
        readContract({
          contract: selectedBaseContract,
          method: "function totalRoyaltyBps() view returns (uint96)",
        }),
        readContract({
          contract: selectedBaseContract,
          method: "function tradingAllowed() view returns (bool)",
        }),
        readContract({
          contract: selectedBaseContract,
          method: "function isSoulbound() view returns (bool)",
        }),
        readContract({
          contract: selectedBaseContract,
          method: "function operatorFilterEnabled() view returns (bool)",
        }),
        readContract({
          contract: selectedBaseContract,
          method: "function publicMintActive() view returns (bool)",
        }),
        readContract({
          contract: selectedBaseContract,
          method: "function burnActive() view returns (bool)",
        }),
        readContract({
          contract: selectedBaseContract,
          method: "function paused() view returns (bool)",
        }),
        readContract({
          contract: selectedBaseContract,
          method: "function metadataFrozen() view returns (bool)",
        }),
        readContract({
          contract: selectedBaseContract,
          method: "function isRevealed() view returns (bool)",
        }),
        readContract({
          contract: selectedBaseContract,
          method: "function dynamicStatsActive() view returns (bool)",
        }),
        readContract({
          contract: selectedBaseContract,
          method: "function placeholderURI() view returns (string)",
        }),
        readContract({
          contract: selectedBaseContract,
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
  }, [selectedBaseContract, syncFormFields]);

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
    if (!selectedBaseContract || !account?.address) {
      return;
    }

    setPendingAction("Owner check");
    setError("");
    setNotice("");
    setSettings(null);
    setPortalMintSettings(null);
    setComplimentaryOrder(null);

    try {
      const nextOwner = await readContract({
        contract: selectedBaseContract,
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
    if (!selectedBaseContract || !account || !ownerConnected) {
      return;
    }

    setPendingAction(label);
    setNotice(`${label}: confirm in your wallet, then wait for Base confirmation.`);
    setError("");

    try {
      const transaction = prepareContractCall({
        contract: selectedBaseContract,
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
    if (!selectedBaseContract || !ownerConnected) {
      return;
    }

    setPendingAction("Token URI read");
    setError("");
    setNotice("");

    try {
      const nextTokenId = parseTokenId(tokenURIId);
      const currentTokenURI = await readContract({
        contract: selectedBaseContract,
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

  if (!thirdwebClient) {
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
            <Link
              className="text-[10px] uppercase tracking-[0.35em] text-white/50 transition hover:text-white"
              href="/admin/open-decisions"
            >
              Open Decisions
            </Link>
            <Link
              className="border border-yellow-200/35 bg-yellow-200/10 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-yellow-100 transition hover:bg-yellow-200/20"
              href="/admin/token-inspector"
            >
              Token Inspector
            </Link>
          </div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-yellow-300/70">
            Token Admin
          </div>
        </nav>

        <section className="grid gap-4 border border-white/10 bg-black/55 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:p-5">
          <div className="grid gap-3">
            <div className="text-xs uppercase tracking-[0.28em] text-white/45">
              Base Mainnet Token Contract
            </div>
            <div className="grid gap-3 lg:grid-cols-[260px_minmax(0,1fr)]">
              <label className="grid gap-2 text-xs uppercase tracking-[0.18em] text-white/45">
                <span>Collection target</span>
                <select
                  className="min-h-11 w-full border border-white/15 bg-black/70 px-3 text-sm tracking-normal text-white outline-none transition focus:border-yellow-200/70"
                  onChange={(event) =>
                    handleSelectedContractChange(event.target.value)
                  }
                  value={selectedContractId}
                >
                  {ADMIN_TOKEN_CONTRACTS.map((contract) => (
                    <option key={contract.id} value={contract.id}>
                      {contract.name} / {contract.symbol}
                    </option>
                  ))}
                  <option value={CUSTOM_ADMIN_TOKEN_CONTRACT_ID}>
                    Custom ERC-721-compatible
                  </option>
                </select>
              </label>
              {selectedContractId === CUSTOM_ADMIN_TOKEN_CONTRACT_ID ? (
                <Field
                  label="Custom contract address"
                  onChange={handleCustomContractAddressChange}
                  placeholder="0x..."
                  value={customContractAddress}
                />
              ) : (
                <div className="grid gap-2 text-xs uppercase tracking-[0.18em] text-white/45">
                  <span>Selected address</span>
                  <div className="min-h-11 break-all border border-white/15 bg-black/50 px-3 py-3 text-sm normal-case tracking-normal text-white/85">
                    {selectedTokenContract?.address ?? "No contract selected"}
                  </div>
                </div>
              )}
            </div>
            <h1 className="break-all text-xl font-medium text-white md:text-2xl">
              {selectedTokenContract
                ? `${selectedTokenContract.name} (${selectedTokenContract.symbol})`
                : "Enter a valid custom contract address"}
            </h1>
            <p className="max-w-4xl text-sm leading-6 text-white/55">
              {selectedTokenContract?.description ??
                "Custom targets must be Base ERC-721-compatible contracts with the same owner/admin function shape before this admin can read or write them."}
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-white/60">
              <span className="border border-white/10 bg-white/[0.03] px-3 py-2">
                Target{" "}
                {selectedTokenContract
                  ? shortAddress(selectedTokenContract.address)
                  : "Invalid"}
              </span>
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
                disabled={busy || !selectedBaseContract}
                onClick={openAdmin}
                type="button"
              >
                Open Admin
              </button>
            )}
            {ownerConnected && (
              <button
                className="min-h-11 border border-cyan-200/45 bg-cyan-200/10 px-4 text-xs font-medium uppercase tracking-[0.22em] text-cyan-100 transition hover:bg-cyan-200/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-white/30"
                disabled={busy || loading || !selectedBaseContract}
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

        {account?.address && !selectedBaseContract && (
          <StatusLine tone="warn">
            Enter a valid Base contract address before opening custom admin mode.
          </StatusLine>
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
            <Panel eyebrow="Command Status" title="Live Control Readout">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <CommandTile
                  label="Contract"
                  tone={settings.paused ? "warn" : "ok"}
                  value={settings.paused ? "Paused" : "Active"}
                />
                <CommandTile
                  label="Metadata"
                  tone={settings.metadataFrozen ? "warn" : "ok"}
                  value={settings.metadataFrozen ? "Frozen" : "Mutable"}
                />
                <CommandTile
                  label="Reveal"
                  tone={settings.isRevealed ? "ok" : "warn"}
                  value={settings.isRevealed ? "Revealed" : "Hidden"}
                />
                <CommandTile
                  label="Burn Path"
                  tone={settings.burnActive ? "ok" : "idle"}
                  value={settings.burnActive ? "Enabled" : "Disabled"}
                />
                <CommandTile
                  label="Mint Price"
                  value={formatNativeAmount(settings.mintPriceWei)}
                />
                <CommandTile
                  label="Burn Fee"
                  value={formatNativeAmount(settings.burnFeeWei)}
                />
                <CommandTile
                  label="Royalty"
                  value={`${settings.totalRoyaltyBps.toString()} bps`}
                />
                <CommandTile
                  label="Trading"
                  tone={settings.tradingAllowed ? "ok" : "warn"}
                  value={settings.tradingAllowed ? "Allowed" : "Disabled"}
                />
              </div>

              <details className="mt-4 border-t border-white/10 pt-4">
                <summary className="cursor-pointer text-[10px] uppercase tracking-[0.24em] text-cyan-100/55">
                  Contract Address Details
                </summary>
                <div className="grid gap-x-6 xl:grid-cols-2">
                  <StatRow label="Platform vault" value={settings.platformVault} />
                  <StatRow label="Founder wallet" value={settings.founderWallet} />
                  <StatRow label="Backend minter" value={settings.backendMinter} />
                  <StatRow label="Backend burner" value={settings.backendBurner} />
                  <StatRow label="Splitter implementation" value={settings.splitterImplementation} />
                  <StatRow label="Placeholder URI" value={settings.placeholderURI || "Empty"} />
                  <StatRow label="Dynamic URI" value={settings.dynamicURIEndpoint || "Empty"} />
                </div>
              </details>
            </Panel>

            <Panel eyebrow="Daily Tool" title="Token Inspector" tone="gold">
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <p className="text-sm leading-6 text-white/58">
                  Token stats, metadata, image preview, royalty routing, and
                  encrypted payload review now live in their own compact console.
                </p>
                <Link
                  className="min-h-11 border border-yellow-200/55 bg-yellow-200/10 px-4 py-3 text-center text-xs font-medium uppercase tracking-[0.22em] text-yellow-100 transition hover:bg-yellow-200/20"
                  href="/admin/token-inspector"
                >
                  Open Inspector
                </Link>
              </div>
            </Panel>

            {selectedContractId === DEFAULT_ADMIN_TOKEN_CONTRACT_ID ? (
              <Foldout
                defaultOpen
                subtitle="Checkout pricing and complimentary mint orders."
                title="Mint Operations"
              >
                <div className="grid gap-5 xl:grid-cols-2">
                  <form className="grid gap-3" onSubmit={handlePortalMintPrice}>
                    <div className="grid gap-2">
                      <Field
                        label="User checkout price in USDC"
                        onChange={setPortalPaymentAmount}
                        placeholder="5.00"
                        step="0.01"
                        type="number"
                        value={portalPaymentAmount}
                      />
                      <p className="text-xs leading-5 text-white/50">
                        This changes the Portal checkout amount for future mint
                        orders. It does not change the on-chain ETH mint price
                        below. Sub-dollar crypto checkout tests are allowed, but
                        card/onramp routes may still enforce provider minimums.
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
              </Foldout>
            ) : (
              <Panel eyebrow="Scope Guard" title="Portal Mint Operations Locked" tone="gold">
                <p className="text-sm leading-6 text-white/58">
                  Checkout price changes and complimentary mint orders are tied
                  to the live Soul Deed mint ledger. They stay hidden while a
                  custom token contract is selected.
                </p>
              </Panel>
            )}

            <Foldout
              subtitle="On-chain prices and transfer state toggles. Use deliberately."
              title="Economics And Contract Switches"
            >
            <section className="grid gap-5 xl:grid-cols-2">
              <Panel title="Economics">
                <div className="grid gap-4">
                  <form className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]" onSubmit={handleMintPrice}>
                    <Field
                      label="Mint price in ETH"
                      onChange={setMintPrice}
                      step="any"
                      type="number"
                      value={mintPrice}
                    />
                    <SubmitButton disabled={busy || loading} label="Set Mint Price" />
                  </form>
                  <form className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]" onSubmit={handleBurnFee}>
                    <Field
                      label="Burn fee in ETH"
                      onChange={setBurnFee}
                      step="any"
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
            </Foldout>

            <Foldout
              subtitle="Authority addresses and future splitter implementation routing."
              title="Wallet Authority"
            >
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
            </Foldout>

            <Foldout
              subtitle="Metadata mutation, reveal controls, freeze control, and marketplace blacklist."
              title="Metadata Maintenance And Safety Lists"
              tone="red"
            >
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
            </Foldout>

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
