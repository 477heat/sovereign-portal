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

const moduleViews = [
  {
    id: "core",
    label: "Engine Core",
    shortLabel: "Engine",
    status: "Synchronized",
    heading: "Command Deck",
    body: "Genesis access, public readouts, lineage policy, and developer ports are staged as separate Engine rooms inside one interface.",
    metrics: ["01 origin layer", "06 public rooms", "19 active rails"],
  },
  {
    id: "vanguard",
    label: "Vanguard Layer",
    shortLabel: "Vanguard",
    status: "Legacy Class",
    heading: "Initial Supporter Array",
    body: "Wallet-linked status, early access, future Progeny benefits, and launch day privileges are grouped as the charter module.",
    metrics: ["01 access class", "04 policy nodes", "carry-forward"],
  },
  {
    id: "access",
    label: "Access Economy",
    shortLabel: "Access",
    status: "Routing Ready",
    heading: "Progeny Routing Console",
    body: "Genesis remains the origin layer. Future project assets can inherit profile qualities through deliberate public rules.",
    metrics: ["traceable assets", "approved routes", "market limits"],
  },
  {
    id: "developer",
    label: "Developer Port",
    shortLabel: "Developer",
    status: "Reserved",
    heading: "Builder Interface",
    body: "Future builders can choose attribute trees, supply rules, and project-specific access structures without redefining Engine truth.",
    metrics: ["attribute trees", "project terms", "read-only bridge"],
  },
] as const;

const systemLamps = ["Public UI", "Motion Core", "Audio Bus", "3D Reserve", "Portal Lock"] as const;

type ModuleId = (typeof moduleViews)[number]["id"];

export function CommandDeckLab() {
  const [activeModuleId, setActiveModuleId] = useState<ModuleId>("core");
  const { playBleep, soundEnabled, toggleSound } = useBleeps();
  const activeModule = useMemo(
    () => moduleViews.find((moduleView) => moduleView.id === activeModuleId) ?? moduleViews[0],
    [activeModuleId],
  );

  function selectModule(moduleId: ModuleId) {
    setActiveModuleId(moduleId);
    playBleep("select");
  }

  function handleSoundToggle() {
    toggleSound();
    playBleep("confirm");
  }

  return (
    <div className="command-lab relative z-10 mx-auto flex min-h-screen max-w-[96rem] flex-col px-4 py-5 md:px-8">
      <section className="command-lab__grid grid flex-1 gap-5 py-5">
        <AssemblingPanel className="command-lab__module-rail border border-cyan-200/15 bg-black/50 p-4" title="Module Rail">
          <div className="command-lab__module-buttons grid gap-2">
            {moduleViews.map((moduleView, index) => (
              <HudButton
                active={activeModule.id === moduleView.id}
                className={index % 2 === 0 ? "command-hud-button--rail-left" : "command-hud-button--rail-right"}
                hideLamp
                key={moduleView.id}
                onClick={() => selectModule(moduleView.id)}
                tone={moduleView.id === "access" ? "gold" : "cyan"}
              >
                {moduleView.shortLabel}
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
                <span className={index < 2 ? "command-lamp command-lamp--active" : "command-lamp"} />
              </div>
            ))}
          </div>
          <nav aria-label="Engine lab navigation" className="command-lab__rail-nav">
            <Link href="/" className="chamfer-nav-link chamfer-nav-link--compact">
              Home
            </Link>
            <Link href="/engine" className="chamfer-nav-link chamfer-nav-link--compact">
              Engine
            </Link>
            <Link href="/portal" className="chamfer-nav-link chamfer-nav-link--compact">
              Portal
            </Link>
          </nav>
        </AssemblingPanel>

        <AnimatedFrame className="command-lab__viewscreen min-h-[34rem]" label={activeModule.status}>
          <MovingLines />
          <PuffField />
          <div className="engine-screen-grid absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="engine-sweep absolute inset-x-0 top-0 h-28" aria-hidden="true" />
          <div className="command-lab__core-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="relative z-10 grid min-h-[30rem] content-between gap-8 p-5 md:p-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-yellow-100/72">
                {activeModule.label}
              </p>
              <h1 className="command-lab__headline mt-4 max-w-3xl text-3xl uppercase leading-tight text-cyan-50 md:text-5xl">
                {activeModule.heading}
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-cyan-50/72 md:text-base">
                {activeModule.body}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {activeModule.metrics.map((metric) => (
                <div className="command-readout-tile" key={metric}>
                  <span>Readout</span>
                  <strong>{metric}</strong>
                </div>
              ))}
            </div>
          </div>
        </AnimatedFrame>

        <AssemblingPanel className="command-lab__diagnostics border border-white/10 bg-black/50 p-4" delay="medium" title="Diagnostics">
          <div className="command-lab__diagnostic-grid">
            <div className="command-diagnostic-card">
              <span>Frame Assembly</span>
              <strong>CSS / SVG</strong>
            </div>
            <div className="command-diagnostic-card">
              <span>Motion Budget</span>
              <strong>Transform + Opacity</strong>
            </div>
            <div className="command-diagnostic-card">
              <span>Reduced Motion</span>
              <strong>Supported</strong>
            </div>
            <SoundToggle enabled={soundEnabled} onToggle={handleSoundToggle} />
          </div>
        </AssemblingPanel>
      </section>
    </div>
  );
}
