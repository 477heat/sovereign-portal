"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BackgroundHashStream } from "@/components/DATA_STREAM";
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
    label: "Engine",
    title: "Open The Console",
    body: "Visitors can query alternate stat readouts before the profile system expands into live chart memory.",
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
  const [timeLeft, setTimeLeft] = useState("calculating");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setTimeLeft(getTimeLeft()));
    const interval = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-black text-white">
      <TunnelBackdrop />
      <BackgroundHashStream className="z-0" />

      <section className="relative z-10 mx-auto grid min-h-[calc(100svh-3rem)] max-w-7xl items-center gap-10 px-5 py-8 md:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)]">
        <div className="relative z-10">
          <nav className="mb-10 flex flex-wrap gap-4 border-b border-white/10 pb-5 text-[10px] uppercase tracking-[0.28em] text-white/45 md:mb-14">
            <Link href="/portal" className="transition hover:text-white">
              Portal
            </Link>
            <Link href="/engine" className="transition hover:text-white">
              Engine Console
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

          <div className="mb-7 flex h-14 w-14 items-center justify-center border border-cyan-200/20 bg-black/55 shadow-[0_0_34px_rgba(70,210,220,0.18)]">
            <Image
              src="/brand/sovengine-header.png"
              alt=""
              width={96}
              height={96}
              className="h-11 w-11 object-contain"
              priority
            />
          </div>
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

          <div className="mt-9 grid max-w-2xl gap-4">
            <div className="inline-flex min-h-14 w-fit items-center border border-cyan-200/30 bg-cyan-200/10 px-5 text-sm uppercase tracking-[0.22em] text-cyan-100">
              T-minus {timeLeft}
            </div>

            <div className="grid max-w-xl gap-3 sm:grid-cols-2">
              <Link
                href="/portal"
                className="flex min-h-16 items-center justify-center border border-yellow-200/70 bg-yellow-200 px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-yellow-100"
              >
                Enter Portal
              </Link>
              <Link
                href="/engine"
                className="flex min-h-16 items-center justify-center border border-cyan-200/35 bg-cyan-200/10 px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.24em] text-cyan-100 transition hover:bg-cyan-200 hover:text-black"
              >
                Trial Engine
              </Link>
            </div>
          </div>
        </div>

        <aside className="relative z-10 hidden items-center justify-center lg:flex">
          <div className="relative aspect-square w-full max-w-[27rem]">
            <div className="absolute inset-8 rounded-full border border-cyan-200/12 shadow-[0_0_120px_rgba(70,210,220,0.16)]" />
            <div className="absolute inset-0 rounded-full border border-white/8 bg-cyan-200/5 blur-3xl" />
            <Image
              src="/brand/sovengine-hero.png"
              alt="Sovereign Engine logo"
              width={640}
              height={640}
              className="relative z-10 h-full w-full object-contain drop-shadow-[0_0_42px_rgba(126,228,255,0.22)]"
              priority
            />
          </div>
        </aside>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-20 md:px-8">
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
