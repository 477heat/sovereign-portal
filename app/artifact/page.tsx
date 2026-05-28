"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import TunnelBackdrop from "@/components/TunnelBackdrop";

const limitedStats = ["Pulse", "Vector", "Signal", "Gravity"];
const leftGlyphs = ["Moon", "Wheel", "Compass", "Tide", "Horn", "Star"];
const rightGlyphs = ["Cloud", "Flame", "Sail", "Drop", "Crown", "Ram"];
const archetypes = [
  "Quiet Cartographer",
  "Static Oracle",
  "Liminal Broker",
  "Circuit Pilgrim",
  "Bright Witness",
  "Threshold Keeper",
];
const synergy = [
  "Soft Mirror",
  "Blue Current",
  "Veiled Relay",
  "North Gate",
  "Low Orbit",
  "Split Signal",
];

function numberFromDob(dob: string) {
  return dob
    .replace(/\D/g, "")
    .split("")
    .reduce((total, digit, index) => total + Number(digit) * (index + 3), 0);
}

function buildPreview(dob: string) {
  if (!dob) {
    return null;
  }

  const seed = numberFromDob(dob);

  return {
    archetype: archetypes[seed % archetypes.length],
    synergy: synergy[(seed + 2) % synergy.length],
    resonance: 38 + (seed % 41),
    stats: limitedStats.map((stat, index) => ({
      stat,
      value: 28 + ((seed * (index + 5)) % 63),
    })),
  };
}

export default function ArtifactPage() {
  const [dob, setDob] = useState("");
  const [mark, setMark] = useState("");
  const preview = useMemo(() => buildPreview(dob), [dob]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <TunnelBackdrop />

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 md:px-8">
        <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-200/15 bg-black/80 px-4 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl md:text-sm">
          <Link href="/" className="chamfer-nav-link chamfer-nav-link--compact">
            Return Home
          </Link>
          <Link href="/portal" className="chamfer-nav-link chamfer-nav-link--compact">
            Mainnet Portal
          </Link>
          <Link href="/engine" className="chamfer-nav-link chamfer-nav-link--compact">
            Artifact Engine
          </Link>
        </nav>

        <section className="grid flex-1 items-center gap-6 py-8 2xl:grid-cols-[250px_minmax(0,1fr)_250px]">
          <aside className="hidden border border-cyan-200/25 bg-black/45 p-4 2xl:block">
            <div className="space-y-4">
              {leftGlyphs.map((glyph) => (
                <div
                  key={glyph}
                  className="flex h-16 items-center justify-center border border-cyan-200/25 text-[10px] uppercase tracking-[0.24em] text-cyan-100/70"
                >
                  {glyph}
                </div>
              ))}
            </div>
          </aside>

          <section className="relative overflow-hidden border border-cyan-200/30 bg-black/60 shadow-[0_0_90px_rgba(80,190,255,0.18)]">
            <div className="engine-screen-grid absolute inset-0 opacity-65" aria-hidden="true" />
            <div className="relative z-10 grid min-h-[680px] gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_330px] md:p-8">
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.38em] text-cyan-100/80">
                    Sovereign Artifact
                  </p>
                  <h1 className="mt-4 max-w-2xl text-4xl font-light uppercase tracking-[0.12em] md:text-5xl">
                    Limited Engine Preview
                  </h1>
                  <p className="mt-5 max-w-xl text-sm leading-7 text-white/62">
                    Enter a birth date to generate an alternate public-facing
                    readout. This preview is intentionally limited and is not
                    the Soul Contract stat table.
                  </p>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-[10px] uppercase tracking-[0.26em] text-cyan-100/65">
                      Date of Birth
                    </span>
                    <input
                      value={dob}
                      onChange={(event) => setDob(event.target.value)}
                      inputMode="numeric"
                      placeholder="1980-01-10"
                      className="w-full border border-cyan-200/25 bg-black/75 px-4 py-3 text-sm text-white outline-none focus:border-cyan-100"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[10px] uppercase tracking-[0.26em] text-cyan-100/65">
                      Optional Mark
                    </span>
                    <input
                      value={mark}
                      onChange={(event) => setMark(event.target.value)}
                      maxLength={12}
                      placeholder="J. Mcc"
                      className="w-full border border-cyan-200/25 bg-black/75 px-4 py-3 text-sm text-white outline-none focus:border-cyan-100"
                    />
                  </label>
                </div>
              </div>

              <aside className="border border-yellow-200/35 bg-black/72 p-5">
                <div className="text-[10px] uppercase tracking-[0.3em] text-yellow-100/70">
                  Preview Card
                </div>
                <div className="mt-5 border border-yellow-200/25 p-4">
                  <div className="text-[10px] uppercase tracking-[0.26em] text-white/45">
                    Covenant Mark
                  </div>
                  <div className="mt-2 text-2xl uppercase tracking-[0.18em] text-yellow-100">
                    {mark || "--"}
                  </div>
                </div>

                <div className="mt-5">
                  <div className="text-[10px] uppercase tracking-[0.26em] text-white/45">
                    Archetype
                  </div>
                  <div className="mt-2 text-xl uppercase tracking-[0.12em] text-white">
                    {preview?.archetype ?? "Awaiting Date"}
                  </div>
                </div>

                <div className="mt-5">
                  <div className="text-[10px] uppercase tracking-[0.26em] text-white/45">
                    Synergy Matrix
                  </div>
                  <div className="mt-2 border border-fuchsia-200/35 bg-fuchsia-300/10 p-3 text-sm uppercase tracking-[0.14em] text-fuchsia-100">
                    {preview?.synergy ?? "Dormant"}
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {(preview?.stats ?? limitedStats.map((stat) => ({ stat, value: 0 }))).map(
                    (item) => (
                      <div key={item.stat}>
                        <div className="mb-1 flex justify-between text-[10px] uppercase tracking-[0.2em] text-white/55">
                          <span>{item.stat}</span>
                          <span>{item.value || "--"}</span>
                        </div>
                        <div className="h-2 border border-yellow-100/25 bg-black">
                          <div
                            className="h-full bg-yellow-100"
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>

                <div className="mt-5 border-t border-white/10 pt-4 text-xs leading-6 text-white/50">
                  The full mint uses the protected Genesis Engine output,
                  encrypted hash, deed image, and metadata pipeline.
                </div>
              </aside>
            </div>
          </section>

          <aside className="hidden border border-fuchsia-200/25 bg-black/45 p-4 2xl:block">
            <div className="space-y-4">
              {rightGlyphs.map((glyph) => (
                <div
                  key={glyph}
                  className="flex h-16 items-center justify-center border border-fuchsia-200/25 text-[10px] uppercase tracking-[0.24em] text-fuchsia-100/70"
                >
                  {glyph}
                </div>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
