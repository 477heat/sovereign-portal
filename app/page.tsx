"use client";

import Image from "next/image";
import Link from "next/link";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import { GlossaryText } from "@/components/GlossaryTerm";
import type { GlossaryTermKey } from "@/lib/glossary";

const dayOneLaunchAt = Date.UTC(2026, 4, 29, 12, 0, 0);
const heroLoopEnd = 4;
const heroLinkExitStartAt = 4.58;
const heroLinkExitPlaySeconds = 1;
const heroPointerIdleMs = 420;
const homeGlossaryTerms: GlossaryTermKey[] = [
  "Artifact Engine",
  "Attribute Tree",
  "Genesis",
  "Genesis Mint",
  "Mint",
  "Progeny",
  "Vanguard",
  "Wallet",
];

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
    body: "Create the Genesis artifact on Base. Every Vanguard-created artifact keeps its origin wallet attached for royalty routing.",
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
    opposite: false,
  },
  {
    body: "Vanguards retain a special status that carries on through legacy creations and projects.",
    href: "/vanguard",
    featured: false,
    opposite: true,
  },
  {
    body: "Your Progeny (children) are embedded with your qualities and characteristics, so each child can be traced back to its parents.",
    href: "/economics",
    featured: false,
    opposite: true,
  },
  {
    body: "Material items are also Progeny: clothing, armor, weapons, creatures, adversarial constructs, modes of transport, and more.",
    href: "/engine",
    featured: false,
    opposite: false,
  },
  {
    body: "The Engine has a very distinct algorithm that can attribute 479,001,600 possibilities completely unique to you for each Progeny Project.",
    href: "/engine",
    featured: true,
    opposite: false,
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
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const pointerIdleTimer = useRef<number | null>(null);
  const navigationTimer = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const isPointerActive = useRef(false);
  const isExitingPage = useRef(false);
  const [dayOneRemaining, setDayOneRemaining] = useState<number | null>(null);
  const [mobileHeaderHidden, setMobileHeaderHidden] = useState(true);
  const dayOneCountdown = getCountdownParts(dayOneRemaining);

  useEffect(() => {
    const updateCountdown = () => {
      setDayOneRemaining(Math.max(0, dayOneLaunchAt - Date.now()));
    };

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (pointerIdleTimer.current !== null) {
        window.clearTimeout(pointerIdleTimer.current);
      }

      if (navigationTimer.current !== null) {
        window.clearTimeout(navigationTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isMobile = window.matchMedia("(max-width: 640px)").matches;

      if (!isMobile) {
        setMobileHeaderHidden(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (currentScrollY < 96) {
        setMobileHeaderHidden(true);
      } else if (currentScrollY > lastScrollY.current + 6) {
        setMobileHeaderHidden(true);
      } else if (currentScrollY < lastScrollY.current - 12) {
        setMobileHeaderHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  function playVideoSegment(startAt: number) {
    const video = heroVideoRef.current;

    if (!video) return;

    video.currentTime = startAt;
    void video.play().catch(() => {
      video.pause();
    });
  }

  function handlePointerMove() {
    if (isExitingPage.current) return;

    isPointerActive.current = true;

    const video = heroVideoRef.current;

    if (video) {
      if (video.currentTime >= heroLoopEnd || video.currentTime < 0) {
        video.currentTime = 0;
      }

      void video.play().catch(() => {
        video.pause();
      });
    }

    if (pointerIdleTimer.current !== null) {
      window.clearTimeout(pointerIdleTimer.current);
    }

    pointerIdleTimer.current = window.setTimeout(() => {
      isPointerActive.current = false;
      heroVideoRef.current?.pause();
    }, heroPointerIdleMs);
  }

  function handleVideoTimeUpdate() {
    const video = heroVideoRef.current;

    if (!video) return;

    if (isExitingPage.current) {
      return;
    }

    if (video.currentTime >= heroLoopEnd) {
      video.currentTime = 0;

      if (isPointerActive.current) {
        void video.play().catch(() => {
          video.pause();
        });
      } else {
        video.pause();
      }
    }
  }

  function handlePageLinkClick(event: MouseEvent<HTMLElement>) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const anchor = (event.target as Element | null)?.closest("a");

    if (!anchor) return;

    const href = anchor.getAttribute("href");
    const target = anchor.getAttribute("target");

    if (!href || target === "_blank" || href.startsWith("#")) return;

    const destination = new URL(href, window.location.href);

    if (destination.origin !== window.location.origin) return;
    if (destination.pathname === window.location.pathname && destination.search === window.location.search) return;

    event.preventDefault();
    isExitingPage.current = true;

    if (pointerIdleTimer.current !== null) {
      window.clearTimeout(pointerIdleTimer.current);
    }

    playVideoSegment(heroLinkExitStartAt);

    if (navigationTimer.current !== null) {
      window.clearTimeout(navigationTimer.current);
    }

    navigationTimer.current = window.setTimeout(() => {
      window.location.assign(`${destination.pathname}${destination.search}${destination.hash}`);
    }, heroLinkExitPlaySeconds * 1000);
  }

  return (
    <main
      className="home-control-page relative isolate min-h-screen overflow-hidden bg-black text-white"
      onClickCapture={handlePageLinkClick}
      onPointerMove={handlePointerMove}
    >
      <header
        className={`fixed left-0 right-0 top-0 z-40 border-b border-cyan-200/15 bg-black/85 shadow-[0_18px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl transition duration-700 ease-out max-sm:will-change-transform ${
          mobileHeaderHidden
            ? "max-sm:-translate-y-full max-sm:opacity-0"
            : "max-sm:translate-y-0 max-sm:opacity-100"
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-3 md:px-8">
          <Link
            aria-current="page"
            className="home-brand-link flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100 sm:min-h-0"
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
                className="chamfer-nav-link max-sm:!h-11 max-sm:!min-h-11 max-sm:!w-[5.65rem] max-sm:!text-[0.7rem]"
                href={href}
                key={href}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <section className="home-hero-section relative z-10 mx-auto grid min-h-[68vh] max-w-7xl items-start gap-6 overflow-hidden px-5 pb-6 pt-40 md:px-8 md:pb-8 md:pt-28 lg:grid-cols-[minmax(0,1fr)_minmax(110px,0.18fr)_minmax(140px,0.24fr)_minmax(170px,0.32fr)_minmax(210px,0.4fr)]">
        <video
          muted
          onTimeUpdate={handleVideoTimeUpdate}
          playsInline
          preload="auto"
          ref={heroVideoRef}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-100"
          src="/media/command-console.mp4"
        />
        <div className="pointer-events-none absolute inset-0 z-0 bg-black/35" />
        <div className="relative z-10">
          <div className="chamfer-panel chamfer-panel--hero-copy max-w-[22.5rem] px-5 py-5 md:px-7 md:py-6">
            <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-cyan-200/80">
              Registry Initializing
            </p>
            <h1 className="max-w-4xl text-2xl font-light uppercase leading-[1.08] tracking-[0.1em] md:text-4xl">
              Sovereign Engine
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/68">
              <GlossaryText
                terms={homeGlossaryTerms}
                text="One person, one Genesis mint. No bot farms, no prize harvesting, no empty wallets pretending to be a community."
              />
            </p>
          </div>

          <div className="home-hero-controls mt-8 grid w-full max-w-[22.5rem] gap-3 sm:w-fit sm:gap-4">
            <div className="home-hero-control-row grid grid-cols-2 gap-2.5 sm:grid-cols-[10.5rem_10.5rem] sm:gap-3">
              <Link
                href="/portal"
                className="chamfer-hero-link chamfer-hero-link--primary max-sm:!h-14 max-sm:!max-w-none max-sm:!min-w-0 max-sm:!px-2 max-sm:!text-[0.68rem]"
              >
                Enter Portal
              </Link>
              <Link
                href="/engine"
                className="chamfer-hero-link chamfer-hero-link--secondary chamfer-hero-link--opposite max-sm:!h-14 max-sm:!max-w-none max-sm:!min-w-0 max-sm:!px-2 max-sm:!text-[0.68rem]"
              >
                Artifact Engine
              </Link>
            </div>
            <div className="home-hero-control-row grid grid-cols-2 gap-2.5 sm:grid-cols-[10.5rem_10.5rem] sm:gap-3">
              <Link
                aria-label="Open Access page for Day 1 countdown details"
                className="chamfer-countdown-label-link max-sm:!h-14 max-sm:!max-w-none max-sm:!min-w-0 max-sm:!px-2"
                href="/economics"
              >
                <div className="text-[9px] uppercase leading-4 tracking-[0.18em] text-yellow-200/80">
                  Day 1 Countdown
                </div>
                <div className="mt-1 text-[8px] uppercase tracking-[0.12em] text-cyan-100/62">
                  29 May 2026 / 12:00 UTC
                </div>
              </Link>
              <Link
                aria-label="Open Access page for Day 1 countdown timer"
                className="chamfer-countdown-link max-sm:!h-14 max-sm:!max-w-none max-sm:!min-w-0 max-sm:!p-2"
                href="/economics"
              >
                <div className="grid grid-cols-4 gap-1">
                  {dayOneCountdown.map(([value, label]) => (
                    <div
                      className="chamfer-countdown-cell px-1 py-1.5 text-center backdrop-blur-sm"
                      key={label}
                    >
                      <div className="font-mono text-base leading-none text-yellow-100">
                        {value}
                      </div>
                      <div className="mt-1 text-[7px] uppercase tracking-[0.08em] text-white/62">
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

      <section className="home-lower-clickables relative z-10 mx-auto max-w-7xl px-5 pb-12 pt-5 md:px-8 md:pt-7">
        <div className="grid gap-4 md:grid-cols-3">
          {protocolCards.map((card) => (
            <Link
              key={card.title}
              className="chamfer-panel chamfer-panel--card chamfer-panel--interactive block p-5"
              href={card.href}
            >
              <div className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/60">
                {card.label}
              </div>
              <h2 className="mt-4 text-xl uppercase tracking-[0.14em] text-white">
                {card.title}
              </h2>
              <p className="mt-3 text-base leading-7 text-white/55">{card.body}</p>
              <div className="mt-4 text-[11px] uppercase tracking-[0.24em] text-cyan-200/55">
                Open {card.destination}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-lower-clickables relative z-10 mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <div className="chamfer-panel chamfer-panel--frame p-6 backdrop-blur-md md:p-8">
          <p className="text-center text-xs uppercase tracking-[0.36em] text-cyan-200/70">
            THE REASONING
          </p>
          <div className="chamfer-panel chamfer-panel--readout chamfer-panel--all-corners mx-auto mt-5 max-w-2xl px-5 py-4 text-center text-sm leading-6 text-white/62">
            <GlossaryText
              terms={homeGlossaryTerms}
              text="Developers can choose which Progeny structure they want for their games, request a specific Character Attribute Tree for users to generate a profile from, or purchase from a Vanguard's Collection. Each creation is unique to the user's original stats."
            />
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {whyThisMatters.map((item) => (
              <Link
                className={`chamfer-panel chamfer-panel--readout chamfer-panel--interactive block px-4 py-3 text-base leading-7 text-white/68 ${item.opposite ? "chamfer-panel--opposite-corners" : ""} ${item.featured ? "md:col-span-2 md:mx-auto md:max-w-2xl" : ""}`}
                href={item.href}
                key={item.body}
              >
                {item.body}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-cyan-100/10 px-5 pb-10 pt-6 text-center text-xs uppercase tracking-[0.24em] text-cyan-100/35 md:flex-row md:px-8 md:text-left">
        <span>Sovereign Engine // Builder access</span>
        <Link href="/developer" className="chamfer-nav-link">
          Developer
        </Link>
      </footer>
    </main>
  );
}
