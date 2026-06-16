"use client";

type CommandDrawerTabProps = {
  drawerContentId: string;
  drawerLabel: string;
  drawerOpen: boolean;
  embedded?: boolean;
  onClick: () => void;
  pendingActionId: string | null;
};

export function CommandDrawerTab({
  drawerContentId,
  drawerLabel,
  drawerOpen,
  embedded = false,
  onClick,
  pendingActionId,
}: CommandDrawerTabProps) {
  return (
    <button
      aria-label={drawerOpen ? `Stow ${drawerLabel}` : `Deploy ${drawerLabel}`}
      aria-controls={drawerContentId}
      aria-disabled={pendingActionId !== null}
      aria-expanded={drawerOpen}
      className={`command-room__drawer-tab ${
        embedded ? "command-room__drawer-tab--embedded" : ""
      }`}
      data-command-action="drawer-tab"
      data-command-action-pending={
        pendingActionId?.startsWith("drawer-") ? "true" : undefined
      }
      onClick={onClick}
      disabled={pendingActionId !== null}
      type="button"
    >
      <span className="command-room__drawer-tab-label">
        {drawerOpen ? "Stow" : "Deploy"}
      </span>
    </button>
  );
}
