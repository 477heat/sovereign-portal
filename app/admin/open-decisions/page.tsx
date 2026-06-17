"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

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

const ANSWER_STORAGE_KEY = "sovereign-portal-open-decisions-answers";
const DECISION_STORAGE_KEY = "sovereign-portal-open-decisions-questions";

const baseDecisions: Decision[] = [
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

function sanitizeDecisions(raw: unknown): Decision[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }

      const candidate = entry as {
        id?: unknown;
        title?: unknown;
        question?: unknown;
      };

      if (
        typeof candidate.id !== "string" ||
        typeof candidate.title !== "string" ||
        typeof candidate.question !== "string"
      ) {
        return null;
      }

      return {
        id: candidate.id,
        title: candidate.title,
        question: candidate.question,
      };
    })
    .filter((entry): entry is Decision => entry !== null);
}

function loadStoredDecisions(): Decision[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(DECISION_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return sanitizeDecisions(parsed);
  } catch {
    return [];
  }
}

function mergeDecisions(): Decision[] {
  const saved = loadStoredDecisions();
  const baseIds = new Set(baseDecisions.map((item) => item.id));
  const custom = saved.filter((item) => !baseIds.has(item.id));
  return [...baseDecisions, ...custom];
}

function persistDecisions(next: Decision[]) {
  if (typeof window === "undefined") {
    return;
  }

  const baseIds = new Set(baseDecisions.map((item) => item.id));
  const customOnly = next.filter((item) => !baseIds.has(item.id));
  window.localStorage.setItem(DECISION_STORAGE_KEY, JSON.stringify(customOnly));
}

function loadStoredAnswers(): StoredAnswers {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(ANSWER_STORAGE_KEY);

  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as StoredAnswers) : {};
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

function buildPmReport(answers: StoredAnswers, activeDecisions: Decision[]) {
  const lines = ["# Open Decisions — Current Answers", "", `Exported: ${nowIso()}`, ""];

  for (const decision of activeDecisions) {
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
  const [decisions, setDecisions] = useState<Decision[]>(() => mergeDecisions());
  const [answers, setAnswers] = useState<StoredAnswers>(() => loadStoredAnswers());
  const [selectedDecisionIndex, setSelectedDecisionIndex] = useState(0);
  const [answerInput, setAnswerInput] = useState(() => {
    const initialAnswers = loadStoredAnswers();
    const firstDecision = mergeDecisions()[0];
    return firstDecision ? initialAnswers[firstDecision.id]?.answer ?? "" : "";
  });
  const [isEditing, setIsEditing] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [pmNoteCopied, setPmNoteCopied] = useState(false);
  const [newDecisionTitle, setNewDecisionTitle] = useState("");
  const [newDecisionQuestion, setNewDecisionQuestion] = useState("");
  const [newDecisionError, setNewDecisionError] = useState("");

  const selectedDecision = decisions[selectedDecisionIndex] ?? decisions[0];
  const selectedAnswer = selectedDecision ? answers[selectedDecision.id] : undefined;

  function persistAnswers(next: StoredAnswers) {
    setAnswers(next);
    window.localStorage.setItem(ANSWER_STORAGE_KEY, JSON.stringify(next));
  }

  function selectDecision(nextIndex: number) {
    const safeIndex = ((nextIndex % decisions.length) + decisions.length) % decisions.length;
    const nextDecision = decisions[safeIndex];

    setSelectedDecisionIndex(safeIndex);
    setAnswerInput(nextDecision ? answers[nextDecision.id]?.answer ?? "" : "");
    setIsEditing(true);
    setStatusMessage("");
  }

  function cycleDecision() {
    selectDecision(selectedDecisionIndex + 1);
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

    persistAnswers(next);
    setIsEditing(false);
    setStatusMessage("Answer saved. This is the current value for this question.");

    window.setTimeout(() => {
      setStatusMessage("");
    }, 3000);
  }

  function handleAddDecision(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = newDecisionTitle.trim();
    const question = newDecisionQuestion.trim();

    if (!title || !question) {
      setNewDecisionError("Both title and question are required.");
      return;
    }

    const newDecision: Decision = {
      id: `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      title,
      question,
    };

    setDecisions((previous) => {
      const nextDecisions = [...previous, newDecision];
      persistDecisions(nextDecisions);
      setSelectedDecisionIndex(nextDecisions.length - 1);
      setAnswerInput("");
      setIsEditing(true);
      setStatusMessage("New question added. Enter the PM answer and press Submit.");
      window.setTimeout(() => {
        setStatusMessage("");
      }, 2600);
      return nextDecisions;
    });

    setNewDecisionTitle("");
    setNewDecisionQuestion("");
    setNewDecisionError("");
  }

  function handleCopyPmReport() {
    const report = buildPmReport(answers, decisions);
    void navigator.clipboard.writeText(report);
    setPmNoteCopied(true);
    setTimeout(() => setPmNoteCopied(false), 2500);
  }

  function handleDownloadPmReport() {
    const content = buildPmReport(answers, decisions);
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs uppercase tracking-[0.28em] text-white/45">
              Decision {Math.min(selectedDecisionIndex + 1, decisions.length)} of {decisions.length}
            </div>
            <button
              className="min-h-11 border border-cyan-200/55 bg-cyan-200/10 px-4 text-xs font-medium uppercase tracking-[0.22em] text-cyan-100 transition hover:bg-cyan-200/20"
              onClick={cycleDecision}
              type="button"
            >
              Cycle decision
            </button>
          </div>

          {selectedDecision && (
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-3 border border-white/10 bg-white/[0.03] p-4">
                <h2 className="text-sm uppercase tracking-[0.18em] text-white/70">Question</h2>
                <p className="text-xs uppercase tracking-[0.22em] text-white/60">{selectedDecision.title}</p>
                <p className="text-base leading-7 text-white/72">{selectedDecision.question}</p>
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
              Current status: {selectedAnswer?.updatedAt ? "saved" : "not answered"}
              {selectedAnswer?.updatedAt
                ? ` (last saved ${formatTimestamp(selectedAnswer.updatedAt)})`
                : ""}
            </p>
            {statusMessage && <p className="mt-2 text-emerald-200">{statusMessage}</p>}
          </div>
        </section>

        <section className="grid gap-4 border border-white/10 bg-black/50 p-5 md:p-6">
          <h2 className="text-sm uppercase tracking-[0.22em] text-white/70">Add new decision</h2>
          <form className="grid gap-4" onSubmit={handleAddDecision}>
            <label className="grid gap-2 text-xs uppercase tracking-[0.18em] text-white/45" htmlFor="new-decision-title">
              New question title
            </label>
            <input
              className="min-h-11 w-full border border-white/15 bg-black/70 px-3 text-sm tracking-normal text-white outline-none transition focus:border-yellow-200/70"
              id="new-decision-title"
              onChange={(event) => setNewDecisionTitle(event.target.value)}
              placeholder="Example: API Integration Priority"
              value={newDecisionTitle}
            />
            <label className="grid gap-2 text-xs uppercase tracking-[0.18em] text-white/45" htmlFor="new-decision-question">
              New question text
            </label>
            <textarea
              className="min-h-[110px] w-full border border-white/15 bg-black/70 p-3 text-sm tracking-normal text-white outline-none transition focus:border-yellow-200/70"
              id="new-decision-question"
              onChange={(event) => setNewDecisionQuestion(event.target.value)}
              placeholder="What is still unresolved?"
              value={newDecisionQuestion}
            />
            {newDecisionError && <p className="text-xs uppercase tracking-[0.18em] text-rose-200">{newDecisionError}</p>}
            <button
              className="min-h-11 border border-cyan-200/55 bg-cyan-200/10 px-4 text-xs font-medium uppercase tracking-[0.22em] text-cyan-100 transition hover:bg-cyan-200/20"
              type="submit"
            >
              Add decision
            </button>
          </form>
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
