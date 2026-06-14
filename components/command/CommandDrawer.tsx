"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { AssemblingPanel } from "@/components/command/AssemblingPanel";
import type {
  CommandDrawerAction,
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
                  {action.label}
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
