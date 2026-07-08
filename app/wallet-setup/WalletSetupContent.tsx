"use client";

import Link from "next/link";
import { useState } from "react";
import { createThirdwebClient } from "thirdweb";
import { base } from "thirdweb/chains";
import {
  ThirdwebProvider,
  useActiveAccount,
  useConnectModal,
} from "thirdweb/react";
import { createWallet, walletConnect } from "thirdweb/wallets";

const thirdwebClientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
const thirdwebClient = thirdwebClientId
  ? createThirdwebClient({ clientId: thirdwebClientId })
  : null;

const walletSetupAppMetadata = {
  name: "Sovereign Engine",
  url: "https://soulmaster.xyz",
  description: "Sovereign Engine Base-ready wallet setup.",
  logoUrl: "https://soulmaster.xyz/brand/sovereign-engine-site-logo-512.png",
};

const walletSetupWallets = [
  createWallet("org.base.account", {
    appMetadata: walletSetupAppMetadata,
    chains: [base],
  }),
  createWallet("com.coinbase.wallet", {
    appMetadata: walletSetupAppMetadata,
    walletConfig: {
      options: "all",
    },
  }),
  createWallet("io.metamask"),
  walletConnect(),
];

const setupSteps = [
  {
    label: "01",
    title: "Create Or Connect",
    body: "Use modern wallet tools to create or connect a Base-ready wallet without entering the Forge first.",
  },
  {
    label: "02",
    title: "Keep The Address",
    body: "That wallet address is where your token can be sent and where future access checks can recognize you.",
  },
  {
    label: "03",
    title: "Verify In Forge",
    body: "When you enter the Forge, the site checks whether that wallet has Coinbase EAS. If not, the Forge guides you to verification.",
  },
] as const;

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function WalletSetupPanel() {
  const account = useActiveAccount();
  const { connect: openConnectModal, isConnecting } = useConnectModal();
  const [error, setError] = useState("");

  async function handleWalletSetup() {
    if (!thirdwebClient) {
      setError("Wallet setup needs NEXT_PUBLIC_THIRDWEB_CLIENT_ID before it can open.");
      return;
    }

    setError("");

    try {
      await openConnectModal({
        appMetadata: walletSetupAppMetadata,
        chain: base,
        client: thirdwebClient,
        recommendedWallets: walletSetupWallets,
        showAllWallets: false,
        title: "Create or connect wallet",
        wallets: walletSetupWallets,
      });
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Wallet setup was cancelled or could not be completed.",
      );
    }
  }

  return (
    <main className="wallet-setup-page home-control-page relative isolate min-h-screen overflow-hidden bg-black text-white">
      <div aria-hidden="true" className="home-page-fixed-backdrop">
        <div className="home-tunnel-grid" />
      </div>
      <section className="relative z-10 mx-auto grid min-h-screen max-w-7xl content-center gap-6 px-5 pb-16 pt-28 md:px-8 md:pt-24">
        <div className="wallet-setup-hero chamfer-panel chamfer-panel--all-corners p-6 md:p-8">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.62fr)] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-cyan-200/70">
                Wallet setup
              </p>
              <h1 className="mt-4 max-w-3xl text-3xl font-black uppercase leading-tight tracking-[0.08em] text-white md:text-5xl">
                Don&apos;t have a wallet? Don&apos;t worry.
              </h1>
              <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-white/78 md:text-xl md:leading-9">
                Modern Web3 tools make setup simple, and Sovereign Engine will
                help you create or connect a Base-ready wallet when you&apos;re
                ready.
              </p>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/58">
                This page is just for preparation. The Forge is still where
                verification, agreement, order, and minting happen.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  className="chamfer-hero-link chamfer-hero-link--primary wallet-setup-connect-button"
                  disabled={isConnecting}
                  onClick={handleWalletSetup}
                  type="button"
                >
                  {account?.address
                    ? "Wallet Ready"
                    : isConnecting
                      ? "Opening"
                      : "Create Wallet"}
                </button>
                <Link
                  className="chamfer-hero-link chamfer-hero-link--secondary chamfer-hero-link--opposite wallet-setup-connect-button"
                  href="/portal"
                >
                  Open Forge
                </Link>
              </div>
              {error ? (
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-red-200">
                  {error}
                </p>
              ) : null}
            </div>

            <div className="wallet-setup-status chamfer-panel chamfer-panel--readout chamfer-panel--all-corners p-5">
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-yellow-100/80">
                Wallet status
              </p>
              <h2 className="mt-4 text-2xl font-black uppercase tracking-[0.12em] text-white">
                {account?.address ? "Connected" : "Not Connected"}
              </h2>
              <p className="mt-3 break-all text-base font-semibold leading-7 text-white/72">
                {account?.address
                  ? shortenAddress(account.address)
                  : "Create or connect a wallet here first, then bring it into the Forge when you are ready."}
              </p>
              <div className="mt-5 border-t border-cyan-100/14 pt-4 text-sm font-semibold leading-6 text-cyan-50/74">
                {account?.address
                  ? "Next step: enter the Forge. If Coinbase EAS does not recognize this wallet yet, the Forge will guide you to verification."
                  : "No mint starts here. This is only the calm setup area."}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {setupSteps.map((step) => (
            <div
              className="wallet-setup-step chamfer-panel chamfer-panel--readout p-5"
              key={step.title}
            >
              <div className="text-[0.68rem] uppercase tracking-[0.3em] text-cyan-200/64">
                {step.label}
              </div>
              <h2 className="mt-4 text-xl font-black uppercase tracking-[0.12em] text-white">
                {step.title}
              </h2>
              <p className="mt-3 text-base font-semibold leading-7 text-white/62">
                {step.body}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/" className="chamfer-nav-link">
            Home
          </Link>
          <Link href="/portal" className="chamfer-nav-link chamfer-nav-link--opposite">
            Forge
          </Link>
          <Link href="/privacy-policy" className="chamfer-nav-link">
            Privacy
          </Link>
        </div>
      </section>
    </main>
  );
}

export function WalletSetupContent() {
  return (
    <ThirdwebProvider>
      <WalletSetupPanel />
    </ThirdwebProvider>
  );
}
