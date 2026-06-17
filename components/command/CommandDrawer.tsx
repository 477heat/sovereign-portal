"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { AssemblingPanel } from "@/components/command/AssemblingPanel";
import type {
  CommandDrawerAction,
  CommandPanelIcon,
  CommandPanelGroup,
} from "@/components/command/types";

type CommandDrawerProps = {
  activePanelId: string;
  drawerActions: CommandDrawerAction[];
  drawerContentId: string;
  groups: CommandPanelGroup[];
  onActionClick: (
    event: MouseEvent<HTMLAnchorElement>,
    action: CommandDrawerAction,
  ) => void;
  onPanelSelect: (panelId: string) => void;
  onSoundToggle: () => void;
  pendingActionId: string | null;
  soundMuted: boolean;
};

function CommandDrawerButtonIcon({ icon }: { icon?: CommandPanelIcon }) {
  if (!icon) {
    return null;
  }

  const paths: Record<CommandPanelIcon, string[]> = {
    badge: [
      "M12 3.5 19 6v5.2c0 4.2-2.7 7.7-7 9.3-4.3-1.6-7-5.1-7-9.3V6l7-2.5Z",
      "M9.2 11.4 11.2 13.4 15 9.4",
    ],
    wallet: [
      "M4 7.5h14.5c1 0 1.8.8 1.8 1.8v7.2c0 1-.8 1.8-1.8 1.8H4.8c-1 0-1.8-.8-1.8-1.8V6.8c0-.9.7-1.6 1.6-1.6h12.2",
      "M15.5 12h4.8",
      "M7.5 9.8h4.6",
    ],
    scroll: [
      "M7 4.5h10c1.1 0 2 .9 2 2v11H8.2c-1.2 0-2.2-.9-2.2-2.1V6.7c0-1.2.9-2.2 2.1-2.2Z",
      "M8.2 17.5c0 1.1.9 2 2 2h8.8",
      "M9.4 9h6.2",
      "M9.4 12h5",
    ],
    orbital: [
      "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z",
      "M3.6 12c2.1-2.5 5-3.8 8.4-3.8s6.3 1.3 8.4 3.8",
      "M3.6 12c2.1 2.5 5 3.8 8.4 3.8s6.3-1.3 8.4-3.8",
      "M12 4v16",
    ],
    creature: [
      "M7.3 18.5c.5-2.8 2.2-4.4 4.7-4.4s4.2 1.6 4.7 4.4",
      "M8.4 10.2C8.8 7.2 10 5.5 12 5.5s3.2 1.7 3.6 4.7",
      "M7 7.2 4.8 5.4",
      "M17 7.2l2.2-1.8",
      "M9.5 11.2h.1",
      "M14.4 11.2h.1",
    ],
    network: [
      "M6 7.5h5v5H6v-5Z",
      "M14 4.5h4.5V9H14V4.5Z",
      "M14.5 15h4v4h-4v-4Z",
      "M11 10h3",
      "M16.2 9v6",
    ],
    royalty: [
      "M5 7h5v5H5V7Z",
      "M14 12h5v5h-5v-5Z",
      "M10 9.5c3.8 0 5.2.9 6.5 2.5",
      "M10 12c2 .9 2.9 1.6 4 3",
    ],
  };

  return (
    <svg
      aria-hidden="true"
      className="command-room__drawer-button-icon"
      focusable="false"
      viewBox="0 0 24 24"
    >
      {paths[icon].map((path) => (
        <path d={path} key={path} />
      ))}
    </svg>
  );
}

export function CommandDrawer({
  activePanelId,
  drawerActions,
  drawerContentId,
  groups,
  onActionClick,
  onPanelSelect,
  onSoundToggle,
  pendingActionId,
  soundMuted,
}: CommandDrawerProps) {
  return (
    <AssemblingPanel
      className="command-room__drawer border border-cyan-200/15 bg-black/50 p-4"
      delay="medium"
    >
      <div className="command-room__drawer-content" id={drawerContentId}>
        <div className="command-room__drawer-groups">
          {groups.map((group) => (
            <section className="command-room__drawer-group" key={group.label}>
              <div className="command-room__drawer-label">{group.label}</div>
              <div className="command-room__drawer-button-grid">
                {group.panels.map((panel, index) => (
                  <button
                    aria-disabled={pendingActionId !== null}
                    aria-pressed={activePanelId === panel.id}
                    className={`chamfer-hero-link command-room__drawer-button ${
                      index % 2 === 1 ? "chamfer-hero-link--opposite" : ""
                    } ${
                      activePanelId === panel.id
                        ? "command-room__drawer-button--active"
                        : ""
                    }`}
                    data-command-action="panel"
                    data-command-action-pending={
                      pendingActionId === `panel-${panel.id}`
                        ? "true"
                        : undefined
                    }
                    key={panel.id}
                    onClick={() => onPanelSelect(panel.id)}
                    disabled={pendingActionId !== null}
                    type="button"
                  >
                    <CommandDrawerButtonIcon icon={panel.icon} />
                    <span>{panel.label}</span>
                    <small>{panel.value}</small>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>

        {drawerActions.length > 0 ? (
          <div className="command-room__drawer-actions">
            {drawerActions.map((action) => {
              const actionClassName = [
                "chamfer-nav-link chamfer-nav-link--compact",
                action.variant === "opposite"
                  ? "chamfer-nav-link--opposite"
                  : "",
                action.variant === "primary"
                  ? "command-room__drawer-action--primary"
                  : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <Link
                  className={actionClassName}
                  data-command-action={
                    action.variant === "primary" ? "primary" : "menu"
                  }
                  data-command-action-pending={
                    pendingActionId === `drawer-action-${action.href}`
                      ? "true"
                      : undefined
                  }
                  href={action.href}
                  key={`${action.href}-${action.label}`}
                  onClick={(event) => onActionClick(event, action)}
                >
                  <span className="command-room__drawer-action-label">
                    {action.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="command-room__drawer-action-label-mobile"
                  >
                    {action.label.split(/\s+/)[0]}
                  </span>
                </Link>
              );
            })}
            <div className="command-room__drawer-sound-row">
              <button
                aria-label={
                  soundMuted ? "Unmute command sounds" : "Mute command sounds"
                }
                aria-pressed={soundMuted}
                className="command-room__drawer-sound-toggle"
                data-sound-muted={soundMuted ? "true" : "false"}
                onClick={onSoundToggle}
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className="command-room__drawer-sound-icon"
                  focusable="false"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 9v6h4l5 4V5L8 9H4Z" />
                  {soundMuted ? (
                    <>
                      <path d="M17 9l4 4" />
                      <path d="M21 9l-4 4" />
                    </>
                  ) : (
                    <>
                      <path d="M16.5 8.5c1.2 1.9 1.2 5.1 0 7" />
                      <path d="M19.5 6c2.1 3.2 2.1 8.8 0 12" />
                    </>
                  )}
                </svg>
              </button>
              <div
                aria-hidden="true"
                className="command-room__drawer-sound-slot"
              />
            </div>
          </div>
        ) : null}
      </div>
    </AssemblingPanel>
  );
}
