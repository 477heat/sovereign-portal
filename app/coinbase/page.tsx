import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GlossaryText } from "@/components/GlossaryTerm";
import TunnelBackdrop from "@/components/TunnelBackdrop";
import type { GlossaryTermKey } from "@/lib/glossary";

const originArtifactImage =
  "/coinbase-assets/sovereign-engine-origin-artifact-mobile-hero-1080x1920.webp";

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

const coinbaseGlossaryTerms: GlossaryTermKey[] = [
  "AI",
  "Artifact",
  "Base",
  "Base-native",
  "Genesis",
  "Genesis Mint",
  "Progeny",
  "Originality",
  "SI",
  "Sovereign Engine",
  "Soul Mint",
  "Verified Account",
  "Verified Human Soul",
];

export default function CoinbaseEntryPage() {
  return (
    <main className="info-control-page relative isolate min-h-screen overflow-x-hidden bg-black px-5 py-6 font-mono text-white md:px-10 md:py-10">
      <TunnelBackdrop layer="page" variant="diffused" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl flex-col">
        <nav className="mb-8 flex flex-col gap-3 border-b border-cyan-200/10 pb-5 text-[0.62rem] uppercase tracking-[0.22em] text-cyan-50/70 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="chamfer-nav-link chamfer-nav-link--compact">
            Home
          </Link>
          <div>Base Entry // Sovereign Engine</div>
        </nav>

        <section className="coinbase-entry-hero flex flex-1 items-center py-4 md:py-14">
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

          <div className="chamfer-panel chamfer-panel--command coinbase-entry-copy w-full px-6 py-7 md:px-10 md:py-10">
            <p className="mb-4 text-[0.68rem] uppercase tracking-[0.32em] text-cyan-100/55">
              <GlossaryText
                terms={coinbaseGlossaryTerms}
                text="Sovereign Engine"
              />
            </p>
            <h1 className="max-w-4xl text-3xl font-semibold uppercase leading-none tracking-normal text-cyan-50 md:text-5xl">
              Your Origin, Your Creation, Your Artifact.
            </h1>
            <p className="mt-5 max-w-2xl text-sm font-semibold uppercase leading-6 tracking-[0.18em] text-yellow-100/82 md:text-base">
              Deterministic, Unique, Identifiably Yours.
            </p>
            <p className="mt-7 max-w-2xl text-sm leading-6 text-cyan-50/72 md:text-base">
              <GlossaryText
                terms={coinbaseGlossaryTerms}
                text="The future belonged first to AI, then to SI, then to machines that could pass for humans better than humans could. The rich bought them, digital markets absorbed them, and originality became the last scarce resource. The Soul Mint was humanity's answer: a way to certify existence, reveal individuality, and tie everything a person brings into the world to one verified human soul, not a replicated machine."
              />
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {readinessChips.map((chip) => (
                <span
                  key={chip}
                  className="coinbase-entry-chip"
                >
                  <GlossaryText terms={coinbaseGlossaryTerms} text={chip} />
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
