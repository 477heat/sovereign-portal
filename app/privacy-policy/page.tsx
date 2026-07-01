import type { Metadata } from "next";
import Link from "next/link";
import TunnelBackdrop from "@/components/TunnelBackdrop";
import { createSeoMetadata, seoPages } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata(seoPages.privacyPolicy);

const privacyCards = [
  {
    label: "Purpose",
    title: "Why Verification Exists",
    body: "Sovereign Engine is built around one real participant, one account path, and one Genesis mint claim. When Yoti is used, the purpose is to help verify that a participant is a real person and is not creating duplicate accounts to bypass the one-person rule.",
  },
  {
    label: "Yoti",
    title: "How We Use The Result",
    body: "We use Yoti verification only for the account and eligibility decision. In plain English: the result helps us decide whether this person should be allowed through a single account or mint path. We do not use Yoti information to create public artwork, public metadata, marketing profiles, or public character lore.",
  },
  {
    label: "Storage",
    title: "What We Keep Small",
    body: "Our goal is to keep only the minimum information needed to operate the account, verify eligibility, prevent duplicate claims, process orders, and maintain required records. Raw identity details should not be placed in public token metadata, public URLs, or public readouts.",
  },
  {
    label: "Wallets",
    title: "Public Blockchain Limits",
    body: "Wallet addresses, token ownership, token IDs, contract activity, and on-chain mint events are public by nature. We can limit what personal details we publish, but we cannot make public blockchain records private after they are written on-chain.",
  },
];

const policySections = [
  {
    title: "Information You May Provide",
    body: "Depending on the page or feature, you may provide a wallet address, name fields, date of birth, order information, agreement confirmations, or account-verification information. Some of this may be required before a mint or future account action can continue.",
  },
  {
    title: "Yoti Identity Verification",
    body: "If Yoti verification is enabled, Yoti may collect and process identity information according to Yoti's own privacy notices. Sovereign Engine uses the verification outcome for eligibility, duplicate-account prevention, and account safety. We are not trying to turn that information into a public profile.",
  },
  {
    title: "Why One Account Matters",
    body: "The project is designed to favor real people over bot farms, repeat claims, or automated account farming. Verification helps protect a fair launch path, future Progeny eligibility, and the idea that each participant begins from one real origin.",
  },
  {
    title: "How We Avoid Public Exposure",
    body: "Generated artifacts should use public-safe markers, token references, wallet-linked ownership state, derived stats, and approved metadata. Raw personal identity data should stay out of public artifact descriptions and ordinary marketplace metadata.",
  },
  {
    title: "Payments And Orders",
    body: "When checkout is active, payment and order data may be handled by payment providers and backend services so the mint path can confirm whether an order is paid, pending, failed, or ready. Payment providers have their own privacy and data practices.",
  },
  {
    title: "Questions Or Removal Requests",
    body: "If you have a privacy question, contact the project through the public contact link. Some information can be corrected or removed from app systems, but public blockchain transactions cannot be erased by us once they exist on-chain.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="info-control-page relative isolate min-h-screen overflow-x-hidden bg-black px-5 py-6 font-mono text-white md:px-10 md:py-10">
      <TunnelBackdrop layer="page" variant="diffused" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <nav className="mb-8 flex flex-col gap-3 border-b border-cyan-200/10 pb-5 text-[0.62rem] uppercase tracking-[0.22em] text-cyan-50/70 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="chamfer-nav-link chamfer-nav-link--compact">
            Home
          </Link>
          <div>Privacy // Yoti Verification</div>
        </nav>

        <header className="chamfer-panel chamfer-panel--command mb-8 px-6 py-7 md:px-10 md:py-9">
          <p className="text-[0.62rem] uppercase tracking-[0.32em] text-yellow-200/70">
            Privacy Policy
          </p>
          <h1 className="mt-4 max-w-4xl text-3xl font-semibold uppercase leading-tight tracking-normal text-cyan-50 md:text-5xl">
            We Use Verification To Protect One Real Account
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/68">
            Sovereign Engine is designed around a real-person mint path. When
            Yoti is used, it is used to help verify that one person is tied to
            one account path. It is not used to publish private identity details
            inside artifacts, character lore, public metadata, or marketplace
            descriptions.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em]">
            <a
              className="chamfer-nav-link chamfer-nav-link--compact"
              href="https://www.yoti.com/privacy/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Yoti Privacy
            </a>
            <a
              className="chamfer-nav-link chamfer-nav-link--compact"
              href="https://developers.yoti.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Yoti Docs
            </a>
          </div>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-2">
          {privacyCards.map((card) => (
            <article
              className="chamfer-panel chamfer-panel--readout chamfer-panel--all-corners px-5 py-5"
              key={card.title}
            >
              <p className="text-[0.62rem] uppercase tracking-[0.28em] text-yellow-100/72">
                {card.label}
              </p>
              <h2 className="mt-3 text-xl font-semibold uppercase tracking-[0.1em] text-cyan-50">
                {card.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/64">{card.body}</p>
            </article>
          ))}
        </section>

        <section className="space-y-4 pb-12">
          {policySections.map((section) => (
            <article
              className="chamfer-panel chamfer-panel--policy chamfer-panel--all-corners px-6 py-6"
              key={section.title}
            >
              <h2 className="text-base font-semibold uppercase tracking-[0.16em] text-cyan-50">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/62 md:text-base md:leading-8">
                {section.body}
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
