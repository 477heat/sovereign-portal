"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatedFrame } from "./AnimatedFrame";
import { AssemblingPanel } from "./AssemblingPanel";
import { HudButton } from "./HudButton";
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
      "The current Sovereign Engine mint path. A verified wallet enters the Portal, clears EAS, runs through the Engine, and receives a Base-native Soul Deed with public derived metadata.",
    nextStep:
      "Keep real mints controlled. Confirm wording, image, metadata, and payment state before every live test.",
    systems: ["Portal", "EAS", "Engine", "Pinata", "Base"],
    checkpoints: ["Live route", "Metadata active", "Receipt recovery"],
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

function hudTone(tone: LabStatusTone) {
  if (tone === "live") return "cyan";
  if (tone === "future") return "red";
  return tone === "design" ? "gold" : "cyan";
}

export function CommandDeckLab() {
  const [activeEntryId, setActiveEntryId] = useState<LabEntryId>("genesis-access");
  const { playBleep, soundEnabled, toggleSound } = useBleeps();
  const activeEntry = useMemo(
    () => labEntries.find((entry) => entry.id === activeEntryId) ?? labEntries[0],
    [activeEntryId],
  );

  function selectEntry(entryId: LabEntryId) {
    setActiveEntryId(entryId);
    playBleep("select");
  }

  function handleSoundToggle() {
    toggleSound();
    playBleep("confirm");
  }

  return (
    <div className="command-lab relative z-10 mx-auto flex min-h-screen max-w-[96rem] flex-col px-4 py-5 md:px-8">
      <section className="command-lab__grid grid flex-1 gap-5 py-5">
        <AssemblingPanel
          className="command-lab__module-rail border border-cyan-200/15 bg-black/50 p-4"
          title="Lab Table"
        >
          <div className="command-lab__module-buttons command-lab__module-buttons--table grid gap-2">
            {labEntries.map((entry, index) => (
              <HudButton
                active={activeEntry.id === entry.id}
                className={index % 2 === 0 ? "command-hud-button--rail-left" : "command-hud-button--rail-right"}
                hideLamp
                key={entry.id}
                onClick={() => selectEntry(entry.id)}
                tone={hudTone(entry.tone)}
              >
                <span>{entry.shortLabel}</span>
                <small>{statusToneLabel(entry.tone)}</small>
              </HudButton>
            ))}
          </div>

          <div className="command-lab__lamp-grid mt-5">
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

          <nav aria-label="Engine lab navigation" className="command-lab__rail-nav">
            <Link href="/" className="chamfer-nav-link chamfer-nav-link--compact">
              Home
            </Link>
            <Link href="/vanguard" className="chamfer-nav-link chamfer-nav-link--compact">
              Vanguard
            </Link>
            <Link href="/portal" className="chamfer-nav-link chamfer-nav-link--compact">
              Portal
            </Link>
          </nav>
        </AssemblingPanel>

        <AnimatedFrame className="command-lab__viewscreen command-lab__viewscreen--table min-h-[38rem]" label={activeEntry.status}>
          <MovingLines />
          <PuffField />
          <div className="engine-screen-grid absolute inset-0 opacity-36" aria-hidden="true" />
          <div className="engine-sweep absolute inset-x-0 top-0 h-28" aria-hidden="true" />
          <div className="command-lab__table-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="command-lab__table-screen relative z-10 grid min-h-[34rem] content-between gap-7 p-5 md:p-8">
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

            <div className="command-lab__system-strip">
              {activeEntry.systems.map((system) => (
                <div className="command-readout-tile command-readout-tile--system" key={system}>
                  <span>System</span>
                  <strong>{system}</strong>
                </div>
              ))}
            </div>
          </div>
        </AnimatedFrame>

        <AssemblingPanel
          className="command-lab__diagnostics command-lab__diagnostics--table border border-white/10 bg-black/50 p-4"
          delay="medium"
          title="Build Index"
        >
          <div className="command-lab__stage-list">
            {labEntries.map((entry) => (
              <button
                className={`command-lab__stage-row ${
                  activeEntry.id === entry.id ? "command-lab__stage-row--active" : ""
                } command-lab__stage-row--${entry.tone}`}
                key={`${entry.id}-stage`}
                onClick={() => selectEntry(entry.id)}
                type="button"
              >
                <span>{entry.shortLabel}</span>
                <strong>{entry.status}</strong>
              </button>
            ))}
          </div>

          <div className="command-lab__checkpoint-panel">
            <span>Selected Checkpoints</span>
            <ul>
              {activeEntry.checkpoints.map((checkpoint) => (
                <li key={checkpoint}>{checkpoint}</li>
              ))}
            </ul>
          </div>

          <SoundToggle enabled={soundEnabled} onToggle={handleSoundToggle} />
        </AssemblingPanel>
      </section>
    </div>
  );
}
