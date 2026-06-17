"use client";

import { useSyncExternalStore } from "react";

const COMMAND_TITLE_TAB_USED_KEY = "sovereign-command-title-tab-used";
const COMMAND_TITLE_TAB_USED_EVENT = "sovereign-command-title-tab-used-change";

type CommandDrawerTabProps = {
  drawerContentId: string;
  drawerLabel: string;
  drawerOpen: boolean;
  embedded?: boolean;
  label?: string;
  onClick: () => void;
  pendingActionId: string | null;
};

function getTitleTabUsedSnapshot() {
  return window.localStorage.getItem(COMMAND_TITLE_TAB_USED_KEY) === "true";
}

function getTitleTabUsedServerSnapshot() {
  return false;
}

function subscribeTitleTabUsed(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(COMMAND_TITLE_TAB_USED_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(COMMAND_TITLE_TAB_USED_EVENT, onStoreChange);
  };
}

export function CommandDrawerTab({
  drawerContentId,
  drawerLabel,
  drawerOpen,
  embedded = false,
  label,
  onClick,
  pendingActionId,
}: CommandDrawerTabProps) {
  const titleTabUsed = useSyncExternalStore(
    subscribeTitleTabUsed,
    getTitleTabUsedSnapshot,
    getTitleTabUsedServerSnapshot,
  );
  const displayLabel = label ?? (drawerOpen ? "Stow" : "Deploy");
  const shouldShowTitleCue = embedded && !drawerOpen && !titleTabUsed;

  function handleClick() {
    if (embedded && !titleTabUsed) {
      window.localStorage.setItem(COMMAND_TITLE_TAB_USED_KEY, "true");
      window.dispatchEvent(new Event(COMMAND_TITLE_TAB_USED_EVENT));
    }

    onClick();
  }

  return (
    <button
      aria-label={
        drawerOpen ? `Command controls open for ${drawerLabel}` : `Open ${drawerLabel}`
      }
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
      data-command-title-attention={shouldShowTitleCue ? "true" : undefined}
      onClick={handleClick}
      disabled={pendingActionId !== null}
      type="button"
    >
      <span className="command-room__drawer-tab-label">{displayLabel}</span>
      {embedded ? (
        <span aria-hidden="true" className="command-room__drawer-tab-chevrons">
          <span />
          <span />
          <span />
        </span>
      ) : null}
    </button>
  );
}
