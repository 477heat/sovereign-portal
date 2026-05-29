"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BackgroundHashStream } from "@/components/DATA_STREAM";
import TunnelBackdrop from "@/components/TunnelBackdrop";
import {
  buildEngineProfile,
  buildReadouts,
  type EngineReadout,
  type ReadoutMode,
} from "./engineReadouts";

const consoleLamps = [
  "Profile Bus",
  "Share Link",
  "Chart Port",
  "Sky Relay",
  "Vault",
];

const telemetry = [
  "Identity seed accepted",
  "Mode translators synchronized",
  "Future chart socket reserved",
  "Public share shell armed",
];

const MOCK_VANGUARD_WALLET = "7777";

type ActiveConsoleField = "mark" | "dob" | "wallet" | "statType";

const consoleFields: Array<{
  id: ActiveConsoleField;
  label: string;
  shortLabel: string;
}> = [
  { id: "mark", label: "Name", shortLabel: "Name" },
  { id: "dob", label: "DOB", shortLabel: "DOB" },
  { id: "wallet", label: "Wallet", shortLabel: "Wallet" },
  { id: "statType", label: "Stat Type", shortLabel: "Stat" },
];

const nativeMatrixLines = [
  "Determining user aura",
  "Measuring destiny voltage",
  "Auditing cosmic paperwork",
  "Inspecting wallet posture",
  "Calibrating dramatic significance",
  "Waiting for the Engine to stop being theatrical",
];

function NativeMatrixScanner({
  activeLabel,
  allFieldsConfirmed,
  readout,
  revealed,
  subject,
}: {
  activeLabel: string;
  allFieldsConfirmed: boolean;
  readout: EngineReadout;
  revealed: boolean;
  subject: string;
}) {
  return (
    <section className="control-surface control-surface-large relative min-h-[34rem] overflow-hidden border border-cyan-200/30 bg-black/60 p-5 shadow-[0_0_90px_rgba(80,190,255,0.14)] md:p-6">
      <div className="engine-screen-grid absolute inset-0 opacity-55" aria-hidden="true" />
      <div className="engine-sweep absolute inset-x-0 top-0 h-28" aria-hidden="true" />
      <div className="absolute inset-x-6 top-1/2 h-px bg-cyan-100/25 shadow-[0_0_24px_rgba(165,243,252,0.45)]" />
      <div className="absolute left-1/2 top-6 h-[calc(100%-3rem)] w-px bg-cyan-100/10" />

      <div className="relative z-10 flex min-h-[31rem] flex-col">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-cyan-100/10 pb-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.34em] text-cyan-100/72">
              Native Matrix
            </div>
            <h1 className="mt-4 text-3xl font-light uppercase leading-tight tracking-[0.12em] text-cyan-50 md:text-5xl">
              {revealed ? "Mock Stats" : "Scanning"}
            </h1>
          </div>
          <div className="control-surface-soft min-w-36 border border-cyan-100/20 bg-cyan-100/[0.05] p-3 text-right">
            <div className="text-[10px] uppercase tracking-[0.24em] text-white/45">
              System
            </div>
            <div className="mt-2 text-sm uppercase tracking-[0.18em] text-cyan-100">
              {revealed ? "Revealed" : allFieldsConfirmed ? "Ready" : "Listening"}
            </div>
          </div>
        </div>

        {revealed ? (
          <div className="grid flex-1 content-center gap-5 py-6">
            <div className="control-surface-soft border border-cyan-100/20 bg-cyan-100/[0.05] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-white/42">
                    Subject
                  </div>
                  <div className="mt-2 truncate text-xl uppercase tracking-[0.14em] text-cyan-50">
                    {subject}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-white/42">
                    {readout.primaryLabel}
                  </div>
                  <div className="mt-1 text-2xl text-yellow-100">
                    {readout.primaryValue}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/58">
                {readout.summary}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {readout.stats.slice(0, 8).map((stat) => (
                <div
                  key={stat.label}
                  className="control-surface-soft border border-white/10 bg-white/[0.025] p-3"
                >
                  <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.2em] text-white/52">
                    <span>{stat.label}</span>
                    <span className="text-cyan-100">{stat.value}</span>
                  </div>
                  <div className="mt-2 h-1.5 border border-cyan-100/10 bg-black/70">
                    <div
                      className="h-full bg-cyan-100/70 shadow-[0_0_12px_rgba(165,243,252,0.34)]"
                      style={{ width: `${Math.min(stat.value, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="grid flex-1 content-center gap-5 py-8">
              <div className="mx-auto aspect-square w-full max-w-[18rem] rounded-full border border-cyan-100/10 bg-[radial-gradient(circle,rgba(165,243,252,0.12),rgba(0,0,0,0)_62%)] opacity-80 shadow-[0_0_80px_rgba(80,190,255,0.16)]" />
              <div className="mx-auto max-w-xl text-center">
                <div className="text-[10px] uppercase tracking-[0.3em] text-white/42">
                  Subject
                </div>
                <div className="mt-2 truncate text-xl uppercase tracking-[0.14em] text-cyan-50">
                  {subject}
                </div>
                <p className="mt-4 text-sm leading-6 text-white/54">
                  Native Matrix panel intentionally withholds the stat reveal until the
                  prototype sequence is confirmed.
                </p>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {nativeMatrixLines.map((line, index) => (
                <div
                  key={line}
                  className="control-surface-soft border border-white/10 bg-white/[0.025] px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.2em] text-white/48">
                    <span>{line}</span>
                    <span className={index % 2 === 0 ? "text-cyan-100/70" : "text-yellow-100/60"}>
                      {index === 0 ? activeLabel : "scan"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ReadoutBus({ shareCode }: { shareCode: string }) {
  return (
    <section className="control-surface border border-white/10 bg-black/58 p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-[10px] uppercase tracking-[0.3em] text-white/42">
          Readout Bus
        </div>
        <div className="text-[10px] uppercase tracking-[0.24em] text-yellow-100/72">
          {shareCode}
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {telemetry.map((item, index) => (
          <div
            key={item}
            className="control-surface-soft border border-white/10 bg-white/[0.03] p-3"
          >
            <div className="text-[10px] uppercase tracking-[0.24em] text-white/35">
              Lane 0{index + 1}
            </div>
            <div className="mt-3 text-xs uppercase tracking-[0.16em] text-white/68">
              {item}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StoredShape({
  attestationConfirmed,
  walletStatus,
}: {
  attestationConfirmed: boolean;
  walletStatus: "undetermined" | "vanguard" | "nonVanguard";
}) {
  const walletStatusClass =
    walletStatus === "vanguard"
      ? "stored-shape-tile--confirmed"
      : "stored-shape-tile--unconfirmed";
  const walletStatusLabel =
    walletStatus === "vanguard"
      ? "Vanguard Confirmed"
      : walletStatus === "nonVanguard"
        ? "Non Vanguard"
        : "Undetermined";

  return (
    <section className="control-surface border border-white/10 bg-black/58 p-4 md:p-5">
      <div className="text-[10px] uppercase tracking-[0.3em] text-white/42">
        Stored Shape
      </div>
      <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
        <div
          className={`control-surface-soft border p-3 transition ${
            attestationConfirmed
              ? "stored-shape-tile--confirmed"
              : "stored-shape-tile--unconfirmed"
          }`}
        >
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/38">
            Mock Attestation Status
          </div>
          <div
            className={`mt-2 uppercase tracking-[0.14em] ${
              attestationConfirmed ? "text-cyan-100" : "text-cyan-50"
            }`}
          >
            {attestationConfirmed ? "Name + Mock Wallet Entered" : "Awaiting Entry"}
          </div>
        </div>
        <div
          className={`control-surface-soft border p-3 transition ${walletStatusClass}`}
        >
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/38">
            Mock Vanguard Status
          </div>
          <div className="mt-2 uppercase tracking-[0.14em] text-cyan-100">
            {walletStatusLabel}
          </div>
        </div>
        <div className="control-surface-soft border border-white/10 bg-white/[0.03] p-3">
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/38">
            Future Profile
          </div>
          <div className="mt-2 leading-6 text-white/62">
            Chart memory and saved dossiers attach here.
          </div>
        </div>
      </div>
    </section>
  );
}

function SubjectSystems({
  alignment,
  profileMark,
}: {
  alignment: string;
  profileMark: string;
}) {
  return (
    <aside className="control-surface grid content-start gap-4 border border-white/10 bg-black/58 p-4 backdrop-blur-[2px]">
      <div className="control-surface-soft border border-cyan-100/20 bg-cyan-100/[0.07] p-4">
        <div className="text-[10px] uppercase tracking-[0.3em] text-cyan-100/65">
          Viewscreen Subject
        </div>
        <div className="mt-4 text-2xl uppercase tracking-[0.16em] text-white">
          {profileMark}
        </div>
        <div className="mt-3 text-sm uppercase tracking-[0.18em] text-white/52">
          {alignment}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {consoleLamps.map((lamp, index) => (
          <div
            key={lamp}
            className="control-surface-soft flex min-h-12 items-center justify-between gap-3 border border-white/10 bg-white/[0.03] px-3"
          >
            <span className="text-[10px] uppercase tracking-[0.24em] text-white/48">
              {lamp}
            </span>
            <span
              className={`h-3 w-3 border ${
                index < 2
                  ? "border-cyan-100/65 bg-cyan-100 shadow-[0_0_18px_rgba(184,245,255,0.8)]"
                  : "border-yellow-100/45 bg-yellow-100/35"
              }`}
            />
          </div>
        ))}
      </div>

      <div className="control-surface-soft border border-white/10 p-4">
        <div className="text-[10px] uppercase tracking-[0.3em] text-white/42">
          Long Arc
        </div>
        <p className="mt-4 text-sm leading-7 text-white/58">
          This instance starts as a public scan console and becomes the profile
          deck for saved charts, live sky motion, and shareable signal maps.
        </p>
      </div>
    </aside>
  );
}

export default function EnginePage() {
  const [dob, setDob] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [wallet, setWallet] = useState("");
  const [mode, setMode] = useState<ReadoutMode>("sovereign");
  const [activeField, setActiveField] = useState<ActiveConsoleField>("mark");
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const [mockWalletConnected, setMockWalletConnected] = useState(false);
  const [confirmedSignatures, setConfirmedSignatures] = useState<Record<ActiveConsoleField, string>>({
    mark: "",
    dob: "",
    wallet: "",
    statType: "",
  });
  const [armedSignature, setArmedSignature] = useState("");
  const fullName = useMemo(
    () => [firstName.trim(), lastName.trim()].filter(Boolean).join(" "),
    [firstName, lastName],
  );
  const profile = useMemo(() => buildEngineProfile(dob, fullName), [dob, fullName]);
  const readouts = useMemo(() => buildReadouts(profile), [profile]);
  const activeReadout = readouts.find((readout) => readout.id === mode) ?? readouts[0];
  const fieldCompletion: Record<ActiveConsoleField, boolean> = {
    mark: firstName.trim().length > 0 && lastName.trim().length > 0,
    dob: dob.trim().length > 0,
    wallet: mockWalletConnected && wallet.trim().length > 0,
    statType: Boolean(mode),
  };
  const trimmedWallet = wallet.trim();
  const walletDisplay = trimmedWallet
    ? trimmedWallet.length > 12
      ? `${trimmedWallet.slice(0, 6)}...${trimmedWallet.slice(-4)}`
      : trimmedWallet
    : "Unassigned";
  const activeFieldLabel =
    consoleFields.find((field) => field.id === activeField)?.label ?? "Console";
  const currentConsoleSignature = `${firstName.trim()}|${lastName.trim()}|${dob.trim()}|${wallet.trim()}|${mode}`;
  const fieldSignatures: Record<ActiveConsoleField, string> = {
    mark: `${firstName.trim()}|${lastName.trim()}`,
    dob: dob.trim(),
    wallet: wallet.trim(),
    statType: mode,
  };
  const fieldConfirmed: Record<ActiveConsoleField, boolean> = {
    mark: fieldCompletion.mark && confirmedSignatures.mark === fieldSignatures.mark,
    dob: fieldCompletion.dob && confirmedSignatures.dob === fieldSignatures.dob,
    wallet: fieldCompletion.wallet && confirmedSignatures.wallet === fieldSignatures.wallet,
    statType: fieldCompletion.statType && confirmedSignatures.statType === fieldSignatures.statType,
  };
  const walletStatus =
    !fieldConfirmed.wallet
      ? "undetermined"
      : trimmedWallet.toLowerCase() === MOCK_VANGUARD_WALLET
        ? "vanguard"
        : "nonVanguard";
  const activeFieldHasInput = fieldCompletion[activeField];
  const activeFieldConfirmed = fieldConfirmed[activeField];
  const allConsoleFieldsConfirmed = Object.values(fieldConfirmed).every(Boolean);
  const previewArmed = armedSignature === currentConsoleSignature;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const params = new URLSearchParams(window.location.search);
      const urlFirstName = params.get("firstName");
      const urlLastName = params.get("lastName");
      const legacyMark = params.get("mark");

      setDob(params.get("dob") ?? "");
      const urlWallet = params.get("wallet") ?? "";
      setWallet(urlWallet);
      setMockWalletConnected(Boolean(urlWallet));

      if (urlFirstName !== null || urlLastName !== null) {
        setFirstName(urlFirstName ?? "");
        setLastName(urlLastName ?? "");
      } else if (legacyMark) {
        const [legacyFirstName = "", ...legacyLastNameParts] = legacyMark
          .trim()
          .split(/\s+/);
        setFirstName(legacyFirstName);
        setLastName(legacyLastNameParts.join(" "));
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  async function copyShareLink() {
    const params = new URLSearchParams();

    if (dob) params.set("dob", dob);
    if (firstName) params.set("firstName", firstName);
    if (lastName) params.set("lastName", lastName);
    if (wallet) params.set("wallet", wallet);

    const nextUrl = `${window.location.origin}/engine${params.size ? `?${params}` : ""}`;
    await navigator.clipboard.writeText(nextUrl);
    setShareState("copied");
    window.setTimeout(() => setShareState("idle"), 1800);
  }

  function armPreview() {
    setArmedSignature(currentConsoleSignature);
  }

  function confirmActiveField() {
    if (activeField === "wallet" && !mockWalletConnected) {
      return;
    }

    setConfirmedSignatures((current) => ({
      ...current,
      [activeField]: fieldSignatures[activeField],
    }));
  }

  function connectMockWallet() {
    setMockWalletConnected(true);

    if (!wallet.trim()) {
      setWallet(MOCK_VANGUARD_WALLET);
    }

    setConfirmedSignatures((current) => ({
      ...current,
      wallet: "",
    }));
    setArmedSignature("");
  }

  function resetConfirmedField(field: ActiveConsoleField) {
    setActiveField(field);

    if (!fieldConfirmed[field]) {
      return;
    }

    if (field === "mark") {
      setFirstName("");
      setLastName("");
    }

    if (field === "dob") {
      setDob("");
    }

    if (field === "wallet") {
      setWallet("");
      setMockWalletConnected(false);
    }

    if (field === "statType") {
      setMode("sovereign");
    }

    setConfirmedSignatures((current) => ({
      ...current,
      [field]: "",
    }));
    setArmedSignature("");
  }

  return (
    <main className="info-control-page relative isolate min-h-screen overflow-x-hidden bg-black text-white">
      <TunnelBackdrop layer="page" variant="diffused" />
      <BackgroundHashStream className="z-0" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[96rem] flex-col px-4 py-5 md:px-8">
        <nav className="engine-top-nav control-surface flex flex-wrap items-center justify-between gap-4 border-b border-cyan-200/15 bg-black/80 px-4 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl md:text-sm">
          <div className="engine-nav-links flex flex-wrap gap-4">
            <Link href="/" className="chamfer-nav-link chamfer-nav-link--compact">
              Return Home
            </Link>
            <Link href="/portal" className="chamfer-nav-link chamfer-nav-link--compact">
              Mint Portal
            </Link>
          </div>
          <span className="engine-nav-title text-[11px] tracking-[0.28em] text-cyan-100/72">Artifact Engine // Instance 01</span>
        </nav>

        <section className="engine-two-column-layout grid flex-1 gap-5 py-5">
          <div className="grid gap-5">
          <section className="control-surface control-surface-large border border-cyan-200/20 bg-black/58 p-4 shadow-[0_0_70px_rgba(72,220,255,0.09)] md:p-5">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)] xl:items-stretch">
              <div className="grid gap-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.34em] text-cyan-100/65">
                      Bridge Console
                    </div>
                    <h1 className="mt-3 text-xl font-light uppercase tracking-[0.14em] text-white md:text-2xl">
                      Mock Input Console
                    </h1>
                  </div>
                  <button
                    onClick={copyShareLink}
                    className="console-key-button console-key-button--gold"
                    type="button"
                  >
                    {shareState === "copied" ? "Copied" : "Share"}
                  </button>
                </div>

                <div className="engine-field-button-grid grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {consoleFields.map((field) => (
                    <button
                      key={field.id}
                      onClick={() => resetConfirmedField(field.id)}
                      className={`console-key-button console-key-button--field w-full ${
                        activeField === field.id ? "console-key-button--active" : ""
                      } ${fieldConfirmed[field.id] ? "console-key-button--entered" : ""}`}
                      type="button"
                    >
                      <span className="mr-2 inline-block h-1.5 w-1.5 bg-current shadow-[0_0_10px_currentColor]" />
                      {field.shortLabel}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`control-surface control-surface-strong border border-cyan-100/20 bg-black/55 p-4 ${activeFieldConfirmed ? "console-active-field--entered" : ""}`}>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-white/42">
                      Active Input
                    </div>
                    <div className="mt-2 text-sm uppercase tracking-[0.2em] text-cyan-50">
                      {activeFieldLabel}
                    </div>
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-yellow-100/70">
                    {activeFieldConfirmed
                      ? "Signal Stored"
                      : activeFieldHasInput
                        ? "Ready To Enter"
                        : "Awaiting Input"}
                  </div>
                </div>

                {activeField === "mark" && (
                  <div className="grid gap-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-white/45">
                          First Name
                        </span>
                        <input
                          value={firstName}
                          onChange={(event) => setFirstName(event.target.value)}
                          autoFocus
                          maxLength={32}
                          placeholder="First"
                          className="control-input-surface min-h-12 w-full border border-cyan-100/20 bg-black/80 px-3 text-sm text-white outline-none transition focus:border-cyan-100/65"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-white/45">
                          Last Name
                        </span>
                        <input
                          value={lastName}
                          onChange={(event) => setLastName(event.target.value)}
                          maxLength={32}
                          placeholder="Last"
                          className="control-input-surface min-h-12 w-full border border-cyan-100/20 bg-black/80 px-3 text-sm text-white outline-none transition focus:border-cyan-100/65"
                        />
                      </label>
                    </div>
                    <div className="console-field-note">
                      Prototype identity details. Real Portal fields should match Coinbase/EAS records.
                    </div>
                  </div>
                )}

                {activeField === "dob" && (
                  <label className="block">
                    <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-white/45">
                      Date Of Birth
                    </span>
                    <input
                      value={dob}
                      onChange={(event) => setDob(event.target.value)}
                      type="date"
                      autoFocus
                      className="control-input-surface min-h-12 w-full border border-cyan-100/20 bg-black/80 px-3 text-sm text-white outline-none transition focus:border-cyan-100/65"
                    />
                  </label>
                )}

                {activeField === "wallet" && (
                  <div className="grid gap-3">
                    <label className="block">
                      <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-white/45">
                        Wallet Marker
                        <span className="ml-2 text-[9px] tracking-[0.16em] text-cyan-100/42">
                          mock only
                        </span>
                      </span>
                      <input
                        value={wallet}
                        onChange={(event) => setWallet(event.target.value)}
                        autoFocus
                        disabled={!mockWalletConnected}
                        placeholder="7777"
                        className="control-input-surface min-h-12 w-full border border-cyan-100/20 bg-black/80 px-3 text-sm text-white outline-none transition disabled:cursor-not-allowed disabled:opacity-45 focus:border-cyan-100/65"
                      />
                    </label>
                    <button
                      className={`console-key-button w-full ${
                        mockWalletConnected ? "console-key-button--active" : "console-key-button--gold"
                      }`}
                      onClick={connectMockWallet}
                      type="button"
                    >
                      {mockWalletConnected ? "Mock Wallet Connected" : "Connect Mock Wallet"}
                    </button>
                    <div className="console-field-note console-field-note--warning">
                      Mock marker only. Real Portal uses connected wallet + Coinbase EAS. Vanguard marker: 7777.
                    </div>
                  </div>
                )}

                {activeField === "statType" && (
                  <div className="grid gap-3">
                    <div className="console-field-note">
                      Prototype categories. Future asset types are not wired.
                    </div>
                    <div className="grid gap-2 sm:grid-cols-5">
                      <button
                        className="console-key-button console-key-button--category-selected w-full"
                        disabled
                        type="button"
                      >
                        Character
                      </button>
                      {["Armor", "Weapons", "Transports", "Paths"].map((category) => (
                        <button
                          key={category}
                          className="console-key-button console-key-button--disabled w-full"
                          disabled
                          type="button"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                    <div className="grid gap-2 sm:grid-cols-5">
                      {readouts.map((readout) => (
                        <button
                          key={readout.id}
                          onClick={() => setMode(readout.id)}
                          className={`console-key-button w-full ${
                            mode === readout.id ? "console-key-button--active" : ""
                          }`}
                          type="button"
                        >
                          {readout.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  {allConsoleFieldsConfirmed ? (
                    <button
                      className="console-launch-button w-full"
                      onClick={armPreview}
                      type="button"
                    >
                      {previewArmed ? "Mock Mint Armed" : "Mock Mint"}
                    </button>
                  ) : (
                    activeFieldHasInput &&
                    !activeFieldConfirmed && (
                      <button
                        className="console-enter-button w-full"
                        onClick={confirmActiveField}
                        type="button"
                      >
                        Enter
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <div className={`control-surface-soft min-h-[4rem] border border-cyan-200/20 bg-cyan-200/[0.035] px-3 py-2 ${fieldConfirmed.mark ? "console-status-tile--entered" : ""}`}>
                <div className="text-[9px] uppercase tracking-[0.22em] text-cyan-100/48">
                  Name
                </div>
                <div className="mt-1 truncate text-xs uppercase tracking-[0.14em] text-cyan-50">
                  {profile.mark}
                </div>
              </div>
              <div className={`control-surface-soft min-h-[4rem] border border-yellow-200/20 bg-yellow-200/[0.035] px-3 py-2 ${fieldConfirmed.dob ? "console-status-tile--entered" : ""}`}>
                <div className="text-[9px] uppercase tracking-[0.22em] text-yellow-100/48">
                  DOB
                </div>
                <div className="mt-1 truncate text-xs uppercase tracking-[0.14em] text-cyan-50">
                  {dob || "1988-08-08"}
                </div>
              </div>
              <div className={`control-surface-soft min-h-[4rem] border border-fuchsia-200/20 bg-fuchsia-200/[0.035] px-3 py-2 ${fieldConfirmed.wallet ? "console-status-tile--entered" : ""}`}>
                <div className="text-[9px] uppercase tracking-[0.22em] text-fuchsia-100/48">
                  Wallet
                </div>
                <div className="mt-1 truncate text-xs uppercase tracking-[0.14em] text-cyan-50">
                  {walletDisplay}
                </div>
              </div>
              <div className={`control-surface-soft min-h-[4rem] border border-lime-200/20 bg-lime-200/[0.035] px-3 py-2 ${fieldConfirmed.statType ? "console-status-tile--entered" : ""}`}>
                <div className="text-[9px] uppercase tracking-[0.22em] text-lime-100/48">
                  Stat Type
                </div>
                <div className="mt-1 truncate text-xs uppercase tracking-[0.14em] text-cyan-50">
                  {activeReadout.label}
                </div>
              </div>
            </div>
          </section>
            <StoredShape
              attestationConfirmed={fieldConfirmed.mark && fieldConfirmed.wallet}
              walletStatus={walletStatus}
            />
            <SubjectSystems alignment={profile.alignment} profileMark={profile.mark} />
          </div>

          <div className="grid gap-5">
            <NativeMatrixScanner
              activeLabel={activeFieldLabel}
              allFieldsConfirmed={allConsoleFieldsConfirmed}
              readout={activeReadout}
              revealed={previewArmed}
              subject={profile.mark}
            />
            <ReadoutBus shareCode={profile.shareCode} />
          </div>
        </section>
      </div>
    </main>
  );
}
