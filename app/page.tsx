"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GlossaryText } from "@/components/GlossaryTerm";
import type { GlossaryTermKey } from "@/lib/glossary";

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
  "TAC",
  "Tokenized Asset Creation",
  "Vanguard",
  "Verified Human Soul",
  "Wallet",
];

const protocolCards = [
  {
    label: "Pre-Launch",
    title: "TAC System",
    body: "Sovereign Portal is a Tokenized Asset Creation (TAC) system. It lets a verified user create a tokenized Genesis source profile, then Sovereign Engine turns that source into stable Soul Attributes and character stats.",
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
    body: "Anyone can explore Engine-style outputs, but Genesis Access is the verified TAC origin path. The Soul Deed marks one wallet-linked source profile so future characters, items, creatures, and Progeny can build from a single authenticated starting point.",
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
    eyebrow: "SOVEREIGN FORGE | Beta Live",
    title: ". . B e t a - L i v e ! . . .",
    body: (
      <>
        The site is in beta, but the Forge is live. Current metadata is correct
        for beta mints, and future imagery or display attributes can be updated
        automatically for anyone who mints during beta. Final TAC imagery will
        be locked after beta testing and community feedback. I am a solo
        developer, an American from Hawaii currently building out of Utah, and I
        appreciate every early supporter helping this Engine come online.
      </>
    ),
  },
  {
    eyebrow: "SOVEREIGN ENGINE | Tokenized Asset Creation",
    title: ". . ( T A C ) . . .",
    body: (
      <>
        Tokenized Asset Creation. Sovereign Engine is a Tokenized Asset Creation
        system first, then a character generator. The Forge lets a verified user
        create a tokenized Genesis source profile, and the Engine uses that
        source to create characters, items, creatures, and future Progeny tied
        to the user&apos;s wallet, origin record, and fixed attribute profile.
      </>
    ),
  },
  {
    eyebrow: "SOVEREIGN ENGINE | Node Functioning Token Signatures",
    title: ". . ( N F T S ) . . .",
    body: (
      <>
        Node Functioning Token Signatures. Non-Fungible Tokens are not enough by
        themselves. Sovereign Engine uses Node Functioning Token Signatures as
        identity markers, not just assets, so your individual creations can
        function as recognizable assets tied to you and imbued with unique
        qualities through the Engine system.
      </>
    ),
  },
  {
    eyebrow: "SOVEREIGN ENGINE | Access Passport",
    title: ". . A C C E S S . . .",
    body: (
      <>
        Forget signing in with Google or the old Web2 version of inclusion.
        NFTS like the Soul Deed act as your passport to Tokenized Asset
        Creation. Users keep their creations, and the first NFTS is gated by
        Proof of Humanhood through Coinbase so markets are not flooded by random
        supply created on a whim.
      </>
    ),
  },
  {
    eyebrow: "SOVEREIGN ENGINE | Built for Game Worlds",
    title: "Built for Game Worlds",
    body: (
      <>
        Each creation is a unique character, creature, or item based on user
        attributes determined during the initial NFTS mint. Those attributes
        cannot be changed or altered, but they can be used to create new
        characters with useful strengths, allowing for a market where uniqueness
        matters more than mass-produced randomness.
      </>
    ),
  },
] as const;

export default function HomePage() {
  const lastScrollY = useRef(0);
  const mobileHeaderRevealTimer = useRef<number | null>(null);
  const [contractNoticeOpen, setContractNoticeOpen] = useState(false);
  const [heroSlideExpanded, setHeroSlideExpanded] = useState(false);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [heroSlideManuallyPaused, setHeroSlideManuallyPaused] = useState(false);
  const [mobileHeaderHidden, setMobileHeaderHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
                aria-label="Open Vanguard page for Tokenized Asset Creation"
                className="chamfer-countdown-label-link home-hero-mobile-button max-sm:!max-w-none max-sm:!min-w-0 max-sm:!p-2"
                href="/vanguard"
              >
                <div className="home-countdown-title text-[0.8rem] uppercase leading-4 tracking-[0.26em] text-neutral-950">
                  TAC
                </div>
                <div className="home-countdown-date mt-1 text-[0.5rem] uppercase tracking-[0.1em] text-neutral-900/85">
                  Tokenized Asset Creation
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
              Read the ceremonial gag wording attached to the Soul Deed TAC
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
