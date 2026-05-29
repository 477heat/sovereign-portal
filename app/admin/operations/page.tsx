import Link from "next/link";

const operationPanels = [
  {
    label: "Launch State",
    title: "Public Access",
    body: "Use this area to track whether the public experience should invite traffic, stay in review, or remain closed while contract settings are checked.",
  },
  {
    label: "Marketplace",
    title: "Approved Routes",
    body: "Keep approved marketplace notes here so Vanguard royalty-routing language stays aligned with the sale paths the project actually supports.",
  },
  {
    label: "Content",
    title: "Page Readiness",
    body: "Track public-page copy, Litepaper updates, and benefit descriptions before sending users from Coinbase, OpenSea, or partner surfaces.",
  },
  {
    label: "Risk",
    title: "Owner Review",
    body: "Reserve final operational changes for the owner wallet and keep irreversible actions on the contract admin screen.",
  },
];

const checklist = [
  "Confirm admin Basic Auth is configured in production.",
  "Confirm owner wallet before contract writes.",
  "Confirm marketplace route before promising royalty behavior.",
  "Confirm public pages match current launch terms.",
];

export default function AdminOperationsPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-4 py-5 text-white md:px-8 md:py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex flex-wrap gap-4">
            <Link
              className="text-[10px] uppercase tracking-[0.35em] text-white/50 transition hover:text-white"
              href="/"
            >
              Return Home
            </Link>
            <Link
              className="text-[10px] uppercase tracking-[0.35em] text-white/50 transition hover:text-white"
              href="/admin"
            >
              Contract Admin
            </Link>
          </div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-yellow-300/70">
            Admin Operations
          </div>
        </nav>

        <header className="border border-white/10 bg-black/55 p-5 md:p-6">
          <div className="text-xs uppercase tracking-[0.28em] text-white/45">
            Internal Control Page
          </div>
          <h1 className="mt-4 text-3xl font-medium uppercase tracking-[0.12em] text-white md:text-4xl">
            Operations
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-white/62">
            This page is for admin-only launch notes and operational checks. It
            does not write to the mint contract; contract actions stay on the
            owner-wallet admin screen.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {operationPanels.map((panel) => (
            <article
              className="border border-white/10 bg-black/50 p-5"
              key={panel.title}
            >
              <div className="text-[10px] uppercase tracking-[0.28em] text-yellow-200/70">
                {panel.label}
              </div>
              <h2 className="mt-4 text-xl uppercase tracking-[0.14em] text-white">
                {panel.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/58">{panel.body}</p>
            </article>
          ))}
        </section>

        <section className="border border-white/10 bg-black/50 p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-white/42">
                Operator Checklist
              </div>
              <h2 className="mt-4 text-2xl uppercase tracking-[0.12em] text-white">
                Before Public Changes
              </h2>
            </div>
            <Link
              className="min-h-11 border border-yellow-200/55 bg-yellow-200/10 px-4 py-3 text-xs font-medium uppercase tracking-[0.22em] text-yellow-100 transition hover:bg-yellow-200/20"
              href="/admin"
            >
              Open Contract Admin
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {checklist.map((item, index) => (
              <div
                className="grid gap-3 border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/64 sm:grid-cols-[3rem_minmax(0,1fr)]"
                key={item}
              >
                <span className="text-xs uppercase tracking-[0.22em] text-yellow-200/65">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
