"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BackgroundHashStream } from "@/components/DATA_STREAM";
import TunnelBackdrop from "@/components/TunnelBackdrop";
import {
  buildEngineProfile,
  buildReadouts,
  type EngineReadout,
  type EngineStat,
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

const toneClass = {
  cyan: {
    border: "border-cyan-200/35",
    wash: "bg-cyan-200/10",
    text: "text-cyan-100",
    bar: "bg-cyan-100",
    glow: "shadow-[0_0_70px_rgba(72,220,255,0.18)]",
  },
  amber: {
    border: "border-amber-200/35",
    wash: "bg-amber-200/10",
    text: "text-amber-100",
    bar: "bg-amber-100",
    glow: "shadow-[0_0_70px_rgba(255,207,99,0.16)]",
  },
  rose: {
    border: "border-rose-200/35",
    wash: "bg-rose-200/10",
    text: "text-rose-100",
    bar: "bg-rose-100",
    glow: "shadow-[0_0_70px_rgba(255,138,190,0.15)]",
  },
  lime: {
    border: "border-lime-200/35",
    wash: "bg-lime-200/10",
    text: "text-lime-100",
    bar: "bg-lime-100",
    glow: "shadow-[0_0_70px_rgba(191,255,102,0.14)]",
  },
  violet: {
    border: "border-violet-200/35",
    wash: "bg-violet-200/10",
    text: "text-violet-100",
    bar: "bg-violet-100",
    glow: "shadow-[0_0_70px_rgba(190,146,255,0.16)]",
  },
} as const;

function StatTrace({ stat, tone }: { stat: EngineStat; tone: EngineReadout["tone"] }) {
  const colors = toneClass[tone as keyof typeof toneClass];
  const barWidth = stat.value <= 20 ? stat.value * 5 : Math.min(stat.value, 100);

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.22em] text-white/58">
        <span>{stat.label}</span>
        <span className={colors.text}>{stat.value}</span>
      </div>
      <div className="h-2 border border-white/10 bg-black/80">
        <div className={`h-full ${colors.bar}`} style={{ width: `${barWidth}%` }} />
      </div>
    </div>
  );
}

function Viewscreen({ readout }: { readout: EngineReadout }) {
  const colors = toneClass[readout.tone as keyof typeof toneClass];

  return (
    <section className={`relative overflow-hidden border bg-black/70 p-4 ${colors.border} ${colors.glow} md:p-6`}>
      <div className="engine-screen-grid absolute inset-0 opacity-55" aria-hidden="true" />
      <div className="engine-sweep absolute inset-x-0 top-0 h-28" aria-hidden="true" />

      <div className="relative z-10 grid min-h-[36rem] gap-5 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="flex min-w-0 flex-col">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className={`text-[10px] uppercase tracking-[0.34em] ${colors.text}`}>
                {readout.eyebrow}
              </div>
              <h1 className="mt-4 max-w-3xl text-3xl font-light uppercase leading-tight tracking-[0.12em] md:text-5xl">
                {readout.title}
              </h1>
            </div>
            <div className={`min-w-32 border p-3 text-right ${colors.border} ${colors.wash}`}>
              <div className="text-[10px] uppercase tracking-[0.24em] text-white/45">
                {readout.primaryLabel}
              </div>
              <div className={`mt-2 text-3xl ${colors.text}`}>{readout.primaryValue}</div>
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/62">{readout.summary}</p>

          <div className="mt-6 grid flex-1 gap-4 md:grid-cols-2">
            {readout.stats.map((stat) => (
              <StatTrace key={stat.label} stat={stat} tone={readout.tone} />
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-4 border border-white/10 bg-black/55 p-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/42">
              Diagnostics
            </div>
            <div className="mt-4 space-y-3">
              {readout.diagnostics.map((item) => (
                <div key={item} className="border border-white/10 bg-white/[0.03] px-3 py-3 text-xs uppercase tracking-[0.18em] text-white/62">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto border border-white/10 p-4">
            <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.24em] text-white/42">
              <span>Signal Path</span>
              <span className={colors.text}>Open</span>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }).map((_, index) => (
                <span
                  key={index}
                  className={`h-7 border ${index < 7 ? `${colors.border} ${colors.wash}` : "border-white/10 bg-white/[0.02]"}`}
                />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default function EnginePage() {
  const [dob, setDob] = useState("");
  const [mark, setMark] = useState("");
  const [mode, setMode] = useState<ReadoutMode>("sovereign");
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const profile = useMemo(() => buildEngineProfile(dob, mark), [dob, mark]);
  const readouts = useMemo(() => buildReadouts(profile), [profile]);
  const activeReadout = readouts.find((readout) => readout.id === mode) ?? readouts[0];

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const params = new URLSearchParams(window.location.search);
      setDob(params.get("dob") ?? "");
      setMark(params.get("mark") ?? "");
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  async function copyShareLink() {
    const params = new URLSearchParams();

    if (dob) params.set("dob", dob);
    if (mark) params.set("mark", mark);

    const nextUrl = `${window.location.origin}/engine${params.size ? `?${params}` : ""}`;
    await navigator.clipboard.writeText(nextUrl);
    setShareState("copied");
    window.setTimeout(() => setShareState("idle"), 1800);
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-black text-white">
      <TunnelBackdrop />
      <BackgroundHashStream className="z-0" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[96rem] flex-col px-4 py-5 md:px-8">
        <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 text-[10px] uppercase tracking-[0.3em] text-white/45">
          <div className="flex flex-wrap gap-4">
            <Link href="/" className="transition hover:text-white">
              Return Home
            </Link>
            <Link href="/portal" className="transition hover:text-white">
              Mint Portal
            </Link>
          </div>
          <span className="text-cyan-100/72">Engine Instance 01</span>
        </nav>

        <section className="grid flex-1 gap-5 py-6 xl:grid-cols-[280px_minmax(0,1fr)_270px]">
          <aside className="grid content-start gap-4 border border-white/10 bg-black/58 p-4 backdrop-blur-[2px]">
            <div>
              <div className="text-[10px] uppercase tracking-[0.34em] text-cyan-100/65">
                Profile Seed
              </div>
              <h2 className="mt-4 text-2xl uppercase tracking-[0.14em] text-white">
                Console Intake
              </h2>
            </div>

            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-white/45">
                Date Of Birth
              </span>
              <input
                value={dob}
                onChange={(event) => setDob(event.target.value)}
                type="date"
                className="min-h-12 w-full border border-cyan-100/20 bg-black/80 px-3 text-sm text-white outline-none transition focus:border-cyan-100/65"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-white/45">
                Public Mark
              </span>
              <input
                value={mark}
                onChange={(event) => setMark(event.target.value)}
                maxLength={18}
                placeholder="A. Sol"
                className="min-h-12 w-full border border-cyan-100/20 bg-black/80 px-3 text-sm text-white outline-none transition focus:border-cyan-100/65"
              />
            </label>

            <div className="grid gap-2">
              {readouts.map((readout) => (
                <button
                  key={readout.id}
                  onClick={() => setMode(readout.id)}
                  className={`min-h-12 border px-3 text-left text-[11px] uppercase tracking-[0.22em] transition ${
                    mode === readout.id
                      ? "border-cyan-100/55 bg-cyan-100/15 text-cyan-50"
                      : "border-white/10 bg-white/[0.03] text-white/52 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {readout.label}
                </button>
              ))}
            </div>

            <button
              onClick={copyShareLink}
              className="min-h-12 border border-yellow-100/45 bg-yellow-100 px-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-yellow-50"
            >
              {shareState === "copied" ? "Link Copied" : "Copy Preview Link"}
            </button>
          </aside>

          <div className="grid gap-5">
            <Viewscreen readout={activeReadout} />

            <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="border border-white/10 bg-black/58 p-4 md:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-white/42">
                    Readout Bus
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.24em] text-yellow-100/72">
                    {profile.shareCode}
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {telemetry.map((item, index) => (
                    <div key={item} className="border border-white/10 bg-white/[0.03] p-3">
                      <div className="text-[10px] uppercase tracking-[0.24em] text-white/35">
                        Lane 0{index + 1}
                      </div>
                      <div className="mt-3 text-xs uppercase tracking-[0.16em] text-white/68">
                        {item}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-white/10 bg-black/58 p-4 md:p-5">
                <div className="text-[10px] uppercase tracking-[0.3em] text-white/42">
                  Stored Shape
                </div>
                <div className="mt-4 grid gap-3 text-sm">
                  <div className="border border-white/10 bg-white/[0.03] p-3">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-white/38">
                      Public Mark
                    </div>
                    <div className="mt-2 uppercase tracking-[0.14em] text-cyan-50">
                      {profile.mark}
                    </div>
                  </div>
                  <div className="border border-white/10 bg-white/[0.03] p-3">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-white/38">
                      Future Profile
                    </div>
                    <div className="mt-2 leading-6 text-white/62">
                      Chart memory, daily sky overlays, and saved dossiers attach here.
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="grid content-start gap-4 border border-white/10 bg-black/58 p-4 backdrop-blur-[2px]">
            <div className="border border-cyan-100/20 bg-cyan-100/[0.07] p-4">
              <div className="text-[10px] uppercase tracking-[0.3em] text-cyan-100/65">
                Viewscreen Subject
              </div>
              <div className="mt-4 text-2xl uppercase tracking-[0.16em] text-white">
                {profile.mark}
              </div>
              <div className="mt-3 text-sm uppercase tracking-[0.18em] text-white/52">
                {profile.alignment}
              </div>
            </div>

            <div className="grid gap-2">
              {consoleLamps.map((lamp, index) => (
                <div key={lamp} className="flex min-h-12 items-center justify-between gap-3 border border-white/10 bg-white/[0.03] px-3">
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

            <div className="border border-white/10 p-4">
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/42">
                Long Arc
              </div>
              <p className="mt-4 text-sm leading-7 text-white/58">
                This instance starts as a public scan console and becomes the profile deck
                for saved charts, live sky motion, and shareable signal maps.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
