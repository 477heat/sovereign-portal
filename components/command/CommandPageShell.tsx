"use client";

import type { MouseEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CommandConsoleDock } from "@/components/command/CommandConsoleDock";
import { CommandConsoleScreen } from "@/components/command/CommandConsoleScreen";
import { CommandDrawer } from "@/components/command/CommandDrawer";
import { CommandDrawerTab } from "@/components/command/CommandDrawerTab";
import type {
  CommandDrawerAction,
  CommandPageShellProps,
  CommandShellSounds,
} from "@/components/command/types";

export type {
  CommandDrawerAction,
  CommandPanel,
  CommandPanelGroup,
  CommandShellPanel,
} from "@/components/command/types";

const DEFAULT_COMMAND_DELAY_MS = 500;

const defaultCommandSounds: CommandShellSounds = {
  deploy: "/sounds/deploy.mp3",
  menu: "/sounds/menu_select.mp3",
  panel: "/sounds/button_select.mp3",
  primary: "/sounds/portal_select.mp3",
  stow: "/sounds/stow.mp3",
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
  const [soundMuted, setSoundMuted] = useState(false);

  const activePanel =
    panels.find((panel) => panel.id === activePanelId) ?? panels[0];
  const activePanelIndex = Math.max(
    0,
    panels.findIndex((panel) => panel.id === activePanel?.id),
  );
  const commandSounds = { ...defaultCommandSounds, ...sounds };

  function playCommandSound(src: string) {
    if (soundMuted) {
      return;
    }

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

  function handlePanelCycle(direction: "next" | "previous") {
    if (panels.length < 2) {
      return;
    }

    const nextIndex =
      direction === "next"
        ? (activePanelIndex + 1) % panels.length
        : (activePanelIndex - 1 + panels.length) % panels.length;
    const nextPanel = panels[nextIndex];

    queueCommandAction(`panel-cycle-${direction}`, commandSounds.panel, () => {
      setActivePanelId(nextPanel.id);
    });
  }

  function handleSoundToggle() {
    setSoundMuted((current) => !current);
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

  const renderDrawerTab = (embedded = false) => (
    <CommandDrawerTab
      drawerContentId={drawerContentId}
      drawerLabel={drawerLabel}
      drawerOpen={drawerOpen}
      embedded={embedded}
      onClick={handleDrawerTabClick}
      pendingActionId={pendingActionId}
    />
  );

  return (
    <main
      aria-busy={pendingActionId !== null}
      className="info-control-page command-room-page relative isolate min-h-screen overflow-x-hidden bg-black px-4 py-5 font-mono text-white max-sm:!px-2 md:px-8"
      data-command-pending={pendingActionId ?? undefined}
    >
      <div className="command-room relative z-10 mx-auto flex min-h-screen max-w-[96rem] flex-col">
        <section className="command-room__grid command-room__grid--drawer grid flex-1 gap-5 py-5">
          <section className="command-room__console-body">
            <CommandConsoleScreen
              activePanel={activePanel}
              drawerTabSlot={
                !drawerOpen ? (
                  <div className="command-room__embedded-drawer-tab">
                    {renderDrawerTab(true)}
                  </div>
                ) : null
              }
              glossaryTerms={glossaryTerms}
              renderPanelBackdrop={renderPanelBackdrop}
            />

            <CommandConsoleDock
              onCycle={handlePanelCycle}
              panelCount={panels.length}
              pendingActionId={pendingActionId}
            />
          </section>

          <div
            className={`command-room__drawer-shell ${
              drawerOpen
                ? "command-room__drawer-shell--open"
                : "command-room__drawer-shell--closed"
            }`}
          >
            {drawerOpen ? renderDrawerTab() : null}

            <CommandDrawer
              activePanelId={activePanelId}
              drawerActions={drawerActions}
              drawerContentId={drawerContentId}
              groups={groups}
              onActionClick={handleDrawerActionClick}
              onPanelSelect={handlePanelSelect}
              onSoundToggle={handleSoundToggle}
              pendingActionId={pendingActionId}
              soundMuted={soundMuted}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
