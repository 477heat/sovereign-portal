import Image from "next/image";
import Link from "next/link";

import {
  type MintReceipt,
  type PortalGate,
  type PortalGateReadout,
  type ReceiptDetailRow,
} from "./portal-types";

export function PortalGateIcon({ gate }: { gate: PortalGate }) {
  const sharedProps = {
    "aria-hidden": true,
    className: "portal-step-icon-svg",
    fill: "none",
    viewBox: "0 0 24 24",
  };

  if (gate === "wallet") {
    return (
      <svg {...sharedProps}>
        <path d="M4 7.5h14.5a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4.5a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2H17" />
        <path d="M15.5 13h5" />
        <path d="M16.75 13h.01" />
      </svg>
    );
  }

  if (gate === "eas") {
    return (
      <svg {...sharedProps}>
        <path d="M12 3.5 19 6v5.4c0 4.2-2.8 7.2-7 9.1-4.2-1.9-7-4.9-7-9.1V6l7-2.5Z" />
        <path d="m8.8 12 2.1 2.1 4.5-4.7" />
      </svg>
    );
  }

  if (gate === "identity") {
    return (
      <svg {...sharedProps}>
        <path d="M12 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
        <path d="M5.5 20c.8-3.4 3.1-5.2 6.5-5.2s5.7 1.8 6.5 5.2" />
      </svg>
    );
  }

  if (gate === "terms") {
    return (
      <svg {...sharedProps}>
        <path d="M7 3.5h7l3 3V20H7V3.5Z" />
        <path d="M14 3.5V7h3" />
        <path d="M9.5 11h5" />
        <path d="M9.5 14h5" />
      </svg>
    );
  }

  if (gate === "payment") {
    return (
      <svg {...sharedProps}>
        <path d="M4 7h16v10H4V7Z" />
        <path d="M4 10h16" />
        <path d="M7 14h4" />
      </svg>
    );
  }

  return (
    <svg {...sharedProps}>
      <path d="M12 3.5 14.4 9l5.6.5-4.2 3.8 1.3 5.5L12 15.9l-5.1 2.9 1.3-5.5L4 9.5 9.6 9 12 3.5Z" />
    </svg>
  );
}

export function PortalReceiptPanel({
  receipt,
  detailRows,
  imageUrl,
  onImageError,
}: {
  receipt: MintReceipt;
  detailRows: ReceiptDetailRow[];
  imageUrl: string | undefined;
  onImageError: () => void;
}) {
  return (
    <div className="control-surface-soft portal-receipt-panel portal-surface-gold mt-4 border border-yellow-300/40 bg-yellow-300/10 p-4 text-sm leading-6 text-yellow-100">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.25em] text-yellow-200/70">
            {receipt.mode === "live" ? "Mainnet Mint Submitted" : "Mainnet Route Ready"}
          </div>
          <div className="mt-2 font-semibold text-yellow-50">
            {receipt.deedName}
          </div>
        </div>
        <div className="control-surface-soft portal-receipt-chain-chip border border-yellow-200/25 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-yellow-100/76">
          Base {receipt.chainId ?? 8453}
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(12rem,18rem)_1fr] md:items-start">
        <div className="min-w-0">
          {imageUrl ? (
            <a
              className="portal-receipt-image-frame group block overflow-hidden border border-yellow-200/25 bg-black/35 p-2"
              href={imageUrl}
              rel="noreferrer"
              target="_blank"
            >
              <Image
                alt={`Burned Soul Deed image for ${receipt.deedName}`}
                className="aspect-square w-full object-cover shadow-[0_0_28px_rgba(250,204,21,0.18)] transition duration-200 group-hover:scale-[1.015]"
                decoding="async"
                height={640}
                onError={onImageError}
                priority
                sizes="(min-width: 768px) 18rem, 100vw"
                src={imageUrl}
                width={640}
              />
            </a>
          ) : (
            <div className="portal-receipt-image-frame flex aspect-square items-center justify-center border border-yellow-200/20 bg-black/35 p-4 text-center text-xs uppercase tracking-[0.18em] text-yellow-100/58">
              Image link pending. Save the receipt details below.
            </div>
          )}
          <p className="mt-3 text-xs leading-5 text-yellow-50/62">
            Open the image to inspect the burned artifact. Marketplaces may take a few
            minutes to refresh their own cached preview.
          </p>
        </div>

        <div className="min-w-0 space-y-3">
          {detailRows.map((row) => (
            <div
              className="control-surface-soft border border-yellow-200/14 bg-black/25 px-3 py-2"
              key={row.label}
            >
              <div className="text-[10px] uppercase tracking-[0.22em] text-yellow-200/50">
                {row.label}
              </div>
              {row.href ? (
                <a
                  className="break-all text-yellow-100/80 underline decoration-yellow-200/30 underline-offset-4 hover:text-yellow-50"
                  href={row.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {row.value}
                </a>
              ) : (
                <div className="break-all text-yellow-100/70">{row.value}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PortalReceiptCompletePanel({
  receipt,
  detailRows,
  imageUrl,
  receiptCopied,
  receiptMetadataUrl,
  onImageError,
  onCopyReceipt,
  onSaveReceipt,
  onSaveScreenshot,
  onReturnHome,
}: {
  receipt: MintReceipt;
  detailRows: ReceiptDetailRow[];
  imageUrl: string | undefined;
  receiptCopied: boolean;
  receiptMetadataUrl?: string;
  onImageError: () => void;
  onCopyReceipt: () => void;
  onSaveReceipt: () => void;
  onSaveScreenshot: () => void;
  onReturnHome: () => void;
}) {
  return (
    <section className="control-surface-large portal-surface-gold border border-yellow-300/40 bg-yellow-300/10 p-4 text-yellow-100 md:p-6">
      <div className="grid gap-5">
        <div>
          <div className="text-[11px] uppercase tracking-[0.3em] text-yellow-200/70">
            Mint Complete
          </div>
          <h1 className="mt-3 text-3xl font-black uppercase leading-none tracking-[0.12em] text-yellow-50 md:text-5xl">
            Artifact Sent
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-yellow-50/72">
            Save or copy these details now. This receipt is displayed for this
            session first; if you close or leave this screen, connect the same
            wallet later and use Receipt Recovery to restore the latest recorded
            mint receipt.
          </p>
        </div>

        <PortalReceiptPanel
          detailRows={detailRows}
          imageUrl={imageUrl}
          onImageError={onImageError}
          receipt={receipt}
        />

        <div className="control-surface-soft portal-surface-red-soft border border-red-300/25 bg-red-500/[0.05] p-4 text-sm leading-6 text-red-50/82">
          <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-100/80">
            Save Before Exit
          </div>
          <p className="mt-2">
            Your token, metadata, image, and transaction stay public on chain/IPFS.
            The Portal can recover the latest receipt for this wallet, but saving a
            copy now is still the cleanest record.
          </p>
        </div>

        <div className="portal-panel-button-row portal-panel-button-row--three">
          <button
            className="console-key-button console-key-button--gold"
            onClick={() => onSaveReceipt()}
            type="button"
          >
            Save Receipt
          </button>
          <button
            className="console-key-button"
            onClick={() => onCopyReceipt()}
            type="button"
          >
            {receiptCopied ? "Copied" : "Copy Details"}
          </button>
          {imageUrl && (
            <button
              className="console-key-button"
              onClick={() => onSaveScreenshot()}
              type="button"
            >
              Save Screenshot
            </button>
          )}
          {receiptMetadataUrl && (
            <a
              className="console-key-button"
              href={receiptMetadataUrl}
              rel="noreferrer"
              target="_blank"
            >
              Open Metadata
            </a>
          )}
          {imageUrl && (
            <a
              className="console-key-button"
              href={imageUrl}
              rel="noreferrer"
              target="_blank"
            >
              Open Image
            </a>
          )}
          <button
            className="console-key-button console-key-button--active"
            onClick={() => onReturnHome()}
            type="button"
          >
            Return Home
          </button>
        </div>
      </div>
    </section>
  );
}

export function PortalTermsChecklist({
  contractAccepted,
  accuracyAccepted,
  publicMarkAccepted,
  certificateOpened,
  setContractAccepted,
  setAccuracyAccepted,
  setPublicMarkAccepted,
  onReadTerms,
}: {
  contractAccepted: boolean;
  accuracyAccepted: boolean;
  publicMarkAccepted: boolean;
  certificateOpened: boolean;
  setContractAccepted: (value: boolean) => void;
  setAccuracyAccepted: (value: boolean) => void;
  setPublicMarkAccepted: (value: boolean) => void;
  onReadTerms: () => void;
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2 text-xs leading-5 text-white/65 sm:grid-cols-3">
        <label
          className={`control-surface-soft flex min-h-20 gap-2 border px-2 py-2 ${
            contractAccepted
              ? "console-status-tile--entered"
              : "portal-surface-red-soft border-red-300/20 bg-red-500/[0.05]"
          } ${certificateOpened ? "" : "cursor-not-allowed opacity-70"}`}
        >
          <input
            checked={contractAccepted}
            onChange={(event) => setContractAccepted(event.target.checked)}
            disabled={!certificateOpened}
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 accent-yellow-300 disabled:cursor-not-allowed"
          />
          <span className="text-[10px] leading-4">
            Read and agree to the Certificate.
          </span>
        </label>
        <label
          className={`control-surface-soft flex min-h-20 gap-2 border px-2 py-2 ${
            accuracyAccepted
              ? "console-status-tile--entered"
              : "portal-surface-red-soft border-red-300/20 bg-red-500/[0.05]"
          }`}
        >
          <input
            checked={accuracyAccepted}
            onChange={(event) => setAccuracyAccepted(event.target.checked)}
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 accent-yellow-300"
          />
          <span className="text-[10px] leading-4">
            Name and DOB match Coinbase/EAS.
          </span>
        </label>
        <label
          className={`control-surface-soft flex min-h-20 gap-2 border px-2 py-2 ${
            publicMarkAccepted
              ? "console-status-tile--entered"
              : "portal-surface-red-soft border-red-300/20 bg-red-500/[0.05]"
          }`}
        >
          <input
            checked={publicMarkAccepted}
            onChange={(event) => setPublicMarkAccepted(event.target.checked)}
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 accent-yellow-300"
          />
          <span className="text-[10px] leading-4">
            Public deed uses shortened mark.
          </span>
        </label>
      </div>
      <div className="portal-panel-button-row portal-panel-button-row--one mt-1">
        <button
          className="console-key-button console-key-button--gold"
          onClick={onReadTerms}
          type="button"
        >
          Read Terms
        </button>
      </div>
    </div>
  );
}

export function PortalTermsReviewModal({
  plainEnglishTermsOpen,
  onClose,
  onDownloadFormalTerms,
  onToggleView,
  plainEnglishCertificateSummary,
  contractLanguage,
}: {
  plainEnglishTermsOpen: boolean;
  onClose: () => void;
  onDownloadFormalTerms: () => void;
  onToggleView: () => void;
  plainEnglishCertificateSummary: string[];
  contractLanguage: string[];
}) {
  return (
    <div className="portal-terms-layer">
      <section
        aria-label="Certificate terms"
        aria-modal="true"
        className="control-surface-soft portal-terms-panel border border-yellow-300/25 p-4 md:p-6"
        role="dialog"
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.26em] text-yellow-200/72">
              Full Page Review
            </div>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.12em] text-yellow-50 md:text-4xl">
              Certificate Terms
            </h2>
          </div>
          <div className="portal-panel-button-row portal-panel-button-row--one">
            <button
              className="console-key-button portal-terms-action-button"
              onClick={onClose}
              type="button"
            >
              Close Review
            </button>
          </div>
        </div>
        <div className="control-surface-soft portal-terms-certificate space-y-3 overflow-y-auto border border-yellow-300/25 bg-black/55 p-4 text-xs leading-6 text-white/65">
          {plainEnglishTermsOpen ? (
            <>
              <p className="portal-terms-priority text-yellow-100 uppercase tracking-[0.18em]">
                Plain English Summary
              </p>
              {plainEnglishCertificateSummary.map((paragraph) => (
                <p
                  className="portal-terms-priority"
                  key={paragraph.slice(0, 32)}
                >
                  {paragraph}
                </p>
              ))}
            </>
          ) : (
            contractLanguage.map((paragraph, index) => {
              const isHeading =
                index === 0 || paragraph.startsWith("SECTION ");
              const isPriorityTerms =
                index <
                contractLanguage.findIndex((entry) =>
                  entry.startsWith("SECTION IV"),
                );

              return (
                <p
                  key={`${paragraph.slice(0, 24)}-${index}`}
                  className={`${isPriorityTerms ? "portal-terms-priority" : ""} ${
                    isHeading
                      ? "text-yellow-100 uppercase tracking-[0.18em]"
                      : ""
                  }`}
                >
                  {paragraph}
                </p>
              );
            })
          )}
        </div>
        <div className="mt-5 portal-panel-button-row portal-panel-button-row--two">
          <button
            className="console-key-button portal-terms-action-button"
            onClick={onToggleView}
            type="button"
          >
            {plainEnglishTermsOpen ? "Formal Terms" : "Plain English Summary"}
          </button>
          <button
            className="console-key-button portal-terms-action-button"
            onClick={onDownloadFormalTerms}
            type="button"
          >
            Download Formal Terms
          </button>
        </div>
      </section>
    </div>
  );
}

export function PortalMobileSelectDrawer({
  isOpen,
  gateReadouts,
  selectedGate,
  onClose,
  onSelectGate,
}: {
  isOpen: boolean;
  gateReadouts: PortalGateReadout[];
  selectedGate: PortalGate;
  onClose: () => void;
  onSelectGate: (gate: PortalGate) => void;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="portal-mobile-select-layer">
      <button
        aria-label="Close Select Panel"
        className="portal-mobile-select-backdrop"
        onClick={onClose}
        type="button"
      />
      <aside
        aria-label="Select Panel"
        aria-modal="true"
        className="control-surface-soft command-room__drawer portal-mobile-select-drawer border border-cyan-100/18 bg-black/80 p-4"
        id="portal-mobile-select-drawer"
        role="dialog"
      >
        <div className="command-room__drawer-content portal-mobile-select-content">
          <div className="portal-mobile-select-header mb-2 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-black uppercase tracking-[0.18em] text-cyan-50">
                Control Deck
              </div>
            </div>
            <button
              className="console-key-button portal-command-stow portal-mobile-select-close"
              onClick={onClose}
              type="button"
            >
              Stow
            </button>
          </div>
          <div className="command-room__drawer-groups">
            <section className="command-room__drawer-group">
              <div className="command-room__drawer-label">Mint Path</div>
              <div className="command-room__drawer-button-grid portal-mobile-select-grid">
                {gateReadouts.map((gate, index) => (
                  <button
                    aria-pressed={selectedGate === gate.key}
                    className={`chamfer-hero-link console-key-button command-room__drawer-button portal-gate-button portal-mobile-select-chip ${
                      index % 2 === 1 ? "chamfer-hero-link--opposite" : ""
                    } ${
                      selectedGate === gate.key
                        ? "portal-gate-button--selected"
                        : ""
                    } ${gate.enabled ? gate.stateClass : "console-key-button--disabled"}`}
                    key={gate.key}
                    onClick={() => {
                      onSelectGate(gate.key);
                      onClose();
                    }}
                    type="button"
                  >
                    <span>{gate.label}</span>
                    <small>{gate.value}</small>
                  </button>
                ))}
              </div>
            </section>
          </div>
          <nav
            aria-label="Portal navigation"
            className="command-room__drawer-actions portal-mobile-drawer-actions"
          >
            <Link
              className="chamfer-nav-link chamfer-nav-link--compact portal-mobile-drawer-action"
              href="/"
              onClick={onClose}
            >
              Home
            </Link>
            <Link
              className="chamfer-nav-link chamfer-nav-link--compact portal-mobile-drawer-action"
              href="/vanguard"
              onClick={onClose}
            >
              Vanguard
            </Link>
            <Link
              className="chamfer-nav-link chamfer-nav-link--compact portal-mobile-drawer-action"
              href="/whitepaper"
              onClick={onClose}
            >
              Whitepaper
            </Link>
            <Link
              className="chamfer-nav-link chamfer-nav-link--compact portal-mobile-drawer-action"
              href="/developer"
              onClick={onClose}
            >
              Developer
            </Link>
            <Link
              className="chamfer-nav-link chamfer-nav-link--compact command-room__drawer-action--primary portal-mobile-drawer-action"
              href="/engine-lab"
              onClick={onClose}
            >
              Engine Room
            </Link>
          </nav>
        </div>
      </aside>
    </div>
  );
}
