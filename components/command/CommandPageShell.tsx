"use client";

import type { MouseEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatedFrame } from "@/components/command/AnimatedFrame";
import { AssemblingPanel } from "@/components/command/AssemblingPanel";
import { GlossaryText } from "@/components/GlossaryTerm";
import TunnelBackdrop from "@/components/TunnelBackdrop";
import type { GlossaryTermKey } from "@/lib/glossary";

const DEFAULT_COMMAND_DELAY_MS = 500;

type CommandShellSounds = {
  deploy: string;
  menu: string;
  panel: string;
  primary: string;
  stow: string;
};

const defaultCommandSounds: CommandShellSounds = {
  deploy: "/sounds/deploy.mp3",
  menu: "/sounds/menu_select.mp3",
  panel: "/sounds/button_select.mp3",
  primary: "/sounds/portal_select.mp3",
  stow: "/sounds/stow.mp3",
};

export type CommandPanel = {
  id: string;
  number?: string;
  label: string;
  value: string;
  title: string;
  body: string | string[];
  link?: {
    href: string;
    label: string;
  };
};

export type CommandPanelGroup = {
  label: string;
  eyebrow: string;
  panels: CommandPanel[];
};

export type CommandDrawerAction = {
  href: string;
  label: string;
  variant?: "default" | "opposite" | "primary";
};

export type CommandShellPanel = CommandPanel & {
  groupLabel: string;
  eyebrow: string;
};

type CommandPageShellProps = {
  drawerActions?: CommandDrawerAction[];
  drawerContentId?: string;
  drawerLabel?: string;
  glossaryTerms?: GlossaryTermKey[];
  groups: CommandPanelGroup[];
  initialPanelId?: string;
  interactionDelayMs?: number;
  renderPanelBackdrop?: (panel: CommandShellPanel) => ReactNode;
  showBackdropRings?: boolean;
  sounds?: Partial<CommandShellSounds>;
};

export function CommandPageShell({
  drawerActions = [],
  drawerContentId = "command-drawer",
  drawerLabel = "Command drawer",
  glossaryTerms = [],
  groups,
  initialPanelId,
  interactionDelayMs = DEFAULT_COMMAND_DELAY_MS,
  renderPanelBackdrop,
  showBackdropRings = false,
  sounds,
}: CommandPageShellProps) {
  const router = useRouter();
  const actionTimeoutRef = useRef<number | null>(null);
  const pendingActionRef = useRef(false);
  const panels = useMemo(
    () =>
      groups.flatMap((group) =>
        group.panels.map((panel) => ({
          ...panel,
          groupLabel: group.label,
          eyebrow: group.eyebrow,
        })),
      ),
    [groups],
  );

  const [activePanelId, setActivePanelId] = useState(
    initialPanelId ?? panels[0]?.id ?? "",
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);

  const activePanel =
    panels.find((panel) => panel.id === activePanelId) ?? panels[0];
  const activePanelBody = Array.isArray(activePanel?.body)
    ? activePanel.body
    : [activePanel?.body ?? ""];
  const commandSounds = { ...defaultCommandSounds, ...sounds };

  function playCommandSound(src: string) {
    const audio = new Audio(src);
    audio.volume = 0.78;
    void audio.play().catch(() => undefined);
  }

  function queueCommandAction(
    actionId: string,
    soundSrc: string,
    action: () => void,
  ) {
    if (pendingActionRef.current) {
      return;
    }

    pendingActionRef.current = true;
    setPendingActionId(actionId);
    playCommandSound(soundSrc);

    actionTimeoutRef.current = window.setTimeout(() => {
      action();
      pendingActionRef.current = false;
      setPendingActionId(null);
      actionTimeoutRef.current = null;
    }, interactionDelayMs);
  }

  function shouldUseNativeLinkBehavior(
    event: MouseEvent<HTMLAnchorElement>,
  ) {
    return (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    );
  }

  function handleDrawerActionClick(
    event: MouseEvent<HTMLAnchorElement>,
    action: CommandDrawerAction,
  ) {
    if (shouldUseNativeLinkBehavior(event)) {
      return;
    }

    event.preventDefault();
    queueCommandAction(
      `drawer-action-${action.href}`,
      action.variant === "primary" ? commandSounds.primary : commandSounds.menu,
      () => {
        router.push(action.href);
      },
    );
  }

  function handleDrawerTabClick() {
    const nextDrawerOpen = !drawerOpen;
    queueCommandAction(
      nextDrawerOpen ? "drawer-deploy" : "drawer-stow",
      nextDrawerOpen ? commandSounds.deploy : commandSounds.stow,
      () => {
        setDrawerOpen(nextDrawerOpen);
      },
    );
  }

  function handlePanelSelect(panelId: string) {
    queueCommandAction(`panel-${panelId}`, commandSounds.panel, () => {
      setActivePanelId(panelId);
      setDrawerOpen(false);
    });
  }

  useEffect(() => {
    return () => {
      if (actionTimeoutRef.current) {
        window.clearTimeout(actionTimeoutRef.current);
      }
      pendingActionRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!drawerOpen) {
      return;
    }

    const scrollY = window.scrollY;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyWidth = document.body.style.width;
    const previousHtmlOverscroll =
      document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.documentElement.style.overscrollBehavior = "none";

    return () => {
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.width = previousBodyWidth;
      document.documentElement.style.overscrollBehavior = previousHtmlOverscroll;
      window.scrollTo(0, scrollY);
    };
  }, [drawerOpen]);

  if (!activePanel) {
    return null;
  }

  return (
    <main
      aria-busy={pendingActionId !== null}
      className="info-control-page command-room-page relative isolate min-h-screen overflow-x-hidden bg-black px-4 py-5 font-mono text-white max-sm:!px-2 md:px-8"
      data-command-pending={pendingActionId ?? undefined}
    >
      <TunnelBackdrop
        layer="page"
        variant="diffused"
        rings={showBackdropRings}
      />

      <div className="command-room relative z-10 mx-auto flex min-h-screen max-w-[96rem] flex-col">
        <section className="command-room__grid command-room__grid--drawer grid flex-1 gap-5 py-5">
          <section className="command-room__console-body">
            <div className="command-room__console-screen">
              <AnimatedFrame
                className="command-room__viewport command-room__viewport--fullscreen"
                label={activePanel.groupLabel}
              >
                <div
                  className="engine-screen-grid absolute inset-0 opacity-45"
                  aria-hidden="true"
                />
                <div
                  className="engine-sweep absolute inset-x-0 top-0 h-28"
                  aria-hidden="true"
                />

                <div className="command-room__viewport-content command-room__viewport-content--fullscreen relative z-10 grid content-start gap-8 p-5 md:p-8">
                  <div className="command-room__layer-badge">
                    {activePanel.eyebrow}
                  </div>
                  <div
                    className="command-room__active-panel"
                    data-panel-id={activePanel.id}
                    key={activePanel.id}
                  >
                    {renderPanelBackdrop?.(activePanel)}
                    <h1 className="command-lab__headline mt-3 max-w-3xl text-3xl uppercase leading-tight text-cyan-50 max-sm:!text-[1.75rem] max-sm:!leading-[1.15] md:text-5xl">
                      {activePanel.title}
                    </h1>
                    <p className="command-room__active-value mt-3 text-sm uppercase tracking-[0.24em] text-yellow-100/78">
                      {activePanel.value}
                    </p>
                    <div className="mt-4 grid max-w-3xl gap-3 text-sm leading-7 text-cyan-50/72 md:text-base">
                      {activePanelBody.map((paragraph, index) => (
                        <p key={`${activePanel.id}-${index}`}>
                          {glossaryTerms.length > 0 ? (
                            <GlossaryText
                              terms={glossaryTerms}
                              text={paragraph}
                            />
                          ) : (
                            paragraph
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedFrame>
            </div>

            <div className="command-room__console-dock" aria-hidden="true">
              <div className="command-room__console-dock-cell" />
              <div className="command-room__console-dock-cell" />
              <div className="command-room__console-dock-cell" />
              <div className="command-room__console-dock-cell" />
            </div>
          </section>

          <div
            className={`command-room__drawer-shell ${
              drawerOpen
                ? "command-room__drawer-shell--open"
                : "command-room__drawer-shell--closed"
            }`}
          >
            <button
              aria-label={
                drawerOpen ? `Stow ${drawerLabel}` : `Deploy ${drawerLabel}`
              }
              aria-controls={drawerContentId}
              aria-disabled={pendingActionId !== null}
              aria-expanded={drawerOpen}
              className="command-room__drawer-tab"
              data-command-action="drawer-tab"
              data-command-action-pending={
                pendingActionId?.startsWith("drawer-") ? "true" : undefined
              }
              onClick={handleDrawerTabClick}
              disabled={pendingActionId !== null}
              type="button"
            >
              {drawerOpen ? "Stow" : "Deploy"}
            </button>

            <AssemblingPanel
              className="command-room__drawer border border-cyan-200/15 bg-black/50 p-4"
              delay="medium"
            >
              <div className="command-room__drawer-content" id={drawerContentId}>
                <div className="command-room__drawer-groups">
                  {groups.map((group) => (
                    <section
                      className="command-room__drawer-group"
                      key={group.label}
                    >
                      <div className="command-room__drawer-label">
                        {group.label}
                      </div>
                      <div className="command-room__drawer-button-grid">
                        {group.panels.map((panel, index) => (
                          <button
                            aria-disabled={pendingActionId !== null}
                            aria-pressed={activePanelId === panel.id}
                            className={`chamfer-hero-link command-room__drawer-button ${
                              index % 2 === 1
                                ? "chamfer-hero-link--opposite"
                                : ""
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
                            onClick={() => handlePanelSelect(panel.id)}
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
                          onClick={(event) =>
                            handleDrawerActionClick(event, action)
                          }
                        >
                          {action.label}
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </AssemblingPanel>
          </div>
        </section>
      </div>
    </main>
  );
}
