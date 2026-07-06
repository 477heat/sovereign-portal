"use client";

import Link from "next/link";
import type { RefObject } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import TunnelBackdrop from "@/components/TunnelBackdrop";
import {
  buildEngineProfile,
  buildReadouts,
  type EngineReadout,
  type ReadoutMode,
} from "./engineReadouts";

type EngineControl =
  | "dob"
  | "location"
  | "time"
  | "output"
  | "preview";

type EngineOutputType = "astro" | "kindred" | "quantum";

const engineControls: Array<{
  id: EngineControl;
  label: string;
  value: string;
}> = [
  { id: "dob", label: "DOB", value: "Birth" },
  { id: "location", label: "Location", value: "Place" },
  { id: "time", label: "Time", value: "Birth" },
  { id: "output", label: "Output", value: "Lane" },
  { id: "preview", label: "Preview", value: "Readout" },
];

const requiredControls: EngineControl[] = [
  "dob",
  "location",
  "time",
  "output",
];

const outputTypes: Array<{
  id: EngineOutputType;
  label: string;
  note: string;
  mode: ReadoutMode;
}> = [
  {
    id: "astro",
    label: "Astro Stats",
    note: "Birth signal readout",
    mode: "sovereign",
  },
  {
    id: "kindred",
    label: "Kindred Creature",
    note: "Creature test lane",
    mode: "transit",
  },
  {
    id: "quantum",
    label: "Quantum Tunnel",
    note: "Story/game lane",
    mode: "metaverse",
  },
];

const drawerActions = [
  { href: "/", label: "Home" },
  { href: "/portal", label: "Forge" },
  { href: "/alliant", label: "Alliant" },
  { href: "/vanguard", label: "Vanguard" },
];

function stackWords(label: string) {
  return label.split(/\s+/).filter(Boolean);
}

function controlStatusLabel(complete: boolean, ready: boolean) {
  if (complete) {
    return "Stored";
  }

  if (ready) {
    return "Ready";
  }

  return "Waiting";
}

function EngineCommandTitleTab({
  activeLabel,
  drawerOpen,
  onOpen,
  state,
  triggerRef,
}: {
  activeLabel: string;
  drawerOpen: boolean;
  onOpen: () => void;
  state: "locked" | "pending" | "ready";
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const words = stackWords(activeLabel);

  return (
    <div className="portal-gate-top-row">
      <button
        aria-controls="engine-select-drawer"
        aria-expanded={drawerOpen}
        aria-label={`Open Engine controls for ${activeLabel}`}
        className={`portal-command-title-tab portal-command-title-tab--attention portal-command-title-tab--${state}`}
        onClick={onOpen}
        ref={triggerRef}
        type="button"
      >
        <span
          className="portal-command-title-tab__label"
          data-word-count={words.length}
        >
          {words.map((word) => (
            <span className="portal-command-title-tab__word" key={word}>
              {word}
            </span>
          ))}
        </span>
        <span aria-hidden="true" className="portal-command-title-tab__chevrons">
          <span />
          <span />
          <span />
        </span>
      </button>
    </div>
  );
}

function EngineDrawer({
  activeControl,
  controlCompletion,
  drawerOpen,
  onClose,
  onSelect,
}: {
  activeControl: EngineControl;
  controlCompletion: Record<EngineControl, boolean>;
  drawerOpen: boolean;
  onClose: () => void;
  onSelect: (control: EngineControl) => void;
}) {
  if (!drawerOpen) {
    return null;
  }

  return (
    <div className="portal-mobile-select-layer engine-select-layer">
      <button
        aria-label="Close Engine controls"
        className="portal-mobile-select-backdrop"
        onClick={onClose}
        type="button"
      />
      <section
        aria-label="Engine controls"
        className="portal-mobile-select-drawer border border-yellow-300/35 p-4"
        id="engine-select-drawer"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-yellow-100/70">
              Engine Deck
            </p>
            <h2 className="mt-1 text-lg font-black uppercase tracking-[0.18em] text-white">
              Controls
            </h2>
          </div>
          <button
            className="portal-mobile-select-close chamfer-nav-link chamfer-nav-link--compact"
            onClick={onClose}
            type="button"
          >
            Stow
          </button>
        </div>

        <div className="portal-mobile-select-content grid gap-5">
          <section>
            <div className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/64">
              Birth Inputs
            </div>
            <div className="portal-mobile-select-grid command-room__drawer-button-grid mt-2 grid grid-cols-2 gap-2">
              {engineControls.slice(0, 3).map((control) => (
                <EngineDrawerChip
                  active={activeControl === control.id}
                  complete={controlCompletion[control.id]}
                  control={control}
                  key={control.id}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </section>

          <section>
            <div className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/64">
              Output Controls
            </div>
            <div className="portal-mobile-select-grid command-room__drawer-button-grid mt-2 grid grid-cols-2 gap-2">
              {engineControls.slice(3).map((control) => (
                <EngineDrawerChip
                  active={activeControl === control.id}
                  complete={controlCompletion[control.id]}
                  control={control}
                  key={control.id}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </section>

          <nav
            aria-label="Engine drawer page links"
            className="portal-mobile-drawer-actions command-room__drawer-actions"
          >
            {drawerActions.map((action, index) => (
              <Link
                className={`portal-mobile-drawer-action chamfer-nav-link chamfer-nav-link--compact ${
                  index % 2 === 1 ? "chamfer-nav-link--opposite" : ""
                }`}
                href={action.href}
                key={action.href}
              >
                {action.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </div>
  );
}

function EngineDrawerChip({
  active,
  complete,
  control,
  onSelect,
}: {
  active: boolean;
  complete: boolean;
  control: (typeof engineControls)[number];
  onSelect: (control: EngineControl) => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={`portal-mobile-select-chip chamfer-hero-link console-key-button ${
        active ? "portal-gate-button--selected" : ""
      } ${complete ? "console-status-tile--entered" : ""}`}
      onClick={() => onSelect(control.id)}
      type="button"
    >
      <span>{control.label}</span>
      <small>{controlStatusLabel(complete, active)}</small>
    </button>
  );
}

function EngineStepCluster({
  activeControl,
  controlCompletion,
  onSelect,
}: {
  activeControl: EngineControl;
  controlCompletion: Record<EngineControl, boolean>;
  onSelect: (control: EngineControl) => void;
}) {
  return (
    <div
      aria-label="Engine sequence status"
      className="portal-action-cluster portal-action-quad portal-action-cluster--static"
      role="list"
    >
      {engineControls.slice(0, 6).map((control) => {
        const stateClass = controlCompletion[control.id]
          ? "portal-step-icon--complete"
          : activeControl === control.id
            ? "portal-step-icon--current"
            : "portal-step-icon--available";

        return (
          <div key={control.id} role="listitem">
            <button
              aria-label={`Open ${control.label} engine control. Current status: ${control.value}.`}
              className={`portal-step-icon ${stateClass}`}
              onClick={() => onSelect(control.id)}
              type="button"
            >
              <span>{control.label}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

function EnginePreviewScreen({
  birthLocation,
  birthTime,
  canPreview,
  outputLabel,
  previewVisible,
  profileSignal,
  readout,
}: {
  birthLocation: string;
  birthTime: string;
  canPreview: boolean;
  outputLabel: string;
  previewVisible: boolean;
  profileSignal: string;
  readout: EngineReadout;
}) {
  const displayTime = birthTime || "Awaiting time";
  const displayLocation = birthLocation || "Awaiting location";

  return (
    <section className="engine-preview-screen control-surface-soft relative overflow-hidden border border-cyan-200/20 p-4">
      <div className="engine-screen-grid absolute inset-0 opacity-45" aria-hidden="true" />
      <div className="engine-sweep absolute inset-x-0 top-0 h-24" aria-hidden="true" />
      <div className="relative z-10 grid gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-100/64">
              View Screen
            </div>
            <h1 className="mt-2 text-2xl font-black uppercase tracking-[0.14em] text-white md:text-4xl">
              {previewVisible ? readout.title : "Input Pending"}
            </h1>
          </div>
          <div className="control-surface-soft border border-yellow-200/25 px-3 py-2 text-right">
            <div className="text-[9px] font-black uppercase tracking-[0.24em] text-yellow-100/72">
              Output
            </div>
            <div className="mt-1 text-sm font-black uppercase tracking-[0.14em] text-white">
              {outputLabel}
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="control-surface-soft border border-cyan-200/15 p-3">
            <span className="text-[9px] font-black uppercase tracking-[0.24em] text-cyan-100/60">
              Signal
            </span>
            <strong className="mt-2 block truncate text-sm uppercase tracking-[0.14em] text-white">
              {profileSignal}
            </strong>
          </div>
          <div className="control-surface-soft border border-cyan-200/15 p-3">
            <span className="text-[9px] font-black uppercase tracking-[0.24em] text-cyan-100/60">
              Birth Place
            </span>
            <strong className="mt-2 block truncate text-sm uppercase tracking-[0.14em] text-white">
              {displayLocation}
            </strong>
          </div>
          <div className="control-surface-soft border border-cyan-200/15 p-3">
            <span className="text-[9px] font-black uppercase tracking-[0.24em] text-cyan-100/60">
              Birth Time
            </span>
            <strong className="mt-2 block truncate text-sm uppercase tracking-[0.14em] text-white">
              {displayTime}
            </strong>
          </div>
        </div>

        {previewVisible ? (
          <div className="grid gap-3 md:grid-cols-[0.8fr_1.2fr]">
            <div className="control-surface-soft border border-yellow-200/25 p-4">
              <div className="text-[10px] font-black uppercase tracking-[0.24em] text-yellow-100/72">
                {readout.primaryLabel}
              </div>
              <div className="mt-3 text-4xl font-black uppercase tracking-[0.12em] text-white">
                {readout.primaryValue}
              </div>
              <p className="mt-4 text-sm font-semibold leading-6 text-white/76">
                {readout.summary}
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {readout.stats.slice(0, 8).map((stat) => (
                <div
                  className="control-surface-soft border border-cyan-200/15 p-3"
                  key={stat.label}
                >
                  <div className="flex items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-white/72">
                    <span>{stat.label}</span>
                    <span className="text-yellow-100">{stat.value}</span>
                  </div>
                  <div className="mt-2 h-1.5 border border-cyan-100/10 bg-black/70">
                    <div
                      className="h-full bg-cyan-100/80 shadow-[0_0_12px_rgba(165,243,252,0.34)]"
                      style={{ width: `${Math.min(stat.value, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="control-surface-soft border border-cyan-200/15 p-4">
            <p className="max-w-3xl text-lg font-semibold leading-8 text-white/76">
              This is the frontend Engine shell. Birth date, location, time,
              and output lane are staged here before the real Astro Stats,
              Kindred Creature, and Quantum Tunnel engine routes are wired in.
            </p>
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-yellow-100/78">
              {canPreview
                ? "All inputs are stored. Preview can be generated."
                : "Complete the inputs to arm the preview lane."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function EngineConsoleDock({
  canPreview,
  onClear,
  onCycle,
  onPreview,
}: {
  canPreview: boolean;
  onClear: () => void;
  onCycle: (direction: "next" | "previous") => void;
  onPreview: () => void;
}) {
  return (
    <div className="portal-console-dock engine-console-dock">
      <button
        className="portal-console-dock-cell portal-console-dock-cell--action"
        onClick={onClear}
        type="button"
      >
        <span>Clear</span>
        <strong>Form</strong>
      </button>
      <button
        className="portal-console-dock-cell portal-console-dock-cell--action"
        disabled={!canPreview}
        onClick={onPreview}
        type="button"
      >
        <span>Preview</span>
        <strong>Stats</strong>
      </button>
      <button
        aria-label="Previous Engine control"
        className="portal-console-dock-cell portal-console-dock-cell--cycle"
        onClick={() => onCycle("previous")}
        type="button"
      >
        <svg
          aria-hidden="true"
          className="portal-console-dock-icon"
          focusable="false"
          viewBox="0 0 24 24"
        >
          <path d="M14.5 5.5 8 12l6.5 6.5" />
        </svg>
      </button>
      <button
        aria-label="Next Engine control"
        className="portal-console-dock-cell portal-console-dock-cell--cycle"
        onClick={() => onCycle("next")}
        type="button"
      >
        <svg
          aria-hidden="true"
          className="portal-console-dock-icon"
          focusable="false"
          viewBox="0 0 24 24"
        >
          <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
        </svg>
      </button>
    </div>
  );
}

export default function EnginePage() {
  const drawerTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [activeControl, setActiveControl] = useState<EngineControl>("dob");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dob, setDob] = useState("");
  const [birthLocation, setBirthLocation] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [outputType, setOutputType] = useState<EngineOutputType>("astro");
  const [confirmedSignatures, setConfirmedSignatures] = useState<
    Partial<Record<EngineControl, string>>
  >({});
  const [previewSignature, setPreviewSignature] = useState("");

  const activeOutput = useMemo(
    () =>
      outputTypes.find((output) => output.id === outputType) ?? outputTypes[0],
    [outputType],
  );
  const seedContext = useMemo(
    () => `${birthLocation.trim()}|${birthTime.trim()}|${outputType}`,
    [birthLocation, birthTime, outputType],
  );
  const profile = useMemo(
    () => buildEngineProfile(dob, activeOutput.label, seedContext),
    [activeOutput.label, dob, seedContext],
  );
  const readouts = useMemo(() => buildReadouts(profile), [profile]);
  const activeReadout =
    readouts.find((readout) => readout.id === activeOutput.mode) ?? readouts[0];

  const signatures: Record<EngineControl, string> = {
    dob: dob.trim(),
    location: birthLocation.trim(),
    time: birthTime.trim(),
    output: outputType,
    preview: `${dob.trim()}|${seedContext}`,
  };
  const hasInput: Record<EngineControl, boolean> = {
    dob: dob.trim().length > 0,
    location: birthLocation.trim().length > 0,
    time: birthTime.trim().length > 0,
    output: Boolean(outputType),
    preview: requiredControls.every(
      (control) => confirmedSignatures[control] === signatures[control],
    ),
  };
  const controlCompletion: Record<EngineControl, boolean> = {
    dob: hasInput.dob && confirmedSignatures.dob === signatures.dob,
    location:
      hasInput.location && confirmedSignatures.location === signatures.location,
    time: hasInput.time && confirmedSignatures.time === signatures.time,
    output: hasInput.output && confirmedSignatures.output === signatures.output,
    preview: hasInput.preview && previewSignature === signatures.preview,
  };
  const canPreview = requiredControls.every(
    (control) => controlCompletion[control],
  );
  const previewVisible = canPreview && previewSignature === signatures.preview;
  const activeControlMeta =
    engineControls.find((control) => control.id === activeControl) ??
    engineControls[0];
  const activeReady = hasInput[activeControl];
  const activeComplete = controlCompletion[activeControl];
  const titleState = activeComplete ? "ready" : activeReady ? "pending" : "locked";

  function selectControl(control: EngineControl) {
    setActiveControl(control);
    setDrawerOpen(false);
  }

  function cycleControl(direction: "next" | "previous") {
    const currentIndex = engineControls.findIndex(
      (control) => control.id === activeControl,
    );
    const nextIndex =
      direction === "next"
        ? (currentIndex + 1) % engineControls.length
        : (currentIndex - 1 + engineControls.length) % engineControls.length;

    setActiveControl(engineControls[nextIndex].id);
  }

  function confirmActiveControl() {
    if (activeControl === "preview") {
      if (canPreview) {
        setPreviewSignature(signatures.preview);
      }
      return;
    }

    if (!hasInput[activeControl]) {
      return;
    }

    setConfirmedSignatures((current) => ({
      ...current,
      [activeControl]: signatures[activeControl],
    }));
    cycleControl("next");
  }

  function clearForm() {
    setDob("");
    setBirthLocation("");
    setBirthTime("");
    setOutputType("astro");
    setConfirmedSignatures({});
    setPreviewSignature("");
    setActiveControl("dob");
  }

  useEffect(() => {
    if (!drawerOpen) {
      return;
    }

    const scrollY = window.scrollY;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [drawerOpen]);

  return (
    <main className="info-control-page portal-control-page engine-shell-page relative isolate min-h-screen overflow-x-hidden bg-black text-white">
      <TunnelBackdrop intensity="faint" layer="page" variant="diffused" />

      <EngineDrawer
        activeControl={activeControl}
        controlCompletion={controlCompletion}
        drawerOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSelect={selectControl}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[96rem] flex-col px-3 py-4 md:px-8">
        <nav className="portal-quiet-nav control-surface mb-4 flex items-center justify-between gap-3 border border-cyan-200/10 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-white/72">
          <Link href="/" className="chamfer-nav-link chamfer-nav-link--compact">
            Home
          </Link>
          <span className="text-cyan-100/72">Engine Room // Kindred Preview</span>
          <Link
            href="/portal"
            className="chamfer-nav-link chamfer-nav-link--compact chamfer-nav-link--opposite"
          >
            Forge
          </Link>
        </nav>

        <section className="portal-console-shell portal-console-border-shell engine-console-shell flex-1">
          <div className="control-surface-soft portal-gate-view portal-gate-view--matrix engine-gate-view border border-cyan-200/25">
            <EngineCommandTitleTab
              activeLabel={activeControlMeta.label}
              drawerOpen={drawerOpen}
              onOpen={() => setDrawerOpen(true)}
              state={titleState}
              triggerRef={drawerTriggerRef}
            />

            <div className="relative z-10 grid min-h-0 gap-4 px-4 pb-4 pt-6 md:px-6 md:pb-5">
              <div className="engine-shell-grid grid min-h-0 gap-4">
                <section className="control-surface-soft engine-active-entry border border-yellow-200/25 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-100/72">
                        Active Entry
                      </div>
                      <h1 className="mt-2 text-xl font-black uppercase tracking-[0.16em] text-white">
                        {activeControlMeta.label}
                      </h1>
                    </div>
                    <div className="text-right text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/70">
                      {controlStatusLabel(activeComplete, activeReady)}
                    </div>
                  </div>

                  <div className="mt-4">
                    {activeControl === "dob" ? (
                      <label className="block">
                        <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.24em] text-white/62">
                          Date Of Birth
                        </span>
                        <input
                          autoFocus
                          className="control-input-surface w-full border border-cyan-100/20 px-3 text-white outline-none transition focus:border-cyan-100/65"
                          onChange={(event) => {
                            setDob(event.target.value);
                            setPreviewSignature("");
                          }}
                          type="date"
                          value={dob}
                        />
                      </label>
                    ) : null}

                    {activeControl === "location" ? (
                      <label className="block">
                        <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.24em] text-white/62">
                          Birth Location
                        </span>
                        <input
                          autoFocus
                          className="control-input-surface w-full border border-cyan-100/20 px-3 text-white outline-none transition focus:border-cyan-100/65"
                          maxLength={80}
                          onChange={(event) => {
                            setBirthLocation(event.target.value);
                            setPreviewSignature("");
                          }}
                          placeholder="City, State, Country"
                          value={birthLocation}
                        />
                      </label>
                    ) : null}

                    {activeControl === "time" ? (
                      <label className="block">
                        <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.24em] text-white/62">
                          Birth Time
                        </span>
                        <input
                          autoFocus
                          className="control-input-surface w-full border border-cyan-100/20 px-3 text-white outline-none transition focus:border-cyan-100/65"
                          onChange={(event) => {
                            setBirthTime(event.target.value);
                            setPreviewSignature("");
                          }}
                          type="time"
                          value={birthTime}
                        />
                      </label>
                    ) : null}

                    {activeControl === "output" ? (
                      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                        {outputTypes.map((output) => (
                          <button
                            className={`console-key-button w-full ${
                              outputType === output.id
                                ? "console-key-button--active"
                                : ""
                            }`}
                            key={output.id}
                            onClick={() => {
                              setOutputType(output.id);
                              setPreviewSignature("");
                            }}
                            type="button"
                          >
                            <span className="block">{output.label}</span>
                            <small className="mt-1 block text-[9px] tracking-[0.18em] text-white/58">
                              {output.note}
                            </small>
                          </button>
                        ))}
                      </div>
                    ) : null}

                    {activeControl === "preview" ? (
                      <div className="control-surface-soft border border-cyan-200/15 p-4">
                        <p className="text-sm font-semibold leading-6 text-white/78">
                          Preview gathers the stored inputs and displays the
                          temporary frontend readout. The live Kindred Creature
                          result still belongs to the Engine backend.
                        </p>
                      </div>
                    ) : null}
                  </div>

                  <button
                    className={`portal-console-enter mt-5 ${
                      activeControl === "preview" && canPreview
                        ? "portal-console-enter--ready"
                        : activeReady
                          ? "portal-console-enter--ready"
                          : "portal-console-enter--locked"
                    }`}
                    disabled={activeControl === "preview" ? !canPreview : !activeReady}
                    onClick={confirmActiveControl}
                    type="button"
                  >
                    <span className="portal-console-enter__label">
                      {activeControl === "preview" ? "Preview" : "Enter"}
                    </span>
                  </button>
                </section>

                <EnginePreviewScreen
                  birthLocation={birthLocation}
                  birthTime={birthTime}
                  canPreview={canPreview}
                  outputLabel={activeOutput.label}
                  previewVisible={previewVisible}
                  profileSignal={profile.shareCode}
                  readout={activeReadout}
                />
              </div>

              <div className="portal-gate-bottom-row engine-step-row">
                <div className="portal-gate-action-cell portal-gate-action-cell--submit">
                  <div className="control-surface-soft border border-cyan-200/15 p-3">
                    <span className="text-[9px] font-black uppercase tracking-[0.24em] text-cyan-100/68">
                      Completion
                    </span>
                    <strong className="mt-1 block text-lg font-black uppercase tracking-[0.14em] text-white">
                      {
                        requiredControls.filter(
                          (control) => controlCompletion[control],
                        ).length
                      }
                      /{requiredControls.length}
                    </strong>
                  </div>
                </div>
                <div className="portal-gate-action-cell portal-gate-action-cell--cluster">
                  <EngineStepCluster
                    activeControl={activeControl}
                    controlCompletion={controlCompletion}
                    onSelect={setActiveControl}
                  />
                </div>
              </div>
            </div>
          </div>

          <EngineConsoleDock
            canPreview={canPreview}
            onClear={clearForm}
            onCycle={cycleControl}
            onPreview={() => {
              if (canPreview) {
                setPreviewSignature(signatures.preview);
                setActiveControl("preview");
              }
            }}
          />
        </section>
      </div>
    </main>
  );
}
