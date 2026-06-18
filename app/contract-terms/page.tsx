import type { Metadata } from "next";
import Link from "next/link";
import {
  contractLanguage,
  contractLanguageVersion,
} from "@/app/portal/contractLanguage";

export const metadata: Metadata = {
  title: "Contract Terms",
  description:
    "Formal Certificate of Title agreement wording for the Sovereign Engine Genesis mint.",
};

export default function ContractTermsPage() {
  return (
    <main className="info-control-page relative isolate min-h-screen overflow-x-hidden bg-black px-5 py-8 text-white md:px-8">
      <div aria-hidden="true" className="info-page-orb" />
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-cyan-100/10 pb-5">
          <Link className="chamfer-nav-link" href="/">
            Home
          </Link>
          <Link className="chamfer-nav-link chamfer-nav-link--opposite" href="/portal">
            Mint Path
          </Link>
        </div>

        <section className="chamfer-panel chamfer-panel--command p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.34em] text-yellow-100/75">
            Formal Agreement
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-light uppercase leading-tight tracking-[0.12em] text-white md:text-5xl">
            Certificate Contract Terms
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-white/68 md:text-lg md:leading-8">
            This is the full agreement wording referenced by the live Portal before
            minting. It is intentionally theatrical, but it also identifies real
            contract mechanics like minting, ownership, transfer, metadata, and
            royalty routing.
          </p>
          <p className="mt-5 inline-flex border border-cyan-100/35 bg-black/45 px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-cyan-100/70">
            Version: {contractLanguageVersion}
          </p>
        </section>

        <section className="mt-8 grid gap-4">
          {contractLanguage.map((paragraph, index) => (
            <article
              className="chamfer-panel chamfer-panel--readout chamfer-panel--all-corners p-5 md:p-6"
              key={`${index}-${paragraph.slice(0, 32)}`}
            >
              <div className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-yellow-100/68">
                {String(index + 1).padStart(2, "0")}
              </div>
              <p className="text-sm leading-7 text-white/72 md:text-base md:leading-8">
                {paragraph}
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
