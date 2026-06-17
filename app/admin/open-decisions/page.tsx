"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type Decision = {
  id: string;
  title: string;
  question: string;
};

type SavedAnswer = {
  answer: string;
  updatedAt: string;
};

type StoredAnswers = Record<string, SavedAnswer>;

const STORAGE_KEY = "sovereign-portal-open-decisions-answers";

const decisions: Decision[] = [
  {
    id: "natal-scope",
    title: "Natal Stat Scope",
    question:
      "Does TED approve the draft Natal Stat inputs/caps and first release posture, and which Natal fields are allowed in public metadata?",
  },
  {
    id: "kindred-creature",
    title: "Kindred Creature First Spec",
    question:
      "Is the first Kindred Creature unique per holder or a limited shared archetype, and should it be holder-gated preview before minting?",
  },
  {
    id: "portal-boundary",
    title: "Portal Redesign Boundary",
    question:
      "What exact approval is required before touching /portal payment/mint/API behavior, and what checklist must be complete before production review?",
  },
  {
    id: "command-shell",
    title: "Command Shell Page Expansion",
    question:
      "Which next page should adopt the command shell system first and which asset set is approved for it?",
  },
  {
    id: "social-launch",
    title: "Social Automation & Launch Journal",
    question:
      "Which channels are active first, and what proof should be captured before scheduling or posting?",
  },
  {
    id: "genesis-proof",
    title: "Genesis Mint Proof Before Wider Launch",
    question:
      "Which wallet should run the next controlled proof and what evidence is required before broader launch traffic?",
  },
  {
    id: "developer-access-token",
    title: "Developer Access Token",
    question:
      "Should this token be ERC-721, ERC-1155, soulbound credential, or offchain allowlist, and should it be transferable?",
  },
  {
    id: "approved-marketplace-policy",
    title: "Approved Marketplace Policy",
    question:
      "Which marketplaces are approved, what standards apply, and what warning should users see before selling elsewhere?",
  },
  {
    id: "first-dev-target",
    title: "First Developer Integration Target",
    question:
      "Should first developer integration start with read-only holder/profile APIs, Kindred Creature preview, personal item generation, or partner sandbox access?",
  },
  {
    id: "stale-planning-cleanup",
    title: "Stale Planning Cleanup",
    question:
      "Which planning docs should move to /archive/, and which legacy artifacts should remain because other docs still reference them?",
  },
];

function loadStoredAnswers(): StoredAnswers {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as StoredAnswers;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

function formatTimestamp(value?: string) {
  if (!value) {
    return "Not answered yet";
  }

  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function buildPmReport(answers: StoredAnswers) {
  const lines = ["# Open Decisions — Current Answers", "", `Exported: ${nowIso()}`, ""];

  for (const decision of decisions) {
    const answer = answers[decision.id];
    lines.push(`## ${decision.title}`);
    lines.push(decision.question);
    lines.push(answer ? `- Answer: ${answer.answer}` : "- Answer: (not answered)");
    lines.push(answer ? `- Updated: ${formatTimestamp(answer.updatedAt)}` : "- Updated: (not updated)");
    lines.push("");
  }

  return lines.join("\n");
}

export default function OpenDecisionsPage() {
  const [answers, setAnswers] = useState<StoredAnswers>(() => loadStoredAnswers());
  const [selectedDecisionId, setSelectedDecisionId] = useState(decisions[0]?.id || "");
  const [answerInput, setAnswerInput] = useState(() => {
    const storedAnswers = loadStoredAnswers();
    return storedAnswers[decisions[0]?.id || ""]?.answer ?? "";
  });
  const [isEditing, setIsEditing] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [pmNoteCopied, setPmNoteCopied] = useState(false);

  const selectedDecision = useMemo(
    () => decisions.find((item) => item.id === selectedDecisionId) ?? decisions[0],
    [selectedDecisionId],
  );

  function persist(next: StoredAnswers) {
    setAnswers(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedDecision) {
      return;
    }

    const next: StoredAnswers = {
      ...answers,
      [selectedDecision.id]: {
        answer: answerInput.trim(),
        updatedAt: nowIso(),
      },
    };

    persist(next);
    setIsEditing(false);
    setStatusMessage("Answer saved. This is the current value for this question.");

    window.setTimeout(() => {
      setStatusMessage("");
    }, 3000);
  }

  function handleCopyPmReport() {
    const report = buildPmReport(answers);
    void navigator.clipboard.writeText(report);
    setPmNoteCopied(true);
    setTimeout(() => setPmNoteCopied(false), 2500);
  }

  function handleDownloadPmReport() {
    const content = buildPmReport(answers);
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `open-decisions-${new Date().toISOString()}.md`;
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-5 text-white md:px-8 md:py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-5">
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
              Admin
            </Link>
            <Link
              className="text-[10px] uppercase tracking-[0.35em] text-white/50 transition hover:text-white"
              href="/admin/operations"
            >
              Operations
            </Link>
          </div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-yellow-300/70">
            Open Decisions
          </div>
        </nav>

        <header className="border border-white/10 bg-black/55 p-5 md:p-6">
          <div className="text-xs uppercase tracking-[0.28em] text-white/45">Admin-only decision tracking</div>
          <h1 className="mt-4 text-3xl font-medium uppercase tracking-[0.12em] text-white md:text-4xl">
            Open Decisions
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/62">
            This page stores decision answers locally in your admin browser so the PM can be
            given a clean “current answers” summary whenever needed.
          </p>
        </header>

        <section className="grid gap-5 border border-white/10 bg-black/50 p-5 md:p-6">
          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-[0.28em] text-white/45" htmlFor="decision-select">
              Select decision
            </label>
            <select
              className="min-h-11 w-full border border-white/15 bg-black/70 px-3 text-sm text-white outline-none transition focus:border-yellow-200/70"
              id="decision-select"
              onChange={(event) => {
                const nextId = event.target.value;
                setSelectedDecisionId(nextId);
                setAnswerInput(answers[nextId]?.answer ?? "");
                setIsEditing(false);
                setStatusMessage("");
              }}
              value={selectedDecisionId}
            >
              {decisions.map((item) => (
                <option className="bg-black" key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          {selectedDecision && (
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-3 border border-white/10 bg-white/[0.03] p-4">
                <h2 className="text-sm uppercase tracking-[0.18em] text-white/70">Question</h2>
                <p className="text-sm leading-7 text-white/72">{selectedDecision.question}</p>
              </div>

              <label className="grid gap-2 text-xs uppercase tracking-[0.18em] text-white/45" htmlFor="decision-answer">
                PM answer
              </label>
              <textarea
                className={`min-h-[140px] w-full border p-3 text-sm tracking-normal text-white outline-none transition ${
                  isEditing
                    ? "border-yellow-200/45 bg-black/75"
                    : "border-white/10 bg-black/55"
                }`}
                disabled={!isEditing}
                id="decision-answer"
                onChange={(event) => setAnswerInput(event.target.value)}
                placeholder="Type the current decision summary here..."
                value={answerInput}
              />

              <div className="flex flex-wrap gap-3">
                <button
                  className="min-h-11 border border-cyan-200/55 bg-cyan-200/10 px-4 text-xs font-medium uppercase tracking-[0.22em] text-cyan-100 transition hover:bg-cyan-200/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-white/30"
                  disabled={isEditing}
                  onClick={() => setIsEditing(true)}
                  type="button"
                >
                  Edit
                </button>
                <button
                  className="min-h-11 border border-yellow-200/55 bg-yellow-200/10 px-4 text-xs font-medium uppercase tracking-[0.22em] text-yellow-100 transition hover:bg-yellow-200/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-white/30"
                  disabled={!isEditing}
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          )}

          <div className="text-xs uppercase tracking-[0.22em] text-white/45">
            <p>
              Current status: {answers[selectedDecisionId]?.updatedAt ? "saved" : "not answered"}
              {answers[selectedDecisionId]?.updatedAt
                ? ` (last saved ${formatTimestamp(answers[selectedDecisionId].updatedAt)})`
                : ""}
            </p>
            {statusMessage && <p className="mt-2 text-emerald-200">{statusMessage}</p>}
          </div>
        </section>

        <section className="grid gap-4 border border-white/10 bg-black/50 p-5 md:p-6">
          <h2 className="text-sm uppercase tracking-[0.22em] text-white/70">Current answers for PM</h2>
          <p className="text-sm leading-7 text-white/62">
            Use this as the PM reference. It includes every open decision and the latest answer
            you have entered in this browser.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              className="min-h-11 border border-yellow-200/55 bg-yellow-200/10 px-4 text-xs font-medium uppercase tracking-[0.22em] text-yellow-100 transition hover:bg-yellow-200/20"
              onClick={handleCopyPmReport}
              type="button"
            >
              {pmNoteCopied ? "Copied to clipboard" : "Copy PM summary"}
            </button>
            <button
              className="min-h-11 border border-white/15 bg-white/5 px-4 text-xs font-medium uppercase tracking-[0.22em] text-white/80 transition hover:bg-white/10"
              onClick={handleDownloadPmReport}
              type="button"
            >
              Download PM summary
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
