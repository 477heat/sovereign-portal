import type { Metadata } from "next";
import Link from "next/link";
import TunnelBackdrop from "@/components/TunnelBackdrop";
import { glossary } from "@/lib/glossary";
import { createSeoMetadata, seoPages } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata(seoPages.dictionary);

const glossaryEntries = Object.entries(glossary).sort(([first], [second]) =>
  first.localeCompare(second),
);

export default function DictionaryPage() {
  return (
    <main className="info-control-page relative isolate min-h-screen overflow-x-hidden bg-black px-5 py-6 font-mono text-white md:px-10 md:py-10">
      <TunnelBackdrop layer="page" variant="diffused" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <nav className="mb-8 flex flex-col gap-3 border-b border-cyan-200/10 pb-5 text-[0.62rem] uppercase tracking-[0.22em] text-cyan-50/70 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="chamfer-nav-link chamfer-nav-link--compact">
            Home
          </Link>
          <div>Dictionary // Site Definitions</div>
        </nav>

        <header className="chamfer-panel chamfer-panel--command mb-8 px-6 py-7 md:px-10 md:py-9">
          <p className="text-[0.62rem] uppercase tracking-[0.32em] text-yellow-200/70">
            Shared Language
          </p>
          <h1 className="mt-4 text-3xl font-black uppercase leading-tight tracking-[0.12em] text-cyan-50 md:text-5xl">
            Sovereign Engine Dictionary
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/68">
            These are the plain-language definitions used by the popup
            dictionary across the site. This page keeps them in one place for
            anyone who wants to read before minting, building, or exploring the
            Engine.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {glossaryEntries.map(([term, definition]) => (
            <article
              className="chamfer-panel chamfer-panel--readout chamfer-panel--all-corners px-5 py-4"
              key={term}
            >
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-cyan-50">
                {term}
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/64">
                {definition}
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
