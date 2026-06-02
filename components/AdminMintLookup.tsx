"use client";

import { FormEvent, useState } from "react";

type MintOrderEvent = {
  id: string;
  type: string;
  at: string;
  message: string;
};

type MintOrderRecord = {
  orderId: string;
  status: string;
  wallet: string;
  paymentKind?: string;
  paymentAmount?: string;
  paymentId?: string;
  mintTransactionId?: string;
  mintTransactionHash?: string;
  events?: MintOrderEvent[];
};

type MintReceiptRecord = {
  deedName?: string;
  contractAddress?: string;
  chainId?: number;
  transactionHash?: string;
  tokenURI?: string;
  imageURI?: string;
};

type LookupResult = {
  order?: MintOrderRecord;
  receipt?: MintReceiptRecord | null;
  message?: string;
};

function short(value: string | undefined) {
  if (!value) {
    return "Not recorded";
  }

  if (value.length <= 18) {
    return value;
  }

  return `${value.slice(0, 10)}...${value.slice(-8)}`;
}

export function AdminMintLookup() {
  const [orderId, setOrderId] = useState("");
  const [wallet, setWallet] = useState("");
  const [result, setResult] = useState<LookupResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (orderId.trim()) {
      params.set("orderId", orderId.trim());
    } else if (wallet.trim()) {
      params.set("wallet", wallet.trim());
    }

    if (!params.size) {
      setError("Enter an order ID or wallet address.");
      setResult(null);
      return;
    }

    setBusy(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`/api/admin/mint-orders?${params}`, {
        cache: "no-store",
      });
      const data = (await response.json()) as LookupResult;

      if (!response.ok) {
        throw new Error(data.message ?? "Mint order could not be loaded.");
      }

      setResult(data);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Mint order could not be loaded.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="border border-cyan-100/20 bg-cyan-100/[0.035] p-5 md:p-6">
      <div className="text-[10px] uppercase tracking-[0.28em] text-cyan-100/58">
        Support Lookup
      </div>
      <h2 className="mt-4 text-2xl uppercase tracking-[0.12em] text-white">
        Mint Orders
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-white/58">
        Search by order ID first when possible. If the user only has a wallet,
        this finds the latest order recorded for the current Soul Deed contract.
      </p>

      <form className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]" onSubmit={handleLookup}>
        <label className="grid gap-2 text-xs uppercase tracking-[0.18em] text-white/45">
          <span>Order ID</span>
          <input
            className="min-h-11 border border-white/15 bg-black/70 px-3 text-sm normal-case tracking-normal text-white outline-none transition focus:border-cyan-200/70"
            onChange={(event) => setOrderId(event.target.value)}
            placeholder="ae1f0..."
            value={orderId}
          />
        </label>
        <label className="grid gap-2 text-xs uppercase tracking-[0.18em] text-white/45">
          <span>Wallet</span>
          <input
            className="min-h-11 border border-white/15 bg-black/70 px-3 text-sm normal-case tracking-normal text-white outline-none transition focus:border-cyan-200/70"
            onChange={(event) => setWallet(event.target.value)}
            placeholder="0x..."
            value={wallet}
          />
        </label>
        <button
          className="min-h-11 self-end border border-cyan-200/55 bg-cyan-200/10 px-4 text-xs font-medium uppercase tracking-[0.22em] text-cyan-100 transition hover:bg-cyan-200/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-white/30"
          disabled={busy}
          type="submit"
        >
          {busy ? "Loading" : "Lookup"}
        </button>
      </form>

      {error && (
        <div className="mt-4 border border-rose-300/35 bg-rose-300/10 px-3 py-3 text-sm text-rose-100">
          {error}
        </div>
      )}

      {result?.order && (
        <div className="mt-5 grid gap-4">
          <div className="grid gap-3 border border-white/10 bg-black/45 p-4 text-sm leading-6 text-white/70 md:grid-cols-2">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/42">
                Order
              </div>
              <div className="mt-1 break-all text-white">{result.order.orderId}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/42">
                Status
              </div>
              <div className="mt-1 text-white">{result.order.status}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/42">
                Wallet
              </div>
              <div className="mt-1 break-all text-white">{result.order.wallet}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/42">
                Payment
              </div>
              <div className="mt-1 text-white">
                {result.order.paymentKind ?? "Not recorded"}
                {result.order.paymentAmount
                  ? ` / $${result.order.paymentAmount}`
                  : ""}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/42">
                Payment ID
              </div>
              <div className="mt-1 break-all text-white">
                {short(result.order.paymentId)}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/42">
                Mint Tx
              </div>
              <div className="mt-1 break-all text-white">
                {short(result.order.mintTransactionHash)}
              </div>
            </div>
          </div>

          {result.receipt && (
            <div className="border border-yellow-200/25 bg-yellow-200/[0.06] p-4 text-sm leading-6 text-yellow-50/78">
              <div className="text-[10px] uppercase tracking-[0.22em] text-yellow-100/72">
                Recovered Receipt
              </div>
              <div className="mt-2 break-all">
                {result.receipt.deedName}
                <br />
                Token URI: {result.receipt.tokenURI ?? "Not recorded"}
                <br />
                Image URI: {result.receipt.imageURI ?? "Not recorded"}
              </div>
            </div>
          )}

          <div className="border border-white/10 bg-black/45 p-4">
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/42">
              Event Trail
            </div>
            <div className="mt-3 grid gap-2">
              {(result.order.events ?? []).length ? (
                result.order.events?.map((item) => (
                  <div
                    className="grid gap-2 border border-white/10 bg-white/[0.025] px-3 py-3 text-sm leading-6 text-white/62 md:grid-cols-[13rem_12rem_minmax(0,1fr)]"
                    key={item.id}
                  >
                    <span>{new Date(item.at).toLocaleString()}</span>
                    <span className="uppercase tracking-[0.16em] text-cyan-100/70">
                      {item.type.replaceAll("_", " ")}
                    </span>
                    <span>{item.message}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-white/45">
                  No events have been recorded for this order yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
