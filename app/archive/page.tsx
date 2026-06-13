import Image from "next/image";
import Link from "next/link";
import TunnelBackdrop from "@/components/TunnelBackdrop";

const architectTokenMetadataUrl =
  "https://ipfs.io/ipfs/QmT4TMS6rvcqCJidEveQFe6jr62Pg1h2E7157xEtsJi4o4";
const architectTokenImageUrl =
  "https://ipfs.io/ipfs/QmYGQiWLkK9CFDPsHEbhpLpT4tU4MxX6VAR7bYAMKKrj2z";
const architectOpenSeaUrl =
  "https://opensea.io/item/base/0x2df9151c4e32082a05c686bd3092180134d17deb/0";

export default function ArchivePage() {
  return (
    <main className="info-control-page relative isolate min-h-screen overflow-x-hidden bg-black text-white">
      <TunnelBackdrop layer="page" variant="diffused" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 md:px-8">
        <nav className="control-surface flex flex-wrap items-center justify-between gap-4 border-b border-cyan-200/15 bg-black/80 px-4 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl md:text-sm">
          <Link href="/" className="chamfer-nav-link chamfer-nav-link--compact">
            Return Home
          </Link>
          <span className="text-[11px] tracking-[0.28em] text-cyan-100/72">
            Archive // Certificate Display
          </span>
        </nav>

        <section className="grid flex-1 items-start gap-6 py-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.55fr)]">
          <div className="chamfer-panel chamfer-panel--all-corners archive-contract-frame p-2 md:p-3">
            <Image
              alt="Certificate of Title for Spiritual Ownership Genesis Access card for T. Bre"
              className="block aspect-[5/7] w-full bg-black object-contain"
              height={1960}
              priority
              src="/media/t-bre-soul-deed.jpg"
              width={1429}
            />
          </div>

          <aside className="chamfer-panel chamfer-panel--readout chamfer-panel--all-corners archive-detail-panel px-5 py-5 md:px-6 md:py-6">
            <p className="text-[10px] uppercase tracking-[0.32em] text-cyan-200/65">
              Archive Record
            </p>
            <h1 className="mt-4 text-2xl font-light uppercase leading-tight tracking-[0.14em] text-white md:text-4xl">
              Certificate of Title
            </h1>
            <div className="mt-5 grid gap-2 text-sm uppercase tracking-[0.2em] text-white/68">
              <span>Spiritual Ownership</span>
              <span>T. Bre // Token 0000</span>
              <span>Genesis Access</span>
            </div>
            <p className="mt-6 text-sm leading-6 text-white/58">
              Archive view of the current Architect Soul Deed minted on the
              live SLDD contract.
            </p>
            <p className="mt-4 text-sm leading-6 text-white/58">
              The public card shows the visible title marker. The current token
              metadata carries the Genesis Access traits, contract terms link,
              and image URI.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em]">
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
              <a
                className="chamfer-nav-link chamfer-nav-link--compact"
                href={architectOpenSeaUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                OpenSea
              </a>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
