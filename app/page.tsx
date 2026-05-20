"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import TunnelBackdrop from "@/components/TunnelBackdrop";

const launchDate = new Date("2026-05-25T00:00:00");

const protocolCards = [
  {
    label: "Attestation",
    title: "One Human, One Mint",
    body: "Coinbase verification gates the mainnet mint path before the deed is generated.",
  },
  {
    label: "Inscription",
    title: "Name Reduced To Mark",
    body: "The public deed displays a shortened covenant mark while private inputs are used for generation.",
  },
  {
    label: "Artifact",
    title: "Preview The Engine",
    body: "Visitors can test a limited alternate readout before committing to the full Soul Contract.",
  },
];

function getTimeLeft() {
  const difference = launchDate.getTime() - Date.now();

  if (difference <= 0) {
    return "00d 00h 00m 00s";
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export default function HomePage() {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft());

  useEffect(() => {
    const interval = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <TunnelBackdrop />

      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-5 py-8 md:px-8 lg:grid-cols-[minmax(0,1fr)_430px]">
        <div>
          <nav className="mb-14 flex flex-wrap gap-4 border-b border-white/10 pb-5 text-[10px] uppercase tracking-[0.28em] text-white/45">
            <Link href="/portal" className="transition hover:text-white">
              Portal
            </Link>
            <Link href="/artifact" className="transition hover:text-white">
              Artifact Tester
            </Link>
            <Link href="/vanguard" className="transition hover:text-white">
              Vanguard
            </Link>
            <Link href="/economics" className="transition hover:text-white">
              Economics
            </Link>
            <Link href="/whitepaper" className="transition hover:text-white">
              Whitepaper
            </Link>
          </nav>

          <p className="mb-5 text-[11px] uppercase tracking-[0.38em] text-cyan-200/80">
            Registry Initializing
          </p>
          <h1 className="max-w-4xl text-5xl font-light uppercase leading-[0.98] tracking-[0.12em] md:text-7xl">
            Sovereign Engine
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-white/62">
            A verified human mint path for deeded identity artifacts, encrypted
            birth marks, and tokenized covenant records on Base mainnet.
          </p>

          <div className="mt-8 inline-flex border border-cyan-200/30 bg-cyan-200/10 px-5 py-4 text-sm uppercase tracking-[0.22em] text-cyan-100">
            T-minus {timeLeft}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/portal"
              className="border border-yellow-200/70 bg-yellow-200 px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-yellow-100"
            >
              Enter Portal
            </Link>
            <Link
              href="/artifact"
              className="border border-cyan-200/35 bg-cyan-200/10 px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-100 transition hover:bg-cyan-200 hover:text-black"
            >
              Test Artifact
            </Link>
          </div>
        </div>

        <aside className="border border-white/12 bg-black/58 p-4 shadow-[0_0_80px_rgba(81,197,255,0.14)]">
          <div className="relative aspect-[4/5] overflow-hidden border border-cyan-200/20 bg-black">
            <Image
              src="/Satoshi_Nakamoto.png"
              alt="Genesis deed preview"
              fill
              sizes="(max-width: 1024px) 100vw, 430px"
              className="object-contain opacity-85"
              priority
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] uppercase tracking-[0.2em] text-white/48">
            <span className="border border-white/10 py-2">Base</span>
            <span className="border border-white/10 py-2">EAS</span>
            <span className="border border-white/10 py-2">ERC-721</span>
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {protocolCards.map((card) => (
            <article key={card.title} className="border border-white/10 bg-black/55 p-5">
              <div className="text-[10px] uppercase tracking-[0.3em] text-cyan-200/60">
                {card.label}
              </div>
              <h2 className="mt-4 text-lg uppercase tracking-[0.14em] text-white">
                {card.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/55">{card.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
