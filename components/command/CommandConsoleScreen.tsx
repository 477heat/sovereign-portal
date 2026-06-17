"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { AnimatedFrame } from "@/components/command/AnimatedFrame";
import type {
  CommandPanelCopy,
  CommandShellPanel,
} from "@/components/command/types";

type CommandConsoleScreenProps = {
  activePanel: CommandShellPanel;
  drawerTabSlot: ReactNode;
};

export function CommandConsoleScreen({
  activePanel,
  drawerTabSlot,
}: CommandConsoleScreenProps) {
  const activePanelBody = Array.isArray(activePanel.body)
    ? activePanel.body
    : [activePanel.body];
  const upperReadouts = (
    activePanel.upperReadouts ?? activePanelBody.slice(0, 2)
  ).filter(hasCopyContent);
  const supportReadouts = (
    activePanel.supportReadouts ?? activePanelBody.slice(2, 6)
  ).filter(hasCopyContent);
  const panelGhost = activePanel.ghostAsset ? (
    <div
      aria-hidden="true"
      className={`command-room__panel-ghost command-room__panel-ghost--${
        activePanel.ghostAsset.variant ?? "card"
      }`}
    >
      <Image
        alt=""
        className="command-room__panel-ghost-image"
        fill
        sizes="(max-width: 767px) 70vw, 44vw"
        src={activePanel.ghostAsset.src}
      />
    </div>
  ) : null;
  function hasCopyContent(copy: CommandPanelCopy) {
    if (typeof copy === "string") {
      return copy.trim().length > 0;
    }

    return copy.items.some((item) => item.trim().length > 0);
  }

  const renderCopyCard = (
    copy: CommandPanelCopy,
    index: number,
    variant: "upper" | "support",
  ) => {
    const cardLabel =
      typeof copy === "string"
        ? variant === "upper"
          ? index === 0
            ? "Signal Overview"
            : "Policy"
          : `Readout ${String(index + 1).padStart(2, "0")}`
        : copy.label ?? (index === 0 ? "Readout" : "Context");

    return (
      <section
        className={`command-room__panel-copy-card command-room__panel-copy-card--${variant} ${
          index === 0 && variant === "upper"
            ? "command-room__panel-copy-card--primary"
            : ""
        } ${typeof copy === "string" ? "" : "command-room__panel-copy-card--list"}`}
        key={`${activePanel.id}-${index}`}
      >
        <span>{cardLabel}</span>
        {typeof copy === "string" ? (
          <p>{copy}</p>
        ) : (
          <ul className="command-room__panel-copy-list">
            {copy.items.map((item) => (
              <li key={`${activePanel.id}-${cardLabel}-${item}`}>
                {item}
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  };

  const renderSupportReadouts = () =>
    supportReadouts.length > 0 ? (
      <div
        className={`command-room__readout-quad command-room__readout-quad--count-${supportReadouts.length}`}
      >
        {supportReadouts.map((readout, index) =>
          renderCopyCard(readout, index, "support"),
        )}
      </div>
    ) : null;

  return (
    <div className="command-room__console-screen">
      <AnimatedFrame
        className="command-room__viewport command-room__viewport--fullscreen"
        chromeOverlay={drawerTabSlot}
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
        {panelGhost}

        <div className="command-room__viewport-content command-room__viewport-content--fullscreen relative z-10 grid content-start gap-6 p-5 md:p-8">
          <div
            className="command-room__active-panel"
            data-panel-id={activePanel.id}
            key={activePanel.id}
          >
            {upperReadouts.length > 0 ? (
              <div className="command-room__readout-pair">
                {upperReadouts.map((readout, index) =>
                  renderCopyCard(readout, index, "upper"),
                )}
              </div>
            ) : null}
            {renderSupportReadouts()}
          </div>
        </div>
      </AnimatedFrame>
    </div>
  );
}
