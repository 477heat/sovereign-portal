import type { Metadata } from "next";
import Link from "next/link";
import TunnelBackdrop from "@/components/TunnelBackdrop";

export const metadata: Metadata = {
  title: "Coinbase Entry | Sovereign Engine",
  description:
    "A Base-native entry point for the Sovereign Engine Genesis Soul Deed mint path.",
};

const entrySteps = [
  {
    label: "01",
    title: "Arrive From Base",
    body: "This page orients Coinbase/Base visitors before they enter the live Sovereign Portal.",
  },
  {
    label: "02",
    title: "Enter The Portal",
    body: "The Portal handles wallet connection, Coinbase EAS eligibility, checkout, and mint status.",
  },
  {
    label: "03",
    title: "Mint On Base",
    body: "Eligible users can create the Genesis Soul Deed: a Base-native deed artifact and first access path for Sovereign Engine.",
  },
];

const guardrails = [
  "Genesis mint requires a Coinbase Verified Account attestation on Base.",
  "The Soul Deed is the live Genesis artifact and access path.",
  "Future Progeny, items, creatures, and transport systems are roadmap directions until published.",
];

export default function CoinbaseEntryPage() {
  return (
    <main className="info-control-page relative isolate min-h-screen overflow-x-hidden bg-black px-5 py-6 font-mono text-white md:px-10 md:py-10">
      <TunnelBackdrop layer="page" variant="diffused" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <nav className="mb-8 flex flex-col gap-3 border-b border-cyan-200/10 pb-5 text-[0.62rem] uppercase tracking-[0.22em] text-cyan-50/70 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="chamfer-nav-link chamfer-nav-link--compact">
            Home
          </Link>
          <div>Coinbase // Base Entry</div>
        </nav>

        <header className="chamfer-panel chamfer-panel--command mb-8 px-6 py-7 md:px-10 md:py-9">
          <div className="mb-5 flex flex-wrap items-center gap-3 text-[0.62rem] uppercase tracking-[0.22em] text-yellow-100/80">
            <span>Base-native</span>
            <span className="h-px w-10 bg-cyan-100/20" />
            <span>Coinbase EAS eligible</span>
            <span className="h-px w-10 bg-cyan-100/20" />
            <span>Genesis artifact</span>
          </div>

          <div className="grid gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-end">
            <div>
              <p className="mb-3 text-[0.68rem] uppercase tracking-[0.32em] text-cyan-100/55">
                Sovereign Engine
              </p>
              <h1 className="max-w-3xl text-3xl font-semibold uppercase leading-none tracking-normal text-cyan-50 md:text-5xl">
                Your Origin, Your Creation, Your Artifact.
              </h1>
              <p className="mt-5 max-w-2xl text-sm font-semibold uppercase leading-6 tracking-[0.18em] text-yellow-100/82 md:text-base">
                Deterministic, Unique, Identifiably Yours.
              </p>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-cyan-50/72 md:text-base">
              Your first Artifact is more than a mint. It is the Engine&apos;s
              record of your origin, your humanity, and the future paths
              attached to you. Early supporters can claim before Day One begins
              Monday, June 1, 2026.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="chamfer-hero-link chamfer-hero-link--primary max-sm:!h-14 max-sm:!max-w-none max-sm:!min-w-0"
            >
              Enter SovEngine
            </Link>
            <Link
              href="/whitepaper"
              className="chamfer-hero-link chamfer-hero-link--secondary chamfer-hero-link--opposite max-sm:!h-14 max-sm:!max-w-none max-sm:!min-w-0"
            >
              Litepaper
            </Link>
          </div>
        </header>

        <section className="mb-9 grid gap-4 md:grid-cols-3">
          {entrySteps.map((step) => (
            <div
              key={step.label}
              className="chamfer-panel chamfer-panel--small p-5"
            >
              <div className="text-[0.62rem] uppercase tracking-[0.22em] text-yellow-100/80">
                {step.label}
              </div>
              <h2 className="mt-3 text-lg font-semibold uppercase tracking-normal text-cyan-50">
                {step.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-cyan-50/66">
                {step.body}
              </p>
            </div>
          ))}
        </section>

        <section className="chamfer-panel chamfer-panel--wide mb-9 px-6 py-7 md:px-9 md:py-8">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="mb-2 text-[0.62rem] uppercase tracking-[0.26em] text-cyan-100/50">
                What This Page Does
              </p>
              <h2 className="text-xl font-semibold uppercase text-cyan-50 md:text-2xl">
                A Front Door, Not A New Mint Pipeline
              </h2>
            </div>
            <div className="space-y-4 text-sm leading-6 text-cyan-50/70 md:text-base">
              <p>
                Coinbase/Base users should understand the product before they
                connect a wallet. This route keeps the explanation clean while
                the existing Portal remains responsible for the live mint flow.
              </p>
              <p>
                The Soul Deed is the first Genesis Character and access artifact
                for Sovereign Engine. Future Engine branches can be discussed as
                roadmap direction, but the live action today is the Genesis Soul
                Deed path.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="chamfer-panel chamfer-panel--policy px-6 py-6 md:px-8">
            <p className="mb-2 text-[0.62rem] uppercase tracking-[0.26em] text-yellow-100/70">
              Eligibility
            </p>
            <h2 className="text-lg font-semibold uppercase tracking-normal text-cyan-50 md:text-xl">
              Coinbase EAS Gate
            </h2>
            <p className="mt-4 text-sm leading-6 text-cyan-50/68 md:text-base">
              The Portal checks for a Coinbase Verified Account attestation on
              Base. If the connected wallet is not showing the attestation yet,
              the Portal should guide the user without treating that failure as
              a judgment about the person.
            </p>
          </div>

          <div className="chamfer-panel chamfer-panel--policy px-6 py-6 md:px-8">
            <p className="mb-2 text-[0.62rem] uppercase tracking-[0.26em] text-yellow-100/70">
              Boundaries
            </p>
            <h2 className="text-lg font-semibold uppercase tracking-normal text-cyan-50 md:text-xl">
              What Is Live Today
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-cyan-50/68 md:text-base">
              {guardrails.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="chamfer-panel chamfer-panel--wide mb-12 px-6 py-7 text-center md:px-9 md:py-8">
          <p className="mx-auto max-w-2xl text-sm leading-6 text-cyan-50/70 md:text-base">
            Continue to the Sovereign Engine front page to see what is built,
            what is coming, and how the first Artifact opens Access and future
            Progeny paths.
          </p>
          <Link
            href="/"
            className="chamfer-hero-link chamfer-hero-link--primary mx-auto mt-6 max-sm:!h-14 max-sm:!max-w-none max-sm:!min-w-0"
          >
            Enter SovEngine
          </Link>
        </section>

        <footer className="border-t border-cyan-100/10 pt-6 text-center text-[0.62rem] uppercase tracking-[0.28em] text-cyan-100/35">
          Sovereign Engine // Coinbase/Base routed entry
        </footer>
      </div>
    </main>
  );
}
