import Image from "next/image";
import Link from "next/link";
import TunnelBackdrop from "@/components/TunnelBackdrop";

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
              alt="Blank Certificate of Title contract display"
              className="block aspect-square w-full object-cover"
              height={2048}
              priority
              src="/media/soul-contract-blank.png"
              width={2048}
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
              <span>Title 0000</span>
              <span>The Architect</span>
            </div>
            <p className="mt-6 text-sm leading-6 text-white/58">
              Archive view of the blank certificate frame used for Soul ownership
              titles before personal inscription and final wallet delivery.
            </p>
            <p className="mt-4 text-sm leading-6 text-white/58">
              Each title is marked with a short public signature, then sent
              directly to the wallet. No extra identifying details are printed
              on the artifact.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em]">
              <a
                className="chamfer-nav-link chamfer-nav-link--compact"
                href="https://ipfs.io/ipfs/QmQeCXtBJyTyvypYQEFo24woEP3q1kEgBq9ebvC8eCHSk4"
                rel="noopener noreferrer"
                target="_blank"
              >
                Metadata IPFS
              </a>
              <a
                className="chamfer-nav-link chamfer-nav-link--compact"
                href="https://opensea.io/item/base/0x8453b77c845c913d8ca3d1a265ba17fc6aa5ea65/0"
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
