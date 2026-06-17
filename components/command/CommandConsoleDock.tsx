"use client";

import { usePathname } from "next/navigation";

const PAGE_LABELS_BY_PATH: Record<string, string> = {
  "/": "Home",
  "/vanguard": "Vanguard",
  "/engine": "Engine",
  "/whitepaper": "Whitepaper",
  "/economics": "Economics",
  "/portal": "Portal",
  "/artifact": "Artifact",
  "/developer": "Developer",
  "/transporter": "Transporter",
  "/coinbase": "Coinbase Base Listing",
  "/admin": "Admin",
  "/admin/operations": "Admin Operations",
  "/admin/open-decisions": "Open Decisions",
  "/admin/token-inspector": "Token Inspector",
};

function getCurrentPageLabel(pathname: string): string {
  if (Object.prototype.hasOwnProperty.call(PAGE_LABELS_BY_PATH, pathname)) {
    return PAGE_LABELS_BY_PATH[pathname];
  }

  if (pathname.startsWith("/admin/")) {
    const slug = pathname
      .replace(/^\/admin\//, "")
      .split("/")[0]
      .replace(/-/g, " ");
    const pretty = slug
      ? slug.charAt(0).toUpperCase() + slug.slice(1)
      : "Admin";
    return `Admin ${pretty}`;
  }

  const slug = pathname.replace(/^\//, "").split("/")[0];
  if (!slug) {
    return "Unknown Page";
  }

  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

type CommandConsoleDockProps = {
  onCycle: (direction: "next" | "previous") => void;
  panelCount: number;
  pendingActionId: string | null;
};

export function CommandConsoleDock({
  onCycle,
  panelCount,
  pendingActionId,
}: CommandConsoleDockProps) {
  const pathname = usePathname();
  const currentPageLabel = getCurrentPageLabel(pathname);

  return (
    <div className="command-room__console-dock">
      <svg
        aria-hidden="true"
        className="command-room__console-frame-rails command-room__console-frame-rails--bottom"
        focusable="false"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <defs>
          <clipPath id="command-console-bottom-frame-clip">
            <rect x="0" y="48" width="100" height="52" />
          </clipPath>
        </defs>
        <g clipPath="url(#command-console-bottom-frame-clip)">
          <path
            className="command-room__console-frame-rail command-room__console-frame-rail--outer"
            d="M8 1 H92 L99 8 V92 L92 99 H8 L1 92 V8 Z"
          />
          <path
            className="command-room__console-frame-rail command-room__console-frame-rail--inner"
            d="M14 7 H86 L93 14 V86 L86 93 H14 L7 86 V14 Z"
          />
          <path
            className="command-room__console-frame-corner"
            d="M8 1 H28 M1 8 V28 M72 1 H92 L99 8 V28 M99 72 V92 L92 99 H72 M28 99 H8 L1 92 V72"
          />
        </g>
      </svg>
      <div className="command-room__console-dock-cell command-room__console-dock-module command-room__console-dock-module--current-page">
        <span>Signal</span>
        <strong title={currentPageLabel}>{currentPageLabel}</strong>
      </div>
      <div className="command-room__console-dock-cell command-room__console-dock-module">
        <span>User</span>
        <strong>unknown</strong>
      </div>
      <button
        aria-label="Previous console panel"
        className="command-room__console-dock-cell command-room__console-cycle-button"
        data-command-action="panel-cycle"
        data-command-action-pending={
          pendingActionId === "panel-cycle-previous" ? "true" : undefined
        }
        disabled={pendingActionId !== null || panelCount < 2}
        onClick={() => onCycle("previous")}
        type="button"
      >
        <svg
          aria-hidden="true"
          className="command-room__console-cycle-icon"
          focusable="false"
          viewBox="0 0 24 24"
        >
          <path d="M14.5 5.5 8 12l6.5 6.5" />
        </svg>
      </button>
      <button
        aria-label="Next console panel"
        className="command-room__console-dock-cell command-room__console-cycle-button command-room__console-cycle-button--next"
        data-command-action="panel-cycle"
        data-command-action-pending={
          pendingActionId === "panel-cycle-next" ? "true" : undefined
        }
        disabled={pendingActionId !== null || panelCount < 2}
        onClick={() => onCycle("next")}
        type="button"
      >
        <svg
          aria-hidden="true"
          className="command-room__console-cycle-icon"
          focusable="false"
          viewBox="0 0 24 24"
        >
          <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
        </svg>
      </button>
    </div>
  );
}
