import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const coinbaseBackgroundImage =
  "/coinbase-assets/tall-console-scroll-background.jpg";
const originArtifactImage =
  coinbaseBackgroundImage;

export const metadata: Metadata = {
  title: "Coinbase Entry",
  description:
    "Enter Sovereign Engine from Base: a Genesis Access artifact for real participants and future Progeny creations.",
  alternates: {
    canonical: "/coinbase",
  },
  openGraph: {
    title: "Sovereign Engine | Coinbase/Base Entry",
    description:
      "Enter Sovereign Engine from Base: a Genesis Access artifact for real participants and future Progeny creations.",
    url: "/coinbase",
    images: [
      {
        url: "/coinbase-assets/cover-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "Sovereign Engine Genesis Access preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sovereign Engine | Coinbase/Base Entry",
    description:
      "Enter Sovereign Engine from Base: a Genesis Access artifact for real participants and future Progeny creations.",
    images: ["/coinbase-assets/fallback-1200x630.jpg"],
  },
};

const readinessChips = [
  "Base-native",
  "Coinbase Verified Account check",
  "One Genesis Mint",
];

export default function CoinbaseEntryPage() {
  return (
    <main className="info-control-page relative isolate min-h-screen overflow-hidden bg-black px-5 py-6 font-mono text-white md:px-10 md:py-10">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <Image
          src={coinbaseBackgroundImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(14,165,233,0.12),rgba(0,0,0,0.2)_34%,rgba(0,0,0,0.88)_78%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.4)_42%,rgba(0,0,0,0.72)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(165,243,252,0.075)_1px,transparent_1px)] bg-[length:100%_8px] opacity-30 mix-blend-screen" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl flex-col">
        <nav className="mb-8 flex flex-col gap-3 border-b border-cyan-200/10 pb-5 text-[0.62rem] uppercase tracking-[0.22em] text-cyan-50/70 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="chamfer-nav-link chamfer-nav-link--compact">
            Home
          </Link>
          <div>Base Entry // Sovereign Engine</div>
        </nav>

        <section
          className="coinbase-entry-hero flex min-w-0 flex-1 items-center py-4 md:py-14"
          style={{
            maxWidth: "calc(100vw - 2.5rem)",
            width: "min(100%, calc(100vw - 2.5rem))",
          }}
        >
          <div className="coinbase-entry-visual" aria-hidden="true">
            <Image
              src={originArtifactImage}
              alt=""
              fill
              priority
              sizes="(max-width: 767px) 100vw, 38vw"
              className="object-cover"
            />
            <div className="coinbase-entry-visual-scan" />
          </div>

          <div
            className="chamfer-panel chamfer-panel--command coinbase-entry-copy w-full max-w-full min-w-0 overflow-hidden px-6 py-7 md:px-10 md:py-10"
            style={{
              maxWidth: "calc(100vw - 2.5rem)",
              width: "min(100%, calc(100vw - 2.5rem))",
            }}
          >
            <p className="mb-4 text-[0.68rem] uppercase tracking-[0.32em] text-cyan-100/55">
              Sovereign Engine
            </p>
            <h1 className="max-w-4xl text-3xl font-semibold uppercase leading-none tracking-normal text-cyan-50 max-sm:text-[1.7rem] max-sm:[overflow-wrap:anywhere] md:text-5xl">
              <span className="block">Your Origin,</span>
              <span className="block">Your Creation,</span>
              <span className="block">Your Artifact.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm font-semibold uppercase leading-6 tracking-[0.18em] text-yellow-100/82 max-sm:text-[0.72rem] max-sm:leading-5 max-sm:tracking-[0.12em] max-sm:[overflow-wrap:anywhere] md:text-base">
              Verify your Humanity, Claim you Soul.
            </p>
            <p className="mt-7 max-w-2xl text-sm leading-6 text-cyan-50/72 max-sm:[overflow-wrap:anywhere] md:text-base">
              The future belonged first to AI but it was the arrival of SI that
              destroyed the digital realm. Ther Wealthy used it to shape
              everything: search, commerce, gaming, and visibility; all at
              scale. Real-time optimization made it harder for small sellers,
              creators, and players to compete unless they could pay to stay in
              view. Then Alliant introduced the Engine. A way for humans to
              prove personhood and compete in a fair market. Verify your
              humanity, claim your Soul. Retain your individuality in a
              machine-driven world.
            </p>

            <div className="mt-7 flex max-w-full min-w-0 flex-wrap gap-2">
              {readinessChips.map((chip) => (
                <span
                  key={chip}
                  className="coinbase-entry-chip max-w-full max-sm:w-full max-sm:justify-center max-sm:text-center max-sm:text-[0.55rem] max-sm:tracking-[0.1em] max-sm:[overflow-wrap:anywhere]"
                >
                  {chip}
                </span>
              ))}
            </div>

            <Link
              href="/"
              className="chamfer-hero-link chamfer-hero-link--primary chamfer-hero-link--opposite mt-8 max-sm:!h-14 max-sm:!max-w-none max-sm:!min-w-0"
            >
              Enter SovEngine
            </Link>
          </div>
        </section>

        <footer className="border-t border-cyan-100/10 pt-6 text-center text-[0.62rem] uppercase tracking-[0.28em] text-cyan-100/35">
          Sovereign Engine // Coinbase/Base routed entry
        </footer>
      </div>
    </main>
  );
}
