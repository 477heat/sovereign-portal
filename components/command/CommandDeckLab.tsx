"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatedFrame } from "./AnimatedFrame";
import { AssemblingPanel } from "./AssemblingPanel";
import { CommandConsoleDock } from "./CommandConsoleDock";
import { CommandDrawerTab } from "./CommandDrawerTab";
import { MovingLines } from "./MovingLines";
import { PuffField } from "./PuffField";
import { SoundToggle } from "./SoundToggle";
import { useBleeps } from "./useBleeps";

type LabStatusTone = "live" | "design" | "spec" | "required" | "future";

type LabEntry = {
  id: string;
  shortLabel: string;
  title: string;
  type: string;
  status: string;
  tone: LabStatusTone;
  summary: string;
  nextStep: string;
  systems: string[];
  checkpoints: string[];
};

const labEntries: LabEntry[] = [
  {
    id: "genesis-access",
    shortLabel: "Genesis",
    title: "Genesis Access Soul Deed",
    type: "Live mint path",
    status: "Live / Controlled",
    tone: "live",
    summary:
      "The current Sovereign Engine mint path. A verified wallet enters the Portal, clears EAS, runs through the Engine, and receives a Base-native Soul Deed with public derived metadata. Every mint is engraved from that person's stats, so the image and artifact are not generic duplicates.",
    nextStep:
      "Keep real mints controlled. Confirm wording, image, metadata, and payment state before every live test.",
    systems: ["Portal", "EAS", "Engine", "Pinata", "Base"],
    checkpoints: ["Live route", "Metadata active", "Unique engraving"],
  },
  {
    id: "genesis-card",
    shortLabel: "Card",
    title: "Genesis Card Redesign",
    type: "Visual layer",
    status: "In Design",
    tone: "design",
    summary:
      "A more collectible, game-native presentation layer for the Soul Deed. The goal is marketplace readability without changing the verified origin underneath.",
    nextStep:
      "Lock card layout, burner coordinates, thumbnail safety, and which visual updates apply to future metadata.",
    systems: ["Image burner", "Metadata", "Marketplace"],
    checkpoints: ["Card frame", "Burn placement", "Mobile preview"],
  },
  {
    id: "reveal-flow",
    shortLabel: "Reveal",
    title: "Artifact Reveal Flow",
    type: "UX standard",
    status: "Spec Draft",
    tone: "spec",
    summary:
      "A reusable result screen standard for future mints. Users should see the final image, metadata URI, image URI, transaction path, and save options before leaving.",
    nextStep:
      "Define the reusable receipt rules before new mint branches borrow the pattern.",
    systems: ["Receipt", "Image preview", "Metadata"],
    checkpoints: ["Save receipt", "Open media", "Copy details"],
  },
  {
    id: "vanguard-badge",
    shortLabel: "Badge",
    title: "Vanguard Badge",
    type: "Status artifact",
    status: "Concept / In Design",
    tone: "design",
    summary:
      "A recognition branch based on the gold V badge. It can show status and identity on the site before we decide whether it becomes tokenized.",
    nextStep:
      "Decide whether the badge stays visual-only, becomes a token, or supports both paths.",
    systems: ["Vanguard", "Status", "Profile"],
    checkpoints: ["Badge art", "Gating rules", "No benefit overpromise"],
  },
  {
    id: "kindred-creature",
    shortLabel: "Kindred",
    title: "Kindred Creature",
    type: "Progeny preview",
    status: "Spec Draft",
    tone: "spec",
    summary:
      "The first planned Progeny creature branch. It should derive from a holder's Genesis profile and make Soul Attributes feel visible, useful, and personal.",
    nextStep:
      "Write the holder-gated preview spec before contract or mint work begins.",
    systems: ["Soul Attributes", "Creature rules", "Holder gate"],
    checkpoints: ["Taxonomy", "Metadata shape", "Art direction"],
  },
  {
    id: "personal-item",
    shortLabel: "Item",
    title: "Personal Item Copies",
    type: "Progeny item",
    status: "Spec Draft",
    tone: "spec",
    summary:
      "A future item branch where one generated item type may produce multiple tradeable copies. ERC-1155 is the leading candidate if copies share metadata.",
    nextStep:
      "Decide copy count, serial rules, hidden traits, and how item ownership should trade.",
    systems: ["ERC-1155 candidate", "Items", "Trading"],
    checkpoints: ["Copy rules", "Serial policy", "Claim behavior"],
  },
  {
    id: "adversaries",
    shortLabel: "Adversary",
    title: "Adversaries",
    type: "Creature reveal branch",
    status: "Spec Draft",
    tone: "spec",
    summary:
      "A planned hostile or spiritual creature branch. Public art can be visible while stats stay sealed until reveal rules are designed.",
    nextStep:
      "Define supply, reveal fairness, visible fields, and whether users mint, earn, or encounter them.",
    systems: ["Creature art", "Hidden stats", "Reveal"],
    checkpoints: ["Supply model", "Reveal policy", "Encounter rules"],
  },
  {
    id: "developer-pack",
    shortLabel: "Developer",
    title: "Developer Integration Pack",
    type: "Builder surface",
    status: "Planned",
    tone: "required",
    summary:
      "A future partner model where developers can use approved derived outputs like Soul Attributes, token ownership, public metadata, and lineage references.",
    nextStep:
      "Draft access rules, privacy boundaries, API shape, and whether a Developer Access Token is required.",
    systems: ["API candidate", "Docs", "Privacy"],
    checkpoints: ["Access rules", "Derived outputs", "Partner docs"],
  },
  {
    id: "trading-loop",
    shortLabel: "Game",
    title: "Trading Game Loop",
    type: "Future game system",
    status: "Future / Not Live",
    tone: "future",
    summary:
      "A later game layer that can use Progeny, items, Adversaries, sets, missions, trades, and challenges once the rules exist.",
    nextStep:
      "Do not build until rules, token standard, reveal policy, metadata shape, supply model, and contract behavior are defined.",
    systems: ["Game design", "Token rules", "Reveal rules"],
    checkpoints: ["Rules first", "Contract later", "No live claim"],
  },
];

const systemLamps = [
  "Public Workbench",
  "Visual Branches",
  "Engine Truth",
  "Contract Guard",
  "Portal Locked",
] as const;

type LabEntryId = (typeof labEntries)[number]["id"];

function statusToneLabel(tone: LabStatusTone) {
  switch (tone) {
    case "live":
      return "Live";
    case "design":
      return "Design";
    case "spec":
      return "Spec";
    case "required":
      return "Required";
    case "future":
      return "Future";
  }
}

export function CommandDeckLab() {
  const [activeEntryId, setActiveEntryId] = useState<LabEntryId>("genesis-access");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPinned, setDrawerPinned] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const { playBleep, soundEnabled, toggleSound } = useBleeps();
  const activeEntry = useMemo(
    () => labEntries.find((entry) => entry.id === activeEntryId) ?? labEntries[0],
    [activeEntryId],
  );
  const activeEntryIndex = Math.max(
    0,
    labEntries.findIndex((entry) => entry.id === activeEntry.id),
  );
  const primaryEntries = labEntries.slice(0, 4);
  const secondaryEntries = labEntries.slice(4, 8);
  const futureEntries = labEntries.slice(8);

  function selectEntry(entryId: LabEntryId) {
    setActiveEntryId(entryId);
    if (!drawerPinned) {
      setDrawerOpen(false);
    }
    playBleep("select");
  }

  function toggleDrawer() {
    if (drawerOpen) {
      setDrawerPinned(false);
      setDrawerOpen(false);
      playBleep("confirm");
      return;
    }

    setDrawerOpen(true);
    playBleep("select");
  }

  function toggleDrawerPinned() {
    if (!isDesktop) {
      return;
    }

    setDrawerOpen(true);
    setDrawerPinned((current) => !current);
    playBleep("confirm");
  }

  function cycleEntry(direction: "next" | "previous") {
    const nextIndex =
      direction === "next"
        ? (activeEntryIndex + 1) % labEntries.length
        : (activeEntryIndex - 1 + labEntries.length) % labEntries.length;

    setActiveEntryId(labEntries[nextIndex].id);
    playBleep("select");
  }

  function handleSoundToggle() {
    toggleSound();
    playBleep("confirm");
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    function syncViewportState() {
      const nextIsDesktop = mediaQuery.matches;
      setIsDesktop(nextIsDesktop);

      if (!nextIsDesktop) {
        setDrawerPinned(false);
        setDrawerOpen(false);
      }
    }

    syncViewportState();
    mediaQuery.addEventListener("change", syncViewportState);

    return () => {
      mediaQuery.removeEventListener("change", syncViewportState);
    };
  }, []);

  useEffect(() => {
    if (!drawerOpen || drawerPinned) {
      return;
    }

    const scrollY = window.scrollY;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyWidth = document.body.style.width;
    const previousHtmlOverscroll =
      document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.documentElement.style.overscrollBehavior = "none";

    return () => {
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.width = previousBodyWidth;
      document.documentElement.style.overscrollBehavior = previousHtmlOverscroll;
      window.scrollTo(0, scrollY);
    };
  }, [drawerOpen, drawerPinned]);

  const drawerContentId = "engine-lab-drawer";

  const renderDrawerTab = (embedded = false) => (
    <CommandDrawerTab
      drawerContentId={drawerContentId}
      drawerLabel="Engine Lab drawer"
      drawerOpen={drawerOpen}
      embedded={embedded}
      onClick={toggleDrawer}
      pendingActionId={null}
    />
  );

  const renderBuildButton = (entry: LabEntry, index: number) => (
    <button
      aria-pressed={activeEntry.id === entry.id}
      className={`chamfer-hero-link command-room__drawer-button ${
        index % 2 === 1 ? "chamfer-hero-link--opposite" : ""
      } ${
        activeEntry.id === entry.id
          ? "command-room__drawer-button--active"
          : ""
      } command-lab__drawer-button--${entry.tone}`}
      key={entry.id}
      onClick={() => selectEntry(entry.id)}
      type="button"
    >
      <span>{entry.shortLabel}</span>
      <small>{statusToneLabel(entry.tone)}</small>
    </button>
  );

  return (
    <div className="command-lab command-lab--console relative z-10 mx-auto flex min-h-screen max-w-[96rem] flex-col px-4 py-5 md:px-8">
      <section
        className={`command-lab__console-grid command-room__grid command-room__grid--drawer grid flex-1 gap-5 py-5 ${
          drawerPinned ? "command-lab__console-grid--drawer-pinned" : ""
        }`}
      >
        <section className="command-room__console-body command-lab__console-body">
          <div className="command-room__console-screen command-lab__console-screen">
            {!drawerOpen ? (
              <div className="command-room__embedded-drawer-tab command-lab__embedded-drawer-tab">
                {renderDrawerTab(true)}
              </div>
            ) : null}

            <AnimatedFrame
              className="command-lab__viewscreen command-lab__viewscreen--table command-lab__viewscreen--console"
              label={activeEntry.status}
            >
              <MovingLines />
              <PuffField />
              <div className="engine-screen-grid absolute inset-0 opacity-36" aria-hidden="true" />
              <div className="engine-sweep absolute inset-x-0 top-0 h-28" aria-hidden="true" />
              <div className="command-lab__table-mark" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>

              <div className="command-lab__table-screen command-lab__table-screen--console relative z-10 grid content-between gap-7 p-5 md:p-8">
                <div className="command-lab__table-header">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.32em] text-yellow-100/72">
                      {activeEntry.type}
                    </p>
                    <h1 className="command-lab__headline mt-4 max-w-3xl text-3xl uppercase leading-tight text-cyan-50 md:text-5xl">
                      {activeEntry.title}
                    </h1>
                  </div>
                  <div className={`command-lab__status-chip command-lab__status-chip--${activeEntry.tone}`}>
                    <span>{statusToneLabel(activeEntry.tone)}</span>
                    <strong>{activeEntry.status}</strong>
                  </div>
                </div>

                <div className="command-lab__specimen-grid">
                  <section className="command-lab__specimen-copy">
                    <span>Public Summary</span>
                    <p>{activeEntry.summary}</p>
                  </section>
                  <section className="command-lab__specimen-copy command-lab__specimen-copy--next">
                    <span>Next Needed</span>
                    <p>{activeEntry.nextStep}</p>
                  </section>
                </div>

                <div className="command-lab__console-readouts">
                  <div className="command-lab__system-strip">
                    {activeEntry.systems.map((system) => (
                      <div className="command-readout-tile command-readout-tile--system" key={system}>
                        <span>System</span>
                        <strong>{system}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="command-lab__checkpoint-panel command-lab__checkpoint-panel--console">
                    <span>Selected Checkpoints</span>
                    <ul>
                      {activeEntry.checkpoints.map((checkpoint) => (
                        <li key={checkpoint}>{checkpoint}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </AnimatedFrame>
          </div>

          <CommandConsoleDock
            onCycle={cycleEntry}
            panelCount={labEntries.length}
            pendingActionId={null}
          />
      </section>

        <div
          className={`command-room__drawer-shell command-lab__drawer-shell ${
            drawerOpen
              ? "command-room__drawer-shell--open"
              : "command-room__drawer-shell--closed"
          } ${drawerPinned ? "command-lab__drawer-shell--pinned" : ""}`}
        >
          {drawerOpen ? renderDrawerTab() : null}

          <AssemblingPanel
            className="command-room__drawer command-lab__drawer border border-cyan-200/15 bg-black/50 p-4"
            delay="medium"
          >
            <div className="command-room__drawer-content command-lab__drawer-content" id={drawerContentId}>
              <div className="command-room__drawer-groups">
                <section className="command-room__drawer-group">
                  <div className="command-lab__drawer-group-header">
                    <div className="command-room__drawer-label">Build Index</div>
                    {isDesktop ? (
                      <button
                        aria-pressed={drawerPinned}
                        className="command-lab__drawer-persist"
                        onClick={toggleDrawerPinned}
                        type="button"
                      >
                        <span>{drawerPinned ? "Docked" : "Dock Web"}</span>
                      </button>
                    ) : null}
                  </div>
                  <div className="command-lab__drawer-button-stack">
                    <div className="command-room__drawer-button-grid command-lab__drawer-button-grid">
                      {primaryEntries.map(renderBuildButton)}
                    </div>

                    <div className="command-room__drawer-button-grid command-lab__drawer-button-grid command-lab__drawer-button-grid--secondary">
                      {secondaryEntries.map(renderBuildButton)}
                    </div>

                    {futureEntries.length > 0 ? (
                      <div className="command-lab__drawer-button-grid command-lab__drawer-button-grid--future-row">
                        {futureEntries.map((entry) => renderBuildButton(entry, 0))}
                      </div>
                    ) : null}
                  </div>
                </section>

              </div>

              <nav aria-label="Engine lab navigation" className="command-room__drawer-actions command-lab__drawer-actions">
                <Link href="/" className="chamfer-nav-link chamfer-nav-link--compact">
                  Home
                </Link>
                <Link href="/vanguard" className="chamfer-nav-link chamfer-nav-link--compact">
                  Vanguard
                </Link>
                <Link href="/whitepaper" className="chamfer-nav-link chamfer-nav-link--compact">
                  Whitepaper
                </Link>
                <Link href="/developer" className="chamfer-nav-link chamfer-nav-link--compact">
                  Developer
                </Link>
                <Link
                  href="/portal"
                  className="chamfer-nav-link chamfer-nav-link--compact command-room__drawer-action--primary"
                >
                  Portal
                </Link>
                <SoundToggle enabled={soundEnabled} onToggle={handleSoundToggle} />
              </nav>

              <div className="command-lab__lamp-grid command-lab__lamp-grid--drawer">
                {systemLamps.map((lamp, index) => (
                  <div
                    className={`command-lamp-row ${index === systemLamps.length - 1 ? "command-lamp-row--wide" : ""}`}
                    key={lamp}
                  >
                    <span>{lamp}</span>
                    <span className={index < 3 ? "command-lamp command-lamp--active" : "command-lamp"} />
                  </div>
                ))}
              </div>
            </div>
          </AssemblingPanel>
        </div>
      </section>
    </div>
  );
}
