"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GlossaryText } from "@/components/GlossaryTerm";
import type { GlossaryTermKey } from "@/lib/glossary";

const dayOneLaunchAt = Date.UTC(2026, 6, 4, 15, 0, 0);
const architectTokenMetadataUrl =
  "https://ipfs.io/ipfs/QmSoRCMUXLS9w5dBgfg3VsnxSQhfBJt3RLALyo8DB3DzH2";
const architectTokenImageUrl =
  "https://gateway.pinata.cloud/ipfs/QmVfRQWBT4Xk2MdQ7xHYaArutxLKdpPqTGXmULDPC342o6";
const architectTokenTraits = [
  ["*Token Type", "Genesis Access"],
  ["*Mastery Rank", "Magister"],
  ["*Alignment", "Mirrored"],
  ["*Lineage", "Cautious"],
  ["*Ordo Elementa", "(Earth + Earth)"],
] as const;
const architectStatTraits = [
  ["01 Presence", "82"],
  ["02 Wealth", "110"],
  ["03 Fortitude", "108"],
  ["04 Cunning", "83"],
  ["05 Flair", "78"],
  ["06 Vigor", "72"],
  ["07 Kinship", "102"],
  ["08 Potency", "92"],
  ["09 Wisdom", "113"],
  ["10 Prestige", "112"],
  ["11 Influence", "94"],
  ["12 Arcana", "108"],
  ["xStat Total", "1154"],
  ["xKarmic Debt", "55"],
  ["xAge", "46"],
] as const;
const homeGlossaryTerms: GlossaryTermKey[] = [
  "Access Token",
  "Actual Supply",
  "AI",
  "Artifact Engine",
  "Attribute Tree",
  "Attributes",
  "Coinbase EAS",
  "DC",
  "Deterministically Calculated",
  "DOB",
  "EAS",
  "Genesis",
  "Genesis Mint",
  "Mint",
  "Progeny",
  "Progeny Projects",
  "Originality",
  "SI",
  "Soul",
  "Soul Mint",
  "Title of Ownership",
  "TTRPG",
  "UTAC",
  "User Tokenized Asset Creation",
  "Vanguard",
  "Verified Human Soul",
  "Wallet",
];

const protocolCards = [
  {
    label: "Pre-Launch",
    title: "UTAC System",
    body: "Sovereign Portal is a User Tokenized Asset Creation (UTAC) system. It lets a verified user create a tokenized Genesis source profile, then Sovereign Engine turns that source into stable Soul Attributes and character stats.",
    href: "/portal",
    destination: "Forge",
  },
  {
    label: "Base-native",
    title: "Smart Contract Assets",
    body: "Smart contracts can connect each user-created asset to its source wallet and origin record. For TTRPG Dungeon Masters and digital world creators, that helps show a character came from a fixed profile instead of endless rerolls, while letting developers set or raise creation limits to fit the world they are building.",
    href: "/portal",
    destination: "Forge",
  },
  {
    label: "Coinbase EAS",
    title: "1 User, 1 Origin",
    body: "Anyone can explore Engine-style outputs, but Genesis Access is the verified UTAC origin path. The Soul Deed marks one wallet-linked source profile so future characters, items, creatures, and Progeny can build from a single authenticated starting point.",
    href: "/access",
    destination: "Access and Progeny",
  },
];

const navLinks = [
  ["Forge", "/portal"],
  ["Alliant", "/alliant"],
  ["Vanguard", "/vanguard"],
  ["Access", "/access"],
  ["Litepaper", "/whitepaper"],
] as const;

const mobileNavLinks = [["Home", "/"], ...navLinks] as const;

const whyThisMatters = [
  {
    body: "Your Title of Ownership carries the starting attributes future Progeny can read. It does not pretend to solve the internet; it creates a verified origin point the Engine can build from.",
    featured: false,
    opposite: false,
  },
  {
    body: "Vanguard is the Initial Supporter layer: the first human-linked wallets that entered before the Engine branches outward.",
    featured: false,
    opposite: true,
  },
  {
    body: "Progeny Projects are future mints that inherit from that origin: characters, creatures, items, weapons, vehicles, and other project-specific builds.",
    featured: false,
    opposite: true,
  },
  {
    body: "Items do not need to be generic drops. A weapon, creature, transport, or adversary can be generated from the holder's source profile instead of rolled from a public loot table.",
    featured: false,
    opposite: false,
  },
  {
    body: "Developers can choose an Attribute Tree for their game and let the Engine produce consistent player-linked variety without handing every advantage to reroll farms.",
    featured: false,
    opposite: false,
  },
  {
    body: "For developers, one verified Genesis source per participant creates Actual Supply. Players work with their own attributes instead of rerolling endlessly until the numbers surrender.",
    featured: false,
    opposite: false,
  },
] as const;

const heroSlides = [
  {
    eyebrow: "Sovereign Forge / Beta Live",
    title: ". . B e t a - L i v e ! . . .",
    body: (
      <>
        The site is in beta, but the Forge is live. Current metadata is correct
        for beta mints, and future imagery or display attributes can be updated
        automatically for anyone who mints during beta. Final UTAC imagery will
        be locked after beta testing and community feedback. I am a solo
        developer, an American from Hawaii currently building out of Utah, and I
        appreciate every early supporter helping this Engine come online.
      </>
    ),
  },
  {
    eyebrow: "Sovereign Engine / UTAC System",
    title: "UTAC / User Tokenized Asset Creation",
    body: (
      <>
        Sovereign Engine is a User Tokenized Asset Creation (UTAC) system first,
        then a character generator. The Forge lets a verified user create a
        tokenized Genesis source profile, and the Engine uses that source to
        create characters, items, creatures, and future Progeny tied to the
        user&apos;s wallet, origin record, and fixed attribute profile.
      </>
    ),
  },
  {
    eyebrow: "Quantum Tunnel / Game Development",
    title: "Characters Built for Play",
    body: (
      <>
        Characters created by the Engine are being developed for ongoing digital
        and tabletop game projects, including Quantum Tunnel at{" "}
        <a
          className="home-story-transmission__inline-link"
          href="https://alliantstudio.xyz/quantum-tunnel"
          rel="noopener noreferrer"
          target="_blank"
        >
          alliantstudio.xyz/quantum-tunnel
        </a>
        . Engine creations belong to the user and are built for future game-side
        ownership, trading, and sales.
      </>
    ),
  },
  {
    eyebrow: "Sovereign Engine / Game Worlds",
    title: "Built for Game Worlds",
    body: (
      <>
        Sovereign Engine is designed for creators who need characters, items,
        creatures, and future game assets tied to a real source profile instead
        of random drops or endless rerolls.
      </>
    ),
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
  const mobileHeaderRevealTimer = useRef<number | null>(null);
  const [dayOneRemaining, setDayOneRemaining] = useState<number | null>(null);
  const [contractNoticeOpen, setContractNoticeOpen] = useState(false);
  const [heroSlideExpanded, setHeroSlideExpanded] = useState(false);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [heroSlideManuallyPaused, setHeroSlideManuallyPaused] = useState(false);
  const [mobileHeaderHidden, setMobileHeaderHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dayOneCountdown = getCountdownParts(dayOneRemaining);
  const heroSlide = heroSlides[heroSlideIndex];

  useEffect(() => {
    const noticeDismissed = window.sessionStorage.getItem(
      "sovereign-contract-terms-notice-dismissed",
    );

    if (!noticeDismissed) {
      const noticeTimer = window.setTimeout(() => {
        setContractNoticeOpen(true);
      }, 0);

      return () => window.clearTimeout(noticeTimer);
    }

    return undefined;
  }, []);

  const dismissContractNotice = () => {
    window.sessionStorage.setItem(
      "sovereign-contract-terms-notice-dismissed",
      "true",
    );
    setContractNoticeOpen(false);
  };

  const selectHeroSlide = (nextIndex: number) => {
    setHeroSlideIndex(nextIndex);
    setHeroSlideExpanded(false);
    setHeroSlideManuallyPaused(true);
  };

  useEffect(() => {
    const updateCountdown = () => {
      setDayOneRemaining(Math.max(0, dayOneLaunchAt - Date.now()));
    };

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (heroSlideExpanded || heroSlideManuallyPaused) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setHeroSlideIndex((currentIndex) => (currentIndex + 1) % heroSlides.length);
    }, 14000);

    return () => window.clearInterval(interval);
  }, [heroSlideExpanded, heroSlideManuallyPaused]);


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isMobile = window.matchMedia("(max-width: 640px)").matches;

      if (!isMobile) {
        if (mobileHeaderRevealTimer.current) {
          window.clearTimeout(mobileHeaderRevealTimer.current);
          mobileHeaderRevealTimer.current = null;
        }
        setMobileHeaderHidden(false);
        setMobileMenuOpen(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (currentScrollY < 24) {
        if (!mobileHeaderRevealTimer.current) {
          mobileHeaderRevealTimer.current = window.setTimeout(() => {
            setMobileHeaderHidden(false);
            mobileHeaderRevealTimer.current = null;
          }, 1000);
        }
      } else {
        if (mobileHeaderRevealTimer.current) {
          window.clearTimeout(mobileHeaderRevealTimer.current);
          mobileHeaderRevealTimer.current = null;
        }
        setMobileHeaderHidden(true);
        setMobileMenuOpen(false);
      }

      lastScrollY.current = currentScrollY;
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      if (mobileHeaderRevealTimer.current) {
        window.clearTimeout(mobileHeaderRevealTimer.current);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <main className="home-control-page relative isolate min-h-screen overflow-hidden bg-black text-white">
      <div aria-hidden="true" className="home-page-fixed-backdrop">
        <div className="home-tunnel-grid" />
      </div>
      <header
        className={`fixed left-0 right-0 top-0 z-40 border-b border-cyan-200/15 bg-black/85 shadow-[0_18px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl transition duration-700 ease-out max-sm:will-change-transform ${
          mobileHeaderHidden
            ? "max-sm:-translate-y-full max-sm:opacity-0"
            : "max-sm:translate-y-0 max-sm:opacity-100"
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-nowrap items-center justify-between gap-3 px-5 py-3 md:px-8">
          <Link
            aria-current="page"
            className="home-brand-link flex min-w-0 items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100"
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
            <span className="whitespace-nowrap">Sovereign Engine</span>
          </Link>
          <button
            aria-controls="home-command-drawer"
            aria-expanded={mobileMenuOpen}
            className="chamfer-nav-link chamfer-nav-link--opposite ml-auto shrink-0"
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
            type="button"
          >
            Menu
          </button>
        </div>
      </header>

      <button
        aria-label="Close navigation"
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          mobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        type="button"
      />
      <aside
        aria-label="Site navigation"
        id="home-command-drawer"
        className={`mobile-command-drawer fixed bottom-0 right-0 top-0 z-50 w-[min(22rem,88vw)] border-l border-cyan-200/24 bg-black/92 px-5 py-5 shadow-[-22px_0_70px_rgba(0,0,0,0.62)] backdrop-blur-2xl transition duration-300 ${
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

      <section className="home-hero-section relative z-10 mx-auto flex min-h-[74vh] max-w-7xl items-start justify-start overflow-hidden px-5 pb-6 pt-40 md:px-8 md:pb-9 md:pt-28">
        <div className="home-hero-command-stack home-story-hero-stack relative z-10 w-full max-w-[34rem]">
          <div className="home-story-transmission">
            <p className="home-story-transmission__eyebrow">
              {heroSlide.eyebrow}
            </p>
            <h1>{heroSlide.title}</h1>
            <p
              className="home-story-transmission__body"
              data-expanded={heroSlideExpanded ? "true" : "false"}
            >
              {heroSlide.body}
            </p>
            <button
              aria-expanded={heroSlideExpanded}
              className="home-story-transmission__more"
              onClick={() => setHeroSlideExpanded((isExpanded) => !isExpanded)}
              type="button"
            >
              {heroSlideExpanded ? "Less" : "More..."}
            </button>
            <div className="home-story-transmission__meta">
              <span>Sovereign Engine</span>
            </div>
            <div className="home-story-transmission__controls" aria-label="Hero slide controls">
              {heroSlides.map((slide, index) => (
                <button
                  aria-label={`Show hero topic ${index + 1}: ${slide.title}`}
                  aria-pressed={heroSlideIndex === index}
                  className="home-story-transmission__control"
                  data-active={heroSlideIndex === index ? "true" : "false"}
                  key={slide.title}
                  onClick={() => selectHeroSlide(index)}
                  type="button"
                >
                  {String(index + 1).padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>

          <div className="home-hero-controls mt-5 grid w-full max-w-[22.5rem] gap-3 sm:mr-auto sm:w-fit sm:gap-4">
            <div className="home-hero-control-row grid grid-cols-2 gap-2.5 sm:grid-cols-[10.5rem_10.5rem] sm:gap-3">
              <Link
                href="/portal"
                className="chamfer-hero-link chamfer-hero-link--primary home-hero-mobile-button home-hero-mint-link max-sm:!max-w-none max-sm:!min-w-0 max-sm:!px-2"
              >
                <span>$5 Mint</span>
                <small>Early Supporters</small>
              </Link>
              <Link
                href="/alliant"
                className="chamfer-hero-link chamfer-hero-link--secondary chamfer-hero-link--opposite home-hero-mobile-button max-sm:!max-w-none max-sm:!min-w-0 max-sm:!px-2 max-sm:!text-[0.68rem]"
              >
                Game Story
              </Link>
            </div>
            <div className="home-hero-control-row grid grid-cols-2 gap-2.5 sm:grid-cols-[10.5rem_10.5rem] sm:gap-3">
              <Link
                aria-label="Open Forge page for Beta Live countdown timer"
                className="chamfer-countdown-label-link home-hero-mobile-button max-sm:!max-w-none max-sm:!min-w-0 max-sm:!p-2"
                href="/portal"
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
              <Link
                aria-label="Open Forge page for Beta Live details"
                className="chamfer-countdown-link home-hero-mobile-button max-sm:!max-w-none max-sm:!min-w-0 max-sm:!px-2"
                href="/portal"
              >
                <div className="home-countdown-title text-[0.68rem] uppercase leading-4 tracking-[0.16em] text-neutral-950">
                  Beta Live
                </div>
                <div className="home-countdown-date mt-1 text-[0.58rem] uppercase tracking-[0.08em] text-neutral-900/85">
                  04 Jul 2026 / 15:00 UTC
                </div>
              </Link>
            </div>
          </div>
        </div>
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
              text="The Engine starts with fixed human inputs, not rerolls. The first profile uses astrologically based stats more complex than only being an Aries, Capricorn, or any other single sign. Coinbase EAS, or verification of personhood through Coinbase, helps restrict users from creating characters through endless rerolls or duplicate origin attempts."
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
          aria-label="Open Archive page for the Architect Genesis Access artifact"
          className="home-deed-preview chamfer-panel chamfer-panel--all-corners block w-1/2 p-1.5 md:w-1/5"
          href="/archive"
        >
          <Image
            alt="Certificate of Title for Spiritual Ownership Genesis Access card for T. Bre"
            className="block aspect-[5/7] w-full bg-black object-contain"
            height={8064}
            src={architectTokenImageUrl}
            width={5881}
          />
        </Link>
        <div className="home-architect-column w-[calc(50%-1rem)] md:w-[22rem]">
          <div className="home-architect-artifact chamfer-panel chamfer-panel--readout chamfer-panel--all-corners px-3 py-3 md:px-5 md:py-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[0.48rem] uppercase leading-none tracking-[0.22em] text-cyan-100/55 md:text-[0.62rem]">
                  Token 0000
                </p>
                <h2 className="mt-1 text-[0.62rem] uppercase leading-tight tracking-[0.14em] text-white md:text-xs">
                  T. Bre
                </h2>
              </div>
              <span className="text-[0.45rem] uppercase tracking-[0.16em] text-yellow-100/75 md:text-[0.58rem]">
                Genesis
              </span>
            </div>

            <dl className="mt-2 grid gap-1 text-[0.48rem] uppercase leading-tight tracking-[0.08em] md:text-[0.62rem]">
              {architectTokenTraits.map(([label, value]) => (
                <div
                  className="grid grid-cols-[minmax(0,0.68fr)_minmax(0,1fr)] gap-1 border-b border-cyan-100/10 pb-1"
                  key={label}
                >
                  <dt className="truncate text-cyan-100/52">{label}</dt>
                  <dd className="truncate text-white/78">{value}</dd>
                </div>
              ))}
            </dl>

            <dl className="mt-2 grid grid-cols-1 gap-0.5 text-[0.46rem] uppercase leading-tight tracking-[0.06em] text-white/64 md:grid-cols-2 md:gap-x-3 md:text-[0.58rem]">
              {architectStatTraits.map(([label, value]) => (
                <div
                  className="grid grid-cols-[minmax(0,1fr)_3ch] gap-1"
                  key={label}
                >
                  <dt className="truncate text-cyan-100/48">{label}</dt>
                  <dd className="text-right text-yellow-100/78">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="home-architect-actions mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em]">
            <Link
              className="chamfer-nav-link chamfer-nav-link--compact"
              href="/archive"
            >
              Archive
            </Link>
            <a
              className="chamfer-nav-link chamfer-nav-link--compact"
              href={architectTokenMetadataUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Metadata IPFS
            </a>
            <a
              className="chamfer-nav-link chamfer-nav-link--compact"
              href={architectTokenImageUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Image IPFS
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
          <Link href="/contract-terms" className="chamfer-nav-link">
            Terms
          </Link>
          <Link href="/engine" className="chamfer-nav-link">
            Engine
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

      {contractNoticeOpen ? (
        <section
          aria-label="Contract terms notice"
          className="fixed bottom-4 right-4 z-[70] w-[min(31rem,calc(100vw-2rem))] max-sm:inset-x-3 max-sm:bottom-3 max-sm:w-auto"
        >
          <div className="chamfer-panel chamfer-panel--all-corners border border-yellow-100/60 bg-black/90 p-4 shadow-[0_0_44px_rgba(254,240,138,0.22)] backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.32em] text-yellow-100/82">
                  Soul Deed Notice
                </p>
                <h2 className="mt-2 text-lg uppercase tracking-[0.14em] text-white">
                  Soul Deed wording
                </h2>
              </div>
              <button
                aria-label="Dismiss contract terms notice"
                className="chamfer-nav-link chamfer-nav-link--compact"
                onClick={dismissContractNotice}
                type="button"
              >
                Close
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Read the ceremonial gag wording attached to the Soul Deed UTAC
              artifact before entering the mint path. Because the Soul Deed is
              an access token, the wording is meant to discourage selling it,
              though what you do with your tokenized asset is ultimately your
              choice.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                className="chamfer-nav-link"
                href="/contract-terms"
                onClick={dismissContractNotice}
              >
                Read Wording
              </Link>
              <Link className="chamfer-nav-link chamfer-nav-link--opposite" href="/portal">
                Forge
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
