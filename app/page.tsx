"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const dayOneLaunchAt = Date.UTC(2026, 4, 29, 12, 0, 0);

const protocolCards = [
  {
    label: "Wallet-linked",
    title: "Day One",
    body: "Day One wallets become Vanguards, carrying early status into future creations and projects.",
    href: "/vanguard",
    destination: "Vanguard status",
  },
  {
    label: "Base-native",
    title: "Artifact on Base",
    body: "Create the Genesis artifact that anchors your deterministic profile on Base.",
    href: "/portal",
    destination: "Soul Registry Portal",
  },
  {
    label: "Progeny",
    title: "The Future",
    body: "Your Genesis profile branches into children, items, creatures, transport, and project-specific attribute trees.",
    href: "/economics",
    destination: "Access and Progeny",
  },
];

const navLinks = [
  ["Portal", "/portal"],
  ["ARTIFACTS", "/engine"],
  ["Vanguard", "/vanguard"],
  ["Access", "/economics"],
  ["Litepaper", "/whitepaper"],
] as const;

const whyThisMatters = [
  {
    body: "The Deed is your Genesis Character. It contains stats that remain with your profile whether you sell it or give it away.",
    href: "/whitepaper",
    featured: false,
  },
  {
    body: "Vanguards retain a special status that carries on through legacy creations and projects.",
    href: "/vanguard",
    featured: false,
  },
  {
    body: "Your Progeny (children) are embedded with your qualities and characteristics, so each child can be traced back to its parents.",
    href: "/economics",
    featured: false,
  },
  {
    body: "Material items are also Progeny: clothing, armor, weapons, creatures, adversarial constructs, modes of transport, and more.",
    href: "/engine",
    featured: false,
  },
  {
    body: "The Engine has a very distinct algorithm that can attribute 479,001,600 possibilities completely unique to you for each Progeny Project.",
    href: "/engine",
    featured: true,
  },
] as const;

function getCountdownParts(milliseconds: number | null) {
  if (milliseconds === null) {
    return [
      ["--", "days"],
      ["--", "hrs"],
      ["--", "min"],
      ["--", "sec"],
    ] as const;
  }

  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    [String(days).padStart(2, "0"), "days"],
    [String(hours).padStart(2, "0"), "hrs"],
    [String(minutes).padStart(2, "0"), "min"],
    [String(seconds).padStart(2, "0"), "sec"],
  ] as const;
}

export default function HomePage() {
  const [dayOneRemaining, setDayOneRemaining] = useState<number | null>(null);
  const dayOneCountdown = getCountdownParts(dayOneRemaining);

  useEffect(() => {
    const updateCountdown = () => {
      setDayOneRemaining(Math.max(0, dayOneLaunchAt - Date.now()));
    };

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-black text-white">
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-cyan-200/15 bg-black/85 shadow-[0_18px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-3 md:px-8">
          <Link
            aria-current="page"
            className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100"
            href="/"
          >
            <Image
              src="/brand/sovereign-engine-site-logo-512.png"
              alt=""
              width={36}
              height={36}
              className="h-7 w-7 object-contain"
              priority
            />
            <span>Sovereign Engine</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/72 md:gap-3 md:text-sm">
            {navLinks.map(([label, href]) => (
              <Link
                className="chamfer-nav-link"
                href={href}
                key={href}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[68vh] max-w-7xl items-start gap-6 overflow-hidden px-5 pb-6 pt-24 md:px-8 md:pb-8 md:pt-28 lg:grid-cols-[minmax(0,1fr)_minmax(110px,0.18fr)_minmax(140px,0.24fr)_minmax(170px,0.32fr)_minmax(210px,0.4fr)]">
        <video
          autoPlay
          muted
          playsInline
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-100"
          src="/media/command-console.mp4"
        />
        <div className="pointer-events-none absolute inset-0 z-0 bg-black/35" />
        <div className="relative z-10">
          <div className="chamfer-panel chamfer-panel--hero-copy max-w-[30rem] px-5 py-5 md:px-7 md:py-6">
            <p className="mb-4 text-[10px] uppercase tracking-[0.32em] text-cyan-200/80">
              Registry Initializing
            </p>
            <h1 className="max-w-4xl text-2xl font-light uppercase leading-[1.08] tracking-[0.1em] md:text-4xl">
              Sovereign Engine
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/68">
              One person, one Genesis mint. No bot farms, no prize harvesting,
              no empty wallets pretending to be a community.
            </p>
          </div>

          <div className="mt-8 grid w-fit gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/portal"
                className="chamfer-hero-link chamfer-hero-link--primary"
              >
                Enter Portal
              </Link>
              <Link
                href="/engine"
                className="chamfer-hero-link chamfer-hero-link--secondary"
              >
                Artifact Engine
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                aria-label="Open Access page for Day 1 countdown details"
                className="chamfer-countdown-label-link"
                href="/economics"
              >
                <div className="text-[8px] uppercase leading-4 tracking-[0.18em] text-yellow-200/80">
                  Day 1 Countdown
                </div>
                <div className="mt-1 text-[7px] uppercase tracking-[0.12em] text-cyan-100/62">
                  29 May 2026 / 12:00 UTC
                </div>
              </Link>
              <Link
                aria-label="Open Access page for Day 1 countdown timer"
                className="chamfer-countdown-link"
                href="/economics"
              >
                <div className="grid grid-cols-4 gap-1">
                  {dayOneCountdown.map(([value, label]) => (
                    <div
                      className="chamfer-countdown-cell px-1 py-1.5 text-center backdrop-blur-sm"
                      key={label}
                    >
                      <div className="font-mono text-sm leading-none text-yellow-100">
                        {value}
                      </div>
                      <div className="mt-1 text-[6px] uppercase tracking-[0.08em] text-white/62">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="hero-clear-stage relative z-10 hidden min-h-[10rem] w-full lg:block lg:min-h-[18rem]"
        />

        <div
          aria-hidden="true"
          className="hero-clear-stage relative z-10 hidden min-h-[12rem] w-full lg:block lg:min-h-[20rem]"
        />

        <div
          aria-hidden="true"
          className="hero-clear-stage relative z-10 hidden min-h-[9rem] w-full lg:block lg:min-h-[15rem]"
        />

        <aside className="relative z-10 hidden items-center justify-center lg:flex">
          <div
            aria-hidden="true"
            className="hero-clear-stage relative aspect-square w-full max-w-[27rem]"
          />
        </aside>
      </section>

      <section className="relative z-10 mx-auto -mt-4 max-w-7xl px-5 pb-12 md:-mt-8 md:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {protocolCards.map((card) => (
            <Link
              key={card.title}
              className="chamfer-panel chamfer-panel--card chamfer-panel--interactive block p-5"
              href={card.href}
            >
              <div className="text-[10px] uppercase tracking-[0.3em] text-cyan-200/60">
                {card.label}
              </div>
              <h2 className="mt-4 text-lg uppercase tracking-[0.14em] text-white">
                {card.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/55">{card.body}</p>
              <div className="mt-4 text-[10px] uppercase tracking-[0.24em] text-cyan-200/55">
                Open {card.destination}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <div className="chamfer-panel chamfer-panel--frame p-6 backdrop-blur-md md:p-8">
          <p className="text-center text-[11px] uppercase tracking-[0.36em] text-cyan-200/70">
            THE REASONING
          </p>
          <div className="chamfer-panel chamfer-panel--readout mx-auto mt-5 max-w-2xl px-5 py-4 text-center text-xs leading-5 text-white/62">
            Developers can choose which Progeny structure they want for their
            games, request a specific Character Attribute Tree for users to
            generate a profile from, or purchase from a Vanguard&apos;s
            Collection.
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {whyThisMatters.map((item) => (
              <Link
                className={`chamfer-panel chamfer-panel--readout chamfer-panel--interactive block px-4 py-3 text-sm leading-6 text-white/68 ${item.featured ? "md:col-span-2 md:mx-auto md:max-w-2xl" : ""}`}
                href={item.href}
                key={item.body}
              >
                {item.body}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
