"use client";

type CommandDrawerTabProps = {
  drawerContentId: string;
  drawerLabel: string;
  drawerOpen: boolean;
  embedded?: boolean;
  label?: string;
  onClick: () => void;
  pendingActionId: string | null;
};

export function CommandDrawerTab({
  drawerContentId,
  drawerLabel,
  drawerOpen,
  embedded = false,
  label,
  onClick,
  pendingActionId,
}: CommandDrawerTabProps) {
  const displayLabel = label ?? (drawerOpen ? "Stow" : "Deploy");
  const displayLabelWords = displayLabel.split(/\s+/).filter(Boolean);
  const shouldShowTitleCue = embedded && !drawerOpen;

  function handleClick() {
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
      <span
        className="command-room__drawer-tab-label"
        data-word-count={displayLabelWords.length}
      >
        {displayLabelWords.map((word) => (
          <span className="command-room__drawer-tab-label-word" key={word}>
            {word}
          </span>
        ))}
      </span>
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
