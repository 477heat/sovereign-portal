"use client";

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
  return (
    <div className="command-room__console-dock">
      <div className="command-room__console-dock-cell" />
      <div className="command-room__console-dock-cell" />
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
