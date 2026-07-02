import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import TunnelBackdrop from "@/components/TunnelBackdrop";
import { createSeoMetadata, seoPages } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata(seoPages.archive);

const architectTokenMetadataUrl =
  "https://ipfs.io/ipfs/QmSoRCMUXLS9w5dBgfg3VsnxSQhfBJt3RLALyo8DB3DzH2";
const architectTokenImageUrl =
  "https://gateway.pinata.cloud/ipfs/QmVfRQWBT4Xk2MdQ7xHYaArutxLKdpPqTGXmULDPC342o6";
const architectOpenSeaUrl =
  "https://opensea.io/item/base/0x2df9151c4e32082a05c686bd3092180134d17deb/0";
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
              height={8064}
              priority
              src={architectTokenImageUrl}
              width={5881}
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

            <div className="archive-attribute-card chamfer-panel chamfer-panel--readout chamfer-panel--all-corners mt-6 px-3 py-3 md:px-5 md:py-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[0.52rem] uppercase leading-none tracking-[0.22em] text-cyan-100/55 md:text-[0.64rem]">
                    Token 0000
                  </p>
                  <h2 className="mt-1 text-[0.72rem] uppercase leading-tight tracking-[0.14em] text-white md:text-sm">
                    T. Bre
                  </h2>
                </div>
                <span className="text-[0.5rem] uppercase tracking-[0.16em] text-yellow-100/75 md:text-[0.62rem]">
                  Genesis
                </span>
              </div>

              <dl className="mt-3 grid gap-1 text-[0.52rem] uppercase leading-tight tracking-[0.08em] md:text-[0.64rem]">
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

              <dl className="mt-3 grid grid-cols-1 gap-0.5 text-[0.5rem] uppercase leading-tight tracking-[0.06em] text-white/64 sm:grid-cols-2 sm:gap-x-3 md:text-[0.6rem]">
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
