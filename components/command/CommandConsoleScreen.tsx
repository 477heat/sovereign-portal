"use client";

import type { ReactNode } from "react";
import { AnimatedFrame } from "@/components/command/AnimatedFrame";
import { GlossaryText } from "@/components/GlossaryTerm";
import type { GlossaryTermKey } from "@/lib/glossary";
import type { CommandShellPanel } from "@/components/command/types";

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
  const renderCopyCard = (paragraph: string, index: number) => (
    <section
      className={`command-room__panel-copy-card ${
        index === 0 ? "command-room__panel-copy-card--primary" : ""
      }`}
      key={`${activePanel.id}-${index}`}
    >
      <span>{index === 0 ? "Readout" : "Context"}</span>
      <p>
        {glossaryTerms.length > 0 ? (
          <GlossaryText terms={glossaryTerms} text={paragraph} />
        ) : (
          paragraph
        )}
      </p>
    </section>
  );

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
            {renderPanelBackdrop?.(activePanel)}
            <div className="command-room__panel-header">
              {primaryPanelBody ? renderCopyCard(primaryPanelBody, 0) : null}
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
            {secondaryPanelBody.length > 0 ? (
              <div className="command-room__panel-copy-stack text-sm leading-7 text-cyan-50/72 md:text-base">
                {secondaryPanelBody.map((paragraph, index) =>
                  renderCopyCard(paragraph, index + 1),
                )}
              </div>
            ) : null}
          </div>
        </div>
      </AnimatedFrame>
    </div>
  );
}
