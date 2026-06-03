"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GlossaryText } from "@/components/GlossaryTerm";
import type { GlossaryTermKey } from "@/lib/glossary";

const dayOneLaunchAt = Date.UTC(2026, 5, 5, 23, 0, 0);
const homeGlossaryTerms: GlossaryTermKey[] = [
  "Access Token",
  "Actual Supply",
  "Artifact Engine",
  "Attribute Tree",
  "Attributes",
  "Coinbase EAS",
  "DOB",
  "EAS",
  "Genesis",
  "Genesis Mint",
  "Mint",
  "Progeny",
  "Progeny Projects",
  "Soul",
  "Soul Mint",
  "Title of Ownership",
  "Vanguard",
  "Wallet",
];

const protocolCards = [
  {
    label: "Checklist",
    title: "Pre-Flight Check",
    body: "Any early support is welcome while we continue to iron out the website and other details. Read the litepaper for more info.",
    href: "/vanguard",
    destination: "Vanguard status",
  },
  {
    label: "Base-native",
    title: "Genesis Artifact",
    body: "If you're human, you have a Soul. The Genesis Artifact is an Access Token. Mint your Title of Ownership directly into your possession.",
    href: "/portal",
    destination: "Soul Registry Portal",
  },
  {
    label: "Coinbase EAS",
    title: "1 Soul, 1 Mint",
    body: "We use Coinbase EAS to help confirm each participant is a verified human. Once a Genesis mint is claimed, the contract blocks a second one, helping make this community unusually focused on real people.",
    href: "/economics",
    destination: "Access and Progeny",
  },
];

const navLinks = [
  ["Portal", "/portal"],
  ["Engine", "/engine"],
  ["Vanguard", "/vanguard"],
  ["Access", "/economics"],
  ["Litepaper", "/whitepaper"],
] as const;

const mobileNavLinks = [["Home", "/"], ...navLinks] as const;

const whyThisMatters = [
  {
    body: "Your Title of Ownership carries attributes that affect each Progeny project. The contract uses heavy legal language to discourage resale while preserving each user's autonomy.",
    featured: false,
    opposite: false,
  },
  {
    body: "Vanguard is an access title granted to initial holders of this Access Token, carrying rights and recognition under that title.",
    featured: false,
    opposite: true,
  },
  {
    body: "Progeny Projects are individual mints, including characters, creatures, items, weapons, and more, imbued with attributes that correlate to your initial Genesis Mint.",
    featured: false,
    opposite: true,
  },
  {
    body: "Material items are also Progeny: clothing, armor, weapons, creatures, adversarial constructs, modes of transport, and more.",
    featured: false,
    opposite: false,
  },
  {
    body: "Developers choose which attribute structure they want for their games, request a specific Character Attribute Tree for users to generate a profile from, or have their users purchase from a Vanguard's Collection. Each creation is unique to the user's original stats.",
    featured: false,
    opposite: false,
  },
  {
    body: "For developers, one verified mint per project creates Actual Supply. Players cannot reroll until they get an overpowered build; each user works with their own attributes, giving games controlled variety without rewarding exploit-driven play.",
    featured: false,
    opposite: false,
  },
] as const;

function getCountdownParts(milliseconds: number | null) {
  if (milliseconds === null) {
    return [
      ["--", "D"],
      ["--", "H"],
      ["--", "M"],
      ["--", "S"],
    ] as const;
  }

  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    [String(days).padStart(2, "0"), "D"],
    [String(hours).padStart(2, "0"), "H"],
    [String(minutes).padStart(2, "0"), "M"],
    [String(seconds).padStart(2, "0"), "S"],
  ] as const;
}

export default function HomePage() {
  const lastScrollY = useRef(0);
  const [dayOneRemaining, setDayOneRemaining] = useState<number | null>(null);
  const [mobileHeaderHidden, setMobileHeaderHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isMobile = window.matchMedia("(max-width: 640px)").matches;

      if (!isMobile) {
        setMobileHeaderHidden(false);
        setMobileMenuOpen(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (currentScrollY < 24) {
        setMobileHeaderHidden(false);
      } else {
        setMobileHeaderHidden(true);
        setMobileMenuOpen(false);
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

  return (
    <main className="home-control-page relative isolate min-h-screen overflow-hidden bg-black text-white">
      <div aria-hidden="true" className="home-page-fixed-backdrop" />
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
          <button
            aria-controls="mobile-command-drawer"
            aria-expanded={mobileMenuOpen}
            className="chamfer-nav-link chamfer-nav-link--opposite sm:hidden"
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
            type="button"
          >
            Menu
          </button>
          <nav className="hidden flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/72 sm:flex md:gap-3 md:text-sm">
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

      <button
        aria-label="Close mobile navigation"
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 sm:hidden ${
          mobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        type="button"
      />
      <aside
        aria-label="Mobile navigation"
        id="mobile-command-drawer"
        className={`mobile-command-drawer fixed bottom-0 right-0 top-0 z-50 w-[min(19rem,84vw)] border-l border-cyan-200/24 bg-black/92 px-5 py-5 shadow-[-22px_0_70px_rgba(0,0,0,0.62)] backdrop-blur-2xl transition duration-300 sm:hidden ${
          mobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div className="mb-7 flex items-center justify-between gap-3 border-b border-cyan-200/14 pb-4">
          <div className="min-w-0">
            <p className="text-[0.58rem] uppercase tracking-[0.28em] text-cyan-200/58">
              Command Drawer
            </p>
            <p className="mt-1 truncate text-xs font-semibold uppercase tracking-[0.18em] text-cyan-50">
              Sovereign Engine
            </p>
          </div>
          <button
            aria-label="Close menu"
            className="chamfer-nav-link chamfer-nav-link--compact"
            onClick={() => setMobileMenuOpen(false)}
            type="button"
          >
            Close
          </button>
        </div>
        <nav className="grid gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/72">
          {mobileNavLinks.map(([label, href], index) => (
            <Link
              className={`chamfer-nav-link mobile-drawer-link ${
                index % 2 === 0 ? "chamfer-nav-link--opposite" : ""
              }`}
              href={href}
              key={href}
              onClick={() => setMobileMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <section className="home-hero-section relative z-10 mx-auto grid min-h-[68vh] max-w-7xl items-start gap-6 overflow-hidden px-5 pb-6 pt-40 md:px-8 md:pb-9 md:pt-28 lg:grid-cols-[minmax(0,1fr)_minmax(110px,0.18fr)_minmax(140px,0.24fr)_minmax(170px,0.32fr)_minmax(210px,0.4fr)]">
        <div className="home-hero-command-stack relative z-10 lg:col-span-2">
          <div className="chamfer-panel chamfer-panel--hero-copy max-w-[28rem] px-5 py-4 md:w-[35vw] md:max-w-none md:px-7 md:py-3">
            <p className="mb-3 text-[11px] uppercase tracking-[0.32em] text-cyan-200/80 md:mb-1">
              Registry Initializing
            </p>
            <h1 className="max-w-4xl text-2xl font-light uppercase leading-[1.08] tracking-[0.1em] md:text-4xl">
              Sovereign Engine
            </h1>
            <p className="mt-5 max-w-[24rem] text-lg leading-7 text-white/68 md:mt-3 md:max-w-[46rem] md:text-base md:leading-6">
              <GlossaryText
                terms={homeGlossaryTerms}
                text="One person, one Genesis mint. No bot farms, no prize harvesting, no empty wallets pretending to be a community."
              />
            </p>
          </div>

          <div className="home-hero-controls mt-5 grid w-full max-w-[22.5rem] gap-3 sm:w-fit sm:gap-4">
            <div className="home-hero-control-row grid grid-cols-2 gap-2.5 sm:grid-cols-[10.5rem_10.5rem] sm:gap-3">
              <Link
                href="/portal"
                className="chamfer-hero-link chamfer-hero-link--primary home-hero-mobile-button max-sm:!max-w-none max-sm:!min-w-0 max-sm:!px-2 max-sm:!text-[0.68rem]"
              >
                Mint Path
              </Link>
              <Link
                href="/engine"
                className="chamfer-hero-link chamfer-hero-link--secondary chamfer-hero-link--opposite home-hero-mobile-button max-sm:!max-w-none max-sm:!min-w-0 max-sm:!px-2 max-sm:!text-[0.68rem]"
              >
                Engine Room
              </Link>
            </div>
            <div className="home-hero-control-row grid grid-cols-2 gap-2.5 sm:grid-cols-[10.5rem_10.5rem] sm:gap-3">
              <Link
                aria-label="Open Access page for Launch Day countdown details"
                className="chamfer-countdown-label-link home-hero-mobile-button max-sm:!max-w-none max-sm:!min-w-0 max-sm:!px-2"
                href="/economics"
              >
                <div className="home-countdown-title text-[0.68rem] uppercase leading-4 tracking-[0.16em] text-neutral-950">
                  Launch Day
                </div>
                <div className="home-countdown-date mt-1 text-[0.58rem] uppercase tracking-[0.08em] text-neutral-900/85">
                  05 Jun 2026 / 23:00 UTC
                </div>
              </Link>
              <Link
                aria-label="Open Access page for Launch Day countdown timer"
                className="chamfer-countdown-link home-hero-mobile-button max-sm:!max-w-none max-sm:!min-w-0 max-sm:!p-2"
                href="/economics"
              >
                <div className="grid grid-cols-4 gap-1">
                  {dayOneCountdown.map(([value, label]) => (
                    <div
                      className="chamfer-countdown-cell px-1 py-1.5 text-center backdrop-blur-sm"
                      key={label}
                    >
                      <div className="home-countdown-value font-mono text-sm leading-none text-yellow-100">
                        {value}
                      </div>
                      <div className="home-countdown-unit mt-1 text-[0.42rem] uppercase tracking-[0.06em] text-cyan-50/80">
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

      <section className="home-lower-clickables home-protocol-section relative z-10 mx-auto max-w-7xl px-5 pb-12 pt-3 md:px-8 md:pt-6">
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
              <p className="mt-3 text-base leading-7 text-white/55">
                <GlossaryText terms={homeGlossaryTerms} text={card.body} />
              </p>
              <div className="mt-4 text-[11px] uppercase tracking-[0.24em] text-cyan-200/55">
                Open {card.destination}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-lower-clickables relative z-10 mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <div className="chamfer-panel chamfer-panel--frame home-reasoning-frame p-6 md:p-8">
          <p className="text-center text-xs uppercase tracking-[0.36em] text-cyan-200/70">
            THE REASONING
          </p>
          <div className="chamfer-panel chamfer-panel--readout chamfer-panel--all-corners mx-auto mt-5 max-w-2xl px-5 py-4 text-center text-base leading-7 text-white/68 md:text-lg md:leading-8">
            <GlossaryText
              terms={homeGlossaryTerms}
              text="We use your DOB to determine 1 of 60 Chinese and 1 of 24 Western astrological signs, which are fused to establish your unique attribute origin. 12 initial attributes are embedded in your Soul Mint and direct every future Progeny branch. EAS ensures a single verified mint only."
            />
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {whyThisMatters.map((item) => (
              <div
                className={`chamfer-panel chamfer-panel--readout block px-4 py-3 text-base leading-7 text-white/68 ${item.opposite ? "chamfer-panel--opposite-corners" : ""} ${item.featured ? "md:col-span-2 md:mx-auto md:max-w-2xl" : ""}`}
                key={item.body}
              >
                <GlossaryText terms={homeGlossaryTerms} text={item.body} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto flex max-w-7xl items-start justify-start gap-4 px-5 pb-6 md:gap-6 md:px-8">
        <Link
          aria-label="Open Archive page for the Architect artifact"
          className="home-deed-preview chamfer-panel chamfer-panel--all-corners block w-1/2 p-1.5 md:w-1/4"
          href="/archive"
        >
          <Image
            alt="T. Bre Soul Deed artifact display"
            className="block aspect-square w-full object-cover"
            height={1960}
            src="/media/t-bre-soul-deed.jpg"
            width={1960}
          />
        </Link>
        <div className="home-architect-artifact chamfer-panel chamfer-panel--readout chamfer-panel--all-corners w-[calc(50%-1rem)] px-4 py-3 md:w-fit md:px-5 md:py-4">
          <h2 className="text-xs uppercase leading-5 tracking-[0.14em] text-white md:text-sm md:leading-6">
            Title 0000
            <span className="block">The Architect</span>
          </h2>
          <p className="mt-4 text-xs leading-5 text-white/58 md:text-sm md:leading-6">
            View the Archive for details.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em]">
            <Link
              className="chamfer-nav-link chamfer-nav-link--compact"
              href="/archive"
            >
              Archive
            </Link>
            <a
              className="chamfer-nav-link chamfer-nav-link--compact"
              href="https://ipfs.io/ipfs/QmQeCXtBJyTyvypYQEFo24woEP3q1kEgBq9ebvC8eCHSk4"
              rel="noopener noreferrer"
              target="_blank"
            >
              Metadata IPFS
            </a>
          </div>
        </div>
      </section>

      <footer className="home-footer relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-cyan-100/10 px-5 pb-10 pt-6 text-center text-xs uppercase tracking-[0.24em] text-cyan-100/35 md:flex-row md:px-8 md:text-left">
        <span>Sovereign Engine // Builder access</span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Link href="/dictionary" className="chamfer-nav-link">
            Dictionary
          </Link>
          <Link href="/developer" className="chamfer-nav-link">
            Developers
          </Link>
          <Link href="/archive" className="chamfer-nav-link">
            Archive
          </Link>
          <Link href="/privacy-policy" className="chamfer-nav-link">
            Privacy
          </Link>
          <a
            className="chamfer-nav-link"
            href="https://discord.com/channels/1510790887125291138/1510791200234406040"
            rel="noopener noreferrer"
            target="_blank"
          >
            Contact
          </a>
        </div>
      </footer>
    </main>
  );
}
