"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { AnimatedFrame } from "@/components/command/AnimatedFrame";
import { GlossaryText } from "@/components/GlossaryTerm";
import type { GlossaryTermKey } from "@/lib/glossary";
import type {
  CommandPanelCopy,
  CommandShellPanel,
} from "@/components/command/types";

type CommandConsoleScreenProps = {
  activePanel: CommandShellPanel;
  drawerTabSlot: ReactNode;
  glossaryTerms: GlossaryTermKey[];
  renderPanelBackdrop?: (panel: CommandShellPanel) => ReactNode;
};

export function CommandConsoleScreen({
  activePanel,
  drawerTabSlot,
  glossaryTerms,
  renderPanelBackdrop,
}: CommandConsoleScreenProps) {
  const activePanelBody = Array.isArray(activePanel.body)
    ? activePanel.body
    : [activePanel.body];
  const [primaryPanelBody, ...secondaryPanelBody] = activePanelBody;
  const activePanelTitleWords = activePanel.title.split(/\s+/).filter(Boolean);
  const configuredPanelVisual = activePanel.visual ? (
    <figure
      className={`command-room__panel-visual-card command-room__panel-visual-card--${
        activePanel.visual.mode ?? "square"
      }`}
    >
      <Image
        alt={activePanel.visual.alt}
        className="command-room__panel-visual-image"
        height={activePanel.visual.height}
        priority={activePanel.visual.priority ?? false}
        sizes="(max-width: 767px) 42vw, 22vw"
        src={activePanel.visual.src}
        width={activePanel.visual.width}
      />
      {activePanel.visual.caption ? (
        <figcaption>{activePanel.visual.caption}</figcaption>
      ) : null}
    </figure>
  ) : null;
  const customPanelVisual = renderPanelBackdrop?.(activePanel);
  const panelVisual = customPanelVisual ?? configuredPanelVisual;
  const panelVisualIsImage = customPanelVisual == null && Boolean(activePanel.visual);
  const renderGlossaryText = (text: string) =>
    glossaryTerms.length > 0 ? (
      <GlossaryText terms={glossaryTerms} text={text} />
    ) : (
      text
    );
  const renderCopyCard = (copy: CommandPanelCopy, index: number) => {
    const cardLabel =
      typeof copy === "string"
        ? index === 0
          ? "Readout"
          : "Context"
        : copy.label ?? (index === 0 ? "Readout" : "Context");

    return (
      <section
        className={`command-room__panel-copy-card ${
          index === 0 ? "command-room__panel-copy-card--primary" : ""
        } ${typeof copy === "string" ? "" : "command-room__panel-copy-card--list"}`}
        key={`${activePanel.id}-${index}`}
      >
        <span>{cardLabel}</span>
        {typeof copy === "string" ? (
          <p>{renderGlossaryText(copy)}</p>
        ) : (
          <ul className="command-room__panel-copy-list">
            {copy.items.map((item) => (
              <li key={`${activePanel.id}-${cardLabel}-${item}`}>
                {renderGlossaryText(item)}
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  };
  const renderSecondaryCopyStack = () =>
    secondaryPanelBody.length > 0 ? (
      <div className="command-room__panel-copy-stack text-sm leading-7 text-cyan-50/72 md:text-base">
        {secondaryPanelBody.map((paragraph, index) =>
          renderCopyCard(paragraph, index + 1),
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

        <div className="command-room__viewport-content command-room__viewport-content--fullscreen relative z-10 grid content-start gap-6 p-5 md:p-8">
          <div
            className="command-room__active-panel"
            data-panel-id={activePanel.id}
            key={activePanel.id}
          >
            <div
              className={`command-room__panel-header ${
                panelVisual ? "command-room__panel-header--with-visual" : ""
              }`}
            >
              {panelVisual ? (
                <div className="command-room__panel-copy-column">
                  {primaryPanelBody ? renderCopyCard(primaryPanelBody, 0) : null}
                  {renderSecondaryCopyStack()}
                </div>
              ) : primaryPanelBody ? (
                renderCopyCard(primaryPanelBody, 0)
              ) : null}
              {panelVisual ? (
                <div
                  className={`command-room__panel-visual-slot ${
                    panelVisualIsImage
                      ? "command-room__panel-visual-slot--image"
                      : ""
                  }`}
                >
                  {panelVisual}
                </div>
              ) : null}
              <div className="command-room__panel-title-card">
                <h1
                  aria-label={activePanel.title}
                  className="command-lab__headline uppercase text-cyan-50"
                >
                  {activePanelTitleWords.map((word, index) => (
                    <span
                      aria-hidden="true"
                      className="command-lab__headline-word"
                      key={`${activePanel.id}-title-${word}-${index}`}
                    >
                      {word}
                    </span>
                  ))}
                </h1>
                <p className="command-room__active-value text-sm uppercase tracking-[0.24em] text-yellow-100/78">
                  {activePanel.value}
                </p>
              </div>
            </div>
            {!panelVisual ? renderSecondaryCopyStack() : null}
          </div>
        </div>
      </AnimatedFrame>
    </div>
  );
}
